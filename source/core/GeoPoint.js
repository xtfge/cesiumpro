import CesiumProError from "./CesiumProError.js";
import defaultValue from "./defaultValue.js";
import defined from "./defined.js";
class GeoPoint {
    /**
     * 用经纬度（度）和海拔（米）描述一个点。
     * @param {Number} lon 经度，单位：度
     * @param {Number} lat 经度，单位：度
     * @param {Number} alt 海拔，单位：米
     */
    constructor(lon, lat, alt) {
        if (!defined(lon)) {
            throw new CesiumProError('longitude is required.')
        }
        if (!defined(lat)) {
            throw new CesiumProError('latitude is required.')
        }
        this.lon = lon;
        this.lat = lat;
        this.alt = defaultValue(alt, 0)
    }
    /**
     * 转为屏幕坐标
     * @param {Cesium.Viewer} viewer 
     * @returns {Cesium.Cartesian2} 屏幕坐标
     */
    toPixel(viewer) {
        return GeoPoint.toPixel(this, viewer);
    }
    /**
     * 转为笛卡尔坐标
     * @returns {Cesium.Cartesian3} 笛卡尔坐标
     */
    toCartesian() {
        return GeoPoint.toCartesian(this);
    }
    /**
     * 转为地理坐标
     * @returns {Cesium.Cartographic} 地理坐标
     */
    toCartographic() {
        return GeoPoint.toCartographic(this)
    }
    /**
     * 获得该点的弧度形式
     * @returns 弧度表示的点
     */
    getRadias() {
        return {
            lon: Cesium.Math.toRadians(this.lon),
            lat: Cesium.Math.toRadians(this.lat),
            alt
        }
    }
    /**
     * 判断该点是否在场景内，且在球的正面
     * @returns {Boolean} 可见性
     */
    isVisible(viewer) {
        return GeoPoint.isVisible(this, viewer)
    }
    /**
     * 转为字符串
     */
    toString() {
        return `{lon: ${this.lon}, lat: ${this.lat}, alt: ${this.alt}}`
    }
    /**
     * 转为JSON对象
     */
    toJson() {
        return {
            lon: this.lon,
            lat: this.lat,
            alt: this.alt
        }
    }
    /**
     * 判断一个点在当前场景是否可见。这里的可见指的是是否在屏幕范围内且在球的正面。
     * @param {GeoPoint} point 点
     * @param {Cesium.Viewer} viewer Viewer对象
     * @returns {Boolean} 可见性
     */
    static isVisible(point, viewer) {
        if (viewer instanceof Cesium.Viewer) {
            throw new CesiumProError('viewer不是一个有效的Cesium.Viewer对象')
        }
        if (!defined(point)) {
            throw new CesiumProError('point is not defined.')
        }
        const position = GeoPoint.toCartesian(point)
        if (viewer.scene.mode === Cesium.SceneMode.SCENE3D) {
            const visibility = new Cesium.EllipsoidalOccluder(Cesium.Ellipsoid.WGS84, viewer.camera.position)
                .isPointVisible(position);
            if (!visibility) {
                return false;
            }
            const windowPosition = GeoPoint.toPixel(point, viewer);
            if (!defined(windowPosition)) {
                return false;
            }
            const width = viewer.canvas.width || viewer.canvas.clientWidth;
            const height = viewer.canvas.height || viewer.canvas.clientHeight;
            return (windowPosition.x > 0 && windowPosition.x < width) && (windowPosition.y > 0 && windowPosition.y < height);
        } else if (viewer.scene.mode === Cesium.SceneMode.SCENE2D) {
            const frustum = viewer.scene.camera.frustum;
            const {
                positionWC,
                directionWC,
                upWC
            } = viewer.scene.camera;
            const cullingVolume = frustum.computeCullingVolume(positionWC, directionWC, upWC);
            const bounding = Cesium.BoundingSphere.projectTo2D(new BoundingSphere(position, 1));
            const visibility = cullingVolume.computeVisibility(bounding);
            return visibility === Cesium.Intersect.INSIDE || visibility === Cesium.Intersect.INERSECTING
        }
    }
    /**
     * 转屏幕坐标
     * @param {GeoPoint} point 
     * @param {Cesium.Viewer} viewer 
     * @returns 对应的屏幕坐标
     */
    static toPixel(point, viewer) {
        //>>includeStart('debug', pragmas.debug);
        if (viewer instanceof Cesium.Viewer === false) {
            throw new CesiumProError('viewer不是一个有效的Cesium.Viewer对象')
        }
        if (!defined(point)) {
            throw new CesiumProError('point is not defined.')
        }
        //>>includeEnd('debug', pragmas.debug);
        const cartesian = GeoPoint.toCartesian(point);
        if(!defined(cartesian)) {
            return undefined;
        }
        return Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            viewer.scene,
            cartesian,
        );
    }
    /**
     * 转弧度坐标
     * @param {GeoPoint} point 
     * @returns 用弧度表示的坐标点
     */
    static toCartographic(point) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(point)) {
            throw new CesiumProError('point is not defined.')
        }
        //>>includeEnd('debug', pragmas.debug);
        return Cesium.Cartographic.fromDegrees(point.lon, point.lat, point.alt);
    }
    /**
     * 转笛卡尔坐标
     * @param {GeoPoint} point 
     * @returns 用笛卡尔坐标表示的点
     */
    static toCartesian(point) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(point)) {
            throw new CesiumProError('point is not defined.')
        }
        //>>includeEnd('debug', pragmas.debug);
        return Cesium.Cartesian3.fromDegrees(point.lon, point.lat, point.alt)
    }
    /**
     * 从一个笛卡尔坐标创建点
     * @param {Cesium.Cartesian3} cartesian 笛卡尔坐标点
     * @returns GeoPoint点
     */
    static fromCartesian(cartesian) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(cartesian)) {
            throw new CesiumProError('cartesian is not defined.')
        }
        //>>includeEnd('debug', pragmas.debug);
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        if(!defined(cartographic)) {
            return undefined;
        }
        return GeoPoint.fromCartographic(cartographic)
    }
    /**
     * 从一个地理坐标点创建点
     * @param {Cesium.Cartographic} cartographic 地理坐标点
     * @returns GeoPoint点
     */
    static fromCartographic(cartographic) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(cartographic)) {
            throw new CesiumProError('cartographic is not defined.')
        }
        //>>includeEnd('debug', pragmas.debug);
        return new GeoPoint(
            Cesium.Math.toDegrees(cartographic.longitude),
            Cesium.Math.toDegrees(cartographic.latitude),
            cartographic.height
        )
    }
    /**
     * 从一个窗口坐标创建点
     * @param {Cesium.Cartesian2} pixel 窗口坐标
     * @param {Cesium.Viewer} viewer Viewer对象
     * @returns {GeoPoint} GeoPoint点
     */
    static fromPixel(pixel, viewer) {
        if(!viewer.scene.globe) {
            return undefined;
        }
        //>>includeStart('debug', pragmas.debug);
        if (!defined(pixel)) {
            throw new CesiumProError('pixel is not defined.')
        }
        if (viewer instanceof Cesium.Viewer === false) {
            throw new CesiumProError('viewer不是一个有效的Cesium.Viewer对象')
        }
        //>>includeEnd('debug', pragmas.debug);
        const ray = viewer.scene.camera.getPickRay(pixel);
        const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (!defined(cartesian)) {
            return undefined;
        }
        return GeoPoint.fromCartesian(cartesian);
    }
    /**
     * 从经纬度创建点
     * @param {Number} lon 经度
     * @param {Number} lat 纬度
     * @param {Number} height 海拔
     * @returns {GeoPoint}
     */
    static fromDegrees(lon, lat, height) {
        return new GeoPoint(lon, lat, height);
    }
    /**
     * 判断一个点或经纬度是否在中国范围内（粗略）
     * @param  {GeoPoint|Number[]} args 
     * @returns 如果在中国范围内，返回true
     */
    static inChina(...args) {
        if(args.length === 1) {
            const p = args[0]
            if(args[0] instanceof GeoPoint) {
                return GeoPoint.inChina(p.lon, p.lat)
            }
        } else {
            const lon = +args[0];
            const lat = +args[1];
            return lon > 73.66 && lon < 135.05 && lat > 3.86 && lat <53.55
        }
    }
    /**
     * 从经纬度数组创建点
     * @param {Lonlat} lonlat 
     * @returns {GeoPoint}
     */
    static fromLonlat(lonlat) {
        return new GeoPoint(...lonlat)
    }
}
/**
 * 经纬度数组，经度在前，纬度在后。
 * @typedef {Array} GeoPoint.Lonlat
 * @property {Number} longitude 地理经纬坐标，有效值在-180~180之间
 * @property {Number} latitude 地理纬度坐标，有效值在-90~90之间
 */
export default GeoPoint;
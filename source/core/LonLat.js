import CesiumProError from "./CesiumProError.js";
import defaultValue from "./defaultValue.js";
import defined from "./defined.js";
class LonLat {
    /**
     * 用经纬度（度）和海拔（米）描述一个地理位置。
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
        this.alt = defaultValue(alt, 0);
    }
    get height() {
        return this.alt;
    }
    /**
     * 转为屏幕坐标
     * @param {Cesium.Scene} scene 
     * @returns {Cesium.Cartesian2} 屏幕坐标
     */
    toPixel(scene) {
        return LonLat.toPixel(this, scene);
    }
    /**
     * 转为笛卡尔坐标
     * @returns {Cesium.Cartesian3} 笛卡尔坐标
     */
    toCartesian() {
        return LonLat.toCartesian(this);
    }
    /**
     * 转为地理坐标
     * @returns {Cesium.Cartographic} 地理坐标
     */
    toCartographic() {
        return LonLat.toCartographic(this)
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
        return LonLat.isVisible(this, viewer)
    }
    /**
     * 转为字符串
     * @returns 表示该点位置的字符串
     */
    toString() {
        return `{lon: ${this.lon}, lat: ${this.lat}, alt: ${this.alt}}`
    }
    /**
     * 转为JSON对象
     * @returns 表示该点位置的对象
     */
    toJson() {
        return {
            lon: this.lon,
            lat: this.lat,
            alt: this.alt
        }
    }
    /**
     * 从地理点坐标转换成数组
     * @returns 表示该点位置的数组
     */
    toArray() {
        return [this.lon, this.lat, this.alt];
    }
    /**
     * 判断一个点在当前场景是否可见。这里的可见指的是是否在屏幕范围内且在球的正面。
     * @param {LonLat} point 点
     * @param {Cesium.Viewer} viewer Viewer对象
     * @returns {Boolean} 可见性
     */
    static isVisible(point, viewer) {
        if (viewer instanceof Cesium.Viewer === false) {
            throw new CesiumProError('viewer不是一个有效的Cesium.Viewer对象')
        }
        if (!defined(point)) {
            return false;
        }
        const position = LonLat.toCartesian(point)
        if (!position) {
            return false;
        }
        if (viewer.scene.mode === Cesium.SceneMode.SCENE3D) {
            const visibility = new Cesium.EllipsoidalOccluder(Cesium.Ellipsoid.WGS84, viewer.camera.position)
                .isPointVisible(position);
            if (!visibility) {
                return false;
            }
            const windowPosition = LonLat.toPixel(point, viewer.scene);
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
     * @param {LonLat|Cesium.Cartesian3|Cesium.Cartographic} point 
     * @param {Cesium.Scene} scene 
     * @returns 对应的屏幕坐标
     */
    static toPixel(point, scene) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(scene)) {
            throw new CesiumProError('scene未定义。')
        }        
        //>>includeEnd('debug', pragmas.debug);
        if (!defined(point)) {
            return undefined
        }
        const cartesian = LonLat.toCartesian(point)
        if (!defined(cartesian)) {
            return undefined;
        }
        return Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            scene,
            cartesian,
        );
    }
    /**
     * 转弧度坐标
     * @param {LonLat} point 
     * @returns 用弧度表示的坐标点
     */
    static toCartographic(point, viewer) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(point)) {
            throw new CesiumProError('point is not defined.')
        }
        //>>includeEnd('debug', pragmas.debug);
        if (point instanceof LonLat) {
            return Cesium.Cartographic.fromDegrees(point.lon, point.lat, point.alt);
        } else if (point instanceof Cesium.Cartesian3) {
            return Cesium.Cartographic.fromCartesian(point);
        } else if (point instanceof Cesium.Cartographic) {
            return point;
        } else if (point instanceof Cesium.Cartesian2) {
            const cartesian = LonLat.toCartesian(point, viewer);
            return LonLat.toCartographic(cartesian)
        }
    }
    /**
     * 转笛卡尔坐标
     * @param {LonLat|Cesium.Cartesian3|Cesium.Cartographic|Cesium.Cartesian2} point 
     * @param {Viewer} [viewer] viewer对象， 如果point是Cesium.Cartesian2类型，该参数需要被提供
     * @returns 用笛卡尔坐标表示的点
     */
    static toCartesian(point, viewer) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(point)) {
            return undefined;
        }
        //>>includeEnd('debug', pragmas.debug);
        if (point instanceof Cesium.Cartesian3) {
            return point;
        }
        if (point instanceof Cesium.Cartographic) {
            return Cesium.Cartographic.toCartesian(point)
        }
        if (point instanceof LonLat) {
            return Cesium.Cartesian3.fromDegrees(point.lon, point.lat, point.alt)
        }
        if (point instanceof Cesium.Cartesian2) {
            if(!viewer) {
                return;
            }
            const ray = viewer.scene.camera.getPickRay(point);
            return viewer.scene.globe.pick(ray, viewer.scene);
        }

    }
    /**
     * 从一个笛卡尔坐标创建点
     * @param {Cesium.Cartesian3} cartesian 笛卡尔坐标点
     * @returns GeoPoint点
     */
    static fromCartesian(cartesian) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(cartesian)) {
            return undefined
        }
        //>>includeEnd('debug', pragmas.debug);
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        if (!defined(cartographic)) {
            return undefined;
        }
        return LonLat.fromCartographic(cartographic)
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
        return new LonLat(
            Cesium.Math.toDegrees(cartographic.longitude),
            Cesium.Math.toDegrees(cartographic.latitude),
            cartographic.height
        )
    }
    /**
     * 从一个窗口坐标创建点
     * @param {Cesium.Cartesian2} pixel 窗口坐标
     * @param {Cesium.Viewer} viewer Viewer对象
     * @returns {LonLat} GeoPoint点
     */
    static fromPixel(pixel, viewer) {
        if (!viewer.scene.globe) {
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
        return LonLat.fromCartesian(cartesian);
    }
    /**
     * 从经纬度创建点
     * @param {Number} lon 经度(度)
     * @param {Number} lat 纬度(度)
     * @param {Number} height 海拔(米)
     * @returns {LonLat}
     */
    static fromDegrees(lon, lat, height) {
        return new LonLat(lon, lat, height);
    }
    /**
     * 获得一个经纬度数组
     * @param {*} positions 
     * @returns {LonLat[]} 经纬度数组
     * @example
     * LonLat.fromDegreesArray([110, 30, 111, 31])
     */
    static fromDegreesArray(positions) {
        const ps = []
        for (let i = 0, n = positions.length; i < n; i+=2) {
            ps.push(new LonLat(positions[i], positions[i+1]));
        }
        return ps;
    }
    /**
     * 获得一个经纬度数组
     * @param {*} positions 
     * @returns {LonLat[]} 经纬度数组
     * @example
     * LonLat.fromDegreesArrayHeights([110, 30,1000, 111, 31, 1000])
     */
     static fromDegreesArrayHeights(positions) {
        const ps = []
        for (let i = 0, n = positions.length; i < n; i+=3) {
            ps.push(new LonLat(positions[i], positions[i+1], positions[i+2]));
        }
        return ps;
    }
    /**
     * 从经纬度创建点
     * @param {Number} lon 经度(弧度)
     * @param {Number} lat 纬度(弧度)
     * @param {Number} height 海拔(米)
     * @returns {LonLat}
     */
    static fromRadians(lon, lat, height) {
        return new LonLat(Cesium.Math.toDegrees(lon), Cesium.Math.toDegrees(lat), height);
    }
    /**
     * 判断一个点或经纬度是否在中国范围内（粗略）
     * @param  {LonLat|Number[]} args 
     * @returns 如果在中国范围内，返回true
     */
    static inChina(...args) {
        if (args.length === 1) {
            const p = args[0]
            if (args[0] instanceof LonLat) {
                return LonLat.inChina(p.lon, p.lat)
            }
        } else {
            const lon = +args[0];
            const lat = +args[1];
            return lon > 73.66 && lon < 135.05 && lat > 3.86 && lat < 53.55
        }
    }
    /**
     * 从经纬度数组创建点, 经纬度数组，经度在前，纬度在后
     * @param {Array} lonlat 
     * @returns {LonLat}
     */
    static fromArray(lonlat) {
        return new LonLat(...lonlat)
    }
    /**
     * 从经纬度数组创建点, 经纬度数组，经度在前，纬度在后
     * @param {Object} lonlat 
     * @returns {LonLat}
     */
     static fromJson(lonlat) {
        return new LonLat(lonlat.lon, lonlat.lat, lonlat.alt)
    }
    /**
     * 判断对象是不是一个有效的点
     * @param {any} v 
     */
    static isValid(v) {
        if (v instanceof LonLat) {
            if (!defined(v.lon)) {
                return false;
            }
            if (!defined(v.lat)) {
                return false;
            }
            if (!defined(v.alt)) {
                return false;
            }
            return true
        }
        if (v instanceof Cesium.Cartesian3) {
            if (!defined(v.x)) {
                return false;
            }
            if (!defined(v.y)) {
                return false;
            }
            if (!defined(v.z)) {
                return false;
            }
            return true;
        }
        return false;
    }
    // /**
    //  * 经纬度转CGCS2000平面坐标
    //  * @param {LonLat|Cesium.Cartesian3} position 
    //  */
    // static toCGCS2000(position) {
    //     if (position instanceof Cesium.Cartesian3) {
    //         position = LonLat.fromCartesian(position);
    //     }
    //     if (position instanceof LonLat === false) {
    //         throw new CesiumProError(position + 'is invalid position.')
    //     }
    // }
}
/**
 * 经纬度数组，经度在前，纬度在后。
 * @typedef {Array} LonLat.Lonlat
 * @property {Number} longitude 地理经纬坐标，有效值在-180~180之间
 * @property {Number} latitude 地理纬度坐标，有效值在-90~90之间
 */
export default LonLat;
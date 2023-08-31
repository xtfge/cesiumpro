import CesiumProError from "../core/CesiumProError";
import defaultValue from "../core/defaultValue";
import LonLat from "../core/LonLat";
import BaseAnalysis from "./BaseAnalysis";
import AnalysisUtil from './AnalysisUtil'
import Cartometry from "../core/Cartometry";
import { featureCollection, point, tin } from "@turf/turf";
import destroyObject from "../core/destroyObject";

const {
    Color,
    Cartesian3,
    Cartographic,
    PrimitiveCollection,
    PolygonGeometry,
    PolygonHierarchy,
    GeometryInstance,
    Primitive,
    GroundPrimitive,
    PerInstanceColorAppearance
} = Cesium;
/**
 * 获得三角形顶点
 */
function getNodesAndHeight(viewer, points, exclude = []) {
    const positions = [];
    let h = 0;
    const area = AnalysisUtil.getArea(points);
    for (let i = 0; i < 3; i++) {
        const point = points[i];
        const carto = Cartographic.fromDegrees(...point);
        const height = viewer.scene.sampleHeight(carto, exclude);
        h += height;
        const cartesian = Cartesian3.fromDegrees(point[0], point[1], height);
        positions.push(cartesian)
    }
    return {
        positions,
        height: h / 3,
        area
    };
}
function createPolygon(positions, color, height, clamp) {
    const polygon = new PolygonGeometry({
        polygonHierarchy: new PolygonHierarchy(positions),
        perPositionHeight: true,
        extrudedHeight: height
    });
    const instance = new GeometryInstance({
        geometry: polygon,
        attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(color)
        }
    })
    const constructor = clamp ? GroundPrimitive : Primitive;
    return new constructor({
        geometryInstances: [instance],
        appearance: new PerInstanceColorAppearance()
    })
}
class FillAnalysis extends BaseAnalysis {
    /**
     * 挖方分析
     * @extends BaseAnalysis
     * @param {*} viewer 
     * @param {*} options 具有以下属性
     * @param {LonLat[]|Cesium.Cartesian3[]} [options.mask] 分析范围
     * @param {Cesium.Color} [options.fillColor = Cesium.Color.RED] 需要填充的区域的颜色
     * @param {Cesium.Color} [options.excavatedColor = Cesium.Color.GREEN] 需要挖掘的区域的颜色
     * @param {number} [options.height] 挖填高度
     * @param {number} [options.samplerSize] 采样间距
     * @param {array} [options.excludeObject = []] 分析时需要排除的对象
     * @param {boolean} [options.renderToViewer = true] 是否将分析结果渲染到场景
     */
    constructor(viewer, options = {}) {
        super(viewer, options);
        // if (!options.mask) {
        //     throw new CesiumProError('parameter mask must be provided.')
        // }
        const mask = AnalysisUtil.getCartesians(options.mask);
        if (mask) {
            this._mask = [...mask, mask[0]];
        }
        if (this._mask instanceof Cartesian3) {
            this._mask = this._mask.map(_ => LonLat.fromCartesian(_));
        }
        this.excavatedColor = defaultValue(options.excavatedColor, Color.RED.withAlpha(0.5));
        this.fillColor = defaultValue(options.fillColor, Color.GREEN.withAlpha(0.5));
        this._type = 'excavation-analysis';
        this._height = defaultValue(options.height, 0);
        this._samplerSize = options.samplerSize;
        this._excludeObject = defaultValue(options.excludeObject, []);
        this._renderToViewer = defaultValue(options.renderToViewer, true);
    }
    /**
     * 设置分析范围
     * @param {*} mask 
     */
    setMask(mask) {
        if (!Array.isArray(mask)) {
            throw new CesiumProError('mask must be an array');
        }
        const maskCartesians = AnalysisUtil.getCartesians(options.mask);        
        this._mask = [...maskCartesians, maskCartesians[0]];
        if (this._mask instanceof Cartesian3) {
            this._mask = this._mask.map(_ => LonLat.fromCartesian(_));
        }
    }

    /**
     * 建议采样间距
     * @type {number}
     */
    static suggestGridCount = 300;
    /**
     * 开始分析
     * @returns {object} 分析参数及结果
     */
    do() {
        super.do();
        if (!this._mask) {
            if (!Array.isArray(mask)) {
                throw new CesiumProError('请通过setMask方法指定分析范围');
            }
        }
        this._check();
        this.clear();
        this.preDo.raise({
            samplerSize: this._samplerSize,
            id: this._id
        })
        if (!this._mask) {
            return;
        }
        const area = Cartometry.surfaceArea(this._mask);
        const cellSize = this._samplerSize || Math.sqrt(area / 1e6 / FillAnalysis.suggestGridCount);
        const polygon = AnalysisUtil.getLonLats(this._mask)
        const grid = AnalysisUtil.triangleGrid(polygon, cellSize);
        const collection = new PrimitiveCollection();
        this._root = collection;
        collection.name = this.type;
        if (this._renderToViewer) {
            this._viewer.scene.primitives.add(collection);
        }
        const points = grid.features.map(_ => _.geometry.coordinates[0]);
        const result = []
        let fillVolume = 0;
        let excavaVolume = 0;
        for (let point of points) {
            const { height, positions, area } = getNodesAndHeight(this._viewer, point, this._excludeObject);
            const volume = area * (height - this._height);
            if (volume > 0) {
                excavaVolume += volume;
            } else {
                fillVolume += Math.abs(volume);
            }
            result.push({ height, positions, volume });
            this._render(positions, height);
        }
        const data = {
            samplerSize: cellSize,
            id: this._id,
            grid: grid,
            result,
            fillVolume,
            excavaVolume,
            graphicCollection: this._root
        }
        this.postAnalysis.raise(data);
        this._doing = false;
        return data;

    }
    _render(positions, height) {
        const color = height < this._height ? this.excavatedColor : this.fillColor;
        const clamp = height > this._height ? true : false
        const polygon = createPolygon(positions, color, this._height, clamp);
        this._root.add(polygon);
    }
    /**
     * 清空分析结果
     */
    clear() {
        if (this._root) {
            this._viewer.scene.primitives.remove(this._root);
        }
    }
}

export default FillAnalysis;
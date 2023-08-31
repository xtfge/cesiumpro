import defaultValue from '../core/defaultValue'
import guid from '../core/guid'
import defined from '../core/defined'
import PolygonGraphic from '../graphic/PolygonGraphic'
import turfUnion from '../thirdParty/turf/turfUnion'
import turfBuffer from '../thirdParty/turf/turfBuffer'
import BaseAnalysis from './BaseAnalysis'
import Point from '../core/Point'
import Polyline from '../core/Polyline'
import Polygon from '../core/Polygon'
import CesiumProError from '../core/CesiumProError'
class BufferAnalysis extends BaseAnalysis {
  /**
   * 缓冲区分析
   * @extends BaseAnalysis
   * @param {Viewer} viewer  Cesium Viewer对象
   * @param {Object} [options={}] 具有以下属性
   * @param {Point[]|Polyline[]|Polygon[]} [options.graphics=[]] 参加缓冲区分析的要素集合
   * @param {Number} [options.bufferRadius=100] 缓冲区半径，如果graphics中的要素定义了bufferRadius属性，该值将会被覆盖
   * @param {Number} [options.samplerSize=8] 缓冲区分析的迭代步数，值越大，多边形越精细，分析速度越慢
   * @param {Object} [options.material=Cesium.Color.GOLD.withAlpha(0.6)] 分析结果使用的材质
   * @param {Cesium.HeightReference} [options.heightReference=Cesium.HeightReference.NONE] 分析结果使得的高程参考.
   *
   * @example
   * const point = new CesiumPro.PointGraphic({
     position: Cesium.Cartesian3.fromDegrees(110.025, 30.021),
     pixelSize: 10,
     color: Cesium.Color.RED,
     properties: {
       bufferRadius: 1000
     }
   })
   const point1 = new CesiumPro.PointGraphic({
     position: Cesium.Cartesian3.fromDegrees(110.009, 30.021),
     pixelSize: 10,
     color: Cesium.Color.RED,
     properties: {
       bufferRadius: 1400
     }
   })
   const point2 = new CesiumPro.PointGraphic({
     position: Cesium.Cartesian3.fromDegrees(110.045, 30.011),
     pixelSize: 10,
     color: Cesium.Color.RED,
     properties: {
       bufferRadius: 1200
     }
   })
   const line = new CesiumPro.PolylineGraphic({
     positions: Cesium.Cartesian3.fromDegreesArray([110.012, 30.015, 110.02, 30.01, 110.05, 30.02]),
     width: 3,
     material: Cesium.Color.GOLD
   })
   line.properties.addProperty('bufferRadius', 500)
   const polygon = new CesiumPro.PolygonGraphic({
     positions: Cesium.Cartesian3.fromDegreesArray([110.01, 30.02, 110.03, 30.03, 110.04, 30.005]),
     material: Cesium.Color.WHITE.withAlpha(0.5)
   })
   viewer.flyTo([point.entity, line.entity, polygon.entity]);
   const graphics = [point, point1, point2, line, polygon];
   const buffer = new BufferAnalysis(viewer, {
     graphics,
     material: Cesium.Color.RED.withAlpha(0.6)
   })
   buffer.do();
   */
  constructor(viewer, options = {}) {
    super(viewer);
    this._graphics = options.graphics;
    this._steps = defaultValue(options.steps, 8);
    this._bufferRadius = defaultValue(options.bufferRadius, 100);
    this._material = defaultValue(options.material, Cesium.Color.GOLD.withAlpha(0.6));
    this._heightReference = defaultValue(options.heightReference, Cesium.HeightReference.NONE);
    this._buffered = [];
  }
  /**
   * 缓冲区分析半径
   * @type {Number}
   */
  get bufferRadius() {
    return this._bufferRadius;
  }
  set bufferRadius(val) {
    val = parseFloat(val);
    if (val < 0) {
      return;
    }
    this._bufferRadius = val;
  }
  /**
   * 多边形分割的步数，值越大，多边形越精细，分析速度越慢
   * @type {Number}
   */
  get steps() {
    this._steps;
  }
  set steps(val) {
    this._steps = val;
  }
  /**
   * 缓冲分析结果使用的材质
   * @type {Object}
   * @example
   * const buffer=CesiumPro.BufferAnalysis(viewer);
   * buffer.material=Cesium.Color.RED;
   */
  get material() {
    return this._material;
  }
  set material(val) {
    this._material = val;
  }
  /**
   * 开始分析
   * @returns {array} 缓冲区分析结果
   */
  do() {
    this.preAnalysis.raise();
    const graphics = this._graphics;
    if (!graphics) {
      throw new CesiumProError("the graphics must be provided, you can call setGraphics method set graphics.")
    }
    let bufferedGraphic;
    const bufferedList = []
    for (let graphic of graphics) {
      const feat = graphic.toGeoJson();
      let radius = this._bufferRadius;
      if (feat.properties && defined(feat.properties.bufferRadius)) {
        radius = feat.properties.bufferRadius;
      }

      radius = radius / 1000.0;
      const buffered = turfBuffer(feat, radius, {
        steps: this._steps
      });
      bufferedList.push(buffered);
    }

    const union = turfUnion(...bufferedList);
    bufferedGraphic = PolygonGraphic.getEntityFromGeoJson(union);
    if (!defined(bufferedGraphic)) {
      this.postAnalysis.raise();
      return;
    }
    bufferedGraphic.polygon.material = this._material;
    bufferedGraphic.polygon.heightReference = this._heightReference
    this._root.add(bufferedGraphic);
    this.postAnalysis.raise();
  }
  clear() {
    this._root.removeAll();
  }
  /**
   * 定位到分析结果
   */
  zoomTo() {
    if (this.viewer) {
      this.viewer.flyTo(this._root);
    }
  }
  destroy() {
    this._viewer.dataSources.remove(this.datasource);
    this._viewer = undefined;
    super.destroy();
  }
}
export default BufferAnalysis;

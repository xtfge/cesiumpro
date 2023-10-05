import defaultValue from '../core/defaultValue'
import defined from '../core/defined'
import turfUnion from '@turf/union'
import turfBuffer from '@turf/buffer'
import BaseAnalyser from './BaseAnalyser'
import Point from '../core/PointFeature'
import Polyline from '../core/PolylineFeature'
import Polygon from '../core/PolygonFeature'
import CesiumProError from '../core/CesiumProError'
import CustomDataSource from '../layer/CustomDataSource'
import PointFeature from '../core/PointFeature'
import PolylineFeature from '../core/PolylineFeature'
import PolygonFeature from '../core/PolygonFeature'
import Feature from '../core/Feature'
class BufferAnalyser extends BaseAnalyser {
  /**
   * 缓冲区分析
   * @extends BaseAnalyser
   * @param {Viewer} viewer  Cesium Viewer对象
   * @param {Object} [options={}] 具有以下属性
   * @param {PointFeature[]|PolylineFeature[]|PolygonFeature[]} [options.graphics=[]] 参加缓冲区分析的要素集合
   * @param {Number} [options.bufferRadius=100] 缓冲区半径，单位米，如果graphics中的要素定义了bufferRadius属性，该值将会被覆盖
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
   const buffer = new BufferAnalyser(viewer, {
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
    this._root = new CustomDataSource('buffer-analysis');
    viewer.dataSources.add(this._root);
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
   * const buffer=CesiumPro.BufferAnalyser(viewer);
   * buffer.material=Cesium.Color.RED;
   */
  get material() {
    return this._material;
  }
  set material(val) {
    this._material = val;
  }
  /**
   * 设置缓冲区分析的图形
   * @param {PointFeature[]|PolylineFeature[]|PolygonFeature[]} graphics 
   */
  setGraphic(graphics) {
    const isArray = Array.isArray(graphics);
    if (!isArray) {
      graphics = [graphics];
    }
    this._graphics = graphics.filter(_ => _ instanceof Feature);
  }
  /**
   * 开始分析
   * @returns {array} 缓冲区分析结果
   */
  do() {
    this.preAnalysis.raise();
    const graphics = this._graphics;
    if (!(Array.isArray(graphics) && graphics.length)) {
      //>>includeStart('debug', pragmas.debug)
      throw new CesiumProError("the graphics must be provided, you can call setGraphic method set graphics.")
      //>>includeEnd('debug')
    }
    if (!(Array.isArray(graphics) && graphics.length)) {
      return;
    }
    let bufferedGraphic;
    const bufferedList = []
    for (let graphic of graphics) {
      const feat = graphic.geometry;
      let radius = this._bufferRadius;
      if (graphic.properties && defined(graphic.properties.bufferRadius)) {
        radius = graphic.properties.bufferRadius;
      }
      radius = radius / 1000.0;
      const buffered = turfBuffer(feat, radius, {
        steps: this._steps,
        units: 'kilometers',
        radius
      });
      bufferedList.push(buffered);
    }
    let unionFeature;
    if (bufferedList.length > 1) {
      let unionFeature = bufferedList[0]
      for (let i = 1; i < bufferedList.length; i++) {
        unionFeature = turfUnion(unionFeature, bufferedList[i]);
      }
      bufferedGraphic = Polygon.toEntity(unionFeature);
    } else {
      unionFeature = bufferedList;
      bufferedGraphic = Polygon.toEntity(unionFeature[0]);
    }  
    
    if (!defined(bufferedGraphic)) {
      this.postAnalysis.raise();
      return;
    }
    for (let graphic of bufferedGraphic) {
      graphic.polygon.material = this._material;
      graphic.polygon.heightReference = this._heightReference
      this._root.add(graphic);
    }
    
    this.postAnalysis.raise(bufferedGraphic);
  }
  clear() {
    this._root.removeAll();
  }
  /**
   * 定位到分析结果
   */
  zoomTo() {
    if (this._viewer) {
      this._viewer.flyTo(this._root.entities);
    }
  }
  destroy() {
    this._viewer.dataSources.remove(this._root);
    this._viewer = undefined;
    super.destroy();
  }
}
export default BufferAnalyser;

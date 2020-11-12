import GraphicType from '../core/GraphicType';
import PointGraphic from './PointGraphic';
import defaultValue from '../core/defaultValue';
import uuid from '../core/guid';

class NodeGraphic {
  /**
   * 用于创建线面图形的顶点图形
   * @param {Viewer} viewer
   * @param {Object} entityOptions 描述一个点图形
   * @param {Object} [options={}]  [description]
   */
  constructor(viewer, entityOptions) {
    this._viewer = viewer;
    this._type = GraphicType.MUTIPOINT;
    this._positions = entityOptions.positions;
    this._entityOptions = entityOptions;
    this._values = [];
    this.createEntity();
  }

  /**
   * 顶点图形的几何信息
   * @return {Object}
   */
  getGeometry() {
    const coordinates = [];
    const type = GraphicType.getOGCType(this.type);
    for (const position of this.positions) {
      const cartographic = PointGraphic.toDegrees(position);
      coordinates.push([cartographic.lon, cartographic.lat]);
    }
    return {
      type,
      coordinates,
    };
  }

  /**
   * @private
   */
  createEntity() {
    delete this._entityOptions.positions;
    const options = this._entityOptions;
    const count = this._positions.length;
    for (let i = 0; i < count; i++) {
      const entity = new Cesium.Entity({
        position: new Cesium.CallbackProperty(() => this._positions[i], false),
        point: options,
      });
      const value = this._viewer.entities.add(entity);
      this._values.push(value);
    }
  }

  /**
   * 添加一个顶点
   * @param {Cartesian3} node 顶点坐标
   */
  addNode(node) {
    const options = this._entityOptions;
    this._values.push(this._viewer.entities.add({
      position: node,
      point: options,
    }));
  }

  /**
   * 删除指定索引的顶点
   * @param  {Number} index 顶点序号
   * @return {Entity}    被删除的顶点
   */
  removeNode(index) {
    const node = this._values[index];
    this._viewer.entities.remove(node);
    this._values.splice(index, 1);
    return node;
  }

  /**
   * 更新顶点位置
   * @param  {Number} index 需要更新的顶点序号
   * @param  {Cartesian3} node  新的顶点位置
   */
  updateNode(index, node) {
    if (index >= this._positions.length) {
      return;
    }
    this._positions[index] = node;
  }

  /**
   * 销毁对象
   */
  destroy() {
    for (const v of this._values) {
      this._viewer.entities.remove(v);
    }
    this._values = undefined;
    this._viewer = undefined;
  }

  /**
   * 将当前图形转为GeoJson
   * @return {Object} 该图形的GeoJson格式
   */
  toGeoJson() {
    return NodeGraphic.toGeoJson(this);
  }

  /**
   * 将图形对象转为GeoJson
   * @param  {NodeGraphic} nodeGraphic [description]
   * @return {Object}      nodeGraphic的GeoJson格式
   */
  static toGeoJson(nodeGraphic) {
    const type = GraphicType.getOGCType(graphic.type);
    const properties = graphic.properties ? graphic.properties.toJson() : {};
    properties.graphicType = graphic.type;
    const features = {
      type: 'Feature',
      properties,
      geometry: graphic.getGeometry(),
    };
    return features;
  }

  /**
   * 默认样式
   * @type {Object}
   */
  static defaultStyle = PointGraphic.defaultStyle;
}

export default NodeGraphic;

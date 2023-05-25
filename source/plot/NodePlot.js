import PlotType from './PlotType';
import PointGraphic from './PointPlot';
import defaultValue from '../core/defaultValue';
import defined from '../core/defined';
class NodePlot {
  /**
   * 用于创建线面图形的顶点图形
   * @param {Object} entityOptions 描述一个点图形,和Cesium.PointGraphic具有相同的参数
   */
  constructor(entityOptions) {
    this._type = PlotType.MUTIPOINT;
    this._positions = defaultValue(entityOptions.positions, []);
    this._entityOptions = entityOptions;
    this._values = [];
    this.createEntity();

    this._activeNode = undefined;
    /**
     * 当前处于激活状态的顶点的索引
     * @type {Number}
     */
    this.activeIndex = undefined;
  }
  /**
   * 当前处于激活状态的顶点
   * @type {Entity}
   */
  get activeNode() {
    return this._activeNode;
  }
  set activeNode(val) {
    this._activeNode = val;
    this.activeIndex = this.getIndexByPosition(val);
    this.highlightActiveNode()
  }
  /**
   * 高亮显示处于激活状态的顶点
   * @private
   */
  highlightActiveNode() {
    const values = this._values.filter(_ => defined(_.position));
    for (let i = 0, length = values.length; i < length; i++) {
      const v = values[i];
      if (i === this.activeIndex) {
        NodePlot.highlightNode(v);
      } else {
        v.point.color = this._entityOptions.color;
        v.point.outlineColor = this._entityOptions.outlineColor
      }
    }
  }
  /**
   * 顶点图形的几何信息
   * @return {Object}
   */
  getGeometry() {
    const coordinates = [];
    const type = PlotType.getOGCType(this.type);
    for (const position of this.positions) {
      const cartographic = PointGraphic.toDegrees(position);
      coordinates.push([cartographic.lon, cartographic.lat, cartographic.height]);
    }
    return {
      type,
      coordinates,
    };
  }
  /**
   * 高亮显示一个顶点
   * @param  {Entity} node 顶点实体
   */
  static highlightNode(node) {
    if (node && node.point) {
      node.point.color = Cesium.Color.AQUA;
      node.point.outlineColor = Cesium.Color.AQUA;
    }
  }
  /**
   * 返回指定索引的顶点
   * @param  {Number} index 顶点序号
   * @return {Entity} index对应的顶点实体
   */
  get(index) {
    const values = this._values.filter(_ => defined(_.position));
    return values[index];
  }
  /**
   * 返回指定位置的顶点索引
   * @param  {Cesium.Cartesian3} position 顶点位置
   * @return {Number} 返回位置和position相同的顶点的序号,如果存在多个，返回第一个匹配到的顶点
   */
  getIndexByPosition(position) {
    for (let i = 0, length = this._positions.length; i < length; i++) {
      const p = this._positions[i];
      const equal = PointGraphic.equal(p, position);
      if (equal) {
        return i;
      }
    }
    return -1;
  }
  /**
   * 是否包含给定的顶点
   * @param  {Entity}  node 顶点实体
   * @return {Boolean} true表示该顶点集合中包含给定顶点
   */
  has(node) {
    return this._values.includes(node);
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
      this._values.push(entity);
    }
  }

  /**
   * 添加一个顶点
   * @param {Cartesian3} node 顶点坐标
   */
  addNode(node, index) {
    const options = this._entityOptions;
    if (this._values.length < this._positions.length) {
      const entity = new Cesium.Entity({
        position: new Cesium.CallbackProperty(() => this._positions[this._positions.length - 1], false),
        point: options,
      })
      return entity;
    }
    return undefined;
  }

  /**
   * 删除指定索引的顶点
   * @param  {Number} index 顶点序号
   * @return {Entity}    被删除的顶点
   */
  removeNode(index) {
    if (!defined(index)) {
      return;
    }
    // const node = this._values[index];
    // this._values.splice(index, 1);
    // this._positions.splice(index, 1);
    // return node;
  }
  /**
   * 删除最后一个顶点
   * @return {Entity};
   */
  popNode() {
    const index = this._positions.length - 1;
    const node = this.removeNode(index);
    return node
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
    this._values = undefined;
  }

  /**
   * 将当前图形转为GeoJson
   * @return {Object} 该图形的GeoJson格式
   */
  toGeoJson() {
    return NodePlot.toGeoJson(this);
  }
  /**
   * 保存所有顶点实体的数组
   * @type {Entity[]}
   */
  get values() {
    return this._values;
  }

  /**
   * 将图形对象转为GeoJson
   * @param  {NodePlot} NodePlot [description]
   * @return {Object}      nodeGraphic的GeoJson格式
   */
  static toGeoJson(NodePlot) {
    const type = PlotType.getOGCType(graphic.type);
    const properties = graphic.properties ? graphic.properties.toJson() : {};
    properties.PlotType = graphic.type;
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

export default NodePlot;

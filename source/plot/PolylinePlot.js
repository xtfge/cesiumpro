import BasePlot from './BasePlot';
import PointPlot from './PointPlot';
import PlotType from './PlotType';
import defined from '../core/defined';
import defaultValue from '../core/defaultValue'

class PolylinePlot extends BasePlot {
  /**
   * 可编辑的线图形
   * @extends BasePlot
   * @param {Object} entityOptions 和Cesium.PolylineGraphics具有相同的属性
   * @param {Object} [options={}] 具有以下属性
   */
  constructor(entityOptions, options = {}) {
    super(entityOptions, options);
    this._entityOptions = defaultValue(entityOptions, {});
    this._positions = defaultValue(this._entityOptions.positions, []);
    this._nodePositions = this._positions
    this._type = PlotType.POLYLINE;
    this._entity = this.createEntity();
  }

  /**
   * 该图形的几何描述，包括类型，经纬度等
   * @return {Object}
   */
  getGeometry() {
    const coordinates = [];
    const type = PlotType.getOGCType(this.type);

    for (const position of this.positions) {
      const lonlat = PointPlot.toDegrees(position);
      coordinates.push([lonlat.lon, lonlat.lat, lonlat.height]);
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
    super.createEntity();
    const options = {
      id: this.id,
      polyline: this._entityOptions,
    };
    this._entityOptions = options;
    return new Cesium.Entity(this._entityOptions);
  }

  /**
   * 将该要素导出成GeoJson
   * @return {String} GeoJson字符串
   */
  toGeoJson() {
    return PolylinePlot.toGeoJson(this);
  }

  /**
   * 开始编辑几何信息，此时图形的顶点可以被修改、删除、移动。
   * 属性信息的编辑不需要调用该方法。
   * @fires BasePlot#preEdit
   */
  startEdit() {
    super.startEdit();
  }

  /**
   * 几何要素编辑完成后调用该方法，以降低性能消耗。
   * <p style='font-weight:bold'>建议在图形编辑完成后调用该方法，因为CallbackProperty对资源消耗比较大，虽然对单个图形来说，不调用此方法可能并不会有任何影响。</p>
   * @fires BasePlot#postEdit
   */
  stopEdit() {
    super.stopEdit();
  }

  /**
   * 添加顶点,如果在使用该函数前没有调用<code>startEdit()</code>，位置更新将不会立即生效,在下次调用<code>startEdit()</code>后，此操作将更新到图形。
   * @param {Cartesian} node 新顶点
   * @param {Number} [index] 顶点位置,如果未定义顶点将被添加到最后
   */
  addNode(node, index) {
    const vertexNumber = this.positions.length
    if (defined(index) && index < vertexNumber) {
      for (let i = vertexNumber; i > index; i--) {
        this.positions[i] = this.positions[i - 1];
      }
      this.positions[index] = node;
    } else {
      this.positions.push(node);
    }
  }

  /**
   * 删除一个顶点,如果在使用该函数前没有调用<code>startEdit()</code>，位置更新将不会立即生效,在下次调用<code>startEdit()</code>后，此操作将更新到图形。
   * @param  {Number} index 顶点编号
   */
  removeNode(index) {
    if (!defined(index)) {
      return;
    }
    if (index < 0 || index >= this.positions.length) {
      return;
    }
    this.positions.splice(index, 1);
  }
  /**
   * 删除最后一个顶点
   */
  popNode() {
    const index = this.positions.length - 1;
    this.removeNode(index);
  }

  /**
   * 更新一个顶点,如果在使用该函数前没有调用<code>startEdit()</code>，位置更新将不会立即生效,在下次调用<code>startEdit()</code>后，此操作将更新到图形。
   * @param  {Number} index 顶点编号
   * @param  {Cartesian} node  将要更新的位置
   */
  updateNode(index, node) {
    if (index >= this.positions.length) {
      return;
    }
    this.positions[index] = node;
  }

  updateStyle(style) {
    if (!style || !this.entity.model) {
      return;
    }
    for (const s in style) {
      if (style.hasOwnProperty(s)) {
        this.entity.polyline[s] = style[s];
      }
    }
  }

  /**
   * 将图形转为GeoJson
   * @param  {PolylinePlot} graphic
   * @return {Object}  graphic的geojson格式
   */
  static toGeoJson(graphic) {
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
   * 利用GeoJson创建图形
   * @param  {String|Object} json   json对象或字符串
   * @param  {Object} style  图形样式
   * @return {PolylinePlot}
   */
  static fromGeoJson(json, style) {
    if (typeof json === 'string') {
      json = JSON.parse(json);
    }
    if (!defined(json.geometry) || !(defined(json.properties))) {
      return;
    }
    const type = json.properties.PlotType;
    if (type !== PlotType.POLYLINE) {
      throw new CesiumProError('json没有包含一个有效的PolylineGraphic.');
    }
    const coordinate = json.geometry && json.geometry.coordinates;
    return PolylinePlot.fromCoordinates(coordinate, json.properties, style);
  }

  /**
   * 从坐标点生成点图形
   * @param  {Number[]} coordinate  包含经纬和纬度的数组
   * @param  {Style} [style=PointPlot.defaultStyle] 点样式
   * @return {PolylinePlot}
   */
  static fromCoordinates(coordinates, properties, style = PolylinePlot.defaultStyle) {
    const positions = Cesium.Cartesian3.fromDegreesArray(coordinates.flat());

    const options = {
      positions,
      properties,
      ...style,
    };
    return new PolylinePlot(options);
  }

  /**
   * 默认样式
   * @type {Object}
   * @static
   * @memberof PolylinePlot
   */
  static defaultStyle = {
    clampToGround: true,
    material: Cesium.Color.fromCssColorString('rgba(247,224,32,1)'),
    width: 3,
  }

  static highlightStyle = {
    clampToGround: true,
    material: Cesium.Color.AQUA,
    width: 3,
  }
}

export default PolylinePlot;

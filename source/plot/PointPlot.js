import BasePlot from './BasePlot';
import PlotType from './PlotType';
import defaultValue from '../core/defaultValue';
import defined from '../core/defined';
import clone from '../core/clone';
import URL from '../core/Url';
import LonLat from '../core/LonLat';

class PointPlot extends BasePlot {
  /**
   * 点图形，泛指图形位置由一个点确定的图形，包括普通点、文字、模型、广告牌等
   * @extends BasePlot
   *
   * @param {Object} entityOptions 除以下属性外，同Cesium.PointGraphics
   * @param {Cartesian3} [entityOptions.position] 点的位置信息
   * @param {Object} [options={}]  具有以下属性
   * @param {PlotType} [options.type=PlotType.POINT] 标绘类型
   * @param {Object} [options.label] 描述一个label，为point、model、billboard创建一个label，
   * 如果options.type===PlotType.LABEL，该属性不会生效
   * @example
   * //1.创建一个点
   * const point=new CesiumPro.PointPlot({
   * position:Cesium.Cartesian3.fromDegrees(110,30),
   * pixelSize:10,
   * color:Cesium.Color.RED,
   * })
   * //2.创建一个带label和点
   * const pointWithLabel=new CesiumPro.PointPlot({
   * position:Cesium.Cartesian3.fromDegrees(110,30),
   * pixelSize:10,
   * color:Cesium.Color.RED,
   * },{
   * label:{
   * text:"Label Text",
   * fillColor:Cesium.Color.WHITE
   * }
   * })
   * //3.创建一个label
   * const label=new CesiumPro.PointPlot({
   * position:Cesium.Cartesian3.fromDegrees(110,30),
   * text:'Label Text',
   * fillColor:Cesium.Color.WHITE
   * },{type:PlotType.LABEL})
   * //4.创建一个billboard
   * const marker=new CesiumPro.PointPlot({
   * position:Cesium.Cartesian3.fromDegrees(110,30),
   * image:'./images/marker.png',
   * },{type:PlotType.BILLBOARD})
   */
  constructor(entityOptions, options = {}) {
    entityOptions = defaultValue(entityOptions, {});
    super(entityOptions, options);
    this._entityOptions = entityOptions;
    this._options = options;
    this._positions = defaultValue(entityOptions.position, new Cesium.Cartesian3());
    this._type = defaultValue(options.type, PlotType.POINT);
    this._entity = this.createEntity();
    this._text = defaultValue(entityOptions.text, '');
  }
  /**
   * 该图形的几何描述，包括类型，经纬度等
   * @return {Object}
   */
  getGeometry() {
    const cartographic = PointPlot.toDegrees(this.positions);
    const coordinates = [cartographic.lon, cartographic.lat, cartographic.height];
    const type = PlotType.getOGCType(this.type);
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
    delete this._entityOptions.position;
    const options = {
      id: this.id,
      position: this.positions,
    };
    if (this.type === PlotType.POINT) {
      options.point = clone(this._entityOptions);
    }
    if (this.type === PlotType.BILLBOARD) {
      options.billboard = clone(this._entityOptions);
      if (!defined(options.billboard.image)) {
        options.billboard.image = URL.buildModuleUrl('./assets/marker.png');
      }
    }
    if (this.type === PlotType.LABEL) {
      options.label = clone(this._entityOptions);
    }
    if (this.type === PlotType.MODEL) {
      options.orientation = this._entityOptions.orientation;
      delete this._entityOptions.orientation;
      options.model = clone(this._entityOptions);
      if (!defined(options.model.uri)) {
        options.model.uri = URL.buildModuleUrl('./assets/Wood_Tower.gltf');
      }
    }
    if (this._options.label && this._type !== PlotType.LABEL) {
      options.label = Cesium.clone(this._options.label);
    }
    this._entityOptions = options;
    return new Cesium.Entity(this._entityOptions);
  }

  /**
   * 比较两个点位置是否相同
   * @param  {PointPlot} point
   * @return {Bool}
   */
  equal(point) {
    return PointPlot.equal(this, point);
  }
  /**
   * 点的文字描述
   * @type {String}
   */
  get text() {
    return this._text;
  }
  set text(val) {
    if (this.entity.label) {
      this.entity.label.text = val;
    } else {
      const options = Cesium.clone(this._entityOptions);
      options.text = val;
      this.addLabel(options);
    }
    this._text = val;
  }

  /**
   * 添加文字
   * @param {Object} options 描述一个Cesium.LabelGraphics.
   */
  addLabel(options) {
    this.entity.label = options;
  }

  /**
   * 更新点样式
   * @param  {Object} style 描述一个Cesium.PointGraphics
   */
  updatePointStyle(style) {
    if (!style || !this.entity.point) {
      return;
    }
    for (const s in style) {
      if (style.hasOwnProperty(s)) {
        this.entity.point[s] = style[s];
      }
    }
  }

  /**
   * 更新文字样式
   * @param  {Object} style 描述一个Cesium.LabelGraphics
   */
  updateLabelStyle(style) {
    if (!style || !this.entity.label) {
      return;
    }
    for (const s in style) {
      if (style.hasOwnProperty(s)) {
        this.entity.label[s] = style[s];
      }
    }
  }

  /**
   * 更新模型样式
   * @param  {Object} style 描述一个Cesium.ModelGraphics
   */
  updateModelStyle(style) {
    if (!style || !this.entity.model) {
      return;
    }
    for (const s in style) {
      if (style.hasOwnProperty(s)) {
        this.entity.model[s] = style[s];
      }
    }
  }

  /**
   * 更新图标样式
   * @param  {Object} style 描述一个Cesium.BillboardGraphics
   */
  updateBillboardStyle(style) {
    if (!style || !this.entity.billboard) {
      return;
    }
    for (const s in style) {
      if (style.hasOwnProperty(s)) {
        this.entity.billboard[s] = style[s];
      }
    }
  }

  /**
   * 更新图形位置,如果在使用该函数前没有调用<code>startEdit()</code>，位置更新将不会立即生效,在下次调用<code>startEdit()</code>后，此操作将更新到图形。
   * @param  {Cesium.Cartesian3} position
   */
  updatePosition(position) {
    this.positions.x = position.x;
    this.positions.y = position.y;
    this.positions.z = position.z;
  }

  /**
   * 比较两个点位置是否相同
   * @param  {PointPlot|Cesium.Cartesian3} left
   * @param  {PointPlot|Cesium.Cartesian3} right
   * @return {Bool}
   */
  static equal(left, right) {
    if (!defined(left) || !defined(right)) {
      return false;
    }
    if (left instanceof PointPlot) {
      left = left.positions;
    }
    if (right instanceof PointPlot) {
      right = right.positions;
    }
    return Cesium.Cartesian3.equals(left, right);
  }

  /**
   * 默认样式
   * @static
   * @type {Object}
   * @memberof PointPlot
   */
  static defaultStyle = {
    color: Cesium.Color.RED,
    pixelSize: 5,
    outlineColor: Cesium.Color.WHITE,
    outlineWidth: 3,
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
  }

  /**
   * 将Cartesian3坐标转换为经纬度
   * @param  {Cartesian3|PointPlot} point
   * @return {Object}  经纬度
   */
  static toDegrees(point) {
    if (point instanceof Cesium.Cartesian3) {
      return LonLat.fromCartesian(point);
    }
    if (point instanceof PointPlot) {
      return LonLat.fromCartesian(point.positions);
    }
  }
  /**
   * 将该要素导出成GeoJson
   * @return {String} GeoJson字符串
   */
  toGeoJson() {
    return PointPlot.toGeoJson(this);
  }


  /**
   * 将图形转为GeoJson
   * @param  {PointPlot} graphic
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
   * @return {PointPlot}
   */
  static fromGeoJson(json, style) {
    if (typeof json === 'string') {
      json = JSON.parse(json);
    }
    if (!defined(json.geometry) || !(defined(json.properties))) {
      return;
    }
    const type = json.properties.PlotType;
    if (type !== PlotType.POINT) {
      throw new CesiumProError('json没有包含一个有效的PointGraphic.');
    }
    const coordinate = json.geometry && json.geometry.coordinates;
    return PointPlot.fromCoordinates(coordinate, json.properties, style);
  }

  /**
   * 从坐标点生成点图形
   * @param  {Number[]} coordinate  包含经纬和纬度的数组
   * @param  {Style} [style=PointPlot.defaultStyle] 点样式
   * @return {PointPlot}
   */
  static fromCoordinates(coordinate, properties, style = PointPlot.defaultStyle) {
    const position = Cesium.Cartesian3.fromDegrees(...coordinate);
    const options = {
      position,
      properties,
      ...style,
    };
    return new PointPlot(options);
  }

  /**
   * 默认点样式
   * @type {Object}
   * @static
   * @memberof PointPlot
   */
  static defaultPointStyle = PointPlot.defaultStyle;

  /**
   * 默认文字样式
   * @type {Object}
   * @static
   * @memberof PointPlot
   */
  static defaultLabelStyle = {
    font: '30px Helvetica',
    fillColor: Cesium.Color.WHITE,
    showBackground: true,
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    scale: 1.0,
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    pixelOffset: new Cesium.Cartesian2(0, 0),
    heightReference: Cesium.HeightReference.NONE,
  }

  /**
   * 默认图标样式
   * @type {Object}
   * @memberof PointPlot
   */
  static defaultBillboardStyle = {
    verticalOrigin: Cesium.VerticalOrigin.BASELINE,
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
  }

  /**
   * 模型样式
   * @static
   * @type {Object}
   * @memberof PointPlot
   */
  static defaultModelStyle = {
    colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT,
    color: Cesium.Color.WHITE,
    colorBlendAmount: 0.5,
    minimumPixelSize: 64,
  }
}

export default PointPlot;

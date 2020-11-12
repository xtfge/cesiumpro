import Graphic from '../core/Graphic';
import GraphicType from '../core/GraphicType';
import defaultValue from '../core/defaultValue';
import defined from '../core/defined';
import CesiumProError from '../core/CesiumProError';
import CVT from '../core/CVT';
import clone from '../core/clone';
import URL from '../core/URL';

class PointGraphic extends Graphic {
  /**
   * 点图形，泛指图形位置由一个点确定的图形，包括普通点、文字、模型、广告牌等
   * @extends Graphic
   *
   * @param {Cesium.Viewer} viewer        [description]
   * @param {Object} entityOptions 除以下属性外，同Cesium.PointGraphics
   * @param {Cartesian3} [entityOptions.position] 点的位置信息
   * @param {Object} [options={}]  具有以下属性
   * @param {GraphicType} [options.type=GraphicType.POINT] 标绘类型
   */
  constructor(viewer, entityOptions, options = {}) {
    if (!defined(entityOptions.position)) {
      throw new CesiumProError('parameter position is required.');
    }
    super(viewer, options);
    this._entityOptions = entityOptions;
    this._positions = entityOptions.position;
    this._type = defaultValue(options.type, GraphicType.POINT);
    this._entity = this.createEntity();
    this.add();
  }
  /**
   * 该图形的几何描述，包括类型，经纬度等
   * @return {Object}
   */

  getGeometry() {
    const cartographic = PointGraphic.toDegrees(this.positions);
    const coordinates = [cartographic.lon, cartographic.lat];
    const type = GraphicType.getOGCType(this.type);
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
    if (this.type === GraphicType.POINT) {
      options.point = clone(this._entityOptions);
    }
    if (this.type === GraphicType.BILLBOARD) {
      options.billboard = clone(this._entityOptions);
      if (!defined(options.billboard.image)) {
        options.billboard.image = URL.buildModuleUrl('./assets/images/marker.png');
      }
    }
    if (this.type === GraphicType.LABEL) {
      options.label = clone(this._entityOptions);
    }
    if (this.type === GraphicType.MODEL) {
      options.orientation = this._entityOptions.orientation;
      delete this._entityOptions.orientation;
      options.model = clone(this._entityOptions);
      if (!defined(options.model.uri)) {
        options.model.uri = URL.buildModuleUrl('./assets/models/Wood_Tower.gltf');
      }
    }
    this._entityOptions = options;
    return new Cesium.Entity(this._entityOptions);
  }

  /**
   * 比较两个点位置是否相同
   * @param  {PointGraphic} point
   * @return {Bool}
   */
  equal(point) {
    return PointGraphic.equal(this.positions, point.positions);
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
   * @param  {PointGraphic} left
   * @param  {PointGraphic} right
   * @return {Bool}
   */
  static equal(left, right) {
    return Cesium.Cartesian3.equals(left.positions, point.positions);
  }

  /**
   * 默认样式
   * @type {Object}
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
   * @param  {Cartesian3|PointGraphic} point
   * @return {Object}  经纬度
   */
  static toDegrees(point) {
    if (point instanceof Cesium.Cartesian3) {
      return CVT.cartesian2Degrees(point);
    }
    if (point instanceof PointGraphic) {
      return CVT.cartesian2Degrees(point.positions);
    }
  }

  toGeoJson() {
    return PointGraphic.toGeoJson(this);
  }

  /**
   * 将图形转为GeoJson
   * @param  {PointGraphic} graphic
   * @return {Object}  graphic的geojson格式
   */
  static toGeoJson(graphic) {
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
   * 利用GeoJson创建图形
   * @param  {Cesium.Viewer} viewer
   * @param  {String|Object} json   json对象或字符串
   * @param  {Object} style  图形样式
   * @return {PointGraphic}
   */
  static fromGeoJson(viewer, json, style) {
    if (typeof json === 'string') {
      json = JSON.parse(json);
    }
    if (!defined(json.geometry) || !(defined(json.properties))) {
      return;
    }
    const type = json.properties.graphicType;
    if (type !== GraphicType.POINT) {
      throw new CesiumProError('json没有包含一个有效的PointGraphic.');
    }
    const coordinate = json.geometry && json.geometry.coordinates;
    return PointGraphic.fromCoordinates(viewer, coordinate, json.properties, style);
  }

  /**
   * 从坐标点生成点图形
   * @param {Cesium.Viewer} viewer
   * @param  {Number[]} coordinate  包含经纬和纬度的数组
   * @param  {Style} [style=PointGraphic.defaultStyle] 点样式
   * @return {PointGraphic}
   */
  static fromCoordinates(viewer, coordinate, properties, style = PointGraphic.defaultStyle) {
    const position = Cesium.Cartesian3.fromDegrees(...coordinate);
    const options = {
      position,
      properties,
      ...style,
    };
    return new PointGraphic(viewer, options);
  }

  /**
   * 默认点样式
   * @type {Object}
   */
  static defaultPointStyle = PointGraphic.defaultStyle;

  /**
   * 默认文字样式
   * @type {Object}
   */
  static defaultLabelStyle = {
    font: '36px sans-serif',
    fillColor: Cesium.Color.WHITE,
    showBackground: true,
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    scale: 0.5,
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    pixelOffset: new Cesium.Cartesian2(0, 0),
    heightReference: Cesium.HeightReference.NONE,
  }

  /**
   * 默认图标样式
   * @type {Object}
   */
  static defaultBillboardStyle = {
    verticalOrigin: Cesium.VerticalOrigin.BASELINE,
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
  }

  static defaultModelStyle = {
    colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT,
    color: Cesium.Color.WHITE,
    colorBlendAmount: 0.5,
    minimumPixelSize: 64,
  }
}

export default PointGraphic;

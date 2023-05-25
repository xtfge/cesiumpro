import defined from '../core/defined'
import defaultValue from '../core/defaultValue';
import Properties from '../core/Properties';
import abstract from '../core/abstract';
import uuid from '../core/guid';
import destroyObject from '../core/destroyObject'

const {
  CallbackProperty,
} = Cesium;

function toCallbackProperty(values) {
  return new CallbackProperty(() => values, false);
}
class BasePlot {
  /**
   * 可编辑的几何图形基类，定义了可编辑几何图形的公共属性和操作方法，一般做为某种图形的父类使用，不要直接创建它。
   * @param {Object} options   具有以下属性
   * @param {Object} entityOptions 描述一个实体对象
   */
  constructor(entityOptions, options = {}) {
    this._type = undefined;
    this._properties = undefined;
    this._show = true;
    this._id = defaultValue(entityOptions.id, uuid());
    this._clampToGround = defaultValue(options.clampToGround);
    this._clampToModel = defaultValue(options.clampToModel);

  }
  /**
   * 图形高亮显示
   */
  highlightGraphic(highlight = true) {
    const highlightColor = BasePlot.highlightColor;
    if (this.entity && highlight) {
      this.entity.point && (this.entity.point.color = highlightColor);
      this.entity.polyline && (this.entity.polyline.material = highlightColor);
      this.entity.polygon && (this.entity.polygon.material = highlightColor);
      this.entity.polygon && (this.entity.polygon.outlineColor = highlightColor);
    } else {
      this.entity.point && (this.entity.point.color = this._entityOptions.point.color);
      this.entity.polyline && (this.entity.polyline.material = this._entityOptions.polyline.material);
      this.entity.polygon && (this.entity.polygon.material = this._entityOptions.polygon.material);
      this.entity.polygon && (this.entity.polygon.outlineColor = this._entityOptions.polygon.outlineColor);
    }
  }
  /**
   * 图形高亮时使用的颜色
   * @memberof BasePlot
   * @type {Cesium.Color}
   */
  static highlightColor = Cesium.Color.AQUA;
  /**
   * 是否依附地形
   * @type {Boolean}
   */
  get clampToGround() {
    return this._clampToGround;
  }
  set clampToGround(val) {
    this._clampToGround = val;
  }
  /**
   * 是否依附模型
   * @type {Boolean}
   */
  get clampToModel() {
    return this._clampToModel;
  }
  set clampToModel(val) {
    this._clampToModel = val;
  }

  /**
   * 图形id
   * @readonly
   * @type {String}
   */
  get id() {
    return this._id;
  }
  /**
   * 图形的顶点位置信息
   * @readonly
   * @return {Cartesian3[]|Cartesian3}
   */
  get positions() {
    return this._positions;
  }

  /**
   * 图形类型
   * @readonly
   * @type {GraphicType}
   */
  get type() {
    return this._type;
  }

  /**
   * 保存了描述该图形的所有属性信息
   * @type {Properties}
   * @example
   * const point=new CesiumPro.PointGraphic({
   * position:Cesium.Cartesian3.fromDegrees(110,30),
   * pixelSize:15
   * })
   * point.properties={
   * name:'point',
   * color:'red'}
   */
  get properties() {
    return this._properties;
  }
  set properties(val) {
    this._properties = new Properties(val)
  }

  /**
   * 包含了该图形几何信息的实体，场景将根据它渲染图形，且场景中任何对该图形的操作都直接作用于其实体。
   * @readonly
   * @type {Cesium.Entity}
   */
  get entity() {
    return this._entity;
  }

  /**
   * 图形是否可见
   * @return {Bool} [description]
   */
  get show() {
    return this._show;
  }

  set show(v) {
    this._show = v;
    if (this.entity) {
      this.entity.show = this._show;
    }
  }

  /**
   * 销毁对象。
   */
  destroy() {
    console.log('destroy');
    this._entity = undefined;
    this._entityOptions = undefined;
    this._positions = undefined;
    this.properties && this.properties.destroy();
    this._properties = undefined;
    destroyObject(this);    
  }

  /**
   * 开始编辑几何信息，此时图形的顶点可以被修改、删除、移动。
   * 属性信息的编辑不需要调用该方法。
   * @fires BasePlot#preEdit
   */
  startEdit() {
    if (this.entity) {
      const callbackProperty = toCallbackProperty(this.positions);
      this.entity.position && (this.entity.position = callbackProperty);
      this.entity.polyline && (this.entity.polyline.positions = toCallbackProperty(this._nodePositions || this.positions));
      this.entity.polygon && (this.entity.polygon.hierarchy = toCallbackProperty(new Cesium.PolygonHierarchy(this.positions)));
    }
  }

  /**
   * 几何要素编辑完成后调用该方法，以降低性能消耗。
   * <p style='font-weight:bold'>建议在图形编辑完成后调用该方法，因为CallbackProperty对资源消耗比较大，虽然对单个图形来说，不调用此方法并不会有任何影响。</p>
   */
  stopEdit() {
    if (this.entity) {
      this.entity.position && (this.entity.position = this.positions);
      this.entity.polyline && (this.entity.polyline.positions = this._nodePositions || this.positions);
      this.entity.polygon && (this.entity.polygon.hierarchy = new Cesium.PolygonHierarchy(this.positions));
    }
  }

  /**
   * 创建属性信息
   * @private
   */
  createProperties() {
    const options = this._entityOptions;
    const {
      properties
    } = options;
    this._properties = new Properties(properties);
    delete options.properties;
  }

  /**
   * 创建实体
   * @private
   * @return {Entity}
   */
  createEntity() {
    this.createProperties();
  }

  /**
   * 将对象转为GeoJson格式
   * @return {Object}
   */
  toGeoJson() {
    abstract();
  }

  /**
   * 返回该图形的几何描述，包括类型，经纬度等，必须在派生类中实现它。
   * @return {Object}
   */
  getGeometry() {
    abstract();
  }
  static getEntityFromGeoJson(json) {
    if (!defined(json)) {
      return;
    }

    if (json.geometry && json.geometry.type.toUpperCase() === 'POLYGON') {
      let hierarchy = [];
      const coordinates = json.geometry.coordinates;
      if (!defined(coordinates) || !Array.isArray(coordinates)) {
        return;
      }
      for (let coords of coordinates) {
        if (!Array.isArray(coords)) {
          return;
        }
        for (let coor of coords) {
          const ll = Cesium.Cartesian3.fromDegrees(coor[0], coor[1]);
          if (!defined(ll)) return;
          hierarchy.push(ll);
        }
      };
      return new Cesium.Entity({
        polygon: {
          material: Cesium.Color.fromCssColorString('rgba(247,224,32,0.5)'),
          outlineColor: Cesium.Color.RED,
          perPositionHeight: false,
          hierarchy
        }
      })
    }

    return hierarchy
  }
}

export default BasePlot;

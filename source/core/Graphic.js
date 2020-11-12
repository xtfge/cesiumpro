import defined from './defined';
import defaultValue from './defaultValue';
import Event from './Event';
import checkViewer from './checkViewer';
import Properties from './Properties';
import abstract from './abstract';
import uuid from './guid';

const {
  CallbackProperty,
  ConstantPositionProperty,
} = Cesium;

function toCallbackProperty(values) {
  return new CallbackProperty(() => values, false);
}
class Graphic {
  /**
   * 可编辑的几何图形基类，定义了可编辑几何图形的公共属性和操作方法，一般做为某种图形的父类使用，不要直接创建它。
   * @param {Cesium.Viewer} viewer
   * @param {Object} options   具有以下属性
   * @param {Object} entityOptions 描述一个实体对象
   */
  constructor(viewer, entityOptions, options = {}) {
    checkViewer(viewer);
    this._viewer = viewer;
    this._type = undefined;
    this._properties = undefined;
    this._show = true;
    this._id = defaultValue(options.id, uuid());
    this._dataSource = new Cesium.CustomDataSource('cesiumpro-graphic');
    this._root = this._dataSource.entities;
    this._node = undefined;

    this._preEdit = new Event();
    this._postEdit = new Event();
    this._preCreate = new Event();
    this._postCreate = new Event();
    this._preRemove = new Event();
    this._postRemove = new Event();
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
   * 保存所有图形实体的集合
   * @return {EntityCollection}
   */
  get root() {
    return this._root;
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
   * @readonly
   * @type {Properties} 描述该图形的所有属性信息
   */
  get properties() {
    return this._properties;
  }

  /**
   * 包含了该图形几何信息的实体，场景将根据它渲染图形，且场景中任何对该图形的操作都直接作用于其实体。
   * @readonly
   * @type {Cesium.Entity} 图形在场景中的实体
   */
  get entity() {
    return this._entity;
  }

  /**
   * 图形开始编辑前触发的事件，事件订阅者将以被编辑图形作为参数
   * @readonly
   * @Event
   * @type {Event}
   */
  get preEdit() {
    return this._preEdit;
  }

  /**
   * 图形编辑完成后触发的事件，事件订阅者将以被编辑图形作为参数
   * @readonly
   * @Event
   * @type {Event}
   */
  get postEdit() {
    return this._postEdit;
  }

  /**
   * 实体创建完成，添加到场景之前触发的事件，事件订阅者将以创建的实体作为参数。此时图形还没有添加到场景。
   * @readonly
   * @Event
   * @type {Event}
   */
  get preCreate() {
    return this._preCreate;
  }

  /**
   * 图形创建完成后触发的事件，事件订阅者将以被创建的实体作为参数，此时图形已经被添加到场景中。
   * @readonly
   * @Event
   * @type {Event}
   */
  get postCreate() {
    return this._postCreate;
  }

  /**
   * 图形被删除前触发的事件，事件订阅者将以被删除的图形作为参数
   * @readonly
   * @Event
   * @type {Event}
   */
  get preRemove() {
    return this._preRemove;
  }

  /**
   * 图形被删除后触发的事件，事件订阅者将以被删除的图形作为参数
   * @readonly
   * @Event
   * @type {Event}
   */
  get postRemove() {
    return this._postRemove;
  }

  /**
   * viewer
   * @readonly
   * @type {Cesium.Viewer}
   */
  get viewer() {
    return this._viewer;
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
   * 将实体添加到场景中
   * @fires Graphic#preCreate
   * @fires Graphic#postCreate
   */
  add() {
    this.preCreate.raise(this.entity);
    if (defined(this.viewer && defined(this.entity))) {
      this._viewer.entities.add(this.entity);
      this.postCreate.raise(this);
    }
  }

  /**
   * 将实体从场景中删除。
   * @fires Graphic#preRemove
   * @fires Graphic#postRemove
   */
  remove() {
    this.preRemove.raise(this);
    if (defined(this.viewer) && defined(this.entity)) {
      this._viewer.entities.remove(this.entity);
      this.postRemove.raise(this);
    }
  }

  /**
   * 销毁对象。
   */
  destroy() {
    if (defined(this.viewer) && defined(this.entity)) {
      this._viewer.entities.remove(this.entity);
    }
    this._viewer = undefined;
    this._entity = undefined;
    this._entityOptions = undefined;
    this._positions = undefined;
    this.properties && this.properties.destroy();
    this._properties = undefined;
  }

  /**
   * 定位到图形
   */
  zoomTo() {
    if (defined(this._viewer)) {
      this._viewer.flyTo([this.entity]);
    }
    if (this.entity.position) {
      const position = this.entity.position.getValue(this._viewer.clock.currentTime);
    }
  }

  /**
   * 开始编辑几何信息，此时图形的顶点可以被修改、删除、移动。
   * 属性信息的编辑不需要调用该方法。
   * @fires Graphic#preEdit
   */
  startEdit() {
    if (this.entity) {
      this.preEdit.raise(this);
      const callbackProperty = toCallbackProperty(this.positions);
      this.entity.position && (this.entity.position = callbackProperty);
      this.entity.polyline && (this.entity.polyline.positions = toCallbackProperty(this._nodePositions || this.positions));
      this.entity.polygon && (this.entity.polygon.hierarchy = toCallbackProperty(new Cesium.PolygonHierarchy(this.positions)));
    }
  }

  /**
   * @fires Graphic#postEdit
   * 几何要素编辑完成后调用该方法，以降低性能消耗。
   * <p style='font-weight:bold'>建议在图形编辑完成后调用该方法，因为CallbackProperty对资源消耗比较大，虽然对单个图形来说，不调用此方法并不会有任何影响。</p>
   */
  stopEdit() {
    if (this.entity) {
      const callbackProperty = toCallbackProperty(this.positions);
      this.entity.position && (this.entity.position = this.positions);
      this.entity.polyline && (this.entity.polyline.positions = this._nodePositions || this.positions);
      this.entity.polygon && (this.entity.polygon.hierarchy = new Cesium.PolygonHierarchy(this.positions));
      this.postEdit.raise(this);
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
    if (properties) {
      this._properties = new Properties(properties);
      delete options.properties;
    }
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
}

export default Graphic;

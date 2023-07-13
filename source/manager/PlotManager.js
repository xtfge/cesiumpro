import CursorTip from '../core/CursorTip';
import defaultValue from '../core/defaultValue';
import checkViewer from '../core/checkViewer';
import PointPlot from '../plot/PointPlot'
import PolylinePlot from '../plot/PolylinePlot';
import PolygonPlot from '../plot/PolygonPlot';
import NodePlot from '../plot/NodePlot';
import ArrowPlot from '../plot/ArrowPlot';
import PlotType from '../plot/PlotType'
import Event from '../core/Event';
import defined from '../core/defined';
import uuid from '../core/guid';
import pickPosition from '../core/pickPosition';
import rotateEnabled from '../core/rotateEnabled';
import ContextMenu from '../core/ContextMenu'
import destroyObject from '../core/destroyObject'
import { ArrowType } from '../../thirdParty/arrow';
const {
  LEFT_CLICK,
  MOUSE_MOVE,
  RIGHT_CLICK,
  LEFT_DOWN,
  LEFT_UP,
  LEFT_DOUBLE_CLICK,
  RIGHT_DOWN,
  RIGHT_UP
} = Cesium.ScreenSpaceEventType;
const PlotMode = {
  ready: 1,
  edit: 2,
  create: 3
}
// todo 1. 攻击箭头报对象已销毁的错误；2.攻击箭头单击添加控制点后形状错误
class PlotManager {
  /**
   * 交互绘图管理器
   * @param {Cesium.Viewer} viewer  viewer对象
   * @param {Object} options 具有以下属性
   * @param {String} [options.id]
   * @param {Object} [options.pointStyle]
   * @param {Object} [options.labelStyle]
   * @param {Object} [options.modelStyle]
   * @param {Object} [options.billboardStyle]
   * @param {Boolean} [options.contextEnabled=true] 是否创建右键菜单
   */
  constructor(viewer, options) {
    checkViewer(viewer);
    this._viewer = viewer;
    options = defaultValue(options, {});
    this._id = defaultValue(options.id, uuid());
    this._dataSource = new Cesium.CustomDataSource('cesiumpro-graphic_' + this._id);
    this._nodeDataSource = new Cesium.CustomDataSource('cesiumpro-graphic-node_' + this._id);
    this._viewer.dataSources.add(this._dataSource);

    this._viewer.dataSources.add(this._nodeDataSource);
    this._root = this._dataSource.entities;
    this._nodeRoot = this._nodeDataSource.entities;
    this._preEdit = new Event();
    this._postEdit = new Event();
    this._preCreate = new Event();
    this._postCreate = new Event();
    this._preRemove = new Event();
    this._postRemove = new Event();
    this._values = new Cesium.AssociativeArray();
    this._handler = new Cesium.ScreenSpaceEventHandler(this._viewer.canvas);
    this._pointStyle = defaultValue(options.pointStyle, PointPlot.defaultPointStyle);
    this._labelStyle = defaultValue(options.labelStyle, PointPlot.defaultLabelStyle);
    this._modelStyle = defaultValue(options.modelStyle, PointPlot.defaultModelStyle);
    this._billboardStyle = defaultValue(options.billboardStyle, PointPlot.defaultBillboardStyle);
    this._polylineStyle = defaultValue(options.polylineStyle, PolylinePlot.defaultStyle);
    this._polygonStyle = defaultValue(options.polygonStyle, PolygonPlot.defaultStyle);
    this._editEventHandler = new Cesium.ScreenSpaceEventHandler(this._viewer.canvas);
    this._viewer.screenSpaceEventHandler.removeInputAction(LEFT_DOUBLE_CLICK);
    this.showTip = defaultValue(options.showTip, true)

    this._mode = PlotMode.ready;

    /**
     * 右键菜单管理器
     * @type {ContextMenu}
     */
    options.contextEnabled = defaultValue(options.contextEnabled, true);
    if (options.contextEnabled) {
      this.contextMenu = this.createContext();
      this.addContextEventListener();
    }
    /**
     * 跟随鼠标移动的文字
     * @type {CursorTip}
     */
    this.cursorTip = new CursorTip({
      text: '',
      id: 'plot-manager-tip',
      viewer: this._viewer,
      show: false
    });
    /**
     * 当前处理激活状态的图形
     * @type {PointPlot|PolylinePlot|PolygonPlot}
     * @readonly
     */
    this.activeGraphic = undefined;
    /**
     * 激活右键菜单的图形
     * @private
     * @type {PointPlot|PolylinePlot|PolygonPlot}
     */
    this.selectedGraphic = undefined;
    // this.addEditEventListener();
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
   * 图形开始编辑前触发的事件，事件订阅者将以被编辑图形作为参数
   * @readonly
   * @type {Event}
   */
  get preEdit() {
    return this._preEdit;
  }

  /**
   * 图形编辑完成后触发的事件，事件订阅者将以被编辑图形作为参数
   * @readonly
   * @type {Event}
   * @type {Event}
   */
  get postEdit() {
    return this._postEdit;
  }

  /**
   * 实体创建完成，添加到场景之前触发的事件，事件订阅者将以创建的实体作为参数。此时图形还没有添加到场景。
   * @readonly
   * @type {Event}
   * @type {Event}
   */
  get preCreate() {
    return this._preCreate;
  }

  /**
   * 图形创建完成并成功添加到场景后触发的事件，事件订阅者将以被创建的实体作为参数，此时图形已经被添加到场景中。
   * @readonly
   * @type {Event}
   * @type {Event}
   */
  get postCreate() {
    return this._postCreate;
  }

  /**
   * 图形被删除前触发的事件，事件订阅者将以被删除的图形作为参数
   * @readonly
   * @type {Event}
   * @type {Event}
   */
  get preRemove() {
    return this._preRemove;
  }

  /**
   * 图形被删除后触发的事件，事件订阅者将以被删除的图形作为参数
   * @readonly
   * @type {Event}
   * @type {Event}
   */
  get postRemove() {
    return this._postRemove;
  }
  /**
   * 根实体
   * @type {Entity[]}
   * @readonly
   */
  get root() {
    return this._root;
  }
  /**
   * 从地图上选取点创建图形，系统会根据type监听需要的事件
   * @param  {PlotType} type 要创建的图形类型
   * @return {PointPlot|PolylinePlot|PolygonPlot}   创建好的几何图形
   */
  pick(type) {
    let singlePoint = false;
    if (PlotType.isPoint(type)) {
      singlePoint = true;
    }
    let graphic;
    this._mode = PlotMode.create;
    if (type === PlotType.POINT) {
      graphic = this.createPoint(this._pointStyle, this._labelStyle);
    } else if (type === PlotType.LABEL) {
      graphic = this.createLabel(this._labelStyle);
    } else if (type === PlotType.MODEL) {
      graphic = this.createModel(this._modelStyle, this._labelStyle);
    } else if (type === PlotType.BILLBOARD) {
      graphic = this.createBillboard(this._billboardStyle, this._labelStyle);
    } else if (type === PlotType.POLYLINE) {
      graphic = this.createPolyline(this._polylineStyle);
    } else if (type === PlotType.POLYGON) {
      graphic = this.createPolygon(this._polygonStyle);
    } else if (PlotType.isArrow(type)) {
      graphic = this.createArrow(this._polygonStyle, type);
    }
    this.activeGraphic = graphic;
    graphic.startEdit();
    this.addEventListener(singlePoint);
    return graphic;
  }
  /**
   * 创建一个点
   * @param  {Object} options 描述点的参数
   * @param {Object} [labelOptions] 描述一个label图形
   * @return {PointPlot}    点图形
   */
  createPoint(options, labelOptions) {
    const point = new PointPlot(options, {
      label: labelOptions
    });
    this.add(point);
    return point;
  }
  /**
   * 创建一个label
   * @param  {Object} options 描述label的参数
   * @return {PointPlot}    点图形
   */
  createLabel(options) {
    const label = new PointPlot(options, {
      type: PlotType.LABEL
    });
    this.add(label);
    return label;
  }
  /**
   * 创建一个模型
   * @param  {Object} options 描述模型的参数
   * @param {Object} [labelOptions] 描述一个label图形
   * @return {PointPlot}    点图形
   */
  createModel(options, labelOptions) {
    const model = new PointPlot(options, {
      type: PlotType.MODEL,
      label: labelOptions
    });
    this.add(model);
    return model;
  }
  /**
   * 创建一个点
   * @param  {Object} options 描述点的参数
   * @param {Object} [labelOptions] 描述一个label图形
   * @return {PointPlot}    点图形
   */
  createBillboard(options, labelOptions) {
    const mark = new PointPlot(options, {
      type: PlotType.BILLBOARD,
      label: labelOptions
    });
    this.add(mark);
    return mark;
  }
  /**
   * 创建一条线
   * @param  {Object} options 描述线的参数
   * @return {PolylinePlot}    线图形
   */
  createPolyline(options) {
    const pl = new PolylinePlot(options);
    this.add(pl);
    return pl;
  }
  /**
   * 创建一个点
   * @param  {Object} options 描述多边形的参数
   * @return {PolygonPlot}    多边形
   */
  createPolygon(options) {
    const pg = new PolygonPlot(options);
    this.add(pg);
    return pg;
  }
  /**
   * 创建一个箭头图形
   * @param  {Object} options 描述箭头的参数
   * @return {ArrowPlot}    箭头
   */
  createArrow(options, type) {
    const arrow = new ArrowPlot(options, {
      type
    })
    this.add(arrow);
    return arrow;
  }
  /**
   * 将实体添加到场景中
   * @param {PolylinePlot|PolygonPlot|PointPlot} graphic 需要添加到场景的图形
   */
  add(graphic) {
    this.preCreate.raise(graphic);
    if (defined(this.viewer && defined(graphic.entity))) {
      this.root.add(graphic.entity);
      this._values.set(graphic.id, graphic);
      this.postCreate.raise(graphic);
    }
  }

  /**
   * 将实体从场景中删除。
   * @param {PolylinePlot|PointPlot|PolygonPlot} graphic 要从场景中删除的图形
   */
  remove(graphic) {
    if (!defined(graphic)) {
      return;
    }
    this.preRemove.raise(graphic);
    if (defined(this.viewer) && defined(graphic.entity)) {
      this.root.remove(graphic.entity);
      this.postRemove.raise(graphic);
    }
    this._values.remove(graphic.id);
    this.activeGraphic && (this.activeGraphic = undefined);
  }
  /**
   * 根据索引获取图形
   * @param  {Number} index 索引
   * @return {PointPlot|PolylinePlot|PolygonPlot}   图形
   */
  get(index) {
    return this._values.values[index]
  }
  /**
   * 根据id获取图形
   * @param  {Number} id id
   * @return {PointPlot|PolylinePlot|PolygonPlot}   图形
   */
  getById(id) {
    return this._values.get(id);
  }
  /**
   * 判断是否包含一个实体
   * @param  {Entity}  entity 图形实体
   * @return {Boolean}  true表示包含
   */
  hasEntity(entity) {
    if (!defined(entity)) {
      return false;
    }
    return this._root.contains(entity);
  }
  /**
   * 从场景中移除所有图形，该方法并不会触发p{@link preRemove}和{@link postRemove}事件
   */
  removeAll() {
    this.root.removeAll();
    this.removeNodeGraphic();
    this._values.removeAll();
  }
  /**
   * 销毁组件
   */
  destroy() {
    this.removeAll();
    this.contextMenu && this.contextMenu.destroy();
    this.removeContextEventListener();
    this._viewer.dataSources.remove(this._dataSource)
    this._viewer.dataSources.remove(this._nodeDataSource);
    this.cursorTip.destroy();
    if (!this._handler.isDestroyed()) {
      this._handler.destroy();
    }
    destroyObject(this);
  }
  /**
   * 定位到图形
   * @param  {PolylinePlot|PolygonPlot|PointPlot|PointPlot[]|PolylinePlot[]|PolygonPlot[]} graphic 定位图形
   */
  zoomTo(graphic) {
    const entities = []
    if (Array.isArray(graphic)) {
      for (let g of graphic) {
        entities.push(g.entity)
      }
    } else {
      entities.push(graphic.entity);
    }
    if (defined(this._viewer)) {
      this._viewer.zoomTo(entities);
    }
  }
  /**
   * 当前管理器是否包一个图形
   * @param  {String|PointPlot|PolylinePlot|PolygonPlot} graphic 图形或图形id
   * @return {Boolean}  true表示包含
   */
  has(graphic) {
    if (typeof graphic === 'string') {
      return this._values.contains(graphic);
    } else {
      return this._values.values.includes(graphic);
    }
  }
  /**
   * 开始编辑
   * @param  {PointPlot|PolylinePlot|PolygonPlot} graphic 被编辑的要素
   */
  startEdit(graphic) {
    if (this.activeGraphic) {
      this.stopEdit(this.activeGraphic);
    }
    if (graphic) {
      graphic.startEdit();
      this.preEdit.raise(graphic);
      this.createNodeGraphic(graphic);
      this.activeGraphic = graphic;
      this.addEditEventListener();
      this.cursorTip.show = true;
      this.cursorTip.text = "单击节点选中"
    }
  }
  /**
   * 停止编辑
   * @param  {PointPlot|PolylinePlot|PolygonPlot} graphic 被编辑的要素
   */
  stopEdit(graphic) {
    if (graphic) {
      graphic.stopEdit();
      graphic.highlightGraphic(false);
      this._nodeRoot.removeAll();
      this.cursorTip.show = false;
      this.activeGraphic = undefined;
      this._mode = PlotMode.ready;
      this.postEdit.raise(graphic);
      this.removeEditListener && this.removeEditListener();      
    }
  }
  /**
   * @private
   */
  createNodeGraphic(graphic) {
    if (PlotType.isPoint(graphic.type)) {
      return;
    }
    const nodeGraphic = new NodePlot({
      positions: graphic._nodePositions,
      ...PointPlot.defaultStyle,
    });
    const nodes = nodeGraphic._values;
    for (let node of nodes) {
      this._nodeRoot.add(node)
    }
    this._nodeGraphic = nodeGraphic;
  }
  /**
   * @private
   */
  removeNodeGraphic() {
    this._nodeRoot.removeAll()
    this._nodeGraphic = undefined;
  }
  /**
   * @private
   */
  addEventListener(single = true) {
    if (!defined(this.activeGraphic)) {
      return;
    }
    const positions = this.activeGraphic.positions;
    const onClick = e => {
      const addNode = PlotType.isPoint(this.activeGraphic.type) ?
        this.activeGraphic.updatePosition.bind(this.activeGraphic) : 
        this.activeGraphic.addNode.bind(this.activeGraphic);
      const position = this.pickPosition(e.position);
      if (!defined(position)) {
        return;
      } 
      // if (this.activeGraphic._arrowType === ArrowType.attackarrow && this.positions.length > 1) {
      //   this.activeGraphic.popNode();
      // }
      if (defined(addNode)) {
        addNode(position);
      }
      if (single) {
        this._handler.removeInputAction(LEFT_CLICK);
        // this.activeGraphic.stopEdit();
        // this._mode = PlotMode.ready;
        this.stopEdit(this.activeGraphic);
      }
    }
    const onMouseMove = (e) => {
      const position = this.pickPosition(e.endPosition);
      if (!defined(position)) {
        return;
      }
      if (this.showTip) {
        this.cursorTip.show = true;
        this.cursorTip.text = "左键单击添加节点，右键结束。"
      }
      if (positions.length < 1) {
        return;
      }
      if (positions.length > 1) {
        this.activeGraphic.popNode();
      }
      this.activeGraphic.addNode(position);
    }
    const onRUp = () => {
      this._handler.removeInputAction(LEFT_CLICK);
      this._handler.removeInputAction(MOUSE_MOVE);
      this._handler.removeInputAction(RIGHT_UP);
      // //由于双击事件会触发两次单击事件，因此最后一个点会重复3次，删除其中两个
      // if (this.activeGraphic.type === PlotType.POLYLINE || this.activeGraphic.type === PlotType.POLYGON) {
      //   this.activeGraphic.popNode();
      //   this.activeGraphic.popNode();
      // }
      // this.activeGraphic.stopEdit();
      // this.activeGraphic = undefined;
      // this._mode = PlotMode.ready;
      this.stopEdit(this.activeGraphic);
      defined(this.contextMenu) && this.addContextEventListener();
    }
    if (!single) {
      this._handler.setInputAction(onMouseMove, MOUSE_MOVE);
      this._handler.setInputAction(onRUp, RIGHT_UP);
    }
    this._handler.setInputAction(onClick, LEFT_CLICK);
  }
  addEditEventListener() {
    const handler = this._editEventHandler;
    let dragging = false;
    const onClick = e => {
      defined(this.contextMenu) && (this.contextMenu.show = false);
      if (!defined(this.activeGraphic)) {
        return;
      }
      const feature = this._viewer.scene.pick(e.position);
      if (defined(feature) && feature.id instanceof Cesium.Entity) {
        if (this.hasEntity(feature.id)) {
          this.activeGraphic.highlightGraphic();
          this._nodeGraphic && (this._nodeGraphic.activeNode = undefined)
        } else if (this._nodeGraphic && this._nodeGraphic.has(feature.id)) {
          //设置处于激活状态的顶点
          //处理激活状态的顶点将高亮显示
          this._nodeGraphic.activeNode = feature.id.position.getValue(this._viewer.clock.currentTime);
          this.activeGraphic.highlightGraphic(false);
        } else {
          this._nodeGraphic.activeNode = undefined
          this.activeGraphic.highlightGraphic(false);
        }
      } else {
        this._nodeGraphic && (this._nodeGraphic.activeNode = undefined)
        this.activeGraphic && this.activeGraphic.highlightGraphic(false);
      }
    }
    const onMouseDown = () => {
      dragging = true;
      rotateEnabled(this._viewer, !dragging);
      handler.setInputAction(onMouseUp, LEFT_UP);
      handler.setInputAction(onMouseMove, MOUSE_MOVE);
    }
    const onMouseUp = (e) => {
      // const position = this.pickPosition(e.position);
      // this.updatePosition(position);
      dragging = false;
      rotateEnabled(this._viewer, !dragging);
      handler.removeInputAction(MOUSE_MOVE);
      handler.removeInputAction(LEFT_UP);
    }
    const onMouseMove = (e) => {
      const position = this.pickPosition(e.endPosition);
      this.updatePosition(position);
    }
    handler.setInputAction(onClick, LEFT_CLICK);
    handler.setInputAction(onMouseDown, LEFT_DOWN);
    this.removeEditListener = function() {
      handler.removeInputAction(MOUSE_MOVE);
      handler.removeInputAction(LEFT_UP);
      handler.removeInputAction(LEFT_CLICK);
      handler.removeInputAction(LEFT_DOWN);
      this.removeEditListener = undefined;
    }
  }
  addContextEventListener() {
    this._editEventHandler.setInputAction(e => {
      if (this._mode !== PlotMode.ready) {
        return;
      }
      const feat = this._viewer.scene.pick(e.position);
      const position = pickPosition(e.position, this._viewer, true);
      if (defined(feat) && this.hasEntity(feat.id)) {
        this.contextMenu.position = position;
        this.selectedGraphic = this.getById(feat.id.id);
        defined(this.contextMenu) && (this.contextMenu.show = true);
      }
    }, RIGHT_DOWN)
  }
  removeContextEventListener() {
    this._editEventHandler.removeInputAction(RIGHT_DOWN);
  }
  removeEditEventListener() {
    this._editEventHandler.removeInputAction(LEFT_CLICK);
    this._editEventHandler.removeInputAction(LEFT_DOWN)
  }
  updatePosition(cartesian) {
    const graphic = this.activeGraphic;
    if (!defined(graphic)) {
      return;
    }
    if (PlotType.isPoint(graphic.type)) {
      graphic.updatePosition(cartesian)
    } else {
      if (!defined(this._nodeGraphic) || !defined(this._nodeGraphic.activeIndex)) {
        return;
      }
      graphic.updateNode(this._nodeGraphic.activeIndex, cartesian);
    }
  }
  pickPosition(pixel) {
    if (!defined(this.activeGraphic)) {
      return;
    }
    const modelPosition = this.activeGraphic.clampToModel;
    return pickPosition(pixel, this._viewer);
  }
  /**
   * 为图形添加顶点
   * @param {PointPlot|PolylinePlot|PolygonPlot} graphic 图形
   * @param {Cartesian} node 顶点坐标
   * @param {Number} [index]  顶点索引,如果未定义将添加到最后
   */
  addNode(graphic, node, index) {
    graphic.addNode(node, index);
    if (this._nodeGraphic) {
      const entity = this._nodeGraphic.addNode(node, index);
      this._nodeRoot.add(entity);
    }
  }
  /**
   * 移除图形的顶点
   * @param {PointPlot|PolylinePlot|PolygonPlot} graphic 图形
   * @param {Number} [index]  顶点索引
   */
  removeNode(graphic, index) {
    graphic.removeNode && graphic.removeNode(index);
    if (this._nodeGraphic) {
      const node = this._nodeGraphic.removeNode(index);
      this._nodeRoot.remove(node);
    }
  }
  /**
   * 图形的可见性，该属性将对所有图形生效
   * @type {Boolean}
   */
  get show() {
    return this._root.show;
  }
  set show(val) {
    this._root.show = val;
  }
  /**
   * 点的样式
   * @type {Object}
   */
  get pointStyle() {
    return this._pointStyle;
  }
  set pointStyle(val) {
    this._pointStyle = val;
  }
  /**
   * 文字的样式
   * @type {Object}
   */
  get labelStyle() {
    return this._labelStyle;
  }
  set labelStyle(val) {
    this._labelStyle = val;
  }
  /**
   * 图标的样式
   * @type {Object}
   */
  get billboardStyle() {
    return this._billboardStyle;
  }
  set billboardStyle(val) {
    this._billboardStyle = val;
  }
  /**
   * 模型的样式
   * @type {Object}
   */
  get modelStyle() {
    return this._modelStyle;
  }
  set modelStyle(val) {
    this._modelStyle = val;
  }

  createContext() {
    this.contextMenu = new ContextMenu(this._viewer, {
      items: [{
        id: 'startEdit',
        text: "开始编辑",
        class: "fa fa-pencil-square-o",
        disabled: this.activeGraphic,
        callback: (item) => {
          if (this.selectedGraphic) {
            this.startEdit(this.selectedGraphic);
            const stopItem = this.contextMenu.getById('stopEdit');
            this.contextMenu.updateItemDistabled(stopItem, false);
            this.contextMenu.updateItemDistabled(item, true);
          }
        }
      }, {
        id: 'stopEdit',
        text: "停止编辑",
        class: "fa fa-floppy-o",
        disabled: !this.activeGraphic,
        callback: (item) => {
          if (this.selectedGraphic) {
            this.stopEdit(this.selectedGraphic);
            const startItem = this.contextMenu.getById('startEdit');
            this.contextMenu.updateItemDistabled(item, true);
            this.contextMenu.updateItemDistabled(startItem, false);
          }
        }
      }, {
        id: 'delete',
        text: '删除图形',
        class: "fa fa-times",
        callback: (item) => {
          this.remove(this.selectedGraphic);
        }
      }, {
        id: 'select',
        text: '选择顶点',
        class: "fa fa-mouse-pointer"
      }]
    })
    return this.contextMenu;
  }
}
export default PlotManager;

import CursorTip from '../core/CursorTip';
import defaultValue from '../core/defaultValue';
import checkViewer from '../core/checkViewer';
import PointGraphic from '../plot/PointPlot';
import PolylineGraphic from '../plot/PolylinePlot';
import PolygonGraphic from '../plot/PolygonPlot';
import Cartometry from '../core/Cartometry';
import CartometryType from '../core/CartometryType';
import Event from '../core/Event';
import LonLat from '../core/LonLat';
import guid from '../core/guid';

const formatText = function(value, mode, islast) {
  if (mode === CartometryType.SURFACE_DISTANCE ||
    mode === CartometryType.SPACE_DISTANCE ||
    mode === CartometryType.HEIGHT) {
    const preText = islast ? '总长度 ' : '';
    if (value > 10000) {
      return `${preText}${(value / 1000).toFixed(2)} km`;
    }
    return `${preText}${value.toFixed(2)} m`;
  }
  if (mode === CartometryType.SURFACE_AREA || mode === CartometryType.SPACE_AREA) {
    if (value > 1000 * 1000 * 10) {
      return `${(value / 1000 / 1000).toFixed(2)} km²`;
    }
    return `${value.toFixed(2)} m²`;
  }
  if (mode === CartometryType.ANGLE) {
    return `${(value % 360).toFixed(2)}°`;
  }
  return undefined;
};

class CartometryManager {
  /**
   *
   * 地图量算管理工具
   * @alias CartometryManager
   * @param {Cesium.Viewer} viewer Cesium.Viewer对象
   * @param {*} options 具有以下属性
   * @param {Object} [options.labelStyle=PointGraphic.defaultLabelStyle] 定义label样式,和Cesium.LabelGraphic具有相同的参数
   * @param {Object} [options.polylineStyle=PolylineGraphic.defaultStyle] 定义线样式，和Cesium.PolylineGraphic具有相同的参数
   * @param {Object} [options.polygonStyle=PolygonGraphic.defaultStyle] 定义多边形样式,和Cesium.PolygonGraphic具有相同的参数
   * @param {Object} [options.pointStyle=PointGraphic.defaultStyle] 定义点样式,和Cesium.PointGraphic具有相同的参数
   * @param {CartometryManager~Callback} [options.formatText] 格式化标签内容的函数
   * @param {Object} [options.nodeMode] 是否添加顶点，具有以下属性
   * @param {Boolean} [options.nodeMode.distance=true] 是否在距离量算时添加顶点
   * @param {Boolean} [options.nodeMode.area=false] 是否在面积量算时添加顶点
   * @param {Boolean} [options.nodeMode.angle=false] 是否在角度量算时添加顶点
   * @param {Boolean} [options.nodeMode.height=false] 是否在高度量算时添加顶点
   * @param {Object} [options.auxiliaryGeometry] 是否创建辅助要素，具有以下参数
   * @param {Boolean} [options.auxiliaryGeometry.distance=true] 是否在距离量算时创建辅助要素
   * @param {Boolean} [options.auxiliaryGeometry.area=false] 是否在面积量算时创建辅助要素
   * @param {Boolean} [options.auxiliaryGeometry.angle=false] 是否在角度量算时创建辅助要素
   * @param {Boolean} [options.auxiliaryGeometry.height=false] 是否在高度量算时创建辅助要素
   * @param {CartometryType} [options.mode=CartometryType.SURFACE_DISTANCE] 默认量算模式
   * @param {Object} [options.auxiliaryLineMaterial] 定义辅助线的样式
   * @param {Object} [options.auxiliaryPolygonMaterial] 定义辅助多边形的样式
   * @param {Object} [options.autoDepthTest=true] 是否在需要的时候自动开启地形调整
   */
  constructor(viewer, options = {}) {
    const {
      labelStyle,
      polylineStyle,
      polygonStyle,
      pointStyle,
    } = options;
    checkViewer(viewer);
    this._viewer = viewer;
    const defaultLabelStyle = PointGraphic.defaultLabelStyle;
    defaultLabelStyle.disableDepthTestDistance = Number.POSITIVE_INFINITY;
    this._labelStyle = defaultValue(labelStyle, defaultLabelStyle);
    this._polylineStyle = defaultValue(polylineStyle, PolylineGraphic.defaultStyle);
    this._polygonStyle = defaultValue(polygonStyle, PolygonGraphic.defaultStyle);
    this._pointStyle = defaultValue(pointStyle, PointGraphic.defaultStyle);

    this._startMeasure = new Event();
    this._stopMeasure = new Event();
    this._addNode = new Event();

    this.formatText = defaultValue(options.formatText, formatText);

    const defaultNode = {
      distance: true,
      area: false,
      height: false,
      angle: false,
    };
    const defaultAuxiliary = {
      distance: true,
      area: false,
      height: true,
      angle: true,
    };
    this._nodeMode = defaultValue(options.nodeMode, defaultNode);
    this._auxiliaryGeometry = defaultValue(options.auxiliaryGeometry, defaultAuxiliary);

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    this._handler = handler;
    this._values = {};
    this._mode = defaultValue(options.mode, CartometryType.SURFACE_DISTANCE);
    this._showTip = defaultValue(options.showTip, true);
    if (this._showTip) {
      this._tip = new CursorTip();
      this._tip.show = false;
    }    
    this._autoDepthTest = defaultValue(options.autoDepthTest, true);
    this.listening = false;
    const auxiliarylineMaterial = new Cesium.PolylineDashMaterialProperty({
      color: Cesium.Color.RED,
    });
    this._auxiliarylineMaterial = defaultValue(options.auxiliaryLineMaterial, auxiliarylineMaterial);
    const auxiliarypolygonMaterial = new Cesium.PolylineDashMaterialProperty({
      color: Cesium.Color.RED,
    });
    this._depthTestAgainstTerrain = this._viewer.scene.globe.depthTestAgainstTerrain;
    this._auxiliaryPolygonMaterial = defaultValue(options.auxiliaryPolygonMaterial, auxiliarypolygonMaterial);
  }

  /**
   * Cesium Viewer对象，
   * @type Viewer
   * @readonly
   * @return {Cesium.Viewer}
   */
  get viewer() {
    return this.viewer;
  }

  /**
   * 定义label样式，同Cesium.LabelGraphic
   * @return {Object}
   */
  get labelStyle() {
    return this._labelStyle;
  }

  set labelStyle(v) {
    this._labelStyle = v;
  }

  /**
   * 定义线样式，同Cesium.PolylineGraphic
   * @return {Object}
   */
  get polylineStyle() {
    return this._polylineStyle;
  }

  set polylineStyle(v) {
    this._polylineStyle = v;
  }

  /**
   * 定义Polygon样式，同Cesium.PolygonGraphic
   * @return {Object}
   */
  get polygonStyle() {
    return this._polygonStyle;
  }

  set polygonStyle(v) {
    this._polygonStyle = v;
  }

  /**
   * 定义Point样式，同Cesium.PointGraphic
   * @return {Object}
   */
  get pointStyle() {
    return this._pointStyle;
  }

  set pointStyle(v) {
    this._pointStyle = v;
  }

  /**
   * 开始测量时触发的事件
   * @type {Event}
   */
  get startMeasure() {
    return this._startMeasure;
  }

  /**
   * 结束测量时触发的事件
   * @type {Event}
   */
  get stopMeasure() {
    return this._stopMeasure;
  }

  /**
   * 添加节点时触发的事件
   * @type {Event}
   */
  get addNode() {
    return this._addNode;
  }

  /**
   * 跟随鼠标的文字
   * @type {CursorTip}
   */
  get tip() {
    return this._tip;
  }

  /**
   * 获得或设置地图量算的类型
   * @type {CartometryType}
   * @return {}
   */
  get mode() {
    return this._mode;
  }

  set mode(mode) {
    if (CartometryType.validate(mode)) {
      this._mode = mode;
    } else {
      console.warn('CartometryManaer:无效的测量模式');
    }
  }

  /**
   * 开始监听鼠标事件，并获取鼠标所在的位置，包括单击，移动，右击，不建议直接调用该方法，因为开始量算后系统会自动调用。
   * @private
   * @param {CartometryType} mode 量算模式
   * @param {Array} [positions=[]] 用于存储点位信息
   */
  addEventListener(mode, positions = []) {
    this._listening = true;
    const modeLabel = CartometryType.getKey(mode);
    const label = /.*_?(distance|area|height|angle)$/.exec(modeLabel.toLowerCase());
    let showNode = false;
    let showAuxiliary = false;
    if (label && label[1]) {
      showNode = this._nodeMode[label[1]];
      showAuxiliary = this._auxiliaryGeometry[label[1]];
    }

    const onClick = (e) => {
      const cartesian = this.pickPosition(e.position);
      cartesian && positions.push(cartesian);
      if (showNode) {
        this.createNode(cartesian);
      }
      if (showAuxiliary) {
        this.createAuxiliaryGraphic(positions, cartesian, mode);
      }
      this.addNode.raise({
        mode,
        position: cartesian,
        id: this.gid
      });
      if (mode === CartometryType.HEIGHT || mode === CartometryType.ANGLE) {
        if (this.tip && positions.length === 1) {
          this.tip.text = '单击地图确定终点.';
        }
        if (positions.length === 2) {
          this.removeEventListener();
          let labelPosition = positions[0];
          let value;
          if (mode === CartometryType.HEIGHT) {
            value = this.getHeight(positions);
            const startC = LonLat.fromCartesian(positions[0]);
            const endC = LonLat.fromCartesian(positions[1]);
            const lowerPoint = startC.alt < endC.alt ? startC : endC;
            labelPosition = Cesium.Cartesian3.fromDegrees(lowerPoint.lon, lowerPoint.lat, (endC.alt + startC.alt) / 2)
          } else {
            value = this.getAngle(positions);
          }
          this.createLabel(labelPosition, value);
          this.stopMeasure.raise({
            mode,
            label: value,
            graphic: this._values[this.gid],
            id: this.gid
          });
        }
      }
    };
    const onrClick = (e) => {
      const cartesian = this.pickPosition(e.position);
      this.removeEventListener();
      if (showNode && cartesian) {
        this.createNode(cartesian);
      }
      let text;
      if (cartesian && (mode !== CartometryType.HEIGHT || mode !== CartometryType.ANGLE)) {
        positions.pop();
        positions.length && cartesian && positions.push(cartesian);
        this.addNode.raise({
          mode,
          position: cartesian,
          id: this.gid
        });
      }
      if (mode === CartometryType.SURFACE_DISTANCE || mode === CartometryType.SPACE_DISTANCE) {
        text = this.getDistance(positions, mode);
        this.createLabel(cartesian || positions[positions.length - 1], text);
      }
      if (mode === CartometryType.SURFACE_AREA || mode === CartometryType.SPACE_AREA) {
        text = this.getArea(positions, mode);
        this.createLabel(cartesian || positions[positions.length - 1], text);
      }
      this.stopMeasure.raise({
        mode,
        label: text,
        graphic: this._values[this.gid],
        id: this.gid
      });
    };
    const onMousemove = (e) => {
      if (this.tip) {
        this.tip.position = e.endPosition;
      }
      if (mode === CartometryType.HEIGHT || mode === CartometryType.ANGLE) {
        return;
      }
      const cartesian = this.pickPosition(e.endPosition);
      if (positions.length > 1) {
        cartesian && positions.pop();
      }
      if (positions.length > 0) {
        cartesian && positions.push(cartesian);
      }
    };
    const handler = this._handler;
    handler.setInputAction(onClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler.setInputAction(onMousemove, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.setInputAction(onrClick, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  /**
   * 移除事件监听
   * @private
   */
  removeEventListener() {
    const handler = this._handler;
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    this._listening = false;
    if (this.tip) {
      this.tip.show = false;
    }
    if (this._autoDepthTest) {
      this._viewer.depthTest = this._depthTestAgainstTerrain;
    }
  }

  /**
   * 清除所有量算结果
   */
  clear() {
    const values = Object.values(this._values);
    for (const vs of values) {
      for (let v of vs) {
        this._viewer.entities.remove(v);
      }
    }
    this._values = {};
  }

  /**
   * 销毁对象
   */
  destroy() {
    this.clear();
    this.removeEventListener();
    if (!this._handler.isDestroyed()) {
      this._handler.destroy();
    }
    this._viewer = undefinesd;
  }

  /**
   * 根据坐标计算距离。
   * @param  {Array} position 需要计算距离的点
   * @param {CartometryType} mode 距离类型，贴地距离/空间距离
   * @return {Number}          距离,单位:米
   */
  getDistance(position, mode) {
    if (position.length < 2 || !position[0] || !position[1]) {
      return '起点';
    }
    let distance;
    if (mode === CartometryType.SURFACE_DISTANCE) {
      distance = Cartometry.surfaceDistance(position);
    } else if (mode === CartometryType.SPACE_DISTANCE) {
      distance = Cartometry.spaceDistance(position);
    }
    return this.formatText(distance, mode, !this._listening);
  }

  /**
   * 根据坐标计算面积。
   * @param  {Array} positions 要计算面积的点
   * @param  {CartometryType} mode      计算模式,贴地面积/空间面积
   * @return {Number}           面积，单位:平方米
   */
  getArea(positions, mode) {
    let area;
    if (mode === CartometryType.SURFACE_AREA) {
      area = Cartometry.surfaceArea(positions);
    } else {
      area = Cartometry.spaceArea(positions);
    }
    return this.formatText(area, mode, !this._listening);
  }

  /**
   * 根据坐标计算相邻两个点之间的高度差。
   * @param  {Cesium.Cartesian3[]} positions 坐标集合
   * @return {Number}           两点之间的高度差，单位：米
   */
  getHeight(positions) {
    const heights = Cartometry.heightFromCartesianArray(positions);
    return this.formatText(Math.abs(heights[0]), CartometryType.HEIGHT);
  }

  /**
   * 计算向量方位角。
   * @param  {Cesium.Cartesian3[]} positions 构成向量的坐标，第一个点为起点，第二个点为终点，多余的点会被抛弃
   * @return {Number} 向量与正北方向的夹角，单位：度
   */
  getAngle(positions, mode) {
    const angle = Cartometry.angleBetweenNorth(positions[0], positions[1]);
    return this.formatText(angle, CartometryType.ANGLE);
  }

  /**
   * 开始量算,开启鼠标事件监听，包括点击、移动、右击，标绘结束后自动移除事件监听。
   * @param  {CartometryType} mode 量算模式(类型)
   * @param {Array} [positions] 通过鼠标拾取的点
   */
  do(mode, positions = []) {
    if (!this._depthTestAgainstTerrain) {
      if (!this._autoDepthTest) {
        console.warn('depthTestAgainstTerrain未开启,点位获取可能不准确.');
      } else {
        this._viewer.depthTest = true;
      }
    }

    if (this.tip) {
      this.tip.show = true;
    }
    mode = defaultValue(mode, this.mode);
    const valid = CartometryType.validate(mode);
    if (!valid) {
      console.warn('无效的测量模式'); // WARNING: 无效的测量模式
      return;
    }
    this.gid = guid();
    this._values[this.gid] = [];
    if (this.tip) {
      if (mode === CartometryType.HEIGHT || mode === CartometryType.ANGLE) {
        this.tip.text = '单击地图确定起点.';
      } else {
        this.tip.text = '单击地图添加节点，右击地图结束量算';
      }
    }
    this.startMeasure.raise({mode, id: this.gid});
    let options;
    if (mode === CartometryType.SPACE_DISTANCE || mode === CartometryType.HEIGHT) {
      options = this.polylineStyle;
      options.clampToGround = false;
      options.positions = new Cesium.CallbackProperty(() => positions, false);
      this.createPolyline(options);
    } else if (mode === CartometryType.SURFACE_DISTANCE ||
      mode === CartometryType.ANGLE) {
      options = this.polylineStyle;
      options.clampToGround = true;
      options.positions = new Cesium.CallbackProperty(() => positions, false);
      this.createPolyline(options);
    } else if (mode === CartometryType.SPACE_AREA) {
      options = this.polygonStyle;
      options.outline = false;
      options.perPositionHeight = true;
      options.heightReference = Cesium.HeightReference.NONE;
      options.hierarchy = new Cesium.CallbackProperty(
        () => new Cesium.PolygonHierarchy(positions),
        false,
      );
      this.createPolygon(options);
    } else if (mode === CartometryType.SURFACE_AREA) {
      options = this.polygonStyle;
      options.perPositionHeight = false;
      options.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
      options.hierarchy = new Cesium.CallbackProperty(
        () => new Cesium.PolygonHierarchy(positions),
        false,
      );
      this.createPolygon(options);
    }
    this.addEventListener(mode, positions);
  }

  /**
   * 开启地面距离量算，和<code>do(CesiumPro.CartometryType.SURFACE_DISTANCE)</code>效果相同。
   * @returns {Number} 贴地距离，单位：米
   */
  surfaceDistance() {
    this.do(CartometryType.SURFACE_DISTANCE);
  }

  /**
   * 开启空间距离量算，和<code>do(CesiumPro.CartometryType.SPACE_DISTANCE)</code>效果相同。
   * @returns {Number} 空间距离，单位：米
   */
  spaceDistance() {
    this.do(CartometryType.SPACE_DISTANCE);
  }

  /**
   * 开启贴地面积量算，和<code>do(CesiumPro.CartometryType.SURFACE_AREA)</code>效果相同。
   * @return {Number} 贴地面积，单位：平方米
   */
  surfaceArea() {
    this.do(CartometryType.SURFACE_AREA);
  }

  /**
   * 开启空间面积量算，和<code>do(CesiumPro.CartometryType.SPACE_AREA)</code>效果相同。
   * @return {Number} 空间面积，单位：平方米
   */
  spaceArea() {
    this.do(CartometryType.SPACE_AREA);
  }

  /**
   * 开启高度量算，和<code>do(CesiumPro.CartometryType.HEIGHT)</code>效果相同。
   * @return {Number} 高度差，单位：米
   */
  height() {
    this.do(CartometryType.HEIGHT);
  }

  /**
   * 开启角度量算，和<code>do(CesiumPro.CartometryType.ANGLE)</code>效果相同。
   * @return {Number} 方位角，单位：度
   */
  angle() {
    this.do(CartometryType.ANGLE);
  }

  /**
   * @private
   * 屏幕坐标转笛卡尔坐标。
   * @param  {Cartesian2} pixel  屏幕坐标
   * @return {Cartesian3}        笛卡尔坐标
   */
  pickPosition(pixel) {
    const viewer = this._viewer;
    let cartesian;
    const ray = viewer.camera.getPickRay(pixel);
    cartesian = viewer.scene.globe.pick(ray, viewer.scene);
    const feat = viewer.scene.pick(pixel);
    if (feat) {
      if (viewer.scene.pickPositionSupported) {
        cartesian = viewer.scene.pickPosition(pixel);
      } else {
        console.warn('This browser does not support pickPosition.');
      }
    }
    return cartesian;
  }

  /**
   * @private
   * @param  {} options [description]
   * @return {}         [description]
   */
  createNode(cartesian) {
    if (!cartesian) {
      return;
    }
    const pointOptions = this.pointStyle;
    const point = this._viewer.entities.add({
      position: cartesian,
      point: pointOptions,
    });
    this._values[this.gid].push(point);
    return point;
  }

  /**
   * @private
   * @param  {} options
   */
  createLabel(cartesian, text) {
    const labelOptions = this.labelStyle;
    labelOptions.text = text;
    const coor = LonLat.fromCartesian(cartesian)
    labelOptions.pixelOffset = new Cesium.Cartesian3(0, 0, coor.height > 0 ? -coor.height : 0);
    const label = this._viewer.entities.add({
      position: cartesian,
      label: labelOptions,
    });
    this._values[this.gid].push(label);
    return label;
  }

  /**
   * @private
   * @param  {} options [description]
   * @return {}         [description]
   */
  createPolygon(options) {
    const pg = this._viewer.entities.add({
      polygon: options,
    });
    this._values[this.gid].push(pg);
    return pg;
  }

  /**
   * @private
   * @param  {} options [description]
   * @return {}         [description]
   */
  createPolyline(options) {
    const pl = this._viewer.entities.add({
      polyline: options,
    });
    this._values[this.gid].push(pl);
    return pl;
  }

  /**
   * @private
   * 为高度量算创建辅助线
   * @param  {} potitions [description]
   * @return {}           [description]
   */
  _createAuxiliaryGraphicforHeight(positions) {
    if (positions.length !== 2) {
      return;
    }
    const startC = LonLat.fromCartesian(positions[0]);
    const endC = LonLat.fromCartesian(positions[1]);
    let lowerPoint, higherPoint;
    if (startC.alt < endC.alt) {
      lowerPoint = startC;
      higherPoint = endC
    } else {
      lowerPoint = endC;
      higherPoint = startC
    }
    const tmp = new LonLat(lowerPoint.lon, lowerPoint.lat, higherPoint.alt);
    const pts = [positions[0], tmp.toCartesian(), positions[1]];
    const pl = this._viewer.entities.add({
      polyline: {
        positions: pts,
        material: this._auxiliarylineMaterial,
        width: this.polylineStyle.width || 3,
      },
    });
    this._values[this.gid].push(pl);
  }

  /**
   * 为距离量算创建辅助要素
   * @private
   * @param  {Cesium.Cartesian3} cartesian [description]
   * @param  {} text      [description]
   * @return {}           [description]
   */
  _createAuxiliaryGraphicforDisgance(cartesian, text) {
    this.createLabel(cartesian, text);
  }

  /**
   * 为角度量算创建辅助要素
   * @private
   * @param  {} cartesian [description]
   * @return {}           [description]
   */
  _createAuxiliaryGraphicforAngle(positions) {
    if (positions.length !== 2) {
      return;
    }
    const distance = Cartometry.spaceDistance(positions);
    const matrix = new Cesium.Transforms.eastNorthUpToFixedFrame(positions[0]);
    const inverseMatrix = new Cesium.Matrix4();
    Cesium.Matrix4.inverseTransformation(matrix, inverseMatrix);
    // const x = Cesium.Matrix4.multiplyByPoint(matrix, new Cesium.Cartesian3(distance, 0, 0), new Cesium.Cartesian3);
    const y = Cesium.Matrix4.multiplyByPoint(matrix, new Cesium.Cartesian3(0, distance, 0), new Cesium.Cartesian3());
    const options = {
      polyline: {
        positions: [positions[0], y],
        material: this._auxiliarylineMaterial,
        width: this.polylineStyle.width || 3,
        clampToGround: true,
      },
    };
    const pl = this._viewer.entities.add(options);
    this._values[this.gid].push(pl);
  }

  /**
   * 创建辅助要素
   * @private
   */
  createAuxiliaryGraphic(position, cartesian, mode) {
    if (mode === CartometryType.SPACE_DISTANCE || mode === CartometryType.SURFACE_DISTANCE) {
      const {
        length,
      } = position;
      const text = this.getDistance([position[length - 3], position[length - 2]], mode);
      this._createAuxiliaryGraphicforDisgance(cartesian, text);
    } else if (mode === CartometryType.HEIGHT) {
      this._createAuxiliaryGraphicforHeight(position);
    } else if (mode === CartometryType.ANGLE) {
      this._createAuxiliaryGraphicforAngle(position);
    }
  }

  /**
   * 处理显示文本的回调函数
   * @callback CartometryManager~Callback
   *
   * @param {Number} value 量算结果，距离、面积或角度
   * @param {CartometryType} mode 量算模式
   * @param {Boolean} isLast 是否是最后一个点
   * @returns {String} 格式化的文本内容
   */
  callback(value, mode, isLast) {

  }
}
export default CartometryManager;

/* eslint-disable no-shadow */
/* eslint-disable class-methods-use-this */
/* eslint-disable radix */
/* eslint-disable import/named */
import cvt from './CVT';
import $ from '../thirdParty/jquery';
import { CesiumBillboard, CesiumLabel, CesiumModel } from './Graphic';
import GraphicType from './GraphicType';
import pointVisibilityOnEarth from './pointVisibilityOnEarth';
import CursorTip from './CursorTip';
import Manager from './Manager';
import uuid from './uuid';
import Event from './Event';

const { defined } = Cesium;
const { LEFT_CLICK } = Cesium.ScreenSpaceEventType;
const { RIGHT_CLICK } = Cesium.ScreenSpaceEventType;
const { MOUSE_MOVE } = Cesium.ScreenSpaceEventType;
function setString(str, len) {
  let strlen = 0;
  let s = '';
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 128) {
      strlen += 2;
    } else {
      strlen++;
    }
    s += str.charAt(i);
    if (strlen >= len) {
      return `${s}...`;
    }
  }
  return s;
}
/**
 * billboard,label,model标绘管理器
 * @param {Viewer} viewer cesium Viewer对象
 * @param {Object} options 具有以下属性
 * @param {Object} [option.markerOptions=CesiumBillboard.defaultStyle] billboard样式
 * @param {Object} [option.labelOptions=CesiumBillboard.defaultLabelStyle] label样式
 * @param {Object} [option.modelOptions=CesiumModel.defaultStyle] model样式
 */





class MarkerManager extends Manager {
  constructor(viewer, options = {
    markerOptions: CesiumBillboard.defaultStyle,
    labelOptions: CesiumBillboard.defaultLabelStyle,
    modelOptions: CesiumModel.defaultStyle,
  }) {
    super();
    const { markerOptions, labelOptions, modelOptions } = options;
    if (viewer instanceof Cesium.Viewer) {
      this._viewer = viewer;
    }
    if (!Cesium.defined(this._viewer)) {
      return;
    }
    /**
      * 表示当前添加的标记类型,marker,label,model
      */

    this.markMode = 'marker';
    this._properties = {};
    this.defaultImage = CesiumBillboard.defaultStyle.image;
    this.selectedImage = undefined;
    this.popWinPosition = undefined;
    this.markerid = undefined;
    this.markerOptions = markerOptions;
    this.labelOptions = labelOptions;
    this.modelOptions = modelOptions;
    this.cursorTip = new CursorTip(
      '左键标绘，右键结束.',
      'marker-tip',
      viewer,
    );
    this.cursorTip.show = false;

    this.handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    this.manager = new Map();
    this.pickHandler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

    this._importEvent = new Event();
    this._deleteEvent = new Event();
    this.init(this._viewer);
  }

  /**
   * @type Event
   * @readonly
   */
  get importEvent() {
    return this._importEvent;
  }

  /**
   * @type Event
   * @readonly
   */
  get deleteEvent() {
    return this._deleteEvent;
  }

  /**
   * 要素属性
   */
  get properties() {
    return this._properties;
  }

  set properties(v) {
    this._properties = v;
  }

  /**
   * 初始化方法
   * @param {Viewer} viewer Cesium Viewer对象
   */
  init(viewer) {
    if (viewer instanceof Cesium.Viewer === false) {
      throw new Error('viewer不是一个有效的Cesium Viewer对象.');
    }
    const { handler } = this;
    const self = this;
    const { manager } = this;
    // 气泡跟随地球移动
    viewer.scene.postRender.addEventListener(() => {
      if (defined(self.popWinPosition)) {
        const pos = cvt.cartesian2Pixel(self.popWinPosition, viewer);

        const ele = document.getElementById('popContainer');
        if (!ele) {
          return;
        }
        ele.style.left = `${pos.x - 100 - 5}px`;
        ele.style.top = `${pos.y - 110}px`;

        const curPos = self.popWinPosition;
        // 标记转到地球背面隐藏气泡
        if (pointVisibilityOnEarth(curPos, self._viewer)) {
          ele.style.display = 'block';
        } else {
          ele.style.display = 'none';
        }

        // ele.style.display = "block";
      }
    });
    const showTip = function (e) {
      const obj = viewer.scene.pick(e.position);
      if (
        defined(obj)
                && obj.id instanceof Cesium.Entity
                && obj.id.gvtype === GraphicType.MARKER
      ) {
        //   self.popWinPosition = cvt.pixel2Cartesian(e.position, viewer);
        self.selectedMarker = manager.get(obj.id.gvid);
        if (self.popDiv) {
          self.destroyPopPanle();
        } else {
          self.createPopPanel();
        }
      } else {
        self.destroyPopPanle();
      }
    };

    handler.setInputAction(showTip, LEFT_CLICK);
  }

  /**
   * 开始拾取marker，调用该方法后开始监听鼠标单击，添加标记
   * @param {string} type表示何种标记,marker:billboard，label:label,model:model
   * @param {string} mode如果mode不是single，将连续添加标记
   */
  pick(type = 'marker', mode = 'single') {
    this.markMode = type;
    const viewer = this._viewer;
    this.cursorTip.show = true;
    const handler = this.pickHandler;
    const self = this;
    const id = this.generateId();
    self.markerid = id;
    const { manager } = this;

    const pick = function (e) {
      const cartesian = cvt.pixel2Cartesian(e.position, viewer);
      if (Cesium.defined(cartesian)) {
        // mp.position = cartesian;
        let marker;
        if (type === 'marker') {
          marker = self.createMarker(cartesian);
        } else if (type === 'label') {
          marker = self.createLabel(cartesian);
        } else if (type === 'model') {
          marker = self.createModel(cartesian);
        } else {
          // 默认marker
          marker = self.createMarker(cartesian);
        }
        self.visible = true;
        manager.set(id, marker);
        marker.gvid = id;
        // marker.gvname = "未命名" + viewer.entities.values.length;

        self.selectedMarker = marker;
        self.activeMarker = marker;

        self.cursorTip.show = false;
        if (type === 'model') {
          self.activeMarker = undefined;
        }
        if (mode === 'single') {
          handler.removeInputAction(LEFT_CLICK);
          handler.removeInputAction(RIGHT_CLICK);
        }
        // const evt = new CustomEvent('draw-addEvent', {
        //   detail: {
        //     id: marker.gvid,
        //     name: marker.gvname || '未命名',
        //     description: marker.description,
        //     type: marker.gvtype,
        //     position: cvt.toDegrees(cartesian, self._viewer),
        //   },
        // });
        // window.dispatchEvent(evt);
        self.createEvent.raiseEvent({
          id: marker.gvid,
          name: marker.gvname || '未命名',
          description: marker.description,
          type: marker.gvtype,
          position: cvt.toDegrees(cartesian, self._viewer),
        });
        marker = undefined;
      }
    };
    const cancel = function () {
      handler.removeInputAction(LEFT_CLICK);
      handler.removeInputAction(RIGHT_CLICK);
      // handler.destroy();
      self.cursorTip.show = false;
      const id = self.activeMarker ? self.activeMarker.id : undefined;
      // const evt = new CustomEvent('draw-dropEvent',
      //   {
      //     detail: {
      //       id,
      //     },
      //   });
      // window.dispatchEvent(evt);
      self.destroyEvent.raiseEvent({ id });

      self.activeMarker = undefined;
      // handler=undefined
    };
    const updateTip = function (e) {
      self.cursorTip.updatePosition(e.endPosition);
    };
    handler.setInputAction(cancel, RIGHT_CLICK);

    handler.setInputAction(pick, LEFT_CLICK);
    handler.setInputAction(updateTip, MOUSE_MOVE);
  }

  /**
   * 根据id获得要素
   * @param {String} id 要素id
   */
  get(id) {
    if (this.has(id)) {
      return this.manager.get(id);
    }
    return undefined;
  }

  /**
   * 判断当前管理器是否包含某要素
   * @param {String} id 要素id
   */
  has(id) {
    if (this.manager) {
      return this.manager.has(id);
    }
    return false;
  }

  /**
   * @private
   * @param {Cartesian3} cartesian 要素位置
   */
  createMarker(cartesian) {
    const mp = this.labelOptions;
    const marker = new CesiumBillboard(
      this._viewer,
      { ...this.markerOptions, position: cartesian, image: this.selectedImage },
      mp,
    );
    return marker;
  }

  /**
   * 改变标记的图片
   * @param {String} img 图片url
   */
  changeHandler(img) {
    this.selectedImage = img;
    this.activeMarker.updateImage(this.selectedImage);
  }

  /**
   * @private
   * @param {Cartesian3} cartesian 标记位置
   */
  createLabel(cartesian) {
    const options = this.labelOptions;
    options.position = cartesian;
    // options.eyeOffset=new Cesium.Cartesian2(0,0)

    const marker = new CesiumLabel(this._viewer, options);
    return marker;
  }

  /**
   * @private
   * @param {Cartesian3} cartesian 标记位置
   */
  createModel(cartesian) {
    const options = this.modelOptions;
    options.position = cartesian;
    const marker = new CesiumModel(this._viewer, options);

    return marker;
  }

  /**
   * 移除事件监听
   */
  removeEventListener() {
    const { pickHandler } = this;
    if (pickHandler) {
      if (!pickHandler.isDestroyed()) {
        // pickHandler.destroy();
        pickHandler.removeInputAction(LEFT_CLICK);
        pickHandler.removeInputAction(RIGHT_CLICK);
        pickHandler.removeInputAction(MOUSE_MOVE);
      }
    }
  }

  /**
   * 停止编辑
   */
  stopPick() {
    this.removeEventListener();
    if (this.activeMarker) {
      this.activeMarker.destroy();
      // const evt = new CustomEvent('draw-dropEvent',
      //   {
      //     detail: {
      //       id: this.activeMarker.gvid,
      //     },
      //   });
      // window.dispatchEvent(evt);
      this.destroyEvent.raiseEvent({ id: this.activeMarker.gvid });
    }
    this.activeMarker = undefined;
    this.cursorTip.show = false;
  }

  /**
   * 缩放到要素
   * @param {String} id 要素id
   */
  zoomTo(id) {
    if (this.manager.has(id)) {
      this.manager.get(id).zoomTo();
    }
  }

  /**
   * 编辑要素
   * @param {String} id 要素id
   */
  edit(id) {
    const { manager } = this;
    if (manager.has(id)) {
      const mm = manager.get(id);
      this.activeMarker = mm;
      mm.startEdit();
      if (
        mm.gvtype === GraphicType.MARKER
                || mm.gvtype === GraphicType.LABEL
      ) {
        this.properties.name = this.activeMarker.gvname;
        this.properties.description = this.activeMarker.description;
        this.visible = true;
      }
      // this.activeMarker.zoomTo();
      // const pixel = this.panelPosition();
      // const evt = new CustomEvent('draw-startEdit', {
      //   detail: {
      //     id,
      //     name: this.properties.name,
      //     description: this.properties.description,
      //     gvtype: this.activeMarker.gvtype,
      //     type: this.activeMarker.type,
      //     graphicType: this.activeMarker.type,
      //     pos: pixel,
      //   },
      // });
      // window.dispatchEvent(evt);
      this.preUpdateEvent.raiseEvent({
        id,
        name: this.properties.name,
        description: this.properties.description,
        gvtype: this.activeMarker.gvtype,
        type: this.activeMarker.type,
        graphicType: this.activeMarker.type,
      });
      return mm;
    }
    return undefined;
  }

  /**
   * 删除要素
   * @param {String} id 要素id
   */
  drop(id) {
    const mm = this.manager.get(id);
    mm && mm.destroy();
    this.manager.delete(id);
    // const evt = new CustomEvent('draw-dropEvent', {
    //   detail: { id },
    // });
    // window.dispatchEvent(evt);
    this.destroyEvent.raiseEvent({ id });
    if (this.selectedMarker && id === this.selectedMarker.gvid) {
      this.destroyPopPanle();
    }
  }

  /**
   * 要素重命名
   * @param {String} id 要素id
   * @param {*} name 要素名称
   */
  rename(id, name) {
    const mm = this.manager.get(id);
    mm.gvname = name;
  }

  /**
   * 是否在场景中显示
   * @param {String} type 要素类型
   * @param {*} id 要素id
   * @param {*} status 要素状态
   */
  select(type, id, status) {
    if (defined(id)) {
      const manager = this.manager.get(id);
      if (defined(manager)) {
        manager.show = status;
      }
    }
    if (defined(type)) {
      const values = this.manager.values();
      for (const v of values) {
        if (v.gvtype === type) {
          v.show = status;
        }
      }
    }
  }

  destroyPopPanle() {
    if (this.popDiv) {
      $(this.popDiv).remove();
      this.popDiv = undefined;
    }
  }

  /**
   * 销毁对象
   */
  destroy() {
    this.removeAll();
    this.destroyPopPanle();
    if (!this.pickHandler.isDestroyed()) {
      this.pickHandler.destroy();
    }
    if (!this.handler.isDestroyed()) {
      this.handler.destroy();
    }
    this._viewer = undefined;
    this.labelOptions = undefined;
    this.markerOptions = undefined;
    this.modelOptions = undefined;
  }

  /**
   * 创建一个跟随要素的div,显示要素的基本信息
   */
  createPopPanel() {
    if (!defined(this.selectedMarker)) {
      return;
    }
    if (this.popDiv) {
      this.destroyPopPanle();
    }
    const popdiv = document.createElement('div');
    popdiv.id = 'popContainer';
    popdiv.className = 'marker-popWin-class';
    const { position } = this.selectedMarker;
    this.popWinPosition = position;
    const coord = cvt.cartesian2Degrees(position, this._viewer);
    popdiv.style.display = 'none';
    // const txtdiv = document.createElement("span");
    // txtdiv.innerText = "名称:" + (this.selectedMarker.name || "未命名");
    // let remarkdiv;
    const remarkdiv = document.createElement('span');
    remarkdiv.title = this.selectedMarker.description;
    remarkdiv.innerText = `描述:${
      setString(this.selectedMarker.description || '暂无', 14)}`;
    const coordsdiv = document.createElement('span');
    coordsdiv.innerText = `纬度:${coord.lon.toFixed(2)}  纬度:${coord.lat.toFixed(2)}`;
    const arrow = document.createElement('div');
    arrow.className = 'arrow';
    const closebtn = document.createElement('span');
    closebtn.className = 'iconfont iconclose closebtn';
    const self = this;
    closebtn.onclick = function () {
      $(self.popDiv).remove();
      self.popDiv = undefined;
    };
    popdiv.appendChild(closebtn);
    // popdiv.appendChild(txtdiv);
    if (remarkdiv) {
      popdiv.appendChild(remarkdiv);
    }
    popdiv.appendChild(coordsdiv);
    popdiv.appendChild(arrow);
    this.popDiv = popdiv;
    this._viewer.container.appendChild(this.popDiv);
  }

  /**
   * 从geojson导入
   * @param {String} feat 定义一个点的geojson
   */
  import(feat) {
    if (feat.geometry.type.toUpperCase() !== 'POINT') {
      throw new Error('无效的数据类型.');
    }
    const id = feat.properties.id || this.generateId();
    let marker;
    if (feat.properties.type === GraphicType.LABEL) {
      const lopts = CesiumLabel.defaultStyle;
      lopts.position = Cesium.Cartesian3.fromDegrees(
        ...feat.geometry.coordinates,
      );
      lopts.text = feat.properties.name;
      marker = new CesiumLabel(this._viewer, lopts);
    } else {
      const coord = {
        lon: feat.geometry.coordinates[0],
        lat: feat.geometry.coordinates[1],
        height: feat.geometry.coordinates[2],
      };
      marker = CesiumBillboard.fromDegrees(this._viewer, coord);
    }
    marker.gvname = feat.properties.name;
    marker.gvid = id;
    marker.properties = feat.properties;
    this.manager.set(id, marker);
    // const evt = new CustomEvent('draw-importEvent', {
    //   detail: {
    //     id: marker.gvid,
    //     name: marker.gvname || '未命名',
    //     type: marker.gvtype,
    //     description: marker.description,
    //     properties: feat.properties,
    //     position: {
    //       lon: feat.geometry.coordinates[0],
    //       lat: feat.geometry.coordinates[1],
    //       height: feat.geometry.coordinates[2],
    //     },
    //   },
    // });
    // window.dispatchEvent(evt);
    this.importEvent.raiseEvent({
      id: marker.gvid,
      name: marker.gvname || '未命名',
      type: marker.gvtype,
      description: marker.description,
      properties: feat.properties,
      position: {
        lon: feat.geometry.coordinates[0],
        lat: feat.geometry.coordinates[1],
        height: feat.geometry.coordinates[2],
      },
    });
    return marker;
  }

  /**
   * 向管理器添加一个marker
   * @param {CesiumBillboard} marker 要添加的billboard
   */
  addMarker(marker) {
    this.manager.set(marker.gvid, marker);
  }

  /**
   * 将指定类型的要素导出到geojson
   * @param {String} type 要素类型
   */
  export(type) {
    const managers = this.manager.values();
    const json = {
      type: 'FeatureCollection',
      name: 'graphic',
      crs: {
        type: 'name',
        properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
      },
      features: [],
    };

    for (const m of managers) {
      if (m.type === type) {
        json.features.push(m.toGeoJson());
      }
    }
    const blob = new Blob([JSON.stringify(json)], { type: '' });

    window.saveAs(blob, `${type + parseInt(Cesium.getTimestamp())}.geojson`);
  }

  /**
   * 字体
   */
  set font(font) {
    this.labelOptions.font = font;
    if (this.activeMarker) {
      this.activeMarker.font = font;
    }
  }

  get font() {
    if (this.activeMarker) {
      return this.activeMarker.font;
    }
    return undefined;
  }

  /**
   * 颜色
   */
  set color(color) {
    this.labelOptions.fillColor = color;
    if (this.activeMarker) {
      this.activeMarker.color = color;
    }
  }

  /**
   * label
   */
  set label(option) {
    const keys = Object.keys(option);
    for (const key of keys) {
      this.labelOptions[key] = option[key];
    }
    // this.modelAndLabelOptions=[...this.modelAndLabelOptions,...option]
    if (this.activeMarker) {
      this.activeMarker.setLabel(this.labelOptions);
    }
  }

  /**
   * model
   */
  set model(options) {
    this.modelOptions = { ...this.modelOptions, ...options };
    if (this.activeMarker) {
      if (options.uri) {
        this.activeMarker.uri = options.uri;
      }
      if (options.color) {
        this.activeMarker.color = options.color;
      }
      if (options.mode !== undefined) {
        this.activeMarker.model = options.mode;
      }
      if (options.mixed !== undefined) {
        this.activeMarker.mixed = options.mixed;
      }
    }
  }

  /**
   * 将管理器中的所有要素从场景中移除并销毁
   */
  removeAll() {
    const values = this.manager.values();
    for (const v of values) {
      v.remove();
      v.destroy();
    }
    this.manager.clear();
    this.destroyPopPanle();
  }

  /**
   * 取消正在创建的marker
   */
  cancelMark() {
    this.activeMarker && this.activeMarker.destroy();
    this.activeMarker = undefined;
    this.cursorTip.show = false;
    // const evt = new CustomEvent('draw-deleteEvent', {
    //   detail: {
    //     id: this.markerid,
    //   },
    // });
    // window.dispatchEvent(evt);
    this.deleteEvent.raiseEvent({ id: this.markerid });
    this.properties.name = '';
    this.properties.description = '';
    this.manager.delete(this.markerid);
    this.markerid = undefined;
    this.cursorTip && (this.cursorTip.show = false);
    this.removeEventListener();
  }

  /**
   * 更新要发属性信息
   * @param {Object} info 要素的属性信息
   */
  update(info) {
    this.properties = info;
    this.activeMarker.updateText(this.properties.name, this.properties.description);
    this.cursorTip.show = false;
    this.activeMarker.stopEdit();
    // const evt = new CustomEvent('draw-updateEvent', {
    //   detail: {
    //     id: this.activeMarker.gvid,
    //     name: this.activeMarker.gvname,
    //     description: this.activeMarker.description,
    //     type: this.activeMarker.gvtype,
    //     position: cvt.toDegrees(this.activeMarker.position, this._viewer),
    //   },
    // });
    // window.dispatchEvent(evt);
    this.postUpdateEvent.raiseEvent({
      id: this.activeMarker.gvid,
      name: this.activeMarker.gvname,
      description: this.activeMarker.description,
      type: this.activeMarker.gvtype,
      position: cvt.toDegrees(this.activeMarker.position, this._viewer),
    });
    this.activeMarker = undefined;
    this.cursorTip.show = false;
    this.removeEventListener();
  }

  generateId() {
    return uuid();
  }
}
export default MarkerManager;

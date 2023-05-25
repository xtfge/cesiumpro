import uuid from './guid';
import defaultValue from './defaultValue';
import $ from '../../thirdParty/jquery'

class CursorTip {
  /**
   * 创建跟随鼠标的div元素
   * @param {Object} options 具有以下属性
   * @param {String} [options.text] div内容，支持HTML
   * @param {String} [options.id] 元素id,如果未定义将随机分配
   * @param {Viewer} [options.viewer] Viewer对象,如果未定义，div将不能自动跟随鼠标
   * @param {Boolean} [options.show=true] 是否可见
   * @param {Boolean} [options.reduplicate=false] 如果指定元素的id已存在，则移除原来的要素
   */
  constructor(options = {}) {
    const {
      text,
      id,
      viewer,
    } = options;
    if (id && document.getElementById(id) && !options.reduplicate) {
      $(`#${id}`).remove();
    }
    const tooltip = document.createElement('div');
    tooltip.id = defaultValue(id, uuid());
    tooltip.className = 'cursor-tip-class';
    tooltip.innerHTML = text;
    const target = viewer ? viewer.container : document.body;
    target.appendChild(tooltip);
    this.ele = tooltip;
    this._show = defaultValue(options.show, true);
    this._isDestryoed = false;
    this._target = target;
    this._id = tooltip.id;
    this._text = text;
    this._position = undefined;
    const self = this;
    this.show = this._show;

    if (viewer instanceof Cesium.Viewer) {
      this._handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
      this._handler.setInputAction((e) => {
        self.updatePosition(e.endPosition);
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
  }

  /**
   * 更新元素位置
   * @param {Cartesian2} pixel 元素位置
   */
  updatePosition(pixel) {
    this.ele.style.left = `${pixel.x + 10}px`;
    this.ele.style.top = `${pixel.y + 10}px`;
  }

  /**
   * 更新元素内容
   * @param {String|HTML} text 元素内容
   */
  updateText(text) {
    this.ele.innerHTML = text;
  }

  /**
   * 销毁组件
   */
  destroy() {
    if (this._isDestryoed) {
      return;
    }
    this._target.removeChild(this.ele);
    if (this._handler.isDestroyed()) {
      this._handler.destroy();
    }
    this._isDestryoed = true;
  }

  /*
   * 元素可见性
   *
   * @type {Boolean}
   */

  get show() {
    return this._show;
  }

  /**
   * 元素可见性
   *
   * @type {Boolean}
   */
  set show(v) {
    this._show = v;
    if (v) {
      this.ele.style.display = 'block';
    } else {
      this.ele.style.display = 'none';
    }
  }

  /**
   * 可以通过document.getElementById(id)获得它的DOM
   *
   * @readonly
   * @type {String}
   */
  get id() {
    return this._id;
  }

  /**
   * 获得或设置显示的文字
   * @type {String}
   */
  get text() {
    return this._text;
  }

  set text(text) {
    this._text = text;
    this.updateText(text);
  }

  /**
   * 获得或设置元素位置，设置元素的位置和updatePosition具有同样的效果
   * @type {Cesium.Cartesian2}
   */
  get position() {
    return this._position;
  }

  set position(pixel) {
    if (pixel.x && pixel.y) {
      this._position = pixel;
      this.updatePosition(pixel);
    } else {
      console.warn('CursorTip:设置了一个无效的位置，将被忽略.');
    }
  }
}

export default CursorTip;

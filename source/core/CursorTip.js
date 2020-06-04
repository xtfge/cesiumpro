/*
 * 创建跟随鼠标的div元素
 */
import uuid from './uuid';

class CursorTip {
  /**
   * 创建跟随鼠标的div元素
   * @param {String} text div内容，支持HTML
   * @param {String} [id] 元素id
   * @param {Viewer} [viewer] Viewer对象,如果未定义，div将不能自动跟随鼠标
   */
  constructor(text, id, viewer) {
    const tooltip = document.createElement('div');
    tooltip.id = id || uuid();
    tooltip.className = 'cursor-tip-class';
    tooltip.innerHTML = text;
    const target = viewer ? viewer.container : document.body;
    target.appendChild(tooltip);
    this.ele = tooltip;
    this._visible = true;
    this._isDestryoed = false;
    const self = this;

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
   * @param {String} text 元素内容
   */
  updateText(text) {
    this.ele.innerHTML = text;
  }

  /**
   * 销毁组件
   */
  destory() {
    if (this._isDestryoed) {
      return;
    }
    document.body.removeChild(this.ele);
    if (this._handler.isDestroyed()) {
      this._handler.destroy();
    }
    this._isDestryoed = true;
  }

  /*
   * 元素可见性
   */
  get show() {
    return this._visible;
  }

  /**
   * 元素可见性
   */
  set show(v) {
    this._visible = v;
    if (v) {
      this.ele.style.display = 'block';
    } else {
      this.ele.style.display = 'none';
    }
  }
}

export default CursorTip;

import defined from './defined';
import defaultValue from './defaultValue';
import Event from './Event';
import CesiumProError from './CesiumProError';

class Plotting {
  /**
   * 提供了交互绘图的通用方法和事件
   * @param {Object} options 具有以下属性
   */
  constructor(options) {
    options = defaultValue(options, options.EMPTY_OBJECT);
    if (options.viewer instanceof Cesium.Viewer) {
      throw new CesiumProError('param viewer must be a Cesium.Viewer Object.');
    }
    this._viewer = options.viewer;
    this._handler = new Cesium.ScreenSpaceEventHandler(this._viewer.canvas);
    this._graphics = new Map();
  }

  /**
   * 图形集合，所有绘图结果都保存在该对象中
   * @return {Map} 所有绘图结果的集合
   */
  get graphics() {
    return this._graphics;
  }

  /**
   * 销毁绘图对象，并销毁由该对象绘制的所有要素。
   */
  destroy() {
    if (!this._handler.isDestroyed()) {
      this._handler.destroy();
    }
    const values = this.graphics.values();
    for (const v of values) {
      v.destroy();
    }
    this.graphics.clear();
    this.graphics = undefined;
    this._viewer = undefined;
  }
}

export default Plotting;

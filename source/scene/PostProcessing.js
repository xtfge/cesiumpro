import checkViewer from '../core/checkViewer';
import defaultValue from '../core/defaultValue';
import CesiumProError from '../core/CesiumProError'
import defined from '../core/defined';
class PostProcessing {
  /**
   * 后处理类的基类，不要直接创建。
   * @param {Object} [options={}]
   */
  constructor(options) {
    options = defaultValue(options, {})
    this._options = options;
    this._postProcessStage = undefined;
  }
  /**
   * 添加到场景。
   * @param {Cesium.Viewer} viewer对象
   * @returns {Cesium.PostProcessStage}
   */
  addTo(viewer) {
    checkViewer(viewer);
    if (!defined(this._viewer)) {
      this._viewer = viewer;
    }
    if (!this._postProcessStage) {
      this._postProcessStage = this.createPostStage()
    }
    if (this._viewer.scene.postProcessStages.contains(this._postProcessStage)) {
      return;
    }
    if (!this._postProcessStage) {
      throw new CesiumProError('createPostStage method must reture a Cesium.PostProcessStage object.');
    }
    return this._viewer.scene.postProcessStages.add(this._postProcessStage)
  }
  /**
   * 创建postProcessState，继承该类的子类必须实现它
   * @abstract
   * @return {Cesium.postProcessState}
   */
  createPostStage() {
    throw new CesiumProError('抽象类不能被直接调用')
  }
  /**
   * 指定被选中使用后处理效果的要素
   */
  get selected() {
    if (this._postProcessStage) {
      return this._postProcessStage.selected;
    }
    return []
  }
  set selected(v) {
    if (this._postProcessStage) {
      this._postProcessStage.selected = v;
    }
  }
  /**
   * 特效是否生效
   * @type {Bool}
   */
  get enabled() {
    if (this._postProcessStage) {
      return this._postProcessStage.enabled;
    }
  }
  set enabled(val) {
    if (this._postProcessStage) {
      this._postProcessStage.enabled = val;
    }
  }
  /**
   * 从场景移除。
   * @return {Bool} 是否被成功移除
   */
  remove() {
    if (!this._viewer) {
      return;
    }
    return this._viewer.scene.postProcessStages.remove(this._postProcessStage);
  }
  /**
   * 销毁对象。
   */
  destroy() {
    this.remove()
    if (!this._postProcessStage.isDestroyed()) {
      this._postProcessStage.destroy()
    }
    this._viewer = undefined;
  }
  /**
   * 定位到对象。
   */
  zoomTo() {
    if (!this._viewer || !this.center) {
      return;
    }
    return this.viewer.flyTo(this.center, {
      duration: 0
    })
  }
}

export default PostProcessing

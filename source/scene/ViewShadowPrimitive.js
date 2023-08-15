import defined from '../core/defined';
import CesiumProError from '../core/CesiumProError';
import destroyObject from '../core/destroyObject';

class ViewShadowPrimitive {
  /**
   * 视域分析图元
   * @private
   * @extends CustomPrimitive
   * @param {Cesium.ShadowMap} shadowMap 视域阴影
   */
  constructor(shadowMap) {
    if (!defined(shadowMap)) {
      throw new CesiumProError('parameter shadowMap is required.')
    }
    this._shadowMap = shadowMap;
  }
  /**
   * 是否渲染该图元
   * @type {Bool}
   */
  get show() {
    return this._show;
  }
  set show(val) {
    this._show = val;
  }
  /**
   * 场景渲染时scene会自动调用该方法，请勿主动调用。
   * @override
   * @param  {FrameState} frameState
   */
  update(frameState) {
    frameState.shadowMaps.push(this._shadowMap);
  }
  /**
   * 销毁对象并释放WebGL资源
   */
  destroy() {
    if (this._shadowMap && !this._shadowMap.isDestroyed()) {
      this._shadowMap.destroy();
    }
    destroyObject(this);
  }

}

export default ViewShadowPrimitive;

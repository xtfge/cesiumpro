import polylineGlowMaterialShaderSource from '../shader/polylineGlowMaterial'
import defaultValue from '../core/defaultValue'
import Event from '../core/Event';
import URL from '../core/URL'
const {
  Material,
  Color,
  Property
} = Cesium;

Material.PolylineDynamicGlowType = "PolylineDynamicGlow";
Material._materialCache.addMaterial(Material.PolylineDynamicGlowType, {
  fabric: {
    type: Material.PolylineDynamicGlowType,
    uniforms: {
      color: new Color(1.0, 0.0, 0.0),
      image: '',
      time: 0,
      glowPower: 0.2,
      taperPower: 1.0
    },
    source: polylineGlowMaterialShaderSource
  }
})
class PolylineGlowMaterialProperty {
  /**
   * 创建一个边缘发光的流动材质。
   * @param {Object} [options={}] 具有以下属性
   * @param {Color} [options.color=Cesium.Color.RED] 该颜色将会和图片颜色做alpha混合
   * @param {String|Resource} [options.image] 将要映射的图形纹理
   * @param {Number} [options.duration=1000] 动画周期，值越小，动画传播速度越快
   * @param {Number} [options.factor=0.0] alpha混合因子，0~1
   *
   * @see PolylineFlowMaterialProperty
   * @see PolylineTrailLinkMaterialProperty
   */
  constructor(options = {}) {
    this._color = defaultValue(options.color, Cesium.Color.RED);
    this._time = defaultValue(options.time, 0);
    this._image = defaultValue(options.image, URL.buildModuleUrl('./assets/images/lineClr2.png'));
    this._duration = defaultValue(options.duration, 1000);
    this._taperPower = defaultValue(options.taperPower, 1.0);
    this._glowPower = defaultValue(options.glowPower, 0.2);
    this._definitionChanged = new Event();
  }

  /**
   * 材质的颜色
   * @type {Cesium.Color}
   */
  get color() {
    return this._color;
  }
  set color(v) {
    this._color = v;
  }
  /**
   * 动画同期，决定了动画的传播速度，值越小，速度越快，单位毫秒。
   * @type {Number}
   */
  get duration() {
    return this._duration;
  }
  set duration(v) {
    this._duration = v;
  }
  get time() {
    return this._time;
  }
  set time(v) {
    this._time = v
  }
  /**
   * 表示该属性是否是常量。
   * @readonly
   */
  get isConstant() {
    return false;
  }
  /**
   * @Event
   * 当此属性发生变化时触发的事件。
   */
  get definitionChanged() {
    return this._definitionChanged
  }
  /**
   * 将要映射到材质的图片纹理
   * @type {String|Resource}
   */
  get image() {
    return this._image;
  }
  set image(v) {
    this._image = v;
  }

  /**
   * 此属性的类型
   * @type {String}
   */
  getType() {
    return Material.PolylineDynamicGlowType;
  }

  /**
   * 获取指定时间的属性值。
   * @param  {JulianDate} time  时间
   * @param  {Object} [result] 保存新属性的副本，如果没有指定将自动创建。
   * @return {Object} 修改后的result,如果未提供result参数，则为新实例。
   */
  getValue(time, result) {
    result = defaultValue(result, {});
    if (this._time === undefined) {
      this._time = time.secondsOfDay;
    }
    result.time = (time.secondsOfDay - this.time) * 1000 / this.duration;
    result.color = this.color;
    result.image = this.image;
    result.glowPower = this._glowPower;
    result.taperPower = this._taperPower;
    return result
  }
  /**
   * 判断两个属性是否相同。
   * @param  {PolylineGlowMaterialProperty} other 另一个属性
   * @return {Bool}   如果相同返回true，否则返回false
   */
  equals(other) {
    return this === other || (other instanceof PolylineGlowMaterialProperty &&
      this.color === other.color && this.image === other.image);
  }
}

export default PolylineGlowMaterialProperty;

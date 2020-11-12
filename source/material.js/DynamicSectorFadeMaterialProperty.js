import sectorMaterialShaderSource from '../shader/dynamicSectorFadeMaterial';
import defaultValue from '../core/defaultValue'
import URL from '../core/URL'
import Event from '../core/Event';
const {
  Material,
  Color,
  Property
} = Cesium;

Material.DynamicSectorFadeType = 'DynamicSectorFade'
Material._materialCache.addMaterial(Material.DynamicSectorFadeType, {
  fabric: {
    type: Material.DynamicSectorFadeType,
    uniforms: {
      color: new Color(1.0, 0.0, 0.0),
      time: 0,
      image: ''
    },
    source: sectorMaterialShaderSource
  }
})

class DynamicSectorFadeMaterialProperty {
  /**
   * 创建一个扇形动态渐变材质
   * @param {Object} [options={}] 具有以下属性
   * @param {Color} [options.color] 图形颜色
   * @param {Color} [options.duration=1000] 决定动画的速度，值越小，速度越快
   */
  constructor(options = {}) {
    this._color = defaultValue(options.color, Cesium.Color.RED);
    this._time = defaultValue(options.time, 0);
    this._duration = defaultValue(options.duration, 1000);
    this._image = defaultValue(options.image, URL.buildModuleUrl('./assets/images/circleScan.png'))
    this._definitionChanged = new Event();
  }

  /**
   * 图形颜色。
   * @type {Cesium.Color}
   */
  get color() {
    return this._color;
  }
  set color(v) {
    this._color = v;
  }
  /**
   * 动画周期，决定了动画执行的速度，值越小，速度越快,单位秒。
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
   * 将要映射到纹理的图形。
   * @type {String|Resource}
   */
  get image() {
    return this._image;
  }
  set image(v) {
    this._image = v;
  }
  /**
   * 表示该属性是否是常量
   * @readonly
   */
  get isConstant() {
    return false;
  }
  /**
   * @Event
   * 当此属性发生变化时触发的事件
   */
  get definitionChanged() {
    return this._definitionChanged
  }

  /**
   * 此属性的类型。
   * @type {String}
   */
  getType() {
    return Material.DynamicSectorFadeType;
  }

  /**
   * 获取指定时间的属性值
   * @param  {JulianDate} time  时间
   * @param  {Object} [result] 保存新属性的副本，如果没有指定将自动创建
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
    return result
  }
  /**
   * 判断两个属性是否相同
   * @param  {DynamicSectorFadeMaterialProperty} other 另一个属性
   * @return {Bool}   如果相同返回true,否则返回false
   */
  equals(other) {
    return this === other || (other instanceof DynamicSectorFadeMaterialProperty &&
      this.color === other.color && this.image === other.image);
  }
}

export default DynamicSectorFadeMaterialProperty;

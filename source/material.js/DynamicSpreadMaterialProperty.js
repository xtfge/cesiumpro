import spreadMaterialShaderSource from '../shader/dynamicSpreadMaterial';
import defaultValue from '../core/defaultValue'
import Event from '../core/Event';
const {
  Material,
  Color,
  Property
} = Cesium;

Material.DynamicSpreadType = 'DynamicSpread'
Material._materialCache.addMaterial(Material.DynamicSpreadType, {
  fabric: {
    type: Material.DynamicSpreadType,
    uniforms: {
      color: new Color(1.0, 0.0, 0.0),
      time: 0
    },
    source: spreadMaterialShaderSource
  }
})

class DynamicSpreadMaterialProperty {
  /**
   * 用于生成具有扩散效果的材质，该属性适用于所有几何图形，包括点、线、面、体。
   * @param {Object} [options={}] 具有以下属性
   * @param {Number} [options.duration=1000] 扩散动画周期，值越小扩散越快，单位毫秒
   * @param {Color} [options.color=Cesium.Color.RED] 图形颜色
   */
  constructor(options = {}) {
    this._color = defaultValue(options.color, Cesium.Color.RED);
    this._time = 0;
    this._duration = defaultValue(options.duration, 1000);
    this._definitionChanged = new Event();
  }

  /**
   * 线颜色
   * @type {Cesium.Color}
   */
  get color() {
    return this._color;
  }
  get time() {
    return this._time;
  }
  /**
   * 材质发生变化时触发的事件
   * @Event
   */
  get definitionChanged() {
    return this._definitionChanged
  }
  /**
   * 获取一个值，该值指示此属性是否恒定。如果getValue对于当前定义始终返回相同的结果，则该属性被视为常量。
   * @readonly
   */
  get isConstant() {
    return false;
  }
  set color(v) {
    this._color = v;
  }
  /**
   * 动画周期，单位毫秒。
   * @type {Number}
   */
  get duration() {
    return this._duration;
  }
  set duration(v) {
    this._duration = v;
  }
  /**
   * 此属性的类型
   * @return {String}
   */
  getType(time) {
    return Material.DynamicSpreadType;
  }
  /**
   * 获取指定时间的属性值。
   * @param  {JulianDate} time  时间
   * @param  {Object} [result] 保存新属性的副本，如果没有指定将自动创建。
   * @return {Object} 修改后的result,如果未提供result参数，则为新实例。
   */
  getValue(time, result) {
    result = defaultValue(result, {});
    result.color = this.color;
    if (this._time === undefined) {
      this._time = time.secondsOfDay;
    }
    result.time = (time.secondsOfDay - this.time) * 1000 / this.duration;
    return result
  }
  /**
   * 判断两个材质是否相同
   * @param  {DynamicSpreadMaterialProperty} other 作为对比的另一个材质
   * @return {Bool}   两个材质相同返回true,否则返回false
   */
  equals(other) {
    return this === other || (other instanceof DynamicSpreadMaterialProperty && this.color === other.color);
  }
}

export default DynamicSpreadMaterialProperty;

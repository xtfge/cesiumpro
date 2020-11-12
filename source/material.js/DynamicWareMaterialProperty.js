import dynamicWateMaterialShaderSource from '../shader/dynamicWaterMaterial'
import defaultValue from '../core/defaultValue'
import Event from '../core/Event';
const {
  Material,
  Color,
  Property
} = Cesium;

Material.DynamicWareType = "DynamicWare";
class DynamicWareMaterialProperty {
  /**
   * 创建一个渐变材质
   * @param {Object} [options={}] 具有以下属性
   * @param {Color} [options.color=Cesium.Color.RED] 颜色
   * @param {count} [options.count=3] 波纹的条数
   * @param {Number} [options.duration=1000] 动画周期，值越小，动画传播速度越快
   */
  constructor(options = {}) {
    this._color = defaultValue(options.color, Cesium.Color.RED);
    this._time = defaultValue(options.time, new Cesium.Cartesian2(0, 0));
    this._duration = defaultValue(options.duration, 1000);
    this._count = defaultValue(options.count, 3);
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
   * 条纹的个数
   * @type {Number}
   */
  get count() {
    return this._count;
  }
  set count(v) {
    this._count = v;
  }

  /**
   * 此属性的类型
   * @type {String}
   */
  getType() {
    return Material.DynamicWareType;
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
      this._time = {
        x: time.secondsOfDay,
        y: time.secondsOfDay
      };
    }
    if (this.fadeDirection.x) {
      result.time.x = (time.secondsOfDay - this.time.x) * 1000 / this.duration % 1;
    }
    if (this.fadeDirection.y) {
      result.time.y = (time.secondsOfDay - this.time.y) * 1000 / this.duration % 1;
    }
    result.fadeInColor = this.fadeInColor;
    result.fadeOutColor = this.fadeOutColor;
    result.maximumDistance = this.maximumDistance;
    result.repeat = this.repeat;
    result.fadeDirection = this.fadeDirection;
    return result
  }
  /**
   * 判断两个属性是否相同。
   * @param  {DynamicWareMaterialProperty} other 另一个属性
   * @return {Bool}   如果相同返回true，否则返回false
   */
  equals(other) {
    return this === other || (other instanceof DynamicWareMaterialProperty &&
      this.fadeInColor === other.fadeInColor && this.fadeOutColor === other.fadeOutColor &&
      this.maximumDistance === other.maximumDistance && this.repeat === other.repeat &&
      this.fadeDirection === other.fadeDirection);
  }
}

export default DynamicWareMaterialProperty;

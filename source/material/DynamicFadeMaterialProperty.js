import defaultValue from '../core/defaultValue'
import Event from '../core/Event';
const {
  Material,
  Color,
  Property
} = Cesium;

class DynamicFadeMaterialProperty {
  /**
   * 创建一个渐变材质
   * @param {Object} [options={}] 具有以下属性
   * @param {Color} [options.fadeInColor] 几何体在时间0~time时表现的颜色
   * @param {Color} [options.fadeOutColor] 几何体在maximumDistance到time之间的颜色
   * @param {Bool} [options.repeat=true] 如果要实现循环，此值应该为true
   * @param {Object} [options.time=0] 具有x,y值的对象，在0~time处表现为fadeInColor
   * @param {Object} [options.fadeDirection={x:true,y:false}] 具有x,y值的对象，指定是否在x或y方向上实现Fade效果
   * @param {Number} [options.maximumDistance=0.5] 介于0~1之间的值，当值为0时，整个颜色为fadeOutColor，值为1时，整个颜色为fadeInColor
   */
  constructor(options = {}) {
    this._fadeInColor = defaultValue(options.fadeInColor, Cesium.Color.RED);
    this._fadeOutColor = defaultValue(options.fadeOutColor, Cesium.Color.WHITE.withAlpha(0.5));
    this._time = defaultValue(options.time, new Cesium.Cartesian2(0, 0));
    this._repeat = defaultValue(options.repeat, false);
    this._duration = defaultValue(options.duration, 3000);
    this._fadeDirection = defaultValue(options.fadeDirection, {
      x: true,
      y: false
    });
    this._maximumDistance = defaultValue(options.maximumDistance, 0.5);
    this._definitionChanged = new Event();
  }

  /**
   * 几何体在0~time处的颜色。
   * @type {Cesium.Color}
   */
  get fadeInColor() {
    return this._fadeInColor;
  }
  set fadeInColor(v) {
    this._fadeInColor = v;
  }
  /**
   * 几何体在time~maximumDistance处表现的颜色。
   * @type {Cesium.Color}
   */
  get fadeOutColor() {
    return this._fadeOutColor;
  }
  set fadeOutColor(v) {
    this._fadeOutColor = v;
  }
  /**
   * 渐变动画同期，决定了动画的速度，值越小，速度越快，单位毫秒。
   * @type {Number}
   */
  get duration() {
    return this._duration;
  }
  set duration(v) {
    this._duration = v;
  }
  /**
   * 具有x,y值的对象，在0~time处表现为fadeInColor
   * @type {Object}
   */
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
   * @type {Event}
   * 当此属性发生变化时触发的事件。
   */
  get definitionChanged() {
    return this._definitionChanged
  }

  /**
   * 是否在x或y方向上实现渐变效果，如果x和y方向上具未实现渐变效果，将表现为fadeInColor。
   * @type {Object}
   */
  get fadeDirection() {
    return this._fadeDirection;
  }
  set fadeDirection(v) {
    this._fadeDirection = v;
  }

  /**
   * 是否重复渐变效果。
   * @type {Bool} true表示重复渐变效果，false表示不重复。
   */
  get repeat() {
    return this._repeat;
  }
  set repeat(v) {
    this._repeat = v;
  }
  /**
   * 介于0~1之间的值，当值为0时，整个颜色为fadeOutColor，值为1时，整个颜色为fadeInColor。
   * @type {Number}
   */
  get maximumDistance() {
    return this._maximumDistance;
  }
  set maximumDistance(v) {
    this._maximumDistance = v;
  }

  /**
   * 此属性的类型。
   * @type {String}
   */
  getType() {
    return Material.FadeType;
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
   * @param  {DynamicFadeMaterialProperty} other 另一个属性
   * @return {Bool}   如果相同返回true，否则返回false
   */
  equals(other) {
    return this === other || (other instanceof DynamicFadeMaterialProperty &&
      this.fadeInColor === other.fadeInColor && this.fadeOutColor === other.fadeOutColor &&
      this.maximumDistance === other.maximumDistance && this.repeat === other.repeat &&
      this.fadeDirection === other.fadeDirection);
  }
}

export default DynamicFadeMaterialProperty;

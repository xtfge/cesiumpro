import polylineFlowShaderSource from '../shader/polylineFlowMaterial';
import defaultValue from '../core/defaultValue'
import URL from '../core/URL'
import Event from '../core/Event';
const {
  Material,
  Color,
  Property
} = Cesium;

Material.PolylineFlowType = 'PolylineFlow'
Material._materialCache.addMaterial(Material.PolylineFlowType, {
  fabric: {
    type: Material.PolylineFlowType,
    uniforms: {
      color: new Color(1.0, 0.0, 0.0),
      image: '',
      time: 0
    },
    source: polylineFlowShaderSource
  }
})

class PolylineFlowMaterialProperty {
  /**
   * 流动线，相比 {@link PolylineTrailLinkMaterialProperty},此材质仅仅会用到图片的alpha通道
   * @param {Object} [options={}] 具有以下属性
   * @param {Color} [options.color=Cesium.Color.RED] 颜色
   * @param {Number} [options.duration=1000] 动画的周期，值越小动画越快，单位毫秒
   * @param {String|Resource} [options.image] 需要映射到材质的图片
   *
   * @see PolylineTrailLinkMaterialProperty
   */
  constructor(options = {}) {
    this._color = defaultValue(options.color, Cesium.Color.RED);
    this._time = defaultValue(options.time, 0);
    this._image = defaultValue(options.image, URL.buildModuleUrl('./assets/images/LinkPulse.png'));
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
   * 将要映射到纹理的图形
   * @type {String|Resource}
   */
  get image() {
    return this._image;
  }
  set image(v) {
    this._image = v;
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
   * 动画周期。
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
    return Material.PolylineFlowType;
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
    result.image = this.image;
    return result
  }
  /**
   * 判断两个材质是否相同
   * @param  {PolylineFlowMaterialProperty} other 作为对比的另一个材质
   * @return {Bool}   两个材质相同返回true,否则返回false
   */
  equals(other) {
    return this === other || (other instanceof PolylineFlowMaterialProperty && this.color === other.color &&
      this.image === other.image);
  }
}

export default PolylineFlowMaterialProperty;

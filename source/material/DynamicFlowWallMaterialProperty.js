import spreadMaterialShaderSource from '../shader/dynamicSpreadWallMaterial';
import defaultValue from '../core/defaultValue'
import Event from '../core/Event';
import URL from '../core/Url'
const {
  Material,
  Color
} = Cesium;

Material.DynamicFlowWallType = 'DynamicFlowWall'
Material._materialCache.addMaterial(Material.DynamicFlowWallType, {
  fabric: {
    type: Material.DynamicFlowWallType,
    uniforms: {
      color: new Color(1.0, 0.0, 0.0),
      time: 0,
      gradient: 1,
      image: '',
      repeat: {
        x: 1,
        y: 1
      },
      wrapX: false
    },
    source: spreadMaterialShaderSource
  }
})

class DynamicFlowWallMaterialProperty {
  /**
   * 用于生成具有扩散效果的材质，该属性适用于所有几何图形，包括点、线、面、体。
   * @param {Object} [options={}] 具有以下属性
   * @param {Number} [options.duration=1000] 扩散动画周期，值越小扩散越快，单位毫秒
   * @param {Color} [options.color=Cesium.Color.RED] 图形颜色
   * @param {String} [options.image] 获取alpha值的图像
   * @param {Bool} [options.wrapX=false] 纹理映射时是否旋转X轴
   * @param {Cesium.Cartesian2} [options.repeat=new Cesium.Cartesian2(1,1)] 图片在x和y方向上重复的次数
   */
  constructor(options = {}) {
    this._color = defaultValue(options.color, Cesium.Color.RED);
    this._time = 0;
    this._duration = defaultValue(options.duration, 1000);
    this._gradient = defaultValue(options.gradient, 1.0);
    this._image = defaultValue(options.image, URL.buildModuleUrl('./assets/images/wall.png'));
    this._wrapX = defaultValue(options.wrapX, false);
    this._repeat = defaultValue(options.repeat, new Cesium.Cartesian2(1, 1));
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
   * @type {Event}
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
   * 渐变强度,必须不小于0，如果值为，将不会产生渐变效果
   * @type {Number} 渐变强度
   */
  get gradient() {
    if (this._gradient > 0) {
      return this._gradient;
    }
    return 0;
  }
  set gradient(v) {
    this._gradient = v;
  }

  /**
   * 将要映射到材质的图片，仅使用其alpha值
   * @type {String} 图片url
   */
  get image() {
    return this._image;
  }
  set image(v) {
    this._image = v;
  }
  /**
   * 纹理映射时是否旋转X轴
   * @type {Bool}
   */
  get wrapX() {
    return this._wrapX;
  }
  set wrapX(v) {
    this._wrapX = v;
  }

  /**
   * 图片在x和y方向上的重复次数
   * @type Cesium.Cartesian2
   */
  get repeat() {
    return this._repeat;
  }
  set repeat(v) {
    this._repeat = v;
  }
  /**
   * 此属性的类型
   * @return {String}
   */
  getType(time) {
    return Material.DynamicFlowWallType;
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
    result.gradient = this.gradient;
    result.image = this.image;
    result.wrapX = this.wrapX;
    result.repeat = this.repeat;
    return result
  }
  /**
   * 判断两个材质是否相同
   * @param  {DynamicFlowWallMaterialProperty} other 作为对比的另一个材质
   * @return {Bool}   两个材质相同返回true,否则返回false
   */
  equals(other) {
    return this === other || (other instanceof DynamicFlowWallMaterialProperty &&
      this.color === other.color && this.gradient === other.gradient &&
      this.image === other.image && this.wrapX === other.wrapX &&
      this.repeat === other.repeat);
  }
}

export default DynamicFlowWallMaterialProperty;

import defaultValue from '../core/defaultValue';
import PostProcessing from './PostProcessing';
import shader from '../shader/postProcessStage/snow'

class SnowEffect extends PostProcessing {
  /**
   * 模拟雪地的后处理程序。
   * @extends PostProcessing
   * @param {Object} options 具有以下属性
   * @param {Number} [options.thickness=0.8] 雪的厚度，介于0~1之间的值
   * @param {Number} [options.density=10.0] 表示雪大小的变量，值越大，雪越大
   * @param {Number} [options.speed=350.0] 表示落雪速度，值越大，雪花下降越快
   *
   * @see {@link https://www.giserdqy.com/gis/opengis/3d/cesium/7311/|Cesium应用篇–添加雨雪天气}
   *
   */
  constructor(options) {
    super(options);
    this._fragmentShader = defaultValue(this._options.fragmentShader, shader);
    this._thickness = defaultValue(this._options.thickness, 0.5);
    this._density = defaultValue(this._options.density, 10.0);
    this._speed = defaultValue(this._options.speed, 350);
    const uniforms = {
      alpha: () => {
        return this.thickness
      },
      snowDensity: () => {
        return this.density
      },
      speed: () => {
        return this.speed
      }
    }
    this._uniforms = defaultValue(this._options.uniforms, uniforms);

  }
  /**
   * 介于0~1之间的值，表示雪的厚度，值越大雪越厚
   * @type {Number} 雪的厚度
   */
  get thickness() {
    return Cesium.Math.clamp(this._thickness, 0, 1);
  }
  set thickness(val) {
    this._thickness = val;
  }
  /**
   * 表示雪大小的变量，值越大，雪越大，其有效值为2~20
   * @type {Number}
   */
  get density() {
    return Cesium.Math.clamp(this._density, 2, 20);
  }
  set density(val) {
    this._density = val;
  }
  /**
   * 雪花降落的速度，值越大，降落速度越快
   * @type {Number}
   */
  get speed() {
    const speed = this._speed;
    return 10.0 + Cesium.Math.clamp((390 - speed), 0, 390);
  }
  set speed(val) {
    this._speed = val;
  }
  /**
   * 创建后处理阶段
   * @override
   * @return {Cesium.PostProcessStage} 后处理阶段
   */
  createPostStage() {
    return new Cesium.PostProcessStage({
      fragmentShader: this._fragmentShader,
      uniforms: this._uniforms
    })
  }
}
export default SnowEffect;

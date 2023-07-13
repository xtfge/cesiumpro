import vsTemplate from '../shader/waterAppearanceVS';
import fsTemplate from '../shader/waterAppearanceFS';
import defaultValue from '../core/defaultValue'
import URL from '../core/URL'
const {
  Material,
  Color
} = Cesium;

class WaterFaceAppearance {
  /**
   * 水面外观
   * @param {Object} options 具有以下属性
   * @param {String} [options.normalMap] 法线贴图
   * @param {Cesium.Color} [options.baseWaterColor=new Cesium.Color(0, 0.42, 0.71)] 水的颜色
   * @param {Cesium.Color} [options.blendColor=options.baseWaterColor] 从水到非水区域混合时使用的颜色
   * @param {Number} [options.frequency=8000] 波数
   * @param {Number} [options.animationSpeed=0.02] 水面动画速度的
   * @param {Number} [options.amplitude=5] 水波振幅字
   * @param {Number} [options.specularIntensity=0.8] 镜面反射强度
   * @param {Number} [options.alpha=0.4] 水面透明度
   * @param {String|Cesium.Resource} [options.normalMap] 水正常扰动的法线贴图
   *
   */
  constructor(options) {
    options = defaultValue(options, {});
    this._normalMap = defaultValue(options.normalMap, URL.buildModuleUrl('./assets/images/waterNormal.jpg'));
    this._baseWaterColor = defaultValue(options.baseWaterColor, new Cesium.Color(0, 0.42, 0.71));
    this._blendColor = defaultValue(options.blendColor, this._baseWaterColor);
    this._frequency = defaultValue(options.frequency, 8000);
    this._animationSpeed = defaultValue(options.animationSpeed, 0.02);
    this._amplitude = defaultValue(options.amplitude, 5);
    this._specularIntensity = defaultValue(options.specularIntensity, 0.8);
    this._fadeFactor = defaultValue(options.fadeFactor, 1);
    this._alpha = defaultValue(options.alpha, 0.4);
    this._material = new Material({
      fabric: {
        type: Material.WaterType,
        uniforms: {
          normalMap: this._normalMap,
          baseWaterColor: this._baseWaterColor,
          blendColor: this._blendColor,
          frequency: this._frequency,
          animationSpeed: this._animationSpeed,
          amplitude: this._amplitude,
          specularIntensity: this._specularIntensity,
          fadeFactor: this._fadeFactor
        }
      }
    })
    return new Cesium.MaterialAppearance({
      material: this._material,
      faceForward: true,
      vertexShaderSource: this.vertexShaderSource,
      fragmentShaderSource: this.fragmentShaderSource
    })
  }
  get vertexShaderSource() {
    return vsTemplate;
  }
  get fragmentShaderSource() {
    const fs = fsTemplate.replace(/{alpha}/g, this._alpha);
    return fs;
  }
}
export default WaterFaceAppearance;

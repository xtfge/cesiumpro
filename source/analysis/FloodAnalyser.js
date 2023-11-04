import ClipRegion from "../core/ClipRegion";
import defaultValue from "../core/defaultValue";
import destroyObject from "../core/destroyObject";
import floodMaterial from "../shader/floodMaterial";
import AnalyserUtil from "./AnalyserUtil";
import BaseAnalyser from "./BaseAnalyser";
import HeightAnalyser from "./HeightAnalyser";

const { Material, Color, JulianDate, Clock } = Cesium;
Material.FloodMaterial = "FloodMaterial";
Material._materialCache.addMaterial(Material.FloodMaterial, {
  fabric: {
    type: Material.FloodMaterial,
    uniforms: {
      color: Color.fromCssColorString('rgba(0, 123, 230, 0.5)'),
      height: 0
    },
    source: floodMaterial
  }
})
class FloodAnalyser extends BaseAnalyser {
  /**
   * 
   * @param {*} viewer 
   * @param {object} options 具有以下属性
   * @param {LonLat[]|Cesium.Cartesian3[]|number[]} options.mask 分析范围
   * @param {number} [options.minHeight] 最小高度，如果不指定在开始分析前，会通过插值自动
   * @param {number} [options.maxHeight] 最大高度，如果不指定在开始分析前，会通过插值自动
   */
  constructor(viewer, options = {}) {
    super(viewer);
    this._mask = [];
    const positions = AnalyserUtil.getCartesians(options.mask);
    if (positions && positions.length) {
      this._mask = positions;
      const clipRegion = new ClipRegion(this._mask);
      if (this.clipRegion) {
        this._viewer.scene.globe.clipRegion.remove(this.clipRegion);
      }
      this._viewer.scene.globe.clipRegion.add(clipRegion);
      this.clipRegion = clipRegion;
    }
    this._color = defaultValue(options.color, 'rgba(0, 123, 230, 0.5)');
    this._speed = defaultValue(options.speed, 1);
    this.clock = new Clock({
      startTime: JulianDate.now(),
      shouldAnimate: true
    });
    this.minHeight = options.minHeight;
    this.maxHeight = options.maxHeight;
    this.currentHeight = undefined;
    this._doing = false;
    this.removeEventListener = viewer.clock.onTick.addEventListener(() => {
      this.clock.tick();
      if (!this._doing) {
        return;
      }
      if (!this.clipRegion) {
        return;
      }
      const currentTime = this.clock.currentTime;
      const seconds = JulianDate.secondsDifference(currentTime, this.clock.startTime);
      const height = seconds * this.speed;
      const currentHeight = this.minHeight + height;
      if (currentHeight >= this.maxHeight) {
        this._doing = false;
      }
      this.currentHeight = Math.min(currentHeight, this.maxHeight);
      viewer.scene.globe.material.uniforms.height = this.currentHeight;
    })
  }
  get multiplier() {
    return this.clock.multiplier;
  }
  set multiplier(val) {
    this.clock.multiplier = val;
  }
  /**
   * 淹没区域的颜色
   * @type {string}
   */
  get color() {
    return Color.fromCssColorString(this._color);
  }
  set color(val) {
    if (val instanceof Cesium.Color) {
      this._color = val;
    }
  }
  /**
   * 淹没速度，单位m/s，如果不小于0
   */
  get speed() {
    return this._speed;
  }
  set speed(val) {
    if (val > 0) {
      this._speed = val;
    } else {
      this._speed = 0;
    }
  }
  /**
   * 分析范围
   * @type {LonLat[]|Cesium.Cartesian3[]|number[]}
   */
  get mask() {
    return this._mask;
  }
  set mask(val) {
    const positions = AnalyserUtil.getCartesians(val);
    if (positions && positions.length) {
      this._mask = positions;
      const clipRegion = new ClipRegion(this._mask);
      if (this.clipRegion) {
        this._viewer.scene.globe.clipRegion.remove(this.clipRegion);
      }
      this._viewer.scene.globe.clipRegion.add(clipRegion);
      this.clipRegion = clipRegion;
    }
  }
  calcRegionElevation() {
    const analyser = new HeightAnalyser(this._viewer, {
      mask: this.mask
    })
    const v = analyser.do();
    this.minHeight = v.min;
    this.maxHeight = v.max;
    return {
      minHeight: this.minHeight,
      maxHeight: this.maxHeight
    }
  }
  /**
   * 开始分析
   */
  do() {
    if (!this._mask.length) {
      console.warn('mask must be specified.')
      return;
    }
    if (!(typeof this.minHeight === 'number' && typeof this.maxHeight === 'number')) {
      this.calcRegionElevation();
    }
    this.preAnalysis.raise();
    this.clear();
    this._doing = true;
    this.clock.startTime = JulianDate.now();
    this._viewer.scene.globe.material = Material.fromType('FloodMaterial', {
      color: this.color
    });
    this.postAnalysis.raise({
      minHeight: this.minHeight,
      maxHeight: this.maxHeight
    });
    return {
      minHeight: this.minHeight,
      maxHeight: this.maxHeight
    }
  }
  /**
   * 暂停/继续
   */
  pause() {
    this.clock.shouldAnimate = !this.clock.shouldAnimate
  }
  /**
   * 清除分析结果
   */
  clear() {
    this._viewer.scene.globe.material = undefined;    
    this.currentHeight = this.minHeight;
  }
  /**
   * 对象是否被销毁，
   * @returns {boolean} true表示对象已经被销毁，其除isDestroyed外所有方法将不能调用
   */
  isDestroyed() {
    return false;
  }
  /**
   * 销毁对象
   */
  destroy() {
    this.clear();
    this.clipRegion && this._viewer.scene.globe.clipRegion.remove(this.clipRegion);
    this.clipRegion = undefined;
    this.removeEventListener();
    destroyObject(this);
  }
}
export default FloodAnalyser
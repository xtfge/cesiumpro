/*
 * Cesium 场景设置 
 */
import checkViewer from './checkViewer';
/**
  * Cesium 场景的常用设置
  * @param {Viewer} viewer Cesium Viewer对象
  */
class SceneSetting {
  constructor(options = {}) {
    checkViewer(options.viewer);
    this._viewer = options.viewer;
    this._scene = options.viewer.scene;
    this._depthTest = this._scene.globe.depthTestAgainstTerrain;
    this._lighting = this._scene.globe.enableLighting;
    this._shadows = this._viewer.shadows;
  }

  /**
   * 强制地形调整
   */
  get depthTest() {
    return this._depthTest;
  }

  set depthTest(v) {
    this._depthTest = v;
    this._scene.globe.depthTestAgainstTerrain = v;
  }

  /**
   * 晨昏线
   */
  get lighting() {
    return this._lighting;
  }

  set lighting(v) {
    this._lighting = v;
    this._scene.globe.enableLighting = v;
  }

  /**
   * 阴影
   */
  get shadows() {
    return this._shadows;
  }

  set shadows(v) {
    this._shadows = v;
    this._viewer.shadows = v;
  }

  /**
   * 抗锯齿
   */
  get fxaa() {
    return this._scene.postProcessStages.fxaa.enabled;
  }

  set fxaa(v) {
    this._scene.postProcessStages.fxaa.enabled = v;
  }

  /**
   * 分辨率,该值被限制在0.1~2.0之间
   */
  get resolution() {
    return this._viewer.resolutionScale;
  }

  set resolution(v) {
    v = !Number.isNaN(v) ? v : 1.0;
    v = Cesium.Math.clamp(v, 0.1, 2.0);
    this._viewer.resolutionScale = v;
  }

  /**
   * 亮度设置，该值被限制在-1~1之间
   */
  get light() {
    return this._viewer.scene.globe.atmosphereBrightnessShift;
  }

  set light(v) {
    if (
      !Cesium.PostProcessStageLibrary.isDepthOfFieldSupported(this._viewer.scene)
    ) {
      console.warn('浏览器不支持亮度调节');
      return;
    }
    v = !Number.isNaN(v) ? v : 0.0;
    v = Cesium.Math.clamp(v, -1, 1);
    this._viewer.scene.globe.atmosphereBrightnessShift = v;
  }

  /**
   * 大气
   * @example
   * const viewer = new Cesium.Viewer('mapContainer');
   * conset sc = new SceneSetting(viewer);
   * sc.skyAtmosphere = {
   *   hueShift: -0.8,
   *   saturationShift: -0.7,
   *   brightnessShift: -0.33
   * }
   */
  get skyAtmosphere() {
    const { skyAtmosphere } = this._viewer.scene;
    return {
      hueShift: skyAtmosphere.hueShift,
      saturationShift: skyAtmosphere.saturationShift,
      brightnessShift: skyAtmosphere.brightnessShift,
    };
  }

  set atmosphrerLight(v) {
    if (!v) {
      return;
    }
    const { skyAtmosphere } = this._viewer.scene;
    const { defined } = Cesium;
    if (defined(v.brightnessShift)) {
      skyAtmosphere.brightnessShift = v.brightnessShift;
    }
    if (defined(v.hueShift)) {
      skyAtmosphere.hueShift = v.hueShift;
    }
    if (defined(v.saturationShift)) {
      skyAtmosphere.saturationShift = v.saturationShift;
    }
  }

  /**
   * 雾
   * @example
   * const viewer = new Cesium.Viewer('mapContainer');
   * conset sc = new SceneSetting(viewer);
   * sc.fog = {enabled:true, density: 0.001, minimumBrightness: 0.8, screenSpaceErrorFactor: 2}
   */
  get fog() {
    return { ...this._scene.fog };
  }

  set fog(v) {
    if (!v) {
      return;
    }
    const { defined } = Cesium;
    if (defined(v.enabled)) {
      this._scene.fog.enabled = v.enabled;
    }
    if (defined(v.density)) {
      v.density = !Number.isNaN(v.density) ? v.density : 0.0;
      v.density = Cesium.Math.clamp(v.density, 0, 0.1);
      this._scene.fog.density = v.density;
    }
    if (defined(v.minimumBrightness)) {
      this._scene.fog.minimumBrightness = v.minimumBrightness;
    }
    if (defined(v.screenSpaceErrorFactor)) {
      this._scene.fog.screenSpaceErrorFactor = v.screenSpaceErrorFactor;
    }
  }

  /**
   * 太阳
   */
  get sun() {
    return this._scene.sun;
  }

  set sun(v) {
    this._scene.run = v;
  }

  /**
   * 月亮
   */
  get moon() {
    return this._scene.moon;
  }

  set moon(v) {
    this._scene.moon = v;
  }

  /**
   * 场景模式
   */
  get mode() {
    if (this._scene.mode === Cesium.SceneMode.SCENE3D) {
      return '3D';
    } if (this._scene.mode === Cesium.SceneMode.SCENE2D) {
      return '2D';
    } if (this._scene.mode === Cesium.SceneMode.COLUMBUS_VIEW) {
      return '2.5D';
    }
    return 'unknown';
  }

  set mode(v) {
    if (v.toUpperCase() === '3D') {
      this._scene.mode = Cesium.SceneMode.SCENE3D;
    } else if (v.toUpperCase() === '2D') {
      this._scene.mode = Cesium.SceneMode.SCENE2D;
    } else if (v.toUpperCase() === '2.5D') {
      this._scene.mode = Cesium.SceneMode.COLUMBUS_VIEW;
    } else {
      this._scene.mode = Cesium.SceneMode.SCENE3D;
    }
  }
}

export default SceneSetting;

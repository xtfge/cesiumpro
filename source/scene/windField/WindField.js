import ParticleSystem from "./particleSystem.js";
import Util from "./util.js";
import DataProcess from "./dataProcess.js";
import destroyObject from '../../core/destroyObject';
import defaultValue  from "../../core/defaultValue.js";
const {
  Cartesian2,
  Cartesian3,
  BoundingSphere,
  PrimitiveCollection,
  Color
} = Cesium;
class WindField {
  /**
   * 3D 风场可视化
   * @see https://github.com/RaymanNg/3D-Wind-Field/tree/master/Cesium-3D-Wind
   * @param {Cesium.Viewer} viewer
   * @param {object} options 具有以下属性 
   * @param {Cesium.Color} [options.color = Cesium.Color.WHITE] 粒子颜色
   * @param {number} [options.maxParticles = 128 * 128] 最大粒子数
   * @param {number} [options.particleHeight = 100] 粒子高度
   * @param {number} [options.fadeOpacity = 0.996] 渐变不透明度
   * @param {number} [options.dropRate = 0.003]
   * @param {number} [options.dropRateBump = 0.01]
   * @param {number} [options.speedFactor = 4.0]
   * @param {number} [options.lineWidth = 4.0] 线宽
   * @param {object} [options.color] 颜色表
   * @param {number} [options.particlesTextureSize = 128] 粒子纹理大小,必须为2^n
   * @example
   * const wind = new CesiumPro.WindField({
   *   maxParticles: 128 * 128,
   *   particleHeight: 100.0,
   *   fadeOpacity: 0.996,
   *   dropRate: 0.003,
   *   dropRateBump: 0.01,
   *   speedFactor: 4.0,
   *   lineWidth: 4.0
   * })
   * wind3D.loadDataFromNC('./wind.nc')
   * @returns
   */
  constructor(viewer, options) {
    const userInput = {}
    userInput.speedFactor = defaultValue(options.speedFactor, 1.0);
    userInput.lineWidth = defaultValue(options.lineWidth, 4.0);
    userInput.dropRateBump = defaultValue(options.dropRateBump, 0.01);
    userInput.dropRate = defaultValue(options.dropRate,0.003);
    userInput.particlesTextureSize = Math.ceil(Math.sqrt(defaultValue(options.maxParticles, 64*64)));
    userInput.maxParticles = userInput.particlesTextureSize * userInput.particlesTextureSize;
    userInput.fadeOpacity = defaultValue(options.fadeOpacity, 0.996);
    userInput.particleHeight = defaultValue(options.particleHeight, 100);
    userInput.color = defaultValue(options.color, Color.WHITE)
    this._maxParticles = userInput.maxParticles;
    this._color = defaultValue(options.color, "#FFFFFF");
    this.viewer = viewer;
    this.scene = this.viewer.scene;
    this.camera = this.viewer.camera;

    this.options = userInput;

    this.viewerParameters = {
      lonRange: new Cartesian2(),
      latRange: new Cartesian2(),
      pixelSize: 0.0,
    };
    // use a smaller earth radius to make sure distance to camera > 0
    this.globeBoundingSphere = new BoundingSphere(
      Cartesian3.ZERO,
      0.99 * 6378137.0
    );
    this.updateViewerParameters();
    this.imageryLayers = this.viewer.imageryLayers;
    this.primitives = new PrimitiveCollection();
    this.viewer.scene.primitives.add(this.primitives);
  }
  get fadeOpacity() {
    return this.particleSystem.userInput.fadeOpacity;
  }
  set fadeOpacity(val) {
    this.particleSystem.userInput.fadeOpacity = val;
  }
  get particleHeight() {
    return this.particleSystem.userInput.particleHeight;
  }
  set particleHeight(val) {
    this.particleSystem.userInput.particleHeight = val;
  }
  get color() {
    return this.particleSystem.userInput.color;
  }
  set color(val) {
    this.particleSystem.userInput.color = val;
  }
  /**
   * 获得或设置最大粒子个数
   */
  get maxParticles() {
    return this._maxParticles;
  }
  set maxParticles(val) {
    this._maxParticles = val;
    const changed = this.particleSystem.userInput.maxParticles !== val;
    const textureSize = Math.ceil(Math.sqrt(val));
    this.particleSystem.userInput.particlesTextureSize = textureSize;
    this.particleSystem.userInput.maxParticles = textureSize * textureSize;
    this.particleSystem.refreshParticles(changed);
  }
  /**
   * 获得或设置显隐状态
   * @type {boolean}
   */
  get show() {
    return this.primitives.show;
  }
  set show(val) {
    this.primitives.show = val;
  }
  /**
   * 获得或设置速度因子，数值越大，速度越快
   * @type {number}
   * @default 4.0
   */
  get speedFactor() {
    return this.particleSystem.userInput.speedFactor;
  }
  set speedFactor(val) {
    this.particleSystem.userInput.speedFactor = val;
  }
  /**
   * 获得或设置线宽
   * @type {number}
   * @default 4.0
   */
  get lineWidth() {
    return this.particleSystem.userInput.lineWidth;
  }
  set lineWidth(val) {
    this.particleSystem.userInput.lineWidth = val;
  }
  /**
   * 加载nc数据
   * @param {*} nc nc文件路径
   */
  loadDataFromNC(nc) {
    DataProcess.loadData(nc).then((data) => {
      this.loadDataFromJson(data);
    });
  }
  /**
   * 加载json数据
   * @param {*} windData json数据
   */
  loadDataFromJson(windData) {
    this.particleSystem = new ParticleSystem(
      this.scene.context,
      windData,
      this.options,
      this.viewerParameters
    );
    this.addPrimitives();
    this.setupEventListeners();
  }
  /**
   * 移除对象
   */
  remove() {
    this.viewer.scene.primitives.remove(this.primitives);
  }
  addPrimitives() {
    const primitives = this.primitives;
    // the order of primitives.add() should respect the dependency of primitives
    primitives.add(
      this.particleSystem.particlesComputing.primitives.calculateSpeed
    );
    primitives.add(
      this.particleSystem.particlesComputing.primitives.updatePosition
    );
    primitives.add(
      this.particleSystem.particlesComputing.primitives.postProcessingPosition
    );

    primitives.add(
      this.particleSystem.particlesRendering.primitives.segments
    );
    primitives.add(
      this.particleSystem.particlesRendering.primitives.trails
    );
    primitives.add(
      this.particleSystem.particlesRendering.primitives.screen
    );
  }
  updateViewerParameters() {
    const viewRectangle = this.camera.computeViewRectangle(
      this.scene.globe.ellipsoid
    );
    const lonLatRange = Util.viewRectangleToLonLatRange(viewRectangle);
    this.viewerParameters.lonRange.x = lonLatRange.lon.min;
    this.viewerParameters.lonRange.y = lonLatRange.lon.max;
    this.viewerParameters.latRange.x = lonLatRange.lat.min;
    this.viewerParameters.latRange.y = lonLatRange.lat.max;

    const pixelSize = this.camera.getPixelSize(
      this.globeBoundingSphere,
      this.scene.drawingBufferWidth,
      this.scene.drawingBufferHeight
    );

    if (pixelSize > 0) {
      this.viewerParameters.pixelSize = pixelSize;
    }
  }
  setupEventListeners() {
    const that = this;
    const removeMoveStart = this.camera.moveStart.addEventListener(function () {
        console.log('xxxxxxxxxxx')
      that.primitives.show = false;
    });

    const removeMoveEnd = this.camera.moveEnd.addEventListener(function () {
      that.updateViewerParameters();
      that.particleSystem.applyViewerParameters(that.viewerParameters);
      that.primitives.show = true;
    });

    let resized = false;
    function onResize() {
      resized = true;
      that.primitives.show = false;
      that.primitives.removeAll();
    }
    window.addEventListener("resize", onResize);

    const removeRender = this.scene.preRender.addEventListener(function () {
      if (resized) {
        that.particleSystem.canvasResize(that.scene.context);
        resized = false;
        that.addPrimitives();
        that.scene.primitives.show = true;
      }
    });
    this.removeEventListener = function () {
      removeMoveStart();
      removeMoveEnd();
      removeRender();
      window.removeEventListener("resize", onResize);
    };
  }
  /**
   * 销毁对象
   */
  destroy() {
    this.remove();
    this.removeEventListener && this.removeEventListener();
    destroyObject(this);
  }
}
export default WindField;

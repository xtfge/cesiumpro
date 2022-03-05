import CesiumProError from "../core/CesiumProError.js";
import defined from "../core/defined.js";
const {
    Transforms,
    Cartesian3
} = Cesium;
class Model{
    /**
     * 创建一个gltf/glb模型
     * @param {Model.ModelOptions} optinos 模型参数
     * @example
     *  const p = new CesiumPro.GeoPoint(110, 30, 10).toCartesian();
     *  const model = new CesiumPro.Model({
     *      url: '../data/models/Cesium_Air.glb',
     *      minimumPixelSize: 16,
     *      position: p
     *  })
     * viewer.addModel(model);
     * const translation = Cesium.Transforms.eastNorthUpToFixedFrame(p);
     * const rotation = Cesium.Matrix3.fromRotationX(Math.PI / 2);
     * const modelMatrix = new Cesium.Matrix4();
     * Cesium.Matrix4.multiply(translation, rotation, modelMatrix);
     * const model = new CesiumPro.Model({
     *   url: '../data/models/Cesium_Air.glb',
     *   modelMatrix:modelMatrix
     * })
     * model.readyPromise.then(() => {
     *   model.activeAnimations.addAll({
     *     multiplier: 1.5,
     *     loop: Cesium.ModelAnimationLoop.REPEAT,
     *   });
     * })
     * viewer.addModel(model)
     */
    constructor(options = {}) {
        if(!defined(options.modelMatrix)&&defined(options.position)) {
            let cartesian;
            if(options.position instanceof Cartesian3) {
                cartesian = options.position
            } else if(options.position instanceof GeoPoint) {
                cartesian = options.position.toCartesian();
            }
            if(cartesian) {
                options.modelMatrix = Transforms.eastNorthUpToFixedFrame(cartesian)
            }
        }
        if(defined(options.gltf)) {
            this.delegate = new Cesium.Model(options);
        } else if(defined(options.url)) {
            this.delegate = Cesium.Model.fromGltf(options);
        } else {
            throw new CesiumProError('one of parameters url or gltf must be provided.')
        }
        this._readyPromise = this.delegate._readyPromise;
        this._ready = this.delegate._ready
    }
    /**
     * 指示模型是否已经准备好。
     * @readonly
     * @type {Boolean}
     */
    get ready() {
        return this._ready;
    }
    /**
     * 返回一个Promise指示模型是否已经准备好。
     * @readonly
     * @type {Promise<Boolean>}
     */
    get readyPromise() {
        return this._readyPromise;
    }
    /**
     * 当前正在播放的动画
     * @type {Cesium.ModelAnimationCollection}
     */
    get activeAnimations() {
        return this.delegate.activeAnimations;
    }
    set activeAnimations(val) {
        this.delegate.activeAnimations = val;
    }
    /**
     * 如果为true,模型的每一个mesh都可以被scene.pick拾取到
     * @readonly
     * @type {Boolean}
     */
    get allowPicking() {
        return this.delegate.allowPicking;
    }
    /**
     * 决定WebGL资源是否可以分布在多个帧上，直到资源被加载完成.
     * @readonly
     * @type {Boolean}
     */
    get asynchronous() {
        return this.delegate.asynchronous;
    }
    /**
     * 是否启用背面剔除
     * @type {Boolean}
     */
    get backFaceCulling() {
        return this.delegate.backFaceCulling;
    }
    /**
     * 模型的资源（纹理、图片等）相对于模型文件的基本路径。
     */
    get basePath() {
        return this.delegate.basePath;
    }
    /**
     * 模型的边界球
     * @readonly
     * @type {Cesium.BoundingSphere}
     */
    get boundingSphere() {
        return this.delegate.boundingSphere;
    }
    /**
     * 模型的裁剪平面。
     * @type {Cesium.ClippingPlanes}
     */
    get clippingPlanes(){
        return this.delegate.clippingPlanes;
    }
    set clippingPlanes(val) {
        this.delegate.clippingPlanes = val;
    }
    /**
     * 和模型混合渲染的颜色
     * @type {Cesium.Color}
     */
    get color() {
        return this.delegate.color;
    }
    set color(val) {
        this.delegate.color = val;
    }
    /**
     * 模型和颜色的混合模型
     * @type {Cesium.ColorBlendMode}
     */
    get colorBlendMode() {
        return this.delegate.colorBlendMode;
    }
    set colorBlendMode(val) {
        this.delegate.colorBlendMode = val;
    }
    /**
     * 颜色的混合强度，当为0是，仅使渲染为模型颜色，当为1时，将渲染为纯色。仅当colorBlendMode为Cesium.ColorBlendMode.MIX时有效。
     */
    get colorBlendAmount() {
        return this.delegate.colorBlendAmount;
    }
    set colorBlendAmount(val) {
        this.delegate.colorBlendAmount = val
    }
    /**
     * 模型的credit信息。
     * @type {String|Cesium.Credit}
     */
    get credit() {
        return this.delegate.credit;
    }
    set credit(val) {
        this.delegate.credit = val;
    }
    /**
     * 是否为每个命令绘制边界，仅用于调试
     * @type {Boolean}
     */
    get debugShowBoundingVolume(){
        return this.delegate.debugShowBoundingVolume;
    }
    set debugShowBoundingVolume(val){
        this.delegate.debugShowBoundingVolume = val;
    }
    /**
     * 是否以线框模式渲染模型
     * @type {Boolean}
     */
    get debugWireframe() {
        return this.delegate.debugWireframe;
    }
    set debugWireframe (val){
        this.delegate.debugWireframe = val;
    }
    /**
     * 模型相对与相机距离的显示条件
     * @type {Cesium.DistanceDisplayCondition}
     */
    get distanceDisplayCondition() {
        return this.delegate.distanceDisplayCondition;
    }
    set distanceDisplayCondition(val) {
        this.delegate.distanceDisplayCondition = val;
    }
    /**
     * gltf JSON对象
     * @readonly
     * @type {Object}
     */
    get gltf() {
        return this.delegate.gltf;
    }
    /**
     * 用于自定义对象，会在scene.pick中返回。
     * @type {Object}
     */
    get id() {
        return this.delegate.id;
    }
    set id(val) {
        this.delegate.id = val;
    }
    /**
     * 最大缩放比例
     * @type {Number}
     */
    get maximumScale() {
        return this.delegate.maximumScale;
    }
    set maximumScale(val){
        this.delegate.maximumScale = val;
    }
    /**
     * 模型渲染的最小像素，不受缩放比例的影响
     * @type {Number}
     */
    get minimumPixelSize() {
        return this.delegate.minimumPixelSize;
    }
    set minimumPixelSize(val){
        this.delegate.minimumPixelSize = val;
    }
    /**
     * 模型矩阵，用于将模型从模型坐标转为世界坐标。
     * @type {Cesium.Matrix4}
     */
    get modelMatrix() {
        return this.delegate.modelMatrix;
    }
    set modelMatrix(val){
        this.delegate.modelMatrix = val;
    }
    /**
     * 缩放比例
     * @type {Number}
     */
    get scale() {
        return this.delegate.scale;
    }
    set scale(val) {
        this.delegate.scale = val;
    }
    /**
     * 阴影模式
     * @type {Cesium.ShadowMode}
     */
    get shadows() {
        return this.delegate.shadows;
    }
    set shadows(val) {
        this.delegate.shadows = val;
    }
    /**
     * 是否显示模型
     * @type {Boolean}
     */
    get show() {
        return this.delegate.show;
    }
    set show(val) {
        this.delegate.show = val;
    }
    /**
     * 是否使用 CESIUM_primitive_outline扩展显示模型轮廓
     * @type {Boolean}
     * @readonly
     * @ignore
     */
    get showOutline() {
        return this.delegate.showOutline;
    }
    /**
     * 模型轮廓颜色
     * @type {Cesium.Color}
     * @default {Cesium.Color.RED}
     */
    get silhouetteColor() {
        return this.delegate.silhouetteColor;
    }
    set silhouetteColor(val) {
        this.delegate.silhouetteColor = val;
    }
    /**
     * 模型轮廓大小
     * @type {Number}
     */
    get silhouetteSize() {
        return  this.delegate.silhouetteSize
    }
    set silhouetteSize(val) {
        this.delegate.silhouetteSize = val;
    }
    /**
     * 是否支持显示模型轮廓
     * @param {Viewer} viewer 
     * @returns {Boolean} true表示支持模型轮廓显示
     */
    static silhouetteSupported(viewer) {
        return Cesium.Model.silhouetteSupported(viewer.scene)
    }
    /**
     * 销毁模型
     * @example
     * if(!model.isDestroyed()) {
     *    model.destroy()
     * }
     */
    destroy() {
        this.delegate.destroy()
    }
    /**
     * 模型是否被销毁
     */
    isDestroyed() {
        this.delegate.isDestroyed()
    }
    /**
     * 获得模型材质
     * @param {String} name 材质名称
     * @returns {Cesium.ModelMaterial}
     */
    getMaterial(name){
        return this.delegate.getMaterial(name);
    }
    /**
     * 获得模型mesh
     * @param {String} name mesh名称
     * @returns {Cesium.ModelMesh}
     */
    getMesh(name) {
        return this.delegate.getMesh(name);
    }
    /**
     * 获得模型节点
     * @param {String} name node名称
     * @returns {Cesium.ModelNode}
     */
    getNode(name) {
        return this.delegate.getNode(name);
    }
}
/**
 * 模型加载选项
 * @typedef ModelOptions
 * @memberof Model
 * @property {Object|ArrayBuffer|Uint8Array} [gltf] 一个gltf的JSON对象或gltf二进制buffer
 * @property {Cesium.Resource|String} [url] 一个glb/gltlf文件的url
 * @property {GeoPoint|Cesium.Cartesian3} position 模型位置，如果定义了modelMatrix则该属性不生效。
 * @property {Cesium.Resource|String} [basePath=''] url的相对路径
 * @property {Boolean} [show=true] 决定模型是否被显示
 * @property {Cesium.Matrix4} [modelMatrix=Cesium.Matrix4.IDENTITY] 模型矩阵，用于将模型从模型坐标转换到世界坐标，如果未定义将使用position计算模型矩阵
 * @property {Number} [scale=1.0] 模型缩放比例
 * @property {Number} [minimumPixelSize=0.0] 模型显示的最小像素大小，不考虑缩放。
 * @property {Number} [maximumScale] 最大缩放比例。
 * @property {Object} [id] 自定义对象，会通过scene.pick返回。
 * @property {Boolean} [allowPicking=true] 是否允许被scene.pick选中
 * @property {Boolean} [incrementallyLoadTextures=true] 确定模型加载完成后纹理是否可以继续加载。
 * @property {Boolean} [asynchronous=true] 确定webgl资源是否可以分布在多个帧上，直到资源被加载完成。
 * @property {Boolean} [clampAnimations=true] 确定模型是否应在未指定关键帧的帧上保持姿态。
 * @property {ShadowMode} [shadows=Cesium.ShadowMode.ENABLED] 决定模型是否接收来自光源的阴影。
 * @property {Boolean} [debugShowBoundingVolume=false] 是否为每个绘制命令绘制边界球体，仅用于调试。
 * @property {Boolean} [debugWireframe=false] 是否以线框模式显示模型
 * @property {Cesium.HeightReference} [heightReference=Cesium.HeightReference.NONE] 相对于地球的高度参考。
 * @property {Cesium.Scene} [scene] 对于使用heightReference的模型必须传入。
 * @property {Cesium.DistanceDisplayCondition} [distanceDisplayCondition] 确定模型相对于相机距离的显示条件。
 * @property {Cesium.Color} [color=Cesium.Color.WHITE] 与模型渲染颜色混合的颜色
 * @property {Cesium.ColorBlendMode} [colorBlendMode=Cesium.ColorBlendMode.HIGHLIGHT] 颜色混合模型
 * @property {Number} [colorBlendAmount=0.5] 为0时模型将渲染为模型颜色，为1时将渲染为纯色，仅在<code>colorBlendMode = Cesium.ColorBlendMode.MIX</code>时有效
 * @property {Cesium.Color} [silhouetteColor=Cesium.Color.RED] 模型轮廓的颜色。
 * @property {Number} [silhouetteSize=0.0] 模型轮廓大小。
 * @property {Cesium.ClippingPlaneCollection} [clippingPlanes] 模型裁剪平面。
 * @property {Cesium.Credit|String} [credit] 模型的信用信息。
 */
export default Model;
import LonLat from '../core/LonLat.js'
function adjustLocation(tileset, transform, position, rotationZ) {
    if(transform) {
        tileset.root.transform = transform;
    } else {
        const matrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
        const rotation = Cesium.Matrix3.fromRotationZ(rotationZ);
        Cesium.Matrix4.multiplyByMatrix3(matrix, rotation, matrix);
        Cesium.Matrix4.multiply(tileset.root.transform, matrix, tileset.root.transform)
    }
}
function translate(tileset, position) {
    
    const matrix = new Cesium.Matrix4()
    Cesium.Matrix4.fromTranslation(position, matrix);
    Cesium.Matrix4.multiply(tileset.modelMatrix, matrix, tileset.modelMatrix)
}
function rotate (tileset, rotationZ) {
    const rotation = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rotationZ));
    Cesium.Matrix4.multiplyByMatrix3(tileset.root.transform, rotation, tileset.root.transform);
}
function adjustHeight(tileset, height) {
    const {
        center
    } = tileset.boundingSphere;
    const coord = LonLat.fromCartesian(center);
    const surface = Cesium.Cartesian3.fromDegrees(coord.lon, coord.lat, 0);
    const offset = Cesium.Cartesian3.fromDegrees(coord.lon, coord.lat, height);
    const translation = Cesium.Cartesian3.subtract(
        offset,
        surface,
        new Cesium.Cartesian3(),
    );

    tileset.modelMatrix = Cesium.Matrix4.multiply(tileset.modelMatrix,
        Cesium.Matrix4.fromTranslation(translation), tileset.modelMatrix);
}
class Tileset {
    /**
     * 添加3d tile set数据集。
     * @param {Tileset.Options} options 
     */
    constructor(options = {}, kwargs = {}) {
        this._params = {
            height: 0,
            position: new Cesium.Cartesian3(0, 0, 0),
            rotation: 0
        };
        let {
            transform,
            position,
            height,
            rotationZ,
            debug
        } = options;
        const cesium3dtileset = new Cesium.Cesium3DTileset(options);
        cesium3dtileset.readyPromise.then((tileset) => {
            viewer.scene.primitives.add(tileset);
            if (Cesium.defined(position)) {
                adjustLocation(tileset, transform, position, rotationZ);
            }
            if (Cesium.defined(height)) {
                adjustHeight(tileset, height);
            }
            if (debug) {
                let height0 = 0, position0 = new Cesium.Cartesian3(), rotation0 = 0;
                parent.onkeypress = function (e) {
                    // 升高
                    if (e.keyCode === 'Q'.charCodeAt() || e.keyCode === 'q'.charCodeAt()) {
                        height0 = 1;
                    }
                    // 降低
                    else if (e.keyCode === 'E'.charCodeAt() || e.keyCode === 'e'.charCodeAt()) {
                        height0 = -1;
                    }
                    // 平移
                    else if (e.keyCode === 'A'.charCodeAt() || e.keyCode === 'a'.charCodeAt()) {
                        position0 = new Cesium.Cartesian3(-2, 0, 0);
                    } else if (e.keyCode === 'D'.charCodeAt() || e.keyCode === 'd'.charCodeAt()) {
                        position0 = new Cesium.Cartesian3(2, 0, 0);
                    } else if (e.keyCode === 'W'.charCodeAt() || e.keyCode === 'w'.charCodeAt()) {
                        position0 = new Cesium.Cartesian3(0, -2, 0);
                    } else if (e.keyCode === 'S'.charCodeAt() || e.keyCode === 's'.charCodeAt()) {
                        position0 = new Cesium.Cartesian3(0, 2, 0);
                    }
                    // 旋转
                    else if (e.keyCode === 'Z'.charCodeAt() || e.keyCode === 'z'.charCodeAt()) {
                        rotation0 = -1;
                    } else if (e.keyCode === 'X'.charCodeAt() || e.keyCode === 'x'.charCodeAt()) {
                        rotation0 = 1;
                    }
                    translate(tileset, position0);
                    rotate(tileset, rotation0)
                    adjustHeight(tileset, height0)
                    rotation0 = 0;
                    position0 = new Cesium.Cartesian3();
                    height0 = 0;
                };
            }
        })
        this.delegate = cesium3dtileset;
    }
    /**
     * 满足此帧屏幕空间错误的所有瓦片加载完成后触发的事件
     * @type {Event}
     * @readonly
     * @example
     * tileset.allTilesLoaded.addEventListener(function() {
     *    console.log('All tiles are loaded');
     * });
     */
    get allTilesLoaded() {
        return this.delegate.allTilesLoaded
    }
    /**
     * 返回一个promise,指示模型是否准备完成
     * @type {Promise}
     * @readonly
     */
    get readyPromise() {
        return this.delegate.readyPromise;
    }
    /**
     * 模型的包围球
     * @type {Cesium.BoundingSphere}
     * @readonly
     * @example
     * var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
     *     url : 'http://localhost:8002/tilesets/Seattle/tileset.json'
     * }));
     * 
     * tileset.readyPromise.then(function(tileset) {
     *     // Set the camera to view the newly added tileset
     *     viewer.camera.viewBoundingSphere(tileset.boundingSphere, new Cesium.HeadingPitchRange(0, -0.5, 0));
     * });
     */
    get boundingSphere() {
        return this.delegate.boundingSphere;
    }
    /**
     * 样式颜色和模型颜色的混合比例，仅当{@link Tileset#colorBlendMode} 为<code>MIX</code>时生效, 
     * 如果为0，将完全显示模型的颜色，如果为1，将完全显示样式的颜色
     * @type {Number}
     * @default 0.5
     */
    get colorBlendAmount() {
        return this.delegate.colorBlendAmount
    }
    set colorBlendAmount(val) {
        this.delegate.colorBlendAmount = val;
    }
    /**
     * 样式颜色和模型颜色的混合模式
     * @type {Cesium.Cesium3DTileColorBlendMode}
     * @default Cesium.Cesium3DTileColorBlendMode.HIGHLIGHT
     */
    get colorBlendMode() {
        return this.delegate.colorBlendMode
    }
    set colorBlendMode(val) {
        this.delegate.colorBlendMode = val;
    }
    /**
     * 模型样式
     * @type {Cesium.Cesium3DTileStyle}
     * @example
     * tileset.style = new Cesium.Cesium3DTileStyle({
     *   color: "rgba(255, 0, 0, 0.5)",
     * });
     * tileset.style = new Cesium.Cesium3DTileStyle({
     *    color : {
     *        conditions : [
     *            ['${Height} >= 100', 'color("purple", 0.5)'],
     *            ['${Height} >= 50', 'color("red")'],
     *            ['true', 'color("blue")']
     *        ]
     *    },
     *    show : '${Height} > 0',
     *    meta : {
     *        description : '"Building id ${id} has height ${Height}."'
     *    }
     * });
     */
    get style() {
        return this.delegate.style;
    }
    set style(val) {
        this.delegate.style = val;
    }
    /**
     * 自定义着色器，仅在Cesium.ExperimentalFeatures.enableModelExperimental为true时生效
     * @type {Cesium.CustomShader}
     */
    get customShader() {
        return this.delegate.customShader;
    }
    set customShader(val) {
        this.delegate.customShader = val;
    }
    /**
     * 为每个瓦片随机设置不同的颜色，仅用于调试
     * @type {Boolean}
     * @default false
     */
    get debugColorizeTiles() {
        return this.delegate.debugColorizeTiles
    }
    set debugColorizeTiles(val) {
        this.delegate.debugColorizeTiles = val;
    }
    /**
     * @type {Boolean}
     * 仅用于调试。
     * 如果为true，则将数据冻结到上一帧。
     */
    get debugFreezeFrame() {
        return this.delegate.debugFreezeFrame;
    }
    set debugFreezeFrame(val) {
        this.delegate.debugFreezeFrame = val;
    }
    /**
     * @type {Boolean}
     * 仅用于调试。
     * 如果为 true，则为每个可见图块渲染边界体积。如果图块具有内容边界体积或为空，则边界体积为白色；
     * 否则，它是红色的。不符合屏幕空间错误且仍在对其后代进行加载的瓦片为黄色。
     */
    get debugShowBoundingVolume() {
        return this.delegate.debugShowBoundingVolume;
    }
    set debugShowBoundingVolume(val) {
        this.delegate.debugShowBoundingVolume = val;
    }
    /**
     * @type {Boolean}
     * 仅用于调试。
     * 如果为 true，则为每个可见图块的内容渲染边界体积。如果图块具有内容边界体积，则边界体积为蓝色；否则它是红色的。
     */
    get debugShowContentBoundingVolume() {
        return this.delegate.debugShowContentBoundingVolume;
    }
    set debugShowContentBoundingVolume(val) {
        this.delegate.debugShowContentBoundingVolume = val;
    }
    /**
     * @type {Boolean}
     * 仅用于调试。
     * 如果为true，将使用label显示每个瓦片的几何误差。
     */
    get debugShowGeometricError() {
        return this.delegate.debugShowGeometricError;
    }
    set debugShowGeometricError(val) {
        this.delegate.debugShowGeometricError = val;
    }
    /**
     * @type {Boolean}
     * 仅用于调试
     * 如果为true，将使用label显示每个瓦片的内存使用情况
     */
    get debugShowMemoryUsage() {
        return this.delegate.debugShowMemoryUsage;
    }
    set debugShowMemoryUsage(val) {
        this.delegate.debugShowMemoryUsage = val;
    }
    /**
     * 仅用于调试。
     * 如果为 true，则绘制标签以指示每个图块的命令、点、三角形和特征的数量。
     * @type {Boolean}
     */
    get debugShowRenderingStatistics() {
        return this.delegate.debugShowRenderingStatistics;
    }
    set debugShowRenderingStatistics(val) {
        this.delegate.debugShowRenderingStatistics = val;
    }
    /**
     * 仅用于调试。
     * 如果为true，将显示每个瓦片的url。
     * @type {Boolean}
     */
    get debugShowUrl() {
        return this.delegate.debugShowUrl;
    }
    set debugShowUrl(val) {
        this.delegate.debugShowUrl = val;
    }
    /**
     * 仅用于调试。
     * 如果为true，将使用线框模式显示模型。
     * @type {Boolean}
     */
    get debugWireframe() {
        return this.delegate.debugWireframe;
    }
    set debugWireframe(val) {
        this.delegate.debugWireframe = val;
    }
    /**
     * 优化选项。
     * 如果为true, 瓦片集是将根据动态屏幕空间误差进行优化，较远的图块将呈现比更近的图块更低的细节。
     * 这可以通过渲染更少的图块和发出更少的请求来提高性能，但可能会导致远处图块的视觉质量略有下降。
     * 对于紧密拟合的边界体积，结果更准确。
     * @type {Boolean}
     * @default false
     */
    get dynamicScreenSpaceError() {
        return this.delegate.dynamicScreenSpaceError;
    }
    set dynamicScreenSpaceError(val) {
        this.delegate.dynamicScreenSpaceError = val;
    }
    /**
     * 用于增加动态屏幕空间误差的图块屏幕空间误差的因子。该值越大，渲染请求的图块越少，
     * 远处的图块的细节就越少。如果设置为零，该功能将被禁用。
     * @type {Number}
     * @default 4.0
     */
    get dynamicScreenSpaceErrorFactor() {
        return this.delegate.dynamicScreenSpaceErrorFactor;
    }
    set dynamicScreenSpaceErrorFactor(val) {
        this.delegate.dynamicScreenSpaceErrorFactor = val;
    }
    /**
     * 获取瓦片集的扩展对象属性。
     * @type {Object}
     * @readonly
     */
    get extensions() {
        return this.delegate.extensions;
    }
    /**
     * 返回extras图块集JSON顶层的属性，其中包含特定于应用程序的元数据。
     * @type {any}
     * @see {@link https://github.com/CesiumGS/3d-tiles/tree/main/specification#specifying-extensions-and-application-specific-extras|3D Tiles 规范中}
     */
    get extras() {
        return this.delegate.extras;
    }
    /**
     * 优化选项。
     * 范围为[0, 1)。
     * @default 0.00278
     * @type {Number}
     */
    get dynamicScreenSpaceErrorDensity() {
        return this.delegate.dynamicScreenSpaceErrorDensity;
    }
    set dynamicScreenSpaceErrorDensity(val) {
        this.delegate.dynamicScreenSpaceErrorDensity = val;
    }
    /**
     * 优化选项。
     * 通过暂时提高屏幕边缘周围图块的屏幕空间错误，优先加载屏幕中心的图块。
     * @type {Boolean}
     * @default true
     */
    get foveatedScreenSpaceError() {
        return this.delegate.foveatedScreenSpaceError;
    }
    set foveatedScreenSpaceError(val) {
        this.delegate.foveatedScreenSpaceError = val;
    }
    /**
     * 优化选项, 仅当{@link Tileset#foveatedScreenSpaceError}为true时生效。
     * 用来控制决定延迟哪些图块的锥体大小。立即加载此圆锥内的瓷砖，圆锥外的瓷砖可能会根据它们在圆锥外的距离
     * 而延迟加载。将此设置为0.0意味着圆锥将是由相机位置及其视图方向形成的线。将此设置为1.0意味着锥体
     * 包含相机的整个视野​​，基本上禁用效果。
     * @type {Number}
     * @default 0.3
     */
    get foveatedConeSize() {
        return this.delegate.foveatedConeSize;
    }
    set foveatedConeSize(val) {
        this.delegate.foveatedConeSize = val;
    }
    /**
     * 获取或设置一个回调，以控制为中心锥体外的图块提高多少屏幕空间错误，{@link Tileset#foveatedMinimumScreenSpaceErrorRelaxation}
     * 和{@link Tileset#maximumScreenSpaceError}之间插值获得。
     * @type {Tileset.FoveatedInterpolationCallback}
     */
    get foveatedInterpolationCallback() {
        return this.delegate.foveatedInterpolationCallback;
    }
    set foveatedInterpolationCallback(val) {
        this.delegate.foveatedInterpolationCallback = val;
    }
    /**
     * {@link 当Tileset#foveatedScreenSpaceError}为true时，用于控制锥体外的瓦片的起始屏幕空间误差。
     * @type {Number}
     * @default 0.0
     */
    get foveatedMinimumScreenSpaceErrorRelaxation() {
        return this.delegate.foveatedMinimumScreenSpaceErrorRelaxation;
    }
    set foveatedMinimumScreenSpaceErrorRelaxation(val) {
        this.delegate.foveatedMinimumScreenSpaceErrorRelaxation = val;
    }
    /**
     * 当{@link Tileset#foveatedScreenSpaceError}为true时，用于控制锥体外的瓦片延迟多长时间加载。
     * @type {Number}
     * @default 0.2
     */
    get foveatedTimeDelay() {
        return this.delegate.foveatedTimeDelay;
    }
    set foveatedTimeDelay(val) {
        this.delegate.foveatedTimeDelay = val;
    }
    /**
     * 模型接收了来自地球、天空、大气和星空天空盒的光照。该值用于增加或降低这些光照强度。
     * 值0.0将禁用这些光源。
     * @type {Cesium.Cartesian2};
     * @default new Cesium.Cartesian2(1, 1)
     */
    get imageBasedLightingFactor() {
        return this.delegate.imageBasedLightingFactor;
    }
    set imageBasedLightingFactor(val) {
        this.delegate.imageBasedLightingFactor = val;
    }
    /**
     * 只下载满足最大屏幕空间误差的瓦片，忽略跳过因子。
     * 只有{@link Tileset#skipLevelOfDetail}为true时使用。
     * @type {Boolean}
     * @default false;
     */
    get immediateLoadDesiredLevelOfDetail() {
        return this.delegate.immediateLoadDesiredLevelOfDetail;
    }
    set immediateLoadDesiredLevelOfDetail(val) {
        this.delegate.immediateLoadDesiredLevelOfDetail = val;
    }
    /**
     * 满足当前屏幕空间误差的所有瓦片第一次加载完成后触发该事件。
     * @type {Event}
     * @readonly
     * @example
     * tileset.initialTilesLoaded.addEventListener(function() {
     *     console.log('Initial tiles are loaded');
     * });
     */
    get initialTilesLoaded() {
        return this.delegate.initialTilesLoaded;
    }
    /**
     * 使用该光线代替环境光。
     * @type {Cesium.Cartesian3}
     * @default undefined
     */
    get lightColor() {
        return this.delegate.lightColor
    }
    set lightColor(val) {
        this.delegate.lightColor = val;
    }
    /**
     * 触发事件以指示加载新图块的进度。当请求新切片时、请求的切片完成下载以及下载的切片已处理并准备好渲染时，将触发此事件。
     * 请求挂起的瓦片数numberOfPendingRequests数和处理完成的瓦片数numberOfTilesProcessing将传递给事件侦听器。
     * @type {Event}
     * @readonly
     * @example
     * tileset.loadProgress.addEventListener(function(numberOfPendingRequests, numberOfTilesProcessing) {
     *    if ((numberOfPendingRequests === 0) && (numberOfTilesProcessing === 0)) {
     *        console.log('Stopped loading');
     *        return;
     *    }
     *
     *    console.log('Loading: requests: ' + numberOfPendingRequests + ', processing: ' + numberOfTilesProcessing);
     *});
     */
    get loadProgress() {
        return this.delegate.loadProgress;
    }
    /**
     * 是否下载可见瓦片的兄弟瓦片。
     * @type {Boolean}
     * @default false
     */
    get loadSiblings() {
        return this.delegate.loadSiblings;
    }
    /**
     * 可用于缓存切片的最大GPU内存（以 MB 为单位）。该值是根据已加载切片的几何、纹理和批处理表纹理估计的,
     * 对于点云，此值还包括每点元数据。如果满足当前屏幕空间误差（由{@link Tileset#maximumScreenSpaceError}确定）
     * 的图块所需的内存大小超过了maximumMemoryUsage，则使用真正需要的内存大小。例如，如果最大值为256 MB，
     * 但需要300MB的图块来满足屏幕空间错误，则可能会加载300MB的图块，当这些瓷砖消失时，它们将被卸载。
     * @type {Number}
     * @default 512
     */
    get maximumMemoryUsage() {
        return this.delegate.maximumMemoryUsage;
    }
    set maximumMemoryUsage(val) {
        this.delegate.maximumMemoryUsage = val;
    }
    /**
     * 用于驱动细节细化级别的最大屏幕空间误差。如果瓦片的屏幕空间误差超过maximumScreenSpaceError，则会对其后代进行细化。
     * 根据模型数据，maximumScreenSpaceError可能需要进行调整以达到适当的平衡。较高的值可提供更好的性能，但会降低视觉质量。
     * @type {Number}
     * @default 16
     */
    get maximumScreenSpaceError() {
        return this.delegate.maximumScreenSpaceError;
    }
    set maximumScreenSpaceError(val) {
        this.delegate.maximumScreenSpaceError = val;
    }
    /**
     * 模型矩阵
     * @type {Cesium.Matrix4}
     * @default Cesium.Matrix4.IDENTITY
     * @example
     * // 调整模型高度
     * var heightOffset = 20.0;
     * var boundingSphere = tileset.boundingSphere;
     * var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
     * var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
     * var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
     * var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
     * tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
     */
    get modelMatrix() {
        return this.delegate.modelMatrix;
    }
    set modelMatrix(val) {
        this.delegate.modelMatrix = val;
    }
    /**
     * 使用 3D Tiles 渲染点云时基于几何误差执行点衰减的选项。
     * @type {Cesium.PointCloudShading}
     */
    get pointCloudShading() {
        return this.delegate.pointCloudShading;
    }
    set pointCloudShading(val) {
        this.delegate.pointCloudShading;
    }
    /**
     * 优化选项。
     * 如果为true，将优先装载叶子节点。
     * @type {Boolean}
     * @default false
     */
    get preferLeaves() {
        return this.delegate.preferLeaves;
    }
    set preferLeaves(val) {
        this.delegate.preferLeaves = val;
    }
    /**
     * 优化选项。
     * 如果为true, 将在相机飞行过程中加载目的地的瓦片。
     * @type {Boolean}
     * @default true
     */
    get preloadFlightDestinations() {
        return this.delegate.preloadFlightDestinations;
    }
    set preloadFlightDestinations(val) {
        this.delegate.preloadFlightDestinations;
    }
    /**
     * 优化选项。
     * 如果为true，将在瓦片隐藏的情况下预加载瓦片。
     * @type {Boolean}
     * @default false
     */
    get preloadWhenHidden() {
        return this.delegate.preloadWhenHidden;
    }
    set preloadWhenHidden(val) {
        this.delegate.preloadWhenHidden;
    }
    /**
     * 优化选项。
     * 如果介于 (0.0, 0.5] 之间，将助于在瓦片继续加载的同时快速铺设一层瓦片。
     */
    get progressResolutionHeightFraction() {
        return this.delegate.progressResolutionHeightFraction;
    }
    set progressResolutionHeightFraction(val) {
        this.delegate.progressResolutionHeightFraction = val;
    }
    /**
     * 获取瓦片集的属性字典对象，其中包含有关每个特征属性的元数据.
     * @type {Object}
     * @readonly
     */
    get properties() {
        return this.delegate.properties;
    }
    /**
     * 定义模型资源的对象。
     * @type {Cesium.Resource}
     */
    get resource() {
        return this.delegate.resource;
    }
    /**
     * 模型根瓦片。
     * @type {Cesium3DTile}
     */
    get root() {
        return this.delegate.root;
    }
    /**
     * 确定瓦片集是投射还是接收来自光源的阴影。
     * 启用阴影将降低性能。
     * 只有{@link Cesium.Viewer#shadow}为true时，才会渲染阴影。
     * @type {Cesium.ShadowMode}
     * @default Cesium.ShadowMode.ENABLED
     */
    get shadows() {
        return this.delegate.shadows;
    }
    set shadows(val) {
        this.delegate.shadows = val;
    }
    /**
     * 是否显示模型轮廓
     * @type {Boolean}
     * @readonly
     */
    get showOutline() {
        return this.delegate.showOutline;
    }
    /**
     * 优化选项。
     * 确定是否应在遍历期间应用详细级别跳过，当为true时，tilese需要的内存显著减少。
     * @type {Boolean}
     * @default false
     */
    get skipLevelOfDetail () {
        return this.delegate.skipLevelOfDetail;
    }
    set skipLevelOfDetail (val) {
        this.delegate.skipLevelOfDetail 
    }
    /**
     * 常量定义加载图块时要跳过的最小级别数。
     * 例如，如果图块为1级，则不会加载图块，除非它们的级别大于 2。为0时，不跳过任何级别。
     * 仅当{@link Tileset#skipLevelOfDetail}为true时使用。
     * @type {Number}
     * @default 1
     */
    get skipLevels() {
        return this.delegate.skipLevels;
    }
    set skipLevels(val) {
        this.delegate.skipLevels=val;
    }
    /**
     * 定义要跳过的最小屏幕空间错误的乘数。
     * 例如，如果图块的屏幕空间误差为100，则不会加载图块，除非它们是叶子或屏幕空间误差<= 100 / skipScreenSpaceErrorFactor。
     * @type {Number}
     * @default 16
     */
    get skipScreenSpaceErrorFactor () {
        return this.delegate.skipScreenSpaceErrorFactor;
    }
    set skipScreenSpaceErrorFactor (val) {
        this.delegate.skipScreenSpaceErrorFactor = val;
    }

    /**
     * 模型裁剪平面
     * @type {Cesium.ClippingPlaneCollection}
     */
    get clippingPlanes() {
        return this.delegate.clippingPlanes
    }
    set clippingPlanes(val) {
        this.delegate.clippingPlanes = val;
    }
    /**
     * KTX 文件的 URL，其中包含高光照明的立方体贴图和卷积高光 mipmap。
     * @type {String}
     * @see {@link https://sandcastle.cesium.com/index.html?src=Image-Based%20Lighting.html}
     */
    get specularEnvironmentMaps() {
        return this.delegate.specularEnvironmentMaps
    }
    set specularEnvironmentMaps(val) {
        this.delegate.specularEnvironmentMaps = val;
    }
    /**
     * 瓦片加载失败时触发的事件
     * 如果没有事件侦听器，错误消息将记录到控制台。
     * 传递给侦听器的错误对象包含两个属性：
     * <ul>
     *  <li>url: 失败磁贴的 url。</li>
     *  <li>message: 错误信息。<li>
     * </ul>
     * @type {Event}
     * @readonly
     * @example
     * tileset.tileFailed.addEventListener(function(error) {
     *     console.log('An error occurred loading tile: ' + error.url);
     *     console.log('Error: ' + error.message);
     * });
     */
    get tileFailed() {
        return this.delegate.tileFailed ;
    }
    /**
     * 触发事件以指示已加载磁贴的内容。
     * 加载Cesium3DTile的内容被传递给事件监听器。
     * 此事件在帧被渲染时在图块集遍历期间被触发，以便对图块的更新在同一帧中生效。不要在事件监听期间创建或修改entities或primitives.
     * @type {Event}
     * @example
     * tileset.tileLoad.addEventListener(function(tile) {
     *     console.log('A tile was loaded.');
     * });
     */
    get tileLoad () {
        return this.delegate.tileLoad;
    }
    set tileLoad(val) {
        this.delegate.tileLoad = val;
    }
    /**
     * 触发该事件以指示已卸载磁贴的内容。
     * 卸载Cesium3DTile的被传递给事件监听器。
     * 不要在事件监听期间创建或修改entities或primitives.
     * @type {Event}
     * tileset.tileUnload.addEventListener(function(tile) {
     *     console.log('A tile was unloaded from the cache.');
     * });
     * @see {@link Tileset#maximumMemoryUsage}
     * @see {@link Tileset#trimLoadedTiles}
     */
    get tileUnload() {
        return this.delegate.tileUnload;
    }
    set tileUnload(val) {
        this.delegate.tileUnload=val;
    }
    /**
     * 如果为true, 当前视图的所有瓦片被加载完成。
     * @type {Boolean
     */
    get tilesLoaded () {
        return this.delegate.tilesLoaded;
    }
    /**
     * 对于帧中的每个可见图块，此事件每帧都会触发一次。这可用于手动设置图块集的样式。
     * 可见Cesium3DTile的被传递给事件监听器。
     * 不要在事件监听期间创建或修改entities或primitives.
     * @type {Event}
     * @example
     * // Apply a red style and then manually set random colors for every other feature when the tile becomes visible.
     * tileset.style = new Cesium.Cesium3DTileStyle({
     *     color : 'color("red")'
     * });
     * tileset.tileVisible.addEventListener(function(tile) {
     *     var content = tile.content;
     *     var featuresLength = content.featuresLength;
     *     for (var i = 0; i < featuresLength; i+=2) {
     *         content.getFeature(i).color = Cesium.Color.fromRandom();
     *     }
     * });
     */
    get tileVisible() {
        return this.delegate.tileVisible;
    }
    set tileVisible (val) {
        this.delegate.tileVisible =val
    }
    /**
     * 返回瓦片集加载和第一次更新以来的时间，以毫秒为单位。
     * @type {Number}
     * @readonly
     */
    get timeSinceLoad () {
        return this.delegate.timeSinceLoad ;
    }
    /**
     * 瓦片集使用的GPU内存总量（以字节为单位）。该值是根据加载的切片的几何、纹理和批处理表纹理估计的。对于点云，此值还包括每点元数据。
     * @type {Number}
     * @readonly
     */
    get totalMemoryUsageInBytes () {
        return  this.delegate.totalMemoryUsageInBytes ;
    }
    /**
     * 决定地形、3D 瓦片是否被此瓦片集分类。
     * 此选项仅适用于包含批处理 3D 模型、几何数据或矢量数据的瓦片集。即使未定义，矢量数据和几何数据也必须作为分类渲染，并且默认在地形和其他 3D Tiles 瓦片集上渲染
     * @type {Cesium.ClassificationType}
     */
    get classificationType() {
        return this.delegate.classificationType
    }
    set classificationType(val) {
        this.delegate.classificationType = val;
    }
    /**
     * 在跳过详细级别之前必须达到的屏幕空间误差。
     * @type {Number}
     * @default 1024
     */
    get baseScreenSpaceError() {
        return this.delegate.baseScreenSpaceError
    }
    set baseScreenSpaceError(val) {
        this.delegate.baseScreenSpaceError = val;
    }
    /**
     * 销毁此对象占用的WebGL资源。销毁一个对象允许确定性地释放WebGL资源，而不是依赖垃圾收集器来销毁这个对象。
     * 一旦一个对象被销毁，它就不应该被使用；调用除此之外的任何函数 isDestroyed都会导致DeveloperError异常。
     * @throws {Cesium.DeveloperError}
     * @example
     * tileset = tileset && tileset.destroy();
     */
    destroy() {
        this.delegate.destroy()
    }
    hasExtension(name) {
        return this.delegate.hasExtension(name);
    }
    /**
     * 如果此对象被销毁，则返回 true；否则返回false。
     * @returns {Boolean}
     */
    isDestroyed() {
        return this.delegate.isDestroyed();
    }
    /**
     * 将图块集标记Tileset#style为dirty，这会强制所有功能重新评估下一帧中的样式。
     */
    makeStyleDirty () {
        return this.delegate.makeStyleDirty();
    }
    /**
     * 卸载上一帧未选择的所有图块。这可用于显式管理切片缓存并减少下面加载的切片总数{@link Tileset#maximumMemoryUsage}
     * 瓦片将在下一帧被卸载。
     */
    trimLoadedTiles() {
        this.delegate.trimLoadedTiles();
    }
    /**
     * 提供一个钩子来覆盖用于请求从远程服务器获取图块集时有用的图块集json的方法
     * @param {String|Cesium.Resource} json 要获取的json文件的url
     * @returns {Promise<Object>} json解析结果
     */
    static loadJson(json) {
        return Cesium3DTileset.loadJson(json);
    }
}
/**
* 当{@link Tileset#foveatedScreenSpaceError}为true时，计算中心锥体外的图块屏幕空间误差的插值函数
* 
* @typedef FoveatedInterpolationCallback
* @memberof Tileset
* @default Cesium.Math.lerp
*
* @property {Number} p 要插值的开始值
* @property {Number} q 要插值的结束值
* @property {Number} time 插值的时间一般在<code>[0.0, 1.0]</code>范围内
* @returns {Number} 插值结果
*/

/**
 * 定义Cesium Tileset数据初始加载的选项。
 * @typedef Options
 * @memberof Tileset
 * @property {String|Cesium.Resource} url 模型url
 * @property {Boolean} show 是否显示模型
 * @property {Cesium.Matrix4} modelMatrix 模型矩阵
 * @property {ShadowMode} [shadows=ShadowMode.ENABLED] 是否接收或投射阴影
 * @property {Number} [maximumScreenSpaceError=16] 最大屏东空间误差
 * @property {Number} [maximumMemoryUsage=512] 可以使用的最大GPU内存
 * @property {Boolean} [cullWithChildrenBounds=true] 是否使用子节点的边界包围盒来剔除图块
 * @property {Boolean} [cullRequestsWhileMoving=true] 相机移动时是否不请求数据
 * @property {Number} [cullRequestsWhileMovingMultiplier=60.0] 值越大剔除的内容越多
 * @property {Boolean} [preloadWhenHidden=false] 当瓦片隐藏时是否预加载数据
 * @property {Boolean} [preloadFlightDestinations=true] 相机移动时是否预加载目的地的瓦片
 * @property {Boolean} [preferLeaves=false] 是否优先加载叶子节点
 * @property {Boolean} [dynamicScreenSpaceError=false] 是否启用动态最大屏幕误差
 * @property {Number} [dynamicScreenSpaceErrorDensity=0.00278] 动态最大屏幕误差密度
 * @property {Number} [dynamicScreenSpaceErrorFactor=4.0] 用于增加计算的动态屏幕空间误差的系数。
 * @property {Number} [dynamicScreenSpaceErrorHeightFalloff=0.25] 密度开始衰减时瓷砖集高度的比率。
 * @property {Number} [progressiveResolutionHeightFraction=0.3] 如果介于 (0.0, 0.5] 之间，将助于在瓦片继续加载的同时快速铺设一层瓦片。
 * @property {Boolean} [foveatedScreenSpaceError=true] 当{@link Tileset#foveatedScreenSpaceError}为true时，计算中心锥体外的图块屏幕空间误差的插值函数
 * @property {Number} [foveatedConeSize=0.1] 优化选项, 仅当{@link Tileset#foveatedScreenSpaceError}为true时生效。用来控制决定延迟哪些图块的锥体大小。立即加载此圆锥内的瓷砖，圆锥外的瓷砖可能会根据它们在圆锥外的距离  * 而延迟加载。将此设置为0.0意味着圆锥将是由相机位置及其视图方向形成的线。将此设置为1.0意味着锥体包含相机的整个视野​​，基本上禁用效果。
 * @property {Number} [foveatedMinimumScreenSpaceErrorRelaxation=0.0] {@link 当Tileset#foveatedScreenSpaceError}为true时，用于控制锥体外的瓦片的起始屏幕空间误差。
 * @property {Tileset.FoveatedInterpolationCallback} [foveatedInterpolationCallback=Cesium.Math.lerp] 当{@link Tileset#foveatedScreenSpaceError}为true时，计算中心锥体外的图块屏幕空间误差的插值函数
 * @property {Number} [foveatedTimeDelay=0.2]  当{@link Tileset#foveatedScreenSpaceError}为true时，用于控制锥体外的瓦片延迟多长时间加载
 * @property {Boolean} [skipLevelOfDetail=false] 常量定义加载图块时要跳过的最小级别数。例如，如果图块为1级，则不会加载图块，除非它们的级别大于 2。为0时，不跳过任何级别。@type {Number}
 * @property {Number} [baseScreenSpaceError=1024]  在跳过详细级别之前必须达到的屏幕空间误差。
 * @property {Number} [skipScreenSpaceErrorFactor=16] 定义要跳过的最小屏幕空间错误的乘数。
 * @property {Number} [skipLevels=1] 常量定义加载图块时要跳过的最小级别数。
 * @property {Boolean} [immediatelyLoadDesiredLevelOfDetail=false] 只下载满足最大屏幕空间误差的瓦片，忽略跳过因子。
 * @property {Boolean} [loadSiblings=false] 是否下载可见瓦片的兄弟瓦片。
 * @property {ClippingPlaneCollection} [clippingPlanes] 裁剪平面
 * @property {ClassificationType} [classificationType] 确定此瓷砖集是对地形、3D瓷砖还是两者进行分类
 * @property {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] 椭球体
 * @property {Object} [pointCloudShading] 使用 3D Tiles 渲染点云时基于几何误差执行点衰减的选项。
 * @property {Cartesian2} [imageBasedLightingFactor=new Cartesian2(1.0, 1.0)] 环境光强度
 * @property {Cartesian3} [lightColor] 光线，用来代替imageBasedLightingFactor
 * @property {Number} [luminanceAtZenith=0.2] 用于该模型的环境贴图
 * @property {Cartesian3[]} [sphericalHarmonicCoefficients] 三阶球谐系数用于基于图像的照明的漫反射颜色。
 * @property {String} [specularEnvironmentMaps] KTX2文件的URL，该文件包含镜面反射照明的立方体贴图和卷积镜面反射贴图
 * @property {Boolean} [backFaceCulling=true]  是否启用背面剔除
 * @property {Boolean} [showOutline=true] 是否显示模型轮廓线
 * @property {Boolean} [vectorClassificationOnly=false] 指示仅应使用tileset的向量Tile进行分类
 * @property {Boolean} [vectorKeepDecodedPositions=false] 矢量块是否应在内存中保留解码位置
 * @property {String} [debugHeatmapTilePropertyName] 属性变量名。所有渲染的瓦片都将使用指定变量值着色
 * @property {Boolean} [debugFreezeFrame=false] 仅用于调试，是否冻结上一帧
 * @property {Boolean} [debugColorizeTiles=false] 仅用于调试，是否给瓦片随机着色
 * @property {Boolean} [debugWireframe=false] 仅用于调试，是否以线框模式渲染模型
 * @property {Boolean} [debugShowBoundingVolume=false] 仅用于调试，是否显示瓦片的包围球
 * @property {Boolean} [debugShowContentBoundingVolume=false] 仅用于调试，是否显示瓦片内容的包围球
 * @property {Boolean} [debugShowViewerRequestVolume=false] 仅用于调试，是否显示每个图块的查看器请求量
 * @property {Boolean} [debugShowGeometricError=false] 仅用于调试， 是否显示每个瓦片的屏幕空间误差
 * @property {Boolean} [debugShowRenderingStatistics=false] 仅用于调试，是否显示每个瓦片的统计信息
 * @property {Boolean} [debugShowMemoryUsage=false] 仅用于调试，是否显示每个瓦片使用的GPU内存
 * @property {Boolean} [debugShowUrl=false] 仅用于调试，是否显示每个瓦片的URL
 * @property {Cesium.Matrix4} [transform] 用于变换瓦片集的根瓦片的矩阵, 将覆盖position属性。
 * @property {Number} [height] 模型高度
 * @property {Cesium.Cartesian3} [position] 模型位置
 * @property {Boolean} [debug = false] 开启高度模式，允许使用键盘QWEASDZX微调模型位置和姿态。
 *
 */
export default Tileset;
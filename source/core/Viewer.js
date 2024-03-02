
import createDefaultLayer from "../layer/createDefaultLayer.js";
import defaultValue from "./defaultValue.js";
import defined from './defined.js'
import computeDistancePerPixel from './computeDistancePerPixel.js'
import computeSceneExtent from "./computeSceneExtent.js";
import LonLat from "./LonLat.js";
import computeSceneCenterPoint from "./computeSceneCenterPoint.js";
import GeoJsonDataSource from "../layer/GeoJsonDataSource.js";
import ShapefileDataSource from "../layer/ShapefileDataSource.js";
import InfoBox from '../widgets/InfoBox.js'
import CesiumProError from "./CesiumProError.js";
import Model from "../scene/Model.js";
import Tileset from "../scene/Tileset.js";
import VectorTileProvider from "../scene/VectorTileProvider.js";
import Globe from '../scene/Globe.js'
import overrideCesium from '../override/index.js'
import GraphicGroup from "./GraphicGroup.js";
import WFSLayer from "../layer/WFSLayer.js";
import DefaultDataSource from "../scene/DefaultDataSource.js";

const {
    Matrix4,
    BoundingSphere,
    ScreenSpaceEventType,
    ScreenSpaceEventHandler
} = Cesium;
function flyTo(viewer, target, options) {
    viewer.camera.flyToBoundingSphere(target, {
        duration: options.duration,
        maximumHeight: options.maximumHeight,
        endTransform: options.endTransform,
        offset: options.offset,
        complete: function () {
            viewer._completeZoom(true);
        },
        cancel: function () {
            viewer._completeZoom(true);
        },
        offset: options.offset,
    });
}
function getDefaultOptions() {
    return {
        animation: false,
        timeline: false,
        geocoder: false,
        homeButton: false,
        navigationHelpButton: false,
        baseLayerPicker: false,
        fullscreenElement: 'cesiumContainer',
        fullscreenButton: false,
        shouldAnimate: true,
        infoBox: false,
        selectionIndicator: false,
        sceneModePicker: false,
        shadows: false,
        imageryProvider: createDefaultLayer(),
        // contextOptions: {
        //     // cesium状态下允许canvas转图片convertToImage
        //     webgl: {
        //         alpha: true,
        //         depth: false,
        //         stencil: true,
        //         antialias: true,
        //         premultipliedAlpha: true,
        //         preserveDrawingBuffer: true, // 截图时需要打开
        //         failIfMajorPerformanceCaveat: true,
        //     },
        //     allowTextureFilterAnisotropic: true,
        // },
    }
}
let lastFpsTime, lastMsTime;
let fpsCount = 0, msCount = 0;
let fps = 'N/A', ms = 'N/A';
function updateFps() {
    if (!defined(lastFpsTime)) {
        lastFpsTime = Cesium.getTimestamp();
    }
    if (!defined(lastMsTime)) {
        lastMsTime = Cesium.getTimestamp();
    }
    fpsCount++;
    const time = Cesium.getTimestamp();
    let elapsed = (time - lastFpsTime) / 1000.0;
    if (elapsed > 1) {
        fps = fpsCount / elapsed || 0;
        lastFpsTime = time;
        fpsCount = 0;
        fps = fps.toFixed(0)
    }
    msCount++;
    elapsed = time - lastMsTime;
    if (elapsed > 100) {
        ms = elapsed / msCount;
        lastMsTime = time;
        msCount = 0;
        ms = ms.toFixed(2)
    }
    return { ms, fps }
}
function isPromise(val) {
    const isObject = val != null && typeof val === 'object';
    return isObject && typeof val.then === 'function'
}
/**
 * @see {@link https://sandcastle.cesium.com/?src=Camera.html}
 * @ignore
 * @param {} viewer 
 */
function icrf(viewer) {
    if (!viewer || viewer.scene.mode !== Cesium.SceneMode.SCENE3D) {
        return;
    }
    const icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(
        viewer.clock.currentTime
    );
    if (defined(icrfToFixed)) {
        const camera = viewer.camera;
        const offset = Cesium.Cartesian3.clone(camera.position);
        const transform = Cesium.Matrix4.fromRotationTranslation(icrfToFixed);
        camera.lookAtTransform(transform, offset);
    }
}
function setView(viewer, lon, lat, height) {
    const position = Cesium.Cartesian3.fromDegrees(lon, lat, height);

    const camera = viewer.camera;
    const heading = camera.heading;
    const pitch = camera.pitch;

    const offset = offsetFromHeadingPitchRange(
        heading,
        pitch,
        height * 2.0
    );

    const transform = Cesium.Transforms.eastNorthUpToFixedFrame(position);
    Cesium.Matrix4.multiplyByPoint(transform, offset, position);

    camera.setView({
        destination: position,
        orientation: {
            heading: heading,
            pitch: pitch,
        },
        easingFunction: Cesium.EasingFunction.QUADRATIC_OUT,
    });
}
function stepFlyTo(viewer, options = {}) {
    const {
        camera
    } = viewer;
    const step1 = defaultValue(options.step1Duration, 3);
    const step2 = defaultValue(options.step2Duration, 3);
    const step3 = defaultValue(options.step3Duration, 3);

    const cartographic = options.destination;
    // 第一步改变位置
    const cur_height = viewer.camera._positionCartographic.height;
    const step1Destination = Cesium.Cartesian3.fromDegrees(cartographic.lon, cartographic.lat, cur_height);
    // 第二步改变高度
    const step2Destination = options.destination.toCartesian();

    return new Promise((resolve) => {
        camera.flyTo({
            destination: step1Destination,
            duration: step1,
            complete() {
                camera.flyTo({
                    destination: step2Destination,
                    duration: step2,
                    complete() {
                        camera.flyTo({
                            destination: step2Destination,
                            orientation: options.orientation,
                            duration: step3,
                            complete() {
                                resolve();
                            },
                        });
                    },
                });
            },
        });
    });
}
/**
 * @see {@link https://sandcastle.cesium.com/?src=3D%20Tiles%20Interactivity.html|如何修正camera.flyTo中的误差}
 * @ignore
 * @param {} heading 
 * @param {*} pitch 
 * @param {*} range 
 * @returns {Cesium.Matrix4}
 */
function offsetFromHeadingPitchRange(heading, pitch, range) {
    pitch = Cesium.Math.clamp(
        pitch,
        -Cesium.Math.PI_OVER_TWO,
        Cesium.Math.PI_OVER_TWO
    );
    heading = Cesium.Math.zeroToTwoPi(heading) - Cesium.Math.PI_OVER_TWO;

    const pitchQuat = Cesium.Quaternion.fromAxisAngle(
        Cesium.Cartesian3.UNIT_Y,
        -pitch
    );
    const headingQuat = Cesium.Quaternion.fromAxisAngle(
        Cesium.Cartesian3.UNIT_Z,
        -heading
    );
    const rotQuat = Cesium.Quaternion.multiply(
        headingQuat,
        pitchQuat,
        headingQuat
    );
    const rotMatrix = Cesium.Matrix3.fromQuaternion(rotQuat);

    const offset = Cesium.Cartesian3.clone(Cesium.Cartesian3.UNIT_X);
    Cesium.Matrix3.multiplyByVector(rotMatrix, offset, offset);
    Cesium.Cartesian3.negate(offset, offset);
    Cesium.Cartesian3.multiplyByScalar(offset, range, offset);
    return offset;
}
function syncDoubleView(source, target) {
    let targetCancel, sourceCancel;
    function sync(sourceViewer, targetViewer) {
        return sourceViewer.scene.postRender.addEventListener(() => {
            const position = sourceViewer.camera.positionWC;
            const heading = sourceViewer.camera.heading;
            const pitch = sourceViewer.camera.pitch;
            const roll = sourceViewer.camera.roll;
            if (targetCancel) {
                targetCancel();
                targetCancel = undefined;
            }
            targetViewer.camera.flyTo({
                destination: position,
                orientation: {
                    heading,
                    pitch,
                    roll
                },
                duration: 0,
                complete: function () {
                    targetCancel = sync(target, source);
                },
                cancel: function () {
                    targetCancel = sync(target, source);
                }
            })
        })
    }
    sourceCancel = sync(source, target);
    return function () {
        if (sourceCancel) {
            sourceCancel();
        }
        if (targetCancel) {
            targetCancel();
        }
    }
}
function createInfoBox(viewer) {
    const infoBoxContainer = document.createElement("div");
    infoBoxContainer.className = "cesium-viewer-infoBoxContainer";
    viewer.container.appendChild(infoBoxContainer);
    const infoBox = new InfoBox(infoBoxContainer);

    const infoBoxViewModel = infoBox.viewModel;
    viewer._eventHelper.add(
        infoBoxViewModel.cameraClicked,
        Viewer.prototype._onInfoBoxCameraClicked,
        viewer
    );
    viewer._eventHelper.add(
        infoBoxViewModel.closeClicked,
        Viewer.prototype._onInfoBoxClockClicked,
        viewer
    );
    viewer._enableInfoOrSelection = true;
    return infoBox
}
function createWidgets(options, viewer) {
    if (options.infoBox) {
        viewer._infoBox = createInfoBox(viewer);
    }
}
function flyToPrimitive(viewer, target, options) {
    const zoomPromise = viewer._zoomPromise = new Promise((resolve) => {
        viewer._completeZoom = function (value) {
            resolve(value);
        };
    });
    target.readyPromise.then(() => {
        if (target._boundingSpheres) {
            flyTo(viewer, BoundingSphere.fromBoundingSpheres(target._boundingSpheres), options)
        } else if (target.boundingSphere) {
            let boundingSphere = target.boundingSphere;
            boundingSphere = BoundingSphere.clone(boundingSphere);
            // if (target.modelMatrix) {
            //     Matrix4.multiplyByPoint(target.modelMatrix, boundingSphere.center, boundingSphere.center)
            // }
            flyTo(viewer, boundingSphere, options)
        }
    })
    return zoomPromise
}
class Viewer extends Cesium.Viewer {
    /**
     * 创建一个地球, 该Viewer是对Cesium.Viewer的继承。
     * @extends Cesium.Viewer
     * @param {String|Element} container 创建地球的容器。
     * @param {Object} options 具有以下属性：
     * @param {Boolean} [options.animation=false] 如果设置为true, 则不会创建动画小部件。
     * @param {Boolean} [options.baseLayerPicker=false] 是否创建底图选择器。
     * @param {Boolean} [options.fullscreenButton=false] 是否创建全屏按钮。
     * @param {Boolean} [options.vrButton=false] 是否创建VR小部件.
     * @param {Boolean|GeocoderService[]} [options.geocoder=false] 是否创建位置搜索小部件。
     * @param {Boolean} [options.homeButton=false] 是否创建复位按钮
     * @param {Boolean} [options.infoBox=true] 是否创建属性信息显示框,当selectedEntity被定义时，将显示它的属性信息。
     * @param {Boolean} [options.sceneModePicker=false] 是否创建场景模式切换器。
     * @param {Boolean} [options.selectionIndicator=false] 是否创建创建指示器。
     * @param {Boolean} [options.timeline=false] 是否创建时间轴，一般和animation配合使用。
     * @param {Boolean} [options.navigationHelpButton=false] 是否创建帮助工具。
     * @param {Boolean} [options.navigationInstructionsInitiallyVisible=true] 帮助工具是否默认展示,只有当navigationHelpButton为true时生效。
     * @param {Boolean} [options.scene3DOnly=false] 是否仅以3D模式渲染每个几何要素，如果为true,可以节省GPU内存。
     * @param {Boolean} [options.shouldAnimate=false] 如果设为true, 时钟将默认前进。
     * @param {Cesium.ImageryProvider} [options.imageryProvider=createDefaultLayer()] 默认底图。
     * @param {Cesium.TerrainProvider} [options.terrainProvider=new Cesium.EllipsoidTerrainProvider()] 默认地形。
     * @param {Cesium.SkyBox|false} [options.skyBox] 天空盒。
     * @param {Cesium.SkyAtmosphere|false} [options.skyAtmosphere] 大气层。
     * @param {Element|String} [options.fullscreenElement=document.body] 全屏显示的容器。
     * @param {Boolean} [options.useDefaultRenderLoop=true] 如果设为false, 你必须手动调用<code>resize></code>, <code>render</code>函数。
     * @param {Number} [options.targetFrameRate] 使用默认循环时的目标帧率。
     * @param {Boolean} [options.showRenderLoopErrors=true] 发生渲染错误时，是否显示错误信息。
     * @param {Boolean} [options.useBrowserRecommendedResolution=true] 是否使用浏览器推荐的分辨率，如果为真<code>window.devicePixelRatio</code>将不生效。
     * @param {Boolean} [options.automaticallyTrackDataSourceClocks=true] 不是自动跟踪新添加的数据源的时钟设置，并在数据源的时钟发生变化时进行更新。如果要独立配置时钟，请将其设置为 false。
     * @param {Object} [options.contextOptions] WebGL配置
     * @param {Cesium.SceneMode} [options.sceneMode=Cesium.SceneMode.SCENE3D] 场景模式，默认3D。
     * @param {Cesium.MapProjection} [options.mapProjection=new Cesium.GeographicProjection()] 在 2D 和 Columbus View 模式中使用的地图投影。
     * @param {Cesium.Globe|false} [options.globe=new Cesium.Globe(mapProjection.ellipsoid)] 如果为false，地球将不会被创建。
     * @param {Cesium.DataSourceCollection} [options.dataSources=new Cesium.DataSourceCollection()] 矢量数据集。
     * @param {Boolean} [options.shadows=false] 是否显示阴影。
     * @param {Cesium.ShadowMode} [options.terrainShadows=Cesium.ShadowMode.RECEIVE_ONLY] 确定地形是否投射或接收来自光源的阴影。.
     * @param {Cesium.MapMode2D} [options.mapMode2D=Cesium.MapMode2D.INFINITE_SCROLL] 确定 2D 地图是否可旋转或可在水平方向无限滚动。
     * @param {Boolean} [options.projectionPicker=false] 是否显示投影选择器。
     * @param {Boolean} [options.requestRenderMode=false] 如果设为true，则仅在场景中的内容变化时才会渲染帧，可以提高性能，节省电源但是有些情况下可能需要您手动调用{@link Cesium.Scene#requestRender}, 详情请参考{@link https://cesium.com/blog/2018/01/24/cesium-scene-rendering-performance/|Improving Performance with Explicit Rendering}.
     * @param {Number} [options.maximumRenderTimeChange=0.0] 如果requestRenderMode为 true，则此值定义在请求渲染之前允许的模拟时间的最大更改。即模拟时间超maximumRenderTimeChange，将自动调用{@link Cesium.Scene#requestRender}
     */
    constructor(container, options = {}) {
        overrideCesium();
        //>>includeStart('debug', pragmas.debug);
        options = options || {}
        //>>includeEnd('debug')
        options = Object.assign(getDefaultOptions(), options);
        // default position of camera initiliate
        Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(70, 5, 130, 60);
        if (options.globe === false) {
            options.imageryProvider = undefined;
        }
        const superOptions = Object.assign({}, options, {
            infoBox: false
        })
        if (superOptions.globe) {
            superOptions.globe = new Globe(superOptions.globe._ellipsoid);
        } else if (superOptions.globe !== false) {
            superOptions.globe = new Globe()
        }
        super(container, superOptions);
        // cesiumpro override
        if (this.scene.globe) {
            this.scene.frameState.globeClipRegion = this.scene.globe.clipRegion;
        }
        // remove default logo image
        const logo = document.querySelector('.cesium-credit-logoContainer');
        if (logo) {
            logo.parentElement.removeChild(logo)
        }
        createWidgets(options, this)
        this._options = options;
        this.scene.postRender.addEventListener(this.update, this);

        this._distancePerPixel = undefined;
        this._extent = undefined;
        this._center = undefined;
        this._autoRotation = false;

        this.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        if (this.scene.globe) {
            const quadtreeProvider = new VectorTileProvider({
                terrainProvider: this.terrainProvider,
                scene: this.scene
            })
            const quadtree = new Cesium.QuadtreePrimitive({
                tileProvider: quadtreeProvider
            })
            this.scene._vectorTileQuadtree = quadtree;
        }
        this.scene.dataSources = this.dataSources;

        this._graphicGroup = new GraphicGroup(this);
        /**
         * 一个具有默认样式的数据源（defaultDatasource）
         * @type {DefaultDataSource}
         */
        this.dds = new DefaultDataSource(this);
    }
    /**
     * 自定义图形集合
     * @readonly
     * @type {GraphicGroup}
     */
    get graphicGroup() {
        return this._graphicGroup;
    }
    /**
     * 调度矢量瓦片的四叉树
     * @readonly
     * @type {MassiveEntityLayerCollection}
     */
    get vectorTileCollection() {
        return this.scene._vectorTileQuadtree.tileProvider._layers;
    }
    /**
     * 获取未绑定到特定数据源的实体集合。
     * @readonly
     * @type {Cesium.EntityCollection}
     */
    get entities() {
        return super.entities;
    }
    /**
     * 获得场景中primitive的集合。
     * @readonly
     * @type {Cesium.PrimitiveCollection}
     */
    get primitives() {
        return this.scene.primitives;
    }
    /**
     * 是否启用太阳光照射，如果启用，将对地球对昼夜区域区分显示。
     * @type {Boolean}
     */
    get enableLighting() {
        if (!defined(this.globe)) {
            return;
        }
        return this.scene.globe.enableLighting
    }
    set enableLighting(val) {
        if (!defined(this.globe)) {
            return;
        }
        this.scene.globe.enableLighting = val;
    }
    /**
     * 获得或设置是否允许地球自转
     */
    get autoRotation() {
        return this._autoRotation
    }
    set autoRotation(val) {
        this._autoRotation = val;
    }
    /**
     * 打开或关闭快速抗锯齿功能
     * @type {Boolean}
     */
    get fxaa() {
        return this.scene.postProcessStages.fxaa.enabled;
    }
    set fxaa(val) {
        this.scene.postProcessStages.fxaa.enabled = val;
    }
    /**
     * 单位像素的长度所代表的真实距离，它的倒数就是地图学中的比例尺, 单位 km
     * @type {Number}
     * @readonly 
     */
    get distancePerPixel() {
        return this._distancePerPixel;
    }
    /**
     * 返回场景的边界范围
     * @readonly
     */
    get extent() {
        return this._extent;
    }
    /**
     * 返回场景的中心点坐标, 如果中心没有内容，则返回undefined
     * @readonly
     * @type {LonLat}
     */
    get center() {
        return this._center;
    }
    /**
     * 创建地球的容器
     * @type {Element}
     * @readonly
     */
    get container() {
        return this._container;
    }
    /**
     * 获得地球上的所有影像图层(ImageryLayer), 同Cesium中的imageryLayers。
     * @type {Cesium.ImageryLayerCollection}
     * @readonly
     */
    get layers() {
        return this.scene.imageryLayers;
    }
    /**
     * 获得地球上所有矢量图层（geojson,CZML, Kml等）
     * @type {Cesium.DataSource}
     * @readonly
     */
    get dataSources() {
        return super.dataSources;
    }
    /**
     * 地球对象
     * @type {Cesium.Globe}
     * @readonly
     */
    get globe() {
        return this.scene.globe;
    }
    /**
     * 椭球体
     * @type {Cesium.Ellipsoid}
     * @readonly
     */
    get ellipsoid() {
        if (!this.globe) {
            return undefined;
        }
        return this.globe.ellipsoid;
    }
    /**
     * 获得或设置地形
     * @type {Cesium.TerrainProvider}
     */
    get terrain() {
        return this.terrainProvider;
    }
    set terrain(value) {
        if (!defined(value) || value === false) {
            this.terrainProvider = new Cesium.EllipsoidTerrainProvider()
        }
        if (value !== this.terrainProvider) {
            this.terrainProvider = value;
        }
    }
    /**
     * 地形发生变化时触发的事件
     * @type {Event}
     * @readonly
     * 
     */
    get terrainChanged() {
        return this.scene.terrainProviderChanged;
    }
    /**
     * 地球夸张比例，小于1的值表示地表缩小，大于1的值表示地形放大
     * @type {Number}
     * @default 1.0
     */
    get terrainExaggeration() {
        if (!this.globe) {
            return undefined;
        }
        return this.globe.terrainExaggeration;
    }
    set terrainExaggeration(value) {
        if (value < 0) {
            value = 0;
        }
        if (this.globe) {
            this.globe.terrainExaggeration = value;
        }
    }
    /**
     * 获取或设置帧率/延迟小部件的显隐状态
     * @type {Boolean}
     */
    get showFps() {
        return this.scene.debugShowFramesPerSecond;
    }
    set showFps(val) {
        this.scene.debugShowFramesPerSecond = val;
    }
    /**
     * 瞬时帧率
     * @type {String}
     * @readonly
     */
    get fps() {
        return this._fps + 'FPS'
    }
    /**
     * 瞬时延迟
     * @type {String}
     * @readonly
     */
    get ms() {
        return this._ms + 'MS'
    }
    /**
     * 获得相机的偏航角，单位：度
     * @type {Number}
     * @readonly
     */
    get heading() {
        return Cesium.Math.toDegrees(this.camera.heading);
    }
    /**
    * 获得相机的仰俯角，单位：度
    * @type {Number}
    * @readonly
    */
    get pitch() {
        return Cesium.Math.toDegrees(this.camera.pitch);
    }
    /**
    * 获得相机的翻滚角，单位：度
    * @type {Number}
    * @readonly
    */
    get roll() {
        return Cesium.Math.toDegrees(this.camera.roll);
    }
    /**
     * 打开或关闭基于地形的深度测试，同<code>viewer.scene.globe.depthTestAgainstTerrain</code>
     * @type {Boolean}
     */
    get depthTest() {
        return this.scene.globe.depthTestAgainstTerrain;
    }
    set depthTest(val) {
        this.scene.globe.depthTestAgainstTerrain = val;
    }
    /**
     * 将一个模型添加到场景中
     * @param {Model|Tileset} model 
     */
    addModel(model) {
        if (!model.delegate) {
            return;
        }
        this.primitives.add(model.delegate);
    }
    /**
     * 删除模型
     * @param {Model} model 需要被删除的模型
     * @returns {Boolean} 是否删除成功
     */
    removeModel(model) {
        this.primitives.remove(model.delegate);
    }
    /**
     * 设置地球场景的视图位置。
     * @param {LonLat|Cesium.Cartesian3|Cesium.Cartographic} target 默认位置
     * @example 
     * viewer.setView(new CesiumPro.LonLat(110, 30, 10000))
     * viewer.setView(Cesium.Cartesian3.fromDegrees(110, 30, 10000))
     */
    setView(target) {
        let geopoint;
        if (target instanceof Cesium.Cartographic) {
            geopoint = LonLat.fromCartographic(target)
        } else if (target instanceof Cesium.Cartesian3) {
            geopoint = LonLat.fromCartesian(target);
        } else if (target instanceof LonLat) {
            geopoint = target
        } else {
            //>>includeStart('debug', pragmas.debug);
            throw new CesiumProError('target不是一个有效值')
            //>>includeEnd('debug')
        }
        if (geopoint) {
            setView(this, geopoint.lon, geopoint.lat, geopoint.alt)
        }

    }
    /**
      * 此方法将定位分成3个步骤：step 1:调整位置,step 2:调整高度,step 3:调整角度，一般用于小场景初始化时。
      * @param  {Object} [options={}] 具有以下参数
      * @param  {Cesium.Cartesian3} options.destination 目标位置
      * @param  {Object} [options.orientation] 相机姿态
      * @param  {Number} [options.step1Duration=3.0] 调整高度的持续时间
      * @param  {Number} [options.step1Duration=3.0] 调整位置的持续时间
      * @param  {Number} [options.step1Duration=3.0] 调整姿态的持续时间
      * @return {Promise}
    */
    stepFlyTo(options = {}) {
        let destination;
        if (options.destination instanceof Cesium.Cartesian3) {
            destination = LonLat.fromCartesian(options.destination)
        } else if (options.destination instanceof Cesium.Cartographic) {
            destination = LonLat.fromCartographic(options.destination)
        } else if (options.destination instanceof LonLat) {
            destination = options.destination;
        } else {
            //>>includeStart('debug', pragmas.debug);
            throw new CesiumProError('target不是一个有效值')
            //>>includeEnd('debug')
        }
        if (destination) {
            options.destination = destination;
            stepFlyTo(this, options);
        }
    }
    /**
     * 将两个球的视图同步，同步后任何一个球的相机位置发生变化后，另一个球也随之变化。
     * @param {Viewer} viewer viewer对象
     * @returns {Function} 用于取消视图同步的函数
     * @example
     * const viewer = new CesiumPro.Viewer('map');
     * const viewer1 = new CesiumPro.Viewer('map1);
     * const cancelLink = viewer.linkView(viewer1);
     * // 取消同步
     * cancelLink();
     */
    linkView(viewer) {
        if (!defined(viewer)) {
            throw new CesiumProError('viewer不是一个有效的Cesium.Viewer对象')
        }
        return syncDoubleView(this, viewer);
    }
    /**
     * 将相机移动到提供的Cartesian, entity, primitive, 或dataSource,如果数据源仍在加载过程中，或者可视化仍在加载，
     * 此方法将在数据准备就绪后执行。
     * @param {LonLat|Cesium.Cartesian|Cesium.Primitive|Cesium.Entity|Cesium.Entity[]|Cesium.EntityCollection|Cesium.DataSource|Cesium.ImageryLayer|Cesium.Cesium3DTileset|Cesium.TimeDynamicPointCloud|Promise<Cesium.Entity|Cesium.Entity[]|Cesium.EntityCollection|Cesium.DataSource|Cesium.ImageryLayer|Cesium.Cesium3DTileset|Cesium.TimeDynamicPointCloud>} target 需要定位的Cartesian, Entity, Primitive, ImageryLayer, Datasource等 
     * @param {Object} options 具有以下属性
     * @param {Number} [options.duration = 3000] 相机飞行持续时间，单位毫秒
     * @param {Number} [options.maximumHeight] 相机飞行最大高度
     * @param {Cesium.HeadingPitchRange} [options.offset] 相机角度，可以包含heading、pitch、roll
     * @returns {Promise<Boolean>}
     * @example
     * viewer.flyTo({
     *     destination : Cesium.Cartesian3.fromDegrees(-122.19, 46.25, 5000.0),
     *     orientation : {
     *         heading : Cesium.Math.toRadians(175.0),
     *         pitch : Cesium.Math.toRadians(-35.0),
     *         roll : 0.0
     *     }
     * });
     */
    flyTo(target, options = {}) {
        if (!target) {
            return;
        }
        if (target instanceof LonLat) {
            const catresian = target.toCartesian();
            return this.flyTo(catresian, options)
        }
        const that = this;
        if (target instanceof Cesium.Cartesian3) {
            const zoomPromise = viewer._zoomPromise = new Promise((resolve) => {
                that._completeZoom = function (value) {
                    resolve(value);
                };
            });
            const radius = defaultValue(options.radius, 1000);
            delete options.radius;
            const boundingSphere = new Cesium.BoundingSphere(target, radius);
            flyTo(this, boundingSphere, options)
            return zoomPromise
        } else if (target instanceof Cesium.Primitive) {
            return flyToPrimitive(this, target, options)
        } else if (target instanceof Cesium.Model) {
            return flyToPrimitive(this, target, options)
        } else if (target instanceof Model) {
            return flyToPrimitive(this, target.delegate, options)
        } else if (target instanceof Tileset) {
            return super.flyTo(target.delegate, options)
        } else if (target instanceof Cesium.Cesium3DTileset) {
            super.flyTo(target, options)
        } else if (target.boundingSphere) {
            const modelMatrix = target.modelMatrix || Matrix4.IDENTITY;
            const center = Matrix4.multiplyByPoint(modelMatrix, target.boundingSphere.center, {})
            const bounding = new BoundingSphere(center, target.boundingSphere.radius)
            return this.camera.flyToBoundingSphere(bounding);
        }
        return super.flyTo(target, options);
    }
    /**
     * 使场景绕指定点旋转。
     * @param {Cesium.Cartesian3|Cesium.Cartographic|LonLat} point 相机旋转的中心点
     * @param {Object} options 具有以下属性
     * @param {Cesium.HeadingPitchRange} [options.offset] 相机的角度
     * @param {Number} [options.multiplier = 1] 旋转倍速，大小1的值使旋转速度变快，小于1的值使旋转速度变慢，小于0的值将使地球反方向旋转。
     * @returns {Function} 用于取消旋转的函数
     * @example
     * const p = new CesiumPro.LonLat(110,30)
     * let cancel = viewer.rotateAroundPoint(p);
     */
    rotateAroundPoint(point, options = {}) {
        const viewer = this;
        let target;
        if (point instanceof Cesium.Cartesian3) {
            target = point;
        } else if (point instanceof Cesium.Cartographic) {
            target = Cesium.Cartographic.toCartesian(point);
        } else if (point instanceof LonLat) {
            target = point.toCartesian()
        } else {
            //>>includeStart('debug', pragmas.debug);
            throw new CesiumProError('point不是一个有效值。')
            //>>includeEnd('debug')
            return;
        }
        const multiplier = defaultValue(options.multiplier, 1);
        const offset = defaultValue(options.offset, {})
        function rotate() {
            const heading = Cesium.Math.toRadians(defaultValue(offset.heading, viewer.heading) + 1 * multiplier);
            const pitch = Cesium.Math.toRadians(defaultValue(offset.pitch, -20));
            const range = defaultValue(offset.range, 10000);
            viewer.flyTo(target, {
                duration: 0,
                offset: new Cesium.HeadingPitchRange(heading, pitch, range)
            })
        }
        if (this._cancelRotateAroundPoint) {
            this._cancelRotateAroundPoint();
            this._cancelRotateAroundPoint = undefined;
        }
        this._cancelRotateAroundPoint = this.scene.postRender.addEventListener(rotate);
        return this._cancelRotateAroundPoint;
    }
    /**
     * 添加一个图层,对影像图层(ImageryProvider)和矢量图层(DataSource)都有效
     * @param {Cesium.ImageryProvider|Cesium.DataSource|Promise<Cesium.DataSource>} layerProvider 
     * @returns {Cesium.ImageryLayer|Cesium.DataSource|Promise<Cesium.DataSource>} 新添加的图层
     * @example
     * // 1. 使用viewer.addLayer添加影像图层
     * viewer.addLayer(new CesiumPro.GaoDeLayer())
     * // 2. 使用viewer.layers.add添加影像图层
     * viewer.layers.addImageryProvider(new CesiumPro.GaoDeLayer())
     * // 1和2的效果是相同的
     * // 3. 使用viewer.addLayer添加矢量图层
     * viewer.addLayer(Cesium.KmlDataSource.load('sample.kml'))
     * // 4.使用viewer.dataSources.add添加矢量图层
     * viewer.dataSources.add(Cesium.KmlDataSource.load('sample.kml'))
     * // 3和4的效果是相同的
     */
    addLayer(layerProvider) {
        if (
            layerProvider instanceof Cesium.GeoJsonDataSource ||
            layerProvider instanceof Cesium.KmlDataSource ||
            layerProvider instanceof Cesium.CzmlDataSource ||
            layerProvider instanceof Cesium.CustomDataSource ||
            layerProvider instanceof GeoJsonDataSource ||
            layerProvider instanceof ShapefileDataSource ||
            isPromise(layerProvider)) {
            return this.dataSources.add(layerProvider)
        }
        if (layerProvider instanceof WFSLayer) {
            return this.dataSources.add(layerProvider._dataSource)
        }
        // if not DataSource, handle it as ImageryLayer
        return this.layers.addImageryProvider(layerProvider);
    }
    /**
     * 删除图层
     * @param {Cesium.ImageryLayer|Cesium.DataSource|Promise<Cesium.DataSource>|Promise<Cesium.ImageryLayer>} layer 被删除的图层
     * @example
     * const provider = new BingLayer();
     * const layer = viewer.addLayer(provider);
     * viewer.removeLayer(layer);
     */
    removeLayer(layer) {
        if (isPromise(layer)) {
            layer.then(value => {
                this.removeLayer(value)
            })
        } else {
            const removed = this.layers.remove(layer);
            if (!removed) {
                this.dataSources.remove(layer);
            }
        }

    }
    /**
     * 拾取指定位置的图层信息，该方法会调用图层的pickFeatures方法
     * @param {Cesium.Carteisn2} windowPosition 屏幕位置 
     * @returns {Cesium.ImageryLayerFeatureInfo[]} 属性信息
     * @example
     * const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
     * handler.setInputAction(e => {
     *    const layer = viewer.pickLayer(e.position)
     *    layer.then(res=>{
     *         console.log(res)
     *    }),
     *  Cesium.ScreenSpaceEventType.LEFT_CLICK)
     * }
     */
    pickLayer(windowPosition) {
        const scene = this.scene;
        const pickRay = scene.camera.getPickRay(windowPosition);
        return this.layers.pickImageryLayerFeatures(pickRay, scene)

    }
    /**
    * 该函数会自动被调用，除非<code>useDefaultRenderLoop</code> 设为false;
    */
    render() {
        super.render();
    };
    update() {
        const value = updateFps();
        this._fps = value.fps;
        this._ms = value.ms;
        const distance = computeDistancePerPixel(this);
        if (distance) {
            this._distancePerPixel = distance;
        }
        // 计算场景范围和中心位置
        this._extent = computeSceneExtent(this);
        this._center = computeSceneCenterPoint(this);
        // 地球自转
        if (this._autoRotation) {
            icrf(this);
        }
        this.graphicGroup.update(this.clock.currentTime);
    }
    /**
    * 调整小部件的大小，以适应container，该函数会自动被调用，除非<code>useDefaultRenderLoop</code> 设为false;
    */
    resize() {
        super.resize();
    }
    /**
     * 强制调整小部件大小
     */
    forceResize() {
        super.forceResize();
    }
    /**
     * 销毁场景
     */
    destroy() {
        super.destroy();
    }
    /**
     * 判断场景是否被销毁
     * @returns {Boolean} 是否被销毁
     */
    isDestroyed() {
        return super.isDestroyed();
    }
    /**
     * 鼠标事件监听
     * @param {Function} fn 回调函数
     * @param {String} [event = 'LEFT_CLICK'] 事件类型, 该参数应该是Cesium.ScreenSpaceEventType的属性
     * @param {Element} [target = this.canvas] 触发事件的元素，默认为球的canvas
     * @returns 取消事件监听的函数
     * @example
     * const removeAction = viewer.on(function(e) {});
     * const removeAction = viewer.on(function(e) {}, 'MOUSE_MOVE');
     * // 移除事件监听
     * removeAction();
     */
    on(fn, event = 'LEFT_CLICK', target = this.canvas) {
        const handler = new ScreenSpaceEventHandler(target);
        const removeInputAction = handler.setInputAction(fn, ScreenSpaceEventType[event]);
        return function () {
            if (handler.isDestroyed()) {
                return;
            }
            removeInputAction();
            handler.destroy();
        }
    }
    addPoint(lon, lat, height) {
        this.dds.addPoint(lon, lat, height)
    }
    addClickEvent(fn) {
        const handler = new ScreenSpaceEventHandler(this.canvas);
        handler.setInputAction(e => {
            fn && (fn(e));
        }, ScreenSpaceEventType.LEFT_CLICK);
    }

}
// 生写Cesium中的部分函数
export default Viewer;
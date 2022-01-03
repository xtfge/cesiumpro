
import createDefaultLayer from "../layer/createDefaultLayer.js";
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
        contextOptions: {
            // cesium状态下允许canvas转图片convertToImage
            webgl: {
                alpha: true,
                depth: false,
                stencil: true,
                antialias: true,
                premultipliedAlpha: true,
                preserveDrawingBuffer: true, // 截图时需要打开
                failIfMajorPerformanceCaveat: true,
            },
            allowTextureFilterAnisotropic: true,
        },
    }
}
class Viewer extends Cesium.Viewer {
    /**
     * 创建一个地球
     * @param {*} container 
     * @param {*} options 
     */
    constructor(container, options = {}) {
        //>>includeStart('debug', pragmas.debug);
        options = options || {}
        //>>includeEnd('debug')
        options = Object.assign(getDefaultOptions(), options);
        super(container, options);
        this._options = options;
    }
    get container() {
        return this._container;
    }
}
export default Viewer;
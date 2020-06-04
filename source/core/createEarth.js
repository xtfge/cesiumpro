/**
 * 创建三维场景
 * @param {String|Element} container 用于创建三维场景的DOM或元素id
 * @param {Object} options 具有和Cesium Viewer相同的参数
 */
function createEarth(container, options = {}) {
  const defaultOption = {
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
    imageryProvider: new Cesium.UrlTemplateImageryProvider({
      url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali',
    }),
    contextOptions: {
      // cesium状态下允许canvas转图片convertToImage
      webgl: {
        alpha: true,
        depth: false,
        stencil: true,
        antialias: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: true,
        failIfMajorPerformanceCaveat: true,
      },
      allowTextureFilterAnisotropic: true,
    },
    // terrainProvider: Cesium.createWorldTerrain()
    // terrainProvider: false
  };
  return new Cesium.Viewer(container, { ...defaultOption, ...options });
}

export default createEarth;

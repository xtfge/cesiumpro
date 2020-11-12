/**
 * 创建三维场景,修改了Cesium.Viewer的默认参数，隐藏了一些默认按钮,默认底图修改为google
 *
 * @exports createViewer
 * @param {String|Element} container 用于创建三维场景的DOM或元素id
 * @param {Object} options 同Cesium Viewer相同的参数
 * @returns {Cesium.Viewer}
 */
function createViewer(container, options = {}) {
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
        preserveDrawingBuffer: true, // 截图时需要打开
        failIfMajorPerformanceCaveat: true,
      },
      allowTextureFilterAnisotropic: true,
    },
    // terrainProvider: Cesium.createWorldTerrain()
    // terrainProvider: false
  };
  const viewer = new Cesium.Viewer(container, {
    ...defaultOption,
    ...options,
  });
  viewer.camera.flyChinaHome();
  return viewer;
}

export default createViewer;

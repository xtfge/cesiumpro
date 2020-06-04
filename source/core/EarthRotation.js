/*
 * 地球自转模拟
 */
let viewer;
function icrf() {
  if (!viewer || viewer.scene.mode !== Cesium.SceneMode.SCENE3D) {
    return;
  }
  const icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(
    viewer.clock.currentTime,
  );
  if (Cesium.defined(icrfToFixed)) {
    const offset = Cesium.Cartesian3.clone(viewer.camera.position);
    const transform = Cesium.Matrix4.fromRotationTranslation(icrfToFixed);
    viewer.camera.lookAtTransform(transform, offset);
  }
}
const start = function (cesiumViewer, option = { multiplier: 1 }) {
  if (viewer) {
    return;
  }
  viewer = cesiumViewer;
  viewer.scene.postUpdate.addEventListener(icrf);
  if (viewer.clock) {
    const keys = Object.keys(option);
    for (const k of keys) {
      viewer.clock[k] = option[k];
    }
  }
};
const stop = function () {
  if (!viewer) {
    return;
  }
  viewer.clock.multiplier = 1;
  viewer.scene.postUpdate.removeEventListener(icrf);
  viewer = undefined;
};
/**
 * 地球自转模拟
 */
class EarthRotation {
  /**
   * 开始自转
   * @param {Viewer} cesiumViewer Cesium Viewer对象
   * @param {Object} option Cesium.Colck的所有可用属性
   * @param {Number} [option.multiplier=1] 时钟的倍数
   */
  static start(cesiumViewer, option = { multiplier: 10 }) {
    start(cesiumViewer, option);
  }

  /**
   * 停止自转
   */
  static stop() {
    stop();
  }
}
export default EarthRotation;

import checkViewer from './checkViewer';
/**
 * 启用/禁止地球旋转
 * @exports rotateEnabled
 * @param  {Cesium.Viewer}  viewer  Viewer对象
 * @param  {Boolean} [val=true] true表示允旋转
 */
function rotateEnabled(viewer, val = true) {
  checkViewer(viewer)
  viewer.scene.screenSpaceCameraController.enableRotate = val;
}
export default rotateEnabled;

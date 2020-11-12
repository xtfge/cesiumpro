/*
 * 判断点是否在球的背面
 */
import checkViewer from './checkViewer';
import CVT from './CVT';
import defined from './defined';
const {
  SCENE2D,
  SCENE3D,
} = Cesium.SceneMode;
const {
  BoundingSphere
} = Cesium;
/**
 * 判断点位在场景中是否可见
 * @exports pointVisibility
 * @param {Cartesian3} position 点
 * @param {Viewer} viewer Viewer对象
 * @return {Bool} 如果可见返回true，否则返回false。
 */

function pointVisibility(position, viewer) {
  checkViewer(viewer);
  if (viewer.scene.mode === SCENE3D) {
    const visibility = new Cesium.EllipsoidalOccluder(Cesium.Ellipsoid.WGS84, viewer.camera.position)
      .isPointVisible(position);
    if (!visibility) {
      return false;
    }
    const windowPosition = CVT.toPixel(point, viewer);
    if (!defined(windowPosition)) {
      return false;
    }
    const width = viewer.canvas.width || viewer.canvas.clientWidth;
    const height = viewer.canvas.height || viewer.canvas.clientHeight;
    return (windowPosition.x > 0 && windowPosition.x < width) && (windowPosition.y > 0 && windowPosition.y < height);
  } else if (viewer.scene.mode === SCENE2D) {
    const frustum = viewer.scene.camera.frustum;
    const {
      positionWC,
      directionWC,
      upWC
    } = viewer.scene.camera;
    const cullingVolume = frustum.computeCullingVolume(positionWC, directionWC, upWC);
    const bounding = BoundingSphere.projectTo2D(new BoundingSphere(point, 1));
    const visibility = cullingVolume.computeVisibility(bounding);
    return visibility === Cesium.Intersect.INSIDE || visibility === Cesium.Intersect.INERSECTING
  }
}

export default pointVisibility;

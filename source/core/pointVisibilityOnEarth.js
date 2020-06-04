/*
 * 判断点是否在球的背面
 */
import checkViewer from './checkViewer';
/**
 * 判断点是否在球的背面
 * @param {Cartesian3} point 点
 * @param {Viewer} viewer Viewer对象
 */

function pointVisibilityOnEarth(point, viewer) {
  checkViewer(viewer);
  point = point.getValue ? point.getValue() : point;
  return new Cesium.EllipsoidalOccluder(Cesium.Ellipsoid.WGS84, viewer.camera.position)
    .isPointVisible(point);
}

export default pointVisibilityOnEarth;

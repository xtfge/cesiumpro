import CesiumProError from './CesiumProError';

/**
 * 检查viewer对象是否合法
 * @param {Viewer} viewer Cesium Viewer对象
 */
function checkViewer(viewer) {
  if (!(viewer && viewer instanceof Cesium.Viewer)) {
    const type = typeof viewer;
    throw new CesiumProError(`Expected viewer to be typeof Viewer, actual typeof was ${type}`);
  }
}
export default checkViewer;

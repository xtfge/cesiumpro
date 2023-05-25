import CesiumProError from './CesiumProError';

/**
 * 检查变是否是一个Cesium.Viewer对象
 * @exports checkViewer
 *
 * @param {any} viewer 将要检查的对象
 */
function checkViewer(viewer) {
  if (!(viewer && viewer instanceof Cesium.Viewer)) {
    const type = typeof viewer;
    throw new CesiumProError(`Expected viewer to be typeof Viewer, actual typeof was ${type}`);
  }
}
export default checkViewer;

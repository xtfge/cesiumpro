import defaultValue from './defaultValue';
/**
 * 坐标拾取函数,如果pixel所在位置有Primitive或Entity，将获取Primitive或Entity上的位置，否则获取球面坐标。
 * 简言之,如果点击在模型上将获得模型上的坐标，否则获取球面坐标。
 * <p><span style="font-weight:bold">Note:</span>获取模型上的坐标时需要打开地形深度调整，否则获取的点位不准。</p>
 *
 * @exports pickPosition
 * @see depthTest
 * @param  {Cesium.Cartesian3} pixel 屏幕坐标
 * @param {Cesium.Viewer} viewer Viewer对象
 * @return {Cesium.Cartesian3}       笛卡尔坐标
 */
function pickPosition(pixel, viewer) {
  let cartesian;
  elliposid = defaultValue(elliposid, Cesium.Ellipsoid.WGS84);
  // cartesian = viewer.camera.pickEllipsoid(pixel, elliposid);
  const ray = viewer.camera.getPickRay(pixel);
  cartesian = viewer.scene.globe.pick(ray);
  const feat = viewer.scene.pick(pixel);
  if (feat) {
    if (viewer.scene.pickPositionSupported) {
      cartesian = viewer.scene.pickPosition(pixel);
    } else {
      console.warn('This browser does not support pickPosition.');
    }
  }
  return cartesian;
}
export default pickPosition;

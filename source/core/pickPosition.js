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
 * @param {Boolean} [modelPosition=true] 如果为true，当点击到模型后会返回模型坐标，否则返回地面坐标
 * @return {Cesium.Cartesian3}       笛卡尔坐标
 */
function pickPosition(pixel, viewer, modelPosition = true) {
  let cartesian;
  const elliposid = viewer.scene.globe.ellipsoid;
  // cartesian = viewer.camera.pickEllipsoid(pixel, elliposid);
  const ray = viewer.camera.getPickRay(pixel);
  cartesian = viewer.scene.globe.pick(ray, viewer.scene);
  const feat = viewer.scene.pick(pixel);
  if (isModel(feat) && modelPosition) {
    if (viewer.scene.pickPositionSupported) {
      cartesian = viewer.scene.pickPosition(pixel) || cartesian;
    } else {
      console.warn('This browser does not support pickPosition.');
    }
  }
  return cartesian;
}

function isModel(feat) {
  if (!feat) {
    return false;
  }
  if (feat.primitive instanceof Cesium.Model || feat.primitive instanceof Cesium.Cesium3DTileset) {
    return true;
  }
  return false;
}
export default pickPosition;

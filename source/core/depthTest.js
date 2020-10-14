/**
 * 开启/关闭基于地形的深度检测
 *
 * @exports depthTest
 *
 * @param {Cesium.Globe|Cesium.Viewer|Cesium.Scene} target 测试检测对象
 * @param {Boolean} depth 深度检测状态
 *
 * @example
 *
 * const viewer=CesiumPro.createViewer('map');
 * CesiumPro.depthTest(viewer);
 * CesiumPro.depthTest(viewer.scene);
 * CesiumPro.depthTest(viewer.scene.globe);
 */
function depthTest(target, depth = true) {
  if (target instanceof Cesium.Viewer) {
    target.scene.globe.depthTestAgainstTerrain = depth;
  } else if (target instanceof Cesium.Scene) {
    target.globe.depthTestAgainstTerrain = depth;
  } else if (target instanceof Cesium.Globe) {
    target.depthTestAgainstTerrain = depth;
  } else {
    throw new CesiumProError("无效的对象")
  }

}

export default depthTest;

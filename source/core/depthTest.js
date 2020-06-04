/**
 * 开启/关闭深度检测
 * @param {Viewer} obj 测试检测对象
 * @param {Boolean} depth 深度检测状态
 */
function depthTest(obj, depth = true) {
  if (obj) {
    obj.depthTestAgainstTerrain = depth;
  }
}

export default depthTest;

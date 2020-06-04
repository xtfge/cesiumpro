/*
 * @Author: 
 * @Date: 2020-05-11 19:44:26
 * @E-mail: @geovis.com.cn
 * @LastModifiedBy: 
 * @LastEditTime: 2020-05-11 20:18:56
 * @Desc:
 */
function randomPosition(viewer, num = 1) {
  const rect = viewer.camera.computeViewRectangle();

  const {
    west, east, north, south,
  } = rect;
  const rst = [];
  for (let i = 0; i < num; i++) {
    const randomX = Math.random() * (east - west) + west;
    const randomY = Math.random() * (north - south) + south;
    rst.push(Cesium.Cartesian3.fromRadians(randomX, randomY, 0));
  }

  return rst;
}

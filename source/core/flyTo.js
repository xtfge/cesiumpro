import defaultValue from './defaultValue';
import CVT from './CVT';

/**
 * 此方法将定位分成3个步骤：step 1:调整位置,step 2:调整高度,step 3:调整角度，一般用于小场景初始化时。
 * @exports flyTo
 *
 * @param  {Cesium.Viewer} viewer  Cesium Viewer对象
 * @param  {Object} [options={}] 具有以下参数
 * @param  {Cesium.Cartesian3} options.destination 目标位置
 * @param  {Object} [options.orientation] 相机姿态
 * @param  {Number} [options.step1Duration=3.0] 调整高度的持续时间
 * @param  {Number} [options.step1Duration=3.0] 调整位置的持续时间
 * @param  {Number} [options.step1Duration=3.0] 调整姿态的持续时间
 * @return {Promise}
 */
function flyTo(viewer, options = {}) {
  const camera = viewer.camera
  const step1 = defaultValue(options.step1Duration, 3);
  const step2 = defaultValue(options.step2Duration, 3);
  const step3 = defaultValue(options.step3Duration, 3);

  const curHeight = camera.positionCartographic.height;
  const cartographic = CVT.toDegrees(options.destination, viewer);
  //第一步改变位置
  const step1Destination = Cesium.Cartesian3.fromDegrees(cartographic.lon, cartographic.lat, cur_height)
  //第二步改变高度
  const step2Destination = options.destination;

  return new Promise((resolve) => {
    camera.flyTo({
      destination: step1Destination,
      duration: step1,
      complete: function() {
        camera.flyTo({
          destination: step2Destination,
          duration: step2,
          complete: function() {
            camera.flyTo({
              destination: step2Destination,
              duration: step3,
              complete: function() {
                resolve();
              }
            })
          }
        })
      }
    })
  })
}

export default flyTo;

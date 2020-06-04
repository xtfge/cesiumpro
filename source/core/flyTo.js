/* eslint-disable no-nested-ternary */
/*
 * 定位,适用于开场动画，先调位置，再调整高度，最后调整角度 
 */
import CVT from './CVT';
import checkViewer from './checkViewer';

const CHINA = Cesium.Cartesian3.fromDegrees(95, 30, 15000000);
/**
 * 将Cesium默认的flyTo分解为三个步骤，改变位置，改变高度，改变角度
 * @param {Viewer} viewer Cesium Viewer对象
 * @param {Object} options 具有以下属性
 * @param {Cartesian3} [options.destination] 定位的目的地,默认中国全境
 * @param {Object} [options.orientation] 定位的角度
 * @param {duration1} [options.duration1] 改变位置时的持续时长
 * @param {duration2} [options.duration2] 改变高度的持续时长
 * @param {duration3} [options.duration3] 改变角度的持续时长
 * @param {duration} [options.duration=3.0] 如果没有分阶段定义duration，该值将每应用于每个阶段
 */
function flyTo(viewer, options = { destination: CHINA }) {
  const { destination, orientation } = options;
  checkViewer(viewer);
  if (!Cesium.defined(destination)) {
    return false;
  }

  const { camera } = viewer;
  // 当前相机高度
  const curHeight = camera.positionCartographic.height;
  const cartographic = CVT.toDegrees(destination, viewer);
  const duration1 = Cesium.defined(options.duration1)
    ? options.duration1 : Cesium.defined(options.duration)
      ? options.duration : 3;
  const duration2 = Cesium.defined(options.duration2)
    ? options.duration2 : Cesium.defined(options.duration)
      ? options.duration : 3;
  const duration3 = Cesium.defined(options.duration3)
    ? options.duration3 : Cesium.defined(options.duration)
      ? options.duration : 3;
  // step1.改变高度
  const step1Destination = Cesium.Cartesian3.fromDegrees(cartographic.lon,
    cartographic.lat,
    curHeight);
  const step2Destination = destination;
  return new Promise((resolve) => {
    camera.flyTo({
      destination: step1Destination,
      duration: duration1,
      complete() {
        camera.flyTo({
          destination: step2Destination,
          duration: duration2,
          complete() {
            if (Cesium.defined(orientation)) {
              camera.flyTo({
                destination: step2Destination,
                duration: duration3,
                orientation,
                complete() {
                  resolve();
                },
              });
            } else {
              resolve();
            }
          },
        });
      },
    });
  });
}
export default flyTo;

import GeoPoint from "./GeoPoint.js";
/**
 * 计算场景中心的坐标
 * @ignore
 * @param {*} viewer 
 */
function computeSceneCenterPoint(viewer) {
    const canvas = viewer.canvas;
    const bounding = canvas.getBoundingClientRect();

    // center pixel
    const pixel = new Cesium.Cartesian2(bounding.width / 2, bounding.height / 2);
    return GeoPoint.fromPixel(pixel, viewer);
}
export default computeSceneCenterPoint;
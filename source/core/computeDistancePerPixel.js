let lastUpdateTime = undefined;
import defined from "./defined.js";
/**
 * 计算场景中单位像素的长度所对应的真实距离 
 * @ignore
 * @param {Cesium.Viewer} viewer 
 * @returns {Number} 当前屏幕中心的地图比例尺
 */
function computeDistancePerPixel(viewer) {
    if(!viewer.scene.globe) {
        return undefined;
    }
    const now = Cesium.getTimestamp();
    const scene = viewer.scene;
    if (defined(lastUpdateTime) && now - lastUpdateTime < 250) {
        return;
    }
    lastUpdateTime = now;
    const width = scene.canvas.clientWidth;
    const height = scene.canvas.clientHeight;

    const startRay = scene.camera.getPickRay(new Cesium.Cartesian2(width / 2, height / 2));
    const endRay = scene.camera.getPickRay(new Cesium.Cartesian2(width / 2 + 1, height / 2));
    const startPosition = scene.globe.pick(startRay, scene);
    const endPosition = scene.globe.pick(endRay, scene);
    if (!(defined(startPosition) && defined(endPosition))) {
        return;
    }
    const geodesic = new Cesium.EllipsoidGeodesic(
        scene.globe.ellipsoid.cartesianToCartographic(startPosition),
        scene.globe.ellipsoid.cartesianToCartographic(endPosition)
    );
    const distance = geodesic.surfaceDistance;
    return distance;
}
export default computeDistancePerPixel
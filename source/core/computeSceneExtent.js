import defined from "./defined.js";
import LonLat from "./LonLat.js";

function computeSceneExtent(viewer) {
    // const rect = viewer.camera.computeViewRectangle();
    // todo 该方法获得的是相机的范围，有实际场景的范围有一定误差
    if(!viewer.scene.globe) {
        return {}
    }
    if (viewer.scene.mode === Cesium.SceneMode.SCENE3D) {
        const rect = viewer.camera.computeViewRectangle();
        if(!defined(rect)) {
            return undefined;
        }
        return {
            west: Cesium.Math.toDegrees(rect.west),
            south: Cesium.Math.toDegrees(rect.south),
            east: Cesium.Math.toDegrees(rect.east),
            north: Cesium.Math.toDegrees(rect.north)
        }
    }
    const canvas = viewer.canvas;
    const bounding = canvas.getBoundingClientRect();
    const left = LonLat.fromPixel(new Cesium.Cartesian2(0, bounding.height / 2), viewer)|| {lon: -180};
    const right = LonLat.fromPixel(new Cesium.Cartesian2(bounding.width, bounding.height / 2), viewer) || {lon: 180};
    const top = LonLat.fromPixel(new Cesium.Cartesian2(bounding.width / 2, 0), viewer) || {lat: 90};
    const bottom = LonLat.fromPixel(new Cesium.Cartesian2(bounding.width / 2, bounding.height), viewer) || {lat: -90};

    return {
        west: left.lon,
        south: bottom.lat,
        east: right.lon,
        north: top.lat
    }
    
}
export default computeSceneExtent;
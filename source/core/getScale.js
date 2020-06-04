/* eslint-disable no-bitwise */
/*
 * 获得当前场景的比例尺
 */
import checkViewer from './checkViewer';

const { defined, Cartesian2 } = Cesium;
let lastLegendUpdate = 0;
/**
 * 获得场景比例尺
 * @param {Viewer}} viewer Cesium Viewer对象
 */
function getScale(viewer) {
  checkViewer(viewer);
  const now = Cesium.getTimestamp();
  const { scene } = viewer;

  // 限制一下更新频率
  if (now < lastLegendUpdate + 250) {
    return undefined;
  }

  lastLegendUpdate = now;

  const width = scene.canvas.clientWidth;
  const height = scene.canvas.clientHeight;

  // 任选两个像素创建其到相机的射线
  const left = scene.camera.getPickRay(
    new Cartesian2((width / 2) | 0, height - 1),
  );
  const right = scene.camera.getPickRay(
    new Cartesian2((1 + width / 2) | 0, height - 1),
  );

  const { globe } = scene;
  // 获取上面选择的两个点的球面坐标
  const leftPosition = globe.pick(left, scene);
  const rightPosition = globe.pick(right, scene);

  if (!defined(leftPosition) || !defined(rightPosition)) {
    return undefined;
  }

  const leftCartographic = globe.ellipsoid.cartesianToCartographic(
    leftPosition,
  );
  const rightCartographic = globe.ellipsoid.cartesianToCartographic(
    rightPosition,
  );

  // 计算两个像素之间的距离，即比例尺
  const geodesic = new Cesium.EllipsoidGeodesic();
  geodesic.setEndPoints(leftCartographic, rightCartographic);
  const pixelDistance = geodesic.surfaceDistance;

  return pixelDistance;
}

export default getScale;

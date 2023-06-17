import LonLat from './LonLat';
import turfArea from '@turf/area'
import {
  polygon as turfPolygon
} from '@turf/helpers'
/**
 * 地图量算工具,包括距离量算、面积量算、角度量算、高度量算
 * @namespace Cartometry
 */
const Cartometry = {};
/**
 * 贴地距离
 * @param {Cesium.Cartesian3[]} positions 构成直线的顶点坐标
 * @return {Number} 长度，单位米
 */
Cartometry.surfaceDistance = function(positions) {
  let distance = 0;
  for (let i = 0; i < positions.length - 1; i += 1) {
    const point1cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
    const point2cartographic = Cesium.Cartographic.fromCartesian(positions[i + 1]);
    /** 根据经纬度计算出距离* */
    const geodesic = new Cesium.EllipsoidGeodesic();
    geodesic.setEndPoints(point1cartographic, point2cartographic);
    const s = geodesic.surfaceDistance;
    distance += s;
  }
  return distance;
};

/**
 * 空间距离
 * @param {Cesium.Cartesian3[]} positions 构成直线的顶点坐标
 * @return {Number} 长度，单位米
 */
Cartometry.spaceDistance = function(positions) {
  let dis = 0;
  for (let i = 1; i < positions.length; i++) {
    const s = positions[i - 1];
    const e = positions[i];
    dis += Cesium.Cartesian3.distance(s, e);
  }
  return dis;
};

/**
 *
 * 计算两个向量之间的夹角，两个向量必须拥有相同的起点。
 * @param {Cesium.Cartesian3} p1 向量起点
 * @param {Cesium.Cartesian3} p2 向量1终点
 * @param {Cesium.Cartesian3} p3 向量2终点
 * @return {Number} 返回p1p2和p1p3之间的夹角，单位：度
 */
Cartometry.angle = function(p1, p2, p3) {
  // 以任意一点为原点建立局部坐标系
  const matrix = Cesium.Transforms.eastNorthUpToFixedFrame(p1);
  const inverseMatrix = Cesium.Matrix4.inverseTransformation(matrix, new Cesium.Matrix4());
  // 将其它两个点坐标转换到局部坐标
  const localp2 = Cesium.Matrix4.multiplyByPoint(inverseMatrix, p2, new Cesium.Cartesian3());
  const localp3 = Cesium.Matrix4.multiplyByPoint(inverseMatrix, p3, new Cesium.Cartesian3());
  // 归一化
  const normalizep2 = Cesium.Cartesian3.normalize(localp2, new Cesium.Cartesian3());
  const normalizep3 = Cesium.Cartesian3.normalize(localp3, new Cesium.Cartesian3());
  // 计算两点夹角
  const cos = Cesium.Cartesian3.dot(normalizep2, normalizep3);
  const angle = Cesium.Math.acosClamped(cos);
  return Cesium.Math.toDegrees(angle);
};

/**
 * 计算向量的方位角
 * @param  {Cesium.Cartesian3} center 向量起点
 * @param  {Cesium.Cartesian3} point  向量终点
 * @return {Number}        角度，单位：度
 * @example
 *
 * const start=Cesium.Cartesian3.fromDegrees(110,30);
 * const end=Cesium.Cartesian3.fromDegrees(110,40)
 * const angle = CesiumPro.Cartometry.angleBetweenNorth(start,end);
 */
Cartometry.angleBetweenNorth = function(center, point) {
  const matrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
  const inverseMatrix = Cesium.Matrix4.inverseTransformation(matrix, new Cesium.Matrix4());
  const localp = Cesium.Matrix4.multiplyByPoint(inverseMatrix, point, new Cesium.Cartesian3());
  const normalize = Cesium.Cartesian3.normalize(localp, new Cesium.Cartesian3());
  const north = new Cesium.Cartesian3(0, 1, 0);
  const cos = Cesium.Cartesian3.dot(normalize, north);
  let angle = Cesium.Math.acosClamped(cos);
  angle = Cesium.Math.toDegrees(angle);

  const east = new Cesium.Cartesian3(1, 0, 0);
  const arceast = Cesium.Cartesian3.dot(east, normalize);
  if (arceast < 0) {
    angle = 360 - angle;
  }

  return angle;
};
/**
 * 贴地面积
 * @param {Cesium.Cartesian3[]} positions 构成多边形的顶点坐标
 * @return {Number} 面积，单位：平方米
 */
Cartometry.surfaceArea = function(positions) {
  // TODO:计算方法有问题
  let res = 0;
  // 拆分三角曲面

  for (let i = 0; i < positions.length - 2; i += 1) {
    const j = (i + 1) % positions.length;
    const k = (i + 2) % positions.length;
    const totalAngle = Cartometry.angle(positions[i], positions[j], positions[k]);
    const distemp1 = Cartometry.spaceDistance([positions[i], positions[j]]);
    const distemp2 = Cartometry.spaceDistance([positions[j], positions[k]]);
    res += distemp1 * distemp2 * Math.abs(Math.sin(Cesium.Math.toRadians(totalAngle)));
  }
  return res;
};

/**
 * 空间面积
 * @param {Cesium.Cartesian3[]} positions 构成多边形的顶点坐标
 * @return {Number} 面积，单位：平方米
 */
Cartometry.spaceArea = function(positions) {
  let res = 0;
  const points = []
  for (let position of positions) {
    const coord = LonLat.fromCartesian(position)
    points.push([coord.lon, coord.lat]);
  }
  points.push(points[0]);
  const polygon = turfPolygon([points]);
  return turfArea(polygon);
};

/**
 * 计算相邻两个点之间的高度差
 * @param  {} positions
 * @return {} 相信两个顶点之间的高度差，单位m
 */
Cartometry.heightFromCartesianArray = function(positions) {
  if (positions.length < 2) {
    return 0;
  }
  const rst = [];
  for (let i = 1; i < positions.length; i++) {
    const startC = Cesium.Cartographic.fromCartesian(positions[i - 1]);
    const endC = Cesium.Cartographic.fromCartesian(positions[i]);
    if (startC && endC) {
      rst.push(endC.height - startC.height);
    } else {
      rst.push('NaN');
    }
  }
  return rst;
};
export default Cartometry;

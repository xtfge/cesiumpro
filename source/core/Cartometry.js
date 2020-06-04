/*
 * 地图量算工具
 */
const radiansPerDegrees = Math.PI / 180;
const degreesPerRadian = 180 / Math.PI;
/**
 * 地图量算工具
 */
class Cartometry {
  /**
   * 贴地距离
   * @param {Array} positions Cartesian3的集合
   * @return {Number} 长度，单位米
   */
  static surfaceDistance(positions) {
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
  }

  /**
 * 空间距离
 * @param {Array} positions Cartesian3的集合
 * @return {Number} 长度，单位米
 */
  static spaceDistance(positions) {
    let dis = 0;
    for (let i = 1; i < positions.length; i++) {
      const s = positions[i - 1];
      const e = positions[i];
      dis += Math.sqrt((s.x - e.x) ** 2 + (s.y - e.y) ** 2 + (s.z - e.z) ** 2);
    }
    return dis;
  }

  /**
   * @private
   * 角度
   */
  static Angle(p1, p2, p3) {
    const bearing21 = Cartometry.Bearing(p2, p1);
    const bearing23 = Cartometry.Bearing(p2, p3);
    let angle = bearing21 - bearing23;
    if (angle < 0) {
      angle += 360;
    }
    return angle;
  }

  /**
   * @private
   * 方向
   */
  static Bearing(from, to) {
    const lat1 = from.lat * radiansPerDegrees;
    const lon1 = from.lon * radiansPerDegrees;
    const lat2 = to.lat * radiansPerDegrees;
    const lon2 = to.lon * radiansPerDegrees;
    let angle = -Math.atan2(Math.sin(lon1 - lon2)
      * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2)
    - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
    if (angle < 0) {
      angle += Math.PI * 2.0;
    }
    angle *= degreesPerRadian;// 角度
    return angle;
  }

  /**
   * 贴地面积
   * @param {Array} positions Cartesian的集合
   * @return {Number} 面积，单位：平方米
   */
  static surfaceArea(positions) {
    const points = positions.map((_) => {
      const cartographic = Cesium.Cartographic.fromCartesian(_);
      return {
        lon: Cesium.Math.toDegrees(cartographic.longitude),
        lat: Cesium.Math.toDegrees(cartographic.latitude),
        height: cartographic.height,
      };
    });

    let res = 0;
    // 拆分三角曲面

    for (let i = 0; i < points.length - 2; i += 1) {
      const j = (i + 1) % points.length;
      const k = (i + 2) % points.length;
      const totalAngle = Cartometry.Angle(points[i], points[j], points[k]);


      const distemp1 = Cartometry.surfaceDistance([positions[i], positions[j]]);
      const distemp2 = Cartometry.surfaceDistance([positions[j], positions[k]]);
      res += distemp1 * distemp2 * Math.abs(Math.sin(totalAngle));
    }
    return res;
  }
}
export default Cartometry;

import CesiumProError from "./CesiumProError";
import Point from "./Point";

class Polyline {
  /**
   * 定义一个线段
   * @param {number []} points 
   * @example
   * const p1 = new CesiumPro.Point(110,30);
   * const p2 = new CesiumPro.Point(110,40);
   * const polyline = new CesiumPro.Polyline([p1, p2]);
   */
  constructor(points) {
    if (points.length < 2) {
      throw new CesiumProError("Polyline positions must have at least 2 point")
    }
    this.points = points;
    this.type = 'LineString';
  }
  /**
   * 从经纬度数组创建线段
   * @param {*} positions 
   * @returns 
   */
  static fromArray(positions) {
    const points = []
    for (let i = 0, n = positions.length; i < n; i += 2) {
      const point = new Point(positions[i], positions[i + 1]);
      points.push(point);
    }
    return new Polyline(points);
  }
  /**
   * 转换为Geometry
   * @see {@link https://datatracker.ietf.org/doc/html/rfc7946#section-3.1|Geometry}
   * @returns {object} geometry对象
   */
  toGeometry() {
    return Polyline.toGeometry(this);
  }
  /**
   * 转换为Geometry
   * @see {@link https://datatracker.ietf.org/doc/html/rfc7946#section-3.1|Geometry}
   * @param {Polyline} polyline 对象
   * @returns {object} geometry对象
   */
  static toGeometry(polyline) {
    const coordinates = [];
    for (const point of polyline.points) {
      coordinates.push([point.x, point.y]);
    }
    return {
      type: polyline.type,
      coordinates,
    };
  }
}
export default Polyline;
import CesiumProError from "./CesiumProError";
import Point from "./Point";

class Polygon {
  /**
   * 定义一个线段
   * @param {number []} points 
   * @example
   * const p1 = new CesiumPro.Point(110,30);
   * const p2 = new CesiumPro.Point(110,40);
   * const polygon = new CesiumPro.Polygon([p1, p2]);
   */
  constructor(points) {
    if (points.length < 3) {
      throw new CesiumProError("Polygon positions must have at least 3 point")
    }
    this.points = points;
    this.type = 'Polygon';
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
    return new Polygon(points);
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
   * @param {Polygon} polygon 对象
   * @returns {object} geometry对象
   */
  static toGeometry(polygon) {
    const coordinates = [];
    const type = polygon.type;
    for (const point of polygon.points) {
      coordinates.push([point.toExponential, point.y]);
    }
    coordinates.push(coordinates[0])
    return {
      type,
      coordinates: [coordinates],
    };
  }
}
export default Polygon;
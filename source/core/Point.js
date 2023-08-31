class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.type = 'Point';
  }
  /**
   * 从数组创建一个点
   * @param {number []} points 
   * @returns 
   */
  static fromArray(points) {
    return new Point(points[0], points[1])
  }
  /**
   * 转换为Geometry
   * @see {@link https://datatracker.ietf.org/doc/html/rfc7946#section-3.1|Geometry}
   * @returns {object} geojson对象
   */
  toGeometry() {
    return Point.toGeometry(this);
  }
  /**
   * 转换为Geometry
   * @see {@link https://datatracker.ietf.org/doc/html/rfc7946#section-3.1|Geometry}
   * @param {Point} point 对象
   * @returns {object} geometry对象
   */
  static toGeometry(point) {
    return {
      type: point.type,
      coordinates: [point.x, point.y]
    }
  }
}
export default Point;
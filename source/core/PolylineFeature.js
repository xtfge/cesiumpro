import CesiumProError from "./CesiumProError";
import Feature from "./Feature";
import PointFeature from "./PointFeature";
import LonLat from "./LonLat";
class PolylineFeature extends Feature{
  /**
   * 定义一个线段
   * @param {PointFeature[]} points 
   * @param {object} properties 
   * @extends Feature
   * @example
   * const p1 = new CesiumPro.PointFeature(110,30);
   * const p2 = new CesiumPro.PointFeature(110,40);
   * const polyline = new CesiumPro.PolylineFeature([p1, p2]);
   */
  constructor(points, properties) {
    if (points.length < 2) {
      throw new CesiumProError("Polyline feature positions must have at least 2 point")
    }
    const coordinates = [];
    for (const point of points) {
      coordinates.push([point.x, point.y]);
    }
    super('LineString', coordinates, properties);
    this.points = points;
  }
  /**
   * 从经纬度数组创建线段
   * @param {number[]} positions 
   * @returns {PolylineFeature} polyline对象
   */
  static fromArray(positions) {
    const points = []
    for (let i = 0, n = positions.length; i < n; i += 2) {
      const point = new PointFeature(positions[i], positions[i + 1]);
      points.push(point);
    }
    return new PolylineFeature(points);
  }
  /**
   * 转为cesium entity
   * @returns {Cesium.Entity} entity对象
   */
  toEntity(options = {}) {
    options.positions = this.points.map(_ => Cesium.Cartesian3.fromDegrees(_.x, _.y));
    return new Cesium.Entity({
      properties: this.properties,
      polyline: options
    })
  }
  /**
   * 从Cesium Entity 对象生成Feature
   * @param {Cesium.Entity} entity 
   * @returns {Feature} feature对象
   */
  static fromEntity(entity) {
    if (entity instanceof Cesium.Entity === false) {
      throw new CesiumProError('entity must be a Cesium.Entity')
    }
    const time = Cesium.JulianDate.now();
    let properties = Feature.fromEntity(entity)
    if (entity.polyline && entity.polyline.positions) {
      let positions = entity.polyline.positions;
      positions = positions.getValue(time);
      const points = [];
      for (let position of positions) {
        const lonlat = LonLat.fromCartesian(position);
        points.push(new PointFeature(lonlat.lon, lonlat.lat));
      }
      return new PolylineFeature(points, properties)
    }
  }
}
export default PolylineFeature;
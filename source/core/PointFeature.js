import Feature from "./Feature";
import LonLat from "./LonLat";
class PointFeature extends Feature{
  /**
   * 定义一个点
   * @extends Feature
   * @param {number} x 经纬
   * @param {number} y 纬度
   * @param {object} properties 属性
   */
  constructor(x, y, properties) {
    const coordinates = [x, y];
    super('Point', coordinates, properties)
    this.x = x;
    this.y = y;
  }
  /**
   * 从数组创建一个点
   * @static
   * @param {number[]} points 
   * @returns {PointFeature} point 对象
   */
  static fromArray(points) {
    return new PointFeature(points[0], points[1])
  }
  /**
   * 转为cesium entity
   */
  toEntity(options = {}) {
    return new Cesium.Entity({
      position: Cesium.Cartesian3.fromDegrees(this.x, this.y),
      point: options,
      properties: this.properties
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
    if (entity.position) {
      const position = entity.position.getValue(time);
      const lonlat = LonLat.fromCartesian(position);
      return new PointFeature(lonlat.lon, lonlat.lat, properties)
    }
  }
}
export default PointFeature;
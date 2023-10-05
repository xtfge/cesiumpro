import CesiumProError from "./CesiumProError";
import PointFeature from "./PointFeature";
import Feature from "./Feature";
import LonLat from "./LonLat";
import defined from "./defined";

class PolygonFeature extends Feature {
  /**
   * 定义一个线段
   * @extends Feature
   * @param {PointFeature[]} points 
   * @param {object} properties 
   * @example
   * const p1 = new CesiumPro.PointFeature(110,30);
   * const p2 = new CesiumPro.PointFeature(110,40);
   * const p3 = new CesiumPro.PointFeature(120,40);
   * const polygon = new CesiumPro.PolygonFeature([p1, p2, p3]);
   */
  constructor(points, properties) {
    if (points.length < 3) {
      throw new CesiumProError("Polygon feature positions must have at least 3 point")
    }
    const coordinates = [];
    for (const point of points) {
      coordinates.push([point.x, point.y]);
    }
    coordinates.push(coordinates[0]);
    super('Polygon', [coordinates], properties);
    this.points = points;
  }
  /**
   * 从经纬度数组创建线段
   * @param {number[]} positions 
   * @returns {PolygonFeature} polygon对象
   */
  static fromArray(positions) {
    const points = []
    for (let i = 0, n = positions.length; i < n; i += 2) {
      const point = new PointFeature(positions[i], positions[i + 1]);
      points.push(point);
    }
    return new PolygonFeature(points);
  }
  /**
   * 转为cesium entity
   * @returns {Cesium.Entity} entity对象
   */
  toEntity(options = {}) {
    options.hierarchy = this.points.map(_ => Cesium.Cartesian3.fromDegrees(_.x, _.y));
    return new Cesium.Entity({
      properties: this.properties,
      polygon: options
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
    if (entity.polygon && entity.polygon.hierarchy) {
      const hierarchy = entity.polygon.hierarchy.getValue(time);
      const positions = hierarchy.positions;
      const points = [];
      for (let position of positions) {
        const lonlat = LonLat.fromCartesian(position);
        points.push(new PointFeature(lonlat.lon, lonlat.lat));
      }
      return new PolygonFeature(points, properties)  
    }
  }
  static toEntity(feature) {
    if (!defined(feature)) {
      return;
    }
    let coordinates;
    if (feature.geometry.type.toUpperCase() === 'POLYGON') {
      coordinates = [feature.geometry.coordinates]
    } else if (feature.geometry.type.toUpperCase() === 'MULTIPOLYGON') {
      coordinates = feature.geometry.coordinates;
    } else {
      throw new CesiumProError('Unknown feature type.')
    }
    const entities = [];
    for (let coordinate of coordinates) {
      let hierarchy = [];
      if (!defined(coordinate) || !Array.isArray(coordinate)) {
        return;
      }
      for (let coords of coordinate) {
        if (!Array.isArray(coords)) {
          return;
        }
        for (let coor of coords) {
          const ll = Cesium.Cartesian3.fromDegrees(coor[0], coor[1]);
          if (!defined(ll)) return;
          hierarchy.push(ll);
        }
      };
      const entity = new Cesium.Entity({
        polygon: {
          material: Cesium.Color.fromCssColorString('rgba(247,224,32,0.5)'),
          outlineColor: Cesium.Color.RED,
          perPositionHeight: false,
          hierarchy
        }
      })
      entities.push(entity)
    }
    return entities;
  }
}
export default PolygonFeature;
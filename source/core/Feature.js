class Feature {
  /**
   * OGC Feature
   * @see {@link https://datatracker.ietf.org/doc/html/rfc7946#section-3.2 |Feature}
   */
  constructor(type, coordinates, properties) {
    /**
     * geometry，定义了要素的几何信息
     * @type {object}
     * @see {@link https://datatracker.ietf.org/doc/html/rfc7946#section-3.1|OGC Geometry}
     */
    this.geometry = {
      type,
      coordinates
    };
    /**
     * 要素类型
     * @type {string}
     */
    this.type = 'Feature';
    /**
     * @type {object}
     * 定义了要素的属性信息
     */
    this.properties = properties;
  }
  /**
   * 转为cesium entity
   * @returns {Cesium.Entity} entity对象
   */
  toEntity(options = {}) {
    const geometry = this.geometry;
    const properties = this.properties;
    const { type, coordinates } = geometry;
    if (type === 'Point') {
      return new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(...coordinates),
        point: options,
        properties: properties
      })
    }
    if (type === 'LineString') {
      options.positions = Cesium.Cartesian3.fromDegreesArray(coordinates.flat());
      return new Cesium.Entity({
        properties: properties,
        polyline: options
      })
    }
    if (type === 'Polygon') {
      options.hierarchy = this.points.map(_ => Cesium.Cartesian3.fromDegrees(_.x, _.y));
      return new Cesium.Entity({
        properties: this.properties,
        polygon: options
      })
    }
  }
  static fromEntity(entity) {
    const props = {};
    if (entity.properties) {
      const keys = entity.properties._propertyNames;
      for (let key of keys) {
        props[key] = entity.properties[key].getValue();
      }
    }
    return props;
  }
}
export default Feature;
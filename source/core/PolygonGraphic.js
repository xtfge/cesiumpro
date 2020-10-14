import Graphic from './Graphic'
class PolygonGraphic extends Graphic {
  /**
   * 多边形
   */
  constructor() {
    super();
  }

  static defaultStyle = {
    material: Cesium.Color.fromCssColorString('rgba(247,224,32,0.5)'),
    outlineColor: Cesium.Color.fromCssColorString('rgba(255,247,145,1)'),
    outlineWidth: 2,
    perPositionHeight: false,
  }
  static highlightStyle = {
    material: new Cesium.ColorMaterialProperty(Cesium.Color.AQUA.withAlpha(0.4)),
    outlineColor: Cesium.Color.AQUA.withAlpha(0.4),
  }
  /**
   * 从一系列点中获取几何中心位置
   * @param  {Cesium.Cartesian3[]} points 点集
   * @return {Cesium.Cartesian3}    以points为顶点的多边形的几何中心
   */
  static centerFromPonits(points) {
    const boundingSphere = Cesium.BoundingSphere.fromPoints(points);
    if (boundingSphere) {
      return boundingSphere.center;
    }
    return undefined
  }

  static center(polygon) {
    let points = [];

    function getHierarchy(hierarchy) {
      if (hierarchy.getValue) {
        const hierarchyValue = hierarchy.getValue();
        if (hierarchyValue instanceof Cesium.PolygonHierarchy) {
          points = hierarchyValue.positions;
        } else {
          points = hierarchyValue
        }
      } else if (Array.isArray(hierarchy)) {
        points = hierarchy;
      }
    }
    if (polygon instanceof Cesium.Entity) {
      const hierarchy = polygon.polygon.hierarchy;
      getHierarchy(hierarchy);
    } else if (polygon.polygonHierarchy) {
      points = polygon.polygonHierarchy.positions;
    } else if (polygon.hierarchy) {
      getHierarchy(polygon.hierarchy)
    }
    return PolygonGraphic.centerFromPonits(points);
  }
}

export default PolygonGraphic;

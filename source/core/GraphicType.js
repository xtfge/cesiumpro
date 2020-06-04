/*
 * 定义几何图形类型
 */
/**
 * 几何图形类型
 * @exports GraphicType
 */
const GraphicType = {
  /**
   * Cesium.BillbaordEntity
   * @const
   */
  MARKER: 0,
  /**
     * @const
     * Cesium.Point
     */
  POINT: 5,
  /**
     * Cesium.PolylineEntity
     * @const
     */
  POLYLINE: 1,
  /**
     * Cesium.PolygonEntity
     * @const
     */
  POLYGON: 2,
  /**
     * Cesium.LabelEntity
     * @const
     */
  LABEL: 3,
  /**
     * Cesium.ModelEntity
     * @const
     */
  MODEL: 4,
};
export default Object.freeze(GraphicType);

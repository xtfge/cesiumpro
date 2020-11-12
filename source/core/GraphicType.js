/**
 * 为了方便管理几何要素自定义的几何类型，它不符合OGC标准。
 * @exports GraphicType
 * @enum {Number}
 */
const GraphicType = {
  /**
   * 点
   * @type {Number}
   * @constant
   */
  POINT: 1,
  /**
   * 线
   * @type {Number}
   * @constant
   */
  POLYLINE: 2,
  /**
   * 面
   * @type {Number}
   * @constant
   */
  POLYGON: 3,
  /**
   * 模型
   * @type {Number}
   * @constant
   */
  MODEL: 4,
  /**
   * label
   * @type {Number}
   * @constant
   */
  LABEL: 5,
  /**
   * 箭头（特殊标绘）
   * @type {Number}
   * @constant
   */
  ARROW: 6,
  /**
   * 广告牌(Mark)
   * @type {Number}
   * @constant
   */
  BILLBOARD: 7,
  /**
   * 多点
   * @type {Number}
   * @constant
   */
  MUTIPOINT: 8,
};
/**
 * 从枚举值获得枚举标签
 * @type {GraphicType}
 *
 * @example
 * const type=GraphicType.MODEL;
 * GraphicType.getKey(type);
 * //return 'Model'
 */
GraphicType.getKey = function (type) {
  let name = '';
  switch (type) {
    case GraphicType.POINT:
      name = 'Point';
      break;
    case GraphicType.POLYLINE:
      name = 'Polyline';
      break;
    case GraphicType.POLYGON:
      name = 'POLYGON';
      break;
    case GraphicType.LABEL:
      name = 'Label';
      break;
    case GraphicType.MODEL:
      name = 'Model';
      break;
    case GraphicType.ARROW:
      name = 'ARROW';
      break;
    case GraphicType.BILLBOARD:
      name = 'Billboard';
      break;
    case GraphicType.MUTIPOINT:
      name = 'MutlPoint';
      break;
    default:
      name = 'unknown';
  }
  return name;
};
/**
 * 将类型转换为OGC标准类型
 * @param  {GraphicType} type 要素类型
 * @return {String}     OGC要素类型
 */
GraphicType.getOGCType = function (type) {
  const validate = GraphicType.validate(type);
  if (!validate) {
    return 'unknown';
  }
  let ogcName = '';
  switch (type) {
    case GraphicType.POINT:
    case GraphicType.LABEL:
    case GraphicType.MODEL:
    case GraphicType.BILLBOARD:
      ogcName = 'Point';
      break;
    case GraphicType.POLYLINE:
      ogcName = 'LineString';
      break;
    case GraphicType.ARROW:
    case GraphicType.POLYGON:
      ogcName = 'Polygon';
      break;
    case GraphicType.MUTIPOINT:
      ogcName = 'MutlPoint';
  }
  return ogcName;
};
/**
 * 验证是否是合法类型
 * @param {CartometryType}
 * @returns {Number}
 */
GraphicType.validate = function (type) {
  return type === GraphicType.POINT || type === GraphicType.POLYLINE
    || type === GraphicType.POLYGON || type === GraphicType.ARROW
    || type === GraphicType.MODEL || type === GraphicType.LABEL
    || type === GraphicType.MUTIPOINT || type === GraphicType.BILLBOARD;
};
export default Object.freeze(GraphicType);

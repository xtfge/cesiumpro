import {
  ArrowType
} from '../../thirdParty/arrow';
/**
 * 为了方便管理几何要素自定义的几何类型，它不符合OGC标准。
 * @exports PlotType
 * @enum {String}
 */
const PlotType = {
  /**
   * 点
   * @type {String}
   * @constant
   */
  POINT: 'point',
  /**
   * 线
   * @type {String}
   * @constant
   */
  POLYLINE: 'polyline',
  /**
   * 面
   * @type {String}
   * @constant
   */
  POLYGON: 'polygon',
  /**
   * 模型
   * @type {String}
   * @constant
   */
  MODEL: 'model',
  /**
   * label
   * @type {String}
   * @constant
   */
  LABEL: 'label',
  /**
   * 箭头（特殊标绘）
   * @type {String}
   * @constant
   */
  STRAIGHTARROW: ArrowType.straightarrow,
  ATTACKARROW: ArrowType.attackarrow,
  DOUBLEARROW: ArrowType.doublearrow,
  /**
   * 广告牌(Marker)
   * @type {String}
   * @constant
   */
  BILLBOARD: 'billboard',
  /**
   * 多点
   * @type {String}
   * @constant
   */
  MUTIPOINT: 'mutipoint',
};
/**
 * 将类型转换为OGC标准类型
 * @param  {PlotType} type 要素类型
 * @return {String}     OGC要素类型
 */
PlotType.getOGCType = function(type) {
  const validate = PlotType.validate(type);
  if (!validate) {
    return 'unknown';
  }
  let ogcName = '';
  switch (type) {
    case PlotType.POINT:
    case PlotType.LABEL:
    case PlotType.MODEL:
    case PlotType.BILLBOARD:
      ogcName = 'Point';
      break;
    case PlotType.POLYLINE:
      ogcName = 'LineString';
      break;
    case PlotType.STRAIGHTARROW:
    case PlotType.ATTACKARROW:
    case PlotType.DOUBLEARROW:
    case PlotType.POLYGON:
      ogcName = 'Polygon';
      break;
    case PlotType.MUTIPOINT:
      ogcName = 'MutlPoint';
  }
  return ogcName;
};
/**
 * 验证是否是合法类型
 * @param {CartometryType}
 * @returns {Number}
 */
PlotType.validate = function(type) {
  return type === PlotType.POINT || type === PlotType.POLYLINE ||
    type === PlotType.POLYGON || type === PlotType.STRAIGHTARROW ||
    type === PlotType.ATTACKARROW || type === PlotType.DOUBLEARROW ||
    type === PlotType.MODEL || type === PlotType.LABEL ||
    type === PlotType.MUTIPOINT || type === PlotType.BILLBOARD;
};
/**
 * 验证类型是否是一个点，这里的点指的是位置由一个点决定的图形
 * @param  {PlotType} type 图形类型
 * @return {Boolean}   true表示type表示一个点
 */
PlotType.isPoint = function(type) {
  return type === PlotType.POINT || type === PlotType.MODEL ||
    type === PlotType.LABEL || type === PlotType.BILLBOARD
}
/**
 * 判断一个类型是否是箭头图形
 * @param  {PlotType} type 图形类型
 * @return {Boolean}  true表示type表示一个箭头图形
 */
PlotType.isArrow = function(type) {
  return type === PlotType.ATTACKARROW || type === PlotType.STRAIGHTARROW ||
    type === PlotType.DOUBLEARROW
}
export default Object.freeze(PlotType);

/**
 * 地图量算类型
 * @exports CartometryType
 * @enum {Number}
 */
const CartometryType = {
  /**
   * 贴地距离
   * @type {Number}
   * @constant
   */
  SURFACE_DISTANCE: 1,
  /**
   * 空间距离
   * @type {Number}
   * @constant
   */
  SPACE_DISTANCE: 2,
  /**
   * 空间面积
   * @type {Number}
   * @constant
   */
  SPACE_AREA: 3,
  /**
   * 贴地面积
   * @type {Number}
   * @constant
   */
  SURFACE_AREA: 4,
  /**
   * 高度
   * @type {Number}
   * @constant
   */
  HEIGHT: 5,
  /**
   * 方位角
   * @type {Number}
   * @constant
   */
  ANGLE: 6,
};

/**
 * 验证是否是合法类型
 * @param {CartometryType}
 * @returns {Number} true表示有效
 */
CartometryType.validate = function (type) {
  return type === CartometryType.SURFACE_AREA || type === CartometryType.SURFACE_DISTANCE
    || type === CartometryType.SPACE_AREA || type === CartometryType.SPACE_DISTANCE
    || type === CartometryType.HEIGHT || type === CartometryType.ANGLE;
};

/**
 * 从枚举值获得枚举标签
 * @param  {CartometryType} value 枚举值
 * @returns {String} 枚举值对应的类型
 */
CartometryType.getKey = function (value) {
  let key;
  switch (value) {
    case 1:
      key = 'SURFACE_DISTANCE';
      break;
    case 2:
      key = 'SPACE_DISTANCE';
      break;
    case 3:
      key = 'SPACE_AREA';
      break;
    case 4:
      key = 'SURFACE_AREA';
      break;
    case 5:
      key = 'HEIGHT';
      break;
    case 6:
      key = 'ANGLE';
      break;
    default:
      key = undefined;
  }
  return key;
};
/**
 * 根据key获得中文名
 * @param {*} value 
 * @returns {String} 枚举值对应的类型
 */
CartometryType.getValue = function (value) {
  let key;
  switch (value) {
    case 1:
      key = '贴地距离';
      break;
    case 2:
      key = '空间距离';
      break;
    case 3:
      key = '空间面积';
      break;
    case 4:
      key = '贴地面积';
      break;
    case 5:
      key = '高度';
      break;
    case 6:
      key = '方位角';
      break;
    default:
      key = undefined;
  }
  return key;
};
export default Object.freeze(CartometryType);

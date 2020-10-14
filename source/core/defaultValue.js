/**
 * 如果第一个元素为空或未定义，则返回第二个元素，用于设置默认属性
 * @exports defaultValue
 * @param {any} a
 * @param {any} b
 * @returns {any} 如果第一个元素为空或未定义，则返回第二个元素
 *
 * @example
 * param = Cesium.defaultValue(param, 'default');
 */
function defaultValue(a, b) {
  if (a !== undefined && a !== null) {
    return a;
  }
  return b;
}
/**
 *
 * 空对象，该对象不能被编辑
 *
 * @type {Object}
 * @memberof defaultValue
 *
 */
defaultValue.EMPTY_OBJECT = Object.freeze({});
export default defaultValue;

/**
 * 如果第一个参数未定义，返回第二个参数，否则返回第一个参数，用于设置默认值。
 *
 * @exports defaultValue
 *
 * @param {*} a
 * @param {*} b
 * @returns {*} 如果第一个参数未定义，返回第二个参数，否则返回第一个参数，用于设置默认值。
 *
 * @example
 * param = CesiumPro.defaultValue(param, 'default');
 */
function defaultValue(a, b) {
    if (a !== undefined && a !== null) {
        return a;
    }
    return b;
}
export default defaultValue;
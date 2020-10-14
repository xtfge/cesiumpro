/**
 * 判断一个变量是否被定义
 * @param value
 * @exports defined
 */
function defined(value) {
  return value !== undefined && value !== null;
}
export default defined;

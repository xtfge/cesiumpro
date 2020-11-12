import defaultValue from './defaultValue';
/**
 * @exports clone
 * 生成一个对象的副本
 * @param  {Object} object 被克隆的对象
 * @param  {Bool} deep   是否深度遍历
 * @return {Object}   object的副本
 */
function clone(object, deep) {
  if (object === null || typeof object !== 'object') {
    return object;
  }

  deep = defaultValue(deep, false);

  const result = new object.constructor();
  for (const propertyName in object) {
    if (object.hasOwnProperty(propertyName)) {
      let value = object[propertyName];
      if (deep) {
        value = clone(value, deep);
      }
      result[propertyName] = value;
    }
  }

  return result;
}

export default clone;

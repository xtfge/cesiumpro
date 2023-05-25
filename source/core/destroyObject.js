import defaultValue from "./defaultValue.js";
import CesiumProError from "./CesiumProError.js";

function returnTrue() {
  return true;
}

/**
 * 销毁一个对象，对象的所有属性和方法都被替换为一个会抛出{@link CesiumProError}异常的函数
 *
 * @exports destroyObject
 *
 * @param {Object} object The object to destroy.
 * @param {String} [message] The message to include in the exception that is thrown if
 *                           a destroyed object's function is called.
 *
 *
 * @example
 * // How a texture would destroy itself.
 * this.destroy = function () {
 *     _gl.deleteTexture(_texture);
 *     return Cesium.destroyObject(this);
 * };
 *
 * @see CesiumProError
 */
function destroyObject(object, message) {
  message = defaultValue(
    message,
    "This object was destroyed, i.e., destroy() was called."
  );

  function throwOnDestroyed() {
    //>>includeStart('debug', pragmas.debug);
    throw new CesiumProError(message);
    //>>includeEnd('debug');
  }
  const properties = Object.getOwnPropertyNames(object);
  const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(object));
  const keys = [...properties, ...methods];

  for (var key of keys) {
    if (typeof object[key] === "function") {
      object[key] = throwOnDestroyed;
    }
  }

  object.isDestroyed = returnTrue;

  return undefined;
}
export default destroyObject;

/*
 * 定义CesiumPro抛出的错误
 */

class CesiumProError extends Error {
  /**
   * 定义CesiumPro抛出的错误
   * @param {String} message 错误消息
   */
  constructor(message) {
    super(message);
    this.name = 'CesiumProError';
  }
}
export default CesiumProError;

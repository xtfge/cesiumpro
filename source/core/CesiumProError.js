class CesiumProError extends Error {
  /**
   * 定义CesiumPro抛出的错误
   * @extends Error
   * @param {String} message 描述错误消息的内容
   * @example
   * function flyTo(viewer,entity){
   *    if(!viewer){
   *      throw(new CesiumPro.CesiumProError("viewer未定义"))
   *    }
   *    viewer.flyTo(entity)
   * }
   *
   */
  constructor(message) {
    super(message);
    this.name = 'CesiumProError';
  }
}
export default CesiumProError;

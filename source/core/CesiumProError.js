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
CesiumProError.throwNoInstance = function() {
    throw new CesiumProError('它的定义了一个接口，不能被以直接调用.') 
}
export default CesiumProError;

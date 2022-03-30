const {ShaderSource} = Cesium;
/**
 * 自自定全局glsl函数
 * @param {String} builtinName 必须以czm开头
 * @param {*} shader 
 */
function buildUniforms(builtinName, shader) {
    ShaderSource._czmBuiltinsAndUniforms[builtinName] = shader;
}
export default buildUniforms;
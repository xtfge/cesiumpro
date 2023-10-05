import defaultValue from "./defaultValue";
const {
  WebGLConstants,
} = Cesium;
const datatypeToGlsl = {};
datatypeToGlsl[WebGLConstants.FLOAT] = "float";
datatypeToGlsl[WebGLConstants.FLOAT_VEC2] = "vec2";
datatypeToGlsl[WebGLConstants.FLOAT_VEC3] = "vec3";
datatypeToGlsl[WebGLConstants.FLOAT_VEC4] = "vec4";
datatypeToGlsl[WebGLConstants.INT] = "int";
datatypeToGlsl[WebGLConstants.INT_VEC2] = "ivec2";
datatypeToGlsl[WebGLConstants.INT_VEC3] = "ivec3";
datatypeToGlsl[WebGLConstants.INT_VEC4] = "ivec4";
datatypeToGlsl[WebGLConstants.BOOL] = "bool";
datatypeToGlsl[WebGLConstants.BOOL_VEC2] = "bvec2";
datatypeToGlsl[WebGLConstants.BOOL_VEC3] = "bvec3";
datatypeToGlsl[WebGLConstants.BOOL_VEC4] = "bvec4";
datatypeToGlsl[WebGLConstants.FLOAT_MAT2] = "mat2";
datatypeToGlsl[WebGLConstants.FLOAT_MAT3] = "mat3";
datatypeToGlsl[WebGLConstants.FLOAT_MAT4] = "mat4";
datatypeToGlsl[WebGLConstants.SAMPLER_2D] = "sampler2D";
datatypeToGlsl[WebGLConstants.SAMPLER_CUBE] = "samplerCube";
function AutomaticUniform(options) {
  this._size = options.size;
  this._datatype = options.datatype;
  this.getValue = options.getValue;
}
class AutomaticDynamicUniform {
  constructor(options) {
    this._size = options.size;
    this._datatype = options.datatype;
    this.getValue = options.getValue;
    this._simpleType = defaultValue(options.simpleType, false);
  }
  getDeclaration(name) {
    let declaration = `uniform ${datatypeToGlsl[this._datatype]} ${name}`;
    const size = this._size;
    if (this._simpleType) {
      declaration += ";";
    } else {
      declaration += `[${size.toString()}];`;
    }
    return declaration;
  };
}
const CesiumAutomaticUniforms = Cesium.AutomaticUniforms;
// 卷帘对比uniforms
const splitUniforms = {
  czm_p_drawingBufferWidth: new AutomaticUniform({
    size: 1,
    datatype: WebGLConstants.FLOAT,
    getValue: function (uniformState) {
      return uniformState.frameState.context.drawingBufferWidth;
    },
  }),
  czm_p_drawingBufferHeight: new AutomaticUniform({
    size: 1,
    datatype: WebGLConstants.FLOAT,
    getValue: function (uniformState) {
      return uniformState.frameState.context.drawingBufferHeight;
    },
  }),
  czm_p_splitPosition: new AutomaticUniform({
    size: 1,
    datatype: WebGLConstants.FLOAT,
    getValue: function (uniformState) {
      return uniformState.frameState.splitPosition;
    },
  })
}
function attachCustomUniforms(scene) {
  let clipRegionUniforms = {};
  const uniforms = Object.assign({}, splitUniforms);
  const us = Object.keys(uniforms);
  for (let u of us) {
    CesiumAutomaticUniforms[u] = uniforms[u]
  }
}
export default attachCustomUniforms
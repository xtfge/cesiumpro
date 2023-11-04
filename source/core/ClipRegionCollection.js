import CesiumProError from './CesiumProError'
import ClipRegion from './ClipRegion';
import defaultValue from './defaultValue'

const {
  AssociativeArray,
  AutomaticUniforms,
  ShaderSource,
  WebGLConstants
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
class ClipRegionCollection {
  /**
   * 指定一组剪裁区域，用于使某些着色仅在指定区域内生效。
   */
  constructor() {
    this._values = new AssociativeArray();
    this._enabled = true;
    this._hasUpdated = false;
  }
  /**
   * ClipRegion是否生效
   * @type {boolean}
   */
  get enabled() {
    return this._enabled;
  }
  set enabled(enabled) {
    this._enabled = enabled;
  }
  /**
   * clip 区域的数量
   * @type {number}
   */
  get count() {
    if (!this._hasUpdated) {
      return 0;
    }
    return this._values._array.filter(_ => _.enabled).filter(_ => _._colorTexture).length;
  }
  get boundingRect() {
    const result = [];
    for (let clipRegion of this._values._array) {
      if (!clipRegion.enabled) {
        continue;
      }
      result.push(clipRegion.boundingRect)
    }
    return result;
  }
  get inverseLocalModel() {
    const result = [];
    for (let clipRegion of this._values._array) {
      if (!clipRegion.enabled) {
        continue;
      }
      result.push(clipRegion._inverseLocalModel)
    }
    return result;
  }
  get depthTexture() {
    const result = [];
    for (let clipRegion of this._values._array) {
      if (!clipRegion.enabled) {
        continue;
      }
      if (!clipRegion._colorTexture) {
        continue
      }
      result.push(clipRegion._colorTexture)
    }
    return result;
  }
  get normal() {
    const result = [];
    for (let clipRegion of this._values._array) {
      if (!clipRegion.enabled) {
        continue;
      }
      if (!clipRegion._colorTexture) {
        continue
      }
      result.push(clipRegion.normal)
    }
    return result;
  }
  /**
   * 添加一个clipRegion
   * @param {ClipRegion} clipRegion 
   */
  add(clipRegion) {
    if (clipRegion instanceof ClipRegion === false) {
      throw new CesiumProError('parameter clipRegion must be a ClipRegion instance.')
    }
    this._values.set(clipRegion._id, clipRegion);
    this._updateGlobeUniforms();
  }
  /**
   * 删除一个clipRegion
   * @param {string} clipRegion 需要删除的clipRegion或其id
   */
  remove(clipRegion) {
    let id = clipRegion;
    if (clipRegion instanceof ClipRegion) {
      id = clipRegion.id;
    }
    this._values.remove(id);
    this._updateGlobeUniforms();
  }
  /**
   * 删除所有
   */
  removeAll() {
    this._values.removeAll()
    this._updateGlobeUniforms();
  }
  /**
   * 根据id获得ClipRegion
   * @param {string} id 
   * @returns 
   */
  get(id) {
    return this._values.get(id);
  }
  /**
   * 根据序号获得ClipRegion
   * @param {number} index clipRegion index
   * @returns 
   */
  getByIndex(index) {
    return this._values._array[index];
  }
  /**
   * 判断clipRegion是否存在
   * @param {ClipRegion} clipRegion
   * @returns 
   */
  contains(clipRegion) {
    return this._values.contains(clipRegion._id);
  }
  update(frameState) {
    for (let clipRegion of this._values._array) {
      if (!clipRegion.enabled) {
        continue;
      }
      clipRegion.update(frameState);
    }
    this._hasUpdated = true;
    this._updateGlobeUniforms();
  }
  _updateGlobeUniforms() {
    const size = this.count;
    const globeUniforms = {
      czm_p_clipEnabled: new AutomaticDynamicUniform({
        size: 1,
        simpleType: true,
        datatype: WebGLConstants.BOOL,
        getValue: function(uniformState) {
          return uniformState.clipEnabled
        }
      }),
      czm_p_clipDepthTexture: new AutomaticDynamicUniform({
        size: size,
        datatype: WebGLConstants.SAMPLER_2D,
        getValue: function(uniformState) {
          return uniformState.clipDepthTexture;
        },
      }),
      czm_p_clipBoundingRect: new AutomaticDynamicUniform({
        size: size,
        datatype: WebGLConstants.FLOAT_VEC4,
        getValue: function(uniformState) {
          return uniformState.clipBoundingRect;
        },
      }),
      czm_p_clipNormal: new AutomaticDynamicUniform({
        size: size,
        datatype: WebGLConstants.FLOAT_VEC3,
        getValue: function(uniformState) {
          return uniformState.clipNormal;
        },
      }),
      czm_p_clipInverseLocalModel: new AutomaticDynamicUniform({
        size: size,
        datatype: WebGLConstants.FLOAT_MAT4,
        getValue: function(uniformState) {
          return uniformState.clipInverseLocalModel;
        },
      })
    }
    for (const uniformName in globeUniforms) {
      AutomaticUniforms[uniformName] = globeUniforms[uniformName]
      if (AutomaticUniforms.hasOwnProperty(uniformName)) {
        let uniform = AutomaticUniforms[uniformName];
        if (typeof uniform.getDeclaration === "function") {
          ShaderSource._czmBuiltinsAndUniforms[
            uniformName
          ] = uniform.getDeclaration(uniformName);
        }
      }
    }
  }
}
export default ClipRegionCollection;
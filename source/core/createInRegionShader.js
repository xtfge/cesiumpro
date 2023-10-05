const {
  ShaderSource
} = Cesium;
/**
 * @private
 * @param {CesiumProError.Scene} scene 
 * @returns 
 */
function createInRegionShader(scene) {
  // console.log('createInRegionShader')
  const functionName = 'czm_p_inClipRegion';
  if (!scene.globe) {
    return ShaderSource._czmBuiltinsAndUniforms[functionName] = `bool czm_p_inClipRegion(vec3 positionWC) {return !czm_p_clipEnabled;}`;
  }
  const clipRegion = scene.globe.clipRegion;
  const count = clipRegion.count;
  if (count === 0) {
    return ShaderSource._czmBuiltinsAndUniforms[functionName] = `bool czm_p_inClipRegion(vec3 positionWC) {return !czm_p_clipEnabled;}`;
  }
  let shader = `
  bool inBoundingRect(vec2 st) {
    return st.s >= 0.0 && st.s <=1.0 && st.t >= 0.0 && st.t <= 1.0;
  }
  bool in_clipRegion(sampler2D texture, vec3 positionWC, vec4 boundingRect, vec3 normalEC, mat4 inverseMatrix) {
    vec2 st;
    vec4 positionLC = inverseMatrix * vec4(positionWC, 1.0);
    st.s = (positionLC.x-boundingRect.x)/(boundingRect.z-boundingRect.x);
    st.t = (positionLC.y-boundingRect.y)/(boundingRect.w-boundingRect.y);
    if (inBoundingRect(st)) {
      float depth = czm_unpackDepth(texture2D(texture, st));
      depth = depth * 1024.0;
      if (depth > 1.0 && dot(normalEC, (vec4(positionWC, 1.0)).xyz) > 0.0) {
        return true;
      }
    }
    return false;
  }
  bool czm_p_inClipRegion(vec3 positionWC) {
    if(!czm_p_clipEnabled) {
      return true;
    }
    for (int i = 0; i < ${count}; i++) {
        bool isIn = in_clipRegion(czm_p_clipDepthTexture[i], positionWC, czm_p_clipBoundingRect[i], czm_p_clipNormal[i], czm_p_clipInverseLocalModel[i]);
        if (isIn) {
          return true;
        }
    }
    return false;
  }`;
  ShaderSource._czmBuiltinsAndUniforms[functionName] = shader;
}
export default createInRegionShader;
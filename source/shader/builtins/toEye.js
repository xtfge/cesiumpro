const shader = `
vec4 czm_p_toEye(vec2 uv,float depth){
  vec4 eyeCoordinate = czm_windowToEyeCoordinates(uv, depth);
  return eyeCoordinate/eyeCoordinate.w;
}
vec4 czm_p_toEye(in vec2 uv, in sampler2D depthTexture){
    float depth=czm_p_getDepth(texture2D(depthTexture, uv));
    vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));
    vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);
    posInCamera =posInCamera / posInCamera.w;
    return posInCamera;
}
`
export default shader;

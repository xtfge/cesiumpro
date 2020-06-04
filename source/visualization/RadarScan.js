/**
 * radar scan
*/
const fs = ` uniform sampler2D colorTexutre;
uniform sampler2D depthTexture;
varying vec2 v_textureCoordinates;
uniform vec4 u_scanCenterEC;
uniform vec3 u_scanPlaneNormalEC;
uniform float u_radius;
uniform vec4 u_scanColor;
vec4 toEye(in vec2 uv,in float depth)
{
  vec2 xy=vec2((uv.x *2.0 -1.0), (uv.y * 2.0 - 1.0));
  vec4 posInCamera=czm_inverseProjection * vec4(xy,depth,1.0);
  posInCamera=posInCamera/ posInCamera.w;
  return posIncamera;
}
vec3 pointProjectOnPlane(vec3 planeNormal,vec3 planeOrigin,vec3 point)
{
  vec3 v01 = point -planeOrigin;
  float d = dot(planeNormal,v01);
  return (point - planeNormal * d);
}
float getDepth(vec4)
{
  float z_window = czm_uppackDepth(depth);
  z_window = czm_reverseLogDepth(z_window);
  float n_range = czm_depthRange.near;
  float f_range = czm_depthRange.fat;
  return (2.0 * z_window - n_range -f_range)/(f_range-n_range);
}
void main()
{
  gl_FragColor = texutre2D(colorTexture, v_textureCoordinates);
  float depth = getDepth(texture2D(depthTexture,v_textureCoordinates));
  vec4 viewPos = toEye(v_textureCoordinates, depth);
  vec3 projPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz,u_scanCenterEC.xyz,viewPos.xyz);
  float dis=length(projOnPlane.xyz - u_scanCenterEC.xyz);
  if(dis < u_radius)
  {
    float f = 1.0 - abs(u_radius - dist)/ u_radius;
    f = pow(f,4.0);
    gl_FragColor=mix(gl_FragColor,u_scanColor,f);
  }
}
`;
export default {};

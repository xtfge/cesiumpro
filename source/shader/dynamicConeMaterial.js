const baseMaterialShader = `
uniform sampler2D image;
uniform vec4 color;

float glow(float var, float radius, float blur) {
    float innerRadius = radius - blur;
    float outerRadius = radius + blur;
    float alpha = 1.0 - step(var, innerRadius);
    alpha *= step(var, outerRadius);
    float innerBlur = (1.0 - step(var, innerRadius)) * var;
    float outerBlur = (1.0 - abs(var - radius) / blur) * alpha;
    return outerBlur ;
}
czm_material czm_getMaterial(czm_materialInput materialInput) {
  czm_material material = czm_getDefaultMaterial(materialInput);
  vec2 st = materialInput.st;
  // calculate distance from the fragment to circle center and normalize it.
  float length = distance(st, vec2(0.5)) * 2.0;
  float innerCircle = glow(length, 0.35, 0.2);
  float outerCircle = glow(length, 0.8, 0.2);
  float alpha = innerCircle + outerCircle;
  material.diffuse = color.rgb * vec3(color.a);
  material.alpha = pow(alpha, 4.0) * color.a;
  return material;
}
`
const dashCircleMaterialShader = `
float dashCircle(vec2 st, float time) {
  float slice = 18.0;
  time = 3.1415926 / 180.0 * time;
  float cost = cos(time);
  float sint = sin(time);
  mat2 rotateMatrix = mat2(cost, -sint, sint, cost);
  st = rotateMatrix * st;
  float cos = dot(normalize(st), vec2(1.0, 0.0));
  float angle  = acos(cos);
  float sliceAngle = 3.1415926 * 2.0 / slice;
  float index = mod(floor(angle / sliceAngle), 2.0);
  if (st.t > 0.0) {
    return 1.0 - index;
  }
  return index;
}
czm_material czm_getMaterial(czm_materialInput materialInput) {
  czm_material material = czm_getDefaultMaterial(materialInput);
  vec2 st = materialInput.st;
  float length = distance(st, vec2(0.5)) * 2.0;
  vec2 center = st - vec2(0.5, 0.5);
  float time = -czm_frameNumber * 3.1415926 / 180.;//扫描速度1度
  float sin_t = sin(time);
  float cos_t = cos(time);
  float alpha = step(length, 0.7);
  alpha *= step(0.55, length);
  alpha *= dashCircle(st - vec2(0.5), mod(czm_frameNumber * speed, 180.0 * 2.0));
  alpha *= min((1.0 - abs(length - 0.625) / 0.15), 1.0);
  material.diffuse = color.rgb;
  material.alpha = alpha * color.a;
  return material;
}
`
const coneMaterialShader = `
czm_material czm_getMaterial(czm_materialInput materialInput) {
  czm_material material = czm_getDefaultMaterial(materialInput);
  vec2 st = materialInput.st;
  float powerRatio = 1.0 / (fract(czm_frameNumber / 30.0) + 1.0);
  float alpha = pow(1.0 - st.t, powerRatio);
  material.diffuse = color.rgb;
  material.alpha = alpha * color.a;
  return material;
}
`
const cylinderMaterialShader = `
czm_material czm_getMaterial(czm_materialInput materialInput)
{
  vec2 st = materialInput.st;
  czm_material material = czm_getDefaultMaterial(materialInput);
  float dt=fract(czm_frameNumber * speed /180.0);
  st=fract(st-vec2(dt,dt));
  vec4 imageColor = texture2D(image, st);
  vec4 tempColor=vec4(color.rgb,imageColor.a);
  tempColor.a = tempColor.a;
  material.alpha = tempColor.a;
  material.diffuse = tempColor.rgb *vec3(1.5);
  return material;
}`
export default {
    baseMaterialShader,
    dashCircleMaterialShader,
    coneMaterialShader,
    cylinderMaterialShader
}
const shader = `
czm_material czm_getMaterial(czm_materialInput materialInput){
  czm_material material =czm_getDefaultMaterial(materialInput);
  float PI = 3.141592653589793;
  float angle=2.0*PI*fract(time);
  mat2 rotateMaterial=mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
  vec2 uv=materialInput.st-vec2(0.5);
  materialInput.st=rotateMaterial*uv+vec2(0.5);
  vec4 imageRgba=texture2D(image,materialInput.st);
  material.alpha=imageRgba.a;
  float dis=distance(materialInput.st,vec2(0.5));
  material.diffuse=color.rgb;
  return material;
}
`
export default shader;

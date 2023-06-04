const shader =
  `
  czm_material czm_getMaterial(czm_materialInput materialInput) {
  czm_material material = czm_getDefaultMaterial(materialInput);
  vec2 st = materialInput.st;
  vec4 imageRgba=texture2D(image, vec2(1.0 - fract(time - st.s),st.t));
  material.alpha =imageRgba.a * color.a;
  material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb);
  return material;
}
`
export default shader;

const shader = `
czm_material czm_getMaterial(czm_materialInput materialInput){
  czm_material material=czm_getDefaultMaterial(materialInput);
  vec2 st=materialInput.st;
  material.alpha=fract(time-st.s)*color.a;
  material.diffuse=color.rgb;
  return material;
}
`
export default shader;

const shader = `
czm_material czm_getMaterial(czm_materialInput materialInput){
  czm_material material=czm_getDefaultMaterial(materialInput);
  float dis=distance(materialInput.st,vec2(0.5));
  if(dis*time<0.8){
    discard;
  }
}
`
export default shader;

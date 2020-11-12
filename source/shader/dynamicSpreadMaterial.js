const shader = `
czm_material czm_getMaterial(czm_materialInput materialInput){
  czm_material material=czm_getDefaultMaterial(materialInput);
  vec2 st=materialInput.st;
  float per=fract(time);
  float dis=distance(st,vec2(0.5));
  if(dis*2.0>per){
    discard;
  }else{
    material.alpha=color.a*dis*2.0/per;
    material.diffuse=color.rgb;
  }
  return material;
}
`
export default shader;

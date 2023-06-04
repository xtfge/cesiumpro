const shader = `
czm_material czm_getMaterial(czm_materialInput materialInput){
  czm_material material=czm_getDefaultMaterial(materialInput);
  vec2 st=materialInput.st*repeat;
  float s=1.0-fract(time-st.s);
  if(wrapX){
    s= s=1.0-fract(time-st.t);
  }
  vec4 imageRGBA=texture2D(image,vec2(s,st.t));
  material.alpha = imageRGBA.a * color.a;
	material.diffuse = max(color.rgb * material.alpha * gradient, color.rgb);
  return material;
}
`
export default shader;

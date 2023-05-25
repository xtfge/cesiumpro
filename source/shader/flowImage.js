const glsl = `
czm_material czm_getMaterial(czm_materialInput materialInput) {
    float time = (czm_frameNumber * speed / 1000.0);
    vec2 st = fract(repeat * materialInput.st);
    st = vec2(fract(time - st.s), st.t);
    vec4 imageColor = texture2D(image, st);
    czm_material material = czm_getDefaultMaterial(materialInput);
    float alpha = 1.0 - (abs(0.5 - st.t) * 2.0);
    material.alpha = imageColor.a * color.a * alpha;
    material.diffuse = imageColor.rgb * color.rgb;
    return material;
}
`
export default glsl;
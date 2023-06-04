const shader = `czm_material czm_getMaterial(czm_materialInput materialInput)
    {
         czm_material material = czm_getDefaultMaterial(materialInput);
         vec2 st = materialInput.st;
         vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));
         material.alpha=colorImage.a*color.a;
         float factor=colorImage.a;
         material.diffuse=mix(color.rgb,colorImage.rgb,factor);
         return material;
        }`;
export default shader;

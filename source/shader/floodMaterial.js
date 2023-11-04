const shader = `
uniform float height;
uniform vec4 color;

czm_material czm_getMaterial(czm_materialInput materialInput) {
    czm_material material = czm_getDefaultMaterial(materialInput);
    if (materialInput.height < height) {
      material.alpha = color.a;
    } else {
      material.alpha = 0.0;
    }
    material.diffuse = color.rgb;
    return material;
}
`;
export default shader;
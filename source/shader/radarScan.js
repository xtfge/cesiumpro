const glsl = `
    czm_material czm_getMaterial(czm_materialInput materialInput) {
        czm_material material = czm_getDefaultMaterial(materialInput);
        vec2 st = materialInput.st;
        float imageColor = texture2D(image, st);
        material.alpha = 1.0;
        return material;
    }
`
export default glsl;
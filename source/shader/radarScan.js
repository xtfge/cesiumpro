const shader = `
czm_material czm_getMaterial(czm_materialInput materialInput) {
    czm_material material = czm_getDefaultMaterial(materialInput);
    material.diffuse = color.rgb;
    vec2 st = materialInput.st - vec2(0.5);
    float dis = distance(st, vec2(0.0));
    // material.alpha = min(pow(dis * 2.0, 5.0) * color.a, 1.0);
    if (dis * 2.0 > fract(time)) {
        discard;
    }  
    float scale = 1.0 / (max(time, 0.0001));
    material.alpha = min(pow(dis * 2.0 * scale, 5.0), 1.0) * color.a;
    return material;
}
`

export default shader;
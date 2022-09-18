const glsl = `
    float circle(vec2 uv, float r, float blur) {
        float d = length(uv);
        float c = smoothstep(r+blur, r, d);
        return c;
    }
    czm_material czm_getMaterial(czm_materialInput materialInput) {
        czm_material material = czm_getDefaultMaterial(materialInput);
        mat2 rotateMatrix = mat2(stRotation.x, stRotation.y, stRotation.z, stRotation.w);
        vec2 st = rotateMatrix * (materialInput.st - vec2(0.5));
        float t = time;
        float s = 0.4;
        float radius1 = smoothstep(.0, s, 1.0) * 0.5;
        float alpha1 = circle(st, radius1, 0.02) * circle(st, radius1, -0.02);
        float alpha2 = circle(st, radius1, 0.02 - radius1) * circle(st, radius1, 0.02);
        float radius2 = 0.5 + smoothstep(s, 1.0, t) * 0.5;
        float alpha3 = circle(st, radius1, radius2 + 0.01 - radius1) * circle(st, radius1, -0.02);
    
        float circleAlpha = color.a * smoothstep(1.0, s, 0.0) * (alpha1 + alpha2*0.1 + alpha3*0.2);
        vec4 imageColor = texture2D(image, st + vec2(0.5));
        material.diffuse = color.rgb;
        material.alpha = imageColor.a * color.a + circleAlpha;
        return material;
    }
`
export default glsl;
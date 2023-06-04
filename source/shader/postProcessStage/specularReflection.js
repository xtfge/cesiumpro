const shader = `
#extension GL_OES_standard_derivatives : enable
uniform sampler2D colorTexture;
uniform sampler2D depthTexture;
varying vec2 v_textureCoordinates;
vec4 toEye(in vec2 uv, in float depth){
    vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));
    vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);
    posInCamera =posInCamera / posInCamera.w;
    return posInCamera;
}
float getDepth(in vec4 depth){
    float z_window = czm_unpackDepth(depth);
    z_window = czm_reverseLogDepth(z_window);
    float n_range = czm_depthRange.near;
    float f_range = czm_depthRange.far;
    return (2.0 * z_window - n_range - f_range) / (f_range - n_range);
}
vec3 guussColor(vec2 uv){
    vec2 pixelSize = 1.0 / czm_viewport.zw;
    float dx0 = -pixelSize.x;
    float dy0 = -pixelSize.y;
    float dx1 = pixelSize.x;
    float dy1 = pixelSize.y;
    vec4 gc = (
        texture2D(colorTexture, uv)+
        texture2D(colorTexture, uv + vec2(dx0, dy0)) +
        texture2D(colorTexture, uv + vec2(0.0, dy0)) +
        texture2D(colorTexture, uv + vec2(dx1, dy0)) +
        texture2D(colorTexture, uv + vec2(dx0, 0.0)) +
        texture2D(colorTexture, uv + vec2(dx1, 0.0)) +
        texture2D(colorTexture, uv + vec2(dx0, dy1)) +
        texture2D(colorTexture, uv + vec2(0.0, dy1)) +
        texture2D(colorTexture, uv + vec2(dx1, dy1))
    ) * (1.0 / 9.0);
    return gc.rgb;
}
void main(){
    float offset = 0.0;
    vec4 color = texture2D(colorTexture, v_textureCoordinates);
    vec4 currD = texture2D(depthTexture, v_textureCoordinates);
    if(currD.r>=1.0){
        gl_FragColor = color;
        return;
    }
    float depth = getDepth(currD);

    vec4 positionEC = toEye(v_textureCoordinates, depth);
    vec3 dx = dFdx(positionEC.xyz);
    vec3 dy = dFdy(positionEC.xyz);
    vec3 normal = normalize(cross(dx,dy));
    vec4 positionWC = normalize(czm_inverseView * positionEC);
    vec3 normalWC = normalize(czm_inverseViewRotation * normal);
    float fotNumWC = dot(positionWC.xyz,normalWC);
    if(fotNumWC<=0.5){
        gl_FragColor = color;
        return;
    }

    vec3 viewDir = normalize(positionEC.xyz);
    vec3 reflectDir = reflect(viewDir, normal);
    // vec3 viewReflectDir = czm_viewRotation * reflectDir;
    vec3 viewReflectDir = reflectDir;


    float step = 0.05;
    int stepNum = int(20.0 / step);
    vec3 pos;
    vec3 albedo;
    bool jd = false;
    for(int i = 1;i <= 400;i++)
    {
        float delta = step * float(i) + offset;
        pos = positionEC.xyz + viewReflectDir * delta;
        float d = -pos.z;

        vec4 tmp = czm_projection * vec4(pos,1.0);
        vec3 screenPos = tmp.xyz / tmp.w;
        vec2 uv = vec2(screenPos.x, screenPos.y) * 0.5 + vec2(0.5, 0.5);

        if(uv.x > 0.0 && uv.x < 1.0 && uv.y > 0.0 && uv.y < 1.0){
            float dd = getDepth(texture2D(depthTexture, uv));
            vec4 jzc = toEye(uv, dd);
            dd = -jzc.z;
            if(d>dd){
                if(abs(abs(d) - abs(dd)) <=step){
                    jd = true;
                    // albedo = texture2D(colorTexture, uv).rgb;
                    albedo = guussColor(uv);
                }
                break;
            }
        }
    }
    if(jd){
        gl_FragColor = vec4(mix(color.xyz,albedo,0.5),1.0);
    }else{
        gl_FragColor = color;
    }
}`
export default shader;

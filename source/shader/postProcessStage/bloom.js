const shader = `
#define NUM_MIPS 5
varying vec2 v_textureCoordinates;
uniform sampler2D blurTexture1;
uniform sampler2D blurTexture2;
uniform sampler2D blurTexture3;
uniform sampler2D blurTexture4;
uniform sampler2D blurTexture5;
uniform sampler2D colorTexture;
uniform float bloomStrength;
uniform float bloomRadius;
uniform float bloomFactors[NUM_MIPS];
uniform vec3 bloomTintColors[NUM_MIPS];
float lerpBloomFactor(const in float factor){
  float mirrorFactor=1.2-factor;
  return mix(factor,mirrorFactor,bloomRadius);
}
void main(){
  vec4 color=texture2D(colorTexture,v_textureCoordinates);
  gl_FragColor=bloomStrength*(
    lerpBloomFactor(bloomFactors[0])*vec4(bloomTintColors[0],1.0)*texture2D(blurTexture1,v_textureCoordinates)+
    lerpBloomFactor(bloomFactors[1])*vec4(bloomTintColors[1],1.0)*texture2D(blurTexture2,v_textureCoordinates)+
    lerpBloomFactor(bloomFactors[2])*vec4(bloomTintColors[2],1.0)*texture2D(blurTexture3,v_textureCoordinates)+
    lerpBloomFactor(bloomFactors[3])*vec4(bloomTintColors[3],1.0)*texture2D(blurTexture4,v_textureCoordinates)+
    lerpBloomFactor(bloomFactors[4])*vec4(bloomTintColors[4],1.0)*texture2D(blurTexture5,v_textureCoordinates)
  )+color;
}`
export default shader;

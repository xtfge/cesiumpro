const shader = `
uniform sampler2D colorTexture;
uniform vec2 direction;
uniform float scale;
uniform float bloomRadius;
float gaussianPdf(in float x, in float sigma) {
  return 0.39894 * exp(-0.5 * x * x/(sigma * sigma))/sigma;
}
void main(){
  vec4 color=texture2D(colorTexture,v_textureCoordinates);
  float fSigma=float(SIGMA);
  vec2 size=vec2(czm_viewport.z,czm_viewport.w)*scale*fSigma*2.0;
  vec2 invSize=(1.0+bloomRadius)/size;
  float weightSum=gaussianPdf(0.0,fSigma);
  vec3 diffuseSum=texture2D(colorTexture,v_textureCoordinates).rgb*weightSum;
  bool selected=false;
  for(int i=0;i<KERNEL_RADIUS;i++){
    float x=float(i);
    float w=gaussianPdf(x,fSigma);
    vec2 uvOffset=direction*invSize*x;
    vec3 sample1=texture2D(colorTexture,v_textureCoordinates+uvOffset).rgb;
    vec3 sample2=texture2D(colorTexture,v_textureCoordinates-uvOffset).rgb;
    diffuseSum+=(sample1+sample2)*w;
    weightSum+=2.0*w;
  }
  gl_FragColor=vec4(diffuseSum/weightSum,2.0);
}
`
export default shader;

const shader = `
#extension GL_OES_standard_derivatives : enable
uniform sampler2D colorTexture;
uniform sampler2D depthTexture;
uniform float alpha;
uniform float snowDensity;
varying vec2 v_textureCoordinates;
uniform float speed;
float snow(vec2 uv,float scale){
  float time = czm_frameNumber/speed ;
  float w=smoothstep(1.,0.,-uv.y*(scale/10.));
  if(w<.1)return 0.;
  uv+=time/scale;
  uv.y+=time*2./scale;
  uv.x+=sin(uv.y+time*.5)/scale;
  uv*=scale;
  vec2 s=floor(uv),f=fract(uv),p;
  float k=3.;
  p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;
  float d=length(p);
  k=min(d,k);
  k=smoothstep(0.,k,sin(f.x+f.y)*0.01);
  return k*w;
}
void main(){
  vec4 bgColor=vec4(0.0);
  vec4 color = texture2D(colorTexture, v_textureCoordinates);
  vec4 depth = texture2D(depthTexture, v_textureCoordinates);
  vec2 resolution = czm_viewport.zw;
  vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);
  vec3 snowColor=vec3(0);
  float c = 0.0;
  float per=20.0/snowDensity;
  for(float scale=2.0;scale<=20.0;scale++){
    if(scale>snowDensity){
      break;
    }
    c+=snow(uv,scale*per);
  }
  //雪花
  snowColor=(vec3(c));
  if(depth.r<1.0){
    vec4 positionEC = czm_p_toEye(gl_FragCoord.xy, czm_unpackDepth(texture2D(depthTexture, v_textureCoordinates)));
    vec3 dx = dFdx(positionEC.xyz);
    vec3 dy = dFdy(positionEC.xyz);
    vec3 nor = normalize(cross(dx,dy));
    vec4 positionWC = normalize(czm_inverseView * positionEC);
    vec3 normalWC = normalize(czm_inverseViewRotation * nor);
    float dotNumWC = dot(positionWC.xyz,normalWC);
    //雪地
    if(dotNumWC<=0.3){
      bgColor = mix(color,vec4(1.0),alpha*0.3);
    }else{
      bgColor = mix(color,vec4(1.0),dotNumWC*alpha);
    }
  }
  gl_FragColor=mix(bgColor,vec4(snowColor,1.0),0.5);
}`
export default shader;

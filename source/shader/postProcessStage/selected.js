const shader = `
uniform sampler2D colorTexture;
varying vec2 v_textureCoordinates;
void main(){
  vec4 color=texture2D(colorTexture,v_textureCoordinates);
  if(czm_selected()){
    gl_FragColor=color;
  }else{
    gl_FragColor=vec4(0.0);
  }
}
`
export default shader;

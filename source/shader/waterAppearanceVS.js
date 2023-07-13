const vs = `
attribute vec3 position3DHigh;
attribute vec3 position3DLow;
attribute vec2 st;
attribute float batchId;
varying vec3 v_positionEC;
varying vec3 v_positionMC;
varying vec2 v_st;
void main(){
  vec4 position=czm_computePosition();
  v_positionEC=(czm_modelViewRelativeToEye*position).xyz;
  v_st=st;
  v_positionMC=position3DHigh+position3DLow;
  gl_Position=czm_modelViewProjectionRelativeToEye*position;
}
`
export default vs;

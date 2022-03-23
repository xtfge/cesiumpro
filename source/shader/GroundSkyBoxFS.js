const shader = 'uniform samplerCube u_cubeMap;\n\
  varying vec3 v_texCoord;\n\
  void main()\n\
  {\n\
  vec4 color = textureCube(u_cubeMap, normalize(v_texCoord));\n\
  gl_FragColor = vec4(czm_gammaCorrect(color).rgb, czm_morphTime);\n\
  }\n\
  ';

export default shader;

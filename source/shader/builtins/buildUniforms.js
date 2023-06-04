import czm_p_toEye from './toEye';
import czm_p_getDepth from './getDepth';
import czm_ellipsoid from './ellipsoid';
import czm_getWgs84EllipsoidEC from './getWgs84EllipsoidEC';
import czm_translucentPhong from './translucentPhong';
import czm_phong from './phong'
//必须以czm_开头
const buildins = {
  czm_p_toEye,
  czm_p_getDepth,
  czm_ellipsoid,
  czm_getWgs84EllipsoidEC,
  czm_translucentPhong,
  czm_phong
};

function buildShader() {
  for (var builtinName in buildins) {
    if (buildins.hasOwnProperty(builtinName)) {
      Cesium.ShaderSource._czmBuiltinsAndUniforms[builtinName] =
        buildins[builtinName];
    }
  }
}

(function() {
  buildShader()
})();
export default buildShader;

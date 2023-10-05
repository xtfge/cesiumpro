import overrideShaderProgram from './ShaderProgram.js'
import overrideScene from './Scene.js'
import overrideUniformState from './UniformState.js'
function overrideCesium() {
    overrideScene();
    // overrideShaderProgram();
    overrideUniformState();
    // overridePrimitive();
}
export default overrideCesium;
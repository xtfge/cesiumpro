import overrideShaderProgram from './ShaderProgram.js'
import overrideScene from './Scene.js'
import overridePrimitive from './Primitive'
function overrideCesium() {
    overrideScene();
    overrideShaderProgram();
    // overridePrimitive();
}
export default overrideCesium;
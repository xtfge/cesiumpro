function format(str) {
    const rows = str.split(';');
    const result = [];
    for(let row of rows) {
        const item = row.trim().split(/\s+/);
        result.push(item[1])
    }
    return result.join(', ')
}
const str = `import BoundingSphere from "../Core/BoundingSphere.js";
import buildModuleUrl from "../Core/buildModuleUrl.js";
import Cartesian3 from "../Core/Cartesian3.js";
import Cartographic from "../Core/Cartographic.js";
import Color from "../Core/Color.js";
import defaultValue from "../Core/defaultValue.js";
import defined from "../Core/defined.js";
import destroyObject from "../Core/destroyObject.js";
import DeveloperError from "../Core/DeveloperError.js";
import Ellipsoid from "../Core/Ellipsoid.js";
import EllipsoidTerrainProvider from "../Core/EllipsoidTerrainProvider.js";
import Event from "../Core/Event.js";
import IntersectionTests from "../Core/IntersectionTests.js";
import NearFarScalar from "../Core/NearFarScalar.js";
import Ray from "../Core/Ray.js";
import Rectangle from "../Core/Rectangle.js";
import Resource from "../Core/Resource.js";
import ShaderSource from "../Renderer/ShaderSource.js";
import Texture from "../Renderer/Texture.js";
import GlobeFS from "../Shaders/GlobeFS.js";
import GlobeVS from "../Shaders/GlobeVS.js";
import GroundAtmosphere from "../Shaders/GroundAtmosphere.js";
import when from "../ThirdParty/when.js";
import GlobeSurfaceShaderSet from "./GlobeSurfaceShaderSet.js";
import GlobeSurfaceTileProvider from "./GlobeSurfaceTileProvider.js";
import GlobeTranslucency from "./GlobeTranslucency.js";
import ImageryLayerCollection from "./ImageryLayerCollection.js";
import QuadtreePrimitive from "./QuadtreePrimitive.js";
import SceneMode from "./SceneMode.js";
import ShadowMode from "./ShadowMode.js";`
console.log(format(str))
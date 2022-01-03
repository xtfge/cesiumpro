import XYZLayer from "./XYZLayer.js";
import Url from '../core/Url.js'
/**
 * CesiumPro提供的默认图层，该图层为离线图层，可以在无互联网的环境下使用。
 * @exports createDefaultLayer
 * @returns {XYZLayer} 一个可以在离线环境使用的XYZLayer。
 */
function createDefaultLayer() {
    return new XYZLayer({
        url: Url.buildModuleUrl('assets/tiles/{z}/{x}/{y}.png')
    })
}
export default createDefaultLayer;
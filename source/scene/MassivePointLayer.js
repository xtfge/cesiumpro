import defined from '../core/defined.js'
import MassiveGraphicLayer from './MassiveGraphicLayer.js';
import defaultValue from '../core/defaultValue.js';
const {
    QuadtreeTileProvider,
    GeographicTilingScheme,
    when,
    Event,
    Cartographic,
    Color,
    Entity
} = Cesium;

class MassivePointLayer extends MassiveGraphicLayer {
    /**
     * 
     * @extends MassiveGraphicLayer
     * @param {*} options 
     */
    constructor(options = {}) {
        options.objects = defaultValue(options.objects, []);
        options.pixelSize = defaultValue(options.pixelSize, 5);
        options.color = defaultValue(options.color, Color.fromRandom);
        options.createGeometryFunction = function (object) {
            return new Entity({
                id: object.id,
                position: object.position,
                point: {
                    pixelSize: defaultValue(object.pixelSize, options.pixelSize),
                    color: defaultValue(object.color, options.color)
                }
            })
        }
        super(options)
    }
}
export default MassivePointLayer;
import defined from '../core/defined.js'
import MassiveEntityLayer from './MassiveEntityLayer.js';
import defaultValue from '../core/defaultValue.js';
const {
    QuadtreeTileProvider,
    GeographicTilingScheme,
    when,
    Event,
    Cartographic,
    Color,
    Entity,
    createGuid
} = Cesium;
function defaultCreateFn(options) {
    return function (object) {
        let id = createGuid()
        if (typeof object.id === 'string' || typeof object.id === 'number') {
            id = object.id;
        }
        const entityOptions = {
            id: id,
            position: object.position,
            point: {
                pixelSize: defaultValue(object.pixelSize, options.pixelSize),
                color: defaultValue(object.color, options.color)
            }
        }
        if (object.label) {
            entityOptions.label = {
                text: object.label
            }
        }
        return new Entity(entityOptions)
    }

}
class MassivePointLayer extends MassiveEntityLayer {
    /**
     * 创建大量点要素（Entity)
     * @extends MassiveEntityLayer
     * @param {MassivePointLayer.Options} options 选项
     * const objects = positions.map(_ => {
     *     i++
     *     return {
     *         id: Cesium.createGuid(),
     *         position:_,
     *         // color: Cesium.Color.fromRandom({alpha:1}),
     *         pixelSize: 5
     *     }
     * })
     *
     * const pointlayer = new CesiumPro.MassivePointLayer({
     *     objects: objects,
     *     color: Cesium.Color.GOLD,
     *     pixelSize: 5
     * })
     * viewer.massiveGraphicLayers.add(pointlayer)
     * 
     * @demo {@link examples/apps/index.html#/5.4.1mag-point|100万点加载示例}
     */
    constructor(options = {}) {
        options.objects = defaultValue(options.objects, []);
        options.pixelSize = defaultValue(options.pixelSize, 5);
        options.color = defaultValue(options.color, Color.fromRandom);
        options.createGeometryFunction = defaultValue(options.createGeometryFunction, defaultCreateFn(options))
        super(options)
    }
}
/**
* 创建大量点图层的选项
* @typedef Options
* @memberof MassivePointLayer
* @property {Array} objects 将义点的信息的集合
* @property {Number} pixelSize 点的大小
* @property {Cesium.Color} color 点的颜色
* @property {String} label 文字内容
* @property {Number} minLoadLevel 最小加载层级，瓦片层级小于该值时不会加载任何数据
*/
export default MassivePointLayer;
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
    Entity
} = Cesium;
function defaultCreateFn(options) {
    return function (object) {
        const entityOptions = {
            id: object.id,
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
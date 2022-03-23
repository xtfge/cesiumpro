import MassiveGraphicLayer from "./MassiveGraphicLayer.js";
const {
    AssociativeArray 
} = Cesium;
class MassiveGraphicLayerCollection{
    /**
     * 基于四叉树和聚合的LOD图层的集合。
     */
    constructor() {
        this._layers = new AssociativeArray();
    }
    get layer() {
        return this._layers;
    }
    get length() {
        return this._layers.length;
    }
    get values() {
        return this._layers.values;
    }
    /**
     * 根据id获取图层
     * @param {String} id 图层id
     * @returns {MassiveGraphicLayer}
     */
    get(id) {
        return this._layers.get(id);
    }
    /**
     * 添加一个图层
     * @param {MassiveGraphicLayer} layer 一个有效的Lod图层，该图层类必须继承MassiveGraphicLayer类。
     */
    add(layer) {
        if(layer instanceof MassiveGraphicLayer) {
            this._layers.set(layer.id, layer)
        }
    }
    /**
     * 判断集合中是否包含一个Lod图层
     * @param {MassiveGraphicLayer|String} layer 图层对象或图层id
     * @returns {Boolean} true表示包含
     */
    has(layer) {
        if(layer instanceof MassiveGraphicLayer) {
            return this._layers.contains(layer)
        } else if(typeof layer === 'string') {
            return this._layers.contains(this.get(layer))
        }
        return false;
    }
    /**
     * 从集合中删除图层
     * @param {MassiveGraphicLayer|String} layer 图层或图层id 
     * @returns {Boolean} true表示删除成功, false表示删除失败。
     */
    remove(layer) {
        if(layer instanceof MassiveGraphicLayer) {
            layer.destroy();
            return this._layers.remove(layer.id)
        } else if(typeof layer === 'string') {
            const layerObject = this._layers.get(layer);
            layerObject && layerObject.destroy();
            return this._layers.remove(layer)
        }
        return false;
    }
    /**
     * 删除所有图层
     */
    removeAll() {
        return this._layers.removeAll();
    }
}
export default MassiveGraphicLayerCollection;
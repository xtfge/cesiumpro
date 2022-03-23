import CesiumProError from "../core/CesiumProError.js";
import defaultValue from "../core/defaultValue.js";
import createGuid from '../core/createGuid.js';
import defined from "../core/defined.js";
class MassiveGraphicLayer {
    /**
     * 一个以LOD方式加载大量点（model, billboard, point, label）数据的基础类。
     * 该图层的点数据会类似瓦片数据的方式加载，即只加载当前窗口范围内的数据，在按
     * 瓦片分割数据前还会对数据做聚类处理，以解决低层级时加载大量数据的低性能问题。
     * @private
     * @see MassivePointLayer
     * @see MassiveBillboardLayer
     * @see MassiveModelLayer
     * @see MassiveEntityLayer
     */
    constructor(options = {}) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(options.objects)) {
            throw new CesiumProError('objects property must be provided.')
        }
        if (!Array.isArray(options.objects)) {
            throw new CesiumProError('objects property must be an array')
        }
        //>>includeEnd('debug')
        this._id = defaultValue(options.id, createGuid());
        this._maxClusterLevel = defaultValue(options.maxClusterLevel, 12);
        this._minLoadLevel = defaultValue(options.minLoadLevel, 12);
        this._objects = undefined;
    }
    /**
     * 图层的唯一标识
     * @type {String}
     * @readonly
     */
    get id() {
        return this._id;
    }
    /**
     * 最小加载层级，瓦片层级小于该值时将不加载任何数据
     */
    get minLoadLevel() {
        return this._minLoadLevel;
    }
    set minLoadLevel(val) {
        this._minLoadLevel = val;
    }
    /**
     * 创建点要素属性对象
     */
    get objects() {
        return this._objects;
    }
    set objects(val) {
        this._objects = val;
    }
    /**
     * 更新聚合状态，由于计算屏幕坐标代价较大，这里对每一层级的屏幕坐标只计算一次，
     * 这可能会造成一些误差。
     * @private
     * @param {Number} height 当前相机高度
     * @returns {Boolean} 更新前后数据是否发生变化。
     */
    updateCluster(height) {
        CesiumProError.throwInstantiationError()
    }
    /**
     * 所有要素创建前调用，一般不需要主动调用，每帧会自动调用一次
     * @param {Cesium.FrameState} framestate framestate
     */
    beginUpdate(framestate) {
        CesiumProError.throwInstantiationError()
    }
    /**
     * 所有要素创建完成后调用，一般不需要主动调用，每帧会自动调用一次
     * @param {Cesium.FrameState} framestate framestate
     */
    endUpdate(framestate) {
        CesiumProError.throwInstantiationError()
    }
    /**
     * 初始化图层
     * @private
     * @param {Cesium.FrameState} framestate 
     * @param {Cesium.Scene} scene 
     */
    initialize(framestate, scene) {
        CesiumProError.throwInstantiationError()
    }
    /**
     * 根据object创建点要素，一般不需要主动调用。
     * @param {Cesium.QuadtreeTile} tile 该要素所在的瓦片
     * @param {*} framestate framestate
     * @param {Object} object 描述点要素的属性信息
     * @returns {Object} 被创建的对象
     */
    createGeometry(tile, framestate, object) {
        CesiumProError.throwInstantiationError()
    }
    /**
     * 删除点要素，一般不需要主动调用。
     * @param {Cesium.FrameState} framestate 
     * @param {Entity} object 要删除的点要素
     * @returns {Boolean} 是否删除成功
     */
    removeGeometry(framestate, object) {
        
    }
    /**
     * 移除所有要素
     */
    removeAll() {
        CesiumProError.throwInstantiationError()
    }
    /**
     * 判断图层是否被销毁
     */
    isDestroyed() {
        return false;
    }
    destroy() {
        CesiumProError.throwInstantiationError()
    }
}
export default MassiveGraphicLayer;
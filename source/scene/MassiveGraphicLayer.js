import defaultValue from "../core/defaultValue.js";
import createGuid from '../core/createGuid.js';
import defined from "../core/defined.js";
import CesiumProError from "../core/CesiumProError.js";
import Cluster from '../core/Cluster.js'
const {
    AssociativeArray,
    destroyObject,
    CustomDataSource,
    Event
} = Cesium;
const defaultCreateGeometryFunction = function () { };
const ZEROLEVELHEIGHT = 31638318;
const cameraHeightForLevel = [ZEROLEVELHEIGHT]
for (let i = 1; i < 20; i++) {
    cameraHeightForLevel.push(cameraHeightForLevel[i - 1] / 2)
}
function getLevelByHeight(height) {
    let level = 0;
    for (let levelHeight of cameraHeightForLevel) {
        if (height > levelHeight) {
            break;
        }
        level++;
    }
    return level;
}
class MassiveGraphicLayer {
    /**
     * 一个以LOD方式加载大量点（model, billboard, point, label）数据的基础类。
     * 该图层的点数据会类似瓦片数据的方式加载，即只加载当前窗口范围内的数据，在按
     * 瓦片分割数据前还会对数据做聚类处理，以解决低层级时加载大量数据的低性能问题。
     * @private
     * @param {Object} options 具有以下属性
     * @param {Object} options.objects 定义点对象的属性
     * @param {Function} [options.createGeometryFunction] 创建点要素的函数
     * @param {Number} [options.maxClusterLevel = 16] 最大聚类层级， 层级大于maxClusterLevel时将不做聚类。
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
        // if(!options.scene) {
        //     throw new CesiumProError('property scene must be defined.')
        // }
        this._scene = options._scene;
        this._id = defaultValue(options.id, createGuid());
        this._removedValue = new AssociativeArray();
        this._createGeometryFunction = options.createGeometryFunction;
        this._data = options.objects;
        this._needReclass = true;
        this._changeEvent = new Event();
        this._maxClusterLevel = defaultValue(options.maxClusterLevel, 12);
        this._geometryCached = {};
        this._objectsCached = {};
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
     * 创建点要素属性对象
     */
    get objects() {
        return this._objects;
    }
    /**
     * 更新聚合状态，由于计算屏幕坐标代价较大，这里对每一层级的屏幕坐标只计算一次
     * 这可能会造成一些误差。
     * @param {Number} height 当前相机高度
     * @returns 
     */
    updateCluster(height) {
        const level = getLevelByHeight(height);
        const oldObjects = this._objects;
        this._objects = this._data;
        if (level > this._maxClusterLevel) {
            this._objects = this._data;
            this._needReclass = oldObjects !== this._objects
            return this._needReclass
        }
        if(this._objectsCached[level]) {
            this._objects = this._objectsCached[level];
            this._needReclass = oldObjects !== this._objects
            return this._needReclass;
        }
        if (this._cluster) {
            this._cluster.update();
            this._objects = this._cluster._clusterObjects;
            this._objectsCached[level] = JSON.parse(JSON.stringify(this._objects));
            this._needReclass = true;
            return true;
        }
    }
    /**
     * 在render前调用
     */
    beginUpdate() {
    }
    /**
     * render后调用
     */
    endUpdate() {
        this._needReclass = false;
    }
    /**
     * 初始化图层
     * @param {Cesium.FrameState} framestate 
     * @param {Cesium.Scene} scene 
     */
    initialize(framestate, scene) {
        if (!this._cluster) {
            this._cluster = new Cluster(scene, {
                objects: [...this._data]
            })
            this.updateCluster()
        }
        if (!this._dataSource) {
            this._scene = scene;
            this._dataSource = new CustomDataSource('massive-layer' + createGuid());
            this._scene.dataSources.add(this._dataSource);
        }
    }
    /**
     * 创建当前瓦片范围内的点要素
     * @param {Cesium.QuadtreeTile} tile 瓦片
     * @param {*} framestate 
     * @param {Object} object 描述点要素的属性
     * @returns 
     */
    createGeometry(tile, framestate, object) {
        const createGeometry = defaultValue(this._createGeometryFunction, defaultCreateGeometryFunction);
        const geometry = createGeometry(object);
        const keys = Object.keys(object);
        for (let key of keys) {
            if (key === 'position' 
            || key === 'id' 
            || key === "cartesian" 
            || key === "cartographic"
            || key === "__pixel") {
                continue;
            }
            geometry[key] = object[key];

        }
        this.add(geometry)
        return geometry;
    }
    /**
     * 删除点要素
     * @param {Cesium.FrameState} framestate 
     * @param {Entity} object 要删除的点要素
     * @returns 
     */
    removeGeometry(framestate, object) {
        if (!object) {
            return;
        }
        const removed = this._dataSource.entities.remove(object);
        destroyObject(object);
        return removed;
    }
    add(entity) {
        if (this._dataSource && entity) {
            this._dataSource.entities.add(entity);
        }
    }
    removeAll() {
        this._dataSource.entities.removeAll();
    }
    /**
     * 判断图层是否被销毁
     */
    isDestroyed() {
        return false;
    }
    /**
     * 销毁图层
     * @example
     * if(!layer.isDestroyed()) {
     *   layer.destroy()
     * }
     */
    destroy() {
        this._dataSource.removeAll();
        destroyObject(this);
    }
}
export default MassiveGraphicLayer;
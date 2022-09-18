import defaultValue from "../core/defaultValue.js";
import createGuid from '../core/createGuid.js';
import defined from "../core/defined.js";
import CesiumProError from "../core/CesiumProError.js";
import LonLat from "../core/LonLat.js";
import MassiveGraphicLayer from './MassiveGraphicLayer.js'
const {
    destroyObject,
    Event,
    Transforms
} = Cesium;
const defaultCreateGeometryFunction = function (object, options) {
    const modelOption = {}
    if (object.modelMatrix) {
        modelOption.modelMatrix = object.modelMatrix;
    } else if (object.position) {
        let cartesian = object.position;
        if (object.position instanceof LonLat) {
            cartesian = object.position.toCartesian();
        }
        if (!cartesian) {
            return;
        }
        modelOption.modelMatrix = Transforms.eastNorthUpToFixedFrame(cartesian)
        object.modelMatrix = modelOption.modelMatrix
    }
    modelOption.minimumPixelSize = defaultValue(object.minimumPixelSize, options.minimumPixelSize);
    modelOption.maximumScale = defaultValue(object.maximumScale, options.maximumScale);
    modelOption.scale = defaultValue(object.scale, options.scale);
    modelOption.allowPicking = defaultValue(object.allowPicking, options.allowPicking);
    modelOption.shadows = defaultValue(object.shadows, options.shadows);
    modelOption.id = object._id;
    modelOption.url = defaultValue(object.url, options.url)
    return Cesium.Model.fromGltf(modelOption)
};
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
class MassiveModelLayer extends MassiveGraphicLayer {
    /**
     * 海量模型(gltf/glb）加载。该图层会基于四叉树对数据进行分块，搂需加载，以优化性能。
     * @param {Object} options 具有以下属性
     * @param {Object} options.objects 定义点对象的属性
     * @param {Function} [options.createGeometryFunction] 创建点要素的函数
     * @param {Number} [options.minLoadLevel = 12] 最小加载层级， 瓦片层级小于minLoadLevel将不加载任何数据
     * 
     * @see MassivePointLayer
     * @see MassiveBillboardLayer
     * 
     * @example
     * const positions = Cesium.Cartesian3.fromDegreesArray([...])
     * let i = 0
     * const objects = positions.map(_ => {
     *     i++
     *     return {
     *         id: {name: 'model' + i}, // 自定义属性，该对象会在pick中返回
     *         position: _,
     *     }
     * })
     * const massiveModel = new CesiumPro.MassiveModelLayer({
     *     objects,
     *     url: '../data/models/Cesium_Air.glb',
     *     minimumPixelSize:64
     * })
     * viewer.massiveGraphicLayers.add(massiveModel)
     * @demo {@link examples/apps/index.html#/5.4.2massiveModel|50万模型加载示例}
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
        // 作为要素的唯一标识必须是字符串, Model的id是对象
        options.objects.forEach(_ => {
            _._id = _.id;
            delete _.id;
        })
        super(options)
        this._id = defaultValue(options.id, createGuid());
        this._createGeometryFunction = options.createGeometryFunction;
        this._data = options.objects;
        this._needReclass = true;
        this._changeEvent = new Event();
        this._maxClusterLevel = defaultValue(options.maxClusterLevel, 12);
        this._minLoadLevel = defaultValue(options.minLoadLevel, 12);
        this._geometryCached = {};
        this._objectsCached = {};
        this._options = options;
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
        return this._objects || this._data;
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
        const level = getLevelByHeight(height);
        const oldObjects = this._objects;
        if (level > this._maxClusterLevel) {
            this._objects = this._data;
            this._needReclass = oldObjects !== this._objects
            return Promise.resolve(this._needReclass)
        }
        if (this._objectsCached[level]) {
            this._objects = this._objectsCached[level];
            this._needReclass = oldObjects !== this._objects
            return Promise.resolve(this._needReclass)
        }
        if (this._cluster) {
            return new Promise((resolve, reject) => {
                this._cluster.update();
                this._objects = this._cluster._clusterObjects;
                this._objectsCached[level] = JSON.parse(JSON.stringify(this._objects));
                this._needReclass = true;
                resolve(true);
            });
        }
    }
    /**
     * 所有要素创建前调用，一般不需要主动调用，每帧会自动调用一次
     * @param {Cesium.FrameState} framestate framestate
     */
    beginUpdate(framestate) {
        const height = framestate.camera.positionCartographic.height;
        const level = getLevelByHeight(height);
        if (level < this._minLoadLevel) {
            this._objects = []
        } else {
            this._objects = this._data;
        }
    }
    /**
     * 所有要素创建完成后调用，一般不需要主动调用，每帧会自动调用一次
     * @param {Cesium.FrameState} framestate framestate
     */
    endUpdate(framestate) {
        const height = framestate.camera.positionCartographic.height;
        const level = getLevelByHeight(height);
        this._needReclass = false;
        return level < this._minLoadLevel;
    }
    /**
     * 初始化图层
     * @private
     * @param {Cesium.FrameState} framestate 
     * @param {Cesium.Scene} scene 
     */
    initialize(framestate, scene) {
        if (!this._collection) {
            this._scene = scene;
            const collection = new Cesium.PrimitiveCollection();
            scene.primitives.add(collection);
            this._collection = collection
        }
    }
    /**
     * 根据object创建点要素，一般不需要主动调用。
     * @param {Cesium.QuadtreeTile} tile 该要素所在的瓦片
     * @param {*} framestate framestate
     * @param {Object} object 描述点要素的属性信息
     * @returns {Object} 被创建的对象
     */
    createGeometry(tile, framestate, object) {
        if (tile.level < this._minLoadLevel) {
            return;
        }
        const createGeometry = defaultValue(this._createGeometryFunction, defaultCreateGeometryFunction);
        const geometry = createGeometry(object, this._options);
        this.add(geometry)
        return geometry;
    }
    /**
     * 删除点要素，一般不需要主动调用。
     * @param {Cesium.FrameState} framestate 
     * @param {Entity} object 要删除的点要素
     * @returns {Boolean} 是否删除成功
     */
    removeGeometry(framestate, object) {
        if (!object) {
            return;
        }
        const removed = this._collection.remove(object)
        // destroyObject(object);
        return removed;
    }
    add(primitive) {
        if (this._collection && primitive) {
            this._collection.add(primitive);
        }
    }
    /**
     * 移除所有要素
     */
    removeAll() {
        this._collection.removeAll();
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
        this._collection.removeAll();
        destroyObject(this);
    }
}
export default MassiveModelLayer;
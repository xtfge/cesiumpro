import defaultValue from "../core/defaultValue.js";
import createGuid from '../core/createGuid.js';
import defined from "../core/defined.js";
import CesiumProError from "../core/CesiumProError.js";
import MassiveGraphicLayer from "./MassiveGraphicLayer.js";
const {
    AssociativeArray,
    destroyObject,
    CustomDataSource,
    Event
} = Cesium;
const defaultCreateGeometryFunction = function () {return {} };
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
class MassiveEntityLayer extends MassiveGraphicLayer{
    /**
     * 一个以LOD方式加载大量点（model, billboard, point, label）数据的基础类。
     * 该图层的点数据会类似瓦片数据的方式加载，即只加载当前窗口范围内的数据，在按
     * 瓦片分割数据前还会对数据做聚类处理，以解决低层级时加载大量数据的低性能问题。
     * <p>
     * 但是，不得不说这是一个半成品，我的本意是想写一个加载大量点（point, level, billboard, model)
     * 数据的图层，该图层基于四叉树进行分层分片，按需创建点要素，但仅仅这样，图层在各个层级的细节
     * 相同，当相机非常高时，瓦片的范围特别大，每个瓦片内包含大量的点数据，这会造成严重的性能问题，
     * 因此我想通过聚合来解决这个问题，但是发现Cesium的聚类算法性能非常差，最终不得不放弃了这一
     * 优化思路，但是，如果你有需要，仍然可以使用聚合来解决低层级时的性能问题。
     * </p>
     * @param {Object} options 具有以下属性
     * @param {Object} options.objects 定义点对象的属性
     * @param {Function} [options.createGeometryFunction] 创建点要素的函数
     * @param {Number} [options.minLoadLevel = 12] 最小加载层级， 瓦片层级小于minLoadLevel将不加载任何数据
     * 
     * @see MassivePointLayer
     * @see MassiveBillboardLayer
     * @see MassiveModelLayer
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
     * 包含所有点要素的数据源
     * @type {Cesium.CustomDataSource}
     * @readonly
     */
    get dataSource() {
        return this._dataSource;
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
        if(level < this._minLoadLevel) {
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
        // if (!this._cluster) {
        //     this._cluster = new Cluster(scene, {
        //         objects: [...this._data]
        //     })
        //     this.updateCluster()
        // }
        if (!this._dataSource) {
            this._scene = scene;
            this._dataSource = new CustomDataSource('massive-layer' + createGuid());
            const ds = this._scene.dataSources.add(this._dataSource);

            // 太耗费性能
            // ds.then((dataSource) => {
            //     var pixelRange = 150;
            //     var minimumClusterSize = 3;
            //     var enabled = true;

            //     dataSource.clustering.enabled = enabled;
            //     dataSource.clustering.pixelRange = pixelRange;
            //     dataSource.clustering.minimumClusterSize = minimumClusterSize;

            //     var removeListener;

            //     var pinBuilder = new Cesium.PinBuilder();
            //     var pin50 = pinBuilder
            //         .fromText("50+", Cesium.Color.RED, 48)
            //         .toDataURL();
            //     var pin40 = pinBuilder
            //         .fromText("40+", Cesium.Color.ORANGE, 48)
            //         .toDataURL();
            //     var pin30 = pinBuilder
            //         .fromText("30+", Cesium.Color.YELLOW, 48)
            //         .toDataURL();
            //     var pin20 = pinBuilder
            //         .fromText("20+", Cesium.Color.GREEN, 48)
            //         .toDataURL();
            //     var pin10 = pinBuilder
            //         .fromText("10+", Cesium.Color.BLUE, 48)
            //         .toDataURL();

            //     var singleDigitPins = new Array(8);
            //     for (var i = 0; i < singleDigitPins.length; ++i) {
            //         singleDigitPins[i] = pinBuilder
            //             .fromText("" + (i + 2), Cesium.Color.VIOLET, 48)
            //             .toDataURL();
            //     }

            //     function customStyle() {
            //         if (Cesium.defined(removeListener)) {
            //             removeListener();
            //             removeListener = undefined;
            //         } else {
            //             removeListener = dataSource.clustering.clusterEvent.addEventListener(
            //                 function (clusteredEntities, cluster) {
            //                     cluster.label.show = false;
            //                     cluster.billboard.show = true;
            //                     cluster.billboard.id = cluster.label.id;
            //                     cluster.billboard.verticalOrigin =
            //                         Cesium.VerticalOrigin.BOTTOM;

            //                     if (clusteredEntities.length >= 50) {
            //                         cluster.billboard.image = pin50;
            //                     } else if (clusteredEntities.length >= 40) {
            //                         cluster.billboard.image = pin40;
            //                     } else if (clusteredEntities.length >= 30) {
            //                         cluster.billboard.image = pin30;
            //                     } else if (clusteredEntities.length >= 20) {
            //                         cluster.billboard.image = pin20;
            //                     } else if (clusteredEntities.length >= 10) {
            //                         cluster.billboard.image = pin10;
            //                     } else {
            //                         cluster.billboard.image =
            //                             singleDigitPins[clusteredEntities.length - 2];
            //                     }
            //                 }
            //             );
            //         }

            //         // force a re-cluster with the new styling
            //         var pixelRange = dataSource.clustering.pixelRange;
            //         dataSource.clustering.pixelRange = 0;
            //         dataSource.clustering.pixelRange = pixelRange;
            //     }
            //     customStyle()
            // })
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
        if(tile.level < this._minLoadLevel) {
            return;
        }
        const createGeometry = defaultValue(this._createGeometryFunction, defaultCreateGeometryFunction);
        const geometry = createGeometry(object, tile, framestate);
        const keys = Object.keys(object);
        for (let key of keys) {
            if (key === 'position'
                || key === 'id'
                || key === "cartesian"
                || key === "cartographic"
                || key === "label"
                || key === 'billboard'
                || key === "__pixel") {
                continue;
            }
            geometry[key] = object[key];

        }
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
        const removed = this._dataSource.entities.remove(object);
        destroyObject(object);
        return removed;
    }
    add(entity) {
        if (this._dataSource && entity) {
            this._dataSource.entities.add(entity);
        }
    }
    /**
     * 移除所有要素
     */
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
export default MassiveEntityLayer;
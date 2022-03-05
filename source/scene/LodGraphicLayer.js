import defaultValue from "../core/defaultValue.js";
import createGuid from '../core/createGuid.js';
import defined from "../core/defined.js";
import GeoPoint from "../core/GeoPoint.js";
const {
    AssociativeArray,
    Cartesian3,
    Cartographic,
    Rectangle,
    destroyObject,
    Event
} = Cesium;
function getKey(x, y, level) {
    return x + '-' + y + '-' + level;
}
function createGeometryFromObjects(layer, createGeometry, tileObjects) {
    for (let option of tileObjects) {
        if (option.hasRender) {
            continue;
        }
        option.hasRender = true;
        let geometry = layer._geometryCached.get(option.id);
        if (!geometry) {
            geometry = layer._removedGeometry.get(option.id);
            geometry && layer._removedGeometry.remove(option.id);
        }
        if (!geometry) {
            geometry = createGeometry(option);
        }
        layer._geometryCached.set(option.id, geometry);
    }
}
function addRemovedGeometry(geometryCached, removedGeometry, tile) {
    if (!(tile.data && tile.data.objects)) {
        return;
    }
    const objects = tile.data.objects;
    for (let object of objects) {
        const id = object.id;
        const geometry = geometryCached.get(id);
        if (geometry) {
            removedGeometry.set(id, geometry);
            geometryCached.remove(id);
        }
    }
}
const defaultRemoveGeometryFunction = function () { };
const defaultCreateGeometryFunction = function () { };
class RenderQueete{
    constructor() {
        this.values = new AssociativeArray();
        this.tiledValues = new AssociativeArray();
    }
    add(id, tile, object) {
        if(!(id && tile && object)) {
            return;
        }
        this.values.set(id, object);
        const key = getKey(tile.x, tile.y, tile.level);
        object._tileKey = key;
        const tiledObjects = this.tiledValues.get(key);
        if(tiledObjects) {
            tiledObjects.set(id, object)
        } else {
            const v = new AssociativeArray();
            v.set(id, object)
            this.tiledValues.set(key, v);
        }
        
    }
    has(id) {
        return this.values.contains(id);
    }
    getByTile(tile) {
        const key = getKey(tile.x, tile.y, tile.level);
        return this.tiledValues.get(key);
    }
    removeById(id) {
        const value = this.values.get(id);
        if(id) {
            this.values.remove(value);
            const tiledList = this.tiledValues.get(value._tileKey);
            tiledList.remove(id);
        }
    }
    removeAll() {
        this.values.removeAll();
        this.tiledValues.removeAll();
    }
    toArray() {
        return  this.values._array;
    }
}
class LodGraphicLayer {
    constructor(options = {}) {
        this._id = defaultValue(options.id, createGuid());
        this._removedValue = new AssociativeArray();
        this._createGeometryFunction = options.createGeometryFunction;
        this._removeGeometryFunction = options.removeGeometryFunction;
        this._objects = options.objects;
        this._tileCached = new AssociativeArray();
        this._renderCached = new AssociativeArray();
        this._geometryCached = new AssociativeArray();
        this._removedTile = new AssociativeArray();
        this._removedGeometry = new AssociativeArray();
        this._needReclass = false;
        this._changeEvent = new Event();
    }
    /**
     * 图层的唯一标识
     * @type {String}
     * @readonly
     */
    get id() {
        return this._id;
    }
    initialize(tileToRender) {
        // 把上一帧被渲染但这一帧不需要渲染的瓦片移动到removedTile，以便后续确定是否需要移除该瓦片对应的数据。
        this._objects.map(_ => _.hasRender = false);
        const keys = Object.keys(this._tileCached._hash);
        const renderKeys = tileToRender.map(_ => getKey(_.x, _.y, _.z));
        for (let key of keys) {
            if (!renderKeys.includes(key)) {
                const value = this._geometryCached.get(key)
                this._removedTile.set(key, value);
                const tileValue = this._tileCached.get(key);
                this._tileCached.remove(key);
                // 把被删除瓦片的数据移动到removedGeometry列表中
                addRemovedGeometry(this._geometryCached, this._removedGeometry, tileValue)
            }
        }
        if(tileToRender.length !== this._tileCached.length) {
            this._needReclass = true;
            return;
        }
        for(let k of renderKeys) {
            if(!this._tileCached.contains(k)) {
                this._needReclass = true;
                return;
            }
        }
        this._needReclass = false;
    }
    clearExpireGeometry() {
        const removeGeometryFunction = defaultValue(this._removeGeometryFunction, defaultRemoveGeometryFunction)
        // 在这里就可以删除removedGeometry列表中的对象了
        const values = this._removedGeometry.values;
        for(let value of values) {
            removeGeometryFunction(value);
        }
        this._removedGeometry.removeAll();
    }
    createGeometry(x, y, level, tile, needModify) {
        if (level < 8) {
            return
        }
        let tileObject = tile.data.objects;
        const key = getKey(x, y, level);
        const createGeometry = defaultValue(this._createGeometryFunction, defaultCreateGeometryFunction);
        const objects = this._objects;
        this._tileCached.set(key, tile);
        if (this._needReclass === false && tileObject) {
            createGeometryFromObjects(this, createGeometry, tileObject);
        }
        tileObject = tile.data.objects = [];
        for (let object of objects) {
            if (object.hasRender) {
                tileObject.push(object);
                this._renderCached.set(object.id, object);
                continue;
            }
            if (!defined(object.id)) {
                object.id = createGuid();
            }
            if (!(defined(object) && defined(object.position))) {
                return;
            }
            if (object.position instanceof Cartesian3) {
                object.cartesian = object.position;
            } else if (object.position instanceof Cartographic) {
                object.cartesian = Cartographic.toCartesian(object.position);
                object.catographic = object.position;
            } else if (object.position instanceof GeoPoint) {
                object.cartesian = object.position.toCartesian();
                object.cartographic = object.position.toCartoGraphic()
            } else {
                continue;
            }
            if (!object.cartographic) {
                object.cartographic = Cartographic.fromCartesian(object.cartesian);
            }
            if (Rectangle.contains(tile.rectangle, object.cartographic)) {
                tileObject.push(object);
                createGeometryFromObjects(this, createGeometry, [object]);
            }
        }
        tile.data.objects = tileObject;
    }
    add(option) {
        this._changeEvent.raiseEvent(option);
        this._needReclass = true;
    }
    tileWasRendered(tile) {
        const key = getKey(tile.x, tile.y, tile.level);
        return this._tileCached.contains(key);
    }
}
export default LodGraphicLayer;
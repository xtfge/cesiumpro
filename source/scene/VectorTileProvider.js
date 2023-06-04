import defined from '../core/defined.js';
import MassiveGraphicLayerCollection from './MassiveGraphicLayerCollection.js';
import createGuid from '../core/createGuid.js';
import LonLat from "../core/LonLat.js";
const {
    GeographicTilingScheme,
    GlobeSurfaceTileProvider,
    Event,
    TerrainState,
    RequestType,
    Request,
    Rectangle,
    QuadtreeTileLoadState,
    Visibility,
    AssociativeArray,
    Cartesian3,
    Cartographic,
    getTimestamp,
    RequestState
} = Cesium;

function requestGeometry(tile, framestate, terrainProvider) {
    let surfaceTile = tile.data;
    function success(terrainData) {
        surfaceTile.terrainData = terrainData;
        surfaceTile.terrainState = TerrainState.RECEIVED;
        surfaceTile.request = undefined;
    }

    function failure(error) {
        if (surfaceTile.request.state === RequestState.CANCELLED) {
            // Cancelled due to low priority - try again later.
            surfaceTile.terrainData = undefined;
            surfaceTile.terrainState = TerrainState.UNLOADED;
            surfaceTile.request = undefined;
            return;
        }
        surfaceTile.terrainState = TerrainState.FAILED;
        surfaceTile.request = undefined
    }
    function doRequest() {
        const request = new Request({
            throttle: false,
            throttleByServer: true,
            type: RequestType.TERRAIN,
        });
        surfaceTile.request = request;

        const requestPromise = terrainProvider.requestTileGeometry(
            tile.x,
            tile.y,
            tile.level,
            request
        );
        if (defined(requestPromise)) {
            surfaceTile.terrainState = TerrainState.RECEIVING;
            Promise.resolve(requestPromise)
                .then(function (terrainData) {
                  success(terrainData);
                })
                .catch(function (e) {
                  failure(e);
                });
        } else {
            // Deferred - try again later.
            surfaceTile.terrainState = TerrainState.UNLOADED;
            surfaceTile.request = undefined;
        }
    }
    doRequest();
}
const scratchCreateMeshOptions = {
    tilingScheme: undefined,
    x: 0,
    y: 0,
    level: 0,
    exaggeration: 1.0,
    exaggerationRelativeHeight: 0.0,
    throttle: true,
};
function transform(surfaceTile, frameState, terrainProvider, x, y, level) {
    const tilingScheme = terrainProvider.tilingScheme;

    const createMeshOptions = scratchCreateMeshOptions;
    createMeshOptions.tilingScheme = tilingScheme;
    createMeshOptions.x = x;
    createMeshOptions.y = y;
    createMeshOptions.level = level;
    createMeshOptions.exaggeration = frameState.terrainExaggeration;
    createMeshOptions.exaggerationRelativeHeight =
        frameState.terrainExaggerationRelativeHeight;
    createMeshOptions.throttle = true;

    const terrainData = surfaceTile.terrainData;
    const meshPromise = terrainData.createMesh(createMeshOptions);

    if (!defined(meshPromise)) {
        // Postponed.
        return;
    }

    surfaceTile.terrainState = TerrainState.TRANSFORMING;
    Promise.resolve(meshPromise)
    .then(function (mesh) {
      surfaceTile.mesh = mesh;
      surfaceTile.terrainState = TerrainState.TRANSFORMED;
    })
    .catch(function () {
      surfaceTile.terrainState = TerrainState.FAILED;
    });
}
function processStateMachine(tile, framestate, terrainProvider, layers, quadtree) {
    const surfaceTile = tile.data
    if (surfaceTile.terrainState === TerrainState.UNLOADED) {
        requestGeometry(tile, framestate, terrainProvider);
    }
    if (surfaceTile.terrainState === TerrainState.RECEIVED) {
        transform(
            surfaceTile,
            framestate,
            terrainProvider,
            tile.x,
            tile.y,
            tile.level
        );
    }
    if (surfaceTile.terrainState === TerrainState.TRANSFORMED) {
        tile.renderable = true;
    }
}
function getObjectByTile(objects, tile) {
    const tileObject = []
    for (let object of objects) {
        if (!defined(object)) {
            continue;
        }
        if (!defined(object.id)) {
            object.id = createGuid();
        }
        if (!(defined(object) && defined(object.position))) {
            continue;
        }
        if (object.position instanceof Cartesian3) {
            object.cartesian = object.position;
        } else if (object.position instanceof Cartographic) {
            object.cartesian = Cartographic.toCartesian(object.position);
            object.catographic = object.position;
        } else if (object.position instanceof LonLat) {
            object.cartesian = object.position.toCartesian();
            object.cartographic = object.position.toCartoGraphic()
        } else {
            object.cartesian = object.position;
        }
        if (!object.cartographic) {
            object.cartographic = Cartographic.fromCartesian(object.cartesian);
        }
        if (Rectangle.contains(tile.rectangle, object.cartographic)) {
            tileObject.push(object);
        }
    }
    return tileObject;
}
class QuadTile {
    constructor() {
        this.boundingVolumeSourceTile = undefined;
        this.terrainState = Cesium.TerrainState.UNLOADED;
        this.mesh = undefined;
        this.terrainData = undefined;
        this.objects = undefined;
        this._geometryOfTile = new AssociativeArray();
        this._objectsOfTile = new AssociativeArray();
        this._needRenderObjects = new AssociativeArray();

    }
    static processStateMachine(tile, frameState, terrainProvider, layers, quadtree) {
        QuadTile.initialize(tile, terrainProvider);
        if (tile.state === QuadtreeTileLoadState.LOADING) {
            processStateMachine(
                tile,
                frameState,
                terrainProvider,
                layers,
                quadtree,
            );
        }
    }
    static initialize(tile, terrainProvider) {
        let surfaceTile = tile.data;
        if (!defined(surfaceTile)) {
            surfaceTile = tile.data = new QuadTile();
        }

        if (tile.state === QuadtreeTileLoadState.START) {
            tile.state = QuadtreeTileLoadState.LOADING;
        }
    }
}
function createGeometry(provider, layer, tile, framestate, objects) {
    let list = tile.data._geometryOfTile.get(layer.id);
    let hasRenderCached = provider._hasRenderCached.get(layer.id);
    if (!hasRenderCached) {
        hasRenderCached = {};
        provider._hasRenderCached.set(layer.id, hasRenderCached);
    }
    if (!list) {
        list = [];
    }
    for (let object of objects) {
        if (hasRenderCached[object.id]) {
            return;
        }
        const geometry = layer.createGeometry(tile, framestate, object);
        if (!geometry) {
            continue;
        }
        hasRenderCached[object.id] = true;
        list.push({ id: object.id, geometry });
    }
    tile.data._geometryOfTile.set(layer.id, list);
}
function removeGeometry(provider, layer, tile, framestate, geometryList) {
    const hasRenderCached = provider._hasRenderCached.get(layer.id);
    for (let geometryObject of geometryList) {
        const { id, geometry } = geometryObject;
        layer.removeGeometry(framestate, geometry);
        delete hasRenderCached[id]
    }
    tile.data._geometryOfTile.remove(layer.id);

}
class VectorTileProvider {
    constructor(options = {}) {
        // super(options)
        this._ready = true;
        this._scene = options.scene;
        this._tilingSceheme = new GeographicTilingScheme();
        this._readyPromise = Promise.resolve(true);
        this._errorEvent = new Event();
        this._terrainProvider = options.terrainProvider;
        this._show = true;
        this.cartographicLimitRectangle = Rectangle.clone(Rectangle.MAX_VALUE);
        this.tree = undefined;
        this._layers = new MassiveGraphicLayerCollection();
        this._lastTilesToRender = [];
        this._hasRenderCached = new AssociativeArray();
        this._tilesCahced = []
        // this._removeEventListener = this._scene.camera.changed.addEventListener(() => {
        //     const layers = this._layers.values;
        //     for (let layer of layers) {
        //         const cluster = layer.updateCluster(this._scene.camera.positionCartographic.height);
        //         cluster.then(needClear => {
        //             needClear && (this.clearTile(layer.id), layer.removeAll());
        //         })                
        //     }
        // })
    }
    get terrainProvider() {
        return this._terrainProvider;
    }
    get show() {
        return this._show;
    }
    set show(val) {
        this._show = val;
    }
    get ready() {
        return this._ready;
    }
    get tilingScheme() {
        return this._tilingSceheme;
    }
    get readyPromise() {
        return this._readyPromise;
    }
    get quadtree() {
        return this._quadtree;
    }
    set quadtree(val) {
        if (defined(val)) {
            this._quadtree = val;
        }
    }
    /**
     *QuadtreePrimitive.beginFrame中调用该方法
     * @param {Cesium.FrameState} framestate 
     */
    initialize(framestate) {
        for (let layer of this._layers.values) {
            layer.initialize(framestate, this._scene);
        }
    }
    /**
     * QuadtreePrimitive.render中会调用该方法，此时还不知道本此渲染需要用到哪些瓦片。
     * @param {Cesium.FrameState}} framestate 
     */
    beginUpdate(framestate) {
        const layers = this._layers.values;
        for (let layer of layers) {
            layer.beginUpdate(framestate)
        }
        this._frameNumber++;
    }
    /**
     * QuadtreePrimitive.render中会调用该方法，在beginUpdate之后
     * @param {*} tile 
     * @param {*} framestate 
     */
    showTileThisFrame(tile, framestate) {
        const surfaceData = tile.data;
        if (!defined(surfaceData)) {
            return;
        }
        if (!this._tilesCahced.includes(tile)) {
            this._tilesCahced.push(tile)
        }
        const layers = this._layers.values;
        const time = getTimestamp();
        const loadQueueTimeSlice = 5.0;
        for (let layer of layers) {
            if (!(defined(layer.objects) && Array.isArray(layer.objects))) {
                continue;
            }
            // if(getTimestamp() < time + loadQueueTimeSlice) {
            //     break;
            // }
            const id = layer.id;
            const geometryOfTile = surfaceData._geometryOfTile.get(id);
            if (geometryOfTile && !layer._needReclass) {
                return;
            }
            let tileObjects = surfaceData._objectsOfTile.get(id);
            if (!defined(tileObjects) || layer._needReclass) {
                tileObjects = getObjectByTile(layer.objects, tile);
                surfaceData._objectsOfTile.set(id, tileObjects);
            }
            createGeometry(this, layer, tile, framestate, tileObjects);
        }
    }
    /**
     * QuadtreePrimitive.render中会调用该方法, 在showTileThisFrame之后。
     */
    endUpdate(framestate) {
        const quadtree = this._quadtree;
        if (!quadtree) {
            return;
        }
        const lastTilesToRender = this._lastTilesToRender;
        const tilesToRender = quadtree._tilesToRender;
        const layers = this._layers.values;
        for (let tile of lastTilesToRender) {
            if (tilesToRender.includes(tile)) {
                continue;
            }
            for (let layer of layers) {
                const geometryList = tile.data._geometryOfTile.get(layer.id) || [];
                removeGeometry(this, layer, tile, framestate, geometryList)
            }
        }
        for (let layer of layers) {
            const needClear = layer.endUpdate(framestate);
            if(needClear) {
                tilesToRender.forEach(tile => {
                    const geoList = tile.data._geometryOfTile.get(layer.id) || [];
                    removeGeometry(this, layer, tile, framestate, geoList)
                })
            }
        }
        this._lastTilesToRender = [...tilesToRender];
    }
    /**
     * 加载瓦片数据，QuadtreePrimitive的endFrame中会调用该函数。
     * @param {Cesium.FrameState} framestate 
     * @param {Cesium.QuadTile} tile 瓦片信息
     */
    loadTile(framestate, tile) {
        if (!this.terrainProvider.ready) {
            return;
        }
        let terrainStateBefore;
        let terrainOnly = true;
        if (tile.data) {
            terrainStateBefore = tile.data.terrainState
            terrainOnly = tile.data.boundingVolumeSourceTile !== tile
        }
        QuadTile.processStateMachine(tile, framestate, this.terrainProvider, this._layers, this.quadtree)
        const surfaceTile = tile.data;
        if (terrainOnly && terrainStateBefore !== tile.data.terrainState) {
            if (
                this.computeTileVisibility(tile, framestate, this.quadtree.occluders) !==
                Visibility.NONE &&
                surfaceTile.boundingVolumeSourceTile === tile
            ) {
                QuadTile.processStateMachine(tile, framestate, this.terrainProvider, this._layers, this.quadtree);
            }
        }
    }
    getLevelMaximumGeometricError(level) {
        return this._terrainProvider.getLevelMaximumGeometricError(level);
    }
    canRefine(tile) {
        return GlobeSurfaceTileProvider.prototype.canRefine.call(this, tile);
    }
    computeTileVisibility(tile, frameState, occluders) {
        if (!defined(tile.data)) {
            tile.data = new QuadTile();
        }
        return GlobeSurfaceTileProvider.prototype.computeTileVisibility.call(this, tile, frameState, occluders)
    }
    computeDistanceToTile(tile, framestate) {
        if (!tile.data) {
            tile.data = new QuadTile();
        }
        return GlobeSurfaceTileProvider.prototype.computeDistanceToTile.call(this, tile, framestate)
    }
    clearTile(id) {
        const tiles = this._tilesCahced;
        for (let tile of tiles) {
            tile.data._geometryOfTile.remove(id);
            tile.data._objectsOfTile.remove(id);
        }
        this._hasRenderCached.remove(id)
    }
    isDestroyed() {
        return false;
    }
    destroy() {
        this._removeEventListener();
        const layers = this._layers.values;
        for (let layer of layers) {
            layer.destroy();
        }
    }
    computeTileLoadPriority(tile, frameState) {
        return GlobeSurfaceTileProvider.prototype.computeTileLoadPriority(tile, frameState)
    }
    _onLayerAdded(layer, index) {

    }
    _onLayerRemoved(layer, index) {

    }
    _onLayerShownOrHidden(
        layer,
        index,
        show
    ) {
        if (show) {
            this._onLayerAdded(layer, index);
        } else {
            this._onLayerRemoved(layer, index);
        }
    }
}
export default VectorTileProvider;
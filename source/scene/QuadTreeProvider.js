import defined from '../core/defined.js';
import LodGraphicLayerCollection from './LodGraphicLayerCollection.js';
const {
    GeographicTilingScheme,
    GlobeSurfaceTileProvider,
    when,
    Event,
    GlobeSurfaceTile,
    TerrainState,
    RequestType,
    Request,
    Rectangle,
    QuadtreeTileLoadState,
    Visibility,
    AssociativeArray
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
            when(requestPromise, success, failure);
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

    when(
        meshPromise,
        function (mesh) {
            surfaceTile.mesh = mesh;
            surfaceTile.terrainState = TerrainState.TRANSFORMED;
        },
        function () {
            surfaceTile.terrainState = TerrainState.FAILED;
        }
    );
}
function processTerrainStateMachine(tile, framestate, terrainProvider, layers, quadtree) {
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
        processLayer(layers.values, quadtree);
    }
}
function processLayer(layers, quadtree) {
    const tiles = quadtree._tilesToRender;// [...quadtree._tileLoadQueueHigh, ...quadtree._tileLoadQueueMedium];
    for(let layer of layers) {
        layer.initialize(tiles)
        for(let tile of tiles) {
            const hasRender = layer.tileWasRendered(tile);
            // 已经渲染的就不要再渲染了。
            (!hasRender) && layer.createGeometry(tile.x, tile.y ,tile.level, tile)
        }
        layer.clearExpireGeometry();
    }
}
class QuadTile {
    constructor() {
        this.boundingVolumeSourceTile = undefined;
        this.terrainState = Cesium.TerrainState.UNLOADED;
        this.mesh = undefined;
        this.terrainData = undefined;
        this.objects = undefined;

    }
    static processStateMachine(tile, frameState, terrainProvider, layers, quadtree) {
        QuadTile.initialize(tile, terrainProvider);
        if (tile.state === QuadtreeTileLoadState.LOADING) {
            processTerrainStateMachine(
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
class QuadTreeProvider {
    constructor(options = {}) {
        // super(options)
        this._ready = true;
        this._tilingSceheme = new GeographicTilingScheme();
        this._readyPromise = when.defer();
        this._readyPromise.resolve(true);
        this._errorEvent = new Event();
        this._terrainProvider = options.terrainProvider;
        this._show = true;
        this._createGeometry = options.createGeometry;
        this.cartographicLimitRectangle = Rectangle.clone(Rectangle.MAX_VALUE);
        this.tree = undefined;
        this._layers = new LodGraphicLayerCollection();
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
     *QuadtreePrimitive. beginFrame中调用该方法
     * @param {Cesium.FrameState} framestate 
     */
    initialize(framestate) {
    }
    /**
     * QuadtreePrimitive.render中会调用该方法
     * @param {Cesium.FrameState}} framestate 
     */
    beginUpdate(framestate) {
    }
    /**
     * QuadtreePrimitive.render中会调用该方法,该方法调用前需要渲染的瓦片已准备好。
     */
    endUpdate(framestate) {

    }
    /**
     * 加载瓦片数据，QuadtreePrimitive的endFrame中会调用该函数。
     * @param {Cesium.FrameState} framestate 
     * @param {Cesium.QuadTile} tile 瓦片信息
     */
    loadTile(framestate, tile) {
        let terrainStateBefore;
        let terrainOnly = true;
        if (tile.data) {
            terrainStateBefore = tile.data.terrainState
            terrainOnly = tile.data.boundingVolumeSourceTile !== tile
        }
        QuadTile.processStateMachine(tile, framestate, this.terrainProvider, this._layers, this.quadtree)
        let surfaceTile = tile.data;
        if (terrainOnly && terrainStateBefore !== tile.data.terrainState) {
            if (
                this.computeTileVisibility(tile, framestate, this.quadtree.occluders) !==
                Visibility.NONE &&
                surfaceTile.boundingVolumeSourceTile === tile
            ) {
                terrainOnly = false;
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
    showTileThisFrame(){}
    isDestroyed() {
        return false;
    }
    destroy() {
        this._tileProvider && this._tileProvider.destroy();
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
export default QuadTreeProvider;
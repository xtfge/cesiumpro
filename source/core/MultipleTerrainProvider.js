import CesiumProError from "./CesiumProError.js";
import defaultValue from "./defaultValue.js";
import defined from "./defined.js";
import Event from './Event.js'
import CesiumProTerrainProvider from './CesiumProTerrainProvider.js'
const {
    CesiumTerrainProvider,
    TerrainProvider,
    Resource,
    CustomDataSource,
    Cartesian3,
    Entity,
    Color,
    Rectangle
} = Cesium;
function createBoundingRect(provider) {
    let positions = []
    const bounding = [provider.bounds.west, provider.bounds.south, provider.bounds.east, provider.bounds.north];
    if (provider.projection.toUpperCase() === 'EPSG:4326') {
        positions = [
            bounding[0], bounding[1],
            bounding[0], bounding[3],
            bounding[2], bounding[3],
            bounding[2], bounding[1],
            bounding[0], bounding[1]
        ]
    } else {
        // todo 
    }
    return new Entity({
        polyline: {
            positions: Cartesian3.fromRadiansArray(positions),
            material: Color.fromRandom({ alpha: 1 }),
            width: 3,
            clampToGround: true
        }
    })
}
function bindBounding(provider, url) {
    const resource = Resource.createIfNeeded(url);
    resource.appendForwardSlash();
    const layerJsonResource = resource.getDerivedResource({
        url: "layer.json",
    });
    return layerJsonResource.fetchJson()
    .then((data) => {
        provider.projection = data.projection;
        provider.bounds = Rectangle.fromDegrees(...data.valid_bounds);
    })
}
class MultipleTerrainProvider {
    /**
     * 为场景添加多个地形数据。
     * todo: 目前两个地形相接的的一行瓦片数据丢失。
     * @param {MultipleTerrainProvider.TerrainList} terrainList 地形列表
     * @param {Object} options 具有以下属性
     * @param {Boolean} [options.requestVertexNormals = false] 是否请求法线数据
     * @param {Boolean} [options.requestWaterMask = false] 是否请求水面数据
     * @param {Boolean} [options.requestMetadata = true] 是否请求元数据
     * @param {Cesium.Ellipsoid} [options.ellipsoid] 椭球体
     * @param {String|Cesium.Credit} [options.credit] 信用信息
     * @example
     * const terrain = new CesiumPro.MultipleTerrainProvider([
     *         {
     *             url: '../data/terrain/terrain-left',
     *             zIndex:3
     *         },
     *         {
     *             url: '../data/terrain/terrain-right',
     *             zIndex:2
     *         }
     *     ])
     * terrain.readyPromise.then(() => {
     *     terrain.createBoundingRectangle(viewer);
     * })
     * viewer.terrain = terrain;
     * 
     *  @demo {@link examples/apps/index.html#/5.4.1mag-point|多地形加载示例}
     */
    constructor(terrainList, options = {}) {
        this._heightmapWidth = 65;
        this._heightmapStructure = undefined;
        this._hasWaterMask = false;
        this._hasVertexNormals = false;
        this._ellipsoid = options.ellipsoid;
        this._requestVertexNormals = defaultValue(options.requestVertexNormals, false);
        this._requestWaterMask = defaultValue(options.requestWaterMask, false);
        this._requestMetadata = defaultValue(options.requestMetadata, true);
        this._errorEvent = new Event();

        this._terrainProviders = []
        const boundPromise = []
        for (let terrain of terrainList) {
            terrain.requestVertexNormals = terrain.requestVertexNormals || options.requestVertexNormals;
            terrain.requestWaterMask = terrain.requestWaterMask || options.requestWaterMask;
            terrain.requestMetadata = terrain.requestMetadata || options.requestMetadata;
            const provider = new CesiumProTerrainProvider(terrain);
            provider.zIndex = terrain.zIndex || -1;
            this._terrainProviders.push(provider)
            boundPromise.push(bindBounding(provider, terrain.url));
        }
        this._ready = false;
        this._readyPromise = new Promise((resolve) => {
            Promise.all([...this._terrainProviders.map(_ => _.readyPromise), ...boundPromise]).then((pv) => {
                this._ready = true;
                resolve(true);
                this._tilingScheme = this._terrainProviders[0]._tilingScheme;
                this._levelZeroMaximumGeometricError = TerrainProvider.getEstimatedLevelZeroGeometricErrorForAHeightmap(
                    this._tilingScheme.ellipsoid,
                    this._heightmapWidth,
                    this._tilingScheme.getNumberOfXTilesAtLevel(0)
                );
            })
        })
        this._terrainList = terrainList;

        // 所有地形准备完成就准备完成

        this._validProvider = undefined;
    }
    get errorEvent() {
        return this._errorEvent;
    }
    get tilingScheme() {
        return this._tilingScheme;
    }
    get ready() {
        return this._ready;
    }
    get readyPromise() {
        return this._readyPromise;
    }
    /**
     * 创建地形的边界矩形，用于调试
     * @param {Viewer} viewer Viewer对象
     * @returns {Function} 用于删除边界矩形的回调函数
     */
    createBoundingRectangle(viewer) {
        const debugDataSource = new CustomDataSource('multiple-terrain-provider');
        for (let provider of this._terrainProviders) {
            debugDataSource.entities.add(createBoundingRect(provider))
        }
        viewer.addLayer(debugDataSource);
        return function () {
            const source = viewer.dataSources.getByName('multiple-terrain-provider');
            viewer.dataSources.remove(source[0])
        }

    }
    getLevelMaximumGeometricError(level) {
        if (this._validProvider) {
            return this._validProvider.getLevelMaximumGeometricError(level);
        }
        return this._levelZeroMaximumGeometricError / (1 << level);;
    }
    /**
     * 判断当前瓦片是否存在有效地形数据
     * @param {*} x 
     * @param {*} y 
     * @param {*} level 
     * @returns {Boolean} 是否存在有效地形
     */
    getTileDataAvailable(x, y, level) {
        const providers = this._terrainProviders.filter(_ => {
            let valid = _.getTileDataAvailable(x, y, level);
            return valid;
            // if(!valid) {
            //     return false;
            // }
            // const rect = _.tilingScheme.tileXYToRectangle(x, y, level);
            // const intersection = Rectangle.intersection(rect, _.bounds);
            // return !!intersection;
        });
        const sorted = providers.sort((a, b) => b.zIndex - a.zIndex);
        this._validProvider = sorted[0];
        if (this._validProvider) {
            return true;
        }
        return false;
    }
    /**
     * 请求地形数据
     * @param {*} x 
     * @param {*} y 
     * @param {*} level 
     * @param {*} request 
     * @returns {Promise}
     */
    requestTileGeometry(x, y, level, request) {
        for (let provider of this._terrainProviders) {
            if (provider !== this._validProvider) {
                if (provider.getTileDataAvailable(x, y, level)) {
                    provider.requestTileGeometry(x, y, level);
                }
            }
        }
        if (this._validProvider) {
            return this._validProvider.requestTileGeometry(x, y, level);
        }
    }
}
/**
 * @typedef {Object} MultipleTerrainProvider.TerrainList
 *
 * 定义地形列表
 * @property {String} url 地表数据的url
 * @property {Number} [zIndex] 地形层级，在多个地形重叠的位置，将使用层级最高的地形
 * @property {Boolean} [requestVertexNormals = false] 是否请求法线数据
 * @property {Boolean} [requestWaterMask = false] 是否请求水面数据
 * @property {Boolean} [requestMetadata = true] 是否请求元数据
 * @property {Cesium.Ellipsoid} [ellipsoid] 椭球体
 * @property {String|Cesium.Credit} [credit] 信用信息
 */
export default MultipleTerrainProvider;
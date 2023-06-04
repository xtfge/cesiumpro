const {WebMapTileServiceImageryProvider} = Cesium;
class WMTSLayer extends WebMapTileServiceImageryProvider {
    /**
     * 创建一个从WMTS服务请求数据的图层。
     * TODO： 从capability 创建图层
     * 
     * @param {Object} options 具有以下属性
     * @param {Resource|String} options.url WMTS服务GetTile需要的URL或着tile-URL模板. 如果是tile-URL模板m该URL应该包含以下关键字：
     * <ul>
     *  <li><code>{style}</code>: 样式</li>
     *  <li><code>{TileMatrixSet}</code>: tile数据集</li>
     *  <li><code>{TileMatrix}</code>:代表瓦片的级别</li>
     *  <li><code>{TileRow}</code>: 瓦片行号</li>
     *  <li><code>{TileCol}</code>: 瓦片列号</li>
     *  <li><code>{s}</code>: 子域名</li>
     * </ul>
     * @extends Cesium.WebMapTileServiceImageryProvider
     * @param {String} [options.format='image/jpeg'] 瓦片格式(MIME type)。
     * @param {String} options.layer 服务所提供的图层名.
     * @param {String} options.style 样式名.
     * @param {String} options.tileMatrixSetID 用于 WMTS 请求的 TileMatrixSet 的标识符。
     * @param {Array} [options.tileMatrixLabels] TileMatrix 中用于 WMTS 请求的标识符列表。
     * @param {Clock} [options.clock] 在确定时间维度的值时使用的 Clock 实例。
     * @param {TimeIntervalCollection} [options.times] TimeIntervalCollection 其data属性是一个包含时间动态维度及其值的对象。
     * @param {Object} [options.dimensions] 包含静态尺寸及其值的对象。
     * @param {Number} [options.tileWidth=256] 瓦片宽度。
     * @param {Number} [options.tileHeight=256] 瓦片高度。
     * @param {TilingScheme} [options.tilingScheme] 坐标系
     * @param {Rectangle} [options.rectangle=Cesium.Rectangle.MAX_VALUE] 该地图的覆盖范围。
     * @param {Number} [options.minimumLevel=0] 最小级别。
     * @param {Number} [options.maximumLevel] 最大级别。
     * @param {Credit|String} [options.credit] 版权信息
     * @param {String|String[]} [options.subdomains='abc'] {s}中可用的子域名。
     *
     
     *
     * Provides tiled imagery served by {@link http://www.opengeospatial.org/standards/wmts|WMTS 1.0.0} compliant servers.
     * This provider supports HTTP KVP-encoded and RESTful GetTile requests, but does not yet support the SOAP encoding.
     *
     * @example
     * // Example 1. USGS shaded relief tiles (KVP)
     * var shadedRelief1 = new CesiumPro.WMTSLayer({
     *     url : 'http://basemap.nationalmap.gov/arcgis/rest/services/USGSShadedReliefOnly/MapServer/WMTS',
     *     layer : 'USGSShadedReliefOnly',
     *     style : 'default',
     *     format : 'image/jpeg',
     *     tileMatrixSetID : 'default028mm',
     *     // tileMatrixLabels : ['default028mm:0', 'default028mm:1', 'default028mm:2' ...],
     *     maximumLevel: 19,
     *     credit : new Cesium.Credit('U. S. Geological Survey')
     * });
     * viewer.imageryLayers.addImageryProvider(shadedRelief1);
     *
     * @example
     * // Example 2. USGS shaded relief tiles (RESTful)
     * var shadedRelief2 = new CesiumPro.WMTSLayer({
     *     url : 'http://basemap.nationalmap.gov/arcgis/rest/services/USGSShadedReliefOnly/MapServer/WMTS/tile/1.0.0/USGSShadedReliefOnly/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg',
     *     layer : 'USGSShadedReliefOnly',
     *     style : 'default',
     *     format : 'image/jpeg',
     *     tileMatrixSetID : 'default028mm',
     *     maximumLevel: 19,
     *     credit : new Cesium.Credit('U. S. Geological Survey')
     * });
     * viewer.addLayer(shadedRelief2);
     *
     * @example
     * // Example 3. NASA time dynamic weather data (RESTful)
     * var times = Cesium.TimeIntervalCollection.fromIso8601({
     *     iso8601: '2015-07-30/2017-06-16/P1D',
     *     dataCallback: function dataCallback(interval, index) {
     *         return {
     *             Time: Cesium.JulianDate.toIso8601(interval.start)
     *         };
     *     }
     * });
     * var weather = new CesiumPro.WMTSLayer({
     *     url : 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/AMSR2_Snow_Water_Equivalent/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png',
     *     layer : 'AMSR2_Snow_Water_Equivalent',
     *     style : 'default',
     *     tileMatrixSetID : '2km',
     *     maximumLevel : 5,
     *     format : 'image/png',
     *     clock: clock,
     *     times: times,
     *     credit : new Cesium.Credit('NASA Global Imagery Browse Services for EOSDIS')
     * });
     * viewer.addLayer(weather);
     * const geoserverWMTS = new WMTSLayer({
     *       url: 'http://localhost:8080/geoserver/gwc/service/wmts',
     *       layer: 'topp:states',
     *       format: 'image/png',
     *       tileMatrixSetID: 'EPSG:4326',
     *       tileMatrixLabels: ['EPSG:4326:0','EPSG:4326:1','EPSG:4326:2', 'EPSG:4326:3', 'EPSG:4326:4'],
     *       style: '',
     *       tileWidth:700,
     *       tileHeight:300,
     *       tilingScheme:proj.get('EPSG:4326')
     * })
     * viewer.addLayer(geoserverWMTS)
     */
    constructor(options = {}) {
        super(options)
    }
    /**
     * 获取或设置一个包含静态维度及其值的对象。
     * @type {Object}
     */
    get dimensions() {
        return super.dimensions;
    }
    set dimensions(val) {
        super.dimensions = val;
    }
    /**
     * 可以请求的最小瓦片级别
     * @readonly
     * @type {Number}
     */
    get minimumLevel() {
        return super.minimumLevel;
    }
    /**
     * 可以请求的最大详细级别
     * @type {Number}
     * @readonly
     */
    get maximumLevel() {
        return super.maximumLevel;
    }
    /**
     * 获取影像错误时触发的事件
     * @type {Event}
     * @readonly
     */
    get errorEvent() {
        return super.errorEvent;
    }
    /**
     * 获取一个值，该值指示图层是否已准备好使用。
     * @readonly
     * @type {Boolean}
     */
     get ready() {
        return super.ready;
    }
    /**
     * 获取一个Promise，该图层准备好时将resolve
     * @readonly
     * @type {Promise<Boolean>}
     */
    get readyPromise() {
        return super.readyPromise;
    }
    /**
     * 图层的坐标系
     * @type {Cesium.TilingScheme}
     * @readonly
     */
    get tilingScheme() {
        return super.tilingScheme;
    }
    /**
     * 图层的范围
     * @type {Cesium.Rectangle}
     * @readonly
     */
     get rectangle() {
        return super.rectangle;
    }
    /**
     * 图层是否允许被pick
     * @type {Boolean}
     * @default true
     */
     get enablePickFeatures() {
        return this._tileProvider.enablePickFeatures;
    }
    set enablePickFeatures(val) {
        this._tileProvider.enablePickFeatures = val;
    }
    /**
     * 确定哪些要素（如果有）位于图块内的给定经度和纬度。在{@link Cesium.ImageryProvider#ready}返回 true之前不应调用此函数。
     * 在数据图层ready之前，该函数不能被调用
     *
     * @param {Number} x 瓦片的x坐标。
     * @param {Number} y 瓦片的y坐标。
     * @param {Number} level 瓦片的层级。
     * @param {Number} longitude 选择要素的经度。
     * @param {Number} latitude  选择要素的纬度
     * @return {Promise.<Cesium.ImageryLayerFeatureInfo[]>|undefined} 
     */
    pickFeatures(x, y, level, longitude, latitude) {
        return super.pickFeatures(x, y, level, longitude, latitude);
    }
    /**
     * 请求指定瓦片
     * @param {Number} x 瓦片x坐标
     * @param {Number} y 瓦片y坐标
     * @param {Number} level 瓦片级别
     * @param {Cesium.Request} [request]
     * @returns {Promise.<HTMLImageElement|HTMLCanvasElement>|undefined} 如果瓦片解析成功，返回一个异步Promise，解析的图像可以是 Image 或 Canvas DOM 对象，否则返回undefined
     */
    requestImage(x, y, level, request) {
        return super.requestImage(x, y, level, request)
    }
}
export default WMTSLayer;
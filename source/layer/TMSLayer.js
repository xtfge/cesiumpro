class TMSLayer extends Cesium.TileMapServiceImageryProvider {
    /**
     * 创建一个从TMS服务请求数据的图层。
     * @extends Cesium.TileMapServiceImageryProvider
     * @param {Promise.<Object>|Object} options 具有以下属性
     * @param {Resource|String} options.url  TMS服务地址或，瓦片的url模板，如果是url模板，它支持以下关键字:
     * <ul>
     *     <li><code>{z}</code>: 瓦片的层级，第一层为0级</li>
     *     <li><code>{x}</code>: 切片方案中X的坐标，最左边为0</li>
     *     <li><code>{y}</code>: 切片方案中Y的坐标，最上边为0</li>
     *     <li><code>{s}</code>: 子域名</li>
     *     <li><code>{reverseX}</code>: 切片方案中X的坐标，最右边为0</li>
     *     <li><code>{reverseY}</code>: 切片方案中Y的坐标，最下边为0</li>
     *     <li><code>{reverseZ}</code>: 瓦片的层级，最大层级为0</li>
     *     <li><code>{westDegrees}</code>: 瓦片最左边的坐标，单位度</li>
     *     <li><code>{southDegrees}</code>: 瓦片最下边的坐标，单位度</li>
     *     <li><code>{eastDegrees}</code>: 瓦片最右边的坐标，单位度</li>
     *     <li><code>{northDegrees}</code>: 瓦片最上边的坐标，单位度</li>
     *     <li><code>{westProjected}</code>: 瓦片最左边的坐标，单位米</li>
     *     <li><code>{southProjected}</code>: 瓦片最下边的坐标，单位米</li>
     *     <li><code>{eastProjected}</code>: 瓦片最右边的坐标，单位米</li>
     *     <li><code>{northProjected}</code>: 瓦片最上边的坐标，单位米</li>
     *     <li><code>{width}</code>: 瓦片宽度，单位像素</li>
     *     <li><code>{height}</code>: 瓦片高度，单位像素</li>
     * </ul>
     * @param {String} [options.fileExtension='png'] 图像的扩展名
     * @param {Credit|String} [options.credit=''] 数据源的版权信息.
     * @param {Number} [options.minimumLevel=0] 图层支持的最低细节级别。在指定最小级别的瓦片数量很少时要小心，较大的数字可能会导致渲染问题。
     * @param {Number} [options.maximumLevel] 图层支持的最大细节级别，如果未定义，则无限制。
     * @param {Rectangle} [options.rectangle=Cesium.Rectangle.MAX_VALUE] 瓦片覆盖范围，单位弧度。
     * @param {TilingScheme} [options.tilingScheme=Cesium.WebMercatorTilingScheme] 图层的坐标系，默认为墨卡托投影。
     * @param {Number} [options.tileWidth=256] 瓦片宽度。
     * @param {Number} [options.tileHeight=256] 瓦片高度。
     * @param {Boolean} [options.flipXY] 是否翻转了XY轴
     * 
     * @example
     *const layer = new TMSLayer({
     *   url: 'http://localhost:8080/geoserver/gwc/service/tms/1.0.0/topp%3Astates@EPSG%3A4326@png',
     *   tilingScheme: proj.get('EPSG:4326')
     * }   
     */
    constructor(options) {
        super(options);
    }
    /**
     * 获取用于瓦片请求的URL，具有以下关键字：
     * <ul>
     *     <li><code>{z}</code>: 瓦片的层级，第一层为0级</li>
     *     <li><code>{x}</code>: 切片方案中X的坐标，最左边为0</li>
     *     <li><code>{y}</code>: 切片方案中Y的坐标，最上边为0</li>
     *     <li><code>{s}</code>: 子域名</li>
     *     <li><code>{reverseX}</code>: 切片方案中X的坐标，最右边为0</li>
     *     <li><code>{reverseY}</code>: 切片方案中Y的坐标，最下边为0</li>
     *     <li><code>{reverseZ}</code>: 瓦片的层级，最大层级为0</li>
     *     <li><code>{westDegrees}</code>: 瓦片最左边的坐标，单位度</li>
     *     <li><code>{southDegrees}</code>: 瓦片最下边的坐标，单位度</li>
     *     <li><code>{eastDegrees}</code>: 瓦片最右边的坐标，单位度</li>
     *     <li><code>{northDegrees}</code>: 瓦片最上边的坐标，单位度</li>
     *     <li><code>{westProjected}</code>: 瓦片最左边的坐标，单位米</li>
     *     <li><code>{southProjected}</code>: 瓦片最下边的坐标，单位米</li>
     *     <li><code>{eastProjected}</code>: 瓦片最右边的坐标，单位米</li>
     *     <li><code>{northProjected}</code>: 瓦片最上边的坐标，单位米</li>
     *     <li><code>{width}</code>: 瓦片宽度，单位像素</li>
     *     <li><code>{height}</code>: 瓦片高度，单位像素</li>
     * </ul>
     * @readonly
     * @returns {String} 获取用于瓦片请求的URL
     */
    get url() {
        return super.url;
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
     * 图层的范围
     * @type {Cesium.Rectangle}
     * @readonly
     */
     get rectangle() {
        return super.rectangle;
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
     * 图层是否允许被pick
     * @default true
     */
    get enablePickFeatures() {
        return super.enablePickFeatures;
    }
    set enablePickFeatures(val) {
        super.enablePickFeatures = val;
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
export default TMSLayer;
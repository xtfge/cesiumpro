import defaultValue from "../core/defaultValue.js";

class XYZLayer extends Cesium.UrlTemplateImageryProvider {
    /**
     * 创建一个image图层，该图层通过使用X/Y/Z指定的URL模板请求图像。你可以用它来请求TMS,WMS标准的地图服务，甚至WMTS。
     * @extends Cesium.UrlTemplateImageryProvider
     * @param {Promise.<Object>|Object} options 具有以下属性
     * @param {Resource|String} options.url  瓦片的url模板，它支持以下关键字:
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
     * @param {Resource|String} [options.pickFeaturesUrl] 用于选择功能的 URL 模板，如果未定义
     *                 {@link XYZLayer#pickFeatures} 将返回undefined，表示未选中任何内容，该模板除了支持url的所有关键字外，还支持以下关键字:
     * <ul>
     *     <li><code>{i}</code>: 选择位置的列，单位像素，最左边为0。</li>
     *     <li><code>{j}</code>: 拾取位置的行，单位像素，最上边为0。</li>
     *     <li><code>{reverseI}</code>: 选择位置的列，单位像素，最右边为0。</li>
     *     <li><code>{reverseJ}</code>: 拾取位置的行，单位像素，最下边为0</li>
     *     <li><code>{longitudeDegrees}</code>: 拾取位置的经度，单位度</li>
     *     <li><code>{latitudeDegrees}</code>: 拾取位置的纬度，单位度</li>
     *     <li><code>{longitudeProjected}</code>: 拾取位置的经度，单位米</li>
     *     <li><code>{latitudeProjected}</code>: 拾取位置的纬度，单位米</li>
     *     <li><code>{format}</code>: 一个函数，用于定义信息的返回形式, 如{@link Cesium.GetFeatureInfoFormat}.</li>
     * </ul>
     * @param {Object} [options.urlSchemeZeroPadding] 设置坐标的位数，不足的以0填充，对于urlSchemeZeroPadding : { '{x}' : '0000'}
     * 如果x为12，将被填充为0012。它具有以下关键字：
     * <ul>
     *  <li> <code>{z}</code>: z关键字的填充方案</li>
     *  <li> <code>{x}</code>: x关键字的填充方案</li>
     *  <li> <code>{y}</code>: y关键字的填充方案</li>
     *  <li> <code>{reverseX}</code>: reverseX关键字的填充方案</li>
     *  <li> <code>{reverseY}</code>: reverseY关键字的填充方案</li>
     *  <li> <code>{reverseZ}</code>: reverseZ关键字的填充方案</li>
     * </ul>
     * @param {String|String[]} [options.subdomains='abc'] {s}占位符可用的子域名，如果该值为字符串，由字符串中的每个字符都是一个子域名。
     * @param {Credit|String} [options.credit=''] 数据源的版权信息.
     * @param {Number} [options.minimumLevel=0] 图层支持的最低细节级别。在指定最小级别的瓦片数量很少时要小心，较大的数字可能会导致渲染问题。
     * @param {Number} [options.maximumLevel] 图层支持的最大细节级别，如果未定义，则无限制。
     * @param {Rectangle} [options.rectangle=Cesium.Rectangle.MAX_VALUE] 瓦片覆盖范围，单位弧度。
     * @param {TilingScheme} [options.tilingScheme=Cesium.WebMercatorTilingScheme] 图层的坐标系，默认为墨卡托投影。
     * @param {Number} [options.tileWidth=256] 瓦片宽度。
     * @param {Number} [options.tileHeight=256] 瓦片高度。
     * @param {Boolean} [options.hasAlphaChannel=true] 瓦片图像是否拥有alpha通道，如果为false，内存使用量和加载时间将减少，但是会失去alpha通道的数据。
     * @param {GetFeatureInfoFormat[]} [options.getFeatureInfoFormats=XYZLayer.defaultFeatureInfoFormats]  {@link XYZLayer#pickFeatures} 调用时在指定位置获取特征信息的格式。如果未指定此参数，则禁用特征拾取。
     * @param {Boolean} [options.enablePickFeatures=true] 是否支持要素不支持，如果为true,XYZLayer#pickFeatures将请求pickFeaturesUrl并解析其内容，否则将返回undefined。
     * @param {Object} [options.customTags] 为URL模板自定义关键字。该对象的键必须为字符串，值为函数。
     * 
     * @example
     * // Access Natural Earth II imagery, which uses a TMS tiling scheme and Geographic (EPSG:4326) project
     * const tms = new CesiumPro.XYZLayer({
     *     url : Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII') + '/{z}/{x}/{reverseY}.jpg',
     *     credit : '© Analytical Graphics, Inc.',
     *     tilingScheme : new Cesium.GeographicTilingScheme(),
     *     maximumLevel : 5
     * });
     * // Access the CartoDB Positron basemap, which uses an OpenStreetMap-like tiling scheme.
     * const positron = new CesiumPro.XYZLayer({
     *     url : 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
     *     credit : 'Map tiles by CartoDB, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'
     * });
     * // Access a Web Map Service (WMS) server.
     * const wms = new CesiumPro.XYZLayer({
     *    url : 'https://programs.communications.gov.au/geoserver/ows?tiled=true&' +
     *          'transparent=true&format=image%2Fpng&exceptions=application%2Fvnd.ogc.se_xml&' +
     *          'styles=&service=WMS&version=1.1.1&request=GetMap&' +
     *          'layers=public%3AMyBroadband_Availability&srs=EPSG%3A3857&' +
     *          'bbox={westProjected}%2C{southProjected}%2C{eastProjected}%2C{northProjected}&' +
     *          'width=256&height=256',
     *    rectangle : Cesium.Rectangle.fromDegrees(96.799393, -43.598214999057824, 153.63925700000001, -9.2159219997013)
     * });
     * // Using custom tags in your template url.
     * const custom = new CesiumPro.XYZLayer({
     *    url : 'https://yoururl/{Time}/{z}/{y}/{x}.png',
     *    customTags : {
     *        Time: function(imageryProvider, x, y, level) {
     *            return '20171231'
     *        }
     *    }
     * });
     * // geoserver tms服务
     * const  geoserverTMS = new XYZLayer({
     *      url: 'http://localhost:8080/geoserver/gwc/service/tms/1.0.0/topp%3Astates@EPSG%3A4326@png/{z}/{x}/{reverseY}.png',
     *      tilingScheme: proj.get('EPSG:4326')
     *  })
     * // geoserver wms服务，并支持pick
     * const geoserverTMS = new XYZLayer({
     *      pickFeaturesUrl:'http://localhost:8080/geoserver/wms?service=WMS&version=1.1.1&request=GetFeatureInfo&layers=topp%3Astates&bbox={westProjected}%2C{southProjected}%2C{eastProjected}%2C{northProjected}&width={width}&height={height}&srs=EPSG%3A4326&query_layers=topp%3Astates&info_format={format}&x={i}&y={j}',
     *      url: 'http://localhost:8080/geoserver/topp/wms?service=WMS&version=1.1.1&request=GetMap&layers' +
     *          '=topp%3Astates&bbox={westDegrees}%2C{southDegrees}%2C{eastDegrees}%2C{northDegrees}&transparent=true&' +
     *           'width=768&height=330&srs=EPSG%3A4326&format=image/png',
     *      tilingScheme: proj.get('EPSG:4326'),
     *      getFeatureInfoFormats: [new Cesium.GetFeatureInfoFormat("xml", "text/xml")]
     * })
     * // geoserver WMTS服务
     * const layer = new XYZLayer({
     *     url: 'http://localhost:8080/geoserver/gwc/service/wmts?layer=topp%3Astates&style=&til' +
     *         'ematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={TileMatrix}' +
     *         '&TileCol={tileCol}&TileRow={tileRow}',
     *     tilingScheme: proj.get('EPSG:4326'),
     *     customTags: {
     *         TileMatrix: function (imageryProvider, x, y, level) {
     *             return 'EPSG:4326:' + level
     *         },
     *         tileCol: function (imageryProvider, x, y, level) {
     *             return y
     *         },
     *         tileRow: function (imageryProvider, x, y, level) {
     *             return x
     *         }
     *     }
     * })
     */
    constructor(options) {
        if (typeof options === 'string') {
            options = {url: options}
        }
        options.getFeatureInfoFormats = defaultValue(options.getFeatureInfoFormats, XYZLayer.defaultFeatureInfoFormats);
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
     * 图层的范围
     * @type {Cesium.Rectangle}
     * @readonly
     */
     get rectangle() {
        return super.rectangle;
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
 /**
 * 默认数据解析格式
 * @constant
 * @type {Object}
 */
XYZLayer.defaultFeatureInfoFormats = Object.freeze([
    Object.freeze(new Cesium.GetFeatureInfoFormat("json", "application/json")),
    Object.freeze(new Cesium.GetFeatureInfoFormat("xml", "text/xml")),
    Object.freeze(new Cesium.GetFeatureInfoFormat("text", "text/html")),
])
export default XYZLayer;
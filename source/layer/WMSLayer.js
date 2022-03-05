import defined from "../core/defined.js";

class WMSLayer extends Cesium.WebMapServiceImageryProvider {
    /**
     * 创建一个从WMS服务请求数据的图层。
     * @extends Cesium.WebMapServiceImageryProvider
     * @param {*} options 具有以下属性
     * @param {Resource|String} options.url 一个WMS服务的URL. 这个url支持和 {@link XYZLayer}一样的关键字。
     * @param {String} options.layers 要包含的图层，以逗号分割。
     * @param {Object} [options.parameters=WMSLayer.DefaultParameters] GetMap URL中包含的额外参数。
     * @param {Object} [options.getFeatureInfoParameters=WMSLayer.GetFeatureInfoDefaultParameters] GetFeatureInfo URL中包含的额外参数。
     * @param {Boolean} [options.enablePickFeatures=true] 图层是否允许被pick {@link WMSLayer#pickFeatures}
     * @param {GetFeatureInfoFormat[]} [options.getFeatureInfoFormats=WMSLayer.DefaultGetFeatureInfoFormats] WMS GetFeatureInfo 请求的格式。
     * @param {Rectangle} [options.rectangle=Cesium.Rectangle.MAX_VALUE] 图层的范围。
     * @param {TilingScheme} [options.tilingScheme=new Cesium.GeographicTilingScheme()] 图层坐标系
     * @param {Number} [options.tileWidth=256] 瓦片宽度
     * @param {Number} [options.tileHeight=256] 瓦片高度
     * @param {Number} [options.minimumLevel=0] 最小层级
     * @param {Number} [options.maximumLevel] 最大层级
     * @param {String} [options.crs] CRS 规范，用于 WMS version >= 1.3.0。
     * @param {String} [options.srs] SRS 规范，用于 WMS version 1.1.0 或 1.1.1
     * @param {Credit|String} [options.credit] A credit for the data source, which is displayed on the canvas.
     * @param {String|String[]} [options.subdomains='abc'] {s}占位符可用的子域名，如果该值为字符串，由字符串中的每个字符都是一个子域名。
     * @param {Clock} [options.clock] 在确定时间维度的值时使用的 Clock 实例。指定 `times` 时需要。
     * @param {TimeIntervalCollection} [options.times] TimeIntervalCollection 及其数据属性是一个包含时间动态维度及其值的对象。
     * 
     * @example 
     * var provider = new Cesium.WebMapServiceImageryProvider({
     *   url : 'https://sampleserver1.arcgisonline.com/ArcGIS/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer/WMSServer',
     *   layers : '0',
     *   proxy: new Cesium.DefaultProxy('/proxy/')
     * });
     *
     * viewer.addLayer(provider);
     */
    constructor(options = {}) {
        if (!defined(options.parameters)) {
            options.parameters = WMSLayer.DefaultParameters;
        }
        if (!defined(options.GetFeatureInfoDefaultParameters)) {
            options
        }
        super(options);
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

/**
 * GetMap时包含在WMS URL中的默认参数，如下:
 *    service=WMS
 *    version=1.1.1
 *    request=GetMap
 *    styles=
 *    format=image/png,
 *    transparent=true
 *
 * @constant
 * @static
 * @type {Object}
 */
WMSLayer.DefaultParameters = Object.assign({
    transparent: true,
}, Cesium.WebMapServiceImageryProvider.DefaultParameters, {
    format: 'image/png'
})
/**
 * WMS GetFeatureInfo时URL中的默认的参数:
 *     service=WMS
 *     version=1.1.1
 *     request=GetFeatureInfo
 *
 * @constant
 * @static
 * @type {Object}
 */
WMSLayer.GetFeatureInfoDefaultParameters = Cesium.WebMapServiceImageryProvider.GetFeatureInfoDefaultParameters;
export default WMSLayer;
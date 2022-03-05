import defaultValue from "../core/defaultValue.js";
import defined from "../core/defined.js";
import Event from '../core/Event.js';
import proj from '../core/proj.js';
const {
    when,
    Rectangle
} = Cesium;
class TileLayer {
    /**
     * 创建一个从WMS服务请求数据的图层。
     * @param {*} options 具有以下属性
     * @param {Boolean} [options.enablePickFeatures=true] 图层是否允许被pick {@link TileLayer#pickFeatures}
     * @param {Rectangle} [options.rectangle=Cesium.Rectangle.MAX_VALUE] 图层的范围。
     * @param {Number} [options.tileWidth=256] 瓦片宽度
     * @param {Number} [options.tileHeight=256] 瓦片高度
     * @param {Number} [options.minimumLevel=0] 最小层级
     * @param {Number} [options.maximumLevel] 最大层级
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
        this._errorEvent = new Event();
        this._tilingScheme = proj.get('EPSG:4326');
        this._readyPromise = when.defer();
        this._ready = false;
        this._ready = true;
        this._minimumLevel = defaultValue(options.minimumLevel, 0);
        this._maximumLevel = options.maximumLevel;
        this._tileWidth = defaultValue(options.tileWidth, 256);
        this._tileHeight = defaultValue(options.tileHeight, 256);
        this._rectangle = defaultValue(options.rectangle, Rectangle.MAX_VALUE);
        this._readyPromise.resolve(true);
        this._errorEvent.addEventListener((x, y, z) => {
            // 主要是为了不让TileProviderError.handleError打印错误
        })
    }
    /**
     * 可以请求的最小瓦片级别
     * @readonly
     * @type {Number}
     */
    get minimumLevel() {
        return this._minimumLevel;
    }
    /**
     * 可以请求的最大详细级别
     * @type {Number}
     * @readonly
     */
    get maximumLevel() {
        return this._maximumLevel;
    }
    /**
     * 获取影像错误时触发的事件
     * @type {Event}
     * @readonly
     */
    get errorEvent() {
        return this._errorEvent;
    }
    /**
     * 图层的范围
     * @type {Cesium.Rectangle}
     * @readonly
     */
    get rectangle() {
        return this._rectangle;
    }
    /**
     * 获取一个值，该值指示图层是否已准备好使用。
     * @readonly
     * @type {Boolean}
     */
    get ready() {
        return this._ready;
    }
    /**
     * 获取一个Promise，该图层准备好时将resolve
     * @readonly
     * @type {Promise<Boolean>}
     */
    get readyPromise() {
        return this._readyPromise;
    }
    /**
     * 图层的坐标系
     * @type {Cesium.TilingScheme}
     * @readonly
     */
    get tilingScheme() {
        return this._tilingScheme;
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
    get tileHeight() {
        return this._tileHeight;
    }
    get tileWidth() {
        return this._tileWidth;
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
        this.requestGeometry(x, y, level);
        return Promise.reject(false);
    }
    requestGeometry(x, y, level) {
         
    }
}
export default TileLayer;
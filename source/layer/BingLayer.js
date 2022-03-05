import defaultValue from "../core/defaultValue.js";

const {
    BingMapsImageryProvider,
    BingMapsStyle 
} = Cesium;
class BingLayer extends BingMapsImageryProvider {
    /**
     * 创建一个由微软地图提供的图层。与国内免费的地图相比（天地图、高德地图、百度地图等），微软地图提供了更高层级的影像，且访问速度较快。
     * @param {Object} [options] 具有以下属性。
     * @param {String} [options.mapStyle = BingLayer.mapStyle.AERIAL] 图层使用的样式
     * @param {String} [options.tileProtocol] 加载瓦片时使用的网络协议(http,https等），默认情况下使用与页面相同的协议。
     * @param {String} [options.key] 微软地图的key，可以在https://www.bingmapsportal.com/申请
     */
    constructor(options = {}) {
        options.url = 'https://dev.virtualearth.net'
        options.mapStyle = defaultValue(options.mapStyle, BingLayer.mapStyle.AERIAL);
        options.key = defaultValue(options.key, 'AqMhBWJKbBPBtoWEvtGdUii6XSkDCJ3vWFpOVWzplD-Q0J-ECUF6i8MGXpew8bkc')
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
    /**
     * 将图块（x、y、level）位置转换为用于从 Bing 地图服务器请求图像的key
     * @param {Number} x 行号
     * @param {Number} y 列号
     * @param {Number} level 层级
     */
    static tileXYToQuadKey(x, y, level) {
        return BingMapsImageryProvider.tileXYToQuadKey(x, y, level);
    }
    /**
     * 将用于从 Bing 地图服务器请求图像的图块的key转换为 (x, y, level) 位置。
     * @param {String} quadkey 
     */
    static quadKeyToTileXY(quadkey) {
        return BingMapsImageryProvider.quadKeyToTileXY(quadkey)
    }
    /**
     * Bing图层的可用样式
     * <code>
     * <ul>
     *  <li>AERIAL：卫星影像</li>
     *  <li>AERIAL_WITH_LABELS：带有道路的卫星影像<li>
     *  <li>AERIAL_WITH_LABELS_ON_DEMAND：带有道路的卫星影像</li>
     *  <li>ROAD: 路网</i>
     *  <li>CANVAS_DARK: 暗黑风格的路网</i>
     *  <li>CANVAS_LIGHT: 明亮风格的路网</i>
     *  <li>CANVAS_GRAY: 黑白地图</i>
     * </ul>
     * </code>
     * @memberof BingLayer
     * @static
     * @type {Object}
     */
    static mapStyle = BingMapsStyle;
}
export default BingLayer;
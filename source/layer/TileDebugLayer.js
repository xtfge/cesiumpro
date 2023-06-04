import defaultValue from '../core/defaultValue.js';
import defined from '../core/defined.js'
import Event from '../core/Event.js'
import proj from '../core/proj.js'
function buildText(imageryProvider, x, y, level) {
    let text = [];
    text[0] = 'L: ' + level;
    text[1] = 'X: ' + x;
    if (imageryProvider.reverseY) {
        text[2] = 'Y: ' + imageryProvider.tilingScheme.getNumberOfYTilesAtLevel(level) - y - 1;;
    } else {
        text[2] = 'Y: ' + y
    }
    return text;
}
function toCssColorString(color) {
    return `rgba(${color.red * 255}, ${color.green * 255}, ${color.blue * 255}, ${color.alpha})`
}
class TileDebugLayer {
    /**
     * 根据给定参数显示瓦片行列号，仅用于调试。
     * @param {Object} options 具有以下属性。
     * @param {String} [options.font='bold 24px sans-serif'] 字体
     * @param {String} [options.color = Cesium.Color.WHITE] 文字颜色
     * @param {String} [options.borderColor = Cesium.Color.GOLD] 边框颜色
     * @param {String} [options.borderWidth = 2] 边框宽度
     * @param {String} [options.reverseY=false] 是否翻转Y轴
     * @param {Cesium.TilingScheme} [options.tilingScheme = proj.get('EPSG:4326')] 瓦片分割坐标系
     */
    constructor(options = {}) {
        options.tileWidth = defaultValue(options.tileWidth, 256);
        options.tileHeight = defaultValue(options.tileHeight, 256);
        this._tilingScheme = defined(options.tilingScheme)
            ? options.tilingScheme
            : proj.get('EPSG:4326', { ellipsoid: options.ellipsoid });
        this._errorEvent = new Event();
        this._tileWidth = defaultValue(options.tileWidth, 256);
        this._tileHeight = defaultValue(options.tileHeight, 256);
        this._readyPromise = Promise.resolve(true);

        this._font = defaultValue(options.font, 'bold 24px sans-serif');
        this._color = defaultValue(options.color, new Cesium.Color(1,1,1,1));
        this._borderColor = defaultValue(options.borderColor, Cesium.Color.GOLD)
        this._borderWidth = defaultValue(options.borderWidth, 2)    
    }
    /**
     * 表示图层是否已准备完成。
     * @type {Boolean}
     * @readonly
     */
    get ready() {
        return true;
    }
    /**
     * 返回一个Promise表示图层是否已准备完成。
     * @type {Promise<Boolean>}
     * @readonly
     */
    get readyPromise() {
        return this._readyPromise;
    }
    /**
     * 图层是否具有alpha通道
     * @type {Boolean}
     * @readonly
     */
    get hasAlphaChannel() {
        return true;
    }
    /**
     * 图层发生错误是触发的事件。
     * @type {Event}
     * @readonly
     */
    get errorEvent() {
        return this._errorEvent;
    }
    /**
     * 图层的范围
     * @readonly
     * @type {Cesium.Rectangle}
     */
    get rectangle() {
        return this._tilingScheme.rectangle;
    }
    /**
     * 瓦片宽度
     * @type {Number}
     * @readonly
     */
    get tileWidth() {
        return this._tileWidth;
    }
    /**
     * 瓦片高度
     * @type {Number}
     * @readonly
     */
    get tileHeight() {
        return this._tileHeight;
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
     * 获得或设置字体
     * @type {String}
     */
    get font() {
        return this._font;
    }
    set font(val) {
        this._font = val;
    }
    /**
     * 获得或设置文字颜色
     * @type {String}
     */
    get color() {
        return this._color;
    }
    set color(val) {
        this._color = val;
    }
    /**
     * 获得或设置边框颜色
     * @type {String}
     */
    get borderColor() {
        return this._borderColor;
    }
    set borderColor(val) {
        this._borderColor = val;
    }
    /**
     * 获得或设置边框宽度
     * @type {Number}
     */
    get borderWidth() {
        return this._borderWidth
    }
    /**
     * @private
     */
    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = this.tileWidth;
        canvas.height = this.tileHeight;
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.font = this.font;
        ctx.fillStyle = toCssColorString(this.color);
        ctx.strokeStyle = toCssColorString(this.color);
        ctx.lineWidth = this.borderWidth
        return {canvas, ctx}
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
        const { canvas, ctx } = this.createCanvas();
        const value = buildText(this, x, y, level);
        ctx.fillText(value[0], canvas.width / 2, canvas.height / 4 * 1);
        ctx.fillText(value[1], canvas.width / 2, canvas.height / 4 * 2);
        ctx.fillText(value[2], canvas.width / 2, canvas.height / 4 * 3);
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        return Promise.resolve(canvas);
    }

}
export default TileDebugLayer;
import defaultValue from '../core/defaultValue.js';
import XYZLayer from './XYZLayer.js';

function buildImageUrl(imageryProvider, x, y, level) {
    let url = imageryProvider.url + "&x={x}&y={y}&z={z}";
    const tileW = imageryProvider._tilingScheme.getNumberOfXTilesAtLevel(level);
    const tileH = imageryProvider._tilingScheme.getNumberOfYTilesAtLevel(level);
    const s = (Math.random() * 4)|0
    url = url
        .replace('{s}', s)
        .replace('{x}', x - tileW / 2)
        .replace('{y}', tileH / 2 - y - 1)
        .replace('{z}', level);
    return url;
}
const HEIGHT = 33746824;
const WIDTH = 33554054;
class BaiDuLayer extends XYZLayer {
    /**
     * 创建一个使用百度地图服务的图层，可以使用百度个性化地图。
     * <p>如果可以，建议不要使用百度地图，网上可用的资料太少，服务不稳定，可用图层少，一大堆缺点</p>
     * @param {Object} options 具有Cesium.UrlTemplateImageryProvider的所有属性
     * @param {String} [options.customid] 个性化地图id
     * @extends XYZLayer
     * @see {@link http://lbsyun.baidu.com/custom/list.htm|百度个性化地图列表}
     */
    constructor(options) {
        options = defaultValue(options, {});
        options.url = defaultValue(options.url, 'http://maponline{s}.bdimg.com/tile/?qt=vtile&styles=pl&scaler=1&udt=20200102');
        if (options.customid) {
            options.url = `https://api.map.baidu.com/customimage/tile?customid=${options.customid}`;
        }
        const rectangleSouthwestInMeters = new Cesium.Cartesian2(-WIDTH, -HEIGHT);
        const rectangleNortheastInMeters = new Cesium.Cartesian2(WIDTH, HEIGHT);
        options.tilingScheme = new Cesium.WebMercatorTilingScheme({
            rectangleSouthwestInMeters: rectangleSouthwestInMeters,
            rectangleNortheastInMeters: rectangleNortheastInMeters
        });
        options.subdomains = '123'
        super(options);
    }
    get rectangle() {
        return this.tilingScheme.rectangle;
    }
    /**
     * 请求指定瓦片
     * @param {Number} x 瓦片x坐标
     * @param {Number} y 瓦片y坐标
     * @param {Number} level 瓦片级别
     * @param {Cesium.Request} [request]
     * @returns {Promise.<HTMLImageElement|HTMLCanvasElement>|undefined} 如果瓦片解析成功，返回一个异步Promise，解析的图像可以是 Image 或 Canvas DOM 对象，否则返回undefined
     */
    requestImage(x, y, level) {
        const url = buildImageUrl(this, x, y, level);
        return Cesium.ImageryProvider.loadImage(this, url);
    };
}
export default BaiDuLayer;

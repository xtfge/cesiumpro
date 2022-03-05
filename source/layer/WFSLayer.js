import CesiumProError from "../core/CesiumProError.js";
import defined from "../core/defined.js";
import proj from '../core/proj'
import GeoJsonDataSource from "./GeoJsonDataSource.js";
const {
    Resource
} = Cesium;
class WFSLayer {
    /**
     * 添加一个WFS服务的图层
     * @param {Object} options 具有以下属性
     * @param {String} options.url WFS服务地址
     * @param {String} options.typeName 图层名称
     * @param {WFSLayer.Style} [options.style] 样式
     * @example
     * const wfs = new CesiumPro.WFSLayer({
     *     url: "http://localhost:8080/geoserver/tiger/ows",
     *     typeName: "tiger:poi",
     *     style: {
     *         pointColor: Cesium.Color.GOLD
     *     }
     * })
     * viewer.addLayer(wfs)
     */
    constructor(options = {}) {
        this._url = options.url;
        this._typeName = options.typeName;
        this._style = options.style;
        if (!defined(this._url)) {
            throw new CesiumProError('parameter url must be provided.')
        }
        if (!defined(this._typeName)) {
            throw new CesiumProError('parameter typeName must be provided.')
        }
        const resource = new Resource({
            url: options.url,
            queryParameters: {
                service: 'WFS',
                version: "1.0.0",
                request: "GetFeature",
                typeName: options.typeName,
                maxFeatures: 50,
                outputFormat: 'application/json'
            }
        })
        return GeoJsonDataSource.load(resource, this._style);
    }
    get rectangle() {
        return this._rectangle || this.tilingScheme.rectangle;
    }
    get tilingScheme() {
        return proj.get('EPSG:4326');
    }
    get tileWidth() {
        return this._tileWidth;
    }
    get tileHeight() {
        return this._tileHeight
    }
    get ready() {
        return this._ready;
    }
    get readyPromise() {
        return this._readyPromise;
    }
}
/**
 * @typedef {Object} WFSLayer.Style
 *
 * 加载GeoJson数据源时的配置项
 *
 * @property {Cesium.Color} [pointColor] 点的颜色，如果没有设置将使用GeoJsonDataSource.pointColor
 * @property {Number} [pointSize] 点的大小，如果没有设置将使用GeoJsonDataSource.pointSize
 * @property {Cesium.Color} [outlineColor] 多边形边框颜色，如果没有设置将使用GeoJsonDataSource.outlineColor
 * @property {Number} [outlineWidth] 多边形边框宽度，如果没有设置将使用GeoJsonDataSource.outlineWidth
 * @property {Boolean} [outline] 是否显示多边形边框，如果没有设置将使用GeoJsonDataSource.outline
 * @property {Cesium.Color} [fill] 多边形填充颜色，如果没有设置将使用GeoJsonDataSource.fill
 * @property {Cesium.Color} [lineColor] 线要素的颜色，如果没有设置将使用GeoJsonDataSource.lineColor
 * @property {Cesium.Color} [lineWidth] 线要素的宽度，如果没有设置将使用GeoJsonDataSource.lineWidth
 * @property {Boolean} [clampToGround] 是否贴地，如果未定义则使用GeoJsonDataSource.clampToGround
 * @property {String|Cesium.Credit} [credit] 信用信息
 */
export default WFSLayer;
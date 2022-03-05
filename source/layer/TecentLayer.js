import defaultValue from '../core/defaultValue.js'
import XYZLayer from './XYZLayer.js'
const layerMap = {
    map: 'https://rt{s}.map.gtimg.com/tile?z={z}&x={x}&y={reverseY}&styleid=1&version=297',
    road: 'https://rt{s}.map.gtimg.com/tile?z={z}&x={x}&y={reverseY}&styleid=2&version=297',
    img: 'https://p{s}.map.gtimg.com/sateTiles/{z}/{sx}/{sy}/{x}_{reverseY}.jpg?version=229'
}
class TecentLayer extends XYZLayer{
    /**
     * 创建一个使用腾讯地图服务的图层。
     * @param {*} options 具有以下属性
     * @param {String}  [options.layer = 'img'] 图层名，有效值包括img、map、road
     * 
     * @extends XYZLayer
     */
    constructor(options = {}) {
        options.layer = defaultValue(options.layer, 'img');
        options.subdomains = '123'
        options.url = layerMap[options.layer];
        options.customTags = {
            sx: function (imageryProvider, x, y, level) {
                return x >> 4;
            },
            sy: function (imageryProvider, x, y, level) {
                return ((1 << level) - y) >> 4;
            }
        }
        super(options)
    }
}
export default TecentLayer;
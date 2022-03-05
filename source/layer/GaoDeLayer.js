
import defaultValue from '../core/defaultValue.js';
import XYZLayer from './XYZLayer.js';
class GaoDeLayer extends XYZLayer {
    /**
     * 创建一个使用高德地图服务的图层。
     * @param {Object} options 具有以下属性
     * @param {String} [options.layer='img'] 图层，具有以下有效值：
     * <ul>
     *   <li><code>img</code>: 影像地图</li>
     *   <li><code>vec</code>: 矢量地图</li>
     *   <li><code>vei</code>: 矢量地图（含注记）</li>
     *   <li><code>roi</code>: 路网地图（含注记）</li>
     *   <li><code>roa</code>: 路网地图</li>
     * </ul>
     * @extends XYZLayer
     * 
     * @see {@link https://cesium.com/docs/cesiumjs-ref-doc/UrlTemplateImageryProvider.html?classFilter=UrlTemplateImageryProvider|Cesium.UrlTemplateImageryProvider}
     * @see {@link https://blog.csdn.net/fredricen/article/details/77189453}
     * @example
     * //1.添加默认图层(img)
     * const img=new CesiumPro.GaoDeLayer();
     * viewer.imageryLayers.addImageryProvider(img);
     * //2.添加矢量图层
     * const vec=new CesiumPro.GaoDeLayer({
     *   layer:'vec'
     * });
     * viewer.imageryLayers.addImageryProvider(vec);
     * //3.添加带注记和路网的矢量图层
     * const vei=new CesiumPro.GaoDeLayer({
     *   layer:'vei'
     * });
     * viewer.imageryLayers.addImageryProvider(vei);
     * //4.添加带注记和路网的影像
     * //高德没有提供带注记和路网的影像图层
     * //需要同时添加影像图层和路网图层
     * const img=new CesiumPro.GaoDeLayer({
     *   layer:'img'
     * });
     * const road=new CesiumPro.GaoDeLayer({
     *   layer:'roi'
     * });
     * viewer.imageryLayers.addImageryProvider(img);
     * viewer.imageryLayers.addImageryProvider(roi);
     *
     */
    constructor(options) {
        options = defaultValue(options, {});

        const layer = defaultValue(options.layer, 'img');
        const {
            scl,
            style
        } = GaoDeLayer.getParametersByLayer(layer);
        const lang = defaultValue(options.lang, 'zh_cn')
        options.url = `https://webst0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=${lang}&size=1&scl=${scl}&style=${style}`;
        options.subdomains = '1234'
        super(options);
    }
    /**
     * 高德提供的所有可用图层
     * @memberof GaoDeLayer
     * @constant
     * @type {Array}
     */
    static layers = [{
        layer: 'img',
        desc: '影像地图'
    }, {
        layer: 'vec',
        desc: '矢量地图'
    }, {
        layer: 'vei',
        desc: '矢量地图（含注记）'
    }, {
        layer: 'roa',
        desc: '路网地图'
    },
    {
        layer: 'roi',
        desc: '路网地图（含注记）'
    }
    ]

    static getParametersByLayer(layer) {
        let params = {
            scl: 1,
            style: 6
        }
        switch (layer) {
            case 'img':
                break;
            case 'vec':
                params.scl = 2;
                params.style = 7;
                break;
            case 'vei':
                params.scl = 1;
                params.style = 7;
                break;
            case 'roa':
                params.scl = 2;
                params.style = 8;
                break;
            case 'roi':
                params.scl = 1;
                params.style = 8;
                break;
        }
        return params;
    }
}
export default GaoDeLayer;

import defaultValue from '../core/defaultValue.js';
import defined from '../core/defined.js';
import WMTSLayer from './WMTSLayer.js';
class TDTLayer extends WMTSLayer {
  /**
   * 创建一个使用天地图服务的图层。
   * @see {@link http://lbs.tianditu.gov.cn/server/MapService.html|申请天地图key}
   * @see {@link WMTSLayer}
   * @extends WMTSLayer
   * @param {Object} options 具有以下属性
   * @param {String} options.key 天地图私key
   * @param {Cesium.TilingScheme} [options.tilingScheme=new Cesium.WebMercatorTilingScheme()] 坐标系
   * @param {String} [options.layer='img'] 图层,有效值如下
   * <ul>
   *    <li>vec: 矢量底图</li>
   *    <li>cva: 矢量注记</li>
   *    <li>img: 影像底图</li>
   *    <li>cia: 影像注记</li>
   *    <li>ter: 地形晕渲</li>
   *    <li>cta: 地形注记</li>
   *    <li>ibo: 全球境界</li>
   *    <li>eva: 矢量英文注记</li>
   *    <li>eia: 影像英文注记</li>
   * </ul>
   * @param {String} [options.style='default'] 地图样式
   * @param {Number} [options.maximumLevel=19] 地图最大级别
   * @param {Number} [options.minimumLevel=0] 地图最小级别
   * @param {Array} [options.tileMatrixLabels] TileMatrix中用于WMTS请求的标识符列表，每个TileMatrix级别对应一个label。
   *
   * @example
   * //1.默认参数为墨卡托投影的img图层
   * const img = new CesiumPro.TDTLayer({
   *   key: "ac7f26daf5b1a54c746e93a414dd9c**"
   * });
   * viewer.addLayer(img);
   * //2.添加经纬度投影的矢量图层
   * const vec=new CesiumPro.TDTLayer({
   *   key: "ac7f26daf5b1a54c746e93a414dd9c**",
   *   layer:'vec',
   *   tilingScheme: new Cesium.GeographicTilingScheme()
   * });
   * viewer.addLayer(vec);
   *
   */
  constructor(options) {
    options = defaultValue(options, {});
    const key = options.key;
    if (!key) {
      console.warn('未定义key，地图服务将不可用')
      console.warn('请前往http://lbs.tianditu.gov.cn/server/MapService.html获取地图key')
    }
    const tilingScheme = defaultValue(options.tilingScheme, new Cesium.WebMercatorTilingScheme());
    let crs = 'w',
      tileMatrixSet = 'w',
      tileMatrixLabels = options.tileMatrixLabels;
    if (tilingScheme instanceof Cesium.GeographicTilingScheme) {
      crs = 'c';
      tileMatrixSet = 'c';
      if (!defined(tileMatrixLabels)) {
        tileMatrixLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19']
      }
    }
    const layer = defaultValue(options.layer, 'img');
    const url = `http://t{s}.tianditu.com/${layer}_${crs}/wmts?service=wmts&tileMatrixSet=${tileMatrixSet}&request=GetTile&version=1.0.0&LAYER=${layer}&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${key}`
    return new Cesium.WebMapTileServiceImageryProvider({
      url,
      layer,
      style: options.style || 'default',
      format: options.format || 'tiles',
      tileMatrixSetID: 'GoogleMapsCompatible',
      credit: options.credit?new Cesium.Credit(options.credit || ''):null,
      // subdomains: options.subdomains || ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
      tilingScheme: options.tilingScheme,
      maximumLevel: options.maximumLevel || 19,
      minimumLevel: options.minimumLevel || 0,
      tileMatrixLabels,
      subdomains:'01234567'
    })
  }
  /**
   * 天地图提供的可用图层及其描述
   * <ul>
   *  <li>vec: 矢量底图</li>
   *  <li>cva: 矢量注记</li>
   *  <li>img: 影像底图</li>
   *  <li>cia: 影像注记</li>
   *  <li>ter: 地形晕渲</li>
   *  <li>cta: 地形注记</li>
   *  <li>ibo: 全球境界</li>
   *  <li>eva: 矢量英文注记</li>
   *  <li>eia: 影像英文注记</li>
   * </ul>
   * @memberof TDTLayer
   * @constant
   * @type {Object}
   */
  static layers = [{
      layer: "vec",
      desc: "矢量底图"
    },
    {
      layer: "cva",
      desc: "矢量注记"
    }, {
      layer: "img",
      desc: "影像底图"
    }, {
      layer: "cia",
      desc: "影像注记"
    }, {
      layer: "ter",
      desc: "地形晕渲"
    }, {
      layer: "cta",
      desc: "地形注记"
    }, {
      layer: "ibo",
      desc: "全球境界"
    }, {
      layer: "eva",
      desc: "矢量英文注记"
    }, {
      layer: "eia",
      desc: "影像英文注记"
    }
  ]
}
export default TDTLayer;

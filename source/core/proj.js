import CesiumProError from './CesiumProError.js';
/**
 * 坐标系相关方法
 * @namespace proj
 */
const proj = {};
/**
 * 通过epsg code获得Cesium预设的坐标系统
 * @param {string} [epsgCode = 'EPSG:3857'] epsg码，EPSG:3857获得Web墨卡托投影，EPSG:4326获得WGS84坐标系
 * @param {*} [options] 定义坐标系的详细参数，具体请参考WebMercatorTilingScheme和GeographicTilingScheme
 * 
 * @returns {Cesium.TilingScheme} 相应epsg code的坐标系
 * @see {@link ../cesiumDocumentation/WebMercatorTilingScheme.html|WebMercatorTilingScheme}
 * @see {@link ../cesiumDocumentation/GeographicTilingScheme.html|GeographicTilingScheme}
 */
proj.get = function(epsgCode = 'EPSG:3857', options) {
    const code = epsgCode.toUpperCase();
    if (code === 'EPSG:3857') {
        return new Cesium.WebMercatorTilingScheme(options)
    } else if(code === 'EPSG:4326') {
        return new Cesium.GeographicTilingScheme(options);
    }
    throw new CesiumProError('未知的坐标系.')
}
export default proj;
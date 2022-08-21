import CesiumProError from './CesiumProError.js';
import LonLat from './LonLat.js'
const BD_FACTOR = (3.14159265358979324 * 3000.0) / 180.0
const PI = 3.1415926535897932384626
const RADIUS = 6378245.0
const EE = 0.00669342162296594323

function delta(lon, lat) {
    let dLng = this.transformLng(lon - 105, lat - 35)
    let dLat = this.transformLat(lon - 105, lat - 35)
    const radLat = (lat / 180) * PI
    let magic = Math.sin(radLat)
    magic = 1 - EE * magic * magic
    const sqrtMagic = Math.sqrt(magic)
    dLng = (dLng * 180) / ((RADIUS / sqrtMagic) * Math.cos(radLat) * PI)
    dLat = (dLat * 180) / (((RADIUS * (1 - EE)) / (magic * sqrtMagic)) * PI)
    return [dLng, dLat]
}

function transformLng(lon, lat) {
    lat = +lat
    lon = +lon
    let ret =
        300.0 +
        lon +
        2.0 * lat +
        0.1 * lon * lon +
        0.1 * lon * lat +
        0.1 * Math.sqrt(Math.abs(lon))
    ret +=
        ((20.0 * Math.sin(6.0 * lon * PI) + 20.0 * Math.sin(2.0 * lon * PI)) *
            2.0) /
        3.0
    ret +=
        ((20.0 * Math.sin(lon * PI) + 40.0 * Math.sin((lon / 3.0) * PI)) * 2.0) /
        3.0
    ret +=
        ((150.0 * Math.sin((lon / 12.0) * PI) +
            300.0 * Math.sin((lon / 30.0) * PI)) *
            2.0) /
        3.0
    return ret
}

function transformLat(lon, lat) {
    lat = +lat
    lon = +lon
    let ret =
        -100.0 +
        2.0 * lon +
        3.0 * lat +
        0.2 * lat * lat +
        0.1 * lon * lat +
        0.2 * Math.sqrt(Math.abs(lon))
    ret +=
        ((20.0 * Math.sin(6.0 * lon * PI) + 20.0 * Math.sin(2.0 * lon * PI)) *
            2.0) /
        3.0
    ret +=
        ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) /
        3.0
    ret +=
        ((160.0 * Math.sin((lat / 12.0) * PI) +
            320 * Math.sin((lat * PI) / 30.0)) *
            2.0) /
        3.0
    return ret
}
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
 * @see {@link Cesium.WebMercatorTilingScheme|WebMercatorTilingScheme}
 * @see {@link Cesium.GeographicTilingScheme|GeographicTilingScheme}
 * @example
 * new XYZLayer({
 *       url: Url.buildModuleUrl('assets/tiles/{z}/{x}/{y}.png'),
 *       maximumLevel: 4,
 *       tilingScheme: CesiumPro.proj.get("EPSG：3857")
 *  })
 *}
 */
proj.get = function (epsgCode = 'EPSG:3857', options) {
    const code = epsgCode.toUpperCase();
    if (code === 'EPSG:3857') {
        return new Cesium.WebMercatorTilingScheme(options)
    } else if (code === 'EPSG:4326') {
        return new Cesium.GeographicTilingScheme(options);
    }
    throw new CesiumProError('未知的坐标系.')
}
/**
 * BD-09转GCJ-02
 * @param {Number} lon 经度坐标，-180~180之间
 * @param {Number} lat 纬度坐标，-90~90之间
 * @returns {LonLat.Lonlat}
 * @see {@link https://blog.csdn.net/a13570320979/article/details/51366355|百度09、GCJ02、WGS84坐标互转}
 */
proj.BD09ToGCJ02 = function (lon, lat) {
    const x = +lon - 0.0065
    const y = +lat - 0.006
    const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * BD_FACTOR)
    const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * BD_FACTOR)
    const gg_lng = z * Math.cos(theta)
    const gg_lat = z * Math.sin(theta)
    return [gg_lng, gg_lat]
}
/**
  * GCJ-02转BD-09
  * @param {Number} lon 经度坐标，-180~180之间
  * @param {Number} lat 纬度坐标，-90~90之间
  * @returns {LonLat.Lonlat}
  * @see {@link https://blog.csdn.net/a13570320979/article/details/51366355|百度09、GCJ02、WGS84坐标互转}
  */
proj.GCJ02ToBD09 = function (lon, lat) {
    lat = +lat
    lon = +lon
    const z =
        Math.sqrt(lon * lon + lat * lat) + 0.00002 * Math.sin(lat * BD_FACTOR)
    const theta = Math.atan2(lat, lon) + 0.000003 * Math.cos(lon * BD_FACTOR)
    const bd_lng = z * Math.cos(theta) + 0.0065
    const bd_lat = z * Math.sin(theta) + 0.006
    return [bd_lng, bd_lat]
}

/**
 * WGS-84转GCJ-02
 * @param {Number} lon 经度坐标，-180~180之间
 * @param {Number} lat 纬度坐标，-90~90之间
 * @returns {LonLat.Lonlat}
 * @see {@link https://blog.csdn.net/a13570320979/article/details/51366355|百度09、GCJ02、WGS84坐标互转}
 */
proj.WGS84ToGCJ02 = function (lon, lat) {
    lat = +lat
    lon = +lon
    if (LonLat.inChina(lon, lat)) {
        const d = delta(lon, lat)
        return [lon + d[0], lat + d[1]];        
    } else {
        return [lon, lat];
    }
}

/**
 * GCJ-02转WGS-84
 * @param {Number} lon 经度坐标，-180~180之间
 * @param {Number} lat 纬度坐标，-90~90之间
 * @returns {LonLat.Lonlat}
 * @see {@link https://blog.csdn.net/a13570320979/article/details/51366355|百度09、GCJ02、WGS84坐标互转}
 */
proj.GCJ02ToWGS84 = function (lon, lat) {
    lat = +lat
    lon = +lon
    if(LonLat.inChina(lon, lat)) {
        const d = delta(lon, lat)
        const mgLng = lon + d[0]
        const mgLat = lat + d[1]
        return [lon * 2 - mgLng, lat * 2 - mgLat]
    } else {
        return [lon, lat]
    }
}

export default proj;
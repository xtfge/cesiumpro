import lineChunk from '@turf/line-chunk'
import { area, bbox, lineString, pointGrid, polygon, triangleGrid } from '@turf/turf';
import CesiumProError from '../core/CesiumProError';
import LonLat from '../core/LonLat';
const {
    Cartographic,
    Cartesian3
} = Cesium;
/**
 * 空间分析工具集
 * @exports AnalysisUtil
 */
const AnalysisUtil = {};
/**
 * 直线分段
 * @param {LonLat[]} positions 直线顶点 
 * @param {number} segmentLength 分段长度
 * @param {object} options 具有以下属性
 * @param {string} [options.units = 'kilometers'] 长度单位,有效值为degrees、radians、miles、kilometers
 * @param {boolean} [options.reverse = false] 是否反向分割
 * @returns {LineString[]}
 * 
 * @example
 * const positions = [new CesiumPro.LonLat(110, 30), new CesiumPro.LonLat(111, 31), new CesiumPro.LonLat(112, 31)]
 * const chunks = CesiumPro.AnalysisUtil.lineChunk(positions, 10, {units: 'meter'});
 */
AnalysisUtil.lineChunk = function (positions, segmentLength, options = {}) {
    try {
        const line = lineString(positions.map(_ => [_.lon, _.lat]));
        return lineChunk(line, segmentLength, options)
    } catch (e) {
        throw new CesiumProError('计算错误', e)
    }
}
/**
 * 将多边形分割成点集
 * @param {LonLat[]} positions 多边形顶点坐标
 * @param {number} cellSide 网格大小
 * @param {object} options 具有以下属性
 * @param {string} [options.units = 'kilometers'] cellSize的单位， 有效值为degrees, radians, miles, 或 kilometers
 * @param {object} [options.properties = {}] 附加的属性信息
 */
AnalysisUtil.polygonToGrid = function(positions, cellSize, options = {}) {
    const pg = polygon([positions.map(_ => [_.lon, _.lat])]);
    const box = bbox(pg);
    options.mask = pg;
    return pointGrid(box, cellSize, options);
}
/**
 * 将多边形分割三角形
 * @param {LonLat[]} positions 多边形顶点坐标
 * @param {number} cellSide 网格大小
 * @param {object} options 具有以下属性
 * @param {string} [options.units = 'kilometers'] cellSize的单位， 有效值为degrees, radians, miles, 或 kilometers
 * @param {object} [options.properties = {}] 附加的属性信息
 */
AnalysisUtil.triangleGrid = function(positions, cellSize, options = {}) {
    const pg = polygon([positions.map(_ => [_.lon, _.lat])]);
    const box = bbox(pg);
    options.mask = pg;
    return triangleGrid(box, cellSize, options);
}
AnalysisUtil.getCartesians = function(positions) {
    const first = positions[0];
    if (first instanceof LonLat) {
        return positions.map(_ => _.toCartesian());
    }
    if (first instanceof Cartesian3) {
        return positions
    }
    if (first instanceof Cartographic) {
        return positions.map(_ => Cartographic.toCartesian(_));
    }
    if (typeof first === 'number') {
        return Cartesian3.fromDegreesArray(positions);
    }
    return positions;
}
AnalysisUtil.getLonLats = function(positions) {
    const first = positions[0];
    if (first instanceof LonLat) {
        return positions
    }
    if (first instanceof Cartesian3) {
        return positions.map(_ => LonLat.fromCartesian(_));
    }
    if (first instanceof Cartographic) {
        return positions.map(_ => LonLat.fromCartographic(_));
    }
    if (typeof first === 'number') {
        return LonLat.fromDegreesArray(positions);
    }
    return positions;
}
AnalysisUtil.getArea = function(positions) {
    const pg = polygon([positions]);
    return area(pg);
}

export default AnalysisUtil;
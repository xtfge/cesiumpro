import lineChunk from '@turf/line-chunk'
import { 
    area, 
    bbox, 
    lineString, 
    pointGrid, 
    polygon, 
    triangleGrid, 
    voronoi, 
    bboxPolygon, 
    intersect 
} from '@turf/turf';
import CesiumProError from '../core/CesiumProError';
import LonLat from '../core/LonLat';
const {
    Cartographic,
    Cartesian3
} = Cesium;

function formatTurfPolygonPoints(points) {
    if (points.length < 2) {
        return points;
    }
    const first = points[0];
    const last = points[points.length - 1];
    if (!(first.lon == last.lon && first.lat == last.lat)) {
        points.push(first);
    }
    return points;
}
/**
 * 空间分析工具集
 * @exports AnalyserUtil
 */
const AnalyserUtil = {};
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
 * const chunks = CesiumPro.AnalyserUtil.lineChunk(positions, 10, {units: 'meter'});
 */
AnalyserUtil.lineChunk = function (positions, segmentLength, options = {}) {
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
AnalyserUtil.polygonToGrid = function(positions, cellSize, options = {}) {
    positions = formatTurfPolygonPoints(positions)
    const pg = polygon([positions.map(_ => [_.lon, _.lat])]);
    const box = bbox(pg);
    options.mask = pg;
    return pointGrid(box, cellSize, options);
}
/**
 * 将多边形分析Voronoi多边形
 * @param {LonLat[]} positions 多边形顶点
 * @param {number} cellSize 多边形分割成点时需要的点集密度
 * @param {object} [options] 
 * @param {string} [options.units = 'kilometers'] cellSize的单位， 有效值为degrees, radians, miles, 或 kilometers
 * @param {object} [options.properties = {}] 附加的属性信息
 * @returns {PolygonFeature} Voronoi多边形
 */
AnalyserUtil.polygonToVoronoi = function(positions, cellSize, options = {}) {
    positions = formatTurfPolygonPoints(positions)
    const pg = polygon([positions.map(_ => [_.lon, _.lat])]);
    const box = bbox(pg);
    options.mask = pg;
    const points = pointGrid(box, cellSize, options);
    return voronoi(points, {bbox: box});
}
/**
 * 将多边形分割三角形
 * @param {LonLat[]} positions 多边形顶点坐标
 * @param {number} cellSide 网格大小
 * @param {object} options 具有以下属性
 * @param {string} [options.units = 'kilometers'] cellSize的单位， 有效值为degrees, radians, miles, 或 kilometers
 * @param {object} [options.properties = {}] 附加的属性信息
 */
AnalyserUtil.triangleGrid = function(positions, cellSize, options = {}) {
    positions = formatTurfPolygonPoints(positions)
    const pg = polygon([positions.map(_ => [_.lon, _.lat])]);
    const box = bbox(pg);
    options.mask = pg;
    return triangleGrid(box, cellSize, options);
}
AnalyserUtil.getCartesians = function(positions) {
    if (!positions) return;
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
AnalyserUtil.getLonLats = function(positions) {
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
AnalyserUtil.getArea = function(positions) {
    const pg = polygon([positions]);
    return area(pg);
}
/**
 * 获得两个多边形相交的部分
 * @param {PolygonFeature} pg1 
 * @param {PolygonFeature} pg2 
 * @returns  {PolygonFeature} 两个多边形相交的部分
 */
AnalyserUtil.intersect = function(pg1, pg2) {
    return intersect(pg1, pg2);
}
/**
 * 获得点集的外接矩形
 * @param {*} positions 
 * @returns {PolygonFeature} 点集的外接矩形
 */
AnalyserUtil.bbox = function(positions) {
    positions = formatTurfPolygonPoints(positions)
    const pg = polygon([positions.map(_ => [_.lon, _.lat])]);
    const box = bbox(pg);
    return bboxPolygon(box);;
}

export default AnalyserUtil;
import LonLat from "./LonLat";

/**
 * 根据起来和终点，描述一条抛物线,抛物线方程为方程y=-(4h/L**2)*x**2+h
 * @param {LonLat} from 抛物线起点
 * @param {LonLat} to 抛物线终点
 * @param {number} [height=5000] 最高点高度
 * @param {number} [count=50] 点集数量
 * @returns {LonLat[]} 描述抛物线的点集 
 */
function getParabolaPoints(from, to, height = 5000, count = 50) {
    //方程y=-(4h/L**2)*x**2+h
    //上为顶点的高
    //L为横纵间距的较大者
    const h = height > 5000 ? height : 5000;
    const max = Math.abs(from.lon - to.lon) > Math.abs(from.lat - to.lat)
    const L = max
        ? Math.abs(from.lon - to.lon)
        : Math.abs(from.lat - to.lat)
    const num = count > 50 ? count : 50;
    const result = []
    let dlt = L / num;
    if (max) {
        const delLat = (to.lat - from.lat) / num;
        if (from.lon - to.lon > 0) {
            dlt = -dlt;
        }
        for (let i = 0; i < num; i++) {
            const tmpH = h - Math.pow((-0.5 * L + Math.abs(dlt) * i), 2) * 4 * h / Math.pow(L, 2);
            const lon = from.lon + dlt * i;
            const lat = from.lat + delLat * i;
            result.push([lon, lat, tmpH])
        }
    } else {
        const delLon = (to.lon - from.lon) / num;
        if (from.lat - to.lat > 0) {
            dlt = -dlt;
        }
        for (let j = 0; j < num; j++) {
            const tmpH = h - Math.pow((-0.5 * L + Math.abs(dlt) * j), 2) * 4 * h / Math.pow(L, 2);
            const lon = from.lon + delLon * j;
            const lat = from.lat + dlt * j
            result.push([lon, lat, tmpH])
        }
    }
    return result
}
export default getParabolaPoints;
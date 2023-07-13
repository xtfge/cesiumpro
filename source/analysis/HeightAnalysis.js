import Cartometry from "../core/Cartometry";
import LonLat from "../core/LonLat";
import AnalysisUtil from "./AnalysisUtil";
import BaseAnalysis from "./BaseAnalysis";

const {
    Cartographic
} = Cesium;

function computeHeight(positions, viewer, exclude = []) {
	let max = Number.MIN_SAFE_INTEGER;
	let min = Number.MAX_SAFE_INTEGER;
	let h = 0;
	positions.map(_ => {
		const height = viewer.scene.sampleHeight(_, exclude);
		if (isNaN(height)) {
			return;
		}
		if (height > max) {
			max = height
		}
		if (height < min) {
			min = height;
		}
		h += height;
	})
	return {
		max, min, avg: h / positions.length
	}
}
class HeightAnalysis extends BaseAnalysis {
    /**
     * 分析给定范围的的高度，获得最大高度，最小高度和平均高度
     * @extends BaseAnalysis
     * @param {*} viewer 
     * @param {object} options 具有以下属性
     * @param {number} [options.samplerSize] 采样间距，值越小获得的结果越准确，但是相应的性能开销会更大
     * @param {LonLat[]|Cesium.Cartesian3[]|number[]} 分析范围
     */
    constructor(viewer, options = {}) {
        super(viewer);
        this._samplerSize = options.samplerSzie;
        const position = AnalysisUtil.getCartesians(options.mask);
        this._mask = [...position, position[0]];
        this._type = 'height-analysis';
    }
    /**
     * 建议采样个数
     */
     static suggestGridCount = 300;
    /**
     * 开始分析
     * @param {Array} 分析高度时需要排除的对象
     * @returns {object} 最大高度，最小高度和平均高度
     */
    do(excludeObject = []) {
        this._check();
        this.preDo.raise({
            id: this._id,
            mask: this._mask
        })
        const area = Cartometry.surfaceArea(this._mask);
        const cellSize = Math.sqrt(area / 1e6 / HeightAnalysis.suggestGridCount);
        const polygon = AnalysisUtil.getLonLats(this._mask)
        this.samplerSize = this._samplerSize || cellSize;
        const grid = AnalysisUtil.polygonToGrid(polygon, this.samplerSize);
        const samplerPoints = grid.features.map(_ => Cartographic.fromDegrees(..._.geometry.coordinates));
        const { max, min, avg } = computeHeight(samplerPoints, this._viewer, excludeObject);
        this.postDo.raise({
            id: this._id,
            mask: this._mask,
            samplerSize: this.samplerSize
        })
        return { max, min, avg, samplerSize: this.samplerSize }
    }
}
export default HeightAnalysis;
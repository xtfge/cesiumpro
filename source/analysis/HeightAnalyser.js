import Cartometry from "../core/Cartometry";
import LonLat from "../core/LonLat";
import defaultValue from "../core/defaultValue";
import AnalyserUtil from "./AnalyserUtil";
import BaseAnalyser from "./BaseAnalyser";

const {
    Cartographic
} = Cesium;

function computeHeight(positions, viewer, exclude = []) {
	let max = Number.MIN_SAFE_INTEGER;
	let min = Number.MAX_SAFE_INTEGER;
	let h = 0;
	positions.map(_ => {
        let height;
		try {
            if (viewer.scene.globe.depthTestAgainstTerrain) {
                height = viewer.scene.sampleHeight(_, exclude);
            } else {
                height = viewer.scene.globe.getHeight(position);
            }            
        } catch (e) {
            height = viewer.scene.globe.getHeight(position);
        }
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
class HeightAnalyser extends BaseAnalyser {
    /**
     * 分析给定范围的的高度，获得最大高度，最小高度和平均高度
     * @extends BaseAnalyser
     * @param {*} viewer 
     * @param {object} options 具有以下属性
     * @param {boolean} [options.autoDepthTest = true] 准确的采样高度需要地球开启尝试测试，如果未开启，是否允许自动开启
     * @param {number} [options.samplerSize] 采样间距，单位米，值越小获得的结果越准确，但是相应的性能开销会更大, 如果未定义将自动计算
     * @param {LonLat[]|Cesium.Cartesian3[]|number[]} options.mask 分析范围
     */
    constructor(viewer, options = {}) {
        super(viewer);
        this._samplerSize = options.samplerSize ? options.samplerSize / 1e3 : undefined;
        this.autoDepthTest = defaultValue(options.autoDepthTest, true);
        const position = AnalyserUtil.getCartesians(options.mask);
        this._mask = [];
        if (position  && position.length) {
            this._mask = [...position, position[0]];
        }
        this._type = 'height-analysis';
    }
    /**
     * 采样间距，单位米
     */
    get samplerSize() {
        return this._samplerSize * 1000;
    }
    set samplerSize(val) {
        val = parseFloat(val);
        if (typeof val === 'number') {
            this._samplerSize = val / 1e3;
            // this.do();
        }    
    }
    get mask() {
        return this._mask.slice(0, this._mask.length - 1);
    }
    set mask(mask) {
        const position = AnalyserUtil.getCartesians(mask);
        if (position  && position.length) {
            this._mask = [...position, position[0]];
        }
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
        if (!this._mask.length) {
            return {};
        }
        this.preDo.raise({
            id: this._id,
            mask: this._mask
        })
        const depthTest = viewer.scene.globe.depthTestAgainstTerrain;
        if (depthTest === false && this.autoDepthTest) {
            viewer.scene.globe.depthTestAgainstTerrain = true;;
        }
        const area = Cartometry.surfaceArea(this._mask);
        const cellSize = Math.sqrt(area / 1e6 / HeightAnalyser.suggestGridCount);
        const polygon = AnalyserUtil.getLonLats(this._mask)
        const samplerSize = this._samplerSize || cellSize;
        const grid = AnalyserUtil.polygonToGrid(polygon, samplerSize);
        const samplerPoints = grid.features.map(_ => Cartographic.fromDegrees(..._.geometry.coordinates));
        const { max, min, avg } = computeHeight(samplerPoints, this._viewer, excludeObject);
        this.postAnalysis.raise({
            id: this._id,
            mask: this._mask,
            samplerSize: samplerSize * 1e3
        })
        if (depthTest === false && this.autoDepthTest) {
            viewer.scene.globe.depthTestAgainstTerrain = depthTest;;
        }
        return { max, min, avg, samplerSize: samplerSize }
    }
}
export default HeightAnalyser;
import CesiumProError from "../core/CesiumProError";
import checkViewer from "../core/checkViewer";
import defaultValue from "../core/defaultValue";
import Event from '../core/Event'
import guid from "../core/guid";
class BaseAnalysis {
    /**
     * 空间分析
     * @param {Cesium.Viewer} viewer viewer对象
     * @param {object} options 空间分析配置项
     */
    constructor(viewer, options = {}) {
        checkViewer(viewer);
        this._id = defaultValue(options.id, guid());
        this.options = options;
        this._viewer = viewer;
        this._doing = false;
        /**
         * 分析开始前触发的事件
         * @type {Event}
         * @readonly
         */
        this.preAnalysis = new Event();
        /**
         * @deprecated
         * 请使用preAnalysis
         */
        this.preDo = this.preAnalysis;
        /**
         * 分析完成后触发的事件
         * @type {Event}
         * @readonly
         */
        this.postAnalysis = new Event();
        /**
         * @deprecated
         * 请使用postAnalysis
         */
        this.postDo = this.postDo;

    }
    /**
     * @readonly
     * @type {string}
     * 空间分析类型
     */
    get type() {
        return this._type;
    }
    /**
     * 开始分析
     * @param {*} options 
     */
    do(options) {
       
    }
    isDestroyed() {
        return false;
    }
    _check() {
        if (this._doing) {
            throw new CesiumProError('上一次分析正在进行，请稍候...');
        }
        this._doing = true;
    }
}
export default BaseAnalysis;
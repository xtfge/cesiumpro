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
        this.postDo = this.postAnalysis;

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
    //    throw new CesiumProError("abstract method cannot be called");
        if (this._doing) {
            throw new CesiumProError("当前有正在分析的任务，请稍候再试");
        }
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
    clear() {
        
    }
    /**
     * 销毁对象
     */
    destroy() {
        this.clear();
        destroyObject(this);
    }
}
export default BaseAnalysis;
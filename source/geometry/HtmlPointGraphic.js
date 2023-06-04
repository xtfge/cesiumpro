import CesiumProError from '../core/CesiumProError';
import Graphic from '../core/Graphic';
import LonLat from '../core/LonLat'
const {
    DistanceDisplayCondition
} = Cesium;
class HtmlPointGraphic extends Graphic{
    /**
     * 渲染一个点，其内容是一个HTML元素
     * @param {object} options 具有以下属性
     * @param {HTMLElement} options.el DOM元素
     * @param {Cesium.Cartesian3|LonLat} options.position 位置
     * @param {Cesium.DistanceDisplayCondition} [options.distanceDisplayCondition]
     */
    constructor(options) {
        if (options.el instanceof HTMLElement === false) {
            throw new CesiumProError('options.el parameter is invalid.');
        }
        super(options);
        this._clampToGround = undefined;
        this._asynchronous = undefined;
        this._distanceDisplayCondition = options.distanceDisplayCondition;
        this.createGraphic();
    }
    get clampToGround() {
        return undefined;
    }
    set clampToGround(val) {
        throw new CesiumProError('HtmlPointGraphic is not support clampToGround.')
    }
    get asynchronous() {
        return undefined;
    }
    set asynchronous(val) {
        throw new CesiumProError('HtmlPointGraphic is not support asynchronous.')
    }
    get color() {
        return undefined
    }
    set color(val) {
        throw new CesiumProError('HtmlPointGraphic is not support color.')
    }
    set show(val) {
        if (this.el) {
            this.display = val ? 'block': 'none' 
        }
        this._show = val;
    }
    /**
     * 设置点要素的可见高度
     * // 高度小于1000时显示该点
     * point.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(0, 1000)
     */
    get distanceDisplayCondition() {
        return this._distanceDisplayCondition;
    }
    set distanceDisplayCondition(val) {
        this._distanceDisplayCondition = val;
    }
    
    /**
     * 获得或设置要素位置
     */
     get position() {
        return this._position;
    }
    set position(val) {
        this._definedChanged.raise('position', val, this._position);
        this._position = val;
    }
    createGraphic() {
        this.el = this._options.el;
        this.el.id = this._id;
        this.el.style.position = 'absolute';
        this._position = this._options.position;
        this.updatePrimitive();
    }
    updatePrimitive() {
        if (this._allowPicking) {
            this.el.style.pointerEvents = 'auto'
        } else {
            this.el.style.pointerEvents = 'none'
        }
    }
    /**
     * 将图形要素直接添加到指定viewer
     * @param {Viewer} viewer viewer对象
     */
     addTo(viewer) {
        if (!defined(this.primitive)) {
            return;
        }
        viewer.htmlGraphicGroup.add(this);
    }
    /**
     * 从场景移除对象
     * @param {*} graphic 
     * @returns 
     */
    remove() {
        if(this.group) {
            this.group.remove(this);
            return this;
        }
    }
    /**
     * 定位到对象
     * @returns {Promise}
     */
    zoomTo() {
        if (!this._viewer) {
            return;
        }
        return this._viewer.flyTo(this.position);
    }
    updateStyle(styleKey, styleValue) {
        this.el.style[styleKey] = styleValue;
    }
    addClass(cls) {
        this.el.classList.add(cls)
    }
}
export default HtmlPointGraphic;
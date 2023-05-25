import CesiumProError from "../core/CesiumProError";
import defaultValue from "../core/defaultValue";
const {
    ScreenSpaceEventHandler,
    ScreenSpaceEventType
} = Cesium;
class DivGraphic {
    /**
     * 数据内容在Div中呈现, 位置和球绑定
     */
    constructor(options = {}) {
        if (!options.position) {
            throw new CesiumProError("paramerter position must be provided.")
        }
        if (!options.element) {
            throw new CesiumProError("parameter element must be provided.");
        }
        this._show = defaultValue(options.show, true);
        this._element = element;
    }
    get show() {
        return this._show;
    }
    set show(val) {
        this._show = val;
        this._element.style.display = val ? "block" : "none";
    }
    /**
     * 与该图形绑定的Element。
     * @readonly
     * @type {Element}
     */
    get element() {
        return this.element;
    }
    // todo
    
}

export default DivGraphic
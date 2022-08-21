import Event from './Event';
import defined from './defined'
import defaultValue from './defaultValue';
import createGuid from './createGuid';
class Graphic{
    /**
     * 所有CesiumPro自定义图形基类
    */
    constructor(options) {
        this._options = options;
        this._id = defaultValue(options.id, createGuid());
        this._primitive = null;
        this._oldPrimitive = null;
        this._definedChanged = new Event();
        this._clampToGround = defaultValue(!!options.clampToGround, false);
        this._show = defaultValue(!!options.show, true);
        this._removed = false;
    }
    /**
     * 图形id，如果创建图形时定义了id，该属性将会被拾取到
     * @readonly
     * @type {*}
     */
    get id() {
        return this._id;
    }
    /**
     * 获取或设置图形是否贴地
     * @type {Boolean}
     */
    get clampToGround() {
        return this._clampToGround;
    }
    set clampToGround(val) {
        if (val !== this._clampToGround) {
            this.oldPrimitive = this.primitive;
            const options = Object.assign({}, this._options, {clampToGround: val, asynchronous: false})
            this._primitive = (new this.constructor(options)).primitive;
        }
        this._clampToGround = val;
    }
    /**
     * 显示或隐藏图形
     * @type {Boolean}
     */
    get show() {
        return this._show;
    }
    set show(val){
        if (val === this._show) {
            return
        }
        this.definedChanged.raise('show', v, this._show)
        this._show = val;
        this.primitive && (this.primitive.show = val);
    }
    /**
     * 图形对象，包含了渲染图形所老百姓的几何信息和材质
     * @readonly
     */
    get primitive() {
        return this._primitive;
    }
    /**
     * 要素的属性发生变化时触发的事件。
     * 事件订阅者接收3个参数，第一个是发生变化的属性，第二是个变化后的属性，
     * 第三个是变化前的属性
     */
    get definedChanged() {
        return this._definedChanged;
    }
    toJson() {
        if(!defined(this.primitive)) {
            return;
        }
    }
    /**
     * 更新要素外观材质相关的属性
     * @private
     * @param {*} k 
     * @param {*} v 
     */
    updateAttribute(k, v) {
        if (!this.primitive) {
            return;
        }
        const appearance = this.primitive.appearance;
        const material = appearance.material;
        if (!material) {
            return;
        }
        const uniforms = material.uniforms;
        if (!uniforms) {
            return;
        }
        uniforms[k] = v;
    }
    /**
     * 将图形要素直接添加到指定viewer
     * @param {Viewer} viewer viewer对象
     */
    addTo(viewer) {
        if (!defined(this.primitive)) {
            return;
        }
        this._viewer = viewer;
        viewer.graphicGroup.add(this);
    }
    /**
     * 将当前要素从场景中移除
     * @returns 被移除的要素
     */
    remove() {
        if (!defined(this.primitive)) {
            return;
        }
        if (this._viewer) {
            this.group.remove(this);        
            return this;
        }
    }
}
export default Graphic
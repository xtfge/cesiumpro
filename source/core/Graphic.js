import Event from './Event';
import defined from './defined'
import defaultValue from './defaultValue';
import createGuid from './createGuid';
class Graphic {
    /**
     * 所有CesiumPro自定义图形基类
    */
    constructor(options) {
        this._options = defaultValue(options, {});
        this._id = defaultValue(options.id, createGuid());
        this._primitive = null;
        this._oldPrimitive = null;
        this._definedChanged = new Event();
        this._loadEvent = new Event();
        this._clampToGround = defaultValue(!!options.clampToGround, false);
        this._show = defaultValue(options.show, true);
        this._removed = false;
        this._allowPicking = defaultValue(options.allowPicking, true);
        this._property = options.property;
    }
    /**
     * 图形id，可以使用它获取图形
     * @readonly
     * @type {String}
     * @example 
     * const graphic = new CesiumPro.CircleScanGraphic({
     *   id: "xxx",
     *   position: new CesiumPro.LonLat(lon , lat + 0.05),
     *   radius: 1000,
     *   color: '#FF0000',
     *   speed: 10,
     *   clampToGround: parameters['贴地'],
     *   property: {
     *       name: "贴地圆",
     *       color: 'red',
     *   }
     * );
     * graphic.addTo(viewer);
     * viewer.graphicGroup.get('xxx');
     */
    get id() {
        return this._id;
    }
    /**
     * 图形的属性信息，当元素被拾取的时候该属性会通过id字段返回
     * @type {any}
     */
    get property() {
        return this._property;
    }
    /**
     * 获得或设置图形是否允许被拾取
     * @type {Boolean}
     */
    get allowPicking() {
        return this._allowPicking;
    }
    set allowPicking(v) {
        if ((!!v) !== this._allowPicking) {
            this.definedChanged.raise('allowPicking', v, this._allowPicking)
            this._allowPicking = v;
            this.updatePrimitive && this.updatePrimitive();
        }
    }
    /**
     * 获取或设置图形是否贴地
     * @type {Boolean}
     */
    get clampToGround() {
        return this._clampToGround;
    }
    set clampToGround(val) {
        if (val === this._clampToGround) {
            return
            
        }
        // this.oldPrimitive = this.primitive;
        // const options = Object.assign({}, this._options, { clampToGround: val, asynchronous: false });
        // this._primitive = (new this.constructor(options)).primitive;
        this.definedChanged.raise('clampToGround', val, this._clampToGround);        
        this._clampToGround = val;
        this.updatePrimitive();
    }
    /**
     * 显示或隐藏图形
     * @type {Boolean}
     */
    get show() {
        return this._show;
    }
    set show(val) {
        if (val === this._show) {
            return
        }
        this.definedChanged.raise('show', val, this._show)
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
    /**
     * 得到一个promise对象，指示图形是否创建完成
     * @type {Promise}
     */
    get readyPromise() {
        if (!this.primitive) {
            return new Primise();
        }
        return this.primitive.readyPromise;
    }
    /**
     * @private
     */
    get material() {
        if (this.primitive) {
            return this.primitive.appearance.material;
        }
    }
    toJson() {
        if (!defined(this.primitive)) {
            return;
        }
        return JSON.parse(JSON.stringify(this._options))
    }
    /**
     * @private
     */
    update() { }
    /**
     * 更新要素外观材质相关的属性
     * @private
     * @param {*} k 
     * @param {*} v 
     */
    updateAttribute(k, v) {
        if (this.isDestroyed()) {
            return;
        }
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
        viewer.graphicGroup.add(this);
    }
    zoomTo() { }
    /**
     * 将当前要素从场景中移除
     * @returns 被移除的要素
     */
    remove() {
        if (!defined(this.primitive)) {
            return;
        }
        if (this.group) {
            this.group.remove(this);
            return this;
        }
    }
    isDestroyed() {
        return false;
    }
    destroy() { 
        this.remove()       
        if (this.primitive && !this.primitive.isDestroyed()) {            
            this.primitive.destroy();
            this.primitive = undefined;
        }
        Cesium.destroyObject(this);
    }
}
export default Graphic
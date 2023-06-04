import HtmlPointGraphic from "../geometry/HtmlPointGraphic";
import CesiumProError from "./CesiumProError";
import GraphicGroup from "./GraphicGroup";
import LonLat from "./LonLat";
import destroyObject from './destroyObject'
import defaultValue from "./defaultValue";
import Event from "./Event";

class HtmlGraphicGroup extends GraphicGroup {
    /**
     * 创建HtmlGraphic图形集合
     * @extends GraphicGroup
     * @param {Cesium.Viewer} viewer 
     * @param {object} options 具有以下发展 
     * @param {boolean} [options.allowPicking = false] 是否开启鼠标拾取
     */
    constructor(viewer, options = {}) {
        super(viewer);
        this._viewer = viewer;
        this._allowPicking = defaultValue(options.allowPicking, false);
        this._createRoot();
        this._addEventListener();
        /**
         * 元素被选中时触发的事件
         * @type {Event}
         * @readonly
         */
        this.selectedEvent = new Event();
    }
    /**
     * @private
     */
    _createRoot() {
        const root = document.createElement('div');
        root.style.position = 'absolute';
        root.style.zIndex = 9999;
        root.style.pointerEvents = 'none';
        root.style.width = '100vw';
        root.style.height = '100vh';
        root.style.left = 0;
        root.style.top = 0;
        this._viewer.container.appendChild(root);
        this.root = root;
    }
    _addEventListener() {
        const removeEventListener = this._viewer.scene.postRender.
        addEventListener(() => {
            const array = this.values._array;
            const height = viewer.camera._positionCartographic.height;
            for (let graphic of array) {
                const position = graphic.position;
                const el = graphic.el;
                if (!el) {
                    return;
                }
                const screenPosition = LonLat.toPixel(position, this._viewer.scene);
                if (screenPosition && LonLat.isVisible(position, this._viewer)) {
                    
                    el.style.left = screenPosition.x + 'px';
                    el.style.top = screenPosition.y + 'px'
                    if (graphic.distanceDisplayCondition) {
                        const { near, far } = graphic.distanceDisplayCondition;
                        if (height < far && height > near) {
                            el.style.display = graphic.display || 'block'
                        } else {
                            el.style.display = 'none'
                        }
                    } else {
                        el.style.display = graphic.display || 'block'
                    }
                } else {
                    el.style.display = 'none';
                }
            }
        })
        const self = this;
        function listenClick(e) {
            const { target } = e;
            if (!target) {
                return;
            }
            const graphic = self.getById(target.id);
            self.selectedEvent.raise(graphic)
        }
        this.root.addEventListener('click', listenClick);
        this.removeEventListener = function() {
            removeEventListener();
            self.root.removeEventListener('click', listenClick);
        }
    }
    add(object) {
        if (object instanceof HtmlPointGraphic) {
            this.values.set(object.id, object);
            this.root.appendChild(object.el);
            object.group = this;
            object._loadEvent.raise();
        } else {
            throw new CesiumProError(object + 'is not a html graphic.')
        }
    }
    /**
     * 移除对象
     * @param {*} graphic 
     */
    remove(object) {
        this.values.remove(object.id);
        if (object.el) {
            this.root.removeChild(object.el);
        }
    }
    /**
     * 根据id返回要素
     * @param {string} graphicId 
     * @returns 
     */
    getById(graphicId) {
        return this.values.get(graphicId);
    }
    /**
     * 根据id移除对象
     * @param {string} graphicId 
     */
     removeById(graphicId) {
        const graphic = this.values.get(graphicId);
        this.remove(graphic);
    }
    /**
     * 清空该集合
     */
     clear() {
        const values = [...this.values._array];        
        for (let val of values) {
            val.remove()
        }
        this.values.removeAll();
    }
    /**
     * 销毁对象
     */
    destroy() {
        this._viewer.container.removeChild(this.root);
        this.removeEventListener();
        destroyObject(this);
    }
    get boundingSphere() {
        const pts = this.values._array.map(_ => LonLat.toCartesian(_.position));
        return Cesium.BoundingSphere.fromPoints(pts);
    }
}
export default HtmlGraphicGroup;
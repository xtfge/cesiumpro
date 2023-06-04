import createGuid from "./createGuid";
import defined from "./defined";
import Graphic from "./Graphic";

const { AssociativeArray, PrimitiveCollection } = Cesium;
class GraphicGroup {
    /**
     * graphic 集合
     * @param {*} viewer 
     */
    constructor(viewer) {
        this.values = new AssociativeArray();
        this.id = createGuid();
        this.viewer = viewer;
        this.root = new PrimitiveCollection();
        this.root.name = 'graphicGroup'
        viewer.scene.primitives.add(this.root)
    }
    /**
     * 添加一个图形对象
     * @param {Graphic|GraphicGroup} object 
     */
    add(object) {
        if (object instanceof GraphicGroup) {
            this.values.set(object.id, object);
            this.root.add(object.root);
        }
        if (object instanceof Graphic) {
            this.values.set(object.id, object);
            if (object.primitive) {
                this.root.add(object.primitive);
            }
            object._viewer = this.viewer;
            object.group = this;
            object._loadEvent.raise();
        }
    }
    get(graphicId) {
        return this.values.get(graphicId);
    }
    /**
     * 根据id获得图形对象
     * @param {string} id 
     * @returns 
     */
    getById(id) {
        return this.get(id);
    }
    /**
     * 移除一个图形对象
     * @param {Graphic} graphic 
     */
    remove(graphic) {
        this.values.remove(graphic.id);
        if (graphic instanceof GraphicGroup) {
            graphic.clear();
            this.root.remove(graphic.root);
        }
        if (graphic.primitive) {
            this.root.remove(graphic.primitive);
        }
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
     * 判断该集合是否包含指定对象
     * @param {*} object 
     * @returns 
     */
    has(object) {
        return this.values.contains(object);
    }
    update(time) {
        const values = this.values._array;
        for (let val of values) {
            // if (defined(val.oldPrimitive)) {
            //     this.viewer.primitives.remove(val.oldPrimitive);
            //     this.viewer.primitives.add(val.primitive);
            //     val.oldPrimitive = null;
            // }
            val.update(time);
        }
    }
    /**
     * 清空该集合
     */
    clear() {
        const values = [...this.values._array];        
        for (let val of values) {
            val.destroy();
        }
        this.root.removeAll();
        this.values.removeAll();
    }
}
export default GraphicGroup;
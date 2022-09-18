import createGuid from "./createGuid";
import defined from "./defined";
import Graphic from "./Graphic";

const { AssociativeArray } = Cesium;
class GraphicGroup {
    constructor(viewer) {
        this.values = new AssociativeArray();
        this.id = createGuid();
        this.viewer = viewer;
    }
    add(object) {
        if (object instanceof GraphicGroup) {
            this.values.set(object.id, object);
        }
        if (object instanceof Graphic) {
            this.values.set(object.id, object);
            if (object.primitive) {
                this.viewer.primitives.add(object.primitive);
            }
            object._viewer = this.viewer;
            object.group = this;
        }
    }
    get(graphicId) {
        return this.values.get(graphicId);
    }
    remove(graphic) {
        this.values.remove(graphic.id);
        if (graphic instanceof GraphicGroup) {
            graphic.clear();
        }
        if (graphic.primitive) {
            this.viewer.primitives.remove(graphic.primitive);
        }
        graphic.destroy()
    }
    removeById(graphicId) {
        const graphic = this.values.get(graphicId);
        this.remove(graphic);
    }
    has(object) {
        return this.values.contains(object);
    }
    update(time) {
        const values = this.values._array;
        for (let val of values) {
            if (defined(val.oldPrimitive)) {
                this.viewer.primitives.remove(val.oldPrimitive);
                this.viewer.primitives.add(val.primitive);
                val.oldPrimitive = null;
            }
            val.update(time);
        }
    }
    clear() {
        const values = this.values._array;
        this.values.removeAll();
        for (let val of values) {
            if (val.primitive) {
                this.viewer.primitives.remove(val.primitive);
            }
        }
    }
}
export default GraphicGroup;
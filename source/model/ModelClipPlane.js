/*
 * clip model,include gltf and 3ctileset
 */
import checkViewer from '../core/checkViewer';
import ClipPlaneType from './ClipPlaneType';

class ModelClipPlane {
  /**
      *
      * @param {Model|Cesium3dTileset} model
      * @param {*} options
      * @param {Number} [options.distance] 剖切的距离
      */
  constructor(viewer, model, options = {}) {
    checkViewer(viewer);
    this._viewer = viewer;
    this._model = model;
    this._options = options;
    this._type = options.type;
    this._distance = options.distance;
    this._clippingPlanes = undefined;
  }

  get model() {
    return this._model;
  }

  set model(v) {
    this._model = v;
  }

  get planes() {
    return this._clippingPlanes;
  }

  get type() {
    return this._type;
  }

  set type(v) {
    this._type = v;
    this.createPlane(v);
  }

  get distance() {
    return this._distance;
  }

  set distance(v) {
    v = v || 0;
    this._distance = v;
    this.update();
  }

  get showAxis() {
    return this._showAxis;
  }

  set showAxis(v) {
    this._showAxis = v;
    this.axis.showReference = v;
  }

  /**
       *
       * @param {*} type 剖切类型
       * @param {*} distance 剖切距离
       * @param {*} clear 是否清除上一个剖切面
       */
  createPlane(type = this.type, distance = this.distance, clear = true) {
    clear && this.clear();
    let plane;
    switch (type) {
      case ClipPlaneType.Z:
        plane = [new Cesium.ClippingPlane(new Cesium.Cartesian3(0, 0, 1), distance)];
        break;
      case ClipPlaneType.ZR:
        plane = [new Cesium.ClippingPlane(new Cesium.Cartesian3(0, 0, -1), distance)];
        break;
      case ClipPlaneType.X:
        plane = [new Cesium.ClippingPlane(new Cesium.Cartesian3(1, 0, 0), distance)];
        break;
      case ClipPlaneType.XR:
        plane = [new Cesium.ClippingPlane(new Cesium.Cartesian3(-1, 0, 0), distance)];
        break;
      case ClipPlaneType.Y:
        plane = [new Cesium.ClippingPlane(new Cesium.Cartesian3(0, 1, 0), distance)];
        break;
      case ClipPlaneType.YR:
        plane = [new Cesium.ClippingPlane(new Cesium.Cartesian3(0, -1, 0), distance)];
        break;
      default:
        break;
    }
    if (this._clippingPlanes) {
      this._clippingPlanes.add(plane[0]);
    } else {
      const planeCollection = new Cesium.ClippingPlaneCollection({
        planes: plane,
        edgeWidth: this._options.edgeWidth || 0,
      });
      this._clippingPlanes = planeCollection;
    }
    this.model.clippingPlanes = this._clippingPlanes;
  }

  clear() {
    this.model.clippingPlanes && (this.model.clippingPlanes.enabled = false);
    if (this.planes) {
      this.planes.destroy();
      delete this._clippingPlanes;
      this.model.clippingPlanes = undefined;
    }
  }

  destroy() {
    this.clear();
    this._viewer.scene.primitives.remove(this.axis);
    this._viewer = undefined;
    this.axis.destroy();
  }

  update() {
    if (this.planes) {
      for (let i = 0; i < this.planes.length; i++) {
        const plane = this.planes.get(i);
        plane.distance = this.distance;
      }
    }
  }

  createAxis() {
    const { MeshVisualizer } = Cesium;
    const axisOption = this._options.axis;
    const meshVisualizer = new MeshVisualizer({
      modelMatrix: this._model.modelMatrix,
      up: { z: 1 },
      referenceAxisParameter: axisOption,
      showReference: this._options.showAxis || false,
    });
    this._viewer.scene.primitives.add(meshVisualizer);
    this.axis = meshVisualizer;
  }

  updateAxis() {
    if (this.axis) {
      this._viewer.scene.primitives.remove(this.axis);
    }
    this.createAxis();
  }
}
export default ModelClipPlane;

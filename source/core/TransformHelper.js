import AxisPlane from "./AxisPlane";
import LonLat from "./LonLat";
import dashArrowShader from "../shader/polylineAntialiasingMaterial";
import Model from "../scene/Model";
import CesiumProError from "./CesiumProError";
import Event from "./Event";
const {
  PrimitiveCollection,
  PolylineCollection,
  Material,
  Color,
  defaultValue,
  Cartesian3,
  Cartesian2,
  Matrix4,
  Matrix3,
  Quaternion,
  PointPrimitiveCollection,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Polyline,
  Primitive,
  Math: CesiumMath,
  Plane,
  Model: CesiumModel,
  IntersectionTests,
  Transforms
} = Cesium;
const _offset = new Cartesian3();
const _q = new Quaternion();
const rm3 = new Matrix3();
const cartesian3_1 = new Cartesian3();
const cartesian3_2 = new Cartesian3();
const mat4 = new Matrix4();
const mat4_1 = new Matrix4();

function setColorForPrimitive(geometry, color) {
  if (geometry instanceof Polyline) {
    geometry.material.uniforms.color = color;
  } else if (geometry instanceof Primitive) {
    geometry.appearance.material.uniforms.color = color;
  }
}
function projectInAxis(normal, vector) {
  Cartesian2.normalize(normal, normal);
  return Cartesian2.dot(normal, vector);
}
function getPositionInPlane(pixel, helper) {
  const mousedownCartesian = new Cartesian3();
  const ray = viewer.camera.getPickRay(pixel);
  const plane = new Plane(Cartesian3.UNIT_X, 0.0);;
  Plane.fromPointNormal(helper.center, helper.activePrimitive.normal, plane);
  Plane.transform(plane, helper._modelMatrix, plane);
  IntersectionTests.rayPlane(ray, plane, mousedownCartesian);
  Matrix4.multiplyByPoint(helper._inverseModelMatrix, mousedownCartesian, mousedownCartesian);
  return mousedownCartesian;
}
const cartesian2_1 = new Cartesian2();
const cartesian2_2 = new Cartesian2();
function computeAngle(helper, startPosition, endPosition) {
  const center = helper.center;
  // const pixelCenter = LonLat.toPixel(center, helper._viewer);
  Cartesian3.subtract(startPosition, center, startPosition);
  Cartesian3.subtract(endPosition, center, endPosition);
  const angle = Cartesian3.dot(Cartesian3.normalize(startPosition, startPosition),
    Cartesian3.normalize(endPosition, endPosition));
  // 旋转起点和终点的向量
  const v1 = Cartesian3.subtract(startPosition, endPosition, cartesian3_1);
  const v2 = startPosition;
  const cross = Cartesian3.cross(v1, v2, cartesian3_1);
  const normal = helper.activePrimitive.normal;
  // 旋转平面的法线向量
  // const v2 = Cartesian2.subtract(center, normal, cartesian2_2);
  const sign = CesiumMath.sign(Cartesian3.dot(cross, normal));
  return Math.acos(angle) * sign;
}
function computeOffset(helper, startPosition, endPosition, offset) {
  const activeAxis = helper.activePrimitive.relativeAxis || [
    helper.activePrimitive,
  ];
  if (!Array.isArray(activeAxis)) {
    return;
  }
  const cameraHeight = helper._viewer.camera.positionCartographic.height;
  const delta = cameraHeight / 1047;
  for (let axis of activeAxis) {
    const positions = axis.positions;
    const cartList = positions.map((_) =>
      Matrix4.multiplyByPoint(helper._modelMatrix, _, new Cartesian3())
    );
    const pixelList = cartList.map((_) => LonLat.toPixel(_, helper._viewer.scene));
    const length = projectInAxis(
      Cartesian2.subtract(...pixelList, cartesian2_1),
      Cartesian2.subtract(endPosition, startPosition, cartesian2_2)
    );
    offset[axis.axis.toLowerCase()] = length * delta;
  }
  return offset;
}
const EModel = {
  N: 'None', // none
  T: 'T', // 移动
  R: 'R', // 旋转
  S: 'S', // 缩放
};
class TransformHelper {
  /**
   * 模型编辑控制器，虽然它也适用于点元素
   * @param {object} [options] 具有以下属性
   * @param {number} [options.lineWidth = 15] 线宽
   * @param {Cesium.Color} [options.xAxisColor = Cesium.Color.RED] X轴的颜色
   * @param {Cesium.Color} [options.yAxisColor = Cesium.Color.GREEN] Y轴颜色
   * @param {Cesium.Color} [options.zAxisColor = Cesium.Color.BLUE] Z轴颜色
   * @param {Cesium.Color} [options.scaleAxisColor = Cesium.Color.WHITE] 缩放轴的颜色
   * @param {Cesium.Color} [options.activeAxisColor = Cesium.Color.YELLOW] 被激活的坐标标轴颜色
   * @param {boolean} [options.translateEnabled = true] 是否创建平移控制器
   * @param {boolean} [options.rotateEnabled = false] 是否创建旋转控制器，仅对模型可用
   * @param {boolean} [options.scaleEnabled = false] 是否创建缩放控制器，仅对模型有效
   * @param {number} [options.xAxisLength] X轴的长度, 如果未定义将自动计算
   * @param {number} [options.yAxisLength] Y轴的长度，如果未定义将自动计算
   * @param {number} [options.zAxisLength] Z轴长度，如果未定义将自动计算
   * @param {number} [options.scaleAxisLength] 缩放轴的长度，如果未定义将自动计算
   * @param {number} [options.rotatePlaneRadius] 旋转轴的半径，如果未定义将自动计算
   * @param {boolean} [options.sizeInPixel = false] 控制器的大小是否以像素为单位
   * @param {number} [options.radiusRatio = 1] 如果没有为坐标轴指定长度，将使用模型boundingSphere的半径乘该系数作长度
   * @param {Cesium.Cartesian3} [options.originOffset = Cesium.Cartesian3.ZERO] 默认原点在点或模型的中心位置，该值设置相对于默认位置的偏移
   * 
   * @example
   * const helper = new CesiumPro.TransformHelper({            
   *     rotateEnabled: true,
   *     translateEnabled: true,
   *     scaleEnabled: true,
   *     xAxisLength: 10,
   *     yAxisLength: 10,
   *     zAxisLength: 10,
   *     scaleAxisLength: 10,
   *     rotatePlaneRadius: 8
   * });
   * 
   * helper.addTo(viewer);
   * helper.bind(model);
   */
  constructor(options = {}) {
    this.lineWidth = defaultValue(options.lineWidth, 15);
    this.xAxisColor = defaultValue(options.xAxisColor, Color.RED);
    this.yAxisColor = defaultValue(options.yAxisColor, Color.GREEN);
    this.zAxisColor = defaultValue(options.zAxisColor, Color.BLUE);
    this.scaleAxisColor = defaultValue(options.scaleAxisColor, Color.WHITE);
    this.activeAxisColor = defaultValue(options.activeAxisColor, Color.YELLOW);
    this._translateEnabled = defaultValue(options.translateEnabled, true);
    this._rotateEnabled = defaultValue(options.rotateEnabled, false);
    this._scaleEnabled = defaultValue(options.scaleEnabled, false);
    this._radiusRatio = defaultValue(options.radiusRatio, 1);
    this.xAxisLength = options.xAxisLength;
    this.yAxisLength = options.yAxisLength;
    this.zAxisLength = options.zAxisLength;
    this.scaleAxisLength = options.scaleAxisLength;
    this.root = new PrimitiveCollection();
    this.object = null;
    this._modelMatrix = undefined;
    this._primitives = [];
    this._center = new Cartesian3();
    this._radius = 0;
    this._originOffset = defaultValue(options.originOffset, new Cartesian3());
    this._selectedPrimitives = [];
    this._offset = new Cartesian3(0, 0, 0);
    this._angle = 0;
    this.rotatePlaneRadius = options.rotatePlaneRadius;
    this._mode = EModel.N;
    /**
     * 位置或姿态发生变化前解发的事件
     * @type {Event}
     */
    this.preTranformEvent = new Event();
    /**
     * 位置或姿态发生变化后触发的事件
     * @type {Event}
     */
    this.postTransformEvent = new Event();
  }
  /**
   * 获得或设置平移控件是否显示
   * @type {boolean}
   */
  get translateEnabled() {
    return this._translateEnabled;
  }
  set translateEnabled(val) {
    this._translateEnabled = val;
    for (let primitive of this._primitives) {
      const axis = primitive.axis;
      if (!axis) {
        continue;
      }
      if (!(axis.includes(EModel.R) || axis.includes(EModel.S))) {
        primitive.show = val;
      }
    }
  }
  /**
   * 获得或设置旋转控件是否显示
   * @type {boolean}
   */
  get rotateEnabled() {
    return this._rotateEnabled;
  }
  set rotateEnabled(val) {
    this._rotateEnabled = val;
    for (let primitive of this._primitives) {
      const axis = primitive.axis;
      if (!axis) {
        continue;
      }
      if (axis.includes(EModel.R)) {
        primitive.show = val;
      }
    }
  }
  /**
   * 获得或设置缩放控件是否显示
   * @type {boolean}
   */
  get scaleEnabled() {
    return this._scaleEnabled;
  }
  set scaleEnabled(val) {
    this._scaleEnabled = val;
    for (let primitive of this._primitives) {
      const axis = primitive.axis;
      if (!axis) {
        continue;
      }
      if (axis.includes(EModel.S)) {
        primitive.show = val;
      }
    }
  }
  /**
   * 中心位置的坐标
   * @type {Ceium.Cartesian3}
   */
  get center() {
    return Cartesian3.add(this._center, this._originOffset, new Cartesian3());
  }
  /**
   * 模型矩阵
   * @type {Cesium.Matrix4}
   */
  get modelMatrix() {
    return this._modelMatrix;
  }
  set modelMatrix(matrix) {
    if (!matrix) {
      this._modelMatrix = undefined;
      this._inverseModelMatrix = undefined;
      return;
    }
    this._modelMatrix = matrix;
    this._inverseModelMatrix = Matrix4.inverse(matrix, new Matrix4);
  }
  /**
   * 创建XYZ坐标轴
   * @private
   * @param {*} boundingSphere
   */
  createMoveAxis() {
    if (!this.center) {
      return;
    }
    const lineLength = this._radius * this._radiusRatio;
    const plc = this.axisRoot;
    const center = this.center;
    this.xAxis = plc.add({
      positions: [
        center,
        new Cartesian3(
          defaultValue(this.xAxisLength, lineLength) + center.x,
          center.y,
          center.z
        ),
      ],
      width: this.lineWidth,
      material: this.getAxisMaterial(this.xAxisColor),
    });
    this.xAux = plc.add({
      positions: [],
      width: this.lineWidth,
      material: this.getAxisMaterial(this.activeAxisColor, true),
    });
    this.xAxis.axis = "X";
    this.xAxis.color = this.xAxisColor;
    this.yAxis = plc.add({
      positions: [
        center,
        new Cartesian3(
          center.x,
          -(defaultValue(this.yAxisLength, lineLength)) + center.y,
          center.z
        ),
      ],
      width: this.lineWidth,
      material: this.getAxisMaterial(this.yAxisColor),
    });
    this.yAux = plc.add({
      positions: [],
      width: this.lineWidth,
      material: this.getAxisMaterial(this.activeAxisColor, true),
    });
    this.yAxis.axis = "Y";
    this.yAxis.color = this.yAxisColor;
    this.zAxis = plc.add({
      positions: [
        center,
        new Cartesian3(
          center.x,
          center.y,
          defaultValue(this.zAxisLength, lineLength) + center.z
        ),
      ],
      width: this.lineWidth,
      material: this.getAxisMaterial(this.zAxisColor),
    });
    this.zAux = plc.add({
      positions: [],
      width: this.lineWidth,
      material: this.getAxisMaterial(this.activeAxisColor, true),
    });
    this.zAxis.axis = "Z";
    this.zAxis.color = this.zAxisColor;
    this._primitives.push(this.xAxis, this.yAxis, this.zAxis);
  }
  /**
   * 创建坐标平面
   * @private
   */
  createAxisPlane() {
    this.XOYPlane = this.root.add(
      new AxisPlane({
        color: this.zAxisColor,
        modelMatrix: this.modelMatrix,
        center: this.center,
        radius: this._radius,
        normal: new Cartesian3(0, 0, 1),
        axis: "XY",
      })
    );
    this.XOYPlane.relativeAxis = [this.xAxis, this.yAxis];
    this.XOZPlane = this.root.add(
      new AxisPlane({
        color: this.yAxisColor,
        modelMatrix: this.modelMatrix,
        center: this.center,
        radius: this._radius,
        normal: new Cartesian3(0, 1, 0),
        axis: "XZ",
      })
    );
    this.XOZPlane.relativeAxis = [this.xAxis, this.zAxis];
    this.YOZPlane = this.root.add(
      new AxisPlane({
        color: this.xAxisColor,
        modelMatrix: this.modelMatrix,
        center: this.center,
        radius: this._radius,
        normal: new Cartesian3(1, 0, 0),
        axis: "YZ",
      })
    );
    this.YOZPlane.relativeAxis = [this.yAxis, this.zAxis];
    this._primitives.push(this.XOYPlane, this.YOZPlane, this.XOZPlane);
  }
  /**
   * 创建坐标原点
   * @private
   */
  createOrignPoint() {
    const pc = new PointPrimitiveCollection({
      modelMatrix: this.modelMatrix,
    });
    this.origin = pc.add({
      show: true,
      position: this.center,
      pixelSize: this.lineWidth * 1.5,
      color: Cesium.Color.WHITE,
    });
    this.root.add(pc);
    this._primitives.push(this.origin);
  }
  /**
   * 创建坐标轴材质
   * @private
   */
  getAxisMaterial(color, dash = false, dashLength = 16) {
    if (dash) {
      return new Material({
        fabric: {
          type: "dasharrow",
          source: dashArrowShader,
          uniforms: {
            color: color,
            gapColor: Color.TRANSPARENT,
            dashLength: dashLength,
            dashPattern: 255,
          },
        },
      });
    } else {
      return new Material({
        fabric: {
          type: "PolylineArrow",
          uniforms: {
            color: color,
          },
        },
      });
    }
  }
  /**
   * 创建旋转轴
   * @private
   */
  createRotateAxis() {
    const pts = [];
    const radius = this.rotatePlaneRadius || this._radius * this._radiusRatio;
    const center = this.center;
    for (let i = 0; i <= 360; i++) {
      const rad = (i / 180) * Math.PI;
      pts.push(
        new Cartesian3(
          center.x + radius * Math.cos(rad),
          center.y + radius * Math.sin(rad),
          center.z
        )
      );
    }
    this.zRotate = this.axisRoot.add({
      positions: [...pts],
      width: this.lineWidth,
      material: this.getAxisMaterial(this.zAxisColor, true, 0),
    });
    this.zRotate.axis = "RZ";
    this.zRotate.color = this.zAxisColor;
    this.zRotate.normal = new Cartesian3(0, 0, 1);
    pts.splice(0);
    for (let i = 0; i <= 360; i++) {
      const rad = (i / 180) * Math.PI;
      pts.push(
        new Cartesian3(
          center.x + radius * Math.cos(rad),
          center.y,
          center.z + radius * Math.sin(rad)
        )
      );
    }
    this.yRotate = this.axisRoot.add({
      positions: [...pts],
      width: this.lineWidth,
      material: this.getAxisMaterial(this.yAxisColor, true, 0),
    });
    this.yRotate.axis = "RY";
    this.yRotate.color = this.yAxisColor;
    this.yRotate.normal = new Cartesian3(0, 1, 0);
    pts.splice(0);
    for (let i = 0; i <= 360; i++) {
      const rad = (i / 180) * Math.PI;
      pts.push(
        new Cartesian3(
          center.x,
          center.y + radius * Math.cos(rad),
          center.z + radius * Math.sin(rad)
        )
      );
    }
    this.xRotate = this.axisRoot.add({
      positions: [...pts],
      width: this.lineWidth,
      material: this.getAxisMaterial(this.xAxisColor, true, 0),
    });
    this.xRotate.axis = "RX";
    this.xRotate.color = this.xAxisColor;
    this.xRotate.normal = new Cartesian3(-1, 0, 0);

    this.rAxuStart = this.axisRoot.add({
      positions: [],
      width: this.lineWidth / 2,
      material: this.getAxisMaterial(this.activeAxisColor, true, 0)
    })
    this.rAxuEnd = this.axisRoot.add({
      positions: [],
      width: this.lineWidth / 2,
      material: this.getAxisMaterial(this.activeAxisColor, true, 0)
    })
    this._primitives.push(this.xRotate, this.yRotate, this.zRotate, this.rAxuStart, this.rAxuEnd);
  }
  /**
   * 创建缩放轴
   * @private
   */
  createScaleAxis() {
    const lineLength = this._radius * this._radiusRatio;    
    const l = defaultValue(this.scaleAxisLength, lineLength);
    const delta = Math.pow(l, 1 / 3);
    this.scaleAxis = this.axisRoot.add({
      positions: [
        this._center,
        new Cartesian3((l + this._center.x) / delta, -(l + this._center.y) / delta, (l + this._center.z) / delta),
      ],
      width: this.lineWidth,
      material: this.getAxisMaterial(this.scaleAxisColor),
    });
    this._primitives.push(this.scaleAxis);
    this.scaleAxis.axis = 'SXYZ';
    this.scaleAxis.color = this.scaleAxisColor
  }
  /**
   * 绑定一个对象
   * @param {Model|Cesium.Model|Cesium.Cartesian3} object
   */
  bind(object) {
    if (!this._viewer) {
      throw new CesiumProError('please call addTo method to add to viewer')
    }
    this.unbind();
    if (object instanceof Model) {
      object = object.delegate;
    }
    this.object = object;
    if (object instanceof CesiumModel === false) {
      this.bindPosition(object);
      return;
    }
    this.modelMatrix = object.modelMatrix;
    object.readyPromise.then(() => {
      const center = Cartesian3.clone(object.boundingSphere.center);
      Matrix4.multiplyByPoint(this._inverseModelMatrix, center, this._center);
      this._radius = object.boundingSphere.radius;
      this.createPrimitive()
    });
  }
  /**
   * 为控制器绑定一个点
   * @param {Cesium.Property|Cesium.Cartesian3} position 
   */
  bindPosition(position) {
    // position instanceof Cesium.Property
    if (typeof position.getValue === 'function') {
      position = position.getValue(this._viewer.clock.currentTime);
    }
    if (position instanceof Cartesian3 === false) {
      throw new CesiumProError('position is invalid')
    }
    this.modelMatrix = Transforms.eastNorthUpToFixedFrame(position);
    this._center = new Cartesian3();
    Cartesian3.clone(this.originOffset, this._center);
    this._radius = 10;
    this.rotateEnabled = false;
    this.scaleEnabled = false;
    this.createPrimitive(false)
  }
  /**
   * @private
   * 创建控制器需要的要素
   */
  createPrimitive(isModel = true) {
    const plc = new PolylineCollection({
      modelMatrix: this.modelMatrix,
    });
    this.axisRoot = plc;
    this.root.add(plc);
    this.createOrignPoint();
    this.translateEnabled && this.createMoveAxis();
    this.translateEnabled && this.createAxisPlane();
    (isModel && this.rotateEnabled) && this.createRotateAxis();
    (isModel && this.scaleEnabled) && this.createScaleAxis();
  }
  /**
   * 解绑当前绑定对象
   */
  unbind() {
    this.object = undefined;
    this.root.removeAll();
    this.origon = undefined;
    this.xAxis = undefined;
    this.yAxis = undefined;
    this.zAxis = undefined;
    this.modelMatrix = undefined;
  }
  /**
   * 添加到场景
   * @param {Cesium.Viewer} viewer
   */
  addTo(viewer) {
    this._viewer = viewer;
    viewer.scene.primitives.add(this.root);
    this.addEventListener();
  }
  /**
   * @private
   * 监听鼠标事件
   */
  addEventListener() {
    const viewer = this._viewer;
    const handler = new ScreenSpaceEventHandler(viewer.canvas);
    handler.setInputAction((e) => {
      const feat = viewer.scene.pick(e.position);
      if (!feat) {
        return;
      }
      if (this._primitives.includes(feat.primitive)) {
        this._mousedownPixel = e.position;
        this.active(feat.primitive);
        this._offset = new Cartesian3();
        this._angle = 0;
        handler.setInputAction((e) => {
          const { startPosition, endPosition } = e;
          this.transform(startPosition, endPosition);
        }, ScreenSpaceEventType.MOUSE_MOVE);
        viewer.scene.screenSpaceCameraController.enableRotate = false;
      }
    }, ScreenSpaceEventType.LEFT_DOWN);

    handler.setInputAction((e) => {
      this.active(null);
      handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
      viewer.scene.screenSpaceCameraController.enableRotate = true;
      if (this.translateEnabled) {
        this.xAux.positions = [];
        this.yAux.positions = [];
        this.zAux.positions = [];
      }
      if (this.rotateEnabled) {
        this.rAxuStart.positions = [];
        this.rAxuEnd.positions = [];
      }
    }, ScreenSpaceEventType.LEFT_UP);
    this._removeEventListener = function () {
      handler.removeInputAction(ScreenSpaceEventType.LEFT_DOWN);
      handler.removeInputAction(ScreenSpaceEventType.LEFT_UP);
    };
  }
  /**
   * 当前操作的坐标轴或坐标平面
   * @private
   * @param {*} axis
   */
  active(geometry) {
    if (!(geometry || this.activePrimitive)) {
      return;
    }
    if (!geometry && this.activePrimitive) {
      setColorForPrimitive(this.activePrimitive, this.activePrimitive.color);
      if (this.activePrimitive.isAxisPlane) {
        for (let a of this.activePrimitive.relativeAxis) {
          setColorForPrimitive(a, a.color);
        }
      }
      this.activePrimitive = undefined;
      this._mode = EModel.N;
      return;
    }
    // 如果激活的是坐标平面，平面所在的坐标轴也需要高亮
    if (geometry.isAxisPlane) {
      for (let a of geometry.relativeAxis) {
        setColorForPrimitive(a, this.activeAxisColor);
      }
    }
    this.activePrimitive = geometry;
    setColorForPrimitive(this.activePrimitive, this.activeAxisColor);
    if (!geometry.axis) {
      return;
    }
    if (geometry.axis.includes("R")) {
      this._mode = EModel.R;
      const mousedownCartesian = getPositionInPlane(this._mousedownPixel, helper);
      this.rAxuStart.positions = [this.center, mousedownCartesian]
      this._startLocalPosition = mousedownCartesian;
    } else if (geometry.axis.includes("S")) {
      this._mode = EModel.S;
    } else {
      this._mode = EModel.T;
    }
  }
  /**
   * 从场景中删除
   */
  remove() {
    this._viewer.scene.primitives.remove(this.root);
    this._removeEventListener();
    this._primitives.splice(0);
  }
  /**
   * 平移
   * @private
   * @param {*} startPosition 
   * @param {*} endPosition 
   */
  transform(startPosition, endPosition) {
    this.preTranformEvent.raise(this.modelMatrix)
    if (this._mode === EModel.T) {
      computeOffset(this, startPosition, endPosition, _offset);
      this.translate(_offset);
    } else if (this._mode === EModel.R) {
      const startLocalPosition = getPositionInPlane(startPosition, this);
      const endLocalPosition = getPositionInPlane(endPosition, this);
      const angle = computeAngle(this, startLocalPosition, endLocalPosition);
      this.rotate(angle);
    } else if (this._mode = EModel.S) {
      computeOffset(this, startPosition, endPosition, _offset);
      const s = -_offset.sxyz / Cartesian3.distance(...this.scaleAxis.positions) + 1;
      this.scale(new Cartesian3(s, s, s));
    }
    this.postTransformEvent.raise(this.modelMatrix)
  }
  scale(scale) {
    const scaleMatrix = Matrix4.fromScale(scale, mat4);
    Matrix4.multiply(this._modelMatrix, scaleMatrix, this._modelMatrix);
    this.modelMatrix = this._modelMatrix;
    for (let primitive of this.root._primitives) {
      Matrix4.multiply(primitive.modelMatrix, scaleMatrix, primitive.modelMatrix);
    }
  }
  /**
   * 旋转
   * @private
   * @param {*} angle 
   */
  rotate(angle) {
    this._angle += angle;
    const axis = this.activePrimitive.normal;
    const translation = Matrix4.fromTranslation(this.center, mat4);
    const q = Quaternion.fromAxisAngle(axis, angle, _q);
    const roateMatrix = Matrix3.fromQuaternion(q, rm3);
    const inverseTranslation = Matrix4.fromTranslation(Cartesian3.negate(this.center, cartesian3_1), mat4_1);
    Matrix4.multiply(this.modelMatrix, translation, this.modelMatrix);
    Matrix4.multiplyByMatrix3(this.modelMatrix, roateMatrix, this.modelMatrix);
    Matrix4.multiply(this.modelMatrix, inverseTranslation, this.modelMatrix);
    for (let primitive of this.root._primitives) {
      Matrix4.multiply(primitive.modelMatrix, translation, primitive.modelMatrix);
      Matrix4.multiplyByMatrix3(primitive.modelMatrix, roateMatrix, primitive.modelMatrix);
      Matrix4.multiply(primitive.modelMatrix, inverseTranslation, primitive.modelMatrix);
    }
    this.modelMatrix = this._modelMatrix;
    this.createRotateAux(this._startLocalPosition, this._angle);
  }
  /**
   * 平移
   * @param {*} offset 
   */
  translate(offset) {
    if (!this.activePrimitive) {
      return;
    }
    const axis = this.activePrimitive.axis;
    if (axis.indexOf("X") === -1) {
      offset.x = 0;
    }
    if (axis.indexOf("Y") === -1) {
      offset.y = 0;
    }
    if (axis.indexOf("Z") === -1) {
      offset.z = 0;
    }
    offset.x = -offset.x;
    offset.z = -offset.z;
    Cartesian3.add(this._offset, offset, this._offset);
    const matrix = Matrix4.fromTranslation(offset);
    Matrix4.multiply(this._modelMatrix, matrix, this._modelMatrix);
    this.modelMatrix = this._modelMatrix;
    for (let primitive of this.root._primitives) {
      Matrix4.multiply(primitive.modelMatrix, matrix, primitive.modelMatrix);
    }
    this.createAux(this._offset, matrix);
  }
  /**
   * 创建平移辅助线
   * @private
   * @param {*} offset 
   */
  createAux(offset) {
    if (offset.x > 0) {
      const p1 = Cartesian3.clone(this.xAxis.positions[0]);
      const p2 = Cartesian3.clone(this.xAxis.positions[0]);
      p2.x += -offset.x;
      this.xAux.positions = [p1, p2];
    } else {
      const p1 = Cartesian3.clone(this.xAxis.positions[1]);
      const p2 = Cartesian3.clone(this.xAxis.positions[1]);
      p2.x += -offset.x;
      this.xAux.positions = [p1, p2];
    }
    if (offset.y < 0) {
      const p1 = Cartesian3.clone(this.yAxis.positions[0]);
      const p2 = Cartesian3.clone(this.yAxis.positions[0]);
      p2.y += -offset.y;
      this.yAux.positions = [p1, p2];
    } else {
      const p1 = Cartesian3.clone(this.yAxis.positions[1]);
      const p2 = Cartesian3.clone(this.yAxis.positions[1]);
      p2.y += -offset.y;
      this.yAux.positions = [p1, p2];
    }
    if (offset.z > 0) {
      const p1 = Cartesian3.clone(this.zAxis.positions[0]);
      const p2 = Cartesian3.clone(this.zAxis.positions[0]);
      p2.z += -offset.z;
      this.zAux.positions = [p1, p2];
    } else {
      const p1 = Cartesian3.clone(this.zAxis.positions[1]);
      const p2 = Cartesian3.clone(this.zAxis.positions[1]);
      p2.z += -offset.z;
      this.zAux.positions = [p1, p2];
    }
  }
  /**
   * 创建旋转辅助线
   * @private
   * @param {*} startLocalPosition 
   * @param {*} angle 
   */
  createRotateAux(startLocalPosition, angle) {
    const startPosition = this._startLocalPosition;
    if (!startPosition) {
      return;
    }
    const q = Quaternion.fromAxisAngle(this.activePrimitive.normal, -angle);
    const matrix3 = Matrix3.fromQuaternion(q, rm3);
    const rotation = Matrix4.fromRotation(matrix3, mat4);
    let position = Cartesian3.subtract(startLocalPosition, this.center, cartesian3_1);
    Matrix4.multiplyByPoint(rotation, position, position);
    Cartesian3.add(this.center, position, position);
    this.rAxuEnd.positions = [this.center, position];
  }
}
export default TransformHelper;

import defined from '../core/defined';
import defaultValue from '../core/defaultValue';
import CesiumProError from '../core/CesiumProError';
import ViewShadowPrimitive from '../scene/ViewShadowPrimitive';
import BaseAnalyser from './BaseAnalyser'
import ViewshedMap from '../core/ViewshedMap'
import RectangularSensorPrimitive from '../scene/RectangularSensorPrimitive';
const CesiumMath = Cesium.Math;

function getHeading(direction, up) {
  var heading;
  if (
    !CesiumMath.equalsEpsilon(Math.abs(direction.z), 1.0, CesiumMath.EPSILON3)
  ) {
    heading = Math.atan2(direction.y, direction.x) - CesiumMath.PI_OVER_TWO;
  } else {
    heading = Math.atan2(up.y, up.x) - CesiumMath.PI_OVER_TWO;
  }

  return CesiumMath.TWO_PI - CesiumMath.zeroToTwoPi(heading);
}

function getPitch(direction) {
  return CesiumMath.PI_OVER_TWO - CesiumMath.acosClamped(direction.z);
}


function getRoll(direction, up, right) {
  var roll = 0.0;
  if (
    !CesiumMath.equalsEpsilon(Math.abs(direction.z), 1.0, CesiumMath.EPSILON3)
  ) {
    roll = Math.atan2(-right.z, up.z);
    roll = CesiumMath.zeroToTwoPi(roll + CesiumMath.TWO_PI);
  }

  return roll;
}
class ViewShedAnalyser extends BaseAnalyser {
  /**
   * <p>视域分析</p>
   * <b>Note:使用视域分析时需要关闭场景的阴影.</b>
   * @extends BaseAnalyser
   * @param {Cesium.Viewer} viewer  viewer对象
   * @param {Object} options 具有以下属性
   * @param {Cesium.Cartesian3} options.observe 观察位置，即视点所在的位置
   * @param {Cesium.Cartesian3} options.viewPosition 相机方法向视锥机远裁剪面的交点
   * @param {Number} [options.far] 远裁剪面的距离
   * @param {Number} [options.near=0.001*options.far] 近裁剪面的距离
   * @param {Number} [options.aspectRatio=1.5] 视锥宽高比
   * @param {Number} [options.fov=120] 视锥体的水面夹角,单位度
   *
   */
  constructor(viewer, options) {
    super(viewer);
    options = defaultValue(options, {});
    this._options = options;
    if (!defined(options.observe)) {
      throw new CesiumProError('parameter options.observe is required.')
    }
    if (!defined(options.viewPosition)) {
      throw new CesiumProError('parameter options.viewPosition is required.')
    }
    this._observe = options.observe;
    this._viewPosition = options.viewPosition;
    this._debug = defaultValue(options.debug, false);
    this._far = defaultValue(options.far, Cesium.Cartesian3.distance(this._observe, this._viewPosition))
    this._near = defaultValue(options.near, 0.001 * this._far);
    this._aspectRatio = defaultValue(options.aspectRatio, 1.5);
    this._fov = defaultValue(options.fov, 120);
    const direction = Cesium.Cartesian3.subtract(this._viewPosition, this._observe, new Cesium.Cartesian3);
    this._direction = Cesium.Cartesian3.normalize(direction, direction);
    this._up = viewer.scene.mapProjection.ellipsoid.geodeticSurfaceNormal(this._observe, new Cesium.Cartesian3);
    this._heading = undefined;
    this._pitch = undefined;
    this._roll = undefined;
  }
  do() {
    this.preAnalysis.raise();
    this.update();
    this.postAnalysis.raise();
  }
  clear() {
    this._viewer.scene.primitives.remove(this._frustum);
    this._viewer.scene.primitives.remove(this._shadowMap);
  }
  destroy() {
    this.clear();
    if (this._frustum && !this._frustum.isDestroyed()) {
      this._frustum.destroy();
    }
    if (this._shadowMap && !this._shadowMap.isDestroyed()) {
      this._shadowMap.destroy();
    }
    super.destroy(this);
  }
  /**
   * 视锥体
   * @type {any}
   */
  get frustum() {
    return this._frustum;
  }
  /**
   * 是否显示辅助调试的元素
   * @type {Boolean}
   */
  get debug() {
    return this._debug;
  }
  set debug(val) {
    if (this._debug !== val) {
      this._debug = val;
      this._frustum.show = val;
      // this.createOrUpdateFrustum();
    }
  }
  /**
   * 观察位置，即相机所在的位置
   * @type {Cesium.Cartesian3}
   */
  get observe() {
    return this._observe;
  }
  set observe(val) {
    if (this._observe !== val) {
      this._observe = val;
      this.update();
    }
  }
  /**
   * 相机方法向视锥机远裁剪面的交点
   * @type {Cesium.Cartesian3}
   */
  get viewPosition() {
    return this._viewPosition;
  }
  set viewPosition(val) {
    if (this._viewPosition !== val) {
      this._viewPosition = val;
      this.update();
    }
  }

  /**
   * 相机方向，由viewPosition和observe决定
   * @readonly
   * @type {Cesium.Cartesian3}
   */
  get direction() {
    return this._direction;
  }
  /**
   * 相机远裁剪面到视点的距离
   * @type {Number}
   */
  get far() {
    return this._far;
  }
  set far(val) {
    if (this._far !== val) {
      this._far = val;
      this.update();
    }
  }
  /**
   * 相机近裁剪面到视点的距离
   * @type {Number}
   */
  get near() {
    return this._near;
  }
  set near(val) {
    if (this._near !== val) {
      this._near = val;
      this.update();
    }
  }
  /**
   * 视锥体水平夹角，单位：度
   * @type {Number}
   */
  get fov() {
    return this._fov;
  }
  set fov(val) {
    if (this._fov !== val) {
      this._fov = val;
      this.update();
    }
  }
  /**
   * 视锥宽高比
   *  @type {Number}
   */
  get aspectRatio() {
    return this._aspectRatio;
  }
  set aspectRatio(val) {
    if (this._aspectRatio !== val) {
      this._aspectRatio = val;
      this.update();
    }
  }
  /**
   * 旋转角，单位：度
   * @type {Number}
   * @readonly
   */
  get heading() {
    this.updateHeadingPitchRoll();
    return Cesium.Math.toDegrees(this._heading);
  }
  /**
   * 俯仰角，单位：度
   * @type {Number}
   * @readonly
   */
  get pitch() {
    this.updateHeadingPitchRoll();
    return Cesium.Math.toDegrees(this._pitch);
  }
  /**
   * 翻滚角，单位：度
   * @type {Number}
   * @readonly
   */
  get roll() {
    this.updateHeadingPitchRoll();
    return Cesium.Math.toDegrees(this._roll);
  }

  update() {
    this.createOrupdateCamera();
    this.createOrUpdateFrustum();
    this.createOrUpdateShadowMap();
  }
  createOrupdateCamera() {
    if (!defined(this._viewCamera)) {
      this._viewCamera = new Cesium.Camera(viewer.scene);
    }
    this._viewCamera.frustum.near = this._near;
    this._viewCamera.frustum.far = this._far;
    this._viewCamera.frustum.aspectRatio = this._aspectRatio;
    this._viewCamera.frustum.fov = Cesium.Math.toRadians(this.fov);;
    this._viewCamera.direction = Cesium.Cartesian3.normalize(this._direction, this._viewCamera.direction);
    this._viewCamera.position = Cesium.Cartesian3.clone(this._observe, this._viewCamera.position);
    this._viewCamera.up = this._up;
    this._viewCamera.right = Cesium.Cartesian3.cross(this._viewCamera.up, this._viewCamera.direction, new Cesium.Cartesian3);
    //
    // const transform = Cesium.Transforms.eastNorthUpToFixedFrame(
    //   this._viewCamera.position, this._viewCamera._projection.ellipsoid
    // );
    // this._viewCamera._setTransform(transform);
    if (!defined(this._heading) && !defined(this._pitch) && !defined(this._roll)) {
      this.updateHeadingPitchRoll();
    }
  }
  updateHeadingPitchRoll() {
    const oldTransform = Cesium.Matrix4.clone(this._viewCamera._transform, new Cesium.Matrix4);
    const transform = Cesium.Transforms.eastNorthUpToFixedFrame(
      this._viewCamera.positionWC, this._viewCamera._projection.ellipsoid
    );
    this._viewCamera._setTransform(transform);
    this._pitch = getPitch(this._viewCamera.direction);
    this._heading = getHeading(this._viewCamera.direction, this._viewCamera.up);
    this._roll = getRoll(this._viewCamera.direction, this._viewCamera.up, this._viewCamera.right);

    this._viewCamera._setTransform(oldTransform);
  }
  /**
   * 相机向左旋转
   * @param  {Number} angle 旋转角度，单位：度
   */
  rotateLeft(angle) {
    const oldTransform = Cesium.Matrix4.clone(this._viewCamera._transform, new Cesium.Matrix4);
    const transform = Cesium.Transforms.eastNorthUpToFixedFrame(
      this._viewCamera.position, this._viewCamera._projection.ellipsoid
    );
    this._viewCamera._setTransform(transform);
    this._viewCamera.rotateLeft(Cesium.Math.toRadians(angle));
    this._viewCamera._setTransform(oldTransform);
    Cesium.Cartesian3.clone(this._viewCamera.directionWC, this._direction);
    this.update();
  }
  /**
   * 相机向右旋转
   * @param  {Number} angle 旋转角度，单位：度
   */
  rotateRight(angle) {
    this.rotateLeft(-angle);
  }
  /**
   * 相机向下旋转
   * @param  {Number} angle 旋转角度，单位：度
   */
  rotateDown(angle) {
    const oldTransform = Cesium.Matrix4.clone(this._viewCamera._transform, new Cesium.Matrix4);
    const transform = Cesium.Transforms.eastNorthUpToFixedFrame(
      this._viewCamera.position, this._viewCamera._projection.ellipsoid
    );
    this._viewCamera._setTransform(transform);
    this._viewCamera.rotateDown(Cesium.Math.toRadians(angle));
    this._viewCamera._setTransform(oldTransform);
    Cesium.Cartesian3.clone(this._viewCamera.directionWC, this._direction);
    this.update()
  }
  /**
   * 相机向上旋转
   * @param  {Number} angle 旋转角度，单位：度
   */
  rotateUp(angle) {
    this.rotateDown(-angle);
  }
  createOrUpdateFrustum() {
    const position = this._viewCamera.positionWC;
    const rotation = new Cesium.Matrix3;
    const up = this._up;
    const direction = this.direction;
    // this._up = viewer.scene.mapProjection.ellipsoid.geodeticSurfaceNormal(this._observe, new Cesium.Cartesian3);
    const right = Cesium.Cartesian3.cross(up, direction, new Cesium.Cartesian3);
    Cesium.Matrix3.setColumn(rotation, 0, right, rotation)
    Cesium.Matrix3.setColumn(rotation, 1, up, rotation)
    Cesium.Matrix3.setColumn(rotation, 2, direction, rotation)

    // const hpr = new Cesium.HeadingPitchRoll(this._heading, this._pitch, this._roll);
    // const orientation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, new Cesium.Quaternion);
    const orientation = Cesium.Quaternion.fromRotationMatrix(rotation, new Cesium.Quaternion);
    const modelMatrix = Cesium.Matrix4.fromTranslationQuaternionRotationScale(
      position,
      orientation,
      new Cesium.Cartesian3(1, 1, 1),
      new Cesium.Matrix4
    )
    if (this._frustum) {
      // this._viewer.scene.primitives.remove(this._frustum);
      this._frustum.modelMatrix = modelMatrix;
      this._frustum.xHalfAngle = this._fov / 2;
      this._frustum.yHalfAngle = this._fov / 2 / this._aspectRatio;
      this._frustum.radius = this._far;
      return;
    }

    // const frustum = new Cesium.GeometryInstance({
    //   geometry: new Cesium.FrustumOutlineGeometry({
    //     frustum: this._viewCamera.frustum,
    //     origin: position,
    //     orientation: orientation
    //   }),
    //   attributes: {
    //     color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0, 1, 0, 1)),
    //     show: new Cesium.ShowGeometryInstanceAttribute(true)
    //   }
    // })
    // this._frustum = new Cesium.Primitive({
    //   id: 'viewshed',
    //   geometryInstances: frustum,
    //   appearance: new Cesium.PerInstanceColorAppearance({
    //     translucent: false,
    //     flat: true
    //   })
    // })
    this._frustum = new RectangularSensorPrimitive({
      radius: this._far,
      modelMatrix,
      xHalfAngle: this._fov / 2,
      yHalfAngle: this._fov / 2 / this._aspectRatio,
      showScanPlane: false,
      showLateralSurfaces: false,
      material: Cesium.Material.fromType(Cesium.Material.ColorType, {
        color: Cesium.Color.AQUA.withAlpha(0.3)
      }),
      show: this.debug
    })
    this._viewer.scene.primitives.add(this._frustum);
    return this._frustum
  }
  createOrUpdateShadowMap() {
    if (defined(this._shadowMap)) {
      this._viewer.scene.primitives.remove(this._shadowMap);
    }
    if (!(this._viewCamera && this._frustum._boundingSphereWC)) {
      return
    }
    const boundingShpere = this._frustum._boundingSphereWC;
    const options = this._options;
    options.lightCamera = this._viewCamera;
    options.context = this._viewer.scene.context;
    // options.cascadesEnabled = false;
    // options.darkness = 0.0;
    // options.boundingShpere = boundingShpere
    const shadowMap = new ViewshedMap(options)
    const primitive = new ViewShadowPrimitive(shadowMap)
    this._shadowMap = this._viewer.scene.primitives.add(primitive)
    return this._shadowMap
  }
}
export default ViewShedAnalyser

import defined from '../core/defined';
import CesiumProError from '../core/CesiumProError'
import Graphic from '../core/Graphic';
import LonLat from '../core/LonLat';
import defaultValue from '../core/defaultValue';
const {
  Cartesian3,
  Matrix4,
  Transforms,
  Model,
  CylinderGeometry,
  PrimitiveCollection,
  BillboardCollection,
  MaterialAppearance,
  GeometryInstance,
  Material,
  Color,
  Primitive
} = Cesium;
function transform(satelliteScane, angle, axis) {
  if (!defined(satelliteScane)) {
    return;
  }
  angle = Cesium.Math.toRadians(angle);
  const rotation = new Cesium.Matrix3();
  const quaternion = new Cesium.Quaternion();
  Cesium.Quaternion.fromAxisAngle(axis, angle, quaternion);
  Cesium.Matrix3.fromQuaternion(quaternion, rotation);
  // 旋转锥体
  const rotationMatrix = new Cesium.Matrix4();
  Cesium.Matrix4.fromRotationTranslation(rotation, new Cesium.Cartesian3(0, 0, 0), rotationMatrix);
  Cesium.Matrix4.multiplyByMatrix3(satelliteScane._matrix, rotation, satelliteScane._matrix);

  //调整顶点位置
  const coordinate = LonLat.fromCartesian(satelliteScane._surface, satelliteScane._viewer);
  const inverseMatrix = new Cesium.Matrix4();
  Cesium.Matrix4.inverseTransformation(satelliteScane._matrix, inverseMatrix);
  //变换前锥体的顶点坐标
  const topPosition = Cesium.Cartesian3.fromDegrees(coordinate.lon, coordinate.lat, satelliteScane._height);
  const localtop = new Cesium.Cartesian3();
  Cesium.Matrix4.multiplyByPoint(inverseMatrix, topPosition, localtop);
  //变换后顶点的坐标
  const newtop = new Cesium.Cartesian3();
  Cesium.Matrix4.multiplyByPoint(rotationMatrix, localtop, newtop);
  const diff = new Cesium.Cartesian3();
  Cesium.Cartesian3.subtract(localtop, newtop, diff);

  Cesium.Matrix4.multiplyByTranslation(satelliteScane._matrix, diff, satelliteScane._matrix)
  satelliteScane.updateMatrix(satelliteScane._matrix)
}
function update(scatelliteScan) {
  const material = scatelliteScan.scanPrimitive.appearance.material;
  const viewer = scatelliteScan._viewer;
  if (scatelliteScan.path) {
    const center = scatelliteScan.path.position.getValue(viewer.clock.currentTime);
    scatelliteScan._position = center;
    const carto = LonLat.fromCartesian(center, viewer);
    const surface = Cesium.Cartesian3.fromDegrees(carto.lon, carto.lat)
    scatelliteScan._surface = surface;
    scatelliteScan._height = carto.height;
    const offset = new Cesium.Cartesian3(0, 0, carto.height / 2)
    const matrix = Cesium.Matrix4.multiplyByTranslation(
      Transforms.eastNorthUpToFixedFrame(surface),
      offset,
      new Cesium.Matrix4
    )
    scatelliteScan.updateMatrix(matrix);
    scatelliteScan.imagePrimitive.position = center; 
    scatelliteScan.transform(scatelliteScan.rotation);
    if (scatelliteScan.tracked) {
      scatelliteScan.trackSatellite()
    }
  }
  let offset = material.uniforms.offset;
  offset -= 0.005 * scatelliteScan.speed;
  if (offset > 1.0) {
    offset = 0.0
  }
  scatelliteScan.scanPrimitive.appearance.material.uniforms.offset = offset
}
class SatelliteScan extends Graphic {
  /**
   * 卫星扫描
   * @param {*} options 具有以下属性
   * @param {Bool} [options.show=true] 是否可见
   * @param {Cartesian3} [options.position] 卫星的位置
   * @param {Entity} [options.path] 卫星运动轨道,该属性将覆盖position
   * @param {Number} [options.radius] 卫星在地面的扫描半径
   * @param {Bool} [options.inverse=false] 扫描方向，该值为true卫星将从下向上扫描
   * @param {Bool} [options.tracked=false] 是否跟踪卫星
   * @param {Color} [options.color] 扫描波颜色
   * @param {Bool} [option.image] 卫星图标，如果定义了model该属性将不生效
   * @param {Bool} [options.model=false] 卫星模型
   * @param {Cartesian3} [option.axis=Cartesian3(1,0,0)] 卫星扫描方向偏转的坐标轴
   * @param {Number} [options.rotation] 扫描波在方向偏转角度
   * @param {Bool} [option.animate=true] 是否动态扫描
   * @param {number} [options.thickness=0.3] 扫描波每一片的厚度
   * @param {number} [options.slices=20] 扫描波的分片数量
   */
  constructor(options) {
    options.path && (options.position = options.path.position.getValue(viewer.clock.currentTime))
    super(options);

    this._clampToGround = false;
    if (!defined(options.position)) {
      throw new CesiumProError('参数options必须定义position或path属性。')
    }
    const cartographic = LonLat.toCartographic(options.position, viewer);
    this._position = LonLat.toCartesian(options.position);
    this._thickness = defaultValue(options.thickness, 0.3);
    this._slices = defaultValue(options.slices, 20);
    this.speed = defaultValue(options.speed, 0.5);

    /**
     * 卫星所在的高度
     */
    this._height = cartographic.height;
    /**
     * 卫星在地面的投影位置
     */
    this._surface = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude)
    /**
     * 卫星在地面的扫描半径
     * @type {Number}
     * @readonly
     */
    this.radius = options.radius || this._height * 0.5

    this._inverse = options.inverse || false
    this._animation = defined(options.animation) ? options.animation : true;
    this._show = defined(options.show) ? options.show : true

    this._color = options.color
    /**
     * 卫星运动轨迹
     * @type {Entity}
     * @readonly
     */
    this.path = options.path;

    this._tracked = options.tracked || false

    this._rotation = options.rotation;

    this._axis = options.axis

    this._matrix = Matrix4.multiplyByTranslation(
      Transforms.eastNorthUpToFixedFrame(this._surface),
      new Cartesian3(0, 0, 0.5 * this._height),
      new Matrix4()
    );
    this.transform(this._rotation);
    /**
     * 表示卫星的图标,false表示不显示图标
     * @type {String|Boolean}
     */
    this.image = options.image;
    /**
     * 表示卫星的模型,false表示不显示模型
     * @type {String|Boolean}
     */
    this.model = options.model;
    this._primitive = new PrimitiveCollection();
    this._primitive.name = 'SatelliteScan'
    this._loadEvent.addEventListener(() => {
      if (!this._viewer) {
        return;
      }
      this.stopAnimate = this._viewer.scene.preUpdate.addEventListener(() => {
        update(this);
      })
    })
    this.createGraphic();
  }
  updateMatrix(matrix) {
    if (!matrix) {
      return;
    }
    this._matrix = matrix;
    this.scanPrimitive.modelMatrix = matrix;
    // if (this.imagePrimitive) {
    //   this.imagePrimitive.position = Cesium.Matrix4.getTranslation(matrix, {});
    // }
    if (this.modelPrimitive) {
      this.modelPrimitive.modelMatrix = matrix;
    }
  }
  updatePrimitive() {
    this.createGraphic();
  }
  createGraphic() {
    if (this.model) {
      const model = Model.fromGltf({
        url: this.model,
        pixelOffset: new Cesium.Cartesian2(-10, 10)
      })
      this.modelPrimitive = this.primitive.add(model);
    }
    if (this.image) {
      const billboardCollection = new BillboardCollection();
      this.primitive.add(billboardCollection);
      this.imagePrimitive = billboardCollection.add({
        image: this.image,
        position: this._position,
      })
    }
    /**
     * 卫星放射波锥体
     */
    const geometry = new CylinderGeometry({
      length: this._height,
      topRadius: 0,
      bottomRadius: this.radius,
      vertextFormat: MaterialAppearance.MaterialSupport.TEXTURED.vertextFormat
    })
    const instance = new GeometryInstance({
      geometry,
    })
    const source = this.getShaderSorce()
    const material = new Material({
      fabric: {
        type: 'satelliteMaterial',
        uniforms: {
          color: this._color || Color.WHITE,
          repeat: this.slices, //锥体被分成30份
          offset: 0.0,
          thickness: this.thickness,
          sign: this.inverse ? 1 : -1
        },
        source: source
      }
    })
    const primitive = new Primitive({
      modelMatrix: this._matrix,
      show: this.show,
      geometryInstances: instance,
      appearance: new MaterialAppearance({
        material: material
      }),
      asynchronous: false
    })
    this.scanPrimitive = this.primitive.add(primitive);
    if (this.stopAnimate) {
      this.stopAnimate();
    }
  }
  /**
   * 使相视视角一直跟要卫星
   */
  trackSatellite() {
    if (!this._viewer) {
      return;
    }
    if (this._tracked) {
      const boundingSphere = new Cesium.BoundingSphere(this._position, this._height);
      this._viewer.camera.viewBoundingSphere(boundingSphere);
      this._viewer.camera.lookAtTransform(this._matrix)
    } else {
      this._viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    }
  }
  /**
   * 是否反方向扫描，true表示从下向上扫描
   * @type {Boolean}
   * @readonly
   */
  get inverse() {
    return this._inverse;
  }
  set inverse(val) {
    this._inverse = val;
    if (this.scanPrimitive) {
      this.scanPrimitive.appearance.material.uniforms.sign = val ? 1 : -1;
    }
  }
  get slices() {
    return this._slices;
  }
  set slices(val) {
    this._slices = val;
    if (this.scanPrimitive) {
      this.scanPrimitive.appearance.material.uniforms.repeat = val;
    }
  }
  /**
   * 厚度,有效值0~1
   * @type {number}
   */
  get thickness() {
    return this._thickness;
  }
  set thickness(val) {
    if (val < 0) {
      val = 0;
    }
    if (val > 1) {
      val = 1;
    }
    if (this.scanPrimitive) {
      this.scanPrimitive.appearance.material.uniforms.thickness = val;
    }
  }
  /**
   * 卫星扫描波在各方向的偏转角度
   * @type {Cesium.Cartesian3}
   * @readonly
   */
  get rotation() {
    return this._rotation;
  }
  set rotation(val) {
    this._rotation = val;
    this.transform(val);
  }
  /**
   * 卫星扫描该向偏转轴
   * @type {Cartesian3}
   * @readonly
   */
  get axis() {
    return this._axis;
  }
  /**
   * 是否追踪卫星
   * @type {Bool}
   */
  get tracked() {
    return this._tracked;
  }
  set tracked(val) {
    if (val === this._tracked) return;
    this._tracked = val;
    this.trackSatellite();    
  }
  /**
   * 扫描波颜色
   * @type {Cesium.Color}
   */
  get color() {
    return this._color;
  }
  set color(val) {
    this._color = val;
    this.scanPrimitive && (this.scanPrimitive.appearance.material.uniforms.color = val);
  }
  /**
   * 是否动态扫描
   * @type {Boolean}
   */
  get animation() {
    return this._animation;
  }
  set animation(val) {
    if (val === this._animation) {
      return;
    }
    if (val) {
      this.stopAnimate = this._viewer.scene.preUpdate.addEventListener(() => {
        update(this);
      })
    } else {
      this.stopAnimate && this.stopAnimate();
      this.stopAnimate = undefined
    }
    this._animation = val;
  }
  getShaderSorce() {
    return `
    uniform vec4 color;
    uniform float repeat;
    uniform float offset;
    uniform float thickness;
    uniform float sign;
    czm_material czm_getMaterial(czm_materialInput inputM){
      czm_material material=czm_getDefaultMaterial(inputM);
      float sp=1.0/repeat;
      vec2 st=inputM.st;
      float dis=distance(st,vec2(0.5));
      float m=mod(dis + sign * offset,sp);
      float a=step(sp*(1.0-thickness),m);
      material.diffuse=color.rgb;
      material.alpha=a*color.a;
      return material;
    }`
  }
  /**
   * 定位到扫描波所在的位置
   */
  zoomTo(duration) {
    if (!this.show || !this._viewer) {
      return;
    }
    const boundingSphere = new Cesium.BoundingSphere(this._position, this._height);
    this._viewer.camera.flyToBoundingSphere(boundingSphere, {
      duration
    })
  }
  transform(angle) {
    if (!angle) {
      return;
    }
    if (angle.x) {
      transform(this, angle.x, new Cartesian3(1, 0, 0));
    }
    if (angle.y) {
      transform(this, angle.y, new Cartesian3(0, 1, 0));
    }
    if (angle.z) {
      transform(this, angle.z, new Cartesian3(0, 0, 1));
    }
  }
}
export default SatelliteScan;

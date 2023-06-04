import defined from './source/core/defined';
import CesiumProError from './source/core/CesiumProError'
import Graphic from './source/core/Graphic';
class SatelliteScan extends Graphic{
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
   * @param {Bool} [option.billboard] 卫星图标，如果定义了model该属性将不生效
   * @param {Bool} [options.model=false] 卫星模型
   * @param {Cartesian3} [option.axis=Cartesian3(1,0,0)] 卫星扫描方向偏转的坐标轴
   * @param {Number} [options.angle=0] 扫描扫描方向偏转角度
   * @param {Bool} [option.animate=true] 是否动态扫描
   */
  constructor(options) {
    options.path && (options.position = options.path.position.getValue(viewer.clock.currentTime))
    this._position = options.position;
    if (!defined(options.position)) {
      throw new CesiumProError('参数options必须定义position或path属性。')
    }

    const cartographic = CVT.toDegrees(options.position, viewer)

    /**
     * 卫星所在的高度
     */
    this._height = cartographic.height;
    /**
     * 卫星在地面的投影位置
     */
    this._surface = Cesium.Cartesian3.fromDegrees(cartographic.lon, cartographic.lat)
    /**
     * 卫星在地面的扫描半径
     * @type {Number}
     * @readonly
     */
    this.radius = options.radius || this._height * 0.5

    /**
     * 是否反方向扫描，true表示从下向上扫描
     * @type {Boolean}
     * @readonly
     */
    this.inverse = options.inverse || false
    this._animation = Cesium.defined(options.animation) ? options.animation : true;
    this._show = Cesium.defined(options.show) ? options.show : true

    this._color = options.color
    /**
     * 卫星运动轨迹
     * @type {Entity}
     * @readonly
     */
    this.path = options.path;

    this._tracked = options.tracked || false

    this._angle = options.angle || 0;

    this._axis = options.axis

    this._matrix = Cesium.Matrix4.multiplyByTranslation(
      Cesium.Transforms.eastNorthUpToFixedFrame(this._surface),
      new Cesium.Cartesian3(0, 0, 0.5 * this._height),
      new Cesium.Matrix4
    );
    this.transform(this.angle, this.axis);
    /**
     * 表示卫星的图标,false表示不显示图标
     * @type {String|Boolean}
     */
    this.billboard = options.billboard;
    /**
     * 表示卫星的模型,false表示不显示模型
     * @type {String|Boolean}
     */
    this.model = options.model;
  }
  init() {
    if (this.model) {
      this._modelEntity = viewer.entities.add({
        show: this.show,
        position: this._position,
        model: {
          uri: this.model,
          pixelOffset: new Cesium.Cartesian2(-10, 10)
        }
      })
    }
    if (this.billboard) {
      this._billboardEntity = viewer.entities.add({
        show: this.show,
        position: this._position,
        billboard: {
          image: this.billboard,
          pixelOffset: new Cesium.Cartesian2(-10, 10)
        }
      })
    }

    if (this._tracked) {
      this.trackSatellite()
    }
    /**
     * 卫星放射波锥体
     */
    const geometry = new Cesium.CylinderGeometry({
      length: this._height,
      topRadius: 0,
      bottomRadius: this.radius,
      vertextFormat: Cesium.MaterialAppearance.MaterialSupport.TEXTURED.vertextFormat
    })
    const instance = new Cesium.GeometryInstance({
      geometry,
    })
    const source = this.inverse ?
      SatelliteScan.fromDownSource :
      SatelliteScan.fromUpSource;
    const material = new Cesium.Material({
      fabric: {
        type: 'satelliteMaterial',
        uniforms: {
          color: this._color || new Cesium.Color(1.0, 0, 0, 1),
          repeat: 30, //锥体被分成30份
          offset: 0.0,
          thickness: 0.3
        },
        source: source
      }
    })
    const primitive = this._viewer.scene.primitives.add(
      new Cesium.Primitive({
        modelMatrix: this._matrix,
        show: this.show,
        geometryInstances: instance,
        appearance: new Cesium.MaterialAppearance({
          material: material
        })
      })
    )
    this.primitive = primitive
    const self = this;

    function update() {
      if (self.path) {
        const center1 = self.path.position.getValue(viewer.clock.currentTime);
        self._billboardEntity && (self._billboardEntity.position = center1)
        self._modelEntity && (self._modelEntity.position = center1)
        const carto = CVT.toDegrees(center1, viewer)
        const surface1 = Cesium.Cartesian3.fromDegrees(carto.lon, carto.lat)
        self._surface = surface1;
        self._height = carto.height;
        const offset1 = new Cesium.Cartesian3(0, 0, carto.height / 2)
        const matrix = Cesium.Matrix4.multiplyByTranslation(
          Cesium.Transforms.eastNorthUpToFixedFrame(surface1),
          offset1,
          new Cesium.Matrix4
        )
        self._matrix = matrix
        self.transform(self.angle, self.axis)
        primitive.modelMatrix = matrix
        if (self.tracked) {
          self.zoomTo()

        }
      }
      let offset = primitive.appearance.material.uniforms.offset;
      offset -= 0.001;
      if (offset > 1.0) {
        offset = 0.0
      }
      primitive.appearance.material.uniforms.offset = offset
    }
    this.update = update;
    if (this.animation) {
      this.stopAnimate = this._viewer.scene.preUpdate.addEventListener(update)
    }
  }
  /**
   * 卫星扫描方向偏转角度，0表述垂直地面，单位度
   * @type {Number}
   * @readonly
   */
  get angle() {
    return this._angle;
  }
  // set angle(val) {
  //   if (val === this._angle) {
  //     return;
  //   }
  //   this.transform(val, this._axis);
  // }
  /**
   * 卫星扫描该向偏转轴
   * @type {Cartesian3}
   * @readonly
   */
  get axis() {
    return this._axis;
  }
  // set axis(val) {
  //   this._axis = val;
  //   this.transform(this._angle, val);
  // }
  /**
   * 是否可见
   * @type {Boolean}
   */
  get show() {
    return this._show;
  }
  set show(val) {
    this._show = val;
    this.primitive && (this.primitive.show = val);
    this._billboardEntity && (this._billboardEntity.billboard.show = val);
    this._modelEntity && (this._modelEntity.model.show = val);
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
    if (val) {
      this.trackSatellite();
    } else {
      this._viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
      this._viewer.trackedEntity = undefined;
    }
    this._tracked = val;
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
    this.primitive && (this.primitive.appearance.material.uniforms.color = val);
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
      this.stopAnimate = this._viewer.scene.preUpdate.addEventListener(this.update)
    } else {
      this.stopAnimate && this.stopAnimate();
      this.stopAnimate = undefined
    }
    this._animation = val;
  }
  static fromDownSource = `
    uniform vec4 color;
    uniform float repeat;
    uniform float offset;
    uniform float thickness;
    czm_material czm_getMaterial(czm_materialInput inputM){
      czm_material material=czm_getDefaultMaterial(inputM);
      float sp=1.0/repeat;
      vec2 st=inputM.st;
      float dis=distance(st,vec2(0.5));
      float m=mod(dis-offset,sp);
      float a=step(sp*(1.0-thickness),m);
      material.diffuse=color.rgb;
      material.alpha=a*color.a;
      return material;
    }
    `
  static fromUpSource = `
    uniform vec4 color;
    uniform float repeat;
    uniform float offset;
    uniform float thickness;
    czm_material czm_getMaterial(czm_materialInput inputM){
      czm_material material=czm_getDefaultMaterial(inputM);
      float sp=1.0/repeat;
      vec2 st=inputM.st;
      float dis=distance(st,vec2(0.5));
      float m=mod(dis+offset,sp);
      float a=step(sp*(1.0-thickness),m);
      material.diffuse=color.rgb;
      material.alpha=a*color.a;
      return material;
    }
    `
  trackSatellite() {
    if (this._billboardEntity) {
      this._viewer.trackedEntity = this._billboardEntity;
    }
    if (this._modelEntity) {
      this._viewer.trackedEntity = this._modelEntity;
    }
    // this._viewer.camera.lookAtTransform(this._matrix,
    //   new Cesium.Cartesian3(0, -this.radius * 1000, this._height * 2))
  }
  /**
   * 定位到扫描波所在的位置
   */
  zoomTo() {
    if (!this.show || !this._viewer) {
      return;
    }
    const boundingSphere = new Cesium.BoundingSphere(this._position, this._height);
    this._viewer.camera.flyToBoundingSphere(boundingSphere)
  }
  transform(angle, axis) {
    if (!defined(axis)) {
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
    Cesium.Matrix4.multiplyByMatrix3(this._matrix, rotation, this._matrix);

    //调整顶点位置
    const coordinate = CVT.toDegrees(this._surface, this._viewer);
    const inverseMatrix = new Cesium.Matrix4();
    Cesium.Matrix4.inverseTransformation(this._matrix, inverseMatrix);
    //变换前锥体的顶点坐标
    const topPosition = Cesium.Cartesian3.fromDegrees(coordinate.lon, coordinate.lat, this._height);
    const localtop = new Cesium.Cartesian3();
    Cesium.Matrix4.multiplyByPoint(inverseMatrix, topPosition, localtop);
    //变换后顶点的坐标
    const newtop = new Cesium.Cartesian3();
    Cesium.Matrix4.multiplyByPoint(rotationMatrix, localtop, newtop);
    const diff = new Cesium.Cartesian3();
    Cesium.Cartesian3.subtract(localtop, newtop, diff);

    Cesium.Matrix4.multiplyByTranslation(this._matrix, diff, this._matrix)
  }
  /**
   * 添加到场景
   * @param {Cesium.Viewer} viewer
   */
  addTo(viewer) {
    this._viewer = viewer;
    if (!this.primitive) {
      this.init();
    }
  }
  /**
   * 移除扫描波
   */
  remove() {
    if (this.primitive) {
      this._viewer.scene.primitives.remove(this.primitive);
    }
    if (this._billboardEntity) {
      this._viewer.entities.remove(this._billboardEntity)
    }
    if (this._modelEntity) {
      this._viewer.entities.remove(this._modelEntity)
    }
  }
  destroy() {
    this.remove();
    if (this.stopAnimate) {
      this.stopAnimate();
    }
    this._viewer = undefined;
  }
}
const center = Cesium.Cartesian3.fromDegrees(110, 30, 1000);

function computeCirclularFlight(lon, lat, radius) {
  var property = new Cesium.SampledPositionProperty();
  for (var i = 0; i <= 360; i += 45) {
    var radians = Cesium.Math.toRadians(i);
    var time = Cesium.JulianDate.addSeconds(
      viewer.clock.currentTime,
      i,
      new Cesium.JulianDate()
    );
    var position = Cesium.Cartesian3.fromDegrees(
      lon + radius * 1.5 * Math.cos(radians),
      lat + radius * Math.sin(radians),
      Cesium.Math.nextRandomNumber() * 500 + 1750
    );
    property.addSample(time, position);

    //Also create a point for each sample we generate.
    viewer.entities.add({
      position: position,
      point: {
        pixelSize: 8,
        color: Cesium.Color.TRANSPARENT,
        outlineColor: Cesium.Color.YELLOW,
        outlineWidth: 3,
      },
    });
  }
  return property;
}
export default SatelliteScan;

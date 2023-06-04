import defaultValue from '../core/defaultValue';
import defined from '../core/defined';
import CesiumProError from '../core/CesiumProError';
import scanPlaneFS from '../shader/rectangularSensorScanPlaneFS';
import sensorComm from '../shader/rectangularSensorComm';
import sensorFS from '../shader/rectangularSensorFS';
import sensorVS from '../shader/rectangularSensorVS';
import destroyObject from '../core/destroyObject'
import LonLat from '../core/LonLat';
const {
  Matrix4,
  Material,
  Color,
  JulianDate,
  BoundingSphere,
  DrawCommand,
  PrimitiveType,
  SceneMode,
  Matrix3,
  Buffer,
  BufferUsage,
  VertexArray,
  VertexFormat,
  ComponentDatatype,
  RenderState,
  BlendingState,
  Pass,
  combine,
  CullFace,
  Cartesian3,
  EllipsoidGeometry,
  EllipsoidOutlineGeometry,
  ShaderSource,
  ShaderProgram,
} = Cesium;
const {
  cos,
  sin,
  tan,
  atan
} = Math;
const CesiumMath = Cesium.Math;

const attributeLocations = {
  position: 0,
  normal: 1
};

class RectangularSensorPrimitive {
  /**
   * 模拟相控阵雷达。
   * @param {Object} options 具有以下属性
   * @param {Boolean} [options.show] 是否显示
   * @param {Cartesian3|LonLat} [options.position] 图形位置
   * @param {Matrix4} [options.modelMatrix] 模型矩阵,如果定义，则覆盖position属性
   * @param {Number} [options.slice=32] 切分程度
   * @param {Number} [options.radius=1] 半径
   * @param {Color} [options.lineColor=Color.RED] 线的颜色
   * @param {Number} [options.xHalfAngle] 水平半夹角,单位度
   * @param {Number} [options.xyHalfAngle] 垂直半夹角，单位度
   * @param {Boolean} [options.showSectorLines=true] 是否显示扇面线
   * @param {Boolean} [options.showSectorSegmentLines=true] 是否显示扇面和圆顶面连接线
   * @param {Boolean} [options.showLateralSurfaces=true] 是否显示侧面
   * @param {Material} [options.material=Material.ColorType] 材质
   * @param {Material} [options.lateralSurfaceMaterial=Material.ColorType] 侧面材质
   * @param {Boolean} [options.showDomeSurfaces=true] 是否显示圆弧顶表面
   * @param {Material} [options.domeSurfaceMaterial=Material.ColorType] 圆弧顶表面材质
   * @param {Boolean} [options.showDomeLines=true] 是否显示圆弧顶表面线
   * @param {Boolean} [options.showIntersection = false] 是否显示与地球相交的线
   * @param {Color} [options.intersectionColor] 与地球相交的线的颜色
   * @param {Number} [options.intersectionWidth=5] 与地球相交的线的宽度
   * @param {Boolean} [options.showThroughEllipsoid=false] 是否穿过地球
   * @param {Boolean} [options.showScanPlane=true] 是否显示扫描面
   * @param {Color} [options.scanPlaneColor=Color.WHITE] 扫描面颜色
   * @param {String} [options.scanPlaneMode='H'] 扫描方向，H表示水平扫描，V表示垂直扫描
   * @param {Number} [options.speed=10] 扫描速度，值越大，扫描越快
   */
  constructor(options) {
    options = defaultValue(options, defaultValue.EMPTY_OBJECT);
    const self = this;
    this._createVS = true;
    this._createRS = true;
    this._createSP = true;
    /**
     * 是否显示
     * @type {Boolean}
     */
    this.show = defaultValue(options.show, true);

    //切分程度
    this.slice = defaultValue(options.slice, 32);

    //传感器的模型矩阵
    if (!options.modelMatrix) {
      if (!options.position) {
        throw new CesiumProError('parameter position or modelMatrix must be provided.')
      }
      this._modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(LonLat.toCartesian(options.position));
    } else {
      this._modelMatrix = Matrix4.clone(options.modelMatrix, new Matrix4());
    }

    this._computedModelMatrix = new Matrix4();
    this._computedScanPlaneModelMatrix = new Matrix4();

    //传感器的半径
    this._radius = defaultValue(options.radius, Number.POSITIVE_INFINITY);

    //传感器水平半角
    this._xHalfAngle = CesiumMath.toRadians(defaultValue(options.xHalfAngle, 0));

    //传感器垂直半角
    this._yHalfAngle = CesiumMath.toRadians(defaultValue(options.yHalfAngle, 0));

    this._color = defaultValue(options._color, Color.AQUA.withAlpha(0.4));

    /**
     * 线的颜色
     * @type {Cesium.Color}
     */
    this.lineColor = defaultValue(options.lineColor, Color.WHITE);

    /**
     * 是否显示扇面的线
     * @type {Boolean}
     */
    this.showSectorLines = defaultValue(options.showSectorLines, true);

    /**
     * 是否显示扇面和圆顶面连接的线
     * @type {Boolean}
     */
    this.showSectorSegmentLines = defaultValue(options.showSectorSegmentLines, true);

    /**
     * 是否显示侧面
     * @type {Boolean}
     */
    this.showLateralSurfaces = defaultValue(options.showLateralSurfaces, true);

    //目前用的统一材质
    this._material = defined(options.material) ? options.material : Material.fromType(Material.ColorType);
    this._material.uniforms.color = this._color;
    this._translucent = undefined;

    /**
     * 侧面材质
     * @type {Material}
     */
    this.lateralSurfaceMaterial = defined(options.lateralSurfaceMaterial) ? options.lateralSurfaceMaterial : Material.fromType(Material.ColorType);
    this._lateralSurfaceMaterial = undefined;
    this._lateralSurfaceTranslucent = undefined;

    /**
     * 是否显示圆顶表面
     * @type {Boolean}
     */
    this.showDomeSurfaces = defaultValue(options.showDomeSurfaces, true);

    /**
     * 圆顶表面材质
     * @type {Material}
     */
    this.domeSurfaceMaterial = defined(options.domeSurfaceMaterial) ? options.domeSurfaceMaterial : Material.fromType(Material.ColorType);

    /**
     * 是否显示圆顶面线
     * @type {Boolean}
     */
    this.showDomeLines = defaultValue(options.showDomeLines, true);

    /**
     * 是否显示与地球相交的线
     * @type {Boolean}
     */
    this.showIntersection = defaultValue(options.showIntersection, false);

    /**
     * 与地球相交的线的颜色
     * @type {Color}
     */
    this.intersectionColor = defaultValue(options.intersectionColor, Color.WHITE);

    /**
     * 与地球相交的线的宽度（像素）
     * @type {Number}
     */
    this.intersectionWidth = defaultValue(options.intersectionWidth, 5.0);

    //是否穿过地球
    this._showThroughEllipsoid = defaultValue(options.showThroughEllipsoid, false);

    /**
     * 是否显示扫描面
     * @type {Boolean}
     */
    this.showScanPlane = defaultValue(options.showScanPlane, true);

    /**
     * 扫描面颜色
     * @type {Color}
     */
    this.scanPlaneColor = defaultValue(options.scanPlaneColor, Color.AQUA);

    /**
     * 扫描面模式 垂直V/水平H
     * @type {String}
     */
    this.scanPlaneMode = defaultValue(options.scanPlaneMode, 'H');

    /**
     * 扫描速率，值越大，扫描越慢
     * @type {Number}
     */
    this.speed = defaultValue(options.speed, 10);

    this._scanePlaneXHalfAngle = 0;
    this._scanePlaneYHalfAngle = 0;

    //时间计算的起点
    this._time = JulianDate.now();

    this._boundingSphere = new BoundingSphere();
    this._boundingSphereWC = new BoundingSphere();
    this._boundingSphere = new BoundingSphere(Cartesian3.ZERO, this._radius);
    Matrix4.multiplyByUniformScale(this._modelMatrix, this._radius, this._computedModelMatrix);
    BoundingSphere.transform(this._boundingSphere, this._modelMatrix, this._boundingSphereWC);

    //扇面 sector
    this._sectorFrontCommand = new DrawCommand({
      owner: this,
      primitiveType: PrimitiveType.TRIANGLES,
      boundingVolume: this._boundingSphereWC
    });
    this._sectorBackCommand = new DrawCommand({
      owner: this,
      primitiveType: PrimitiveType.TRIANGLES,
      boundingVolume: this._boundingSphereWC
    });
    this._sectorVA = undefined;

    //扇面边线 sectorLine
    this._sectorLineCommand = new DrawCommand({
      owner: this,
      primitiveType: PrimitiveType.LINES,
      boundingVolume: this._boundingSphereWC
    });
    this._sectorLineVA = undefined;

    //扇面分割线 sectorSegmentLine
    this._sectorSegmentLineCommand = new DrawCommand({
      owner: this,
      primitiveType: PrimitiveType.LINES,
      boundingVolume: this._boundingSphereWC
    });
    this._sectorSegmentLineVA = undefined;

    //弧面 dome
    this._domeFrontCommand = new DrawCommand({
      owner: this,
      primitiveType: PrimitiveType.TRIANGLES,
      boundingVolume: this._boundingSphereWC
    });
    this._domeBackCommand = new DrawCommand({
      owner: this,
      primitiveType: PrimitiveType.TRIANGLES,
      boundingVolume: this._boundingSphereWC
    });
    this._domeVA = undefined;

    //弧面线 domeLine
    this._domeLineCommand = new DrawCommand({
      owner: this,
      primitiveType: PrimitiveType.LINES,
      boundingVolume: this._boundingSphereWC
    });
    this._domeLineVA = undefined;

    //扫描面 scanPlane/scanRadial
    this._scanPlaneFrontCommand = new DrawCommand({
      owner: this,
      primitiveType: PrimitiveType.TRIANGLES,
      boundingVolume: this._boundingSphereWC
    });
    this._scanPlaneBackCommand = new DrawCommand({
      owner: this,
      primitiveType: PrimitiveType.TRIANGLES,
      boundingVolume: this._boundingSphereWC
    });

    this._scanRadialCommand = undefined;

    this._colorCommands = [];

    this._frontFaceRS = undefined;
    this._backFaceRS = undefined;
    this._sp = undefined;

    this._uniforms = {
      u_type: function u_type() {
        return 0; //面
      },
      u_xHalfAngle: function u_xHalfAngle() {
        return self._xHalfAngle;
      },
      u_yHalfAngle: function u_yHalfAngle() {
        return self._yHalfAngle;
      },
      u_radius: function u_radius() {
        return self.radius;
      },
      u_showThroughEllipsoid: function u_showThroughEllipsoid() {
        return self.showThroughEllipsoid;
      },
      u_showIntersection: function u_showIntersection() {
        return self.showIntersection;
      },
      u_intersectionColor: function u_intersectionColor() {
        return self.intersectionColor;
      },
      u_intersectionWidth: function u_intersectionWidth() {
        return self.intersectionWidth;
      },
      u_normalDirection: function u_normalDirection() {
        return 1.0;
      },
      u_lineColor: function u_lineColor() {
        return self.lineColor;
      }
    };

    this._scanUniforms = {
      u_xHalfAngle: function u_xHalfAngle() {
        return self._scanePlaneXHalfAngle;
      },
      u_yHalfAngle: function u_yHalfAngle() {
        return self._scanePlaneYHalfAngle;
      },
      u_radius: function u_radius() {
        return self.radius;
      },
      u_color: function u_color() {
        return self.scanPlaneColor;
      },
      u_showThroughEllipsoid: function u_showThroughEllipsoid() {
        return self.showThroughEllipsoid;
      },
      u_showIntersection: function u_showIntersection() {
        return self.showIntersection;
      },
      u_intersectionColor: function u_intersectionColor() {
        return self.intersectionColor;
      },
      u_intersectionWidth: function u_intersectionWidth() {
        return self.intersectionWidth;
      },
      u_normalDirection: function u_normalDirection() {
        return 1.0;
      },
      u_lineColor: function u_lineColor() {
        return self.lineColor;
      }
    };
  }
  get color() {
    return this._color;
  }
  set color(val) {
    this._color = val;
    this._material.uniforms.color = val;
  }
  get boundingSphere() {
    return this._boundingSphere;
  }
  /**
   * 水平面半夹角,单位：度
   * @type {Number}
   */
  get xHalfAngle() {
    return CesiumMath.toDegrees(this._xHalfAngle);
  }
  set xHalfAngle(val) {
    if (this._xHalfAngle !== val) {
      this._xHalfAngle = CesiumMath.toRadians(val);
      this._createVS = true;
    }
  }
  /**
   * 垂直面半夹角,单位：度
   * @type {Number}
   */
  get yHalfAngle() {
    return CesiumMath.toDegrees(this._yHalfAngle);;
  }
  set yHalfAngle(val) {
    if (this._yHalfAngle !== val) {
      this._yHalfAngle = CesiumMath.toRadians(val);
      this._createVS = true
    }
  }
  /**
   * 传感器半径
   * @type {Number}
   */
  get radius() {
    return this._radius;
  }
  set radius(val) {
    if (this._radius !== val) {
      this._radius = val;
      this._boundingSphere = new BoundingSphere(Cartesian3.ZERO, val);
      Matrix4.multiplyByUniformScale(this._modelMatrix, this._radius, this._computedModelMatrix);
      BoundingSphere.transform(this._boundingSphere, this._modelMatrix, this._boundingSphereWC);
    }
  }
  /**
   * 传感器模型矩阵
   * @type {Matrix4}
   */
  get modelMatrix() {
    return this._modelMatrix;
  }
  set modelMatrix(val) {
    const modelMatrixChanged = !Matrix4.equals(val, this._modelMatrix);
    if (modelMatrixChanged) {
      Matrix4.clone(val, this._modelMatrix);
      Matrix4.multiplyByUniformScale(this._modelMatrix, this._radius, this._computedModelMatrix);
      BoundingSphere.transform(this._boundingSphere, this._modelMatrix, this._boundingSphereWC);
    }
  }
  /**
   * 是否传过地球
   * @type {Boolean}
   */
  get showThroughEllipsoid() {
    return this._showThroughEllipsoid;
  }
  set showThroughEllipsoid(val) {
    if (this._showThroughEllipsoid !== val) {
      this._showThroughEllipsoid = val;
      this._createRS = true;
    }
  }
  /**
   * 材质
   * @type {Material}
   */
  get material() {
    return this._material
  }
  set material(val) {
    this._material = val;
    this._createRS = true;
    this._createSP = true;
  }

  /**
   * 每一帧在渲染时Cesium会自动调用该方法。不要主动调用该方法
   * @override
   * @param  {frameState} frameState
   */
  update(frameState) {
    const mode = frameState.mode;
    if (!this.show || mode !== SceneMode.SCENE3D) {
      return;
    }
    const xHalfAngle = this._xHalfAngle;
    const yHalfAngle = this._yHalfAngle;

    if (xHalfAngle < 0.0 || yHalfAngle < 0.0) {
      throw new CesiumProError('halfAngle must be greater than or equal to zero.');
    }
    if (xHalfAngle == 0.0 || yHalfAngle == 0.0) {
      return;
    }

    const radius = this.radius;
    if (radius < 0.0) {
      throw new CesiumProError('this.radius must be greater than or equal to zero.');
    }
    const showThroughEllipsoid = this.showThroughEllipsoid;
    const material = this.material;
    const translucent = material.isTranslucent();
    if (this._translucent !== translucent) {
      this._translucent = translucent;
      this._createRS = true;
    }
    if (this.showScanPlane) {
      const time = frameState.time;
      let timeDiff = JulianDate.secondsDifference(time, this._time);
      if (timeDiff < 0) {
        this._time = JulianDate.clone(time, this._time);
      }
      let percentage;
      if (this.speed <= 0) {
        percentage = 0;
      } else {
        const speet = 10 / this.speed;
        percentage = Math.max(timeDiff % speet / speet, 0);
      }
      let angle;
      const matrix3Scratch = new Matrix3;

      if (this.scanPlaneMode == 'H') {
        angle = 2 * yHalfAngle * percentage - yHalfAngle;
        const cosYHalfAngle = cos(angle);
        const tanXHalfAngle = tan(xHalfAngle);

        const maxX = atan(cosYHalfAngle * tanXHalfAngle);
        this._scanePlaneXHalfAngle = maxX;
        this._scanePlaneYHalfAngle = angle;
        Matrix3.fromRotationX(this._scanePlaneYHalfAngle, matrix3Scratch);
      } else {
        angle = 2 * xHalfAngle * percentage - xHalfAngle;
        const tanYHalfAngle = tan(yHalfAngle);
        const cosXHalfAngle = cos(angle);

        const maxY = atan(cosXHalfAngle * tanYHalfAngle);
        this._scanePlaneXHalfAngle = angle;
        this._scanePlaneYHalfAngle = maxY;
        Matrix3.fromRotationY(this._scanePlaneXHalfAngle, matrix3Scratch);
      }

      Matrix4.multiplyByMatrix3(this.modelMatrix, matrix3Scratch, this._computedScanPlaneModelMatrix);
      Matrix4.multiplyByUniformScale(this._computedScanPlaneModelMatrix, this.radius, this._computedScanPlaneModelMatrix);
    }

    if (this._createVS) {
      createVertexArray(this, frameState);
    }
    if (this._createRS) {
      createRenderState(this, showThroughEllipsoid, translucent);
    }
    if (this._createSP) {
      createShaderProgram(this, frameState, material);
    }
    if (this._createRS || this._createSP) {
      createCommands(this, translucent);
    }

    const commandList = frameState.commandList;
    const passes = frameState.passes;
    const colorCommands = this._colorCommands;
    if (passes.render) {
      for (let i = 0, len = colorCommands.length; i < len; i++) {
        const colorCommand = colorCommands[i];
        commandList.push(colorCommand);
      }
    }
  }
  /**
   * 销毁对象并翻译WebGL资源
   * @example
   * const radar=new CesiumPro.RectangularSensorPrimitive();
   * if(!radar.isDestroyed()){
   *    radar.destroy();
   * }
   */
  destroy() {
    this._pickSP.destroy();
    this._sp = this._sp.destroy();
    this._scanePlaneSP && (this._scanePlaneSP = this._scanePlaneSP.destroy());
    destroyObject(this);
  }
}


function createCommand(primitive, frontCommand, backCommand, frontFaceRS, backFaceRS, sp, va, uniforms, modelMatrix, translucent, pass, isLine) {
  if (translucent && backCommand) {
    backCommand.vertexArray = va;
    backCommand.renderState = backFaceRS;
    backCommand.shaderProgram = sp;
    backCommand.uniformMap = combine(uniforms, primitive._material._uniforms);
    backCommand.uniformMap.u_normalDirection = function () {
      return -1.0;
    };
    backCommand.pass = pass;
    backCommand.modelMatrix = modelMatrix;
    primitive._colorCommands.push(backCommand);
  }

  frontCommand.vertexArray = va;
  frontCommand.renderState = frontFaceRS;
  frontCommand.shaderProgram = sp;
  frontCommand.uniformMap = combine(uniforms, primitive._material._uniforms);
  if (isLine) {
    frontCommand.uniformMap.u_type = function () {
      return 1;
    };
  }
  frontCommand.pass = pass;
  frontCommand.modelMatrix = modelMatrix;
  primitive._colorCommands.push(frontCommand);
}

function createCommands(primitive, translucent) {
  primitive._colorCommands.length = 0;

  const pass = translucent ? Pass.TRANSLUCENT : Pass.OPAQUE;

  //显示扇面
  if (primitive.showLateralSurfaces) {
    createCommand(primitive, primitive._sectorFrontCommand, primitive._sectorBackCommand,
      primitive._frontFaceRS, primitive._backFaceRS, primitive._sp, primitive._sectorVA,
      primitive._uniforms, primitive._computedModelMatrix, translucent,
      pass);
  }
  //显示扇面线
  if (primitive.showSectorLines) {
    createCommand(primitive, primitive._sectorLineCommand, undefined, primitive._frontFaceRS,
      primitive._backFaceRS, primitive._sp, primitive._sectorLineVA, primitive._uniforms,
      primitive._computedModelMatrix, translucent, pass, true);
  }

  //显示扇面交接线
  if (primitive.showSectorSegmentLines) {
    createCommand(primitive, primitive._sectorSegmentLineCommand, undefined, primitive._frontFaceRS,
      primitive._backFaceRS, primitive._sp, primitive._sectorSegmentLineVA, primitive._uniforms,
      primitive._computedModelMatrix, translucent, pass,
      true);
  }

  //显示弧面
  if (primitive.showDomeSurfaces) {
    createCommand(primitive, primitive._domeFrontCommand, primitive._domeBackCommand,
      primitive._frontFaceRS, primitive._backFaceRS, primitive._sp, primitive._domeVA,
      primitive._uniforms, primitive._computedModelMatrix, translucent, pass);
  }

  //显示弧面线
  if (primitive.showDomeLines) {
    createCommand(primitive, primitive._domeLineCommand, undefined, primitive._frontFaceRS,
      primitive._backFaceRS, primitive._sp, primitive._domeLineVA, primitive._uniforms,
      primitive._computedModelMatrix, translucent, pass, true);
  }
  //显示扫描面
  if (primitive.showScanPlane) {
    createCommand(primitive, primitive._scanPlaneFrontCommand, primitive._scanPlaneBackCommand,
      primitive._frontFaceRS, primitive._backFaceRS, primitive._scanePlaneSP, primitive._scanPlaneVA,
      primitive._scanUniforms, primitive
      ._computedScanPlaneModelMatrix, translucent, pass);
  }
  return
}

function createCommonShaderProgram(primitive, frameState, material) {
  const context = frameState.context;

  const vs = sensorVS;
  const fs = new ShaderSource({
    sources: [sensorComm, material.shaderSource, sensorFS]
  });

  primitive._sp = ShaderProgram.replaceCache({
    context: context,
    shaderProgram: primitive._sp,
    vertexShaderSource: vs,
    fragmentShaderSource: fs,
    attributeLocations: attributeLocations
  });

  const pickFS = new ShaderSource({
    sources: [sensorComm, material.shaderSource, sensorFS],
    pickColorQualifier: 'uniform'
  });

  primitive._pickSP = ShaderProgram.replaceCache({
    context: context,
    shaderProgram: primitive._pickSP,
    vertexShaderSource: vs,
    fragmentShaderSource: pickFS,
    attributeLocations: attributeLocations
  });
}

function createScanPlaneShaderProgram(primitive, frameState, material) {
  const context = frameState.context;

  const vs = sensorVS;
  const fs = new ShaderSource({
    sources: [sensorComm, material.shaderSource, scanPlaneFS]
  });

  primitive._scanePlaneSP = ShaderProgram.replaceCache({
    context: context,
    shaderProgram: primitive._scanePlaneSP,
    vertexShaderSource: vs,
    fragmentShaderSource: fs,
    attributeLocations: attributeLocations
  });
}

function createShaderProgram(primitive, frameState, material) {
  createCommonShaderProgram(primitive, frameState, material);

  if (primitive.showScanPlane) {
    createScanPlaneShaderProgram(primitive, frameState, material);
  }
}

function createRenderState(primitive, showThroughEllipsoid, translucent) {
  if (translucent) {
    primitive._frontFaceRS = RenderState.fromCache({
      depthTest: {
        enabled: !showThroughEllipsoid
      },
      depthMask: false,
      blending: BlendingState.ALPHA_BLEND,
      cull: {
        enabled: true,
        face: CullFace.BACK
      }
    });

    primitive._backFaceRS = RenderState.fromCache({
      depthTest: {
        enabled: !showThroughEllipsoid
      },
      depthMask: false,
      blending: BlendingState.ALPHA_BLEND,
      cull: {
        enabled: true,
        face: CullFace.FRONT
      }
    });

    primitive._pickRS = RenderState.fromCache({
      depthTest: {
        enabled: !showThroughEllipsoid
      },
      depthMask: false,
      blending: BlendingState.ALPHA_BLEND
    });
  } else {
    primitive._frontFaceRS = RenderState.fromCache({
      depthTest: {
        enabled: !showThroughEllipsoid
      },
      depthMask: true
    });

    primitive._pickRS = RenderState.fromCache({
      depthTest: {
        enabled: true
      },
      depthMask: true
    });
  }
}

function computeUnitPosiiton(primitive, xHalfAngle, yHalfAngle) {
  const slice = primitive.slice;
  //以中心为角度
  const cosYHalfAngle = cos(yHalfAngle);
  const tanYHalfAngle = tan(yHalfAngle);
  const cosXHalfAngle = cos(xHalfAngle);
  const tanXHalfAngle = tan(xHalfAngle);

  const maxY = atan(cosXHalfAngle * tanYHalfAngle);
  const maxX = atan(cosYHalfAngle * tanXHalfAngle);

  //ZOY面单位圆
  const zoy = [];
  for (let i = 0; i < slice; i++) {
    const phi = 2 * maxY * i / (slice - 1) - maxY;
    zoy.push(new Cartesian3(0, sin(phi), cos(phi)));
  }
  //zox面单位圆
  const zox = [];
  for (let i = 0; i < slice; i++) {
    const phi = 2 * maxX * i / (slice - 1) - maxX;
    zox.push(new Cartesian3(sin(phi), 0, cos(phi)));
  }

  return {
    zoy: zoy,
    zox: zox
  };
}


function computeSectorPositions(primitive, unitPosition) {
  const xHalfAngle = primitive._xHalfAngle,
    yHalfAngle = primitive._yHalfAngle,
    zoy = unitPosition.zoy,
    zox = unitPosition.zox;
  const positions = [];

  //zoy面沿y轴逆时针转xHalfAngle
  const matrix3Scratch = new Matrix3()
  let matrix3 = Matrix3.fromRotationY(xHalfAngle, matrix3Scratch);
  positions.push(zoy.map(function (p) {
    return Matrix3.multiplyByVector(matrix3, p, new Cartesian3());
  }));
  //zox面沿x轴顺时针转yHalfAngle
  matrix3 = Matrix3.fromRotationX(-yHalfAngle, matrix3Scratch);
  positions.push(zox.map(function (p) {
    return Matrix3.multiplyByVector(matrix3, p, new Cartesian3());
  }).reverse());
  //zoy面沿y轴顺时针转xHalfAngle
  matrix3 = Matrix3.fromRotationY(-xHalfAngle, matrix3Scratch);
  positions.push(zoy.map(function (p) {
    return Matrix3.multiplyByVector(matrix3, p, new Cartesian3());
  }).reverse());
  //zox面沿x轴逆时针转yHalfAngle
  matrix3 = Matrix3.fromRotationX(yHalfAngle, matrix3Scratch);
  positions.push(zox.map(function (p) {
    return Matrix3.multiplyByVector(matrix3, p, new Cartesian3());
  }));
  return positions;
}
/**
 * 创建扇面顶点
 * @private
 * @param context
 * @param positions
 * @returns {*}
 */

function createSectorVertexArray(context, positions) {
  const planeLength = Array.prototype.concat.apply([], positions).length - positions.length;
  const vertices = new Float32Array(2 * 3 * 3 * planeLength);

  let k = 0;
  for (let i = 0, len = positions.length; i < len; i++) {
    const planePositions = positions[i];
    const nScratch = new Cartesian3();
    const n = Cartesian3.normalize(Cartesian3.cross(planePositions[0],
      planePositions[planePositions.length - 1], nScratch), nScratch);
    for (let j = 0, planeLength = planePositions.length - 1; j < planeLength; j++) {
      vertices[k++] = 0.0;
      vertices[k++] = 0.0;
      vertices[k++] = 0.0;
      vertices[k++] = -n.x;
      vertices[k++] = -n.y;
      vertices[k++] = -n.z;

      vertices[k++] = planePositions[j].x;
      vertices[k++] = planePositions[j].y;
      vertices[k++] = planePositions[j].z;
      vertices[k++] = -n.x;
      vertices[k++] = -n.y;
      vertices[k++] = -n.z;

      vertices[k++] = planePositions[j + 1].x;
      vertices[k++] = planePositions[j + 1].y;
      vertices[k++] = planePositions[j + 1].z;
      vertices[k++] = -n.x;
      vertices[k++] = -n.y;
      vertices[k++] = -n.z;
    }
  }

  const vertexBuffer = Buffer.createVertexBuffer({
    context: context,
    typedArray: vertices,
    usage: BufferUsage.STATIC_DRAW
  });

  const stride = 2 * 3 * Float32Array.BYTES_PER_ELEMENT;

  const attributes = [{
    index: attributeLocations.position,
    vertexBuffer: vertexBuffer,
    componentsPerAttribute: 3,
    componentDatatype: ComponentDatatype.FLOAT,
    offsetInBytes: 0,
    strideInBytes: stride
  }, {
    index: attributeLocations.normal,
    vertexBuffer: vertexBuffer,
    componentsPerAttribute: 3,
    componentDatatype: ComponentDatatype.FLOAT,
    offsetInBytes: 3 * Float32Array.BYTES_PER_ELEMENT,
    strideInBytes: stride
  }];

  return new VertexArray({
    context: context,
    attributes: attributes
  });
}

/**
 * 创建扇面边线顶点
 * @param context
 * @param positions
 * @returns {*}
 */
function createSectorLineVertexArray(context, positions) {
  const planeLength = positions.length;
  const vertices = new Float32Array(3 * 3 * planeLength);

  let k = 0;
  for (let i = 0, len = positions.length; i < len; i++) {
    const planePositions = positions[i];
    vertices[k++] = 0.0;
    vertices[k++] = 0.0;
    vertices[k++] = 0.0;

    vertices[k++] = planePositions[0].x;
    vertices[k++] = planePositions[0].y;
    vertices[k++] = planePositions[0].z;
  }

  const vertexBuffer = Buffer.createVertexBuffer({
    context: context,
    typedArray: vertices,
    usage: BufferUsage.STATIC_DRAW
  });

  const stride = 3 * Float32Array.BYTES_PER_ELEMENT;

  const attributes = [{
    index: attributeLocations.position,
    vertexBuffer: vertexBuffer,
    componentsPerAttribute: 3,
    componentDatatype: ComponentDatatype.FLOAT,
    offsetInBytes: 0,
    strideInBytes: stride
  }];

  return new VertexArray({
    context: context,
    attributes: attributes
  });
}

/**
 * 创建扇面圆顶面连接线顶点
 * @private
 * @param context
 * @param positions
 * @returns {*}
 */
function createSectorSegmentLineVertexArray(context, positions) {
  const planeLength = Array.prototype.concat.apply([], positions).length - positions.length;
  const vertices = new Float32Array(3 * 3 * planeLength);

  let k = 0;
  for (let i = 0, len = positions.length; i < len; i++) {
    const planePositions = positions[i];

    for (let j = 0, planeLength = planePositions.length - 1; j < planeLength; j++) {
      vertices[k++] = planePositions[j].x;
      vertices[k++] = planePositions[j].y;
      vertices[k++] = planePositions[j].z;

      vertices[k++] = planePositions[j + 1].x;
      vertices[k++] = planePositions[j + 1].y;
      vertices[k++] = planePositions[j + 1].z;
    }
  }

  const vertexBuffer = Buffer.createVertexBuffer({
    context: context,
    typedArray: vertices,
    usage: BufferUsage.STATIC_DRAW
  });

  const stride = 3 * Float32Array.BYTES_PER_ELEMENT;

  const attributes = [{
    index: attributeLocations.position,
    vertexBuffer: vertexBuffer,
    componentsPerAttribute: 3,
    componentDatatype: ComponentDatatype.FLOAT,
    offsetInBytes: 0,
    strideInBytes: stride
  }];

  return new VertexArray({
    context: context,
    attributes: attributes
  });
}

/**
 * 创建圆顶面顶点
 * @param context
 */
function createDomeVertexArray(context) {
  const geometry = EllipsoidGeometry.createGeometry(new EllipsoidGeometry({
    vertexFormat: VertexFormat.POSITION_ONLY,
    stackPartitions: 32,
    slicePartitions: 32
  }));

  const vertexArray = VertexArray.fromGeometry({
    context: context,
    geometry: geometry,
    attributeLocations: attributeLocations,
    bufferUsage: BufferUsage.STATIC_DRAW,
    interleave: false
  });
  return vertexArray;
}

/**
 * 创建圆顶面连线顶点
 * @param context
 */
function createDomeLineVertexArray(context) {
  const geometry = EllipsoidOutlineGeometry.createGeometry(new EllipsoidOutlineGeometry({
    vertexFormat: VertexFormat.POSITION_ONLY,
    stackPartitions: 32,
    slicePartitions: 32
  }));

  const vertexArray = VertexArray.fromGeometry({
    context: context,
    geometry: geometry,
    attributeLocations: attributeLocations,
    bufferUsage: BufferUsage.STATIC_DRAW,
    interleave: false
  });
  return vertexArray;
}

/**
 * 创建扫描面顶点
 * @param context
 * @param positions
 * @returns {*}
 */
function createScanPlaneVertexArray(context, positions) {
  const planeLength = positions.length - 1;
  const vertices = new Float32Array(3 * 3 * planeLength);

  let k = 0;
  for (let i = 0; i < planeLength; i++) {
    vertices[k++] = 0.0;
    vertices[k++] = 0.0;
    vertices[k++] = 0.0;

    vertices[k++] = positions[i].x;
    vertices[k++] = positions[i].y;
    vertices[k++] = positions[i].z;

    vertices[k++] = positions[i + 1].x;
    vertices[k++] = positions[i + 1].y;
    vertices[k++] = positions[i + 1].z;
  }

  const vertexBuffer = Buffer.createVertexBuffer({
    context: context,
    typedArray: vertices,
    usage: BufferUsage.STATIC_DRAW
  });

  const stride = 3 * Float32Array.BYTES_PER_ELEMENT;

  const attributes = [{
    index: attributeLocations.position,
    vertexBuffer: vertexBuffer,
    componentsPerAttribute: 3,
    componentDatatype: ComponentDatatype.FLOAT,
    offsetInBytes: 0,
    strideInBytes: stride
  }];

  return new VertexArray({
    context: context,
    attributes: attributes
  });
}

function createVertexArray(primitive, frameState) {
  const context = frameState.context;

  const unitSectorPositions = computeUnitPosiiton(primitive, primitive._xHalfAngle, primitive._yHalfAngle);
  const positions = computeSectorPositions(primitive, unitSectorPositions);

  //显示扇面
  if (primitive.showLateralSurfaces) {
    primitive._sectorVA = createSectorVertexArray(context, positions);
  }

  //显示扇面线
  if (primitive.showSectorLines) {
    primitive._sectorLineVA = createSectorLineVertexArray(context, positions);
  }

  //显示扇面圆顶面的交线
  if (primitive.showSectorSegmentLines) {
    primitive._sectorSegmentLineVA = createSectorSegmentLineVertexArray(context, positions);
  }

  //显示弧面
  if (primitive.showDomeSurfaces) {
    primitive._domeVA = createDomeVertexArray(context);
  }

  //显示弧面线
  if (primitive.showDomeLines) {
    primitive._domeLineVA = createDomeLineVertexArray(context);
  }

  //显示扫描面
  if (primitive.showScanPlane) {

    if (primitive.scanPlaneMode == 'H') {
      const unitScanPlanePositions = computeUnitPosiiton(primitive, CesiumMath.PI_OVER_TWO, 0);
      primitive._scanPlaneVA = createScanPlaneVertexArray(context, unitScanPlanePositions.zox);
    } else {
      const unitScanPlanePositions = computeUnitPosiiton(primitive, 0, CesiumMath.PI_OVER_TWO);
      primitive._scanPlaneVA = createScanPlaneVertexArray(context, unitScanPlanePositions.zoy);
    }
  }
}
export default RectangularSensorPrimitive;

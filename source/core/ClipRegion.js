import CesiumProError from "./CesiumProError"
import createGuid from './guid'
const {
  Cartesian3, RenderState, Cartesian4, Matrix4, Texture, PixelFormat, PixelDatatype, 
  Framebuffer, DrawCommand, Pass, ShaderProgram, BoundingSphere, VertexArray, PolygonHierarchy, 
  PolygonGeometry, BoundingRectangle, Transforms, ClearCommand, Color, PassState, OrthographicOffCenterFrustum, 
  Cartographic, defined, destroyObject, BufferUsage, WebGLConstants, PrimitiveType
} = Cesium;
const vs = `
attribute vec3 position;
varying float depth;
uniform mat4 u_inverseMatrix;
void main() {
  vec4 pos = vec4(position, 1.0);  
  vec4 positionLC = u_inverseMatrix * pos;
  depth = positionLC.z;
  gl_Position = czm_projection * vec4(positionLC.xy, 0.0, 1.0); 
}
`
const fs = `
varying float depth;
void main() {
  float fDepth = depth / 1024.0; 
  gl_FragColor = czm_packDepth(fDepth);
}
`
class OrthographicCamera {
  constructor() {
    this.viewMatrix = Matrix4.IDENTITY;
    this.inverseViewMatrix = Matrix4.IDENTITY;
    this.frustum = new OrthographicOffCenterFrustum();
    this.positionCartographic = new Cartographic();
    this.upWC = Cartesian3.clone(Cartesian3.UNIT_Y);
    this.rightWC = Cartesian3.clone(Cartesian3.UNIT_X);
    this.directionWC = Cartesian3.clone(Cartesian3.UNIT_Z);
    this.viewPorjectionMatrix = Matrix4.IDENTITY;
  }
  clone(camera) {
    Matrix4.clone(camera.viewMatrix, this.viewMatrix);
    Matrix4.clone(camera.inverseViewMatrix, this.inverseViewMatrix);
    this.frustum = camera.frustum.clone(this.frustum);
    Cartographic.clone(camera.positionCartographic, this.positionCartographic);
    Cartesian3.clone(camera.upWC, this.upWC);
    Cartesian3.clone(camera.rigtWC, this.rightWC);
    Cartesian3.clone(camera.directionWC, this.directionWC);
  }
}
class ClipRegion {
  /**
   * 创建一个clipRegion
   * @param {Cesium.Cartesian3[]} positions 定义clip区域的笛卡尔坐标
   */
  constructor(positions) {
    if (!Array.isArray(positions)) {
      throw CesiumProError('positions must be a cartesian3 array.');
    }
    this.positions = positions.filter(_ => _ instanceof Cartesian3);
    this._colorTexture = undefined;
    this._depthStenclilTexture = undefined;
    this.frameBuffer = undefined;
    this._viewport = new BoundingRectangle();
    this._rs = undefined;
    this._clearColorCommand = new ClearCommand({
      depth: 1,
      coloe: new Color(0.0, 0.0, 0.0, 1.0)
    })
    this._useScissorTest = false;
    this._scissorRectangle = false;
    this._command = undefined;
    this._camera = new OrthographicCamera();
    this._passState = undefined;
    this._clearPassState = undefined;
    this._positions = [];
    this._delta = 0.0;
    this._localModel = undefined;
    this._inverseLocalModel = undefined;
    this._uniforms = {};
    this._initShaderSource = false;
    this._colorTexture = undefined;
    this._enabled = true;
    const bounding = BoundingSphere.fromPoints(this.positions);
    let center = bounding.center;
    const cartographic = Cartographic.fromCartesian(center);
    center = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0);
    this._localModel = Transforms.eastNorthUpToFixedFrame(center);
    this._inverseLocalModel = Matrix4.inverse(this._localModel, {});
    const localPositions = positions.map(_ => Matrix4.multiplyByPoint(this._inverseLocalModel, _, {}));
    const boundingRect = BoundingRectangle.fromPoints(localPositions);
    this.boundingRect = new Cartesian4(boundingRect.x, boundingRect.y, boundingRect.x + boundingRect.width, boundingRect.y + boundingRect.height)
    const frustum = this._camera.frustum;
    frustum.left = boundingRect.x;
    frustum.top = boundingRect.y + boundingRect.height;
    frustum.right = boundingRect.x + boundingRect.width;
    frustum.bottom = boundingRect.y;
    this.normal = Cartesian3.normalize(this.positions[0], {});
    this._width = 256;
    this._height = 256;
    this._id = createGuid();
  }
  /**
   * 是否有效
   * @type {boolean}
   */
  get enabled() {
    return this._enabled;
  }
  set enabled(enabled) {
    this._enabled = enabled;
  }
  _createVertexArray(frameState) {
    const polygon = new PolygonGeometry({
      polygonHierarchy: new PolygonHierarchy(this.positions)
    });
    const geometry = PolygonGeometry.createGeometry(polygon);
    return VertexArray.fromGeometry({
      context: frameState.context,
      geometry,
      attributeLocations: { position: 0 },
      bufferUsage: BufferUsage.STREAM_DRAW,
      interleave: true,
    });

  }
  _createDrawcommand(frameState) {
    this._passState = new PassState(frameState.context);
    this._passState.viewport = new BoundingRectangle(100, 100, this._width, this._height);
    this._clearPassState = new PassState(frameState.context);
    const va = this._createVertexArray(frameState);
    const sp = ShaderProgram.fromCache({
      context: frameState.context,
      vertexShaderSource: vs,
      fragmentShaderSource: fs,
    });
    const renderState = RenderState.fromCache({
      viewport: new BoundingRectangle(0, 0, this._width, this._height),
      depthTest: {
        enabled: true,
        // func: Cesium.DepthFunction.ALWAYS // always pass depth test for full control of depth information
      },
      cull: {
        enabled: true,
        face: WebGLConstants.BACK
      },
      depthMask: true
    })
    const command = new DrawCommand({
      primitiveType: PrimitiveType.TRIANGLES,
      vertexArray: va,
      shaderProgram: sp,
      uniformMap: {
        u_inverseMatrix: () => {
          return this._inverseLocalModel;
        }
      },
      renderState,
      pass: Pass.OPAQUE
    })
    this._command = command;
  }
  _updateFramebuffer(frameState) {
    const colorTexture = this._colorTexture;
    const isEqual = defined(colorTexture) && colorTexture.width !== this._width && colorTexture.height !== this._height;
    if ((defined(this.frameBuffer) || isEqual)) {
      return;
    }
    if (colorTexture && !colorTexture.isDestroyed()) {
      colorTexture.destroy();
    }
    if (this._depthStenclilTexture && !this._depthStenclilTexture.isDestroyed()) {
      this._depthStenclilTexture.destroy();
    }
    if (this.frameBuffer && !this.frameBuffer.isDestroyed()) {
      this.frameBuffer.destroy();
    }
    this._colorTexture = new Texture({
      context: frameState.context,
      width: this._width,
      height: this._height,
      pixelFormat: PixelFormat.RGBA,
      pixelDatatype: PixelDatatype.UNSIGNED_BYTE
    })

    this._depthStenclilTexture = new Texture({
      context: frameState.context,
      width: this._width,
      height: this._height,
      pixelFormat: PixelFormat.DEPTH_STENCIL,
      pixelDatatype: PixelDatatype.UNSIGNED_INT_24_8
    })
    this.frameBuffer = new Framebuffer({
      context: frameState.context,
      colorTextures: [this._colorTexture],
      depthStencilTexture: this._depthStenclilTexture,
      destroyAttachments: false
    })
  }
  /**
   * 不是主动调用该方法
   * @param {Cesium.FrameState} frameState 
   */
  update(frameState) {
    if (!this._enabled) {
      return;
    }
    if (!this._command) {
      this._createDrawcommand(frameState);
    }
    this._updateFramebuffer(frameState);
    const uniformState = frameState.context.uniformState;
    uniformState.updateCamera(this._camera);
    this._clear(frameState);
    uniformState.updatePass(this._command.pass);
    this._command.framebuffer = this.frameBuffer;
    this._command.execute(frameState.context, this._passState)
  }
  _clear(frameState) {
    if (this._clearColorCommand) {
      this._clearColorCommand.framebuffer = this.frameBuffer;
      this._clearColorCommand.execute(frameState.context, this._clearPassState);
    }
  }
  /**
   * 是否被销毁
   * @returns {boolean} true 并未已经被销毁，该实例的所有方法将被释放
   */
  isDestroyed() {
    return false;
  }
  /**
   * 销毁对象
   */
  destroy() {
    if (this._colorTexture && !this._colorTexture.isDestroyed()) {
      this._colorTexture.destroy();
    }
    if (this._depthStenclilTexture && !this._depthStenclilTexture.isDestroyed()) {
      this._depthStenclilTexture.destroy();
    }
    if (this.frameBuffer && !this.frameBuffer.isDestroyed()) {
      this.frameBuffer.destroy();
    }
    destroyObject(this);
  }
}
export default ClipRegion
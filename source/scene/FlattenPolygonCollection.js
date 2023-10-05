import Tileset from "./Tileset";

const {
  BoundingRectangle, Cartesian3, Cartographic, Color, defined, destroyObject, Matrix4, 
  OrthographicOffCenterFrustum, PixelFormat, ClearCommand, Framebuffer, PassState, 
  PixelDatatype, Texture, PolygonGeometry, PolygonHierarchy, BoundingSphere, VertexArray, 
  BufferUsage, ShaderProgram, RenderState, WebGLConstants, DrawCommand, PrimitiveType, Pass, 
  Transforms, CustomShader, UniformType, TextureUniform, TextureManager, ShaderSource
} = Cesium;
const loadTexture2D = TextureManager.prototype.loadTexture2D;
TextureManager.prototype.loadTexture2D = function (textureId, textureUniform) {
  if (textureUniform.texture) {
    this._textures[textureId] = textureUniform.texture;
  } else {
    loadTexture2D(textureId, textureUniform)
  }
};
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
const vs = `
attribute vec3 position;
varying float depth;
void main() {
  vec4 pos = vec4(position, 1.0);
  depth = position.z;
  gl_Position = czm_projection * vec4(position.xy, 0.0, 1.0); 
}
`
const fs = `
varying float depth;
void main() {
  float fDepth = depth / 4096.0; 
  gl_FragColor = czm_packDepth(fDepth);
}
`
function updateFramebuffer(frameState) {
  const width = parseInt(this._width);
  const height = parseInt(this._height);
  const colorTexture = this._colorTexture;
  const isEqual = defined(colorTexture) && colorTexture.width !== width && colorTexture.height !== height;
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
    context: this._frameState.context,
    width: this._width,
    height: this._height,
    pixelFormat: PixelFormat.RGBA,
    pixelDatatype: PixelDatatype.UNSIGNED_BYTE
  })
  // window._colorTexture = this._colorTexture;
  // create texture
  this._clearPassState = new PassState(frameState.context);
  this._depthStenclilTexture = new Texture({
    context: frameState.context,
    width,
    height,
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
function getShaderVS() {
  return `bool isPointInBound(vec4 point, vec4 bounds) {
    return (point.x>bounds.x&&point.x<bounds.z&&point.y>bounds.y&&point.y<bounds.w);
  }
  void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput) {
  vec4 positionLC = u_inverseLocalModel * czm_model * vec4(vsInput.attributes.positionMC, 1.0);  
    if (u_enabled && isPointInBound(positionLC, u_polygonBounding)) {
      vec2 textureCoord;
      textureCoord.x = (positionLC.x-u_polygonBounding.x)/(u_polygonBounding.z-u_polygonBounding.x);
      textureCoord.y = (positionLC.y-u_polygonBounding.y)/(u_polygonBounding.w-u_polygonBounding.y);
      float depth = czm_unpackDepth(texture2D(u_polygonTexture, textureCoord));
      depth = depth * 4096.0;
      if (depth > 1.0 && positionLC.z > depth) {
        positionLC.z = mix(depth, positionLC.z, u_delta);
      }
      vsOutput.positionMC = (czm_inverseModel * u_localModel * positionLC).xyz;
    }       
  }`
}
class FlattenPolygonCollection {
  /**
   * 创建一个用于压平的多边形集合
   * @param {Cesium.Model|Cesium.Cesium3DTileset} model 模型，可以是gltf或Cesium3DTileset 
   * @param {Cesium.Viewer} viewer 
   */
  constructor(model, viewer) {
    this._model = model;
    if (model instanceof Tileset) {
      this._model = model.delegate;
    }
    this._frameState = viewer.scene.frameState;
    this._colorTexture = undefined;
    this._depthStenclilTexture = undefined;
    this.frameBuffer = undefined;
    this._viewport = new BoundingRectangle();
    this._rs = undefined;
    this.canvas = undefined;
    this._clearColorCommand = new ClearCommand({
      depth: 1,
      coloe: new Color(0.0, 0.0, 0.0, 1.0)
    })
    this._useScissorTest = false;
    this._scissorRectangle = false;
    this._drawCommandList = [];
    this._camera = new OrthographicCamera();
    this._passState = undefined;
    this._clearPassState = undefined;
    this._width = 4096;
    this._height = 4096;
    this._positions = [];
    this._polygonBounding = new BoundingRectangle();
    this._delta = 0.0;
    this._localModel = undefined;
    this._inverseLocalModel = undefined;
    this._uniforms = {};
    this._initShaderSource = false;
    this._colorTexture = undefined;
    this._enabled = true;
    this._removeEvent = viewer.scene.postRender.addEventListener((scene) => {
      this.update(scene.frameState);
    });

  }
  get enabled() {
    return this._enabled;
  }
  set enabled(val) {
    this._enabled = val;
  }
  get ready() {
    return this._model.ready;
  }
  get readyPromise() {
    return this._model.readyPromise;
  }
  get polygonBounding() {
    return this._polygonBounding;
  }
  set polygonBounding(val) {
    this._polygonBounding = {
      x: val.x,
      y: val.y,
      z: val.x + val.width,
      w: val.y + val.height
    };
    const frustum = this._camera.frustum;
    frustum.left = val.x;
    frustum.top = val.y + val.height;
    frustum.right = val.x + val.width;
    frustum.bottom = val.y;
  }
  _updateUniforms() {
    if (this._uniforms) {
      if (this._uniforms.u_polygonTexture) {
        const tex = new TextureUniform({ url: './' });
        tex.texture = this._colorTexture;
        this._uniforms.u_polygonTexture.value = tex;
      }
      if (this._uniforms.u_polygonBounding) {
        this._uniforms.u_polygonBounding.value = this._polygonBounding;
      }
      if (this._uniforms.u_enabled) {
        this._uniforms.u_enabled.value = this._enabled;
      }
      if (this._uniforms.u_delta) {
        this._uniforms.u_delta.value = this._delta;
      }
    }
  }
  _addShaderSource() {
    // if (!this._model.customShader) {
    //   throw new Error('Cesium版本太低，请使用1.84以上的版本')
    // }
    if (this._initShaderSource) {
      return;
    }
    const tex = new TextureUniform({ url: './' });
    tex.texture = this._colorTexture;
    const uniforms = {
      u_inverseLocalModel: {
        type: UniformType.MAT4,
        value: this._inverseLocalModel
      },
      u_localModel: {
        type: UniformType.MAT4,
        value: this._localModel
      },
      u_polygonBounding: {
        type: UniformType.VEC4,
        value: this.polygonBounding
      },
      u_polygonTexture: {
        type: UniformType.SAMPLER_2D,
        value: tex,
      },
      u_delta: {
        type: UniformType.FLOAT,
        value: this._delta
      },
      u_enabled: {
        type: UniformType.BOOL,
        value: this._enabled
      }
    }
    this._uniforms = uniforms;
    this._model.customShader = new CustomShader({
      uniforms,
      vertexShaderText: getShaderVS()
    })
    this._initShaderSource = true;
  }
  _createDrawCommand(geometry, matrix) {
    const frameState = this._frameState;
    const ap = geometry.attributes.position.values;
    for (let i = 0, n = ap.length; i < n / 3; i++) {
      const p = new Cartesian3(ap[i * 3], ap[i * 3 + 1], ap[i * 3 + 2]);
      Matrix4.multiplyByPoint(matrix, p, p)
      ap[i * 3] = p.x;
      ap[i * 3 + 1] = p.y;
      ap[i * 3 + 2] = p.z;
      this._positions.push(p);
    }
    geometry.boundingSphere = BoundingSphere.transform(geometry.boundingSphere, matrix);
    this.polygonBounding = BoundingRectangle.fromPoints(this._positions);
    const vertex = VertexArray.fromGeometry({
      context: frameState.context,
      geometry,
      attributeLocations: { position: 0 },
      bufferUsage: BufferUsage.STREAM_DRAW,
      interleave: true,
    });
    const sp = ShaderProgram.fromCache({
      context: frameState.context,
      vertexShaderSource: vs,
      fragmentShaderSource: fs,
    });
    const renderState = new RenderState();
    renderState.depthTest.enabled = true;
    renderState.cull.enabled = true;
    renderState.cull.face = WebGLConstants.BACK;
    const command = new DrawCommand({
      primitiveType: PrimitiveType.TRIANGLES,
      vertexArray: vertex,
      shaderProgram: sp,
      uniformMap: {},
      renderState,
      pass: Pass.CESIUM_3D_TILE
    })
    this._updateUniforms();
    this._drawCommandList.push(command);
  }
  addPolygon(geometry) {
    if (!this._localModel) {
      this.readyPromise.then(() => {
        this._updateMatrix();
        this._createDrawCommand(geometry, this._inverseLocalModel);
      })
    } else {
      this._createDrawCommand(geometry, this._inverseLocalModel);
    }
  }
  _updateMatrix() {
    let center = this._model._rtcCenter;
    if (!center) {
      const bCenter = this._model.boundingSphere.center;
      const cartographic = Cartographic.fromCartesian(bCenter);
      center = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0);
    }
    this._localModel = Transforms.eastNorthUpToFixedFrame(center);
    this._inverseLocalModel = Matrix4.inverse(this._localModel, {});
  }
  addPolygonFromPositionArray(positions) {
    const height = Math.min(...positions.map(_ => Cartographic.fromCartesian(_).height))
    const polygonGeometry = new PolygonGeometry({
      polygonHierarchy: new PolygonHierarchy(positions),
      height
    });
    const geometry = PolygonGeometry.createGeometry(polygonGeometry);
    this.addPolygon(geometry);
  }
  update(frameState) {
    if (!this._drawCommandList.length) {
      return;
    }
    updateFramebuffer.call(this, frameState);
    if (!this._initShaderSource) {
      this._addShaderSource();
    }
    if (!defined(this._passState)) {
      this._passState = new PassState(frameState.context);
    }
    this._updateUniforms();
    this._passState.viewport = new BoundingRectangle(0, 0, this._width, this._height);
    const uniformState = frameState.context.uniformState;
    uniformState.updateCamera(this._camera);
    this._clearColorCommand.framebuffer = this.frameBuffer;
    this._clearColorCommand.execute(frameState.context, this._clearPassState);
    for (const cmd of this._drawCommandList) {
      uniformState.updatePass(cmd.pass);
      cmd.framebuffer = this.frameBuffer;
      cmd.execute(frameState.context, this._passState)
    }
  }
  clear() {
    if (this._clearColorCommand) {
      this._clearColorCommand.execute(this._frameState.context, this._clearPassState);
    }
  }
  isDestroyed() {
    return false;
  }
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
    this._removeEvent();
  }
}

export default FlattenPolygonCollection;
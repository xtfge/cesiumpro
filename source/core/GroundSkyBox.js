/* eslint-disable no-multi-assign */
/* eslint-disable no-multi-str */
import skyBoxFS from '../shader/GroundSkyBoxFS';
import skyBoxVS from '../shader/GroundSkyBoxVS';
/*
 * Cesium近地天空盒
 */

const SkyBoxFS = skyBoxFS;

const SkyBoxVS = skyBoxVS;

class GroundSkyBox {
  /**
   * 近景天空盒
   * @param {Object} options 同Cesium Skybox
   */
  constructor(options) {
    const {
      defaultValue,
      Matrix4,
      DrawCommand,
    } = Cesium;
    this.sources = options.sources;
    this._sources = undefined;

    /**
     * 决定天空盒是否被显示.
     *
     * @type {Boolean}
     * @default true
     */
    this.show = defaultValue(options.show, true);

    this._command = new DrawCommand({
      modelMatrix: Matrix4.clone(Matrix4.IDENTITY),
      owner: this,
    });
    this._cubeMap = undefined;

    this._attributeLocations = undefined;
    this._useHdr = undefined;
    this._isDestroyed = false;
  }

  /**
   *
   * 当场景渲染的时候会自动调用该函数更新天空盒。
   * <p>切勿主动调用该函数。</p>
   */
  update(frameState, useHdr) {
    const {
      BoxGeometry,
      Cartesian3,
      defined,
      DeveloperError,
      GeometryPipeline,
      Matrix4,
      Transforms,
      VertexFormat,
      BufferUsage,
      CubeMap,
      loadCubeMap,
      RenderState,
      VertexArray,
      BlendingState,
      SceneMode,
      ShaderProgram,
      ShaderSource,
      Matrix3,
    } = Cesium;
    const skyboxMatrix3 = new Matrix3();
    const that = this;

    if (!this.show) {
      return undefined;
    }

    if ((frameState.mode !== SceneMode.SCENE3D)
      && (frameState.mode !== SceneMode.MORPHING)) {
      return undefined;
    }

    // The sky box is only rendered during the render pass; it is not pickable,
    // it doesn't cast shadows, etc.
    if (!frameState.passes.render) {
      return undefined;
    }

    const {
      context,
    } = frameState;

    if (this._sources !== this.sources) {
      this._sources = this.sources;
      const {
        sources,
      } = this;

      if ((!defined(sources.positiveX))
        || (!defined(sources.negativeX))
        || (!defined(sources.positiveY))
        || (!defined(sources.negativeY))
        || (!defined(sources.positiveZ))
        || (!defined(sources.negativeZ))) {
        throw new DeveloperError('this.sources is required and must have positiveX, negativeX, positiveY, negativeY, positiveZ, and negativeZ properties.');
      }

      if ((typeof sources.positiveX !== typeof sources.negativeX)
        || (typeof sources.positiveX !== typeof sources.positiveY)
        || (typeof sources.positiveX !== typeof sources.negativeY)
        || (typeof sources.positiveX !== typeof sources.positiveZ)
        || (typeof sources.positiveX !== typeof sources.negativeZ)) {
        throw new DeveloperError('this.sources properties must all be the same type.');
      }

      if (typeof sources.positiveX === 'string') {
        // Given urls for cube-map images.  Load them.
        loadCubeMap(context, this._sources).then((cubeMap) => {
          that._cubeMap = that._cubeMap && that._cubeMap.destroy();
          that._cubeMap = cubeMap;
        });
      } else {
        this._cubeMap = this._cubeMap && this._cubeMap.destroy();
        this._cubeMap = new CubeMap({
          context,
          source: sources,
        });
      }
    }

    const command = this._command;

    command.modelMatrix = Transforms.eastNorthUpToFixedFrame(frameState.camera._positionWC);
    if (!defined(command.vertexArray)) {
      command.uniformMap = {
        u_cubeMap() {
          return that._cubeMap;
        },
        u_rotateMatrix() {
          if (typeof Matrix4.getRotation === 'function') {
            return Matrix4.getRotation(command.modelMatrix, skyboxMatrix3);
          }
          return Matrix4.getMatrix3(command.modelMatrix, skyboxMatrix3);
        },
      };

      const geometry = BoxGeometry.createGeometry(BoxGeometry.fromDimensions({
        dimensions: new Cartesian3(2.0, 2.0, 2.0),
        vertexFormat: VertexFormat.POSITION_ONLY,
      }));
      const attributeLocations = this._attributeLocations = GeometryPipeline
        .createAttributeLocations(geometry);

      command.vertexArray = VertexArray.fromGeometry({
        context,
        geometry,
        attributeLocations,
        bufferUsage: BufferUsage._DRAW,
      });

      command.renderState = RenderState.fromCache({
        blending: BlendingState.ALPHA_BLEND,
      });
    }

    if (!defined(command.shaderProgram) || this._useHdr !== useHdr) {
      const fs = new ShaderSource({
        defines: [useHdr ? 'HDR' : ''],
        sources: [SkyBoxFS],
      });
      command.shaderProgram = ShaderProgram.fromCache({
        context,
        vertexShaderSource: SkyBoxVS,
        fragmentShaderSource: fs,
        attributeLocations: this._attributeLocations,
      });
      this._useHdr = useHdr;
    }

    if (!defined(this._cubeMap)) {
      return undefined;
    }

    return command;
  }

  /**
   * 对象是否被销毁
   */
  isDestroyed() {
    return this._isDestroyed;
  }

  /**
   * 销毁对象
   */
  destroy() {
    const command = this._command;
    command.vertexArray = command.vertexArray && command.vertexArray.destroy();
    command.shaderProgram = command.shaderProgram && command.shaderProgram.destroy();
    this._cubeMap = this._cubeMap && this._cubeMap.destroy();
    return Cesium.destroyObject(this);
  }
}

export default GroundSkyBox;

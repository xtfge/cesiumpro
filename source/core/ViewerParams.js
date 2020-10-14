import checkViewer from './checkViewer';
import CVT from './CVT';

class ViewerParams {
  /**
   * 获取当前场景的参数，包括经纬度、海拔、视高、帧率、延迟以及相机参数heading、pitch、roll。
   * 如果要更新帧率和延迟，应该在对象初始化后调用addPostRenderEvent()方法。
   * @param {Cesium.Viewer} viewer
   * @param {Boolean} [debug=false] 是否打开调试模式，打开开将在控制台打印参数
   */
  constructor(viewer, debug = false) {
    checkViewer(viewer);
    this._viewer = viewer;
    this._handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    this._lastFpsSampleTime = 0;
    this._fpsFrameCount = 0;
    this._msFrameCount = 0;
    this._fps = 0;
    this._ms = 0;
    this._lon = 0;
    this._lat = 0;
    this._height = 0;
    this._alt = undefined;
    this._heading = undefined;
    this._pitch = undefined;
    this._roll = undefined;
    this.debug = debug;
    this.addMousemoveEvent();
  }

  /**
   * 开始监听鼠标移动事件，获取鼠标所在位置的经纬度及高程。
   */
  addMousemoveEvent() {
    this.removeMousemoveEvent();
    this._handler.setInputAction((e) => {
      const coor = CVT.toDegrees(e.endPosition, this._viewer);
      if (!Cesium.defined(coor)) {
        return;
      }
      this._lon = coor.lon;
      this._lat = coor.lat;
      this._height = coor.height;
      this._alt = undefined;

      if (this._viewer.terrainProvider) {
        const cartesian = Cesium.Cartographic.fromCartesian(
          Cesium.Cartesian3.fromDegrees(this._lon, this._lat),
        );
        Cesium.sampleTerrainMostDetailed(this._viewer.terrainProvider, [cartesian])
          .then((sampler) => {
            this._alt = sampler[0].height;
          });
      }
      this.updateHeadingPitchRoll();
      if (this.debug) {
        console.log(this.params)
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  /**
   * 移除鼠标移动事件监听，经纬度、高程、视高将不会更新
   */
  removeMousemoveEvent() {
    this._handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  /**
   * 添加postRender事件监听，对象初始化后必须调用该方法帧率和延迟以及相机能数才会实时刷新
   */
  addPostRenderEvent() {
    this.postRenderFunction = this._viewer.scene.postRender.addEventListener(() => {
      this.updateFps();
      this.updateHeadingPitchRoll();
    });
  }

  /**
   * 移除postRender事件监听,帧率和延迟以及相机能数将不会更新
   */
  removePostRenderEvent() {
    if (this.postRenderFunction) {
      this.postRenderFunction();
    }
  }

  /**
   * 销毁对象
   */
  destroy() {
    this.removeMousemoveEvent();
    this.removePostRenderEvent();
    if (!this._handler.isDestroyed()) {
      this._handler.destroy();
    }
    this._handler = undefined;
    this._viewer = undefined;
  }

  /**
   * 所有属性的集合
   * @readonly
   */
  get params() {
    return {
      lon: this.lon,
      lat: this.lat,
      height: this.height,
      alt: this.alt,
      heading: this.heading,
      pitch: this.pitch,
      roll: this.roll,
      fps: this.fps,
      ms: this.ms,
    };
  }

  /**
   * 经度
   * @readonly
   */
  get lon() {
    return this._lon;
  }

  /**
   * 纬度
   * @readonly
   */
  get lat() {
    return this._lat;
  }

  /**
   * 视高
   * @readonly
   */
  get height() {
    return this._height;
  }

  /**
   * 地形高/海拔
   * @readonly
   */
  get alt() {
    return this._alt;
  }

  /**
   * 相机旋转角
   * @readonly
   */
  get heading() {
    return Cesium.Math.toDegrees(this._heading);
  }

  /**
   * 相机仰俯角
   * @readonly
   */
  get pitch() {
    return Cesium.Math.toDegrees(this._pitch);
  }

  /**
   * 相机翻滚角
   * @readonly
   */
  get roll() {
    return Cesium.Math.toDegrees(this._roll);
  }

  /**
   * 帧率
   * @readonly
   */
  get fps() {
    return this._fps;
  }

  /**
   * 延迟
   * @readonly
   */
  get ms() {
    return this._ms;
  }

  /**
   * 场景中心坐标
   * @readonly
   */
  get center() {
    return this.viewerCenter();
  }

  updateFps() {
    const time = Cesium.getTimestamp();
    if (!Cesium.defined(this._lastFpsSampleTime)) {
      this._lastFpsSampleTime = Cesium.getTimestamp();
    }
    if (!Cesium.defined(this.lastMsSampleTime)) {
      this.lastMsSampleTime = Cesium.getTimestamp();
    }

    this._fpsFrameCount++;
    const fpsElapsedTime = time - this._lastFpsSampleTime;
    if (fpsElapsedTime > 1000) {
      let fps = 'N/A';
      fps = ((this._fpsFrameCount * 1000) / fpsElapsedTime) || 0;

      this._fps = `${fps.toFixed(0)} FPS`;
      this._lastFpsSampleTime = time;
      this._fpsFrameCount = 0;
    }

    this._msFrameCount++;
    const msElapsedTime = time - this.lastMsSampleTime;
    if (msElapsedTime > 200) {
      let ms = 'N/A';
      ms = (msElapsedTime / this._msFrameCount).toFixed(2);

      this._ms = `${ms} MS`;
      this.lastMsSampleTime = time;
      this._msFrameCount = 0;
    }
  }

  /**
   * 更新相机参数
   */
  updateHeadingPitchRoll() {
    const viewer = this._viewer;
    this._heading = viewer.camera.heading;
    this._pitch = viewer.camera.pitch;
    this._roll = viewer.camera.roll;
  }

  /**
   * 场景的中心坐标
   * @param  {Boolean} [inWorldCoordinates=true] 是否转为世界坐标，如果为false,将返回相机参考系的坐标
   * @param  {Cesium.Cartesian3}  [result] 结果的保存对象
   * @return {Cesium.Cartesian3} 场景的中心坐标
   */
  viewerCenter(inWorldCoordinates = true, result = new Cesium.Cartesian3()) {
    const {
      scene,
      camera,
    } = this._viewer;
    const unprojectedScratch = new Cesium.Cartographic();
    const rayScratch = new Cesium.Ray();
    const viewer = this._viewer;
    if (scene.mode === Cesium.SceneMode.MORPHING) {
      return undefined;
    }

    if (Cesium.defined(viewer.trackedEntity)) {
      result = viewer.trackedEntity.position.getValue(
        viewer.clock.currentTime,
        result,
      );
    } else {
      rayScratch.origin = camera.positionWC;
      rayScratch.direction = camera.directionWC;
      result = scene.globe.pick(rayScratch, scene, result);
    }

    if (!Cesium.defined(result)) {
      return undefined;
    }

    if (
      scene.mode === Cesium.SceneMode.SCENE2D ||
      scene.mode === Cesium.SceneMode.COLUMBUS_VIEW
    ) {
      result = camera.worldToCameraCoordinatesPoint(result, result);

      if (inWorldCoordinates) {
        result = scene.globe.ellipsoid.cartographicToCartesian(
          scene.mapProjection.unproject(result, unprojectedScratch),
          result,
        );
      }
    } else if (!inWorldCoordinates) {
      result = camera.worldToCameraCoordinatesPoint(result, result);
    }

    return result;
  }
}
export default ViewerParams;

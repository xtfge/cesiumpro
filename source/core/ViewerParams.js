/*
 * 获得场景当前参数，包括经纬度、相机参数、帧率、延迟等
 */
import checkViewer from './checkViewer';
import CVT from './CVT';

class ViewerParams {
  constructor(viewer, events = ['mousemove', 'render']) {
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
    this._alt = 0;
    if (events.includes('mousemove')) {
      this.addMousemoveAction();
    }
    if (events.includes('render')) {
      this.addPostRenderAction();
    }
  }

  /**
   * 开始监听鼠标移动事件，获取鼠标所在位置的经纬度及高程
   */
  addMousemoveAction() {
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
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  /**
   * 移除鼠标移动事件监听
   */
  removeMousemoveEvent() {
    this._handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  /**
   * 添加postRender事件监听，实时刷新帧率和延迟
   */
  addPostRenderAction() {
    this.postRenderFunction = this._viewer.scene.postRender.addEventListener(() => {
      this.updateFps();
    });
  }

  /**
   * 移除postRender事件监听,帧率和延迟将不会更新
   */
  removePostRenderAction() {
    if (this.postRenderFunction) {
      this.postRenderFunction();
    }
  }

  /**
   * 销毁对象
   */
  destroy() {
    this.removeMousemoveEvent();
    this.removePostRenderAction();
    if (!this._handler.isDestroyed()) {
      this._handler.destroy();
    }
    this._handler = undefined;
    this._viewer = undefined;
  }

  /**
   * 所有属性的集合
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
   * 地形高
   */
  get alt() {
    return this._alt;
  }

  /**
   * 旋转角
   * @readonly
   */
  get heading() {
    return Cesium.Math.toDegrees(this._heading);
  }

  /**
   * 仰俯角
   * @readonly
   */
  get pitch() {
    return Cesium.Math.toDegrees(this._pitch);
  }

  /**
   * 翻滚角
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

  viewerCenter(inWorldCoordinates = true, result = new Cesium.Cartesian3()) {
    const { scene, camera } = this._viewer;
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
      scene.mode === Cesium.SceneMode.SCENE2D
      || scene.mode === Cesium.SceneMode.COLUMBUS_VIEW
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

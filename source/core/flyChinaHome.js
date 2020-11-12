const {
  SceneMode,
  Rectangle,
  Cartesian3,
  Matrix4,
  Camera
} = Cesium;

window.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(70, 5, 130, 60);
/**
 * 定位到中国
 * @param  {Cesium.Camera} camera  场景相机
 * @param  {Number} [duration=3.0] 飞行持续时间
 *
 * @example
 * 1. <code>CesiumPro.flyChinaHome(viewer.camera);</code>
 * 2. 此外，CesiumPro将该方法注册到Cesium.Camera的原型链，因此，你也可以像下面这样使用它
 *    <code>viewer.camera.flyChinaHome()</code>
 */
function flyChinaHome(camera, duration) {
  const mode = camera._mode;

  if (mode === SceneMode.MORPHING) {
    camera._scene.completeMorph();
  }

  if (mode === SceneMode.SCENE2D) {
    camera.flyTo({
      destination: DEFAULT_VIEW_RECTANGLE,
      duration: duration,
      endTransform: Matrix4.IDENTITY
    });
  } else if (mode === SceneMode.SCENE3D) {
    const destination = camera.getRectangleCameraCoordinates(DEFAULT_VIEW_RECTANGLE);

    let mag = Cartesian3.magnitude(destination);
    mag += mag * Camera.DEFAULT_VIEW_FACTOR;
    Cartesian3.normalize(destination, destination);
    Cartesian3.multiplyByScalar(destination, mag, destination);

    camera.flyTo({
      destination: destination,
      duration: duration,
      endTransform: Matrix4.IDENTITY
    });
  } else if (mode === SceneMode.COLUMBUS_VIEW) {
    const maxRadii = camera._projection.ellipsoid.maximumRadius;
    let position = new Cartesian3(0.0, -1.0, 1.0);
    position = Cartesian3.multiplyByScalar(Cartesian3.normalize(position, position), 5.0 * maxRadii, position);
    camera.flyTo({
      destination: position,
      duration: duration,
      orientation: {
        heading: 0.0,
        pitch: -Math.acos(Cartesian3.normalize(position, pitchScratch).z),
        roll: 0.0
      },
      endTransform: Matrix4.IDENTITY,
      convert: false
    });
  }
}
(function() {
  Cesium.Camera.prototype.flyChinaHome = function() {
    flyChinaHome(this);
  };
})();
export default flyChinaHome;

/**
 * 各类数据加载
 * @exports DataLoader
 */
const DataLoader = {};

/**
 * 加载gltf/glb模型。
 * @param  {Cesium.Viewer} viewer  Cesium Viewer对象
 * @param  {Cesium.Cartesian3} [position=new Cesium.Cartesian3] 模型的位置,如果options中定义了modelMatrix，将覆盖该参数
 * @param  {Object} [options={}] 描述model的参数,同Cesium.Model.fromGltf
 * @return {Cesium.Cesium3DTileset}
 */
DataLoader.loadModel = function(viewer, position = new Cesium.Cartesian3(), options = {}) {
  if (!options.modelMatrix && position) {
    const matrix = Cesium.Transforms.eastNorthUpToFixedFrame(position)
    options.modelMatrix = matrix;
  }

  return viewer.scene.primitives.add(Cesium.Model.fromGltf(options))
}

function rotate(tileset, rotation) {
  const transform = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rotation));
  Cesium.Matrix4.multiplyByMatrix3(tileset.root.transform, transform, tileset.root.transform)

}

function transform(tileset, translation) {
  Cesium.Matrix4.multiplyByTranslation(tileset.modelMatrix, translation, tileset.modelMatrix)
}

function adjustHeight(tileset, height) {
  const center = tileset.boundingSphere.center;
  const coord = CVT.toDegrees(center, viewer);
  const surface = Cesium.Cartesian3.fromDegrees(coord.lon, coord.lat, 0);
  const offset = Cesium.Cartesian3.fromDegrees(coord.lon, coord.lat, height);
  const translation = Cesium.Cartesian3.subtract(
    offset,
    surface,
    new Cesium.Cartesian3()
  );

  tileset.modelMatrix = Cesium.Matrix4.multiply(tileset.modelMatrix,
    Cesium.Matrix4.fromTranslation(translation), tileset.modelMatrix)
}

function adjustLocation(tileset, position) {
  const matrix = Cesium.Transforms.eastNorthUpToFixedFrame(position)
  tileset.root.transform = matrix
}
DataLoader.loadTileset = function(viewer, options = {}, kwargs = {}) {
  const {
    height,
    position,
    debug
  } = kwargs
  const cesium3dtileset = new Cesium.Cesium3DTileset(options);
  cesium3dtileset.readyPromise.then(tileset => {
    viewer.scene.primitives.add(tileset)
    if (Cesium.defined(position)) {
      adjustLocation(tileset, position)
    }
    if (Cesium.defined(height)) {
      adjustHeight(tileset, height)
    }
    if (debug) {
      height = height ? height : 0
      let height0 = 0,
        translation = undefined,
        rotation = undefined
      document.onkeypress = function(e) {
        //升高
        if (e.keyCode === 'Q'.charCodeAt() || e.keyCode === 'q'.charCodeAt()) {
          height0 = 1

        }
        //降低
        else if (e.keyCode === 'E'.charCodeAt() || e.keyCode === 'e'.charCodeAt()) {
          height0 = -1
        }
        //平移
        else if (e.keyCode === 'A'.charCodeAt() || e.keyCode === 'a'.charCodeAt()) {
          translation = new Cesium.Cartesian3(-2, 0, 0);
        } else if (e.keyCode === 'D'.charCodeAt() || e.keyCode === 'd'.charCodeAt()) {
          translation = new Cesium.Cartesian3(2, 0, 0);
        } else if (e.keyCode === 'W'.charCodeAt() || e.keyCode === 'w'.charCodeAt()) {
          translation = new Cesium.Cartesian3(0, -2, 0);
        } else if (e.keyCode === 'S'.charCodeAt() || e.keyCode === 's'.charCodeAt()) {
          translation = new Cesium.Cartesian3(0, 2, 0);
        }
        //旋转
        else if (e.keyCode === 'Z'.charCodeAt() || e.keyCode === 'z'.charCodeAt()) {
          rotation = -1
        } else if (e.keyCode === 'X'.charCodeAt() || e.keyCode === 'x'.charCodeAt()) {
          rotation = 1
        }
        adjustHeight(tileset, height0)
        if (Cesium.defined(translation)) {
          transform(tileset, translation)
        }
        if (Cesium.defined(rotation)) {
          rotate(tileset, rotation)
        }
        rotation = undefined
        translation = undefined
      }
    }
  })
  return cesium3dtileset;
}
export default DataLoader;

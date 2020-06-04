/* eslint-disable prefer-const */
import CVT from './CVT.js';
import SuperGif from '../thirdParty/libgif.js';
import checkViewer from './checkViewer';

function rotate(tileset, rotation) {
  const transformMatrix = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rotation));
  Cesium.Matrix4.multiplyByMatrix3(tileset.root.transform, transformMatrix, tileset.root.transform);
}
function transform(tileset, translation) {
  Cesium.Matrix4.multiplyByTranslation(tileset.modelMatrix, translation, tileset.modelMatrix);
}

function adjustHeight(viewer, tileset, height) {
  const { center } = tileset.boundingSphere;
  const coord = CVT.toDegrees(center, viewer);
  const surface = Cesium.Cartesian3.fromDegrees(coord.lon, coord.lat, 0);
  const offset = Cesium.Cartesian3.fromDegrees(coord.lon, coord.lat, height);
  const translation = Cesium.Cartesian3.subtract(
    offset,
    surface,
    new Cesium.Cartesian3(),
  );

  tileset.modelMatrix = Cesium.Matrix4.multiply(tileset.modelMatrix,
    Cesium.Matrix4.fromTranslation(translation), tileset.modelMatrix);
}
function adjustLocation(tileset, position) {
  const matrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
  tileset.root.transform = matrix;
}
/**
 * Cesium 数据加载.
 */
class Dataloader {
  constructor(viewer) {
    checkViewer(viewer);
    this._viewer = viewer;
  }

  /**
   * 添加Gltf模型
   * @param {String} url 模型url
   * @param {Cartesian3} position 模型位置
   * @param {Object} options 同Cesium
   */
  loadModel(url, position, options = {}) {
    return Dataloader.loadModel(this._viewer, url, position, options);
  }

  /**
   * 基础底图添加
   * @param {Object} params 定义基础底图
   */
  loadImageryLayer(params) {
    return Dataloader.loadImageryLayer(this._viewer, params);
  }

  /**
   * 添加tileset模型
   * @param {String} url 模型url
   * @param {Object} options 同Cesium
   * @param {Object} kwargs 具有以下属性
   * @param {Number} [kwargs.height] 模型高度，用于高度调整
   * @param {Cartesian3} [kwargs.position] 模型位置调整
   * @param {Boolean} [kwargs.debug] 调度模型，可以通过QWEASDZX按键控制模型平移旋转
   * @param {Number} [kwargs.stepDis=2] 平移步长，单位米
   * @param {Number} [kwargs.stepAngle=1] 旋转步长，单位度
   */
  loadTileset(url, options, kwargs) {
    return Dataloader.loadTileset(this._viewer, url, options, kwargs);
  }

  /**
   * 加载Gif图片
   * @param {Array} imageArr gif每一帧的图片
   */
  loadGif(img = []) {
    return Dataloader.loadGif(this._viewer, img);
  }

  /**
   * 添加Gltf模型
   * @param {Viewer} viewer Cesium Viewer对象
   * @param {String} url 模型url
   * @param {Cartesian3} position 模型位置
   * @param {Object} options 同Cesium
   */
  static loadModel(viewer, url, position, options = {}) {
    const matrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
    return viewer.scene.primitives.add(Cesium.Model.fromGltf({
      url,
      modelMatrix: matrix,
      ...options,
    }));
  }

  /**
   * 基础底图添加
   * @param {Viewer} viewer Cesium Viewer对象
   * @param {Object} params 定义基础底图
   */
  static loadImageryLayer(viewer, params) {
    checkViewer(viewer);
    let imageProvider = null;
    let scheme; let geom; let rect;
    switch (params.type.toLowerCase()) {
      case 'singletile':
        geom = params.geom ? params.geom.split(',') : null;
        rect = geom ? Cesium.Rectangle.fromDegrees(...geom) : Cesium.Rectangle.MAX_VALUE;
        imageProvider = new Cesium.SingleTileImageryProvider({
          url: params.url,
          rectangle: rect,
        });
        break;
      case 'urltemplate':
        scheme = params.crs.toLowerCase() === 'epsg:4326'
          ? new Cesium.GeographicTilingScheme()
          : new Cesium.WebMercatorTilingScheme();
        imageProvider = new Cesium.UrlTemplateImageryProvider({
          url: params.url,
          maximumLevel: params.maximumLevel ? params.maximumLevel : 10,
          tilingScheme: scheme,
        });
        break;
      case 'osm':
        imageProvider = Cesium.createOpenStreetMapImageryProvider({
          url: 'https://a.tile.openstreetmap.org/',
        });
        break;
      case 'bing':
        imageProvider = new Cesium.BingMapsImageryProvider({
          url: 'https://dev.virtualearth.net',
          key: 'Al6AU4RqRNFUEYgBaTEhiiX4PNJJsrT7yOaFC4PCnHWh1YgFRQL9oPhuN6gQebR5',
        });
        break;
      case 'mapboximg':
      case 'mapboxvec':
        imageProvider = new Cesium.MapboxImageryProvider({
          mapId: params.mapId,
          accessToken: 'pk.eyJ1Ijoid202NzUyMDYyIiwiYSI6ImNqZWxkbzRjejNmbngzM283aXMwOHM4dGEifQ.dUNJYNIZoAhzI1EwruRF1w',
        });
        break;
      case 'tdt':
        imageProvider = new Cesium.WebMapTileServiceImageryProvider({
          url: params.url,
          layer: params.layer,
          style: params.style,
          format: params.format,
          tileMatrixSetID: 'GoogleMapsCompatible',
        });
        break;
      case 'geoserverwms':
        imageProvider = new Cesium.WebMapServiceImageryProvider({
          url: params.url,
          layers: params.layerName,
          parameters: {
            transparent: 'true',
            format: 'image/png',
          },
        });
        break;
      default:
        break;
    }
    const layer = new Cesium.ImageryLayer(imageProvider);
    return viewer.imageryLayers.add(layer);
  }

  /**
   * 添加tileset模型
   * @param {Viewer} viewer Cesium Viewer对象
   * @param {String} url 模型url
   * @param {Object} options 同Cesium
   * @param {Object} kwargs 具有以下属性
   * @param {Number} [kwargs.height] 模型高度，用于高度调整
   * @param {Cartesian3} [kwargs.position] 模型位置调整
   * @param {Boolean} [kwargs.debug] 调度模型，可以通过QWEASDZX按键控制模型平移旋转
   * @param {Number} [kwargs.stepDis=2] 平移步长，单位米
   * @param {Number} [kwargs.stepAngle=1] 旋转步长，单位度
   */
  static loadTileset(viewer, url, options = {}, kwargs = {}) {
    const cesium3dtileset = new Cesium.Cesium3DTileset({
      ...options,
      url,
    });
    let {
      height, position, debug, stepDis, stepAngle,
    } = kwargs;
    stepDis = stepDis || 2;
    stepAngle = stepAngle || 1;
    cesium3dtileset.readyPromise.then((tileset) => {
      viewer.scene.primitives.add(tileset);

      if (Cesium.defined(position)) {
        adjustLocation(tileset, position);
      }
      if (Cesium.defined(height)) {
        adjustHeight(viewer, tileset, height);
      }
      if (debug) {
        height = height || 0;
        let height0 = 0;
        let translation;
        let rotation;
        document.onkeypress = function (e) {
          // 升高
          if (e.keyCode === 'Q'.charCodeAt() || e.keyCode === 'q'.charCodeAt()) {
            height0 = 1;
          } else if (e.keyCode === 'E'.charCodeAt() || e.keyCode === 'e'.charCodeAt()) {
            height0 = -1;
          } else if (e.keyCode === 'A'.charCodeAt() || e.keyCode === 'a'.charCodeAt()) {
            translation = new Cesium.Cartesian3(-stepDis, 0, 0);
          } else if (e.keyCode === 'D'.charCodeAt() || e.keyCode === 'd'.charCodeAt()) {
            translation = new Cesium.Cartesian3(stepDis, 0, 0);
          } else if (e.keyCode === 'W'.charCodeAt() || e.keyCode === 'w'.charCodeAt()) {
            translation = new Cesium.Cartesian3(0, -stepDis, 0);
          } else if (e.keyCode === 'S'.charCodeAt() || e.keyCode === 's'.charCodeAt()) {
            translation = new Cesium.Cartesian3(0, stepDis, 0);
          } else if (e.keyCode === 'Z'.charCodeAt() || e.keyCode === 'z'.charCodeAt()) {
            rotation = -stepAngle;
          } else if (e.keyCode === 'X'.charCodeAt() || e.keyCode === 'x'.charCodeAt()) {
            rotation = stepAngle;
          }
          adjustHeight(viewer, tileset, height0);
          if (Cesium.defined(translation)) {
            transform(tileset, translation);
          }
          if (Cesium.defined(rotation)) {
            rotate(tileset, rotation);
          }
          rotation = undefined;
          translation = undefined;
        };
      }
    });
    return cesium3dtileset;
  }

  /**
   * 加载Gif图片
   * @param {String} url gif路径
   * @param {Array} imageArr gif每一帧的图片
   */
  static loadGif(url, imageArr = []) {
    const img = document.createElement('img');
    img.src = url;
    // gif库需要img标签配置下面两个属性
    img.setAttribute('rel:animated_src', url);
    img.setAttribute('rel:auto_play', '0');
    document.body.appendChild(img);
    // 新建gif实例
    const rub = new SuperGif({ gif: img });
    return new Promise((resolve) => {
      rub.load(() => {
        for (let i = 1; i <= rub.get_length(); i++) {
          // 遍历gif实例的每一帧
          rub.move_to(i);
          imageArr.push(rub.get_canvas().toDataURL());
        }
        resolve(imageArr);
        // document.body.removeChild(img)
      });
    });
  }
}

export default Dataloader;

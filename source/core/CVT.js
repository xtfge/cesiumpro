import defined from './defined';
/**
 * 坐标转换工具
 * @namespace CVT
 */
const CVT = {};

/**
 * 笛卡尔坐标转屏幕坐标
 * @param {Cesium.Cartesian3} cartesian 笛卡尔坐标
 * @param {Cesium.Viewer} viewer Viewer对象
 */
CVT.cartesian2Pixel = function (cartesian, viewer) {
  return Cesium.SceneTransforms.wgs84ToWindowCoordinates(
    viewer.scene,
    cartesian,
  );
};
/**
 * 屏幕坐标转笛卡尔坐标
 * @param {Cesium.Cartesian2} pixel 屏幕坐标
 * @param {Cesium.Viewer} viewer Viewer对象
 */
CVT.pixel2Cartesian = function (pixel, viewer) {
  const ray = viewer.camera.getPickRay(pixel);
  const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
  return cartesian;
};

/**
 * 屏幕坐标转笛卡尔坐标，此方法获得的坐标为二维坐标，即高度永远为0
 * @param {Cesium.Cartesian2} pixel 屏幕坐标
 * @param {Cesium.Viewer} [viewer] Viewer对象
 */
CVT.pixel2Cartesian2D = function (pixel, viewer) {
  let ellipsoid;
  if (defined(viewer)) {
    ellipsoid = viewer.scene.globe.ellipsoid;
  } else {
    ellipsoid = Cesium.Ellipsoid.WGS84;
  }
  const cartesian = viewer.camera.pickEllipsoid(
    pixel,
    ellipsoid,
  );
  return cartesian;
};

/**
 * 笛卡尔坐标转经纬度（弧度）
 * @param {Cesium.Cartesian3} cartesian 笛卡尔坐标
 * @param {Cesium.Viewer} [viewer] Viewer对象
 */
CVT.cartesian2Radians = function (cartesian, viewer) {
  let ellipsoid;
  if (defined(viewer)) {
    ellipsoid = viewer.scene.globe.ellipsoid;
  } else {
    ellipsoid = Cesium.Ellipsoid.WGS84;
  }
  const cartographic = Cesium.Cartographic.fromCartesian(
    cartesian,
    ellipsoid,
  );
  const lon = cartographic.longitude;
  const lat = cartographic.latitude;
  const {
    height,
  } = cartographic;
  return {
    lon,
    lat,
    height,
  };
};
/**
 * 笛卡尔坐标转经纬度（度）
 * @param {Cesium.Cartesian3} cartesian 笛卡尔坐标
 * @param {Cesium.Viewer} viewer Viewer对象
 */
CVT.cartesian2Degrees = function (cartesian, viewer) {
  const coords = CVT.cartesian2Radians(cartesian, viewer);
  const lon = Cesium.Math.toDegrees(coords.lon);
  const lat = Cesium.Math.toDegrees(coords.lat);
  const {
    height,
  } = coords;
  return {
    lon,
    lat,
    height,
  };
};
/**
 * 屏幕坐标转经纬度（度）
 * @param {Cesium.Cartesian2} pixel 屏幕坐标
 * @param {Cesium.Viewer} viewer Viewer对象
 */
CVT.pixel2Degrees = function (pixel, viewer) {
  const cartesian = CVT.pixel2Cartesian(pixel, viewer);
  if (Cesium.defined(cartesian)) {
    return CVT.cartesian2Degrees(cartesian, viewer);
  }
  return undefined;
};

/**
 * 屏幕坐标转经纬度（弧度）
 * @param {Cesium.Cartesian2} pixel 屏幕坐标
 * @param {Cesium.Viewer} viewer Viewer对象
 */
CVT.pixel2Radians = function (pixel, viewer) {
  const cartesian = CVT.pixel2Cartesian(pixel, viewer);
  if (Cesium.defined(cartesian)) {
    return CVT.cartesian2Radians(cartesian, viewer);
  }
  return undefined;
};

/**
 * 获得经纬度坐标（度）
 * @param {Cesium.Cartesian2|Cesium.Cartesian3|Cesium.Cartographic} position
 * @param {Cesium.Viewer} viewer Viewer对象
 */
CVT.toDegrees = function (position, viewer) {
  if (position instanceof Cesium.Cartesian3) {
    return CVT.cartesian2Degrees(position, viewer);
  }
  if (position instanceof Cesium.Cartesian2) {
    return CVT.pixel2Degrees(position, viewer);
  }
  if (position instanceof Cesium.Cartographic) {
    return {
      lon: Cesium.Math.toDegrees(position.longitude),
      lat: Cesium.Math.toDegrees(position.latitude),
      height: position.height,
    };
  }
  return undefined;
};

/**
 * 获得经纬度坐标（弧度）
 * @param {Cesium.Cartesian2|Cesium.Cartesian3|Cesium.Cartographic} position
 * @param {Cesium.Viewer} viewer Viewer对象
 */
CVT.toRadians = function (position, viewer) {
  if (position instanceof Cesium.Cartesian3) {
    return CVT.cartesian2Radians(position, viewer);
  }
  if (position instanceof Cesium.Cartesian2) {
    return CVT.pixel2Radians(position, viewer);
  }
  if (position instanceof Cesium.Cartographic) {
    return {
      lon: position.longitude,
      lat: position.latitude,
      height: position.height,
    };
  }
  return undefined;
};

/**
 * 获得屏幕坐标
 * @param {Cesium.Cartesian3|Cesium.Cartographic} position
 * @param {Cesium.Viewer} viewer Viewer对象
 */
CVT.toPixel = function (position, viewer) {
  if (position instanceof Cesium.Cartesian3) {
    return CVT.cartesian2Pixel(position, viewer);
  }
  if (position instanceof Cesium.Cartographic) {
    const cartesian = Cesium.Cartographic.toCartesian(position);
    return CVT.cartesian2Pixel(cartesian, viewer);
  }
  return undefined;
};

/**
 * 获得笛卡尔坐标
 * @param {Cesium.Cartesian2|Cesium.Cartographic} position
 * @param {Cesium.Viewer} viewer Viewer对象
 */
CVT.toCartesian = function (position, viewer) {
  if (position instanceof Cesium.Cartesian2) {
    return CVT.pixel2Cartesian(position, viewer);
  }
  if (position instanceof Cesium.Cartographic) {
    return Cesium.Cartographic.toCartesian(position);
  }
  return undefined;
};

export default CVT;

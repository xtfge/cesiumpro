/*
 * 坐标转换工具
 */

/**
 * Cesium坐标转换工具.
 */
class CVT {
  /**
   * 笛卡尔坐标转屏幕坐标
   * @param {Cartesian3} cartesian 笛卡尔坐标
   * @param {Viewer} viewer Viewer对象
   */
  static cartesian2Pixel(cartesian, viewer) {
    return Cesium.SceneTransforms.wgs84ToWindowCoordinates(
      viewer.scene,
      cartesian,
    );
  }

  /**
   * 屏幕坐标转笛卡尔坐标
   * @param {Cartesian2} pixel 屏幕坐标
   * @param {Viewer} viewer Viewer对象
   */
  static pixel2Cartesian(pixel, viewer) {
    if (viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider) {
      return CVT.pixel2Cartesian1(pixel, viewer);
    }
    return CVT.pixel2Cartesian2(pixel, viewer);
  }

  /**
   * 屏幕坐标转笛卡尔坐标（二维）
   * @param {Cartesian2} pixel 屏幕坐标
   * @param {Viewer} viewer Viewer对象
   */
  static pixel2Cartesian1(pixel, viewer) {
    const cartesian = viewer.camera.pickEllipsoid(
      pixel,
      viewer.scene.globe.ellipsoid,
    );
    return cartesian;
  }

  /**
   * 屏幕坐标转笛卡尔坐标（三维）
   * @param {Cartesian2} pixel 屏幕坐标
   * @param {Viewer} viewer Viewer对象
   */
  static pixel2Cartesian2(pixel, viewer) {
    const ray = viewer.camera.getPickRay(pixel);
    const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
    return cartesian;
  }

  /**
   * 笛卡尔坐标转经纬度（弧度）
   * @param {Cartesian3} cartesian 笛卡尔坐标
   * @param {Viewer} viewer Viewer对象
   */
  static cartesian2Radians(cartesian, viewer) {
    const ellipsoid = viewer.scene.globe.ellipsoid || Cesium.Ellipsoid.WGS84;
    const cartographic = Cesium.Cartographic.fromCartesian(
      cartesian,
      ellipsoid,
    );
    const lon = cartographic.longitude;
    const lat = cartographic.latitude;
    const { height } = cartographic;
    return { lon, lat, height };
  }

  /**
   * 笛卡尔坐标转经纬度（度）
   * @param {Cartesian3} cartesian 笛卡尔坐标
   * @param {Viewer} viewer Viewer对象
   */
  static cartesian2Degrees(cartesian, viewer) {
    const coords = CVT.cartesian2Radians(cartesian, viewer);
    const lon = Cesium.Math.toDegrees(coords.lon);
    const lat = Cesium.Math.toDegrees(coords.lat);
    const { height } = coords;
    return { lon, lat, height };
  }

  /**
   * 屏幕坐标转经纬度（度）
   * @param {Cartesian2} pixel 屏幕坐标
   * @param {Viewer} viewer Viewer对象
   */
  static pixel2Degrees(pixel, viewer) {
    const cartesian = CVT.pixel2Cartesian(pixel, viewer);
    if (Cesium.defined(cartesian)) {
      return CVT.cartesian2Degrees(cartesian, viewer);
    }
    return undefined;
  }

  /**
   * 屏幕坐标转经纬度（弧度）
   * @param {Cartesian2} pixel 屏幕坐标
   * @param {Viewer} viewer Viewer对象
   */
  static pixel2Radians(pixel, viewer) {
    const cartesian = CVT.pixel2Cartesian(pixel, viewer);
    if (Cesium.defined(cartesian)) {
      return CVT.cartesian2Radians(cartesian, viewer);
    }
    return undefined;
  }

  /**
   * 获得经纬度坐标（度）
   * @param {Cartesian2|Cartesian3|Cartographic} pixel 屏幕坐标
   * @param {Viewer} viewer Viewer对象
   */
  static toDegrees(position, viewer) {
    if (position instanceof Cesium.Cartesian3) {
      return CVT.cartesian2Degrees(position, viewer);
    } if (position instanceof Cesium.Cartesian2) {
      return CVT.pixel2Degrees(position, viewer);
    } if (position instanceof Cesium.Cartographic) {
      return {
        lon: Cesium.Math.toDegrees(position.longitude),
        lat: Cesium.Math.toDegrees(position.latitude),
        height: position.height,
      };
    }
    return undefined;
  }

  /**
   * 获得经纬度坐标（弧度）
   * @param {Cartesian2|Cartesian3} position
   * @param {Viewer} viewer Viewer对象
   */
  static toRadians(position, viewer) {
    if (position instanceof Cesium.Cartesian3) {
      return CVT.cartesian2Radians(position, viewer);
    } if (position instanceof Cesium.Cartesian2) {
      return CVT.pixel2Radians(position, viewer);
    }
    return undefined;
  }

  /**
   * 获得屏幕坐标
   * @param {Cartesian3|Cartographic} position
   * @param {Viewer} viewer Viewer对象
   */
  static toPixel(position, viewer) {
    if (position instanceof Cesium.Cartesian3) {
      return CVT.cartesian2Pixel(position, viewer);
    }
    if (position instanceof Cesium.Cartographic) {
      const cartesian = Cesium.Cartographic.toCartesian(position);
      return CVT.cartesian2Pixel(cartesian, viewer);
    }
    return undefined;
  }

  /**
   * 获得笛卡尔坐标
   * @param {Cartesian2|Cartographic} position
   * @param {Viewer} viewer Viewer对象
   */
  static toCartesian(position, viewer) {
    if (position instanceof Cesium.Cartesian2) {
      return CVT.pixel2Cartesian(position, viewer);
    }
    if (position instanceof Cesium.Cartographic) {
      return Cesium.Cartographic.toCartesian(position);
    }
    return undefined;
  }
}

export default CVT;

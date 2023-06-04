import defaultValue from "./defaultValue.js";
import defined from "./defined.js";
const {Cartesian2, Rectangle, GeographicProjection, Ellipsoid} = Cesium;
const CesiumMath = Cesium.Math;

/**
 * A tiling scheme for geometry referenced to a simple {@link GeographicProjection} where
 * longitude and latitude are directly mapped to X and Y.  This projection is commonly
 * known as geographic, equirectangular, equidistant cylindrical, or plate carrée.
 * @ignore
 * @alias LonlatTilingScheme
 * @constructor
 *
 * @param {Object} [options] Object with the following properties:
 * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid whose surface is being tiled. Defaults to
 * the WGS84 ellipsoid.
 * @param {Rectangle} [options.rectangle=Rectangle.MAX_VALUE] The rectangle, in radians, covered by the tiling scheme.
 * @param {Number} [options.numberOfLevelZeroTilesX=2] The number of tiles in the X direction at level zero of
 * the tile tree.
 * @param {Number} [options.numberOfLevelZeroTilesY=1] The number of tiles in the Y direction at level zero of
 * the tile tree.
 */
function LonlatTilingScheme(options) {
  options = defaultValue(options, defaultValue.EMPTY_OBJECT);

  this._ellipsoid = defaultValue(options.ellipsoid, Ellipsoid.WGS84);
  this._rectangle = defaultValue(options.rectangle, Rectangle.MAX_VALUE);
  this._projection = new GeographicProjection(this._ellipsoid);
  this._numberOfLevelZeroTilesX = 36;
  this._numberOfLevelZeroTilesY = 18;
  this._intervalOfZeorLevel = defaultValue(options.intervalOfZeorLevel, 16);
}

Object.defineProperties(LonlatTilingScheme.prototype, {
  /**
   * Gets the ellipsoid that is tiled by this tiling scheme.
   * @memberof LonlatTilingScheme.prototype
   * @type {Ellipsoid}
   */
  ellipsoid: {
    get: function () {
      return this._ellipsoid;
    },
  },

  /**
   * Gets the rectangle, in radians, covered by this tiling scheme.
   * @memberof LonlatTilingScheme.prototype
   * @type {Rectangle}
   */
  rectangle: {
    get: function () {
      return this._rectangle;
    },
  },

  /**
   * Gets the map projection used by this tiling scheme.
   * @memberof LonlatTilingScheme.prototype
   * @type {MapProjection}
   */
  projection: {
    get: function () {
      return this._projection;
    },
  },
});

/**
 * Gets the total number of tiles in the X direction at a specified level-of-detail.
 *
 * @param {Number} level The level-of-detail.
 * @returns {Number} The number of tiles in the X direction at the given level.
 */
LonlatTilingScheme.prototype.getNumberOfXTilesAtLevel = function (level) {
  return this._numberOfLevelZeroTilesX << level;
};
LonlatTilingScheme.prototype.modifyLevel = function(level) {
  if(level <3) {
    return 0;
  } else if(level < 6) {
    return 1;
  }
}
LonlatTilingScheme.prototype.getDelatXY = function(level) {
  const intervalOfZeorLevel = this._intervalOfZeorLevel;
  let dx = intervalOfZeorLevel / 2 ** level;
  let dy = intervalOfZeorLevel / 2 ** level;
  return {dx, dy}  
}
LonlatTilingScheme.prototype.getLonLatValue = function(level, x, y) {
  const value = this.getDelatXY(level);
  const lon = value.dx * x - 180;
  const lat = 90 - value.dy * y;
  return {lon, lat}
}
LonlatTilingScheme.prototype.getPosition = function(level, x, y) {
  const rectangle = this._rectangle;

  const xTiles = this.getNumberOfXTilesAtLevel(level);
  const yTiles = this.getNumberOfYTilesAtLevel(level);

  const xTileWidth = rectangle.width / xTiles;
  const west = x * xTileWidth + rectangle.west;
  const east = (x + 1) * xTileWidth + rectangle.west;

  const yTileHeight = rectangle.height / yTiles;
  const north = rectangle.north - y * yTileHeight;
  const south = rectangle.north - (y + 1) * yTileHeight;

  // if (!defined(result)) {
  //   result = new Rectangle(west, south, east, north);
  // }

  // result.west = west;
  // result.south = south;
  // result.east = east;
  // result.north = north;
  // return result;
  return {
    lon: +CesiumMath.toDegrees(west).toFixed(5),
    lat: +CesiumMath.toDegrees(north).toFixed(5)
  }
}

/**
 * Gets the total number of tiles in the Y direction at a specified level-of-detail.
 *
 * @param {Number} level The level-of-detail.
 * @returns {Number} The number of tiles in the Y direction at the given level.
 */
LonlatTilingScheme.prototype.getNumberOfYTilesAtLevel = function (level) {
  return this._numberOfLevelZeroTilesY << level;
};

/**
 * Transforms a rectangle specified in geodetic radians to the native coordinate system
 * of this tiling scheme.
 *
 * @param {Rectangle} rectangle The rectangle to transform.
 * @param {Rectangle} [result] The instance to which to copy the result, or undefined if a new instance
 *        should be created.
 * @returns {Rectangle} The specified 'result', or a new object containing the native rectangle if 'result'
 *          is undefined.
 */
LonlatTilingScheme.prototype.rectangleToNativeRectangle = function (
  rectangle,
  result
) {
  const west = CesiumMath.toDegrees(rectangle.west);
  const south = CesiumMath.toDegrees(rectangle.south);
  const east = CesiumMath.toDegrees(rectangle.east);
  const north = CesiumMath.toDegrees(rectangle.north);

  if (!defined(result)) {
    return new Rectangle(west, south, east, north);
  }

  result.west = west;
  result.south = south;
  result.east = east;
  result.north = north;
  return result;
};

/**
 * Converts tile x, y coordinates and level to a rectangle expressed in the native coordinates
 * of the tiling scheme.
 *
 * @param {Number} x The integer x coordinate of the tile.
 * @param {Number} y The integer y coordinate of the tile.
 * @param {Number} level The tile level-of-detail.  Zero is the least detailed.
 * @param {Object} [result] The instance to which to copy the result, or undefined if a new instance
 *        should be created.
 * @returns {Rectangle} The specified 'result', or a new object containing the rectangle
 *          if 'result' is undefined.
 */
LonlatTilingScheme.prototype.tileXYToNativeRectangle = function (
  x,
  y,
  level,
  result
) {
  const rectangleRadians = this.tileXYToRectangle(x, y, level, result);
  rectangleRadians.west = CesiumMath.toDegrees(rectangleRadians.west);
  rectangleRadians.south = CesiumMath.toDegrees(rectangleRadians.south);
  rectangleRadians.east = CesiumMath.toDegrees(rectangleRadians.east);
  rectangleRadians.north = CesiumMath.toDegrees(rectangleRadians.north);
  return rectangleRadians;
};

/**
 * Converts tile x, y coordinates and level to a cartographic rectangle in radians.
 *
 * @param {Number} x The integer x coordinate of the tile.
 * @param {Number} y The integer y coordinate of the tile.
 * @param {Number} level The tile level-of-detail.  Zero is the least detailed.
 * @param {Object} [result] The instance to which to copy the result, or undefined if a new instance
 *        should be created.
 * @returns {Rectangle} The specified 'result', or a new object containing the rectangle
 *          if 'result' is undefined.
 */
LonlatTilingScheme.prototype.tileXYToRectangle = function (
  x,
  y,
  level,
  result
) {
  var rectangle = this._rectangle;

  var xTiles = this.getNumberOfXTilesAtLevel(level);
  var yTiles = this.getNumberOfYTilesAtLevel(level);

  var xTileWidth = rectangle.width / xTiles;
  var west = x * xTileWidth + rectangle.west;
  var east = (x + 1) * xTileWidth + rectangle.west;

  var yTileHeight = rectangle.height / yTiles;
  var north = rectangle.north - y * yTileHeight;
  var south = rectangle.north - (y + 1) * yTileHeight;

  if (!defined(result)) {
    result = new Rectangle(west, south, east, north);
  }

  result.west = west;
  result.south = south;
  result.east = east;
  result.north = north;
  return result;
};

/**
 * Calculates the tile x, y coordinates of the tile containing
 * a given cartographic position.
 *
 * @param {Cartographic} position The position.
 * @param {Number} level The tile level-of-detail.  Zero is the least detailed.
 * @param {Cartesian2} [result] The instance to which to copy the result, or undefined if a new instance
 *        should be created.
 * @returns {Cartesian2} The specified 'result', or a new object containing the tile x, y coordinates
 *          if 'result' is undefined.
 */
LonlatTilingScheme.prototype.positionToTileXY = function (
  position,
  level,
  result
) {
  var rectangle = this._rectangle;
  if (!Rectangle.contains(rectangle, position)) {
    // outside the bounds of the tiling scheme
    return undefined;
  }

  var xTiles = this.getNumberOfXTilesAtLevel(level);
  var yTiles = this.getNumberOfYTilesAtLevel(level);

  var xTileWidth = rectangle.width / xTiles;
  var yTileHeight = rectangle.height / yTiles;

  var longitude = position.longitude;
  if (rectangle.east < rectangle.west) {
    longitude += CesiumMath.TWO_PI;
  }

  var xTileCoordinate = ((longitude - rectangle.west) / xTileWidth) | 0;
  if (xTileCoordinate >= xTiles) {
    xTileCoordinate = xTiles - 1;
  }

  var yTileCoordinate =
    ((rectangle.north - position.latitude) / yTileHeight) | 0;
  if (yTileCoordinate >= yTiles) {
    yTileCoordinate = yTiles - 1;
  }

  if (!defined(result)) {
    return new Cartesian2(xTileCoordinate, yTileCoordinate);
  }

  result.x = xTileCoordinate;
  result.y = yTileCoordinate;
  return result;
};
export default LonlatTilingScheme;

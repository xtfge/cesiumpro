export const calculateSpeedFrag = `
// the size of UV textures: width = lon, height = lat*lev
uniform sampler2D U; // eastward wind 
uniform sampler2D V; // northward wind
uniform sampler2D currentParticlesPosition; // (lon, lat, lev)

uniform vec3 dimension; // (lon, lat, lev)
uniform vec3 minimum; // minimum of each dimension
uniform vec3 maximum; // maximum of each dimension
uniform vec3 interval; // interval of each dimension

// used to calculate the wind norm
uniform vec2 uSpeedRange; // (min, max);
uniform vec2 vSpeedRange;
uniform float pixelSize;
uniform float speedFactor;

float speedScaleFactor = speedFactor * pixelSize;

varying vec2 v_textureCoordinates;

vec2 mapPositionToNormalizedIndex2D(vec3 lonLatLev) {
    // ensure the range of longitude and latitude
    lonLatLev.x = mod(lonLatLev.x, 360.0);
    lonLatLev.y = clamp(lonLatLev.y, -90.0, 90.0);

    vec3 index3D = vec3(0.0);
    index3D.x = (lonLatLev.x - minimum.x) / interval.x;
    index3D.y = (lonLatLev.y - minimum.y) / interval.y;
    index3D.z = (lonLatLev.z - minimum.z) / interval.z;

    // the st texture coordinate corresponding to (col, row) index
    // example
    // data array is [0, 1, 2, 3, 4, 5], width = 3, height = 2
    // the content of texture will be
    // t 1.0
    //    |  3 4 5
    //    |
    //    |  0 1 2
    //   0.0------1.0 s

    vec2 index2D = vec2(index3D.x, index3D.z * dimension.y + index3D.y);
    vec2 normalizedIndex2D = vec2(index2D.x / dimension.x, index2D.y / (dimension.y * dimension.z));
    return normalizedIndex2D;
}

float getWindComponent(sampler2D componentTexture, vec3 lonLatLev) {
    vec2 normalizedIndex2D = mapPositionToNormalizedIndex2D(lonLatLev);
    float result = texture2D(componentTexture, normalizedIndex2D).r;
    return result;
}

float interpolateTexture(sampler2D componentTexture, vec3 lonLatLev) {
    float lon = lonLatLev.x;
    float lat = lonLatLev.y;
    float lev = lonLatLev.z;

    float lon0 = floor(lon / interval.x) * interval.x;
    float lon1 = lon0 + 1.0 * interval.x;
    float lat0 = floor(lat / interval.y) * interval.y;
    float lat1 = lat0 + 1.0 * interval.y;

    float lon0_lat0 = getWindComponent(componentTexture, vec3(lon0, lat0, lev));
    float lon1_lat0 = getWindComponent(componentTexture, vec3(lon1, lat0, lev));
    float lon0_lat1 = getWindComponent(componentTexture, vec3(lon0, lat1, lev));
    float lon1_lat1 = getWindComponent(componentTexture, vec3(lon1, lat1, lev));

    float lon_lat0 = mix(lon0_lat0, lon1_lat0, lon - lon0);
    float lon_lat1 = mix(lon0_lat1, lon1_lat1, lon - lon0);
    float lon_lat = mix(lon_lat0, lon_lat1, lat - lat0);
    return lon_lat;
}

vec3 linearInterpolation(vec3 lonLatLev) {
    // https://en.wikipedia.org/wiki/Bilinear_interpolation
    float u = interpolateTexture(U, lonLatLev);
    float v = interpolateTexture(V, lonLatLev);
    float w = 0.0;
    return vec3(u, v, w);
}

vec2 lengthOfLonLat(vec3 lonLatLev) {
    // unit conversion: meters -> longitude latitude degrees
    // see https://en.wikipedia.org/wiki/Geographic_coordinate_system#Length_of_a_degree for detail

    // Calculate the length of a degree of latitude and longitude in meters
    float latitude = radians(lonLatLev.y);

    float term1 = 111132.92;
    float term2 = 559.82 * cos(2.0 * latitude);
    float term3 = 1.175 * cos(4.0 * latitude);
    float term4 = 0.0023 * cos(6.0 * latitude);
    float latLength = term1 - term2 + term3 - term4;

    float term5 = 111412.84 * cos(latitude);
    float term6 = 93.5 * cos(3.0 * latitude);
    float term7 = 0.118 * cos(5.0 * latitude);
    float longLength = term5 - term6 + term7;

    return vec2(longLength, latLength);
}

vec3 convertSpeedUnitToLonLat(vec3 lonLatLev, vec3 speed) {
    vec2 lonLatLength = lengthOfLonLat(lonLatLev);
    float u = speed.x / lonLatLength.x;
    float v = speed.y / lonLatLength.y;
    float w = 0.0;
    vec3 windVectorInLonLatLev = vec3(u, v, w);

    return windVectorInLonLatLev;
}

vec3 calculateSpeedByRungeKutta2(vec3 lonLatLev) {
    // see https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods#Second-order_methods_with_two_stages for detail
    const float h = 0.5;

    vec3 y_n = lonLatLev;
    vec3 f_n = linearInterpolation(lonLatLev);
    vec3 midpoint = y_n + 0.5 * h * convertSpeedUnitToLonLat(y_n, f_n) * speedScaleFactor;
    vec3 speed = h * linearInterpolation(midpoint) * speedScaleFactor;

    return speed;
}

float calculateWindNorm(vec3 speed) {
    vec3 percent = vec3(0.0);
    percent.x = (speed.x - uSpeedRange.x) / (uSpeedRange.y - uSpeedRange.x);
    percent.y = (speed.y - vSpeedRange.x) / (vSpeedRange.y - vSpeedRange.x);
    float norm = length(percent);

    return norm;
}

void main() {
    // texture coordinate must be normalized
    vec3 lonLatLev = texture2D(currentParticlesPosition, v_textureCoordinates).rgb;
    vec3 speed = calculateSpeedByRungeKutta2(lonLatLev);
    vec3 speedInLonLat = convertSpeedUnitToLonLat(lonLatLev, speed);

    vec4 particleSpeed = vec4(speedInLonLat, calculateWindNorm(speed / speedScaleFactor));
    gl_FragColor = particleSpeed;
}
`
export const fullscreenVert = `attribute vec3 position;
attribute vec2 st;

varying vec2 textureCoordinate;

void main() {
    textureCoordinate = st;
    gl_Position = vec4(position, 1.0);
}`
export const postProcessingPositionFrag = `uniform sampler2D nextParticlesPosition;
uniform sampler2D particlesSpeed; // (u, v, w, norm)

// range (min, max)
uniform vec2 lonRange;
uniform vec2 latRange;

uniform float randomCoefficient; // use to improve the pseudo-random generator
uniform float dropRate; // drop rate is a chance a particle will restart at random position to avoid degeneration
uniform float dropRateBump;

varying vec2 v_textureCoordinates;

// pseudo-random generator
const vec3 randomConstants = vec3(12.9898, 78.233, 4375.85453);
const vec2 normalRange = vec2(0.0, 1.0);
float rand(vec2 seed, vec2 range) {
    vec2 randomSeed = randomCoefficient * seed;
    float temp = dot(randomConstants.xy, randomSeed);
    temp = fract(sin(temp) * (randomConstants.z + temp));
    return temp * (range.y - range.x) + range.x;
}

vec3 generateRandomParticle(vec2 seed, float lev) {
    // ensure the longitude is in [0, 360]
    float randomLon = mod(rand(seed, lonRange), 360.0);
    float randomLat = rand(-seed, latRange);

    return vec3(randomLon, randomLat, lev);
}

bool particleOutbound(vec3 particle) {
    return particle.y < -90.0 || particle.y > 90.0;
}

void main() {
    vec3 nextParticle = texture2D(nextParticlesPosition, v_textureCoordinates).rgb;
    vec4 nextSpeed = texture2D(particlesSpeed, v_textureCoordinates);
    float speedNorm = nextSpeed.a;
    float particleDropRate = dropRate + dropRateBump * speedNorm;

    vec2 seed1 = nextParticle.xy + v_textureCoordinates;
    vec2 seed2 = nextSpeed.xy + v_textureCoordinates;
    vec3 randomParticle = generateRandomParticle(seed1, nextParticle.z);
    float randomNumber = rand(seed2, normalRange);

    if (randomNumber < particleDropRate || particleOutbound(nextParticle)) {
        gl_FragColor = vec4(randomParticle, 1.0); // 1.0 means this is a random particle
    } else {
        gl_FragColor = vec4(nextParticle, 0.0);
    }
}`
export const screenDrawFrag = `uniform sampler2D trailsColorTexture;
uniform sampler2D trailsDepthTexture;

varying vec2 textureCoordinate;

void main() {
    vec4 trailsColor = texture2D(trailsColorTexture, textureCoordinate);
    float trailsDepth = texture2D(trailsDepthTexture, textureCoordinate).r;
    float globeDepth = czm_unpackDepth(texture2D(czm_globeDepthTexture, textureCoordinate));

    if (trailsDepth < globeDepth) {
        gl_FragColor = trailsColor;
    } else {
        gl_FragColor = vec4(0.0);
    }
}`
export const segmentDragFrag = `
uniform vec4 color;
void main() {
  gl_FragColor = color;
}
`
export const segmentDrawVert = `attribute vec2 st;
// it is not normal itself, but used to control lines drawing
attribute vec3 normal; // (point to use, offset sign, not used component)

uniform sampler2D previousParticlesPosition;
uniform sampler2D currentParticlesPosition;
uniform sampler2D postProcessingPosition;

uniform float particleHeight;

uniform float aspect;
uniform float pixelSize;
uniform float lineWidth;

struct adjacentPoints {
    vec4 previous;
    vec4 current;
    vec4 next;
};

vec3 convertCoordinate(vec3 lonLatLev) {
    // WGS84 (lon, lat, lev) -> ECEF (x, y, z)
    // read https://en.wikipedia.org/wiki/Geographic_coordinate_conversion#From_geodetic_to_ECEF_coordinates for detail

    // WGS 84 geometric constants 
    float a = 6378137.0; // Semi-major axis 
    float b = 6356752.3142; // Semi-minor axis 
    float e2 = 6.69437999014e-3; // First eccentricity squared

    float latitude = radians(lonLatLev.y);
    float longitude = radians(lonLatLev.x);

    float cosLat = cos(latitude);
    float sinLat = sin(latitude);
    float cosLon = cos(longitude);
    float sinLon = sin(longitude);

    float N_Phi = a / sqrt(1.0 - e2 * sinLat * sinLat);
    float h = particleHeight; // it should be high enough otherwise the particle may not pass the terrain depth test

    vec3 cartesian = vec3(0.0);
    cartesian.x = (N_Phi + h) * cosLat * cosLon;
    cartesian.y = (N_Phi + h) * cosLat * sinLon;
    cartesian.z = ((b * b) / (a * a) * N_Phi + h) * sinLat;
    return cartesian;
}

vec4 calculateProjectedCoordinate(vec3 lonLatLev) {
    // the range of longitude in Cesium is [-180, 180] but the range of longitude in the NetCDF file is [0, 360]
    // [0, 180] is corresponding to [0, 180] and [180, 360] is corresponding to [-180, 0]
    lonLatLev.x = mod(lonLatLev.x + 180.0, 360.0) - 180.0;
    vec3 particlePosition = convertCoordinate(lonLatLev);
    vec4 projectedCoordinate = czm_modelViewProjection * vec4(particlePosition, 1.0);
    return projectedCoordinate;
}

vec4 calculateOffsetOnNormalDirection(vec4 pointA, vec4 pointB, float offsetSign) {
    vec2 aspectVec2 = vec2(aspect, 1.0);
    vec2 pointA_XY = (pointA.xy / pointA.w) * aspectVec2;
    vec2 pointB_XY = (pointB.xy / pointB.w) * aspectVec2;

    float offsetLength = lineWidth / 2.0;
    vec2 direction = normalize(pointB_XY - pointA_XY);
    vec2 normalVector = vec2(-direction.y, direction.x);
    normalVector.x = normalVector.x / aspect;
    normalVector = offsetLength * normalVector;

    vec4 offset = vec4(offsetSign * normalVector, 0.0, 0.0);
    return offset;
}

vec4 calculateOffsetOnMiterDirection(adjacentPoints projectedCoordinates, float offsetSign) {
    vec2 aspectVec2 = vec2(aspect, 1.0);

    vec4 PointA = projectedCoordinates.previous;
    vec4 PointB = projectedCoordinates.current;
    vec4 PointC = projectedCoordinates.next;

    vec2 pointA_XY = (PointA.xy / PointA.w) * aspectVec2;
    vec2 pointB_XY = (PointB.xy / PointB.w) * aspectVec2;
    vec2 pointC_XY = (PointC.xy / PointC.w) * aspectVec2;

    vec2 AB = normalize(pointB_XY - pointA_XY);
    vec2 BC = normalize(pointC_XY - pointB_XY);

    vec2 normalA = vec2(-AB.y, AB.x);
    vec2 tangent = normalize(AB + BC);
    vec2 miter = vec2(-tangent.y, tangent.x);

    float offsetLength = lineWidth / 2.0;
    float projection = dot(miter, normalA);
    vec4 offset = vec4(0.0);
    // avoid to use values that are too small
    if (projection > 0.1) {
        float miterLength = offsetLength / projection;
        offset = vec4(offsetSign * miter * miterLength, 0.0, 0.0);
        offset.x = offset.x / aspect;
    } else {
        offset = calculateOffsetOnNormalDirection(PointB, PointC, offsetSign);
    }

    return offset;
}

void main() {
    vec2 particleIndex = st;

    vec3 previousPosition = texture2D(previousParticlesPosition, particleIndex).rgb;
    vec3 currentPosition = texture2D(currentParticlesPosition, particleIndex).rgb;
    vec3 nextPosition = texture2D(postProcessingPosition, particleIndex).rgb;

    float isAnyRandomPointUsed = texture2D(postProcessingPosition, particleIndex).a +
        texture2D(currentParticlesPosition, particleIndex).a +
        texture2D(previousParticlesPosition, particleIndex).a;

    adjacentPoints projectedCoordinates;
    if (isAnyRandomPointUsed > 0.0) {
        projectedCoordinates.previous = calculateProjectedCoordinate(previousPosition);
        projectedCoordinates.current = projectedCoordinates.previous;
        projectedCoordinates.next = projectedCoordinates.previous;
    } else {
        projectedCoordinates.previous = calculateProjectedCoordinate(previousPosition);
        projectedCoordinates.current = calculateProjectedCoordinate(currentPosition);
        projectedCoordinates.next = calculateProjectedCoordinate(nextPosition);
    }

    int pointToUse = int(normal.x);
    float offsetSign = normal.y;
    vec4 offset = vec4(0.0);
    // render lines with triangles and miter joint
    // read https://blog.scottlogic.com/2019/11/18/drawing-lines-with-webgl.html for detail
    if (pointToUse == -1) {
        offset = pixelSize * calculateOffsetOnNormalDirection(projectedCoordinates.previous, projectedCoordinates.current, offsetSign);
        gl_Position = projectedCoordinates.previous + offset;
    } else {
        if (pointToUse == 0) {
            offset = pixelSize * calculateOffsetOnMiterDirection(projectedCoordinates, offsetSign);
            gl_Position = projectedCoordinates.current + offset;
        } else {
            if (pointToUse == 1) {
                offset = pixelSize * calculateOffsetOnNormalDirection(projectedCoordinates.current, projectedCoordinates.next, offsetSign);
                gl_Position = projectedCoordinates.next + offset;
            } else {

            }
        }
    }
}`
export const trailDrawFrag = `uniform sampler2D segmentsColorTexture;
uniform sampler2D segmentsDepthTexture;

uniform sampler2D currentTrailsColor;
uniform sampler2D trailsDepthTexture;

uniform float fadeOpacity;

varying vec2 textureCoordinate;

void main() {
    vec4 pointsColor = texture2D(segmentsColorTexture, textureCoordinate);
    vec4 trailsColor = texture2D(currentTrailsColor, textureCoordinate);

    trailsColor = floor(fadeOpacity * 255.0 * trailsColor) / 255.0; // make sure the trailsColor will be strictly decreased

    float pointsDepth = texture2D(segmentsDepthTexture, textureCoordinate).r;
    float trailsDepth = texture2D(trailsDepthTexture, textureCoordinate).r;
    float globeDepth = czm_unpackDepth(texture2D(czm_globeDepthTexture, textureCoordinate));

    gl_FragColor = vec4(0.0);
    if (pointsDepth < globeDepth) {
        gl_FragColor = gl_FragColor + pointsColor;
    }
    if (trailsDepth < globeDepth) {
        gl_FragColor = gl_FragColor + trailsColor;
    }
    gl_FragDepthEXT = min(pointsDepth, trailsDepth);
}`
export const updatePosition = `uniform sampler2D currentParticlesPosition; // (lon, lat, lev)
uniform sampler2D particlesSpeed; // (u, v, w, norm) Unit converted to degrees of longitude and latitude 

varying vec2 v_textureCoordinates;

void main() {
    // texture coordinate must be normalized
    vec3 lonLatLev = texture2D(currentParticlesPosition, v_textureCoordinates).rgb;
    vec3 speed = texture2D(particlesSpeed, v_textureCoordinates).rgb;
    vec3 nextParticle = lonLatLev + speed;

    gl_FragColor = vec4(nextParticle, 0.0);
}`
function loadText(filePath) {
  const request = new XMLHttpRequest();
  request.open("GET", filePath, false);
  request.send();
  return request.responseText;
}
function getFullscreenQuad() {
  const fullscreenQuad = new Cesium.Geometry({
    attributes: new Cesium.GeometryAttributes({
      position: new Cesium.GeometryAttribute({
        componentDatatype: Cesium.ComponentDatatype.FLOAT,
        componentsPerAttribute: 3,
        //  v3----v2
        //  |     |
        //  |     |
        //  v0----v1
        values: new Float32Array([
          -1,
          -1,
          0, // v0
          1,
          -1,
          0, // v1
          1,
          1,
          0, // v2
          -1,
          1,
          0, // v3
        ]),
      }),
      st: new Cesium.GeometryAttribute({
        componentDatatype: Cesium.ComponentDatatype.FLOAT,
        componentsPerAttribute: 2,
        values: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
      }),
    }),
    indices: new Uint32Array([3, 2, 0, 0, 2, 1]),
  });
  return fullscreenQuad;
}

function createTexture(options, typedArray) {
  if (Cesium.defined(typedArray)) {
    // typed array needs to be passed as source option, this is required by Cesium.Texture
    const source = {};
    source.arrayBufferView = typedArray;
    options.source = source;
  }

  const texture = new Cesium.Texture(options);
  return texture;
};

function createFramebuffer(context, colorTexture, depthTexture) {
  const framebuffer = new Cesium.Framebuffer({
    context: context,
    colorTextures: [colorTexture],
    depthTexture: depthTexture,
  });
  return framebuffer;
};

function createRawRenderState(options) {
  const translucent = true;
  const closed = false;
  const existing = {
    viewport: options.viewport,
    depthTest: options.depthTest,
    depthMask: options.depthMask,
    blending: options.blending,
  };

  const rawRenderState = Cesium.Appearance.getDefaultRenderState(
    translucent,
    closed,
    existing
  );
  return rawRenderState;
};

function viewRectangleToLonLatRange(viewRectangle) {
  const range = {};

  const postiveWest = Cesium.Math.mod(viewRectangle.west, Cesium.Math.TWO_PI);
  const postiveEast = Cesium.Math.mod(viewRectangle.east, Cesium.Math.TWO_PI);
  const width = viewRectangle.width;

  let longitudeMin;
  let longitudeMax;
  if (width > Cesium.Math.THREE_PI_OVER_TWO) {
    longitudeMin = 0.0;
    longitudeMax = Cesium.Math.TWO_PI;
  } else {
    if (postiveEast - postiveWest < width) {
      longitudeMin = postiveWest;
      longitudeMax = postiveWest + width;
    } else {
      longitudeMin = postiveWest;
      longitudeMax = postiveEast;
    }
  }

  range.lon = {
    min: Cesium.Math.toDegrees(longitudeMin),
    max: Cesium.Math.toDegrees(longitudeMax),
  };

  const south = viewRectangle.south;
  const north = viewRectangle.north;
  const height = viewRectangle.height;

  let extendHeight = height > Cesium.Math.PI / 12 ? height / 2 : 0;
  let extendedSouth = Cesium.Math.clampToLatitudeRange(south - extendHeight);
  let extendedNorth = Cesium.Math.clampToLatitudeRange(north + extendHeight);

  // extend the bound in high latitude area to make sure it can cover all the visible area
  if (extendedSouth < -Cesium.Math.PI_OVER_THREE) {
    extendedSouth = -Cesium.Math.PI_OVER_TWO;
  }
  if (extendedNorth > Cesium.Math.PI_OVER_THREE) {
    extendedNorth = Cesium.Math.PI_OVER_TWO;
  }

  range.lat = {
    min: Cesium.Math.toDegrees(extendedSouth),
    max: Cesium.Math.toDegrees(extendedNorth),
  };

  return range;
};
export default {
  loadText: loadText,
  getFullscreenQuad: getFullscreenQuad,
  createTexture: createTexture,
  createFramebuffer: createFramebuffer,
  createRawRenderState: createRawRenderState,
  viewRectangleToLonLatRange: viewRectangleToLonLatRange,
	_shaderCalculateSpeedFrag: calculateSpeedFrag,
	_shaderFullscreenVert: fullscreenVert,
	_shaderPostProcessingPositionFrag: postProcessingPositionFrag,
	_shaderScreenDrawFrag: screenDrawFrag,
	_shaderSegmentDragFrag: segmentDragFrag,
	_shaderSegmentDrawVert: segmentDrawVert,
	_shaderTrailDrawFrag: trailDrawFrag,
	_shaderUpdatePosition:updatePosition
};

/*!
 * ------------------------------------------
 * CesiumPro.js
 * E-mail:xtfge_0915@163.com
 * https://github.com/xtfge/CesiumPro
 * version:0.0.1
 * -------------------------------------------
 */

/**
 * 捕获ajax异常
 *
 * @exports ajaxCatch
 * @param {Any} e ajax抛出的错误
 * @param {function} [callback=console.error] 回调函数
 *
 * @example
 *
 * axios.get('url')
 * .then(res=>{
 *    do(res)
 * }).catch(e=>{
 *    CesiumPro.ajaxCatch(e,console.log);
 * })
 */
var errorCatch = function errorCatch(e) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : console.error;

  if (e.response) {
    callback(e.status, e.response.data);
  } else if (e.request) {
    callback(e.status, e.request);
  } else if (e.message) {
    callback(e.status, e.message);
  } else if (e.statusText) {
    callback(e.status, e.statusText);
  } else {
    callback(e);
  }
};

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _readOnlyError(name) {
  throw new Error("\"" + name + "\" is read-only");
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = o[Symbol.iterator]();
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

var Graphic =
/**
 * 绘图图形基类
 * @param {Object} options 具有以下参数
 */
function Graphic(options) {
  _classCallCheck(this, Graphic);
};

var BillboardGraphic = /*#__PURE__*/function (_Graphic) {
  _inherits(BillboardGraphic, _Graphic);

  var _super = _createSuper(BillboardGraphic);

  function BillboardGraphic() {
    _classCallCheck(this, BillboardGraphic);

    return _super.call(this);
  }

  return BillboardGraphic;
}(Graphic);

_defineProperty(BillboardGraphic, "defaultStyle", {
  image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkJEN0VBRDA0MzJCRTExRUE5MjY2QTg3OUVFNjUyQzhCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkJEN0VBRDA1MzJCRTExRUE5MjY2QTg3OUVFNjUyQzhCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QkQ3RUFEMDIzMkJFMTFFQTkyNjZBODc5RUU2NTJDOEIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QkQ3RUFEMDMzMkJFMTFFQTkyNjZBODc5RUU2NTJDOEIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6qzlgwAAADR0lEQVR42uxXTUhUURQ+88aZ93JSZyiDCCkt+0VLtGzRn/QntotMoqBEol1Ui9JVtNCsoKJNSFgQREjRKiXF/mxToIQK2YBZIRKlaE1pb+Y5M33n+dRJfTN3ZoLZdOG7986dc75z5v6cc8YSDAYpkU2iBLeEO5AUpfxy4BCwHVgLLDTWh4B3wEvgPvBBlNAy1x1w3fP89XnkcOoyDJeBA6wTgZMJHwJnwfNpBk/0DkCpFEM9kKL6iR591qixX6OukQB9+x3QZRbNkyjXJdG+DBvtX2ojxaov/wQqwPUgZgegUIHhFss19o9TVYdK/aOBsD8/wyHRxXwFziRN7sZx8NWbOWB6CSFchKGOjZ9/q9KRtrGIxrmxDMuyjnFcdQaX+B3g7QZ6gCWXur1U2+WN6YZX5sp0Lkfm6YBxaT2iO3CKjbcP+elKtzfmJ8a6zMFcwGnRHVB4J/mJFbeM0ptBf1zvvDDdSk/2OCafagagRtqBvWy8c9gft3FuzMFcRswoFjmC3dy1DIybktqhVVugUF9pCn0EeG4PE1NDuHaJOFDA3auv5r/+Qp5CJ1bZyWW3kBPgedV62VQ+hGujiANZ3Lk95g6UZdlmrR1dYTeVD+HKFHHAyd2w+u/SdAiXS8QBXVpJMg/5DX3arLW7vZqpvGyd4lJFHOCsRuuc5reKo1yd20fffUEdPK/pVE3lc1xTXL0i6fgxsKEs02b6DH2IyJXtqg6RdjDTFsodMRAtBvq8AVJ2NP2i9z8CcZ3/6jSJXpTMJ1nSt58v+JdIR8AC1VCg21uSKdVmidk469aDQ56wUj3TeLhkxHvWCmx7jWMoez5GHi0YtfGGomTanK4XB21GENKEkhHyt2ZUP24maC120Mo08fKRZVnHMO5mLoNTvB6AwiCGnZyWs1MlegbC8mx72HqMvzuGgMSyrIPWzRwGV/RVMRQ5j2/laOpAXLi6SaEmZLb8BdZZsrzG310rVMgxEUOesq7BEXdRynG2Bjij66BrQol2o2eiVji5RqYSlGCW6UB2nesR8PjiLkpnEHCqvmM8VTJ5QeXQbzbRnyPuwoEo4QRuAv7gdPMba85o+WJxYBJ5QDPQYsxj4rH8/3OaaAf+CDAAVvn1VEy/MOwAAAAASUVORK5CYII=',
  verticalOrigin: Cesium.VerticalOrigin.BASELINE
});

/**
 * 地图量算工具,包括距离量算、面积量算、角度量算、高度量算
 * @namespace Cartometry
 */
var Cartometry = {};
/**
 * 贴地距离
 * @param {Cesium.Cartesian3[]} positions 构成直线的顶点坐标
 * @return {Number} 长度，单位米
 */

Cartometry.surfaceDistance = function (positions) {
  var distance = 0;

  for (var i = 0; i < positions.length - 1; i += 1) {
    var point1cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
    var point2cartographic = Cesium.Cartographic.fromCartesian(positions[i + 1]);
    /** 根据经纬度计算出距离* */

    var geodesic = new Cesium.EllipsoidGeodesic();
    geodesic.setEndPoints(point1cartographic, point2cartographic);
    var s = geodesic.surfaceDistance;
    distance += s;
  }

  return distance;
};
/**
 * 空间距离
 * @param {Cesium.Cartesian3[]} positions 构成直线的顶点坐标
 * @return {Number} 长度，单位米
 */


Cartometry.spaceDistance = function (positions) {
  var dis = 0;

  for (var i = 1; i < positions.length; i++) {
    var s = positions[i - 1];
    var e = positions[i];
    dis += Cesium.Cartesian3.distance(s, e);
  }

  return dis;
};
/**
 *
 * 计算两个向量之间的夹角，两个向量必须拥有相同的起点。
 * @param {Cesium.Cartesian3} p1 向量起点
 * @param {Cesium.Cartesian3} p2 向量1终点
 * @param {Cesium.Cartesian3} p3 向量2终点
 * @return {Number} 返回p1p2和p1p3之间的夹角，单位：度
 */


Cartometry.angle = function (p1, p2, p3) {
  // 以任意一点为原点建立局部坐标系
  var matrix = Cesium.Transforms.eastNorthUpToFixedFrame(p1);
  var inverseMatrix = Cesium.Matrix4.inverseTransformation(matrix, new Cesium.Matrix4()); // 将其它两个点坐标转换到局部坐标

  var localp2 = Cesium.Matrix4.multiplyByPoint(inverseMatrix, p2, new Cesium.Cartesian3());
  var localp3 = Cesium.Matrix4.multiplyByPoint(inverseMatrix, p3, new Cesium.Cartesian3()); // 归一化

  var normalizep2 = Cesium.Cartesian3.normalize(localp2, new Cesium.Cartesian3());
  var normalizep3 = Cesium.Cartesian3.normalize(localp3, new Cesium.Cartesian3()); // 计算两点夹角

  var cos = Cesium.Cartesian3.dot(normalizep2, normalizep3);
  var angle = Cesium.Math.acosClamped(cos);
  return Cesium.Math.toDegrees(angle);
};
/**
 * 计算向量的方位角
 * @param  {Cesium.Cartesian3} center 向量起点
 * @param  {Cesium.Cartesian3} point  向量终点
 * @return {Number}        角度，单位：度
 * @example
 *
 * const start=Cesium.Cartesian3.fromDegrees(110,30);
 * const end=Cesium.Cartesian3.fromDegrees(110,40)
 * const angle = CesiumPro.Cartometry.angleBetweenNorth(start,end);
 */


Cartometry.angleBetweenNorth = function (center, point) {
  var matrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
  var inverseMatrix = Cesium.Matrix4.inverseTransformation(matrix, new Cesium.Matrix4());
  var localp = Cesium.Matrix4.multiplyByPoint(inverseMatrix, point, new Cesium.Cartesian3());
  var normalize = Cesium.Cartesian3.normalize(localp, new Cesium.Cartesian3());
  var north = new Cesium.Cartesian3(0, 1, 0);
  var cos = Cesium.Cartesian3.dot(normalize, north);
  var angle = Cesium.Math.acosClamped(cos);
  angle = Cesium.Math.toDegrees(angle);
  var east = new Cesium.Cartesian3(1, 0, 0);
  var arceast = Cesium.Cartesian3.dot(east, normalize);

  if (arceast < 0) {
    angle = 360 - angle;
  }

  return angle;
};
/**
 * 贴地面积
 * @todo 贴地面积
 * @param {Cesium.Cartesian3[]} positions 构成多边形的顶点坐标
 * @return {Number} 面积，单位：平方米
 */


Cartometry.surfaceArea = function (positions) {
  // TODO:计算方法有问题
  var res = 0; // 拆分三角曲面

  for (var i = 0; i < positions.length - 2; i += 1) {
    var j = (i + 1) % positions.length;
    var k = (i + 2) % positions.length;
    var totalAngle = Cartometry.angle(positions[i], positions[j], positions[k]);
    var distemp1 = Cartometry.spaceDistance([positions[i], positions[j]]);
    var distemp2 = Cartometry.spaceDistance([positions[j], positions[k]]);
    res += distemp1 * distemp2 * Math.abs(Math.sin(Cesium.Math.toRadians(totalAngle)));
  }

  return res;
};
/**
 * 空间面积
 * @param {Cesium.Cartesian3[]} positions 构成多边形的顶点坐标
 * @return {Number} 面积，单位：平方米
 */


Cartometry.spaceArea = function (positions) {
  var res = 0; // 拆分三角曲面

  for (var i = 0; i < positions.length - 2; i += 1) {
    var j = (i + 1) % positions.length;
    var k = (i + 2) % positions.length;
    var totalAngle = Cartometry.angle(positions[i], positions[j], positions[k]);
    var distemp1 = Cartometry.spaceDistance([positions[i], positions[j]]);
    var distemp2 = Cartometry.spaceDistance([positions[j], positions[k]]);
    res += distemp1 * distemp2 * Math.abs(Math.sin(Cesium.Math.toRadians(totalAngle)));
  }

  return res;
};
/**
 * 计算相邻两个点之间的高度差
 * @param  {} positions
 * @return {} 相信两个顶点之间的高度差，单位m
 */


Cartometry.heightFromCartesianArray = function (positions) {
  if (positions.length < 2) {
    return 0;
  }

  var rst = [];

  for (var i = 1; i < positions.length; i++) {
    var startC = Cesium.Cartographic.fromCartesian(positions[i - 1]);
    var endC = Cesium.Cartographic.fromCartesian(positions[i]);

    if (startC && endC) {
      rst.push(endC.height - startC.height);
    } else {
      rst.push('NaN');
    }
  }

  return rst;
};

/**
 * 生成符合RFC4122 v4的guid
 * @exports guid
 * @return {String} guid
 */
function guid() {
  // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.floor(Math.random() * 16); // y值限定在[8,B]

    /* eslint-disable */

    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}

/**
 * 如果第一个元素为空或未定义，则返回第二个元素，用于设置默认属性
 * @exports defaultValue
 * @param {any} a
 * @param {any} b
 * @returns {any} 如果第一个元素为空或未定义，则返回第二个元素
 *
 * @example
 * param = Cesium.defaultValue(param, 'default');
 */
function defaultValue(a, b) {
  if (a !== undefined && a !== null) {
    return a;
  }

  return b;
}
/**
 *
 * 空对象，该对象不能被编辑
 *
 * @type {Object}
 * @memberof defaultValue
 *
 */


defaultValue.EMPTY_OBJECT = Object.freeze({});

/* eslint-disable */
var arr = [];
var _window = window,
    document$1 = _window.document;
var getProto = Object.getPrototypeOf;
var _slice = arr.slice;
var concat = arr.concat;
var push = arr.push;
var indexOf = arr.indexOf;
var class2type = {};
var toString = class2type.toString;
var hasOwn = class2type.hasOwnProperty;
var fnToString = hasOwn.toString;
var ObjectFunctionString = fnToString.call(Object);
var support = {};

var isFunction = function isFunction(obj) {
  // Support: Chrome <=57, Firefox <=52
  // In some browsers, typeof returns "function" for HTML <object> elements
  // (i.e., `typeof document.createElement( "object" ) === "function"`).
  // We don't want to classify *any* DOM node as a function.
  return typeof obj === 'function' && typeof obj.nodeType !== 'number';
};

var isWindow = function isWindow(obj) {
  return obj != null && obj === obj.window;
};

var preservedScriptAttributes = {
  type: true,
  src: true,
  nonce: true,
  noModule: true
};

function DOMEval(code, node, doc) {
  doc = doc || document$1;
  var i;
  var val;
  var script = doc.createElement('script');
  script.text = code;

  if (node) {
    for (i in preservedScriptAttributes) {
      // Support: Firefox 64+, Edge 18+
      // Some browsers don't support the "nonce" property on scripts.
      // On the other hand, just using `getAttribute` is not enough as
      // the `nonce` attribute is reset to an empty string whenever it
      // becomes browsing-context connected.
      // See https://github.com/whatwg/html/issues/2369
      // See https://html.spec.whatwg.org/#nonce-attributes
      // The `node.getAttribute` check was added for the sake of
      // `jQuery.globalEval` so that it can fake a nonce-containing node
      // via an object.
      val = node[i] || node.getAttribute && node.getAttribute(i);

      if (val) {
        script.setAttribute(i, val);
      }
    }
  }

  doc.head.appendChild(script).parentNode.removeChild(script);
}

function toType(obj) {
  if (obj == null) {
    return "".concat(obj);
  } // Support: Android <=2.3 only (functionish RegExp)


  return _typeof(obj) === 'object' || typeof obj === 'function' ? class2type[toString.call(obj)] || 'object' : _typeof(obj);
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module


var version = '3.4.1'; // Define a local copy of jQuery

var jQuery = function jQuery(selector, context) {
  // The jQuery object is actually just the init constructor 'enhanced'
  // Need init if jQuery is called (just allow error to be thrown if not included)
  return new jQuery.fn.init(selector, context);
}; // Support: Android <=4.0 only
// Make sure we trim BOM and NBSP


var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
jQuery.fn = jQuery.prototype = {
  // The current version of jQuery being used
  jquery: version,
  constructor: jQuery,
  // The default length of a jQuery object is 0
  length: 0,
  toArray: function toArray() {
    return _slice.call(this);
  },
  // Get the Nth element in the matched element set OR
  // Get the whole matched element set as a clean array
  get: function get(num) {
    // Return all the elements in a clean array
    if (num == null) {
      return _slice.call(this);
    } // Return just the one element from the set


    return num < 0 ? this[num + this.length] : this[num];
  },
  // Take an array of elements and push it onto the stack
  // (returning the new matched element set)
  pushStack: function pushStack(elems) {
    // Build a new jQuery matched element set
    var ret = jQuery.merge(this.constructor(), elems); // Add the old object onto the stack (as a reference)

    ret.prevObject = this; // Return the newly-formed element set

    return ret;
  },
  // Execute a callback for every element in the matched set.
  each: function each(callback) {
    return jQuery.each(this, callback);
  },
  map: function map(callback) {
    return this.pushStack(jQuery.map(this, function (elem, i) {
      return callback.call(elem, i, elem);
    }));
  },
  slice: function slice() {
    return this.pushStack(_slice.apply(this, arguments));
  },
  first: function first() {
    return this.eq(0);
  },
  last: function last() {
    return this.eq(-1);
  },
  eq: function eq(i) {
    var len = this.length;
    var j = +i + (i < 0 ? len : 0);
    return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
  },
  end: function end() {
    return this.prevObject || this.constructor();
  },
  // For internal use only.
  // Behaves like an Array's method, not like a jQuery method.
  push: push,
  sort: arr.sort,
  splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function () {
  var options;
  var name;
  var src;
  var copy;
  var copyIsArray;
  var clone;
  var target = arguments[0] || {};
  var i = 1;
  var length = arguments.length;
  var deep = false; // Handle a deep copy situation

  if (typeof target === 'boolean') {
    deep = target; // Skip the boolean and the target

    target = arguments[i] || {};
    i++;
  } // Handle case when target is a string or something (possible in deep copy)


  if (_typeof(target) !== 'object' && !isFunction(target)) {
    target = {};
  } // Extend jQuery itself if only one argument is passed


  if (i === length) {
    target = this;
    i--;
  }

  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    if ((options = arguments[i]) != null) {
      // Extend the base object
      for (name in options) {
        copy = options[name]; // Prevent Object.prototype pollution
        // Prevent never-ending loop

        if (name === '__proto__' || target === copy) {
          continue;
        } // Recurse if we're merging plain objects or arrays


        if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
          src = target[name]; // Ensure proper type for the source value

          if (copyIsArray && !Array.isArray(src)) {
            clone = [];
          } else if (!copyIsArray && !jQuery.isPlainObject(src)) {
            clone = {};
          } else {
            clone = src;
          }

          copyIsArray = false; // Never move original objects, clone them

          target[name] = jQuery.extend(deep, clone, copy); // Don't bring in undefined values
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  } // Return the modified object


  return target;
};

jQuery.extend({
  // Unique for each copy of jQuery on the page
  expando: "jQuery".concat((version + Math.random()).replace(/\D/g, '')),
  // Assume jQuery is ready without the ready module
  isReady: true,
  error: function error(msg) {
    throw new Error(msg);
  },
  noop: function noop() {},
  isPlainObject: function isPlainObject(obj) {
    var proto;
    var Ctor; // Detect obvious negatives
    // Use toString instead of jQuery.type to catch host objects

    if (!obj || toString.call(obj) !== '[object Object]') {
      return false;
    }

    proto = getProto(obj); // Objects with no prototype (e.g., `Object.create( null )`) are plain

    if (!proto) {
      return true;
    } // Objects with prototype are plain iff they were constructed by a global Object function


    Ctor = hasOwn.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor === 'function' && fnToString.call(Ctor) === ObjectFunctionString;
  },
  isEmptyObject: function isEmptyObject(obj) {
    var name;

    for (name in obj) {
      return false;
    }

    return true;
  },
  // Evaluates a script in a global context
  globalEval: function globalEval(code, options) {
    DOMEval(code, {
      nonce: options && options.nonce
    });
  },
  each: function each(obj, callback) {
    var length;
    var i = 0;

    if (isArrayLike(obj)) {
      length = obj.length;

      for (; i < length; i++) {
        if (callback.call(obj[i], i, obj[i]) === false) {
          break;
        }
      }
    } else {
      for (i in obj) {
        if (callback.call(obj[i], i, obj[i]) === false) {
          break;
        }
      }
    }

    return obj;
  },
  // Support: Android <=4.0 only
  trim: function trim(text) {
    return text == null ? '' : "".concat(text).replace(rtrim, '');
  },
  // results is for internal usage only
  makeArray: function makeArray(arr, results) {
    var ret = results || [];

    if (arr != null) {
      if (isArrayLike(Object(arr))) {
        jQuery.merge(ret, typeof arr === 'string' ? [arr] : arr);
      } else {
        push.call(ret, arr);
      }
    }

    return ret;
  },
  inArray: function inArray(elem, arr, i) {
    return arr == null ? -1 : indexOf.call(arr, elem, i);
  },
  // Support: Android <=4.0 only, PhantomJS 1 only
  // push.apply(_, arraylike) throws on ancient WebKit
  merge: function merge(first, second) {
    var len = +second.length;
    var j = 0;
    var i = first.length;

    for (; j < len; j++) {
      first[i++] = second[j];
    }

    first.length = i;
    return first;
  },
  grep: function grep(elems, callback, invert) {
    var callbackInverse;
    var matches = [];
    var i = 0;
    var length = elems.length;
    var callbackExpect = !invert; // Go through the array, only saving the items
    // that pass the validator function

    for (; i < length; i++) {
      callbackInverse = !callback(elems[i], i);

      if (callbackInverse !== callbackExpect) {
        matches.push(elems[i]);
      }
    }

    return matches;
  },
  // arg is for internal usage only
  map: function map(elems, callback, arg) {
    var length;
    var value;
    var i = 0;
    var ret = []; // Go through the array, translating each of the items to their new values

    if (isArrayLike(elems)) {
      length = elems.length;

      for (; i < length; i++) {
        value = callback(elems[i], i, arg);

        if (value != null) {
          ret.push(value);
        }
      } // Go through every key on the object,

    } else {
      for (i in elems) {
        value = callback(elems[i], i, arg);

        if (value != null) {
          ret.push(value);
        }
      }
    } // Flatten any nested arrays


    return concat.apply([], ret);
  },
  // A global GUID counter for objects
  guid: 1,
  // jQuery.support is not used in Core but other projects attach their
  // properties to it so it needs to exist.
  support: support
});

if (typeof Symbol === 'function') {
  jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
} // Populate the class2type map


jQuery.each('Boolean Number String Function Array Date RegExp Object Error Symbol'.split(' '), function (i, name) {
  class2type["[object ".concat(name, "]")] = name.toLowerCase();
});

function isArrayLike(obj) {
  // Support: real iOS 8.2 only (not reproducible in simulator)
  // `in` check used to prevent JIT error (gh-2145)
  // hasOwn isn't used here due to false negatives
  // regarding Nodelist length in IE
  var length = !!obj && 'length' in obj && obj.length;
  var type = toType(obj);

  if (isFunction(obj) || isWindow(obj)) {
    return false;
  }

  return type === 'array' || length === 0 || typeof length === 'number' && length > 0 && length - 1 in obj;
}

var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.4
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://js.foundation/
 *
 * Date: 2019-04-08
 */
function (window) {
  var i;
  var support;
  var Expr;
  var getText;
  var isXML;
  var tokenize;
  var compile;
  var select;
  var outermostContext;
  var sortInput;
  var hasDuplicate; // Local document vars

  var setDocument;
  var document;
  var docElem;
  var documentIsHTML;
  var rbuggyQSA;
  var rbuggyMatches;
  var matches;
  var contains; // Instance-specific data

  var expando = "sizzle".concat(1 * new Date());
  var preferredDoc = window.document;
  var dirruns = 0;
  var done = 0;
  var classCache = createCache();
  var tokenCache = createCache();
  var compilerCache = createCache();
  var nonnativeSelectorCache = createCache();

  var sortOrder = function sortOrder(a, b) {
    if (a === b) {
      hasDuplicate = true;
    }

    return 0;
  }; // Instance methods


  var hasOwn = {}.hasOwnProperty;
  var arr = [];
  var _arr = arr,
      pop = _arr.pop;
  var push_native = arr.push;
  var _arr2 = arr,
      push = _arr2.push;
  var _arr3 = arr,
      slice = _arr3.slice; // Use a stripped-down indexOf as it's faster than native
  // https://jsperf.com/thor-indexof-vs-for/5

  var indexOf = function indexOf(list, elem) {
    var i = 0;
    var len = list.length;

    for (; i < len; i++) {
      if (list[i] === elem) {
        return i;
      }
    }

    return -1;
  };

  var booleans = 'checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped'; // Regular expressions
  // http://www.w3.org/TR/css3-selectors/#whitespace

  var whitespace = '[\\x20\\t\\r\\n\\f]'; // http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier

  var identifier = '(?:\\\\.|[\\w-]|[^\0-\\xa0])+'; // Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors

  var attributes = "\\[".concat(whitespace, "*(").concat(identifier, ")(?:").concat(whitespace // Operator (capture 2)
  , "*([*^$|!~]?=)").concat(whitespace // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
  , "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(").concat(identifier, "))|)").concat(whitespace, "*\\]");
  var pseudos = ":(".concat(identifier, ")(?:\\((") // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
  // 1. quoted (capture 3; capture 4 or capture 5)
  + '(\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)")|' // 2. simple (capture 6)
  + "((?:\\\\.|[^\\\\()[\\]]|".concat(attributes, ")*)|") // 3. anything else (capture 2)
  + '.*' + ')\\)|)'; // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter

  var rwhitespace = new RegExp("".concat(whitespace, "+"), 'g');
  var rtrim = new RegExp("^".concat(whitespace, "+|((?:^|[^\\\\])(?:\\\\.)*)").concat(whitespace, "+$"), 'g');
  var rcomma = new RegExp("^".concat(whitespace, "*,").concat(whitespace, "*"));
  var rcombinators = new RegExp("^".concat(whitespace, "*([>+~]|").concat(whitespace, ")").concat(whitespace, "*"));
  var rdescend = new RegExp("".concat(whitespace, "|>"));
  var rpseudo = new RegExp(pseudos);
  var ridentifier = new RegExp("^".concat(identifier, "$"));
  var matchExpr = {
    ID: new RegExp("^#(".concat(identifier, ")")),
    CLASS: new RegExp("^\\.(".concat(identifier, ")")),
    TAG: new RegExp("^(".concat(identifier, "|[*])")),
    ATTR: new RegExp("^".concat(attributes)),
    PSEUDO: new RegExp("^".concat(pseudos)),
    CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(".concat(whitespace, "*(even|odd|(([+-]|)(\\d*)n|)").concat(whitespace, "*(?:([+-]|)").concat(whitespace, "*(\\d+)|))").concat(whitespace, "*\\)|)"), 'i'),
    bool: new RegExp("^(?:".concat(booleans, ")$"), 'i'),
    // For use in libraries implementing .is()
    // We use this for POS matching in `select`
    needsContext: new RegExp("^".concat(whitespace, "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(").concat(whitespace, "*((?:-\\d)?\\d*)").concat(whitespace, "*\\)|)(?=[^-]|$)"), 'i')
  };
  var rhtml = /HTML$/i;
  var rinputs = /^(?:input|select|textarea|button)$/i;
  var rheader = /^h\d$/i;
  var rnative = /^[^{]+\{\s*\[native \w/; // Easily-parseable/retrievable ID or TAG or CLASS selectors

  var rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/;
  var rsibling = /[+~]/; // CSS escapes
  // http://www.w3.org/TR/CSS21/syndata.html#escaped-characters

  var runescape = new RegExp("\\\\([\\da-f]{1,6}".concat(whitespace, "?|(").concat(whitespace, ")|.)"), 'ig');

  var funescape = function funescape(_, escaped, escapedWhitespace) {
    var high = "0x".concat(escaped) - 0x10000; // NaN means non-codepoint
    // Support: Firefox<24
    // Workaround erroneous numeric interpretation of +"0x"

    return high !== high || escapedWhitespace ? escaped : high < 0 // BMP codepoint
    ? String.fromCharCode(high + 0x10000) // Supplemental Plane codepoint (surrogate pair)
    : String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
  }; // CSS string/identifier serialization
  // https://drafts.csswg.org/cssom/#common-serializing-idioms


  var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g;

  var fcssescape = function fcssescape(ch, asCodePoint) {
    if (asCodePoint) {
      // U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
      if (ch === '\0') {
        return "\uFFFD";
      } // Control characters and (dependent upon position) numbers get escaped as code points


      return "".concat(ch.slice(0, -1), "\\").concat(ch.charCodeAt(ch.length - 1).toString(16), " ");
    } // Other potentially-special ASCII characters get backslash-escaped


    return "\\".concat(ch);
  }; // Used for iframes
  // See setDocument()
  // Removing the function wrapper causes a "Permission Denied"
  // error in IE


  var unloadHandler = function unloadHandler() {
    setDocument();
  };

  var inDisabledFieldset = addCombinator(function (elem) {
    return elem.disabled === true && elem.nodeName.toLowerCase() === 'fieldset';
  }, {
    dir: 'parentNode',
    next: 'legend'
  }); // Optimize for push.apply( _, NodeList )

  try {
    push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes); // Support: Android<4.0
    // Detect silently failing push.apply

    arr[preferredDoc.childNodes.length].nodeType;
  } catch (e) {
    push = {
      apply: arr.length // Leverage slice if possible
      ? function (target, els) {
        push_native.apply(target, slice.call(els));
      } // Support: IE<9
      // Otherwise append directly
      : function (target, els) {
        var j = target.length;
        var i = 0; // Can't trust NodeList.length

        while (target[j++] = els[i++]) {}

        target.length = j - 1;
      }
    };
  }

  function Sizzle(selector, context, results, seed) {
    var m;
    var i;
    var elem;
    var nid;
    var match;
    var groups;
    var newSelector;
    var newContext = context && context.ownerDocument; // nodeType defaults to 9, since context defaults to document

    var nodeType = context ? context.nodeType : 9;
    results = results || []; // Return early from calls with invalid selector or context

    if (typeof selector !== 'string' || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {
      return results;
    } // Try to shortcut find operations (as opposed to filters) in HTML documents


    if (!seed) {
      if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
        setDocument(context);
      }

      context = context || document;

      if (documentIsHTML) {
        // If the selector is sufficiently simple, try using a "get*By*" DOM method
        // (excepting DocumentFragment context, where the methods don't exist)
        if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {
          // ID selector
          if (m = match[1]) {
            // Document context
            if (nodeType === 9) {
              if (elem = context.getElementById(m)) {
                // Support: IE, Opera, Webkit
                // TODO: identify versions
                // getElementById can match elements by name instead of ID
                if (elem.id === m) {
                  results.push(elem);
                  return results;
                }
              } else {
                return results;
              } // Element context

            } else {
              // Support: IE, Opera, Webkit
              // TODO: identify versions
              // getElementById can match elements by name instead of ID
              if (newContext && (elem = newContext.getElementById(m)) && contains(context, elem) && elem.id === m) {
                results.push(elem);
                return results;
              }
            } // Type selector

          } else if (match[2]) {
            push.apply(results, context.getElementsByTagName(selector));
            return results; // Class selector
          } else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {
            push.apply(results, context.getElementsByClassName(m));
            return results;
          }
        } // Take advantage of querySelectorAll


        if (support.qsa && !nonnativeSelectorCache["".concat(selector, " ")] && (!rbuggyQSA || !rbuggyQSA.test(selector)) // Support: IE 8 only
        // Exclude object elements
        && (nodeType !== 1 || context.nodeName.toLowerCase() !== 'object')) {
          newSelector = selector;
          newContext = context; // qSA considers elements outside a scoping root when evaluating child or
          // descendant combinators, which is not what we want.
          // In such cases, we work around the behavior by prefixing every selector in the
          // list with an ID selector referencing the scope context.
          // Thanks to Andrew Dupont for this technique.

          if (nodeType === 1 && rdescend.test(selector)) {
            // Capture the context ID, setting it first if necessary
            if (nid = context.getAttribute('id')) {
              nid = nid.replace(rcssescape, fcssescape);
            } else {
              context.setAttribute('id', nid = expando);
            } // Prefix every selector in the list


            groups = tokenize(selector);
            i = groups.length;

            while (i--) {
              groups[i] = "#".concat(nid, " ").concat(toSelector(groups[i]));
            }

            newSelector = groups.join(','); // Expand context for sibling selectors

            newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
          }

          try {
            push.apply(results, newContext.querySelectorAll(newSelector));
            return results;
          } catch (qsaError) {
            nonnativeSelectorCache(selector, true);
          } finally {
            if (nid === expando) {
              context.removeAttribute('id');
            }
          }
        }
      }
    } // All others


    return select(selector.replace(rtrim, '$1'), context, results, seed);
  }
  /**
  * Create key-value caches of limited size
  * @returns {function(string, object)} Returns the Object data after storing it on itself with
  *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
  *	deleting the oldest entry
  */


  function createCache() {
    var keys = [];

    function cache(key, value) {
      // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
      if (keys.push("".concat(key, " ")) > Expr.cacheLength) {
        // Only keep the most recent entries
        delete cache[keys.shift()];
      }

      return cache["".concat(key, " ")] = value;
    }

    return cache;
  }
  /**
  * Mark a function for special use by Sizzle
  * @param {Function} fn The function to mark
  */


  function markFunction(fn) {
    fn[expando] = true;
    return fn;
  }
  /**
  * Support testing using an element
  * @param {Function} fn Passed the created element and returns a boolean result
  */


  function assert(fn) {
    var el = document.createElement('fieldset');

    try {
      return !!fn(el);
    } catch (e) {
      return false;
    } finally {
      // Remove from its parent by default
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      } // release memory in IE


      el = null;
    }
  }
  /**
  * Adds the same handler for all of the specified attrs
  * @param {String} attrs Pipe-separated list of attributes
  * @param {Function} handler The method that will be applied
  */


  function addHandle(attrs, handler) {
    var arr = attrs.split('|');
    var i = arr.length;

    while (i--) {
      Expr.attrHandle[arr[i]] = handler;
    }
  }
  /**
  * Checks document order of two siblings
  * @param {Element} a
  * @param {Element} b
  * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
  */


  function siblingCheck(a, b) {
    var cur = b && a;
    var diff = cur && a.nodeType === 1 && b.nodeType === 1 && a.sourceIndex - b.sourceIndex; // Use IE sourceIndex if available on both nodes

    if (diff) {
      return diff;
    } // Check if b follows a


    if (cur) {
      while (cur = cur.nextSibling) {
        if (cur === b) {
          return -1;
        }
      }
    }

    return a ? 1 : -1;
  }
  /**
  * Returns a function to use in pseudos for input types
  * @param {String} type
  */


  function createInputPseudo(type) {
    return function (elem) {
      var name = elem.nodeName.toLowerCase();
      return name === 'input' && elem.type === type;
    };
  }
  /**
  * Returns a function to use in pseudos for buttons
  * @param {String} type
  */


  function createButtonPseudo(type) {
    return function (elem) {
      var name = elem.nodeName.toLowerCase();
      return (name === 'input' || name === 'button') && elem.type === type;
    };
  }
  /**
  * Returns a function to use in pseudos for :enabled/:disabled
  * @param {Boolean} disabled true for :disabled; false for :enabled
  */


  function createDisabledPseudo(disabled) {
    // Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
    return function (elem) {
      // Only certain elements can match :enabled or :disabled
      // https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
      // https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
      if ('form' in elem) {
        // Check for inherited disabledness on relevant non-disabled elements:
        // * listed form-associated elements in a disabled fieldset
        //   https://html.spec.whatwg.org/multipage/forms.html#category-listed
        //   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
        // * option elements in a disabled optgroup
        //   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
        // All such elements have a "form" property.
        if (elem.parentNode && elem.disabled === false) {
          // Option elements defer to a parent optgroup if present
          if ('label' in elem) {
            if ('label' in elem.parentNode) {
              return elem.parentNode.disabled === disabled;
            }

            return elem.disabled === disabled;
          } // Support: IE 6 - 11
          // Use the isDisabled shortcut property to check for disabled fieldset ancestors


          return elem.isDisabled === disabled // Where there is no isDisabled, check manually

          /* jshint -W018 */
          || elem.isDisabled !== !disabled && inDisabledFieldset(elem) === disabled;
        }

        return elem.disabled === disabled; // Try to winnow out elements that can't be disabled before trusting the disabled property.
        // Some victims get caught in our net (label, legend, menu, track), but it shouldn't
        // even exist on them, let alone have a boolean value.
      }

      if ('label' in elem) {
        return elem.disabled === disabled;
      } // Remaining elements are neither :enabled nor :disabled


      return false;
    };
  }
  /**
  * Returns a function to use in pseudos for positionals
  * @param {Function} fn
  */


  function createPositionalPseudo(fn) {
    return markFunction(function (argument) {
      argument = +argument;
      return markFunction(function (seed, matches) {
        var j;
        var matchIndexes = fn([], seed.length, argument);
        var i = matchIndexes.length; // Match elements found at the specified indexes

        while (i--) {
          if (seed[j = matchIndexes[i]]) {
            seed[j] = !(matches[j] = seed[j]);
          }
        }
      });
    });
  }
  /**
  * Checks a node for validity as a Sizzle context
  * @param {Element|Object=} context
  * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
  */


  function testContext(context) {
    return context && typeof context.getElementsByTagName !== 'undefined' && context;
  } // Expose support vars for convenience


  support = Sizzle.support = {};
  /**
  * Detects XML nodes
  * @param {Element|Object} elem An element or a document
  * @returns {Boolean} True iff elem is a non-HTML XML node
  */

  isXML = Sizzle.isXML = function (elem) {
    var namespace = elem.namespaceURI;
    var docElem = (elem.ownerDocument || elem).documentElement; // Support: IE <=8
    // Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
    // https://bugs.jquery.com/ticket/4833

    return !rhtml.test(namespace || docElem && docElem.nodeName || 'HTML');
  };
  /**
  * Sets document-related variables once based on the current document
  * @param {Element|Object} [doc] An element or document object to use to set the document
  * @returns {Object} Returns the current document
  */


  setDocument = Sizzle.setDocument = function (node) {
    var hasCompare;
    var subWindow;
    var doc = node ? node.ownerDocument || node : preferredDoc; // Return early if doc is invalid or already selected

    if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
      return document;
    } // Update global variables


    document = doc;
    docElem = document.documentElement;
    documentIsHTML = !isXML(document); // Support: IE 9-11, Edge
    // Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)

    if (preferredDoc !== document && (subWindow = document.defaultView) && subWindow.top !== subWindow) {
      // Support: IE 11, Edge
      if (subWindow.addEventListener) {
        subWindow.addEventListener('unload', unloadHandler, false); // Support: IE 9 - 10 only
      } else if (subWindow.attachEvent) {
        subWindow.attachEvent('onunload', unloadHandler);
      }
    }
    /* Attributes
    ---------------------------------------------------------------------- */
    // Support: IE<8
    // Verify that getAttribute really returns attributes and not properties
    // (excepting IE8 booleans)


    support.attributes = assert(function (el) {
      el.className = 'i';
      return !el.getAttribute('className');
    });
    /* getElement(s)By*
    ---------------------------------------------------------------------- */
    // Check if getElementsByTagName("*") returns only elements

    support.getElementsByTagName = assert(function (el) {
      el.appendChild(document.createComment(''));
      return !el.getElementsByTagName('*').length;
    }); // Support: IE<9

    support.getElementsByClassName = rnative.test(document.getElementsByClassName); // Support: IE<10
    // Check if getElementById returns elements by name
    // The broken getElementById methods don't pick up programmatically-set names,
    // so use a roundabout getElementsByName test

    support.getById = assert(function (el) {
      docElem.appendChild(el).id = expando;
      return !document.getElementsByName || !document.getElementsByName(expando).length;
    }); // ID filter and find

    if (support.getById) {
      Expr.filter.ID = function (id) {
        var attrId = id.replace(runescape, funescape);
        return function (elem) {
          return elem.getAttribute('id') === attrId;
        };
      };

      Expr.find.ID = function (id, context) {
        if (typeof context.getElementById !== 'undefined' && documentIsHTML) {
          var elem = context.getElementById(id);
          return elem ? [elem] : [];
        }
      };
    } else {
      Expr.filter.ID = function (id) {
        var attrId = id.replace(runescape, funescape);
        return function (elem) {
          var node = typeof elem.getAttributeNode !== 'undefined' && elem.getAttributeNode('id');
          return node && node.value === attrId;
        };
      }; // Support: IE 6 - 7 only
      // getElementById is not reliable as a find shortcut


      Expr.find.ID = function (id, context) {
        if (typeof context.getElementById !== 'undefined' && documentIsHTML) {
          var _node;

          var _i;

          var elems;
          var elem = context.getElementById(id);

          if (elem) {
            // Verify the id attribute
            _node = elem.getAttributeNode('id');

            if (_node && _node.value === id) {
              return [elem];
            } // Fall back on getElementsByName


            elems = context.getElementsByName(id);
            _i = 0;

            while (elem = elems[_i++]) {
              _node = elem.getAttributeNode('id');

              if (_node && _node.value === id) {
                return [elem];
              }
            }
          }

          return [];
        }
      };
    } // Tag


    Expr.find.TAG = support.getElementsByTagName ? function (tag, context) {
      if (typeof context.getElementsByTagName !== 'undefined') {
        return context.getElementsByTagName(tag); // DocumentFragment nodes don't have gEBTN
      }

      if (support.qsa) {
        return context.querySelectorAll(tag);
      }
    } : function (tag, context) {
      var elem;
      var tmp = [];
      var i = 0; // By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too

      var results = context.getElementsByTagName(tag); // Filter out possible comments

      if (tag === '*') {
        while (elem = results[i++]) {
          if (elem.nodeType === 1) {
            tmp.push(elem);
          }
        }

        return tmp;
      }

      return results;
    }; // Class

    Expr.find.CLASS = support.getElementsByClassName && function (className, context) {
      if (typeof context.getElementsByClassName !== 'undefined' && documentIsHTML) {
        return context.getElementsByClassName(className);
      }
    };
    /* QSA/matchesSelector
    ---------------------------------------------------------------------- */
    // QSA and matchesSelector support
    // matchesSelector(:active) reports false when true (IE9/Opera 11.5)


    rbuggyMatches = []; // qSa(:focus) reports false when true (Chrome 21)
    // We allow this because of a bug in IE8/9 that throws an error
    // whenever `document.activeElement` is accessed on an iframe
    // So, we allow :focus to pass through QSA all the time to avoid the IE error
    // See https://bugs.jquery.com/ticket/13378

    rbuggyQSA = [];

    if (support.qsa = rnative.test(document.querySelectorAll)) {
      // Build QSA regex
      // Regex strategy adopted from Diego Perini
      assert(function (el) {
        // Select is set to empty string on purpose
        // This is to test IE's treatment of not explicitly
        // setting a boolean content attribute,
        // since its presence should be enough
        // https://bugs.jquery.com/ticket/12359
        docElem.appendChild(el).innerHTML = "<a id='".concat(expando, "'></a>") + "<select id='".concat(expando, "-\r\\' msallowcapture=''>") + '<option selected=\'\'></option></select>'; // Support: IE8, Opera 11-12.16
        // Nothing should be selected when empty strings follow ^= or $= or *=
        // The test attribute must be unknown in Opera but "safe" for WinRT
        // https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section

        if (el.querySelectorAll("[msallowcapture^='']").length) {
          rbuggyQSA.push("[*^$]=".concat(whitespace, "*(?:''|\"\")"));
        } // Support: IE8
        // Boolean attributes and "value" are not treated correctly


        if (!el.querySelectorAll('[selected]').length) {
          rbuggyQSA.push("\\[".concat(whitespace, "*(?:value|").concat(booleans, ")"));
        } // Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+


        if (!el.querySelectorAll("[id~=".concat(expando, "-]")).length) {
          rbuggyQSA.push('~=');
        } // Webkit/Opera - :checked should return selected option elements
        // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
        // IE8 throws error here and will not see later tests


        if (!el.querySelectorAll(':checked').length) {
          rbuggyQSA.push(':checked');
        } // Support: Safari 8+, iOS 8+
        // https://bugs.webkit.org/show_bug.cgi?id=136851
        // In-page `selector#id sibling-combinator selector` fails


        if (!el.querySelectorAll("a#".concat(expando, "+*")).length) {
          rbuggyQSA.push('.#.+[+~]');
        }
      });
      assert(function (el) {
        el.innerHTML = "<a href='' disabled='disabled'></a>" + "<select disabled='disabled'><option/></select>"; // Support: Windows 8 Native Apps
        // The type and name attributes are restricted during .innerHTML assignment

        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        el.appendChild(input).setAttribute('name', 'D'); // Support: IE8
        // Enforce case-sensitivity of name attribute

        if (el.querySelectorAll('[name=d]').length) {
          rbuggyQSA.push("name".concat(whitespace, "*[*^$|!~]?="));
        } // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
        // IE8 throws error here and will not see later tests


        if (el.querySelectorAll(':enabled').length !== 2) {
          rbuggyQSA.push(':enabled', ':disabled');
        } // Support: IE9-11+
        // IE's :disabled selector does not pick up the children of disabled fieldsets


        docElem.appendChild(el).disabled = true;

        if (el.querySelectorAll(':disabled').length !== 2) {
          rbuggyQSA.push(':enabled', ':disabled');
        } // Opera 10-11 does not throw on post-comma invalid pseudos


        el.querySelectorAll('*,:x');
        rbuggyQSA.push(',.*:');
      });
    }

    if (support.matchesSelector = rnative.test(matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) {
      assert(function (el) {
        // Check to see if it's possible to do matchesSelector
        // on a disconnected node (IE 9)
        support.disconnectedMatch = matches.call(el, '*'); // This should fail with an exception
        // Gecko does not error, returns false instead

        matches.call(el, "[s!='']:x");
        rbuggyMatches.push('!=', pseudos);
      });
    }

    rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join('|'));
    rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join('|'));
    /* Contains
    ---------------------------------------------------------------------- */

    hasCompare = rnative.test(docElem.compareDocumentPosition); // Element contains another
    // Purposefully self-exclusive
    // As in, an element does not contain itself

    contains = hasCompare || rnative.test(docElem.contains) ? function (a, b) {
      var adown = a.nodeType === 9 ? a.documentElement : a;
      var bup = b && b.parentNode;
      return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
    } : function (a, b) {
      if (b) {
        while (b = b.parentNode) {
          if (b === a) {
            return true;
          }
        }
      }

      return false;
    };
    /* Sorting
    ---------------------------------------------------------------------- */
    // Document order sorting

    sortOrder = hasCompare ? function (a, b) {
      // Flag for duplicate removal
      if (a === b) {
        hasDuplicate = true;
        return 0;
      } // Sort on method existence if only one input has compareDocumentPosition


      var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;

      if (compare) {
        return compare;
      } // Calculate position if both inputs belong to the same document


      compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) // Otherwise we know they are disconnected
      : 1; // Disconnected nodes

      if (compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare) {
        // Choose the first element that is related to our preferred document
        if (a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a)) {
          return -1;
        }

        if (b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b)) {
          return 1;
        } // Maintain original order


        return sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0;
      }

      return compare & 4 ? -1 : 1;
    } : function (a, b) {
      // Exit early if the nodes are identical
      if (a === b) {
        hasDuplicate = true;
        return 0;
      }

      var cur;
      var i = 0;
      var aup = a.parentNode;
      var bup = b.parentNode;
      var ap = [a];
      var bp = [b]; // Parentless nodes are either documents or disconnected

      if (!aup || !bup) {
        return a === document ? -1 : b === document ? 1 : aup ? -1 : bup ? 1 : sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0; // If the nodes are siblings, we can do a quick check
      }

      if (aup === bup) {
        return siblingCheck(a, b);
      } // Otherwise we need full lists of their ancestors for comparison


      cur = a;

      while (cur = cur.parentNode) {
        ap.unshift(cur);
      }

      cur = b;

      while (cur = cur.parentNode) {
        bp.unshift(cur);
      } // Walk down the tree looking for a discrepancy


      while (ap[i] === bp[i]) {
        i++;
      }

      return i // Do a sibling check if the nodes have a common ancestor
      ? siblingCheck(ap[i], bp[i]) // Otherwise nodes in our document sort first
      : ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
    };
    return document;
  };

  Sizzle.matches = function (expr, elements) {
    return Sizzle(expr, null, null, elements);
  };

  Sizzle.matchesSelector = function (elem, expr) {
    // Set document vars if needed
    if ((elem.ownerDocument || elem) !== document) {
      setDocument(elem);
    }

    if (support.matchesSelector && documentIsHTML && !nonnativeSelectorCache["".concat(expr, " ")] && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
      try {
        var ret = matches.call(elem, expr); // IE 9's matchesSelector returns false on disconnected nodes

        if (ret || support.disconnectedMatch // As well, disconnected nodes are said to be in a document
        // fragment in IE 9
        || elem.document && elem.document.nodeType !== 11) {
          return ret;
        }
      } catch (e) {
        nonnativeSelectorCache(expr, true);
      }
    }

    return Sizzle(expr, document, null, [elem]).length > 0;
  };

  Sizzle.contains = function (context, elem) {
    // Set document vars if needed
    if ((context.ownerDocument || context) !== document) {
      setDocument(context);
    }

    return contains(context, elem);
  };

  Sizzle.attr = function (elem, name) {
    // Set document vars if needed
    if ((elem.ownerDocument || elem) !== document) {
      setDocument(elem);
    }

    var fn = Expr.attrHandle[name.toLowerCase()]; // Don't get fooled by Object.prototype properties (jQuery #13807)

    var val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : undefined;
    return val !== undefined ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
  };

  Sizzle.escape = function (sel) {
    return "".concat(sel).replace(rcssescape, fcssescape);
  };

  Sizzle.error = function (msg) {
    throw new Error("Syntax error, unrecognized expression: ".concat(msg));
  };
  /**
  * Document sorting and removing duplicates
  * @param {ArrayLike} results
  */


  Sizzle.uniqueSort = function (results) {
    var elem;
    var duplicates = [];
    var j = 0;
    var i = 0; // Unless we *know* we can detect duplicates, assume their presence

    hasDuplicate = !support.detectDuplicates;
    sortInput = !support.sortStable && results.slice(0);
    results.sort(sortOrder);

    if (hasDuplicate) {
      while (elem = results[i++]) {
        if (elem === results[i]) {
          j = duplicates.push(i);
        }
      }

      while (j--) {
        results.splice(duplicates[j], 1);
      }
    } // Clear input after sorting to release objects
    // See https://github.com/jquery/sizzle/pull/225


    sortInput = null;
    return results;
  };
  /**
  * Utility function for retrieving the text value of an array of DOM nodes
  * @param {Array|Element} elem
  */


  getText = Sizzle.getText = function (elem) {
    var node;
    var ret = '';
    var i = 0;
    var _elem = elem,
        nodeType = _elem.nodeType;

    if (!nodeType) {
      // If no nodeType, this is expected to be an array
      while (node = elem[i++]) {
        // Do not traverse comment nodes
        ret += getText(node);
      }
    } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
      // Use textContent for elements
      // innerText usage removed for consistency of new lines (jQuery #11153)
      if (typeof elem.textContent === 'string') {
        return elem.textContent;
      } // Traverse its children


      for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
        ret += getText(elem);
      }
    } else if (nodeType === 3 || nodeType === 4) {
      return elem.nodeValue;
    } // Do not include comment or processing instruction nodes


    return ret;
  };

  Expr = Sizzle.selectors = {
    // Can be adjusted by the user
    cacheLength: 50,
    createPseudo: markFunction,
    match: matchExpr,
    attrHandle: {},
    find: {},
    relative: {
      '>': {
        dir: 'parentNode',
        first: true
      },
      ' ': {
        dir: 'parentNode'
      },
      '+': {
        dir: 'previousSibling',
        first: true
      },
      '~': {
        dir: 'previousSibling'
      }
    },
    preFilter: {
      ATTR: function ATTR(match) {
        match[1] = match[1].replace(runescape, funescape); // Move the given value to match[3] whether quoted or unquoted

        match[3] = (match[3] || match[4] || match[5] || '').replace(runescape, funescape);

        if (match[2] === '~=') {
          match[3] = " ".concat(match[3], " ");
        }

        return match.slice(0, 4);
      },
      CHILD: function CHILD(match) {
        /* matches from matchExpr["CHILD"]
        1 type (only|nth|...)
        2 what (child|of-type)
        3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
        4 xn-component of xn+y argument ([+-]?\d*n|)
        5 sign of xn-component
        6 x of xn-component
        7 sign of y-component
        8 y of y-component
        */
        match[1] = match[1].toLowerCase();

        if (match[1].slice(0, 3) === 'nth') {
          // nth-* requires argument
          if (!match[3]) {
            Sizzle.error(match[0]);
          } // numeric x and y parameters for Expr.filter.CHILD
          // remember that false/true cast respectively to 0/1


          match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === 'even' || match[3] === 'odd'));
          match[5] = +(match[7] + match[8] || match[3] === 'odd'); // other types prohibit arguments
        } else if (match[3]) {
          Sizzle.error(match[0]);
        }

        return match;
      },
      PSEUDO: function PSEUDO(match) {
        var excess;
        var unquoted = !match[6] && match[2];

        if (matchExpr.CHILD.test(match[0])) {
          return null;
        } // Accept quoted arguments as-is


        if (match[3]) {
          match[2] = match[4] || match[5] || ''; // Strip excess characters from unquoted arguments
        } else if (unquoted && rpseudo.test(unquoted) // Get excess from tokenize (recursively)
        && (excess = tokenize(unquoted, true)) // advance to the next closing parenthesis
        && (excess = unquoted.indexOf(')', unquoted.length - excess) - unquoted.length)) {
          // excess is a negative index
          match[0] = match[0].slice(0, excess);
          match[2] = unquoted.slice(0, excess);
        } // Return only captures needed by the pseudo filter method (type and argument)


        return match.slice(0, 3);
      }
    },
    filter: {
      TAG: function TAG(nodeNameSelector) {
        var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
        return nodeNameSelector === '*' ? function () {
          return true;
        } : function (elem) {
          return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
        };
      },
      CLASS: function CLASS(className) {
        var pattern = classCache["".concat(className, " ")];
        return pattern || (pattern = new RegExp("(^|".concat(whitespace, ")").concat(className, "(").concat(whitespace, "|$)"))) && classCache(className, function (elem) {
          return pattern.test(typeof elem.className === 'string' && elem.className || typeof elem.getAttribute !== 'undefined' && elem.getAttribute('class') || '');
        });
      },
      ATTR: function ATTR(name, operator, check) {
        return function (elem) {
          var result = Sizzle.attr(elem, name);

          if (result == null) {
            return operator === '!=';
          }

          if (!operator) {
            return true;
          }

          result += '';
          return operator === '=' ? result === check : operator === '!=' ? result !== check : operator === '^=' ? check && result.indexOf(check) === 0 : operator === '*=' ? check && result.indexOf(check) > -1 : operator === '$=' ? check && result.slice(-check.length) === check : operator === '~=' ? " ".concat(result.replace(rwhitespace, ' '), " ").indexOf(check) > -1 : operator === '|=' ? result === check || result.slice(0, check.length + 1) === "".concat(check, "-") : false;
        };
      },
      CHILD: function CHILD(type, what, argument, first, last) {
        var simple = type.slice(0, 3) !== 'nth';
        var forward = type.slice(-4) !== 'last';
        var ofType = what === 'of-type';
        return first === 1 && last === 0 // Shortcut for :nth-*(n)
        ? function (elem) {
          return !!elem.parentNode;
        } : function (elem, context, xml) {
          var cache;
          var uniqueCache;
          var outerCache;
          var node;
          var nodeIndex;
          var start;
          var dir = simple !== forward ? 'nextSibling' : 'previousSibling';
          var parent = elem.parentNode;
          var name = ofType && elem.nodeName.toLowerCase();
          var useCache = !xml && !ofType;
          var diff = false;

          if (parent) {
            // :(first|last|only)-(child|of-type)
            if (simple) {
              while (dir) {
                node = elem;

                while (node = node[dir]) {
                  if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {
                    return false;
                  }
                } // Reverse direction for :only-* (if we haven't yet done so)


                start = dir = type === 'only' && !start && 'nextSibling';
              }

              return true;
            }

            start = [forward ? parent.firstChild : parent.lastChild]; // non-xml :nth-child(...) stores cache data on `parent`

            if (forward && useCache) {
              // Seek `elem` from a previously-cached index
              // ...in a gzip-friendly way
              node = parent;
              outerCache = node[expando] || (node[expando] = {}); // Support: IE <9 only
              // Defend against cloned attroperties (jQuery gh-1709)

              uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});
              cache = uniqueCache[type] || [];
              nodeIndex = cache[0] === dirruns && cache[1];
              diff = nodeIndex && cache[2];
              node = nodeIndex && parent.childNodes[nodeIndex];

              while (node = ++nodeIndex && node && node[dir] // Fallback to seeking `elem` from the start
              || (diff = nodeIndex = 0) || start.pop()) {
                // When found, cache indexes on `parent` and break
                if (node.nodeType === 1 && ++diff && node === elem) {
                  uniqueCache[type] = [dirruns, nodeIndex, diff];
                  break;
                }
              }
            } else {
              // Use previously-cached element index if available
              if (useCache) {
                // ...in a gzip-friendly way
                node = elem;
                outerCache = node[expando] || (node[expando] = {}); // Support: IE <9 only
                // Defend against cloned attroperties (jQuery gh-1709)

                uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});
                cache = uniqueCache[type] || [];
                nodeIndex = cache[0] === dirruns && cache[1];
                diff = nodeIndex;
              } // xml :nth-child(...)
              // or :nth-last-child(...) or :nth(-last)?-of-type(...)


              if (diff === false) {
                // Use the same loop as above to seek `elem` from the start
                while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {
                  if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {
                    // Cache the index of each encountered element
                    if (useCache) {
                      outerCache = node[expando] || (node[expando] = {}); // Support: IE <9 only
                      // Defend against cloned attroperties (jQuery gh-1709)

                      uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});
                      uniqueCache[type] = [dirruns, diff];
                    }

                    if (node === elem) {
                      break;
                    }
                  }
                }
              }
            } // Incorporate the offset, then check against cycle size


            diff -= last;
            return diff === first || diff % first === 0 && diff / first >= 0;
          }
        };
      },
      PSEUDO: function PSEUDO(pseudo, argument) {
        // pseudo-class names are case-insensitive
        // http://www.w3.org/TR/selectors/#pseudo-classes
        // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
        // Remember that setFilters inherits from pseudos
        var args;
        var fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: ".concat(pseudo)); // The user may use createPseudo to indicate that
        // arguments are needed to create the filter function
        // just as Sizzle does

        if (fn[expando]) {
          return fn(argument);
        } // But maintain support for old signatures


        if (fn.length > 1) {
          args = [pseudo, pseudo, '', argument];
          return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function (seed, matches) {
            var idx;
            var matched = fn(seed, argument);
            var i = matched.length;

            while (i--) {
              idx = indexOf(seed, matched[i]);
              seed[idx] = !(matches[idx] = matched[i]);
            }
          }) : function (elem) {
            return fn(elem, 0, args);
          };
        }

        return fn;
      }
    },
    pseudos: {
      // Potentially complex pseudos
      not: markFunction(function (selector) {
        // Trim the selector passed to compile
        // to avoid treating leading and trailing
        // spaces as combinators
        var input = [];
        var results = [];
        var matcher = compile(selector.replace(rtrim, '$1'));
        return matcher[expando] ? markFunction(function (seed, matches, context, xml) {
          var elem;
          var unmatched = matcher(seed, null, xml, []);
          var i = seed.length; // Match elements unmatched by `matcher`

          while (i--) {
            if (elem = unmatched[i]) {
              seed[i] = !(matches[i] = elem);
            }
          }
        }) : function (elem, context, xml) {
          input[0] = elem;
          matcher(input, null, xml, results); // Don't keep the element (issue #299)

          input[0] = null;
          return !results.pop();
        };
      }),
      has: markFunction(function (selector) {
        return function (elem) {
          return Sizzle(selector, elem).length > 0;
        };
      }),
      contains: markFunction(function (text) {
        text = text.replace(runescape, funescape);
        return function (elem) {
          return (elem.textContent || getText(elem)).indexOf(text) > -1;
        };
      }),
      // "Whether an element is represented by a :lang() selector
      // is based solely on the element's language value
      // being equal to the identifier C,
      // or beginning with the identifier C immediately followed by "-".
      // The matching of C against the element's language value is performed case-insensitively.
      // The identifier C does not have to be a valid language name."
      // http://www.w3.org/TR/selectors/#lang-pseudo
      lang: markFunction(function (lang) {
        // lang value must be a valid identifier
        if (!ridentifier.test(lang || '')) {
          Sizzle.error("unsupported lang: ".concat(lang));
        }

        lang = lang.replace(runescape, funescape).toLowerCase();
        return function (elem) {
          var elemLang;

          do {
            if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute('xml:lang') || elem.getAttribute('lang')) {
              elemLang = elemLang.toLowerCase();
              return elemLang === lang || elemLang.indexOf("".concat(lang, "-")) === 0;
            }
          } while ((elem = elem.parentNode) && elem.nodeType === 1);

          return false;
        };
      }),
      // Miscellaneous
      target: function target(elem) {
        var hash = window.location && window.location.hash;
        return hash && hash.slice(1) === elem.id;
      },
      root: function root(elem) {
        return elem === docElem;
      },
      focus: function focus(elem) {
        return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
      },
      // Boolean properties
      enabled: createDisabledPseudo(false),
      disabled: createDisabledPseudo(true),
      checked: function checked(elem) {
        // In CSS3, :checked should return both checked and selected elements
        // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
        var nodeName = elem.nodeName.toLowerCase();
        return nodeName === 'input' && !!elem.checked || nodeName === 'option' && !!elem.selected;
      },
      selected: function selected(elem) {
        // Accessing this property makes selected-by-default
        // options in Safari work properly
        if (elem.parentNode) {
          elem.parentNode.selectedIndex;
        }

        return elem.selected === true;
      },
      // Contents
      empty: function empty(elem) {
        // http://www.w3.org/TR/selectors/#empty-pseudo
        // :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
        //   but not by others (comment: 8; processing instruction: 7; etc.)
        // nodeType < 6 works because attributes (2) do not appear as children
        for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
          if (elem.nodeType < 6) {
            return false;
          }
        }

        return true;
      },
      parent: function parent(elem) {
        return !Expr.pseudos.empty(elem);
      },
      // Element/input types
      header: function header(elem) {
        return rheader.test(elem.nodeName);
      },
      input: function input(elem) {
        return rinputs.test(elem.nodeName);
      },
      button: function button(elem) {
        var name = elem.nodeName.toLowerCase();
        return name === 'input' && elem.type === 'button' || name === 'button';
      },
      text: function text(elem) {
        var attr;
        return elem.nodeName.toLowerCase() === 'input' && elem.type === 'text' // Support: IE<8
        // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
        && ((attr = elem.getAttribute('type')) == null || attr.toLowerCase() === 'text');
      },
      // Position-in-collection
      first: createPositionalPseudo(function () {
        return [0];
      }),
      last: createPositionalPseudo(function (matchIndexes, length) {
        return [length - 1];
      }),
      eq: createPositionalPseudo(function (matchIndexes, length, argument) {
        return [argument < 0 ? argument + length : argument];
      }),
      even: createPositionalPseudo(function (matchIndexes, length) {
        var i = 0;

        for (; i < length; i += 2) {
          matchIndexes.push(i);
        }

        return matchIndexes;
      }),
      odd: createPositionalPseudo(function (matchIndexes, length) {
        var i = 1;

        for (; i < length; i += 2) {
          matchIndexes.push(i);
        }

        return matchIndexes;
      }),
      lt: createPositionalPseudo(function (matchIndexes, length, argument) {
        var i = argument < 0 ? argument + length : argument > length ? length : argument;

        for (; --i >= 0;) {
          matchIndexes.push(i);
        }

        return matchIndexes;
      }),
      gt: createPositionalPseudo(function (matchIndexes, length, argument) {
        var i = argument < 0 ? argument + length : argument;

        for (; ++i < length;) {
          matchIndexes.push(i);
        }

        return matchIndexes;
      })
    }
  };
  Expr.pseudos.nth = Expr.pseudos.eq; // Add button/input type pseudos

  for (i in {
    radio: true,
    checkbox: true,
    file: true,
    password: true,
    image: true
  }) {
    Expr.pseudos[i] = createInputPseudo(i);
  }

  for (i in {
    submit: true,
    reset: true
  }) {
    Expr.pseudos[i] = createButtonPseudo(i);
  } // Easy API for creating new setFilters


  function setFilters() {}

  setFilters.prototype = Expr.filters = Expr.pseudos;
  Expr.setFilters = new setFilters();

  tokenize = Sizzle.tokenize = function (selector, parseOnly) {
    var matched;
    var match;
    var tokens;
    var type;
    var soFar;
    var groups;
    var preFilters;
    var cached = tokenCache["".concat(selector, " ")];

    if (cached) {
      return parseOnly ? 0 : cached.slice(0);
    }

    soFar = selector;
    groups = [];
    preFilters = Expr.preFilter;

    while (soFar) {
      // Comma and first run
      if (!matched || (match = rcomma.exec(soFar))) {
        if (match) {
          // Don't consume trailing commas as valid
          soFar = soFar.slice(match[0].length) || soFar;
        }

        groups.push(tokens = []);
      }

      matched = false; // Combinators

      if (match = rcombinators.exec(soFar)) {
        matched = match.shift();
        tokens.push({
          value: matched,
          // Cast descendant combinators to space
          type: match[0].replace(rtrim, ' ')
        });
        soFar = soFar.slice(matched.length);
      } // Filters


      for (type in Expr.filter) {
        if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
          matched = match.shift();
          tokens.push({
            value: matched,
            type: type,
            matches: match
          });
          soFar = soFar.slice(matched.length);
        }
      }

      if (!matched) {
        break;
      }
    } // Return the length of the invalid excess
    // if we're just parsing
    // Otherwise, throw an error or return tokens


    return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) // Cache the tokens
    : tokenCache(selector, groups).slice(0);
  };

  function toSelector(tokens) {
    var i = 0;
    var len = tokens.length;
    var selector = '';

    for (; i < len; i++) {
      selector += tokens[i].value;
    }

    return selector;
  }

  function addCombinator(matcher, combinator, base) {
    var dir = combinator.dir;
    var skip = combinator.next;
    var key = skip || dir;
    var checkNonElements = base && key === 'parentNode';
    var doneName = done++;
    return combinator.first // Check against closest ancestor/preceding element
    ? function (elem, context, xml) {
      while (elem = elem[dir]) {
        if (elem.nodeType === 1 || checkNonElements) {
          return matcher(elem, context, xml);
        }
      }

      return false;
    } // Check against all ancestor/preceding elements
    : function (elem, context, xml) {
      var oldCache;
      var uniqueCache;
      var outerCache;
      var newCache = [dirruns, doneName]; // We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching

      if (xml) {
        while (elem = elem[dir]) {
          if (elem.nodeType === 1 || checkNonElements) {
            if (matcher(elem, context, xml)) {
              return true;
            }
          }
        }
      } else {
        while (elem = elem[dir]) {
          if (elem.nodeType === 1 || checkNonElements) {
            outerCache = elem[expando] || (elem[expando] = {}); // Support: IE <9 only
            // Defend against cloned attroperties (jQuery gh-1709)

            uniqueCache = outerCache[elem.uniqueID] || (outerCache[elem.uniqueID] = {});

            if (skip && skip === elem.nodeName.toLowerCase()) {
              elem = elem[dir] || elem;
            } else if ((oldCache = uniqueCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName) {
              // Assign to newCache so results back-propagate to previous elements
              return newCache[2] = oldCache[2];
            } else {
              // Reuse newcache so results back-propagate to previous elements
              uniqueCache[key] = newCache; // A match means we're done; a fail means we have to keep checking

              if (newCache[2] = matcher(elem, context, xml)) {
                return true;
              }
            }
          }
        }
      }

      return false;
    };
  }

  function elementMatcher(matchers) {
    return matchers.length > 1 ? function (elem, context, xml) {
      var i = matchers.length;

      while (i--) {
        if (!matchers[i](elem, context, xml)) {
          return false;
        }
      }

      return true;
    } : matchers[0];
  }

  function multipleContexts(selector, contexts, results) {
    var i = 0;
    var len = contexts.length;

    for (; i < len; i++) {
      Sizzle(selector, contexts[i], results);
    }

    return results;
  }

  function condense(unmatched, map, filter, context, xml) {
    var elem;
    var newUnmatched = [];
    var i = 0;
    var len = unmatched.length;
    var mapped = map != null;

    for (; i < len; i++) {
      if (elem = unmatched[i]) {
        if (!filter || filter(elem, context, xml)) {
          newUnmatched.push(elem);

          if (mapped) {
            map.push(i);
          }
        }
      }
    }

    return newUnmatched;
  }

  function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
    if (postFilter && !postFilter[expando]) {
      postFilter = setMatcher(postFilter);
    }

    if (postFinder && !postFinder[expando]) {
      postFinder = setMatcher(postFinder, postSelector);
    }

    return markFunction(function (seed, results, context, xml) {
      var temp;
      var i;
      var elem;
      var preMap = [];
      var postMap = [];
      var preexisting = results.length; // Get initial elements from seed or context

      var elems = seed || multipleContexts(selector || '*', context.nodeType ? [context] : context, []); // Prefilter to get matcher input, preserving a map for seed-results synchronization

      var matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems;
      var matcherOut = matcher // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
      ? postFinder || (seed ? preFilter : preexisting || postFilter) // ...intermediate processing is necessary
      ? [] // ...otherwise use results directly
      : results : matcherIn; // Find primary matches

      if (matcher) {
        matcher(matcherIn, matcherOut, context, xml);
      } // Apply postFilter


      if (postFilter) {
        temp = condense(matcherOut, postMap);
        postFilter(temp, [], context, xml); // Un-match failing elements by moving them back to matcherIn

        i = temp.length;

        while (i--) {
          if (elem = temp[i]) {
            matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
          }
        }
      }

      if (seed) {
        if (postFinder || preFilter) {
          if (postFinder) {
            // Get the final matcherOut by condensing this intermediate into postFinder contexts
            temp = [];
            i = matcherOut.length;

            while (i--) {
              if (elem = matcherOut[i]) {
                // Restore matcherIn since elem is not yet a final match
                temp.push(matcherIn[i] = elem);
              }
            }

            postFinder(null, matcherOut = [], temp, xml);
          } // Move matched elements from seed to results to keep them synchronized


          i = matcherOut.length;

          while (i--) {
            if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf(seed, elem) : preMap[i]) > -1) {
              seed[temp] = !(results[temp] = elem);
            }
          }
        } // Add elements to results, through postFinder if defined

      } else {
        matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);

        if (postFinder) {
          postFinder(null, results, matcherOut, xml);
        } else {
          push.apply(results, matcherOut);
        }
      }
    });
  }

  function matcherFromTokens(tokens) {
    var checkContext;
    var matcher;
    var j;
    var len = tokens.length;
    var leadingRelative = Expr.relative[tokens[0].type];
    var implicitRelative = leadingRelative || Expr.relative[' '];
    var i = leadingRelative ? 1 : 0; // The foundational matcher ensures that elements are reachable from top-level context(s)

    var matchContext = addCombinator(function (elem) {
      return elem === checkContext;
    }, implicitRelative, true);
    var matchAnyContext = addCombinator(function (elem) {
      return indexOf(checkContext, elem) > -1;
    }, implicitRelative, true);
    var matchers = [function (elem, context, xml) {
      var ret = !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml)); // Avoid hanging onto element (issue #299)

      checkContext = null;
      return ret;
    }];

    for (; i < len; i++) {
      if (matcher = Expr.relative[tokens[i].type]) {
        matchers = [addCombinator(elementMatcher(matchers), matcher)];
      } else {
        matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches); // Return special upon seeing a positional matcher

        if (matcher[expando]) {
          // Find the next relative operator (if any) for proper handling
          j = ++i;

          for (; j < len; j++) {
            if (Expr.relative[tokens[j].type]) {
              break;
            }
          }

          return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector( // If the preceding token was a descendant combinator, insert an implicit any-element `*`
          tokens.slice(0, i - 1).concat({
            value: tokens[i - 2].type === ' ' ? '*' : ''
          })).replace(rtrim, '$1'), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
        }

        matchers.push(matcher);
      }
    }

    return elementMatcher(matchers);
  }

  function matcherFromGroupMatchers(elementMatchers, setMatchers) {
    var bySet = setMatchers.length > 0;
    var byElement = elementMatchers.length > 0;

    var superMatcher = function superMatcher(seed, context, xml, results, outermost) {
      var elem;
      var j;
      var matcher;
      var matchedCount = 0;
      var i = '0';
      var unmatched = seed && [];
      var setMatched = [];
      var contextBackup = outermostContext; // We must always have either seed elements or outermost context

      var elems = seed || byElement && Expr.find.TAG('*', outermost); // Use integer dirruns iff this is the outermost matcher

      var dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1;
      var len = elems.length;

      if (outermost) {
        outermostContext = context === document || context || outermost;
      } // Add elements passing elementMatchers directly to results
      // Support: IE<9, Safari
      // Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id


      for (; i !== len && (elem = elems[i]) != null; i++) {
        if (byElement && elem) {
          j = 0;

          if (!context && elem.ownerDocument !== document) {
            setDocument(elem);
            xml = !documentIsHTML;
          }

          while (matcher = elementMatchers[j++]) {
            if (matcher(elem, context || document, xml)) {
              results.push(elem);
              break;
            }
          }

          if (outermost) {
            dirruns = dirrunsUnique;
          }
        } // Track unmatched elements for set filters


        if (bySet) {
          // They will have gone through all possible matchers
          if (elem = !matcher && elem) {
            matchedCount--;
          } // Lengthen the array for every element, matched or not


          if (seed) {
            unmatched.push(elem);
          }
        }
      } // `i` is now the count of elements visited above, and adding it to `matchedCount`
      // makes the latter nonnegative.


      matchedCount += i; // Apply set filters to unmatched elements
      // NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
      // equals `i`), unless we didn't visit _any_ elements in the above loop because we have
      // no element matchers and no seed.
      // Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
      // case, which will result in a "00" `matchedCount` that differs from `i` but is also
      // numerically zero.

      if (bySet && i !== matchedCount) {
        j = 0;

        while (matcher = setMatchers[j++]) {
          matcher(unmatched, setMatched, context, xml);
        }

        if (seed) {
          // Reintegrate element matches to eliminate the need for sorting
          if (matchedCount > 0) {
            while (i--) {
              if (!(unmatched[i] || setMatched[i])) {
                setMatched[i] = pop.call(results);
              }
            }
          } // Discard index placeholder values to get only actual matches


          setMatched = condense(setMatched);
        } // Add matches to results


        push.apply(results, setMatched); // Seedless set matches succeeding multiple successful matchers stipulate sorting

        if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
          Sizzle.uniqueSort(results);
        }
      } // Override manipulation of globals by nested matchers


      if (outermost) {
        dirruns = dirrunsUnique;
        outermostContext = contextBackup;
      }

      return unmatched;
    };

    return bySet ? markFunction(superMatcher) : superMatcher;
  }

  compile = Sizzle.compile = function (selector, match
  /* Internal Use Only */
  ) {
    var i;
    var setMatchers = [];
    var elementMatchers = [];
    var cached = compilerCache["".concat(selector, " ")];

    if (!cached) {
      // Generate a function of recursive functions that can be used to check each element
      if (!match) {
        match = tokenize(selector);
      }

      i = match.length;

      while (i--) {
        cached = matcherFromTokens(match[i]);

        if (cached[expando]) {
          setMatchers.push(cached);
        } else {
          elementMatchers.push(cached);
        }
      } // Cache the compiled function


      cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers)); // Save selector and tokenization

      cached.selector = selector;
    }

    return cached;
  };
  /**
  * A low-level selection function that works with Sizzle's compiled
  *  selector functions
  * @param {String|Function} selector A selector or a pre-compiled
  *  selector function built with Sizzle.compile
  * @param {Element} context
  * @param {Array} [results]
  * @param {Array} [seed] A set of elements to match against
  */


  select = Sizzle.select = function (selector, context, results, seed) {
    var i;
    var tokens;
    var token;
    var type;
    var find;
    var compiled = typeof selector === 'function' && selector;
    var match = !seed && tokenize(selector = compiled.selector || selector);
    results = results || []; // Try to minimize operations if there is only one selector in the list and no seed
    // (the latter of which guarantees us context)

    if (match.length === 1) {
      // Reduce context if the leading compound selector is an ID
      tokens = match[0] = match[0].slice(0);

      if (tokens.length > 2 && (token = tokens[0]).type === 'ID' && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
        context = (Expr.find.ID(token.matches[0].replace(runescape, funescape), context) || [])[0];

        if (!context) {
          return results; // Precompiled matchers will still verify ancestry, so step up a level
        }

        if (compiled) {
          context = context.parentNode;
        }

        selector = selector.slice(tokens.shift().value.length);
      } // Fetch a seed set for right-to-left matching


      i = matchExpr.needsContext.test(selector) ? 0 : tokens.length;

      while (i--) {
        token = tokens[i]; // Abort if we hit a combinator

        if (Expr.relative[type = token.type]) {
          break;
        }

        if (find = Expr.find[type]) {
          // Search, expanding context for leading sibling combinators
          if (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context)) {
            // If seed is empty or no tokens remain, we can return early
            tokens.splice(i, 1);
            selector = seed.length && toSelector(tokens);

            if (!selector) {
              push.apply(results, seed);
              return results;
            }

            break;
          }
        }
      }
    } // Compile and execute a filtering function if one is not provided
    // Provide `match` to avoid retokenization if we modified the selector above


    (compiled || compile(selector, match))(seed, context, !documentIsHTML, results, !context || rsibling.test(selector) && testContext(context.parentNode) || context);
    return results;
  }; // One-time assignments
  // Sort stability


  support.sortStable = expando.split('').sort(sortOrder).join('') === expando; // Support: Chrome 14-35+
  // Always assume duplicates if they aren't passed to the comparison function

  support.detectDuplicates = !!hasDuplicate; // Initialize against the default document

  setDocument(); // Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
  // Detached nodes confoundingly follow *each other*

  support.sortDetached = assert(function (el) {
    return (// Should return 1, but returns 4 (following)
      el.compareDocumentPosition(document.createElement('fieldset')) & 1
    );
  }); // Support: IE<8
  // Prevent attribute/property "interpolation"
  // https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx

  if (!assert(function (el) {
    el.innerHTML = "<a href='#'></a>";
    return el.firstChild.getAttribute('href') === '#';
  })) {
    addHandle('type|href|height|width', function (elem, name, isXML) {
      if (!isXML) {
        return elem.getAttribute(name, name.toLowerCase() === 'type' ? 1 : 2);
      }
    });
  } // Support: IE<9
  // Use defaultValue in place of getAttribute("value")


  if (!support.attributes || !assert(function (el) {
    el.innerHTML = '<input/>';
    el.firstChild.setAttribute('value', '');
    return el.firstChild.getAttribute('value') === '';
  })) {
    addHandle('value', function (elem, name, isXML) {
      if (!isXML && elem.nodeName.toLowerCase() === 'input') {
        return elem.defaultValue;
      }
    });
  } // Support: IE<9
  // Use getAttributeNode to fetch booleans when getAttribute lies


  if (!assert(function (el) {
    return el.getAttribute('disabled') == null;
  })) {
    addHandle(booleans, function (elem, name, isXML) {
      var val;

      if (!isXML) {
        return elem[name] === true ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
      }
    });
  }

  return Sizzle;
}(window);

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors; // Deprecated

jQuery.expr[':'] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;

var dir = function dir(elem, _dir, until) {
  var matched = [];
  var truncate = until !== undefined;

  while ((elem = elem[_dir]) && elem.nodeType !== 9) {
    if (elem.nodeType === 1) {
      if (truncate && jQuery(elem).is(until)) {
        break;
      }

      matched.push(elem);
    }
  }

  return matched;
};

var _siblings = function siblings(n, elem) {
  var matched = [];

  for (; n; n = n.nextSibling) {
    if (n.nodeType === 1 && n !== elem) {
      matched.push(n);
    }
  }

  return matched;
};

var rneedsContext = jQuery.expr.match.needsContext;

function nodeName(elem, name) {
  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
}

var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i; // Implement the identical functionality for filter and not

function winnow(elements, qualifier, not) {
  if (isFunction(qualifier)) {
    return jQuery.grep(elements, function (elem, i) {
      return !!qualifier.call(elem, i, elem) !== not;
    });
  } // Single element


  if (qualifier.nodeType) {
    return jQuery.grep(elements, function (elem) {
      return elem === qualifier !== not;
    });
  } // Arraylike of elements (jQuery, arguments, Array)


  if (typeof qualifier !== 'string') {
    return jQuery.grep(elements, function (elem) {
      return indexOf.call(qualifier, elem) > -1 !== not;
    });
  } // Filtered directly for both simple and complex selectors


  return jQuery.filter(qualifier, elements, not);
}

jQuery.filter = function (expr, elems, not) {
  var elem = elems[0];

  if (not) {
    expr = ":not(".concat(expr, ")");
  }

  if (elems.length === 1 && elem.nodeType === 1) {
    return jQuery.find.matchesSelector(elem, expr) ? [elem] : [];
  }

  return jQuery.find.matches(expr, jQuery.grep(elems, function (elem) {
    return elem.nodeType === 1;
  }));
};

jQuery.fn.extend({
  find: function find(selector) {
    var i;
    var ret;
    var len = this.length;
    var self = this;

    if (typeof selector !== 'string') {
      return this.pushStack(jQuery(selector).filter(function () {
        for (i = 0; i < len; i++) {
          if (jQuery.contains(self[i], this)) {
            return true;
          }
        }
      }));
    }

    ret = this.pushStack([]);

    for (i = 0; i < len; i++) {
      jQuery.find(selector, self[i], ret);
    }

    return len > 1 ? jQuery.uniqueSort(ret) : ret;
  },
  filter: function filter(selector) {
    return this.pushStack(winnow(this, selector || [], false));
  },
  not: function not(selector) {
    return this.pushStack(winnow(this, selector || [], true));
  },
  is: function is(selector) {
    return !!winnow(this, // If this is a positional/relative selector, check membership in the returned set
    // so $("p:first").is("p:last") won't return true for a doc with two "p".
    typeof selector === 'string' && rneedsContext.test(selector) ? jQuery(selector) : selector || [], false).length;
  }
}); // Initialize a jQuery object
// A central reference to the root jQuery(document)

var rootjQuery; // A simple way to check for HTML strings
// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
// Strict HTML recognition (#11290: must start with <)
// Shortcut simple #id case for speed

var rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;

var init = jQuery.fn.init = function (selector, context, root) {
  var match;
  var elem; // HANDLE: $(""), $(null), $(undefined), $(false)

  if (!selector) {
    return this;
  } // Method init() accepts an alternate rootjQuery
  // so migrate can support jQuery.sub (gh-2101)


  root = root || rootjQuery; // Handle HTML strings

  if (typeof selector === 'string') {
    if (selector[0] === '<' && selector[selector.length - 1] === '>' && selector.length >= 3) {
      // Assume that strings that start and end with <> are HTML and skip the regex check
      match = [null, selector, null];
    } else {
      match = rquickExpr.exec(selector);
    } // Match html or make sure no context is specified for #id


    if (match && (match[1] || !context)) {
      // HANDLE: $(html) -> $(array)
      if (match[1]) {
        context = context instanceof jQuery ? context[0] : context; // Option to run scripts is true for back-compat
        // Intentionally let the error be thrown if parseHTML is not present

        jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document$1, true)); // HANDLE: $(html, props)

        if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
          for (match in context) {
            // Properties of context are called as methods if possible
            if (isFunction(this[match])) {
              this[match](context[match]); // ...and otherwise set as attributes
            } else {
              this.attr(match, context[match]);
            }
          }
        }

        return this; // HANDLE: $(#id)
      }

      elem = document$1.getElementById(match[2]);

      if (elem) {
        // Inject the element directly into the jQuery object
        this[0] = elem;
        this.length = 1;
      }

      return this; // HANDLE: $(expr, $(...))
    }

    if (!context || context.jquery) {
      return (context || root).find(selector); // HANDLE: $(expr, context)
      // (which is just equivalent to: $(context).find(expr)
    }

    return this.constructor(context).find(selector); // HANDLE: $(DOMElement)
  }

  if (selector.nodeType) {
    this[0] = selector;
    this.length = 1;
    return this; // HANDLE: $(function)
    // Shortcut for document ready
  }

  if (isFunction(selector)) {
    return root.ready !== undefined ? root.ready(selector) // Execute immediately if ready is not present
    : selector(jQuery);
  }

  return jQuery.makeArray(selector, this);
}; // Give the init function the jQuery prototype for later instantiation


init.prototype = jQuery.fn; // Initialize central reference

rootjQuery = jQuery(document$1);
var rparentsprev = /^(?:parents|prev(?:Until|All))/; // Methods guaranteed to produce a unique set when starting from a unique set

var guaranteedUnique = {
  children: true,
  contents: true,
  next: true,
  prev: true
};
jQuery.fn.extend({
  has: function has(target) {
    var targets = jQuery(target, this);
    var l = targets.length;
    return this.filter(function () {
      var i = 0;

      for (; i < l; i++) {
        if (jQuery.contains(this, targets[i])) {
          return true;
        }
      }
    });
  },
  closest: function closest(selectors, context) {
    var cur;
    var i = 0;
    var l = this.length;
    var matched = [];
    var targets = typeof selectors !== 'string' && jQuery(selectors); // Positional selectors never match, since there's no _selection_ context

    if (!rneedsContext.test(selectors)) {
      for (; i < l; i++) {
        for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {
          // Always skip document fragments
          if (cur.nodeType < 11 && (targets ? targets.index(cur) > -1 // Don't pass non-elements to Sizzle
          : cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors))) {
            matched.push(cur);
            break;
          }
        }
      }
    }

    return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
  },
  // Determine the position of an element within the set
  index: function index(elem) {
    // No argument, return index in parent
    if (!elem) {
      return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
    } // Index in selector


    if (typeof elem === 'string') {
      return indexOf.call(jQuery(elem), this[0]);
    } // Locate the position of the desired element


    return indexOf.call(this, // If it receives a jQuery object, the first element is used
    elem.jquery ? elem[0] : elem);
  },
  add: function add(selector, context) {
    return this.pushStack(jQuery.uniqueSort(jQuery.merge(this.get(), jQuery(selector, context))));
  },
  addBack: function addBack(selector) {
    return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
  }
});

function sibling(cur, dir) {
  while ((cur = cur[dir]) && cur.nodeType !== 1) {}

  return cur;
}

jQuery.each({
  parent: function parent(elem) {
    var parent = elem.parentNode;
    return parent && parent.nodeType !== 11 ? parent : null;
  },
  parents: function parents(elem) {
    return dir(elem, 'parentNode');
  },
  parentsUntil: function parentsUntil(elem, i, until) {
    return dir(elem, 'parentNode', until);
  },
  next: function next(elem) {
    return sibling(elem, 'nextSibling');
  },
  prev: function prev(elem) {
    return sibling(elem, 'previousSibling');
  },
  nextAll: function nextAll(elem) {
    return dir(elem, 'nextSibling');
  },
  prevAll: function prevAll(elem) {
    return dir(elem, 'previousSibling');
  },
  nextUntil: function nextUntil(elem, i, until) {
    return dir(elem, 'nextSibling', until);
  },
  prevUntil: function prevUntil(elem, i, until) {
    return dir(elem, 'previousSibling', until);
  },
  siblings: function siblings(elem) {
    return _siblings((elem.parentNode || {}).firstChild, elem);
  },
  children: function children(elem) {
    return _siblings(elem.firstChild);
  },
  contents: function contents(elem) {
    if (typeof elem.contentDocument !== 'undefined') {
      return elem.contentDocument;
    } // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
    // Treat the template element as a regular one in browsers that
    // don't support it.


    if (nodeName(elem, 'template')) {
      elem = elem.content || elem;
    }

    return jQuery.merge([], elem.childNodes);
  }
}, function (name, fn) {
  jQuery.fn[name] = function (until, selector) {
    var matched = jQuery.map(this, fn, until);

    if (name.slice(-5) !== 'Until') {
      selector = until;
    }

    if (selector && typeof selector === 'string') {
      matched = jQuery.filter(selector, matched);
    }

    if (this.length > 1) {
      // Remove duplicates
      if (!guaranteedUnique[name]) {
        jQuery.uniqueSort(matched);
      } // Reverse order for parents* and prev-derivatives


      if (rparentsprev.test(name)) {
        matched.reverse();
      }
    }

    return this.pushStack(matched);
  };
});
var rnothtmlwhite = /[^\x20\t\r\n\f]+/g; // Convert String-formatted options into Object-formatted ones

function createOptions(options) {
  var object = {};
  jQuery.each(options.match(rnothtmlwhite) || [], function (_, flag) {
    object[flag] = true;
  });
  return object;
}
/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */


jQuery.Callbacks = function (options) {
  // Convert options from String-formatted to Object-formatted if needed
  // (we check in cache first)
  options = typeof options === 'string' ? createOptions(options) : jQuery.extend({}, options);
  var // Flag to know if list is currently firing
  firing; // Last fire value for non-forgettable lists

  var memory; // Flag to know if list was already fired

  var _fired; // Flag to prevent firing


  var _locked; // Actual callback list


  var list = []; // Queue of execution data for repeatable lists

  var queue = []; // Index of currently firing callback (modified by add/remove as needed)

  var firingIndex = -1; // Fire callbacks

  var fire = function fire() {
    // Enforce single-firing
    _locked = _locked || options.once; // Execute callbacks for all pending executions,
    // respecting firingIndex overrides and runtime changes

    _fired = firing = true;

    for (; queue.length; firingIndex = -1) {
      memory = queue.shift();

      while (++firingIndex < list.length) {
        // Run callback and check for early termination
        if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {
          // Jump to end and forget the data so .add doesn't re-fire
          firingIndex = list.length;
          memory = false;
        }
      }
    } // Forget the data if we're done with it


    if (!options.memory) {
      memory = false;
    }

    firing = false; // Clean up if we're done firing for good

    if (_locked) {
      // Keep an empty list if we have data for future add calls
      if (memory) {
        list = []; // Otherwise, this object is spent
      } else {
        list = '';
      }
    }
  }; // Actual Callbacks object


  var self = {
    // Add a callback or a collection of callbacks to the list
    add: function add() {
      if (list) {
        // If we have memory from a past run, we should fire after adding
        if (memory && !firing) {
          firingIndex = list.length - 1;
          queue.push(memory);
        }

        (function add(args) {
          jQuery.each(args, function (_, arg) {
            if (isFunction(arg)) {
              if (!options.unique || !self.has(arg)) {
                list.push(arg);
              }
            } else if (arg && arg.length && toType(arg) !== 'string') {
              // Inspect recursively
              add(arg);
            }
          });
        })(arguments);

        if (memory && !firing) {
          fire();
        }
      }

      return this;
    },
    // Remove a callback from the list
    remove: function remove() {
      jQuery.each(arguments, function (_, arg) {
        var index;

        while ((index = jQuery.inArray(arg, list, index)) > -1) {
          list.splice(index, 1); // Handle firing indexes

          if (index <= firingIndex) {
            firingIndex--;
          }
        }
      });
      return this;
    },
    // Check if a given callback is in the list.
    // If no argument is given, return whether or not list has callbacks attached.
    has: function has(fn) {
      return fn ? jQuery.inArray(fn, list) > -1 : list.length > 0;
    },
    // Remove all callbacks from the list
    empty: function empty() {
      if (list) {
        list = [];
      }

      return this;
    },
    // Disable .fire and .add
    // Abort any current/pending executions
    // Clear all callbacks and values
    disable: function disable() {
      _locked = queue = [];
      list = memory = '';
      return this;
    },
    disabled: function disabled() {
      return !list;
    },
    // Disable .fire
    // Also disable .add unless we have memory (since it would have no effect)
    // Abort any pending executions
    lock: function lock() {
      _locked = queue = [];

      if (!memory && !firing) {
        list = memory = '';
      }

      return this;
    },
    locked: function locked() {
      return !!_locked;
    },
    // Call all callbacks with the given context and arguments
    fireWith: function fireWith(context, args) {
      if (!_locked) {
        args = args || [];
        args = [context, args.slice ? args.slice() : args];
        queue.push(args);

        if (!firing) {
          fire();
        }
      }

      return this;
    },
    // Call all the callbacks with the given arguments
    fire: function fire() {
      self.fireWith(this, arguments);
      return this;
    },
    // To know if the callbacks have already been called at least once
    fired: function fired() {
      return !!_fired;
    }
  };
  return self;
};

function Identity(v) {
  return v;
}

function Thrower(ex) {
  throw ex;
}

function adoptValue(value, resolve, reject, noValue) {
  var method;

  try {
    // Check for promise aspect first to privilege synchronous behavior
    if (value && isFunction(method = value.promise)) {
      method.call(value).done(resolve).fail(reject); // Other thenables
    } else if (value && isFunction(method = value.then)) {
      method.call(value, resolve, reject); // Other non-thenables
    } else {
      // Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
      // * false: [ value ].slice( 0 ) => resolve( value )
      // * true: [ value ].slice( 1 ) => resolve()
      resolve.apply(undefined, [value].slice(noValue));
    } // For Promises/A+, convert exceptions into rejections
    // Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
    // Deferred#then to conditionally suppress rejection.

  } catch (value) {
    // Support: Android 4.0 only
    // Strict mode functions invoked without .call/.apply get global-object context
    reject.apply(undefined, [value]);
  }
}

jQuery.extend({
  Deferred: function Deferred(func) {
    var tuples = [// action, add listener, callbacks,
    // ... .then handlers, argument index, [final state]
    ['notify', 'progress', jQuery.Callbacks('memory'), jQuery.Callbacks('memory'), 2], ['resolve', 'done', jQuery.Callbacks('once memory'), jQuery.Callbacks('once memory'), 0, 'resolved'], ['reject', 'fail', jQuery.Callbacks('once memory'), jQuery.Callbacks('once memory'), 1, 'rejected']];
    var _state = 'pending';
    var _promise = {
      state: function state() {
        return _state;
      },
      always: function always() {
        deferred.done(arguments).fail(arguments);
        return this;
      },
      "catch": function _catch(fn) {
        return _promise.then(null, fn);
      },
      // Keep pipe for back-compat
      pipe: function pipe()
      /* fnDone, fnFail, fnProgress */
      {
        var fns = arguments;
        return jQuery.Deferred(function (newDefer) {
          jQuery.each(tuples, function (i, tuple) {
            // Map tuples (progress, done, fail) to arguments (done, fail, progress)
            var fn = isFunction(fns[tuple[4]]) && fns[tuple[4]]; // deferred.progress(function() { bind to newDefer or newDefer.notify })
            // deferred.done(function() { bind to newDefer or newDefer.resolve })
            // deferred.fail(function() { bind to newDefer or newDefer.reject })

            deferred[tuple[1]](function () {
              var returned = fn && fn.apply(this, arguments);

              if (returned && isFunction(returned.promise)) {
                returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
              } else {
                newDefer["".concat(tuple[0], "With")](this, fn ? [returned] : arguments);
              }
            });
          });
          fns = null;
        }).promise();
      },
      then: function then(onFulfilled, onRejected, onProgress) {
        var maxDepth = 0;

        function resolve(depth, deferred, handler, special) {
          return function () {
            var that = this;
            var args = arguments;

            var mightThrow = function mightThrow() {
              var returned;
              var then; // Support: Promises/A+ section 2.3.3.3.3
              // https://promisesaplus.com/#point-59
              // Ignore double-resolution attempts

              if (depth < maxDepth) {
                return;
              }

              returned = handler.apply(that, args); // Support: Promises/A+ section 2.3.1
              // https://promisesaplus.com/#point-48

              if (returned === deferred.promise()) {
                throw new TypeError('Thenable self-resolution');
              } // Support: Promises/A+ sections 2.3.3.1, 3.5
              // https://promisesaplus.com/#point-54
              // https://promisesaplus.com/#point-75
              // Retrieve `then` only once


              then = returned // Support: Promises/A+ section 2.3.4
              // https://promisesaplus.com/#point-64
              // Only check objects and functions for thenability
              && (_typeof(returned) === 'object' || typeof returned === 'function') && returned.then; // Handle a returned thenable

              if (isFunction(then)) {
                // Special processors (notify) just wait for resolution
                if (special) {
                  then.call(returned, resolve(maxDepth, deferred, Identity, special), resolve(maxDepth, deferred, Thrower, special)); // Normal processors (resolve) also hook into progress
                } else {
                  // ...and disregard older resolution values
                  maxDepth++;
                  then.call(returned, resolve(maxDepth, deferred, Identity, special), resolve(maxDepth, deferred, Thrower, special), resolve(maxDepth, deferred, Identity, deferred.notifyWith));
                } // Handle all other returned values

              } else {
                // Only substitute handlers pass on context
                // and multiple values (non-spec behavior)
                if (handler !== Identity) {
                  that = undefined;
                  args = [returned];
                } // Process the value(s)
                // Default process is resolve


                (special || deferred.resolveWith)(that, args);
              }
            }; // Only normal processors (resolve) catch and reject exceptions


            var process = special ? mightThrow : function () {
              try {
                mightThrow();
              } catch (e) {
                if (jQuery.Deferred.exceptionHook) {
                  jQuery.Deferred.exceptionHook(e, process.stackTrace);
                } // Support: Promises/A+ section 2.3.3.3.4.1
                // https://promisesaplus.com/#point-61
                // Ignore post-resolution exceptions


                if (depth + 1 >= maxDepth) {
                  // Only substitute handlers pass on context
                  // and multiple values (non-spec behavior)
                  if (handler !== Thrower) {
                    that = undefined;
                    args = [e];
                  }

                  deferred.rejectWith(that, args);
                }
              }
            }; // Support: Promises/A+ section 2.3.3.3.1
            // https://promisesaplus.com/#point-57
            // Re-resolve promises immediately to dodge false rejection from
            // subsequent errors

            if (depth) {
              process();
            } else {
              // Call an optional hook to record the stack, in case of exception
              // since it's otherwise lost when execution goes async
              if (jQuery.Deferred.getStackHook) {
                process.stackTrace = jQuery.Deferred.getStackHook();
              }

              window.setTimeout(process);
            }
          };
        }

        return jQuery.Deferred(function (newDefer) {
          // progress_handlers.add( ... )
          tuples[0][3].add(resolve(0, newDefer, isFunction(onProgress) ? onProgress : Identity, newDefer.notifyWith)); // fulfilled_handlers.add( ... )

          tuples[1][3].add(resolve(0, newDefer, isFunction(onFulfilled) ? onFulfilled : Identity)); // rejected_handlers.add( ... )

          tuples[2][3].add(resolve(0, newDefer, isFunction(onRejected) ? onRejected : Thrower));
        }).promise();
      },
      // Get a promise for this deferred
      // If obj is provided, the promise aspect is added to the object
      promise: function promise(obj) {
        return obj != null ? jQuery.extend(obj, _promise) : _promise;
      }
    };
    var deferred = {}; // Add list-specific methods

    jQuery.each(tuples, function (i, tuple) {
      var list = tuple[2];
      var stateString = tuple[5]; // promise.progress = list.add
      // promise.done = list.add
      // promise.fail = list.add

      _promise[tuple[1]] = list.add; // Handle state

      if (stateString) {
        list.add(function () {
          // state = "resolved" (i.e., fulfilled)
          // state = "rejected"
          _state = stateString;
        }, // rejected_callbacks.disable
        // fulfilled_callbacks.disable
        tuples[3 - i][2].disable, // rejected_handlers.disable
        // fulfilled_handlers.disable
        tuples[3 - i][3].disable, // progress_callbacks.lock
        tuples[0][2].lock, // progress_handlers.lock
        tuples[0][3].lock);
      } // progress_handlers.fire
      // fulfilled_handlers.fire
      // rejected_handlers.fire


      list.add(tuple[3].fire); // deferred.notify = function() { deferred.notifyWith(...) }
      // deferred.resolve = function() { deferred.resolveWith(...) }
      // deferred.reject = function() { deferred.rejectWith(...) }

      deferred[tuple[0]] = function () {
        deferred["".concat(tuple[0], "With")](this === deferred ? undefined : this, arguments);
        return this;
      }; // deferred.notifyWith = list.fireWith
      // deferred.resolveWith = list.fireWith
      // deferred.rejectWith = list.fireWith


      deferred["".concat(tuple[0], "With")] = list.fireWith;
    }); // Make the deferred a promise

    _promise.promise(deferred); // Call given func if any


    if (func) {
      func.call(deferred, deferred);
    } // All done!


    return deferred;
  },
  // Deferred helper
  when: function when(singleValue) {
    var // count of uncompleted subordinates
    remaining = arguments.length; // count of unprocessed arguments

    var i = remaining; // subordinate fulfillment data

    var resolveContexts = Array(i);

    var resolveValues = _slice.call(arguments); // the master Deferred


    var master = jQuery.Deferred(); // subordinate callback factory

    var updateFunc = function updateFunc(i) {
      return function (value) {
        resolveContexts[i] = this;
        resolveValues[i] = arguments.length > 1 ? _slice.call(arguments) : value;

        if (! --remaining) {
          master.resolveWith(resolveContexts, resolveValues);
        }
      };
    }; // Single- and empty arguments are adopted like Promise.resolve


    if (remaining <= 1) {
      adoptValue(singleValue, master.done(updateFunc(i)).resolve, master.reject, !remaining); // Use .then() to unwrap secondary thenables (cf. gh-3000)

      if (master.state() === 'pending' || isFunction(resolveValues[i] && resolveValues[i].then)) {
        return master.then();
      }
    } // Multiple arguments are aggregated like Promise.all array elements


    while (i--) {
      adoptValue(resolveValues[i], updateFunc(i), master.reject);
    }

    return master.promise();
  }
}); // These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.

var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function (error, stack) {
  // Support: IE 8 - 9 only
  // Console exists when dev tools are open, which can happen at any time
  if (window.console && window.console.warn && error && rerrorNames.test(error.name)) {
    window.console.warn("jQuery.Deferred exception: ".concat(error.message), error.stack, stack);
  }
};

jQuery.readyException = function (error) {
  window.setTimeout(function () {
    throw error;
  });
}; // The deferred used on DOM ready


var readyList = jQuery.Deferred();

jQuery.fn.ready = function (fn) {
  readyList.then(fn) // Wrap jQuery.readyException in a function so that the lookup
  // happens at the time of error handling instead of callback
  // registration.
  ["catch"](function (error) {
    jQuery.readyException(error);
  });
  return this;
};

jQuery.extend({
  // Is the DOM ready to be used? Set to true once it occurs.
  isReady: false,
  // A counter to track how many items to wait for before
  // the ready event fires. See #6781
  readyWait: 1,
  // Handle when the DOM is ready
  ready: function ready(wait) {
    // Abort if there are pending holds or we're already ready
    if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
      return;
    } // Remember that the DOM is ready


    jQuery.isReady = true; // If a normal DOM Ready event fired, decrement, and wait if need be

    if (wait !== true && --jQuery.readyWait > 0) {
      return;
    } // If there are functions bound, to execute


    readyList.resolveWith(document$1, [jQuery]);
  }
});
jQuery.ready.then = readyList.then; // The ready event handler and self cleanup method

function completed() {
  document$1.removeEventListener('DOMContentLoaded', completed);
  window.removeEventListener('load', completed);
  jQuery.ready();
} // Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon


if (document$1.readyState === 'complete' || document$1.readyState !== 'loading' && !document$1.documentElement.doScroll) {
  // Handle it asynchronously to allow scripts the opportunity to delay ready
  window.setTimeout(jQuery.ready);
} else {
  // Use the handy event callback
  document$1.addEventListener('DOMContentLoaded', completed); // A fallback to window.onload, that will always work

  window.addEventListener('load', completed);
} // Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function


var access = function access(elems, fn, key, value, chainable, emptyGet, raw) {
  var i = 0;
  var len = elems.length;
  var bulk = key == null; // Sets many values

  if (toType(key) === 'object') {
    chainable = true;

    for (i in key) {
      access(elems, fn, i, key[i], true, emptyGet, raw);
    } // Sets one value

  } else if (value !== undefined) {
    chainable = true;

    if (!isFunction(value)) {
      raw = true;
    }

    if (bulk) {
      // Bulk operations run against the entire set
      if (raw) {
        fn.call(elems, value);
        fn = null; // ...except when executing function values
      } else {
        bulk = fn;

        fn = function fn(elem, key, value) {
          return bulk.call(jQuery(elem), value);
        };
      }
    }

    if (fn) {
      for (; i < len; i++) {
        fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
      }
    }
  }

  if (chainable) {
    return elems;
  } // Gets


  if (bulk) {
    return fn.call(elems);
  }

  return len ? fn(elems[0], key) : emptyGet;
}; // Matches dashed string for camelizing


var rmsPrefix = /^-ms-/;
var rdashAlpha = /-([a-z])/g; // Used by camelCase as callback to replace()

function fcamelCase(all, letter) {
  return letter.toUpperCase();
} // Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)


function camelCase(string) {
  return string.replace(rmsPrefix, 'ms-').replace(rdashAlpha, fcamelCase);
}

var acceptData = function acceptData(owner) {
  // Accepts only:
  //  - Node
  //    - Node.ELEMENT_NODE
  //    - Node.DOCUMENT_NODE
  //  - Object
  //    - Any
  return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
};

function Data() {
  this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;
Data.prototype = {
  cache: function cache(owner) {
    // Check if the owner object already has a cache
    var value = owner[this.expando]; // If not, create one

    if (!value) {
      value = {}; // We can accept data for non-element nodes in modern browsers,
      // but we should not, see #8335.
      // Always return an empty object.

      if (acceptData(owner)) {
        // If it is a node unlikely to be stringify-ed or looped over
        // use plain assignment
        if (owner.nodeType) {
          owner[this.expando] = value; // Otherwise secure it in a non-enumerable property
          // configurable must be true to allow the property to be
          // deleted when data is removed
        } else {
          Object.defineProperty(owner, this.expando, {
            value: value,
            configurable: true
          });
        }
      }
    }

    return value;
  },
  set: function set(owner, data, value) {
    var prop;
    var cache = this.cache(owner); // Handle: [ owner, key, value ] args
    // Always use camelCase key (gh-2257)

    if (typeof data === 'string') {
      cache[camelCase(data)] = value; // Handle: [ owner, { properties } ] args
    } else {
      // Copy the properties one-by-one to the cache object
      for (prop in data) {
        cache[camelCase(prop)] = data[prop];
      }
    }

    return cache;
  },
  get: function get(owner, key) {
    return key === undefined ? this.cache(owner) // Always use camelCase key (gh-2257)
    : owner[this.expando] && owner[this.expando][camelCase(key)];
  },
  access: function access(owner, key, value) {
    // In cases where either:
    //
    //   1. No key was specified
    //   2. A string key was specified, but no value provided
    //
    // Take the "read" path and allow the get method to determine
    // which value to return, respectively either:
    //
    //   1. The entire cache object
    //   2. The data stored at the key
    //
    if (key === undefined || key && typeof key === 'string' && value === undefined) {
      return this.get(owner, key);
    } // When the key is not a string, or both a key and value
    // are specified, set or extend (existing objects) with either:
    //
    //   1. An object of properties
    //   2. A key and value
    //


    this.set(owner, key, value); // Since the "set" path can have two possible entry points
    // return the expected data based on which path was taken[*]

    return value !== undefined ? value : key;
  },
  remove: function remove(owner, key) {
    var i;
    var cache = owner[this.expando];

    if (cache === undefined) {
      return;
    }

    if (key !== undefined) {
      // Support array or space separated string of keys
      if (Array.isArray(key)) {
        // If key is an array of keys...
        // We always set camelCase keys, so remove that.
        key = key.map(camelCase);
      } else {
        key = camelCase(key); // If a key with the spaces exists, use it.
        // Otherwise, create an array by matching non-whitespace

        key = key in cache ? [key] : key.match(rnothtmlwhite) || [];
      }

      i = key.length;

      while (i--) {
        delete cache[key[i]];
      }
    } // Remove the expando if there's no more data


    if (key === undefined || jQuery.isEmptyObject(cache)) {
      // Support: Chrome <=35 - 45
      // Webkit & Blink performance suffers when deleting properties
      // from DOM nodes, so set to undefined instead
      // https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
      if (owner.nodeType) {
        owner[this.expando] = undefined;
      } else {
        delete owner[this.expando];
      }
    }
  },
  hasData: function hasData(owner) {
    var cache = owner[this.expando];
    return cache !== undefined && !jQuery.isEmptyObject(cache);
  }
};
var dataPriv = new Data();
var dataUser = new Data(); //	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;
var rmultiDash = /[A-Z]/g;

function getData(data) {
  if (data === 'true') {
    return true;
  }

  if (data === 'false') {
    return false;
  }

  if (data === 'null') {
    return null;
  } // Only convert to a number if it doesn't change the string


  if (data === "".concat(+data)) {
    return +data;
  }

  if (rbrace.test(data)) {
    return JSON.parse(data);
  }

  return data;
}

function dataAttr(elem, key, data) {
  var name; // If nothing was found internally, try to fetch any
  // data from the HTML5 data-* attribute

  if (data === undefined && elem.nodeType === 1) {
    name = "data-".concat(key.replace(rmultiDash, '-$&').toLowerCase());
    data = elem.getAttribute(name);

    if (typeof data === 'string') {
      try {
        data = getData(data);
      } catch (e) {} // Make sure we set the data so it isn't changed later


      dataUser.set(elem, key, data);
    } else {
      data = undefined;
    }
  }

  return data;
}

jQuery.extend({
  hasData: function hasData(elem) {
    return dataUser.hasData(elem) || dataPriv.hasData(elem);
  },
  data: function data(elem, name, _data) {
    return dataUser.access(elem, name, _data);
  },
  removeData: function removeData(elem, name) {
    dataUser.remove(elem, name);
  },
  // TODO: Now that all calls to _data and _removeData have been replaced
  // with direct calls to dataPriv methods, these can be deprecated.
  _data: function _data(elem, name, data) {
    return dataPriv.access(elem, name, data);
  },
  _removeData: function _removeData(elem, name) {
    dataPriv.remove(elem, name);
  }
});
jQuery.fn.extend({
  data: function data(key, value) {
    var i;
    var name;
    var data;
    var elem = this[0];
    var attrs = elem && elem.attributes; // Gets all values

    if (key === undefined) {
      if (this.length) {
        data = dataUser.get(elem);

        if (elem.nodeType === 1 && !dataPriv.get(elem, 'hasDataAttrs')) {
          i = attrs.length;

          while (i--) {
            // Support: IE 11 only
            // The attrs elements can be null (#14894)
            if (attrs[i]) {
              name = attrs[i].name;

              if (name.indexOf('data-') === 0) {
                name = camelCase(name.slice(5));
                dataAttr(elem, name, data[name]);
              }
            }
          }

          dataPriv.set(elem, 'hasDataAttrs', true);
        }
      }

      return data;
    } // Sets multiple values


    if (_typeof(key) === 'object') {
      return this.each(function () {
        dataUser.set(this, key);
      });
    }

    return access(this, function (value) {
      var data; // The calling jQuery object (element matches) is not empty
      // (and therefore has an element appears at this[ 0 ]) and the
      // `value` parameter was not undefined. An empty jQuery object
      // will result in `undefined` for elem = this[ 0 ] which will
      // throw an exception if an attempt to read a data cache is made.

      if (elem && value === undefined) {
        // Attempt to get data from the cache
        // The key will always be camelCased in Data
        data = dataUser.get(elem, key);

        if (data !== undefined) {
          return data;
        } // Attempt to "discover" the data in
        // HTML5 custom data-* attrs


        data = dataAttr(elem, key);

        if (data !== undefined) {
          return data;
        } // We tried really hard, but the data doesn't exist.


        return;
      } // Set the data...


      this.each(function () {
        // We always store the camelCased key
        dataUser.set(this, key, value);
      });
    }, null, value, arguments.length > 1, null, true);
  },
  removeData: function removeData(key) {
    return this.each(function () {
      dataUser.remove(this, key);
    });
  }
});
jQuery.extend({
  queue: function queue(elem, type, data) {
    var queue;

    if (elem) {
      type = "".concat(type || 'fx', "queue");
      queue = dataPriv.get(elem, type); // Speed up dequeue by getting out quickly if this is just a lookup

      if (data) {
        if (!queue || Array.isArray(data)) {
          queue = dataPriv.access(elem, type, jQuery.makeArray(data));
        } else {
          queue.push(data);
        }
      }

      return queue || [];
    }
  },
  dequeue: function dequeue(elem, type) {
    type = type || 'fx';
    var queue = jQuery.queue(elem, type);
    var startLength = queue.length;
    var fn = queue.shift();

    var hooks = jQuery._queueHooks(elem, type);

    var next = function next() {
      jQuery.dequeue(elem, type);
    }; // If the fx queue is dequeued, always remove the progress sentinel


    if (fn === 'inprogress') {
      fn = queue.shift();
      startLength--;
    }

    if (fn) {
      // Add a progress sentinel to prevent the fx queue from being
      // automatically dequeued
      if (type === 'fx') {
        queue.unshift('inprogress');
      } // Clear up the last queue stop function


      delete hooks.stop;
      fn.call(elem, next, hooks);
    }

    if (!startLength && hooks) {
      hooks.empty.fire();
    }
  },
  // Not public - generate a queueHooks object, or return the current one
  _queueHooks: function _queueHooks(elem, type) {
    var key = "".concat(type, "queueHooks");
    return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
      empty: jQuery.Callbacks('once memory').add(function () {
        dataPriv.remove(elem, ["".concat(type, "queue"), key]);
      })
    });
  }
});
jQuery.fn.extend({
  queue: function queue(type, data) {
    var setter = 2;

    if (typeof type !== 'string') {
      data = type;
      type = 'fx';
      setter--;
    }

    if (arguments.length < setter) {
      return jQuery.queue(this[0], type);
    }

    return data === undefined ? this : this.each(function () {
      var queue = jQuery.queue(this, type, data); // Ensure a hooks for this queue

      jQuery._queueHooks(this, type);

      if (type === 'fx' && queue[0] !== 'inprogress') {
        jQuery.dequeue(this, type);
      }
    });
  },
  dequeue: function dequeue(type) {
    return this.each(function () {
      jQuery.dequeue(this, type);
    });
  },
  clearQueue: function clearQueue(type) {
    return this.queue(type || 'fx', []);
  },
  // Get a promise resolved when queues of a certain type
  // are emptied (fx is the type by default)
  promise: function promise(type, obj) {
    var tmp;
    var count = 1;
    var defer = jQuery.Deferred();
    var elements = this;
    var i = this.length;

    var resolve = function resolve() {
      if (! --count) {
        defer.resolveWith(elements, [elements]);
      }
    };

    if (typeof type !== 'string') {
      obj = type;
      type = undefined;
    }

    type = type || 'fx';

    while (i--) {
      tmp = dataPriv.get(elements[i], "".concat(type, "queueHooks"));

      if (tmp && tmp.empty) {
        count++;
        tmp.empty.add(resolve);
      }
    }

    resolve();
    return defer.promise(obj);
  }
});
var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
var rcssNum = new RegExp("^(?:([+-])=|)(".concat(pnum, ")([a-z%]*)$"), 'i');
var cssExpand = ['Top', 'Right', 'Bottom', 'Left'];
var documentElement = document$1.documentElement;

var isAttached = function isAttached(elem) {
  return jQuery.contains(elem.ownerDocument, elem);
};

var composed = {
  composed: true
}; // Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
// Check attachment across shadow DOM boundaries when possible (gh-3504)
// Support: iOS 10.0-10.2 only
// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
// leading to errors. We need to check for `getRootNode`.

if (documentElement.getRootNode) {
  isAttached = function isAttached(elem) {
    return jQuery.contains(elem.ownerDocument, elem) || elem.getRootNode(composed) === elem.ownerDocument;
  };
}

var isHiddenWithinTree = function isHiddenWithinTree(elem, el) {
  // isHiddenWithinTree might be called from jQuery#filter function;
  // in that case, element will be second argument
  elem = el || elem; // Inline style trumps all

  return elem.style.display === 'none' || elem.style.display === '' // Otherwise, check computed style
  // Support: Firefox <=43 - 45
  // Disconnected elements can have computed display: none, so first confirm that elem is
  // in the document.
  && isAttached(elem) && jQuery.css(elem, 'display') === 'none';
};

var swap = function swap(elem, options, callback, args) {
  var ret;
  var name;
  var old = {}; // Remember the old values, and insert the new ones

  for (name in options) {
    old[name] = elem.style[name];
    elem.style[name] = options[name];
  }

  ret = callback.apply(elem, args || []); // Revert the old values

  for (name in options) {
    elem.style[name] = old[name];
  }

  return ret;
};

function adjustCSS(elem, prop, valueParts, tween) {
  var adjusted;
  var scale;
  var maxIterations = 20;
  var currentValue = tween ? function () {
    return tween.cur();
  } : function () {
    return jQuery.css(elem, prop, '');
  };
  var initial = currentValue();
  var unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? '' : 'px'); // Starting value computation is required for potential unit mismatches

  var initialInUnit = elem.nodeType && (jQuery.cssNumber[prop] || unit !== 'px' && +initial) && rcssNum.exec(jQuery.css(elem, prop));

  if (initialInUnit && initialInUnit[3] !== unit) {
    // Support: Firefox <=54
    // Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
    initial /= 2; // Trust units reported by jQuery.css

    unit = unit || initialInUnit[3]; // Iteratively approximate from a nonzero starting point

    initialInUnit = +initial || 1;

    while (maxIterations--) {
      // Evaluate and update our best guess (doubling guesses that zero out).
      // Finish if the scale equals or crosses 1 (making the old*new product non-positive).
      jQuery.style(elem, prop, initialInUnit + unit);

      if ((1 - scale) * (1 - (scale = currentValue() / initial || 0.5)) <= 0) {
        maxIterations = 0;
      }

      initialInUnit /= scale;
    }

    initialInUnit *= 2;
    jQuery.style(elem, prop, initialInUnit + unit); // Make sure we update the tween properties later on

    valueParts = valueParts || [];
  }

  if (valueParts) {
    initialInUnit = +initialInUnit || +initial || 0; // Apply relative offset (+=/-=) if specified

    adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2];

    if (tween) {
      tween.unit = unit;
      tween.start = initialInUnit;
      tween.end = adjusted;
    }
  }

  return adjusted;
}

var defaultDisplayMap = {};

function getDefaultDisplay(elem) {
  var temp;
  var doc = elem.ownerDocument;
  var nodeName = elem.nodeName;
  var display = defaultDisplayMap[nodeName];

  if (display) {
    return display;
  }

  temp = doc.body.appendChild(doc.createElement(nodeName));
  display = jQuery.css(temp, 'display');
  temp.parentNode.removeChild(temp);

  if (display === 'none') {
    display = 'block';
  }

  defaultDisplayMap[nodeName] = display;
  return display;
}

function showHide(elements, show) {
  var display;
  var elem;
  var values = [];
  var index = 0;
  var length = elements.length; // Determine new display value for elements that need to change

  for (; index < length; index++) {
    elem = elements[index];

    if (!elem.style) {
      continue;
    }

    display = elem.style.display;

    if (show) {
      // Since we force visibility upon cascade-hidden elements, an immediate (and slow)
      // check is required in this first loop unless we have a nonempty display value (either
      // inline or about-to-be-restored)
      if (display === 'none') {
        values[index] = dataPriv.get(elem, 'display') || null;

        if (!values[index]) {
          elem.style.display = '';
        }
      }

      if (elem.style.display === '' && isHiddenWithinTree(elem)) {
        values[index] = getDefaultDisplay(elem);
      }
    } else if (display !== 'none') {
      values[index] = 'none'; // Remember what we're overwriting

      dataPriv.set(elem, 'display', display);
    }
  } // Set the display of the elements in a second loop to avoid constant reflow


  for (index = 0; index < length; index++) {
    if (values[index] != null) {
      elements[index].style.display = values[index];
    }
  }

  return elements;
}

jQuery.fn.extend({
  show: function show() {
    return showHide(this, true);
  },
  hide: function hide() {
    return showHide(this);
  },
  toggle: function toggle(state) {
    if (typeof state === 'boolean') {
      return state ? this.show() : this.hide();
    }

    return this.each(function () {
      if (isHiddenWithinTree(this)) {
        jQuery(this).show();
      } else {
        jQuery(this).hide();
      }
    });
  }
});
var rcheckableType = /^(?:checkbox|radio)$/i;
var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i;
var rscriptType = /^$|^module$|\/(?:java|ecma)script/i; // We have to close these tags to support XHTML (#13200)

var wrapMap = {
  // Support: IE <=9 only
  option: [1, "<select multiple='multiple'>", '</select>'],
  // XHTML parsers do not magically insert elements in the
  // same way that tag soup parsers do. So we cannot shorten
  // this by omitting <tbody> or other required elements.
  thead: [1, '<table>', '</table>'],
  col: [2, '<table><colgroup>', '</colgroup></table>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  _default: [0, '', '']
}; // Support: IE <=9 only

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

function getAll(context, tag) {
  // Support: IE <=9 - 11 only
  // Use typeof to avoid zero-argument method invocation on host objects (#15151)
  var ret;

  if (typeof context.getElementsByTagName !== 'undefined') {
    ret = context.getElementsByTagName(tag || '*');
  } else if (typeof context.querySelectorAll !== 'undefined') {
    ret = context.querySelectorAll(tag || '*');
  } else {
    ret = [];
  }

  if (tag === undefined || tag && nodeName(context, tag)) {
    return jQuery.merge([context], ret);
  }

  return ret;
} // Mark scripts as having already been evaluated


function setGlobalEval(elems, refElements) {
  var i = 0;
  var l = elems.length;

  for (; i < l; i++) {
    dataPriv.set(elems[i], 'globalEval', !refElements || dataPriv.get(refElements[i], 'globalEval'));
  }
}

var rhtml = /<|&#?\w+;/;

function buildFragment(elems, context, scripts, selection, ignored) {
  var elem;
  var tmp;
  var tag;
  var wrap;
  var attached;
  var j;
  var fragment = context.createDocumentFragment();
  var nodes = [];
  var i = 0;
  var l = elems.length;

  for (; i < l; i++) {
    elem = elems[i];

    if (elem || elem === 0) {
      // Add nodes directly
      if (toType(elem) === 'object') {
        // Support: Android <=4.0 only, PhantomJS 1 only
        // push.apply(_, arraylike) throws on ancient WebKit
        jQuery.merge(nodes, elem.nodeType ? [elem] : elem); // Convert non-html into a text node
      } else if (!rhtml.test(elem)) {
        nodes.push(context.createTextNode(elem)); // Convert html into DOM nodes
      } else {
        tmp = tmp || fragment.appendChild(context.createElement('div')); // Deserialize a standard representation

        tag = (rtagName.exec(elem) || ['', ''])[1].toLowerCase();
        wrap = wrapMap[tag] || wrapMap._default;
        tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2]; // Descend through wrappers to the right content

        j = wrap[0];

        while (j--) {
          tmp = tmp.lastChild;
        } // Support: Android <=4.0 only, PhantomJS 1 only
        // push.apply(_, arraylike) throws on ancient WebKit


        jQuery.merge(nodes, tmp.childNodes); // Remember the top-level container

        tmp = fragment.firstChild; // Ensure the created nodes are orphaned (#12392)

        tmp.textContent = '';
      }
    }
  } // Remove wrapper from fragment


  fragment.textContent = '';
  i = 0;

  while (elem = nodes[i++]) {
    // Skip elements already in the context collection (trac-4087)
    if (selection && jQuery.inArray(elem, selection) > -1) {
      if (ignored) {
        ignored.push(elem);
      }

      continue;
    }

    attached = isAttached(elem); // Append to fragment

    tmp = getAll(fragment.appendChild(elem), 'script'); // Preserve script evaluation history

    if (attached) {
      setGlobalEval(tmp);
    } // Capture executables


    if (scripts) {
      j = 0;

      while (elem = tmp[j++]) {
        if (rscriptType.test(elem.type || '')) {
          scripts.push(elem);
        }
      }
    }
  }

  return fragment;
}

(function () {
  var fragment = document$1.createDocumentFragment();
  var div = fragment.appendChild(document$1.createElement('div'));
  var input = document$1.createElement('input'); // Support: Android 4.0 - 4.3 only
  // Check state lost if the name is set (#11217)
  // Support: Windows Web Apps (WWA)
  // `name` and `type` must use .setAttribute for WWA (#14901)

  input.setAttribute('type', 'radio');
  input.setAttribute('checked', 'checked');
  input.setAttribute('name', 't');
  div.appendChild(input); // Support: Android <=4.1 only
  // Older WebKit doesn't clone checked state correctly in fragments

  support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked; // Support: IE <=11 only
  // Make sure textarea (and checkbox) defaultValue is properly cloned

  div.innerHTML = '<textarea>x</textarea>';
  support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
})();

var rkeyEvent = /^key/;
var rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/;
var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
  return true;
}

function returnFalse() {
  return false;
} // Support: IE <=9 - 11+
// focus() and blur() are asynchronous, except when they are no-op.
// So expect focus to be synchronous when the element is already active,
// and blur to be synchronous when the element is not already active.
// (focus and blur are always synchronous in other supported browsers,
// this just defines when we can count on it).


function expectSync(elem, type) {
  return elem === safeActiveElement() === (type === 'focus');
} // Support: IE <=9 only
// Accessing document.activeElement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393


function safeActiveElement() {
  try {
    return document$1.activeElement;
  } catch (err) {}
}

function _on(elem, types, selector, data, fn, one) {
  var origFn;
  var type; // Types can be a map of types/handlers

  if (_typeof(types) === 'object') {
    // ( types-Object, selector, data )
    if (typeof selector !== 'string') {
      // ( types-Object, data )
      data = data || selector;
      selector = undefined;
    }

    for (type in types) {
      _on(elem, type, selector, data, types[type], one);
    }

    return elem;
  }

  if (data == null && fn == null) {
    // ( types, fn )
    fn = selector;
    data = selector = undefined;
  } else if (fn == null) {
    if (typeof selector === 'string') {
      // ( types, selector, fn )
      fn = data;
      data = undefined;
    } else {
      // ( types, data, fn )
      fn = data;
      data = selector;
      selector = undefined;
    }
  }

  if (fn === false) {
    fn = returnFalse;
  } else if (!fn) {
    return elem;
  }

  if (one === 1) {
    origFn = fn;

    fn = function fn(event) {
      // Can use an empty set, since event contains the info
      jQuery().off(event);
      return origFn.apply(this, arguments);
    }; // Use same guid so caller can remove using origFn


    fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
  }

  return elem.each(function () {
    jQuery.event.add(this, types, fn, data, selector);
  });
}
/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */


jQuery.event = {
  global: {},
  add: function add(elem, types, handler, data, selector) {
    var handleObjIn;
    var eventHandle;
    var tmp;
    var events;
    var t;
    var handleObj;
    var special;
    var handlers;
    var type;
    var namespaces;
    var origType;
    var elemData = dataPriv.get(elem); // Don't attach events to noData or text/comment nodes (but allow plain objects)

    if (!elemData) {
      return;
    } // Caller can pass in an object of custom data in lieu of the handler


    if (handler.handler) {
      handleObjIn = handler;
      handler = handleObjIn.handler;
      selector = handleObjIn.selector;
    } // Ensure that invalid selectors throw exceptions at attach time
    // Evaluate against documentElement in case elem is a non-element node (e.g., document)


    if (selector) {
      jQuery.find.matchesSelector(documentElement, selector);
    } // Make sure that the handler has a unique ID, used to find/remove it later


    if (!handler.guid) {
      handler.guid = jQuery.guid++;
    } // Init the element's event structure and main handler, if this is the first


    if (!(events = elemData.events)) {
      events = elemData.events = {};
    }

    if (!(eventHandle = elemData.handle)) {
      eventHandle = elemData.handle = function (e) {
        // Discard the second event of a jQuery.event.trigger() and
        // when an event is called after a page has unloaded
        return typeof jQuery !== 'undefined' && jQuery.event.triggered !== e.type ? jQuery.event.dispatch.apply(elem, arguments) : undefined;
      };
    } // Handle multiple events separated by a space


    types = (types || '').match(rnothtmlwhite) || [''];
    t = types.length;

    while (t--) {
      tmp = rtypenamespace.exec(types[t]) || [];
      type = origType = tmp[1];
      namespaces = (tmp[2] || '').split('.').sort(); // There *must* be a type, no attaching namespace-only handlers

      if (!type) {
        continue;
      } // If event changes its type, use the special event handlers for the changed type


      special = jQuery.event.special[type] || {}; // If selector defined, determine special event api type, otherwise given type

      type = (selector ? special.delegateType : special.bindType) || type; // Update special based on newly reset type

      special = jQuery.event.special[type] || {}; // handleObj is passed to all event handlers

      handleObj = jQuery.extend({
        type: type,
        origType: origType,
        data: data,
        handler: handler,
        guid: handler.guid,
        selector: selector,
        needsContext: selector && jQuery.expr.match.needsContext.test(selector),
        namespace: namespaces.join('.')
      }, handleObjIn); // Init the event handler queue if we're the first

      if (!(handlers = events[type])) {
        handlers = events[type] = [];
        handlers.delegateCount = 0; // Only use addEventListener if the special events handler returns false

        if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
          if (elem.addEventListener) {
            elem.addEventListener(type, eventHandle);
          }
        }
      }

      if (special.add) {
        special.add.call(elem, handleObj);

        if (!handleObj.handler.guid) {
          handleObj.handler.guid = handler.guid;
        }
      } // Add to the element's handler list, delegates in front


      if (selector) {
        handlers.splice(handlers.delegateCount++, 0, handleObj);
      } else {
        handlers.push(handleObj);
      } // Keep track of which events have ever been used, for event optimization


      jQuery.event.global[type] = true;
    }
  },
  // Detach an event or set of events from an element
  remove: function remove(elem, types, handler, selector, mappedTypes) {
    var j;
    var origCount;
    var tmp;
    var events;
    var t;
    var handleObj;
    var special;
    var handlers;
    var type;
    var namespaces;
    var origType;
    var elemData = dataPriv.hasData(elem) && dataPriv.get(elem);

    if (!elemData || !(events = elemData.events)) {
      return;
    } // Once for each type.namespace in types; type may be omitted


    types = (types || '').match(rnothtmlwhite) || [''];
    t = types.length;

    while (t--) {
      tmp = rtypenamespace.exec(types[t]) || [];
      type = origType = tmp[1];
      namespaces = (tmp[2] || '').split('.').sort(); // Unbind all events (on this namespace, if provided) for the element

      if (!type) {
        for (type in events) {
          jQuery.event.remove(elem, type + types[t], handler, selector, true);
        }

        continue;
      }

      special = jQuery.event.special[type] || {};
      type = (selector ? special.delegateType : special.bindType) || type;
      handlers = events[type] || [];
      tmp = tmp[2] && new RegExp("(^|\\.)".concat(namespaces.join('\\.(?:.*\\.|)'), "(\\.|$)")); // Remove matching events

      origCount = j = handlers.length;

      while (j--) {
        handleObj = handlers[j];

        if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === '**' && handleObj.selector)) {
          handlers.splice(j, 1);

          if (handleObj.selector) {
            handlers.delegateCount--;
          }

          if (special.remove) {
            special.remove.call(elem, handleObj);
          }
        }
      } // Remove generic event handler if we removed something and no more handlers exist
      // (avoids potential for endless recursion during removal of special event handlers)


      if (origCount && !handlers.length) {
        if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
          jQuery.removeEvent(elem, type, elemData.handle);
        }

        delete events[type];
      }
    } // Remove data and the expando if it's no longer used


    if (jQuery.isEmptyObject(events)) {
      dataPriv.remove(elem, 'handle events');
    }
  },
  dispatch: function dispatch(nativeEvent) {
    // Make a writable jQuery.Event from the native event object
    var event = jQuery.event.fix(nativeEvent);
    var i;
    var j;
    var ret;
    var matched;
    var handleObj;
    var handlerQueue;
    var args = new Array(arguments.length);
    var handlers = (dataPriv.get(this, 'events') || {})[event.type] || [];
    var special = jQuery.event.special[event.type] || {}; // Use the fix-ed jQuery.Event rather than the (read-only) native event

    args[0] = event;

    for (i = 1; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    event.delegateTarget = this; // Call the preDispatch hook for the mapped type, and let it bail if desired

    if (special.preDispatch && special.preDispatch.call(this, event) === false) {
      return;
    } // Determine handlers


    handlerQueue = jQuery.event.handlers.call(this, event, handlers); // Run delegates first; they may want to stop propagation beneath us

    i = 0;

    while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
      event.currentTarget = matched.elem;
      j = 0;

      while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {
        // If the event is namespaced, then each handler is only invoked if it is
        // specially universal or its namespaces are a superset of the event's.
        if (!event.rnamespace || handleObj.namespace === false || event.rnamespace.test(handleObj.namespace)) {
          event.handleObj = handleObj;
          event.data = handleObj.data;
          ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);

          if (ret !== undefined) {
            if ((event.result = ret) === false) {
              event.preventDefault();
              event.stopPropagation();
            }
          }
        }
      }
    } // Call the postDispatch hook for the mapped type


    if (special.postDispatch) {
      special.postDispatch.call(this, event);
    }

    return event.result;
  },
  handlers: function handlers(event, _handlers) {
    var i;
    var handleObj;
    var sel;
    var matchedHandlers;
    var matchedSelectors;
    var handlerQueue = [];
    var delegateCount = _handlers.delegateCount;
    var cur = event.target; // Find delegate handlers

    if (delegateCount // Support: IE <=9
    // Black-hole SVG <use> instance trees (trac-13180)
    && cur.nodeType // Support: Firefox <=42
    // Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
    // https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
    // Support: IE 11 only
    // ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
    && !(event.type === 'click' && event.button >= 1)) {
      for (; cur !== this; cur = cur.parentNode || this) {
        // Don't check non-elements (#13208)
        // Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
        if (cur.nodeType === 1 && !(event.type === 'click' && cur.disabled === true)) {
          matchedHandlers = [];
          matchedSelectors = {};

          for (i = 0; i < delegateCount; i++) {
            handleObj = _handlers[i]; // Don't conflict with Object.prototype properties (#13203)

            sel = "".concat(handleObj.selector, " ");

            if (matchedSelectors[sel] === undefined) {
              matchedSelectors[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [cur]).length;
            }

            if (matchedSelectors[sel]) {
              matchedHandlers.push(handleObj);
            }
          }

          if (matchedHandlers.length) {
            handlerQueue.push({
              elem: cur,
              handlers: matchedHandlers
            });
          }
        }
      }
    } // Add the remaining (directly-bound) handlers


    cur = this;

    if (delegateCount < _handlers.length) {
      handlerQueue.push({
        elem: cur,
        handlers: _handlers.slice(delegateCount)
      });
    }

    return handlerQueue;
  },
  addProp: function addProp(name, hook) {
    Object.defineProperty(jQuery.Event.prototype, name, {
      enumerable: true,
      configurable: true,
      get: isFunction(hook) ? function () {
        if (this.originalEvent) {
          return hook(this.originalEvent);
        }
      } : function () {
        if (this.originalEvent) {
          return this.originalEvent[name];
        }
      },
      set: function set(value) {
        Object.defineProperty(this, name, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: value
        });
      }
    });
  },
  fix: function fix(originalEvent) {
    return originalEvent[jQuery.expando] ? originalEvent : new jQuery.Event(originalEvent);
  },
  special: {
    load: {
      // Prevent triggered image.load events from bubbling to window.load
      noBubble: true
    },
    click: {
      // Utilize native event to ensure correct state for checkable inputs
      setup: function setup(data) {
        // For mutual compressibility with _default, replace `this` access with a local var.
        // `|| data` is dead code meant only to preserve the variable through minification.
        var el = this || data; // Claim the first handler

        if (rcheckableType.test(el.type) && el.click && nodeName(el, 'input')) {
          // dataPriv.set( el, "click", ... )
          leverageNative(el, 'click', returnTrue);
        } // Return false to allow normal processing in the caller


        return false;
      },
      trigger: function trigger(data) {
        // For mutual compressibility with _default, replace `this` access with a local var.
        // `|| data` is dead code meant only to preserve the variable through minification.
        var el = this || data; // Force setup before triggering a click

        if (rcheckableType.test(el.type) && el.click && nodeName(el, 'input')) {
          leverageNative(el, 'click');
        } // Return non-false to allow normal event-path propagation


        return true;
      },
      // For cross-browser consistency, suppress native .click() on links
      // Also prevent it if we're currently inside a leveraged native-event stack
      _default: function _default(event) {
        var target = event.target;
        return rcheckableType.test(target.type) && target.click && nodeName(target, 'input') && dataPriv.get(target, 'click') || nodeName(target, 'a');
      }
    },
    beforeunload: {
      postDispatch: function postDispatch(event) {
        // Support: Firefox 20+
        // Firefox doesn't alert if the returnValue field is not set.
        if (event.result !== undefined && event.originalEvent) {
          event.originalEvent.returnValue = event.result;
        }
      }
    }
  }
}; // Ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.

function leverageNative(el, type, expectSync) {
  // Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
  if (!expectSync) {
    if (dataPriv.get(el, type) === undefined) {
      jQuery.event.add(el, type, returnTrue);
    }

    return;
  } // Register the controller as a special universal handler for all event namespaces


  dataPriv.set(el, type, false);
  jQuery.event.add(el, type, {
    namespace: false,
    handler: function handler(event) {
      var notAsync;
      var result;
      var saved = dataPriv.get(this, type);

      if (event.isTrigger & 1 && this[type]) {
        // Interrupt processing of the outer synthetic .trigger()ed event
        // Saved data should be false in such cases, but might be a leftover capture object
        // from an async native handler (gh-4350)
        if (!saved.length) {
          // Store arguments for use when handling the inner native event
          // There will always be at least one argument (an event object), so this array
          // will not be confused with a leftover capture object.
          saved = _slice.call(arguments);
          dataPriv.set(this, type, saved); // Trigger the native event and capture its result
          // Support: IE <=9 - 11+
          // focus() and blur() are asynchronous

          notAsync = expectSync(this, type);
          this[type]();
          result = dataPriv.get(this, type);

          if (saved !== result || notAsync) {
            dataPriv.set(this, type, false);
          } else {
            result = {};
          }

          if (saved !== result) {
            // Cancel the outer synthetic event
            event.stopImmediatePropagation();
            event.preventDefault();
            return result.value;
          } // If this is an inner synthetic event for an event with a bubbling surrogate
          // (focus or blur), assume that the surrogate already propagated from triggering the
          // native event and prevent that from happening again here.
          // This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
          // bubbling surrogate propagates *after* the non-bubbling base), but that seems
          // less bad than duplication.

        } else if ((jQuery.event.special[type] || {}).delegateType) {
          event.stopPropagation();
        } // If this is a native event triggered above, everything is now in order
        // Fire an inner synthetic event with the original arguments

      } else if (saved.length) {
        // ...and capture the result
        dataPriv.set(this, type, {
          value: jQuery.event.trigger( // Support: IE <=9 - 11+
          // Extend with the prototype to reset the above stopImmediatePropagation()
          jQuery.extend(saved[0], jQuery.Event.prototype), saved.slice(1), this)
        }); // Abort handling of the native event

        event.stopImmediatePropagation();
      }
    }
  });
}

jQuery.removeEvent = function (elem, type, handle) {
  // This "if" is needed for plain objects
  if (elem.removeEventListener) {
    elem.removeEventListener(type, handle);
  }
};

jQuery.Event = function (src, props) {
  // Allow instantiation without the 'new' keyword
  if (!(this instanceof jQuery.Event)) {
    return new jQuery.Event(src, props);
  } // Event object


  if (src && src.type) {
    this.originalEvent = src;
    this.type = src.type; // Events bubbling up the document may have been marked as prevented
    // by a handler lower down the tree; reflect the correct value.

    this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === undefined // Support: Android <=2.3 only
    && src.returnValue === false ? returnTrue : returnFalse; // Create target properties
    // Support: Safari <=6 - 7 only
    // Target should not be a text node (#504, #13143)

    this.target = src.target && src.target.nodeType === 3 ? src.target.parentNode : src.target;
    this.currentTarget = src.currentTarget;
    this.relatedTarget = src.relatedTarget; // Event type
  } else {
    this.type = src;
  } // Put explicitly provided properties onto the event object


  if (props) {
    jQuery.extend(this, props);
  } // Create a timestamp if incoming event doesn't have one


  this.timeStamp = src && src.timeStamp || Date.now(); // Mark it as fixed

  this[jQuery.expando] = true;
}; // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html


jQuery.Event.prototype = {
  constructor: jQuery.Event,
  isDefaultPrevented: returnFalse,
  isPropagationStopped: returnFalse,
  isImmediatePropagationStopped: returnFalse,
  isSimulated: false,
  preventDefault: function preventDefault() {
    var e = this.originalEvent;
    this.isDefaultPrevented = returnTrue;

    if (e && !this.isSimulated) {
      e.preventDefault();
    }
  },
  stopPropagation: function stopPropagation() {
    var e = this.originalEvent;
    this.isPropagationStopped = returnTrue;

    if (e && !this.isSimulated) {
      e.stopPropagation();
    }
  },
  stopImmediatePropagation: function stopImmediatePropagation() {
    var e = this.originalEvent;
    this.isImmediatePropagationStopped = returnTrue;

    if (e && !this.isSimulated) {
      e.stopImmediatePropagation();
    }

    this.stopPropagation();
  }
}; // Includes all common event props including KeyEvent and MouseEvent specific props

jQuery.each({
  altKey: true,
  bubbles: true,
  cancelable: true,
  changedTouches: true,
  ctrlKey: true,
  detail: true,
  eventPhase: true,
  metaKey: true,
  pageX: true,
  pageY: true,
  shiftKey: true,
  view: true,
  "char": true,
  code: true,
  charCode: true,
  key: true,
  keyCode: true,
  button: true,
  buttons: true,
  clientX: true,
  clientY: true,
  offsetX: true,
  offsetY: true,
  pointerId: true,
  pointerType: true,
  screenX: true,
  screenY: true,
  targetTouches: true,
  toElement: true,
  touches: true,
  which: function which(event) {
    var button = event.button; // Add which for key events

    if (event.which == null && rkeyEvent.test(event.type)) {
      return event.charCode != null ? event.charCode : event.keyCode;
    } // Add which for click: 1 === left; 2 === middle; 3 === right


    if (!event.which && button !== undefined && rmouseEvent.test(event.type)) {
      if (button & 1) {
        return 1;
      }

      if (button & 2) {
        return 3;
      }

      if (button & 4) {
        return 2;
      }

      return 0;
    }

    return event.which;
  }
}, jQuery.event.addProp);
jQuery.each({
  focus: 'focusin',
  blur: 'focusout'
}, function (type, delegateType) {
  jQuery.event.special[type] = {
    // Utilize native event if possible so blur/focus sequence is correct
    setup: function setup() {
      // Claim the first handler
      // dataPriv.set( this, "focus", ... )
      // dataPriv.set( this, "blur", ... )
      leverageNative(this, type, expectSync); // Return false to allow normal processing in the caller

      return false;
    },
    trigger: function trigger() {
      // Force setup before trigger
      leverageNative(this, type); // Return non-false to allow normal event-path propagation

      return true;
    },
    delegateType: delegateType
  };
}); // Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).

jQuery.each({
  mouseenter: 'mouseover',
  mouseleave: 'mouseout',
  pointerenter: 'pointerover',
  pointerleave: 'pointerout'
}, function (orig, fix) {
  jQuery.event.special[orig] = {
    delegateType: fix,
    bindType: fix,
    handle: function handle(event) {
      var ret;
      var target = this;
      var related = event.relatedTarget;
      var handleObj = event.handleObj; // For mouseenter/leave call the handler if related is outside the target.
      // NB: No relatedTarget if the mouse left/entered the browser window

      if (!related || related !== target && !jQuery.contains(target, related)) {
        event.type = handleObj.origType;
        ret = handleObj.handler.apply(this, arguments);
        event.type = fix;
      }

      return ret;
    }
  };
});
jQuery.fn.extend({
  on: function on(types, selector, data, fn) {
    return _on(this, types, selector, data, fn);
  },
  one: function one(types, selector, data, fn) {
    return _on(this, types, selector, data, fn, 1);
  },
  off: function off(types, selector, fn) {
    var handleObj;
    var type;

    if (types && types.preventDefault && types.handleObj) {
      // ( event )  dispatched jQuery.Event
      handleObj = types.handleObj;
      jQuery(types.delegateTarget).off(handleObj.namespace ? "".concat(handleObj.origType, ".").concat(handleObj.namespace) : handleObj.origType, handleObj.selector, handleObj.handler);
      return this;
    }

    if (_typeof(types) === 'object') {
      // ( types-object [, selector] )
      for (type in types) {
        this.off(type, selector, types[type]);
      }

      return this;
    }

    if (selector === false || typeof selector === 'function') {
      // ( types [, fn] )
      fn = selector;
      selector = undefined;
    }

    if (fn === false) {
      fn = returnFalse;
    }

    return this.each(function () {
      jQuery.event.remove(this, types, fn, selector);
    });
  }
});
var
/* eslint-disable max-len */
// See https://github.com/eslint/eslint/issues/3229
rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi;
/* eslint-enable */
// Support: IE <=10 - 11, Edge 12 - 13 only
// In IE/Edge using regex groups here causes severe slowdowns.
// See https://connect.microsoft.com/IE/feedback/details/1736512/

var rnoInnerhtml = /<script|<style|<link/i; // checked="checked" or checked

var rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i;
var rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g; // Prefer a tbody over its parent table for containing new rows

function manipulationTarget(elem, content) {
  if (nodeName(elem, 'table') && nodeName(content.nodeType !== 11 ? content : content.firstChild, 'tr')) {
    return jQuery(elem).children('tbody')[0] || elem;
  }

  return elem;
} // Replace/restore the type attribute of script elements for safe DOM manipulation


function disableScript(elem) {
  elem.type = "".concat(elem.getAttribute('type') !== null, "/").concat(elem.type);
  return elem;
}

function restoreScript(elem) {
  if ((elem.type || '').slice(0, 5) === 'true/') {
    elem.type = elem.type.slice(5);
  } else {
    elem.removeAttribute('type');
  }

  return elem;
}

function cloneCopyEvent(src, dest) {
  var i;
  var l;
  var type;
  var pdataOld;
  var pdataCur;
  var udataOld;
  var udataCur;
  var events;

  if (dest.nodeType !== 1) {
    return;
  } // 1. Copy private data: events, handlers, etc.


  if (dataPriv.hasData(src)) {
    pdataOld = dataPriv.access(src);
    pdataCur = dataPriv.set(dest, pdataOld);
    events = pdataOld.events;

    if (events) {
      delete pdataCur.handle;
      pdataCur.events = {};

      for (type in events) {
        for (i = 0, l = events[type].length; i < l; i++) {
          jQuery.event.add(dest, type, events[type][i]);
        }
      }
    }
  } // 2. Copy user data


  if (dataUser.hasData(src)) {
    udataOld = dataUser.access(src);
    udataCur = jQuery.extend({}, udataOld);
    dataUser.set(dest, udataCur);
  }
} // Fix IE bugs, see support tests


function fixInput(src, dest) {
  var nodeName = dest.nodeName.toLowerCase(); // Fails to persist the checked state of a cloned checkbox or radio button.

  if (nodeName === 'input' && rcheckableType.test(src.type)) {
    dest.checked = src.checked; // Fails to return the selected option to the default selected state when cloning options
  } else if (nodeName === 'input' || nodeName === 'textarea') {
    dest.defaultValue = src.defaultValue;
  }
}

function domManip(collection, args, callback, ignored) {
  // Flatten any nested arrays
  args = concat.apply([], args);
  var fragment;
  var first;
  var scripts;
  var hasScripts;
  var node;
  var doc;
  var i = 0;
  var l = collection.length;
  var iNoClone = l - 1;
  var value = args[0];
  var valueIsFunction = isFunction(value); // We can't cloneNode fragments that contain checked, in WebKit

  if (valueIsFunction || l > 1 && typeof value === 'string' && !support.checkClone && rchecked.test(value)) {
    return collection.each(function (index) {
      var self = collection.eq(index);

      if (valueIsFunction) {
        args[0] = value.call(this, index, self.html());
      }

      domManip(self, args, callback, ignored);
    });
  }

  if (l) {
    fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
    first = fragment.firstChild;

    if (fragment.childNodes.length === 1) {
      fragment = first;
    } // Require either new content or an interest in ignored elements to invoke the callback


    if (first || ignored) {
      scripts = jQuery.map(getAll(fragment, 'script'), disableScript);
      hasScripts = scripts.length; // Use the original fragment for the last item
      // instead of the first because it can end up
      // being emptied incorrectly in certain situations (#8070).

      for (; i < l; i++) {
        node = fragment;

        if (i !== iNoClone) {
          node = jQuery.clone(node, true, true); // Keep references to cloned scripts for later restoration

          if (hasScripts) {
            // Support: Android <=4.0 only, PhantomJS 1 only
            // push.apply(_, arraylike) throws on ancient WebKit
            jQuery.merge(scripts, getAll(node, 'script'));
          }
        }

        callback.call(collection[i], node, i);
      }

      if (hasScripts) {
        doc = scripts[scripts.length - 1].ownerDocument; // Reenable scripts

        jQuery.map(scripts, restoreScript); // Evaluate executable scripts on first document insertion

        for (i = 0; i < hasScripts; i++) {
          node = scripts[i];

          if (rscriptType.test(node.type || '') && !dataPriv.access(node, 'globalEval') && jQuery.contains(doc, node)) {
            if (node.src && (node.type || '').toLowerCase() !== 'module') {
              // Optional AJAX dependency, but won't run scripts if not present
              if (jQuery._evalUrl && !node.noModule) {
                jQuery._evalUrl(node.src, {
                  nonce: node.nonce || node.getAttribute('nonce')
                });
              }
            } else {
              DOMEval(node.textContent.replace(rcleanScript, ''), node, doc);
            }
          }
        }
      }
    }
  }

  return collection;
}

function _remove(elem, selector, keepData) {
  var node;
  var nodes = selector ? jQuery.filter(selector, elem) : elem;
  var i = 0;

  for (; (node = nodes[i]) != null; i++) {
    if (!keepData && node.nodeType === 1) {
      jQuery.cleanData(getAll(node));
    }

    if (node.parentNode) {
      if (keepData && isAttached(node)) {
        setGlobalEval(getAll(node, 'script'));
      }

      node.parentNode.removeChild(node);
    }
  }

  return elem;
}

jQuery.extend({
  htmlPrefilter: function htmlPrefilter(html) {
    return html.replace(rxhtmlTag, '<$1></$2>');
  },
  clone: function clone(elem, dataAndEvents, deepDataAndEvents) {
    var i;
    var l;
    var srcElements;
    var destElements;
    var clone = elem.cloneNode(true);
    var inPage = isAttached(elem); // Fix IE cloning issues

    if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
      // We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
      destElements = getAll(clone);
      srcElements = getAll(elem);

      for (i = 0, l = srcElements.length; i < l; i++) {
        fixInput(srcElements[i], destElements[i]);
      }
    } // Copy the events from the original to the clone


    if (dataAndEvents) {
      if (deepDataAndEvents) {
        srcElements = srcElements || getAll(elem);
        destElements = destElements || getAll(clone);

        for (i = 0, l = srcElements.length; i < l; i++) {
          cloneCopyEvent(srcElements[i], destElements[i]);
        }
      } else {
        cloneCopyEvent(elem, clone);
      }
    } // Preserve script evaluation history


    destElements = getAll(clone, 'script');

    if (destElements.length > 0) {
      setGlobalEval(destElements, !inPage && getAll(elem, 'script'));
    } // Return the cloned set


    return clone;
  },
  cleanData: function cleanData(elems) {
    var data;
    var elem;
    var type;
    var special = jQuery.event.special;
    var i = 0;

    for (; (elem = elems[i]) !== undefined; i++) {
      if (acceptData(elem)) {
        if (data = elem[dataPriv.expando]) {
          if (data.events) {
            for (type in data.events) {
              if (special[type]) {
                jQuery.event.remove(elem, type); // This is a shortcut to avoid jQuery.event.remove's overhead
              } else {
                jQuery.removeEvent(elem, type, data.handle);
              }
            }
          } // Support: Chrome <=35 - 45+
          // Assign undefined instead of using delete, see Data#remove


          elem[dataPriv.expando] = undefined;
        }

        if (elem[dataUser.expando]) {
          // Support: Chrome <=35 - 45+
          // Assign undefined instead of using delete, see Data#remove
          elem[dataUser.expando] = undefined;
        }
      }
    }
  }
});
jQuery.fn.extend({
  detach: function detach(selector) {
    return _remove(this, selector, true);
  },
  remove: function remove(selector) {
    return _remove(this, selector);
  },
  text: function text(value) {
    return access(this, function (value) {
      return value === undefined ? jQuery.text(this) : this.empty().each(function () {
        if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
          this.textContent = value;
        }
      });
    }, null, value, arguments.length);
  },
  append: function append() {
    return domManip(this, arguments, function (elem) {
      if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
        var target = manipulationTarget(this, elem);
        target.appendChild(elem);
      }
    });
  },
  prepend: function prepend() {
    return domManip(this, arguments, function (elem) {
      if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
        var target = manipulationTarget(this, elem);
        target.insertBefore(elem, target.firstChild);
      }
    });
  },
  before: function before() {
    return domManip(this, arguments, function (elem) {
      if (this.parentNode) {
        this.parentNode.insertBefore(elem, this);
      }
    });
  },
  after: function after() {
    return domManip(this, arguments, function (elem) {
      if (this.parentNode) {
        this.parentNode.insertBefore(elem, this.nextSibling);
      }
    });
  },
  empty: function empty() {
    var elem;
    var i = 0;

    for (; (elem = this[i]) != null; i++) {
      if (elem.nodeType === 1) {
        // Prevent memory leaks
        jQuery.cleanData(getAll(elem, false)); // Remove any remaining nodes

        elem.textContent = '';
      }
    }

    return this;
  },
  clone: function clone(dataAndEvents, deepDataAndEvents) {
    dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
    deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
    return this.map(function () {
      return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
    });
  },
  html: function html(value) {
    return access(this, function (value) {
      var elem = this[0] || {};
      var i = 0;
      var l = this.length;

      if (value === undefined && elem.nodeType === 1) {
        return elem.innerHTML;
      } // See if we can take a shortcut and just use innerHTML


      if (typeof value === 'string' && !rnoInnerhtml.test(value) && !wrapMap[(rtagName.exec(value) || ['', ''])[1].toLowerCase()]) {
        value = jQuery.htmlPrefilter(value);

        try {
          for (; i < l; i++) {
            elem = this[i] || {}; // Remove element nodes and prevent memory leaks

            if (elem.nodeType === 1) {
              jQuery.cleanData(getAll(elem, false));
              elem.innerHTML = value;
            }
          }

          elem = 0; // If using innerHTML throws an exception, use the fallback method
        } catch (e) {}
      }

      if (elem) {
        this.empty().append(value);
      }
    }, null, value, arguments.length);
  },
  replaceWith: function replaceWith() {
    var ignored = []; // Make the changes, replacing each non-ignored context element with the new content

    return domManip(this, arguments, function (elem) {
      var parent = this.parentNode;

      if (jQuery.inArray(this, ignored) < 0) {
        jQuery.cleanData(getAll(this));

        if (parent) {
          parent.replaceChild(elem, this);
        }
      } // Force callback invocation

    }, ignored);
  }
});
jQuery.each({
  appendTo: 'append',
  prependTo: 'prepend',
  insertBefore: 'before',
  insertAfter: 'after',
  replaceAll: 'replaceWith'
}, function (name, original) {
  jQuery.fn[name] = function (selector) {
    var elems;
    var ret = [];
    var insert = jQuery(selector);
    var last = insert.length - 1;
    var i = 0;

    for (; i <= last; i++) {
      elems = i === last ? this : this.clone(true);
      jQuery(insert[i])[original](elems); // Support: Android <=4.0 only, PhantomJS 1 only
      // .get() because push.apply(_, arraylike) throws on ancient WebKit

      push.apply(ret, elems.get());
    }

    return this.pushStack(ret);
  };
});
var rnumnonpx = new RegExp("^(".concat(pnum, ")(?!px)[a-z%]+$"), 'i');

var getStyles = function getStyles(elem) {
  // Support: IE <=11 only, Firefox <=30 (#15098, #14150)
  // IE throws on elements created in popups
  // FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
  var view = elem.ownerDocument.defaultView;

  if (!view || !view.opener) {
    view = window;
  }

  return view.getComputedStyle(elem);
};

var rboxStyle = new RegExp(cssExpand.join('|'), 'i');

(function () {
  // Executing both pixelPosition & boxSizingReliable tests require only one layout
  // so they're executed at the same time to save the second computation.
  function computeStyleTests() {
    // This is a singleton, we need to execute it only once
    if (!div) {
      return;
    }

    container.style.cssText = 'position:absolute;left:-11111px;width:60px;' + 'margin-top:1px;padding:0;border:0';
    div.style.cssText = 'position:relative;display:block;box-sizing:border-box;overflow:scroll;' + 'margin:auto;border:1px;padding:1px;' + 'width:60%;top:1%';
    documentElement.appendChild(container).appendChild(div);
    var divStyle = window.getComputedStyle(div);
    pixelPositionVal = divStyle.top !== '1%'; // Support: Android 4.0 - 4.3 only, Firefox <=3 - 44

    reliableMarginLeftVal = roundPixelMeasures(divStyle.marginLeft) === 12; // Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
    // Some styles come back with percentage values, even though they shouldn't

    div.style.right = '60%';
    pixelBoxStylesVal = roundPixelMeasures(divStyle.right) === 36; // Support: IE 9 - 11 only
    // Detect misreporting of content dimensions for box-sizing:border-box elements

    boxSizingReliableVal = roundPixelMeasures(divStyle.width) === 36; // Support: IE 9 only
    // Detect overflow:scroll screwiness (gh-3699)
    // Support: Chrome <=64
    // Don't get tricked when zoom affects offsetWidth (gh-4029)

    div.style.position = 'absolute';
    scrollboxSizeVal = roundPixelMeasures(div.offsetWidth / 3) === 12;
    documentElement.removeChild(container); // Nullify the div so it wouldn't be stored in the memory and
    // it will also be a sign that checks already performed

    div = null;
  }

  function roundPixelMeasures(measure) {
    return Math.round(parseFloat(measure));
  }

  var pixelPositionVal;
  var boxSizingReliableVal;
  var scrollboxSizeVal;
  var pixelBoxStylesVal;
  var reliableMarginLeftVal;
  var container = document$1.createElement('div');
  var div = document$1.createElement('div'); // Finish early in limited (non-browser) environments

  if (!div.style) {
    return;
  } // Support: IE <=9 - 11 only
  // Style of cloned element affects source element cloned (#8908)


  div.style.backgroundClip = 'content-box';
  div.cloneNode(true).style.backgroundClip = '';
  support.clearCloneStyle = div.style.backgroundClip === 'content-box';
  jQuery.extend(support, {
    boxSizingReliable: function boxSizingReliable() {
      computeStyleTests();
      return boxSizingReliableVal;
    },
    pixelBoxStyles: function pixelBoxStyles() {
      computeStyleTests();
      return pixelBoxStylesVal;
    },
    pixelPosition: function pixelPosition() {
      computeStyleTests();
      return pixelPositionVal;
    },
    reliableMarginLeft: function reliableMarginLeft() {
      computeStyleTests();
      return reliableMarginLeftVal;
    },
    scrollboxSize: function scrollboxSize() {
      computeStyleTests();
      return scrollboxSizeVal;
    }
  });
})();

function curCSS(elem, name, computed) {
  var width;
  var minWidth;
  var maxWidth;
  var ret; // Support: Firefox 51+
  // Retrieving style before computed somehow
  // fixes an issue with getting wrong values
  // on detached elements

  var style = elem.style;
  computed = computed || getStyles(elem); // getPropertyValue is needed for:
  //   .css('filter') (IE 9 only, #12537)
  //   .css('--customProperty) (#3144)

  if (computed) {
    ret = computed.getPropertyValue(name) || computed[name];

    if (ret === '' && !isAttached(elem)) {
      ret = jQuery.style(elem, name);
    } // A tribute to the "awesome hack by Dean Edwards"
    // Android Browser returns percentage for some values,
    // but width seems to be reliably pixels.
    // This is against the CSSOM draft spec:
    // https://drafts.csswg.org/cssom/#resolved-values


    if (!support.pixelBoxStyles() && rnumnonpx.test(ret) && rboxStyle.test(name)) {
      // Remember the original values
      width = style.width;
      minWidth = style.minWidth;
      maxWidth = style.maxWidth; // Put in the new values to get a computed value out

      style.minWidth = style.maxWidth = style.width = ret;
      ret = computed.width; // Revert the changed values

      style.width = width;
      style.minWidth = minWidth;
      style.maxWidth = maxWidth;
    }
  }

  return ret !== undefined // Support: IE <=9 - 11 only
  // IE returns zIndex value as an integer.
  ? "".concat(ret) : ret;
}

function addGetHookIf(conditionFn, hookFn) {
  // Define the hook, we'll check on the first run if it's really needed.
  return {
    get: function get() {
      if (conditionFn()) {
        // Hook not needed (or it's not possible to use it due
        // to missing dependency), remove it.
        delete this.get;
        return;
      } // Hook needed; redefine it so that the support test is not executed again.


      return (this.get = hookFn).apply(this, arguments);
    }
  };
}

var cssPrefixes = ['Webkit', 'Moz', 'ms'];
var emptyStyle = document$1.createElement('div').style;
var vendorProps = {}; // Return a vendor-prefixed property or undefined

function vendorPropName(name) {
  // Check for vendor prefixed names
  var capName = name[0].toUpperCase() + name.slice(1);
  var i = cssPrefixes.length;

  while (i--) {
    name = cssPrefixes[i] + capName;

    if (name in emptyStyle) {
      return name;
    }
  }
} // Return a potentially-mapped jQuery.cssProps or vendor prefixed property


function finalPropName(name) {
  var _final = jQuery.cssProps[name] || vendorProps[name];

  if (_final) {
    return _final;
  }

  if (name in emptyStyle) {
    return name;
  }

  return vendorProps[name] = vendorPropName(name) || name;
}

var // Swappable if display is none or starts with table
// except "table", "table-cell", or "table-caption"
// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
rdisplayswap = /^(none|table(?!-c[ea]).+)/;
var rcustomProp = /^--/;
var cssShow = {
  position: 'absolute',
  visibility: 'hidden',
  display: 'block'
};
var cssNormalTransform = {
  letterSpacing: '0',
  fontWeight: '400'
};

function setPositiveNumber(elem, value, subtract) {
  // Any relative (+/-) values have already been
  // normalized at this point
  var matches = rcssNum.exec(value);
  return matches // Guard against undefined "subtract", e.g., when used as in cssHooks
  ? Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || 'px') : value;
}

function boxModelAdjustment(elem, dimension, box, isBorderBox, styles, computedVal) {
  var i = dimension === 'width' ? 1 : 0;
  var extra = 0;
  var delta = 0; // Adjustment may not be necessary

  if (box === (isBorderBox ? 'border' : 'content')) {
    return 0;
  }

  for (; i < 4; i += 2) {
    // Both box models exclude margin
    if (box === 'margin') {
      delta += jQuery.css(elem, box + cssExpand[i], true, styles);
    } // If we get here with a content-box, we're seeking "padding" or "border" or "margin"


    if (!isBorderBox) {
      // Add padding
      delta += jQuery.css(elem, "padding".concat(cssExpand[i]), true, styles); // For "border" or "margin", add border

      if (box !== 'padding') {
        delta += jQuery.css(elem, "border".concat(cssExpand[i], "Width"), true, styles); // But still keep track of it otherwise
      } else {
        extra += jQuery.css(elem, "border".concat(cssExpand[i], "Width"), true, styles);
      } // If we get here with a border-box (content + padding + border), we're seeking "content" or
      // "padding" or "margin"

    } else {
      // For "content", subtract padding
      if (box === 'content') {
        delta -= jQuery.css(elem, "padding".concat(cssExpand[i]), true, styles);
      } // For "content" or "padding", subtract border


      if (box !== 'margin') {
        delta -= jQuery.css(elem, "border".concat(cssExpand[i], "Width"), true, styles);
      }
    }
  } // Account for positive content-box scroll gutter when requested by providing computedVal


  if (!isBorderBox && computedVal >= 0) {
    // offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
    // Assuming integer scroll gutter, subtract the rest and round down
    delta += Math.max(0, Math.ceil(elem["offset".concat(dimension[0].toUpperCase()).concat(dimension.slice(1))] - computedVal - delta - extra - 0.5 // If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
    // Use an explicit zero to avoid NaN (gh-3964)
    )) || 0;
  }

  return delta;
}

function getWidthOrHeight(elem, dimension, extra) {
  // Start with computed style
  var styles = getStyles(elem); // To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
  // Fake content-box until we know it's needed to know the true value.

  var boxSizingNeeded = !support.boxSizingReliable() || extra;
  var isBorderBox = boxSizingNeeded && jQuery.css(elem, 'boxSizing', false, styles) === 'border-box';
  var valueIsBorderBox = isBorderBox;
  var val = curCSS(elem, dimension, styles);
  var offsetProp = "offset".concat(dimension[0].toUpperCase()).concat(dimension.slice(1)); // Support: Firefox <=54
  // Return a confounding non-pixel value or feign ignorance, as appropriate.

  if (rnumnonpx.test(val)) {
    if (!extra) {
      return val;
    }

    val = 'auto';
  } // Fall back to offsetWidth/offsetHeight when value is "auto"
  // This happens for inline elements with no explicit setting (gh-3571)
  // Support: Android <=4.1 - 4.3 only
  // Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
  // Support: IE 9-11 only
  // Also use offsetWidth/offsetHeight for when box sizing is unreliable
  // We use getClientRects() to check for hidden/disconnected.
  // In those cases, the computed value can be trusted to be border-box


  if ((!support.boxSizingReliable() && isBorderBox || val === 'auto' || !parseFloat(val) && jQuery.css(elem, 'display', false, styles) === 'inline') && elem.getClientRects().length) {
    isBorderBox = jQuery.css(elem, 'boxSizing', false, styles) === 'border-box'; // Where available, offsetWidth/offsetHeight approximate border box dimensions.
    // Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
    // retrieved value as a content box dimension.

    valueIsBorderBox = offsetProp in elem;

    if (valueIsBorderBox) {
      val = elem[offsetProp];
    }
  } // Normalize "" and auto


  val = parseFloat(val) || 0; // Adjust for the element's box model

  return "".concat(val + boxModelAdjustment(elem, dimension, extra || (isBorderBox ? 'border' : 'content'), valueIsBorderBox, styles, // Provide the current computed size to request scroll gutter calculation (gh-3589)
  val), "px");
}

jQuery.extend({
  // Add in style property hooks for overriding the default
  // behavior of getting and setting a style property
  cssHooks: {
    opacity: {
      get: function get(elem, computed) {
        if (computed) {
          // We should always get a number back from opacity
          var ret = curCSS(elem, 'opacity');
          return ret === '' ? '1' : ret;
        }
      }
    }
  },
  // Don't automatically add "px" to these possibly-unitless properties
  cssNumber: {
    animationIterationCount: true,
    columnCount: true,
    fillOpacity: true,
    flexGrow: true,
    flexShrink: true,
    fontWeight: true,
    gridArea: true,
    gridColumn: true,
    gridColumnEnd: true,
    gridColumnStart: true,
    gridRow: true,
    gridRowEnd: true,
    gridRowStart: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    widows: true,
    zIndex: true,
    zoom: true
  },
  // Add in properties whose names you wish to fix before
  // setting or getting the value
  cssProps: {},
  // Get and set the style property on a DOM Node
  style: function style(elem, name, value, extra) {
    // Don't set styles on text and comment nodes
    if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
      return;
    } // Make sure that we're working with the right name


    var ret;
    var type;
    var hooks;
    var origName = camelCase(name);
    var isCustomProp = rcustomProp.test(name);
    var style = elem.style; // Make sure that we're working with the right name. We don't
    // want to query the value if it is a CSS custom property
    // since they are user-defined.

    if (!isCustomProp) {
      name = finalPropName(origName);
    } // Gets hook for the prefixed version, then unprefixed version


    hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName]; // Check if we're setting a value

    if (value !== undefined) {
      type = _typeof(value); // Convert "+=" or "-=" to relative numbers (#7345)

      if (type === 'string' && (ret = rcssNum.exec(value)) && ret[1]) {
        value = adjustCSS(elem, name, ret); // Fixes bug #9237

        type = 'number';
      } // Make sure that null and NaN values aren't set (#7116)


      if (value == null || value !== value) {
        return;
      } // If a number was passed in, add the unit (except for certain CSS properties)
      // The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
      // "px" to a few hardcoded values.


      if (type === 'number' && !isCustomProp) {
        value += ret && ret[3] || (jQuery.cssNumber[origName] ? '' : 'px');
      } // background-* props affect original clone's values


      if (!support.clearCloneStyle && value === '' && name.indexOf('background') === 0) {
        style[name] = 'inherit';
      } // If a hook was provided, use that value, otherwise just set the specified value


      if (!hooks || !('set' in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {
        if (isCustomProp) {
          style.setProperty(name, value);
        } else {
          style[name] = value;
        }
      }
    } else {
      // If a hook was provided get the non-computed value from there
      if (hooks && 'get' in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
        return ret;
      } // Otherwise just get the value from the style object


      return style[name];
    }
  },
  css: function css(elem, name, extra, styles) {
    var val;
    var num;
    var hooks;
    var origName = camelCase(name);
    var isCustomProp = rcustomProp.test(name); // Make sure that we're working with the right name. We don't
    // want to modify the value if it is a CSS custom property
    // since they are user-defined.

    if (!isCustomProp) {
      name = finalPropName(origName);
    } // Try prefixed name followed by the unprefixed name


    hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName]; // If a hook was provided get the computed value from there

    if (hooks && 'get' in hooks) {
      val = hooks.get(elem, true, extra);
    } // Otherwise, if a way to get the computed value exists, use that


    if (val === undefined) {
      val = curCSS(elem, name, styles);
    } // Convert "normal" to computed value


    if (val === 'normal' && name in cssNormalTransform) {
      val = cssNormalTransform[name];
    } // Make numeric if forced or a qualifier was provided and val looks numeric


    if (extra === '' || extra) {
      num = parseFloat(val);
      return extra === true || isFinite(num) ? num || 0 : val;
    }

    return val;
  }
});
jQuery.each(['height', 'width'], function (i, dimension) {
  jQuery.cssHooks[dimension] = {
    get: function get(elem, computed, extra) {
      if (computed) {
        // Certain elements can have dimension info if we invisibly show them
        // but it must have a current display style that would benefit
        return rdisplayswap.test(jQuery.css(elem, 'display')) // Support: Safari 8+
        // Table columns in Safari have non-zero offsetWidth & zero
        // getBoundingClientRect().width unless display is changed.
        // Support: IE <=11 only
        // Running getBoundingClientRect on a disconnected node
        // in IE throws an error.
        && (!elem.getClientRects().length || !elem.getBoundingClientRect().width) ? swap(elem, cssShow, function () {
          return getWidthOrHeight(elem, dimension, extra);
        }) : getWidthOrHeight(elem, dimension, extra);
      }
    },
    set: function set(elem, value, extra) {
      var matches;
      var styles = getStyles(elem); // Only read styles.position if the test has a chance to fail
      // to avoid forcing a reflow.

      var scrollboxSizeBuggy = !support.scrollboxSize() && styles.position === 'absolute'; // To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)

      var boxSizingNeeded = scrollboxSizeBuggy || extra;
      var isBorderBox = boxSizingNeeded && jQuery.css(elem, 'boxSizing', false, styles) === 'border-box';
      var subtract = extra ? boxModelAdjustment(elem, dimension, extra, isBorderBox, styles) : 0; // Account for unreliable border-box dimensions by comparing offset* to computed and
      // faking a content-box to get border and padding (gh-3699)

      if (isBorderBox && scrollboxSizeBuggy) {
        subtract -= Math.ceil(elem["offset".concat(dimension[0].toUpperCase()).concat(dimension.slice(1))] - parseFloat(styles[dimension]) - boxModelAdjustment(elem, dimension, 'border', false, styles) - 0.5);
      } // Convert to pixels if value adjustment is needed


      if (subtract && (matches = rcssNum.exec(value)) && (matches[3] || 'px') !== 'px') {
        elem.style[dimension] = value;
        value = jQuery.css(elem, dimension);
      }

      return setPositiveNumber(elem, value, subtract);
    }
  };
});
jQuery.cssHooks.marginLeft = addGetHookIf(support.reliableMarginLeft, function (elem, computed) {
  if (computed) {
    return "".concat(parseFloat(curCSS(elem, 'marginLeft')) || elem.getBoundingClientRect().left - swap(elem, {
      marginLeft: 0
    }, function () {
      return elem.getBoundingClientRect().left;
    }), "px");
  }
}); // These hooks are used by animate to expand properties

jQuery.each({
  margin: '',
  padding: '',
  border: 'Width'
}, function (prefix, suffix) {
  jQuery.cssHooks[prefix + suffix] = {
    expand: function expand(value) {
      var i = 0;
      var expanded = {}; // Assumes a single number if not a string

      var parts = typeof value === 'string' ? value.split(' ') : [value];

      for (; i < 4; i++) {
        expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
      }

      return expanded;
    }
  };

  if (prefix !== 'margin') {
    jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
  }
});
jQuery.fn.extend({
  css: function css(name, value) {
    return access(this, function (elem, name, value) {
      var styles;
      var len;
      var map = {};
      var i = 0;

      if (Array.isArray(name)) {
        styles = getStyles(elem);
        len = name.length;

        for (; i < len; i++) {
          map[name[i]] = jQuery.css(elem, name[i], false, styles);
        }

        return map;
      }

      return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
    }, name, value, arguments.length > 1);
  }
});

function Tween(elem, options, prop, end, easing) {
  return new Tween.prototype.init(elem, options, prop, end, easing);
}

jQuery.Tween = Tween;
Tween.prototype = {
  constructor: Tween,
  init: function init(elem, options, prop, end, easing, unit) {
    this.elem = elem;
    this.prop = prop;
    this.easing = easing || jQuery.easing._default;
    this.options = options;
    this.start = this.now = this.cur();
    this.end = end;
    this.unit = unit || (jQuery.cssNumber[prop] ? '' : 'px');
  },
  cur: function cur() {
    var hooks = Tween.propHooks[this.prop];
    return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
  },
  run: function run(percent) {
    var eased;
    var hooks = Tween.propHooks[this.prop];

    if (this.options.duration) {
      this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration);
    } else {
      this.pos = eased = percent;
    }

    this.now = (this.end - this.start) * eased + this.start;

    if (this.options.step) {
      this.options.step.call(this.elem, this.now, this);
    }

    if (hooks && hooks.set) {
      hooks.set(this);
    } else {
      Tween.propHooks._default.set(this);
    }

    return this;
  }
};
Tween.prototype.init.prototype = Tween.prototype;
Tween.propHooks = {
  _default: {
    get: function get(tween) {
      var result; // Use a property on the element directly when it is not a DOM element,
      // or when there is no matching style property that exists.

      if (tween.elem.nodeType !== 1 || tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
        return tween.elem[tween.prop];
      } // Passing an empty string as a 3rd parameter to .css will automatically
      // attempt a parseFloat and fallback to a string if the parse fails.
      // Simple values such as "10px" are parsed to Float;
      // complex values such as "rotate(1rad)" are returned as-is.


      result = jQuery.css(tween.elem, tween.prop, ''); // Empty strings, null, undefined and "auto" are converted to 0.

      return !result || result === 'auto' ? 0 : result;
    },
    set: function set(tween) {
      // Use step hook for back compat.
      // Use cssHook if its there.
      // Use .style if available and use plain properties where available.
      if (jQuery.fx.step[tween.prop]) {
        jQuery.fx.step[tween.prop](tween);
      } else if (tween.elem.nodeType === 1 && (jQuery.cssHooks[tween.prop] || tween.elem.style[finalPropName(tween.prop)] != null)) {
        jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
      } else {
        tween.elem[tween.prop] = tween.now;
      }
    }
  }
}; // Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
  set: function set(tween) {
    if (tween.elem.nodeType && tween.elem.parentNode) {
      tween.elem[tween.prop] = tween.now;
    }
  }
};
jQuery.easing = {
  linear: function linear(p) {
    return p;
  },
  swing: function swing(p) {
    return 0.5 - Math.cos(p * Math.PI) / 2;
  },
  _default: 'swing'
};
jQuery.fx = Tween.prototype.init; // Back compat <1.8 extension point

jQuery.fx.step = {};
var fxNow;
var inProgress;
var rfxtypes = /^(?:toggle|show|hide)$/;
var rrun = /queueHooks$/;

function schedule() {
  if (inProgress) {
    if (document$1.hidden === false && window.requestAnimationFrame) {
      window.requestAnimationFrame(schedule);
    } else {
      window.setTimeout(schedule, jQuery.fx.interval);
    }

    jQuery.fx.tick();
  }
} // Animations created synchronously will run synchronously


function createFxNow() {
  window.setTimeout(function () {
    fxNow = undefined;
  });
  return fxNow = Date.now();
} // Generate parameters to create a standard animation


function genFx(type, includeWidth) {
  var which;
  var i = 0;
  var attrs = {
    height: type
  }; // If we include width, step value is 1 to do all cssExpand values,
  // otherwise step value is 2 to skip over Left and Right

  includeWidth = includeWidth ? 1 : 0;

  for (; i < 4; i += 2 - includeWidth) {
    which = cssExpand[i];
    attrs["margin".concat(which)] = attrs["padding".concat(which)] = type;
  }

  if (includeWidth) {
    attrs.opacity = attrs.width = type;
  }

  return attrs;
}

function createTween(value, prop, animation) {
  var tween;
  var collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners['*']);
  var index = 0;
  var length = collection.length;

  for (; index < length; index++) {
    if (tween = collection[index].call(animation, prop, value)) {
      // We're done with this property
      return tween;
    }
  }
}

function defaultPrefilter(elem, props, opts) {
  var prop;
  var value;
  var toggle;
  var hooks;
  var oldfire;
  var propTween;
  var restoreDisplay;
  var display;
  var isBox = 'width' in props || 'height' in props;
  var anim = this;
  var orig = {};
  var style = elem.style;
  var hidden = elem.nodeType && isHiddenWithinTree(elem);
  var dataShow = dataPriv.get(elem, 'fxshow'); // Queue-skipping animations hijack the fx hooks

  if (!opts.queue) {
    hooks = jQuery._queueHooks(elem, 'fx');

    if (hooks.unqueued == null) {
      hooks.unqueued = 0;
      oldfire = hooks.empty.fire;

      hooks.empty.fire = function () {
        if (!hooks.unqueued) {
          oldfire();
        }
      };
    }

    hooks.unqueued++;
    anim.always(function () {
      // Ensure the complete handler is called before this completes
      anim.always(function () {
        hooks.unqueued--;

        if (!jQuery.queue(elem, 'fx').length) {
          hooks.empty.fire();
        }
      });
    });
  } // Detect show/hide animations


  for (prop in props) {
    value = props[prop];

    if (rfxtypes.test(value)) {
      delete props[prop];
      toggle = toggle || value === 'toggle';

      if (value === (hidden ? 'hide' : 'show')) {
        // Pretend to be hidden if this is a "show" and
        // there is still data from a stopped show/hide
        if (value === 'show' && dataShow && dataShow[prop] !== undefined) {
          hidden = true; // Ignore all other no-op show/hide data
        } else {
          continue;
        }
      }

      orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
    }
  } // Bail out if this is a no-op like .hide().hide()


  propTween = !jQuery.isEmptyObject(props);

  if (!propTween && jQuery.isEmptyObject(orig)) {
    return;
  } // Restrict "overflow" and "display" styles during box animations


  if (isBox && elem.nodeType === 1) {
    // Support: IE <=9 - 11, Edge 12 - 15
    // Record all 3 overflow attributes because IE does not infer the shorthand
    // from identically-valued overflowX and overflowY and Edge just mirrors
    // the overflowX value there.
    opts.overflow = [style.overflow, style.overflowX, style.overflowY]; // Identify a display type, preferring old show/hide data over the CSS cascade

    restoreDisplay = dataShow && dataShow.display;

    if (restoreDisplay == null) {
      restoreDisplay = dataPriv.get(elem, 'display');
    }

    display = jQuery.css(elem, 'display');

    if (display === 'none') {
      if (restoreDisplay) {
        display = restoreDisplay;
      } else {
        // Get nonempty value(s) by temporarily forcing visibility
        showHide([elem], true);
        restoreDisplay = elem.style.display || restoreDisplay;
        display = jQuery.css(elem, 'display');
        showHide([elem]);
      }
    } // Animate inline elements as inline-block


    if (display === 'inline' || display === 'inline-block' && restoreDisplay != null) {
      if (jQuery.css(elem, 'float') === 'none') {
        // Restore the original display value at the end of pure show/hide animations
        if (!propTween) {
          anim.done(function () {
            style.display = restoreDisplay;
          });

          if (restoreDisplay == null) {
            display = style.display;
            restoreDisplay = display === 'none' ? '' : display;
          }
        }

        style.display = 'inline-block';
      }
    }
  }

  if (opts.overflow) {
    style.overflow = 'hidden';
    anim.always(function () {
      style.overflow = opts.overflow[0];
      style.overflowX = opts.overflow[1];
      style.overflowY = opts.overflow[2];
    });
  } // Implement show/hide animations


  propTween = false;

  for (prop in orig) {
    // General show/hide setup for this element animation
    if (!propTween) {
      if (dataShow) {
        if ('hidden' in dataShow) {
          hidden = dataShow.hidden;
        }
      } else {
        dataShow = dataPriv.access(elem, 'fxshow', {
          display: restoreDisplay
        });
      } // Store hidden/visible for toggle so `.stop().toggle()` "reverses"


      if (toggle) {
        dataShow.hidden = !hidden;
      } // Show elements before animating them


      if (hidden) {
        showHide([elem], true);
      }
      /* eslint-disable no-loop-func */


      anim.done(function () {
        /* eslint-enable no-loop-func */
        // The final step of a "hide" animation is actually hiding the element
        if (!hidden) {
          showHide([elem]);
        }

        dataPriv.remove(elem, 'fxshow');

        for (prop in orig) {
          jQuery.style(elem, prop, orig[prop]);
        }
      });
    } // Per-property setup


    propTween = createTween(hidden ? dataShow[prop] : 0, prop, anim);

    if (!(prop in dataShow)) {
      dataShow[prop] = propTween.start;

      if (hidden) {
        propTween.end = propTween.start;
        propTween.start = 0;
      }
    }
  }
}

function propFilter(props, specialEasing) {
  var index;
  var name;
  var easing;
  var value;
  var hooks; // camelCase, specialEasing and expand cssHook pass

  for (index in props) {
    name = camelCase(index);
    easing = specialEasing[name];
    value = props[index];

    if (Array.isArray(value)) {
      easing = value[1];
      value = props[index] = value[0];
    }

    if (index !== name) {
      props[name] = value;
      delete props[index];
    }

    hooks = jQuery.cssHooks[name];

    if (hooks && 'expand' in hooks) {
      value = hooks.expand(value);
      delete props[name]; // Not quite $.extend, this won't overwrite existing keys.
      // Reusing 'index' because we have the correct "name"

      for (index in value) {
        if (!(index in props)) {
          props[index] = value[index];
          specialEasing[index] = easing;
        }
      }
    } else {
      specialEasing[name] = easing;
    }
  }
}

function Animation(elem, properties, options) {
  var result;
  var stopped;
  var index = 0;
  var length = Animation.prefilters.length;
  var deferred = jQuery.Deferred().always(function () {
    // Don't match elem in the :animated selector
    delete tick.elem;
  });

  var tick = function tick() {
    if (stopped) {
      return false;
    }

    var currentTime = fxNow || createFxNow();
    var remaining = Math.max(0, animation.startTime + animation.duration - currentTime); // Support: Android 2.3 only
    // Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)

    var temp = remaining / animation.duration || 0;
    var percent = 1 - temp;
    var index = 0;
    var length = animation.tweens.length;

    for (; index < length; index++) {
      animation.tweens[index].run(percent);
    }

    deferred.notifyWith(elem, [animation, percent, remaining]); // If there's more to do, yield

    if (percent < 1 && length) {
      return remaining;
    } // If this was an empty animation, synthesize a final progress notification


    if (!length) {
      deferred.notifyWith(elem, [animation, 1, 0]);
    } // Resolve the animation and report its conclusion


    deferred.resolveWith(elem, [animation]);
    return false;
  };

  var animation = deferred.promise({
    elem: elem,
    props: jQuery.extend({}, properties),
    opts: jQuery.extend(true, {
      specialEasing: {},
      easing: jQuery.easing._default
    }, options),
    originalProperties: properties,
    originalOptions: options,
    startTime: fxNow || createFxNow(),
    duration: options.duration,
    tweens: [],
    createTween: function createTween(prop, end) {
      var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
      animation.tweens.push(tween);
      return tween;
    },
    stop: function stop(gotoEnd) {
      var index = 0; // If we are going to the end, we want to run all the tweens
      // otherwise we skip this part

      var length = gotoEnd ? animation.tweens.length : 0;

      if (stopped) {
        return this;
      }

      stopped = true;

      for (; index < length; index++) {
        animation.tweens[index].run(1);
      } // Resolve when we played the last frame; otherwise, reject


      if (gotoEnd) {
        deferred.notifyWith(elem, [animation, 1, 0]);
        deferred.resolveWith(elem, [animation, gotoEnd]);
      } else {
        deferred.rejectWith(elem, [animation, gotoEnd]);
      }

      return this;
    }
  });
  var props = animation.props;
  propFilter(props, animation.opts.specialEasing);

  for (; index < length; index++) {
    result = Animation.prefilters[index].call(animation, elem, props, animation.opts);

    if (result) {
      if (isFunction(result.stop)) {
        jQuery._queueHooks(animation.elem, animation.opts.queue).stop = result.stop.bind(result);
      }

      return result;
    }
  }

  jQuery.map(props, createTween, animation);

  if (isFunction(animation.opts.start)) {
    animation.opts.start.call(elem, animation);
  } // Attach callbacks from options


  animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
  jQuery.fx.timer(jQuery.extend(tick, {
    elem: elem,
    anim: animation,
    queue: animation.opts.queue
  }));
  return animation;
}

jQuery.Animation = jQuery.extend(Animation, {
  tweeners: {
    '*': [function (prop, value) {
      var tween = this.createTween(prop, value);
      adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
      return tween;
    }]
  },
  tweener: function tweener(props, callback) {
    if (isFunction(props)) {
      callback = props;
      props = ['*'];
    } else {
      props = props.match(rnothtmlwhite);
    }

    var prop;
    var index = 0;
    var _props = props,
        length = _props.length;

    for (; index < length; index++) {
      prop = props[index];
      Animation.tweeners[prop] = Animation.tweeners[prop] || [];
      Animation.tweeners[prop].unshift(callback);
    }
  },
  prefilters: [defaultPrefilter],
  prefilter: function prefilter(callback, prepend) {
    if (prepend) {
      Animation.prefilters.unshift(callback);
    } else {
      Animation.prefilters.push(callback);
    }
  }
});

jQuery.speed = function (speed, easing, fn) {
  var opt = speed && _typeof(speed) === 'object' ? jQuery.extend({}, speed) : {
    complete: fn || !fn && easing || isFunction(speed) && speed,
    duration: speed,
    easing: fn && easing || easing && !isFunction(easing) && easing
  }; // Go to the end state if fx are off

  if (jQuery.fx.off) {
    opt.duration = 0;
  } else if (typeof opt.duration !== 'number') {
    if (opt.duration in jQuery.fx.speeds) {
      opt.duration = jQuery.fx.speeds[opt.duration];
    } else {
      opt.duration = jQuery.fx.speeds._default;
    }
  } // Normalize opt.queue - true/undefined/null -> "fx"


  if (opt.queue == null || opt.queue === true) {
    opt.queue = 'fx';
  } // Queueing


  opt.old = opt.complete;

  opt.complete = function () {
    if (isFunction(opt.old)) {
      opt.old.call(this);
    }

    if (opt.queue) {
      jQuery.dequeue(this, opt.queue);
    }
  };

  return opt;
};

jQuery.fn.extend({
  fadeTo: function fadeTo(speed, to, easing, callback) {
    // Show any hidden elements after setting opacity to 0
    return this.filter(isHiddenWithinTree).css('opacity', 0).show() // Animate to the value specified
    .end().animate({
      opacity: to
    }, speed, easing, callback);
  },
  animate: function animate(prop, speed, easing, callback) {
    var empty = jQuery.isEmptyObject(prop);
    var optall = jQuery.speed(speed, easing, callback);

    var doAnimation = function doAnimation() {
      // Operate on a copy of prop so per-property easing won't be lost
      var anim = Animation(this, jQuery.extend({}, prop), optall); // Empty animations, or finishing resolves immediately

      if (empty || dataPriv.get(this, 'finish')) {
        anim.stop(true);
      }
    };

    doAnimation.finish = doAnimation;
    return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
  },
  stop: function stop(type, clearQueue, gotoEnd) {
    var stopQueue = function stopQueue(hooks) {
      var stop = hooks.stop;
      delete hooks.stop;
      stop(gotoEnd);
    };

    if (typeof type !== 'string') {
      gotoEnd = clearQueue;
      clearQueue = type;
      type = undefined;
    }

    if (clearQueue && type !== false) {
      this.queue(type || 'fx', []);
    }

    return this.each(function () {
      var dequeue = true;
      var index = type != null && "".concat(type, "queueHooks");
      var timers = jQuery.timers;
      var data = dataPriv.get(this);

      if (index) {
        if (data[index] && data[index].stop) {
          stopQueue(data[index]);
        }
      } else {
        for (index in data) {
          if (data[index] && data[index].stop && rrun.test(index)) {
            stopQueue(data[index]);
          }
        }
      }

      for (index = timers.length; index--;) {
        if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
          timers[index].anim.stop(gotoEnd);
          dequeue = false;
          timers.splice(index, 1);
        }
      } // Start the next in the queue if the last step wasn't forced.
      // Timers currently will call their complete callbacks, which
      // will dequeue but only if they were gotoEnd.


      if (dequeue || !gotoEnd) {
        jQuery.dequeue(this, type);
      }
    });
  },
  finish: function finish(type) {
    if (type !== false) {
      type = type || 'fx';
    }

    return this.each(function () {
      var index;
      var data = dataPriv.get(this);
      var queue = data["".concat(type, "queue")];
      var hooks = data["".concat(type, "queueHooks")];
      var timers = jQuery.timers;
      var length = queue ? queue.length : 0; // Enable finishing flag on private data

      data.finish = true; // Empty the queue first

      jQuery.queue(this, type, []);

      if (hooks && hooks.stop) {
        hooks.stop.call(this, true);
      } // Look for any active animations, and finish them


      for (index = timers.length; index--;) {
        if (timers[index].elem === this && timers[index].queue === type) {
          timers[index].anim.stop(true);
          timers.splice(index, 1);
        }
      } // Look for any animations in the old queue and finish them


      for (index = 0; index < length; index++) {
        if (queue[index] && queue[index].finish) {
          queue[index].finish.call(this);
        }
      } // Turn off finishing flag


      delete data.finish;
    });
  }
});
jQuery.each(['toggle', 'show', 'hide'], function (i, name) {
  var cssFn = jQuery.fn[name];

  jQuery.fn[name] = function (speed, easing, callback) {
    return speed == null || typeof speed === 'boolean' ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
  };
}); // Generate shortcuts for custom animations

jQuery.each({
  slideDown: genFx('show'),
  slideUp: genFx('hide'),
  slideToggle: genFx('toggle'),
  fadeIn: {
    opacity: 'show'
  },
  fadeOut: {
    opacity: 'hide'
  },
  fadeToggle: {
    opacity: 'toggle'
  }
}, function (name, props) {
  jQuery.fn[name] = function (speed, easing, callback) {
    return this.animate(props, speed, easing, callback);
  };
});
jQuery.timers = [];

jQuery.fx.tick = function () {
  var timer;
  var i = 0;
  var timers = jQuery.timers;
  fxNow = Date.now();

  for (; i < timers.length; i++) {
    timer = timers[i]; // Run the timer and safely remove it when done (allowing for external removal)

    if (!timer() && timers[i] === timer) {
      timers.splice(i--, 1);
    }
  }

  if (!timers.length) {
    jQuery.fx.stop();
  }

  fxNow = undefined;
};

jQuery.fx.timer = function (timer) {
  jQuery.timers.push(timer);
  jQuery.fx.start();
};

jQuery.fx.interval = 13;

jQuery.fx.start = function () {
  if (inProgress) {
    return;
  }

  inProgress = true;
  schedule();
};

jQuery.fx.stop = function () {
  inProgress = null;
};

jQuery.fx.speeds = {
  slow: 600,
  fast: 200,
  // Default speed
  _default: 400
}; // Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/

jQuery.fn.delay = function (time, type) {
  time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
  type = type || 'fx';
  return this.queue(type, function (next, hooks) {
    var timeout = window.setTimeout(next, time);

    hooks.stop = function () {
      window.clearTimeout(timeout);
    };
  });
};

(function () {
  var input = document$1.createElement('input');
  var select = document$1.createElement('select');
  var opt = select.appendChild(document$1.createElement('option'));
  input.type = 'checkbox'; // Support: Android <=4.3 only
  // Default value for a checkbox should be "on"

  support.checkOn = input.value !== ''; // Support: IE <=11 only
  // Must access selectedIndex to make default options select

  support.optSelected = opt.selected; // Support: IE <=11 only
  // An input loses its value after becoming a radio

  input = document$1.createElement('input');
  input.value = 't';
  input.type = 'radio';
  support.radioValue = input.value === 't';
})();

var boolHook;
var attrHandle = jQuery.expr.attrHandle;
jQuery.fn.extend({
  attr: function attr(name, value) {
    return access(this, jQuery.attr, name, value, arguments.length > 1);
  },
  removeAttr: function removeAttr(name) {
    return this.each(function () {
      jQuery.removeAttr(this, name);
    });
  }
});
jQuery.extend({
  attr: function attr(elem, name, value) {
    var ret;
    var hooks;
    var nType = elem.nodeType; // Don't get/set attributes on text, comment and attribute nodes

    if (nType === 3 || nType === 8 || nType === 2) {
      return;
    } // Fallback to prop when attributes are not supported


    if (typeof elem.getAttribute === 'undefined') {
      return jQuery.prop(elem, name, value);
    } // Attribute hooks are determined by the lowercase version
    // Grab necessary hook if one is defined


    if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
      hooks = jQuery.attrHooks[name.toLowerCase()] || (jQuery.expr.match.bool.test(name) ? boolHook : undefined);
    }

    if (value !== undefined) {
      if (value === null) {
        jQuery.removeAttr(elem, name);
        return;
      }

      if (hooks && 'set' in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
        return ret;
      }

      elem.setAttribute(name, "".concat(value));
      return value;
    }

    if (hooks && 'get' in hooks && (ret = hooks.get(elem, name)) !== null) {
      return ret;
    }

    ret = jQuery.find.attr(elem, name); // Non-existent attributes return null, we normalize to undefined

    return ret == null ? undefined : ret;
  },
  attrHooks: {
    type: {
      set: function set(elem, value) {
        if (!support.radioValue && value === 'radio' && nodeName(elem, 'input')) {
          var val = elem.value;
          elem.setAttribute('type', value);

          if (val) {
            elem.value = val;
          }

          return value;
        }
      }
    }
  },
  removeAttr: function removeAttr(elem, value) {
    var name;
    var i = 0; // Attribute names can contain non-HTML whitespace characters
    // https://html.spec.whatwg.org/multipage/syntax.html#attributes-2

    var attrNames = value && value.match(rnothtmlwhite);

    if (attrNames && elem.nodeType === 1) {
      while (name = attrNames[i++]) {
        elem.removeAttribute(name);
      }
    }
  }
}); // Hooks for boolean attributes

boolHook = {
  set: function set(elem, value, name) {
    if (value === false) {
      // Remove boolean attributes when set to false
      jQuery.removeAttr(elem, name);
    } else {
      elem.setAttribute(name, name);
    }

    return name;
  }
};
jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function (i, name) {
  var getter = attrHandle[name] || jQuery.find.attr;

  attrHandle[name] = function (elem, name, isXML) {
    var ret;
    var handle;
    var lowercaseName = name.toLowerCase();

    if (!isXML) {
      // Avoid an infinite loop by temporarily removing this function from the getter
      handle = attrHandle[lowercaseName];
      attrHandle[lowercaseName] = ret;
      ret = getter(elem, name, isXML) != null ? lowercaseName : null;
      attrHandle[lowercaseName] = handle;
    }

    return ret;
  };
});
var rfocusable = /^(?:input|select|textarea|button)$/i;
var rclickable = /^(?:a|area)$/i;
jQuery.fn.extend({
  prop: function prop(name, value) {
    return access(this, jQuery.prop, name, value, arguments.length > 1);
  },
  removeProp: function removeProp(name) {
    return this.each(function () {
      delete this[jQuery.propFix[name] || name];
    });
  }
});
jQuery.extend({
  prop: function prop(elem, name, value) {
    var ret;
    var hooks;
    var nType = elem.nodeType; // Don't get/set properties on text, comment and attribute nodes

    if (nType === 3 || nType === 8 || nType === 2) {
      return;
    }

    if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
      // Fix name and attach hooks
      name = jQuery.propFix[name] || name;
      hooks = jQuery.propHooks[name];
    }

    if (value !== undefined) {
      if (hooks && 'set' in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
        return ret;
      }

      return elem[name] = value;
    }

    if (hooks && 'get' in hooks && (ret = hooks.get(elem, name)) !== null) {
      return ret;
    }

    return elem[name];
  },
  propHooks: {
    tabIndex: {
      get: function get(elem) {
        // Support: IE <=9 - 11 only
        // elem.tabIndex doesn't always return the
        // correct value when it hasn't been explicitly set
        // https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
        // Use proper attribute retrieval(#12072)
        var tabindex = jQuery.find.attr(elem, 'tabindex');

        if (tabindex) {
          return parseInt(tabindex, 10);
        }

        if (rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href) {
          return 0;
        }

        return -1;
      }
    }
  },
  propFix: {
    "for": 'htmlFor',
    "class": 'className'
  }
}); // Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop

if (!support.optSelected) {
  jQuery.propHooks.selected = {
    get: function get(elem) {
      /* eslint no-unused-expressions: "off" */
      var parent = elem.parentNode;

      if (parent && parent.parentNode) {
        parent.parentNode.selectedIndex;
      }

      return null;
    },
    set: function set(elem) {
      /* eslint no-unused-expressions: "off" */
      var parent = elem.parentNode;

      if (parent) {
        parent.selectedIndex;

        if (parent.parentNode) {
          parent.parentNode.selectedIndex;
        }
      }
    }
  };
}

jQuery.each(['tabIndex', 'readOnly', 'maxLength', 'cellSpacing', 'cellPadding', 'rowSpan', 'colSpan', 'useMap', 'frameBorder', 'contentEditable'], function () {
  jQuery.propFix[this.toLowerCase()] = this;
}); // Strip and collapse whitespace according to HTML spec
// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace

function stripAndCollapse(value) {
  var tokens = value.match(rnothtmlwhite) || [];
  return tokens.join(' ');
}

function getClass(elem) {
  return elem.getAttribute && elem.getAttribute('class') || '';
}

function classesToArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    return value.match(rnothtmlwhite) || [];
  }

  return [];
}

jQuery.fn.extend({
  addClass: function addClass(value) {
    var classes;
    var elem;
    var cur;
    var curValue;
    var clazz;
    var j;
    var finalValue;
    var i = 0;

    if (isFunction(value)) {
      return this.each(function (j) {
        jQuery(this).addClass(value.call(this, j, getClass(this)));
      });
    }

    classes = classesToArray(value);

    if (classes.length) {
      while (elem = this[i++]) {
        curValue = getClass(elem);
        cur = elem.nodeType === 1 && " ".concat(stripAndCollapse(curValue), " ");

        if (cur) {
          j = 0;

          while (clazz = classes[j++]) {
            if (cur.indexOf(" ".concat(clazz, " ")) < 0) {
              cur += "".concat(clazz, " ");
            }
          } // Only assign if different to avoid unneeded rendering.


          finalValue = stripAndCollapse(cur);

          if (curValue !== finalValue) {
            elem.setAttribute('class', finalValue);
          }
        }
      }
    }

    return this;
  },
  removeClass: function removeClass(value) {
    var classes;
    var elem;
    var cur;
    var curValue;
    var clazz;
    var j;
    var finalValue;
    var i = 0;

    if (isFunction(value)) {
      return this.each(function (j) {
        jQuery(this).removeClass(value.call(this, j, getClass(this)));
      });
    }

    if (!arguments.length) {
      return this.attr('class', '');
    }

    classes = classesToArray(value);

    if (classes.length) {
      while (elem = this[i++]) {
        curValue = getClass(elem); // This expression is here for better compressibility (see addClass)

        cur = elem.nodeType === 1 && " ".concat(stripAndCollapse(curValue), " ");

        if (cur) {
          j = 0;

          while (clazz = classes[j++]) {
            // Remove *all* instances
            while (cur.indexOf(" ".concat(clazz, " ")) > -1) {
              cur = cur.replace(" ".concat(clazz, " "), ' ');
            }
          } // Only assign if different to avoid unneeded rendering.


          finalValue = stripAndCollapse(cur);

          if (curValue !== finalValue) {
            elem.setAttribute('class', finalValue);
          }
        }
      }
    }

    return this;
  },
  toggleClass: function toggleClass(value, stateVal) {
    var type = _typeof(value);

    var isValidValue = type === 'string' || Array.isArray(value);

    if (typeof stateVal === 'boolean' && isValidValue) {
      return stateVal ? this.addClass(value) : this.removeClass(value);
    }

    if (isFunction(value)) {
      return this.each(function (i) {
        jQuery(this).toggleClass(value.call(this, i, getClass(this), stateVal), stateVal);
      });
    }

    return this.each(function () {
      var className;
      var i;
      var self;
      var classNames;

      if (isValidValue) {
        // Toggle individual class names
        i = 0;
        self = jQuery(this);
        classNames = classesToArray(value);

        while (className = classNames[i++]) {
          // Check each className given, space separated list
          if (self.hasClass(className)) {
            self.removeClass(className);
          } else {
            self.addClass(className);
          }
        } // Toggle whole class name

      } else if (value === undefined || type === 'boolean') {
        className = getClass(this);

        if (className) {
          // Store className if set
          dataPriv.set(this, '__className__', className);
        } // If the element has a class name or if we're passed `false`,
        // then remove the whole classname (if there was one, the above saved it).
        // Otherwise bring back whatever was previously saved (if anything),
        // falling back to the empty string if nothing was stored.


        if (this.setAttribute) {
          this.setAttribute('class', className || value === false ? '' : dataPriv.get(this, '__className__') || '');
        }
      }
    });
  },
  hasClass: function hasClass(selector) {
    var className;
    var elem;
    var i = 0;
    className = " ".concat(selector, " ");

    while (elem = this[i++]) {
      if (elem.nodeType === 1 && " ".concat(stripAndCollapse(getClass(elem)), " ").indexOf(className) > -1) {
        return true;
      }
    }

    return false;
  }
});
var rreturn = /\r/g;
jQuery.fn.extend({
  val: function val(value) {
    var hooks;
    var ret;
    var valueIsFunction;
    var elem = this[0];

    if (!arguments.length) {
      if (elem) {
        hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];

        if (hooks && 'get' in hooks && (ret = hooks.get(elem, 'value')) !== undefined) {
          return ret;
        }

        ret = elem.value; // Handle most common string cases

        if (typeof ret === 'string') {
          return ret.replace(rreturn, '');
        } // Handle cases where value is null/undef or number


        return ret == null ? '' : ret;
      }

      return;
    }

    valueIsFunction = isFunction(value);
    return this.each(function (i) {
      var val;

      if (this.nodeType !== 1) {
        return;
      }

      if (valueIsFunction) {
        val = value.call(this, i, jQuery(this).val());
      } else {
        val = value;
      } // Treat null/undefined as ""; convert numbers to string


      if (val == null) {
        val = '';
      } else if (typeof val === 'number') {
        val += '';
      } else if (Array.isArray(val)) {
        val = jQuery.map(val, function (value) {
          return value == null ? '' : "".concat(value);
        });
      }

      hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()]; // If set returns undefined, fall back to normal setting

      if (!hooks || !('set' in hooks) || hooks.set(this, val, 'value') === undefined) {
        this.value = val;
      }
    });
  }
});
jQuery.extend({
  valHooks: {
    option: {
      get: function get(elem) {
        var val = jQuery.find.attr(elem, 'value');
        return val != null ? val // Support: IE <=10 - 11 only
        // option.text throws exceptions (#14686, #14858)
        // Strip and collapse whitespace
        // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
        : stripAndCollapse(jQuery.text(elem));
      }
    },
    select: {
      get: function get(elem) {
        var value;
        var option;
        var i;
        var options = elem.options;
        var index = elem.selectedIndex;
        var one = elem.type === 'select-one';
        var values = one ? null : [];
        var max = one ? index + 1 : options.length;

        if (index < 0) {
          i = max;
        } else {
          i = one ? index : 0;
        } // Loop through all the selected options


        for (; i < max; i++) {
          option = options[i]; // Support: IE <=9 only
          // IE8-9 doesn't update selected after form reset (#2551)

          if ((option.selected || i === index) && // Don't return options that are disabled or in a disabled optgroup
          !option.disabled && (!option.parentNode.disabled || !nodeName(option.parentNode, 'optgroup'))) {
            // Get the specific value for the option
            value = jQuery(option).val(); // We don't need an array for one selects

            if (one) {
              return value;
            } // Multi-Selects return an array


            values.push(value);
          }
        }

        return values;
      },
      set: function set(elem, value) {
        var optionSet;
        var option;
        var options = elem.options;
        var values = jQuery.makeArray(value);
        var i = options.length;

        while (i--) {
          option = options[i];
          /* eslint-disable no-cond-assign */

          if (option.selected = jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1) {
            optionSet = true;
          }
          /* eslint-enable no-cond-assign */

        } // Force browsers to behave consistently when non-matching value is set


        if (!optionSet) {
          elem.selectedIndex = -1;
        }

        return values;
      }
    }
  }
}); // Radios and checkboxes getter/setter

jQuery.each(['radio', 'checkbox'], function () {
  jQuery.valHooks[this] = {
    set: function set(elem, value) {
      if (Array.isArray(value)) {
        return elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1;
      }
    }
  };

  if (!support.checkOn) {
    jQuery.valHooks[this].get = function (elem) {
      return elem.getAttribute('value') === null ? 'on' : elem.value;
    };
  }
}); // Return jQuery for attributes-only inclusion

support.focusin = 'onfocusin' in window;
var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

var stopPropagationCallback = function stopPropagationCallback(e) {
  e.stopPropagation();
};

jQuery.extend(jQuery.event, {
  trigger: function trigger(event, data, elem, onlyHandlers) {
    var i;
    var cur;
    var tmp;
    var bubbleType;
    var ontype;
    var handle;
    var special;
    var lastElement;
    var eventPath = [elem || document$1];
    var type = hasOwn.call(event, 'type') ? event.type : event;
    var namespaces = hasOwn.call(event, 'namespace') ? event.namespace.split('.') : [];
    cur = lastElement = tmp = elem = elem || document$1; // Don't do events on text and comment nodes

    if (elem.nodeType === 3 || elem.nodeType === 8) {
      return;
    } // focus/blur morphs to focusin/out; ensure we're not firing them right now


    if (rfocusMorph.test(type + jQuery.event.triggered)) {
      return;
    }

    if (type.indexOf('.') > -1) {
      // Namespaced trigger; create a regexp to match event type in handle()
      namespaces = type.split('.');
      type = namespaces.shift();
      namespaces.sort();
    }

    ontype = type.indexOf(':') < 0 && "on".concat(type); // Caller can pass in a jQuery.Event object, Object, or just an event type string

    event = event[jQuery.expando] ? event : new jQuery.Event(type, _typeof(event) === 'object' && event); // Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)

    event.isTrigger = onlyHandlers ? 2 : 3;
    event.namespace = namespaces.join('.');
    event.rnamespace = event.namespace ? new RegExp("(^|\\.)".concat(namespaces.join('\\.(?:.*\\.|)'), "(\\.|$)")) : null; // Clean up the event in case it is being reused

    event.result = undefined;

    if (!event.target) {
      event.target = elem;
    } // Clone any incoming data and prepend the event, creating the handler arg list


    data = data == null ? [event] : jQuery.makeArray(data, [event]); // Allow special events to draw outside the lines

    special = jQuery.event.special[type] || {};

    if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
      return;
    } // Determine event propagation path in advance, per W3C events spec (#9951)
    // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)


    if (!onlyHandlers && !special.noBubble && !isWindow(elem)) {
      bubbleType = special.delegateType || type;

      if (!rfocusMorph.test(bubbleType + type)) {
        cur = cur.parentNode;
      }

      for (; cur; cur = cur.parentNode) {
        eventPath.push(cur);
        tmp = cur;
      } // Only add window if we got to document (e.g., not plain obj or detached DOM)


      if (tmp === (elem.ownerDocument || document$1)) {
        eventPath.push(tmp.defaultView || tmp.parentWindow || window);
      }
    } // Fire handlers on the event path


    i = 0;

    while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
      lastElement = cur;
      event.type = i > 1 ? bubbleType : special.bindType || type; // jQuery handler

      handle = (dataPriv.get(cur, 'events') || {})[event.type] && dataPriv.get(cur, 'handle');

      if (handle) {
        handle.apply(cur, data);
      } // Native handler


      handle = ontype && cur[ontype];

      if (handle && handle.apply && acceptData(cur)) {
        event.result = handle.apply(cur, data);

        if (event.result === false) {
          event.preventDefault();
        }
      }
    }

    event.type = type; // If nobody prevented the default action, do it now

    if (!onlyHandlers && !event.isDefaultPrevented()) {
      if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && acceptData(elem)) {
        // Call a native DOM method on the target with the same name as the event.
        // Don't do default actions on window, that's where global variables be (#6170)
        if (ontype && isFunction(elem[type]) && !isWindow(elem)) {
          // Don't re-trigger an onFOO event when we call its FOO() method
          tmp = elem[ontype];

          if (tmp) {
            elem[ontype] = null;
          } // Prevent re-triggering of the same event, since we already bubbled it above


          jQuery.event.triggered = type;

          if (event.isPropagationStopped()) {
            lastElement.addEventListener(type, stopPropagationCallback);
          }

          elem[type]();

          if (event.isPropagationStopped()) {
            lastElement.removeEventListener(type, stopPropagationCallback);
          }

          jQuery.event.triggered = undefined;

          if (tmp) {
            elem[ontype] = tmp;
          }
        }
      }
    }

    return event.result;
  },
  // Piggyback on a donor event to simulate a different one
  // Used only for `focus(in | out)` events
  simulate: function simulate(type, elem, event) {
    var e = jQuery.extend(new jQuery.Event(), event, {
      type: type,
      isSimulated: true
    });
    jQuery.event.trigger(e, null, elem);
  }
});
jQuery.fn.extend({
  trigger: function trigger(type, data) {
    return this.each(function () {
      jQuery.event.trigger(type, data, this);
    });
  },
  triggerHandler: function triggerHandler(type, data) {
    var elem = this[0];

    if (elem) {
      return jQuery.event.trigger(type, data, elem, true);
    }
  }
}); // Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857

if (!support.focusin) {
  jQuery.each({
    focus: 'focusin',
    blur: 'focusout'
  }, function (orig, fix) {
    // Attach a single capturing handler on the document while someone wants focusin/focusout
    var handler = function handler(event) {
      jQuery.event.simulate(fix, event.target, jQuery.event.fix(event));
    };

    jQuery.event.special[fix] = {
      setup: function setup() {
        var doc = this.ownerDocument || this;
        var attaches = dataPriv.access(doc, fix);

        if (!attaches) {
          doc.addEventListener(orig, handler, true);
        }

        dataPriv.access(doc, fix, (attaches || 0) + 1);
      },
      teardown: function teardown() {
        var doc = this.ownerDocument || this;
        var attaches = dataPriv.access(doc, fix) - 1;

        if (!attaches) {
          doc.removeEventListener(orig, handler, true);
          dataPriv.remove(doc, fix);
        } else {
          dataPriv.access(doc, fix, attaches);
        }
      }
    };
  });
}

var _window2 = window,
    location$1 = _window2.location;
var nonce = Date.now();
var rquery = /\?/; // Cross-browser xml parsing

jQuery.parseXML = function (data) {
  var xml;

  if (!data || typeof data !== 'string') {
    return null;
  } // Support: IE 9 - 11 only
  // IE throws on parseFromString with invalid input.


  try {
    xml = new window.DOMParser().parseFromString(data, 'text/xml');
  } catch (e) {
    xml = undefined;
  }

  if (!xml || xml.getElementsByTagName('parsererror').length) {
    jQuery.error("Invalid XML: ".concat(data));
  }

  return xml;
};

var rbracket = /\[\]$/;
var rCRLF = /\r?\n/g;
var rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i;
var rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams(prefix, obj, traditional, add) {
  var name;

  if (Array.isArray(obj)) {
    // Serialize array item.
    jQuery.each(obj, function (i, v) {
      if (traditional || rbracket.test(prefix)) {
        // Treat each array item as a scalar.
        add(prefix, v);
      } else {
        // Item is non-scalar (array or object), encode its numeric index.
        buildParams("".concat(prefix, "[").concat(_typeof(v) === 'object' && v != null ? i : '', "]"), v, traditional, add);
      }
    });
  } else if (!traditional && toType(obj) === 'object') {
    // Serialize object item.
    for (name in obj) {
      buildParams("".concat(prefix, "[").concat(name, "]"), obj[name], traditional, add);
    }
  } else {
    // Serialize scalar item.
    add(prefix, obj);
  }
} // Serialize an array of form elements or a set of
// key/values into a query string


jQuery.param = function (a, traditional) {
  var prefix;
  var s = [];

  var add = function add(key, valueOrFunction) {
    // If value is a function, invoke it and use its return value
    var value = isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;
    s[s.length] = "".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(value == null ? '' : value));
  };

  if (a == null) {
    return '';
  } // If an array was passed in, assume that it is an array of form elements.


  if (Array.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {
    // Serialize the form elements
    jQuery.each(a, function () {
      add(this.name, this.value);
    });
  } else {
    // If traditional, encode the "old" way (the way 1.3.2 or older
    // did it), otherwise encode params recursively.
    for (prefix in a) {
      buildParams(prefix, a[prefix], traditional, add);
    }
  } // Return the resulting serialization


  return s.join('&');
};

jQuery.fn.extend({
  serialize: function serialize() {
    return jQuery.param(this.serializeArray());
  },
  serializeArray: function serializeArray() {
    return this.map(function () {
      // Can add propHook for "elements" to filter or add form elements
      var elements = jQuery.prop(this, 'elements');
      return elements ? jQuery.makeArray(elements) : this;
    }).filter(function () {
      var type = this.type; // Use .is( ":disabled" ) so that fieldset[disabled] works

      return this.name && !jQuery(this).is(':disabled') && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
    }).map(function (i, elem) {
      var val = jQuery(this).val();

      if (val == null) {
        return null;
      }

      if (Array.isArray(val)) {
        return jQuery.map(val, function (val) {
          return {
            name: elem.name,
            value: val.replace(rCRLF, '\r\n')
          };
        });
      }

      return {
        name: elem.name,
        value: val.replace(rCRLF, '\r\n')
      };
    }).get();
  }
});
var r20 = /%20/g;
var rhash = /#.*$/;
var rantiCache = /([?&])_=[^&]*/;
var rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg; // #7653, #8125, #8152: local protocol detection

var rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/;
var rnoContent = /^(?:GET|HEAD)$/;
var rprotocol = /^\/\//;
/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */

var prefilters = {};
/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */

var transports = {}; // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression

var allTypes = '*/'.concat('*'); // Anchor tag for parsing the document origin

var originAnchor = document$1.createElement('a');
originAnchor.href = location$1.href; // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport

function addToPrefiltersOrTransports(structure) {
  // dataTypeExpression is optional and defaults to "*"
  return function (dataTypeExpression, func) {
    if (typeof dataTypeExpression !== 'string') {
      func = dataTypeExpression;
      dataTypeExpression = '*';
    }

    var dataType;
    var i = 0;
    var dataTypes = dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];

    if (isFunction(func)) {
      // For each dataType in the dataTypeExpression
      while (dataType = dataTypes[i++]) {
        // Prepend if requested
        if (dataType[0] === '+') {
          dataType = dataType.slice(1) || '*';
          (structure[dataType] = structure[dataType] || []).unshift(func); // Otherwise append
        } else {
          (structure[dataType] = structure[dataType] || []).push(func);
        }
      }
    }
  };
} // Base inspection function for prefilters and transports


function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
  var inspected = {};
  var seekingTransport = structure === transports;

  function inspect(dataType) {
    var selected;
    inspected[dataType] = true;
    jQuery.each(structure[dataType] || [], function (_, prefilterOrFactory) {
      var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);

      if (typeof dataTypeOrTransport === 'string' && !seekingTransport && !inspected[dataTypeOrTransport]) {
        options.dataTypes.unshift(dataTypeOrTransport);
        inspect(dataTypeOrTransport);
        return false;
      }

      if (seekingTransport) {
        return !(selected = dataTypeOrTransport);
      }
    });
    return selected;
  }

  return inspect(options.dataTypes[0]) || !inspected['*'] && inspect('*');
} // A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887


function ajaxExtend(target, src) {
  var key;
  var deep;
  var flatOptions = jQuery.ajaxSettings.flatOptions || {};

  for (key in src) {
    if (src[key] !== undefined) {
      (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
    }
  }

  if (deep) {
    jQuery.extend(true, target, deep);
  }

  return target;
}
/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */


function ajaxHandleResponses(s, jqXHR, responses) {
  var ct;
  var type;
  var finalDataType;
  var firstDataType;
  var contents = s.contents;
  var dataTypes = s.dataTypes; // Remove auto dataType and get content-type in the process

  while (dataTypes[0] === '*') {
    dataTypes.shift();

    if (ct === undefined) {
      ct = s.mimeType || jqXHR.getResponseHeader('Content-Type');
    }
  } // Check if we're dealing with a known content-type


  if (ct) {
    for (type in contents) {
      if (contents[type] && contents[type].test(ct)) {
        dataTypes.unshift(type);
        break;
      }
    }
  } // Check to see if we have a response for the expected dataType


  if (dataTypes[0] in responses) {
    finalDataType = dataTypes[0];
  } else {
    // Try convertible dataTypes
    for (type in responses) {
      if (!dataTypes[0] || s.converters["".concat(type, " ").concat(dataTypes[0])]) {
        finalDataType = type;
        break;
      }

      if (!firstDataType) {
        firstDataType = type;
      }
    } // Or just use first one


    finalDataType = finalDataType || firstDataType;
  } // If we found a dataType
  // We add the dataType to the list if needed
  // and return the corresponding response


  if (finalDataType) {
    if (finalDataType !== dataTypes[0]) {
      dataTypes.unshift(finalDataType);
    }

    return responses[finalDataType];
  }
}
/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */


function ajaxConvert(s, response, jqXHR, isSuccess) {
  var conv2;
  var current;
  var conv;
  var tmp;
  var prev;
  var converters = {}; // Work with a copy of dataTypes in case we need to modify it for conversion

  var dataTypes = s.dataTypes.slice(); // Create converters map with lowercased keys

  if (dataTypes[1]) {
    for (conv in s.converters) {
      converters[conv.toLowerCase()] = s.converters[conv];
    }
  }

  current = dataTypes.shift(); // Convert to each sequential dataType

  while (current) {
    if (s.responseFields[current]) {
      jqXHR[s.responseFields[current]] = response;
    } // Apply the dataFilter if provided


    if (!prev && isSuccess && s.dataFilter) {
      response = s.dataFilter(response, s.dataType);
    }

    prev = current;
    current = dataTypes.shift();

    if (current) {
      // There's only work to do if current dataType is non-auto
      if (current === '*') {
        current = prev; // Convert response if prev dataType is non-auto and differs from current
      } else if (prev !== '*' && prev !== current) {
        // Seek a direct converter
        conv = converters["".concat(prev, " ").concat(current)] || converters["* ".concat(current)]; // If none found, seek a pair

        if (!conv) {
          for (conv2 in converters) {
            // If conv2 outputs current
            tmp = conv2.split(' ');

            if (tmp[1] === current) {
              // If prev can be converted to accepted input
              conv = converters["".concat(prev, " ").concat(tmp[0])] || converters["* ".concat(tmp[0])];

              if (conv) {
                // Condense equivalence converters
                if (conv === true) {
                  conv = converters[conv2]; // Otherwise, insert the intermediate dataType
                } else if (converters[conv2] !== true) {
                  current = tmp[0];
                  dataTypes.unshift(tmp[1]);
                }

                break;
              }
            }
          }
        } // Apply converter (if not an equivalence)


        if (conv !== true) {
          // Unless errors are allowed to bubble, catch and return them
          if (conv && s["throws"]) {
            response = conv(response);
          } else {
            try {
              response = conv(response);
            } catch (e) {
              return {
                state: 'parsererror',
                error: conv ? e : "No conversion from ".concat(prev, " to ").concat(current)
              };
            }
          }
        }
      }
    }
  }

  return {
    state: 'success',
    data: response
  };
}

jQuery.extend({
  // Counter for holding the number of active queries
  active: 0,
  // Last-Modified header cache for next request
  lastModified: {},
  etag: {},
  ajaxSettings: {
    url: location$1.href,
    type: 'GET',
    isLocal: rlocalProtocol.test(location$1.protocol),
    global: true,
    processData: true,
    async: true,
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',

    /*
    timeout: 0,
    data: null,
    dataType: null,
    username: null,
    password: null,
    cache: null,
    throws: false,
    traditional: false,
    headers: {},
    */
    accepts: {
      '*': allTypes,
      text: 'text/plain',
      html: 'text/html',
      xml: 'application/xml, text/xml',
      json: 'application/json, text/javascript'
    },
    contents: {
      xml: /\bxml\b/,
      html: /\bhtml/,
      json: /\bjson\b/
    },
    responseFields: {
      xml: 'responseXML',
      text: 'responseText',
      json: 'responseJSON'
    },
    // Data converters
    // Keys separate source (or catchall "*") and destination types with a single space
    converters: {
      // Convert anything to text
      '* text': String,
      // Text to html (true = no transformation)
      'text html': true,
      // Evaluate text as a json expression
      'text json': JSON.parse,
      // Parse text as xml
      'text xml': jQuery.parseXML
    },
    // For options that shouldn't be deep extended:
    // you can add your own custom options here if
    // and when you create one that shouldn't be
    // deep extended (see ajaxExtend)
    flatOptions: {
      url: true,
      context: true
    }
  },
  // Creates a full fledged settings object into target
  // with both ajaxSettings and settings fields.
  // If target is omitted, writes into ajaxSettings.
  ajaxSetup: function ajaxSetup(target, settings) {
    return settings // Building a settings object
    ? ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) // Extending ajaxSettings
    : ajaxExtend(jQuery.ajaxSettings, target);
  },
  ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
  ajaxTransport: addToPrefiltersOrTransports(transports),
  // Main method
  ajax: function ajax(url, options) {
    // If url is an object, simulate pre-1.5 signature
    if (_typeof(url) === 'object') {
      options = url;
      url = undefined;
    } // Force options to be an object


    options = options || {};
    var transport; // URL without anti-cache param

    var cacheURL; // Response headers

    var responseHeadersString;
    var responseHeaders; // timeout handle

    var timeoutTimer; // Url cleanup var

    var urlAnchor; // Request state (becomes false upon send and true upon completion)

    var completed; // To know if global events are to be dispatched

    var fireGlobals; // Loop variable

    var i; // uncached part of the url

    var uncached; // Create the final options object

    var s = jQuery.ajaxSetup({}, options); // Callbacks context

    var callbackContext = s.context || s; // Context for global events is callbackContext if it is a DOM node or jQuery collection

    var globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event; // Deferreds

    var deferred = jQuery.Deferred();
    var completeDeferred = jQuery.Callbacks('once memory'); // Status-dependent callbacks

    var _statusCode = s.statusCode || {}; // Headers (they are sent all at once)


    var requestHeaders = {};
    var requestHeadersNames = {}; // Default abort message

    var strAbort = 'canceled'; // Fake xhr

    var jqXHR = {
      readyState: 0,
      // Builds headers hashtable if needed
      getResponseHeader: function getResponseHeader(key) {
        var match;

        if (completed) {
          if (!responseHeaders) {
            responseHeaders = {};

            while (match = rheaders.exec(responseHeadersString)) {
              responseHeaders["".concat(match[1].toLowerCase(), " ")] = (responseHeaders["".concat(match[1].toLowerCase(), " ")] || []).concat(match[2]);
            }
          }

          match = responseHeaders["".concat(key.toLowerCase(), " ")];
        }

        return match == null ? null : match.join(', ');
      },
      // Raw string
      getAllResponseHeaders: function getAllResponseHeaders() {
        return completed ? responseHeadersString : null;
      },
      // Caches the header
      setRequestHeader: function setRequestHeader(name, value) {
        if (completed == null) {
          name = requestHeadersNames[name.toLowerCase()] = requestHeadersNames[name.toLowerCase()] || name;
          requestHeaders[name] = value;
        }

        return this;
      },
      // Overrides response content-type header
      overrideMimeType: function overrideMimeType(type) {
        if (completed == null) {
          s.mimeType = type;
        }

        return this;
      },
      // Status-dependent callbacks
      statusCode: function statusCode(map) {
        var code;

        if (map) {
          if (completed) {
            // Execute the appropriate callbacks
            jqXHR.always(map[jqXHR.status]);
          } else {
            // Lazy-add the new callbacks in a way that preserves old ones
            for (code in map) {
              _statusCode[code] = [_statusCode[code], map[code]];
            }
          }
        }

        return this;
      },
      // Cancel the request
      abort: function abort(statusText) {
        var finalText = statusText || strAbort;

        if (transport) {
          transport.abort(finalText);
        }

        done(0, finalText);
        return this;
      }
    }; // Attach deferreds

    deferred.promise(jqXHR); // Add protocol if not provided (prefilters might expect it)
    // Handle falsy url in the settings object (#10093: consistency with old signature)
    // We also use the url parameter if available

    s.url = "".concat(url || s.url || location$1.href).replace(rprotocol, "".concat(location$1.protocol, "//")); // Alias method option to type as per ticket #12004

    s.type = options.method || options.type || s.method || s.type; // Extract dataTypes list

    s.dataTypes = (s.dataType || '*').toLowerCase().match(rnothtmlwhite) || ['']; // A cross-domain request is in order when the origin doesn't match the current origin.

    if (s.crossDomain == null) {
      urlAnchor = document$1.createElement('a'); // Support: IE <=8 - 11, Edge 12 - 15
      // IE throws exception on accessing the href property if url is malformed,
      // e.g. http://example.com:80x/

      try {
        urlAnchor.href = s.url; // Support: IE <=8 - 11 only
        // Anchor's host property isn't correctly set when s.url is relative

        urlAnchor.href = urlAnchor.href;
        s.crossDomain = "".concat(originAnchor.protocol, "//").concat(originAnchor.host) !== "".concat(urlAnchor.protocol, "//").concat(urlAnchor.host);
      } catch (e) {
        // If there is an error parsing the URL, assume it is crossDomain,
        // it can be rejected by the transport if it is invalid
        s.crossDomain = true;
      }
    } // Convert data if not already a string


    if (s.data && s.processData && typeof s.data !== 'string') {
      s.data = jQuery.param(s.data, s.traditional);
    } // Apply prefilters


    inspectPrefiltersOrTransports(prefilters, s, options, jqXHR); // If request was aborted inside a prefilter, stop there

    if (completed) {
      return jqXHR;
    } // We can fire global events as of now if asked to
    // Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)


    fireGlobals = jQuery.event && s.global; // Watch for a new set of requests

    if (fireGlobals && jQuery.active++ === 0) {
      jQuery.event.trigger('ajaxStart');
    } // Uppercase the type


    s.type = s.type.toUpperCase(); // Determine if request has content

    s.hasContent = !rnoContent.test(s.type); // Save the URL in case we're toying with the If-Modified-Since
    // and/or If-None-Match header later on
    // Remove hash to simplify url manipulation

    cacheURL = s.url.replace(rhash, ''); // More options handling for requests with no content

    if (!s.hasContent) {
      // Remember the hash so we can put it back
      uncached = s.url.slice(cacheURL.length); // If data is available and should be processed, append data to url

      if (s.data && (s.processData || typeof s.data === 'string')) {
        cacheURL += (rquery.test(cacheURL) ? '&' : '?') + s.data; // #9682: remove data so that it's not used in an eventual retry

        delete s.data;
      } // Add or update anti-cache param if needed


      if (s.cache === false) {
        cacheURL = cacheURL.replace(rantiCache, '$1');
        uncached = "".concat(rquery.test(cacheURL) ? '&' : '?', "_=").concat(nonce++).concat(uncached);
      } // Put hash and anti-cache on the URL that will be requested (gh-1732)


      s.url = cacheURL + uncached; // Change '%20' to '+' if this is encoded form body content (gh-2658)
    } else if (s.data && s.processData && (s.contentType || '').indexOf('application/x-www-form-urlencoded') === 0) {
      s.data = s.data.replace(r20, '+');
    } // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.


    if (s.ifModified) {
      if (jQuery.lastModified[cacheURL]) {
        jqXHR.setRequestHeader('If-Modified-Since', jQuery.lastModified[cacheURL]);
      }

      if (jQuery.etag[cacheURL]) {
        jqXHR.setRequestHeader('If-None-Match', jQuery.etag[cacheURL]);
      }
    } // Set the correct header, if data is being sent


    if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
      jqXHR.setRequestHeader('Content-Type', s.contentType);
    } // Set the Accepts header for the server, depending on the dataType


    jqXHR.setRequestHeader('Accept', s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== '*' ? ", ".concat(allTypes, "; q=0.01") : '') : s.accepts['*']); // Check for headers option

    for (i in s.headers) {
      jqXHR.setRequestHeader(i, s.headers[i]);
    } // Allow custom headers/mimetypes and early abort


    if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || completed)) {
      // Abort if not done already and return
      return jqXHR.abort();
    } // Aborting is no longer a cancellation


    strAbort = 'abort'; // Install callbacks on deferreds

    completeDeferred.add(s.complete);
    jqXHR.done(s.success);
    jqXHR.fail(s.error); // Get transport

    transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR); // If no transport, we auto-abort

    if (!transport) {
      done(-1, 'No Transport');
    } else {
      jqXHR.readyState = 1; // Send global event

      if (fireGlobals) {
        globalEventContext.trigger('ajaxSend', [jqXHR, s]);
      } // If request was aborted inside ajaxSend, stop there


      if (completed) {
        return jqXHR;
      } // Timeout


      if (s.async && s.timeout > 0) {
        timeoutTimer = window.setTimeout(function () {
          jqXHR.abort('timeout');
        }, s.timeout);
      }

      try {
        completed = false;
        transport.send(requestHeaders, done);
      } catch (e) {
        // Rethrow post-completion exceptions
        if (completed) {
          throw e;
        } // Propagate others as results


        done(-1, e);
      }
    } // Callback for when everything is done


    function done(status, nativeStatusText, responses, headers) {
      var isSuccess;
      var success;
      var error;
      var response;
      var modified;
      var statusText = nativeStatusText; // Ignore repeat invocations

      if (completed) {
        return;
      }

      completed = true; // Clear timeout if it exists

      if (timeoutTimer) {
        window.clearTimeout(timeoutTimer);
      } // Dereference transport for early garbage collection
      // (no matter how long the jqXHR object will be used)


      transport = undefined; // Cache response headers

      responseHeadersString = headers || ''; // Set readyState

      jqXHR.readyState = status > 0 ? 4 : 0; // Determine if successful

      isSuccess = status >= 200 && status < 300 || status === 304; // Get response data

      if (responses) {
        response = ajaxHandleResponses(s, jqXHR, responses);
      } // Convert no matter what (that way responseXXX fields are always set)


      response = ajaxConvert(s, response, jqXHR, isSuccess); // If successful, handle type chaining

      if (isSuccess) {
        // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
        if (s.ifModified) {
          modified = jqXHR.getResponseHeader('Last-Modified');

          if (modified) {
            jQuery.lastModified[cacheURL] = modified;
          }

          modified = jqXHR.getResponseHeader('etag');

          if (modified) {
            jQuery.etag[cacheURL] = modified;
          }
        } // if no content


        if (status === 204 || s.type === 'HEAD') {
          statusText = 'nocontent'; // if not modified
        } else if (status === 304) {
          statusText = 'notmodified'; // If we have data, let's convert it
        } else {
          statusText = response.state;
          success = response.data;
          error = response.error;
          isSuccess = !error;
        }
      } else {
        // Extract error from statusText and normalize for non-aborts
        error = statusText;

        if (status || !statusText) {
          statusText = 'error';

          if (status < 0) {
            status = 0;
          }
        }
      } // Set data for the fake xhr object


      jqXHR.status = status;
      jqXHR.statusText = "".concat(nativeStatusText || statusText); // Success/Error

      if (isSuccess) {
        deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
      } else {
        deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
      } // Status-dependent callbacks


      jqXHR.statusCode(_statusCode);
      _statusCode = undefined;

      if (fireGlobals) {
        globalEventContext.trigger(isSuccess ? 'ajaxSuccess' : 'ajaxError', [jqXHR, s, isSuccess ? success : error]);
      } // Complete


      completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

      if (fireGlobals) {
        globalEventContext.trigger('ajaxComplete', [jqXHR, s]); // Handle the global AJAX counter

        if (! --jQuery.active) {
          jQuery.event.trigger('ajaxStop');
        }
      }
    }

    return jqXHR;
  },
  getJSON: function getJSON(url, data, callback) {
    return jQuery.get(url, data, callback, 'json');
  },
  getScript: function getScript(url, callback) {
    return jQuery.get(url, undefined, callback, 'script');
  }
});
jQuery.each(['get', 'post'], function (i, method) {
  jQuery[method] = function (url, data, callback, type) {
    // Shift arguments if data argument was omitted
    if (isFunction(data)) {
      type = type || callback;
      callback = data;
      data = undefined;
    } // The url can be an options object (which then must have .url)


    return jQuery.ajax(jQuery.extend({
      url: url,
      type: method,
      dataType: type,
      data: data,
      success: callback
    }, jQuery.isPlainObject(url) && url));
  };
});

jQuery._evalUrl = function (url, options) {
  return jQuery.ajax({
    url: url,
    // Make this explicit, since user can override this through ajaxSetup (#11264)
    type: 'GET',
    dataType: 'script',
    cache: true,
    async: false,
    global: false,
    // Only evaluate the response if it is successful (gh-4126)
    // dataFilter is not invoked for failure responses, so using it instead
    // of the default converter is kludgy but it works.
    converters: {
      'text script': function textScript() {}
    },
    dataFilter: function dataFilter(response) {
      jQuery.globalEval(response, options);
    }
  });
};

jQuery.fn.extend({
  wrapAll: function wrapAll(html) {
    var wrap;

    if (this[0]) {
      if (isFunction(html)) {
        html = html.call(this[0]);
      } // The elements to wrap the target around


      wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);

      if (this[0].parentNode) {
        wrap.insertBefore(this[0]);
      }

      wrap.map(function () {
        var elem = this;

        while (elem.firstElementChild) {
          elem = elem.firstElementChild;
        }

        return elem;
      }).append(this);
    }

    return this;
  },
  wrapInner: function wrapInner(html) {
    if (isFunction(html)) {
      return this.each(function (i) {
        jQuery(this).wrapInner(html.call(this, i));
      });
    }

    return this.each(function () {
      var self = jQuery(this);
      var contents = self.contents();

      if (contents.length) {
        contents.wrapAll(html);
      } else {
        self.append(html);
      }
    });
  },
  wrap: function wrap(html) {
    var htmlIsFunction = isFunction(html);
    return this.each(function (i) {
      jQuery(this).wrapAll(htmlIsFunction ? html.call(this, i) : html);
    });
  },
  unwrap: function unwrap(selector) {
    this.parent(selector).not('body').each(function () {
      jQuery(this).replaceWith(this.childNodes);
    });
    return this;
  }
});

jQuery.expr.pseudos.hidden = function (elem) {
  return !jQuery.expr.pseudos.visible(elem);
};

jQuery.expr.pseudos.visible = function (elem) {
  return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
};

jQuery.ajaxSettings.xhr = function () {
  try {
    return new window.XMLHttpRequest();
  } catch (e) {}
};

var xhrSuccessStatus = {
  // File protocol always yields status code 0, assume 200
  0: 200,
  // Support: IE <=9 only
  // #1450: sometimes IE returns 1223 when it should be 204
  1223: 204
};
var xhrSupported = jQuery.ajaxSettings.xhr();
support.cors = !!xhrSupported && 'withCredentials' in xhrSupported;
support.ajax = xhrSupported = !!xhrSupported;
jQuery.ajaxTransport(function (options) {
  var _callback;

  var errorCallback; // Cross domain only allowed if supported through XMLHttpRequest

  if (support.cors || xhrSupported && !options.crossDomain) {
    return {
      send: function send(headers, complete) {
        var i;
        var xhr = options.xhr();
        xhr.open(options.type, options.url, options.async, options.username, options.password); // Apply custom fields if provided

        if (options.xhrFields) {
          for (i in options.xhrFields) {
            xhr[i] = options.xhrFields[i];
          }
        } // Override mime type if needed


        if (options.mimeType && xhr.overrideMimeType) {
          xhr.overrideMimeType(options.mimeType);
        } // X-Requested-With header
        // For cross-domain requests, seeing as conditions for a preflight are
        // akin to a jigsaw puzzle, we simply never set it to be sure.
        // (it can always be set on a per-request basis or even using ajaxSetup)
        // For same-domain requests, won't change header if already provided.


        if (!options.crossDomain && !headers['X-Requested-With']) {
          headers['X-Requested-With'] = 'XMLHttpRequest';
        } // Set headers


        for (i in headers) {
          xhr.setRequestHeader(i, headers[i]);
        } // Callback


        _callback = function callback(type) {
          return function () {
            if (_callback) {
              _callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.ontimeout = xhr.onreadystatechange = null;

              if (type === 'abort') {
                xhr.abort();
              } else if (type === 'error') {
                // Support: IE <=9 only
                // On a manual native abort, IE9 throws
                // errors on any property access that is not readyState
                if (typeof xhr.status !== 'number') {
                  complete(0, 'error');
                } else {
                  complete( // File: protocol always yields status 0; see #8605, #14207
                  xhr.status, xhr.statusText);
                }
              } else {
                complete(xhrSuccessStatus[xhr.status] || xhr.status, xhr.statusText, // Support: IE <=9 only
                // IE9 has no XHR2 but throws on binary (trac-11426)
                // For XHR2 non-text, let the caller handle it (gh-2498)
                (xhr.responseType || 'text') !== 'text' || typeof xhr.responseText !== 'string' ? {
                  binary: xhr.response
                } : {
                  text: xhr.responseText
                }, xhr.getAllResponseHeaders());
              }
            }
          };
        }; // Listen to events


        xhr.onload = _callback();
        errorCallback = xhr.onerror = xhr.ontimeout = _callback('error'); // Support: IE 9 only
        // Use onreadystatechange to replace onabort
        // to handle uncaught aborts

        if (xhr.onabort !== undefined) {
          xhr.onabort = errorCallback;
        } else {
          xhr.onreadystatechange = function () {
            // Check readyState before timeout as it changes
            if (xhr.readyState === 4) {
              // Allow onerror to be called first,
              // but that will not handle a native abort
              // Also, save errorCallback to a variable
              // as xhr.onerror cannot be accessed
              window.setTimeout(function () {
                if (_callback) {
                  errorCallback();
                }
              });
            }
          };
        } // Create the abort callback


        _callback = _callback('abort');

        try {
          // Do send the request (this may raise an exception)
          xhr.send(options.hasContent && options.data || null);
        } catch (e) {
          // #14683: Only rethrow if this hasn't been notified as an error yet
          if (_callback) {
            throw e;
          }
        }
      },
      abort: function abort() {
        if (_callback) {
          _callback();
        }
      }
    };
  }
}); // Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)

jQuery.ajaxPrefilter(function (s) {
  if (s.crossDomain) {
    s.contents.script = false;
  }
}); // Install script dataType

jQuery.ajaxSetup({
  accepts: {
    script: 'text/javascript, application/javascript, ' + 'application/ecmascript, application/x-ecmascript'
  },
  contents: {
    script: /\b(?:java|ecma)script\b/
  },
  converters: {
    'text script': function textScript(text) {
      jQuery.globalEval(text);
      return text;
    }
  }
}); // Handle cache's special case and crossDomain

jQuery.ajaxPrefilter('script', function (s) {
  if (s.cache === undefined) {
    s.cache = false;
  }

  if (s.crossDomain) {
    s.type = 'GET';
  }
}); // Bind script tag hack transport

jQuery.ajaxTransport('script', function (s) {
  // This transport only deals with cross domain or forced-by-attrs requests
  if (s.crossDomain || s.scriptAttrs) {
    var script;

    var _callback2;

    return {
      send: function send(_, complete) {
        script = jQuery('<script>').attr(s.scriptAttrs || {}).prop({
          charset: s.scriptCharset,
          src: s.url
        }).on('load error', _callback2 = function callback(evt) {
          script.remove();
          _callback2 = null;

          if (evt) {
            complete(evt.type === 'error' ? 404 : 200, evt.type);
          }
        }); // Use native DOM manipulation to avoid our domManip AJAX trickery

        document$1.head.appendChild(script[0]);
      },
      abort: function abort() {
        if (_callback2) {
          _callback2();
        }
      }
    };
  }
});
var oldCallbacks = [];
var rjsonp = /(=)\?(?=&|$)|\?\?/; // Default jsonp settings

jQuery.ajaxSetup({
  jsonp: 'callback',
  jsonpCallback: function jsonpCallback() {
    var callback = oldCallbacks.pop() || "".concat(jQuery.expando, "_").concat(nonce++);
    this[callback] = true;
    return callback;
  }
}); // Detect, normalize options and install callbacks for jsonp requests

jQuery.ajaxPrefilter('json jsonp', function (s, originalSettings, jqXHR) {
  var callbackName;
  var overwritten;
  var responseContainer;
  var jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? 'url' : typeof s.data === 'string' && (s.contentType || '').indexOf('application/x-www-form-urlencoded') === 0 && rjsonp.test(s.data) && 'data'); // Handle iff the expected data type is "jsonp" or we have a parameter to set

  if (jsonProp || s.dataTypes[0] === 'jsonp') {
    // Get callback name, remembering preexisting value associated with it
    callbackName = s.jsonpCallback = isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback; // Insert callback into url or form data

    if (jsonProp) {
      s[jsonProp] = s[jsonProp].replace(rjsonp, "$1".concat(callbackName));
    } else if (s.jsonp !== false) {
      s.url += "".concat((rquery.test(s.url) ? '&' : '?') + s.jsonp, "=").concat(callbackName);
    } // Use data converter to retrieve json after script execution


    s.converters['script json'] = function () {
      if (!responseContainer) {
        jQuery.error("".concat(callbackName, " was not called"));
      }

      return responseContainer[0];
    }; // Force json dataType


    s.dataTypes[0] = 'json'; // Install callback

    overwritten = window[callbackName];

    window[callbackName] = function () {
      responseContainer = arguments;
    }; // Clean-up function (fires after converters)


    jqXHR.always(function () {
      // If previous value didn't exist - remove it
      if (overwritten === undefined) {
        jQuery(window).removeProp(callbackName); // Otherwise restore preexisting value
      } else {
        window[callbackName] = overwritten;
      } // Save back as free


      if (s[callbackName]) {
        // Make sure that re-using the options doesn't screw things around
        s.jsonpCallback = originalSettings.jsonpCallback; // Save the callback name for future use

        oldCallbacks.push(callbackName);
      } // Call if it was a function and we have a response


      if (responseContainer && isFunction(overwritten)) {
        overwritten(responseContainer[0]);
      }

      responseContainer = overwritten = undefined;
    }); // Delegate to script

    return 'script';
  }
}); // Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337

support.createHTMLDocument = function () {
  var _document$implementat = document$1.implementation.createHTMLDocument(''),
      body = _document$implementat.body;

  body.innerHTML = '<form></form><form></form>';
  return body.childNodes.length === 2;
}(); // Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string


jQuery.parseHTML = function (data, context, keepScripts) {
  if (typeof data !== 'string') {
    return [];
  }

  if (typeof context === 'boolean') {
    keepScripts = context;
    context = false;
  }

  var base;
  var parsed;
  var scripts;

  if (!context) {
    // Stop scripts or inline event handlers from being executed immediately
    // by using document.implementation
    if (support.createHTMLDocument) {
      context = document$1.implementation.createHTMLDocument(''); // Set the base href for the created document
      // so any parsed elements with URLs
      // are based on the document's URL (gh-2965)

      base = context.createElement('base');
      base.href = document$1.location.href;
      context.head.appendChild(base);
    } else {
      context = document$1;
    }
  }

  parsed = rsingleTag.exec(data);
  scripts = !keepScripts && []; // Single tag

  if (parsed) {
    return [context.createElement(parsed[1])];
  }

  parsed = buildFragment([data], context, scripts);

  if (scripts && scripts.length) {
    jQuery(scripts).remove();
  }

  return jQuery.merge([], parsed.childNodes);
};
/**
 * Load a url into a page
 */


jQuery.fn.load = function (url, params, callback) {
  var selector;
  var type;
  var response;
  var self = this;
  var off = url.indexOf(' ');

  if (off > -1) {
    selector = stripAndCollapse(url.slice(off));
    url = url.slice(0, off);
  } // If it's a function


  if (isFunction(params)) {
    // We assume that it's the callback
    callback = params;
    params = undefined; // Otherwise, build a param string
  } else if (params && _typeof(params) === 'object') {
    type = 'POST';
  } // If we have elements to modify, make the request


  if (self.length > 0) {
    jQuery.ajax({
      url: url,
      // If "type" variable is undefined, then "GET" method will be used.
      // Make value of this field explicit since
      // user can override it through ajaxSetup method
      type: type || 'GET',
      dataType: 'html',
      data: params
    }).done(function (responseText) {
      // Save response for use in complete callback
      response = arguments;
      self.html(selector // If a selector was specified, locate the right elements in a dummy div
      // Exclude scripts to avoid IE 'Permission Denied' errors
      ? jQuery('<div>').append(jQuery.parseHTML(responseText)).find(selector) // Otherwise use the full result
      : responseText); // If the request succeeds, this function gets "data", "status", "jqXHR"
      // but they are ignored because response was set above.
      // If it fails, this function gets "jqXHR", "status", "error"
    }).always(callback && function (jqXHR, status) {
      self.each(function () {
        callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
      });
    });
  }

  return this;
}; // Attach a bunch of functions for handling common AJAX events


jQuery.each(['ajaxStart', 'ajaxStop', 'ajaxComplete', 'ajaxError', 'ajaxSuccess', 'ajaxSend'], function (i, type) {
  jQuery.fn[type] = function (fn) {
    return this.on(type, fn);
  };
});

jQuery.expr.pseudos.animated = function (elem) {
  return jQuery.grep(jQuery.timers, function (fn) {
    return elem === fn.elem;
  }).length;
};

jQuery.offset = {
  setOffset: function setOffset(elem, options, i) {
    var curPosition;
    var curLeft;
    var curCSSTop;
    var curTop;
    var curOffset;
    var curCSSLeft;
    var calculatePosition;
    var position = jQuery.css(elem, 'position');
    var curElem = jQuery(elem);
    var props = {}; // Set position first, in-case top/left are set even on static elem

    if (position === 'static') {
      elem.style.position = 'relative';
    }

    curOffset = curElem.offset();
    curCSSTop = jQuery.css(elem, 'top');
    curCSSLeft = jQuery.css(elem, 'left');
    calculatePosition = (position === 'absolute' || position === 'fixed') && (curCSSTop + curCSSLeft).indexOf('auto') > -1; // Need to be able to calculate position if either
    // top or left is auto and position is either absolute or fixed

    if (calculatePosition) {
      curPosition = curElem.position();
      curTop = curPosition.top;
      curLeft = curPosition.left;
    } else {
      curTop = parseFloat(curCSSTop) || 0;
      curLeft = parseFloat(curCSSLeft) || 0;
    }

    if (isFunction(options)) {
      // Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
      options = options.call(elem, i, jQuery.extend({}, curOffset));
    }

    if (options.top != null) {
      props.top = options.top - curOffset.top + curTop;
    }

    if (options.left != null) {
      props.left = options.left - curOffset.left + curLeft;
    }

    if ('using' in options) {
      options.using.call(elem, props);
    } else {
      curElem.css(props);
    }
  }
};
jQuery.fn.extend({
  // offset() relates an element's border box to the document origin
  offset: function offset(options) {
    // Preserve chaining for setter
    if (arguments.length) {
      return options === undefined ? this : this.each(function (i) {
        jQuery.offset.setOffset(this, options, i);
      });
    }

    var rect;
    var win;
    var elem = this[0];

    if (!elem) {
      return;
    } // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
    // Support: IE <=11 only
    // Running getBoundingClientRect on a
    // disconnected node in IE throws an error


    if (!elem.getClientRects().length) {
      return {
        top: 0,
        left: 0
      };
    } // Get document-relative position by adding viewport scroll to viewport-relative gBCR


    rect = elem.getBoundingClientRect();
    win = elem.ownerDocument.defaultView;
    return {
      top: rect.top + win.pageYOffset,
      left: rect.left + win.pageXOffset
    };
  },
  // position() relates an element's margin box to its offset parent's padding box
  // This corresponds to the behavior of CSS absolute positioning
  position: function position() {
    if (!this[0]) {
      return;
    }

    var offsetParent;
    var offset;
    var doc;
    var elem = this[0];
    var parentOffset = {
      top: 0,
      left: 0
    }; // position:fixed elements are offset from the viewport, which itself always has zero offset

    if (jQuery.css(elem, 'position') === 'fixed') {
      // Assume position:fixed implies availability of getBoundingClientRect
      offset = elem.getBoundingClientRect();
    } else {
      offset = this.offset(); // Account for the *real* offset parent, which can be the document or its root element
      // when a statically positioned element is identified

      doc = elem.ownerDocument;
      offsetParent = elem.offsetParent || doc.documentElement;

      while (offsetParent && (offsetParent === doc.body || offsetParent === doc.documentElement) && jQuery.css(offsetParent, 'position') === 'static') {
        offsetParent = offsetParent.parentNode;
      }

      if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
        // Incorporate borders into its offset, since they are outside its content origin
        parentOffset = jQuery(offsetParent).offset();
        parentOffset.top += jQuery.css(offsetParent, 'borderTopWidth', true);
        parentOffset.left += jQuery.css(offsetParent, 'borderLeftWidth', true);
      }
    } // Subtract parent offsets and element margins


    return {
      top: offset.top - parentOffset.top - jQuery.css(elem, 'marginTop', true),
      left: offset.left - parentOffset.left - jQuery.css(elem, 'marginLeft', true)
    };
  },
  // This method will return documentElement in the following cases:
  // 1) For the element inside the iframe without offsetParent, this method will return
  //    documentElement of the parent window
  // 2) For the hidden or detached element
  // 3) For body or html element, i.e. in case of the html node - it will return itself
  //
  // but those exceptions were never presented as a real life use-cases
  // and might be considered as more preferable results.
  //
  // This logic, however, is not guaranteed and can change at any point in the future
  offsetParent: function offsetParent() {
    return this.map(function () {
      var offsetParent = this.offsetParent;

      while (offsetParent && jQuery.css(offsetParent, 'position') === 'static') {
        offsetParent = offsetParent.offsetParent;
      }

      return offsetParent || documentElement;
    });
  }
}); // Create scrollLeft and scrollTop methods

jQuery.each({
  scrollLeft: 'pageXOffset',
  scrollTop: 'pageYOffset'
}, function (method, prop) {
  var top = prop === 'pageYOffset';

  jQuery.fn[method] = function (val) {
    return access(this, function (elem, method, val) {
      // Coalesce documents and windows
      var win;

      if (isWindow(elem)) {
        win = elem;
      } else if (elem.nodeType === 9) {
        win = elem.defaultView;
      }

      if (val === undefined) {
        return win ? win[prop] : elem[method];
      }

      if (win) {
        win.scrollTo(!top ? val : win.pageXOffset, top ? val : win.pageYOffset);
      } else {
        elem[method] = val;
      }
    }, method, val, arguments.length);
  };
}); // Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here

jQuery.each(['top', 'left'], function (i, prop) {
  jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function (elem, computed) {
    if (computed) {
      computed = curCSS(elem, prop); // If curCSS returns percentage, fallback to offset

      return rnumnonpx.test(computed) ? "".concat(jQuery(elem).position()[prop], "px") : computed;
    }
  });
}); // Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods

jQuery.each({
  Height: 'height',
  Width: 'width'
}, function (name, type) {
  jQuery.each({
    padding: "inner".concat(name),
    content: type,
    '': "outer".concat(name)
  }, function (defaultExtra, funcName) {
    // Margin is only for outerHeight, outerWidth
    jQuery.fn[funcName] = function (margin, value) {
      var chainable = arguments.length && (defaultExtra || typeof margin !== 'boolean');
      var extra = defaultExtra || (margin === true || value === true ? 'margin' : 'border');
      return access(this, function (elem, type, value) {
        var doc;

        if (isWindow(elem)) {
          // $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
          return funcName.indexOf('outer') === 0 ? elem["inner".concat(name)] : elem.document.documentElement["client".concat(name)];
        } // Get document width or height


        if (elem.nodeType === 9) {
          doc = elem.documentElement; // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
          // whichever is greatest

          return Math.max(elem.body["scroll".concat(name)], doc["scroll".concat(name)], elem.body["offset".concat(name)], doc["offset".concat(name)], doc["client".concat(name)]);
        }

        return value === undefined // Get width or height on the element, requesting but not forcing parseFloat
        ? jQuery.css(elem, type, extra) // Set width or height on the element
        : jQuery.style(elem, type, value, extra);
      }, type, chainable ? margin : undefined, chainable);
    };
  });
});
jQuery.each(('blur focus focusin focusout resize scroll click dblclick ' + 'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' + 'change select submit keydown keypress keyup contextmenu').split(' '), function (i, name) {
  // Handle event binding
  jQuery.fn[name] = function (data, fn) {
    return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
  };
});
jQuery.fn.extend({
  hover: function hover(fnOver, fnOut) {
    return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
  }
});
jQuery.fn.extend({
  bind: function bind(types, data, fn) {
    return this.on(types, null, data, fn);
  },
  unbind: function unbind(types, fn) {
    return this.off(types, null, fn);
  },
  delegate: function delegate(selector, types, data, fn) {
    return this.on(types, selector, data, fn);
  },
  undelegate: function undelegate(selector, types, fn) {
    // ( namespace ) or ( selector, types [, fn] )
    return arguments.length === 1 ? this.off(selector, '**') : this.off(types, selector || '**', fn);
  }
}); // Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon

jQuery.proxy = function (fn, context) {
  var tmp;
  var args;
  var proxy;

  if (typeof context === 'string') {
    tmp = fn[context];
    context = fn;
    fn = tmp;
  } // Quick check to determine if target is callable, in the spec
  // this throws a TypeError, but we will just return undefined.


  if (!isFunction(fn)) {
    return undefined;
  } // Simulated bind


  args = _slice.call(arguments, 2);

  proxy = function proxy() {
    return fn.apply(context || this, args.concat(_slice.call(arguments)));
  }; // Set the guid of unique handler to the same of original handler, so it can be removed


  proxy.guid = fn.guid = fn.guid || jQuery.guid++;
  return proxy;
};

jQuery.holdReady = function (hold) {
  if (hold) {
    jQuery.readyWait++;
  } else {
    jQuery.ready(true);
  }
};

jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;
jQuery.now = Date.now;

jQuery.isNumeric = function (obj) {
  // As of jQuery 3.0, isNumeric is limited to
  // strings and numbers (primitives or objects)
  // that can be coerced to finite numbers (gh-2662)
  var type = jQuery.type(obj);
  return (type === 'number' || type === 'string') && // parseFloat NaNs numeric-cast false positives ("")
  // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
  // subtraction forces infinities to NaN
  !isNaN(obj - parseFloat(obj));
};

var CursorTip = /*#__PURE__*/function () {
  /**
   * 创建跟随鼠标的div元素
   * @param {Object} options 具有以下属性
   * @param {String} [options.text] div内容，支持HTML
   * @param {String} [options.id] 元素id,如果未定义将随机分配
   * @param {Viewer} [options.viewer] Viewer对象,如果未定义，div将不能自动跟随鼠标
   * @param {Boolean} [options.show=true] 是否可见
   * @param {Boolean} [options.reduplicate=false] 如果指定元素的id已存在，则移除原来的要素
   */
  function CursorTip() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, CursorTip);

    var text = options.text,
        id = options.id,
        viewer = options.viewer;

    if (id && document.getElementById(id) && !options.reduplicate) {
      jQuery("#".concat(id)).remove();
    }

    var tooltip = document.createElement('div');
    tooltip.id = defaultValue(id, guid());
    tooltip.className = 'cursor-tip-class';
    tooltip.innerHTML = text;
    var target = viewer ? viewer.container : document.body;
    target.appendChild(tooltip);
    this.ele = tooltip;
    this._show = defaultValue(options.show, true);
    this._isDestryoed = false;
    this._target = target;
    this._id = tooltip.id;
    this._text = text;
    this._position = undefined;
    var self = this;

    if (viewer instanceof Cesium.Viewer) {
      this._handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

      this._handler.setInputAction(function (e) {
        self.updatePosition(e.endPosition);
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
  }
  /**
   * 更新元素位置
   * @param {Cartesian2} pixel 元素位置
   */


  _createClass(CursorTip, [{
    key: "updatePosition",
    value: function updatePosition(pixel) {
      this.ele.style.left = "".concat(pixel.x + 10, "px");
      this.ele.style.top = "".concat(pixel.y + 10, "px");
    }
    /**
     * 更新元素内容
     * @param {String|HTML} text 元素内容
     */

  }, {
    key: "updateText",
    value: function updateText(text) {
      this.ele.innerHTML = text;
    }
    /**
     * 销毁组件
     */

  }, {
    key: "destory",
    value: function destory() {
      if (this._isDestryoed) {
        return;
      }

      this._target.removeChild(this.ele);

      if (this._handler.isDestroyed()) {
        this._handler.destroy();
      }

      this._isDestryoed = true;
    }
    /*
     * 元素可见性
     *
     * @type {Boolean}
     */

  }, {
    key: "show",
    get: function get() {
      return this._show;
    }
    /**
     * 元素可见性
     *
     * @type {Boolean}
     */
    ,
    set: function set(v) {
      this._show = v;

      if (v) {
        this.ele.style.display = 'block';
      } else {
        this.ele.style.display = 'none';
      }
    }
    /**
     * 可以通过document.getElementById(id)获得它的DOM
     *
     * @readonly
     * @type {String}
     */

  }, {
    key: "id",
    get: function get() {
      return this._id;
    }
    /**
     * 获得或设置显示的文字
     * @type {String}
     */

  }, {
    key: "text",
    get: function get() {
      return this._text;
    },
    set: function set(text) {
      this._text = text;
      this.updateText(text);
    }
    /**
     * 获得或设置元素位置，设置元素的位置和updatePosition具有同样的效果
     * @type {Cesium.Cartesian2}
     */

  }, {
    key: "position",
    get: function get() {
      return this._position;
    },
    set: function set(pixel) {
      if (pixel.x && pixel.y) {
        this._position = pixel;
        this.updatePosition(pixel);
      } else {
        console.warn('CursorTip:设置了一个无效的位置，将被忽略.');
      }
    }
  }]);

  return CursorTip;
}();

var CesiumProError$1 = /*#__PURE__*/function (_Error) {
  _inherits(CesiumProError, _Error);

  var _super = _createSuper(CesiumProError);

  /**
   * 定义CesiumPro抛出的错误
   * @extends Error
   * @param {String} message 描述错误消息的内容
   * @example
   * function flyTo(viewer,entity){
   *    if(!viewer){
   *      throw(new CesiumPro.CesiumProError("viewer未定义"))
   *    }
   *    viewer.flyTo(entity)
   * }
   *
   */
  function CesiumProError(message) {
    var _this;

    _classCallCheck(this, CesiumProError);

    _this = _super.call(this, message);
    _this.name = 'CesiumProError';
    return _this;
  }

  return CesiumProError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

/**
 * 检查变是否是一个Cesium.Viewer对象
 * @exports checkViewer
 *
 * @param {any} viewer 将要检查的对象
 */

function checkViewer(viewer) {
  if (!(viewer && viewer instanceof Cesium.Viewer)) {
    var type = _typeof(viewer);

    throw new CesiumProError$1("Expected viewer to be typeof Viewer, actual typeof was ".concat(type));
  }
}

var PointGraphic = /*#__PURE__*/function (_Graphic) {
  _inherits(PointGraphic, _Graphic);

  var _super = _createSuper(PointGraphic);

  function PointGraphic() {
    _classCallCheck(this, PointGraphic);

    return _super.call(this);
  }

  return PointGraphic;
}(Graphic);

_defineProperty(PointGraphic, "defaultStyle", {
  color: Cesium.Color.RED,
  pixelSize: 5,
  outlineColor: Cesium.Color.WHITE,
  outlineWidth: 3
});

_defineProperty(PointGraphic, "highlightStyle", {
  color: Cesium.Color.AQUA,
  pixelSize: 5,
  outlineColor: Cesium.Color.AQUA,
  outlineWidth: 3
});

var PolylineGraphic = /*#__PURE__*/function (_Graphic) {
  _inherits(PolylineGraphic, _Graphic);

  var _super = _createSuper(PolylineGraphic);

  function PolylineGraphic() {
    _classCallCheck(this, PolylineGraphic);

    return _super.call(this);
  }

  return PolylineGraphic;
}(Graphic);

_defineProperty(PolylineGraphic, "defaultStyle", {
  clampToGround: true,
  material: Cesium.Color.fromCssColorString('rgba(247,224,32,1)'),
  width: 3
});

_defineProperty(PolylineGraphic, "highlightStyle", {
  clampToGround: true,
  material: Cesium.Color.AQUA,
  width: 3
});

var PolygonGraphic = /*#__PURE__*/function (_Graphic) {
  _inherits(PolygonGraphic, _Graphic);

  var _super = _createSuper(PolygonGraphic);

  /**
   * 多边形
   */
  function PolygonGraphic() {
    _classCallCheck(this, PolygonGraphic);

    return _super.call(this);
  }

  _createClass(PolygonGraphic, null, [{
    key: "centerFromPonits",

    /**
     * 从一系列点中获取几何中心位置
     * @param  {Cesium.Cartesian3[]} points 点集
     * @return {Cesium.Cartesian3}    以points为顶点的多边形的几何中心
     */
    value: function centerFromPonits(points) {
      var boundingSphere = Cesium.BoundingSphere.fromPoints(points);

      if (boundingSphere) {
        return boundingSphere.center;
      }

      return undefined;
    }
  }, {
    key: "center",
    value: function center(polygon) {
      var points = [];

      function getHierarchy(hierarchy) {
        if (hierarchy.getValue) {
          var hierarchyValue = hierarchy.getValue();

          if (hierarchyValue instanceof Cesium.PolygonHierarchy) {
            points = hierarchyValue.positions;
          } else {
            points = hierarchyValue;
          }
        } else if (Array.isArray(hierarchy)) {
          points = hierarchy;
        }
      }

      if (polygon instanceof Cesium.Entity) {
        var hierarchy = polygon.polygon.hierarchy;
        getHierarchy(hierarchy);
      } else if (polygon.polygonHierarchy) {
        points = polygon.polygonHierarchy.positions;
      } else if (polygon.hierarchy) {
        getHierarchy(polygon.hierarchy);
      }

      return PolygonGraphic.centerFromPonits(points);
    }
  }]);

  return PolygonGraphic;
}(Graphic);

_defineProperty(PolygonGraphic, "defaultStyle", {
  material: Cesium.Color.fromCssColorString('rgba(247,224,32,0.5)'),
  outlineColor: Cesium.Color.fromCssColorString('rgba(255,247,145,1)'),
  outlineWidth: 2,
  perPositionHeight: false
});

_defineProperty(PolygonGraphic, "highlightStyle", {
  material: new Cesium.ColorMaterialProperty(Cesium.Color.AQUA.withAlpha(0.4)),
  outlineColor: Cesium.Color.AQUA.withAlpha(0.4)
});

var LabelGraphic = /*#__PURE__*/function (_Graphic) {
  _inherits(LabelGraphic, _Graphic);

  var _super = _createSuper(LabelGraphic);

  function LabelGraphic() {
    _classCallCheck(this, LabelGraphic);

    return _super.call(this);
  }

  return LabelGraphic;
}(Graphic);

_defineProperty(LabelGraphic, "defaultStyle", _defineProperty({
  font: '36px sans-serif',
  fillColor: Cesium.Color.WHITE,
  showBackground: true,
  style: Cesium.LabelStyle.FILL_AND_OUTLINE,
  // outlineWidth: 2,
  scale: 0.5,
  heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
  verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
  pixelOffset: new Cesium.Cartesian2(0, 0)
}, "heightReference", Cesium.HeightReference.NONE));

/**
 * 地图量算类型
 * @exports CartometryType
 * @enum {Number}
 */
var CartometryType = {
  /**
   * 贴地距离
   * @type {Number}
   * @constant
   */
  SURFACE_DISTANCE: 1,

  /**
   * 空间距离
   * @type {Number}
   * @constant
   */
  SPACE_DISTANCE: 2,

  /**
   * 空间面积
   * @type {Number}
   * @constant
   */
  SPACE_AREA: 3,

  /**
   * 贴地面积
   * @type {Number}
   * @constant
   */
  SURFACE_AREA: 4,

  /**
   * 高度
   * @type {Number}
   * @constant
   */
  HEIGHT: 5,

  /**
   * 方位角
   * @type {Number}
   * @constant
   */
  ANGLE: 6
};
/**
 * 验证是否是合法类型
 * @param {CartometryType}
 * @returns {Number}
 */

CartometryType.validate = function (type) {
  return type === CartometryType.SURFACE_AREA || type === CartometryType.SURFACE_DISTANCE || type === CartometryType.SPACE_AREA || type === CartometryType.SPACE_DISTANCE || type === CartometryType.HEIGHT || type === CartometryType.ANGLE;
};
/**
 * 从枚举值获得枚举标签
 * @param  {CartometryType} value 枚举值
 * @returns {String}
 */


CartometryType.getKey = function (value) {
  var key;

  switch (value) {
    case 1:
      key = 'SURFACE_DISTANCE';
      break;

    case 2:
      key = 'SPACE_DISTANCE';
      break;

    case 3:
      key = 'SPACE_AREA';
      break;

    case 4:
      key = 'SURFACE_AREA';
      break;

    case 5:
      key = 'HEIGHT';
      break;

    case 6:
      key = 'ANGLE';
      break;

    default:
      key = undefined;
  }

  return key;
};

var CartometryType$1 = Object.freeze(CartometryType);

function compareNumber(a, b) {
  return b - a;
}

var Event = /*#__PURE__*/function () {
  /**
   * 事件管理器
   * @example
   * const addMarkerEvent=new Event();
   * function saveMark(mark){
   *  console.log("添加了一个mark",mark.id)
   * }
   * addMarkerEvent.on(saveMark)
   * const mark=viewer.entities.add({
   *  id:"mark1",
   *  billboard:{
   *    image:"./icon/pin.png"
   *  }
   * })
   * addMarkerEvent.emit(mark)
   */
  function Event() {
    _classCallCheck(this, Event);

    this._listeners = [];
    this._scopes = [];
    this._toRemove = [];
    this._insideRaiseEvent = false;
  }
  /**
   * 当前订阅事件的侦听器个数
   */


  _createClass(Event, [{
    key: "on",

    /**
     * 注册事件触发时执行的回调函数
     * @param {Function} listener 事件触发时执行的回调函数
     * @param {Object} [scope] 侦听器函数中this的指针
     * @return {Function} 用于取消侦听器监测的函数
     *
     * @see Event#off
     * @see Event#emit
     */
    value: function on(listener, scope) {
      if (typeof listener !== 'function') {
        throw new CesiumProError$1('侦听器应该是一个函数');
      }

      this._listeners.push(listener);

      this._scopes.push(scope);

      var event = this;
      return function () {
        event.removeEventListener(listener, scope);
      };
    }
    /**
     * 注销事件触发时的回调函数
     * @param {Function} listener 将要被注销的函数
     * @param {Object} [scope] 侦听器函数中this的指针
     * @return {Boolean} 如果为真，事件被成功注销，否则，事件注销失败
     *
     * @see Event#on
     * @see Event#emit
     */

  }, {
    key: "off",
    value: function off(listener, scope) {
      if (typeof listener !== 'function') {
        throw new CesiumProError$1('侦听器应该是一个函数');
      }

      var listeners = this._listeners;
      var scopes = this._scopes;
      var index = -1;

      for (var i = 0; i < listeners.length; i++) {
        if (listeners[i] === listener && scopes[i] === scope) {
          index = i;
          break;
        }
      }

      if (index !== -1) {
        if (this._insideRaiseEvent) {
          // In order to allow removing an event subscription from within
          // a callback, we don't actually remove the items here.  Instead
          // remember the index they are at and undefined their value.
          this._toRemove.push(index);

          listeners[index] = undefined;
          scopes[index] = undefined;
        } else {
          listeners.splice(index, 1);
          scopes.splice(index, 1);
        }

        return true;
      }

      return false;
    }
    /**
     * 触发事件
     * @param {*} arguments 此方法接受任意数据的参数并传递给侦听器函数
     *
     * @see Event#on
     * @see Event#off
     */

  }, {
    key: "emit",
    value: function emit() {
      this._insideRaiseEvent = true;
      var i;
      var listeners = this._listeners;
      var scopes = this._scopes;
      var length = listeners.length;

      for (i = 0; i < length; i++) {
        var listener = listeners[i];

        if (Cesium.defined(listener)) {
          listeners[i].apply(scopes[i], arguments);
        }
      } // Actually remove items removed in removeEventListener.


      var toRemove = this._toRemove;
      length = toRemove.length; // 降序排列，从后往前删

      if (length > 0) {
        toRemove.sort(compareNumber);

        for (i = 0; i < length; i++) {
          var index = toRemove[i];
          listeners.splice(index, 1);
          scopes.splice(index, 1);
        }

        toRemove.length = 0;
      }

      this._insideRaiseEvent = false;
    }
  }, {
    key: "numberOfListeners",
    get: function get() {
      return this._listeners.length - this._toRemove.length;
    }
  }]);

  return Event;
}();

/**
 * 开启/关闭基于地形的深度检测
 *
 * @exports depthTest
 *
 * @param {Cesium.Globe|Cesium.Viewer|Cesium.Scene} target 测试检测对象
 * @param {Boolean} depth 深度检测状态
 *
 * @example
 *
 * const viewer=CesiumPro.createViewer('map');
 * CesiumPro.depthTest(viewer);
 * CesiumPro.depthTest(viewer.scene);
 * CesiumPro.depthTest(viewer.scene.globe);
 */
function depthTest(target) {
  var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (target instanceof Cesium.Viewer) {
    target.scene.globe.depthTestAgainstTerrain = depth;
  } else if (target instanceof Cesium.Scene) {
    target.globe.depthTestAgainstTerrain = depth;
  } else if (target instanceof Cesium.Globe) {
    target.depthTestAgainstTerrain = depth;
  } else {
    throw new CesiumProError("无效的对象");
  }
}

var formatText = function formatText(value, mode, islast) {
  if (mode === CartometryType$1.SURFACE_DISTANCE || mode === CartometryType$1.SPACE_DISTANCE || mode === CartometryType$1.HEIGHT) {
    var preText = islast ? '总长度 ' : '';

    if (value > 10000) {
      return "".concat(preText).concat((value / 1000).toFixed(2), " km");
    }

    return "".concat(preText).concat(value.toFixed(2), " m");
  }

  if (mode === CartometryType$1.SURFACE_AREA || mode === CartometryType$1.SPACE_AREA) {
    if (value > 1000 * 1000 * 10) {
      return "".concat((value / 1000 / 1000).toFixed(2), " km\xB2");
    }

    return "".concat(value.toFixed(2), " m\xB2");
  }

  if (mode === CartometryType$1.ANGLE) {
    return "".concat((value % 360).toFixed(2), "\xB0");
  }

  return undefined;
};

var CartometryManager = /*#__PURE__*/function () {
  /**
   *
   * 地图量算管理工具
   * @alias CartometryManager
   *
   * @param {*} options 具有以下属性
   * @param {Cesium.Viewer} options.viewer Cesium.Viewer对象
   * @param {Object} [options.labelStyle=LabelGraphic.defaultStyle] 定义label样式,和Cesium.LabelGraphic具有相同的参数
   * @param {Object} [options.polylineStyle=PolylineGraphic.defaultStyle] 定义线样式，和Cesium.PolylineGraphic具有相同的参数
   * @param {Object} [options.polygonStyle=PolygonGraphic.defaultStyle] 定义多边形样式,和Cesium.PolygonGraphic具有相同的参数
   * @param {Object} [options.pointStyle=PointGraphic.defaultStyle] 定义点样式,和Cesium.PointGraphic具有相同的参数
   * @param {CartometryManager~Callback} [options.formatText] 格式化标签内容的函数
   * @param {Object} [options.nodeMode] 是否添加顶点，具有以下属性
   * @param {Boolean} [options.nodeMode.distance=true] 是否在距离量算时添加顶点
   * @param {Boolean} [options.nodeMode.area=false] 是否在面积量算时添加顶点
   * @param {Boolean} [options.nodeMode.angle=false] 是否在角度量算时添加顶点
   * @param {Boolean} [options.nodeMode.height=false] 是否在高度量算时添加顶点
   * @param {Object} [options.auxiliaryGeometry] 是否创建辅助要素，具有以下参数
   * @param {Boolean} [options.auxiliaryGeometry.distance=true] 是否在距离量算时创建辅助要素
   * @param {Boolean} [options.auxiliaryGeometry.area=false] 是否在面积量算时创建辅助要素
   * @param {Boolean} [options.auxiliaryGeometry.angle=false] 是否在角度量算时创建辅助要素
   * @param {Boolean} [options.auxiliaryGeometry.height=false] 是否在高度量算时创建辅助要素
   * @param {CartometryType} [options.mode=CartometryType.SURFACE_DISTANCE] 默认量算模式
   * @param {Object} [options.auxiliaryLineMaterial] 定义辅助线的样式
   * @param {Object} [options.auxiliaryPolygonMaterial] 定义辅助多边形的样式
   */
  function CartometryManager(options) {
    _classCallCheck(this, CartometryManager);

    var viewer = options.viewer,
        labelStyle = options.labelStyle,
        polylineStyle = options.polylineStyle,
        polygonStyle = options.polygonStyle,
        pointStyle = options.pointStyle;
    checkViewer(viewer);
    this._viewer = viewer;
    var defaultLabelStyle = LabelGraphic.defaultStyle;
    defaultLabelStyle.disableDepthTestDistance = Number.POSITIVE_INFINITY;
    this._labelStyle = defaultValue(labelStyle, defaultLabelStyle);
    this._polylineStyle = defaultValue(polylineStyle, PolylineGraphic.defaultStyle);
    this._polygonStyle = defaultValue(polygonStyle, PolygonGraphic.defaultStyle);
    this._pointStyle = defaultValue(pointStyle, PointGraphic.defaultStyle);
    this._startMeasure = new Event();
    this._stopMeasure = new Event();
    this._addNode = new Event();
    this.formatText = defaultValue(options.formatText, formatText);
    var defaultNode = {
      distance: true,
      area: false,
      height: false,
      angle: false
    };
    var defaultAuxiliary = {
      distance: true,
      area: false,
      height: true,
      angle: true
    };
    this._nodeMode = defaultValue(options.nodeMode, defaultNode);
    this._auxiliaryGeometry = defaultValue(options.auxiliaryGeometry, defaultAuxiliary);
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    this._handler = handler;
    this._values = [];
    this._mode = defaultValue(options.mode, CartometryType$1.SURFACE_DISTANCE);
    this._tip = new CursorTip();
    this._tip.show = false;
    this._depthTestAgainstTerrain = this._viewer.scene.globe.depthTestAgainstTerrain;
    this._autoDepthTest = options.autoDepthTest;
    this.listening = false;
    var auxiliarylineMaterial = new Cesium.PolylineDashMaterialProperty({
      color: Cesium.Color.RED
    });
    this._auxiliarylineMaterial = defaultValue(options.auxiliaryLineMaterial, auxiliarylineMaterial);
    var auxiliarypolygonMaterial = new Cesium.PolylineDashMaterialProperty({
      color: Cesium.Color.RED
    });
    this._auxiliaryPolygonMaterial = defaultValue(options.auxiliaryPolygonMaterial, auxiliarypolygonMaterial);
  }
  /**
   * Cesium Viewer对象，
   * @type Viewer
   * @readonly
   * @return {Cesium.Viewer}
   */


  _createClass(CartometryManager, [{
    key: "addEventListener",

    /**
     * 开始监听鼠标事件，并获取鼠标所在的位置，包括单击，移动，右击，不建议直接调用该方法，因为开始量算后系统会自动调用。
     * @private
     * @param {CartometryType} mode 量算模式
     * @param {Array} [positions=[]] 用于存储点位信息
     */
    value: function addEventListener(mode) {
      var _this = this;

      var positions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      this._listening = true;
      var modeLabel = CartometryType$1.getKey(mode);
      var label = /.*_?(distance|area|height|angle)$/.exec(modeLabel.toLowerCase());
      var showNode = false;
      var showAuxiliary = false;

      if (label && label[1]) {
        showNode = this._nodeMode[label[1]];
        showAuxiliary = this._auxiliaryGeometry[label[1]];
      }

      var onClick = function onClick(e) {
        var cartesian = _this.pickPosition(e.position);

        cartesian && positions.push(cartesian);

        if (showNode) {
          _this.createNode(cartesian);
        }

        if (showAuxiliary) {
          _this.createAuxiliaryGraphic(positions, cartesian, mode);
        }

        _this.addNode.emit(cartesian);

        if (mode === CartometryType$1.HEIGHT || mode === CartometryType$1.ANGLE) {
          if (positions.length === 1) {
            _this.tip.text = '单击地图确定终点.';
          }

          if (positions.length === 2) {
            _this.removeEventListener();

            var value;

            if (mode === CartometryType$1.HEIGHT) {
              value = _this.getHeight(positions);
            } else {
              value = _this.getAngle(positions);
            }

            _this.createLabel(cartesian, value);
          }
        }
      };

      var onrClick = function onrClick(e) {
        var cartesian = _this.pickPosition(e.position);

        if (mode !== CartometryType$1.HEIGHT || mode !== CartometryType$1.ANGLE) {
          positions.pop();
          positions.length && cartesian && positions.push(cartesian);

          _this.removeEventListener();

          if (showNode) {
            _this.createNode(cartesian);
          }

          _this.addNode.emit(cartesian);
        }

        if (mode === CartometryType$1.SURFACE_DISTANCE || mode === CartometryType$1.SPACE_DISTANCE) {
          var text = _this.getDistance(positions, mode);

          _this.createLabel(cartesian, text);
        }

        if (mode === CartometryType$1.SURFACE_AREA || mode === CartometryType$1.SPACE_AREA) {
          var _text = _this.getArea(positions, mode);

          _this.createLabel(cartesian, _text);
        }

        _this.stopMeasure.emit();
      };

      var onMousemove = function onMousemove(e) {
        _this.tip.position = e.endPosition;

        if (mode === CartometryType$1.HEIGHT || mode === CartometryType$1.ANGLE) {
          return;
        }

        var cartesian = _this.pickPosition(e.endPosition);

        if (positions.length > 1) {
          cartesian && positions.pop();
        }

        if (positions.length > 0) {
          cartesian && positions.push(cartesian);
        }
      };

      var handler = this._handler;
      handler.setInputAction(onClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      handler.setInputAction(onMousemove, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      handler.setInputAction(onrClick, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }
    /**
     * 移除事件监听
     * @private
     */

  }, {
    key: "removeEventListener",
    value: function removeEventListener() {
      var handler = this._handler;
      handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
      this._listening = false;
      this.tip.show = false;

      if (this._autoDepthTest) {
        depthTest(this._viewer, this._depthTestAgainstTerrain);
      }
    }
    /**
     * 清除所有量算结果
     */

  }, {
    key: "clear",
    value: function clear() {
      var values = this._values;

      var _iterator = _createForOfIteratorHelper(values),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var v = _step.value;

          this._viewer.entities.remove(v);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this._values = [];
    }
    /**
     * 销毁对象
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this.clear();
      this.removeEventListener();

      if (!this._handler.isDestroyed()) {
        this._handler.destroy();
      }

      this._viewer = undefinesd;
    }
    /**
     * 根据坐标计算距离。
     * @param  {Array} position 需要计算距离的点
     * @param {CartometryType} mode 距离类型，贴地距离/空间距离
     * @return {Number}          距离,单位:米
     */

  }, {
    key: "getDistance",
    value: function getDistance(position, mode) {
      if (position.length < 2 || !position[0] || !position[1]) {
        return '起点';
      }

      var distance;

      if (mode === CartometryType$1.SURFACE_DISTANCE) {
        distance = Cartometry.surfaceDistance(position);
      } else if (mode === CartometryType$1.SPACE_DISTANCE) {
        distance = Cartometry.spaceDistance(position);
      }

      return this.formatText(distance, mode, !this._listening);
    }
    /**
     * 根据坐标计算面积。
     * @param  {Array} positions 要计算面积的点
     * @param  {CartometryType} mode      计算模式,贴地面积/空间面积
     * @return {Number}           面积，单位:平方米
     */

  }, {
    key: "getArea",
    value: function getArea(positions, mode) {
      var area;

      if (mode === CartometryType$1.SURFACE_AREA) {
        area = Cartometry.surfaceArea(positions);
      } else {
        area = Cartometry.spaceArea(positions);
      }

      return this.formatText(area, mode, !this._listening);
    }
    /**
     * 根据坐标计算相邻两个点之间的高度差。
     * @param  {Cesium.Cartesian3[]} positions 坐标集合
     * @return {Number}           两点之间的高度差，单位：米
     */

  }, {
    key: "getHeight",
    value: function getHeight(positions) {
      var heights = Cartometry.heightFromCartesianArray(positions);
      return this.formatText(heights[0], CartometryType$1.HEIGHT);
    }
    /**
     * 计算向量方位角。
     * @param  {Cesium.Cartesian3[]} positions 构成向量的坐标，第一个点为起点，第二个点为终点，多余的点会被抛弃
     * @return {Number} 向量与正北方向的夹角，单位：度
     */

  }, {
    key: "getAngle",
    value: function getAngle(positions, mode) {
      var angle = Cartometry.angleBetweenNorth(positions[0], positions[1]);
      return this.formatText(angle, CartometryType$1.ANGLE);
    }
    /**
     * 开始量算,开启鼠标事件监听，包括点击、移动、右击，标绘结束后自动移除事件监听。
     * @param  {CartometryType} mode 量算模式(类型)
     * @param {Array} [positions] 通过鼠标拾取的点
     */

  }, {
    key: "do",
    value: function _do(mode) {
      var positions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      if (!this._depthTestAgainstTerrain) {
        if (!this._autoDepthTest) {
          console.warn('depthTestAgainstTerrain未开启,点位获取可能不准确.');
        } else {
          depthTest(this._viewer);
        }
      }

      this.tip.show = true;
      mode = defaultValue(mode, this.mode);
      var valid = CartometryType$1.validate(mode);

      if (!valid) {
        console.warn('无效的测量模式'); // WARNING: 无效的测量模式

        return;
      }

      if (mode === CartometryType$1.HEIGHT || mode === CartometryType$1.ANGLE) {
        this.tip.text = '单击地图确定起点.';
      } else {
        this.tip.text = '单击地图添加节点，右击地图结束量算';
      }

      this.startMeasure.emit(mode);
      var options;

      if (mode === CartometryType$1.SPACE_DISTANCE || mode === CartometryType$1.HEIGHT) {
        options = this.polylineStyle;
        options.clampToGround = false;
        options.positions = new Cesium.CallbackProperty(function () {
          return positions;
        }, false);
        this.createPolyline(options);
      } else if (mode === CartometryType$1.SURFACE_DISTANCE || mode === CartometryType$1.ANGLE) {
        options = this.polylineStyle;
        options.clampToGround = true;
        options.positions = new Cesium.CallbackProperty(function () {
          return positions;
        }, false);
        this.createPolyline(options);
      } else if (mode === CartometryType$1.SPACE_AREA) {
        options = this.polygonStyle;
        options.perPositionHeight = true;
        options.heightReference = Cesium.HeightReference.NONE;
        options.hierarchy = new Cesium.CallbackProperty(function () {
          return new Cesium.PolygonHierarchy(positions);
        }, false);
        this.createPolygon(options);
      } else if (mode === CartometryType$1.SURFACE_AREA) {
        options = this.polygonStyle;
        options.perPositionHeight = false;
        options.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
        options.hierarchy = new Cesium.CallbackProperty(function () {
          return new Cesium.PolygonHierarchy(positions);
        }, false);
        this.createPolygon(options);
      }

      this.addEventListener(mode, positions);
    }
    /**
     * 开启地面距离量算，和<code>do(CesiumPro.CartometryType.SURFACE_DISTANCE)</code>效果相同。
     * @returns {Number} 贴地距离，单位：米
     */

  }, {
    key: "surfaceDistance",
    value: function surfaceDistance() {
      this["do"](CartometryType$1.SURFACE_DISTANCE);
    }
    /**
     * 开启空间距离量算，和<code>do(CesiumPro.CartometryType.SPACE_DISTANCE)</code>效果相同。
     * @returns {Number} 空间距离，单位：米
     */

  }, {
    key: "spaceDistance",
    value: function spaceDistance() {
      this["do"](CartometryType$1.SPACE_DISTANCE);
    }
    /**
     * 开启贴地面积量算，和<code>do(CesiumPro.CartometryType.SURFACE_AREA)</code>效果相同。
     * @return {Number} 贴地面积，单位：平方米
     */

  }, {
    key: "surfaceArea",
    value: function surfaceArea() {
      this["do"](CartometryType$1.SURFACE_AREA);
    }
    /**
     * 开启空间面积量算，和<code>do(CesiumPro.CartometryType.SPACE_AREA)</code>效果相同。
     * @return {Number} 空间面积，单位：平方米
     */

  }, {
    key: "spaceArea",
    value: function spaceArea() {
      this["do"](CartometryType$1.SPACE_AREA);
    }
    /**
     * 开启高度量算，和<code>do(CesiumPro.CartometryType.HEIGHT)</code>效果相同。
     * @return {Number} 高度差，单位：米
     */

  }, {
    key: "height",
    value: function height() {
      this["do"](CartometryType$1.HEIGHT);
    }
    /**
     * 开启角度量算，和<code>do(CesiumPro.CartometryType.ANGLE)</code>效果相同。
     * @return {Number} 方位角，单位：度
     */

  }, {
    key: "angle",
    value: function angle() {
      this["do"](CartometryType$1.ANGLE);
    }
    /**
     * @private
     * 屏幕坐标转笛卡尔坐标。
     * @param  {Cartesian2} pixel  屏幕坐标
     * @return {Cartesian3}        笛卡尔坐标
     */

  }, {
    key: "pickPosition",
    value: function pickPosition(pixel) {
      var viewer = this._viewer;
      var cartesian;
      var ray = viewer.camera.getPickRay(pixel);
      cartesian = viewer.scene.globe.pick(ray, viewer.scene);
      var feat = viewer.scene.pick(pixel);

      if (feat) {
        if (viewer.scene.pickPositionSupported) {
          cartesian = viewer.scene.pickPosition(pixel);
        } else {
          console.warn('This browser does not support pickPosition.');
        }
      }

      return cartesian;
    }
    /**
     * @private
     * @param  {} options [description]
     * @return {}         [description]
     */

  }, {
    key: "createNode",
    value: function createNode(cartesian) {
      if (!cartesian) {
        return;
      }

      var pointOptions = this.pointStyle;

      var point = this._viewer.entities.add({
        position: cartesian,
        point: pointOptions
      });

      this._values.push(point);

      return point;
    }
    /**
     * @private
     * @param  {} options [description]
     * @return {}         [description]
     */

  }, {
    key: "createLabel",
    value: function createLabel(cartesian, text) {
      var labelOptions = this.labelStyle;
      labelOptions.text = text;
      var coor = CVT.toDegrees(cartesian);
      labelOptions.pixelOffset = new Cesium.Cartesian3(0, 0, coor.height > 0 ? -coor.height : 0);
      console.log(coor, '请检查它不为0');

      var label = this._viewer.entities.add({
        position: cartesian,
        label: labelOptions
      });

      this._values.push(label);

      return label;
    }
    /**
     * @private
     * @param  {} options [description]
     * @return {}         [description]
     */

  }, {
    key: "createPolygon",
    value: function createPolygon(options) {
      var pg = this._viewer.entities.add({
        polygon: options
      });

      this._values.push(pg);

      return pg;
    }
    /**
     * @private
     * @param  {} options [description]
     * @return {}         [description]
     */

  }, {
    key: "createPolyline",
    value: function createPolyline(options) {
      var pl = this._viewer.entities.add({
        polyline: options
      });

      this._values.push(pl);

      return pl;
    }
    /**
     * @private
     * 为高度量算创建辅助线
     * @param  {} potitions [description]
     * @return {}           [description]
     */

  }, {
    key: "_createAuxiliaryGraphicforHeight",
    value: function _createAuxiliaryGraphicforHeight(positions) {
      if (positions.length !== 2) {
        return;
      }

      var startC = Cesium.Cartographic.fromCartesian(positions[0]);
      var endC = Cesium.Cartographic.fromCartesian(positions[1]);
      var tmp = Cesium.Cartesian3.fromRadians(endC.longitude, endC.latitude, startC.height);
      var pts = [positions[0], tmp, positions[1]];

      var pl = this._viewer.entities.add({
        polyline: {
          positions: pts,
          material: this._auxiliarylineMaterial,
          width: this.polylineStyle.width || 3
        }
      });

      this._values.push(pl);
    }
    /**
     * 为距离量算创建辅助要素
     * @private
     * @param  {Cesium.Cartesian3} cartesian [description]
     * @param  {} text      [description]
     * @return {}           [description]
     */

  }, {
    key: "_createAuxiliaryGraphicforDisgance",
    value: function _createAuxiliaryGraphicforDisgance(cartesian, text) {
      this.createLabel(cartesian, text);
    }
    /**
     * 为角度量算创建辅助要素
     * @private
     * @param  {} cartesian [description]
     * @return {}           [description]
     */

  }, {
    key: "_createAuxiliaryGraphicforAngle",
    value: function _createAuxiliaryGraphicforAngle(positions) {
      if (positions.length !== 2) {
        return;
      }

      var distance = Cartometry.spaceDistance(positions);
      var matrix = new Cesium.Transforms.eastNorthUpToFixedFrame(positions[0]);
      var inverseMatrix = new Cesium.Matrix4();
      Cesium.Matrix4.inverseTransformation(matrix, inverseMatrix); // const x = Cesium.Matrix4.multiplyByPoint(matrix, new Cesium.Cartesian3(distance, 0, 0), new Cesium.Cartesian3);

      var y = Cesium.Matrix4.multiplyByPoint(matrix, new Cesium.Cartesian3(0, distance, 0), new Cesium.Cartesian3());
      var options = {
        polyline: {
          positions: [positions[0], y],
          material: this._auxiliarylineMaterial,
          width: this.polylineStyle.width || 3,
          clampToGround: true
        }
      };

      var pl = this._viewer.entities.add(options);

      this._values.push(pl);
    }
    /**
     * 创建辅助要素
     * @private
     */

  }, {
    key: "createAuxiliaryGraphic",
    value: function createAuxiliaryGraphic(position, cartesian, mode) {
      if (mode === CartometryType$1.SPACE_DISTANCE || mode === CartometryType$1.SURFACE_DISTANCE) {
        var length = position.length;
        var text = this.getDistance([position[length - 3], position[length - 2]], mode);

        this._createAuxiliaryGraphicforDisgance(cartesian, text);
      } else if (mode === CartometryType$1.HEIGHT) {
        this._createAuxiliaryGraphicforHeight(position);
      } else if (mode === CartometryType$1.ANGLE) {
        this._createAuxiliaryGraphicforAngle(position);
      }
    }
    /**
     * 处理显示文本的回调函数
     * @callback CartometryManager~Callback
     *
     * @param {Number} value 量算结果，距离、面积或角度
     * @param {CartometryType} mode 量算模式
     * @param {Boolean} isLast 是否是最后一个点
     * @returns {String} 格式化的文本内容
     */

  }, {
    key: "callback",
    value: function callback(value, mode, isLast) {}
  }, {
    key: "viewer",
    get: function get() {
      return this.viewer;
    }
    /**
     * 定义label样式，同Cesium.LabelGraphic
     * @return {Object}
     */

  }, {
    key: "labelStyle",
    get: function get() {
      return this._labelStyle;
    },
    set: function set(v) {
      this._labelStyle = v;
    }
    /**
     * 定义线样式，同Cesium.PolylineGraphic
     * @return {Object}
     */

  }, {
    key: "polylineStyle",
    get: function get() {
      return this._polylineStyle;
    },
    set: function set(v) {
      this._polylineStyle = v;
    }
    /**
     * 定义Polygon样式，同Cesium.PolygonGraphic
     * @return {Object}
     */

  }, {
    key: "polygonStyle",
    get: function get() {
      return this._polygonStyle;
    },
    set: function set(v) {
      this._polygonStyle = v;
    }
    /**
     * 定义Point样式，同Cesium.PointGraphic
     * @return {Object}
     */

  }, {
    key: "pointStyle",
    get: function get() {
      return this._pointStyle;
    },
    set: function set(v) {
      this._pointStyle = v;
    }
    /**
     * 开始测量时触发的事件
     * @Event
     * @type {Event} [description]
     */

  }, {
    key: "startMeasure",
    get: function get() {
      return this._startMeasure;
    }
    /**
     * 结束测量时触发的事件
     * @Event
     * @type {Event}
     */

  }, {
    key: "stopMeasure",
    get: function get() {
      return this._stopMeasure;
    }
    /**
     * 添加节点时触发的事件
     * @Event
     * @type {Event}
     */

  }, {
    key: "addNode",
    get: function get() {
      return this._addNode;
    }
    /**
     * 跟随鼠标的文字
     * @type {CursorTip}
     */

  }, {
    key: "tip",
    get: function get() {
      return this._tip;
    }
    /**
     * 获得或设置地图量算的类型
     * @type {CartometryType}
     * @return {}
     */

  }, {
    key: "mode",
    get: function get() {
      return this._mode;
    },
    set: function set(mode) {
      if (CartometryType$1.validate(mode)) {
        this._mode = mode;
      } else {
        console.warn('CartometryManaer:无效的测量模式');
      }
    }
  }]);

  return CartometryManager;
}();

/**
 * 创建三维场景,修改了Cesium.Viewer的默认参数，隐藏了一些默认按钮,默认底图修改为google
 *
 * @exports createViewer
 * @param {String|Element} container 用于创建三维场景的DOM或元素id
 * @param {Object} options 同Cesium Viewer相同的参数
 * @returns {Cesium.Viewer}
 */
function createViewer(container) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var defaultOption = {
    animation: false,
    timeline: false,
    geocoder: false,
    homeButton: false,
    navigationHelpButton: false,
    baseLayerPicker: false,
    fullscreenElement: 'cesiumContainer',
    fullscreenButton: false,
    shouldAnimate: true,
    infoBox: false,
    selectionIndicator: false,
    sceneModePicker: false,
    shadows: false,
    imageryProvider: new Cesium.UrlTemplateImageryProvider({
      url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali'
    }),
    contextOptions: {
      // cesium状态下允许canvas转图片convertToImage
      webgl: {
        alpha: true,
        depth: false,
        stencil: true,
        antialias: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: true,
        //截图时需要打开
        failIfMajorPerformanceCaveat: true
      },
      allowTextureFilterAnisotropic: true
    } // terrainProvider: Cesium.createWorldTerrain()
    // terrainProvider: false

  };
  return new Cesium.Viewer(container, _objectSpread2(_objectSpread2({}, defaultOption), options));
}

/**
 * 判断一个变量是否被定义
 * @param value
 * @exports defined
 */
function defined(value) {
  return value !== undefined && value !== null;
}

/**
 * 坐标转换工具
 * @namespace CVT
 */

var CVT$1 = {};
/**
 * 笛卡尔坐标转屏幕坐标
 * @param {Cesium.Cartesian3} cartesian 笛卡尔坐标
 * @param {Cesium.Viewer} viewer Viewer对象
 */

CVT$1.cartesian2Pixel = function (cartesian, viewer) {
  return Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cartesian);
};
/**
 * 屏幕坐标转笛卡尔坐标
 * @param {Cesium.Cartesian2} pixel 屏幕坐标
 * @param {Cesium.Viewer} viewer Viewer对象
 */


CVT$1.pixel2Cartesian = function (pixel, viewer) {
  var ray = viewer.camera.getPickRay(pixel);
  var cartesian = viewer.scene.globe.pick(ray, viewer.scene);
  return cartesian;
};
/**
 * 屏幕坐标转笛卡尔坐标，此方法获得的坐标为二维坐标，即高度永远为0
 * @param {Cesium.Cartesian2} pixel 屏幕坐标
 * @param {Cesium.Viewer} [viewer] Viewer对象
 */


CVT$1.pixel2Cartesian2D = function (pixel, viewer) {
  var ellipsoid;

  if (defined(viewer)) {
    ellipsoid = viewer.scene.globe.ellipsoid;
  } else {
    ellipsoid = Cesium.Ellipsoid.WGS84;
  }

  var cartesian = viewer.camera.pickEllipsoid(pixel, ellipsoid);
  return cartesian;
};
/**
 * 笛卡尔坐标转经纬度（弧度）
 * @param {Cesium.Cartesian3} cartesian 笛卡尔坐标
 * @param {Cesium.Viewer} [viewer] Viewer对象
 */


CVT$1.cartesian2Radians = function (cartesian, viewer) {
  var ellipsoid;

  if (defined(viewer)) {
    ellipsoid = viewer.scene.globe.ellipsoid;
  } else {
    ellipsoid = Cesium.Ellipsoid.WGS84;
  }

  var cartographic = Cesium.Cartographic.fromCartesian(cartesian, ellipsoid);
  var lon = cartographic.longitude;
  var lat = cartographic.latitude;
  var height = cartographic.height;
  return {
    lon: lon,
    lat: lat,
    height: height
  };
};
/**
 * 笛卡尔坐标转经纬度（度）
 * @param {Cesium.Cartesian3} cartesian 笛卡尔坐标
 * @param {Cesium.Viewer} viewer Viewer对象
 */


CVT$1.cartesian2Degrees = function (cartesian, viewer) {
  var coords = CVT$1.cartesian2Radians(cartesian, viewer);
  var lon = Cesium.Math.toDegrees(coords.lon);
  var lat = Cesium.Math.toDegrees(coords.lat);
  var height = coords.height;
  return {
    lon: lon,
    lat: lat,
    height: height
  };
};
/**
 * 屏幕坐标转经纬度（度）
 * @param {Cesium.Cartesian2} pixel 屏幕坐标
 * @param {Cesium.Viewer} viewer Viewer对象
 */


CVT$1.pixel2Degrees = function (pixel, viewer) {
  var cartesian = CVT$1.pixel2Cartesian(pixel, viewer);

  if (Cesium.defined(cartesian)) {
    return CVT$1.cartesian2Degrees(cartesian, viewer);
  }

  return undefined;
};
/**
 * 屏幕坐标转经纬度（弧度）
 * @param {Cesium.Cartesian2} pixel 屏幕坐标
 * @param {Cesium.Viewer} viewer Viewer对象
 */


CVT$1.pixel2Radians = function (pixel, viewer) {
  var cartesian = CVT$1.pixel2Cartesian(pixel, viewer);

  if (Cesium.defined(cartesian)) {
    return CVT$1.cartesian2Radians(cartesian, viewer);
  }

  return undefined;
};
/**
 * 获得经纬度坐标（度）
 * @param {Cesium.Cartesian2|Cesium.Cartesian3|Cesium.Cartographic} position
 * @param {Cesium.Viewer} viewer Viewer对象
 */


CVT$1.toDegrees = function (position, viewer) {
  if (position instanceof Cesium.Cartesian3) {
    return CVT$1.cartesian2Degrees(position, viewer);
  }

  if (position instanceof Cesium.Cartesian2) {
    return CVT$1.pixel2Degrees(position, viewer);
  }

  if (position instanceof Cesium.Cartographic) {
    return {
      lon: Cesium.Math.toDegrees(position.longitude),
      lat: Cesium.Math.toDegrees(position.latitude),
      height: position.height
    };
  }

  return undefined;
};
/**
 * 获得经纬度坐标（弧度）
 * @param {Cesium.Cartesian2|Cesium.Cartesian3|Cesium.Cartographic} position
 * @param {Cesium.Viewer} viewer Viewer对象
 */


CVT$1.toRadians = function (position, viewer) {
  if (position instanceof Cesium.Cartesian3) {
    return CVT$1.cartesian2Radians(position, viewer);
  }

  if (position instanceof Cesium.Cartesian2) {
    return CVT$1.pixel2Radians(position, viewer);
  }

  if (position instanceof Cesium.Cartographic) {
    return {
      lon: position.longitude,
      lat: position.latitude,
      height: position.height
    };
  }

  return undefined;
};
/**
 * 获得屏幕坐标
 * @param {Cesium.Cartesian3|Cesium.Cartographic} position
 * @param {Cesium.Viewer} viewer Viewer对象
 */


CVT$1.toPixel = function (position, viewer) {
  if (position instanceof Cesium.Cartesian3) {
    return CVT$1.cartesian2Pixel(position, viewer);
  }

  if (position instanceof Cesium.Cartographic) {
    var cartesian = Cesium.Cartographic.toCartesian(position);
    return CVT$1.cartesian2Pixel(cartesian, viewer);
  }

  return undefined;
};
/**
 * 获得笛卡尔坐标
 * @param {Cesium.Cartesian2|Cesium.Cartographic} position
 * @param {Cesium.Viewer} viewer Viewer对象
 */


CVT$1.toCartesian = function (position, viewer) {
  if (position instanceof Cesium.Cartesian2) {
    return CVT$1.pixel2Cartesian(position, viewer);
  }

  if (position instanceof Cesium.Cartographic) {
    return Cesium.Cartographic.toCartesian(position);
  }

  return undefined;
};

/**
 * 各类数据加载
 * @exports DataLoader
 */
var DataLoader = {};
/**
 * 加载gltf/glb模型。
 * @param  {Cesium.Viewer} viewer  Cesium Viewer对象
 * @param  {Cesium.Cartesian3} [position=new Cesium.Cartesian3] 模型的位置,如果options中定义了modelMatrix，将覆盖该参数
 * @param  {Object} [options={}] 描述model的参数,同Cesium.Model.fromGltf
 * @return {Cesium.Cesium3DTileset}
 */

DataLoader.loadModel = function (viewer) {
  var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Cesium.Cartesian3();
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (!options.modelMatrix && position) {
    var matrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
    options.modelMatrix = matrix;
  }

  return viewer.scene.primitives.add(Cesium.Model.fromGltf(options));
};

function rotate(tileset, rotation) {
  var transform = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rotation));
  Cesium.Matrix4.multiplyByMatrix3(tileset.root.transform, transform, tileset.root.transform);
}

function transform(tileset, translation) {
  Cesium.Matrix4.multiplyByTranslation(tileset.modelMatrix, translation, tileset.modelMatrix);
}

function adjustHeight(tileset, height) {
  var center = tileset.boundingSphere.center;
  var coord = CVT.toDegrees(center, viewer);
  var surface = Cesium.Cartesian3.fromDegrees(coord.lon, coord.lat, 0);
  var offset = Cesium.Cartesian3.fromDegrees(coord.lon, coord.lat, height);
  var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
  tileset.modelMatrix = Cesium.Matrix4.multiply(tileset.modelMatrix, Cesium.Matrix4.fromTranslation(translation), tileset.modelMatrix);
}

function adjustLocation(tileset, position) {
  var matrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
  tileset.root.transform = matrix;
}

DataLoader.loadTileset = function (viewer) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var kwargs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var height = kwargs.height,
      position = kwargs.position,
      debug = kwargs.debug;
  var cesium3dtileset = new Cesium.Cesium3DTileset(options);
  cesium3dtileset.readyPromise.then(function (tileset) {
    viewer.scene.primitives.add(tileset);

    if (Cesium.defined(position)) {
      adjustLocation(tileset, position);
    }

    if (Cesium.defined(height)) {
      adjustHeight(tileset, height);
    }

    if (debug) {
      height = (_readOnlyError("height"), height ? height : 0);
      var height0 = 0,
          translation = undefined,
          rotation = undefined;

      document.onkeypress = function (e) {
        //升高
        if (e.keyCode === 'Q'.charCodeAt() || e.keyCode === 'q'.charCodeAt()) {
          height0 = 1;
        } //降低
        else if (e.keyCode === 'E'.charCodeAt() || e.keyCode === 'e'.charCodeAt()) {
            height0 = -1;
          } //平移
          else if (e.keyCode === 'A'.charCodeAt() || e.keyCode === 'a'.charCodeAt()) {
              translation = new Cesium.Cartesian3(-2, 0, 0);
            } else if (e.keyCode === 'D'.charCodeAt() || e.keyCode === 'd'.charCodeAt()) {
              translation = new Cesium.Cartesian3(2, 0, 0);
            } else if (e.keyCode === 'W'.charCodeAt() || e.keyCode === 'w'.charCodeAt()) {
              translation = new Cesium.Cartesian3(0, -2, 0);
            } else if (e.keyCode === 'S'.charCodeAt() || e.keyCode === 's'.charCodeAt()) {
              translation = new Cesium.Cartesian3(0, 2, 0);
            } //旋转
            else if (e.keyCode === 'Z'.charCodeAt() || e.keyCode === 'z'.charCodeAt()) {
                rotation = -1;
              } else if (e.keyCode === 'X'.charCodeAt() || e.keyCode === 'x'.charCodeAt()) {
                rotation = 1;
              }

        adjustHeight(tileset, height0);

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
};

/**
 * 时间数据格式的扩展方法
 *
 * @exports dateFormat
 * @param  {String} fmt  时间格式
 * @param  {Date} date 时间
 * @return {String}     格式化后的时间
 *
 * @example
 * const date=new Date();
 * dateFormat('yy-mm-dd HH:MM:SS',date)
 * dateFormat('HH:MM:SS',date)
 */
function dateFormat(fmt, date) {
  var ret;
  var opt = {
    'y+': date.getFullYear().toString(),
    // 年
    'm+': (date.getMonth() + 1).toString(),
    // 月
    'd+': date.getDate().toString(),
    // 日
    'H+': date.getHours().toString(),
    // 时
    'M+': date.getMinutes().toString(),
    // 分
    'S+': date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串

  };
  var keys = Object.keys(opt);

  for (var _i = 0, _keys = keys; _i < _keys.length; _i++) {
    var k = _keys[_i];
    ret = new RegExp("(".concat(k, ")")).exec(fmt);

    if (ret) {
      fmt = fmt.replace(ret[1], ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'));
    }
  }

  return fmt;
}
/**
 * 将时间格式化方法注册到原生的Date对象，注册名为format
 *
 * @type function
 * @memberof dateFormat
 *
 * @example
 *
 * const date=new Date();
 * date.format('yy-mm-dd')
 */


dateFormat.register = function () {
  window.Date.prototype.format = function (format) {
    dateFormat(format, this);
  };
};

var DraggableElement = /*#__PURE__*/function () {
  /**
   * 创建一个可拖拽的DOM元素,该元素的position必须为absolute或fixed;
   * @param {String} container 要移到的元素的选择器
   * @param {String} [target=container] 监听鼠标事件的元素，一般是标题栏
   * @example
   * new DraggableElement('#tool-panel')
   * new DraggableElement('#tool-panel','.tool-header-class')
   */
  function DraggableElement(container) {
    var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : container;

    _classCallCheck(this, DraggableElement);

    if (!jQuery(container)) {
      throw new Error('请指定要操作的元素');
    }

    if (!target) {
      target = container;
    }

    this._target = target;
    this._container = container;
    var self = this;
    jQuery(self.target).mousedown(function (e) // e鼠标事件
    {
      jQuery(self.target).css('cursor', 'move'); // 改变鼠标指针的形状
      // let offset = $("#" + container).offset(); //DIV在页面的位置

      var offset = jQuery(self.container).position(); // DIV在页面的位置

      var x = e.pageX - offset.left; // 获得鼠标指针离DIV元素左边界的距离

      var y = e.pageY - offset.top; // 获得鼠标指针离DIV元素上边界的距离

      jQuery(document).bind('mousemove', function (ev) // 绑定鼠标的移动事件，因为光标在DIV元素外面也要有效果，所以要用doucment的事件，而不用DIV元素的事件
      {
        jQuery(self.target).css('cursor', 'move');
        jQuery(self.container).stop(); // 加上这个之后

        var _x = ev.pageX - x; // 获得X轴方向移动的值


        var _y = ev.pageY - y; // 获得Y轴方向移动的值


        jQuery(self.container).animate({
          left: "".concat(_x, "px"),
          top: "".concat(_y, "px")
        }, 10);
      });
    });
    jQuery(document).mouseup(function () {
      jQuery(self.target).css('cursor', 'default');
      jQuery(this).unbind('mousemove');
    });
  }
  /**
   * 触发事件的对象，返回的是对象的选择器
   * @readonly
   * @type String
   */


  _createClass(DraggableElement, [{
    key: "destroy",

    /**
     * 销毁可拖拽对象，仅仅是移除拖拽事件，不会销毁DOM对象
     */
    value: function destroy() {
      jQuery(this.target).unbind('mousedown');
      this._container = undefined;
      this._target = undefined;
    }
  }, {
    key: "target",
    get: function get() {
      return this._target;
    }
    /**
     * 拖拽的对象，返回的是对象的选择器
     * @readonly
     * @type String
     */

  }, {
    key: "container",
    get: function get() {
      return this._container;
    }
  }]);

  return DraggableElement;
}();

/**
 * 此方法将定位分成3个步骤
 * <ul>
 * <li>step 1:调整位置</li>
 * <li>step 2:调整高度</li>
 * <li>step 3:调整角度</li>
 * </ul>
 *
 * @param  {Cesium.Viewer} viewer  Cesium Viewer对象
 * @param  {Object} [options={}] 具有以下参数
 * @param  {Cesium.Cartesian3} options.destination目标位置
 * @param  {Object} [options.orientation] 相机姿态
 * @param  {Number} [options.step1Duration=3.0] 调整高度的持续时间
 * @param  {Number} [options.step1Duration=3.0] 调整位置的持续时间
 * @param  {Number} [options.step1Duration=3.0] 调整姿态的持续时间
 * @return {Promise} 
 */

function flyTo(viewer) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var camera = viewer.camera;
  var step1 = defaultValue(options.step1Duration, 3);
  var step2 = defaultValue(options.step2Duration, 3);
  var step3 = defaultValue(options.step3Duration, 3);
  var curHeight = camera.positionCartographic.height;
  var cartographic = CVT$1.toDegrees(options.destination, viewer); //第一步改变位置

  var step1Destination = Cesium.Cartesian3.fromDegrees(cartographic.lon, cartographic.lat, cur_height); //第二步改变高度

  var step2Destination = options.destination;
  return new Promise(function (resolve) {
    camera.flyTo({
      destination: step1Destination,
      duration: step1,
      complete: function complete() {
        camera.flyTo({
          destination: step2Destination,
          duration: step2,
          complete: function complete() {
            camera.flyTo({
              destination: step2Destination,
              duration: step3,
              complete: function complete() {
                resolve();
              }
            });
          }
        });
      }
    });
  });
}

var shader = 'uniform samplerCube u_cubeMap;\n\
  varying vec3 v_texCoord;\n\
  void main()\n\
  {\n\
  vec4 color = textureCube(u_cubeMap, normalize(v_texCoord));\n\
  gl_FragColor = vec4(czm_gammaCorrect(color).rgb, czm_morphTime);\n\
  }\n\
  ';

var shader$1 = 'attribute vec3 position;\n\
  varying vec3 v_texCoord;\n\
  uniform mat3 u_rotateMatrix;\n\
  void main()\n\
  {\n\
  vec3 p = czm_viewRotation * u_rotateMatrix * (czm_temeToPseudoFixed * (czm_entireFrustum.y * position));\n\
  gl_Position = czm_projection * vec4(p, 1.0);\n\
  v_texCoord = position.xyz;\n\
  }\n\
  ';

/*
 * Cesium近地天空盒
 */

var SkyBoxFS = shader;
var SkyBoxVS = shader$1;

var GroundSkyBox = /*#__PURE__*/function () {
  /**
   * 近景天空盒
   * @param {Object} options 同Cesium Skybox
   */
  function GroundSkyBox(options) {
    _classCallCheck(this, GroundSkyBox);

    var _Cesium = Cesium,
        defaultValue = _Cesium.defaultValue,
        Matrix4 = _Cesium.Matrix4,
        DrawCommand = _Cesium.DrawCommand;
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
      owner: this
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


  _createClass(GroundSkyBox, [{
    key: "update",
    value: function update(frameState, useHdr) {
      var _Cesium2 = Cesium,
          BoxGeometry = _Cesium2.BoxGeometry,
          Cartesian3 = _Cesium2.Cartesian3,
          defined = _Cesium2.defined,
          DeveloperError = _Cesium2.DeveloperError,
          GeometryPipeline = _Cesium2.GeometryPipeline,
          Matrix4 = _Cesium2.Matrix4,
          Transforms = _Cesium2.Transforms,
          VertexFormat = _Cesium2.VertexFormat,
          BufferUsage = _Cesium2.BufferUsage,
          CubeMap = _Cesium2.CubeMap,
          loadCubeMap = _Cesium2.loadCubeMap,
          RenderState = _Cesium2.RenderState,
          VertexArray = _Cesium2.VertexArray,
          BlendingState = _Cesium2.BlendingState,
          SceneMode = _Cesium2.SceneMode,
          ShaderProgram = _Cesium2.ShaderProgram,
          ShaderSource = _Cesium2.ShaderSource,
          Matrix3 = _Cesium2.Matrix3;
      var skyboxMatrix3 = new Matrix3();
      var that = this;

      if (!this.show) {
        return undefined;
      }

      if (frameState.mode !== SceneMode.SCENE3D && frameState.mode !== SceneMode.MORPHING) {
        return undefined;
      } // The sky box is only rendered during the render pass; it is not pickable,
      // it doesn't cast shadows, etc.


      if (!frameState.passes.render) {
        return undefined;
      }

      var context = frameState.context;

      if (this._sources !== this.sources) {
        this._sources = this.sources;
        var sources = this.sources;

        if (!defined(sources.positiveX) || !defined(sources.negativeX) || !defined(sources.positiveY) || !defined(sources.negativeY) || !defined(sources.positiveZ) || !defined(sources.negativeZ)) {
          throw new DeveloperError('this.sources is required and must have positiveX, negativeX, positiveY, negativeY, positiveZ, and negativeZ properties.');
        }

        if (_typeof(sources.positiveX) !== _typeof(sources.negativeX) || _typeof(sources.positiveX) !== _typeof(sources.positiveY) || _typeof(sources.positiveX) !== _typeof(sources.negativeY) || _typeof(sources.positiveX) !== _typeof(sources.positiveZ) || _typeof(sources.positiveX) !== _typeof(sources.negativeZ)) {
          throw new DeveloperError('this.sources properties must all be the same type.');
        }

        if (typeof sources.positiveX === 'string') {
          // Given urls for cube-map images.  Load them.
          loadCubeMap(context, this._sources).then(function (cubeMap) {
            that._cubeMap = that._cubeMap && that._cubeMap.destroy();
            that._cubeMap = cubeMap;
          });
        } else {
          this._cubeMap = this._cubeMap && this._cubeMap.destroy();
          this._cubeMap = new CubeMap({
            context: context,
            source: sources
          });
        }
      }

      var command = this._command;
      command.modelMatrix = Transforms.eastNorthUpToFixedFrame(frameState.camera._positionWC);

      if (!defined(command.vertexArray)) {
        command.uniformMap = {
          u_cubeMap: function u_cubeMap() {
            return that._cubeMap;
          },
          u_rotateMatrix: function u_rotateMatrix() {
            if (typeof Matrix4.getRotation === 'function') {
              return Matrix4.getRotation(command.modelMatrix, skyboxMatrix3);
            }

            return Matrix4.getMatrix3(command.modelMatrix, skyboxMatrix3);
          }
        };
        var geometry = BoxGeometry.createGeometry(BoxGeometry.fromDimensions({
          dimensions: new Cartesian3(2.0, 2.0, 2.0),
          vertexFormat: VertexFormat.POSITION_ONLY
        }));
        var attributeLocations = this._attributeLocations = GeometryPipeline.createAttributeLocations(geometry);
        command.vertexArray = VertexArray.fromGeometry({
          context: context,
          geometry: geometry,
          attributeLocations: attributeLocations,
          bufferUsage: BufferUsage._DRAW
        });
        command.renderState = RenderState.fromCache({
          blending: BlendingState.ALPHA_BLEND
        });
      }

      if (!defined(command.shaderProgram) || this._useHdr !== useHdr) {
        var fs = new ShaderSource({
          defines: [useHdr ? 'HDR' : ''],
          sources: [SkyBoxFS]
        });
        command.shaderProgram = ShaderProgram.fromCache({
          context: context,
          vertexShaderSource: SkyBoxVS,
          fragmentShaderSource: fs,
          attributeLocations: this._attributeLocations
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

  }, {
    key: "isDestroyed",
    value: function isDestroyed() {
      return this._isDestroyed;
    }
    /**
     * 销毁对象
     */

  }, {
    key: "destroy",
    value: function destroy() {
      var command = this._command;
      command.vertexArray = command.vertexArray && command.vertexArray.destroy();
      command.shaderProgram = command.shaderProgram && command.shaderProgram.destroy();
      this._cubeMap = this._cubeMap && this._cubeMap.destroy();
      return Cesium.destroyObject(this);
    }
  }]);

  return GroundSkyBox;
}();

/*
 * 移除Cesium 默认logo，并添加新logo
 */
/**
 * 移除Cesium 默认logo，并添加新logo
 * @exports logo
 * @param {Object} [options] 具有以下参数
 * @param  {String} [options.url] 新logo的url，如果为空将仅移除默认logo，不添加新logo
 * @param {Number} [options.width] logo图片的宽度
 * @param {Number} [options.height] logo图片高度
 */

function logo() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  jQuery('.cesium-widget-credits').empty();

  if (options.url) {
    var style = '';

    if (options.width) {
      style += "width=" + options.width;
    }

    if (options.height) {
      style += " height=" + options.height;
    }

    jQuery('.cesium-widget-credits').append("<img src='".concat(options.url, "' ").concat(style, "/>"));
  }
}

var ModelAttachVector = /*#__PURE__*/function () {
  /**
   * 创建模型的关联矢量，主要用于为模型附加属性信息，可以达到模型单体化的视觉效果。
   * @param {Object} [options={}]具有以下属性
   * @param {Cesium.Viewer} options.viewer Cesium.Viewer对象
   * @param {String} options.vectorResource 矢量文件路径，目前只支持geojson
   * @param {String} [options.key='id'] 将要作为关键字的属性字段，该字段必须在矢量文件的属性表中，且不重复
   * @param {Cesium.Material} [options.material=Cesium.Color.GOLD.withAlpha(0.5)] 编辑模式下要素的材质
   * @param {Cesium.Material} [options.highlightMaterial=Cesium.Color.AQUA] 高亮材质
   * @param {String} [options.mode='edit'] 默认模式
   */
  function ModelAttachVector() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ModelAttachVector);

    var viewer = options.viewer,
        vectorResource = options.vectorResource,
        key = options.key;
    checkViewer(viewer);
    this._materail = defaultValue(options.material, Cesium.Color.GOLD.withAlpha(0.5));
    this._previewMaterial = Cesium.Color.RED.withAlpha(0.0);
    this._highlightMaterial = defaultValue(options.highlightMaterial, Cesium.Color.AQUA);
    this._viewer = viewer;
    this._vectorResource = vectorResource;
    this._key = defaultValue(key, 'id');
    var feats = vectorResource.features; //以数组的形式保存了所有entity

    this.entities = []; //以key-value的形式保存所有entity;

    this.entityMap = new Map();
    this._mode = defaultValue(options.mode, 'edit');
    jQuery.ajax({
      url: this._vectorResource,
      method: 'get',
      dataType: 'json',
      success: function success(res) {
        var feats = res.features;

        var _iterator = _createForOfIteratorHelper(feats),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var feat = _step.value;

            if (feat.geometry.coordinates) {
              var hierarchy = ModelAttachVector.coordinates2Hierarchy(feat.geometry.coordinates);
              var center = PolygonGraphic.centerFromPonits(hierarchy.positions);

              if (center) {
                feat.properties.center = JSON.stringify(center);
              }

              var entity = _this._viewer.entities.add({
                id: feat.properties[_this._key],
                properties: feat.properties,
                polygon: {
                  hierarchy: hierarchy.positions,
                  material: _this._mode === 'edit' ? _this._materail : _this._previewMaterial,
                  heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                  outline: false,
                  perPositionHeight: false
                }
              });

              _this.entities.push(entity);

              _this.entityMap.set(entity.id, entity);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      },
      error: function error(e) {
        errorCatch(e);
      }
    });
  }
  /**
   * 要素的表现模式,edit-编辑模式,preview-预览模式
   * @type {String}
   */


  _createClass(ModelAttachVector, [{
    key: "setMaterial",

    /**
     * 设置要素材质
     * @private
     */
    value: function setMaterial(material) {
      var values = this.entityMap.values();

      var _iterator2 = _createForOfIteratorHelper(values),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var v = _step2.value;

          if (v.polygon) {
            v.polygon.material = material;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
    /**
     * 通过key设置高亮
     * @param  {Cesium.Entity} key 
     */

  }, {
    key: "highLightByKey",
    value: function highLightByKey(key) {
      var entity = this.getByKey(key);
      this.highLightByEntity(entity);
    }
    /**
     * 通过Entity设置高亮
     * @param  {Cesium.Entity} entity
     */

  }, {
    key: "highLightByEntity",
    value: function highLightByEntity(entity) {
      if (entity && entity.polygon) {
        entity.polygon.material = this._highlightMaterial;
      }
    }
    /**
     * 将Geojson的coordinates转为Cesium.Cartesian3数组
     * @param  {Array} coors coordinates
     * @return {Cesium.Cartesian3[]} 可以直接用于多边形hierarchy的Cestesian3数组
     */

  }, {
    key: "zoomTo",

    /**
     * 定位到指定要素，如果未指定key将定位到所有要素
     * @param  {String} [key=''] 要素的key值
     */
    value: function zoomTo() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var entity = this.getByKey(id);

      if (entity) {
        this._viewer.zoomTo(entity);
      } else {
        this._viewer.zoomTo(this.getAll());
      }
    }
    /**
     * 通过key获得指定要素
     * @param  {String} key key值
     * @return {Cesium.Entity}
     */

  }, {
    key: "getByKey",
    value: function getByKey(key) {
      var entity = this._viewer.entities.getById(key);

      return entity;
    }
    /**
     * 返回所有要素
     * @return {Cesium.Entity[]} 矢量数据中的所有要素
     */

  }, {
    key: "getAll",
    value: function getAll() {
      return Array.from(this.entityMap.values());
    }
    /**
     * 删除所有要素
     */

  }, {
    key: "removeAll",
    value: function removeAll() {
      var keys = this.entityMap.keys();

      var _iterator3 = _createForOfIteratorHelper(keys),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var k = _step3.value;
          this.remove(k);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      this.entityMap.clear();
    }
    /**
     * 删除指定key的几何要素
     * @param  {String} key key值
     */

  }, {
    key: "remove",
    value: function remove(key) {
      var entity = this.getByKey(key);

      if (entity) {
        this._viewer.entities.remove(entity);

        this.entityMap["delete"](entity.id);
      }
    }
    /**
     * 销毁对象
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this.removeAll();
      this._viewer = undefined;
      this.entities = undefined;
    }
  }, {
    key: "mode",
    get: function get() {
      return this._mode;
    },
    set: function set(v) {
      this._mode = v;

      if (this._mode === 'edit') {
        this.setMaterial(this._materail);
      } else if (this._mode === 'preview') {
        this.setMaterial(this._previewMaterial);
      } else {
        console.console.warn('无效的模式');
      }
    }
  }], [{
    key: "coordinates2Hierarchy",
    value: function coordinates2Hierarchy(coors) {
      var positions = [];

      var _iterator4 = _createForOfIteratorHelper(coors),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var cs = _step4.value;

          var _iterator5 = _createForOfIteratorHelper(cs),
              _step5;

          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var c = _step5.value;
              positions.push(c[0], c[1]);
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      var cartesian = Cesium.Cartesian3.fromDegreesArray(positions);
      return new Cesium.PolygonHierarchy(cartesian);
    }
  }]);

  return ModelAttachVector;
}();

var ModelGraphic = /*#__PURE__*/function (_Graphic) {
  _inherits(ModelGraphic, _Graphic);

  var _super = _createSuper(ModelGraphic);

  function ModelGraphic() {
    _classCallCheck(this, ModelGraphic);

    return _super.call(this);
  }

  return ModelGraphic;
}(Graphic);

_defineProperty(ModelGraphic, "defaultStyle", {
  colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT,
  color: Cesium.Color.WHITE,
  colorBlendAmount: 0.5,
  minimumPixelSize: 64
});

/**
 * 坐标拾取函数,如果pixel所在位置有Primitive或Entity，将获取Primitive或Entity上的位置，否则获取球面坐标。
 * 简言之,如果点击在模型上将获得模型上的坐标，否则获取球面坐标。
 * <p><span style="font-weight:bold">Note:</span>获取模型上的坐标时需要打开地形深度调整，否则获取的点位不准。</p>
 *
 * @exports pickPosition
 * @see depthTest
 * @param  {Cesium.Cartesian3} pixel 屏幕坐标
 * @param {Cesium.Viewer} viewer Viewer对象
 * @return {Cesium.Cartesian3}       笛卡尔坐标
 */

function pickPosition(pixel, viewer) {
  var cartesian;
  elliposid = defaultValue(elliposid, Cesium.Ellipsoid.WGS84); // cartesian = viewer.camera.pickEllipsoid(pixel, elliposid);

  var ray = viewer.camera.getPickRay(pixel);
  cartesian = viewer.scene.globe.pick(ray);
  var feat = viewer.scene.pick(pixel);

  if (feat) {
    if (viewer.scene.pickPositionSupported) {
      cartesian = viewer.scene.pickPosition(pixel);
    } else {
      console.warn('This browser does not support pickPosition.');
    }
  }

  return cartesian;
}

var cesiumScriptRegex = /((?:.*\/)|^)CesiumPro\.(esm|umd)\.js(?:\?|#|$)/;
var a;

function tryMakeAbsolute(url) {
  if (typeof document === 'undefined') {
    // Node.js and Web Workers. In both cases, the URL will already be absolute.
    return url;
  }

  if (!defined(a)) {
    a = document.createElement('a');
  }

  a.href = url; // IE only absolutizes href on get, not set
  // eslint-disable-next-line no-self-assign

  a.href = a.href;
  return a.href;
}

var baseResource;
var implementation;

function getBaseUrlFromCesiumScript() {
  var scripts = document.getElementsByTagName('script');

  for (var i = 0, len = scripts.length; i < len; ++i) {
    var src = scripts[i].getAttribute('src');
    var result = cesiumScriptRegex.exec(src);

    if (result !== null) {
      return result[1];
    }
  }

  return undefined;
}

function buildModuleUrlFromRequireToUrl(moduleID) {
  // moduleID will be non-relative, so require it relative to this module, in Core.
  return tryMakeAbsolute(require.toUrl("../".concat(moduleID)));
}

function getCesiumBaseUrl() {
  if (defined(baseResource)) {
    return baseResource;
  }

  var baseUrlString;

  if (_typeof(window.define) === 'object' && defined(window.define.amd) && !window.define.amd.toUrlUndefined && defined(window.require.toUrl)) {
    baseUrlString = Cesium.getAbsoluteUri('..', 'core/URL.js');
  } else {
    baseUrlString = getBaseUrlFromCesiumScript();
  }

  if (!defined(baseUrlString)) {
    throw new CesiumProError$1('Unable to determine CesiumPro base URL automatically, try defining a global variable called CESIUM_BASE_URL.');
  } // >>includeEnd('debug');


  baseResource = new Cesium.Resource({
    url: tryMakeAbsolute(baseUrlString)
  });
  baseResource.appendForwardSlash();
  return baseResource;
}

function buildModuleUrlFromBaseUrl(moduleID) {
  var resource = getCesiumBaseUrl().getDerivedResource({
    url: moduleID
  });
  return resource.url;
}

function buildModuleUrl(relativeUrl) {
  if (!defined(implementation)) {
    // select implementation
    if (_typeof(window.define) === 'object' && defined(window.define.amd) && !window.define.amd.toUrlUndefined && defined(require.toUrl)) {
      implementation = buildModuleUrlFromRequireToUrl;
    } else {
      implementation = buildModuleUrlFromBaseUrl;
    }
  }

  var url = implementation(relativeUrl);
  return url;
}
/**
 * URL相关工具
 * @namespace URL
 *
 */


var URL = {};
/**
 * 从多个字符串拼接url,以/为分割符
 * @param  {...String} args
 * @return {String}      url
 *
 * @example
 *
 * URL.join("www.baidu.com/",'/tieba/','cesium')
 * //www.baidu.com/tieba/cesium
 */

URL.join = function () {
  var formatArgs = [];

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  for (var _i = 0, _args = args; _i < _args.length; _i++) {
    var arg = _args[_i];

    if (arg.startsWith('/')) {
      arg = arg.substring(1);
    }

    if (arg.endsWith('/')) {
      arg = arg.substring(0, arg.length - 1);
    }

    formatArgs.push(arg);
  }

  var urlstr = formatArgs.join('/'); // if (!(urlstr.startsWith('http') || urlstr.startsWith('ftp'))) {
  //   urlstr = `http://${urlstr}`;
  // }

  return urlstr;
};
/**
 * 获取CesiumPro静态资源的完整路径
 * @param {String} path 指定文件
 * @returns {String}
 */


URL.buildModuleUrl = function (path) {
  return buildModuleUrl(path);
};

var ViewerParams = /*#__PURE__*/function () {
  /**
   * 获取当前场景的参数，包括经纬度、海拔、视高、帧率、延迟以及相机参数heading、pitch、roll。
   * 如果要更新帧率和延迟，应该在对象初始化后调用addPostRenderEvent()方法。
   * @param {Cesium.Viewer} viewer
   * @param {Boolean} [debug=false] 是否打开调试模式，打开开将在控制台打印参数
   */
  function ViewerParams(viewer) {
    var debug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, ViewerParams);

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


  _createClass(ViewerParams, [{
    key: "addMousemoveEvent",
    value: function addMousemoveEvent() {
      var _this = this;

      this.removeMousemoveEvent();

      this._handler.setInputAction(function (e) {
        var coor = CVT$1.toDegrees(e.endPosition, _this._viewer);

        if (!Cesium.defined(coor)) {
          return;
        }

        _this._lon = coor.lon;
        _this._lat = coor.lat;
        _this._height = coor.height;
        _this._alt = undefined;

        if (_this._viewer.terrainProvider) {
          var cartesian = Cesium.Cartographic.fromCartesian(Cesium.Cartesian3.fromDegrees(_this._lon, _this._lat));
          Cesium.sampleTerrainMostDetailed(_this._viewer.terrainProvider, [cartesian]).then(function (sampler) {
            _this._alt = sampler[0].height;
          });
        }

        _this.updateHeadingPitchRoll();

        if (_this.debug) {
          console.log(_this.params);
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
    /**
     * 移除鼠标移动事件监听，经纬度、高程、视高将不会更新
     */

  }, {
    key: "removeMousemoveEvent",
    value: function removeMousemoveEvent() {
      this._handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
    /**
     * 添加postRender事件监听，对象初始化后必须调用该方法帧率和延迟以及相机能数才会实时刷新
     */

  }, {
    key: "addPostRenderEvent",
    value: function addPostRenderEvent() {
      var _this2 = this;

      this.postRenderFunction = this._viewer.scene.postRender.addEventListener(function () {
        _this2.updateFps();

        _this2.updateHeadingPitchRoll();
      });
    }
    /**
     * 移除postRender事件监听,帧率和延迟以及相机能数将不会更新
     */

  }, {
    key: "removePostRenderEvent",
    value: function removePostRenderEvent() {
      if (this.postRenderFunction) {
        this.postRenderFunction();
      }
    }
    /**
     * 销毁对象
     */

  }, {
    key: "destroy",
    value: function destroy() {
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

  }, {
    key: "updateFps",
    value: function updateFps() {
      var time = Cesium.getTimestamp();

      if (!Cesium.defined(this._lastFpsSampleTime)) {
        this._lastFpsSampleTime = Cesium.getTimestamp();
      }

      if (!Cesium.defined(this.lastMsSampleTime)) {
        this.lastMsSampleTime = Cesium.getTimestamp();
      }

      this._fpsFrameCount++;
      var fpsElapsedTime = time - this._lastFpsSampleTime;

      if (fpsElapsedTime > 1000) {
        var fps = 'N/A';
        fps = this._fpsFrameCount * 1000 / fpsElapsedTime || 0;
        this._fps = "".concat(fps.toFixed(0), " FPS");
        this._lastFpsSampleTime = time;
        this._fpsFrameCount = 0;
      }

      this._msFrameCount++;
      var msElapsedTime = time - this.lastMsSampleTime;

      if (msElapsedTime > 200) {
        var ms = 'N/A';
        ms = (msElapsedTime / this._msFrameCount).toFixed(2);
        this._ms = "".concat(ms, " MS");
        this.lastMsSampleTime = time;
        this._msFrameCount = 0;
      }
    }
    /**
     * 更新相机参数
     */

  }, {
    key: "updateHeadingPitchRoll",
    value: function updateHeadingPitchRoll() {
      var viewer = this._viewer;
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

  }, {
    key: "viewerCenter",
    value: function viewerCenter() {
      var inWorldCoordinates = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Cesium.Cartesian3();
      var _this$_viewer = this._viewer,
          scene = _this$_viewer.scene,
          camera = _this$_viewer.camera;
      var unprojectedScratch = new Cesium.Cartographic();
      var rayScratch = new Cesium.Ray();
      var viewer = this._viewer;

      if (scene.mode === Cesium.SceneMode.MORPHING) {
        return undefined;
      }

      if (Cesium.defined(viewer.trackedEntity)) {
        result = viewer.trackedEntity.position.getValue(viewer.clock.currentTime, result);
      } else {
        rayScratch.origin = camera.positionWC;
        rayScratch.direction = camera.directionWC;
        result = scene.globe.pick(rayScratch, scene, result);
      }

      if (!Cesium.defined(result)) {
        return undefined;
      }

      if (scene.mode === Cesium.SceneMode.SCENE2D || scene.mode === Cesium.SceneMode.COLUMBUS_VIEW) {
        result = camera.worldToCameraCoordinatesPoint(result, result);

        if (inWorldCoordinates) {
          result = scene.globe.ellipsoid.cartographicToCartesian(scene.mapProjection.unproject(result, unprojectedScratch), result);
        }
      } else if (!inWorldCoordinates) {
        result = camera.worldToCameraCoordinatesPoint(result, result);
      }

      return result;
    }
  }, {
    key: "params",
    get: function get() {
      return {
        lon: this.lon,
        lat: this.lat,
        height: this.height,
        alt: this.alt,
        heading: this.heading,
        pitch: this.pitch,
        roll: this.roll,
        fps: this.fps,
        ms: this.ms
      };
    }
    /**
     * 经度
     * @readonly
     */

  }, {
    key: "lon",
    get: function get() {
      return this._lon;
    }
    /**
     * 纬度
     * @readonly
     */

  }, {
    key: "lat",
    get: function get() {
      return this._lat;
    }
    /**
     * 视高
     * @readonly
     */

  }, {
    key: "height",
    get: function get() {
      return this._height;
    }
    /**
     * 地形高/海拔
     * @readonly
     */

  }, {
    key: "alt",
    get: function get() {
      return this._alt;
    }
    /**
     * 相机旋转角
     * @readonly
     */

  }, {
    key: "heading",
    get: function get() {
      return Cesium.Math.toDegrees(this._heading);
    }
    /**
     * 相机仰俯角
     * @readonly
     */

  }, {
    key: "pitch",
    get: function get() {
      return Cesium.Math.toDegrees(this._pitch);
    }
    /**
     * 相机翻滚角
     * @readonly
     */

  }, {
    key: "roll",
    get: function get() {
      return Cesium.Math.toDegrees(this._roll);
    }
    /**
     * 帧率
     * @readonly
     */

  }, {
    key: "fps",
    get: function get() {
      return this._fps;
    }
    /**
     * 延迟
     * @readonly
     */

  }, {
    key: "ms",
    get: function get() {
      return this._ms;
    }
    /**
     * 场景中心坐标
     * @readonly
     */

  }, {
    key: "center",
    get: function get() {
      return this.viewerCenter();
    }
  }]);

  return ViewerParams;
}();

var tmp = {};

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports !== "undefined") {
    factory();
  } else {
    var mod = {
      exports: {}
    };
    factory();
    global.FileSaver = mod.exports;
  }
})(tmp, function () {
  /*
  * FileSaver.js
  * A saveAs() FileSaver implementation.
  *
  * By Eli Grey, http://eligrey.com
  *
  * License : https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md (MIT)
  * source  : http://purl.eligrey.com/github/FileSaver.js
  */
  // The one and only way of getting global scope in all environments
  // https://stackoverflow.com/q/3277182/1008999

  var _global = (typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' && window.window === window ? window : (typeof self === "undefined" ? "undefined" : _typeof(self)) === 'object' && self.self === self ? self : (typeof global === "undefined" ? "undefined" : _typeof(global)) === 'object' && global.global === global ? global : void 0;

  function bom(blob, opts) {
    if (typeof opts === 'undefined') opts = {
      autoBom: false
    };else if (_typeof(opts) !== 'object') {
      console.warn('Deprecated: Expected third argument to be a object');
      opts = {
        autoBom: !opts
      };
    } // prepend BOM for UTF-8 XML and text/* types (including HTML)
    // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF

    if (opts.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
      return new Blob([String.fromCharCode(0xFEFF), blob], {
        type: blob.type
      });
    }

    return blob;
  }

  function download(url, name, opts) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'blob';

    xhr.onload = function () {
      saveAs(xhr.response, name, opts);
    };

    xhr.onerror = function () {
      console.error('could not download file');
    };

    xhr.send();
  }

  function corsEnabled(url) {
    var xhr = new XMLHttpRequest(); // use sync to avoid popup blocker

    xhr.open('HEAD', url, false);

    try {
      xhr.send();
    } catch (e) {}

    return xhr.status >= 200 && xhr.status <= 299;
  } // `a.click()` doesn't work for all browsers (#465)


  function click(node) {
    try {
      node.dispatchEvent(new MouseEvent('click'));
    } catch (e) {
      var evt = document.createEvent('MouseEvents');
      evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
      node.dispatchEvent(evt);
    }
  }

  var saveAs = _global.saveAs || ( // probably in some web worker
  (typeof window === "undefined" ? "undefined" : _typeof(window)) !== 'object' || window !== _global ? function saveAs() {}
  /* noop */
  // Use download attribute first if possible (#193 Lumia mobile)
  : 'download' in HTMLAnchorElement.prototype ? function saveAs(blob, name, opts) {
    var URL = _global.URL || _global.webkitURL;
    var a = document.createElement('a');
    name = name || blob.name || 'download';
    a.download = name;
    a.rel = 'noopener'; // tabnabbing
    // TODO: detect chrome extensions & packaged apps
    // a.target = '_blank'

    if (typeof blob === 'string') {
      // Support regular links
      a.href = blob;

      if (a.origin !== location.origin) {
        corsEnabled(a.href) ? download(blob, name, opts) : click(a, a.target = '_blank');
      } else {
        click(a);
      }
    } else {
      // Support blobs
      a.href = URL.createObjectURL(blob);
      setTimeout(function () {
        URL.revokeObjectURL(a.href);
      }, 4E4); // 40s

      setTimeout(function () {
        click(a);
      }, 0);
    }
  } // Use msSaveOrOpenBlob as a second approach
  : 'msSaveOrOpenBlob' in navigator ? function saveAs(blob, name, opts) {
    name = name || blob.name || 'download';

    if (typeof blob === 'string') {
      if (corsEnabled(blob)) {
        download(blob, name, opts);
      } else {
        var a = document.createElement('a');
        a.href = blob;
        a.target = '_blank';
        setTimeout(function () {
          click(a);
        });
      }
    } else {
      navigator.msSaveOrOpenBlob(bom(blob, opts), name);
    }
  } // Fallback to using FileReader and a popup
  : function saveAs(blob, name, opts, popup) {
    // Open a popup immediately do go around popup blocker
    // Mostly only available on user interaction and the fileReader is async so...
    popup = popup || open('', '_blank');

    if (popup) {
      popup.document.title = popup.document.body.innerText = 'downloading...';
    }

    if (typeof blob === 'string') return download(blob, name, opts);
    var force = blob.type === 'application/octet-stream';

    var isSafari = /constructor/i.test(_global.HTMLElement) || _global.safari;

    var isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);

    if ((isChromeIOS || force && isSafari) && (typeof FileReader === "undefined" ? "undefined" : _typeof(FileReader)) === 'object') {
      // Safari doesn't allow downloading of blob URLs
      var reader = new FileReader();

      reader.onloadend = function () {
        var url = reader.result;
        url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, 'data:attachment/file;');
        if (popup) popup.location.href = url;else location = url;
        popup = null; // reverse-tabnabbing #460
      };

      reader.readAsDataURL(blob);
    } else {
      var URL = _global.URL || _global.webkitURL;
      var url = URL.createObjectURL(blob);
      if (popup) popup.location = url;else location.href = url;
      popup = null; // reverse-tabnabbing #460

      setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 4E4); // 40s
    }
  });
  _global.saveAs = saveAs.saveAs = saveAs;
});

var filesaver = tmp.saveAs;

var bitsToNum = function bitsToNum(ba) {
  return ba.reduce(function (s, n) {
    return s * 2 + n;
  }, 0);
};

var byteToBitArr = function byteToBitArr(bite) {
  var a = [];

  for (var i = 7; i >= 0; i--) {
    a.push(!!(bite & 1 << i));
  }

  return a;
}; // Stream

/**
 * @constructor
 */
// Make compiler happy.


var Stream = function Stream(data) {
  this.data = data;
  this.len = this.data.length;
  this.pos = 0;

  this.readByte = function () {
    if (this.pos >= this.data.length) {
      throw new Error('Attempted to read past end of stream.');
    }

    if (data instanceof Uint8Array) return data[this.pos++];else return data.charCodeAt(this.pos++) & 0xFF;
  };

  this.readBytes = function (n) {
    var bytes = [];

    for (var i = 0; i < n; i++) {
      bytes.push(this.readByte());
    }

    return bytes;
  };

  this.read = function (n) {
    var s = '';

    for (var i = 0; i < n; i++) {
      s += String.fromCharCode(this.readByte());
    }

    return s;
  };

  this.readUnsigned = function () {
    // Little-endian.
    var a = this.readBytes(2);
    return (a[1] << 8) + a[0];
  };
};

var lzwDecode = function lzwDecode(minCodeSize, data) {
  // TODO: Now that the GIF parser is a bit different, maybe this should get an array of bytes instead of a String?
  var pos = 0; // Maybe this streaming thing should be merged with the Stream?

  var readCode = function readCode(size) {
    var code = 0;

    for (var i = 0; i < size; i++) {
      if (data.charCodeAt(pos >> 3) & 1 << (pos & 7)) {
        code |= 1 << i;
      }

      pos++;
    }

    return code;
  };

  var output = [];
  var clearCode = 1 << minCodeSize;
  var eoiCode = clearCode + 1;
  var codeSize = minCodeSize + 1;
  var dict = [];

  var clear = function clear() {
    dict = [];
    codeSize = minCodeSize + 1;

    for (var i = 0; i < clearCode; i++) {
      dict[i] = [i];
    }

    dict[clearCode] = [];
    dict[eoiCode] = null;
  };

  var code;
  var last;

  while (true) {
    last = code;
    code = readCode(codeSize);

    if (code === clearCode) {
      clear();
      continue;
    }

    if (code === eoiCode) break;

    if (code < dict.length) {
      if (last !== clearCode) {
        dict.push(dict[last].concat(dict[code][0]));
      }
    } else {
      if (code !== dict.length) throw new Error('Invalid LZW code.');
      dict.push(dict[last].concat(dict[last][0]));
    }

    output.push.apply(output, dict[code]);

    if (dict.length === 1 << codeSize && codeSize < 12) {
      // If we're at the last code and codeSize is 12, the next code will be a clearCode, and it'll be 12 bits long.
      codeSize++;
    }
  } // I don't know if this is technically an error, but some GIFs do it.
  //if (Math.ceil(pos / 8) !== data.length) throw new Error('Extraneous LZW bytes.');


  return output;
}; // The actual parsing; returns an object with properties.


var parseGIF = function parseGIF(st, handler) {
  handler || (handler = {}); // LZW (GIF-specific)

  var parseCT = function parseCT(entries) {
    // Each entry is 3 bytes, for RGB.
    var ct = [];

    for (var i = 0; i < entries; i++) {
      ct.push(st.readBytes(3));
    }

    return ct;
  };

  var readSubBlocks = function readSubBlocks() {
    var size, data;
    data = '';

    do {
      size = st.readByte();
      data += st.read(size);
    } while (size !== 0);

    return data;
  };

  var parseHeader = function parseHeader() {
    var hdr = {};
    hdr.sig = st.read(3);
    hdr.ver = st.read(3);
    if (hdr.sig !== 'GIF') throw new Error('Not a GIF file.'); // XXX: This should probably be handled more nicely.

    hdr.width = st.readUnsigned();
    hdr.height = st.readUnsigned();
    var bits = byteToBitArr(st.readByte());
    hdr.gctFlag = bits.shift();
    hdr.colorRes = bitsToNum(bits.splice(0, 3));
    hdr.sorted = bits.shift();
    hdr.gctSize = bitsToNum(bits.splice(0, 3));
    hdr.bgColor = st.readByte();
    hdr.pixelAspectRatio = st.readByte(); // if not 0, aspectRatio = (pixelAspectRatio + 15) / 64

    if (hdr.gctFlag) {
      hdr.gct = parseCT(1 << hdr.gctSize + 1);
    }

    handler.hdr && handler.hdr(hdr);
  };

  var parseExt = function parseExt(block) {
    var parseGCExt = function parseGCExt(block) {
      var blockSize = st.readByte(); // Always 4

      var bits = byteToBitArr(st.readByte());
      block.reserved = bits.splice(0, 3); // Reserved; should be 000.

      block.disposalMethod = bitsToNum(bits.splice(0, 3));
      block.userInput = bits.shift();
      block.transparencyGiven = bits.shift();
      block.delayTime = st.readUnsigned();
      block.transparencyIndex = st.readByte();
      block.terminator = st.readByte();
      handler.gce && handler.gce(block);
    };

    var parseComExt = function parseComExt(block) {
      block.comment = readSubBlocks();
      handler.com && handler.com(block);
    };

    var parsePTExt = function parsePTExt(block) {
      // No one *ever* uses this. If you use it, deal with parsing it yourself.
      var blockSize = st.readByte(); // Always 12

      block.ptHeader = st.readBytes(12);
      block.ptData = readSubBlocks();
      handler.pte && handler.pte(block);
    };

    var parseAppExt = function parseAppExt(block) {
      var parseNetscapeExt = function parseNetscapeExt(block) {
        var blockSize = st.readByte(); // Always 3

        block.unknown = st.readByte(); // ??? Always 1? What is this?

        block.iterations = st.readUnsigned();
        block.terminator = st.readByte();
        handler.app && handler.app.NETSCAPE && handler.app.NETSCAPE(block);
      };

      var parseUnknownAppExt = function parseUnknownAppExt(block) {
        block.appData = readSubBlocks(); // FIXME: This won't work if a handler wants to match on any identifier.

        handler.app && handler.app[block.identifier] && handler.app[block.identifier](block);
      };

      var blockSize = st.readByte(); // Always 11

      block.identifier = st.read(8);
      block.authCode = st.read(3);

      switch (block.identifier) {
        case 'NETSCAPE':
          parseNetscapeExt(block);
          break;

        default:
          parseUnknownAppExt(block);
          break;
      }
    };

    var parseUnknownExt = function parseUnknownExt(block) {
      block.data = readSubBlocks();
      handler.unknown && handler.unknown(block);
    };

    block.label = st.readByte();

    switch (block.label) {
      case 0xF9:
        block.extType = 'gce';
        parseGCExt(block);
        break;

      case 0xFE:
        block.extType = 'com';
        parseComExt(block);
        break;

      case 0x01:
        block.extType = 'pte';
        parsePTExt(block);
        break;

      case 0xFF:
        block.extType = 'app';
        parseAppExt(block);
        break;

      default:
        block.extType = 'unknown';
        parseUnknownExt(block);
        break;
    }
  };

  var parseImg = function parseImg(img) {
    var deinterlace = function deinterlace(pixels, width) {
      // Of course this defeats the purpose of interlacing. And it's *probably*
      // the least efficient way it's ever been implemented. But nevertheless...
      var newPixels = new Array(pixels.length);
      var rows = pixels.length / width;

      var cpRow = function cpRow(toRow, fromRow) {
        var fromPixels = pixels.slice(fromRow * width, (fromRow + 1) * width);
        newPixels.splice.apply(newPixels, [toRow * width, width].concat(fromPixels));
      }; // See appendix E.


      var offsets = [0, 4, 2, 1];
      var steps = [8, 8, 4, 2];
      var fromRow = 0;

      for (var pass = 0; pass < 4; pass++) {
        for (var toRow = offsets[pass]; toRow < rows; toRow += steps[pass]) {
          cpRow(toRow, fromRow);
          fromRow++;
        }
      }

      return newPixels;
    };

    img.leftPos = st.readUnsigned();
    img.topPos = st.readUnsigned();
    img.width = st.readUnsigned();
    img.height = st.readUnsigned();
    var bits = byteToBitArr(st.readByte());
    img.lctFlag = bits.shift();
    img.interlaced = bits.shift();
    img.sorted = bits.shift();
    img.reserved = bits.splice(0, 2);
    img.lctSize = bitsToNum(bits.splice(0, 3));

    if (img.lctFlag) {
      img.lct = parseCT(1 << img.lctSize + 1);
    }

    img.lzwMinCodeSize = st.readByte();
    var lzwData = readSubBlocks();
    img.pixels = lzwDecode(img.lzwMinCodeSize, lzwData);

    if (img.interlaced) {
      // Move
      img.pixels = deinterlace(img.pixels, img.width);
    }

    handler.img && handler.img(img);
  };

  var parseBlock = function parseBlock() {
    var block = {};
    block.sentinel = st.readByte();

    switch (String.fromCharCode(block.sentinel)) {
      // For ease of matching
      case '!':
        block.type = 'ext';
        parseExt(block);
        break;

      case ',':
        block.type = 'img';
        parseImg(block);
        break;

      case ';':
        block.type = 'eof';
        handler.eof && handler.eof(block);
        break;

      default:
        throw new Error('Unknown block: 0x' + block.sentinel.toString(16));
      // TODO: Pad this with a 0.
    }

    if (block.type !== 'eof') setTimeout(parseBlock, 0);
  };

  var parse = function parse() {
    parseHeader();
    setTimeout(parseBlock, 0);
  };

  parse();
};

var SuperGif = function SuperGif(opts) {
  var options = {
    //viewport position
    vp_l: 0,
    vp_t: 0,
    vp_w: null,
    vp_h: null,
    //canvas sizes
    c_w: null,
    c_h: null
  };

  for (var i in opts) {
    options[i] = opts[i];
  }

  if (options.vp_w && options.vp_h) options.is_vp = true;
  var stream;
  var hdr;
  var loadError = null;
  var loading = false;
  var transparency = null;
  var delay = null;
  var disposalMethod = null;
  var disposalRestoreFromIdx = null;
  var lastDisposalMethod = null;
  var frame = null;
  var lastImg = null;
  var playing = true;
  var ctx_scaled = false;
  var frames = [];
  var frameOffsets = []; // elements have .x and .y properties

  var gif = options.gif;
  if (typeof options.auto_play == 'undefined') options.auto_play = !gif.getAttribute('rel:auto_play') || gif.getAttribute('rel:auto_play') == '1';
  var onEndListener = options.hasOwnProperty('on_end') ? options.on_end : null;
  var loopDelay = options.hasOwnProperty('loop_delay') ? options.loop_delay : 0;
  var overrideLoopMode = options.hasOwnProperty('loop_mode') ? options.loop_mode : 'auto';
  var drawWhileLoading = options.hasOwnProperty('draw_while_loading') ? options.draw_while_loading : true;
  var showProgressBar = drawWhileLoading ? options.hasOwnProperty('show_progress_bar') ? options.show_progress_bar : true : false;
  var progressBarHeight = options.hasOwnProperty('progressbar_height') ? options.progressbar_height : 25;
  var progressBarBackgroundColor = options.hasOwnProperty('progressbar_background_color') ? options.progressbar_background_color : 'rgba(255,255,255,0.4)';
  var progressBarForegroundColor = options.hasOwnProperty('progressbar_foreground_color') ? options.progressbar_foreground_color : 'rgba(255,0,22,.8)';

  var clear = function clear() {
    transparency = null;
    delay = null;
    lastDisposalMethod = disposalMethod;
    disposalMethod = null;
    frame = null;
  }; // XXX: There's probably a better way to handle catching exceptions when
  // callbacks are involved.


  var doParse = function doParse() {
    try {
      parseGIF(stream, handler);
    } catch (err) {
      doLoadError('parse');
    }
  };

  var setSizes = function setSizes(w, h) {
    canvas.width = w * _get_canvas_scale();
    canvas.height = h * _get_canvas_scale();
    toolbar.style.minWidth = w * _get_canvas_scale() + 'px';
    tmpCanvas.width = w;
    tmpCanvas.height = h;
    tmpCanvas.style.width = w + 'px';
    tmpCanvas.style.height = h + 'px';
    tmpCanvas.getContext('2d').setTransform(1, 0, 0, 1, 0, 0);
  };

  var setFrameOffset = function setFrameOffset(frame, offset) {
    if (!frameOffsets[frame]) {
      frameOffsets[frame] = offset;
      return;
    }

    if (typeof offset.x !== 'undefined') {
      frameOffsets[frame].x = offset.x;
    }

    if (typeof offset.y !== 'undefined') {
      frameOffsets[frame].y = offset.y;
    }
  };

  var doShowProgress = function doShowProgress(pos, length, draw) {
    if (draw && showProgressBar) {
      var height = progressBarHeight;
      var left, mid, top, width;

      if (options.is_vp) {
        if (!ctx_scaled) {
          top = options.vp_t + options.vp_h - height;
          height = height;
          left = options.vp_l;
          mid = left + pos / length * options.vp_w;
          width = canvas.width;
        } else {
          top = (options.vp_t + options.vp_h - height) / _get_canvas_scale();
          height = height / _get_canvas_scale();
          left = options.vp_l / _get_canvas_scale();
          mid = left + pos / length * (options.vp_w / _get_canvas_scale());
          width = canvas.width / _get_canvas_scale();
        } //some debugging, draw rect around viewport
      } else {
        top = (canvas.height - height) / (ctx_scaled ? _get_canvas_scale() : 1);
        mid = pos / length * canvas.width / (ctx_scaled ? _get_canvas_scale() : 1);
        width = canvas.width / (ctx_scaled ? _get_canvas_scale() : 1);
        height /= ctx_scaled ? _get_canvas_scale() : 1;
      }

      ctx.fillStyle = progressBarBackgroundColor;
      ctx.fillRect(mid, top, width - mid, height);
      ctx.fillStyle = progressBarForegroundColor;
      ctx.fillRect(0, top, mid, height);
    }
  };

  var doLoadError = function doLoadError(originOfError) {
    var drawError = function drawError() {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, options.c_w ? options.c_w : hdr.width, options.c_h ? options.c_h : hdr.height);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 3;
      ctx.moveTo(0, 0);
      ctx.lineTo(options.c_w ? options.c_w : hdr.width, options.c_h ? options.c_h : hdr.height);
      ctx.moveTo(0, options.c_h ? options.c_h : hdr.height);
      ctx.lineTo(options.c_w ? options.c_w : hdr.width, 0);
      ctx.stroke();
    };

    loadError = originOfError;
    hdr = {
      width: gif.width,
      height: gif.height
    }; // Fake header.

    frames = [];
    drawError();
  };

  var doHdr = function doHdr(_hdr) {
    hdr = _hdr;
    setSizes(hdr.width, hdr.height);
  };

  var doGCE = function doGCE(gce) {
    pushFrame();
    clear();
    transparency = gce.transparencyGiven ? gce.transparencyIndex : null;
    delay = gce.delayTime;
    disposalMethod = gce.disposalMethod; // We don't have much to do with the rest of GCE.
  };

  var pushFrame = function pushFrame() {
    if (!frame) return;
    frames.push({
      data: frame.getImageData(0, 0, hdr.width, hdr.height),
      delay: delay
    });
    frameOffsets.push({
      x: 0,
      y: 0
    });
  };

  var doImg = function doImg(img) {
    if (!frame) frame = tmpCanvas.getContext('2d');
    var currIdx = frames.length; //ct = color table, gct = global color table

    var ct = img.lctFlag ? img.lct : hdr.gct; // TODO: What if neither exists?

    /*
    Disposal method indicates the way in which the graphic is to
    be treated after being displayed.
     Values :    0 - No disposal specified. The decoder is
                    not required to take any action.
                1 - Do not dispose. The graphic is to be left
                    in place.
                2 - Restore to background color. The area used by the
                    graphic must be restored to the background color.
                3 - Restore to previous. The decoder is required to
                    restore the area overwritten by the graphic with
                    what was there prior to rendering the graphic.
                     Importantly, "previous" means the frame state
                    after the last disposal of method 0, 1, or 2.
    */

    if (currIdx > 0) {
      if (lastDisposalMethod === 3) {
        // Restore to previous
        // If we disposed every frame including first frame up to this point, then we have
        // no composited frame to restore to. In this case, restore to background instead.
        if (disposalRestoreFromIdx !== null) {
          frame.putImageData(frames[disposalRestoreFromIdx].data, 0, 0);
        } else {
          frame.clearRect(lastImg.leftPos, lastImg.topPos, lastImg.width, lastImg.height);
        }
      } else {
        disposalRestoreFromIdx = currIdx - 1;
      }

      if (lastDisposalMethod === 2) {
        // Restore to background color
        // Browser implementations historically restore to transparent; we do the same.
        // http://www.wizards-toolkit.org/discourse-server/viewtopic.php?f=1&t=21172#p86079
        frame.clearRect(lastImg.leftPos, lastImg.topPos, lastImg.width, lastImg.height);
      }
    } // else, Undefined/Do not dispose.
    // frame contains final pixel data from the last frame; do nothing
    //Get existing pixels for img region after applying disposal method


    var imgData = frame.getImageData(img.leftPos, img.topPos, img.width, img.height); //apply color table colors

    img.pixels.forEach(function (pixel, i) {
      // imgData.data === [R,G,B,A,R,G,B,A,...]
      if (pixel !== transparency) {
        imgData.data[i * 4 + 0] = ct[pixel][0];
        imgData.data[i * 4 + 1] = ct[pixel][1];
        imgData.data[i * 4 + 2] = ct[pixel][2];
        imgData.data[i * 4 + 3] = 255; // Opaque.
      }
    });
    frame.putImageData(imgData, img.leftPos, img.topPos);

    if (!ctx_scaled) {
      ctx.scale(_get_canvas_scale(), _get_canvas_scale());
      ctx_scaled = true;
    } // We could use the on-page canvas directly, except that we draw a progress
    // bar for each image chunk (not just the final image).


    if (drawWhileLoading) {
      ctx.drawImage(tmpCanvas, 0, 0);
      drawWhileLoading = options.auto_play;
    }

    lastImg = img;
  };

  var player = function () {
    var i = -1;
    var iterationCount = 0;
    /**
     * Gets the index of the frame "up next".
     * @returns {number}
     */

    var getNextFrameNo = function getNextFrameNo() {
      var delta =  1 ;
      return (i + delta + frames.length) % frames.length;
    };

    var stepFrame = function stepFrame(amount) {
      // XXX: Name is confusing.
      i = i + amount;
      putFrame();
    };

    var step = function () {
      var stepping = false;

      var completeLoop = function completeLoop() {
        if (onEndListener !== null) onEndListener(gif);
        iterationCount++;

        if (overrideLoopMode !== false || iterationCount < 0) {
          doStep();
        } else {
          stepping = false;
          playing = false;
        }
      };

      var doStep = function doStep() {
        stepping = playing;
        if (!stepping) return;
        stepFrame(1);
        var delay = frames[i].delay * 10;
        if (!delay) delay = 100; // FIXME: Should this even default at all? What should it be?

        var nextFrameNo = getNextFrameNo();

        if (nextFrameNo === 0) {
          delay += loopDelay;
          setTimeout(completeLoop, delay);
        } else {
          setTimeout(doStep, delay);
        }
      };

      return function () {
        if (!stepping) setTimeout(doStep, 0);
      };
    }();

    var putFrame = function putFrame() {
      var offset;
      i = parseInt(i, 10);

      if (i > frames.length - 1) {
        i = 0;
      }

      if (i < 0) {
        i = 0;
      }

      offset = frameOffsets[i];
      tmpCanvas.getContext("2d").putImageData(frames[i].data, offset.x, offset.y);
      ctx.globalCompositeOperation = "copy";
      ctx.drawImage(tmpCanvas, 0, 0);
    };

    var play = function play() {
      playing = true;
      step();
    };

    var pause = function pause() {
      playing = false;
    };

    return {
      init: function init() {
        if (loadError) return;

        if (!(options.c_w && options.c_h)) {
          ctx.scale(_get_canvas_scale(), _get_canvas_scale());
        }

        if (options.auto_play) {
          step();
        } else {
          i = 0;
          putFrame();
        }
      },
      step: step,
      play: play,
      pause: pause,
      playing: playing,
      move_relative: stepFrame,
      current_frame: function current_frame() {
        return i;
      },
      length: function length() {
        return frames.length;
      },
      move_to: function move_to(frame_idx) {
        i = frame_idx;
        putFrame();
      }
    };
  }();

  var doDecodeProgress = function doDecodeProgress(draw) {
    doShowProgress(stream.pos, stream.data.length, draw);
  };

  var doNothing = function doNothing() {};
  /**
   * @param{boolean=} draw Whether to draw progress bar or not; this is not idempotent because of translucency.
   *                       Note that this means that the text will be unsynchronized with the progress bar on non-frames;
   *                       but those are typically so small (GCE etc.) that it doesn't really matter. TODO: Do this properly.
   */


  var withProgress = function withProgress(fn, draw) {
    return function (block) {
      fn(block);
      doDecodeProgress(draw);
    };
  };

  var handler = {
    hdr: withProgress(doHdr),
    gce: withProgress(doGCE),
    com: withProgress(doNothing),
    // I guess that's all for now.
    app: {
      // TODO: Is there much point in actually supporting iterations?
      NETSCAPE: withProgress(doNothing)
    },
    img: withProgress(doImg, true),
    eof: function eof(block) {
      //toolbar.style.display = '';
      pushFrame();
      doDecodeProgress(false);

      if (!(options.c_w && options.c_h)) {
        canvas.width = hdr.width * _get_canvas_scale();
        canvas.height = hdr.height * _get_canvas_scale();
      }

      player.init();
      loading = false;

      if (load_callback) {
        load_callback(gif);
      }
    }
  };

  var init = function init() {
    var parent = gif.parentNode;
    var div = document.createElement('div');
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    toolbar = document.createElement('div');
    tmpCanvas = document.createElement('canvas');
    div.width = canvas.width = gif.width;
    div.height = canvas.height = gif.height;
    toolbar.style.minWidth = gif.width + 'px';
    div.className = 'jsgif';
    toolbar.className = 'jsgif_toolbar';
    div.appendChild(canvas);
    div.appendChild(toolbar);
    parent.insertBefore(div, gif);
    parent.removeChild(gif);
    if (options.c_w && options.c_h) setSizes(options.c_w, options.c_h);
    initialized = true;
  };

  var _get_canvas_scale = function get_canvas_scale() {
    var scale;

    if (options.max_width && hdr && hdr.width > options.max_width) {
      scale = options.max_width / hdr.width;
    } else {
      scale = 1;
    }

    return scale;
  };

  var canvas, ctx, toolbar, tmpCanvas;
  var initialized = false;
  var load_callback = false;

  var load_setup = function load_setup(callback) {
    if (loading) return false;
    if (callback) load_callback = callback;else load_callback = false;
    loading = true;
    frames = [];
    clear();
    disposalRestoreFromIdx = null;
    lastDisposalMethod = null;
    frame = null;
    lastImg = null;
    return true;
  };

  var calculateDuration = function calculateDuration() {
    return frames.reduce(function (duration, frame) {
      return duration + frame.delay;
    }, 0);
  };

  return {
    // play controls
    play: player.play,
    pause: player.pause,
    move_relative: player.move_relative,
    move_to: player.move_to,
    // getters for instance vars
    get_playing: function get_playing() {
      return playing;
    },
    get_canvas: function get_canvas() {
      return canvas;
    },
    get_canvas_scale: function get_canvas_scale() {
      return _get_canvas_scale();
    },
    get_loading: function get_loading() {
      return loading;
    },
    get_auto_play: function get_auto_play() {
      return options.auto_play;
    },
    get_length: function get_length() {
      return player.length();
    },
    get_frames: function get_frames() {
      return frames;
    },
    get_duration: function get_duration() {
      return calculateDuration();
    },
    get_duration_ms: function get_duration_ms() {
      return calculateDuration() * 10;
    },
    get_current_frame: function get_current_frame() {
      return player.current_frame();
    },
    load_url: function load_url(src, callback) {
      if (!load_setup(callback)) return;
      var h = new XMLHttpRequest(); // new browsers (XMLHttpRequest2-compliant)

      h.open('GET', src, true);

      if ('overrideMimeType' in h) {
        h.overrideMimeType('text/plain; charset=x-user-defined');
      } // old browsers (XMLHttpRequest-compliant)
      else if ('responseType' in h) {
          h.responseType = 'arraybuffer';
        } // IE9 (Microsoft.XMLHTTP-compliant)
        else {
            h.setRequestHeader('Accept-Charset', 'x-user-defined');
          }

      h.onloadstart = function () {
        // Wait until connection is opened to replace the gif element with a canvas to avoid a blank img
        if (!initialized) init();
      };

      h.onload = function (e) {
        if (this.status != 200) {
          doLoadError('xhr - response');
        } // emulating response field for IE9


        if (!('response' in this)) {
          this.response = new VBArray(this.responseText).toArray().map(String.fromCharCode).join('');
        }

        var data = this.response;

        if (data.toString().indexOf("ArrayBuffer") > 0) {
          data = new Uint8Array(data);
        }

        stream = new Stream(data);
        setTimeout(doParse, 0);
      };

      h.onprogress = function (e) {
        if (e.lengthComputable) doShowProgress(e.loaded, e.total, true);
      };

      h.onerror = function () {
        doLoadError('xhr');
      };

      h.send();
    },
    load: function load(callback) {
      this.load_url(gif.getAttribute('rel:animated_src') || gif.src, callback);
    },
    load_raw: function load_raw(arr, callback) {
      if (!load_setup(callback)) return;
      if (!initialized) init();
      stream = new Stream(arr);
      setTimeout(doParse, 0);
    },
    set_frame_offset: setFrameOffset
  };
};

/**
 * netcdfjs - Read and explore NetCDF files
 * @version v1.0.0
 * @link https://github.com/cheminfo-js/netcdfjs
 * @license MIT
 */
var NetCDFReaderExport;

(function webpackUniversalModuleDefinition(root, factory) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && (typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object') module.exports = factory();else if (typeof define === 'function' && define.amd) define([], factory);else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') exports["netcdfjs"] = factory();else root["netcdfjs"] = factory();
})(typeof self !== 'undefined' ? self : undefined, function () {
  return (
    /******/
    function (modules) {
      // webpackBootstrap

      /******/
      // The module cache

      /******/
      var installedModules = {};
      /******/

      /******/
      // The require function

      /******/

      function __webpack_require__(moduleId) {
        /******/

        /******/
        // Check if module is in cache

        /******/
        if (installedModules[moduleId]) {
          /******/
          return installedModules[moduleId].exports;
          /******/
        }
        /******/
        // Create a new module (and put it into the cache)

        /******/


        var module = installedModules[moduleId] = {
          /******/
          i: moduleId,

          /******/
          l: false,

          /******/
          exports: {}
          /******/

        };
        /******/

        /******/
        // Execute the module function

        /******/

        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/

        /******/
        // Flag the module as loaded

        /******/

        module.l = true;
        /******/

        /******/
        // Return the exports of the module

        /******/

        return module.exports;
        /******/
      }
      /******/

      /******/

      /******/
      // expose the modules object (__webpack_modules__)

      /******/


      __webpack_require__.m = modules;
      /******/

      /******/
      // expose the module cache

      /******/

      __webpack_require__.c = installedModules;
      /******/

      /******/
      // define getter function for harmony exports

      /******/

      __webpack_require__.d = function (exports, name, getter) {
        /******/
        if (!__webpack_require__.o(exports, name)) {
          /******/
          Object.defineProperty(exports, name, {
            enumerable: true,
            get: getter
          });
          /******/
        }
        /******/

      };
      /******/

      /******/
      // define __esModule on exports

      /******/


      __webpack_require__.r = function (exports) {
        /******/
        if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
          /******/
          Object.defineProperty(exports, Symbol.toStringTag, {
            value: 'Module'
          });
          /******/
        }
        /******/


        Object.defineProperty(exports, '__esModule', {
          value: true
        });
        /******/
      };
      /******/

      /******/
      // create a fake namespace object

      /******/
      // mode & 1: value is a module id, require it

      /******/
      // mode & 2: merge all properties of value into the ns

      /******/
      // mode & 4: return value when already ns object

      /******/
      // mode & 8|1: behave like require

      /******/


      __webpack_require__.t = function (value, mode) {
        /******/
        if (mode & 1) value = __webpack_require__(value);
        /******/

        if (mode & 8) return value;
        /******/

        if (mode & 4 && _typeof(value) === 'object' && value && value.__esModule) return value;
        /******/

        var ns = Object.create(null);
        /******/

        __webpack_require__.r(ns);
        /******/


        Object.defineProperty(ns, 'default', {
          enumerable: true,
          value: value
        });
        /******/

        if (mode & 2 && typeof value != 'string') for (var key in value) {
          __webpack_require__.d(ns, key, function (key) {
            return value[key];
          }.bind(null, key));
        }
        /******/

        return ns;
        /******/
      };
      /******/

      /******/
      // getDefaultExport function for compatibility with non-harmony modules

      /******/


      __webpack_require__.n = function (module) {
        /******/
        var getter = module && module.__esModule ?
        /******/
        function getDefault() {
          return module['default'];
        } :
        /******/
        function getModuleExports() {
          return module;
        };
        /******/

        __webpack_require__.d(getter, 'a', getter);
        /******/


        return getter;
        /******/
      };
      /******/

      /******/
      // Object.prototype.hasOwnProperty.call

      /******/


      __webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
      };
      /******/

      /******/
      // __webpack_public_path__

      /******/


      __webpack_require__.p = "";
      /******/

      /******/

      /******/
      // Load entry module and return exports

      /******/

      return __webpack_require__(__webpack_require__.s = 3);
      /******/
    }(
    /************************************************************************/

    /******/
    [
    /* 0 */

    /***/
    function (module, exports, __webpack_require__) {
      /**
       * Throws a non-valid NetCDF exception if the statement it's true
       * @ignore
       * @param {boolean} statement - Throws if true
       * @param {string} reason - Reason to throw
       */

      function notNetcdf(statement, reason) {
        if (statement) {
          throw new TypeError("Not a valid NetCDF v3.x file: ".concat(reason));
        }
      }
      /**
       * Moves 1, 2, or 3 bytes to next 4-byte boundary
       * @ignore
       * @param {IOBuffer} buffer - Buffer for the file data
       */


      function padding(buffer) {
        if (buffer.offset % 4 !== 0) {
          buffer.skip(4 - buffer.offset % 4);
        }
      }
      /**
       * Reads the name
       * @ignore
       * @param {IOBuffer} buffer - Buffer for the file data
       * @return {string} - Name
       */


      function readName(buffer) {
        // Read name
        var nameLength = buffer.readUint32();
        var name = buffer.readChars(nameLength); // validate name
        // TODO
        // Apply padding

        padding(buffer);
        return name;
      }

      module.exports.notNetcdf = notNetcdf;
      module.exports.padding = padding;
      module.exports.readName = readName;
      /***/
    },
    /* 1 */

    /***/
    function (module, exports, __webpack_require__) {

      (function (root) {
        var stringFromCharCode = String.fromCharCode; // Taken from https://mths.be/punycode

        function ucs2decode(string) {
          var output = [];
          var counter = 0;
          var length = string.length;
          var value;
          var extra;

          while (counter < length) {
            value = string.charCodeAt(counter++);

            if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
              // high surrogate, and there is a next character
              extra = string.charCodeAt(counter++);

              if ((extra & 0xFC00) == 0xDC00) {
                // low surrogate
                output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
              } else {
                // unmatched surrogate; only append this code unit, in case the next
                // code unit is the high surrogate of a surrogate pair
                output.push(value);
                counter--;
              }
            } else {
              output.push(value);
            }
          }

          return output;
        } // Taken from https://mths.be/punycode


        function ucs2encode(array) {
          var length = array.length;
          var index = -1;
          var value;
          var output = '';

          while (++index < length) {
            value = array[index];

            if (value > 0xFFFF) {
              value -= 0x10000;
              output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
              value = 0xDC00 | value & 0x3FF;
            }

            output += stringFromCharCode(value);
          }

          return output;
        }

        function checkScalarValue(codePoint) {
          if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
            throw Error('Lone surrogate U+' + codePoint.toString(16).toUpperCase() + ' is not a scalar value');
          }
        }
        /*--------------------------------------------------------------------------*/


        function createByte(codePoint, shift) {
          return stringFromCharCode(codePoint >> shift & 0x3F | 0x80);
        }

        function encodeCodePoint(codePoint) {
          if ((codePoint & 0xFFFFFF80) == 0) {
            // 1-byte sequence
            return stringFromCharCode(codePoint);
          }

          var symbol = '';

          if ((codePoint & 0xFFFFF800) == 0) {
            // 2-byte sequence
            symbol = stringFromCharCode(codePoint >> 6 & 0x1F | 0xC0);
          } else if ((codePoint & 0xFFFF0000) == 0) {
            // 3-byte sequence
            checkScalarValue(codePoint);
            symbol = stringFromCharCode(codePoint >> 12 & 0x0F | 0xE0);
            symbol += createByte(codePoint, 6);
          } else if ((codePoint & 0xFFE00000) == 0) {
            // 4-byte sequence
            symbol = stringFromCharCode(codePoint >> 18 & 0x07 | 0xF0);
            symbol += createByte(codePoint, 12);
            symbol += createByte(codePoint, 6);
          }

          symbol += stringFromCharCode(codePoint & 0x3F | 0x80);
          return symbol;
        }

        function utf8encode(string) {
          var codePoints = ucs2decode(string);
          var length = codePoints.length;
          var index = -1;
          var codePoint;
          var byteString = '';

          while (++index < length) {
            codePoint = codePoints[index];
            byteString += encodeCodePoint(codePoint);
          }

          return byteString;
        }
        /*--------------------------------------------------------------------------*/


        function readContinuationByte() {
          if (byteIndex >= byteCount) {
            throw Error('Invalid byte index');
          }

          var continuationByte = byteArray[byteIndex] & 0xFF;
          byteIndex++;

          if ((continuationByte & 0xC0) == 0x80) {
            return continuationByte & 0x3F;
          } // If we end up here, it’s not a continuation byte


          throw Error('Invalid continuation byte');
        }

        function decodeSymbol() {
          var byte1;
          var byte2;
          var byte3;
          var byte4;
          var codePoint;

          if (byteIndex > byteCount) {
            throw Error('Invalid byte index');
          }

          if (byteIndex == byteCount) {
            return false;
          } // Read first byte


          byte1 = byteArray[byteIndex] & 0xFF;
          byteIndex++; // 1-byte sequence (no continuation bytes)

          if ((byte1 & 0x80) == 0) {
            return byte1;
          } // 2-byte sequence


          if ((byte1 & 0xE0) == 0xC0) {
            byte2 = readContinuationByte();
            codePoint = (byte1 & 0x1F) << 6 | byte2;

            if (codePoint >= 0x80) {
              return codePoint;
            } else {
              throw Error('Invalid continuation byte');
            }
          } // 3-byte sequence (may include unpaired surrogates)


          if ((byte1 & 0xF0) == 0xE0) {
            byte2 = readContinuationByte();
            byte3 = readContinuationByte();
            codePoint = (byte1 & 0x0F) << 12 | byte2 << 6 | byte3;

            if (codePoint >= 0x0800) {
              checkScalarValue(codePoint);
              return codePoint;
            } else {
              throw Error('Invalid continuation byte');
            }
          } // 4-byte sequence


          if ((byte1 & 0xF8) == 0xF0) {
            byte2 = readContinuationByte();
            byte3 = readContinuationByte();
            byte4 = readContinuationByte();
            codePoint = (byte1 & 0x07) << 0x12 | byte2 << 0x0C | byte3 << 0x06 | byte4;

            if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
              return codePoint;
            }
          }

          throw Error('Invalid UTF-8 detected');
        }

        var byteArray;
        var byteCount;
        var byteIndex;

        function utf8decode(byteString) {
          byteArray = ucs2decode(byteString);
          byteCount = byteArray.length;
          byteIndex = 0;
          var codePoints = [];
          var tmp;

          while ((tmp = decodeSymbol()) !== false) {
            codePoints.push(tmp);
          }

          return ucs2encode(codePoints);
        }
        /*--------------------------------------------------------------------------*/


        root.version = '3.0.0';
        root.encode = utf8encode;
        root.decode = utf8decode;
      })( exports);
      /***/

    },
    /* 2 */

    /***/
    function (module, exports, __webpack_require__) {

      var notNetcdf = __webpack_require__(0).notNetcdf;

      var types = {
        BYTE: 1,
        CHAR: 2,
        SHORT: 3,
        INT: 4,
        FLOAT: 5,
        DOUBLE: 6
      };
      /**
       * Parse a number into their respective type
       * @ignore
       * @param {number} type - integer that represents the type
       * @return {string} - parsed value of the type
       */

      function num2str(type) {
        switch (Number(type)) {
          case types.BYTE:
            return 'byte';

          case types.CHAR:
            return 'char';

          case types.SHORT:
            return 'short';

          case types.INT:
            return 'int';

          case types.FLOAT:
            return 'float';

          case types.DOUBLE:
            return 'double';

          /* istanbul ignore next */

          default:
            return 'undefined';
        }
      }
      /**
       * Parse a number type identifier to his size in bytes
       * @ignore
       * @param {number} type - integer that represents the type
       * @return {number} -size of the type
       */


      function num2bytes(type) {
        switch (Number(type)) {
          case types.BYTE:
            return 1;

          case types.CHAR:
            return 1;

          case types.SHORT:
            return 2;

          case types.INT:
            return 4;

          case types.FLOAT:
            return 4;

          case types.DOUBLE:
            return 8;

          /* istanbul ignore next */

          default:
            return -1;
        }
      }
      /**
       * Reverse search of num2str
       * @ignore
       * @param {string} type - string that represents the type
       * @return {number} - parsed value of the type
       */


      function str2num(type) {
        switch (String(type)) {
          case 'byte':
            return types.BYTE;

          case 'char':
            return types.CHAR;

          case 'short':
            return types.SHORT;

          case 'int':
            return types.INT;

          case 'float':
            return types.FLOAT;

          case 'double':
            return types.DOUBLE;

          /* istanbul ignore next */

          default:
            return -1;
        }
      }
      /**
       * Auxiliary function to read numeric data
       * @ignore
       * @param {number} size - Size of the element to read
       * @param {function} bufferReader - Function to read next value
       * @return {Array<number>|number}
       */


      function readNumber(size, bufferReader) {
        if (size !== 1) {
          var numbers = new Array(size);

          for (var i = 0; i < size; i++) {
            numbers[i] = bufferReader();
          }

          return numbers;
        } else {
          return bufferReader();
        }
      }
      /**
       * Given a type and a size reads the next element
       * @ignore
       * @param {IOBuffer} buffer - Buffer for the file data
       * @param {number} type - Type of the data to read
       * @param {number} size - Size of the element to read
       * @return {string|Array<number>|number}
       */


      function readType(buffer, type, size) {
        switch (type) {
          case types.BYTE:
            return buffer.readBytes(size);

          case types.CHAR:
            return trimNull(buffer.readChars(size));

          case types.SHORT:
            return readNumber(size, buffer.readInt16.bind(buffer));

          case types.INT:
            return readNumber(size, buffer.readInt32.bind(buffer));

          case types.FLOAT:
            return readNumber(size, buffer.readFloat32.bind(buffer));

          case types.DOUBLE:
            return readNumber(size, buffer.readFloat64.bind(buffer));

          /* istanbul ignore next */

          default:
            notNetcdf(true, "non valid type ".concat(type));
            return undefined;
        }
      }
      /**
       * Removes null terminate value
       * @ignore
       * @param {string} value - String to trim
       * @return {string} - Trimmed string
       */


      function trimNull(value) {
        if (value.charCodeAt(value.length - 1) === 0) {
          return value.substring(0, value.length - 1);
        }

        return value;
      }

      module.exports = types;
      module.exports.num2str = num2str;
      module.exports.num2bytes = num2bytes;
      module.exports.str2num = str2num;
      module.exports.readType = readType;
      /***/
    },
    /* 3 */

    /***/
    function (module, exports, __webpack_require__) {

      var _webpack_require__ = __webpack_require__(4),
          IOBuffer = _webpack_require__.IOBuffer;

      var utils = __webpack_require__(0);

      var data = __webpack_require__(5);

      var readHeader = __webpack_require__(6);

      var _toString = __webpack_require__(7);
      /**
       * Reads a NetCDF v3.x file
       * https://www.unidata.ucar.edu/software/netcdf/docs/file_format_specifications.html
       * @param {ArrayBuffer} data - ArrayBuffer or any Typed Array (including Node.js' Buffer from v4) with the data
       * @constructor
       */


      var NetCDFReader = /*#__PURE__*/function () {
        function NetCDFReader(data) {
          _classCallCheck(this, NetCDFReader);

          var buffer = new IOBuffer(data);
          buffer.setBigEndian(); // Validate that it's a NetCDF file

          utils.notNetcdf(buffer.readChars(3) !== 'CDF', 'should start with CDF'); // Check the NetCDF format

          var version = buffer.readByte();
          utils.notNetcdf(version > 2, 'unknown version'); // Read the header

          this.header = readHeader(buffer, version);
          this.buffer = buffer;
        }
        /**
         * @return {string} - Version for the NetCDF format
         */


        _createClass(NetCDFReader, [{
          key: "getAttribute",

          /**
           * Returns the value of an attribute
           * @param {string} attributeName
           * @return {string} Value of the attributeName or null
           */
          value: function getAttribute(attributeName) {
            var attribute = this.globalAttributes.find(function (val) {
              return val.name === attributeName;
            });
            if (attribute) return attribute.value;
            return null;
          }
          /**
           * Returns the value of a variable as a string
           * @param {string} variableName
           * @return {string} Value of the variable as a string or null
           */

        }, {
          key: "getDataVariableAsString",
          value: function getDataVariableAsString(variableName) {
            var variable = this.getDataVariable(variableName);
            if (variable) return variable.join('');
            return null;
          }
          /**
           * @return {Array<object>} - List of variables with:
           *  * `name`: String with the name of the variable
           *  * `dimensions`: Array with the dimension IDs of the variable
           *  * `attributes`: Array with the attributes of the variable
           *  * `type`: String with the type of the variable
           *  * `size`: Number with the size of the variable
           *  * `offset`: Number with the offset where of the variable begins
           *  * `record`: True if is a record variable, false otherwise
           */

        }, {
          key: "toString",
          value: function toString() {
            return _toString.call(this);
          }
          /**
           * Retrieves the data for a given variable
           * @param {string|object} variableName - Name of the variable to search or variable object
           * @return {Array} - List with the variable values
           */

        }, {
          key: "getDataVariable",
          value: function getDataVariable(variableName) {
            var variable;

            if (typeof variableName === 'string') {
              // search the variable
              variable = this.header.variables.find(function (val) {
                return val.name === variableName;
              });
            } else {
              variable = variableName;
            } // throws if variable not found


            utils.notNetcdf(variable === undefined, "variable not found: ".concat(variableName)); // go to the offset position

            this.buffer.seek(variable.offset);

            if (variable.record) {
              // record variable case
              return data.record(this.buffer, variable, this.header.recordDimension);
            } else {
              // non-record variable case
              return data.nonRecord(this.buffer, variable);
            }
          }
          /**
           * Check if a dataVariable exists
           * @param {string} variableName - Name of the variable to find
           * @return {boolean}
           */

        }, {
          key: "dataVariableExists",
          value: function dataVariableExists(variableName) {
            var variable = this.header.variables.find(function (val) {
              return val.name === variableName;
            });
            return variable !== undefined;
          }
          /**
           * Check if an attribute exists
           * @param {string} attributeName - Name of the attribute to find
           * @return {boolean}
           */

        }, {
          key: "attributeExists",
          value: function attributeExists(attributeName) {
            var attribute = this.globalAttributes.find(function (val) {
              return val.name === attributeName;
            });
            return attribute !== undefined;
          }
        }, {
          key: "version",
          get: function get() {
            if (this.header.version === 1) {
              return 'classic format';
            } else {
              return '64-bit offset format';
            }
          }
          /**
           * @return {object} - Metadata for the record dimension
           *  * `length`: Number of elements in the record dimension
           *  * `id`: Id number in the list of dimensions for the record dimension
           *  * `name`: String with the name of the record dimension
           *  * `recordStep`: Number with the record variables step size
           */

        }, {
          key: "recordDimension",
          get: function get() {
            return this.header.recordDimension;
          }
          /**
           * @return {Array<object>} - List of dimensions with:
           *  * `name`: String with the name of the dimension
           *  * `size`: Number with the size of the dimension
           */

        }, {
          key: "dimensions",
          get: function get() {
            return this.header.dimensions;
          }
          /**
           * @return {Array<object>} - List of global attributes with:
           *  * `name`: String with the name of the attribute
           *  * `type`: String with the type of the attribute
           *  * `value`: A number or string with the value of the attribute
           */

        }, {
          key: "globalAttributes",
          get: function get() {
            return this.header.globalAttributes;
          }
        }, {
          key: "variables",
          get: function get() {
            return this.header.variables;
          }
        }]);

        return NetCDFReader;
      }();

      module.exports = NetCDFReader;
      NetCDFReaderExport = NetCDFReader;
      /***/
    },
    /* 4 */

    /***/
    function (module, __webpack_exports__, __webpack_require__) {

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "IOBuffer", function () {
        return IOBuffer;
      });
      /* harmony import */


      var utf8__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

      var defaultByteLength = 1024 * 8;

      var IOBuffer = /*#__PURE__*/function () {
        /**
         * @param data - The data to construct the IOBuffer with.
         * If data is a number, it will be the new buffer's length<br>
         * If data is `undefined`, the buffer will be initialized with a default length of 8Kb<br>
         * If data is an ArrayBuffer, SharedArrayBuffer, an ArrayBufferView (Typed Array), an IOBuffer instance,
         * or a Node.js Buffer, a view will be created over the underlying ArrayBuffer.
         * @param options
         */
        function IOBuffer() {
          _classCallCheck(this, IOBuffer);

          var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultByteLength;
          var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          var dataIsGiven = false;

          if (typeof data === 'number') {
            data = new ArrayBuffer(data);
          } else {
            dataIsGiven = true;
            this.lastWrittenByte = data.byteLength;
          }

          var offset = options.offset ? options.offset >>> 0 : 0;
          var byteLength = data.byteLength - offset;
          var dvOffset = offset;

          if (ArrayBuffer.isView(data) || data instanceof IOBuffer) {
            if (data.byteLength !== data.buffer.byteLength) {
              dvOffset = data.byteOffset + offset;
            }

            data = data.buffer;
          }

          if (dataIsGiven) {
            this.lastWrittenByte = byteLength;
          } else {
            this.lastWrittenByte = 0;
          }

          this.buffer = data;
          this.length = byteLength;
          this.byteLength = byteLength;
          this.byteOffset = dvOffset;
          this.offset = 0;
          this.littleEndian = true;
          this._data = new DataView(this.buffer, dvOffset, byteLength);
          this._mark = 0;
          this._marks = [];
        }
        /**
         * Checks if the memory allocated to the buffer is sufficient to store more
         * bytes after the offset.
         * @param byteLength - The needed memory in bytes.
         * @returns `true` if there is sufficient space and `false` otherwise.
         */


        _createClass(IOBuffer, [{
          key: "available",
          value: function available() {
            var byteLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
            return this.offset + byteLength <= this.length;
          }
          /**
           * Check if little-endian mode is used for reading and writing multi-byte
           * values.
           * @returns `true` if little-endian mode is used, `false` otherwise.
           */

        }, {
          key: "isLittleEndian",
          value: function isLittleEndian() {
            return this.littleEndian;
          }
          /**
           * Set little-endian mode for reading and writing multi-byte values.
           */

        }, {
          key: "setLittleEndian",
          value: function setLittleEndian() {
            this.littleEndian = true;
            return this;
          }
          /**
           * Check if big-endian mode is used for reading and writing multi-byte values.
           * @returns `true` if big-endian mode is used, `false` otherwise.
           */

        }, {
          key: "isBigEndian",
          value: function isBigEndian() {
            return !this.littleEndian;
          }
          /**
           * Switches to big-endian mode for reading and writing multi-byte values.
           */

        }, {
          key: "setBigEndian",
          value: function setBigEndian() {
            this.littleEndian = false;
            return this;
          }
          /**
           * Move the pointer n bytes forward.
           * @param n - Number of bytes to skip.
           */

        }, {
          key: "skip",
          value: function skip() {
            var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
            this.offset += n;
            return this;
          }
          /**
           * Move the pointer to the given offset.
           * @param offset
           */

        }, {
          key: "seek",
          value: function seek(offset) {
            this.offset = offset;
            return this;
          }
          /**
           * Store the current pointer offset.
           * @see {@link IOBuffer#reset}
           */

        }, {
          key: "mark",
          value: function mark() {
            this._mark = this.offset;
            return this;
          }
          /**
           * Move the pointer back to the last pointer offset set by mark.
           * @see {@link IOBuffer#mark}
           */

        }, {
          key: "reset",
          value: function reset() {
            this.offset = this._mark;
            return this;
          }
          /**
           * Push the current pointer offset to the mark stack.
           * @see {@link IOBuffer#popMark}
           */

        }, {
          key: "pushMark",
          value: function pushMark() {
            this._marks.push(this.offset);

            return this;
          }
          /**
           * Pop the last pointer offset from the mark stack, and set the current
           * pointer offset to the popped value.
           * @see {@link IOBuffer#pushMark}
           */

        }, {
          key: "popMark",
          value: function popMark() {
            var offset = this._marks.pop();

            if (offset === undefined) {
              throw new Error('Mark stack empty');
            }

            this.seek(offset);
            return this;
          }
          /**
           * Move the pointer offset back to 0.
           */

        }, {
          key: "rewind",
          value: function rewind() {
            this.offset = 0;
            return this;
          }
          /**
           * Make sure the buffer has sufficient memory to write a given byteLength at
           * the current pointer offset.
           * If the buffer's memory is insufficient, this method will create a new
           * buffer (a copy) with a length that is twice (byteLength + current offset).
           * @param byteLength
           */

        }, {
          key: "ensureAvailable",
          value: function ensureAvailable() {
            var byteLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            if (!this.available(byteLength)) {
              var lengthNeeded = this.offset + byteLength;
              var newLength = lengthNeeded * 2;
              var newArray = new Uint8Array(newLength);
              newArray.set(new Uint8Array(this.buffer));
              this.buffer = newArray.buffer;
              this.length = this.byteLength = newLength;
              this._data = new DataView(this.buffer);
            }

            return this;
          }
          /**
           * Read a byte and return false if the byte's value is 0, or true otherwise.
           * Moves pointer forward by one byte.
           */

        }, {
          key: "readBoolean",
          value: function readBoolean() {
            return this.readUint8() !== 0;
          }
          /**
           * Read a signed 8-bit integer and move pointer forward by 1 byte.
           */

        }, {
          key: "readInt8",
          value: function readInt8() {
            return this._data.getInt8(this.offset++);
          }
          /**
           * Read an unsigned 8-bit integer and move pointer forward by 1 byte.
           */

        }, {
          key: "readUint8",
          value: function readUint8() {
            return this._data.getUint8(this.offset++);
          }
          /**
           * Alias for {@link IOBuffer#readUint8}.
           */

        }, {
          key: "readByte",
          value: function readByte() {
            return this.readUint8();
          }
          /**
           * Read `n` bytes and move pointer forward by `n` bytes.
           */

        }, {
          key: "readBytes",
          value: function readBytes() {
            var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
            var bytes = new Uint8Array(n);

            for (var i = 0; i < n; i++) {
              bytes[i] = this.readByte();
            }

            return bytes;
          }
          /**
           * Read a 16-bit signed integer and move pointer forward by 2 bytes.
           */

        }, {
          key: "readInt16",
          value: function readInt16() {
            var value = this._data.getInt16(this.offset, this.littleEndian);

            this.offset += 2;
            return value;
          }
          /**
           * Read a 16-bit unsigned integer and move pointer forward by 2 bytes.
           */

        }, {
          key: "readUint16",
          value: function readUint16() {
            var value = this._data.getUint16(this.offset, this.littleEndian);

            this.offset += 2;
            return value;
          }
          /**
           * Read a 32-bit signed integer and move pointer forward by 4 bytes.
           */

        }, {
          key: "readInt32",
          value: function readInt32() {
            var value = this._data.getInt32(this.offset, this.littleEndian);

            this.offset += 4;
            return value;
          }
          /**
           * Read a 32-bit unsigned integer and move pointer forward by 4 bytes.
           */

        }, {
          key: "readUint32",
          value: function readUint32() {
            var value = this._data.getUint32(this.offset, this.littleEndian);

            this.offset += 4;
            return value;
          }
          /**
           * Read a 32-bit floating number and move pointer forward by 4 bytes.
           */

        }, {
          key: "readFloat32",
          value: function readFloat32() {
            var value = this._data.getFloat32(this.offset, this.littleEndian);

            this.offset += 4;
            return value;
          }
          /**
           * Read a 64-bit floating number and move pointer forward by 8 bytes.
           */

        }, {
          key: "readFloat64",
          value: function readFloat64() {
            var value = this._data.getFloat64(this.offset, this.littleEndian);

            this.offset += 8;
            return value;
          }
          /**
           * Read a 1-byte ASCII character and move pointer forward by 1 byte.
           */

        }, {
          key: "readChar",
          value: function readChar() {
            return String.fromCharCode(this.readInt8());
          }
          /**
           * Read `n` 1-byte ASCII characters and move pointer forward by `n` bytes.
           */

        }, {
          key: "readChars",
          value: function readChars() {
            var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
            var result = '';

            for (var i = 0; i < n; i++) {
              result += this.readChar();
            }

            return result;
          }
          /**
           * Read the next `n` bytes, return a UTF-8 decoded string and move pointer
           * forward by `n` bytes.
           */

        }, {
          key: "readUtf8",
          value: function readUtf8() {
            var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
            var bString = this.readChars(n);
            return Object(utf8__WEBPACK_IMPORTED_MODULE_0__["decode"])(bString);
          }
          /**
           * Write 0xff if the passed value is truthy, 0x00 otherwise and move pointer
           * forward by 1 byte.
           */

        }, {
          key: "writeBoolean",
          value: function writeBoolean(value) {
            this.writeUint8(value ? 0xff : 0x00);
            return this;
          }
          /**
           * Write `value` as an 8-bit signed integer and move pointer forward by 1 byte.
           */

        }, {
          key: "writeInt8",
          value: function writeInt8(value) {
            this.ensureAvailable(1);

            this._data.setInt8(this.offset++, value);

            this._updateLastWrittenByte();

            return this;
          }
          /**
           * Write `value` as an 8-bit unsigned integer and move pointer forward by 1
           * byte.
           */

        }, {
          key: "writeUint8",
          value: function writeUint8(value) {
            this.ensureAvailable(1);

            this._data.setUint8(this.offset++, value);

            this._updateLastWrittenByte();

            return this;
          }
          /**
           * An alias for {@link IOBuffer#writeUint8}.
           */

        }, {
          key: "writeByte",
          value: function writeByte(value) {
            return this.writeUint8(value);
          }
          /**
           * Write all elements of `bytes` as uint8 values and move pointer forward by
           * `bytes.length` bytes.
           */

        }, {
          key: "writeBytes",
          value: function writeBytes(bytes) {
            this.ensureAvailable(bytes.length);

            for (var i = 0; i < bytes.length; i++) {
              this._data.setUint8(this.offset++, bytes[i]);
            }

            this._updateLastWrittenByte();

            return this;
          }
          /**
           * Write `value` as a 16-bit signed integer and move pointer forward by 2
           * bytes.
           */

        }, {
          key: "writeInt16",
          value: function writeInt16(value) {
            this.ensureAvailable(2);

            this._data.setInt16(this.offset, value, this.littleEndian);

            this.offset += 2;

            this._updateLastWrittenByte();

            return this;
          }
          /**
           * Write `value` as a 16-bit unsigned integer and move pointer forward by 2
           * bytes.
           */

        }, {
          key: "writeUint16",
          value: function writeUint16(value) {
            this.ensureAvailable(2);

            this._data.setUint16(this.offset, value, this.littleEndian);

            this.offset += 2;

            this._updateLastWrittenByte();

            return this;
          }
          /**
           * Write `value` as a 32-bit signed integer and move pointer forward by 4
           * bytes.
           */

        }, {
          key: "writeInt32",
          value: function writeInt32(value) {
            this.ensureAvailable(4);

            this._data.setInt32(this.offset, value, this.littleEndian);

            this.offset += 4;

            this._updateLastWrittenByte();

            return this;
          }
          /**
           * Write `value` as a 32-bit unsigned integer and move pointer forward by 4
           * bytes.
           */

        }, {
          key: "writeUint32",
          value: function writeUint32(value) {
            this.ensureAvailable(4);

            this._data.setUint32(this.offset, value, this.littleEndian);

            this.offset += 4;

            this._updateLastWrittenByte();

            return this;
          }
          /**
           * Write `value` as a 32-bit floating number and move pointer forward by 4
           * bytes.
           */

        }, {
          key: "writeFloat32",
          value: function writeFloat32(value) {
            this.ensureAvailable(4);

            this._data.setFloat32(this.offset, value, this.littleEndian);

            this.offset += 4;

            this._updateLastWrittenByte();

            return this;
          }
          /**
           * Write `value` as a 64-bit floating number and move pointer forward by 8
           * bytes.
           */

        }, {
          key: "writeFloat64",
          value: function writeFloat64(value) {
            this.ensureAvailable(8);

            this._data.setFloat64(this.offset, value, this.littleEndian);

            this.offset += 8;

            this._updateLastWrittenByte();

            return this;
          }
          /**
           * Write the charCode of `str`'s first character as an 8-bit unsigned integer
           * and move pointer forward by 1 byte.
           */

        }, {
          key: "writeChar",
          value: function writeChar(str) {
            return this.writeUint8(str.charCodeAt(0));
          }
          /**
           * Write the charCodes of all `str`'s characters as 8-bit unsigned integers
           * and move pointer forward by `str.length` bytes.
           */

        }, {
          key: "writeChars",
          value: function writeChars(str) {
            for (var i = 0; i < str.length; i++) {
              this.writeUint8(str.charCodeAt(i));
            }

            return this;
          }
          /**
           * UTF-8 encode and write `str` to the current pointer offset and move pointer
           * forward according to the encoded length.
           */

        }, {
          key: "writeUtf8",
          value: function writeUtf8(str) {
            var bString = Object(utf8__WEBPACK_IMPORTED_MODULE_0__["encode"])(str);
            return this.writeChars(bString);
          }
          /**
           * Export a Uint8Array view of the internal buffer.
           * The view starts at the byte offset and its length
           * is calculated to stop at the last written byte or the original length.
           */

        }, {
          key: "toArray",
          value: function toArray() {
            return new Uint8Array(this.buffer, this.byteOffset, this.lastWrittenByte);
          }
          /**
           * Update the last written byte offset
           * @private
           */

        }, {
          key: "_updateLastWrittenByte",
          value: function _updateLastWrittenByte() {
            if (this.offset > this.lastWrittenByte) {
              this.lastWrittenByte = this.offset;
            }
          }
        }]);

        return IOBuffer;
      }();
      /***/

    },
    /* 5 */

    /***/
    function (module, exports, __webpack_require__) {

      var types = __webpack_require__(2); // const STREAMING = 4294967295;

      /**
       * Read data for the given non-record variable
       * @ignore
       * @param {IOBuffer} buffer - Buffer for the file data
       * @param {object} variable - Variable metadata
       * @return {Array} - Data of the element
       */


      function nonRecord(buffer, variable) {
        // variable type
        var type = types.str2num(variable.type); // size of the data

        var size = variable.size / types.num2bytes(type); // iterates over the data

        var data = new Array(size);

        for (var i = 0; i < size; i++) {
          data[i] = types.readType(buffer, type, 1);
        }

        return data;
      }
      /**
       * Read data for the given record variable
       * @ignore
       * @param {IOBuffer} buffer - Buffer for the file data
       * @param {object} variable - Variable metadata
       * @param {object} recordDimension - Record dimension metadata
       * @return {Array} - Data of the element
       */


      function record(buffer, variable, recordDimension) {
        // variable type
        var type = types.str2num(variable.type);
        var width = variable.size ? variable.size / types.num2bytes(type) : 1; // size of the data
        // TODO streaming data

        var size = recordDimension.length; // iterates over the data

        var data = new Array(size);
        var step = recordDimension.recordStep;

        for (var i = 0; i < size; i++) {
          var currentOffset = buffer.offset;
          data[i] = types.readType(buffer, type, width);
          buffer.seek(currentOffset + step);
        }

        return data;
      }

      module.exports.nonRecord = nonRecord;
      module.exports.record = record;
      /***/
    },
    /* 6 */

    /***/
    function (module, exports, __webpack_require__) {

      var utils = __webpack_require__(0);

      var types = __webpack_require__(2); // Grammar constants


      var ZERO = 0;
      var NC_DIMENSION = 10;
      var NC_VARIABLE = 11;
      var NC_ATTRIBUTE = 12;
      /**
       * Read the header of the file
       * @ignore
       * @param {IOBuffer} buffer - Buffer for the file data
       * @param {number} version - Version of the file
       * @return {object} - Object with the fields:
       *  * `recordDimension`: Number with the length of record dimension
       *  * `dimensions`: List of dimensions
       *  * `globalAttributes`: List of global attributes
       *  * `variables`: List of variables
       */

      function header(buffer, version) {
        // Length of record dimension
        // sum of the varSize's of all the record variables.
        var header = {
          recordDimension: {
            length: buffer.readUint32()
          }
        }; // Version

        header.version = version; // List of dimensions

        var dimList = dimensionsList(buffer);
        header.recordDimension.id = dimList.recordId; // id of the unlimited dimension

        header.recordDimension.name = dimList.recordName; // name of the unlimited dimension

        header.dimensions = dimList.dimensions; // List of global attributes

        header.globalAttributes = attributesList(buffer); // List of variables

        var variables = variablesList(buffer, dimList.recordId, version);
        header.variables = variables.variables;
        header.recordDimension.recordStep = variables.recordStep;
        return header;
      }

      var NC_UNLIMITED = 0;
      /**
       * List of dimensions
       * @ignore
       * @param {IOBuffer} buffer - Buffer for the file data
       * @return {object} - Ojbect containing the following properties:
       *  * `dimensions` that is an array of dimension object:
       *  * `name`: String with the name of the dimension
       *  * `size`: Number with the size of the dimension dimensions: dimensions
       *  * `recordId`: the id of the dimension that has unlimited size or undefined,
       *  * `recordName`: name of the dimension that has unlimited size
       */

      function dimensionsList(buffer) {
        var recordId, recordName;
        var dimList = buffer.readUint32();

        if (dimList === ZERO) {
          utils.notNetcdf(buffer.readUint32() !== ZERO, 'wrong empty tag for list of dimensions');
          return [];
        } else {
          utils.notNetcdf(dimList !== NC_DIMENSION, 'wrong tag for list of dimensions'); // Length of dimensions

          var dimensionSize = buffer.readUint32();
          var dimensions = new Array(dimensionSize);

          for (var dim = 0; dim < dimensionSize; dim++) {
            // Read name
            var name = utils.readName(buffer); // Read dimension size

            var size = buffer.readUint32();

            if (size === NC_UNLIMITED) {
              // in netcdf 3 one field can be of size unlimmited
              recordId = dim;
              recordName = name;
            }

            dimensions[dim] = {
              name: name,
              size: size
            };
          }
        }

        return {
          dimensions: dimensions,
          recordId: recordId,
          recordName: recordName
        };
      }
      /**
       * List of attributes
       * @ignore
       * @param {IOBuffer} buffer - Buffer for the file data
       * @return {Array<object>} - List of attributes with:
       *  * `name`: String with the name of the attribute
       *  * `type`: String with the type of the attribute
       *  * `value`: A number or string with the value of the attribute
       */


      function attributesList(buffer) {
        var gAttList = buffer.readUint32();

        if (gAttList === ZERO) {
          utils.notNetcdf(buffer.readUint32() !== ZERO, 'wrong empty tag for list of attributes');
          return [];
        } else {
          utils.notNetcdf(gAttList !== NC_ATTRIBUTE, 'wrong tag for list of attributes'); // Length of attributes

          var attributeSize = buffer.readUint32();
          var attributes = new Array(attributeSize);

          for (var gAtt = 0; gAtt < attributeSize; gAtt++) {
            // Read name
            var name = utils.readName(buffer); // Read type

            var type = buffer.readUint32();
            utils.notNetcdf(type < 1 || type > 6, "non valid type ".concat(type)); // Read attribute

            var size = buffer.readUint32();
            var value = types.readType(buffer, type, size); // Apply padding

            utils.padding(buffer);
            attributes[gAtt] = {
              name: name,
              type: types.num2str(type),
              value: value
            };
          }
        }

        return attributes;
      }
      /**
       * List of variables
       * @ignore
       * @param {IOBuffer} buffer - Buffer for the file data
       * @param {number} recordId - Id of the unlimited dimension (also called record dimension)
       *                            This value may be undefined if there is no unlimited dimension
       * @param {number} version - Version of the file
       * @return {object} - Number of recordStep and list of variables with:
       *  * `name`: String with the name of the variable
       *  * `dimensions`: Array with the dimension IDs of the variable
       *  * `attributes`: Array with the attributes of the variable
       *  * `type`: String with the type of the variable
       *  * `size`: Number with the size of the variable
       *  * `offset`: Number with the offset where of the variable begins
       *  * `record`: True if is a record variable, false otherwise (unlimited size)
       */


      function variablesList(buffer, recordId, version) {
        var varList = buffer.readUint32();
        var recordStep = 0;

        if (varList === ZERO) {
          utils.notNetcdf(buffer.readUint32() !== ZERO, 'wrong empty tag for list of variables');
          return [];
        } else {
          utils.notNetcdf(varList !== NC_VARIABLE, 'wrong tag for list of variables'); // Length of variables

          var variableSize = buffer.readUint32();
          var variables = new Array(variableSize);

          for (var v = 0; v < variableSize; v++) {
            // Read name
            var name = utils.readName(buffer); // Read dimensionality of the variable

            var dimensionality = buffer.readUint32(); // Index into the list of dimensions

            var dimensionsIds = new Array(dimensionality);

            for (var dim = 0; dim < dimensionality; dim++) {
              dimensionsIds[dim] = buffer.readUint32();
            } // Read variables size


            var attributes = attributesList(buffer); // Read type

            var type = buffer.readUint32();
            utils.notNetcdf(type < 1 && type > 6, "non valid type ".concat(type)); // Read variable size
            // The 32-bit varSize field is not large enough to contain the size of variables that require
            // more than 2^32 - 4 bytes, so 2^32 - 1 is used in the varSize field for such variables.

            var varSize = buffer.readUint32(); // Read offset

            var offset = buffer.readUint32();

            if (version === 2) {
              utils.notNetcdf(offset > 0, 'offsets larger than 4GB not supported');
              offset = buffer.readUint32();
            }

            var record = false; // Count amount of record variables

            if (typeof recordId !== 'undefined' && dimensionsIds[0] === recordId) {
              recordStep += varSize;
              record = true;
            }

            variables[v] = {
              name: name,
              dimensions: dimensionsIds,
              attributes: attributes,
              type: types.num2str(type),
              size: varSize,
              offset: offset,
              record: record
            };
          }
        }

        return {
          variables: variables,
          recordStep: recordStep
        };
      }

      module.exports = header;
      /***/
    },
    /* 7 */

    /***/
    function (module, exports, __webpack_require__) {

      function toString() {
        var result = [];
        result.push('DIMENSIONS');

        var _iterator = _createForOfIteratorHelper(this.dimensions),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var dimension = _step.value;
            result.push("  ".concat(dimension.name.padEnd(30), " = size: ").concat(dimension.size));
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        result.push('');
        result.push('GLOBAL ATTRIBUTES');

        var _iterator2 = _createForOfIteratorHelper(this.globalAttributes),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var attribute = _step2.value;
            result.push("  ".concat(attribute.name.padEnd(30), " = ").concat(attribute.value));
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        var variables = JSON.parse(JSON.stringify(this.variables));
        result.push('');
        result.push('VARIABLES:');

        var _iterator3 = _createForOfIteratorHelper(variables),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var variable = _step3.value;
            variable.value = this.getDataVariable(variable);
            var stringify = JSON.stringify(variable.value);
            if (stringify.length > 50) stringify = stringify.substring(0, 50);

            if (!isNaN(variable.value.length)) {
              stringify += " (length: ".concat(variable.value.length, ")");
            }

            result.push("  ".concat(variable.name.padEnd(30), " = ").concat(stringify));
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        return result.join('\n');
      }

      module.exports = toString;
      /***/
    }
    /******/
    ])
  );
});

var NetCDFReaderExport$1 = NetCDFReaderExport;

// https://github.com/mbostock/shapefile Version 0.6.6. Copyright 2017 Mike Bostock.
var array_cancel = function array_cancel() {
  this._array = null;
  return Promise.resolve();
};

var array_read = function array_read() {
  var array = this._array;
  this._array = null;
  return Promise.resolve(array ? {
    done: false,
    value: array
  } : {
    done: true,
    value: undefined
  });
};

function array(array) {
  return new ArraySource(array instanceof Uint8Array ? array : new Uint8Array(array));
}

function ArraySource(array) {
  this._array = array;
}

ArraySource.prototype.read = array_read;
ArraySource.prototype.cancel = array_cancel;

var fetchPath = function fetchPath(url) {
  return fetch(url).then(function (response) {
    return response.body && response.body.getReader ? response.body.getReader() : response.arrayBuffer().then(array);
  });
};

var requestPath = function requestPath(url) {
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest();
    request.responseType = "arraybuffer";

    request.onload = function () {
      resolve(array(request.response));
    };

    request.onerror = reject;
    request.ontimeout = reject;
    request.open("GET", url, true);
    request.send();
  });
};

function path(path) {
  return (typeof fetch === "function" ? fetchPath : requestPath)(path);
}

function stream(source) {
  return typeof source.read === "function" ? source : source.getReader();
}

var empty = new Uint8Array(0);

var slice_cancel = function slice_cancel() {
  return this._source.cancel();
};

function concat$1(a, b) {
  if (!a.length) return b;
  if (!b.length) return a;
  var c = new Uint8Array(a.length + b.length);
  c.set(a);
  c.set(b, a.length);
  return c;
}

var slice_read = function slice_read() {
  var that = this,
      array = that._array.subarray(that._index);

  return that._source.read().then(function (result) {
    that._array = empty;
    that._index = 0;
    return result.done ? array.length > 0 ? {
      done: false,
      value: array
    } : {
      done: true,
      value: undefined
    } : {
      done: false,
      value: concat$1(array, result.value)
    };
  });
};

var slice_slice = function slice_slice(length) {
  if ((length |= 0) < 0) throw new Error("invalid length");
  var that = this,
      index = this._array.length - this._index; // If the request fits within the remaining buffer, resolve it immediately.

  if (this._index + length <= this._array.length) {
    return Promise.resolve(this._array.subarray(this._index, this._index += length));
  } // Otherwise, read chunks repeatedly until the request is fulfilled.


  var array = new Uint8Array(length);
  array.set(this._array.subarray(this._index));
  return function read() {
    return that._source.read().then(function (result) {
      // When done, it’s possible the request wasn’t fully fullfilled!
      // If so, the pre-allocated array is too big and needs slicing.
      if (result.done) {
        that._array = empty;
        that._index = 0;
        return index > 0 ? array.subarray(0, index) : null;
      } // If this chunk fulfills the request, return the resulting array.


      if (index + result.value.length >= length) {
        that._array = result.value;
        that._index = length - index;
        array.set(result.value.subarray(0, length - index), index);
        return array;
      } // Otherwise copy this chunk into the array, then read the next chunk.


      array.set(result.value, index);
      index += result.value.length;
      return read();
    });
  }();
};

function slice(source) {
  return typeof source.slice === "function" ? source : new SliceSource(typeof source.read === "function" ? source : source.getReader());
}

function SliceSource(source) {
  this._source = source;
  this._array = empty;
  this._index = 0;
}

SliceSource.prototype.read = slice_read;
SliceSource.prototype.slice = slice_slice;
SliceSource.prototype.cancel = slice_cancel;

var dbf_cancel = function dbf_cancel() {
  return this._source.cancel();
};

var readBoolean = function readBoolean(value) {
  return /^[nf]$/i.test(value) ? false : /^[yt]$/i.test(value) ? true : null;
};

var readDate = function readDate(value) {
  return new Date(+value.substring(0, 4), value.substring(4, 6) - 1, +value.substring(6, 8));
};

var readNumber = function readNumber(value) {
  return !(value = value.trim()) || isNaN(value = +value) ? null : value;
};

var readString = function readString(value) {
  return value.trim() || null;
};

var types = {
  B: readNumber,
  C: readString,
  D: readDate,
  F: readNumber,
  L: readBoolean,
  M: readNumber,
  N: readNumber
};

var dbf_read = function dbf_read() {
  var that = this,
      i = 1;
  return that._source.slice(that._recordLength).then(function (value) {
    return value && value[0] !== 0x1a ? {
      done: false,
      value: that._fields.reduce(function (p, f) {
        p[f.name] = types[f.type](that._decode(value.subarray(i, i += f.length)));
        return p;
      }, {})
    } : {
      done: true,
      value: undefined
    };
  });
};

var view = function view(array) {
  return new DataView(array.buffer, array.byteOffset, array.byteLength);
};

var dbf = function dbf(source, decoder) {
  source = slice(source);
  return source.slice(32).then(function (array) {
    var head = view(array);
    return source.slice(head.getUint16(8, true) - 32).then(function (array) {
      return new Dbf(source, decoder, head, view(array));
    });
  });
};

function Dbf(source, decoder, head, body) {
  this._source = source;
  this._decode = decoder.decode.bind(decoder);
  this._recordLength = head.getUint16(10, true);
  this._fields = [];

  for (var n = 0; body.getUint8(n) !== 0x0d; n += 32) {
    for (var j = 0; j < 11; ++j) {
      if (body.getUint8(n + j) === 0) break;
    }

    this._fields.push({
      name: this._decode(new Uint8Array(body.buffer, body.byteOffset + n, j)),
      type: String.fromCharCode(body.getUint8(n + 11)),
      length: body.getUint8(n + 16)
    });
  }
}

var prototype = Dbf.prototype;
prototype.read = dbf_read;
prototype.cancel = dbf_cancel;

function cancel() {
  return this._source.cancel();
}

var parseMultiPoint = function parseMultiPoint(record) {
  var i = 40,
      j,
      n = record.getInt32(36, true),
      coordinates = new Array(n);

  for (j = 0; j < n; ++j, i += 16) {
    coordinates[j] = [record.getFloat64(i, true), record.getFloat64(i + 8, true)];
  }

  return {
    type: "MultiPoint",
    coordinates: coordinates
  };
};

var parseNull = function parseNull() {
  return null;
};

var parsePoint = function parsePoint(record) {
  return {
    type: "Point",
    coordinates: [record.getFloat64(4, true), record.getFloat64(12, true)]
  };
};

var parsePolygon = function parsePolygon(record) {
  var i = 44,
      j,
      n = record.getInt32(36, true),
      m = record.getInt32(40, true),
      parts = new Array(n),
      points = new Array(m),
      polygons = [],
      holes = [];

  for (j = 0; j < n; ++j, i += 4) {
    parts[j] = record.getInt32(i, true);
  }

  for (j = 0; j < m; ++j, i += 16) {
    points[j] = [record.getFloat64(i, true), record.getFloat64(i + 8, true)];
  }

  parts.forEach(function (i, j) {
    var ring = points.slice(i, parts[j + 1]);
    if (ringClockwise(ring)) polygons.push([ring]);else holes.push(ring);
  });
  holes.forEach(function (hole) {
    polygons.some(function (polygon) {
      if (ringContainsSome(polygon[0], hole)) {
        polygon.push(hole);
        return true;
      }
    }) || polygons.push([hole]);
  });
  return polygons.length === 1 ? {
    type: "Polygon",
    coordinates: polygons[0]
  } : {
    type: "MultiPolygon",
    coordinates: polygons
  };
};

function ringClockwise(ring) {
  if ((n = ring.length) < 4) return false;
  var i = 0,
      n,
      area = ring[n - 1][1] * ring[0][0] - ring[n - 1][0] * ring[0][1];

  while (++i < n) {
    area += ring[i - 1][1] * ring[i][0] - ring[i - 1][0] * ring[i][1];
  }

  return area >= 0;
}

function ringContainsSome(ring, hole) {
  var i = -1,
      n = hole.length,
      c;

  while (++i < n) {
    if (c = ringContains(ring, hole[i])) {
      return c > 0;
    }
  }

  return false;
}

function ringContains(ring, point) {
  var x = point[0],
      y = point[1],
      contains = -1;

  for (var i = 0, n = ring.length, j = n - 1; i < n; j = i++) {
    var pi = ring[i],
        xi = pi[0],
        yi = pi[1],
        pj = ring[j],
        xj = pj[0],
        yj = pj[1];

    if (segmentContains(pi, pj, point)) {
      return 0;
    }

    if (yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi) {
      contains = -contains;
    }
  }

  return contains;
}

function segmentContains(p0, p1, p2) {
  var x20 = p2[0] - p0[0],
      y20 = p2[1] - p0[1];
  if (x20 === 0 && y20 === 0) return true;
  var x10 = p1[0] - p0[0],
      y10 = p1[1] - p0[1];
  if (x10 === 0 && y10 === 0) return false;
  var t = (x20 * x10 + y20 * y10) / (x10 * x10 + y10 * y10);
  return t < 0 || t > 1 ? false : t === 0 || t === 1 ? true : t * x10 === x20 && t * y10 === y20;
}

var parsePolyLine = function parsePolyLine(record) {
  var i = 44,
      j,
      n = record.getInt32(36, true),
      m = record.getInt32(40, true),
      parts = new Array(n),
      points = new Array(m);

  for (j = 0; j < n; ++j, i += 4) {
    parts[j] = record.getInt32(i, true);
  }

  for (j = 0; j < m; ++j, i += 16) {
    points[j] = [record.getFloat64(i, true), record.getFloat64(i + 8, true)];
  }

  return n === 1 ? {
    type: "LineString",
    coordinates: points
  } : {
    type: "MultiLineString",
    coordinates: parts.map(function (i, j) {
      return points.slice(i, parts[j + 1]);
    })
  };
};

var concat$1$1 = function concat$1(a, b) {
  var ab = new Uint8Array(a.length + b.length);
  ab.set(a, 0);
  ab.set(b, a.length);
  return ab;
};

var shp_read = function shp_read() {
  var that = this;
  ++that._index;
  return that._source.slice(12).then(function (array) {
    if (array == null) return {
      done: true,
      value: undefined
    };
    var header = view(array); // If the record starts with an invalid shape type (see #36), scan ahead in
    // four-byte increments to find the next valid record, identified by the
    // expected index, a non-empty content length and a valid shape type.

    function skip() {
      return that._source.slice(4).then(function (chunk) {
        if (chunk == null) return {
          done: true,
          value: undefined
        };
        header = view(array = concat$1$1(array.slice(4), chunk));
        return header.getInt32(0, false) !== that._index ? skip() : read();
      });
    } // All records should have at least four bytes (for the record shape type),
    // so an invalid content length indicates corruption.


    function read() {
      var length = header.getInt32(4, false) * 2 - 4,
          type = header.getInt32(8, true);
      return length < 0 || type && type !== that._type ? skip() : that._source.slice(length).then(function (chunk) {
        return {
          done: false,
          value: type ? that._parse(view(concat$1$1(array.slice(8), chunk))) : null
        };
      });
    }

    return read();
  });
};

var parsers = {
  0: parseNull,
  1: parsePoint,
  3: parsePolyLine,
  5: parsePolygon,
  8: parseMultiPoint,
  11: parsePoint,
  // PointZ
  13: parsePolyLine,
  // PolyLineZ
  15: parsePolygon,
  // PolygonZ
  18: parseMultiPoint,
  // MultiPointZ
  21: parsePoint,
  // PointM
  23: parsePolyLine,
  // PolyLineM
  25: parsePolygon,
  // PolygonM
  28: parseMultiPoint // MultiPointM

};

var shp = function shp(source) {
  source = slice(source);
  return source.slice(100).then(function (array) {
    return new Shp(source, view(array));
  });
};

function Shp(source, header) {
  var type = header.getInt32(32, true);
  if (!(type in parsers)) throw new Error("unsupported shape type: " + type);
  this._source = source;
  this._type = type;
  this._index = 0;
  this._parse = parsers[type];
  this.bbox = [header.getFloat64(36, true), header.getFloat64(44, true), header.getFloat64(52, true), header.getFloat64(60, true)];
}

var prototype$2 = Shp.prototype;
prototype$2.read = shp_read;
prototype$2.cancel = cancel;

function noop() {}

var shapefile_cancel = function shapefile_cancel() {
  return Promise.all([this._dbf && this._dbf.cancel(), this._shp.cancel()]).then(noop);
};

var shapefile_read = function shapefile_read() {
  var that = this;
  return Promise.all([that._dbf ? that._dbf.read() : {
    value: {}
  }, that._shp.read()]).then(function (results) {
    var dbf = results[0],
        shp = results[1];
    return shp.done ? shp : {
      done: false,
      value: {
        type: "Feature",
        properties: dbf.value,
        geometry: shp.value
      }
    };
  });
};

var shapefile = function shapefile(shpSource, dbfSource, decoder) {
  return Promise.all([shp(shpSource), dbfSource && dbf(dbfSource, decoder)]).then(function (sources) {
    return new Shapefile(sources[0], sources[1]);
  });
};

function Shapefile(shp$$1, dbf$$1) {
  this._shp = shp$$1;
  this._dbf = dbf$$1;
  this.bbox = shp$$1.bbox;
}

var prototype$1 = Shapefile.prototype;
prototype$1.read = shapefile_read;
prototype$1.cancel = shapefile_cancel;

function open$1(shp$$1, dbf$$1, options) {
  if (typeof dbf$$1 === "string") {
    if (!/\.dbf$/.test(dbf$$1)) dbf$$1 += ".dbf";
    dbf$$1 = path(dbf$$1);
  } else if (dbf$$1 instanceof ArrayBuffer || dbf$$1 instanceof Uint8Array) {
    dbf$$1 = array(dbf$$1);
  } else if (dbf$$1 != null) {
    dbf$$1 = stream(dbf$$1);
  }

  if (typeof shp$$1 === "string") {
    if (!/\.shp$/.test(shp$$1)) shp$$1 += ".shp";
    if (dbf$$1 === undefined) dbf$$1 = path(shp$$1.substring(0, shp$$1.length - 4) + ".dbf")["catch"](function () {});
    shp$$1 = path(shp$$1);
  } else if (shp$$1 instanceof ArrayBuffer || shp$$1 instanceof Uint8Array) {
    shp$$1 = array(shp$$1);
  } else {
    shp$$1 = stream(shp$$1);
  }

  return Promise.all([shp$$1, dbf$$1]).then(function (sources) {
    var shp$$1 = sources[0],
        dbf$$1 = sources[1],
        encoding = "windows-1252";
    if (options && options.encoding != null) encoding = options.encoding;
    return shapefile(shp$$1, dbf$$1, dbf$$1 && new TextDecoder(encoding));
  });
}

function openShp(source, options) {
  if (typeof source === "string") {
    if (!/\.shp$/.test(source)) source += ".shp";
    source = path(source);
  } else if (source instanceof ArrayBuffer || source instanceof Uint8Array) {
    source = array(source);
  } else {
    source = stream(source);
  }

  return Promise.resolve(source).then(shp);
}

function openDbf(source, options) {
  var encoding = "windows-1252";
  if (options && options.encoding != null) encoding = options.encoding;
  encoding = new TextDecoder(encoding);

  if (typeof source === "string") {
    if (!/\.dbf$/.test(source)) source += ".dbf";
    source = path(source);
  } else if (source instanceof ArrayBuffer || source instanceof Uint8Array) {
    source = array(source);
  } else {
    source = stream(source);
  }

  return Promise.resolve(source).then(function (source) {
    return dbf(source, encoding);
  });
}

function read(shp$$1, dbf$$1, options) {
  return open$1(shp$$1, dbf$$1, options).then(function (source) {
    var features = [],
        collection = {
      type: "FeatureCollection",
      features: features,
      bbox: source.bbox
    };
    return source.read().then(function read(result) {
      if (result.done) return collection;
      features.push(result.value);
      return source.read().then(read);
    });
  });
}

var shapefile$1 = {
  open: open$1,
  openShp: openShp,
  openDbf: openDbf,
  read: read
};

var VERSION = '0.0.1';

export { BillboardGraphic as BillBoardGraphic, CVT$1 as CVT, Cartometry, CartometryManager, CartometryType$1 as CartometryType, CesiumProError$1 as CesiumProError, CursorTip, DataLoader, DraggableElement, Event, Graphic, GroundSkyBox, LabelGraphic, ModelAttachVector, ModelGraphic, PointGraphic, PolygonGraphic, PolylineGraphic, URL, VERSION, ViewerParams, shader as _shaderGroundSkyBoxFS, shader$1 as _shaderGroundSkyBoxVS, errorCatch as ajaxCatch, checkViewer, createViewer, dateFormat, defaultValue, defined, depthTest, filesaver, flyTo, guid, jQuery as jquery, SuperGif as libgif, logo, NetCDFReaderExport$1 as netcdfjs, pickPosition, shapefile$1 as shapefile };
//# sourceMappingURL=CesiumPro.esm.js.map

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
    Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
    return true;
  } catch (e) {
    return false;
  }
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

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
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

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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

/**
 * 箭头构件类型
 * @exports ComponentType
 * @enum {Number}
 */
var ComponentType = {
  /**
   * 箭头
   * @type {Number}
   * @constant
   */
  ARROW: 0,

  /**
   * 半箭头
   * @type {Number}
   * @constant
   */
  HALF_ARROW: 1,

  /**
   * 贝塞尔曲线
   * @type {Number}
   * @constant
   */
  BEZIER: 2,

  /**
   * 样条曲线
   * @type {Number}
   * @constant
   */
  SPLINE: 3,

  /**
   * 燕尾
   * @type {Number}
   * @constant
   */
  SWALLOW_TRAIL: 4,

  /**
   * 梯形
   * @type {Number}
   * @constant
   */
  TRAPEZOID: 5,

  /**
   * 半梯形
   * @type {Number}
   * @constant
   */
  HALF_TRAPEZOID: 6,
  HALF_SWALLOW_TRAIL: 7,
  HALF_SPLINE: 8
};

ComponentType.getLabel = function(component) {
  var label;

  switch (component.type) {
    case ComponentType.HALF_ARROW:
      label = 'HALF_ARROW';
      break;

    case ComponentType.ARROW:
      lebel = 'ARROW';
      break;

    case ComponentType.BEZIER:
      label = 'BEZIER';
      break;

    case ComponentType.SPLINE:
      label = "SPLINE";
      break;

    case ComponentType.SWALLOW_TRAIL:
      label = 'SWALLOW_TRAIL';
      break;

    case ComponentType.HALF_SWALLOW_TRAIL:
      label = 'HALF_SWALLOW_TRAIL';
      break;

    case ComponentType.HALF_SPLINE:
      label = 'HALF_SPLINE';
      break;

    default:
      label = undefined;
  }

  return label;
};
/**
 * function
 * @param  {[type]} type [description]
 * @return {[type]}      [description]
 */


ComponentType.getErrorMsg = function(component) {
  var type = component.type;
  var controls = component.controls.length;

  if (!ComponentType.validate(component)) {
    throw new Error(ComponentType.getLabel(component) + '控制点个数必须不少于' + component.controlPointsCount[0] + ",实际只有" + controls + '个');
  }
};

ComponentType.validate = function(component) {
  var controls = component.controls.length;

  if (controls < component.controlPointsCount[0]) {
    return false;
  }

  return true;
};

var Component = /*#__PURE__*/ function() {
  function Component() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Component);

    this._controls = options.controls || [];
    this._index = options.index;
    this._inverse = options.inverse || false;

    if (!this._index) {
      var count = this._controls.length;
      this._index = new Array(count);

      for (var i = 0; i < count; i++) {
        this._index[i] = i;
      }
    }
  }
  /**
   * 描述箭头的控制点个数，数组第一个值为最小个数，控制点小于最小值将无法创建箭头，
   * 数组第二个值表示最大控制点个数，大于最大值的控制点将被抛弃
   * @return {Point[]} 控制点个数
   */


  _createClass(Component, [{
    key: "createNodes",
    value: function createNodes() {
      ComponentType.getErrorMsg(this);
    }
    /**
     * 返回index指定的控制点
     * @param  {Number} index
     * @return {Number[]}
     */

  }, {
    key: "get",
    value: function get(index) {
      if (this.index) {
        return this.controls[this.index[index]];
      }

      return this.controls[index];
    }
  }, {
    key: "controls",
    get: function get() {
      return this._controls;
    }
    /**
     * 生成组件时输入顶点的索引
     * @return {Number[]}
     */

  }, {
    key: "index",
    get: function get() {
      return this._index;
    }
    /**
     * 组件类型
     * @return {ComponentType}
     */

  }, {
    key: "type",
    get: function get() {
      return this._type;
    }
  }, {
    key: "controlPointsCount",
    get: function get() {
      return this._controlPointsCount;
    }
  }, {
    key: "nodes",
    get: function get() {
      return this._nodes;
    },
    set: function set(v) {
      this._nodes = v;
    }
    /**
     * 确定箭头在控制点连线的的左侧还是右侧，inverse为false是生成的图形在控制点连线的左侧
     * @return {Bool}
     */

  }, {
    key: "inverse",
    get: function get() {
      return this._inverse;
    },
    set: function set(v) {
      this._inverse = v;
    }
  }]);

  return Component;
}();

var PlotUtil = /*#__PURE__*/ function() {
  /**
   * 几何图形学基础方法
   */
  function PlotUtil() {
    _classCallCheck(this, PlotUtil);
  }
  /**
   * 平面点的欧氏距离，如果点的数据大于2，将计算相邻两个点的距离之和。
   * @param  {Number[]} args 需要计算距离的平面点集合
   * @return {Float}      欧氏距离
   */


  _createClass(PlotUtil, null, [{
    key: "distance",
    value: function distance() {
      var length = arguments.length;

      if (length < 2) {
        return 0;
      }

      var distance = 0;

      for (var i = 0; i < length - 1; i++) {
        var nextIndex = (i + 1) % length;
        var start = i < 0 || arguments.length <= i ? undefined : arguments[i];
        var end = nextIndex < 0 || arguments.length <= nextIndex ? undefined : arguments[nextIndex];
        distance += Math.sqrt(Math.pow(start[0] - end[0], 2) + Math.pow(start[1] - end[1], 2));
      }

      return distance;
    }
    /**
     * @param  {Number[]} points            [description]
     * @param  {Number} [percentage=0.99] [description]
     * @return {Number}                  长度
     */

  }, {
    key: "baseLength",
    value: function baseLength(points) {
      var percentage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.99;
      return Math.pow(PlotUtil.distance.apply(PlotUtil, _toConsumableArray(points)), percentage);
    }
    /**
     * 平面两点的中点
     * @param  {Number[]} start 起点
     * @param  {Number[]} end   终点
     * @return {Number[]}       中点坐标
     */

  }, {
    key: "mid",
    value: function mid(start, end) {
      return [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
    }
    /**
     * 方位角
     * @param  {Number[]} start 起点
     * @param  {Number[]} end   终点
     * @return {Number} 向量与Y轴的夹角
     */

  }, {
    key: "azimuth",
    value: function azimuth(start, end) {
      var result;
      var _ref = [end, start];
      start = _ref[0];
      end = _ref[1];
      //向量与Y轴的夹角;
      var angle = Math.asin(Math.abs(start[1] - end[1]) / PlotUtil.distance(start, end));
      result = start[1] >= end[1] && start[0] >= end[0] ? angle + Math.PI : start[1] >= end[1] && start[0] < end[0] ? Math.PI * 2 - angle : start[1] < end[1] && start[0] >= end[0] ? Math.PI - angle : angle;
      return result;
    }
    /**
     * 根据两个点计算第三个点,具体为：如果以end为圆心，以radius为半径创建一个圆,以向量<start,end>方位角为起始位置，
     * 旋转angle度后得到的圆弧上的点,inverse为false，向正方向旋转,true,向负方向旋转
     * @param  {Number[]} start   起点，即圆心
     * @param  {Number[]} end     终点
     * @param  {Number} angle   旋转角度，单位弧度
     * @param  {Number} radius    半径
     * @param  {bool} inverse  是否逆向旋转
     * @return {Number[]}      新点位
     */

  }, {
    key: "thirdPoint",
    value: function thirdPoint(start, end, angle, radius) {
      var inverse = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      var azimuth = PlotUtil.azimuth(start, end);
      var adjustAngle = inverse ? azimuth - angle : azimuth + angle;
      var x = radius * Math.cos(adjustAngle);
      var y = radius * Math.sin(adjustAngle);
      return [end[0] + x, end[1] + y];
    }
    /**
     * 判断由t,o,e是否顺时针环绕
     * @param  {Number[]}  t
     * @param  {Number[]}  o
     * @param  {Number[]}  e
     * @return {Boolean}
     */

  }, {
    key: "isClockWise",
    value: function isClockWise(t, o, e) {
      return (e[1] - t[1]) * (o[0] - t[0]) > (o[1] - t[1]) * (e[0] - t[0]);
    }
    /**
     * 计算两条直线之间的夹角，两条直线必须有公共点
     * @param  {Number[]} origin 两直接的公共点
     * @param  {Number[]} point1 直线1的另一个顶点
     * @param  {Number[]} point2 直线2的另一个顶点
     * @return {number}  两直线之间的夹角，单位弧度
     */

  }, {
    key: "angleOfThreePoints",
    value: function angleOfThreePoints(origin, point1, point2) {
      var angle = PlotUtil.azimuth(origin, point1) - PlotUtil.azimuth(origin, point2);
      return angle > 0 ? angle : Math.PI * 2 + angle;
    }
    /**
     * 四边形B样条曲面因子
     * @param  {Number} t
     * @param  {Number} o
     * @return {Number}
     */

  }, {
    key: "quadricBSplineFactor",
    value: function quadricBSplineFactor(t, o) {
      if (t === 0) {
        return Math.pow(o - 1, 2) / 2;
      }

      if (t === 1) {
        return (-2.0 * Math.pow(o, 2) + 2 * o + 1) / 2;
      }

      if (t === 2) {
        return Math.pow(o, 2) / 2;
      }

      return 0;
    }
    /**
     * 四边形B样条曲线
     *
     * @param  {Number[]} points 计算四边形B样条曲线的输入点
     * @return {Number[]}        构成四边形B样条曲线的点
     */

  }, {
    key: "quadricBSpline",
    value: function quadricBSpline(points) {
      if (points <= 2) {
        return points;
      }

      var result = [];
      var fac = 2;
      var length = points.length - fac - 1;
      result.push(points[0]);

      for (var n = 0; n <= length; n++) {
        for (var g = 0; g <= 1; g += 0.05) {
          var x = 0,
            y = 0;

          for (var s = 0; s <= fac; s++) {
            var factor = PlotUtil.quadricBSplineFactor(s, g);
            x += factor * points[n + s][0];
            y += factor * points[n + s][1];
          }

          result.push([x, y]);
        }
      }

      result.push(points[points.length - 1]);
      return result;
    }
    /**
     * 组合C<sub>0</sub><sup style="margin-left:-5px">t</sup>的值
     * @param  {Number} t
     * @param  {Number} o
     * @return {Number}
     */

  }, {
    key: "binomialFactor",
    value: function binomialFactor(t, o) {
      return PlotUtil.factorial(t) / (PlotUtil.factorial(o) * PlotUtil.factorial(t - o));
    }
    /**
     * 求阶乘
     * @param  {Number} n n必须不小于0
     * @return {Number}   n的阶乘(n!)
     */

  }, {
    key: "factorial",
    value: function factorial(n) {
      if (n < 0) {
        return NaN;
      }

      if (n === 0) {
        return 1;
      }

      return n * PlotUtil.factorial(n - 1);
    }
    /**
     * 贝塞尔曲线
     * @param {Number[]} points [description]
     * @return {Number[]}   构成贝塞尔曲线的点集
     */

  }, {
    key: "BezierCurve",
    value: function BezierCurve(points) {
      var count = points.length;

      if (count < 2) {
        return points;
      }

      var curves = [];

      for (var i = 0; i <= 1; i += 0.01) {
        var x = 0,
          y = 0;

        for (var j = 0; j < count; j++) {
          var factor = PlotUtil.binomialFactor(count - 1, j);
          var s = Math.pow(i, j);
          var a = Math.pow(1 - i, count - j - 1);
          x += factor * s * a * points[j][0];
          y += factor * s * a * points[j][1];
        }

        curves.push([x, y]);
      }

      curves.push(points[count - 1]);
      return curves;
    }
  }]);

  return PlotUtil;
}();

var HalfArrowComponent = /*#__PURE__*/ function(_Component) {
  _inherits(HalfArrowComponent, _Component);

  var _super = _createSuper(HalfArrowComponent);

  /**
   * 半箭头头部
   *           *-----------------------------
   *          **             |              |
   *         * *             |              |
   *        *  *           neck height  arrow height
   *       *   *             |              |
   *      *    *             |              |
   *     *     *             |              |
   *    *   ***x（neck control）--------------              |
   *   *  *                                 |
   *  *--------x(tail control)-----------------------------
   *
   *
   *
   * @param {Object} [options={}] 具有以下属性
   * @param {Number} [options.heightFactor=0.18] 箭头状况高度占整个图形高度(控制点连线长度)的百分比
   * @param {Number} [options.neckHeightFactor=0.15] 脖子占整个整个图形高度的百分比
   * @param {Number} [options.widthFactor=0.3] 箭头宽度占高度的百分比
   * @param {Number} [options.neckWidthFactor=options.widthFactor/2] 脖子宽度占箭头高度的百分比
   * @param {Number} [options.inverse=false] inverse为false是生成的图形在控制点连线的右侧
   */
  function HalfArrowComponent() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, HalfArrowComponent);

    _this = _super.call(this, options);
    _this._controlPointsCount = [2, 2];
    _this._type = ComponentType.HALF_ARROW;
    _this._heightFactor = defaultValue(options.heightFactor, 0.18);
    _this._neckHeightFactor = defaultValue(options.neckHeightFactor, 0.15);
    _this._headWidthFactor = defaultValue(options.headWidthFactor, 0.5);
    _this._neckWidthFactor = defaultValue(options.neckWidthFactor, 0.3);
    _this._headMaxHeight = options.headMaxHeight;
    _this._headTailHeightFactor = defaultValue(options.headTailHeightFactor, 0.3);
    _this._inverse = defaultValue(options.inverse, false);
    _this._nodes = [];

    _this.createNodes();

    return _this;
  }

  _createClass(HalfArrowComponent, [{
    key: "createNodes",

    /**
     * 生成构成图形的顶点
     * @return {Number[]} 生成构成图形的顶点
     */
    value: function createNodes() {
      _get(_getPrototypeOf(HalfArrowComponent.prototype), "createNodes", this).call(this);

      var controls = this.controls;
      var baseLength = PlotUtil.baseLength(controls);
      var height = this.heightFactor * baseLength;
      baseLength = PlotUtil.distance(this.get(0), this.get(1));

      if (this.headMaxHeight && height > this.headMaxHeight) {
        height = this.headMaxHeight;
      }

      var neckWidth = this.neckWidthFactor * height;
      var width = this.headWidthFactor * height;
      height = height > baseLength ? baseLength : height;
      var neckHeight = this.neckHeightFactor * height;
      var tailControl = PlotUtil.thirdPoint(this.get(0), this.get(1), 0, height);
      var neckControl = PlotUtil.thirdPoint(this.get(0), this.get(1), 0, neckHeight);
      var tail = PlotUtil.thirdPoint(this.get(1), tailControl, Math.PI / 2, width, this.inverse);
      var neck = PlotUtil.thirdPoint(this.get(1), neckControl, Math.PI / 2, neckWidth, this.inverse);
      this.neck = neck;
      this.tail = tail;
      this.neckControl = neckControl;
      this.tailControl = tailControl;
      this._nodes = [neckControl, neck, tail, this.get(1)];
      this.completedNodes = new Map();
      this.completedNodes.set(this.inverse, [neckControl, neck, tail, this.get(1)]);
      return this._nodes;
    }
  }, {
    key: "headMaxHeight",
    get: function get() {
      return this._headMaxHeight;
    }
    /**
     * 箭头高度因子
     * @return {Number} 箭头高度占整个图形高度的百分比
     */

  }, {
    key: "heightFactor",
    get: function get() {
      return this._heightFactor;
    }
    /**
     * 脖子高度因子
     * @return {Number}
     */

  }, {
    key: "neckHeightFactor",
    get: function get() {
      return this._neckHeightFactor;
    }
    /**
     * 箭头宽度因子
     * @return {Number}
     */

  }, {
    key: "headWidthFactor",
    get: function get() {
      return this._headWidthFactor;
    }
    /**
     * 脖子宽度因子
     * @return {Number}
     */

  }, {
    key: "neckWidthFactor",
    get: function get() {
      return this._neckWidthFactor;
    }
    /**
     * 构成图形的顶点
     * @return {[type]}
     */

  }, {
    key: "nodes",
    get: function get() {
      return this._nodes;
    }
  }]);

  return HalfArrowComponent;
}(Component);

var ArrowComponent = /*#__PURE__*/ function(_HalfArrowComponent) {
  _inherits(ArrowComponent, _HalfArrowComponent);

  var _super = _createSuper(ArrowComponent);

  /**
   * 箭头头部
   *
   * @param {Object} [options={}] 具有以下属性
   * @param {Number} [options.heightFactor=0.18] 箭头状况高度占整个图形高度(控制点连线长度)的百分比
   * @param {Number} [options.neckHeightFactor=0.85] 脖子占整个箭头的百分比
   * @param {Number} [options.widthFactor=0.3] 箭头宽度占高度的百分比
   * @param {Number} [options.neckWidthFactor=options.widthFactor/2] 脖子宽度占箭头高度的百分比
   */
  function ArrowComponent() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ArrowComponent);

    _this = _super.call(this, options);
    _this._type = ComponentType.ARROW;

    _this.createNodes();

    return _this;
  }

  _createClass(ArrowComponent, [{
    key: "createNodes",
    value: function createNodes() {
      var completedNodes = new Map();
      this._inverse = true;

      var rightHalf = _get(_getPrototypeOf(ArrowComponent.prototype), "createNodes", this).call(this);

      completedNodes.set(this.inverse, _toConsumableArray(rightHalf));
      this._inverse = false;

      var leftHalf = _get(_getPrototypeOf(ArrowComponent.prototype), "createNodes", this).call(this);

      completedNodes.set(this.inverse, _toConsumableArray(leftHalf));
      leftHalf.shift();
      rightHalf.shift();
      leftHalf.pop();
      this.inverse = undefined;
      this.completedNodes = completedNodes;
      this._nodes = [].concat(_toConsumableArray(leftHalf), _toConsumableArray(rightHalf.reverse()));
      return [].concat(_toConsumableArray(leftHalf), _toConsumableArray(rightHalf.reverse()));
    }
  }]);

  return ArrowComponent;
}(HalfArrowComponent);

var HalfTrapezoidComponent = /*#__PURE__*/ function(_Component) {
  _inherits(HalfTrapezoidComponent, _Component);

  var _super = _createSuper(HalfTrapezoidComponent);

  /**
   * 半梯形
   *    *** head control
   *   *  *
   *  *   *
   * *****x tail control
   * @param {[type]} options [description]
   * @param {Number} [options.heightFactor] 梯形高度高图形高度的百分比
   * @param {Number} [options.tailWidth=0.5] 梯形尾部宽度占高度的百分比
   * @param {Number} [options.headWidthFactor=0.3] 梯形头部宽度占高度的百分比
   */
  function HalfTrapezoidComponent(options) {
    var _this;

    _classCallCheck(this, HalfTrapezoidComponent);

    _this = _super.call(this, options);
    _this._type = ComponentType.HALF_TRAPEZOID;
    _this._controlPointsCount = [2, 2];
    _this._heightFactor = defaultValue(options.heightFactor, 0.82);
    _this._tailWidthFactor = defaultValue(options.tailWidthFactor, 0.5);
    _this._headWidthFactor = defaultValue(options.headWidthFactor, 0.3);

    _this.createNodes();

    return _this;
  }
  /**
   * 梯形高度因子
   * @return {Number} 梯形高度高图形高度的百分比
   */


  _createClass(HalfTrapezoidComponent, [{
    key: "createNodes",
    value: function createNodes() {
      _get(_getPrototypeOf(HalfTrapezoidComponent.prototype), "createNodes", this).call(this);

      var tailControl = this.get(0);
      var baseLength = PlotUtil.baseLength(this._controls);
      var height = this.heightFactor * baseLength;
      var headControl = PlotUtil.thirdPoint(this.get(1), tailControl, 0, height, this.inverse);
      var tailWidth = this.tailWidthFactor * baseLength;
      var headWidth = this.headWidthFactor * baseLength;
      var leftHead = PlotUtil.thirdPoint(tailControl, headControl, Math.PI / 2, headWidth, this.inverse);
      var leftTail = PlotUtil.thirdPoint(headControl, tailControl, Math.PI / 2, tailWidth, !this.inverse);
      this._nodes = [leftHead, leftTail, tailControl, headControl].flat();
      this.completedNodes = new Map();
      this.completedNodes.set(this.inverse, [leftTail]);
      return [leftTail];
    }
  }, {
    key: "linkArrow",
    value: function linkArrow(options) {
      var arrowNodes = options.arrowNodes,
        bodyNodes = options.bodyNodes,
        inverse = options.inverse;

      if (inverse) {
        return [].concat(_toConsumableArray(bodyNodes), _toConsumableArray(arrowNodes));
      }

      return [].concat(_toConsumableArray(arrowNodes), _toConsumableArray(bodyNodes));
    }
  }, {
    key: "linkTail",
    value: function linkTail() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var tailNodes = options.tailNodes,
        bodyNodes = options.bodyNodes,
        inverse = options.inverse;
      return [].concat(_toConsumableArray(tailNodes), _toConsumableArray(bodyNodes));
    }
  }, {
    key: "heightFactor",
    get: function get() {
      return this._heightFactor;
    }
    /**
     * 梯形头部宽度因子
     * @return {Number} 梯形头部宽度占高度的百分比
     */

  }, {
    key: "headWidthFactor",
    get: function get() {
      return this._headWidthFactor;
    }
    /**
     * 梯形尾部宽度因子
     * @return {Number} 梯形尾部宽度占高度的百分比
     */

  }, {
    key: "tailWidthFactor",
    get: function get() {
      return this._tailWidthFactor;
    }
  }]);

  return HalfTrapezoidComponent;
}(Component);

var TrapezoidComponent = /*#__PURE__*/ function(_HalfTrapezoidCompone) {
  _inherits(TrapezoidComponent, _HalfTrapezoidCompone);

  var _super = _createSuper(TrapezoidComponent);

  function TrapezoidComponent() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, TrapezoidComponent);

    _this = _super.call(this, options);
    _this._type = ComponentType.TRAPEZOID;
    return _this;
  }

  _createClass(TrapezoidComponent, [{
    key: "createNodes",
    value: function createNodes() {
      var completedNodes = new Map();
      this.inverse = false;

      var right = _get(_getPrototypeOf(TrapezoidComponent.prototype), "createNodes", this).call(this);

      completedNodes.set(this.inverse, _toConsumableArray(right));
      this.inverse = true;

      var left = _get(_getPrototypeOf(TrapezoidComponent.prototype), "createNodes", this).call(this);

      completedNodes.set(this.inverse, _toConsumableArray(left));
      this.completedNodes = completedNodes;
      this.inverse = undefined;
      this._nodes = left.concat(right);
      return this._nodes;
    }
  }]);

  return TrapezoidComponent;
}(HalfTrapezoidComponent);

var Arrow = /*#__PURE__*/ function() {
  function Arrow(options) {
    _classCallCheck(this, Arrow);

    this._headHeightFactor = defaultValue(options.headHeightFactor, 0.2);
    this._neckHeightFactor = defaultValue(options.neckHeightFactor, 0.8);
    this._headWidthFactor = defaultValue(options.headWidthFactor, 0.5);
    this._neckWidthFactor = defaultValue(options.neckWidthFactor, 0.3);
    this._tailWidthFactor = defaultValue(options.tailWidthFactor, 0.3);
    this._tailHeightFactor = defaultValue(options.tailHeightFactor, 0.20);
    this._controls = defaultValue(options.controls, []);
    this._headComponent = undefined;
    this._bodyComponent = undefined;
    this._tailComponent = undefined;
    this._nodes = undefined;
    this._polygon = [];
    this._polyline = [];
  }

  _createClass(Arrow, [{
    key: "postProcessing",

    /**
     * 几何图形做进一步处理
     * @return {Number[]}
     */
    value: function postProcessing(pts) {
      return pts;
    }
    /**
     * 合并箭头的各个组件
     * @return {Number[]}
     */

  }, {
    key: "merge",
    value: function merge() {
      var _this$polygon, _this$polyline;

      var head = this.headComponent;
      var body = this.bodyComponent;
      var tail = this.tailComponent;
      var bodyNodes;
      body && (bodyNodes = body.completedNodes);
      var nodes = [];
      var tNode;

      if (bodyNodes && bodyNodes.get(true)) {
        tNode = bodyNodes.get(true);
        nodes = body.linkTail({
          tailNodes: nodes,
          bodyNodes: tNode
        });
      }

      if (head) {
        tNode = head.nodes;

        if (body) {
          nodes = body.linkArrow({
            arrowNodes: tNode,
            bodyNodes: nodes,
            inverse: true,
            target: this
          });
        } else {
          nodes = tNode;
        }
      }

      if (bodyNodes && bodyNodes.get(false)) {
        tNode = bodyNodes.get(false);
        nodes = body.linkArrow({
          arrowNodes: nodes,
          bodyNodes: tNode,
          inverse: false,
          target: this
        });
      }

      if (tail) {
        var _nodes;

        (_nodes = nodes).push.apply(_nodes, _toConsumableArray(tail.nodes));
      }

      this.reset();

      (_this$polygon = this.polygon).push.apply(_this$polygon, _toConsumableArray(nodes.flat())); // nodes.shift();


      (_this$polyline = this.polyline).push.apply(_this$polyline, _toConsumableArray(nodes.flat()));
    }
  }, {
    key: "update",
    value: function update() {
      this.createNodes();
    }
  }, {
    key: "reset",
    value: function reset() {
      this.polygon.splice(0);
      this.polyline.splice(0);
    }
  }, {
    key: "polygon",
    get: function get() {
      return this._polygon;
    }
  }, {
    key: "polyline",
    get: function get() {
      return this._polyline;
    }
  }, {
    key: "controls",
    get: function get() {
      return this._controls;
    }
  }]);

  return Arrow;
}();

var HalfSwallowTail = /*#__PURE__*/ function(_Component) {
  _inherits(HalfSwallowTail, _Component);

  var _super = _createSuper(HalfSwallowTail);

  /**
   * [constructor description]
   * @param {Object} [options={}] [description]
   * @param {Number} [options.heightFactor] 尾部高度占总高度的比例
   */
  function HalfSwallowTail() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, HalfSwallowTail);

    _this = _super.call(this, options);
    _this._type = ComponentType.HALF_SWALLOW_TRAIL;
    _this._controlPointsCount = [3, Infinity];
    _this._heightFactor = defaultValue(options.heightFactor, 0.3);

    _this.createNodes();

    return _this;
  }
  /**
   * 尾部高度因了
   * @return {Number} 尾部高度占总高度的比例
   */


  _createClass(HalfSwallowTail, [{
    key: "createNodes",
    value: function createNodes() {
      _get(_getPrototypeOf(HalfSwallowTail.prototype), "createNodes", this).call(this);

      var baseLength = PlotUtil.baseLength(this.controls);
      var height = this._heightFactor * baseLength;
      var mid = PlotUtil.mid(this.get(0), this.get(1));
      var headControl = PlotUtil.thirdPoint(this.get(2), mid, 0, height, this.inverse);
      this.nodes = [headControl];
      return this.nodes;
    }
  }, {
    key: "heightFactor",
    get: function get() {
      return this._heightFactor;
    }
  }]);

  return HalfSwallowTail;
}(Component);

function defineProperties(object) {
  var _loop = function _loop(key) {
    if (object.hasOwnProperty(key) && key.startsWith('_')) {
      var newKey = key.replace('_', '');
      Object.defineProperty(object, newKey, {
        get: function get() {
          return object[key];
        },
        set: function set(v) {
          object[key] = v;
        }
      });
    }
  };

  for (var key in object) {
    _loop(key);
  }
}

var StraightArrow = /*#__PURE__*/ function(_Arrow) {
  _inherits(StraightArrow, _Arrow);

  var _super = _createSuper(StraightArrow);

  /**
   * 直线箭头
   * @param {Object} [options={}] 具有以下属性
   * @param {Number} [options.headHeightFactor=0.18] 头部高度占箭头高度的比例
   * @param {Number} [options.neckHeightFactor=0.13] 脖子高度占箭头高度的比例
   * @param {Number} [options.headWidthFactor=0.2] 头部宽度占箭头高度的比例
   * @param {Number} [options=neckWidthFactor=options.neckHeightFactor/2] 脖子宽度占箭头高度的比例
   * @param {Number} [options.tailWidthFactor=0.3] 尾部宽度占箭头高度的比例
   * @param {Number} [options.tailHeightFactor=0.2] 尾部高度占箭头高度的比例
   */
  function StraightArrow() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, StraightArrow);

    options = defaultValue(options, defaultValue.EMPTY_OBJECT);
    _this = _super.call(this, options);
    _this._tail = defaultValue(options.tail, false);

    _this.init();

    defineProperties(_assertThisInitialized(_this));

    _this.merge();

    return _this;
  }

  _createClass(StraightArrow, [{
    key: "addControl",
    value: function addControl(control) {
      if (this.controls.length >= StraightArrow.MIN_CONTROL_COUNT) {
        this.controls.pop();
      }

      this.controls.push(control);

      if (this.controls.length >= StraightArrow.MIN_CONTROL_COUNT) {
        this.init();
        this.merge();
      }
    }
  }, {
    key: "popControl",
    value: function popControl() {
      return this.controls.pop();
    }
  }, {
    key: "updateControl",
    value: function updateControl(index, control) {
      this.controls[index] = control;

      if (this.controls.length >= StraightArrow.MIN_CONTROL_COUNT) {
        this.init();
        this.merge();
      }
    }
  }, {
    key: "init",
    value: function init() {
      if (this.controls.length < StraightArrow.MIN_CONTROL_COUNT) {
        return;
      }

      this._headComponent = this.createHeadComponent();
      this._bodyComponent = this.createBodyComponent();

      if (this._tail) {
        this._tailComponent = this.createTailComponent();
      }
    }
  }, {
    key: "update",
    value: function update() {
      this._headComponent = this.createHeadComponent();
      this._bodyComponent = this.createBodyComponent();

      if (this._tail) {
        this._tailComponent = this.createTailComponent();
      }

      this.merge();
    }
  }, {
    key: "createBodyComponent",
    value: function createBodyComponent() {
      return new TrapezoidComponent({
        controls: this._controls,
        heightFactor: 1 - this._neckHeightFactor,
        headWidthFactor: this._neckWidthFactor,
        tailWidthFactor: this._tailWidthFactor
      });
    }
  }, {
    key: "createHeadComponent",
    value: function createHeadComponent() {
      return new ArrowComponent({
        controls: this._controls,
        headWidthFactor: this._headWidthFactor,
        neckHeightFactor: this._neckHeightFactor,
        neckWidthFactor: this._neckWidthFactor,
        headHeightFactor: this._headHeightFactor
      });
    }
  }, {
    key: "createTailComponent",
    value: function createTailComponent() {
      if (!this._bodyComponent) {
        return;
      }

      var bodyNodes = this._bodyComponent.nodes;
      return new HalfSwallowTail({
        controls: [].concat(_toConsumableArray(bodyNodes), [this._controls[1]]),
        heightFactor: this._tailHeightFactor
      });
    }
  }, {
    key: "tail",
    set: function set(v) {
      this._tail = v;
    }
  }]);

  return StraightArrow;
}(Arrow);

_defineProperty(StraightArrow, "MIN_CONTROL_COUNT", 2);

var SplineComponent = /*#__PURE__*/ function(_Component) {
  _inherits(SplineComponent, _Component);

  var _super = _createSuper(SplineComponent);

  /**
   * 样条曲线
   * @param {Object} options 具有以下属性
   * @param {Number} [options.headWidthFactor=0.1] 头部宽度占图形高度的比例
   * @param {Number} [options.tailWidthFactor=0.3] 尾部宽度占图形高度的比例
   */
  function SplineComponent(options) {
    var _this;

    _classCallCheck(this, SplineComponent);

    _this = _super.call(this, options);
    _this._type = ComponentType.HALF_SPLINE;
    _this._controlPointsCount = [2, Infinity];
    _this._headWidthFactor = defaultValue(options.headWidthFactor, 0.1);
    _this._tailWidthFactor = defaultValue(options.tailWidthFactor, 0.3);

    _this.createNodes();

    return _this;
  }

  _createClass(SplineComponent, [{
    key: "createNodes",
    value: function createNodes() {
      _get(_getPrototypeOf(SplineComponent.prototype), "createNodes", this).call(this);

      var controls = this.controls;
      var length = PlotUtil.distance.apply(PlotUtil, _toConsumableArray(controls));
      var baseLength = PlotUtil.baseLength(controls);
      var tailWidth = this.tailWidthFactor * baseLength;
      var headWidth = this.headWidthFactor * baseLength;
      var offset = Math.abs(tailWidth - headWidth) / 2;
      var distance = 0;
      var cts = controls;
      var u = [];

      for (var i = 1; i < controls.length - 1; i++) {
        var angle = PlotUtil.angleOfThreePoints(cts[i], cts[i - 1], cts[i + 1]) / 2;
        distance += PlotUtil.distance(cts[i - 1], cts[i]);

        if (!this.inverse) {
          angle = Math.PI - angle;
        }

        var tmpDis = (tailWidth / 2 - distance / length * offset) / Math.sin(angle);
        var point = PlotUtil.thirdPoint(cts[i - 1], cts[i], angle, tmpDis, this.inverse);
        u.push(point);
      }

      this.completedNodes = new Map();
      this.completedNodes.set(this.inverse, u);
      this.nodes = u;
      return u;
    }
  }, {
    key: "linkArrow",
    value: function linkArrow(options) {
      var arrowNodes = options.arrowNodes,
        bodyNodes = options.bodyNodes,
        inverse = options.inverse,
        target = options.target;
      var nodes = [];

      if (target._tail) {
        nodes.push(target.controls[+!inverse]);
      }

      if (inverse) {
        nodes.push.apply(nodes, _toConsumableArray(bodyNodes).concat([arrowNodes[0]]));

        var _spline = PlotUtil.quadricBSpline(nodes);

        return [].concat(_toConsumableArray(_spline), _toConsumableArray(arrowNodes));
      }

      nodes.push.apply(nodes, _toConsumableArray(bodyNodes).concat([arrowNodes[arrowNodes.length - 1]]));
      var spline = PlotUtil.quadricBSpline(nodes);
      return [].concat(_toConsumableArray(arrowNodes), _toConsumableArray(spline.reverse()));
    }
  }, {
    key: "linkTail",
    value: function linkTail() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var tailNodes = options.tailNodes,
        bodyNodes = options.bodyNodes,
        inverse = options.inverse;
      return [].concat(_toConsumableArray(tailNodes), _toConsumableArray(bodyNodes));
    }
  }, {
    key: "tailWidthFactor",
    get: function get() {
      return this._tailWidthFactor;
    }
  }, {
    key: "headWidthFactor",
    get: function get() {
      return this._headWidthFactor;
    }
  }]);

  return SplineComponent;
}(Component);

var SplineComponent$1 = /*#__PURE__*/ function(_HalfSplineComponent) {
  _inherits(SplineComponent, _HalfSplineComponent);

  var _super = _createSuper(SplineComponent);

  function SplineComponent() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, SplineComponent);

    return _super.call(this, options);
  }

  _createClass(SplineComponent, [{
    key: "createNodes",
    value: function createNodes() {
      var completedNodes = new Map();
      this.inverse = false;

      var leftNodes = _get(_getPrototypeOf(SplineComponent.prototype), "createNodes", this).call(this);

      completedNodes.set(this.inverse, _toConsumableArray(leftNodes));
      this.inverse = true;

      var rightNodes = _get(_getPrototypeOf(SplineComponent.prototype), "createNodes", this).call(this);

      completedNodes.set(this.inverse, _toConsumableArray(rightNodes));
      this.inverse = undefined;
      this.nodes = [].concat(_toConsumableArray(leftNodes), _toConsumableArray(rightNodes.reverse()));
      this.completedNodes = completedNodes;
      return [].concat(_toConsumableArray(leftNodes), _toConsumableArray(rightNodes.reverse()));
    }
  }]);

  return SplineComponent;
}(SplineComponent);

var AttackArrow = /*#__PURE__*/ function(_Arrow) {
  _inherits(AttackArrow, _Arrow);

  var _super = _createSuper(AttackArrow);

  function AttackArrow(options) {
    var _this;

    _classCallCheck(this, AttackArrow);

    options = defaultValue(options, {});
    options.headHeightFactor = defaultValue(options.headHeightFactor, 0.15);
    options.neckHeightFactor = defaultValue(options.headWidthFactor, 0.8);
    options.neckWidthFactor = defaultValue(options.neckWidthFactor, 0.15);
    options.headWidthFactor = defaultValue(options.headWidthFactor, 0.4);
    options.tailWidthFactor = defaultValue(options.tailWidthFactor, 0.25);
    _this = _super.call(this, options);
    _this._headTailHeightFactor = defaultValue(options.headTailHeightFactor, 0.5);
    _this._tail = defaultValue(options.tail, true);
    _this._heightFactor = defaultValue(options.heightFactor, 0.8);
    _this._tailHeightFactor = defaultValue(options.tailHeightFactor, 0.05);

    _this.init();

    defineProperties(_assertThisInitialized(_this));

    _this.merge();

    return _this;
  }

  _createClass(AttackArrow, [{
    key: "addControl",
    value: function addControl(control) {
      var lastNode = this.controls[this.controls.length - 1]; // if (lastNode && lastNode[0] === control[0] && lastNode[1] === control[1]) {
      //   return;
      // }

      this.controls.push(control);

      if (!this.tail && this.controls.length >= AttackArrow.MIN_CONTROL_COUNT || this.controls.length >= AttackArrow.MIN_CONTROL_COUNT + 1) {
        this.init();
        this.merge();
      }
    }
  }, {
    key: "updateControl",
    value: function updateControl(index, control) {
      this.controls[index] = control;

      if (!this.tail && this.controls.length >= AttackArrow.MIN_CONTROL_COUNT || this.controls.length >= AttackArrow.MIN_CONTROL_COUNT + 1) {
        this.init();
        this.merge();
      }
    }
  }, {
    key: "popControl",
    value: function popControl() {
      this.controls.pop();
    }
  }, {
    key: "init",
    value: function init() {
      var _ref;

      if (!this.tail && this.controls.length < AttackArrow.MIN_CONTROL_COUNT) {
        return;
      }

      if (this.tail && this.controls.length < AttackArrow.MIN_CONTROL_COUNT + 1) {
        return;
      }

      this._head1 = this.controls[0];
      this._head2 = this.controls[1];
      this.tail && PlotUtil.isClockWise(this.controls[0], this.controls[1], this.controls[2]) && (_ref = [this._head2, this._head1], this._head1 = _ref[0], this._head2 = _ref[1], _ref);
      this._headComponent = this.createHeadComponent();
      this._bodyComponent = this.createBodyComponent();

      if (this._tail) {
        this._tailComponent = this.createTailComponent();
      }
    }
  }, {
    key: "createHeadComponent",
    value: function createHeadComponent() {
      var controls, tailWidth;

      if (this.tail) {
        var mid = PlotUtil.mid(this._head1, this._head2);
        controls = [mid].concat(_toConsumableArray(this.controls.slice(2)));
        tailWidth = PlotUtil.distance(this._head1, this._head2);
      } else {
        controls = this.controls;
      }

      var count = controls.length;
      return new ArrowComponent({
        controls: controls,
        heightFactor: this._headHeightFactor,
        neckHeightFactor: this._neckHeightFactor,
        headWidthFactor: this._headWidthFactor,
        neckWidthFactor: this._neckWidthFactor,
        headMaxHeight: this._headTailHeightFactor * tailWidth,
        index: [count - 2, count - 1]
      });
    }
  }, {
    key: "createBodyComponent",
    value: function createBodyComponent() {
      var mid,
        controls = this.controls.slice(2);
      var neckWidth = PlotUtil.distance(this._headComponent.nodes[0], this._headComponent.nodes[4]);
      var baseLength = PlotUtil.baseLength(controls);
      var tailWidth;

      if (this._tail) {
        tailWidth = PlotUtil.distance(this.controls[0], this.controls[1]);
        mid = PlotUtil.mid(this._head1, this._head2);
        controls = [mid].concat(_toConsumableArray(controls));

        var _baseLength = PlotUtil.baseLength(controls);

        this._tailWidthFactor = tailWidth / _baseLength;
      } else {
        tailWidth = baseLength * this._tailWidthFactor;
        controls = this.controls;
      }

      var headWidthFactor = neckWidth / baseLength;
      return new SplineComponent$1({
        controls: controls,
        headWidthFactor: headWidthFactor,
        tailWidthFactor: this._tailWidthFactor
      });
    }
  }, {
    key: "createTailComponent",
    value: function createTailComponent() {
      if (!this._bodyComponent) {
        return;
      } // const mid = Util.mid(this._head1, this._head2);


      var controls = this.controls;
      return new HalfSwallowTail({
        controls: controls,
        heightFactor: this._tailHeightFactor
      });
    }
  }]);

  return AttackArrow;
}(Arrow);

_defineProperty(AttackArrow, "MIN_CONTROL_COUNT", 2);

var DoubleArrow = /*#__PURE__*/ function(_Arrow) {
  _inherits(DoubleArrow, _Arrow);

  var _super = _createSuper(DoubleArrow);

  function DoubleArrow(options) {
    var _this;

    _classCallCheck(this, DoubleArrow);

    options = defaultValue(options, {});
    options.neckHeightFactor = defaultValue(options.neckHeightFactor, 0.8);
    options.neckWidthFactor = defaultValue(options.neckWidthFactor, 0.2);
    options.headWidthFactor = defaultValue(options.headWidthFactor, 0.5);
    _this = _super.call(this, options);
    _this._nodes = [];

    _this.init();

    defineProperties(_assertThisInitialized(_this));

    _this.merge();

    return _this;
  }

  _createClass(DoubleArrow, [{
    key: "addControl",
    value: function addControl(control) {
      if (this.controls.length >= DoubleArrow.MAX_CONTROL_COUNT) {
        this.popControl();
      }

      this.controls.push(control);

      if (this.controls.length >= DoubleArrow.MIN_CONTROL_COUNT) {
        this.init();
        this.merge();
      }
    }
  }, {
    key: "updateControl",
    value: function updateControl(index, control) {
      this.controls[index] = control;

      if (this.controls.length >= DoubleArrow.MIN_CONTROL_COUNT) {
        this.init();
        this.merge();
      }
    }
  }, {
    key: "popControl",
    value: function popControl() {
      return this.controls.pop();
    }
  }, {
    key: "init",
    value: function init() {
      if (this.controls.length < DoubleArrow.MIN_CONTROL_COUNT) {
        return;
      }

      this.getPoints();
    }
  }, {
    key: "tempPoint4",
    value: function tempPoint4(p1, p2, p3) {
      var mid = PlotUtil.mid(p1, p2);
      var distance = PlotUtil.distance(mid, p3);
      var angle = PlotUtil.angleOfThreePoints(p1, mid, p3);
      var x, y;
      var rst;

      if (angle < Math.PI / 2);
      else if (angle < Math.PI && angle >= Math.PI / 2) {
        angle = Math.PI - angle;
      } else if (angle >= Math.PI && angle < Math.PI * 1.5) {
        angle = angle - Math.PI;
      } else if (angle >= Math.PI * 1.5) {
        angle = Math.PI * 2 - angle;
      }

      x = distance * Math.cos(angle);
      y = distance * Math.sin(angle);
      var tmp = PlotUtil.thirdPoint(p1, mid, Math.PI / 2, x, true);
      rst = PlotUtil.thirdPoint(mid, tmp, Math.PI / 2, y, false);
      return rst;
    }
  }, {
    key: "getPoints",
    value: function getPoints() {
      var controls;
      var controls_ = this.controls;

      if (controls_ < 3) {
        return;
      }

      var tmp, connectPoint;

      if (controls_.length === 3) {
        tmp = this.tempPoint4.apply(this, _toConsumableArray(controls_));
      } else {
        tmp = controls_[3];
      }

      if (controls_.length <= 4) {
        connectPoint = PlotUtil.mid(controls_[0], controls_[1]);
      } else {
        connectPoint = controls_[4];
      }

      var head1, head2, bodyControls, radio;

      if (PlotUtil.isClockWise.apply(PlotUtil, _toConsumableArray(this.controls.slice(0, 3)))) {
        var _bodyControls;

        controls = this.getArrowControls(controls_[0], connectPoint, tmp, true);
        head1 = new ArrowComponent({
          controls: controls,
          index: [2, 3],
          neckHeightFactor: this._neckHeightFactor,
          neckWidthFactor: this._neckWidthFactor,
          headWidthFactor: this._headWidthFactor
        });
        radio = PlotUtil.distance(controls_[0], connectPoint) / PlotUtil.baseLength(controls) / 2;
        bodyControls = this.getBodyControls(controls, head1.nodes[0], head1.nodes[4], radio);
        controls = this.getArrowControls(connectPoint, controls_[1], controls_[2], false);
        head2 = new ArrowComponent({
          controls: controls,
          index: [2, 3],
          neckHeightFactor: this._neckHeightFactor,
          neckWidthFactor: this._neckWidthFactor,
          headWidthFactor: this._headWidthFactor
        });
        radio = PlotUtil.distance(connectPoint, controls_[1]) / PlotUtil.baseLength(controls) / 2;

        (_bodyControls = bodyControls).unshift.apply(_bodyControls, _toConsumableArray(this.getBodyControls(controls, head2.nodes[0], head2.nodes[4], radio)));

        var bodyPoints = this.geoBodyPoints([head1, head2], bodyControls, connectPoint);
        this._nodes = [].concat(_toConsumableArray(bodyPoints[0]), _toConsumableArray(head1.nodes), _toConsumableArray(bodyPoints[1]), _toConsumableArray(head2.nodes), _toConsumableArray(bodyPoints[2]));
      } else {
        var _bodyControls2;

        controls = this.getArrowControls(controls_[0], connectPoint, tmp, false);
        head1 = new ArrowComponent({
          controls: controls,
          index: [2, 3],
          neckHeightFactor: this._neckHeightFactor,
          neckWidthFactor: this._neckWidthFactor,
          headWidthFactor: this._headWidthFactor
        });
        radio = PlotUtil.distance(controls_[0], connectPoint) / PlotUtil.baseLength(controls) / 2;
        bodyControls = this.getBodyControls(controls, head1.nodes[0], head1.nodes[4], radio);
        controls = this.getArrowControls(connectPoint, controls_[1], controls_[2], true);
        head2 = new ArrowComponent({
          controls: controls,
          index: [2, 3],
          neckHeightFactor: this._neckHeightFactor,
          neckWidthFactor: this._neckWidthFactor,
          headWidthFactor: this._headWidthFactor
        });
        radio = PlotUtil.distance(connectPoint, controls_[1]) / PlotUtil.baseLength(controls) / 2;

        (_bodyControls2 = bodyControls).unshift.apply(_bodyControls2, _toConsumableArray(this.getBodyControls(controls, head2.nodes[0], head2.nodes[4], radio)));

        var _bodyPoints = this.geoBodyPoints([head1, head2], bodyControls, connectPoint);

        this._nodes = [].concat(_toConsumableArray(_bodyPoints[0]), _toConsumableArray(head1.nodes), _toConsumableArray(_bodyPoints[1]), _toConsumableArray(head2.nodes), _toConsumableArray(_bodyPoints[2]));
      }
    }
  }, {
    key: "getArrowControls",
    value: function getArrowControls(p1, p2, p3, inverse) {
      //t,o,e,r
      var mid = PlotUtil.mid(p1, p2);
      var distance = PlotUtil.distance(mid, p3);
      var neckControl = PlotUtil.thirdPoint(p3, mid, 0, 0.3 * distance, false);
      var headControl = PlotUtil.thirdPoint(p3, mid, 0, 0.5 * distance, false);
      neckControl = PlotUtil.thirdPoint(mid, neckControl, Math.PI / 2, distance / 5, inverse);
      headControl = PlotUtil.thirdPoint(mid, headControl, Math.PI / 2, distance / 4, inverse);
      return [mid, neckControl, headControl, p3];
    }
  }, {
    key: "geoBodyPoints",
    value: function geoBodyPoints(head, body, connect) {
      var body1 = PlotUtil.BezierCurve([this.controls[1], body[0], body[1], head[1].nodes[4]]);
      var body2 = PlotUtil.BezierCurve([this.controls[0], body[6], body[7], head[0].nodes[0]]);
      var body3 = PlotUtil.BezierCurve([head[0].nodes[4], body[5], body[4], connect, body[3], body[2], head[1].nodes[0]]);
      return [body2, body3, body1.reverse()];
    }
  }, {
    key: "getBodyControls",
    value: function getBodyControls(points, neckControl1, neckControl2, radio) {
      //t,o,e,r
      var length = PlotUtil.distance.apply(PlotUtil, _toConsumableArray(points));
      var baseLength = PlotUtil.baseLength(points);
      var width = baseLength * radio;
      var neckWidth = PlotUtil.distance(neckControl1, neckControl2);
      var offset = (width - neckWidth) / 2;
      var dis = 0;
      var u = [],
        c = [];

      for (var i = 1; i < points.length - 1; i++) {
        var angle = PlotUtil.angleOfThreePoints(points[i], points[i - 1], points[i + 1]) / 2;
        dis += PlotUtil.distance(points[i - 1], points[i]);
        var d = (width / 2 - dis / length * offset) / Math.sin(angle);
        u.push(PlotUtil.thirdPoint(points[i - 1], points[i], Math.PI - angle, d, false));
        c.push(PlotUtil.thirdPoint(points[i - 1], points[i], angle, d, true));
      }

      return u.concat(c);
    }
  }, {
    key: "merge",
    value: function merge() {
      var _this$polygon, _this$polyline;

      this.reset();

      (_this$polygon = this.polygon).push.apply(_this$polygon, _toConsumableArray(_toConsumableArray(this.nodes).flat()));

      (_this$polyline = this.polyline).push.apply(_this$polyline, _toConsumableArray(_toConsumableArray(this.nodes).flat()));
    }
  }]);

  return DoubleArrow;
}(Arrow);

_defineProperty(DoubleArrow, "MIN_CONTROL_COUNT", 3);

_defineProperty(DoubleArrow, "MAX_CONTROL_COUNT", 5);

var ArrowType = {
  "straightarrow": 'straightarrow',
  'attackarrow': 'attackarrow',
  'doublearrow': 'doublearrow'
};

ArrowType.validate = function(type) {
  if (type === ArrowType.straightarrow || type === ArrowType.attackarrow || type === ArrowType.doublearrow) {
    return true;
  }

  return false;
};

var ArrowGraphic = {
  StraightArrow: StraightArrow,
  AttackArrow: AttackArrow,
  DoubleArrow: DoubleArrow,
  ArrowType: ArrowType
};

export default ArrowGraphic;
export {
  ArrowType,
  AttackArrow,
  DoubleArrow,
  StraightArrow
};

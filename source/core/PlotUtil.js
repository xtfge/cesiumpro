class PlotUtil {
  /**
   * 几何图形学基础方法
   */
  constructor() {}

  /**
   * 平面点的欧氏距离，如果点的数据大于2，将计算相邻两个点的距离之和。
   * @param  {Number[]} args 需要计算距离的平面点集合
   * @return {Float}      欧氏距离
   */
  static distance(...args) {
    const { length } = args;
    if (length < 2) {
      return 0;
    }
    let distance = 0;
    for (let i = 0; i < length - 1; i++) {
      const nextIndex = (i + 1) % length;
      const start = args[i];
      const end = args[nextIndex];
      distance += Math.sqrt(Math.pow(start[0] - end[0], 2) + Math.pow(start[1] - end[1], 2));
    }
    return distance;
  }

  /**
   * @param  {Number[]} points            [description]
   * @param  {Number} [percentage=0.99] [description]
   * @return {Number}                  长度
   */
  static baseLength(points, percentage = 0.99) {
    return Math.pow(PlotUtil.distance(...points), percentage);
  }

  /**
   * 平面两点的中点
   * @param  {Number[]} start 起点
   * @param  {Number[]} end   终点
   * @return {Number[]}       中点坐标
   */
  static mid(start, end) {
    return [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
  }

  /**
   * 方位角
   * @param  {Number[]} start 起点
   * @param  {Number[]} end   终点
   * @return {Number} 向量与Y轴的夹角
   */
  static azimuth(start, end) {
    let result;
    [start, end] = [end, start];
    // 向量与Y轴的夹角;
    const angle = Math.asin(Math.abs(start[1] - end[1]) / PlotUtil.distance(start, end));
    result = start[1] >= end[1] && start[0] >= end[0] ? angle + Math.PI : (
      start[1] >= end[1] && start[0] < end[0] ? Cesium.Math.TWO_PI - angle : (
        start[1] < end[1] && start[0] >= end[0] ? Math.PI - angle : angle
      )
    );
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
  static thirdPoint(start, end, angle, radius, inverse = false) {
    const azimuth = PlotUtil.azimuth(start, end);
    const adjustAngle = inverse ? azimuth - angle : azimuth + angle;
    const x = radius * Math.cos(adjustAngle);
    const y = radius * Math.sin(adjustAngle);
    return [end[0] + x, end[1] + y];
  }

  /**
   * 判断由t,o,e是否顺时针环绕
   * @param  {Number[]}  t
   * @param  {Number[]}  o
   * @param  {Number[]}  e
   * @return {Boolean}
   */
  static isClockWise(t, o, e) {
    return (e[1] - t[1]) * (o[0] - t[0]) > (o[1] - t[1]) * (e[0] - t[0]);
  }

  /**
   * 计算两条直线之间的夹角，两条直线必须有公共点
   * @param  {Number[]} origin 两直接的公共点
   * @param  {Number[]} point1 直线1的另一个顶点
   * @param  {Number[]} point2 直线2的另一个顶点
   * @return {number}  两直线之间的夹角，单位弧度
   */
  static angleOfThreePoints(origin, point1, point2) {
    const angle = PlotUtil.azimuth(origin, point1) - PlotUtil.azimuth(origin, point2);
    return angle > 0 ? angle : Math.PI * 2 + angle;
  }

  /**
   * 四边形B样条曲面因子
   * @param  {Number} t
   * @param  {Number} o
   * @return {Number}
   */
  static quadricBSplineFactor(t, o) {
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
  static quadricBSpline(points) {
    if (points <= 2) {
      return points;
    }
    const result = [];
    const fac = 2;
    const length = points.length - fac - 1;
    result.push(points[0]);
    for (let n = 0; n <= length; n++) {
      for (let g = 0; g <= 1; g += 0.05) {
        let x = 0;
        let y = 0;
        for (let s = 0; s <= fac; s++) {
          const factor = PlotUtil.quadricBSplineFactor(s, g);
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
  static binomialFactor(t, o) {
    return PlotUtil.factorial(t) / (PlotUtil.factorial(o) * PlotUtil.factorial(t - o));
  }

  /**
   * 求阶乘
   * @param  {Number} n n必须不小于0
   * @return {Number}   n的阶乘(n!)
   */
  static factorial(n) {
    if (n < 0) {
      return NaN;
    }
    if (n === 0) {
      return 1;
    }
    return n * (PlotUtil.factorial(n - 1));
  }

  /**
   * 贝塞尔曲线
   * @param {Number[]} points [description]
   * @return {Number[]}   构成贝塞尔曲线的点集
   */
  static BezierCurve(points) {
    const count = points.length;
    if (count < 2) {
      return points;
    }
    const curves = [];
    for (let i = 0; i <= 1; i += 0.01) {
      let x = 0;
      let y = 0;
      for (let j = 0; j < count; j++) {
        const factor = PlotUtil.binomialFactor(count - 1, j);
        const s = Math.pow(i, j);
        const a = Math.pow(1 - i, count - j - 1);
        x += factor * s * a * points[j][0];
        y += factor * s * a * points[j][1];
      }
      curves.push([x, y]);
    }
    curves.push(points[count - 1]);
    return curves;
  }
}
export default PlotUtil;

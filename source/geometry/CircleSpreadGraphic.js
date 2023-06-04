
import defaultValue from '../core/defaultValue';
import PointBaseGraphic from './PointBaseGraphic';
import glsl from '../shader/circleSpread'
const {
    MaterialAppearance,
    Material
} = Cesium;
class CircleSpreadGraphic extends PointBaseGraphic {
    /**
     * 圆形扩散波
     * @extends PointBaseGraphic
     * @param {CircleScanGraphic.ConstructorOptions} options 定义该图形的属性
     * @example
     * graphic = new CesiumPro.CircleSpreadGraphic({
     *   position: new CesiumPro.LonLat(107.766, 34.548),
     *   radius: 1000,
     *   color: '#FF0000',
     *   speed: 5000
     * });
     * graphic.addTo(viewer);
     * // or
     * viewer.graphicGraphic.add(graphic);
     * @demo {@link examples/apps/index.html#/5.3.2-circleSpread|圆形扩散波示例}
     */
    constructor(options) {
        super(options);
        this._speed = defaultValue(options.speed, 10);
        this._time = 0.0;
        this.createGraphic()
    }
    /**
     * 扫描速度
     * @type {Number}
     * @default 10
     */
    get speed() {
        return this._speed;
    }
    set speed(val) {
        if (val === this._speed) {
            return;
        }
        if (val < 0) {
            val = 0;
        }
        this.definedChanged.raise('speed', val, this._speed);
        this._speed = val;        
    }
    createAppearance() {
        if (this._appearance) {
            return this._appearance;
        }
        this._appearance = new MaterialAppearance({
            material: new Material({
                translucent: true,
                fabric: {
                    uniforms: {
                        color: this._color,
                        time: 0.0,
                    },
                    source: glsl
                },
            })
        })
        return this._appearance;
    }
    update(time) {
        if (!this.material) {
            return;
        }
        const delta = 0.001;
        const t = Cesium.JulianDate.toDate(time).getTime() * this.speed * delta;
        this.material.uniforms.time = t - parseInt(t);
        
    }
}
/**
 * @typedef {Object} CircleSpreadGraphic.ConstructorOptions
 *
 * 用于描述一个圆形扩散波
 *
 * @property {LonLat} position 要素的位置信息
 * @property {Number} radius 要素半径
 * @property {Cesium.Color | String} [color] 要素颜色
 * @property {Boolean} [clampToGround = false] 是否贴地
 * @property {Number} [height = 0] 要素距离地面的高度， 如果为贴地要素，该属性不生效
 * @property {Number} [extrudedHeight = 0] 要素拉升高度， 如果为贴地要素，该属性不生效
 * @property {Number} [stRotation = 0] 统计量旋转角度，单位度
 * @property {Object} [property] 要素属性
 * @property {Number} [speed = 10] 扫描速度
 */
export default CircleSpreadGraphic;
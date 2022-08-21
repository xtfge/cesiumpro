import Graphic from '../core/Graphic';
import defaultValue from '../core/defaultValue';
import defined from '../core/defined'
import LonLat from '../core/LonLat';
import CesiumProError from '../core/CesiumProError';
const {
    Color,
    MaterialAppearance,
    CircleGeometry,
    GroundPrimitive,
    Primitive,
    GeometryInstance,
    Material
} = Cesium;
class PointBaseGraphic extends Graphic {
    /**
     * 所有点状图形基类， 这里的点并不是常规意义上的点， 而是指由一个中心位置和一个半径确定图形结构的要素
     * @param {PointBaseGraphic.ConstructorOptions} options 描述一个几何要素的属性信息
     */
    constructor(options) {
        if (!defined(options)) {
            throw new CesiumProError("options must be provided.")
        }
        if (LonLat.isValid(options.position) === false) {
            throw new CesiumProError('options.position parameter is invalid.');
        }
        if (isNaN(options.radius) && options.radius <= 0) {
            throw new CesiumProError("options.radius parameter must be a number greater than 0.");
        }
        super(options)
        this._color = defaultValue(options.color, Color.WHITE);
        if (typeof this._color === 'string') {
            this._color = Color.fromCssColorString(this._color);
        }
        this._position = options.position;
        this._radius = options.radius;
        this._stRotation = Cesium.Math.toRadians(defaultValue(options.stRotation, 0));
        this._height = defaultValue(options.height, 0);
        this._extrudedHeight = defaultValue(options.extrudedHeight, 0);
        this._asynchronous = defaultValue(options.asynchronous, true);
        if (this._clampToGround) {
            this.createGroundPrimitive();
        } else {
            this.createPrimitive();
        }
        
    }
    /**
     * @private
     */
    createPrimitive() {
        const geometry = new CircleGeometry({
            center: LonLat.toCartesian(this._position),
            radius: this._radius,
            stRotation: this._stRotation,
            extrudedHeight: this._extrudedHeight,
            height: this._height
        })
        this._primitive = new Primitive({
            geometryInstances: new GeometryInstance({
                geometry
            }),
            appearance: this.createAppearance(),
            asynchronous: this._asynchronous
        })
    }
    /**
     * @private
     */
    createGroundPrimitive() {
        const geometry = new CircleGeometry({
            center: LonLat.toCartesian(this._position),
            radius: this._radius,
            stRotation: this._stRotation,
            extrudedHeight: this._extrudedHeight,
            height: this._height            
        })
        this._primitive = new GroundPrimitive({
            geometryInstances: new GeometryInstance({
                geometry
            }),
            appearance: this.createAppearance(),
            asynchronous: this._asynchronous
        })
    }
    /**
     * @private
     * @returns 外观
     */
    createAppearance() {
        if (defined(this._appearance)) {
            return this._appearance;
        }
        this._appearance = new MaterialAppearance({
            material: Material.fromType('Color', {
                color: this._color
            })
        })
        return this._appearance;
    }
    /**
     * 要素的位置
     * @type {LonLat}
     */
    get position() {
        return this._position
    }
    set position(v) {
        if (!LonLat.isValid(v)) {
            return;
        }
        this.definedChanged.raise('position', v, this._position);
        this._position = v;
        this.updatePrimitive()
    }
    /**
     * 要素的半径
     * @type {Number}
     */
    get radius() {
        return this._radius;
    }
    set radius(v) {
        if (!v === this._radius) {
            return;
        }
        this.definedChanged.raise('radius', v, this._radius);
        this._radius = v;
        this.updatePrimitive();
    }
    /**
     * 要素颜色
     * @type {String|Cesium.Color}
     * @example
     * graphic.color = new Cesium.Color(1,0,0);
     * graphic.color = '#FF0000'
     */
    get color() {
        if (!defined(this._color)) {
            return;
        }
        return this._color.toCssColorString();
    }
    set color(v) {
        this.definedChanged.raise('color', v, this._color);
        if (typeof v === 'string') {
            this._color = Cesium.Color.fromCssColorString(v);
        } else {
            this._color = v;
        }
        this.updateAttribute('color', this._color);
    }
    toJson() {
        return {
            position: this._position.toArray(),
            radius: this.radius,
            clampToGround: this.clampToGround
        }
    }
    /**
     * @private
     * 重新生成primitive并移除旧的，一般在更新位置或半径后调用
     * @returns 
     */
    updatePrimitive() {
        if (!this._viewer) {
            return;
        }
        const oldPrimitive = this.primitive;
        const options = Object.assign(this.toJson(), {asynchronous: false});
        options.position = LonLat.fromArray(options.position)
        this._primitive = (new this.constructor(options)).primitive;
        this._viewer.primitives.add(this._primitive);
        this._viewer.primitives.remove(oldPrimitive)
    }
}

/**
 * @typedef {Object} PointBaseGraphic.ConstructorOptions
 *
 * 加载GeoJson数据源时的配置项
 *
 * @property {LonLat} position 要素的位置信息
 * @property {Number} radius 要素半径
 * @property {Cesium.Color | String} [color] 要素颜色
 * @property {Boolean} [clampToGround = false] 是否贴地
 * @property {Number} [height = 0] 要素高度， 如果为贴地要素，该属性不生效
 * @property {Number} [extrudedHeight = 0] 要素拉升高度， 如果为贴地要素，该属性不生效
 * @property {Number} [stRotation = 0] 统计量旋转角度，单位度
 * @property {Object} [property] 要素属性
 */
export default PointBaseGraphic;
import defaultValue from '../core/defaultValue';
import PointBaseGraphic from './PointBaseGraphic';
import glsl from '../shader/dynamicCone'
import Url from '../core/Url'
import LonLat from '../core/LonLat';
import CesiumProError from '../core/CesiumProError';
const { baseMaterialShader, dashCircleMaterialShader, coneMaterialShader, cylinderMaterialShader } = glsl;
const {
    MaterialAppearance,
    Material,
    CircleGeometry,
    GroundPrimitive,
    Primitive,
    GeometryInstance,
    PrimitiveCollection,
    CylinderGeometry,
    Transforms,
    Matrix4,
    Cartesian3
} = Cesium;
class DynamicConeGraphic extends PointBaseGraphic {
    /**
     * 
     * @extends PointBaseGraphic
     * @param {DynamicConeGraphic.ConstructorOptions} options 定义该图形的属性
     * @example
     * graphic = new CesiumPro.RadarScanGraphic({
     *   position: new CesiumPro.LonLat(107.766, 34.548),
     *   radius: 1000,
     *   color: '#FF0000',
     *   speed: 5000
     * });
     * graphic.addTo(viewer);
     * // or
     * viewer.graphicGraphic.add(graphic);
     * @demo {@link examples/apps/index.html#/5.3.4-dynamicCone|DynamicConeGraphic示例}
     */
    constructor(options) {
        super(options);
        this._speed = defaultValue(options.speed, 1);
        this._image = defaultValue(options.image, Url.buildModuleUrl('assets/img/particle.png'));
        this._appearance = {};
        this._length = options.length;
        this._primitive = new PrimitiveCollection();
        this.createGraphic();
    }
    /**
     * 速度
     * @type {Number}
     * @default 1
     */
    get speed() {
        return this._speed;
    }
    set speed(val) {
        if (val === this._speed) {
            return;
        }
        if (val <= 0) {
            throw new CesiumProError("速度不能小于0")
        }
        this.definedChanged.raise('speed', val, this._speed);
        this._speed = val;
        const appearances = Object.values(this._appearance);
        for (let appearance of appearances) {
            const material = appearance.material;
            console.log(material.uniforms)
            material.uniforms.speed = val;
        }
    }
    /**
     * 获得或设置圆锥高度
     * @type {Number}
     */
    get length() {
        return this._length;
    }
    set length(val) {
        if (val === this._length) {
            return;
        }
        this.definedChanged.raise('length', val, this._length);
        this._length = val;
        this.updatePrimitive();
    }
    /**
     * @override
     */
     updatePrimitive() {
        if (!this._viewer) {
            return;
        }
        const oldPrimitive = this.primitive;
        oldPrimitive.removeAll()
        this.createGraphic();
        this._viewer.primitives.add(this._primitive);
    }
    /**
     * @override
     * @private
     * @param {*} k 
     * @param {*} v
     */
    updateAttribute(k, v) {
        if (this.isDestroyed()) {
            return;
        }
        if (!this.primitive) {
            return;
        }
        const primitives = this.primitive._primitives;
        for (let primitive of primitives) {
            super.updateAttribute.call({primitive, isDestroyed: this.isDestroyed}, k, v)
        }
    }
    /**
     * @private
     */
    createGraphic() {
        const appearance1 = this.createAppearance(baseMaterialShader);
        const appearance2 = this.createAppearance(dashCircleMaterialShader);
        const appearance3 = this.createAppearance(coneMaterialShader);
        const appearance4 = this.createAppearance(cylinderMaterialShader);
        if (this._clampToGround) {
            this.createCircleGroundPrimitive(appearance1, this._asynchronous);
            this.createCircleGroundPrimitive(appearance2, this._asynchronous);
            this.createCylinder(this._radius * 0.35, appearance3, this._asynchronous);
            this.createCylinder(this._radius * 0.4, appearance4, this._asynchronous)
        } else {
            this.createCirclePrimitive(appearance1, this._asynchronous);
            this.createCirclePrimitive(appearance2, this._asynchronous);
            this.createCylinder(this._radius * 0.35, appearance3, this._asynchronous);
            this.createCylinder(this._radius * 0.4, appearance4, this._asynchronous);
        }
    }
    createCylinder(radius, appearance, asynchronous = true) {
        if (this.isDestroyed()) {
            return;
        }
        const length = defaultValue(this._length, this._radius * 0.35 * 8);
        const matrix = Transforms.eastNorthUpToFixedFrame(LonLat.toCartesian(this._position));
        const translation = Matrix4.fromTranslation(new Cartesian3(0, 0, length / 2 + this._height))
        Matrix4.multiply(matrix, translation, matrix);
        const geometry = new CylinderGeometry({
            radius: this._radius,
            topRadius: 0,
            bottomRadius: radius,
            length,
        })
        const primitive = new Primitive({
            geometryInstances: new GeometryInstance({
                geometry,
                id: this.property
            }),
            appearance: appearance,
            asynchronous,
            allowPicking: this._allowPicking,
            modelMatrix: matrix
        });

        this._primitive.add(primitive)
        return primitive;
    }
    /**
     * @private
     */
    createCirclePrimitive(appearance, asynchronous = true) {
        if (this.isDestroyed()) {
            return;
        }
        const geometry = new CircleGeometry({
            center: LonLat.toCartesian(this._position),
            radius: this._radius,
            stRotation: this._stRotation,
            extrudedHeight: this._extrudedHeight,
            height: this._height,
            granularity: 0.01
        })
        const primitive = new Primitive({
            geometryInstances: new GeometryInstance({
                geometry,
                id: this.property
            }),
            appearance: appearance,
            asynchronous,
            allowPicking: this._allowPicking
        });
        this._primitive.add(primitive)
        return primitive;
    }
    /**
     * @private
     */
    createCircleGroundPrimitive(appearance, asynchronous = true) {
        if (this.isDestroyed()) {
            return;
        }
        const geometry = new CircleGeometry({
            center: LonLat.toCartesian(this._position),
            radius: this._radius,
            stRotation: this._stRotation,
            extrudedHeight: this._extrudedHeight,
            height: this._height
        })
        const primitive = new GroundPrimitive({
            geometryInstances: new GeometryInstance({
                geometry,
                id: this.property
            }),
            appearance: appearance,
            asynchronous,
            allowPicking: this._allowPicking,
        });
        this._primitive.add(primitive)
        return primitive;
    }
    createAppearance(shader) {
        if (this._appearance[shader]) {
            return this._appearance[shader];
        }
        this._appearance[shader] = new MaterialAppearance({
            material: new Material({
                translucent: true,
                fabric: {
                    uniforms: {
                        color: this._color,
                        image: this._image,
                        speed: this._speed
                    },
                    source: shader//baseMaterialShader
                },
            })
        })
        return this._appearance[shader];
    }
    update(time) {
    }
}
/**
 * @typedef {Object} DynamicConeGraphic.ConstructorOptions
 *
 * 用于描述一个圆形扩散波
 *
 * @property {LonLat} position 要素的位置信息
 * @property {Number} radius 要素半径
 * @property {Cesium.Color | String} [color] 要素颜色
 * @property {Boolean} [clampToGround = false] 是否贴地
 * @property {Number} [height = 0] 要素距离地面的高度， 如果为贴地要素，该属性不生效
 * @property {Number} [stRotation = 0] 统计量旋转角度，单位度
 * @property {Object} [property] 要素属性
 * @property {Number} [speed = 1] 动画速度
 * @property {Number} [length = radius * 0.35 * 8] 圆锥高度
 */
export default DynamicConeGraphic;
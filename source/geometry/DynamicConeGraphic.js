import defaultValue from '../core/defaultValue';
import PointBaseGraphic from './PointBaseGraphic';
import glsl from '../shader/dynamicConeMaterial'
import Url from '../core/Url'
import LonLat from '../core/LonLat';
import CesiumProError from '../core/CesiumProError';
import CylinderGeometry from '../scene/CylinderGeometry'
const { baseMaterialShader, dashCircleMaterialShader, coneMaterialShader, cylinderMaterialShader } = glsl;
const {
    MaterialAppearance,
    Material,
    GroundPrimitive,
    Primitive,
    GeometryInstance,
    PrimitiveCollection,
    CircleGeometry,
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
        this._primitive.name = 'DynamicConeGraphic'
        // 必须为false，因为没有对他实现worker
        this._asynchronous = false;
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
        // this._viewer.primitives.add(this._primitive);
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
            super.updateAttribute.call({ primitive, isDestroyed: this.isDestroyed }, k, v)
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
            this.createCylinder(0, this._radius * 0.35, appearance3, this._asynchronous);
            this.createCylinder(this._radius * 0.1, this._radius * 0.45, appearance4, this._asynchronous, 0.8)
        } else {
            this.createCirclePrimitive(appearance1, this._asynchronous);
            this.createCirclePrimitive(appearance2, this._asynchronous);
            this.createCylinder(0, this._radius * 0.35, appearance3, this._asynchronous);
            this.createCylinder(this._radius * 0.1, this._radius * 0.45, appearance4, this._asynchronous, 0.8);
        }
    }
    createCylinder(topRadius, bottmRadius, appearance, asynchronous = true, heighFactor = 1.0) {
        if (this.isDestroyed()) {
            return;
        }
        const length = defaultValue(this._length, this._radius * 0.35 * 8) * heighFactor;
        const matrix = Transforms.eastNorthUpToFixedFrame(LonLat.toCartesian(this._position));
        const translation = Matrix4.fromTranslation(new Cartesian3(0, 0, length / 2 + this._height))
        Matrix4.multiply(matrix, translation, matrix);
        const geometry = new CylinderGeometry({
            bottomRadius: bottmRadius,
            topRadius: topRadius,
            length: length
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

        this.primitive.add(primitive)
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
        this.primitive.add(primitive)
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
        this.primitive.add(primitive)
        return primitive;
    }
    createAppearance(shader) {
        if (this._appearance[shader]) {
            return this._appearance[shader];
        }
        this._appearance[shader] = new MaterialAppearance({
            flat: true,
            material: new Material({
                translucent: true,
                fabric: {
                    uniforms: {
                        color: this._color,
                        image: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAEACAYAAAADRnAGAAAAAXNSR0IArs4c6QAACQdJREFUeF7tncmvFUUUxr9yFqdEnNg4oa404kYwutANIBu36sK9Cn+Ngmtnl7pSNFE2DmgiGl0pDnGDJjyMAUXGMh85bZpL9+2699U5VcU7N7mbl/uqvv6dr6u7q0+dCljjn7DGjx8OwB2wxgn4KbDGDeCDoJ8C806BGOMlAPg9E0KIJU4XbQ2jDogxXgHgZgDXAlgB8GcI4YwlBAsNgwCE+gYATwLYBOADAJ+EEP62AmClYQzAZQA2AtgFYCuAVwC8GkI4YgjARMMYAP79RgBbANwL4EsAB0IIx4cAxBj5e44V/JzNMV5Im+oa5o0BlwK4CsCVAI5PHPx1ANYLAI4XRzNBUNew6stgjJGA7gewHTh3X/E+gO9DCCcMT5elNeQAcA2AxwHslAPeDWBfCOGYIYClNeQAwMvlnTJe8Jj3A/glhHDSEMDSGlYNgAcZY7wcAKPAzz+WB99BXlZDFgBWkdboxwFoUG2pTXdAS9HS0OoO0KDaUpvugJaipaHVHaBBtaU2kx0g99pXyyMv5wfMHnZm7vezakgCIAd/N4DNIoZPfD+HEE5ZRVtLQyoAPuk9AeBFOeCX5ZnfcpJURUMqAM64PCCzPmTAWWLO+vxr6AAVDakAOOHJ9wM3yQEfBnAshHDWEICKhiQAMunB33KSkp8ib4pkpjirhmQAVpG27scBWBOvrT93QG0RsdbjDrAmXlt/7oDaImKtxx1gTby2/twBtUXEWo87wJp4bf2pO0Ajg2xRiPM0qAKQjlUyyFIhTGnQBtBlbzHjlLnGnEv8znJKvZfFNqhBGwDnEZlB1s0mM4PMOuV2rgZtAMzeumvmfUKJDLJRDaoAZDKVGWTr5JxlBpnZy5RunJCXKoMa1AGkDlalfucASpGvpV93QC2RKKXDHVCKfC39ugNqiUQpHe6AUuRr6TfZAbKQkRlac1eRaR6YhoYkANJxt4aPCyq7dYSWOUJMkcmuIRUA01K4gJLP9dsA8Ln+deOVpCoaUgGQ/m0AdgB4EMDeAkvjVDQkAZDnek5uMEvsellNvmKZJaalIRmACGAU+D/R+uB7kxtZNSwEQHOEL9W2AyhFvpZ+3QG1RKKUDndAKfK19OsOqCUSpXS4A0qRr6Vfd0AtkSilwx1Qinwt/boDaolEKR3ugJzkJReHc4enAZwqMW22qIZsDpDyl8zG4vT5IQA/yPJas1qky2jICeAGAE8BeAbApwDeBPCbZR3SGOPCGjQAPA3gs8IAkjXkBNAlRa7ZU4AwWQiVIFh+96T1ICiJ0QtpyOaAnFcTy7YcgCXtGvtyB9QYFUtN7oAh2jFGZmPwcsYPL2emVeXlVbyJhgscEGPkdfQWuaenlh8B/GEJwVLDEABmgj0M4FlxwFtMihqrLa5xvsYYzTSMAWDNsD6A/QUAmGgYOwVunTkFfi9wCphoGLwKyDnYHwQ5wWH6sdKgdhmsfclsF00VAAPLVbvia5azQzy2/rLdQQ1aAPpLZgm75KYLXDI7qkELgErxw0UGoRhjkgYtALNLZr8A8KvxoukkDSoA5Fa2WzLLPkpuusAls6Ma1AAsYteSv3UAJenX0Lc7oIYolNTgDihJv4a+3QE1RKGkBndASfo19O0OqCEKJTW4A0rSr6Fvd0ANUSipIasD5KUqt+rll7NAg/sUax7wohqyARjZKPlr441YeDyzmzXP1ZATwGyBgz0AXitcZGFSQ24ALLLAeXgWWfgQwMfGG7YzCAtpyAZAZoL7RRb4JuZIgVzBhTRkBSAQugIHWTZhX2bAlKIvPLZJDdkBLCO45P84gJL0a+j7PAfIucNXWvyeKFQBlmOImYb/AciNDIsQ3wdgg2SHWe8pSD2mGvoAeA29XZKjHgPwDoB3Qwh/WVlVbmNNNcwCuEMAPFoQgKkGPwX69pZxgHdSzBZlimyJMtgMipkGvw+wGuBq7ccdUGtkrHS5A6xI19qPO6DWyFjpcgdYka61H3dArZGx0uUOsCJdaz/ugFojY6XLHWBFutZ+3AG1RsZKV5IDeqtAS5bVp1a+NcqqYRJAb3+R9QCOcnOFEMIJqwj1Xrkz9SW7hhQA3Z6d2wEckI1TD1kmPsQY1TSkACD55wA8D+AjAC8BOGi8nF5NQwoAVnPYJBunHgTAVaCmqS9SUUJFwyQAOQcJgd+TAI5bRr8bawRCdg1JACwHPOu+HIA18dr6U3NAL93m3JtmFloNIZhVkOjdPzDdZlSDCoCRdBvrLbeH0m0u0KAFoJl0GysAbwN4r3C+0aAGLQBslxVcWGC1yzgrcQpMalABMDQAFUq36XIOR1N+1ADUdrkb0+MAWomUlk53gBbZVtp1B7QSKS2d7gAtsq206w5oJVJaOt0BWmRbadcd0EqktHS6A7TIttKuO6CVSGnpdAdokW2lXXdAK5HS0ukO0CLbSrvugFYipaXTHaBFtpV23QGtREpLpztAi2wr7boDWomUls5kB0juH9PfuGLDfAdKAtDQkARASlwxZ5/fYwAOF1g1QvjZNaQC6Lat2gbgW9k7zHrViIqGVADdio0XpFhqyVUjWTWkAmCh5Id6q0Y+l1UjZsnPMUYVDakA+DsKyL5iI3V0lwEwu4YkAKkiW/ydA2gxajk1uwNy0myxLRMHyJ0kryCsFMl1h6X2HbhAgzqA3r4DjwDYyH3MAXxjCWGeBgsAvIe/B8AuAFsB7AbwRghhxeqUEQcOarAAwFUbrPm/Q/Yd2AtgXwiBD1UmH1nCN6hBHYA8xvZr/jPyXHxt+kgdYxzUYAJAINAJ/LLm/1mT0M90Ik44T8NcABoTEIseuLaGUQAXe+mMLhDzAKhMQCzigN7+4WoTMfMADE2C/BRCOL3IQazmtzFGdQ3zAHSlM7bIXgMsncEKMpaTIOoapgbBi7Z0xuQYsBrrtvS/ZvcBtUJxALVGxkqXO0CDtNxFris8AcJ7/kkN2R3Qu4XeLPMAX7EIm/EECA+eN1GTGjQAdBMgOwHwFnZy08PcLuxNgExq0ALAyQeW32MBtBITIN3Gi5MasgMYmACpeuNFFQC9CRC2P7npYe5ToGsvZeNFNQBaB5W7XQeQm2hr7a15B/wHRTppPaBaKTsAAAAASUVORK5CYII=`,
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
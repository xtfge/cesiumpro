import Event from '../core/Event'
const shader = `
    czm_material czm_getMaterial(czm_materialInput materialInput) { \n
      czm_material material = czm_getDefaultMaterial(materialInput); \n
      vec2 st = materialInput.st; \n
      material.diffuse = color.rgb * vec3(2.0); \n
      float dis = 1.0 - abs(0.5 - st.t) * 2.0;
      material.alpha = pow(dis * color.a, 3.0); \n
      return material; \n
    }
    `
const {
    Material,
    Color
} = Cesium
class PolylineAntialiasingMaterialProperty {
    constructor(opt = {}) {
        this._definitionChanged = new Event();
        this._color = undefined;
        this.color = opt.color;
    }
    get isConstant() {
        return true;
    }
    get definitionChanged() {
        return this._definitionChanged;
    }
    getType() {
        return PolylineAntialiasingMaterialProperty.materialType;
    }
    getValue(time, result = {}) {
        result.color = this.color || Color.RED;
        return result;
    }
    equals(other) {
        return this === other || (
            other instanceof PolylineAntialiasingMaterialProperty &&
            other.color === this.color
        );
    }
    static materialType = 'PolylineAntialiasing'
}
Material._materialCache.addMaterial(PolylineAntialiasingMaterialProperty.materialType, {
    fabric: {
        type: PolylineAntialiasingMaterialProperty.materialType,
        uniforms: {
            color: new Color(1, 1, 1, 1)
        },
        source: shader
    },
    translucent: true
})
export default PolylineAntialiasingMaterialProperty
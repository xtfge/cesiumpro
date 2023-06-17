import defaultValue from '../core/defaultValue.js';
const {
  Material,
  Color
} = Cesium;
Material.ODLineType = 'ODLine';
Material._materialCache.addMaterial(Material.ODLineType, {
  fabric: {
    type: Material.ODLineType,
    uniforms: {
      startTime: 0,
      speed: 2.3,
      bidirectional: 2,
      baseColor: Color.RED,
      color: Color.WHITE
    },
    source: `
    czm_material czm_getMaterial(czm_materialInput materialInput) {
      czm_material material = czm_getDefaultMaterial(materialInput);
      vec2 st = materialInput.st;
      float t = fract(startTime + czm_frameNumber * speed / 1000.0);
      t *= 1.03;
      float alpha0 = smoothstep(t - 0.03, t, st.s) * step(st.s, t);
      float mt = 1. - t;
      float alpha1 = smoothstep(mt + 0.03, mt, st.s) * step(mt, st.s);

      float a0 = step(abs(bidirectional - 0.0) - 0.001, 0.);//1
      float a1 = step(abs(bidirectional - 1.0) - 0.001, 0.);//
      float db = step(abs(bidirectional - 2.0) - 0.001, 0.);
      float alpha = alpha0 * (a0 + db) + alpha1 * (a1 + db);
      alpha = clamp(alpha, 0., 1.);    
      material.diffuse = color.rgb * alpha + baseColor.rgb * (1. - alpha);
      material.alpha = (color.a * alpha + baseColor.a * (1. - alpha));
      return material;
    }`
  }
})

class PolylineODMaterialProperty {
    /**
     * 创建一个点材质，模拟波纹效果。
     * @param {object} [options={}] 具有以下属性
     * @param {Cesium.Color} [options.baseColor = Cesium.Color.RED] 基础颜色
     * @param {Cesium.Color} [options.color=Cesium.Color.WHITE] 叠加颜色
     * @param {number} [options.speed=3] 流动速度
     * @param {number} [options.startTime=1000]
     */
    constructor(options = {}) {
      /**
       * @type {Cesium.Color}
       */
      this.baseColor = defaultValue(options.baseColor, Cesium.Color.RED)
      /**
       * @type {Cesium.Color}
       */
      this.color = defaultValue(options.color, Cesium.Color.WHITE);
      /**
       * @type {number}
       */
      this.speed = defaultValue(options.speed, 3);
      /**
       * @type {number}
       */
      this.startTime = defaultValue(options.startTime, Math.random());
      /**
       * @type {number}
       */
      this.bidirectional = defaultValue(options.bidirectional, 2);
      this._definitionChanged = new Event();
    }
    /**
     * 表示该属性是否是常量。
     * @readonly
     */
    get isConstant() {
      return false;
    }
    /**
     * @type {Event}
     *
     * 当此属性发生变化时触发的事件。
     */
    get definitionChanged() {
      return this._definitionChanged
    }
  
    /**
     * 此属性的类型
     * @type {string}
     */
    getType() {
      return Material.ODLineType;
    }
  
    /**
     * 获取指定时间的属性值。
     * @param  {Cesium.JulianDate} time  时间
     * @param  {object} [result] 保存新属性的副本，如果没有指定将自动创建。
     * @returns {object} 修改后的result,如果未提供result参数，则为新实例。
     */
    getValue(time, result) {
      result = defaultValue(result, {});
      result.baseColor = this.baseColor;
      result.color = this.color;
      result.speed = this.speed
      result.startTime = this.startTime
      result.bidirectional = this.bidirectional;
      return result
    }
    /**
     * 判断两个属性是否相同。
     * @param  {DynamicWaveMaterialProperty} other 另一个属性
     * @return {Bool}   如果相同返回true，否则返回false
     */
    equals(other) {
      return this === other || (other instanceof PolylineODMaterialProperty &&
        this.baseColor === other.baseColor && this.speed === other.speed &&
        this.color === other.color && this.startTime === other.startTime &&
        this.bidirectional === other.bidirectional);
    }
  }
  export default PolylineODMaterialProperty;
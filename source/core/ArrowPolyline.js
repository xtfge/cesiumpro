/*
 * Arrow line
 */
import uuid from './uuid';

class ArrowPolyline {
  /**
   * 箭头线
   * @param {Object} [option={}] option具有以下参数
   * @param {Color} [option.color=Color.RED] 线的颜色
   * @param {Nubmer} [option.width=3] 圆柱的半径，即线的宽度
   * @param {Number} [option.length=300] 线的长度
   * @param {Number} [option.headWidth=2*option.width] 箭头的宽度
   * @param {Number} [option.headLength=10] 箭头的长度
   * @param {String} [option.id] 线的id
   * @param {Boolean} [option.inverse]
   */
  constructor(option = {}) {
    this._color = option.color || Cesium.Color.RED;
    this._width = option.width || 3;
    this._headWidth = option
      .headWidth || 2 * this._width;
    this._length = option.length || 300;
    this._headLength = option.headLength || 10;
    this._inverse = option.inverse || false;
    this.position = option.position;
    const id = option.id || uuid();
    const line = Cesium.CylinderGeometry.createGeometry(new Cesium.CylinderGeometry({
      length: this._length,
      topRadius: this._width,
      bottomRadius: this._width,
    }));
    const arrow = Cesium.CylinderGeometry.createGeometry(new Cesium.CylinderGeometry({
      length: this._headLength,
      topRadius: 0,
      bottomRadius: this._headWidth,
    }));
    let offset = (this._length + this._headLength) / 2;
    if (this._inverse) {
      offset = -offset;
    }

    ArrowPolyline.translate(arrow, [0, 0, offset]);

    return new Cesium.Primitive({
      modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(this.position),
      geometryInstances: [new Cesium.GeometryInstance(
        {
          id: `${id}-line`,
          geometry: line,
        },
      ),
      new Cesium.GeometryInstance({
        id: `${id}-arrow`,
        geometry: arrow,
      })],
      appearance: new Cesium.MaterialAppearance({
        material: Cesium.Material.fromType('Color', { color: this._color }),
      }),
    });
  }

  /**
   * 几何要素平移
   * @param {CylinderGeometry} geometry 代表简单的几何对象
   * @param {Cartesian3} offset 定义平移距离
   */
  static translate(geometry, offset) {
    const scratchOffset = new Cesium.Cartesian3();
    if (Cesium.isArray(offset)) {
      [scratchOffset.x, scratchOffset.y, scratchOffset.z] = offset;
    } else {
      Cesium.Cartesian3.clone(offset, scratchOffset);
    }

    for (let i = 0; i < geometry.attributes.position.values.length; i += 3) {
      geometry.attributes.position.values[i] += scratchOffset.x;
      geometry.attributes.position.values[i + 1] += scratchOffset.y;
      geometry.attributes.position.values[i + 2] += scratchOffset.z;
    }
  }
}
export default ArrowPolyline;

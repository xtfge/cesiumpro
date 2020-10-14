import guid from './guid';
import defaultValue from './defaultValue'
class ArrowPolyline {
  /**
   * 通过Primitive创建箭头线，其实质是一个圆柱加一个圆锥，所以他永远不会延着地球表面弯曲。
   * @param {} options [description]
   */
  constructor(options) {
    options = defaultValue(options, defaultValue.EMPTY_OBJECT);
    this._color = defaultValue(options.color, Cesium.Color.RED);
    this._width = defaultValue(options.width, 3);
    this._headWidth = defaultValue(options.headWidth, 2 * this._width);
    this._color = option.color || Cesium.Color.RED;
    this._width = option.width || 3;
    this._headWidth = option.
    headWidth || 2 * this._width;
    this._length = option.length || 300
    this._headLength = option.headLength || 10
    this._inverse = option.inverse || false
    this.position = option.position
    const id = option.id || guid()
    const line = Cesium.CylinderGeometry.createGeometry(new Cesium.CylinderGeometry({
      length: this._length,
      topRadius: this._width,
      bottomRadius: this._width
    }));
    const arrow = Cesium.CylinderGeometry.createGeometry(new Cesium.CylinderGeometry({
      length: this._headLength,
      topRadius: 0,
      bottomRadius: this._headWidth
    }));
    let offset = (this._length + this._headLength) / 2
    if (this._inverse) {
      offset = -offset
    }

    ArrowPolyline.translate(arrow, [0, 0, offset]);

    return new Cesium.Primitive({
      modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(this.position),
      geometryInstances: [new Cesium.GeometryInstance({
          id: id + '-line',
          geometry: line,
        }),
        new Cesium.GeometryInstance({
          id: id + '-arrow',
          geometry: arrow,
        })
      ],
      appearance: new Cesium.MaterialAppearance({
        material: Cesium.Material.fromType('Color', {
          color: this._color
        })
      })
    });
  }
  static translate = function(geometry, offset) {
    const scratchOffset = new Cesium.Cartesian3();
    if (Cesium.isArray(offset)) {
      scratchOffset.x = offset[0];
      scratchOffset.y = offset[1];
      scratchOffset.z = offset[2];
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

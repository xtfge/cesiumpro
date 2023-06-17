const {
  Cartesian3,
  Primitive,
  Material,
  Geometry,
  MaterialAppearance,
  GeometryAttribute,
  ComponentDatatype,
  PrimitiveType,
  BoundingSphere,
  VertexFormat,
  defaultValue,
  GeometryAttributes,
  Check,
} = Cesium;
const scratchVertexFormat = new VertexFormat();
const scratchNormal = new Cartesian3();
class AxisPlaneGeometry {
  constructor(options = {}) {
    this._normal = options.normal;
    this._radius = options.radius;
    this._center = options.center;
    const vertexFormat = defaultValue(
      options.vertexFormat,
      VertexFormat.DEFAULT
    );
    this._vertexFormat = vertexFormat;
  }
  static packedLength = VertexFormat.packedLength + Cartesian3.packedLength + 1;
  static pack(value, array, startingIndex) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.object("value", value);
    Check.defined("array", array);
    //>>includeEnd('debug');

    startingIndex = defaultValue(startingIndex, 0);

    VertexFormat.pack(value._vertexFormat, array, startingIndex);
    startingIndex += VertexFormat.packedLength;
    Cartesian3.pack(value._normal, array, startingIndex);
    startingIndex += Cartesian3.packedLength;
    array[startingIndex++] = value._radius;
    return array;
  }
  static unpack(array, startingIndex, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.defined("array", array);
    //>>includeEnd('debug');

    startingIndex = defaultValue(startingIndex, 0);

    const vertexFormat = VertexFormat.unpack(
      array,
      startingIndex,
      scratchVertexFormat
    );
    startingIndex += VertexFormat.packedLength;
    const normal = Cartesian3.unpack(array, startingIndex, scratchNormal);
    startingIndex += Cartesian3.packedLength;
    const radius = array[startingIndex];

    if (!defined(result)) {
      return new PlaneGeometry({
        vertexFormat,
        normal,
        radius,
      });
    }

    result._vertexFormat = VertexFormat.clone(
      vertexFormat,
      result._vertexFormat
    );
    result._normal = Cartesian3.clone(normal, result._normal);
    result._radius = radius;

    return result;
  }
  static createGeometry(planeGeometry) {
    const v1 = Math.max(1, planeGeometry._radius * 0.02);
    const v2 = Math.max(planeGeometry._radius * 0.2, v1 * 2);
    let positions = [];
    let normal = []
    const { x, y, z } = planeGeometry._center;
    let center;
    if (Cartesian3.equals(planeGeometry._normal, Cartesian3.UNIT_X)) {
      positions = [x, -v1 + y, v1 + z,  x, -v2 + y, v1 + z,  x, -v2 + y, v2 + z,  x, -v1 + y, v2 + z];
      center = new Cartesian3(x, -(v1 + v2) / 2 + y, (v1 + v2) / 2 + z);
      normal = [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0];
    } else if (Cartesian3.equals(planeGeometry._normal, Cartesian3.UNIT_Y)) {
      positions = [v1 + x, y, v1 + z,  v2 + x, y, v1 + z,  v2 + x, y, v2 + z,  v1 + x, y, v2 + z];
      center = new Cartesian3((v1 + v2) / 2 + x, y, (v1 + v2) / 2 + z);
      normal = [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]
    } else if (Cartesian3.equals(planeGeometry._normal, Cartesian3.UNIT_Z)) {
      positions = [v1 + x, -v1 + y, z, v2 + x, -v1 + y, z, v2 + x, -v2 + y, z, v1 + x, -v2 + y, z];
      center = new Cartesian3((v1 + v2) / 2 + x, -(v1 + v2) / 2 + y, z);
      normal = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]
    }
    positions = new Float32Array([...positions]);
    const sts = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
    const indices = new Uint16Array([0, 1, 2, 2, 3, 0]);
    return new Geometry({
      attributes: new GeometryAttributes({
        position: new GeometryAttribute({
          componentDatatype: ComponentDatatype.DOUBLE,
          componentsPerAttribute: 3,
          values: positions,
        }),
        normal: new GeometryAttribute({
          componentDatatype: ComponentDatatype.FLOAT,
          componentsPerAttribute: 3,
          values: normal,
        }),
        st: new GeometryAttribute({
          componentDatatype: ComponentDatatype.FLOAT,
          componentsPerAttribute: 2,
          values: sts,
        }),
      }),
      indices: indices,
      primitiveType: PrimitiveType.TRIANGLES,
      boundingSphere: new BoundingSphere(center, (v1 + v2) / 2),
    });
  }
}
class AxisPlane {
  /**
   * 坐标轴平面
   * @private
   * @param {*} options
   */
  constructor(options = {}) {
    this._center = options.center;
    this._modelMatrix = options.modelMatrix;
    this._color = options.color;
    const radius = options.radius;;
    this._normal = options.normal;
    const planeGeometry = new AxisPlaneGeometry({
      normal: this._normal,
      radius: radius,
      vertexFormat: VertexFormat.DEFAULT,
      center: this._center,
    });
    const instance = new Cesium.GeometryInstance({
      geometry: AxisPlaneGeometry.createGeometry(planeGeometry),
    });
    const primitive = new Primitive({
      asynchronous: false,
      geometryInstances: instance,
      modelMatrix: this._modelMatrix,
      appearance: new MaterialAppearance({
        material: Material.fromType("Color", {
          color: this._color,
        }),
      }),
    });
    primitive.isAxisPlane = true;
    primitive.normal = this._normal;
    primitive.axis = options.axis;
    primitive.color = this._color;
    return primitive;
  }
}

export default AxisPlane;

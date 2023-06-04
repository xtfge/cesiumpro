import defaultValue from '../core/defaultValue';
import defined from '../core/defined';
import CesiumProError from '../core/CesiumProError';
const {
  VertexFormat
} = Cesium;
class SectorGeometry {
  /**
   * 描述一个扇形几何体，
   * <p><b>Note:CesiumPro没有实现SectorGeoemtry对应的workers，所以创建Primitive时必须
   * 将asynchronous设为false。</b></p>
   * @param {Object} options 具有以下参数
   * @param {Cesium.Cartesian3} options.center 扇形的圆心位置
   * @param {Number} options.radius 扇形半径，单位米
   * @param {Number} options.fov 扇形开合角度，以正北方向为起点，正值逆时值旋转，单位：度。
   * @param {Number} [options.height=0] 扇形高
   * @param {Number} [options.rotation=0] 旋转角度
   * @param {Cesium.VertexFormat} [options.vertexFormat=Cesium.VertexFormat.POSITION_AND_ST] 顶点类型
   * @example
   * const center = Cesium.Cartesian3.fromDegrees(110.03, 30)
   * const sector = new CesiumPro.SectorGeometry({
   * center,
   * radius: 1000,
   * fov: 120,
   * height: 100,
   * rotation: 190,
   * vertexFormat: Cesium.VertexFormat.POSITION_NORMAL_AND_ST
   * })
   * const primitive = new Cesium.Primitive({
   * geometryInstances: new Cesium.GeometryInstance({
   *   geometry: sector,
   *   attributes: {
   *     color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 1.0, 1.0, 1.0))
   *   }
   * }),
   * appearance: new Cesium.MaterialAppearance({flat:true})
   * }),
   * asynchronous: false,
   * })
   */
  constructor(options) {
    options = defaultValue(options, defaultValue.EMPTY_OBJECT);
    if (!defined(options.center)) {
      throw new CesiumProError('parameter center is required.')
    }
    if (!defined(options.radius)) {
      throw new CesiumProError('parameter radius is required.')
    }
    if (!defined(options.fov)) {
      throw new CesiumProError('parameter fov is required.');
    }
    this._center = options.center;
    this._radius = options.radius;
    this._fov = options.fov;
    this._slices = defaultValue(options.slices, this._fov);
    this._rotation = Cesium.Math.toRadians(defaultValue(options.rotation, 0));
    this._vertexFormat = defaultValue(options.vertexFormat, VertexFormat.POSITION_AND_ST);
    this._extrudedHeight = defaultValue(options.extrudedHeight, 0);
    this._height = defaultValue(options.height, 0);
    this._positions = undefined;
    this._workerName = "createSectorGeometry";
    this._rectangle = undefined;
  }
  /**
   * 扇形圆心坐标
   * @type Cesium.Cartesian3
   * @readonly
   */
  get center() {
    return this._center;
  }
  /**
   * 旋转角度，单位度
   * @type {Number}
   * @readonly
   */
  get rotation() {
    return Cesium.Math.toDegrees(this._rotation);
  }
  /**
   * 扇形半径
   * @type Number
   * @readonly
   */
  get radius() {
    return this._radius;
  }
  /**
   * 开合角，单位度
   * @type Number
   * @readonly
   */
  get fov() {
    return this._fov;
  }
  /**
   * 扇形顶点坐标
   * @type {Cesium.Cartesian3[]}
   * @readonly
   */
  get positions() {
    return this._positions;
  }
  /**
   * 顶点类型
   * @type {Cesium.VertexFormat}
   * @readonly
   */
  get vertexFormat() {
    return this._vertexFormat;
  }
  /**
   * 拉伸高度
   * @type {Number}
   * @readonly
   */
  get extrudedHeight() {
    return this._extrudedHeight;
  }
  /**
   * 高度
   * @type {Number}
   * @readonly
   */
  get height() {
    return this._height;
  }
  /**
   * 扇形划分的片数
   * @type {Number}
   * @readonly
   */
  get slices() {
    return this._slices;
  }
  /**
   * 创建Geometry
   * @param  {SectorGeometry} sector 扇形
   * @return {Cesium.Geometry}   Geometry
   */
  static createGeometry(sector) {
    const positions = [];
    const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(sector._center);
    const perAngle = sector._fov / sector._slices;
    const rotation = sector.rotation;
    sector._vertexNumber = sector.slices * 2;
    const sts = [];
    const indices = [];
    const normals = []
    for (let i = 0, slices = sector._slices; i < slices; i++) {
      const x = sector._radius * Math.cos(Cesium.Math.toRadians(rotation + perAngle * i));
      const y = sector._radius * Math.sin(Cesium.Math.toRadians(rotation + perAngle * i));
      const lc = new Cesium.Cartesian3(x, y, 0);
      const wc = new Cesium.Cartesian3();
      Cesium.Matrix4.multiplyByPoint(modelMatrix, lc, wc);
      positions.push(wc.x, wc.y, wc.z);
      sts.push(Math.cos(Cesium.Math.toRadians(rotation + perAngle * i)) * 0.5 + 0.5);
      sts.push(Math.sin(Cesium.Math.toRadians(rotation + perAngle * i)) * 0.5 + 0.5);
      normals.push(0, 0, 1);
    }
    normals.push(0, 0, 1);
    sts.push(0.5, 0.5)
    positions.push(sector.center.x, sector.center.y, sector.center.z);
    const originIndex = positions.length / 3 - 1;
    if (sector.height !== 0) {
      Cesium.PolygonPipeline.scaleToGeodeticHeight(positions, sector.height, Cesium.Ellipsoid.WGS84, false);
    }
    for (let j = 0; j < sector._slices - 1; j++) {
      indices.push(j);
      indices.push(originIndex);
      indices.push(j + 1);
    }
    const attributes = {
      position: new Cesium.GeometryAttribute({
        componentDatatype: Cesium.ComponentDatatype.DOUBLE,
        componentsPerAttribute: 3,
        values: new Float64Array(positions)
      })
    }
    if (sector.vertexFormat.normal) {
      attributes.normal = new Cesium.GeometryAttribute({
        componentDatatype: Cesium.ComponentDatatype.FLOAT,
        componentsPerAttribute: 3,
        values: normals,
      })
    }
    if (sector.vertexFormat.st) {
      attributes.st = new Cesium.GeometryAttribute({
        componentDatatype: Cesium.ComponentDatatype.FLOAT,
        componentsPerAttribute: 2,
        values: sts,
      })
    }
    return new Cesium.Geometry({
      attributes,
      indices: Cesium.IndexDatatype.createTypedArray(sector._vertexNumber, indices),
      primitiveType: Cesium.PrimitiveType.TRIANGLES,
      boundingSphere: Cesium.BoundingSphere.fromVertices(positions),
    })
  }

}

export default SectorGeometry;

import BasePlot from './BasePlot';
import PointPlot from './PointPlot';
import defaultValue from '../core/defaultValue';
import PlotType from './PlotType';
import defined from '../core/defined';
import CesiumProError from '../core/CesiumProError';

class PolygonPlot extends BasePlot {
  /**
   * 可编辑的多边形
   * @extends BasePlot
   * @param {Object} entityOptions 和Cesium.PolygonGraphics具有相同的属性
   * @param {Object} [options={}] 具有以下属性
   */
  constructor(entityOptions, options = {}) {
    super(entityOptions, options);
    this._entityOptions = entityOptions;
    this._positions = defaultValue(entityOptions.positions, []);
    this._nodePositions = [...this.positions];
    if (this._nodePositions.length) {
      this._nodePositions[this._nodePositions.length] = this._nodePositions[0];
    }
    this._type = PlotType.POLYGON;
    this._entity = this.createEntity();
  }

  /**
   * 该图形的几何描述，包括类型，经纬度等
   * @return {Object}
   */
  getGeometry() {
    return PolygonPlot.getGeometry(this);
  }
  /**
   * 获得图形的几何描述，包括类型，经纬度等
   * @return {Object}
   */
  static getGeometry(graphic) {
    const coordinates = [];
    const type = PlotType.getOGCType(graphic.type);

    for (const position of graphic.positions) {
      const lonlat = PointPlot.toDegrees(position);
      coordinates.push([lonlat.lon, lonlat.lat, lonlat.height]);
    }
    coordinates.push(coordinates[0])
    return {
      type,
      coordinates: [coordinates],
    };
  }

  /**
   * @private
   */
  createEntity() {
    super.createEntity();
    delete this._entityOptions.positions;
    const options = {
      id: this.id,
      polygon: {
        hierarchy: this.positions,
        ...this._entityOptions,
      },
    };
    if (this._entityOptions.outline) {
      options.polyline = {
        positions: this._nodePositions,
        material: this._entityOptions.outlineColor,
        width: this._entityOptions.outlineWidth,
      };
      options.polygon.outline = false;
      options.polyline.clampToGround = (this._entityOptions.heightReference === Cesium.HeightReference.CLAMP_TO_GROUND)
    }
    this._entityOptions = options;
    return new Cesium.Entity(this._entityOptions);
  }

  /**
   * 将该要素导出成GeoJson
   * @return {String} GeoJson字符串
   */
  toGeoJson() {
    return PolygonPlot.toGeoJson(this);
  }

  /**
   * 开始编辑几何信息，此时图形的顶点可以被修改、删除、移动。
   * 属性信息的编辑不需要调用该方法。
   * @fires BasePlot#preEdit
   */
  startEdit() {
    super.startEdit();
  }

  /**
   * @fires BasePlot#postEdit
   * 几何要素编辑完成后调用该方法，以降低性能消耗。
   * <p style='font-weight:bold'>建议在图形编辑完成后调用该方法，因为CallbackProperty
   * 对资源消耗比较大，虽然对单个图形来说，不调用此方法可能并不会有任何影响。</p>
   */
  stopEdit() {
    super.stopEdit();
  }

  /**
   * 添加顶点,如果在使用该函数前没有调用<code>startEdit()</code>，位置更新将不会立即生效,在下次调用<code>startEdit()</code>后，此操作将更新到图形。
   * @param {Cartesian} node 新顶点
   * @param {Number} [index] 如果index未定义，顶点将被添加到最后
   */
  addNode(node, index) {
    const vertexNumber = this.positions.length
    if (defined(index) && index < vertexNumber && index >= 0) {
      for (let i = vertexNumber; i > index; i--) {
        this.positions[i] = this.positions[i - 1];
        this._nodePositions[i] = this._nodePositions[i - 1];
      }
      this.positions[index] = node;
      this._nodePositions[index] = node;
    } else {
      index = vertexNumber;
      this.positions.push(node);
      this._nodePositions[index] = node;
    }
    if (this._positions.length) {
      this._nodePositions[vertexNumber + 1] = this._nodePositions[0];
    }
  }
  /**
   * 删除一个顶点,如果在使用该函数前没有调用<code>startEdit()</code>，位置更新将不会立即生效,在下次调用<code>startEdit()</code>后，此操作将更新到图形。
   * @param  {Number} index 顶点编号
   */
  removeNode(index) {
    if (!defined(index)) {
      return
    }
    if (index < 0 || index >= this.positions.length) {
      return;
    }
    this.positions.splice(index, 1);
    this._nodePositions.splice(index, 1);
    const nodeCount = this.positions.length;
    if (index === 0) {
      this._nodePositions[nodeCount] = this._nodePositions[0];
    }
  }

  /**
   * 删除最后一个顶点
   */
  popNode() {
    const index = this.positions.length - 1;
    this.removeNode(index);
  }

  /**
   * 更新一个顶点,如果在使用该函数前没有调用<code>startEdit()</code>，位置更新将不会立即生效,在下次调用<code>startEdit()</code>后，此操作将更新到图形。
   * @param  {Number} index 顶点编号
   * @param  {Cartesian} node  将要更新的位置
   */
  updateNode(index, node) {
    if (index >= this.positions.length) {
      return;
    }
    this.positions[index] = node;
    const nodeCount = this.positions.length;
    this._nodePositions[index] = node;
    if (index === 0) {
      this._nodePositions[nodeCount] = node;
    }
  }

  /**
   * 更新模型样式
   * @param  {Object} style 描述一个Cesium.ModelGraphics
   */
  updateStyle(style) {
    if (!style || !this.entity.model) {
      return;
    }
    for (const s in style) {
      if (style.hasOwnProperty(s)) {
        if (s === 'outline' && !style.outline && this.entity.polyline) {
          this.entity.polyline = undefined;
        }
        if (s === 'outlineColor' && this.entity.polyline) {
          this.entity.polyline.material = style[s];
        }
        if (s === 'outlineWidth' && this.entity.polyline) {
          this.entity.polyline.width = style[s];
        }
        this.entity.polygon[s] = style[s];
      }
    }
  }

  /**
   * 将图形转为GeoJson
   * @param  {PolygonPlot} graphic
   * @return {Object}  graphic的geojson格式
   */
  static toGeoJson(graphic) {
    const type = PlotType.getOGCType(graphic.type);
    const properties = graphic.properties ? graphic.properties.toJson() : {};
    properties.PlotType = graphic.type;
    const features = {
      type: 'Feature',
      properties,
      geometry: graphic.getGeometry(),
    };
    return features;
  }

  /**
   * 利用GeoJson创建图形
   * @param  {String|Object} json   json对象或字符串
   * @param  {Object} style  图形样式
   * @return {PolygonPlot}
   */
  static fromGeoJson(json, style) {
    if (typeof json === 'string') {
      json = JSON.parse(json);
    }
    if (!defined(json.geometry) || !(defined(json.properties))) {
      return;
    }
    const type = json.properties.PlotType;
    if (type !== PlotType.POLYGON) {
      throw new CesiumProError('json没有包含一个有效的PolygonGraphic.');
    }
    const coordinate = json.geometry && json.geometry.coordinates;
    return PolygonPlot.fromCoordinates(coordinate, json.properties, style);
  }

  /**
   * 从坐标点生成点图形
   * @param  {Number[]} coordinate  包含经纬和纬度的数组
   * @param  {Style} [style=PointPlot.defaultStyle] 点样式
   * @return {PolygonPlot}
   */
  static fromCoordinates(coordinates, properties, style = PolygonPlot.defaultStyle) {
    const positions = Cesium.Cartesian3.fromDegreesArray(coordinates[0].flat());

    const options = {
      positions,
      properties,
      ...style,
    };
    return new PolygonPlot(options);
  }
  /**
   * 默认样式
   * @type {Object}
   * @static
   * @memberof PolygonPlot
   */
  static defaultStyle = {
    material: Cesium.Color.fromCssColorString('rgba(247,224,32,0.5)'),
    outlineColor: Cesium.Color.RED,
    outlineWidth: 2,
    outline: true,
    perPositionHeight: false,
  }

  static highlightStyle = {
    material: new Cesium.ColorMaterialProperty(Cesium.Color.AQUA.withAlpha(0.4)),
    outlineColor: Cesium.Color.AQUA.withAlpha(0.4),
  }

  /**
   * 从一系列点中获取几何中心位置
   * @param  {Cesium.Cartesian3[]} points 点集
   * @return {Cesium.Cartesian3}    以points为顶点的多边形的几何中心
   */
  static centerFromPonits(points) {
    const boundingSphere = Cesium.BoundingSphere.fromPoints(points);
    if (boundingSphere) {
      return boundingSphere.center;
    }
    return undefined;
  }
  /**
   * 从Entity或Primitive获得多边形中心
   * @param  {Entity|Primitive} polygon 多边形
   * @return {Cartesian3}         多边形几何中心
   */
  static center(polygon) {
    let points = [];

    function getHierarchy(hierarchy) {
      if (hierarchy.getValue) {
        const hierarchyValue = hierarchy.getValue();
        if (hierarchyValue instanceof Cesium.PolygonHierarchy) {
          points = hierarchyValue.positions;
        } else {
          points = hierarchyValue;
        }
      } else if (Array.isArray(hierarchy)) {
        points = hierarchy;
      }
    }
    if (polygon instanceof Cesium.Entity) {
      const {
        hierarchy
      } = polygon.polygon;
      getHierarchy(hierarchy);
    } else if (polygon.polygonHierarchy) {
      points = polygon.polygonHierarchy.positions;
    } else if (polygon.hierarchy) {
      getHierarchy(polygon.hierarchy);
    }
    return PolygonPlot.centerFromPonits(points);
  }
  /**
   * 判断多边形顶点是否为顺时针，如果多边形是有洞，只需传外边界
   * @param  {Cartesian3[]}  points 多边形顶点坐标
   * @param  {Viewer}  viewer Viewer对象
   * @return {Boolean}        true 表示该顶点顺序为顺时针，否则为逆时针
   * @example
   * const entity = viewer.entities.add({
   *   polygon: {
   *     hierarchy: new Cesium.PolygonHierarchy(
   *       Cesium.Cartesian3.fromDegreesArray([110, 30, 113, 30, 113, 33, 110, 33]),
   *       [new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray([111, 31, 111, 32, 112, 32, 112, 31]))]
   *     ),
   *     material: Cesium.Color.RED
   *   }
   * })
   *
   * PolygonPlot.isClockWise(entity.polygon.hierarchy.getValue().positions)
   */
  static isClockWise(points, viewer) {
    const tangentPlane = Cesium.EllipsoidTangentPlane.fromPoints(
      points,
      viewer.scene.globe.ellipsoid
    );
    const formatPoints = Cesium.arrayRemoveDuplicates(
      points,
      Cesium.Cartesian3.equalsEpsilon,
      true
    );
    const projectPointsTo2D = tangentPlane.projectPointsOntoPlane.bind(tangentPlane);
    const positions2D = projectPointsTo2D(formatPoints);
    const originalWindingOrder = Cesium.PolygonPipeline.computeWindingOrder2D(
      positions2D
    );
    return originalWindingOrder === Cesium.WebGLConstants.CW;
  }
}

export default PolygonPlot;

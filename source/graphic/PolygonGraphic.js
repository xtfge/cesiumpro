import Graphic from '../core/Graphic';
import PointGraphic from './PointGraphic';
import defaultValue from '../core/defaultValue';
import GraphicType from '../core/GraphicType';
import defined from '../core/defined';
import NodeGraphic from './NodeGraphic';

class PolygonGraphic extends Graphic {
  /**
   * 可编辑的多边形
   * @extends Graphic
   * @param {Cesium.Viewer} viewer
   * @param {Object} entityOptions 和Cesium.PolygonGraphics具有相同的属性
   * @param {Object} [options={}] 具有以下属性
   */
  constructor(viewer, entityOptions, options = {}) {
    super(viewer, options);
    this._entityOptions = entityOptions;
    this._positions = defaultValue(entityOptions.positions, []);
    this._nodePositions = [...this.positions, this.positions[0]];
    this._type = GraphicType.POLYGON;
    this._entity = this.createEntity();
    this.add();
  }

  /**
   * 该图形的几何描述，包括类型，经纬度等
   * @return {Object}
   */
  getGeometry() {
    return PolygonGrphic.getGeometry(this);
  }
  /**
   * 获得图形的几何描述，包括类型，经纬度等
   * @return {Object}
   */
  static getGeometry(graphic) {
    const coordinates = [];
    const type = GraphicType.getOGCType(graphic.type);

    for (const position of graphic.positions) {
      const lonlat = PointGraphic.toDegrees(position);
      coordinates.push([lonlat.lon, lonlat.lat]);
    }
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
    }
    this._entityOptions = options;
    return new Cesium.Entity(this._entityOptions);
  }

  toGeoJson() {
    return PolygonGraphic.toGeoJson(this);
  }

  /**
   * 开始编辑几何信息，此时图形的顶点可以被修改、删除、移动。
   * 属性信息的编辑不需要调用该方法。
   * @fires Graphic#preEdit
   */
  startEdit() {
    super.startEdit();
    const style = PointGraphic.defaultStyle;
    this._node = new NodeGraphic(this._viewer, {
      positions: this.positions,
      ...style,
    });
  }

  /**
   * @fires Graphic#postEdit
   * 几何要素编辑完成后调用该方法，以降低性能消耗。
   * <p style='font-weight:bold'>建议在图形编辑完成后调用该方法，因为CallbackProperty
   * 对资源消耗比较大，虽然对单个图形来说，不调用此方法可能并不会有任何影响。</p>
   */
  stopEdit() {
    super.stopEdit();
    this._node && this._node.destroy();
    this._node = undefined;
  }

  /**
   * 添加顶点,如果在使用该函数前没有调用<code>startEdit()</code>，位置更新将不会立即生效,在下次调用<code>startEdit()</code>后，此操作将更新到图形。
   * @param {Cartesian} node 新顶点
   */
  addNode(node) {
    this.positions.push(node);
    this._nodePositions[this._nodePositions.length] = this._nodePositions[this._nodePositions.length - 1];
    this._nodePositions[this._nodePositions.length - 1] = node;
  }

  /**
   * 删除一个顶点,如果在使用该函数前没有调用<code>startEdit()</code>，位置更新将不会立即生效,在下次调用<code>startEdit()</code>后，此操作将更新到图形。
   * @param  {Number} index 顶点编号
   */
  removeNode(index) {
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
   * @param  {PolygonGraphic} graphic
   * @return {Object}  graphic的geojson格式
   */
  static toGeoJson(graphic) {
    const type = GraphicType.getOGCType(graphic.type);
    const properties = graphic.properties ? graphic.properties.toJson() : {};
    properties.graphicType = graphic.type;
    const features = {
      type: 'Feature',
      properties,
      geometry: graphic.getGeometry(),
    };
    return features;
  }

  /**
   * 利用GeoJson创建图形
   * @param  {Cesium.Viewer} viewer
   * @param  {String|Object} json   json对象或字符串
   * @param  {Object} style  图形样式
   * @return {PolygonGraphic}
   */
  static fromGeoJson(viewer, json, style) {
    if (typeof json === 'string') {
      json = JSON.parse(json);
    }
    if (!defined(json.geometry) || !(defined(json.properties))) {
      return;
    }
    const type = json.properties.graphicType;
    if (type !== GraphicType.POLYGON) {
      throw new CesiumProError('json没有包含一个有效的PolygonGraphic.');
    }
    const coordinate = json.geometry && json.geometry.coordinates;
    return PolygonGraphic.fromCoordinates(viewer, coordinate, json.properties, style);
  }

  /**
   * 从坐标点生成点图形
   * @param {Cesium.Viewer} viewer
   * @param  {Number[]} coordinate  包含经纬和纬度的数组
   * @param  {Style} [style=PointGraphic.defaultStyle] 点样式
   * @return {PolygonGraphic}
   */
  static fromCoordinates(viewer, coordinates, properties, style = PolygonGraphic.defaultStyle) {
    const positions = Cesium.Cartesian3.fromDegreesArray(coordinates[0].flat());

    const options = {
      positions,
      properties,
      ...style,
    };
    return new PolygonGraphic(viewer, options);
  }

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
    return PolygonGraphic.centerFromPonits(points);
  }
}

export default PolygonGraphic;

import BasePlot from './BasePlot'
import PointPlot from './PointPlot'
import defaultValue from '../core/defaultValue'
import PlotType from './PlotType'
import defined from '../core/defined';
import PolygonPlot from './PolygonPlot';
import CesiumProError from '../core/CesiumProError'
import {
  StraightArrow,
  AttackArrow,
  DoubleArrow,
  ArrowType
} from '../../thirdParty/arrow';
class ArrowPlot extends BasePlot {
  constructor(entityOptions, options = {}) {
    super(entityOptions, options);
    this._type = defaultValue(options.type, PlotType.STRAIGHTARROW);
    this._entityOptions = entityOptions
    this._positions = defaultValue(entityOptions.positions, [])
    this._arrowType = defaultValue(options.type, PlotType.STRAIGHTARROW);
    if (!ArrowType.validate(this._arrowType)) {
      throw new CesiumProError('无效的箭头图形.')
    }
    const positions = []
    for (let p of this.positions) {
      const ll = PointPlot.toDegrees(p);
      positions.push([ll.lon, ll.lat])
    }
    if (this._arrowType === ArrowType.straightarrow) {
      this._arrow = new StraightArrow({
        controls: positions
      })
    }
    if (this._arrowType === ArrowType.attackarrow) {
      this._arrow = new AttackArrow({
        controls: positions
      })
    }
    if (this._arrowType === ArrowType.doublearrow) {
      this._arrow = new DoubleArrow({
        controls: positions
      })
    }
    this._entity = this.createEntity();
    this._nodePositions = this._positions;
  }
  /**
   * 箭头图形
   * @return {StraightArrow|AttackArrow|DoubleArrow}
   */
  get arrow() {
    return this._arrow;
  }
  /**
   * 该图形的几何描述，包括类型，经纬度等
   * @return {Object}
   */
  getGeometry() {
    PolygonPlot.getGeometry(this);
  }
  createEntity() {
    super.createEntity();
    delete this._entityOptions.positions;

    const options = {
      id: this.id,
      polygon: {
        hierarchy: this._arrow.polygon.length ? Cesium.Cartesian3.fromDegreesArray(this._arrow.polygon) : this._arrow.polygon,
        ...this._entityOptions,
      },
    };
    if (this._entityOptions.outline) {
      options.polyline = {
        positions: this._arrow.polyline.length ? Cesium.Cartesian3.fromDegreesArray(this._arrow.polyline) : this._arrow.polyline,
        material: this._entityOptions.outlineColor,
        width: this._entityOptions.outlineWidth,
      };
      options.polygon.outline = false;
    }
    this._entityOptions = options;
    return new Cesium.Entity(this._entityOptions);
  }

  /**
   * 对图形几何编辑前调用
   */
  startEdit() {
    //pass
    //ArrwoGraphic用updateEntity来更新图形，不需要实现startEdit和stopEdit
  }
  /**
   * 图形几何信息编辑完成后调用
   */
  stopEdit() {
    //pass
  }

  /**
   * 添加顶。
   * @param {Cartesian} node 新顶点
   */
  addNode(node) {
    if (this.arrow) {
      const ll = PointPlot.toDegrees(node);
      this.arrow.addControl([ll.lon, ll.lat])
      this.updatePositions();
      this.updateEntity()
      this.lastLon = ll.lon;
    }
  }
  /**
   * 删除最后一个顶点
   */
  popNode() {
    if (this.arrow) {
      this.arrow.popControl();
      this.updatePositions();
      this.updateEntity()
    }
  }
  /**
   * 更新一个顶点
   * @param  {Number} index 顶点编号
   * @param  {Cartesian} node  将要更新的位置
   */
  updateNode(index, node) {
    if (this.arrow) {
      const ll = PointPlot.toDegrees(node);
      this.arrow.updateControl(index, [ll.lon, ll.lat]);
      this.updatePositions()
      this.updateEntity()
    }
  }

  /**
   * @private
   */
  updatePositions() {
    if (!defined(this.arrow)) {
      return;
    }
    const controls = this.arrow.controls;
    for (let i = 0; i < controls.length; i++) {
      this.positions[i] = Cesium.Cartesian3.fromDegrees(controls[i][0], controls[i][1]);
    }
    if (this.positions.length > controls.length) {
      this.positions.splice(controls.length)
    }
  }

  /**
   * @private
   */
  updateEntity() {
    if (this.entity && this.entity.polygon) {
      // 未知bug，会出现很多NAN
      const polygonPositions = this.arrow.polygon.filter(_ => !isNaN(_));
      const polylinePositions = this.arrow.polyline.filter(_ => !isNaN(_));
      this.entity.polygon.hierarchy = polygonPositions.length ?
        Cesium.Cartesian3.fromDegreesArray(polygonPositions) : polygonPositions;
      if (this.entity.polyline) {
        this.entity.polyline.positions = polylinePositions.length ?
          Cesium.Cartesian3.fromDegreesArray([...polylinePositions, polylinePositions[0], polylinePositions[1]]) : polylinePositions;
      }
    }
  }
}

export default ArrowPlot;

import Graphic from '../core/Graphic'
import PointGraphic from './PointGraphic'
import defaultValue from '../core/defaultValue'
import GraphicType from '../core/GraphicType'
import defined from '../core/defined';
import NodeGraphic from './NodeGraphic'
import PolygonGraphic from './PolygonGraphic';
import CesiumProError from '../core/CesiumProError'
import {
  StraightArrow,
  AttackArrow,
  DoubleArrow,
  ArrowType
} from '../thirdParty/arrow';
class ArrowGraphic extends Graphic {
  constructor(viewer, entityOptions, options = {}) {
    super(viewer, entityOptions);
    this._type = GraphicType.ARROW;
    this._entityOptions = entityOptions
    this._positions = defaultValue(entityOptions.positions, [])
    this._arrowType = defaultValue(options.arrowType, 'straightarrow');
    if (!ArrowType.validate(this._arrowType)) {
      throw new CesiumProError('无效的箭头图形.')
    }
    const positions = []
    for (let p of this.positions) {
      const ll = PointGraphic.toDegrees(p);
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
    this.add();
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
    PolygonGraphic.getGeometry(this);
  }
  createEntity() {
    super.createEntity();
    delete this._entityOptions.positions;
    const options = {
      id: this.id,
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArray(this._arrow.polygon),
        ...this._entityOptions,
      },
    };
    if (this._entityOptions.outline) {
      options.polyline = {
        positions: Cesium.Cartesian3.fromDegreesArray(this._arrow.polyline),
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
   * @fires Graphic#preEdit
   */
  startEdit() {
    const style = PointGraphic.defaultStyle;
    this._node = new NodeGraphic(this._viewer, {
      positions: this.positions,
      ...style,
    });
  }
  /**
   * 图形几何信息编辑完成后调用
   * @fires Graphic#postEdit
   */
  stopEdit() {
    this._node && this._node.destroy();
    this._node = undefined;
  }

  /**
   * 添加顶。
   * @param {Cartesian} node 新顶点
   */
  addNode(node) {
    if (this.arrow) {
      const ll = PointGraphic.toDegrees(node);
      this.arrow.addControl([ll.lon, ll.lat])
      this.updatePositions();
      this.updateEntity()
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
      const ll = PointGraphic.toDegrees(node);
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
      this.entity.polygon.hierarchy = Cesium.Cartesian3.fromDegreesArray(this.arrow.polygon);
    }
  }
}

export default ArrowGraphic;

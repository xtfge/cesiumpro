import checkViewer from './checkViewer'
import CesiumProError from './CesiumProError'
import defaultValue from './defaultValue'
import $ from '../thirdParty/jquery';
import ajaxCatch from './ajaxCatch'
import PolygonGraphic from './PolygonGraphic'
class ModelAttachVector {
  /**
   * 创建模型的关联矢量，主要用于为模型附加属性信息，可以达到模型单体化的视觉效果。
   * @param {Object} [options={}]具有以下属性
   * @param {Cesium.Viewer} options.viewer Cesium.Viewer对象
   * @param {String} options.vectorResource 矢量文件路径，目前只支持geojson
   * @param {String} [options.key='id'] 将要作为关键字的属性字段，该字段必须在矢量文件的属性表中，且不重复
   * @param {Cesium.Material} [options.material=Cesium.Color.GOLD.withAlpha(0.5)] 编辑模式下要素的材质
   * @param {Cesium.Material} [options.highlightMaterial=Cesium.Color.AQUA] 高亮材质
   * @param {String} [options.mode='edit'] 默认模式
   */
  constructor(options = {}) {
    const {
      viewer,
      vectorResource,
      key
    } = options;
    checkViewer(viewer);
    this._materail = defaultValue(options.material, Cesium.Color.GOLD.withAlpha(0.5));
    this._previewMaterial = Cesium.Color.RED.withAlpha(0.0);
    this._highlightMaterial = defaultValue(options.highlightMaterial, Cesium.Color.AQUA);
    this._viewer = viewer;
    this._vectorResource = vectorResource;
    this._key = defaultValue(key, 'id')
    const feats = vectorResource.features;
    //以数组的形式保存了所有entity
    this.entities = []
    //以key-value的形式保存所有entity;
    this.entityMap = new Map();
    this._mode = defaultValue(options.mode, 'edit')

    $.ajax({
      url: this._vectorResource,
      method: 'get',
      dataType: 'json',
      success: (res) => {
        const feats = res.features;
        for (let feat of feats) {
          if (feat.geometry.coordinates) {
            const hierarchy = ModelAttachVector.coordinates2Hierarchy(feat.geometry.coordinates);
            const center = PolygonGraphic.centerFromPonits(hierarchy.positions);
            if (center) {
              feat.properties.center = JSON.stringify(center)
            }
            const entity = this._viewer.entities.add({
              id: feat.properties[this._key],
              properties: feat.properties,
              polygon: {
                hierarchy: hierarchy.positions,
                material: this._mode === 'edit' ? this._materail : this._previewMaterial,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                outline: false,
                perPositionHeight: false
              }
            })
            this.entities.push(entity)
            this.entityMap.set(entity.id, entity)
          }

        }
      },
      error: (e) => {
        ajaxCatch(e)
      }
    })
  }

  /**
   * 要素的表现模式,edit-编辑模式,preview-预览模式
   * @type {String}
   */
  get mode() {
    return this._mode;
  }
  set mode(v) {
    this._mode = v;
    if (this._mode === 'edit') {
      this.setMaterial(this._materail)
    } else if (this._mode === 'preview') {
      this.setMaterial(this._previewMaterial);
    } else {
      console.console.warn('无效的模式');
    }
  }

  /**
   * 设置要素材质
   * @private
   */
  setMaterial(material) {
    const values = this.entityMap.values();
    for (let v of values) {
      if (v.polygon) {
        v.polygon.material = material;
      }
    }
  }

  /**
   * 通过key设置高亮
   * @param  {Cesium.Entity} key 
   */
  highLightByKey(key) {
    const entity = this.getByKey(key);
    this.highLightByEntity(entity)
  }

  /**
   * 通过Entity设置高亮
   * @param  {Cesium.Entity} entity
   */
  highLightByEntity(entity) {
    if (entity && entity.polygon) {
      entity.polygon.material = this._highlightMaterial;
    }
  }
  /**
   * 将Geojson的coordinates转为Cesium.Cartesian3数组
   * @param  {Array} coors coordinates
   * @return {Cesium.Cartesian3[]} 可以直接用于多边形hierarchy的Cestesian3数组
   */
  static coordinates2Hierarchy(coors) {
    const positions = []
    for (let cs of coors) {
      for (let c of cs) {
        positions.push(c[0], c[1])
      }
    }
    const cartesian = Cesium.Cartesian3.fromDegreesArray(positions)
    return new Cesium.PolygonHierarchy(cartesian);
  }
  /**
   * 定位到指定要素，如果未指定key将定位到所有要素
   * @param  {String} [key=''] 要素的key值
   */
  zoomTo(id = '') {
    const entity = this.getByKey(id);
    if (entity) {
      this._viewer.zoomTo(entity)
    } else {
      this._viewer.zoomTo(this.getAll());
    }
  }
  /**
   * 通过key获得指定要素
   * @param  {String} key key值
   * @return {Cesium.Entity}
   */
  getByKey(key) {
    const entity = this._viewer.entities.getById(key);
    return entity
  }

  /**
   * 返回所有要素
   * @return {Cesium.Entity[]} 矢量数据中的所有要素
   */
  getAll() {
    return Array.from(this.entityMap.values());
  }
  /**
   * 删除所有要素
   */
  removeAll() {
    const keys = this.entityMap.keys();
    for (let k of keys) {
      this.remove(k)
    }
    this.entityMap.clear();
  }

  /**
   * 删除指定key的几何要素
   * @param  {String} key key值
   */
  remove(key) {
    const entity = this.getByKey(key);
    if (entity) {
      this._viewer.entities.remove(entity);
      this.entityMap.delete(entity.id);
    }
  }

  /**
   * 销毁对象
   */
  destroy() {
    this.removeAll();
    this._viewer = undefined;
    this.entities = undefined;
  }

}

export default ModelAttachVector;

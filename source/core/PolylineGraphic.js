import Graphic from './Graphic'
class PolylineGraphic extends Graphic {
  constructor() {
    super();
  }

  static defaultStyle = {
    clampToGround: true,
    material: Cesium.Color.fromCssColorString('rgba(247,224,32,1)'),
    width: 3
  }
  static highlightStyle = {
    clampToGround: true,
    material: Cesium.Color.AQUA,
    width: 3,
  }
}

export default PolylineGraphic;

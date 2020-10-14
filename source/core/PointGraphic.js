import Graphic from './Graphic'
class PointGraphic extends Graphic {
  constructor() {
    super();
  }

  static defaultStyle = {
    color: Cesium.Color.RED,
    pixelSize: 5,
    outlineColor: Cesium.Color.WHITE,
    outlineWidth: 3
  }
  static highlightStyle = {
    color: Cesium.Color.AQUA,
    pixelSize: 5,
    outlineColor: Cesium.Color.AQUA,
    outlineWidth: 3,
  }
}

export default PointGraphic;

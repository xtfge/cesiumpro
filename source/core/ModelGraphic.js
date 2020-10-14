import Graphic from './Graphic'
class ModelGraphic extends Graphic {
  constructor() {
    super();
  }

  static defaultStyle = {
    colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT,
    color: Cesium.Color.WHITE,
    colorBlendAmount: 0.5,
    minimumPixelSize: 64,
  }
}
export default ModelGraphic

import Graphic from './Graphic'
class LabelGraphic extends Graphic {
  constructor() {
    super();
  }

  static defaultStyle = {
    font: '36px sans-serif',
    fillColor: Cesium.Color.WHITE,
    showBackground: true,
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    // outlineWidth: 2,
    scale: 0.5,
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    pixelOffset: new Cesium.Cartesian2(0, 0),
    heightReference: Cesium.HeightReference.NONE
  }
}

export default LabelGraphic;

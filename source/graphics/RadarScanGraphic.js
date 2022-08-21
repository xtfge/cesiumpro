import LonLat from '../core/LonLat';
import defaultValue from '../core/defaultValue';
import defined from '../core/defined'
import CesiumProError from '../core/CesiumProError';
import PointBaseGraphic from './PointBaseGraphic';
import Url from '../core/Url';
import glsl from '../shader/radarScan'
const {
    MaterialAppearance,
    Material
} = Cesium;
class RadarScanGraphic extends PointBaseGraphic {
    constructor(options) {
        super(options);
        this.speed = defaultValue(options.speed, 1000);
        
    }
    createAppearance() {
        if (this._appearance) {
            return this._appearance;
        }
        this._appearance = new MaterialAppearance({
            material: new Material({
                fabric: {
                    uniforms: {
                        image: Url.buildModuleUrl("./assets/img/radarScan.png")
                    }
                },
                source: glsl
            })
        })
        return this._appearance;
    }
}
export default RadarScanGraphic;
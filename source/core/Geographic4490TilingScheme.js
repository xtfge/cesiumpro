import Ellipsoid from "./Ellipsoid";
import defaultValue from "./defaultValue";
import defined from "./defined";
const {
    GeographicTilingScheme,
    GeographicProjection,
    Rectangle,
    Math: CesiumMath
} = Cesium;

class Geographic4490TilingScheme extends GeographicTilingScheme {
    /**
     * 4490坐标系切片方案
     * @param {*} options 
     */
    constructor(options = {}) {
        super(options);
        this._tileInfo = options.tileInfo;
        this._ellipsoid = defaultValue(options.ellipsoid, Ellipsoid.CGCS2000);
        this._rectangle = defaultValue(options.rectangle, Rectangle.fromDegrees(-180, -90, 180, 90));
        this._numberOfLevelZeroTilesX = defaultValue(options.numberOfLevelZeroTilesX, 4);
        this._numberOfLevelZeroTilesY = defaultValue(options.numberOfLevelZeroTilesY, 2);
        this._projection = new GeographicProjection(this._ellipsoid);
    }
    getNumberOfXTilesAtLevel(level) {
        if (!defined(this._tileInfo)) {
            return super.getNumberOfXTilesAtLevel(level);
        } else { // 使用切片矩阵计算
            var currentMatrix = this._tileInfo.lods.filter(function (item) {
                return item.level === level
            })
            var currentResolution = currentMatrix[0].resolution
            // return Math.round(360 / (this._tileInfo.rows * currentResolution))
            return Math.round(CesiumMath.toDegrees(CesiumMath.TWO_PI * 2) / (this._tileInfo.rows * currentResolution));
        }
    };
    getNumberOfYTilesAtLevel(level) {
        if (!defined(this._tileInfo)) {
            return super.getNumberOfYTilesAtLevel(level);
        } else { // 使用切片矩阵计算
            var currentMatrix = this._tileInfo.lods.filter(function (item) {
                return item.level === level
            })
            var currentResolution = currentMatrix[0].resolution
            // return Math.round(180 / (this._tileInfo.cols * currentResolution))
            return Math.round(CesiumMath.toDegrees(CesiumMath.TWO_PI * 2) / (this._tileInfo.cols * currentResolution));
        }
    };
}
export default Geographic4490TilingScheme;
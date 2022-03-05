import defined from '../core/defined.js'
import QuadTreeProvider from '../scene/QuadTreeProvider'
const {
    QuadtreeTileProvider,
    GeographicTilingScheme,
    when,
    Event,
    Cartographic
} = Cesium;

class TilePoint extends QuadTreeProvider {
    constructor(options = {}) {
        super(options)
    }
    loadTile(framestate, tile) {
        super.loadTile(framestate, tile)
        console.log(tile);
        
    }
    computeTileVisibility(tile, frameState, occluders) {
        return super.computeTileVisibility(tile, frameState, occluders)
    }   
}
export default TilePoint;
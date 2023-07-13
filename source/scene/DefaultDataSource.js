import defaultValue from "../core/defaultValue";
import LonLat from '../core/LonLat'
const {
    CustomDataSource,
    Color,
    HeightReference,
    HorizontalOrigin,
    VerticalOrigin,
    Cartesian3,
    Cartographic
} = Cesium;
function getCartesians(positions) {
    const first = positions[0];
    if (first instanceof LonLat) {
        return positions.map(_ => _.toCartesian());
    }
    if (first instanceof Cartesian3) {
        return positions
    }
    if (first instanceof Cartographic) {
        return positions.map(_ => Cartographic.toCartesian(_));
    }
    if (typeof first === 'number') {
        return Cartesian3.fromDegreesArray(positions);
    }
    return positions;
}
class DefaultDataSource {
    constructor(viewer, options = {}) {
        this.viewer = viewer;
        this.pointStyle = defaultValue(options.point, {
            color: Color.RED,
            pixelSize: 10,
            outlineColor: Color.WHITE,
            outlineWidth: 4,
        });
        this.lineStyle = defaultValue(options.polyline, {
            width: 5,
            material: Color.GOLD.withAlpha(0.5),
            clampToGround: true,
        })
        this.labelStyle = defaultValue(options.label, {
            fillColor: Color.WHITE,
            showBackground: true,
            horizontalOrigin: HorizontalOrigin.LEFT,
            verticalOrigin: VerticalOrigin.TOP,
            showBackground: true,
            backgroundColor: Color.BLACK.withAlpha(0.5),
            fillColor: Color.WHITE,
            font: '40px sans-serif',
            scale: 0.5
        })
        this.polygonStyle = defaultValue(options.polygon, {
            material: Color.GOLD.withAlpha(0.6),
        })
        this.ds = new CustomDataSource('cesiumpro-default');
        viewer.dataSources.add(this.ds);
    }
    addPoint(lon, lat, height) {
        const options = Object.assign({
            position: new LonLat(lon, lat, height).toCartesian()
        }, {
            point: this.pointStyle
        });
        return this.ds.entities.add(options);
    }
    addLabel(text, lon, lat, height) {
        const options = Object.assign({
            position: new LonLat(lon, lat, height).toCartesian()
        }, {
            label: Object.assign({
                text,
            }, this.labelStyle)
        });
        return this.ds.entities.add(options);
    }
    addPolyline(positions) {
        const options = Object.assign({
            positions: getCartesians(positions),
        }, this.lineStyle);
        return this.ds.entities.add({
            polyline: options
        });
    }
    addPolygon(positions, height, opts = {}) {
        const options = Object.assign({
            hierarchy: getCartesians(positions),
            height,
        }, this.polygonStyle, opts);
        return this.ds.entities.add({
            polygon: options
        });
    }
    remove(entity) {
        this.entities.remove(entity)
    }
    clear() {
        this.entities.removeAll();
    }
    destroy() {
        this.viewer.dataSources.remove(this.ds);
        this.ds.destroy();
    }
}
export default DefaultDataSource;
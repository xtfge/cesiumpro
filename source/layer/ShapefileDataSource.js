/*
 * @Author: zhangbo
 * @E-mail: zhangb@geovis.com.cn
 * @Date: 2020-02-25 15:57:44
 * @LastEditors: zhangbo
 * @LastEditTime: 2020-02-25 18:00:16
 * @Desc: 
 */
import shp from '../../thirdParty/shapefile.js'
import CesiumProError from '../core/CesiumProError.js';
import GeoJsonDataSource from './GeoJsonDataSource.js';
const {
    defined,
    defaultValue,
    ColorMaterialProperty,
    ConstantPositionProperty,
    ConstantProperty,
    DataSource,
    PolygonGraphics,
    PolylineGraphics,
    createGuid,
    Cartesian3,
    PointGraphics,
    ArcType,
    PolygonHierarchy,
    Color,
    HeightReference,
    Resource,
} = Cesium;
const sizes = {
    small: 24,
    medium: 48,
    large: 64
};
const crsLinkHrefs = {};
const crsLinkTypes = {}
const crsNames = {
    "urn:ogc:def:crs:OGC:1.3:CRS84": defaultCrsFunction,
    "EPSG:4326": defaultCrsFunction,
    "urn:ogc:def:crs:EPSG::4326": defaultCrsFunction,
};
const geoJsonObjectTypes = {
    Feature: processFeature,
    FeatureCollection: processFeatureCollection,
    GeometryCollection: processGeometryCollection,
    LineString: processLineString,
    MultiLineString: processMultiLineString,
    MultiPoint: processMultiPoint,
    MultiPolygon: processMultiPolygon,
    Point: processPoint,
    Polygon: processPolygon,
    Topology: processTopology
};
const geometryTypes = {
    GeometryCollection: processGeometryCollection,
    LineString: processLineString,
    MultiLineString: processMultiLineString,
    MultiPoint: processMultiPoint,
    MultiPolygon: processMultiPolygon,
    Point: processPoint,
    Polygon: processPolygon,
    Topology: processTopology
};
function coordinatesArrayToCartesianArray(coordinates, crsFunction) {
    var positions = new Array(coordinates.length);
    for (var i = 0; i < coordinates.length; i++) {
        positions[i] = crsFunction(coordinates[i]);
    }
    return positions;
}
function createDescriptionCallback(describe, properties, nameProperty) {
    var description;
    return function (time, result) {
        if (!defined(description)) {
            description = describe(properties, nameProperty);
        }
        return description;
    };
}
// GeoJSON processing functions
function createObject(geoJson, entityCollection, describe) {
    var id = geoJson.id;
    if (!defined(id) || geoJson.type !== 'Feature') {
        id = createGuid();
    } else {
        var i = 2;
        var finalId = id;
        while (defined(entityCollection.getById(finalId))) {
            finalId = id + '_' + i;
            i++;
        }
        id = finalId;
    }

    var entity = entityCollection.getOrCreateEntity(id);
    var properties = geoJson.properties;
    if (defined(properties)) {
        entity.properties = properties;

        var nameProperty;

        //Check for the simplestyle specified name first.
        var name = properties.title;
        if (defined(name)) {
            entity.name = name;
            nameProperty = 'title';
        } else {
            //Else, find the name by selecting an appropriate property.
            //The name will be obtained based on this order:
            //1) The first case-insensitive property with the name 'title',
            //2) The first case-insensitive property with the name 'name',
            //3) The first property containing the word 'title'.
            //4) The first property containing the word 'name',
            var namePropertyPrecedence = Number.MAX_VALUE;
            for (var key in properties) {
                if (properties.hasOwnProperty(key) && properties[key]) {
                    var lowerKey = key.toLowerCase();

                    if (namePropertyPrecedence > 1 && lowerKey === 'title') {
                        namePropertyPrecedence = 1;
                        nameProperty = key;
                        break;
                    } else if (namePropertyPrecedence > 2 && lowerKey === 'name') {
                        namePropertyPrecedence = 2;
                        nameProperty = key;
                    } else if (namePropertyPrecedence > 3 && /title/i.test(key)) {
                        namePropertyPrecedence = 3;
                        nameProperty = key;
                    } else if (namePropertyPrecedence > 4 && /name/i.test(key)) {
                        namePropertyPrecedence = 4;
                        nameProperty = key;
                    }
                }
            }
            if (defined(nameProperty)) {
                entity.name = properties[nameProperty];
            }
        }

        var description = properties.description;
        if (description !== null) {
            entity.description = !defined(description) ? describe(properties, nameProperty) : new ConstantProperty(description);
        }
    }
    return entity;
}
function processFeature(dataSource, feature, notUsed, crsFunction, options) {
    if (feature.geometry === null) {
        //Null geometry is allowed, so just create an empty entity instance for it.
        createObject(feature, dataSource._entityCollection, options.describe);
        return;
    }

    if (!defined(feature.geometry)) {
        throw new CesiumProError('feature.geometry is required.');
    }

    var geometryType = feature.geometry.type;
    var geometryHandler = geometryTypes[geometryType];
    if (!defined(geometryHandler)) {
        throw new CesiumProError('Unknown geometry type: ' + geometryType);
    }
    geometryHandler(dataSource, feature, feature.geometry, crsFunction, options);
}

function processFeatureCollection(dataSource, featureCollection, notUsed, crsFunction, options) {
    var features = featureCollection.features;
    for (var i = 0, len = features.length; i < len; i++) {
        processFeature(dataSource, features[i], undefined, crsFunction, options);
    }
}

function processGeometryCollection(dataSource, geoJson, geometryCollection, crsFunction, options) {
    var geometries = geometryCollection.geometries;
    for (var i = 0, len = geometries.length; i < len; i++) {
        var geometry = geometries[i];
        var geometryType = geometry.type;
        var geometryHandler = geometryTypes[geometryType];
        if (!defined(geometryHandler)) {
            throw new CesiumProError('Unknown geometry type: ' + geometryType);
        }
        geometryHandler(dataSource, geoJson, geometry, crsFunction, options);
    }
}

function createPoint(dataSource, geoJson, crsFunction, coordinates, options) {
    let size = options.pointSize;
    let color = options.pointColor;
    const properties = geoJson.properties;
    if (defined(properties)) {
        const cssColor = properties['point-color'];
        if (defined(cssColor)) {
            color = Color.fromCssColorString(cssColor);
        }

        size = defaultValue(sizes[properties['point-size']], size);
    }
    const point = new PointGraphics();

    // Clamp to ground if there isn't a height specified
    if (coordinates.length === 2 && options.clampToGround) {
        point.heightReference = HeightReference.CLAMP_TO_GROUND;
    }

    const entity = createObject(geoJson, dataSource._entityCollection, options.describe);
    entity.point = point;
    entity.point.color = color;
    entity.point.pixelSize = size;
    entity.position = new ConstantPositionProperty(crsFunction(coordinates));
}

function processPoint(dataSource, geoJson, geometry, crsFunction, options) {
    createPoint(dataSource, geoJson, crsFunction, geometry.coordinates, options);
}

function processMultiPoint(dataSource, geoJson, geometry, crsFunction, options) {
    var coordinates = geometry.coordinates;
    for (var i = 0; i < coordinates.length; i++) {
        createPoint(dataSource, geoJson, crsFunction, coordinates[i], options);
    }
}

function createLineString(dataSource, geoJson, crsFunction, coordinates, options) {
    const material = options.lineColor;
    const widthProperty = options.lineWidth;

    const properties = geoJson.properties;
    if (defined(properties)) {
        const width = properties['stroke-width'];
        if (defined(width)) {
            widthProperty = new ConstantProperty(width);
        }

        let color;
        let stroke = properties.stroke;
        if (defined(stroke)) {
            color = Color.fromCssColorString(stroke);
        }
        let opacity = properties['stroke-opacity'];
        if (defined(opacity) && opacity !== 1.0) {
            if (!defined(color)) {
                color = material.color.clone();
            }
            color.alpha = opacity;
        }
        if (defined(color)) {
            material = new ColorMaterialProperty(color);
        }
    }

    const entity = createObject(geoJson, dataSource._entityCollection, options.describe);
    const polylineGraphics = new PolylineGraphics();
    entity.polyline = polylineGraphics;

    polylineGraphics.clampToGround = options.clampToGround;
    polylineGraphics.material = material;
    polylineGraphics.width = widthProperty;
    polylineGraphics.positions = new ConstantProperty(coordinatesArrayToCartesianArray(coordinates, crsFunction));
    polylineGraphics.arcType = ArcType.RHUMB;
}

function processLineString(dataSource, geoJson, geometry, crsFunction, options) {
    createLineString(dataSource, geoJson, crsFunction, geometry.coordinates, options);
}

function processMultiLineString(dataSource, geoJson, geometry, crsFunction, options) {
    var lineStrings = geometry.coordinates;
    for (var i = 0; i < lineStrings.length; i++) {
        createLineString(dataSource, geoJson, crsFunction, lineStrings[i], options);
    }
}

function createPolygon(dataSource, geoJson, crsFunction, coordinates, options) {
    if (coordinates.length === 0 || coordinates[0].length === 0) {
        return;
    }

    let outlineColor = options.outlineColor.color;
    let material = options.fill;
    let outlineWidth = options.outlineWidth;

    const properties = geoJson.properties;
    if (defined(properties)) {
        const width = properties['stroke-width'];
        if (defined(width)) {
            outlineWidth = new ConstantProperty(width);
        }
        let color;
        const stroke = properties.stroke;
        if (defined(stroke)) {
            color = Color.fromCssColorString(stroke);
        }
        let opacity = properties['stroke-opacity'];
        if (defined(opacity) && opacity !== 1.0) {
            if (!defined(color)) {
                color = options.outlineColor.color.clone();
            }
            color.alpha = opacity;
        }

        if (defined(color)) {
            outlineColor = new ConstantProperty(color);
        }

        let fillColor;
        const fill = properties.fill;
        if (defined(fill)) {
            fillColor = Color.fromCssColorString(fill);
            fillColor.alpha = material.color.alpha;
        }
        opacity = properties['fill-opacity'];
        if (defined(opacity) && opacity !== material.color.alpha) {
            if (!defined(fillColor)) {
                fillColor = material.color.clone();
            }
            fillColor.alpha = opacity;
        }
        if (defined(fillColor)) {
            material = new ColorMaterialProperty(fillColor);
        }
    }

    const polygon = new PolygonGraphics();
    polygon.outline = new ConstantProperty(options.outline);
    polygon.outlineColor = outlineColor;
    polygon.outlineWidth = outlineWidth;
    polygon.material = material;
    polygon.arcType = ArcType.RHUMB;
    const extrudedHeight = options.extrudedHeight;
    if(extrudedHeight) {
        if(typeof extrudedHeight === 'number') {
            polygon.extrudedHeight = extrudedHeight;
        } else if(typeof extrudedHeight === 'string') {
            const conditions = extrudedHeight.match(/\$\{\s*.*?\s*\}/ig);
            if(conditions) {
                let extrudeValue = extrudedHeight;
                for(let con of conditions) {
                    const value = /\$\{\s*(.*?)\s*\}/ig.exec(con);
                    if(!(defined(value) && defined(value[1]))) {
                        continue;
                    }
                    extrudeValue = extrudeValue.replace(con, properties[value[1]]);
                }
                try {
                    const height = window.eval(extrudeValue);
                    if(typeof height === 'number') {
                        polygon.extrudedHeight = height
                    }
                }catch(e) {

                }
            }
        }
    }

    const holes = [];
    for (var i = 1, len = coordinates.length; i < len; i++) {
        holes.push(new PolygonHierarchy(coordinatesArrayToCartesianArray(coordinates[i], crsFunction)));
    }

    const positions = coordinates[0];
    polygon.hierarchy = new ConstantProperty(new PolygonHierarchy(coordinatesArrayToCartesianArray(positions, crsFunction), holes));
    if (positions[0].length > 2) {
        polygon.perPositionHeight = new ConstantProperty(true);
    } else if (!options.clampToGround) {
        polygon.height = 0;
    }

    const entity = createObject(geoJson, dataSource._entityCollection, options.describe);
    entity.polygon = polygon;
}

function processPolygon(dataSource, geoJson, geometry, crsFunction, options) {
    createPolygon(dataSource, geoJson, crsFunction, geometry.coordinates, options);
}

function processMultiPolygon(dataSource, geoJson, geometry, crsFunction, options) {
    var polygons = geometry.coordinates;
    for (var i = 0; i < polygons.length; i++) {
        createPolygon(dataSource, geoJson, crsFunction, polygons[i], options);
    }
}

function processTopology(dataSource, geoJson, geometry, crsFunction, options) {
    for (var property in geometry.objects) {
        if (geometry.objects.hasOwnProperty(property)) {
            var feature = topojson.feature(geometry, geometry.objects[property]);
            var typeHandler = geoJsonObjectTypes[feature.type];
            typeHandler(dataSource, feature, feature, crsFunction, options);
        }
    }
}
function defaultDescribe(properties, nameProperty) {
    var html = "";
    for (var key in properties) {
        if (properties.hasOwnProperty(key)) {
            if (key === nameProperty || simpleStyleIdentifiers.indexOf(key) !== -1) {
                continue;
            }
            var value = properties[key];
            if (defined(value)) {
                if (typeof value === "object") {
                    html +=
                        "<tr><th>" +
                        key +
                        "</th><td>" +
                        defaultDescribe(value) +
                        "</td></tr>";
                } else {
                    html += "<tr><th>" + key + "</th><td>" + value + "</td></tr>";
                }
            }
        }
    }

    if (html.length > 0) {
        html =
            '<table class="cesium-infoBox-defaultTable"><tbody>' +
            html +
            "</tbody></table>";
    }

    return html;
}
const simpleStyleIdentifiers = [
    "title",
    "description", //
    "marker-size",
    "marker-symbol",
    "marker-color",
    "stroke", //
    "stroke-opacity",
    "stroke-width",
    "fill",
    "fill-opacity",
];
function defaultDescribeProperty(properties, nameProperty) {
    return new Cesium.CallbackProperty(createDescriptionCallback(defaultDescribe, properties, nameProperty), true);
}
function defaultCrsFunction(coordinates) {
    return Cartesian3.fromDegrees(coordinates[0], coordinates[1], coordinates[2]);
}
function load(that, geoJson, options, sourceUri) {
    let name;
    if (defined(sourceUri)) {
        name = Cesium.getFilenameFromUri(sourceUri);
    }

    if (defined(name) && that._name !== name) {
        that._name = name;
        that._changed.raiseEvent(that);
    }

    const typeHandler = geoJsonObjectTypes[geoJson.type];
    if (!defined(typeHandler)) {
        throw new CesiumProError('Unsupported GeoJSON object type: ' + geoJson.type);
    }

    //Check for a Coordinate Reference System.
    const crs = geoJson.crs;
    let crsFunction = crs !== null ? defaultCrsFunction : null;

    if (defined(crs)) {
        if (!defined(crs.properties)) {
            throw new CesiumProError('crs.properties is undefined.');
        }

        const properties = crs.properties;
        if (crs.type === 'name') {
            crsFunction = crsNames[properties.name];
            if (!defined(crsFunction)) {
                throw new CesiumProError('Unknown crs name: ' + properties.name);
            }
        } else if (crs.type === 'link') {
            var handler = crsLinkHrefs[properties.href];
            if (!defined(handler)) {
                handler = crsLinkTypes[properties.type];
            }

            if (!defined(handler)) {
                throw new CesiumProError('Unable to resolve crs link: ' + JSON.stringify(properties));
            }

            crsFunction = handler(properties);
        } else if (crs.type === 'EPSG') {
            crsFunction = crsNames['EPSG:' + properties.code];
            if (!defined(crsFunction)) {
                throw new CesiumProError('Unknown crs EPSG code: ' + properties.code);
            }
        } else {
            throw new CesiumProError('Unknown crs type: ' + crs.type);
        }
    }

    return Cesium.when(crsFunction, function (crsFunction) {
        that._entityCollection.removeAll();

        // null is a valid value for the crs, but means the entire load process becomes a no-op
        // because we can't assume anything about the coordinates.
        if (crsFunction !== null) {
            typeHandler(that, geoJson, geoJson, crsFunction, options);
        }

        return Cesium.when.all(that._promises, function () {
            that._promises.length = 0;
            DataSource.setLoading(that, false);
            return that;
        });
    });
}
class ShapefileDataSource extends GeoJsonDataSource {
    /**
     * 创建一个ESRI Shapefile数据源
     * @param {String} [name] 数据源名称
     * @example
     *  const province = CesiumPro.ShapefileDataSource.load('../data/shp/province.shp')
     *  const city = new CesiumPro.ShapefileDataSource().load('../data/shp/city.shp')
     *  viewer.addLayer(province)
     *  viewer.addLayer(city)
     * @extends GeoJsonDataSource
     */
    constructor(name) {
        super(name);
        this._geoJson = undefined;
    }

    get geoJson() {
        return this._geoJson;
    }
    set geoJson(v) {
        if (this._geoJson) {
            this._geoJson.features.push(v)
        } else {
            this._geoJson = {
                type: 'FeatureCollection',
                features: [v]
            }
        }
    }
    /**
     * 点要素的默认大小
     * @type {Number}
     * @memberof ShapefileDataSource
     * @default 5
     */
    static pointSize = 5;
    /**
     * 点要素的默认颜色
     * @memberof ShapefileDataSource
     * @type {Cesium.Color}
     * @default Cesium.Color.ROYALBLUE
     */
    static pointColor = Color.ROYALBLUE;
    /**
     * 线要素的颜色
     * @memberof ShapefileDataSource
     * @type {Cesium.Color}
     * @default Cesium.Color.YELLOW
     */
    static lineColor = Color.YELLOW;
    /**
     * 多边形要素的填充色
     * @memberof ShapefileDataSource
     * @type {Cesium.Color}
     * @default Cesium.Color.fromBytes(255, 255, 0, 100)
     */
    static fill = Color.fromBytes(255, 255, 0, 100);
    /**
     * 多边形要素是否显边框
     * @memberof ShapefileDataSource
     * @type {Boolean}
     * @default true
     */
    static outline = true;
    /**
     * 多边形要素边框的颜色
     * @memberof ShapefileDataSource
     * @type {Cesium.Color}
     * @default Cesium.Color.YELLOW
     */
    static outlineColor = Color.YELLOW;
    /**
     * 线要素的宽度
     * @memberof ShapefileDataSource
     * @type {Number}
     * @default 2
     */
    static lineWidth = 2;
    /**
     * 是否贴地
     * @type {Boolean}
     * @memberof ShapefileDataSource
     * @default false
     */
    static clampToGround = false;
    /**
     * 多边形要素的边框宽度，该属性在windows环境下可能不生效
     * @memberof ShapefileDataSource
     * @type {Number}
     * @default 1
     */
    static outlineWidth = 1;
    static crsNames() {
        return crsNames;
    }
    static crsLinkHrefs() {
        return crsLinkHrefs;
    }
    static crsLinkTypes() {
        return crsLinkTypes;
    }
    /**
      * 加载Shapefile数据
      * @param {String} data shapefile文件路径
      * @param {GeoJsonDataSource.LoadOptions} options 样式配置参数
      * @returns {Promise<ShapefileDataSource>}
     */
    load(data, options = { encoding: 'utf-8' }) {
        if (!defined(data)) {
            throw new CesiumProError('data is required.');
        }

        Cesium.DataSource.setLoading(this, true);

        const credit = options.credit;
        if (typeof credit === 'string') {
            credit = new Cesium.Credit(credit);
        }
        this._credit = credit;
        const that = this;

        let promise = data;
        let sourceUri = options.sourceUri;
        if (typeof data === 'string' || (data instanceof Resource)) {
            promise = new Promise((resolve, reject) => {
                shp.open(data, undefined, { encoding: options.encoding })
                    .then(source =>
                        source.read().then(function load(result) {
                            if (result.done) {
                                resolve(that.geoJson)
                                return
                            };
                            that.geoJson = result.value
                            return source.read().then(load);
                        })
                    )
                    .catch(error => reject(error.stack));
            })
            sourceUri = defaultValue(sourceUri, '');

            // Add resource credits to our list of credits to display
            var resourceCredits = this._resourceCredits;
            var credits = data.credits;
            if (defined(credits)) {
                var length = credits.length;
                for (var i = 0; i < length; i++) {
                    resourceCredits.push(credits[i]);
                }
            }
        }

        options = {
            describe: defaultValue(options.describe, defaultDescribeProperty),
            pointSize: defaultValue(options.pointSize, ShapefileDataSource.pointSize),
            pointColor: defaultValue(options.pointColor, ShapefileDataSource.pointColor),
            lineWidth: new ConstantProperty(
                defaultValue(options.lineWidth, ShapefileDataSource.lineWidth)
            ),
            outlineColor: new ColorMaterialProperty(
                defaultValue(options.outlineColor, ShapefileDataSource.outlineColor)
            ),
            lineColor: new ColorMaterialProperty(defaultValue(options.lineColor, ShapefileDataSource.lineColor)),
            outlineWidth: defaultValue(options.outlineWidth, ShapefileDataSource.outlineWidth),
            fill: new ColorMaterialProperty(
                defaultValue(options.fill, ShapefileDataSource.fill)
            ),
            outline: defaultValue(options.outline, ShapefileDataSource.outline),
            clampToGround: defaultValue(options.clampToGround, ShapefileDataSource.clampToGround),
            extrudedHeight: options.extrudedHeight
        };


        return Cesium.when(promise, function (geoJson) {
            return load(that, geoJson, options, sourceUri);
        }).otherwise(function (error) {
            Cesium.DataSource.setLoading(that, false);
            that._error.raiseEvent(that, error);
            console.log(error);
            return Cesium.when.reject(error);
        });
    }


}
/**
 * 加载Shapefile数据
 * @param {String} data shapefile文件路径
 * @param {GeoJsonDataSource.LoadOptions} options 样式配置参数
 * @returns {Promise<ShapefileDataSource>}
 */
ShapefileDataSource.load = function (data, options) {
    return new ShapefileDataSource().load(data, options)
}
/**
 * @typedef {Object} ShapefileDataSource.LoadOptions
 *
 * 加载GeoJson数据源时的配置项
 *
 * @property {Cesium.Color} [pointColor] 点的颜色，如果没有设置将使用ShapefileDataSource.pointColor
 * @property {Number} [pointSize] 点的大小，如果没有设置将使用ShapefileDataSource.pointSize
 * @property {Cesium.Color} [outlineColor] 多边形边框颜色，如果没有设置将使用ShapefileDataSource.outlineColor
 * @property {Number} [outlineWidth] 多边形边框宽度，如果没有设置将使用ShapefileDataSource.outlineWidth
 * @property {Boolean} [outline] 是否显示多边形边框，如果没有设置将使用ShapefileDataSource.outline
 * @property {Cesium.Color} [fill] 多边形填充颜色，如果没有设置将使用ShapefileDataSource.fill
 * @property {Cesium.Color} [lineColor] 线要素的颜色，如果没有设置将使用ShapefileDataSource.lineColor
 * @property {Cesium.Color} [lineWidth] 线要素的宽度，如果没有设置将使用ShapefileDataSource.lineWidth
 * @property {Boolean} [clampToGround] 是否贴地，如果未定义则使用ShapefileDataSource.clampToGround
 * @property {String|Number} [extrudedHeight] 拉伸高度，仅对多边形要素有效
 * @property {String|Cesium.Credit} [credit] 信用信息
 */
export default ShapefileDataSource;

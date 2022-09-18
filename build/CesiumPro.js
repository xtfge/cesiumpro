/**
 * CesiumPro
 * @version {{version}}
 * @datetime {{datetime}}
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.CesiumPro = {}));
})(this, (function (exports) { 'use strict';

    class CesiumProError$1 extends Error {
        /**
         * 定义CesiumPro抛出的错误
         * @extends Error
         * @param {String} message 描述错误消息的内容
         * @example
         * function flyTo(viewer,entity){
         *    if(!viewer){
         *      throw(new CesiumPro.CesiumProError("viewer未定义"))
         *    }
         *    viewer.flyTo(entity)
         * }
         *
         */
        constructor(message) {
            super(message);
            this.name = 'CesiumProError';
        }
    }
    CesiumProError$1.throwInstantiationError = function () {
        throw new DeveloperError(
            "This function defines an interface and should not be called directly."
        );
    };
    CesiumProError$1.throwNoInstance = function () {
        throw new CesiumProError$1('它的定义了一个接口，不能被以直接调用.')
    };

    /* eslint-disable prefer-rest-params */

    function compareNumber(a, b) {
      return b - a;
    }
    class Event$7 {
      /**
       * 事件管理器
       * @example
       * const addMarkerEvent=new Event();
       * function saveMark(marker){
       *  console.log("添加了一个marker",marker.id)
       * }
       * addMarkerEvent.on(saveMark)
       * const mark=viewer.entities.add({
       *  id:"mark1",
       *  billboard:{
       *    image:"./icon/pin.png"
       *  }
       * })
       * addMarkerEvent.emit(mark)
       */
      constructor() {
        this._listeners = [];
        this._scopes = [];
        this._toRemove = [];
        this._insideRaiseEvent = false;
      }

      /**
       * 当前订阅事件的侦听器个数
       * @type {Number}
       */
      get numberOfListeners() {
        return this._listeners.length - this._toRemove.length;
      }

      /**
       * 注册事件触发时执行的回调函数
       * @param {Function} listener 事件触发时执行的回调函数
       * @param {Object} [scope] 侦听器函数中this的指针
       * @return {Function} 用于取消侦听器监测的函数
       *
       * @see Event#removeEventListener
       * @see Event#raise
       */

      addEventListener(listener, scope) {
        if (typeof listener !== 'function') {
          throw new CesiumProError$1('侦听器应该是一个函数');
        }

        this._listeners.push(listener);
        this._scopes.push(scope);

        const event = this;
        return function () {
          event.removeEventListener(listener, scope);
        };
      }

      /**
       * 注销事件触发时的回调函数
       * @param {Function} listener 将要被注销的函数
       * @param {Object} [scope] 侦听器函数中this的指针
       * @return {Boolean} 如果为真，事件被成功注销，否则，事件注销失败
       *
       * @see Event#addEventListener
       * @see Event#raise
       */
      removeEventListener(listener, scope) {
        if (typeof listener !== 'function') {
          throw new CesiumProError$1('侦听器应该是一个函数');
        }
        const listeners = this._listeners;
        const scopes = this._scopes;

        let index = -1;
        for (let i = 0; i < listeners.length; i++) {
          if (listeners[i] === listener && scopes[i] === scope) {
            index = i;
            break;
          }
        }

        if (index !== -1) {
          if (this._insideRaiseEvent) {
            // In order to allow removing an event subscription from within
            // a callback, we don't actually remove the items here.  Instead
            // remember the index they are at and undefined their value.
            this._toRemove.push(index);
            listeners[index] = undefined;
            scopes[index] = undefined;
          } else {
            listeners.splice(index, 1);
            scopes.splice(index, 1);
          }
          return true;
        }

        return false;
      }

      /**
       * 触发事件
       * @param {*} arguments 此方法接受任意数据的参数并传递给侦听器函数
       *
       * @see Event#addEventListener
       * @see Event#removeEventListener
       */
      raise() {
        this._insideRaiseEvent = true;

        let i;
        const listeners = this._listeners;
        const scopes = this._scopes;
        let {
          length,
        } = listeners;

        for (i = 0; i < length; i++) {
          const listener = listeners[i];
          if (Cesium.defined(listener)) {
            listeners[i].apply(scopes[i], arguments);
          }
        }

        // Actually remove items removed in removeEventListener.
        const toRemove = this._toRemove;
        length = toRemove.length;
        // 降序排列，从后往前删
        if (length > 0) {
          toRemove.sort(compareNumber);
          for (i = 0; i < length; i++) {
            const index = toRemove[i];
            listeners.splice(index, 1);
            scopes.splice(index, 1);
          }
          toRemove.length = 0;
        }

        this._insideRaiseEvent = false;
      }
    }

    const {
        RequestState: RequestState$1,
        when: when$7,
        AttributeCompression,
        BoundingSphere: BoundingSphere$3,
        Cartesian3: Cartesian3$a,
        Credit: Credit$1,
        defaultValue: defaultValue$7,
        defined: defined$9,
        DeveloperError: DeveloperError$3,
        GeographicTilingScheme: GeographicTilingScheme$3,
        WebMercatorTilingScheme,
        getJsonFromTypedArray,
        HeightmapTerrainData,
        IndexDatatype,
        OrientedBoundingBox,
        QuantizedMeshTerrainData,
        Request: Request$1,
        RequestType: RequestType$1,
        Resource: Resource$5,
        RuntimeError: RuntimeError$1,
        TerrainProvider: TerrainProvider$1,
        TileAvailability,
        TileProviderError
    } = Cesium;
    function LayerInformation(layer) {
        this.resource = layer.resource;
        this.version = layer.version;
        this.isHeightmap = layer.isHeightmap;
        this.tileUrlTemplates = layer.tileUrlTemplates;
        this.availability = layer.availability;
        this.hasVertexNormals = layer.hasVertexNormals;
        this.hasWaterMask = layer.hasWaterMask;
        this.hasMetadata = layer.hasMetadata;
        this.availabilityLevels = layer.availabilityLevels;
        this.availabilityTilesLoaded = layer.availabilityTilesLoaded;
        this.littleEndianExtensionSize = layer.littleEndianExtensionSize;
        this.availabilityPromiseCache = {};
    }

    /**
     * A {@link TerrainProvider} that accesses terrain data in a Cesium terrain format.
     *
     * @alias CesiumProTerrainProvider
     * @constructor
     *
     * @param {Object} options Object with the following properties:
     * @param {Resource|String|Promise<Resource>|Promise<String>} options.url The URL of the Cesium terrain server.
     * @param {Boolean} [options.requestVertexNormals=false] Flag that indicates if the client should request additional lighting information from the server, in the form of per vertex normals if available.
     * @param {Boolean} [options.requestWaterMask=false] Flag that indicates if the client should request per tile water masks from the server,  if available.
     * @param {Boolean} [options.requestMetadata=true] Flag that indicates if the client should request per tile metadata from the server, if available.
     * @param {Ellipsoid} [options.ellipsoid] The ellipsoid.  If not specified, the WGS84 ellipsoid is used.
     * @param {Credit|String} [options.credit] A credit for the data source, which is displayed on the canvas.
     *
     *
     * @example
     * // Create Arctic DEM terrain with normals.
     * var viewer = new Cesium.Viewer('cesiumContainer', {
     *     terrainProvider : new Cesium.CesiumProTerrainProvider({
     *         url : Cesium.IonResource.fromAssetId(3956),
     *         requestVertexNormals : true
     *     })
     * });
     *
     * @see createWorldTerrain
     * @see TerrainProvider
     * @private
     */
    function CesiumProTerrainProvider(options) {
        //>>includeStart('debug', pragmas.debug)
        if (!defined$9(options) || !defined$9(options.url)) {
            throw new DeveloperError$3("options.url is required.");
        }
        //>>includeEnd('debug');

        this._heightmapWidth = 65;
        this._heightmapStructure = undefined;
        this._hasWaterMask = false;
        this._hasVertexNormals = false;
        this._ellipsoid = options.ellipsoid;

        /**
         * Boolean flag that indicates if the client should request vertex normals from the server.
         * @type {Boolean}
         * @default false
         * @private
         */
        this._requestVertexNormals = defaultValue$7(
            options.requestVertexNormals,
            false
        );

        /**
         * Boolean flag that indicates if the client should request tile watermasks from the server.
         * @type {Boolean}
         * @default false
         * @private
         */
        this._requestWaterMask = defaultValue$7(options.requestWaterMask, false);

        /**
         * Boolean flag that indicates if the client should request tile metadata from the server.
         * @type {Boolean}
         * @default true
         * @private
         */
        this._requestMetadata = defaultValue$7(options.requestMetadata, true);

        this._errorEvent = new Event$7();

        var credit = options.credit;
        if (typeof credit === "string") {
            credit = new Credit$1(credit);
        }
        this._credit = credit;

        this._availability = undefined;

        var deferred = when$7.defer();
        this._ready = false;
        this._readyPromise = deferred;
        this._tileCredits = undefined;

        var that = this;
        var lastResource;
        var layerJsonResource;
        var metadataError;

        var layers = (this._layers = []);
        var attribution = "";
        var overallAvailability = [];
        var overallMaxZoom = 0;
        when$7(options.url)
            .then(function (url) {
                var resource = Resource$5.createIfNeeded(url);
                resource.appendForwardSlash();
                lastResource = resource;
                layerJsonResource = lastResource.getDerivedResource({
                    url: "layer.json",
                });

                // ion resources have a credits property we can use for additional attribution.
                that._tileCredits = resource.credits;

                requestLayerJson();
            })
            .otherwise(function (e) {
                deferred.reject(e);
            });

        function parseMetadataSuccess(data) {
            var message;

            if (!data.format) {
                message = "The tile format is not specified in the layer.json file.";
                metadataError = TileProviderError.handleError(
                    metadataError,
                    that,
                    that._errorEvent,
                    message,
                    undefined,
                    undefined,
                    undefined,
                    requestLayerJson
                );
                return;
            }

            if (!data.tiles || data.tiles.length === 0) {
                message = "The layer.json file does not specify any tile URL templates.";
                metadataError = TileProviderError.handleError(
                    metadataError,
                    that,
                    that._errorEvent,
                    message,
                    undefined,
                    undefined,
                    undefined,
                    requestLayerJson
                );
                return;
            }

            var hasVertexNormals = false;
            var hasWaterMask = false;
            var hasMetadata = false;
            var littleEndianExtensionSize = true;
            var isHeightmap = false;
            if (data.format === "heightmap-1.0") {
                isHeightmap = true;
                if (!defined$9(that._heightmapStructure)) {
                    that._heightmapStructure = {
                        heightScale: 1.0 / 5.0,
                        heightOffset: -1000.0,
                        elementsPerHeight: 1,
                        stride: 1,
                        elementMultiplier: 256.0,
                        isBigEndian: false,
                        lowestEncodedHeight: 0,
                        highestEncodedHeight: 256 * 256 - 1,
                    };
                }
                hasWaterMask = true;
                that._requestWaterMask = true;
            } else if (data.format.indexOf("quantized-mesh-1.") !== 0) {
                message =
                    'The tile format "' + data.format + '" is invalid or not supported.';
                metadataError = TileProviderError.handleError(
                    metadataError,
                    that,
                    that._errorEvent,
                    message,
                    undefined,
                    undefined,
                    undefined,
                    requestLayerJson
                );
                return;
            }

            var tileUrlTemplates = data.tiles;

            var maxZoom = data.maxzoom;
            overallMaxZoom = Math.max(overallMaxZoom, maxZoom);
            // Keeps track of which of the availablity containing tiles have been loaded

            if (!data.projection || data.projection === "EPSG:4326") {
                that._tilingScheme = new GeographicTilingScheme$3({
                    numberOfLevelZeroTilesX: 2,
                    numberOfLevelZeroTilesY: 1,
                    ellipsoid: that._ellipsoid,
                });
            } else if (data.projection === "EPSG:3857") {
                that._tilingScheme = new WebMercatorTilingScheme({
                    numberOfLevelZeroTilesX: 1,
                    numberOfLevelZeroTilesY: 1,
                    ellipsoid: that._ellipsoid,
                });
            } else {
                message =
                    'The projection "' + data.projection + '" is invalid or not supported.';
                metadataError = TileProviderError.handleError(
                    metadataError,
                    that,
                    that._errorEvent,
                    message,
                    undefined,
                    undefined,
                    undefined,
                    requestLayerJson
                );
                return;
            }

            that._levelZeroMaximumGeometricError = TerrainProvider$1.getEstimatedLevelZeroGeometricErrorForAHeightmap(
                that._tilingScheme.ellipsoid,
                that._heightmapWidth,
                that._tilingScheme.getNumberOfXTilesAtLevel(0)
            );
            if (!data.scheme || data.scheme === "tms" || data.scheme === "slippyMap") {
                that._scheme = data.scheme;
            } else {
                message = 'The scheme "' + data.scheme + '" is invalid or not supported.';
                metadataError = TileProviderError.handleError(
                    metadataError,
                    that,
                    that._errorEvent,
                    message,
                    undefined,
                    undefined,
                    undefined,
                    requestLayerJson
                );
                return;
            }

            var availabilityTilesLoaded;

            // The vertex normals defined in the 'octvertexnormals' extension is identical to the original
            // contents of the original 'vertexnormals' extension.  'vertexnormals' extension is now
            // deprecated, as the extensionLength for this extension was incorrectly using big endian.
            // We maintain backwards compatibility with the legacy 'vertexnormal' implementation
            // by setting the _littleEndianExtensionSize to false. Always prefer 'octvertexnormals'
            // over 'vertexnormals' if both extensions are supported by the server.
            if (
                defined$9(data.extensions) &&
                data.extensions.indexOf("octvertexnormals") !== -1
            ) {
                hasVertexNormals = true;
            } else if (
                defined$9(data.extensions) &&
                data.extensions.indexOf("vertexnormals") !== -1
            ) {
                hasVertexNormals = true;
                littleEndianExtensionSize = false;
            }
            if (
                defined$9(data.extensions) &&
                data.extensions.indexOf("watermask") !== -1
            ) {
                hasWaterMask = true;
            }
            if (
                defined$9(data.extensions) &&
                data.extensions.indexOf("metadata") !== -1
            ) {
                hasMetadata = true;
            }

            var availabilityLevels = data.metadataAvailability;
            var availableTiles = data.available;
            var availability;
            if (defined$9(availableTiles) && !defined$9(availabilityLevels)) {
                availability = new TileAvailability(
                    that._tilingScheme,
                    availableTiles.length
                );
                for (var level = 0; level < availableTiles.length; ++level) {
                    var rangesAtLevel = availableTiles[level];
                    var yTiles = that._tilingScheme.getNumberOfYTilesAtLevel(level);
                    if (!defined$9(overallAvailability[level])) {
                        overallAvailability[level] = [];
                    }

                    for (
                        var rangeIndex = 0;
                        rangeIndex < rangesAtLevel.length;
                        ++rangeIndex
                    ) {
                        var range = rangesAtLevel[rangeIndex];
                        var yStart = yTiles - range.endY - 1;
                        var yEnd = yTiles - range.startY - 1;
                        overallAvailability[level].push([
                            range.startX,
                            yStart,
                            range.endX,
                            yEnd,
                        ]);
                        availability.addAvailableTileRange(
                            level,
                            range.startX,
                            yStart,
                            range.endX,
                            yEnd
                        );
                    }
                }
            } else if (defined$9(availabilityLevels)) {
                availabilityTilesLoaded = new TileAvailability(
                    that._tilingScheme,
                    maxZoom
                );
                availability = new TileAvailability(that._tilingScheme, maxZoom);
                overallAvailability[0] = [[0, 0, 1, 0]];
                availability.addAvailableTileRange(0, 0, 0, 1, 0);
            }

            that._hasWaterMask = that._hasWaterMask || hasWaterMask;
            that._hasVertexNormals = that._hasVertexNormals || hasVertexNormals;
            that._hasMetadata = that._hasMetadata || hasMetadata;
            if (defined$9(data.attribution)) {
                if (attribution.length > 0) {
                    attribution += " ";
                }
                attribution += data.attribution;
            }

            layers.push(
                new LayerInformation({
                    resource: lastResource,
                    version: data.version,
                    isHeightmap: isHeightmap,
                    tileUrlTemplates: tileUrlTemplates,
                    availability: availability,
                    hasVertexNormals: hasVertexNormals,
                    hasWaterMask: hasWaterMask,
                    hasMetadata: hasMetadata,
                    availabilityLevels: availabilityLevels,
                    availabilityTilesLoaded: availabilityTilesLoaded,
                    littleEndianExtensionSize: littleEndianExtensionSize,
                })
            );

            var parentUrl = data.parentUrl;
            if (defined$9(parentUrl)) {
                if (!defined$9(availability)) {
                    console.log(
                        "A layer.json can't have a parentUrl if it does't have an available array."
                    );
                    return when$7.resolve();
                }
                lastResource = lastResource.getDerivedResource({
                    url: parentUrl,
                });
                lastResource.appendForwardSlash(); // Terrain always expects a directory
                layerJsonResource = lastResource.getDerivedResource({
                    url: "layer.json",
                });
                var parentMetadata = layerJsonResource.fetchJson();
                return when$7(parentMetadata, parseMetadataSuccess, parseMetadataFailure);
            }

            return when$7.resolve();
        }

        function parseMetadataFailure(data) {
            var message =
                "An error occurred while accessing " + layerJsonResource.url + ".";
            metadataError = TileProviderError.handleError(
                metadataError,
                that,
                that._errorEvent,
                message,
                undefined,
                undefined,
                undefined,
                requestLayerJson
            );
        }

        function metadataSuccess(data) {
            parseMetadataSuccess(data).then(function () {
                if (defined$9(metadataError)) {
                    return;
                }

                var length = overallAvailability.length;
                if (length > 0) {
                    var availability = (that._availability = new TileAvailability(
                        that._tilingScheme,
                        overallMaxZoom
                    ));
                    for (var level = 0; level < length; ++level) {
                        var levelRanges = overallAvailability[level];
                        for (var i = 0; i < levelRanges.length; ++i) {
                            var range = levelRanges[i];
                            availability.addAvailableTileRange(
                                level,
                                range[0],
                                range[1],
                                range[2],
                                range[3]
                            );
                        }
                    }
                }

                if (attribution.length > 0) {
                    var layerJsonCredit = new Credit$1(attribution);

                    if (defined$9(that._tileCredits)) {
                        that._tileCredits.push(layerJsonCredit);
                    } else {
                        that._tileCredits = [layerJsonCredit];
                    }
                }

                that._ready = true;
                that._readyPromise.resolve(true);
            });
        }

        function metadataFailure(data) {
            // If the metadata is not found, assume this is a pre-metadata heightmap tileset.
            if (defined$9(data) && data.statusCode === 404) {
                metadataSuccess({
                    tilejson: "2.1.0",
                    format: "heightmap-1.0",
                    version: "1.0.0",
                    scheme: "tms",
                    tiles: ["{z}/{x}/{y}.terrain?v={version}"],
                });
                return;
            }
            parseMetadataFailure();
        }

        function requestLayerJson() {
            when$7(layerJsonResource.fetchJson())
                .then(metadataSuccess)
                .otherwise(metadataFailure);
        }
    }

    /**
     * When using the Quantized-Mesh format, a tile may be returned that includes additional extensions, such as PerVertexNormals, watermask, etc.
     * This enumeration defines the unique identifiers for each type of extension data that has been appended to the standard mesh data.
     *
     * @namespace QuantizedMeshExtensionIds
     * @see CesiumProTerrainProvider
     * @private
     */
    var QuantizedMeshExtensionIds = {
        /**
         * Oct-Encoded Per-Vertex Normals are included as an extension to the tile mesh
         *
         * @type {Number}
         * @constant
         * @default 1
         */
        OCT_VERTEX_NORMALS: 1,
        /**
         * A watermask is included as an extension to the tile mesh
         *
         * @type {Number}
         * @constant
         * @default 2
         */
        WATER_MASK: 2,
        /**
         * A json object contain metadata about the tile
         *
         * @type {Number}
         * @constant
         * @default 4
         */
        METADATA: 4,
    };

    function getRequestHeader(extensionsList) {
        if (!defined$9(extensionsList) || extensionsList.length === 0) {
            return {
                Accept:
                    "application/vnd.quantized-mesh,application/octet-stream;q=0.9,*/*;q=0.01",
            };
        }
        var extensions = extensionsList.join("-");
        return {
            Accept:
                "application/vnd.quantized-mesh;extensions=" +
                extensions +
                ",application/octet-stream;q=0.9,*/*;q=0.01",
        };
    }

    function createHeightmapTerrainData(provider, buffer, level, x, y) {
        var heightBuffer = new Uint16Array(
            buffer,
            0,
            provider._heightmapWidth * provider._heightmapWidth
        );
        return new HeightmapTerrainData({
            buffer: heightBuffer,
            childTileMask: new Uint8Array(buffer, heightBuffer.byteLength, 1)[0],
            waterMask: new Uint8Array(
                buffer,
                heightBuffer.byteLength + 1,
                buffer.byteLength - heightBuffer.byteLength - 1
            ),
            width: provider._heightmapWidth,
            height: provider._heightmapWidth,
            structure: provider._heightmapStructure,
            credits: provider._tileCredits,
        });
    }

    function createQuantizedMeshTerrainData(provider, buffer, level, x, y, layer) {
        var littleEndianExtensionSize = layer.littleEndianExtensionSize;
        var pos = 0;
        var cartesian3Elements = 3;
        var boundingSphereElements = cartesian3Elements + 1;
        var cartesian3Length = Float64Array.BYTES_PER_ELEMENT * cartesian3Elements;
        var boundingSphereLength =
            Float64Array.BYTES_PER_ELEMENT * boundingSphereElements;
        var encodedVertexElements = 3;
        var encodedVertexLength =
            Uint16Array.BYTES_PER_ELEMENT * encodedVertexElements;
        var triangleElements = 3;
        var bytesPerIndex = Uint16Array.BYTES_PER_ELEMENT;
        var triangleLength = bytesPerIndex * triangleElements;

        var view = new DataView(buffer);
        var center = new Cartesian3$a(
            view.getFloat64(pos, true),
            view.getFloat64(pos + 8, true),
            view.getFloat64(pos + 16, true)
        );
        pos += cartesian3Length;

        var minimumHeight = view.getFloat32(pos, true);
        pos += Float32Array.BYTES_PER_ELEMENT;
        var maximumHeight = view.getFloat32(pos, true);
        pos += Float32Array.BYTES_PER_ELEMENT;

        var boundingSphere = new BoundingSphere$3(
            new Cartesian3$a(
                view.getFloat64(pos, true),
                view.getFloat64(pos + 8, true),
                view.getFloat64(pos + 16, true)
            ),
            view.getFloat64(pos + cartesian3Length, true)
        );
        pos += boundingSphereLength;

        var horizonOcclusionPoint = new Cartesian3$a(
            view.getFloat64(pos, true),
            view.getFloat64(pos + 8, true),
            view.getFloat64(pos + 16, true)
        );
        pos += cartesian3Length;

        var vertexCount = view.getUint32(pos, true);
        pos += Uint32Array.BYTES_PER_ELEMENT;
        var encodedVertexBuffer = new Uint16Array(buffer, pos, vertexCount * 3);
        pos += vertexCount * encodedVertexLength;

        if (vertexCount > 64 * 1024) {
            // More than 64k vertices, so indices are 32-bit.
            bytesPerIndex = Uint32Array.BYTES_PER_ELEMENT;
            triangleLength = bytesPerIndex * triangleElements;
        }

        // Decode the vertex buffer.
        var uBuffer = encodedVertexBuffer.subarray(0, vertexCount);
        var vBuffer = encodedVertexBuffer.subarray(vertexCount, 2 * vertexCount);
        var heightBuffer = encodedVertexBuffer.subarray(
            vertexCount * 2,
            3 * vertexCount
        );

        AttributeCompression.zigZagDeltaDecode(uBuffer, vBuffer, heightBuffer);

        // skip over any additional padding that was added for 2/4 byte alignment
        if (pos % bytesPerIndex !== 0) {
            pos += bytesPerIndex - (pos % bytesPerIndex);
        }

        var triangleCount = view.getUint32(pos, true);
        pos += Uint32Array.BYTES_PER_ELEMENT;
        var indices = IndexDatatype.createTypedArrayFromArrayBuffer(
            vertexCount,
            buffer,
            pos,
            triangleCount * triangleElements
        );
        pos += triangleCount * triangleLength;

        // High water mark decoding based on decompressIndices_ in webgl-loader's loader.js.
        // https://code.google.com/p/webgl-loader/source/browse/trunk/samples/loader.js?r=99#55
        // Copyright 2012 Google Inc., Apache 2.0 license.
        var highest = 0;
        var length = indices.length;
        for (var i = 0; i < length; ++i) {
            var code = indices[i];
            indices[i] = highest - code;
            if (code === 0) {
                ++highest;
            }
        }

        var westVertexCount = view.getUint32(pos, true);
        pos += Uint32Array.BYTES_PER_ELEMENT;
        var westIndices = IndexDatatype.createTypedArrayFromArrayBuffer(
            vertexCount,
            buffer,
            pos,
            westVertexCount
        );
        pos += westVertexCount * bytesPerIndex;

        var southVertexCount = view.getUint32(pos, true);
        pos += Uint32Array.BYTES_PER_ELEMENT;
        var southIndices = IndexDatatype.createTypedArrayFromArrayBuffer(
            vertexCount,
            buffer,
            pos,
            southVertexCount
        );
        pos += southVertexCount * bytesPerIndex;

        var eastVertexCount = view.getUint32(pos, true);
        pos += Uint32Array.BYTES_PER_ELEMENT;
        var eastIndices = IndexDatatype.createTypedArrayFromArrayBuffer(
            vertexCount,
            buffer,
            pos,
            eastVertexCount
        );
        pos += eastVertexCount * bytesPerIndex;

        var northVertexCount = view.getUint32(pos, true);
        pos += Uint32Array.BYTES_PER_ELEMENT;
        var northIndices = IndexDatatype.createTypedArrayFromArrayBuffer(
            vertexCount,
            buffer,
            pos,
            northVertexCount
        );
        pos += northVertexCount * bytesPerIndex;

        var encodedNormalBuffer;
        var waterMaskBuffer;
        while (pos < view.byteLength) {
            var extensionId = view.getUint8(pos, true);
            pos += Uint8Array.BYTES_PER_ELEMENT;
            var extensionLength = view.getUint32(pos, littleEndianExtensionSize);
            pos += Uint32Array.BYTES_PER_ELEMENT;

            if (
                extensionId === QuantizedMeshExtensionIds.OCT_VERTEX_NORMALS &&
                provider._requestVertexNormals
            ) {
                encodedNormalBuffer = new Uint8Array(buffer, pos, vertexCount * 2);
            } else if (
                extensionId === QuantizedMeshExtensionIds.WATER_MASK &&
                provider._requestWaterMask
            ) {
                waterMaskBuffer = new Uint8Array(buffer, pos, extensionLength);
            } else if (
                extensionId === QuantizedMeshExtensionIds.METADATA &&
                provider._requestMetadata
            ) {
                var stringLength = view.getUint32(pos, true);
                if (stringLength > 0) {
                    var metadata = getJsonFromTypedArray(
                        new Uint8Array(buffer),
                        pos + Uint32Array.BYTES_PER_ELEMENT,
                        stringLength
                    );
                    var availableTiles = metadata.available;
                    if (defined$9(availableTiles)) {
                        for (var offset = 0; offset < availableTiles.length; ++offset) {
                            var availableLevel = level + offset + 1;
                            var rangesAtLevel = availableTiles[offset];
                            var yTiles = provider._tilingScheme.getNumberOfYTilesAtLevel(
                                availableLevel
                            );

                            for (
                                var rangeIndex = 0;
                                rangeIndex < rangesAtLevel.length;
                                ++rangeIndex
                            ) {
                                var range = rangesAtLevel[rangeIndex];
                                var yStart = yTiles - range.endY - 1;
                                var yEnd = yTiles - range.startY - 1;
                                provider.availability.addAvailableTileRange(
                                    availableLevel,
                                    range.startX,
                                    yStart,
                                    range.endX,
                                    yEnd
                                );
                                layer.availability.addAvailableTileRange(
                                    availableLevel,
                                    range.startX,
                                    yStart,
                                    range.endX,
                                    yEnd
                                );
                            }
                        }
                    }
                }
                layer.availabilityTilesLoaded.addAvailableTileRange(level, x, y, x, y);
            }
            pos += extensionLength;
        }

        var skirtHeight = provider.getLevelMaximumGeometricError(level) * 5.0;

        // The skirt is not included in the OBB computation. If this ever
        // causes any rendering artifacts (cracks), they are expected to be
        // minor and in the corners of the screen. It's possible that this
        // might need to be changed - just change to `minimumHeight - skirtHeight`
        // A similar change might also be needed in `upsampleQuantizedTerrainMesh.js`.
        var rectangle = provider._tilingScheme.tileXYToRectangle(x, y, level);
        var orientedBoundingBox = OrientedBoundingBox.fromRectangle(
            rectangle,
            minimumHeight,
            maximumHeight,
            provider._tilingScheme.ellipsoid
        );

        return new QuantizedMeshTerrainData({
            center: center,
            minimumHeight: minimumHeight,
            maximumHeight: maximumHeight,
            boundingSphere: boundingSphere,
            orientedBoundingBox: orientedBoundingBox,
            horizonOcclusionPoint: horizonOcclusionPoint,
            quantizedVertices: encodedVertexBuffer,
            encodedNormals: encodedNormalBuffer,
            indices: indices,
            westIndices: westIndices,
            southIndices: southIndices,
            eastIndices: eastIndices,
            northIndices: northIndices,
            westSkirtHeight: skirtHeight,
            southSkirtHeight: skirtHeight,
            eastSkirtHeight: skirtHeight,
            northSkirtHeight: skirtHeight,
            childTileMask: provider.availability.computeChildMaskForTile(level, x, y),
            waterMask: waterMaskBuffer,
            credits: provider._tileCredits,
        });
    }

    /**
     * Requests the geometry for a given tile.  This function should not be called before
     * {@link CesiumProTerrainProvider#ready} returns true.  The result must include terrain data and
     * may optionally include a water mask and an indication of which child tiles are available.
     *
     * @param {Number} x The X coordinate of the tile for which to request geometry.
     * @param {Number} y The Y coordinate of the tile for which to request geometry.
     * @param {Number} level The level of the tile for which to request geometry.
     * @param {Request} [request] The request object. Intended for internal use only.
     *
     * @returns {Promise.<TerrainData>|undefined} A promise for the requested geometry.  If this method
     *          returns undefined instead of a promise, it is an indication that too many requests are already
     *          pending and the request will be retried later.
     *
     * @exception {DeveloperError} This function must not be called before {@link CesiumProTerrainProvider#ready}
     *            returns true.
     */
    CesiumProTerrainProvider.prototype.requestTileGeometry = function (
        x,
        y,
        level,
        request
    ) {
        //>>includeStart('debug', pragmas.debug)
        if (!this._ready) {
            throw new DeveloperError$3(
                "requestTileGeometry must not be called before the terrain provider is ready."
            );
        }
        //>>includeEnd('debug');

        var layers = this._layers;
        var layerToUse;
        var layerCount = layers.length;

        if (layerCount === 1) {
            // Optimized path for single layers
            layerToUse = layers[0];
        } else {
            for (var i = 0; i < layerCount; ++i) {
                var layer = layers[i];
                if (
                    !defined$9(layer.availability) ||
                    layer.availability.isTileAvailable(level, x, y)
                ) {
                    layerToUse = layer;
                    break;
                }
            }
        }
        return requestTileGeometry(this, x, y, level, layerToUse, request);
    };

    function requestTileGeometry(provider, x, y, level, layerToUse, request) {
        if (!defined$9(layerToUse)) {
            return when$7.reject(new RuntimeError$1("Terrain tile doesn't exist"));
        }

        var urlTemplates = layerToUse.tileUrlTemplates;
        if (urlTemplates.length === 0) {
            return undefined;
        }

        // The TileMapService scheme counts from the bottom left
        var terrainY;
        if (!provider._scheme || provider._scheme === "tms") {
            var yTiles = provider._tilingScheme.getNumberOfYTilesAtLevel(level);
            terrainY = yTiles - y - 1;
        } else {
            terrainY = y;
        }

        var extensionList = [];
        if (provider._requestVertexNormals && layerToUse.hasVertexNormals) {
            extensionList.push(
                layerToUse.littleEndianExtensionSize
                    ? "octvertexnormals"
                    : "vertexnormals"
            );
        }
        if (provider._requestWaterMask && layerToUse.hasWaterMask) {
            extensionList.push("watermask");
        }
        if (provider._requestMetadata && layerToUse.hasMetadata) {
            extensionList.push("metadata");
        }

        var headers;
        var query;
        var url = urlTemplates[(x + terrainY + level) % urlTemplates.length];

        var resource = layerToUse.resource;
        if (
            defined$9(resource._ionEndpoint) &&
            !defined$9(resource._ionEndpoint.externalType)
        ) {
            // ion uses query paremeters to request extensions
            if (extensionList.length !== 0) {
                query = { extensions: extensionList.join("-") };
            }
            headers = getRequestHeader(undefined);
        } else {
            //All other terrain servers
            headers = getRequestHeader(extensionList);
        }

        var source = resource
            .getDerivedResource({
                url: url,
                templateValues: {
                    version: layerToUse.version,
                    z: level,
                    x: x,
                    y: terrainY,
                },
                queryParameters: query,
                headers: headers,
                request: request,
            });

        if (source.request.state === RequestState$1.ISSUED ||
            source.request.state === RequestState$1.ACTIVE) {
            return;
        }
        var promise = source.fetchArrayBuffer();

        if (!defined$9(promise)) {
            return undefined;
        }

        return promise.then(function (buffer) {
            if (defined$9(provider._heightmapStructure)) {
                return createHeightmapTerrainData(provider, buffer);
            }
            return createQuantizedMeshTerrainData(
                provider,
                buffer,
                level,
                x,
                y,
                layerToUse
            );
        });
    }

    Object.defineProperties(CesiumProTerrainProvider.prototype, {
        /**
         * Gets an event that is raised when the terrain provider encounters an asynchronous error.  By subscribing
         * to the event, you will be notified of the error and can potentially recover from it.  Event listeners
         * are passed an instance of {@link TileProviderError}.
         * @memberof CesiumProTerrainProvider.prototype
         * @type {Event}
         * @readonly
         */
        errorEvent: {
            get: function () {
                return this._errorEvent;
            },
        },

        /**
         * Gets the credit to display when this terrain provider is active.  Typically this is used to credit
         * the source of the terrain.  This function should not be called before {@link CesiumProTerrainProvider#ready} returns true.
         * @memberof CesiumProTerrainProvider.prototype
         * @type {Credit}
         * @readonly
         */
        credit: {
            get: function () {
                //>>includeStart('debug', pragmas.debug)
                if (!this._ready) {
                    throw new DeveloperError$3(
                        "credit must not be called before the terrain provider is ready."
                    );
                }
                //>>includeEnd('debug');

                return this._credit;
            },
        },

        /**
         * Gets the tiling scheme used by this provider.  This function should
         * not be called before {@link CesiumProTerrainProvider#ready} returns true.
         * @memberof CesiumProTerrainProvider.prototype
         * @type {GeographicTilingScheme}
         * @readonly
         */
        tilingScheme: {
            get: function () {
                //>>includeStart('debug', pragmas.debug)
                if (!this._ready) {
                    throw new DeveloperError$3(
                        "tilingScheme must not be called before the terrain provider is ready."
                    );
                }
                //>>includeEnd('debug');

                return this._tilingScheme;
            },
        },

        /**
         * Gets a value indicating whether or not the provider is ready for use.
         * @memberof CesiumProTerrainProvider.prototype
         * @type {Boolean}
         * @readonly
         */
        ready: {
            get: function () {
                return this._ready;
            },
        },

        /**
         * Gets a promise that resolves to true when the provider is ready for use.
         * @memberof CesiumProTerrainProvider.prototype
         * @type {Promise.<Boolean>}
         * @readonly
         */
        readyPromise: {
            get: function () {
                return this._readyPromise.promise;
            },
        },

        /**
         * Gets a value indicating whether or not the provider includes a water mask.  The water mask
         * indicates which areas of the globe are water rather than land, so they can be rendered
         * as a reflective surface with animated waves.  This function should not be
         * called before {@link CesiumProTerrainProvider#ready} returns true.
         * @memberof CesiumProTerrainProvider.prototype
         * @type {Boolean}
         * @readonly
         * @exception {DeveloperError} This property must not be called before {@link CesiumProTerrainProvider#ready}
         */
        hasWaterMask: {
            get: function () {
                //>>includeStart('debug', pragmas.debug)
                if (!this._ready) {
                    throw new DeveloperError$3(
                        "hasWaterMask must not be called before the terrain provider is ready."
                    );
                }
                //>>includeEnd('debug');

                return this._hasWaterMask && this._requestWaterMask;
            },
        },

        /**
         * Gets a value indicating whether or not the requested tiles include vertex normals.
         * This function should not be called before {@link CesiumProTerrainProvider#ready} returns true.
         * @memberof CesiumProTerrainProvider.prototype
         * @type {Boolean}
         * @readonly
         * @exception {DeveloperError} This property must not be called before {@link CesiumProTerrainProvider#ready}
         */
        hasVertexNormals: {
            get: function () {
                //>>includeStart('debug', pragmas.debug)
                if (!this._ready) {
                    throw new DeveloperError$3(
                        "hasVertexNormals must not be called before the terrain provider is ready."
                    );
                }
                //>>includeEnd('debug');

                // returns true if we can request vertex normals from the server
                return this._hasVertexNormals && this._requestVertexNormals;
            },
        },

        /**
         * Gets a value indicating whether or not the requested tiles include metadata.
         * This function should not be called before {@link CesiumProTerrainProvider#ready} returns true.
         * @memberof CesiumProTerrainProvider.prototype
         * @type {Boolean}
         * @readonly
         * @exception {DeveloperError} This property must not be called before {@link CesiumProTerrainProvider#ready}
         */
        hasMetadata: {
            get: function () {
                //>>includeStart('debug', pragmas.debug)
                if (!this._ready) {
                    throw new DeveloperError$3(
                        "hasMetadata must not be called before the terrain provider is ready."
                    );
                }
                //>>includeEnd('debug');

                // returns true if we can request metadata from the server
                return this._hasMetadata && this._requestMetadata;
            },
        },

        /**
         * Boolean flag that indicates if the client should request vertex normals from the server.
         * Vertex normals data is appended to the standard tile mesh data only if the client requests the vertex normals and
         * if the server provides vertex normals.
         * @memberof CesiumProTerrainProvider.prototype
         * @type {Boolean}
         * @readonly
         */
        requestVertexNormals: {
            get: function () {
                return this._requestVertexNormals;
            },
        },

        /**
         * Boolean flag that indicates if the client should request a watermask from the server.
         * Watermask data is appended to the standard tile mesh data only if the client requests the watermask and
         * if the server provides a watermask.
         * @memberof CesiumProTerrainProvider.prototype
         * @type {Boolean}
         * @readonly
         */
        requestWaterMask: {
            get: function () {
                return this._requestWaterMask;
            },
        },

        /**
         * Boolean flag that indicates if the client should request metadata from the server.
         * Metadata is appended to the standard tile mesh data only if the client requests the metadata and
         * if the server provides a metadata.
         * @memberof CesiumProTerrainProvider.prototype
         * @type {Boolean}
         * @readonly
         */
        requestMetadata: {
            get: function () {
                return this._requestMetadata;
            },
        },

        /**
         * Gets an object that can be used to determine availability of terrain from this provider, such as
         * at points and in rectangles.  This function should not be called before
         * {@link CesiumProTerrainProvider#ready} returns true.  This property may be undefined if availability
         * information is not available. Note that this reflects tiles that are known to be available currently.
         * Additional tiles may be discovered to be available in the future, e.g. if availability information
         * exists deeper in the tree rather than it all being discoverable at the root. However, a tile that
         * is available now will not become unavailable in the future.
         * @memberof CesiumProTerrainProvider.prototype
         * @type {TileAvailability}
         * @readonly
         */
        availability: {
            get: function () {
                //>>includeStart('debug', pragmas.debug)
                if (!this._ready) {
                    throw new DeveloperError$3(
                        "availability must not be called before the terrain provider is ready."
                    );
                }
                //>>includeEnd('debug');
                return this._availability;
            },
        },
    });

    /**
     * Gets the maximum geometric error allowed in a tile at a given level.
     *
     * @param {Number} level The tile level for which to get the maximum geometric error.
     * @returns {Number} The maximum geometric error.
     */
    CesiumProTerrainProvider.prototype.getLevelMaximumGeometricError = function (
        level
    ) {
        return this._levelZeroMaximumGeometricError / (1 << level);
    };

    /**
     * Determines whether data for a tile is available to be loaded.
     *
     * @param {Number} x The X coordinate of the tile for which to request geometry.
     * @param {Number} y The Y coordinate of the tile for which to request geometry.
     * @param {Number} level The level of the tile for which to request geometry.
     * @returns {Boolean|undefined} Undefined if not supported or availability is unknown, otherwise true or false.
     */
    CesiumProTerrainProvider.prototype.getTileDataAvailable = function (x, y, level) {
        if (!defined$9(this._availability)) {
            return undefined;
        }
        if (level > this._availability._maximumLevel) {
            return false;
        }

        if (this._availability.isTileAvailable(level, x, y)) {
            // If the tile is listed as available, then we are done
            return true;
        }
        if (!this._hasMetadata) {
            // If we don't have any layers with the metadata extension then we don't have this tile
            return false;
        }

        var layers = this._layers;
        var count = layers.length;
        for (var i = 0; i < count; ++i) {
            var layerResult = checkLayer(this, x, y, level, layers[i], i === 0);
            if (layerResult.result) {
                // There is a layer that may or may not have the tile
                return undefined;
            }
        }

        return false;
    };

    /**
     * Makes sure we load availability data for a tile
     *
     * @param {Number} x The X coordinate of the tile for which to request geometry.
     * @param {Number} y The Y coordinate of the tile for which to request geometry.
     * @param {Number} level The level of the tile for which to request geometry.
     * @returns {undefined|Promise<void>} Undefined if nothing need to be loaded or a Promise that resolves when all required tiles are loaded
     */
    CesiumProTerrainProvider.prototype.loadTileDataAvailability = function (
        x,
        y,
        level
    ) {
        if (
            !defined$9(this._availability) ||
            level > this._availability._maximumLevel ||
            this._availability.isTileAvailable(level, x, y) ||
            !this._hasMetadata
        ) {
            // We know the tile is either available or not available so nothing to wait on
            return undefined;
        }

        var layers = this._layers;
        var count = layers.length;
        for (var i = 0; i < count; ++i) {
            var layerResult = checkLayer(this, x, y, level, layers[i], i === 0);
            if (defined$9(layerResult.promise)) {
                return layerResult.promise;
            }
        }
    };

    function getAvailabilityTile(layer, x, y, level) {
        if (level === 0) {
            return;
        }

        var availabilityLevels = layer.availabilityLevels;
        var parentLevel =
            level % availabilityLevels === 0
                ? level - availabilityLevels
                : ((level / availabilityLevels) | 0) * availabilityLevels;
        var divisor = 1 << (level - parentLevel);
        var parentX = (x / divisor) | 0;
        var parentY = (y / divisor) | 0;

        return {
            level: parentLevel,
            x: parentX,
            y: parentY,
        };
    }

    function checkLayer(provider, x, y, level, layer, topLayer) {
        if (!defined$9(layer.availabilityLevels)) {
            // It's definitely not in this layer
            return {
                result: false,
            };
        }

        var cacheKey;
        var deleteFromCache = function () {
            delete layer.availabilityPromiseCache[cacheKey];
        };
        var availabilityTilesLoaded = layer.availabilityTilesLoaded;
        var availability = layer.availability;

        var tile = getAvailabilityTile(layer, x, y, level);
        while (defined$9(tile)) {
            if (
                availability.isTileAvailable(tile.level, tile.x, tile.y) &&
                !availabilityTilesLoaded.isTileAvailable(tile.level, tile.x, tile.y)
            ) {
                var requestPromise;
                if (!topLayer) {
                    cacheKey = tile.level + "-" + tile.x + "-" + tile.y;
                    requestPromise = layer.availabilityPromiseCache[cacheKey];
                    if (!defined$9(requestPromise)) {
                        // For cutout terrain, if this isn't the top layer the availability tiles
                        //  may never get loaded, so request it here.
                        var request = new Request$1({
                            throttle: false,
                            throttleByServer: false,
                            type: RequestType$1.TERRAIN,
                        });
                        requestPromise = requestTileGeometry(
                            provider,
                            tile.x,
                            tile.y,
                            tile.level,
                            layer,
                            request
                        );
                        if (defined$9(requestPromise)) {
                            layer.availabilityPromiseCache[cacheKey] = requestPromise;
                            requestPromise.then(deleteFromCache);
                        }
                    }
                }

                // The availability tile is available, but not loaded, so there
                //  is still a chance that it may become available at some point
                return {
                    result: true,
                    promise: requestPromise,
                };
            }

            tile = getAvailabilityTile(layer, tile.x, tile.y, tile.level);
        }

        return {
            result: false,
        };
    }

    // Used for testing
    CesiumProTerrainProvider._getAvailabilityTile = getAvailabilityTile;

    /**
     * 如果第一个参数未定义，返回第二个参数，否则返回第一个参数，用于设置默认值。
     *
     * @exports defaultValue
     *
     * @param {*} a
     * @param {*} b
     * @returns {*} 如果第一个参数未定义，返回第二个参数，否则返回第一个参数，用于设置默认值。
     *
     * @example
     * param = CesiumPro.defaultValue(param, 'default');
     */
    function defaultValue$6(a, b) {
        if (a !== undefined && a !== null) {
            return a;
        }
        return b;
    }

    /**
     * 判断一个变量是否被定义
     * @param value
     * @exports defined
     * @returns {Boolean} value是否被定义
     */
     function defined$8(value) {
        return value !== undefined && value !== null;
      }

    const cesiumScriptRegex = /((?:.*\/)|^)CesiumPro\.js(?:\?|#|$)/;

    let a;
    /*global CESIUMPRO_BASE_URL*/
    function tryMakeAbsolute(url) {
      if (typeof document === 'undefined') {
        // Node.js and Web Workers. In both cases, the URL will already be absolute.
        return url;
      }

      if (!defined$8(a)) {
        a = document.createElement('a');
      }
      a.href = url;

      // IE only absolutizes href on get, not set
      // eslint-disable-next-line no-self-assign
      a.href = a.href;
      return a.href;
    }
    let baseResource;
    let implementation;

    function getBaseUrlFromCesiumScript() {
      const scripts = document.getElementsByTagName('script');
      for (let i = 0, len = scripts.length; i < len; ++i) {
        const src = scripts[i].getAttribute('src');
        const result = cesiumScriptRegex.exec(src);
        if (result !== null) {
          return result[1];
        }
      }
      return undefined;
    }

    function buildModuleUrlFromRequireToUrl(moduleID) {
      // moduleID will be non-relative, so require it relative to this module, in Core.
      return tryMakeAbsolute(`../${moduleID}`);
    }

    function getCesiumProBaseUrl() {
      if (defined$8(baseResource)) {
        return baseResource;
      }

      let baseUrlString;
      if (typeof CESIUMPRO_BASE_URL != 'undefined') {
        baseUrlString = CESIUMPRO_BASE_URL;
      } else if (
        typeof window.define === 'object'
        && defined$8(window.define.amd)
        && !window.define.amd.toUrlUndefined
      ) {
        baseUrlString = Cesium.getAbsoluteUri(
          '..',
          'core/Url.js',
        );
      } else {
        baseUrlString = getBaseUrlFromCesiumScript();
      }
      // >>includeStart('debug');
      if (!defined$8(baseUrlString)) {
        throw new CesiumProError$1(
          'Unable to determine CesiumPro base URL automatically, try defining a global variable called CESIUMPRO_BASE_URL.',
        );
      }
      // >>includeEnd('debug');
      if(!defined$8(baseUrlString)) {
          baseUrlString = '';
      }
      baseResource = new Cesium.Resource({
        url: tryMakeAbsolute(baseUrlString),
      });
      baseResource.appendForwardSlash();

      return baseResource;
    }

    function buildModuleUrlFromBaseUrl(moduleID) {
      const resource = getCesiumProBaseUrl().getDerivedResource({
        url: moduleID,
      });
      return resource.url;
    }

    function buildModuleUrl$2(relativeUrl) {
      if (!defined$8(implementation)) {
        // select implementation
        if (
          typeof window.define === 'object'
          && defined$8(window.define.amd)
          && !window.define.amd.toUrlUndefined
        ) {
          implementation = buildModuleUrlFromRequireToUrl;
        } else {
          implementation = buildModuleUrlFromBaseUrl;
        }
      }

      const url = implementation(relativeUrl);
      return url;
    }
    /**
     * URL相关工具
     * @namespace Url
     *
     */
    const Url = {};
    /**
     * 从多个字符串拼接url,以/为分割符
     * @param  {...String} args
     * @return {String}      url
     *
     * @example
     *
     * URL.join("www.baidu.com/",'/tieba/','cesium')
     * //www.baidu.com/tieba/cesium
     */
    Url.join = function (...args) {
      const formatArgs = [];
      for (let arg of args) {
        if (arg.startsWith('/')) {
          arg = arg.substring(1);
        }
        if (arg.endsWith('/')) {
          arg = arg.substring(0, arg.length - 1);
        }
        formatArgs.push(arg);
      }
      const urlstr = formatArgs.join('/');
      // if (!(urlstr.startsWith('http') || urlstr.startsWith('ftp'))) {
      //   urlstr = `http://${urlstr}`;
      // }
      return urlstr;
    };

    /**
     * 获取CesiumPro静态资源的完整路径
     * @param {String} path 指定文件
     * @returns {String} 完整的Url地址
     * @example 
     * Url.buildModuleUrl('assets/tiles/{z}/{x}/{y}.png')
     */
    Url.buildModuleUrl = function (path) {
      return buildModuleUrl$2(path);
    };
    Url.getCesiumProBaseUrl = getCesiumProBaseUrl;

    const {
        FeatureDetection,
        isCrossOriginUrl
    } = Cesium;
    function getWorkerUrl(moduleID) {
        let url = Cesium.buildModuleUrl(moduleID);

        if (isCrossOriginUrl(url)) {
            //to load cross-origin, create a shim worker from a blob URL
            const script = 'importScripts("' + url + '");';

            let blob;
            try {
                blob = new Blob([script], {
                    type: "application/javascript",
                });
            } catch (e) {
                let BlobBuilder =
                    window.BlobBuilder ||
                    window.WebKitBlobBuilder ||
                    window.MozBlobBuilder ||
                    window.MSBlobBuilder;
                let blobBuilder = new BlobBuilder();
                blobBuilder.append(script);
                blob = blobBuilder.getBlob("application/javascript");
            }

            const URL = window.URL || window.webkitURL;
            url = URL.createObjectURL(blob);
        }

        return url;
    }
    let bootstrapperUrlResult;
    function getBootstrapperUrl() {
        if (!defined$8(bootstrapperUrlResult)) {
            bootstrapperUrlResult = getWorkerUrl("Workers/cesiumWorkerBootstrapper.js");
        }
        return bootstrapperUrlResult;
    }
    function createWorker(processor) {
        const worker = new Worker(getBootstrapperUrl());
        worker.postMessage = defaultValue$6(
            worker.webkitPostMessage,
            worker.postMessage
        );

        const bootstrapMessage = {
            loaderConfig: {
                paths: {
                    Workers: buildModuleUrl$2("workers"),
                },
                baseUrl: getCesiumProBaseUrl().url,
            },
            workerModule: processor._workerPath,
        };

        worker.postMessage(bootstrapMessage);
        worker.onmessage = function (event) {
            completeTask(processor, event.data);
        };
        worker.postMessage(processor._options);

        return worker;
    }
    function completeTask(processor, data) {
        console.log(processor, data, '------complete-----');
    }
    class TaskProcessor {
        /**
         * 处理worker任务
         * @private
         */
        constructor(path, options = {}) {
            this._workers = [];
            this._workerPath = 'workers/' + path;
            this._options = options;
            Math.max(
                FeatureDetection.hardwareConcurrency - 1,
                1
            );
            this._worker = createWorker(this);

        }
    }

    const {
        kdbush,
        Cartesian3: Cartesian3$9,
        Cartographic: Cartographic$4,
        PointPrimitive,
        BoundingRectangle: BoundingRectangle$1,
        SceneMode: SceneMode$3,
        EllipsoidalOccluder,
    } = Cesium;
    function computedScreenPosition(objects, scene) {
        const result = [];
        const occluder = new EllipsoidalOccluder(scene.globe.ellipsoid, scene.camera.positionWC);
        for (let object of objects) {
            if (!object.position) {
                continue;
            }
            if (scene.mode === SceneMode$3.SCENE3D && !occluder.isPointVisible(object.position)) {
                continue;
            }
            object.__pixel = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                scene,
                object.position,
            );
            // object.__pixel = LonLat.toPixel(object.position, scene);
            object.__pixel && result.push(object);
        }
        return result;
    }
    function getX(point) {
        return point.__pixel.x;
    }
    function getY(point) {
        return point.__pixel.y;
    }
    function expandBoundingBox(bbox, pixelRange) {
        bbox.x -= pixelRange;
        bbox.y -= pixelRange;
        bbox.width += pixelRange * 2.0;
        bbox.height += pixelRange * 2.0;
    }
    function getScreenBoundingBox(object, pixel) {
        const bbox = new BoundingRectangle$1();
        PointPrimitive.getScreenSpaceBoundingBox(object, pixel, bbox);
        expandBoundingBox(bbox, this.pixelRange);
        return bbox;
    }
    class Cluster {
        constructor(scene, options = {}) {
            this._objects = defaultValue$6(options.objects, []);
            this._getScreenBoundingBox = defaultValue$6(options.getScreenBoundingBox, getScreenBoundingBox);
            this._scene = scene;
            this.clusterSize = 3;
            this.pixelRange = 50;
            this._clusterObjects = [];
        }
        get objects() {
            return this._objects;
        }
        set objects(val) {
            this._objects = val;
        }
        _clearCluster() {
            this._objects.map(_ => _.cluster = false);
            this._clusterObjects = [];
        }
        update() {
            const objects = this._objects;
            this._clearCluster();
            const filterObject = computedScreenPosition(objects, this._scene);
            const index = new kdbush(filterObject, getX, getY, 64, Int32Array);


            for (let object of filterObject) {
                if (object.cluster) {
                    continue
                }
                const bbox = this._getScreenBoundingBox(object, object.__pixel);
                const totalBBox = BoundingRectangle$1.clone(bbox, new BoundingRectangle$1());
                object.cluster = true;
                const neighbors = index.range(bbox.x, bbox.y, bbox.x + bbox.width, bbox.y + bbox.height);
                const neighborLength = neighbors.length;
                const clusterPosition = Cartesian3$9.clone(object.position);
                let numPoints = 1, lastObject = undefined;
                const ids = [];
                for (let i = 0; i < neighborLength; i++) {
                    const neighborIndex = neighbors[i];
                    const neighborObject = filterObject[neighborIndex];
                    if (neighborObject.cluster) {
                        continue;
                    }
                    ids.push(neighborObject.id);
                    neighborObject.cluster = true;
                    const neightborbox = this._getScreenBoundingBox(neighborObject, neighborObject.__pixel);
                    Cartesian3$9.add(neighborObject.position, clusterPosition, clusterPosition);
                    BoundingRectangle$1.union(totalBBox, neightborbox, totalBBox);
                    numPoints++;
                    lastObject = neighborObject;

                }
                if (numPoints >= this.clusterSize) {
                    Cartesian3$9.multiplyByScalar(clusterPosition, 1.0 / numPoints, clusterPosition);
                    this._clusterObjects.push({
                        position: new Cartesian3$9(clusterPosition.x, clusterPosition.y, clusterPosition.z),
                        number: numPoints,
                        ids,
                        id: lastObject.id + numPoints
                    });
                } else {
                    this._clusterObjects.push(object);
                }

            }
        }
    }

    let lastUpdateTime = undefined;
    /**
     * 计算场景中单位像素的长度所对应的真实距离 
     * @ignore
     * @param {Cesium.Viewer} viewer 
     * @returns {Number} 当前屏幕中心的地图比例尺
     */
    function computeDistancePerPixel(viewer) {
        if(!viewer.scene.globe) {
            return undefined;
        }
        const now = Cesium.getTimestamp();
        const scene = viewer.scene;
        if (defined$8(lastUpdateTime) && now - lastUpdateTime < 250) {
            return;
        }
        lastUpdateTime = now;
        const width = scene.canvas.clientWidth;
        const height = scene.canvas.clientHeight;

        const startRay = scene.camera.getPickRay(new Cesium.Cartesian2(width / 2, height / 2));
        const endRay = scene.camera.getPickRay(new Cesium.Cartesian2(width / 2 + 1, height / 2));
        const startPosition = scene.globe.pick(startRay, scene);
        const endPosition = scene.globe.pick(endRay, scene);
        if (!(defined$8(startPosition) && defined$8(endPosition))) {
            return;
        }
        const geodesic = new Cesium.EllipsoidGeodesic(
            scene.globe.ellipsoid.cartesianToCartographic(startPosition),
            scene.globe.ellipsoid.cartesianToCartographic(endPosition)
        );
        const distance = geodesic.surfaceDistance;
        return distance;
    }

    class LonLat {
        /**
         * 用经纬度（度）和海拔（米）描述一个地理位置。
         * @param {Number} lon 经度，单位：度
         * @param {Number} lat 经度，单位：度
         * @param {Number} alt 海拔，单位：米
         */
        constructor(lon, lat, alt) {
            if (!defined$8(lon)) {
                throw new CesiumProError$1('longitude is required.')
            }
            if (!defined$8(lat)) {
                throw new CesiumProError$1('latitude is required.')
            }
            this.lon = lon;
            this.lat = lat;
            this.alt = defaultValue$6(alt, 0);
        }
        /**
         * 转为屏幕坐标
         * @param {Cesium.Scene} scene 
         * @returns {Cesium.Cartesian2} 屏幕坐标
         */
        toPixel(scene) {
            return LonLat.toPixel(this, scene);
        }
        /**
         * 转为笛卡尔坐标
         * @returns {Cesium.Cartesian3} 笛卡尔坐标
         */
        toCartesian() {
            return LonLat.toCartesian(this);
        }
        /**
         * 转为地理坐标
         * @returns {Cesium.Cartographic} 地理坐标
         */
        toCartographic() {
            return LonLat.toCartographic(this)
        }
        /**
         * 获得该点的弧度形式
         * @returns 弧度表示的点
         */
        getRadias() {
            return {
                lon: Cesium.Math.toRadians(this.lon),
                lat: Cesium.Math.toRadians(this.lat),
                alt
            }
        }
        /**
         * 判断该点是否在场景内，且在球的正面
         * @returns {Boolean} 可见性
         */
        isVisible(viewer) {
            return LonLat.isVisible(this, viewer)
        }
        /**
         * 转为字符串
         * @returns 表示该点位置的字符串
         */
        toString() {
            return `{lon: ${this.lon}, lat: ${this.lat}, alt: ${this.alt}}`
        }
        /**
         * 转为JSON对象
         * @returns 表示该点位置的对象
         */
        toJson() {
            return {
                lon: this.lon,
                lat: this.lat,
                alt: this.alt
            }
        }
        /**
         * 从地理点坐标转换成数组
         * @returns 表示该点位置的数组
         */
        toArray() {
            return [this.lon, this.lat, this.alt];
        }
        /**
         * 判断一个点在当前场景是否可见。这里的可见指的是是否在屏幕范围内且在球的正面。
         * @param {LonLat} point 点
         * @param {Cesium.Viewer} viewer Viewer对象
         * @returns {Boolean} 可见性
         */
        static isVisible(point, viewer) {
            if (viewer instanceof Cesium.Viewer) {
                throw new CesiumProError$1('viewer不是一个有效的Cesium.Viewer对象')
            }
            if (!defined$8(point)) {
                throw new CesiumProError$1('point is not defined.')
            }
            const position = LonLat.toCartesian(point);
            if (viewer.scene.mode === Cesium.SceneMode.SCENE3D) {
                const visibility = new Cesium.EllipsoidalOccluder(Cesium.Ellipsoid.WGS84, viewer.camera.position)
                    .isPointVisible(position);
                if (!visibility) {
                    return false;
                }
                const windowPosition = LonLat.toPixel(point, viewer.scene);
                if (!defined$8(windowPosition)) {
                    return false;
                }
                const width = viewer.canvas.width || viewer.canvas.clientWidth;
                const height = viewer.canvas.height || viewer.canvas.clientHeight;
                return (windowPosition.x > 0 && windowPosition.x < width) && (windowPosition.y > 0 && windowPosition.y < height);
            } else if (viewer.scene.mode === Cesium.SceneMode.SCENE2D) {
                const frustum = viewer.scene.camera.frustum;
                const {
                    positionWC,
                    directionWC,
                    upWC
                } = viewer.scene.camera;
                const cullingVolume = frustum.computeCullingVolume(positionWC, directionWC, upWC);
                const bounding = Cesium.BoundingSphere.projectTo2D(new BoundingSphere(position, 1));
                const visibility = cullingVolume.computeVisibility(bounding);
                return visibility === Cesium.Intersect.INSIDE || visibility === Cesium.Intersect.INERSECTING
            }
        }
        /**
         * 转屏幕坐标
         * @param {LonLat|Cesium.Cartesian3|Cesium.Cartographic} point 
         * @param {Cesium.Scene} scene 
         * @returns 对应的屏幕坐标
         */
        static toPixel(point, scene) {
            //>>includeStart('debug', pragmas.debug);
            if (!defined$8(scene)) {
                throw new CesiumProError$1('scene未定义。')
            }
            if (!defined$8(point)) {
                throw new CesiumProError$1('point is not defined.')
            }
            //>>includeEnd('debug', pragmas.debug);
            const cartesian = LonLat.toCartesian(point);
            if (!defined$8(cartesian)) {
                return undefined;
            }
            return Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                scene,
                cartesian,
            );
        }
        /**
         * 转弧度坐标
         * @param {LonLat} point 
         * @returns 用弧度表示的坐标点
         */
        static toCartographic(point) {
            //>>includeStart('debug', pragmas.debug);
            if (!defined$8(point)) {
                throw new CesiumProError$1('point is not defined.')
            }
            //>>includeEnd('debug', pragmas.debug);
            return Cesium.Cartographic.fromDegrees(point.lon, point.lat, point.alt);
        }
        /**
         * 转笛卡尔坐标
         * @param {LonLat|Cesium.Cartesian3|Cesium.Cartographic|Cesium.Cartesian2} point 
         * @param {Viewer} [viewer] viewer对象， 如果point是Cesium.Cartesian2类型，该参数需要被提供
         * @returns 用笛卡尔坐标表示的点
         */
        static toCartesian(point, viewer) {
            //>>includeStart('debug', pragmas.debug);
            if (!defined$8(point)) {
                throw new CesiumProError$1('point is not defined.')
            }
            //>>includeEnd('debug', pragmas.debug);
            if (point instanceof Cesium.Cartesian3) {
                return point;
            }
            if (point instanceof Cesium.Cartographic) {
                return Cesium.Cartographic.toCartesian(point)
            }
            if (point instanceof LonLat) {
                return Cesium.Cartesian3.fromDegrees(point.lon, point.lat, point.alt)
            }
            if (point instanceof Cesium.Cartesian2) {
                if(!viewer) {
                    return;
                }
                const ray = viewer.scene.camera.getPickRay(point);
                return viewer.scene.globe.pick(ray, viewer.scene);
            }

        }
        /**
         * 从一个笛卡尔坐标创建点
         * @param {Cesium.Cartesian3} cartesian 笛卡尔坐标点
         * @returns GeoPoint点
         */
        static fromCartesian(cartesian) {
            //>>includeStart('debug', pragmas.debug);
            if (!defined$8(cartesian)) {
                throw new CesiumProError$1('cartesian is not defined.')
            }
            //>>includeEnd('debug', pragmas.debug);
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            if (!defined$8(cartographic)) {
                return undefined;
            }
            return LonLat.fromCartographic(cartographic)
        }
        /**
         * 从一个地理坐标点创建点
         * @param {Cesium.Cartographic} cartographic 地理坐标点
         * @returns GeoPoint点
         */
        static fromCartographic(cartographic) {
            //>>includeStart('debug', pragmas.debug);
            if (!defined$8(cartographic)) {
                throw new CesiumProError$1('cartographic is not defined.')
            }
            //>>includeEnd('debug', pragmas.debug);
            return new LonLat(
                Cesium.Math.toDegrees(cartographic.longitude),
                Cesium.Math.toDegrees(cartographic.latitude),
                cartographic.height
            )
        }
        /**
         * 从一个窗口坐标创建点
         * @param {Cesium.Cartesian2} pixel 窗口坐标
         * @param {Cesium.Viewer} viewer Viewer对象
         * @returns {LonLat} GeoPoint点
         */
        static fromPixel(pixel, viewer) {
            if (!viewer.scene.globe) {
                return undefined;
            }
            //>>includeStart('debug', pragmas.debug);
            if (!defined$8(pixel)) {
                throw new CesiumProError$1('pixel is not defined.')
            }
            if (viewer instanceof Cesium.Viewer === false) {
                throw new CesiumProError$1('viewer不是一个有效的Cesium.Viewer对象')
            }
            //>>includeEnd('debug', pragmas.debug);
            const ray = viewer.scene.camera.getPickRay(pixel);
            const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            if (!defined$8(cartesian)) {
                return undefined;
            }
            return LonLat.fromCartesian(cartesian);
        }
        /**
         * 从经纬度创建点
         * @param {Number} lon 经度(度)
         * @param {Number} lat 纬度(度)
         * @param {Number} height 海拔(米)
         * @returns {LonLat}
         */
        static fromDegrees(lon, lat, height) {
            return new LonLat(lon, lat, height);
        }
        /**
         * 从经纬度创建点
         * @param {Number} lon 经度(弧度)
         * @param {Number} lat 纬度(弧度)
         * @param {Number} height 海拔(米)
         * @returns {LonLat}
         */
         static fromRadians(lon, lat, height) {
            return new LonLat(Cesium.Math.toDegrees(lon), Cesium.Math.toDegrees(lat), height);
        }
        /**
         * 判断一个点或经纬度是否在中国范围内（粗略）
         * @param  {LonLat|Number[]} args 
         * @returns 如果在中国范围内，返回true
         */
        static inChina(...args) {
            if (args.length === 1) {
                const p = args[0];
                if (args[0] instanceof LonLat) {
                    return LonLat.inChina(p.lon, p.lat)
                }
            } else {
                const lon = +args[0];
                const lat = +args[1];
                return lon > 73.66 && lon < 135.05 && lat > 3.86 && lat < 53.55
            }
        }
        /**
         * 从经纬度数组创建点, 经纬度数组，经度在前，纬度在后
         * @param {Array} lonlat 
         * @returns {LonLat}
         */
        static fromArray(lonlat) {
            return new LonLat(...lonlat)
        }
        /**
         * 从经纬度数组创建点, 经纬度数组，经度在前，纬度在后
         * @param {Object} lonlat 
         * @returns {LonLat}
         */
         static fromJson(lonlat) {
            return new LonLat(lonlat.lon, lonlat.lat, lonlat.alt)
        }
        /**
         * 判断对象是不是一个有效的点
         * @param {any} v 
         */
        static isValid(v) {
            if (v instanceof LonLat === false) {
                return false;
            }
            if (!defined$8(v.lon)) {
                return false;
            }
            if (!defined$8(v.lat)) {
                return false;
            }
            if (!defined$8(v.alt)) {
                return false;
            }
            return true;
        }
    }

    /**
     * 计算场景中心的坐标
     * @ignore
     * @param {*} viewer 
     */
    function computeSceneCenterPoint(viewer) {
        const canvas = viewer.canvas;
        const bounding = canvas.getBoundingClientRect();

        // center pixel
        const pixel = new Cesium.Cartesian2(bounding.width / 2, bounding.height / 2);
        return LonLat.fromPixel(pixel, viewer);
    }

    function computeSceneExtent(viewer) {
        // const rect = viewer.camera.computeViewRectangle();
        // todo 该方法获得的是相机的范围，有实际场景的范围有一定误差
        if(!viewer.scene.globe) {
            return {}
        }
        if (viewer.scene.mode === Cesium.SceneMode.SCENE3D) {
            const rect = viewer.camera.computeViewRectangle();
            if(!defined$8(rect)) {
                return undefined;
            }
            return {
                west: Cesium.Math.toDegrees(rect.west),
                south: Cesium.Math.toDegrees(rect.south),
                east: Cesium.Math.toDegrees(rect.east),
                north: Cesium.Math.toDegrees(rect.north)
            }
        }
        const canvas = viewer.canvas;
        const bounding = canvas.getBoundingClientRect();
        const left = LonLat.fromPixel(new Cesium.Cartesian2(0, bounding.height / 2), viewer)|| {lon: -180};
        const right = LonLat.fromPixel(new Cesium.Cartesian2(bounding.width, bounding.height / 2), viewer) || {lon: 180};
        const top = LonLat.fromPixel(new Cesium.Cartesian2(bounding.width / 2, 0), viewer) || {lat: 90};
        const bottom = LonLat.fromPixel(new Cesium.Cartesian2(bounding.width / 2, bounding.height), viewer) || {lat: -90};

        return {
            west: left.lon,
            south: bottom.lat,
            east: right.lon,
            north: top.lat
        }
        
    }

    /**
     * 创建全局唯一标识，长度128 bit，可以确保时间和空间上的唯一性。
     *
     * @exports createGuid
     *
     * @returns {String} guid
     *
     *
     * @example
     * this.guid = CesiumPro.createGuid();
     *
     * @see {@link http://www.ietf.org/rfc/rfc4122.txt|RFC 4122 A Universally Unique IDentifier (UUID) URN Namespace}
     */
    function createGuid$3() {
        // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    /**
     * 时间数据格式的扩展方法
     *
     * @exports dateFormat
     * @param  {String} fmt  时间格式
     * @param  {Date} date 时间
     * @return {String}     格式化后的时间
     *
     * @example
     * const date=new Date();
     * dateFormat('yy-mm-dd HH:MM:SS',date)
     * dateFormat('HH:MM:SS',date)
     * date.format('yy-mm-dd HH:MM:SS)
     */
     function dateFormat(fmt, date) {
        let ret;
        const opt = {
          'y+': date.getFullYear().toString(), // 年
          'm+': (date.getMonth() + 1).toString(), // 月
          'd+': date.getDate().toString(), // 日
          'H+': date.getHours().toString(), // 时
          'M+': date.getMinutes().toString(), // 分
          'S+': date.getSeconds().toString(), // 秒
          // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        const keys = Object.keys(opt);
        for (const k of keys) {
          ret = new RegExp(`(${k})`).exec(fmt);
          if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length === 1)
              ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')));
          }
        }
        return fmt;
      }
      window.Date.prototype.format = function (format) {
        dateFormat(format, this);
      };

    class Graphic{
        /**
         * 所有CesiumPro自定义图形基类
        */
        constructor(options) {
            this._options = options;
            this._id = defaultValue$6(options.id, createGuid$3());
            this._primitive = null;
            this._oldPrimitive = null;
            this._definedChanged = new Event$7();
            this._clampToGround = defaultValue$6(!!options.clampToGround, false);
            this._show = defaultValue$6(!!options.show, true);
            this._removed = false;
            this._allowPicking = defaultValue$6(options.allowPicking, true);
            this._property = defaultValue$6(options, options.property);
        }
        /**
         * 图形id，可以使用它获取图形
         * @readonly
         * @type {String}
         * @example 
         * const graphic = new CesiumPro.CircleScanGraphic({
         *   id: "xxx",
         *   position: new CesiumPro.LonLat(lon , lat + 0.05),
         *   radius: 1000,
         *   color: '#FF0000',
         *   speed: 10,
         *   clampToGround: parameters['贴地'],
         *   property: {
         *       name: "贴地圆",
         *       color: 'red',
         *   }
         * );
         * graphic.addTo(viewer);
         * viewer.graphicGroup.get('xxx');
         */
        get id() {
            return this._id;
        }
        /**
         * 图形的属性信息，当元素被拾取的时候该属性会通过id字段返回
         * @type {any}
         */
        get property() {
            return this._property;
        }
        /**
         * 获得或设置图形是否允许被拾取
         * @type {Boolean}
         */
        get allowPicking() {
            return this._allowPicking;
        }
        set allowPicking(v) {
            if ((!!v) !== this._allowPicking) {
                this._allowPicking = v;
                this.updatePrimitive && this.updatePrimitive();
            }
        }
        /**
         * 获取或设置图形是否贴地
         * @type {Boolean}
         */
        get clampToGround() {
            return this._clampToGround;
        }
        set clampToGround(val) {
            if (val !== this._clampToGround) {
                this.oldPrimitive = this.primitive;
                const options = Object.assign({}, this._options, {clampToGround: val, asynchronous: false});
                this._primitive = (new this.constructor(options)).primitive;
            }
            this._clampToGround = val;
        }
        /**
         * 显示或隐藏图形
         * @type {Boolean}
         */
        get show() {
            return this._show;
        }
        set show(val){
            if (val === this._show) {
                return
            }
            this.definedChanged.raise('show', v, this._show);
            this._show = val;
            this.primitive && (this.primitive.show = val);
        }
        /**
         * 图形对象，包含了渲染图形所老百姓的几何信息和材质
         * @readonly
         */
        get primitive() {
            return this._primitive;
        }
        /**
         * 要素的属性发生变化时触发的事件。
         * 事件订阅者接收3个参数，第一个是发生变化的属性，第二是个变化后的属性，
         * 第三个是变化前的属性
         */
        get definedChanged() {
            return this._definedChanged;
        }
        /**
         * 得到一个promise对象，指示图形是否创建完成
         * @type {Promise}
         */
        get readyPromise() {
            if (!this.primitive) {
                return new Primise();
            }
            return this.primitive.readyPromise;
        }
        /**
         * @private
         */
        get material() {
            if (this.primitive) {
                return this.primitive.appearance.material;
            }
        }
        toJson() {
            if(!defined$8(this.primitive)) {
                return;
            }
        }
        /**
         * @private
         */
        update() {}
        /**
         * 更新要素外观材质相关的属性
         * @private
         * @param {*} k 
         * @param {*} v 
         */
        updateAttribute(k, v) {
            if (this.isDestroyed()) {
                return;
            }
            if (!this.primitive) {
                return;
            }
            const appearance = this.primitive.appearance;
            const material = appearance.material;
            if (!material) {
                return;
            }
            const uniforms = material.uniforms;
            if (!uniforms) {
                return;
            }
            uniforms[k] = v;
        }
        /**
         * 将图形要素直接添加到指定viewer
         * @param {Viewer} viewer viewer对象
         */
        addTo(viewer) {
            if (!defined$8(this.primitive)) {
                return;
            }
            this._viewer = viewer;
            viewer.graphicGroup.add(this);
        }
        zoomTo() {}
        /**
         * 将当前要素从场景中移除
         * @returns 被移除的要素
         */
        remove() {
            if (!defined$8(this.primitive)) {
                return;
            }
            if (this._viewer) {
                this.group.remove(this);
                return this;
            }
        }
        isDestroyed() {
            return false;
        }
        destroy() {
            if (this.primitive && !this.primitive.isDestroyed()) {
                this.primitive.destroy();
                this.primitive = undefined;
            }
            Cesium.destroyObject(this);
        }
    }

    const { AssociativeArray: AssociativeArray$3 } = Cesium;
    class GraphicGroup {
        constructor(viewer) {
            this.values = new AssociativeArray$3();
            this.id = createGuid$3();
            this.viewer = viewer;
        }
        add(object) {
            if (object instanceof GraphicGroup) {
                this.values.set(object.id, object);
            }
            if (object instanceof Graphic) {
                this.values.set(object.id, object);
                if (object.primitive) {
                    this.viewer.primitives.add(object.primitive);
                }
                object._viewer = this.viewer;
                object.group = this;
            }
        }
        get(graphicId) {
            return this.values.get(graphicId);
        }
        remove(graphic) {
            this.values.remove(graphic.id);
            if (graphic instanceof GraphicGroup) {
                graphic.clear();
            }
            if (graphic.primitive) {
                this.viewer.primitives.remove(graphic.primitive);
            }
            graphic.destroy();
        }
        removeById(graphicId) {
            const graphic = this.values.get(graphicId);
            this.remove(graphic);
        }
        has(object) {
            return this.values.contains(object);
        }
        update(time) {
            const values = this.values._array;
            for (let val of values) {
                if (defined$8(val.oldPrimitive)) {
                    this.viewer.primitives.remove(val.oldPrimitive);
                    this.viewer.primitives.add(val.primitive);
                    val.oldPrimitive = null;
                }
                val.update(time);
            }
        }
        clear() {
            const values = this.values._array;
            this.values.removeAll();
            for (let val of values) {
                if (val.primitive) {
                    this.viewer.primitives.remove(val.primitive);
                }
            }
        }
    }

    const shader$3 = 'uniform samplerCube u_cubeMap;\n\
  varying vec3 v_texCoord;\n\
  void main()\n\
  {\n\
  vec4 color = textureCube(u_cubeMap, normalize(v_texCoord));\n\
  gl_FragColor = vec4(czm_gammaCorrect(color).rgb, czm_morphTime);\n\
  }\n\
  ';

    const shader$2 = 'attribute vec3 position;\n\
  varying vec3 v_texCoord;\n\
  uniform mat3 u_rotateMatrix;\n\
  void main()\n\
  {\n\
  vec3 p = czm_viewRotation * u_rotateMatrix * (czm_temeToPseudoFixed * (czm_entireFrustum.y * position));\n\
  gl_Position = czm_projection * vec4(p, 1.0);\n\
  v_texCoord = position.xyz;\n\
  }\n\
  ';

    const {
        defaultValue: defaultValue$5,
        destroyObject: destroyObject$4,
        Matrix4: Matrix4$2,
        DrawCommand,
        BoxGeometry,
        Cartesian3: Cartesian3$8,
        defined: defined$7,
        GeometryPipeline,
        Transforms: Transforms$3,
        VertexFormat,
        BufferUsage,
        CubeMap,
        loadCubeMap,
        RenderState,
        VertexArray,
        BlendingState,
        SceneMode: SceneMode$2,
        ShaderProgram: ShaderProgram$2,
        ShaderSource: ShaderSource$3,
        Matrix3,
    } = Cesium;
    const SkyBoxFS = shader$3;
    const SkyBoxVS = shader$2;
    class GroundSkyBox {
        /**
         * A sky box around the scene to draw stars.  The sky box is defined using the True Equator Mean Equinox (TEME) axes.
         * <p>
         * This is only supported in 3D.  The sky box is faded out when morphing to 2D or Columbus view.  The size of
         * the sky box must not exceed {@link Scene#maximumCubeMapSize}.
         * </p>
         *
         * @param {Object} options Object with the following properties:
         * @param {Object} [options.sources] The source URL or <code>Image</code> object for each of the six cube map faces.  See the example below.
         * @param {Boolean} [options.show=true] Determines if this primitive will be shown.
         *
         *
         * @example
         * scene.skyBox = new CesiumPro.GroundSkyBox({
         *   sources : {
         *     positiveX : 'skybox_px.png',
         *     negativeX : 'skybox_nx.png',
         *     positiveY : 'skybox_py.png',
         *     negativeY : 'skybox_ny.png',
         *     positiveZ : 'skybox_pz.png',
         *     negativeZ : 'skybox_nz.png'
         *   }
         * });
         *
         * @see Cesium.SkyBox
         */
        constructor(options = {}) {
            this.sources = defaultValue$5(options.sources, {
                positiveX: Url.buildModuleUrl('./assets/skybox/px.png'),
                negativeX: Url.buildModuleUrl('./assets/skybox/nx.png'),
                positiveY: Url.buildModuleUrl('./assets/skybox/py.png'),
                negativeY: Url.buildModuleUrl('./assets/skybox/ny.png'),
                positiveZ: Url.buildModuleUrl('./assets/skybox/pz.png'),
                negativeZ: Url.buildModuleUrl('./assets/skybox/nz.png')
            });
            this._sources = undefined;
            /**
             * 决定天空盒是否被显示.
             *
             * @type {Boolean}
             * @default true
             */
            this.show = defaultValue$5(options.show, true);

            this._command = new DrawCommand({
                modelMatrix: Matrix4$2.clone(Matrix4$2.IDENTITY),
                owner: this,
            });
            this._cubeMap = undefined;

            this._attributeLocations = undefined;
            this._useHdr = undefined;
            this._isDestroyed = false;
        }

        /**
         *
         * 当场景渲染的时候会自动调用该函数更新天空盒。
         * <p>切勿主动调用该函数。</p>
         */
        update(frameState, useHdr) {
            const skyboxMatrix3 = new Matrix3();
            const that = this;

            if (!this.show) {
                return undefined;
            }

            if ((frameState.mode !== SceneMode$2.SCENE3D)
                && (frameState.mode !== SceneMode$2.MORPHING)) {
                return undefined;
            }

            // The sky box is only rendered during the render pass; it is not pickable,
            // it doesn't cast shadows, etc.
            if (!frameState.passes.render) {
                return undefined;
            }

            const {
                context,
            } = frameState;

            if (this._sources !== this.sources) {
                this._sources = this.sources;
                const {
                    sources,
                } = this;

                if ((!defined$7(sources.positiveX))
                    || (!defined$7(sources.negativeX))
                    || (!defined$7(sources.positiveY))
                    || (!defined$7(sources.negativeY))
                    || (!defined$7(sources.positiveZ))
                    || (!defined$7(sources.negativeZ))) {
                    throw new CesiumProError$1('this.sources is required and must have positiveX, negativeX, positiveY, negativeY, positiveZ, and negativeZ properties.');
                }

                if ((typeof sources.positiveX !== typeof sources.negativeX)
                    || (typeof sources.positiveX !== typeof sources.positiveY)
                    || (typeof sources.positiveX !== typeof sources.negativeY)
                    || (typeof sources.positiveX !== typeof sources.positiveZ)
                    || (typeof sources.positiveX !== typeof sources.negativeZ)) {
                    throw new CesiumProError$1('this.sources properties must all be the same type.');
                }

                if (typeof sources.positiveX === 'string') {
                    // Given urls for cube-map images.  Load them.
                    loadCubeMap(context, this._sources).then((cubeMap) => {
                        that._cubeMap = that._cubeMap && that._cubeMap.destroy();
                        that._cubeMap = cubeMap;
                    });
                } else {
                    this._cubeMap = this._cubeMap && this._cubeMap.destroy();
                    this._cubeMap = new CubeMap({
                        context,
                        source: sources,
                    });
                }
            }

            const command = this._command;

            command.modelMatrix = Transforms$3.eastNorthUpToFixedFrame(frameState.camera._positionWC);
            if (!defined$7(command.vertexArray)) {
                command.uniformMap = {
                    u_cubeMap() {
                        return that._cubeMap;
                    },
                    u_rotateMatrix() {
                        if (typeof Matrix4$2.getRotation === 'function') {
                            return Matrix4$2.getRotation(command.modelMatrix, skyboxMatrix3);
                        }
                        return Matrix4$2.getMatrix3(command.modelMatrix, skyboxMatrix3);
                    },
                };

                const geometry = BoxGeometry.createGeometry(BoxGeometry.fromDimensions({
                    dimensions: new Cartesian3$8(2.0, 2.0, 2.0),
                    vertexFormat: VertexFormat.POSITION_ONLY,
                }));
                const attributeLocations = this._attributeLocations = GeometryPipeline
                    .createAttributeLocations(geometry);

                command.vertexArray = VertexArray.fromGeometry({
                    context,
                    geometry,
                    attributeLocations,
                    bufferUsage: BufferUsage._DRAW,
                });

                command.renderState = RenderState.fromCache({
                    blending: BlendingState.ALPHA_BLEND,
                });
            }

            if (!defined$7(command.shaderProgram) || this._useHdr !== useHdr) {
                const fs = new ShaderSource$3({
                    defines: [useHdr ? 'HDR' : ''],
                    sources: [SkyBoxFS],
                });
                command.shaderProgram = ShaderProgram$2.fromCache({
                    context,
                    vertexShaderSource: SkyBoxVS,
                    fragmentShaderSource: fs,
                    attributeLocations: this._attributeLocations,
                });
                this._useHdr = useHdr;
            }

            if (!defined$7(this._cubeMap)) {
                return undefined;
            }

            return command;
        }

        /**
         * 对象是否被销毁
         */
        isDestroyed() {
            return this._isDestroyed;
        }

        /**
         * 销毁对象
         */
        destroy() {
            const command = this._command;
            command.vertexArray = command.vertexArray && command.vertexArray.destroy();
            command.shaderProgram = command.shaderProgram && command.shaderProgram.destroy();
            this._cubeMap = this._cubeMap && this._cubeMap.destroy();
            return destroyObject$4(this);
        }
    }

    /**
     * 影像分割显示类型
     * @enum {Number}
     */
    const ImagerySplitDirection = Object.freeze({
        /**
         * 影像显示在屏幕左侧
         * @type {Number}
         * @constant
         */
        LEFT: -1,
        /**
         * 影像显示在屏幕右侧
         * @type {Number}
         * @constant
         */
        RIGHT: 1,
        /**
         * 一直显示该影像
         * @type {Number}
         * @constant
         */
        NONE: 0,
        /**
         * 影像显示在屏幕上方
         * @type {Number}
         * @constant
         */
        TOP: -10,
        /**
         * 影像显示在屏幕下方
         * @type {Number}
         * @constant
         */
        BOTTOM:10
    });

    const {Cartesian2, Rectangle: Rectangle$4, GeographicProjection, Ellipsoid: Ellipsoid$1} = Cesium;
    const CesiumMath = Cesium.Math;

    /**
     * A tiling scheme for geometry referenced to a simple {@link GeographicProjection} where
     * longitude and latitude are directly mapped to X and Y.  This projection is commonly
     * known as geographic, equirectangular, equidistant cylindrical, or plate carrée.
     * @ignore
     * @alias LonlatTilingScheme
     * @constructor
     *
     * @param {Object} [options] Object with the following properties:
     * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid whose surface is being tiled. Defaults to
     * the WGS84 ellipsoid.
     * @param {Rectangle} [options.rectangle=Rectangle.MAX_VALUE] The rectangle, in radians, covered by the tiling scheme.
     * @param {Number} [options.numberOfLevelZeroTilesX=2] The number of tiles in the X direction at level zero of
     * the tile tree.
     * @param {Number} [options.numberOfLevelZeroTilesY=1] The number of tiles in the Y direction at level zero of
     * the tile tree.
     */
    function LonlatTilingScheme(options) {
      options = defaultValue$6(options, defaultValue$6.EMPTY_OBJECT);

      this._ellipsoid = defaultValue$6(options.ellipsoid, Ellipsoid$1.WGS84);
      this._rectangle = defaultValue$6(options.rectangle, Rectangle$4.MAX_VALUE);
      this._projection = new GeographicProjection(this._ellipsoid);
      this._numberOfLevelZeroTilesX = 36;
      this._numberOfLevelZeroTilesY = 18;
      this._intervalOfZeorLevel = defaultValue$6(options.intervalOfZeorLevel, 16);
    }

    Object.defineProperties(LonlatTilingScheme.prototype, {
      /**
       * Gets the ellipsoid that is tiled by this tiling scheme.
       * @memberof LonlatTilingScheme.prototype
       * @type {Ellipsoid}
       */
      ellipsoid: {
        get: function () {
          return this._ellipsoid;
        },
      },

      /**
       * Gets the rectangle, in radians, covered by this tiling scheme.
       * @memberof LonlatTilingScheme.prototype
       * @type {Rectangle}
       */
      rectangle: {
        get: function () {
          return this._rectangle;
        },
      },

      /**
       * Gets the map projection used by this tiling scheme.
       * @memberof LonlatTilingScheme.prototype
       * @type {MapProjection}
       */
      projection: {
        get: function () {
          return this._projection;
        },
      },
    });

    /**
     * Gets the total number of tiles in the X direction at a specified level-of-detail.
     *
     * @param {Number} level The level-of-detail.
     * @returns {Number} The number of tiles in the X direction at the given level.
     */
    LonlatTilingScheme.prototype.getNumberOfXTilesAtLevel = function (level) {
      return this._numberOfLevelZeroTilesX << level;
    };
    LonlatTilingScheme.prototype.modifyLevel = function(level) {
      if(level <3) {
        return 0;
      } else if(level < 6) {
        return 1;
      }
    };
    LonlatTilingScheme.prototype.getDelatXY = function(level) {
      const intervalOfZeorLevel = this._intervalOfZeorLevel;
      let dx = intervalOfZeorLevel / 2 ** level;
      let dy = intervalOfZeorLevel / 2 ** level;
      return {dx, dy}  
    };
    LonlatTilingScheme.prototype.getLonLatValuee = function(level, x, y) {
      const value = this.getDelatXY(level);
      const lon = value.dx * x - 180;
      const lat = 90 - value.dy * y;
      return {lon, lat}
    };

    /**
     * Gets the total number of tiles in the Y direction at a specified level-of-detail.
     *
     * @param {Number} level The level-of-detail.
     * @returns {Number} The number of tiles in the Y direction at the given level.
     */
    LonlatTilingScheme.prototype.getNumberOfYTilesAtLevel = function (level) {
      return this._numberOfLevelZeroTilesY << level;
    };

    /**
     * Transforms a rectangle specified in geodetic radians to the native coordinate system
     * of this tiling scheme.
     *
     * @param {Rectangle} rectangle The rectangle to transform.
     * @param {Rectangle} [result] The instance to which to copy the result, or undefined if a new instance
     *        should be created.
     * @returns {Rectangle} The specified 'result', or a new object containing the native rectangle if 'result'
     *          is undefined.
     */
    LonlatTilingScheme.prototype.rectangleToNativeRectangle = function (
      rectangle,
      result
    ) {
      const west = CesiumMath.toDegrees(rectangle.west);
      const south = CesiumMath.toDegrees(rectangle.south);
      const east = CesiumMath.toDegrees(rectangle.east);
      const north = CesiumMath.toDegrees(rectangle.north);

      if (!defined$8(result)) {
        return new Rectangle$4(west, south, east, north);
      }

      result.west = west;
      result.south = south;
      result.east = east;
      result.north = north;
      return result;
    };

    /**
     * Converts tile x, y coordinates and level to a rectangle expressed in the native coordinates
     * of the tiling scheme.
     *
     * @param {Number} x The integer x coordinate of the tile.
     * @param {Number} y The integer y coordinate of the tile.
     * @param {Number} level The tile level-of-detail.  Zero is the least detailed.
     * @param {Object} [result] The instance to which to copy the result, or undefined if a new instance
     *        should be created.
     * @returns {Rectangle} The specified 'result', or a new object containing the rectangle
     *          if 'result' is undefined.
     */
    LonlatTilingScheme.prototype.tileXYToNativeRectangle = function (
      x,
      y,
      level,
      result
    ) {
      const rectangleRadians = this.tileXYToRectangle(x, y, level, result);
      rectangleRadians.west = CesiumMath.toDegrees(rectangleRadians.west);
      rectangleRadians.south = CesiumMath.toDegrees(rectangleRadians.south);
      rectangleRadians.east = CesiumMath.toDegrees(rectangleRadians.east);
      rectangleRadians.north = CesiumMath.toDegrees(rectangleRadians.north);
      return rectangleRadians;
    };

    /**
     * Converts tile x, y coordinates and level to a cartographic rectangle in radians.
     *
     * @param {Number} x The integer x coordinate of the tile.
     * @param {Number} y The integer y coordinate of the tile.
     * @param {Number} level The tile level-of-detail.  Zero is the least detailed.
     * @param {Object} [result] The instance to which to copy the result, or undefined if a new instance
     *        should be created.
     * @returns {Rectangle} The specified 'result', or a new object containing the rectangle
     *          if 'result' is undefined.
     */
    LonlatTilingScheme.prototype.tileXYToRectangle = function (
      x,
      y,
      level,
      result
    ) {
      var rectangle = this._rectangle;

      var xTiles = this.getNumberOfXTilesAtLevel(level);
      var yTiles = this.getNumberOfYTilesAtLevel(level);

      var xTileWidth = rectangle.width / xTiles;
      var west = x * xTileWidth + rectangle.west;
      var east = (x + 1) * xTileWidth + rectangle.west;

      var yTileHeight = rectangle.height / yTiles;
      var north = rectangle.north - y * yTileHeight;
      var south = rectangle.north - (y + 1) * yTileHeight;

      if (!defined$8(result)) {
        result = new Rectangle$4(west, south, east, north);
      }

      result.west = west;
      result.south = south;
      result.east = east;
      result.north = north;
      return result;
    };

    /**
     * Calculates the tile x, y coordinates of the tile containing
     * a given cartographic position.
     *
     * @param {Cartographic} position The position.
     * @param {Number} level The tile level-of-detail.  Zero is the least detailed.
     * @param {Cartesian2} [result] The instance to which to copy the result, or undefined if a new instance
     *        should be created.
     * @returns {Cartesian2} The specified 'result', or a new object containing the tile x, y coordinates
     *          if 'result' is undefined.
     */
    LonlatTilingScheme.prototype.positionToTileXY = function (
      position,
      level,
      result
    ) {
      var rectangle = this._rectangle;
      if (!Rectangle$4.contains(rectangle, position)) {
        // outside the bounds of the tiling scheme
        return undefined;
      }

      var xTiles = this.getNumberOfXTilesAtLevel(level);
      var yTiles = this.getNumberOfYTilesAtLevel(level);

      var xTileWidth = rectangle.width / xTiles;
      var yTileHeight = rectangle.height / yTiles;

      var longitude = position.longitude;
      if (rectangle.east < rectangle.west) {
        longitude += CesiumMath.TWO_PI;
      }

      var xTileCoordinate = ((longitude - rectangle.west) / xTileWidth) | 0;
      if (xTileCoordinate >= xTiles) {
        xTileCoordinate = xTiles - 1;
      }

      var yTileCoordinate =
        ((rectangle.north - position.latitude) / yTileHeight) | 0;
      if (yTileCoordinate >= yTiles) {
        yTileCoordinate = yTiles - 1;
      }

      if (!defined$8(result)) {
        return new Cartesian2(xTileCoordinate, yTileCoordinate);
      }

      result.x = xTileCoordinate;
      result.y = yTileCoordinate;
      return result;
    };

    const {
        CesiumTerrainProvider,
        when: when$6,
        TerrainProvider,
        Resource: Resource$4,
        CustomDataSource: CustomDataSource$1,
        Cartesian3: Cartesian3$7,
        Entity: Entity$2,
        Color: Color$9,
        Rectangle: Rectangle$3
    } = Cesium;
    function createBoundingRect(provider) {
        let positions = [];
        const bounding = [provider.bounds.west, provider.bounds.south, provider.bounds.east, provider.bounds.north];
        if (provider.projection.toUpperCase() === 'EPSG:4326') {
            positions = [
                bounding[0], bounding[1],
                bounding[0], bounding[3],
                bounding[2], bounding[3],
                bounding[2], bounding[1],
                bounding[0], bounding[1]
            ];
        }
        return new Entity$2({
            polyline: {
                positions: Cartesian3$7.fromRadiansArray(positions),
                material: Color$9.fromRandom({ alpha: 1 }),
                width: 3,
                clampToGround: true
            }
        })
    }
    function bindBounding(provider, url) {
        const resource = Resource$4.createIfNeeded(url);
        resource.appendForwardSlash();
        const layerJsonResource = resource.getDerivedResource({
            url: "layer.json",
        });
        return new Promise((resolve, reject) => {
            when$6(layerJsonResource.fetchJson())
            .then((data) => {
                provider.projection = data.projection;
                provider.bounds = Rectangle$3.fromDegrees(...data.valid_bounds);
                resolve(true);
            });
        })
    }
    class MultipleTerrainProvider {
        /**
         * 为场景添加多个地形数据。
         * todo: 目前两个地形相接的的一行瓦片数据丢失。
         * @param {MultipleTerrainProvider.TerrainList} terrainList 地形列表
         * @param {Object} options 具有以下属性
         * @param {Boolean} [options.requestVertexNormals = false] 是否请求法线数据
         * @param {Boolean} [options.requestWaterMask = false] 是否请求水面数据
         * @param {Boolean} [options.requestMetadata = true] 是否请求元数据
         * @param {Cesium.Ellipsoid} [options.ellipsoid] 椭球体
         * @param {String|Cesium.Credit} [options.credit] 信用信息
         * @example
         * const terrain = new CesiumPro.MultipleTerrainProvider([
         *         {
         *             url: '../data/terrain/terrain-left',
         *             zIndex:3
         *         },
         *         {
         *             url: '../data/terrain/terrain-right',
         *             zIndex:2
         *         }
         *     ])
         * terrain.readyPromise.then(() => {
         *     terrain.createBoundingRectangle(viewer);
         * })
         * viewer.terrain = terrain;
         * 
         *  @demo {@link examples/apps/index.html#/5.4.1mag-point|多地形加载示例}
         */
        constructor(terrainList, options = {}) {
            this._heightmapWidth = 65;
            this._heightmapStructure = undefined;
            this._hasWaterMask = false;
            this._hasVertexNormals = false;
            this._ellipsoid = options.ellipsoid;
            this._requestVertexNormals = defaultValue$6(options.requestVertexNormals, false);
            this._requestWaterMask = defaultValue$6(options.requestWaterMask, false);
            this._requestMetadata = defaultValue$6(options.requestMetadata, true);
            this._errorEvent = new Event$7();

            this._terrainProviders = [];
            const boundPromise = [];
            for (let terrain of terrainList) {
                terrain.requestVertexNormals = terrain.requestVertexNormals || options.requestVertexNormals;
                terrain.requestWaterMask = terrain.requestWaterMask || options.requestWaterMask;
                terrain.requestMetadata = terrain.requestMetadata || options.requestMetadata;
                const provider = new CesiumProTerrainProvider(terrain);
                provider.zIndex = terrain.zIndex || -1;
                this._terrainProviders.push(provider);
                boundPromise.push(bindBounding(provider, terrain.url));
            }
            this._ready = false;
            this._readyPromise = when$6.defer();
            this._terrainList = terrainList;

            // 所有地形准备完成就准备完成
            Promise.all([...this._terrainProviders.map(_ => _.readyPromise), ...boundPromise]).then((pv) => {
                this._ready = true;
                this._readyPromise.resolve(true);
                this._tilingScheme = this._terrainProviders[0]._tilingScheme;
                this._levelZeroMaximumGeometricError = TerrainProvider.getEstimatedLevelZeroGeometricErrorForAHeightmap(
                    this._tilingScheme.ellipsoid,
                    this._heightmapWidth,
                    this._tilingScheme.getNumberOfXTilesAtLevel(0)
                );
            });
            this._validProvider = undefined;
        }
        get tilingScheme() {
            return this._tilingScheme;
        }
        get ready() {
            return this._ready;
        }
        get readyPromise() {
            return this._readyPromise;
        }
        /**
         * 创建地形的边界矩形，用于调试
         * @param {Viewer} viewer Viewer对象
         * @returns {Function} 用于删除边界矩形的回调函数
         */
        createBoundingRectangle(viewer) {
            const debugDataSource = new CustomDataSource$1('multiple-terrain-provider');
            for (let provider of this._terrainProviders) {
                debugDataSource.entities.add(createBoundingRect(provider));
            }
            viewer.addLayer(debugDataSource);
            return function () {
                const source = viewer.dataSources.getByName('multiple-terrain-provider');
                viewer.dataSources.remove(source[0]);
            }

        }
        getLevelMaximumGeometricError(level) {
            if (this._validProvider) {
                return this._validProvider.getLevelMaximumGeometricError(level);
            }
            return this._levelZeroMaximumGeometricError / (1 << level);    }
        /**
         * 判断当前瓦片是否存在有效地形数据
         * @param {*} x 
         * @param {*} y 
         * @param {*} level 
         * @returns {Boolean} 是否存在有效地形
         */
        getTileDataAvailable(x, y, level) {
            const providers = this._terrainProviders.filter(_ => {
                let valid = _.getTileDataAvailable(x, y, level);
                return valid;
                // if(!valid) {
                //     return false;
                // }
                // const rect = _.tilingScheme.tileXYToRectangle(x, y, level);
                // const intersection = Rectangle.intersection(rect, _.bounds);
                // return !!intersection;
            });       
            const sorted = providers.sort((a, b) => b.zIndex - a.zIndex);
            this._validProvider = sorted[0];
            if (this._validProvider) {
                return true;
            }
            return false;
        }
        /**
         * 请求地形数据
         * @param {*} x 
         * @param {*} y 
         * @param {*} level 
         * @param {*} request 
         * @returns {Promise}
         */
        requestTileGeometry(x, y, level, request) {
            for(let provider of this._terrainProviders) {
                if(provider !== this._validProvider) {
                    if(provider.getTileDataAvailable(x, y, level)) {
                        provider.requestTileGeometry(x, y, level);
                    }
                }
            }
            if (this._validProvider) {
                return this._validProvider.requestTileGeometry(x, y, level);
            }
        }
    }

    const BD_FACTOR = (3.14159265358979324 * 3000.0) / 180.0;
    const PI = 3.1415926535897932384626;
    const RADIUS = 6378245.0;
    const EE = 0.00669342162296594323;

    function delta(lon, lat) {
        let dLng = this.transformLng(lon - 105, lat - 35);
        let dLat = this.transformLat(lon - 105, lat - 35);
        const radLat = (lat / 180) * PI;
        let magic = Math.sin(radLat);
        magic = 1 - EE * magic * magic;
        const sqrtMagic = Math.sqrt(magic);
        dLng = (dLng * 180) / ((RADIUS / sqrtMagic) * Math.cos(radLat) * PI);
        dLat = (dLat * 180) / (((RADIUS * (1 - EE)) / (magic * sqrtMagic)) * PI);
        return [dLng, dLat]
    }
    /**
     * 坐标系相关方法
     * @namespace proj
     */
    const proj = {};
    /**
     * 通过epsg code获得Cesium预设的坐标系统
     * @param {string} [epsgCode = 'EPSG:3857'] epsg码，EPSG:3857获得Web墨卡托投影，EPSG:4326获得WGS84坐标系
     * @param {*} [options] 定义坐标系的详细参数，具体请参考WebMercatorTilingScheme和GeographicTilingScheme
     * 
     * @returns {Cesium.TilingScheme} 相应epsg code的坐标系
     * @see {@link Cesium.WebMercatorTilingScheme|WebMercatorTilingScheme}
     * @see {@link Cesium.GeographicTilingScheme|GeographicTilingScheme}
     * @example
     * new XYZLayer({
     *       url: Url.buildModuleUrl('assets/tiles/{z}/{x}/{y}.png'),
     *       maximumLevel: 4,
     *       tilingScheme: CesiumPro.proj.get("EPSG：3857")
     *  })
     *}
     */
    proj.get = function (epsgCode = 'EPSG:3857', options) {
        const code = epsgCode.toUpperCase();
        if (code === 'EPSG:3857') {
            return new Cesium.WebMercatorTilingScheme(options)
        } else if (code === 'EPSG:4326') {
            return new Cesium.GeographicTilingScheme(options);
        }
        throw new CesiumProError$1('未知的坐标系.')
    };
    /**
     * BD-09转GCJ-02
     * @param {Number} lon 经度坐标，-180~180之间
     * @param {Number} lat 纬度坐标，-90~90之间
     * @returns {LonLat.Lonlat}
     * @see {@link https://blog.csdn.net/a13570320979/article/details/51366355|百度09、GCJ02、WGS84坐标互转}
     */
    proj.BD09ToGCJ02 = function (lon, lat) {
        const x = +lon - 0.0065;
        const y = +lat - 0.006;
        const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * BD_FACTOR);
        const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * BD_FACTOR);
        const gg_lng = z * Math.cos(theta);
        const gg_lat = z * Math.sin(theta);
        return [gg_lng, gg_lat]
    };
    /**
      * GCJ-02转BD-09
      * @param {Number} lon 经度坐标，-180~180之间
      * @param {Number} lat 纬度坐标，-90~90之间
      * @returns {LonLat.Lonlat}
      * @see {@link https://blog.csdn.net/a13570320979/article/details/51366355|百度09、GCJ02、WGS84坐标互转}
      */
    proj.GCJ02ToBD09 = function (lon, lat) {
        lat = +lat;
        lon = +lon;
        const z =
            Math.sqrt(lon * lon + lat * lat) + 0.00002 * Math.sin(lat * BD_FACTOR);
        const theta = Math.atan2(lat, lon) + 0.000003 * Math.cos(lon * BD_FACTOR);
        const bd_lng = z * Math.cos(theta) + 0.0065;
        const bd_lat = z * Math.sin(theta) + 0.006;
        return [bd_lng, bd_lat]
    };

    /**
     * WGS-84转GCJ-02
     * @param {Number} lon 经度坐标，-180~180之间
     * @param {Number} lat 纬度坐标，-90~90之间
     * @returns {LonLat.Lonlat}
     * @see {@link https://blog.csdn.net/a13570320979/article/details/51366355|百度09、GCJ02、WGS84坐标互转}
     */
    proj.WGS84ToGCJ02 = function (lon, lat) {
        lat = +lat;
        lon = +lon;
        if (LonLat.inChina(lon, lat)) {
            const d = delta(lon, lat);
            return [lon + d[0], lat + d[1]];        
        } else {
            return [lon, lat];
        }
    };

    /**
     * GCJ-02转WGS-84
     * @param {Number} lon 经度坐标，-180~180之间
     * @param {Number} lat 纬度坐标，-90~90之间
     * @returns {LonLat.Lonlat}
     * @see {@link https://blog.csdn.net/a13570320979/article/details/51366355|百度09、GCJ02、WGS84坐标互转}
     */
    proj.GCJ02ToWGS84 = function (lon, lat) {
        lat = +lat;
        lon = +lon;
        if(LonLat.inChina(lon, lat)) {
            const d = delta(lon, lat);
            const mgLng = lon + d[0];
            const mgLat = lat + d[1];
            return [lon * 2 - mgLng, lat * 2 - mgLat]
        } else {
            return [lon, lat]
        }
    };

    const {
        Color: Color$8
    } = Cesium;
    class Selection{
        /**
         * 构造一个选择器，用于获取和所给边界相交的要素
         * toddo
         */
        constructor() {

        }
        /**
         * 被选中的点要素的颜色
         * @memberof Selection
         * @default Cesium.Color.AQUA
         */
        static pointColor = Color$8.AQUA;
        /**
         * 被选中的面要素的填充色
         * @memberof Selection
         * @default Cesium.Color.AQUA
         */
        static fillColor = Color$8.AQUA;
        /**
         * 被选中的线要素的颜色
         * @memberof Selection
         * @default Cesium.Color.AQUA
         */
        static strokeColor = Color$8.AQUA;
    }

    class XYZLayer extends Cesium.UrlTemplateImageryProvider {
        /**
         * 创建一个image图层，该图层通过使用X/Y/Z指定的URL模板请求图像。你可以用它来请求TMS,WMS标准的地图服务，甚至WMTS。
         * @extends Cesium.UrlTemplateImageryProvider
         * @param {Promise.<Object>|Object} options 具有以下属性
         * @param {Resource|String} options.url  瓦片的url模板，它支持以下关键字:
         * <ul>
         *     <li><code>{z}</code>: 瓦片的层级，第一层为0级</li>
         *     <li><code>{x}</code>: 切片方案中X的坐标，最左边为0</li>
         *     <li><code>{y}</code>: 切片方案中Y的坐标，最上边为0</li>
         *     <li><code>{s}</code>: 子域名</li>
         *     <li><code>{reverseX}</code>: 切片方案中X的坐标，最右边为0</li>
         *     <li><code>{reverseY}</code>: 切片方案中Y的坐标，最下边为0</li>
         *     <li><code>{reverseZ}</code>: 瓦片的层级，最大层级为0</li>
         *     <li><code>{westDegrees}</code>: 瓦片最左边的坐标，单位度</li>
         *     <li><code>{southDegrees}</code>: 瓦片最下边的坐标，单位度</li>
         *     <li><code>{eastDegrees}</code>: 瓦片最右边的坐标，单位度</li>
         *     <li><code>{northDegrees}</code>: 瓦片最上边的坐标，单位度</li>
         *     <li><code>{westProjected}</code>: 瓦片最左边的坐标，单位米</li>
         *     <li><code>{southProjected}</code>: 瓦片最下边的坐标，单位米</li>
         *     <li><code>{eastProjected}</code>: 瓦片最右边的坐标，单位米</li>
         *     <li><code>{northProjected}</code>: 瓦片最上边的坐标，单位米</li>
         *     <li><code>{width}</code>: 瓦片宽度，单位像素</li>
         *     <li><code>{height}</code>: 瓦片高度，单位像素</li>
         * </ul>
         * @param {Resource|String} [options.pickFeaturesUrl] 用于选择功能的 URL 模板，如果未定义
         *                 {@link XYZLayer#pickFeatures} 将返回undefined，表示未选中任何内容，该模板除了支持url的所有关键字外，还支持以下关键字:
         * <ul>
         *     <li><code>{i}</code>: 选择位置的列，单位像素，最左边为0。</li>
         *     <li><code>{j}</code>: 拾取位置的行，单位像素，最上边为0。</li>
         *     <li><code>{reverseI}</code>: 选择位置的列，单位像素，最右边为0。</li>
         *     <li><code>{reverseJ}</code>: 拾取位置的行，单位像素，最下边为0</li>
         *     <li><code>{longitudeDegrees}</code>: 拾取位置的经度，单位度</li>
         *     <li><code>{latitudeDegrees}</code>: 拾取位置的纬度，单位度</li>
         *     <li><code>{longitudeProjected}</code>: 拾取位置的经度，单位米</li>
         *     <li><code>{latitudeProjected}</code>: 拾取位置的纬度，单位米</li>
         *     <li><code>{format}</code>: 一个函数，用于定义信息的返回形式, 如{@link Cesium.GetFeatureInfoFormat}.</li>
         * </ul>
         * @param {Object} [options.urlSchemeZeroPadding] 设置坐标的位数，不足的以0填充，对于urlSchemeZeroPadding : { '{x}' : '0000'}
         * 如果x为12，将被填充为0012。它具有以下关键字：
         * <ul>
         *  <li> <code>{z}</code>: z关键字的填充方案</li>
         *  <li> <code>{x}</code>: x关键字的填充方案</li>
         *  <li> <code>{y}</code>: y关键字的填充方案</li>
         *  <li> <code>{reverseX}</code>: reverseX关键字的填充方案</li>
         *  <li> <code>{reverseY}</code>: reverseY关键字的填充方案</li>
         *  <li> <code>{reverseZ}</code>: reverseZ关键字的填充方案</li>
         * </ul>
         * @param {String|String[]} [options.subdomains='abc'] {s}占位符可用的子域名，如果该值为字符串，由字符串中的每个字符都是一个子域名。
         * @param {Credit|String} [options.credit=''] 数据源的版权信息.
         * @param {Number} [options.minimumLevel=0] 图层支持的最低细节级别。在指定最小级别的瓦片数量很少时要小心，较大的数字可能会导致渲染问题。
         * @param {Number} [options.maximumLevel] 图层支持的最大细节级别，如果未定义，则无限制。
         * @param {Rectangle} [options.rectangle=Cesium.Rectangle.MAX_VALUE] 瓦片覆盖范围，单位弧度。
         * @param {TilingScheme} [options.tilingScheme=Cesium.WebMercatorTilingScheme] 图层的坐标系，默认为墨卡托投影。
         * @param {Number} [options.tileWidth=256] 瓦片宽度。
         * @param {Number} [options.tileHeight=256] 瓦片高度。
         * @param {Boolean} [options.hasAlphaChannel=true] 瓦片图像是否拥有alpha通道，如果为false，内存使用量和加载时间将减少，但是会失去alpha通道的数据。
         * @param {GetFeatureInfoFormat[]} [options.getFeatureInfoFormats=XYZLayer.defaultFeatureInfoFormats]  {@link XYZLayer#pickFeatures} 调用时在指定位置获取特征信息的格式。如果未指定此参数，则禁用特征拾取。
         * @param {Boolean} [options.enablePickFeatures=true] 是否支持要素不支持，如果为true,XYZLayer#pickFeatures将请求pickFeaturesUrl并解析其内容，否则将返回undefined。
         * @param {Object} [options.customTags] 为URL模板自定义关键字。该对象的键必须为字符串，值为函数。
         * 
         * @example
         * // Access Natural Earth II imagery, which uses a TMS tiling scheme and Geographic (EPSG:4326) project
         * const tms = new CesiumPro.XYZLayer({
         *     url : Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII') + '/{z}/{x}/{reverseY}.jpg',
         *     credit : '© Analytical Graphics, Inc.',
         *     tilingScheme : new Cesium.GeographicTilingScheme(),
         *     maximumLevel : 5
         * });
         * // Access the CartoDB Positron basemap, which uses an OpenStreetMap-like tiling scheme.
         * const positron = new CesiumPro.XYZLayer({
         *     url : 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
         *     credit : 'Map tiles by CartoDB, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'
         * });
         * // Access a Web Map Service (WMS) server.
         * const wms = new CesiumPro.XYZLayer({
         *    url : 'https://programs.communications.gov.au/geoserver/ows?tiled=true&' +
         *          'transparent=true&format=image%2Fpng&exceptions=application%2Fvnd.ogc.se_xml&' +
         *          'styles=&service=WMS&version=1.1.1&request=GetMap&' +
         *          'layers=public%3AMyBroadband_Availability&srs=EPSG%3A3857&' +
         *          'bbox={westProjected}%2C{southProjected}%2C{eastProjected}%2C{northProjected}&' +
         *          'width=256&height=256',
         *    rectangle : Cesium.Rectangle.fromDegrees(96.799393, -43.598214999057824, 153.63925700000001, -9.2159219997013)
         * });
         * // Using custom tags in your template url.
         * const custom = new CesiumPro.XYZLayer({
         *    url : 'https://yoururl/{Time}/{z}/{y}/{x}.png',
         *    customTags : {
         *        Time: function(imageryProvider, x, y, level) {
         *            return '20171231'
         *        }
         *    }
         * });
         * // geoserver tms服务
         * const  geoserverTMS = new XYZLayer({
         *      url: 'http://localhost:8080/geoserver/gwc/service/tms/1.0.0/topp%3Astates@EPSG%3A4326@png/{z}/{x}/{reverseY}.png',
         *      tilingScheme: proj.get('EPSG:4326')
         *  })
         * // geoserver wms服务，并支持pick
         * const geoserverTMS = new XYZLayer({
         *      pickFeaturesUrl:'http://localhost:8080/geoserver/wms?service=WMS&version=1.1.1&request=GetFeatureInfo&layers=topp%3Astates&bbox={westProjected}%2C{southProjected}%2C{eastProjected}%2C{northProjected}&width={width}&height={height}&srs=EPSG%3A4326&query_layers=topp%3Astates&info_format={format}&x={i}&y={j}',
         *      url: 'http://localhost:8080/geoserver/topp/wms?service=WMS&version=1.1.1&request=GetMap&layers' +
         *          '=topp%3Astates&bbox={westDegrees}%2C{southDegrees}%2C{eastDegrees}%2C{northDegrees}&transparent=true&' +
         *           'width=768&height=330&srs=EPSG%3A4326&format=image/png',
         *      tilingScheme: proj.get('EPSG:4326'),
         *      getFeatureInfoFormats: [new Cesium.GetFeatureInfoFormat("xml", "text/xml")]
         * })
         * // geoserver WMTS服务
         * const layer = new XYZLayer({
         *     url: 'http://localhost:8080/geoserver/gwc/service/wmts?layer=topp%3Astates&style=&til' +
         *         'ematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={TileMatrix}' +
         *         '&TileCol={tileCol}&TileRow={tileRow}',
         *     tilingScheme: proj.get('EPSG:4326'),
         *     customTags: {
         *         TileMatrix: function (imageryProvider, x, y, level) {
         *             return 'EPSG:4326:' + level
         *         },
         *         tileCol: function (imageryProvider, x, y, level) {
         *             return y
         *         },
         *         tileRow: function (imageryProvider, x, y, level) {
         *             return x
         *         }
         *     }
         * })
         */
        constructor(options) {
            if (typeof options === 'string') {
                options = {url: options};
            }
            options.getFeatureInfoFormats = defaultValue$6(options.getFeatureInfoFormats, XYZLayer.defaultFeatureInfoFormats);
            super(options);
        }
        /**
         * 获取用于瓦片请求的URL，具有以下关键字：
         * <ul>
         *     <li><code>{z}</code>: 瓦片的层级，第一层为0级</li>
         *     <li><code>{x}</code>: 切片方案中X的坐标，最左边为0</li>
         *     <li><code>{y}</code>: 切片方案中Y的坐标，最上边为0</li>
         *     <li><code>{s}</code>: 子域名</li>
         *     <li><code>{reverseX}</code>: 切片方案中X的坐标，最右边为0</li>
         *     <li><code>{reverseY}</code>: 切片方案中Y的坐标，最下边为0</li>
         *     <li><code>{reverseZ}</code>: 瓦片的层级，最大层级为0</li>
         *     <li><code>{westDegrees}</code>: 瓦片最左边的坐标，单位度</li>
         *     <li><code>{southDegrees}</code>: 瓦片最下边的坐标，单位度</li>
         *     <li><code>{eastDegrees}</code>: 瓦片最右边的坐标，单位度</li>
         *     <li><code>{northDegrees}</code>: 瓦片最上边的坐标，单位度</li>
         *     <li><code>{westProjected}</code>: 瓦片最左边的坐标，单位米</li>
         *     <li><code>{southProjected}</code>: 瓦片最下边的坐标，单位米</li>
         *     <li><code>{eastProjected}</code>: 瓦片最右边的坐标，单位米</li>
         *     <li><code>{northProjected}</code>: 瓦片最上边的坐标，单位米</li>
         *     <li><code>{width}</code>: 瓦片宽度，单位像素</li>
         *     <li><code>{height}</code>: 瓦片高度，单位像素</li>
         * </ul>
         * @readonly
         * @returns {String} 获取用于瓦片请求的URL
         */
        get url() {
            return super.url;
        }
        /**
         * 可以请求的最小瓦片级别
         * @readonly
         * @type {Number}
         */
         get minimumLevel() {
            return super.minimumLevel;
        }
        /**
         * 可以请求的最大详细级别
         * @type {Number}
         * @readonly
         */
        get maximumLevel() {
            return super.maximumLevel;
        }
        /**
         * 图层的范围
         * @type {Cesium.Rectangle}
         * @readonly
         */
         get rectangle() {
            return super.rectangle;
        }
        /**
         * 获取影像错误时触发的事件
         * @type {Event}
         * @readonly
         */
        get errorEvent() {
            return super.errorEvent;
        }
        /**
         * 获取一个值，该值指示图层是否已准备好使用。
         * @readonly
         * @type {Boolean}
         */
        get ready() {
            return super.ready;
        }
        /**
         * 获取一个Promise，该图层准备好时将resolve
         * @readonly
         * @type {Promise<Boolean>}
         */
        get readyPromise() {
            return super.readyPromise;
        }
        /**
         * 图层的坐标系
         * @type {Cesium.TilingScheme}
         * @readonly
         */
        get tilingScheme() {
            return super.tilingScheme;
        }
        /**
         * 图层是否允许被pick
         * @default true
         */
        get enablePickFeatures() {
            return super.enablePickFeatures;
        }
        set enablePickFeatures(val) {
            super.enablePickFeatures = val;
        }

        /**
         * 确定哪些要素（如果有）位于图块内的给定经度和纬度。在{@link Cesium.ImageryProvider#ready}返回 true之前不应调用此函数。
         * 在数据图层ready之前，该函数不能被调用
         *
         * @param {Number} x 瓦片的x坐标。
         * @param {Number} y 瓦片的y坐标。
         * @param {Number} level 瓦片的层级。
         * @param {Number} longitude 选择要素的经度。
         * @param {Number} latitude  选择要素的纬度
         * @return {Promise.<Cesium.ImageryLayerFeatureInfo[]>|undefined} 
         */
        pickFeatures(x, y, level, longitude, latitude) {
            return super.pickFeatures(x, y, level, longitude, latitude);
        }
        /**
         * 请求指定瓦片
         * @param {Number} x 瓦片x坐标
         * @param {Number} y 瓦片y坐标
         * @param {Number} level 瓦片级别
         * @param {Cesium.Request} [request]
         * @returns {Promise.<HTMLImageElement|HTMLCanvasElement>|undefined} 如果瓦片解析成功，返回一个异步Promise，解析的图像可以是 Image 或 Canvas DOM 对象，否则返回undefined
         */
        requestImage(x, y, level, request) {
            return super.requestImage(x, y, level, request)
        }
    }
     /**
     * 默认数据解析格式
     * @constant
     * @type {Object}
     */
    XYZLayer.defaultFeatureInfoFormats = Object.freeze([
        Object.freeze(new Cesium.GetFeatureInfoFormat("json", "application/json")),
        Object.freeze(new Cesium.GetFeatureInfoFormat("xml", "text/xml")),
        Object.freeze(new Cesium.GetFeatureInfoFormat("text", "text/html")),
    ]);

    /**
     * CesiumPro提供的默认图层，该图层为离线图层，可以在无互联网的环境下使用。
     * @exports createDefaultLayer
     * @returns {XYZLayer} 一个可以在离线环境使用的XYZLayer。
     * @example
     * const viewer = new CesiumPro.Viewer('container', {
     *   imageryProvider:CesiumPro.createDefaultLayer()
     * })
     */
    function createDefaultLayer() {
        return new XYZLayer({
            url: Url.buildModuleUrl('assets/tiles/{z}/{x}/{y}.png'),
            maximumLevel: 4
        })
    }

    /*
     * @Author: zhangbo
     * @E-mail: zhangb@geovis.com.cn
     * @Date: 2020-02-25 15:57:44
     * @LastEditors: zhangbo
     * @LastEditTime: 2020-02-25 18:00:16
     * @Desc: 
     */
    const {
        defined: defined$6,
        defaultValue: defaultValue$4,
        ColorMaterialProperty: ColorMaterialProperty$1,
        ConstantPositionProperty: ConstantPositionProperty$1,
        ConstantProperty: ConstantProperty$1,
        DataSource: DataSource$1,
        PolygonGraphics: PolygonGraphics$1,
        PolylineGraphics: PolylineGraphics$1,
        EntityCluster,
        PinBuilder,
        createGuid: createGuid$2,
        Cartesian3: Cartesian3$6,
        PointGraphics: PointGraphics$1,
        ArcType: ArcType$1,
        PolygonHierarchy: PolygonHierarchy$1,
        Color: Color$7,
        EntityCollection,
        HeightReference: HeightReference$1,
        when: when$5,
        Resource: Resource$3,
        describe,
        Event: Event$6
    } = Cesium;
    const sizes$1 = {
        small: 24,
        medium: 48,
        large: 64
    };
    const crsLinkHrefs$1 = {};
    const crsLinkTypes$1 = {};
    const crsNames$1 = {
        "urn:ogc:def:crs:OGC:1.3:CRS84": defaultCrsFunction$1,
        "EPSG:4326": defaultCrsFunction$1,
        "urn:ogc:def:crs:EPSG::4326": defaultCrsFunction$1,
    };
    const simpleStyleIdentifiers$1 = [
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
    const geoJsonObjectTypes$1 = {
        Feature: processFeature$1,
        FeatureCollection: processFeatureCollection$1,
        GeometryCollection: processGeometryCollection$1,
        LineString: processLineString$1,
        MultiLineString: processMultiLineString$1,
        MultiPoint: processMultiPoint$1,
        MultiPolygon: processMultiPolygon$1,
        Point: processPoint$1,
        Polygon: processPolygon$1,
        Topology: processTopology$1
    };
    const geometryTypes$1 = {
        GeometryCollection: processGeometryCollection$1,
        LineString: processLineString$1,
        MultiLineString: processMultiLineString$1,
        MultiPoint: processMultiPoint$1,
        MultiPolygon: processMultiPolygon$1,
        Point: processPoint$1,
        Polygon: processPolygon$1,
        Topology: processTopology$1
    };

    function coordinatesArrayToCartesianArray$1(coordinates, crsFunction) {
        var positions = new Array(coordinates.length);
        for (var i = 0; i < coordinates.length; i++) {
            positions[i] = crsFunction(coordinates[i]);
        }
        return positions;
    }
    function createDescriptionCallback$1(describe, properties, nameProperty) {
        var description;
        return function (time, result) {
            if (!defined$6(description)) {
                description = describe(properties, nameProperty);
            }
            return description;
        };
    }
    // GeoJSON processing functions
    function createObject$1(geoJson, entityCollection, describe) {
        var id = geoJson.id;
        if (!defined$6(id) || geoJson.type !== 'Feature') {
            id = createGuid$2();
        } else {
            var i = 2;
            var finalId = id;
            while (defined$6(entityCollection.getById(finalId))) {
                finalId = id + '_' + i;
                i++;
            }
            id = finalId;
        }

        var entity = entityCollection.getOrCreateEntity(id);
        var properties = geoJson.properties;
        if (defined$6(properties)) {
            entity.properties = properties;

            var nameProperty;

            //Check for the simplestyle specified name first.
            var name = properties.title;
            if (defined$6(name)) {
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
                if (defined$6(nameProperty)) {
                    entity.name = properties[nameProperty];
                }
            }

            var description = properties.description;
            if (description !== null) {
                entity.description = !defined$6(description) ? describe(properties, nameProperty) : new ConstantProperty$1(description);
            }
        }
        return entity;
    }
    function processFeature$1(dataSource, feature, notUsed, crsFunction, options) {
        if (feature.geometry === null) {
            //Null geometry is allowed, so just create an empty entity instance for it.
            createObject$1(feature, dataSource._entityCollection, options.describe);
            return;
        }

        if (!defined$6(feature.geometry)) {
            throw new CesiumProError$1('feature.geometry is required.');
        }

        var geometryType = feature.geometry.type;
        var geometryHandler = geometryTypes$1[geometryType];
        if (!defined$6(geometryHandler)) {
            throw new CesiumProError$1('Unknown geometry type: ' + geometryType);
        }
        geometryHandler(dataSource, feature, feature.geometry, crsFunction, options);
    }

    function processFeatureCollection$1(dataSource, featureCollection, notUsed, crsFunction, options) {
        var features = featureCollection.features;
        for (var i = 0, len = features.length; i < len; i++) {
            processFeature$1(dataSource, features[i], undefined, crsFunction, options);
        }
    }

    function processGeometryCollection$1(dataSource, geoJson, geometryCollection, crsFunction, options) {
        var geometries = geometryCollection.geometries;
        for (var i = 0, len = geometries.length; i < len; i++) {
            var geometry = geometries[i];
            var geometryType = geometry.type;
            var geometryHandler = geometryTypes$1[geometryType];
            if (!defined$6(geometryHandler)) {
                throw new CesiumProError$1('Unknown geometry type: ' + geometryType);
            }
            geometryHandler(dataSource, geoJson, geometry, crsFunction, options);
        }
    }

    function createPoint$1(dataSource, geoJson, crsFunction, coordinates, options) {
        let size = options.pointSize;
        let color = options.pointColor;
        const properties = geoJson.properties;
        if (defined$6(properties)) {
            const cssColor = properties['point-color'];
            if (defined$6(cssColor)) {
                color = Color$7.fromCssColorString(cssColor);
            }

            size = defaultValue$4(sizes$1[properties['point-size']], size);
        }
        const point = new PointGraphics$1();

        // Clamp to ground if there isn't a height specified
        if (coordinates.length === 2 && options.clampToGround) {
            point.heightReference = HeightReference$1.CLAMP_TO_GROUND;
        }

        const entity = createObject$1(geoJson, dataSource._entityCollection, options.describe);
        entity.point = point;
        entity.point.color = color;
        entity.point.pixelSize = size;
        entity.position = new ConstantPositionProperty$1(crsFunction(coordinates));
    }

    function processPoint$1(dataSource, geoJson, geometry, crsFunction, options) {
        createPoint$1(dataSource, geoJson, crsFunction, geometry.coordinates, options);
    }

    function processMultiPoint$1(dataSource, geoJson, geometry, crsFunction, options) {
        var coordinates = geometry.coordinates;
        for (var i = 0; i < coordinates.length; i++) {
            createPoint$1(dataSource, geoJson, crsFunction, coordinates[i], options);
        }
    }

    function createLineString$1(dataSource, geoJson, crsFunction, coordinates, options) {
        const material = options.lineColor;
        const widthProperty = options.lineWidth;

        const properties = geoJson.properties;
        if (defined$6(properties)) {
            const width = properties['stroke-width'];
            if (defined$6(width)) {
                widthProperty = new ConstantProperty$1(width);
            }

            let color;
            let stroke = properties.stroke;
            if (defined$6(stroke)) {
                color = Color$7.fromCssColorString(stroke);
            }
            let opacity = properties['stroke-opacity'];
            if (defined$6(opacity) && opacity !== 1.0) {
                if (!defined$6(color)) {
                    color = material.color.clone();
                }
                color.alpha = opacity;
            }
            if (defined$6(color)) {
                material = new ColorMaterialProperty$1(color);
            }
        }

        const entity = createObject$1(geoJson, dataSource._entityCollection, options.describe);
        const polylineGraphics = new PolylineGraphics$1();
        entity.polyline = polylineGraphics;

        polylineGraphics.clampToGround = options.clampToGround;
        polylineGraphics.material = material;
        polylineGraphics.width = widthProperty;
        polylineGraphics.positions = new ConstantProperty$1(coordinatesArrayToCartesianArray$1(coordinates, crsFunction));
        polylineGraphics.arcType = ArcType$1.RHUMB;
    }
    function defaultDescribe$1(properties, nameProperty) {
        var html = "";
        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                if (key === nameProperty || simpleStyleIdentifiers$1.indexOf(key) !== -1) {
                    continue;
                }
                var value = properties[key];
                if (defined$6(value)) {
                    if (typeof value === "object") {
                        html +=
                            "<tr><th>" +
                            key +
                            "</th><td>" +
                            defaultDescribe$1(value) +
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
    function processLineString$1(dataSource, geoJson, geometry, crsFunction, options) {
        createLineString$1(dataSource, geoJson, crsFunction, geometry.coordinates, options);
    }

    function processMultiLineString$1(dataSource, geoJson, geometry, crsFunction, options) {
        var lineStrings = geometry.coordinates;
        for (var i = 0; i < lineStrings.length; i++) {
            createLineString$1(dataSource, geoJson, crsFunction, lineStrings[i], options);
        }
    }

    function createPolygon$1(dataSource, geoJson, crsFunction, coordinates, options) {
        if (coordinates.length === 0 || coordinates[0].length === 0) {
            return;
        }

        let outlineColor = options.outlineColor.color;
        let material = options.fill;
        let outlineWidth = options.outlineWidth;

        const properties = geoJson.properties;
        if (defined$6(properties)) {
            const width = properties['stroke-width'];
            if (defined$6(width)) {
                outlineWidth = new ConstantProperty$1(width);
            }
            let color;
            const stroke = properties.stroke;
            if (defined$6(stroke)) {
                color = Color$7.fromCssColorString(stroke);
            }
            let opacity = properties['stroke-opacity'];
            if (defined$6(opacity) && opacity !== 1.0) {
                if (!defined$6(color)) {
                    color = options.outlineColor.color.clone();
                }
                color.alpha = opacity;
            }

            if (defined$6(color)) {
                outlineColor = new ConstantProperty$1(color);
            }

            let fillColor;
            const fill = properties.fill;
            if (defined$6(fill)) {
                fillColor = Color$7.fromCssColorString(fill);
                fillColor.alpha = material.color.alpha;
            }
            opacity = properties['fill-opacity'];
            if (defined$6(opacity) && opacity !== material.color.alpha) {
                if (!defined$6(fillColor)) {
                    fillColor = material.color.clone();
                }
                fillColor.alpha = opacity;
            }
            if (defined$6(fillColor)) {
                material = new ColorMaterialProperty$1(fillColor);
            }
        }

        const polygon = new PolygonGraphics$1();
        polygon.outline = new ConstantProperty$1(options.outline);
        polygon.outlineColor = outlineColor;
        polygon.outlineWidth = outlineWidth;
        polygon.material = material;
        polygon.arcType = ArcType$1.RHUMB;

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
                        if(!(defined$6(value) && defined$6(value[1]))) {
                            continue;
                        }
                        extrudeValue = extrudeValue.replace(con, properties[value[1]]);
                    }
                    try {
                        const height = window.eval(extrudeValue);
                        if(typeof height === 'number') {
                            polygon.extrudedHeight = height;
                        }
                    }catch(e) {

                    }
                }
            }
        }

        const holes = [];
        for (var i = 1, len = coordinates.length; i < len; i++) {
            holes.push(new PolygonHierarchy$1(coordinatesArrayToCartesianArray$1(coordinates[i], crsFunction)));
        }

        const positions = coordinates[0];
        polygon.hierarchy = new ConstantProperty$1(new PolygonHierarchy$1(coordinatesArrayToCartesianArray$1(positions, crsFunction), holes));
        if (positions[0].length > 2) {
            polygon.perPositionHeight = new ConstantProperty$1(true);
        } else if (!options.clampToGround) {
            polygon.height = 0;
        }

        const entity = createObject$1(geoJson, dataSource._entityCollection, options.describe);
        entity.polygon = polygon;
    }

    function processPolygon$1(dataSource, geoJson, geometry, crsFunction, options) {
        createPolygon$1(dataSource, geoJson, crsFunction, geometry.coordinates, options);
    }

    function processMultiPolygon$1(dataSource, geoJson, geometry, crsFunction, options) {
        var polygons = geometry.coordinates;
        for (var i = 0; i < polygons.length; i++) {
            createPolygon$1(dataSource, geoJson, crsFunction, polygons[i], options);
        }
    }

    function processTopology$1(dataSource, geoJson, geometry, crsFunction, options) {
        for (var property in geometry.objects) {
            if (geometry.objects.hasOwnProperty(property)) {
                var feature = topojson.feature(geometry, geometry.objects[property]);
                var typeHandler = geoJsonObjectTypes$1[feature.type];
                typeHandler(dataSource, feature, feature, crsFunction, options);
            }
        }
    }
    function defaultDescribeProperty$1(properties, nameProperty) {
        return new Cesium.CallbackProperty(createDescriptionCallback$1(defaultDescribe$1, properties, nameProperty), true);
    }
    function defaultCrsFunction$1(coordinates) {
        return Cartesian3$6.fromDegrees(coordinates[0], coordinates[1], coordinates[2]);
    }
    function load$1(that, geoJson, options, sourceUri) {
        let name;
        if (defined$6(sourceUri)) {
            name = Cesium.getFilenameFromUri(sourceUri);
        }

        if (defined$6(name) && that._name !== name) {
            that._name = name;
            that._changed.raiseEvent(that);
        }

        const typeHandler = geoJsonObjectTypes$1[geoJson.type];
        if (!defined$6(typeHandler)) {
            throw new CesiumProError$1('Unsupported GeoJSON object type: ' + geoJson.type);
        }

        //Check for a Coordinate Reference System.
        const crs = geoJson.crs;
        let crsFunction = crs !== null ? defaultCrsFunction$1 : null;

        if (defined$6(crs)) {
            if (!defined$6(crs.properties)) {
                throw new CesiumProError$1('crs.properties is undefined.');
            }

            const properties = crs.properties;
            if (crs.type === 'name') {
                crsFunction = crsNames$1[properties.name];
                if (!defined$6(crsFunction)) {
                    throw new CesiumProError$1('Unknown crs name: ' + properties.name);
                }
            } else if (crs.type === 'link') {
                var handler = crsLinkHrefs$1[properties.href];
                if (!defined$6(handler)) {
                    handler = crsLinkTypes$1[properties.type];
                }

                if (!defined$6(handler)) {
                    throw new CesiumProError$1('Unable to resolve crs link: ' + JSON.stringify(properties));
                }

                crsFunction = handler(properties);
            } else if (crs.type === 'EPSG') {
                crsFunction = crsNames$1['EPSG:' + properties.code];
                if (!defined$6(crsFunction)) {
                    throw new CesiumProError$1('Unknown crs EPSG code: ' + properties.code);
                }
            } else {
                throw new CesiumProError$1('Unknown crs type: ' + crs.type);
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
                DataSource$1.setLoading(that, false);
                return that;
            });
        });
    }
    class GeoJsonDataSource {
        /**
         * 创建一个GeoJson数据源
         * @param {String} [name] 数据源名称
         * @example
         *  // 全局设置贴地
         *  CesiumPro.GeoJsonDataSource.clampToGround = true
         *  // 全局修改线样式
         *  CesiumPro.GeoJsonDataSource.lineColor = Cesium.Color.RED;
         *  CesiumPro.GeoJsonDataSource.lineWidth = 1;
         *  const linstring = CesiumPro.GeoJsonDataSource.load('../data/geojson/railway.geojson')
         *  // 修改该多边形的样式
         *  const polygon = CesiumPro.GeoJsonDataSource.load('../data/geojson/province.geojson', {
         *      fill: Cesium.Color.GOLD,
         *      outline: false
         *  })
         *  // 使用全局方法修改点的颜色
         *  CesiumPro.GeoJsonDataSource.pointColor = Cesium.Color.BLUE;
         *  // 单独修本次加载点的大小
         *  const point = CesiumPro.GeoJsonDataSource.load('../data/geojson/city.geojson', {
         *      pointSize: 6
         *  })
         * // 多边形拉伸
         *  const geojson = CesiumPro.GeoJsonDataSource.load('../data/geojson/building.geojson', {
         *      extrudedHeight: '${Floor} * 10'
         *  })
         *  parent.viewer = viewer;
         *  viewer.addLayer(geojson);
         *  viewer.flyTo(geojson)
         */
        constructor(name) {
            this._name = name;
            this._changed = new Event$6();
            this._error = new Event$6();
            this._isLoading = false;
            this._loading = new Event$6();
            this._entityCollection = new EntityCollection(this);
            this._promises = [];
            this._pinBuilder = new PinBuilder();
            this._entityCluster = new EntityCluster();
            this._credit = undefined;
            this._resourceCredits = [];
        }
        /**
         * 点要素的默认大小
         * @type {Number}
         * @memberof GeoJsonDataSource
         * @default 5
         */
        static pointSize = 5;
        /**
         * 点要素的默认颜色
         * @memberof GeoJsonDataSource
         * @type {Cesium.Color}
         * @default Cesium.Color.ROYALBLUE
         */
        static pointColor = Color$7.ROYALBLUE;
        /**
         * 线要素的颜色
         * @memberof GeoJsonDataSource
         * @type {Cesium.Color}
         * @default Cesium.Color.YELLOW
         */
        static lineColor = Color$7.YELLOW;
        /**
         * 多边形要素的填充色
         * @memberof GeoJsonDataSource
         * @type {Cesium.Color}
         * @default Cesium.Color.fromBytes(255, 255, 0, 100)
         */
        static fill = Color$7.fromBytes(255, 255, 0, 100);
        /**
         * 多边形要素是否显边框
         * @memberof GeoJsonDataSource
         * @type {Boolean}
         * @default true
         */
        static outline = true;
        /**
         * 多边形要素边框的颜色
         * @memberof GeoJsonDataSource
         * @type {Cesium.Color}
         * @default Cesium.Color.YELLOW
         */
        static outlineColor = Color$7.YELLOW;
        /**
         * 线要素的宽度
         * @memberof GeoJsonDataSource
         * @type {Number}
         * @default 2
         */
        static lineWidth = 2;
        /**
         * 是否贴地。
         * @type {Boolean}
         * @default false
         * @memberof GeoJsonDataSource
         */
        static clampToGround = false;
        /**
         * 多边形要素的边框宽度，该属性在windows环境下可能不生效
         * @default 1
         * @type {Number}
         * @memberof GeoJsonDataSource
         */
        static outlineWidth = 1;
        static crsNames() {
            return crsNames$1;
        }
        static crsLinkHrefs() {
            return crsLinkHrefs$1;
        }
        static crsLinkTypes() {
            return crsLinkTypes$1;
        }
        /**
         * 该数据源中的entity
         * @type {Cesium.EntityCollection}
         * @readonly
         */
        get entities() {
            return this._entityCollection;
        }
        /**
         * 数据源名称
         * @type {String}
         */
        get name() {
            return this._name;
        }
        set name(value) {
            if (this._name !== value) {
                this._name = value;
                this._changed.raiseEvent(this);
            }
        }
        get clock() {
            return undefined
        }
        /**
         * 指示该数据源是否正在加载数据
         * @readonly
         * @type {Boolean}
         */
        get isLoading() {
            return this._isLoading;
        }
        /**
         * 数据发生变化时触发的事件
         * @type {Event}
         * @readonly
         */
        get changedEvent() {
            return this._changed;
        }
        /**
         * 数据加载出错时触发的事件
         * @type {Event}
         * @readonly
         */
        get errorEvent() {
            return this._error;
        }
        /**
         * 数据源开始或结束加载时触发的事件
         * @readonly
         * @type {Event}
         */
        get loadingEvent() {
            return this._loading;
        }
        /**
         * 是否显示数据源
         * @type {Boolean}
         * @default true
         */
        get show() {
            return this._entityCollection.show;
        }
        set show(val) {
            this._entityCollection.show = val;
        }
        /**
         * 数据源的聚合参数
         * @type {Cesium.EntityCluster}
         */
        get clustering() {
            return this._entityCluster
        }
        set clustering(value) {
            //>>includeStart('debug', pragmas.debug);
            if (!defined$6(value)) {
                throw new DeveloperError("value must be defined.");
            }
            //>>includeEnd('debug');
            this._entityCluster = value;
        }
        /**
         * 版权信息
         * @type {Cesium.Credit}
         */
        get credit() {
            return this._credit;
        }
        /** 
         * 加载GeoJson数据
         * @param {Cesium.Resource|String} data geojson文件路径或geojson字符串
         * @param {GeoJsonDataSource.LoadOptions} options 样式配置参数
         * @returns {Promise<GeoJsonDataSource>}
         */
        load(data, options) {
            //>>includeStart('debug', pragmas.debug);
            if (!defined$6(data)) {
                throw new CesiumProError$1("data is required.");
            }
            //>>includeEnd('debug');

            DataSource$1.setLoading(this, true);
            options = defaultValue$4(options, {});

            // User specified credit
            let credit = options.credit;
            if (typeof credit === "string") {
                credit = new Credit(credit);
            }
            this._credit = credit;

            let promise = data;
            let sourceUri = options.sourceUri;
            if (typeof data === "string" || data instanceof Resource$3) {
                data = Resource$3.createIfNeeded(data);
                promise = data.fetchJson();
                sourceUri = defaultValue$4(sourceUri, data.getUrlComponent());

                // Add resource credits to our list of credits to display
                const resourceCredits = this._resourceCredits;
                const credits = data.credits;
                if (defined$6(credits)) {
                    const length = credits.length;
                    for (const i = 0; i < length; i++) {
                        resourceCredits.push(credits[i]);
                    }
                }
            }

            options = {
                describe: defaultValue$4(options.describe, defaultDescribeProperty$1),
                pointSize: defaultValue$4(options.pointSize, GeoJsonDataSource.pointSize),
                pointColor: defaultValue$4(options.pointColor, GeoJsonDataSource.pointColor),
                lineWidth: new ConstantProperty$1(
                    defaultValue$4(options.lineWidth, GeoJsonDataSource.lineWidth)
                ),
                outlineColor: new ColorMaterialProperty$1(
                    defaultValue$4(options.outlineColor, GeoJsonDataSource.outlineColor)
                ),
                lineColor: new ColorMaterialProperty$1(defaultValue$4(options.lineColor, GeoJsonDataSource.lineColor)),
                outlineWidth: defaultValue$4(options.outlineWidth, GeoJsonDataSource.outlineWidth),
                fill: new ColorMaterialProperty$1(
                    defaultValue$4(options.fill, GeoJsonDataSource.fill)
                ),
                outline: defaultValue$4(options.outline, GeoJsonDataSource.outline),
                clampToGround: defaultValue$4(options.clampToGround, GeoJsonDataSource.clampToGround),
                extrudedHeight: options.extrudedHeight
            };

            const that = this;
            return when$5(promise, function (geoJson) {
                return load$1(that, geoJson, options, sourceUri);
            }).otherwise(function (error) {
                DataSource$1.setLoading(that, false);
                that._error.raiseEvent(that, error);
                console.log(error);
                return when$5.reject(error);
            });
        };
        update() {
            return true;
        }
    }

    /**
     * 加载GeoJson数据
     * @param {Cesium.Resource|String} data geojson文件路径或geojson字符串
     * @param {GeoJsonDataSource.LoadOptions} options 样式配置参数
     * @returns {Promise<GeoJsonDataSource>}
     */
    GeoJsonDataSource.load = function (data, options) {
        return new GeoJsonDataSource().load(data, options)
    };

    const exports$1 = {};
    var array_cancel = function() {
      this._array = null;
      return Promise.resolve();
    };

    var array_read = function() {
      var array = this._array;
      this._array = null;
      return Promise.resolve(array ? {done: false, value: array} : {done: true, value: undefined});
    };

    function array(array) {
      return new ArraySource(array instanceof Uint8Array ? array : new Uint8Array(array));
    }

    function ArraySource(array) {
      this._array = array;
    }

    ArraySource.prototype.read = array_read;
    ArraySource.prototype.cancel = array_cancel;

    var fetchPath = function(url) {
      return fetch(url).then(function(response) {
        return response.body && response.body.getReader
            ? response.body.getReader()
            : response.arrayBuffer().then(array);
      });
    };

    var requestPath = function(url) {
      return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest;
        request.responseType = "arraybuffer";
        request.onload = function() { resolve(array(request.response)); };
        request.onerror = reject;
        request.ontimeout = reject;
        request.open("GET", url, true);
        request.send();
      });
    };

    function path(path) {
      return (typeof fetch === "function" ? fetchPath : requestPath)(path);
    }

    function stream(source) {
      return typeof source.read === "function" ? source : source.getReader();
    }

    var empty = new Uint8Array(0);

    var slice_cancel = function() {
      return this._source.cancel();
    };

    function concat(a, b) {
      if (!a.length) return b;
      if (!b.length) return a;
      var c = new Uint8Array(a.length + b.length);
      c.set(a);
      c.set(b, a.length);
      return c;
    }

    var slice_read = function() {
      var that = this, array = that._array.subarray(that._index);
      return that._source.read().then(function(result) {
        that._array = empty;
        that._index = 0;
        return result.done ? (array.length > 0
            ? {done: false, value: array}
            : {done: true, value: undefined})
            : {done: false, value: concat(array, result.value)};
      });
    };

    var slice_slice = function(length) {
      if ((length |= 0) < 0) throw new Error("invalid length");
      var that = this, index = this._array.length - this._index;

      // If the request fits within the remaining buffer, resolve it immediately.
      if (this._index + length <= this._array.length) {
        return Promise.resolve(this._array.subarray(this._index, this._index += length));
      }

      // Otherwise, read chunks repeatedly until the request is fulfilled.
      var array = new Uint8Array(length);
      array.set(this._array.subarray(this._index));
      return (function read() {
        return that._source.read().then(function(result) {

          // When done, it’s possible the request wasn’t fully fullfilled!
          // If so, the pre-allocated array is too big and needs slicing.
          if (result.done) {
            that._array = empty;
            that._index = 0;
            return index > 0 ? array.subarray(0, index) : null;
          }

          // If this chunk fulfills the request, return the resulting array.
          if (index + result.value.length >= length) {
            that._array = result.value;
            that._index = length - index;
            array.set(result.value.subarray(0, length - index), index);
            return array;
          }

          // Otherwise copy this chunk into the array, then read the next chunk.
          array.set(result.value, index);
          index += result.value.length;
          return read();
        });
      })();
    };

    function slice(source) {
      return typeof source.slice === "function" ? source :
          new SliceSource(typeof source.read === "function" ? source
              : source.getReader());
    }

    function SliceSource(source) {
      this._source = source;
      this._array = empty;
      this._index = 0;
    }

    SliceSource.prototype.read = slice_read;
    SliceSource.prototype.slice = slice_slice;
    SliceSource.prototype.cancel = slice_cancel;

    var dbf_cancel = function() {
      return this._source.cancel();
    };

    var readBoolean = function(value) {
      return /^[nf]$/i.test(value) ? false
          : /^[yt]$/i.test(value) ? true
          : null;
    };

    var readDate = function(value) {
      return new Date(+value.substring(0, 4), value.substring(4, 6) - 1, +value.substring(6, 8));
    };

    var readNumber = function(value) {
      return !(value = value.trim()) || isNaN(value = +value) ? null : value;
    };

    var readString = function(value) {
      return value.trim() || null;
    };

    var types = {
      B: readNumber,
      C: readString,
      D: readDate,
      F: readNumber,
      L: readBoolean,
      M: readNumber,
      N: readNumber
    };

    var dbf_read = function() {
      var that = this, i = 1;
      return that._source.slice(that._recordLength).then(function(value) {
        return value && (value[0] !== 0x1a) ? {done: false, value: that._fields.reduce(function(p, f) {
          p[f.name] = types[f.type](that._decode(value.subarray(i, i += f.length)));
          return p;
        }, {})} : {done: true, value: undefined};
      });
    };

    var view = function(array) {
      return new DataView(array.buffer, array.byteOffset, array.byteLength);
    };

    var dbf = function(source, decoder) {
      source = slice(source);
      return source.slice(32).then(function(array) {
        var head = view(array);
        return source.slice(head.getUint16(8, true) - 32).then(function(array) {
          return new Dbf(source, decoder, head, view(array));
        });
      });
    };

    function Dbf(source, decoder, head, body) {
      this._source = source;
      this._decode = decoder.decode.bind(decoder);
      this._recordLength = head.getUint16(10, true);
      this._fields = [];
      for (var n = 0; body.getUint8(n) !== 0x0d; n += 32) {
        for (var j = 0; j < 11; ++j) if (body.getUint8(n + j) === 0) break;
        this._fields.push({
          name: this._decode(new Uint8Array(body.buffer, body.byteOffset + n, j)),
          type: String.fromCharCode(body.getUint8(n + 11)),
          length: body.getUint8(n + 16)
        });
      }
    }

    var prototype = Dbf.prototype;
    prototype.read = dbf_read;
    prototype.cancel = dbf_cancel;

    function cancel() {
      return this._source.cancel();
    }

    var parseMultiPoint = function(record) {
      var i = 40, j, n = record.getInt32(36, true), coordinates = new Array(n);
      for (j = 0; j < n; ++j, i += 16) coordinates[j] = [record.getFloat64(i, true), record.getFloat64(i + 8, true)];
      return {type: "MultiPoint", coordinates: coordinates};
    };

    var parseNull = function() {
      return null;
    };

    var parsePoint = function(record) {
      return {type: "Point", coordinates: [record.getFloat64(4, true), record.getFloat64(12, true)]};
    };

    var parsePolygon = function(record) {
      var i = 44, j, n = record.getInt32(36, true), m = record.getInt32(40, true), parts = new Array(n), points = new Array(m), polygons = [], holes = [];
      for (j = 0; j < n; ++j, i += 4) parts[j] = record.getInt32(i, true);
      for (j = 0; j < m; ++j, i += 16) points[j] = [record.getFloat64(i, true), record.getFloat64(i + 8, true)];

      parts.forEach(function(i, j) {
        var ring = points.slice(i, parts[j + 1]);
        if (ringClockwise(ring)) polygons.push([ring]);
        else holes.push(ring);
      });

      holes.forEach(function(hole) {
        polygons.some(function(polygon) {
          if (ringContainsSome(polygon[0], hole)) {
            polygon.push(hole);
            return true;
          }
        }) || polygons.push([hole]);
      });

      return polygons.length === 1
          ? {type: "Polygon", coordinates: polygons[0]}
          : {type: "MultiPolygon", coordinates: polygons};
    };

    function ringClockwise(ring) {
      if ((n = ring.length) < 4) return false;
      var i = 0, n, area = ring[n - 1][1] * ring[0][0] - ring[n - 1][0] * ring[0][1];
      while (++i < n) area += ring[i - 1][1] * ring[i][0] - ring[i - 1][0] * ring[i][1];
      return area >= 0;
    }

    function ringContainsSome(ring, hole) {
      var i = -1, n = hole.length, c;
      while (++i < n) {
        if (c = ringContains(ring, hole[i])) {
          return c > 0;
        }
      }
      return false;
    }

    function ringContains(ring, point) {
      var x = point[0], y = point[1], contains = -1;
      for (var i = 0, n = ring.length, j = n - 1; i < n; j = i++) {
        var pi = ring[i], xi = pi[0], yi = pi[1],
            pj = ring[j], xj = pj[0], yj = pj[1];
        if (segmentContains(pi, pj, point)) {
          return 0;
        }
        if (((yi > y) !== (yj > y)) && ((x < (xj - xi) * (y - yi) / (yj - yi) + xi))) {
          contains = -contains;
        }
      }
      return contains;
    }

    function segmentContains(p0, p1, p2) {
      var x20 = p2[0] - p0[0], y20 = p2[1] - p0[1];
      if (x20 === 0 && y20 === 0) return true;
      var x10 = p1[0] - p0[0], y10 = p1[1] - p0[1];
      if (x10 === 0 && y10 === 0) return false;
      var t = (x20 * x10 + y20 * y10) / (x10 * x10 + y10 * y10);
      return t < 0 || t > 1 ? false : t === 0 || t === 1 ? true : t * x10 === x20 && t * y10 === y20;
    }

    var parsePolyLine = function(record) {
      var i = 44, j, n = record.getInt32(36, true), m = record.getInt32(40, true), parts = new Array(n), points = new Array(m);
      for (j = 0; j < n; ++j, i += 4) parts[j] = record.getInt32(i, true);
      for (j = 0; j < m; ++j, i += 16) points[j] = [record.getFloat64(i, true), record.getFloat64(i + 8, true)];
      return n === 1
          ? {type: "LineString", coordinates: points}
          : {type: "MultiLineString", coordinates: parts.map(function(i, j) { return points.slice(i, parts[j + 1]); })};
    };

    var concat$1 = function(a, b) {
      var ab = new Uint8Array(a.length + b.length);
      ab.set(a, 0);
      ab.set(b, a.length);
      return ab;
    };

    var shp_read = function() {
      var that = this;
      ++that._index;
      return that._source.slice(12).then(function(array) {
        if (array == null) return {done: true, value: undefined};
        var header = view(array);

        // If the record starts with an invalid shape type (see #36), scan ahead in
        // four-byte increments to find the next valid record, identified by the
        // expected index, a non-empty content length and a valid shape type.
        function skip() {
          return that._source.slice(4).then(function(chunk) {
            if (chunk == null) return {done: true, value: undefined};
            header = view(array = concat$1(array.slice(4), chunk));
            return header.getInt32(0, false) !== that._index ? skip() : read();
          });
        }

        // All records should have at least four bytes (for the record shape type),
        // so an invalid content length indicates corruption.
        function read() {
          var length = header.getInt32(4, false) * 2 - 4, type = header.getInt32(8, true);
          return length < 0 || (type && type !== that._type) ? skip() : that._source.slice(length).then(function(chunk) {
            return {done: false, value: type ? that._parse(view(concat$1(array.slice(8), chunk))) : null};
          });
        }

        return read();
      });
    };

    var parsers = {
      0: parseNull,
      1: parsePoint,
      3: parsePolyLine,
      5: parsePolygon,
      8: parseMultiPoint,
      11: parsePoint, // PointZ
      13: parsePolyLine, // PolyLineZ
      15: parsePolygon, // PolygonZ
      18: parseMultiPoint, // MultiPointZ
      21: parsePoint, // PointM
      23: parsePolyLine, // PolyLineM
      25: parsePolygon, // PolygonM
      28: parseMultiPoint // MultiPointM
    };

    var shp = function(source) {
      source = slice(source);
      return source.slice(100).then(function(array) {
        return new Shp(source, view(array));
      });
    };

    function Shp(source, header) {
      var type = header.getInt32(32, true);
      if (!(type in parsers)) throw new Error("unsupported shape type: " + type);
      this._source = source;
      this._type = type;
      this._index = 0;
      this._parse = parsers[type];
      this.bbox = [header.getFloat64(36, true), header.getFloat64(44, true), header.getFloat64(52, true), header.getFloat64(60, true)];
    }

    var prototype$2 = Shp.prototype;
    prototype$2.read = shp_read;
    prototype$2.cancel = cancel;

    function noop() {}

    var shapefile_cancel = function() {
      return Promise.all([
        this._dbf && this._dbf.cancel(),
        this._shp.cancel()
      ]).then(noop);
    };

    var shapefile_read = function() {
      var that = this;
      return Promise.all([
        that._dbf ? that._dbf.read() : {value: {}},
        that._shp.read()
      ]).then(function(results) {
        var dbf = results[0], shp = results[1];
        return shp.done ? shp : {
          done: false,
          value: {
            type: "Feature",
            properties: dbf.value,
            geometry: shp.value
          }
        };
      });
    };

    var shapefile = function(shpSource, dbfSource, decoder) {
      return Promise.all([
        shp(shpSource),
        dbfSource && dbf(dbfSource, decoder)
      ]).then(function(sources) {
        return new Shapefile(sources[0], sources[1]);
      });
    };

    function Shapefile(shp$$1, dbf$$1) {
      this._shp = shp$$1;
      this._dbf = dbf$$1;
      this.bbox = shp$$1.bbox;
    }

    var prototype$1 = Shapefile.prototype;
    prototype$1.read = shapefile_read;
    prototype$1.cancel = shapefile_cancel;

    function open(shp$$1, dbf$$1, options) {
      if (typeof dbf$$1 === "string") {
        if (!/\.dbf$/.test(dbf$$1)) dbf$$1 += ".dbf";
        dbf$$1 = path(dbf$$1);
      } else if (dbf$$1 instanceof ArrayBuffer || dbf$$1 instanceof Uint8Array) {
        dbf$$1 = array(dbf$$1);
      } else if (dbf$$1 != null) {
        dbf$$1 = stream(dbf$$1);
      }
      if (typeof shp$$1 === "string") {
        if (!/\.shp$/.test(shp$$1)) shp$$1 += ".shp";
        if (dbf$$1 === undefined) dbf$$1 = path(shp$$1.substring(0, shp$$1.length - 4) + ".dbf").catch(function() {});
        shp$$1 = path(shp$$1);
      } else if (shp$$1 instanceof ArrayBuffer || shp$$1 instanceof Uint8Array) {
        shp$$1 = array(shp$$1);
      } else {
        shp$$1 = stream(shp$$1);
      }
      return Promise.all([shp$$1, dbf$$1]).then(function(sources) {
        var shp$$1 = sources[0], dbf$$1 = sources[1], encoding = "windows-1252";
        if (options && options.encoding != null) encoding = options.encoding;
        return shapefile(shp$$1, dbf$$1, dbf$$1 && new TextDecoder(encoding));
      });
    }

    function openShp(source, options) {
      if (typeof source === "string") {
        if (!/\.shp$/.test(source)) source += ".shp";
        source = path(source);
      } else if (source instanceof ArrayBuffer || source instanceof Uint8Array) {
        source = array(source);
      } else {
        source = stream(source);
      }
      return Promise.resolve(source).then(shp);
    }

    function openDbf(source, options) {
      var encoding = "windows-1252";
      if (options && options.encoding != null) encoding = options.encoding;
      encoding = new TextDecoder(encoding);
      if (typeof source === "string") {
        if (!/\.dbf$/.test(source)) source += ".dbf";
        source = path(source);
      } else if (source instanceof ArrayBuffer || source instanceof Uint8Array) {
        source = array(source);
      } else {
        source = stream(source);
      }
      return Promise.resolve(source).then(function(source) {
        return dbf(source, encoding);
      });
    }

    function read(shp$$1, dbf$$1, options) {
      return open(shp$$1, dbf$$1, options).then(function(source) {
        var features = [], collection = {type: "FeatureCollection", features: features, bbox: source.bbox};
        return source.read().then(function read(result) {
          if (result.done) return collection;
          features.push(result.value);
          return source.read().then(read);
        });
      });
    }

    exports$1.open = open;
    exports$1.openShp = openShp;
    exports$1.openDbf = openDbf;
    exports$1.read = read;

    Object.defineProperty(exports$1, '__esModule', { value: true });

    /*
     * @Author: zhangbo
     * @E-mail: zhangb@geovis.com.cn
     * @Date: 2020-02-25 15:57:44
     * @LastEditors: zhangbo
     * @LastEditTime: 2020-02-25 18:00:16
     * @Desc: 
     */
    const {
        defined: defined$5,
        defaultValue: defaultValue$3,
        ColorMaterialProperty,
        ConstantPositionProperty,
        ConstantProperty,
        DataSource,
        PolygonGraphics,
        PolylineGraphics,
        createGuid: createGuid$1,
        Cartesian3: Cartesian3$5,
        PointGraphics,
        ArcType,
        PolygonHierarchy,
        Color: Color$6,
        HeightReference,
        Resource: Resource$2,
    } = Cesium;
    const sizes = {
        small: 24,
        medium: 48,
        large: 64
    };
    const crsLinkHrefs = {};
    const crsLinkTypes = {};
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
            if (!defined$5(description)) {
                description = describe(properties, nameProperty);
            }
            return description;
        };
    }
    // GeoJSON processing functions
    function createObject(geoJson, entityCollection, describe) {
        var id = geoJson.id;
        if (!defined$5(id) || geoJson.type !== 'Feature') {
            id = createGuid$1();
        } else {
            var i = 2;
            var finalId = id;
            while (defined$5(entityCollection.getById(finalId))) {
                finalId = id + '_' + i;
                i++;
            }
            id = finalId;
        }

        var entity = entityCollection.getOrCreateEntity(id);
        var properties = geoJson.properties;
        if (defined$5(properties)) {
            entity.properties = properties;

            var nameProperty;

            //Check for the simplestyle specified name first.
            var name = properties.title;
            if (defined$5(name)) {
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
                if (defined$5(nameProperty)) {
                    entity.name = properties[nameProperty];
                }
            }

            var description = properties.description;
            if (description !== null) {
                entity.description = !defined$5(description) ? describe(properties, nameProperty) : new ConstantProperty(description);
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

        if (!defined$5(feature.geometry)) {
            throw new CesiumProError$1('feature.geometry is required.');
        }

        var geometryType = feature.geometry.type;
        var geometryHandler = geometryTypes[geometryType];
        if (!defined$5(geometryHandler)) {
            throw new CesiumProError$1('Unknown geometry type: ' + geometryType);
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
            if (!defined$5(geometryHandler)) {
                throw new CesiumProError$1('Unknown geometry type: ' + geometryType);
            }
            geometryHandler(dataSource, geoJson, geometry, crsFunction, options);
        }
    }

    function createPoint(dataSource, geoJson, crsFunction, coordinates, options) {
        let size = options.pointSize;
        let color = options.pointColor;
        const properties = geoJson.properties;
        if (defined$5(properties)) {
            const cssColor = properties['point-color'];
            if (defined$5(cssColor)) {
                color = Color$6.fromCssColorString(cssColor);
            }

            size = defaultValue$3(sizes[properties['point-size']], size);
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
        if (defined$5(properties)) {
            const width = properties['stroke-width'];
            if (defined$5(width)) {
                widthProperty = new ConstantProperty(width);
            }

            let color;
            let stroke = properties.stroke;
            if (defined$5(stroke)) {
                color = Color$6.fromCssColorString(stroke);
            }
            let opacity = properties['stroke-opacity'];
            if (defined$5(opacity) && opacity !== 1.0) {
                if (!defined$5(color)) {
                    color = material.color.clone();
                }
                color.alpha = opacity;
            }
            if (defined$5(color)) {
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
        if (defined$5(properties)) {
            const width = properties['stroke-width'];
            if (defined$5(width)) {
                outlineWidth = new ConstantProperty(width);
            }
            let color;
            const stroke = properties.stroke;
            if (defined$5(stroke)) {
                color = Color$6.fromCssColorString(stroke);
            }
            let opacity = properties['stroke-opacity'];
            if (defined$5(opacity) && opacity !== 1.0) {
                if (!defined$5(color)) {
                    color = options.outlineColor.color.clone();
                }
                color.alpha = opacity;
            }

            if (defined$5(color)) {
                outlineColor = new ConstantProperty(color);
            }

            let fillColor;
            const fill = properties.fill;
            if (defined$5(fill)) {
                fillColor = Color$6.fromCssColorString(fill);
                fillColor.alpha = material.color.alpha;
            }
            opacity = properties['fill-opacity'];
            if (defined$5(opacity) && opacity !== material.color.alpha) {
                if (!defined$5(fillColor)) {
                    fillColor = material.color.clone();
                }
                fillColor.alpha = opacity;
            }
            if (defined$5(fillColor)) {
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
                        if(!(defined$5(value) && defined$5(value[1]))) {
                            continue;
                        }
                        extrudeValue = extrudeValue.replace(con, properties[value[1]]);
                    }
                    try {
                        const height = window.eval(extrudeValue);
                        if(typeof height === 'number') {
                            polygon.extrudedHeight = height;
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
                if (defined$5(value)) {
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
        return Cartesian3$5.fromDegrees(coordinates[0], coordinates[1], coordinates[2]);
    }
    function load(that, geoJson, options, sourceUri) {
        let name;
        if (defined$5(sourceUri)) {
            name = Cesium.getFilenameFromUri(sourceUri);
        }

        if (defined$5(name) && that._name !== name) {
            that._name = name;
            that._changed.raiseEvent(that);
        }

        const typeHandler = geoJsonObjectTypes[geoJson.type];
        if (!defined$5(typeHandler)) {
            throw new CesiumProError$1('Unsupported GeoJSON object type: ' + geoJson.type);
        }

        //Check for a Coordinate Reference System.
        const crs = geoJson.crs;
        let crsFunction = crs !== null ? defaultCrsFunction : null;

        if (defined$5(crs)) {
            if (!defined$5(crs.properties)) {
                throw new CesiumProError$1('crs.properties is undefined.');
            }

            const properties = crs.properties;
            if (crs.type === 'name') {
                crsFunction = crsNames[properties.name];
                if (!defined$5(crsFunction)) {
                    throw new CesiumProError$1('Unknown crs name: ' + properties.name);
                }
            } else if (crs.type === 'link') {
                var handler = crsLinkHrefs[properties.href];
                if (!defined$5(handler)) {
                    handler = crsLinkTypes[properties.type];
                }

                if (!defined$5(handler)) {
                    throw new CesiumProError$1('Unable to resolve crs link: ' + JSON.stringify(properties));
                }

                crsFunction = handler(properties);
            } else if (crs.type === 'EPSG') {
                crsFunction = crsNames['EPSG:' + properties.code];
                if (!defined$5(crsFunction)) {
                    throw new CesiumProError$1('Unknown crs EPSG code: ' + properties.code);
                }
            } else {
                throw new CesiumProError$1('Unknown crs type: ' + crs.type);
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
                this._geoJson.features.push(v);
            } else {
                this._geoJson = {
                    type: 'FeatureCollection',
                    features: [v]
                };
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
        static pointColor = Color$6.ROYALBLUE;
        /**
         * 线要素的颜色
         * @memberof ShapefileDataSource
         * @type {Cesium.Color}
         * @default Cesium.Color.YELLOW
         */
        static lineColor = Color$6.YELLOW;
        /**
         * 多边形要素的填充色
         * @memberof ShapefileDataSource
         * @type {Cesium.Color}
         * @default Cesium.Color.fromBytes(255, 255, 0, 100)
         */
        static fill = Color$6.fromBytes(255, 255, 0, 100);
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
        static outlineColor = Color$6.YELLOW;
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
            if (!defined$5(data)) {
                throw new CesiumProError$1('data is required.');
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
            if (typeof data === 'string' || (data instanceof Resource$2)) {
                promise = new Promise((resolve, reject) => {
                    exports$1.open(data, undefined, { encoding: options.encoding })
                        .then(source =>
                            source.read().then(function load(result) {
                                if (result.done) {
                                    resolve(that.geoJson);
                                    return
                                }                            that.geoJson = result.value;
                                return source.read().then(load);
                            })
                        )
                        .catch(error => reject(error.stack));
                });
                sourceUri = defaultValue$3(sourceUri, '');

                // Add resource credits to our list of credits to display
                var resourceCredits = this._resourceCredits;
                var credits = data.credits;
                if (defined$5(credits)) {
                    var length = credits.length;
                    for (var i = 0; i < length; i++) {
                        resourceCredits.push(credits[i]);
                    }
                }
            }

            options = {
                describe: defaultValue$3(options.describe, defaultDescribeProperty),
                pointSize: defaultValue$3(options.pointSize, ShapefileDataSource.pointSize),
                pointColor: defaultValue$3(options.pointColor, ShapefileDataSource.pointColor),
                lineWidth: new ConstantProperty(
                    defaultValue$3(options.lineWidth, ShapefileDataSource.lineWidth)
                ),
                outlineColor: new ColorMaterialProperty(
                    defaultValue$3(options.outlineColor, ShapefileDataSource.outlineColor)
                ),
                lineColor: new ColorMaterialProperty(defaultValue$3(options.lineColor, ShapefileDataSource.lineColor)),
                outlineWidth: defaultValue$3(options.outlineWidth, ShapefileDataSource.outlineWidth),
                fill: new ColorMaterialProperty(
                    defaultValue$3(options.fill, ShapefileDataSource.fill)
                ),
                outline: defaultValue$3(options.outline, ShapefileDataSource.outline),
                clampToGround: defaultValue$3(options.clampToGround, ShapefileDataSource.clampToGround),
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
    };

    const {
        buildModuleUrl: buildModuleUrl$1,
        Color: Color$5,
        defined: defined$4,
        destroyObject: destroyObject$3,
        knockout,
        getElement,
        subscribeAndEvaluate,
        InfoBoxViewModel
    } = Cesium;
    class InfoBox {
        /**
         * 用于显示查询信息的小部件
         * @param {*} container 
         */
        constructor(container) {
            container = getElement(container);

            var infoElement = document.createElement("div");
            infoElement.className = "cesium-infoBox";
            infoElement.setAttribute(
                "data-bind",
                '\
      css: { "cesium-infoBox-visible" : showInfo, "cesium-infoBox-bodyless" : _bodyless }'
            );
            container.appendChild(infoElement);

            var titleElement = document.createElement("div");
            titleElement.className = "cesium-infoBox-title";
            titleElement.setAttribute("data-bind", "text: titleText");
            infoElement.appendChild(titleElement);

            var closeElement = document.createElement("button");
            closeElement.type = "button";
            closeElement.className = "cesium-infoBox-close";
            closeElement.setAttribute(
                "data-bind",
                "\
      click: function () { closeClicked.raiseEvent(this); }"
            );
            closeElement.innerHTML = "&times;";
            infoElement.appendChild(closeElement);

            var frame = document.createElement("iframe");
            frame.className = "cesium-infoBox-iframe";
            frame.setAttribute("sandbox", "allow-same-origin allow-popups allow-forms"); //allow-pointer-lock allow-scripts allow-top-navigation
            frame.setAttribute(
                "data-bind",
                "style : { maxHeight : maxHeightOffset(40) }"
            );
            frame.setAttribute("allowfullscreen", true);
            infoElement.appendChild(frame);

            var viewModel = new InfoBoxViewModel();
            knockout.applyBindings(viewModel, infoElement);

            this._container = container;
            this._element = infoElement;
            this._frame = frame;
            this._viewModel = viewModel;
            this._descriptionSubscription = undefined;

            var that = this;
            //We can't actually add anything into the frame until the load event is fired
            frame.addEventListener("load", function () {
                var frameDocument = frame.contentDocument;

                //We inject default css into the content iframe,
                //end users can remove it or add their own via the exposed frame property.
                var cssLink = frameDocument.createElement("link");
                cssLink.href = buildModuleUrl$1("Widgets/InfoBox/InfoBoxDescription.css");
                cssLink.rel = "stylesheet";
                cssLink.type = "text/css";

                //div to use for description content.
                var frameContent = frameDocument.createElement("div");
                frameContent.className = "cesium-infoBox-description";

                frameDocument.head.appendChild(cssLink);
                frameDocument.body.appendChild(frameContent);

                //We manually subscribe to the description event rather than through a binding for two reasons.
                //1. It's an easy way to ensure order of operation so that we can adjust the height.
                //2. Knockout does not bind to elements inside of an iFrame, so we would have to apply a second binding
                //   model anyway.
                that._descriptionSubscription = subscribeAndEvaluate(
                    viewModel,
                    "description",
                    function (value) {
                        // Set the frame to small height, force vertical scroll bar to appear, and text to wrap accordingly.
                        frame.style.height = "5px";
                        frameContent.innerHTML = value;

                        //If the snippet is a single element, then use its background
                        //color for the body of the InfoBox. This makes the padding match
                        //the content and produces much nicer results.
                        var background = null;
                        var firstElementChild = frameContent.firstElementChild;
                        if (
                            firstElementChild !== null &&
                            frameContent.childNodes.length === 1
                        ) {
                            var style = window.getComputedStyle(firstElementChild);
                            if (style !== null) {
                                var backgroundColor = style["background-color"];
                                var color = Color$5.fromCssColorString(backgroundColor);
                                if (defined$4(color) && color.alpha !== 0) {
                                    background = style["background-color"];
                                }
                            }
                        }
                        infoElement.style["background-color"] = background;

                        // Measure and set the new custom height, based on text wrapped above.
                        var height = frameContent.getBoundingClientRect().height;
                        frame.style.height = height + "px";
                    }
                );
            });

            //Chrome does not send the load event unless we explicitly set a src
            frame.setAttribute("src", "about:blank");
        }
        get container() {
            return this._container;
        }
        get viewModel() {
            return this._viewModel;
        }
        get frame() {
            return this._frame;
        }
        isDestroyed() {
            return false;
        }
        destroy() {
            var container = this._container;
            knockout.cleanNode(this._element);
            container.removeChild(this._element);
        
            if (defined$4(this._descriptionSubscription)) {
                this._descriptionSubscription.dispose();
            }
        
            return destroyObject$3(this);
        };
    }

    const {
        Transforms: Transforms$2,
        Cartesian3: Cartesian3$4
    } = Cesium;
    class Model{
        /**
         * 创建一个gltf/glb模型
         * @param {Model.ModelOptions} optinos 模型参数
         * @example
         *  // 1. 通过position设置模型位置
         *  const p = new CesiumPro.LonLat(110, 30, 10).toCartesian();
         *  const model = new CesiumPro.Model({
         *      url: '../data/models/Cesium_Air.glb',
         *      minimumPixelSize: 16,
         *      position: p
         *  })
         * viewer.addModel(model);
         * // 2. 通过modelMatrix设置模型位置和姿态
         * const translation = Cesium.Transforms.eastNorthUpToFixedFrame(p);
         * const rotation = Cesium.Matrix3.fromRotationX(Math.PI / 2);
         * const modelMatrix = new Cesium.Matrix4();
         * Cesium.Matrix4.multiply(translation, rotation, modelMatrix);
         * const model = new CesiumPro.Model({
         *   url: '../data/models/Cesium_Air.glb',
         *   modelMatrix:modelMatrix
         * })
         * model.readyPromise.then(() => {
         *   model.activeAnimations.addAll({
         *     multiplier: 1.5,
         *     loop: Cesium.ModelAnimationLoop.REPEAT,
         *   });
         * })
         * viewer.addModel(model)
         */
        constructor(options = {}) {
            if(!defined$8(options.modelMatrix)&&defined$8(options.position)) {
                let cartesian;
                if(options.position instanceof Cartesian3$4) {
                    cartesian = options.position;
                } else if(options.position instanceof LonLat) {
                    cartesian = options.position.toCartesian();
                }
                if(cartesian) {
                    options.modelMatrix = Transforms$2.eastNorthUpToFixedFrame(cartesian);
                }
            }
            if(defined$8(options.gltf)) {
                this.delegate = new Cesium.Model(options);
            } else if(defined$8(options.url)) {
                this.delegate = Cesium.Model.fromGltf(options);
            } else {
                throw new CesiumProError$1('one of parameters url or gltf must be provided.')
            }
            this._readyPromise = this.delegate._readyPromise;
            this._ready = this.delegate._ready;
        }
        /**
         * 指示模型是否已经准备好。
         * @readonly
         * @type {Boolean}
         */
        get ready() {
            return this._ready;
        }
        /**
         * 返回一个Promise指示模型是否已经准备好。
         * @readonly
         * @type {Promise<Boolean>}
         */
        get readyPromise() {
            return this._readyPromise;
        }
        /**
         * 当前正在播放的动画
         * @type {Cesium.ModelAnimationCollection}
         */
        get activeAnimations() {
            return this.delegate.activeAnimations;
        }
        set activeAnimations(val) {
            this.delegate.activeAnimations = val;
        }
        /**
         * 如果为true,模型的每一个mesh都可以被scene.pick拾取到
         * @readonly
         * @type {Boolean}
         */
        get allowPicking() {
            return this.delegate.allowPicking;
        }
        /**
         * 决定WebGL资源是否可以分布在多个帧上，直到资源被加载完成.
         * @readonly
         * @type {Boolean}
         */
        get asynchronous() {
            return this.delegate.asynchronous;
        }
        /**
         * 是否启用背面剔除
         * @type {Boolean}
         */
        get backFaceCulling() {
            return this.delegate.backFaceCulling;
        }
        /**
         * 模型的资源（纹理、图片等）相对于模型文件的基本路径。
         */
        get basePath() {
            return this.delegate.basePath;
        }
        /**
         * 模型的边界球
         * @readonly
         * @type {Cesium.BoundingSphere}
         */
        get boundingSphere() {
            return this.delegate.boundingSphere;
        }
        /**
         * 模型的裁剪平面。
         * @type {Cesium.ClippingPlanes}
         */
        get clippingPlanes(){
            return this.delegate.clippingPlanes;
        }
        set clippingPlanes(val) {
            this.delegate.clippingPlanes = val;
        }
        /**
         * 和模型混合渲染的颜色
         * @type {Cesium.Color}
         */
        get color() {
            return this.delegate.color;
        }
        set color(val) {
            this.delegate.color = val;
        }
        /**
         * 模型和颜色的混合模型
         * @type {Cesium.ColorBlendMode}
         */
        get colorBlendMode() {
            return this.delegate.colorBlendMode;
        }
        set colorBlendMode(val) {
            this.delegate.colorBlendMode = val;
        }
        /**
         * 颜色的混合强度，当为0是，仅使渲染为模型颜色，当为1时，将渲染为纯色。仅当colorBlendMode为Cesium.ColorBlendMode.MIX时有效。
         */
        get colorBlendAmount() {
            return this.delegate.colorBlendAmount;
        }
        set colorBlendAmount(val) {
            this.delegate.colorBlendAmount = val;
        }
        /**
         * 模型的credit信息。
         * @type {String|Cesium.Credit}
         */
        get credit() {
            return this.delegate.credit;
        }
        set credit(val) {
            this.delegate.credit = val;
        }
        /**
         * 是否为每个命令绘制边界，仅用于调试
         * @type {Boolean}
         */
        get debugShowBoundingVolume(){
            return this.delegate.debugShowBoundingVolume;
        }
        set debugShowBoundingVolume(val){
            this.delegate.debugShowBoundingVolume = val;
        }
        /**
         * 是否以线框模式渲染模型
         * @type {Boolean}
         */
        get debugWireframe() {
            return this.delegate.debugWireframe;
        }
        set debugWireframe (val){
            this.delegate.debugWireframe = val;
        }
        /**
         * 模型相对与相机距离的显示条件
         * @type {Cesium.DistanceDisplayCondition}
         */
        get distanceDisplayCondition() {
            return this.delegate.distanceDisplayCondition;
        }
        set distanceDisplayCondition(val) {
            this.delegate.distanceDisplayCondition = val;
        }
        /**
         * gltf JSON对象
         * @readonly
         * @type {Object}
         */
        get gltf() {
            return this.delegate.gltf;
        }
        /**
         * 用于自定义对象，会在scene.pick中返回。
         * @type {Object}
         */
        get id() {
            return this.delegate.id;
        }
        set id(val) {
            this.delegate.id = val;
        }
        /**
         * 最大缩放比例
         * @type {Number}
         */
        get maximumScale() {
            return this.delegate.maximumScale;
        }
        set maximumScale(val){
            this.delegate.maximumScale = val;
        }
        /**
         * 模型渲染的最小像素，不受缩放比例的影响
         * @type {Number}
         */
        get minimumPixelSize() {
            return this.delegate.minimumPixelSize;
        }
        set minimumPixelSize(val){
            this.delegate.minimumPixelSize = val;
        }
        /**
         * 模型矩阵，用于将模型从模型坐标转为世界坐标。
         * @type {Cesium.Matrix4}
         */
        get modelMatrix() {
            return this.delegate.modelMatrix;
        }
        set modelMatrix(val){
            this.delegate.modelMatrix = val;
        }
        /**
         * 缩放比例
         * @type {Number}
         */
        get scale() {
            return this.delegate.scale;
        }
        set scale(val) {
            this.delegate.scale = val;
        }
        /**
         * 阴影模式
         * @type {Cesium.ShadowMode}
         */
        get shadows() {
            return this.delegate.shadows;
        }
        set shadows(val) {
            this.delegate.shadows = val;
        }
        /**
         * 是否显示模型
         * @type {Boolean}
         */
        get show() {
            return this.delegate.show;
        }
        set show(val) {
            this.delegate.show = val;
        }
        /**
         * 是否使用 CESIUM_primitive_outline扩展显示模型轮廓
         * @type {Boolean}
         * @readonly
         * @ignore
         */
        get showOutline() {
            return this.delegate.showOutline;
        }
        /**
         * 模型轮廓颜色
         * @type {Cesium.Color}
         * @default {Cesium.Color.RED}
         */
        get silhouetteColor() {
            return this.delegate.silhouetteColor;
        }
        set silhouetteColor(val) {
            this.delegate.silhouetteColor = val;
        }
        /**
         * 模型轮廓大小
         * @type {Number}
         */
        get silhouetteSize() {
            return  this.delegate.silhouetteSize
        }
        set silhouetteSize(val) {
            this.delegate.silhouetteSize = val;
        }
        /**
         * 是否支持显示模型轮廓
         * @param {Viewer} viewer 
         * @returns {Boolean} true表示支持模型轮廓显示
         */
        static silhouetteSupported(viewer) {
            return Cesium.Model.silhouetteSupported(viewer.scene)
        }
        /**
         * 销毁模型
         * @example
         * if(!model.isDestroyed()) {
         *    model.destroy()
         * }
         */
        destroy() {
            this.delegate.destroy();
        }
        /**
         * 模型是否被销毁
         */
        isDestroyed() {
            this.delegate.isDestroyed();
        }
        /**
         * 获得模型材质
         * @param {String} name 材质名称
         * @returns {Cesium.ModelMaterial}
         */
        getMaterial(name){
            return this.delegate.getMaterial(name);
        }
        /**
         * 获得模型mesh
         * @param {String} name mesh名称
         * @returns {Cesium.ModelMesh}
         */
        getMesh(name) {
            return this.delegate.getMesh(name);
        }
        /**
         * 获得模型节点
         * @param {String} name node名称
         * @returns {Cesium.ModelNode}
         */
        getNode(name) {
            return this.delegate.getNode(name);
        }
        /**
         * 模型根节点
         * @readonly
         * @type {Array}
         */
        get rootNodes() {
            return this.delegate._runtime.rootNodes;
        }
        /**
         * 模型的所有节点
         * @readonly
         * @type {Array}
         */
        get nodes() {
            return this.delegate._runtime.nodesByName;
        }
        /**
         * 模型的所有材质
         * @readonly
         * @type {Array}
         */
        get materials() {
            return this.delegate._runtime.materialsByName;
        }
        /**
         * 模型的所有网格
         * @readonly
         * @type {Array}
         */
        get meshs() {
            return this.delegate._runtime.meshesByName;
        }
    }

    function adjustLocation(tileset, transform, position, rotationZ) {
        if(transform) {
            tileset.root.transform = transform;
        } else {
            const matrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
            const rotation = Cesium.Matrix3.fromRotationZ(rotationZ);
            Cesium.Matrix4.multiplyByMatrix3(matrix, rotation, matrix);
            Cesium.Matrix4.multiply(tileset.root.transform, matrix, tileset.root.transform);
        }
    }
    function translate(tileset, position) {
        
        const matrix = new Cesium.Matrix4();
        Cesium.Matrix4.fromTranslation(position, matrix);
        Cesium.Matrix4.multiply(tileset.modelMatrix, matrix, tileset.modelMatrix);
    }
    function rotate (tileset, rotationZ) {
        const rotation = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rotationZ));
        Cesium.Matrix4.multiplyByMatrix3(tileset.root.transform, rotation, tileset.root.transform);
    }
    function adjustHeight(tileset, height) {
        const {
            center
        } = tileset.boundingSphere;
        const coord = LonLat.fromCartesian(center);
        const surface = Cesium.Cartesian3.fromDegrees(coord.lon, coord.lat, 0);
        const offset = Cesium.Cartesian3.fromDegrees(coord.lon, coord.lat, height);
        const translation = Cesium.Cartesian3.subtract(
            offset,
            surface,
            new Cesium.Cartesian3(),
        );

        tileset.modelMatrix = Cesium.Matrix4.multiply(tileset.modelMatrix,
            Cesium.Matrix4.fromTranslation(translation), tileset.modelMatrix);
    }
    class Tileset {
        /**
         * 添加3d tile set数据集。
         * @param {Tileset.Options} options 
         */
        constructor(options = {}, kwargs = {}) {
            this._params = {
                height: 0,
                position: new Cesium.Cartesian3(0, 0, 0),
                rotation: 0
            };
            let {
                transform,
                position,
                height,
                rotationZ,
                debug
            } = options;
            const cesium3dtileset = new Cesium.Cesium3DTileset(options);
            cesium3dtileset.readyPromise.then((tileset) => {
                viewer.scene.primitives.add(tileset);
                if (Cesium.defined(position)) {
                    adjustLocation(tileset, transform, position, rotationZ);
                }
                if (Cesium.defined(height)) {
                    adjustHeight(tileset, height);
                }
                if (debug) {
                    let height0 = 0, position0 = new Cesium.Cartesian3(), rotation0 = 0;
                    parent.onkeypress = function (e) {
                        // 升高
                        if (e.keyCode === 'Q'.charCodeAt() || e.keyCode === 'q'.charCodeAt()) {
                            height0 = 1;
                        }
                        // 降低
                        else if (e.keyCode === 'E'.charCodeAt() || e.keyCode === 'e'.charCodeAt()) {
                            height0 = -1;
                        }
                        // 平移
                        else if (e.keyCode === 'A'.charCodeAt() || e.keyCode === 'a'.charCodeAt()) {
                            position0 = new Cesium.Cartesian3(-2, 0, 0);
                        } else if (e.keyCode === 'D'.charCodeAt() || e.keyCode === 'd'.charCodeAt()) {
                            position0 = new Cesium.Cartesian3(2, 0, 0);
                        } else if (e.keyCode === 'W'.charCodeAt() || e.keyCode === 'w'.charCodeAt()) {
                            position0 = new Cesium.Cartesian3(0, -2, 0);
                        } else if (e.keyCode === 'S'.charCodeAt() || e.keyCode === 's'.charCodeAt()) {
                            position0 = new Cesium.Cartesian3(0, 2, 0);
                        }
                        // 旋转
                        else if (e.keyCode === 'Z'.charCodeAt() || e.keyCode === 'z'.charCodeAt()) {
                            rotation0 = -1;
                        } else if (e.keyCode === 'X'.charCodeAt() || e.keyCode === 'x'.charCodeAt()) {
                            rotation0 = 1;
                        }
                        translate(tileset, position0);
                        rotate(tileset, rotation0);
                        adjustHeight(tileset, height0);
                        rotation0 = 0;
                        position0 = new Cesium.Cartesian3();
                        height0 = 0;
                    };
                }
            });
            this.delegate = cesium3dtileset;
        }
        /**
         * 满足此帧屏幕空间错误的所有瓦片加载完成后触发的事件
         * @type {Event}
         * @readonly
         * @example
         * tileset.allTilesLoaded.addEventListener(function() {
         *    console.log('All tiles are loaded');
         * });
         */
        get allTilesLoaded() {
            return this.delegate.allTilesLoaded
        }
        /**
         * 返回一个promise,指示模型是否准备完成
         * @type {Promise}
         * @readonly
         */
        get readyPromise() {
            return this.delegate.readyPromise;
        }
        /**
         * 模型的包围球
         * @type {Cesium.BoundingSphere}
         * @readonly
         * @example
         * var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
         *     url : 'http://localhost:8002/tilesets/Seattle/tileset.json'
         * }));
         * 
         * tileset.readyPromise.then(function(tileset) {
         *     // Set the camera to view the newly added tileset
         *     viewer.camera.viewBoundingSphere(tileset.boundingSphere, new Cesium.HeadingPitchRange(0, -0.5, 0));
         * });
         */
        get boundingSphere() {
            return this.delegate.boundingSphere;
        }
        /**
         * 样式颜色和模型颜色的混合比例，仅当{@link Tileset#colorBlendMode} 为<code>MIX</code>时生效, 
         * 如果为0，将完全显示模型的颜色，如果为1，将完全显示样式的颜色
         * @type {Number}
         * @default 0.5
         */
        get colorBlendAmount() {
            return this.delegate.colorBlendAmount
        }
        set colorBlendAmount(val) {
            this.delegate.colorBlendAmount = val;
        }
        /**
         * 样式颜色和模型颜色的混合模式
         * @type {Cesium.Cesium3DTileColorBlendMode}
         * @default Cesium.Cesium3DTileColorBlendMode.HIGHLIGHT
         */
        get colorBlendMode() {
            return this.delegate.colorBlendMode
        }
        set colorBlendMode(val) {
            this.delegate.colorBlendMode = val;
        }
        /**
         * 模型样式
         * @type {Cesium.Cesium3DTileStyle}
         * @example
         * tileset.style = new Cesium.Cesium3DTileStyle({
         *   color: "rgba(255, 0, 0, 0.5)",
         * });
         * tileset.style = new Cesium.Cesium3DTileStyle({
         *    color : {
         *        conditions : [
         *            ['${Height} >= 100', 'color("purple", 0.5)'],
         *            ['${Height} >= 50', 'color("red")'],
         *            ['true', 'color("blue")']
         *        ]
         *    },
         *    show : '${Height} > 0',
         *    meta : {
         *        description : '"Building id ${id} has height ${Height}."'
         *    }
         * });
         */
        get style() {
            return this.delegate.style;
        }
        set style(val) {
            this.delegate.style = val;
        }
        /**
         * 自定义着色器，仅在Cesium.ExperimentalFeatures.enableModelExperimental为true时生效
         * @type {Cesium.CustomShader}
         */
        get customShader() {
            return this.delegate.customShader;
        }
        set customShader(val) {
            this.delegate.customShader = val;
        }
        /**
         * 为每个瓦片随机设置不同的颜色，仅用于调试
         * @type {Boolean}
         * @default false
         */
        get debugColorizeTiles() {
            return this.delegate.debugColorizeTiles
        }
        set debugColorizeTiles(val) {
            this.delegate.debugColorizeTiles = val;
        }
        /**
         * @type {Boolean}
         * 仅用于调试。
         * 如果为true，则将数据冻结到上一帧。
         */
        get debugFreezeFrame() {
            return this.delegate.debugFreezeFrame;
        }
        set debugFreezeFrame(val) {
            this.delegate.debugFreezeFrame = val;
        }
        /**
         * @type {Boolean}
         * 仅用于调试。
         * 如果为 true，则为每个可见图块渲染边界体积。如果图块具有内容边界体积或为空，则边界体积为白色；
         * 否则，它是红色的。不符合屏幕空间错误且仍在对其后代进行加载的瓦片为黄色。
         */
        get debugShowBoundingVolume() {
            return this.delegate.debugShowBoundingVolume;
        }
        set debugShowBoundingVolume(val) {
            this.delegate.debugShowBoundingVolume = val;
        }
        /**
         * @type {Boolean}
         * 仅用于调试。
         * 如果为 true，则为每个可见图块的内容渲染边界体积。如果图块具有内容边界体积，则边界体积为蓝色；否则它是红色的。
         */
        get debugShowContentBoundingVolume() {
            return this.delegate.debugShowContentBoundingVolume;
        }
        set debugShowContentBoundingVolume(val) {
            this.delegate.debugShowContentBoundingVolume = val;
        }
        /**
         * @type {Boolean}
         * 仅用于调试。
         * 如果为true，将使用label显示每个瓦片的几何误差。
         */
        get debugShowGeometricError() {
            return this.delegate.debugShowGeometricError;
        }
        set debugShowGeometricError(val) {
            this.delegate.debugShowGeometricError = val;
        }
        /**
         * @type {Boolean}
         * 仅用于调试
         * 如果为true，将使用label显示每个瓦片的内存使用情况
         */
        get debugShowMemoryUsage() {
            return this.delegate.debugShowMemoryUsage;
        }
        set debugShowMemoryUsage(val) {
            this.delegate.debugShowMemoryUsage = val;
        }
        /**
         * 仅用于调试。
         * 如果为 true，则绘制标签以指示每个图块的命令、点、三角形和特征的数量。
         * @type {Boolean}
         */
        get debugShowRenderingStatistics() {
            return this.delegate.debugShowRenderingStatistics;
        }
        set debugShowRenderingStatistics(val) {
            this.delegate.debugShowRenderingStatistics = val;
        }
        /**
         * 仅用于调试。
         * 如果为true，将显示每个瓦片的url。
         * @type {Boolean}
         */
        get debugShowUrl() {
            return this.delegate.debugShowUrl;
        }
        set debugShowUrl(val) {
            this.delegate.debugShowUrl = val;
        }
        /**
         * 仅用于调试。
         * 如果为true，将使用线框模式显示模型。
         * @type {Boolean}
         */
        get debugWireframe() {
            return this.delegate.debugWireframe;
        }
        set debugWireframe(val) {
            this.delegate.debugWireframe = val;
        }
        /**
         * 优化选项。
         * 如果为true, 瓦片集是将根据动态屏幕空间误差进行优化，较远的图块将呈现比更近的图块更低的细节。
         * 这可以通过渲染更少的图块和发出更少的请求来提高性能，但可能会导致远处图块的视觉质量略有下降。
         * 对于紧密拟合的边界体积，结果更准确。
         * @type {Boolean}
         * @default false
         */
        get dynamicScreenSpaceError() {
            return this.delegate.dynamicScreenSpaceError;
        }
        set dynamicScreenSpaceError(val) {
            this.delegate.dynamicScreenSpaceError = val;
        }
        /**
         * 用于增加动态屏幕空间误差的图块屏幕空间误差的因子。该值越大，渲染请求的图块越少，
         * 远处的图块的细节就越少。如果设置为零，该功能将被禁用。
         * @type {Number}
         * @default 4.0
         */
        get dynamicScreenSpaceErrorFactor() {
            return this.delegate.dynamicScreenSpaceErrorFactor;
        }
        set dynamicScreenSpaceErrorFactor(val) {
            this.delegate.dynamicScreenSpaceErrorFactor = val;
        }
        /**
         * 获取瓦片集的扩展对象属性。
         * @type {Object}
         * @readonly
         */
        get extensions() {
            return this.delegate.extensions;
        }
        /**
         * 返回extras图块集JSON顶层的属性，其中包含特定于应用程序的元数据。
         * @type {any}
         * @see {@link https://github.com/CesiumGS/3d-tiles/tree/main/specification#specifying-extensions-and-application-specific-extras|3D Tiles 规范中}
         */
        get extras() {
            return this.delegate.extras;
        }
        /**
         * 优化选项。
         * 范围为[0, 1)。
         * @default 0.00278
         * @type {Number}
         */
        get dynamicScreenSpaceErrorDensity() {
            return this.delegate.dynamicScreenSpaceErrorDensity;
        }
        set dynamicScreenSpaceErrorDensity(val) {
            this.delegate.dynamicScreenSpaceErrorDensity = val;
        }
        /**
         * 优化选项。
         * 通过暂时提高屏幕边缘周围图块的屏幕空间错误，优先加载屏幕中心的图块。
         * @type {Boolean}
         * @default true
         */
        get foveatedScreenSpaceError() {
            return this.delegate.foveatedScreenSpaceError;
        }
        set foveatedScreenSpaceError(val) {
            this.delegate.foveatedScreenSpaceError = val;
        }
        /**
         * 优化选项, 仅当{@link Tileset#foveatedScreenSpaceError}为true时生效。
         * 用来控制决定延迟哪些图块的锥体大小。立即加载此圆锥内的瓷砖，圆锥外的瓷砖可能会根据它们在圆锥外的距离
         * 而延迟加载。将此设置为0.0意味着圆锥将是由相机位置及其视图方向形成的线。将此设置为1.0意味着锥体
         * 包含相机的整个视野​​，基本上禁用效果。
         * @type {Number}
         * @default 0.3
         */
        get foveatedConeSize() {
            return this.delegate.foveatedConeSize;
        }
        set foveatedConeSize(val) {
            this.delegate.foveatedConeSize = val;
        }
        /**
         * 获取或设置一个回调，以控制为中心锥体外的图块提高多少屏幕空间错误，{@link Tileset#foveatedMinimumScreenSpaceErrorRelaxation}
         * 和{@link Tileset#maximumScreenSpaceError}之间插值获得。
         * @type {Tileset.FoveatedInterpolationCallback}
         */
        get foveatedInterpolationCallback() {
            return this.delegate.foveatedInterpolationCallback;
        }
        set foveatedInterpolationCallback(val) {
            this.delegate.foveatedInterpolationCallback = val;
        }
        /**
         * {@link 当Tileset#foveatedScreenSpaceError}为true时，用于控制锥体外的瓦片的起始屏幕空间误差。
         * @type {Number}
         * @default 0.0
         */
        get foveatedMinimumScreenSpaceErrorRelaxation() {
            return this.delegate.foveatedMinimumScreenSpaceErrorRelaxation;
        }
        set foveatedMinimumScreenSpaceErrorRelaxation(val) {
            this.delegate.foveatedMinimumScreenSpaceErrorRelaxation = val;
        }
        /**
         * 当{@link Tileset#foveatedScreenSpaceError}为true时，用于控制锥体外的瓦片延迟多长时间加载。
         * @type {Number}
         * @default 0.2
         */
        get foveatedTimeDelay() {
            return this.delegate.foveatedTimeDelay;
        }
        set foveatedTimeDelay(val) {
            this.delegate.foveatedTimeDelay = val;
        }
        /**
         * 模型接收了来自地球、天空、大气和星空天空盒的光照。该值用于增加或降低这些光照强度。
         * 值0.0将禁用这些光源。
         * @type {Cesium.Cartesian2};
         * @default new Cesium.Cartesian2(1, 1)
         */
        get imageBasedLightingFactor() {
            return this.delegate.imageBasedLightingFactor;
        }
        set imageBasedLightingFactor(val) {
            this.delegate.imageBasedLightingFactor = val;
        }
        /**
         * 只下载满足最大屏幕空间误差的瓦片，忽略跳过因子。
         * 只有{@link Tileset#skipLevelOfDetail}为true时使用。
         * @type {Boolean}
         * @default false;
         */
        get immediateLoadDesiredLevelOfDetail() {
            return this.delegate.immediateLoadDesiredLevelOfDetail;
        }
        set immediateLoadDesiredLevelOfDetail(val) {
            this.delegate.immediateLoadDesiredLevelOfDetail = val;
        }
        /**
         * 满足当前屏幕空间误差的所有瓦片第一次加载完成后触发该事件。
         * @type {Event}
         * @readonly
         * @example
         * tileset.initialTilesLoaded.addEventListener(function() {
         *     console.log('Initial tiles are loaded');
         * });
         */
        get initialTilesLoaded() {
            return this.delegate.initialTilesLoaded;
        }
        /**
         * 使用该光线代替环境光。
         * @type {Cesium.Cartesian3}
         * @default undefined
         */
        get lightColor() {
            return this.delegate.lightColor
        }
        set lightColor(val) {
            this.delegate.lightColor = val;
        }
        /**
         * 触发事件以指示加载新图块的进度。当请求新切片时、请求的切片完成下载以及下载的切片已处理并准备好渲染时，将触发此事件。
         * 请求挂起的瓦片数numberOfPendingRequests数和处理完成的瓦片数numberOfTilesProcessing将传递给事件侦听器。
         * @type {Event}
         * @readonly
         * @example
         * tileset.loadProgress.addEventListener(function(numberOfPendingRequests, numberOfTilesProcessing) {
         *    if ((numberOfPendingRequests === 0) && (numberOfTilesProcessing === 0)) {
         *        console.log('Stopped loading');
         *        return;
         *    }
         *
         *    console.log('Loading: requests: ' + numberOfPendingRequests + ', processing: ' + numberOfTilesProcessing);
         *});
         */
        get loadProgress() {
            return this.delegate.loadProgress;
        }
        /**
         * 是否下载可见瓦片的兄弟瓦片。
         * @type {Boolean}
         * @default false
         */
        get loadSiblings() {
            return this.delegate.loadSiblings;
        }
        /**
         * 可用于缓存切片的最大GPU内存（以 MB 为单位）。该值是根据已加载切片的几何、纹理和批处理表纹理估计的,
         * 对于点云，此值还包括每点元数据。如果满足当前屏幕空间误差（由{@link Tileset#maximumScreenSpaceError}确定）
         * 的图块所需的内存大小超过了maximumMemoryUsage，则使用真正需要的内存大小。例如，如果最大值为256 MB，
         * 但需要300MB的图块来满足屏幕空间错误，则可能会加载300MB的图块，当这些瓷砖消失时，它们将被卸载。
         * @type {Number}
         * @default 512
         */
        get maximumMemoryUsage() {
            return this.delegate.maximumMemoryUsage;
        }
        set maximumMemoryUsage(val) {
            this.delegate.maximumMemoryUsage = val;
        }
        /**
         * 用于驱动细节细化级别的最大屏幕空间误差。如果瓦片的屏幕空间误差超过maximumScreenSpaceError，则会对其后代进行细化。
         * 根据模型数据，maximumScreenSpaceError可能需要进行调整以达到适当的平衡。较高的值可提供更好的性能，但会降低视觉质量。
         * @type {Number}
         * @default 16
         */
        get maximumScreenSpaceError() {
            return this.delegate.maximumScreenSpaceError;
        }
        set maximumScreenSpaceError(val) {
            this.delegate.maximumScreenSpaceError = val;
        }
        /**
         * 模型矩阵
         * @type {Cesium.Matrix4}
         * @default Cesium.Matrix4.IDENTITY
         * @example
         * // 调整模型高度
         * var heightOffset = 20.0;
         * var boundingSphere = tileset.boundingSphere;
         * var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
         * var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
         * var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
         * var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
         * tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
         */
        get modelMatrix() {
            return this.delegate.modelMatrix;
        }
        set modelMatrix(val) {
            this.delegate.modelMatrix = val;
        }
        /**
         * 使用 3D Tiles 渲染点云时基于几何误差执行点衰减的选项。
         * @type {Cesium.PointCloudShading}
         */
        get pointCloudShading() {
            return this.delegate.pointCloudShading;
        }
        set pointCloudShading(val) {
            this.delegate.pointCloudShading;
        }
        /**
         * 优化选项。
         * 如果为true，将优先装载叶子节点。
         * @type {Boolean}
         * @default false
         */
        get preferLeaves() {
            return this.delegate.preferLeaves;
        }
        set preferLeaves(val) {
            this.delegate.preferLeaves = val;
        }
        /**
         * 优化选项。
         * 如果为true, 将在相机飞行过程中加载目的地的瓦片。
         * @type {Boolean}
         * @default true
         */
        get preloadFlightDestinations() {
            return this.delegate.preloadFlightDestinations;
        }
        set preloadFlightDestinations(val) {
            this.delegate.preloadFlightDestinations;
        }
        /**
         * 优化选项。
         * 如果为true，将在瓦片隐藏的情况下预加载瓦片。
         * @type {Boolean}
         * @default false
         */
        get preloadWhenHidden() {
            return this.delegate.preloadWhenHidden;
        }
        set preloadWhenHidden(val) {
            this.delegate.preloadWhenHidden;
        }
        /**
         * 优化选项。
         * 如果介于 (0.0, 0.5] 之间，将助于在瓦片继续加载的同时快速铺设一层瓦片。
         */
        get progressResolutionHeightFraction() {
            return this.delegate.progressResolutionHeightFraction;
        }
        set progressResolutionHeightFraction(val) {
            this.delegate.progressResolutionHeightFraction = val;
        }
        /**
         * 获取瓦片集的属性字典对象，其中包含有关每个特征属性的元数据.
         * @type {Object}
         * @readonly
         */
        get properties() {
            return this.delegate.properties;
        }
        /**
         * 定义模型资源的对象。
         * @type {Cesium.Resource}
         */
        get resource() {
            return this.delegate.resource;
        }
        /**
         * 模型根瓦片。
         * @type {Cesium3DTile}
         */
        get root() {
            return this.delegate.root;
        }
        /**
         * 确定瓦片集是投射还是接收来自光源的阴影。
         * 启用阴影将降低性能。
         * 只有{@link Cesium.Viewer#shadow}为true时，才会渲染阴影。
         * @type {Cesium.ShadowMode}
         * @default Cesium.ShadowMode.ENABLED
         */
        get shadows() {
            return this.delegate.shadows;
        }
        set shadows(val) {
            this.delegate.shadows = val;
        }
        /**
         * 是否显示模型轮廓
         * @type {Boolean}
         * @readonly
         */
        get showOutline() {
            return this.delegate.showOutline;
        }
        /**
         * 优化选项。
         * 确定是否应在遍历期间应用详细级别跳过，当为true时，tilese需要的内存显著减少。
         * @type {Boolean}
         * @default false
         */
        get skipLevelOfDetail () {
            return this.delegate.skipLevelOfDetail;
        }
        set skipLevelOfDetail (val) {
            this.delegate.skipLevelOfDetail; 
        }
        /**
         * 常量定义加载图块时要跳过的最小级别数。
         * 例如，如果图块为1级，则不会加载图块，除非它们的级别大于 2。为0时，不跳过任何级别。
         * 仅当{@link Tileset#skipLevelOfDetail}为true时使用。
         * @type {Number}
         * @default 1
         */
        get skipLevels() {
            return this.delegate.skipLevels;
        }
        set skipLevels(val) {
            this.delegate.skipLevels=val;
        }
        /**
         * 定义要跳过的最小屏幕空间错误的乘数。
         * 例如，如果图块的屏幕空间误差为100，则不会加载图块，除非它们是叶子或屏幕空间误差<= 100 / skipScreenSpaceErrorFactor。
         * @type {Number}
         * @default 16
         */
        get skipScreenSpaceErrorFactor () {
            return this.delegate.skipScreenSpaceErrorFactor;
        }
        set skipScreenSpaceErrorFactor (val) {
            this.delegate.skipScreenSpaceErrorFactor = val;
        }

        /**
         * 模型裁剪平面
         * @type {Cesium.ClippingPlaneCollection}
         */
        get clippingPlanes() {
            return this.delegate.clippingPlanes
        }
        set clippingPlanes(val) {
            this.delegate.clippingPlanes = val;
        }
        /**
         * KTX 文件的 URL，其中包含高光照明的立方体贴图和卷积高光 mipmap。
         * @type {String}
         * @see {@link https://sandcastle.cesium.com/index.html?src=Image-Based%20Lighting.html}
         */
        get specularEnvironmentMaps() {
            return this.delegate.specularEnvironmentMaps
        }
        set specularEnvironmentMaps(val) {
            this.delegate.specularEnvironmentMaps = val;
        }
        /**
         * 瓦片加载失败时触发的事件
         * 如果没有事件侦听器，错误消息将记录到控制台。
         * 传递给侦听器的错误对象包含两个属性：
         * <ul>
         *  <li>url: 失败磁贴的 url。</li>
         *  <li>message: 错误信息。<li>
         * </ul>
         * @type {Event}
         * @readonly
         * @example
         * tileset.tileFailed.addEventListener(function(error) {
         *     console.log('An error occurred loading tile: ' + error.url);
         *     console.log('Error: ' + error.message);
         * });
         */
        get tileFailed() {
            return this.delegate.tileFailed ;
        }
        /**
         * 触发事件以指示已加载磁贴的内容。
         * 加载Cesium3DTile的内容被传递给事件监听器。
         * 此事件在帧被渲染时在图块集遍历期间被触发，以便对图块的更新在同一帧中生效。不要在事件监听期间创建或修改entities或primitives.
         * @type {Event}
         * @example
         * tileset.tileLoad.addEventListener(function(tile) {
         *     console.log('A tile was loaded.');
         * });
         */
        get tileLoad () {
            return this.delegate.tileLoad;
        }
        set tileLoad(val) {
            this.delegate.tileLoad = val;
        }
        /**
         * 触发该事件以指示已卸载磁贴的内容。
         * 卸载Cesium3DTile的被传递给事件监听器。
         * 不要在事件监听期间创建或修改entities或primitives.
         * @type {Event}
         * tileset.tileUnload.addEventListener(function(tile) {
         *     console.log('A tile was unloaded from the cache.');
         * });
         * @see {@link Tileset#maximumMemoryUsage}
         * @see {@link Tileset#trimLoadedTiles}
         */
        get tileUnload() {
            return this.delegate.tileUnload;
        }
        set tileUnload(val) {
            this.delegate.tileUnload=val;
        }
        /**
         * 如果为true, 当前视图的所有瓦片被加载完成。
         * @type {Boolean
         */
        get tilesLoaded () {
            return this.delegate.tilesLoaded;
        }
        /**
         * 对于帧中的每个可见图块，此事件每帧都会触发一次。这可用于手动设置图块集的样式。
         * 可见Cesium3DTile的被传递给事件监听器。
         * 不要在事件监听期间创建或修改entities或primitives.
         * @type {Event}
         * @example
         * // Apply a red style and then manually set random colors for every other feature when the tile becomes visible.
         * tileset.style = new Cesium.Cesium3DTileStyle({
         *     color : 'color("red")'
         * });
         * tileset.tileVisible.addEventListener(function(tile) {
         *     var content = tile.content;
         *     var featuresLength = content.featuresLength;
         *     for (var i = 0; i < featuresLength; i+=2) {
         *         content.getFeature(i).color = Cesium.Color.fromRandom();
         *     }
         * });
         */
        get tileVisible() {
            return this.delegate.tileVisible;
        }
        set tileVisible (val) {
            this.delegate.tileVisible =val;
        }
        /**
         * 返回瓦片集加载和第一次更新以来的时间，以毫秒为单位。
         * @type {Number}
         * @readonly
         */
        get timeSinceLoad () {
            return this.delegate.timeSinceLoad ;
        }
        /**
         * 瓦片集使用的GPU内存总量（以字节为单位）。该值是根据加载的切片的几何、纹理和批处理表纹理估计的。对于点云，此值还包括每点元数据。
         * @type {Number}
         * @readonly
         */
        get totalMemoryUsageInBytes () {
            return  this.delegate.totalMemoryUsageInBytes ;
        }
        /**
         * 决定地形、3D 瓦片是否被此瓦片集分类。
         * 此选项仅适用于包含批处理 3D 模型、几何数据或矢量数据的瓦片集。即使未定义，矢量数据和几何数据也必须作为分类渲染，并且默认在地形和其他 3D Tiles 瓦片集上渲染
         * @type {Cesium.ClassificationType}
         */
        get classificationType() {
            return this.delegate.classificationType
        }
        set classificationType(val) {
            this.delegate.classificationType = val;
        }
        /**
         * 在跳过详细级别之前必须达到的屏幕空间误差。
         * @type {Number}
         * @default 1024
         */
        get baseScreenSpaceError() {
            return this.delegate.baseScreenSpaceError
        }
        set baseScreenSpaceError(val) {
            this.delegate.baseScreenSpaceError = val;
        }
        /**
         * 销毁此对象占用的WebGL资源。销毁一个对象允许确定性地释放WebGL资源，而不是依赖垃圾收集器来销毁这个对象。
         * 一旦一个对象被销毁，它就不应该被使用；调用除此之外的任何函数 isDestroyed都会导致DeveloperError异常。
         * @throws {Cesium.DeveloperError}
         * @example
         * tileset = tileset && tileset.destroy();
         */
        destroy() {
            this.delegate.destroy();
        }
        hasExtension(name) {
            return this.delegate.hasExtension(name);
        }
        /**
         * 如果此对象被销毁，则返回 true；否则返回false。
         * @returns {Boolean}
         */
        isDestroyed() {
            return this.delegate.isDestroyed();
        }
        /**
         * 将图块集标记Tileset#style为dirty，这会强制所有功能重新评估下一帧中的样式。
         */
        makeStyleDirty () {
            return this.delegate.makeStyleDirty();
        }
        /**
         * 卸载上一帧未选择的所有图块。这可用于显式管理切片缓存并减少下面加载的切片总数{@link Tileset#maximumMemoryUsage}
         * 瓦片将在下一帧被卸载。
         */
        trimLoadedTiles() {
            this.delegate.trimLoadedTiles();
        }
        /**
         * 提供一个钩子来覆盖用于请求从远程服务器获取图块集时有用的图块集json的方法
         * @param {String|Cesium.Resource} json 要获取的json文件的url
         * @returns {Promise<Object>} json解析结果
         */
        static loadJson(json) {
            return Cesium3DTileset.loadJson(json);
        }
    }

    class MassiveGraphicLayer {
        /**
         * 一个以LOD方式加载大量点（model, billboard, point, label）数据的基础类。
         * 该图层的点数据会类似瓦片数据的方式加载，即只加载当前窗口范围内的数据，在按
         * 瓦片分割数据前还会对数据做聚类处理，以解决低层级时加载大量数据的低性能问题。
         * @private
         * @see MassivePointLayer
         * @see MassiveBillboardLayer
         * @see MassiveModelLayer
         * @see MassiveEntityLayer
         */
        constructor(options = {}) {
            //>>includeStart('debug', pragmas.debug);
            if (!defined$8(options.objects)) {
                throw new CesiumProError$1('objects property must be provided.')
            }
            if (!Array.isArray(options.objects)) {
                throw new CesiumProError$1('objects property must be an array')
            }
            //>>includeEnd('debug')
            this._id = defaultValue$6(options.id, createGuid$3());
            this._maxClusterLevel = defaultValue$6(options.maxClusterLevel, 12);
            this._minLoadLevel = defaultValue$6(options.minLoadLevel, 12);
            this._objects = undefined;
        }
        /**
         * 图层的唯一标识
         * @type {String}
         * @readonly
         */
        get id() {
            return this._id;
        }
        /**
         * 最小加载层级，瓦片层级小于该值时将不加载任何数据
         */
        get minLoadLevel() {
            return this._minLoadLevel;
        }
        set minLoadLevel(val) {
            this._minLoadLevel = val;
        }
        /**
         * 创建点要素属性对象
         */
        get objects() {
            return this._objects;
        }
        set objects(val) {
            this._objects = val;
        }
        /**
         * 更新聚合状态，由于计算屏幕坐标代价较大，这里对每一层级的屏幕坐标只计算一次，
         * 这可能会造成一些误差。
         * @private
         * @param {Number} height 当前相机高度
         * @returns {Boolean} 更新前后数据是否发生变化。
         */
        updateCluster(height) {
            CesiumProError$1.throwInstantiationError();
        }
        /**
         * 所有要素创建前调用，一般不需要主动调用，每帧会自动调用一次
         * @param {Cesium.FrameState} framestate framestate
         */
        beginUpdate(framestate) {
            CesiumProError$1.throwInstantiationError();
        }
        /**
         * 所有要素创建完成后调用，一般不需要主动调用，每帧会自动调用一次
         * @param {Cesium.FrameState} framestate framestate
         */
        endUpdate(framestate) {
            CesiumProError$1.throwInstantiationError();
        }
        /**
         * 初始化图层
         * @private
         * @param {Cesium.FrameState} framestate 
         * @param {Cesium.Scene} scene 
         */
        initialize(framestate, scene) {
            CesiumProError$1.throwInstantiationError();
        }
        /**
         * 根据object创建点要素，一般不需要主动调用。
         * @param {Cesium.QuadtreeTile} tile 该要素所在的瓦片
         * @param {*} framestate framestate
         * @param {Object} object 描述点要素的属性信息
         * @returns {Object} 被创建的对象
         */
        createGeometry(tile, framestate, object) {
            CesiumProError$1.throwInstantiationError();
        }
        /**
         * 删除点要素，一般不需要主动调用。
         * @param {Cesium.FrameState} framestate 
         * @param {Entity} object 要删除的点要素
         * @returns {Boolean} 是否删除成功
         */
        removeGeometry(framestate, object) {
            
        }
        /**
         * 移除所有要素
         */
        removeAll() {
            CesiumProError$1.throwInstantiationError();
        }
        /**
         * 判断图层是否被销毁
         */
        isDestroyed() {
            return false;
        }
        destroy() {
            CesiumProError$1.throwInstantiationError();
        }
    }

    const {
        AssociativeArray: AssociativeArray$2 
    } = Cesium;
    class MassiveGraphicLayerCollection{
        /**
         * 基于四叉树和聚合的LOD图层的集合。
         */
        constructor() {
            this._layers = new AssociativeArray$2();
        }
        get layer() {
            return this._layers;
        }
        get length() {
            return this._layers.length;
        }
        get values() {
            return this._layers.values;
        }
        /**
         * 根据id获取图层
         * @param {String} id 图层id
         * @returns {MassiveGraphicLayer}
         */
        get(id) {
            return this._layers.get(id);
        }
        /**
         * 添加一个图层
         * @param {MassiveGraphicLayer} layer 一个有效的Lod图层，该图层类必须继承MassiveGraphicLayer类。
         */
        add(layer) {
            if(layer instanceof MassiveGraphicLayer) {
                this._layers.set(layer.id, layer);
            }
        }
        /**
         * 判断集合中是否包含一个Lod图层
         * @param {MassiveGraphicLayer|String} layer 图层对象或图层id
         * @returns {Boolean} true表示包含
         */
        has(layer) {
            if(layer instanceof MassiveGraphicLayer) {
                return this._layers.contains(layer)
            } else if(typeof layer === 'string') {
                return this._layers.contains(this.get(layer))
            }
            return false;
        }
        /**
         * 从集合中删除图层
         * @param {MassiveGraphicLayer|String} layer 图层或图层id 
         * @returns {Boolean} true表示删除成功, false表示删除失败。
         */
        remove(layer) {
            if(layer instanceof MassiveGraphicLayer) {
                layer.destroy();
                return this._layers.remove(layer.id)
            } else if(typeof layer === 'string') {
                const layerObject = this._layers.get(layer);
                layerObject && layerObject.destroy();
                return this._layers.remove(layer)
            }
            return false;
        }
        /**
         * 删除所有图层
         */
        removeAll() {
            return this._layers.removeAll();
        }
    }

    const {
        GeographicTilingScheme: GeographicTilingScheme$2,
        GlobeSurfaceTileProvider: GlobeSurfaceTileProvider$1,
        when: when$4,
        Event: Event$5,
        GlobeSurfaceTile,
        TerrainState,
        RequestType,
        Request,
        Rectangle: Rectangle$2,
        QuadtreeTileLoadState,
        Visibility,
        AssociativeArray: AssociativeArray$1,
        Cartesian3: Cartesian3$3,
        Cartographic: Cartographic$3,
        getTimestamp
    } = Cesium;

    function requestGeometry(tile, framestate, terrainProvider) {
        let surfaceTile = tile.data;
        function success(terrainData) {
            surfaceTile.terrainData = terrainData;
            surfaceTile.terrainState = TerrainState.RECEIVED;
            surfaceTile.request = undefined;
        }

        function failure(error) {
            if (surfaceTile.request.state === RequestState.CANCELLED) {
                // Cancelled due to low priority - try again later.
                surfaceTile.terrainData = undefined;
                surfaceTile.terrainState = TerrainState.UNLOADED;
                surfaceTile.request = undefined;
                return;
            }
            surfaceTile.terrainState = TerrainState.FAILED;
            surfaceTile.request = undefined;
        }
        function doRequest() {
            const request = new Request({
                throttle: false,
                throttleByServer: true,
                type: RequestType.TERRAIN,
            });
            surfaceTile.request = request;

            const requestPromise = terrainProvider.requestTileGeometry(
                tile.x,
                tile.y,
                tile.level,
                request
            );
            if (defined$8(requestPromise)) {
                surfaceTile.terrainState = TerrainState.RECEIVING;
                when$4(requestPromise, success, failure);
            } else {
                // Deferred - try again later.
                surfaceTile.terrainState = TerrainState.UNLOADED;
                surfaceTile.request = undefined;
            }
        }
        doRequest();
    }
    const scratchCreateMeshOptions = {
        tilingScheme: undefined,
        x: 0,
        y: 0,
        level: 0,
        exaggeration: 1.0,
        exaggerationRelativeHeight: 0.0,
        throttle: true,
    };
    function transform(surfaceTile, frameState, terrainProvider, x, y, level) {
        const tilingScheme = terrainProvider.tilingScheme;

        const createMeshOptions = scratchCreateMeshOptions;
        createMeshOptions.tilingScheme = tilingScheme;
        createMeshOptions.x = x;
        createMeshOptions.y = y;
        createMeshOptions.level = level;
        createMeshOptions.exaggeration = frameState.terrainExaggeration;
        createMeshOptions.exaggerationRelativeHeight =
            frameState.terrainExaggerationRelativeHeight;
        createMeshOptions.throttle = true;

        const terrainData = surfaceTile.terrainData;
        const meshPromise = terrainData.createMesh(createMeshOptions);

        if (!defined$8(meshPromise)) {
            // Postponed.
            return;
        }

        surfaceTile.terrainState = TerrainState.TRANSFORMING;

        when$4(
            meshPromise,
            function (mesh) {
                surfaceTile.mesh = mesh;
                surfaceTile.terrainState = TerrainState.TRANSFORMED;
            },
            function () {
                surfaceTile.terrainState = TerrainState.FAILED;
            }
        );
    }
    function processStateMachine(tile, framestate, terrainProvider, layers, quadtree) {
        const surfaceTile = tile.data;
        if (surfaceTile.terrainState === TerrainState.UNLOADED) {
            requestGeometry(tile, framestate, terrainProvider);
        }
        if (surfaceTile.terrainState === TerrainState.RECEIVED) {
            transform(
                surfaceTile,
                framestate,
                terrainProvider,
                tile.x,
                tile.y,
                tile.level
            );
        }
        if (surfaceTile.terrainState === TerrainState.TRANSFORMED) {
            tile.renderable = true;
        }
    }
    function getObjectByTile(objects, tile) {
        const tileObject = [];
        for (let object of objects) {
            if (!defined$8(object)) {
                continue;
            }
            if (!defined$8(object.id)) {
                object.id = createGuid$3();
            }
            if (!(defined$8(object) && defined$8(object.position))) {
                continue;
            }
            if (object.position instanceof Cartesian3$3) {
                object.cartesian = object.position;
            } else if (object.position instanceof Cartographic$3) {
                object.cartesian = Cartographic$3.toCartesian(object.position);
                object.catographic = object.position;
            } else if (object.position instanceof LonLat) {
                object.cartesian = object.position.toCartesian();
                object.cartographic = object.position.toCartoGraphic();
            } else {
                object.cartesian = object.position;
            }
            if (!object.cartographic) {
                object.cartographic = Cartographic$3.fromCartesian(object.cartesian);
            }
            if (Rectangle$2.contains(tile.rectangle, object.cartographic)) {
                tileObject.push(object);
            }
        }
        return tileObject;
    }
    class QuadTile {
        constructor() {
            this.boundingVolumeSourceTile = undefined;
            this.terrainState = Cesium.TerrainState.UNLOADED;
            this.mesh = undefined;
            this.terrainData = undefined;
            this.objects = undefined;
            this._geometryOfTile = new AssociativeArray$1();
            this._objectsOfTile = new AssociativeArray$1();
            this._needRenderObjects = new AssociativeArray$1();

        }
        static processStateMachine(tile, frameState, terrainProvider, layers, quadtree) {
            QuadTile.initialize(tile, terrainProvider);
            if (tile.state === QuadtreeTileLoadState.LOADING) {
                processStateMachine(
                    tile,
                    frameState,
                    terrainProvider);
            }
        }
        static initialize(tile, terrainProvider) {
            let surfaceTile = tile.data;
            if (!defined$8(surfaceTile)) {
                surfaceTile = tile.data = new QuadTile();
            }

            if (tile.state === QuadtreeTileLoadState.START) {
                tile.state = QuadtreeTileLoadState.LOADING;
            }
        }
    }
    function createGeometry(provider, layer, tile, framestate, objects) {
        let list = tile.data._geometryOfTile.get(layer.id);
        let hasRenderCached = provider._hasRenderCached.get(layer.id);
        if (!hasRenderCached) {
            hasRenderCached = {};
            provider._hasRenderCached.set(layer.id, hasRenderCached);
        }
        if (!list) {
            list = [];
        }
        for (let object of objects) {
            if (hasRenderCached[object.id]) {
                return;
            }
            const geometry = layer.createGeometry(tile, framestate, object);
            if (!geometry) {
                continue;
            }
            hasRenderCached[object.id] = true;
            list.push({ id: object.id, geometry });
        }
        tile.data._geometryOfTile.set(layer.id, list);
    }
    function removeGeometry(provider, layer, tile, framestate, geometryList) {
        const hasRenderCached = provider._hasRenderCached.get(layer.id);
        for (let geometryObject of geometryList) {
            const { id, geometry } = geometryObject;
            layer.removeGeometry(framestate, geometry);
            delete hasRenderCached[id];
        }
        tile.data._geometryOfTile.remove(layer.id);

    }
    class QuadTreeProvider {
        constructor(options = {}) {
            // super(options)
            this._ready = true;
            this._scene = options.scene;
            this._tilingSceheme = new GeographicTilingScheme$2();
            this._readyPromise = when$4.defer();
            this._readyPromise.resolve(true);
            this._errorEvent = new Event$5();
            this._terrainProvider = options.terrainProvider;
            this._show = true;
            this.cartographicLimitRectangle = Rectangle$2.clone(Rectangle$2.MAX_VALUE);
            this.tree = undefined;
            this._layers = new MassiveGraphicLayerCollection();
            this._lastTilesToRender = [];
            this._hasRenderCached = new AssociativeArray$1();
            this._tilesCahced = [];
            // this._removeEventListener = this._scene.camera.changed.addEventListener(() => {
            //     const layers = this._layers.values;
            //     for (let layer of layers) {
            //         const cluster = layer.updateCluster(this._scene.camera.positionCartographic.height);
            //         cluster.then(needClear => {
            //             needClear && (this.clearTile(layer.id), layer.removeAll());
            //         })                
            //     }
            // })
        }
        get terrainProvider() {
            return this._terrainProvider;
        }
        get show() {
            return this._show;
        }
        set show(val) {
            this._show = val;
        }
        get ready() {
            return this._ready;
        }
        get tilingScheme() {
            return this._tilingSceheme;
        }
        get readyPromise() {
            return this._readyPromise;
        }
        get quadtree() {
            return this._quadtree;
        }
        set quadtree(val) {
            if (defined$8(val)) {
                this._quadtree = val;
            }
        }
        /**
         *QuadtreePrimitive.beginFrame中调用该方法
         * @param {Cesium.FrameState} framestate 
         */
        initialize(framestate) {
            for (let layer of this._layers.values) {
                layer.initialize(framestate, this._scene);
            }
        }
        /**
         * QuadtreePrimitive.render中会调用该方法，此时还不知道本此渲染需要用到哪些瓦片。
         * @param {Cesium.FrameState}} framestate 
         */
        beginUpdate(framestate) {
            const layers = this._layers.values;
            for (let layer of layers) {
                layer.beginUpdate(framestate);
            }
            this._frameNumber++;
        }
        /**
         * QuadtreePrimitive.render中会调用该方法，在beginUpdate之后
         * @param {*} tile 
         * @param {*} framestate 
         */
        showTileThisFrame(tile, framestate) {
            const surfaceData = tile.data;
            if (!defined$8(surfaceData)) {
                return;
            }
            if (!this._tilesCahced.includes(tile)) {
                this._tilesCahced.push(tile);
            }
            const layers = this._layers.values;
            getTimestamp();
            for (let layer of layers) {
                if (!(defined$8(layer.objects) && Array.isArray(layer.objects))) {
                    continue;
                }
                // if(getTimestamp() < time + loadQueueTimeSlice) {
                //     break;
                // }
                const id = layer.id;
                const geometryOfTile = surfaceData._geometryOfTile.get(id);
                if (geometryOfTile && !layer._needReclass) {
                    return;
                }
                let tileObjects = surfaceData._objectsOfTile.get(id);
                if (!defined$8(tileObjects) || layer._needReclass) {
                    tileObjects = getObjectByTile(layer.objects, tile);
                    surfaceData._objectsOfTile.set(id, tileObjects);
                }
                createGeometry(this, layer, tile, framestate, tileObjects);
            }
        }
        /**
         * QuadtreePrimitive.render中会调用该方法, 在showTileThisFrame之后。
         */
        endUpdate(framestate) {
            const quadtree = this._quadtree;
            if (!quadtree) {
                return;
            }
            const lastTilesToRender = this._lastTilesToRender;
            const tilesToRender = quadtree._tilesToRender;
            const layers = this._layers.values;
            for (let tile of lastTilesToRender) {
                if (tilesToRender.includes(tile)) {
                    continue;
                }
                for (let layer of layers) {
                    const geometryList = tile.data._geometryOfTile.get(layer.id) || [];
                    removeGeometry(this, layer, tile, framestate, geometryList);
                }
            }
            for (let layer of layers) {
                const needClear = layer.endUpdate(framestate);
                if(needClear) {
                    tilesToRender.forEach(tile => {
                        const geoList = tile.data._geometryOfTile.get(layer.id) || [];
                        removeGeometry(this, layer, tile, framestate, geoList);
                    });
                }
            }
            this._lastTilesToRender = [...tilesToRender];
        }
        /**
         * 加载瓦片数据，QuadtreePrimitive的endFrame中会调用该函数。
         * @param {Cesium.FrameState} framestate 
         * @param {Cesium.QuadTile} tile 瓦片信息
         */
        loadTile(framestate, tile) {
            if (!this.terrainProvider.ready) {
                return;
            }
            let terrainStateBefore;
            let terrainOnly = true;
            if (tile.data) {
                terrainStateBefore = tile.data.terrainState;
                terrainOnly = tile.data.boundingVolumeSourceTile !== tile;
            }
            QuadTile.processStateMachine(tile, framestate, this.terrainProvider, this._layers, this.quadtree);
            const surfaceTile = tile.data;
            if (terrainOnly && terrainStateBefore !== tile.data.terrainState) {
                if (
                    this.computeTileVisibility(tile, framestate, this.quadtree.occluders) !==
                    Visibility.NONE &&
                    surfaceTile.boundingVolumeSourceTile === tile
                ) {
                    QuadTile.processStateMachine(tile, framestate, this.terrainProvider, this._layers, this.quadtree);
                }
            }
        }
        getLevelMaximumGeometricError(level) {
            return this._terrainProvider.getLevelMaximumGeometricError(level);
        }
        canRefine(tile) {
            return GlobeSurfaceTileProvider$1.prototype.canRefine.call(this, tile);
        }
        computeTileVisibility(tile, frameState, occluders) {
            if (!defined$8(tile.data)) {
                tile.data = new QuadTile();
            }
            return GlobeSurfaceTileProvider$1.prototype.computeTileVisibility.call(this, tile, frameState, occluders)
        }
        computeDistanceToTile(tile, framestate) {
            if (!tile.data) {
                tile.data = new QuadTile();
            }
            return GlobeSurfaceTileProvider$1.prototype.computeDistanceToTile.call(this, tile, framestate)
        }
        clearTile(id) {
            const tiles = this._tilesCahced;
            for (let tile of tiles) {
                tile.data._geometryOfTile.remove(id);
                tile.data._objectsOfTile.remove(id);
            }
            this._hasRenderCached.remove(id);
        }
        isDestroyed() {
            return false;
        }
        destroy() {
            this._removeEventListener();
            const layers = this._layers.values;
            for (let layer of layers) {
                layer.destroy();
            }
        }
        computeTileLoadPriority(tile, frameState) {
            return GlobeSurfaceTileProvider$1.prototype.computeTileLoadPriority(tile, frameState)
        }
        _onLayerAdded(layer, index) {

        }
        _onLayerRemoved(layer, index) {

        }
        _onLayerShownOrHidden(
            layer,
            index,
            show
        ) {
            if (show) {
                this._onLayerAdded(layer, index);
            } else {
                this._onLayerRemoved(layer, index);
            }
        }
    }

    //This file is automatically rebuilt by the Cesium build process.
    var GlobeFS = "uniform vec4 u_initialColor;\n\
\n\
#if TEXTURE_UNITS > 0\n\
uniform sampler2D u_dayTextures[TEXTURE_UNITS];\n\
uniform vec4 u_dayTextureTranslationAndScale[TEXTURE_UNITS];\n\
uniform bool u_dayTextureUseWebMercatorT[TEXTURE_UNITS];\n\
\n\
#ifdef APPLY_ALPHA\n\
uniform float u_dayTextureAlpha[TEXTURE_UNITS];\n\
#endif\n\
\n\
#ifdef APPLY_DAY_NIGHT_ALPHA\n\
uniform float u_dayTextureNightAlpha[TEXTURE_UNITS];\n\
uniform float u_dayTextureDayAlpha[TEXTURE_UNITS];\n\
#endif\n\
\n\
#ifdef APPLY_SPLIT\n\
uniform float czm_p_imagerySplitPosition;\n\
uniform float czm_p_drawingBufferHeight;\n\
uniform float czm_p_drawingBufferWidth;\n\
uniform float u_dayTextureSplit[TEXTURE_UNITS];\n\
#endif\n\
\n\
#ifdef APPLY_BRIGHTNESS\n\
uniform float u_dayTextureBrightness[TEXTURE_UNITS];\n\
#endif\n\
\n\
#ifdef APPLY_CONTRAST\n\
uniform float u_dayTextureContrast[TEXTURE_UNITS];\n\
#endif\n\
\n\
#ifdef APPLY_HUE\n\
uniform float u_dayTextureHue[TEXTURE_UNITS];\n\
#endif\n\
\n\
#ifdef APPLY_SATURATION\n\
uniform float u_dayTextureSaturation[TEXTURE_UNITS];\n\
#endif\n\
\n\
#ifdef APPLY_GAMMA\n\
uniform float u_dayTextureOneOverGamma[TEXTURE_UNITS];\n\
#endif\n\
\n\
#ifdef APPLY_IMAGERY_CUTOUT\n\
uniform vec4 u_dayTextureCutoutRectangles[TEXTURE_UNITS];\n\
#endif\n\
\n\
#ifdef APPLY_COLOR_TO_ALPHA\n\
uniform vec4 u_colorsToAlpha[TEXTURE_UNITS];\n\
#endif\n\
\n\
uniform vec4 u_dayTextureTexCoordsRectangle[TEXTURE_UNITS];\n\
#endif\n\
\n\
#ifdef SHOW_REFLECTIVE_OCEAN\n\
uniform sampler2D u_waterMask;\n\
uniform vec4 u_waterMaskTranslationAndScale;\n\
uniform float u_zoomedOutOceanSpecularIntensity;\n\
#endif\n\
\n\
#ifdef SHOW_OCEAN_WAVES\n\
uniform sampler2D u_oceanNormalMap;\n\
#endif\n\
\n\
#if defined(ENABLE_DAYNIGHT_SHADING) || defined(GROUND_ATMOSPHERE)\n\
uniform vec2 u_lightingFadeDistance;\n\
#endif\n\
\n\
#ifdef TILE_LIMIT_RECTANGLE\n\
uniform vec4 u_cartographicLimitRectangle;\n\
#endif\n\
\n\
#ifdef GROUND_ATMOSPHERE\n\
uniform vec2 u_nightFadeDistance;\n\
#endif\n\
\n\
#ifdef ENABLE_CLIPPING_PLANES\n\
uniform highp sampler2D u_clippingPlanes;\n\
uniform mat4 u_clippingPlanesMatrix;\n\
uniform vec4 u_clippingPlanesEdgeStyle;\n\
#endif\n\
\n\
#if defined(FOG) && defined(DYNAMIC_ATMOSPHERE_LIGHTING) && (defined(ENABLE_VERTEX_LIGHTING) || defined(ENABLE_DAYNIGHT_SHADING))\n\
uniform float u_minimumBrightness;\n\
#endif\n\
\n\
#ifdef COLOR_CORRECT\n\
uniform vec3 u_hsbShift; // Hue, saturation, brightness\n\
#endif\n\
\n\
#ifdef HIGHLIGHT_FILL_TILE\n\
uniform vec4 u_fillHighlightColor;\n\
#endif\n\
\n\
#ifdef TRANSLUCENT\n\
uniform vec4 u_frontFaceAlphaByDistance;\n\
uniform vec4 u_backFaceAlphaByDistance;\n\
uniform vec4 u_translucencyRectangle;\n\
#endif\n\
\n\
#ifdef UNDERGROUND_COLOR\n\
uniform vec4 u_undergroundColor;\n\
uniform vec4 u_undergroundColorAlphaByDistance;\n\
#endif\n\
\n\
varying vec3 v_positionMC;\n\
varying vec3 v_positionEC;\n\
varying vec3 v_textureCoordinates;\n\
varying vec3 v_normalMC;\n\
varying vec3 v_normalEC;\n\
\n\
#ifdef APPLY_MATERIAL\n\
varying float v_height;\n\
varying float v_slope;\n\
varying float v_aspect;\n\
#endif\n\
\n\
#if defined(FOG) || defined(GROUND_ATMOSPHERE) || defined(UNDERGROUND_COLOR) || defined(TRANSLUCENT)\n\
varying float v_distance;\n\
#endif\n\
\n\
#if defined(FOG) || defined(GROUND_ATMOSPHERE)\n\
varying vec3 v_fogRayleighColor;\n\
varying vec3 v_fogMieColor;\n\
#endif\n\
\n\
#ifdef GROUND_ATMOSPHERE\n\
varying vec3 v_rayleighColor;\n\
varying vec3 v_mieColor;\n\
#endif\n\
\n\
#if defined(UNDERGROUND_COLOR) || defined(TRANSLUCENT)\n\
float interpolateByDistance(vec4 nearFarScalar, float distance)\n\
{\n\
    float startDistance = nearFarScalar.x;\n\
    float startValue = nearFarScalar.y;\n\
    float endDistance = nearFarScalar.z;\n\
    float endValue = nearFarScalar.w;\n\
    float t = clamp((distance - startDistance) / (endDistance - startDistance), 0.0, 1.0);\n\
    return mix(startValue, endValue, t);\n\
}\n\
#endif\n\
\n\
#if defined(UNDERGROUND_COLOR) || defined(TRANSLUCENT) || defined(APPLY_MATERIAL)\n\
vec4 alphaBlend(vec4 sourceColor, vec4 destinationColor)\n\
{\n\
    return sourceColor * vec4(sourceColor.aaa, 1.0) + destinationColor * (1.0 - sourceColor.a);\n\
}\n\
#endif\n\
\n\
#ifdef TRANSLUCENT\n\
bool inTranslucencyRectangle()\n\
{\n\
    return\n\
        v_textureCoordinates.x > u_translucencyRectangle.x &&\n\
        v_textureCoordinates.x < u_translucencyRectangle.z &&\n\
        v_textureCoordinates.y > u_translucencyRectangle.y &&\n\
        v_textureCoordinates.y < u_translucencyRectangle.w;\n\
}\n\
#endif\n\
\n\
vec4 sampleAndBlend(\n\
    vec4 previousColor,\n\
    sampler2D textureToSample,\n\
    vec2 tileTextureCoordinates,\n\
    vec4 textureCoordinateRectangle,\n\
    vec4 textureCoordinateTranslationAndScale,\n\
    float textureAlpha,\n\
    float textureNightAlpha,\n\
    float textureDayAlpha,\n\
    float textureBrightness,\n\
    float textureContrast,\n\
    float textureHue,\n\
    float textureSaturation,\n\
    float textureOneOverGamma,\n\
    float split,\n\
    vec4 colorToAlpha,\n\
    float nightBlend)\n\
{\n\
    // This crazy step stuff sets the alpha to 0.0 if this following condition is true:\n\
    //    tileTextureCoordinates.s < textureCoordinateRectangle.s ||\n\
    //    tileTextureCoordinates.s > textureCoordinateRectangle.p ||\n\
    //    tileTextureCoordinates.t < textureCoordinateRectangle.t ||\n\
    //    tileTextureCoordinates.t > textureCoordinateRectangle.q\n\
    // In other words, the alpha is zero if the fragment is outside the rectangle\n\
    // covered by this texture.  Would an actual 'if' yield better performance?\n\
    vec2 alphaMultiplier = step(textureCoordinateRectangle.st, tileTextureCoordinates);\n\
    textureAlpha = textureAlpha * alphaMultiplier.x * alphaMultiplier.y;\n\
\n\
    alphaMultiplier = step(vec2(0.0), textureCoordinateRectangle.pq - tileTextureCoordinates);\n\
    textureAlpha = textureAlpha * alphaMultiplier.x * alphaMultiplier.y;\n\
\n\
#if defined(APPLY_DAY_NIGHT_ALPHA) && defined(ENABLE_DAYNIGHT_SHADING)\n\
    textureAlpha *= mix(textureDayAlpha, textureNightAlpha, nightBlend);\n\
#endif\n\
\n\
    vec2 translation = textureCoordinateTranslationAndScale.xy;\n\
    vec2 scale = textureCoordinateTranslationAndScale.zw;\n\
    vec2 textureCoordinates = tileTextureCoordinates * scale + translation;\n\
    vec4 value = texture2D(textureToSample, textureCoordinates);\n\
    vec3 color = value.rgb;\n\
    float alpha = value.a;\n\
\n\
#ifdef APPLY_COLOR_TO_ALPHA\n\
    vec3 colorDiff = abs(color.rgb - colorToAlpha.rgb);\n\
    colorDiff.r = max(max(colorDiff.r, colorDiff.g), colorDiff.b);\n\
    alpha = czm_branchFreeTernary(colorDiff.r < colorToAlpha.a, 0.0, alpha);\n\
#endif\n\
\n\
#if !defined(APPLY_GAMMA)\n\
    vec4 tempColor = czm_gammaCorrect(vec4(color, alpha));\n\
    color = tempColor.rgb;\n\
    alpha = tempColor.a;\n\
#else\n\
    color = pow(color, vec3(textureOneOverGamma));\n\
#endif\n\
\n\
#ifdef APPLY_SPLIT\n\
    float splitPosition = czm_p_imagerySplitPosition * czm_p_drawingBufferWidth;\n\
    // 垂直分割 \n\
    if(split < -2.0 || split > 2.0) {\n\
        splitPosition = (1.0 - czm_p_imagerySplitPosition) * czm_p_drawingBufferHeight;\n\
    }\n\
    if(split < -2.0 && gl_FragCoord.y < splitPosition) {\n\
        alpha = 0.0;\n\
    }\n\
    else if (split > 2.0 && gl_FragCoord.y > splitPosition) {\n\
        alpha = 0.0;\n\
    }\n\
    // Split to the left\n\
    else if (split > -2.0 && split < 0.0 && gl_FragCoord.x > splitPosition) {\n\
       alpha = 0.0;\n\
    }\n\
    // Split to the right\n\
    else if (split < 2.0 && split > 0.0 && gl_FragCoord.x < splitPosition) {\n\
       alpha = 0.0;\n\
    }\n\
#endif\n\
\n\
#ifdef APPLY_BRIGHTNESS\n\
    color = mix(vec3(0.0), color, textureBrightness);\n\
#endif\n\
\n\
#ifdef APPLY_CONTRAST\n\
    color = mix(vec3(0.5), color, textureContrast);\n\
#endif\n\
\n\
#ifdef APPLY_HUE\n\
    color = czm_hue(color, textureHue);\n\
#endif\n\
\n\
#ifdef APPLY_SATURATION\n\
    color = czm_saturation(color, textureSaturation);\n\
#endif\n\
\n\
    float sourceAlpha = alpha * textureAlpha;\n\
    float outAlpha = mix(previousColor.a, 1.0, sourceAlpha);\n\
    outAlpha += sign(outAlpha) - 1.0;\n\
\n\
    vec3 outColor = mix(previousColor.rgb * previousColor.a, color, sourceAlpha) / outAlpha;\n\
\n\
    // When rendering imagery for a tile in multiple passes,\n\
    // some GPU/WebGL implementation combinations will not blend fragments in\n\
    // additional passes correctly if their computation includes an unmasked\n\
    // divide-by-zero operation,\n\
    // even if it's not in the output or if the output has alpha zero.\n\
    //\n\
    // For example, without sanitization for outAlpha,\n\
    // this renders without artifacts:\n\
    //   if (outAlpha == 0.0) { outColor = vec3(0.0); }\n\
    //\n\
    // but using czm_branchFreeTernary will cause portions of the tile that are\n\
    // alpha-zero in the additional pass to render as black instead of blending\n\
    // with the previous pass:\n\
    //   outColor = czm_branchFreeTernary(outAlpha == 0.0, vec3(0.0), outColor);\n\
    //\n\
    // So instead, sanitize against divide-by-zero,\n\
    // store this state on the sign of outAlpha, and correct on return.\n\
\n\
    return vec4(outColor, max(outAlpha, 0.0));\n\
}\n\
\n\
vec3 colorCorrect(vec3 rgb) {\n\
#ifdef COLOR_CORRECT\n\
    // Convert rgb color to hsb\n\
    vec3 hsb = czm_RGBToHSB(rgb);\n\
    // Perform hsb shift\n\
    hsb.x += u_hsbShift.x; // hue\n\
    hsb.y = clamp(hsb.y + u_hsbShift.y, 0.0, 1.0); // saturation\n\
    hsb.z = hsb.z > czm_epsilon7 ? hsb.z + u_hsbShift.z : 0.0; // brightness\n\
    // Convert shifted hsb back to rgb\n\
    rgb = czm_HSBToRGB(hsb);\n\
#endif\n\
    return rgb;\n\
}\n\
\n\
vec4 computeDayColor(vec4 initialColor, vec3 textureCoordinates, float nightBlend);\n\
vec4 computeWaterColor(vec3 positionEyeCoordinates, vec2 textureCoordinates, mat3 enuToEye, vec4 imageryColor, float specularMapValue, float fade);\n\
\n\
#ifdef GROUND_ATMOSPHERE\n\
vec3 computeGroundAtmosphereColor(vec3 fogColor, vec4 finalColor, vec3 atmosphereLightDirection, float cameraDist);\n\
#endif\n\
\n\
const float fExposure = 2.0;\n\
\n\
void main()\n\
{\n\
#ifdef TILE_LIMIT_RECTANGLE\n\
    if (v_textureCoordinates.x < u_cartographicLimitRectangle.x || u_cartographicLimitRectangle.z < v_textureCoordinates.x ||\n\
        v_textureCoordinates.y < u_cartographicLimitRectangle.y || u_cartographicLimitRectangle.w < v_textureCoordinates.y)\n\
        {\n\
            discard;\n\
        }\n\
#endif\n\
\n\
#ifdef ENABLE_CLIPPING_PLANES\n\
    float clipDistance = clip(gl_FragCoord, u_clippingPlanes, u_clippingPlanesMatrix);\n\
#endif\n\
\n\
#if defined(SHOW_REFLECTIVE_OCEAN) || defined(ENABLE_DAYNIGHT_SHADING) || defined(HDR)\n\
    vec3 normalMC = czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0));   // normalized surface normal in model coordinates\n\
    vec3 normalEC = czm_normal3D * normalMC;                                         // normalized surface normal in eye coordiantes\n\
#endif\n\
\n\
#if defined(APPLY_DAY_NIGHT_ALPHA) && defined(ENABLE_DAYNIGHT_SHADING)\n\
    float nightBlend = 1.0 - clamp(czm_getLambertDiffuse(czm_lightDirectionEC, normalEC) * 5.0, 0.0, 1.0);\n\
#else\n\
    float nightBlend = 0.0;\n\
#endif\n\
\n\
    // The clamp below works around an apparent bug in Chrome Canary v23.0.1241.0\n\
    // where the fragment shader sees textures coordinates < 0.0 and > 1.0 for the\n\
    // fragments on the edges of tiles even though the vertex shader is outputting\n\
    // coordinates strictly in the 0-1 range.\n\
    vec4 color = computeDayColor(u_initialColor, clamp(v_textureCoordinates, 0.0, 1.0), nightBlend);\n\
\n\
#ifdef SHOW_TILE_BOUNDARIES\n\
    if (v_textureCoordinates.x < (1.0/256.0) || v_textureCoordinates.x > (255.0/256.0) ||\n\
        v_textureCoordinates.y < (1.0/256.0) || v_textureCoordinates.y > (255.0/256.0))\n\
    {\n\
        color = vec4(1.0, 0.0, 0.0, 1.0);\n\
    }\n\
#endif\n\
\n\
#if defined(ENABLE_DAYNIGHT_SHADING) || defined(GROUND_ATMOSPHERE)\n\
    float cameraDist;\n\
    if (czm_sceneMode == czm_sceneMode2D)\n\
    {\n\
        cameraDist = max(czm_frustumPlanes.x - czm_frustumPlanes.y, czm_frustumPlanes.w - czm_frustumPlanes.z) * 0.5;\n\
    }\n\
    else if (czm_sceneMode == czm_sceneModeColumbusView)\n\
    {\n\
        cameraDist = -czm_view[3].z;\n\
    }\n\
    else\n\
    {\n\
        cameraDist = length(czm_view[3]);\n\
    }\n\
    float fadeOutDist = u_lightingFadeDistance.x;\n\
    float fadeInDist = u_lightingFadeDistance.y;\n\
    if (czm_sceneMode != czm_sceneMode3D) {\n\
        vec3 radii = czm_ellipsoidRadii;\n\
        float maxRadii = max(radii.x, max(radii.y, radii.z));\n\
        fadeOutDist -= maxRadii;\n\
        fadeInDist -= maxRadii;\n\
    }\n\
    float fade = clamp((cameraDist - fadeOutDist) / (fadeInDist - fadeOutDist), 0.0, 1.0);\n\
#else\n\
    float fade = 0.0;\n\
#endif\n\
\n\
#ifdef SHOW_REFLECTIVE_OCEAN\n\
    vec2 waterMaskTranslation = u_waterMaskTranslationAndScale.xy;\n\
    vec2 waterMaskScale = u_waterMaskTranslationAndScale.zw;\n\
    vec2 waterMaskTextureCoordinates = v_textureCoordinates.xy * waterMaskScale + waterMaskTranslation;\n\
    waterMaskTextureCoordinates.y = 1.0 - waterMaskTextureCoordinates.y;\n\
\n\
    float mask = texture2D(u_waterMask, waterMaskTextureCoordinates).r;\n\
\n\
    if (mask > 0.0)\n\
    {\n\
        mat3 enuToEye = czm_eastNorthUpToEyeCoordinates(v_positionMC, normalEC);\n\
\n\
        vec2 ellipsoidTextureCoordinates = czm_ellipsoidWgs84TextureCoordinates(normalMC);\n\
        vec2 ellipsoidFlippedTextureCoordinates = czm_ellipsoidWgs84TextureCoordinates(normalMC.zyx);\n\
\n\
        vec2 textureCoordinates = mix(ellipsoidTextureCoordinates, ellipsoidFlippedTextureCoordinates, czm_morphTime * smoothstep(0.9, 0.95, normalMC.z));\n\
\n\
        color = computeWaterColor(v_positionEC, textureCoordinates, enuToEye, color, mask, fade);\n\
    }\n\
#endif\n\
\n\
#ifdef APPLY_MATERIAL\n\
    czm_materialInput materialInput;\n\
    materialInput.st = v_textureCoordinates.st;\n\
    materialInput.normalEC = normalize(v_normalEC);\n\
    materialInput.positionToEyeEC = -v_positionEC;\n\
    materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, normalize(v_normalEC));     \n\
    materialInput.slope = v_slope;\n\
    materialInput.height = v_height;\n\
    materialInput.aspect = v_aspect;\n\
    czm_material material = czm_getMaterial(materialInput);\n\
    vec4 materialColor = vec4(material.diffuse, material.alpha);\n\
    color = alphaBlend(materialColor, color);\n\
#endif\n\
\n\
#ifdef ENABLE_VERTEX_LIGHTING\n\
    float diffuseIntensity = clamp(czm_getLambertDiffuse(czm_lightDirectionEC, normalize(v_normalEC)) * 0.9 + 0.3, 0.0, 1.0);\n\
    vec4 finalColor = vec4(color.rgb * czm_lightColor * diffuseIntensity, color.a);\n\
#elif defined(ENABLE_DAYNIGHT_SHADING)\n\
    float diffuseIntensity = clamp(czm_getLambertDiffuse(czm_lightDirectionEC, normalEC) * 5.0 + 0.3, 0.0, 1.0);\n\
    diffuseIntensity = mix(1.0, diffuseIntensity, fade);\n\
    vec4 finalColor = vec4(color.rgb * czm_lightColor * diffuseIntensity, color.a);\n\
#else\n\
    vec4 finalColor = color;\n\
#endif\n\
\n\
#ifdef ENABLE_CLIPPING_PLANES\n\
    vec4 clippingPlanesEdgeColor = vec4(1.0);\n\
    clippingPlanesEdgeColor.rgb = u_clippingPlanesEdgeStyle.rgb;\n\
    float clippingPlanesEdgeWidth = u_clippingPlanesEdgeStyle.a;\n\
\n\
    if (clipDistance < clippingPlanesEdgeWidth)\n\
    {\n\
        finalColor = clippingPlanesEdgeColor;\n\
    }\n\
#endif\n\
\n\
#ifdef HIGHLIGHT_FILL_TILE\n\
    finalColor = vec4(mix(finalColor.rgb, u_fillHighlightColor.rgb, u_fillHighlightColor.a), finalColor.a);\n\
#endif\n\
\n\
#if defined(FOG) || defined(GROUND_ATMOSPHERE)\n\
    vec3 fogColor = colorCorrect(v_fogMieColor) + finalColor.rgb * colorCorrect(v_fogRayleighColor);\n\
#ifndef HDR\n\
    fogColor = vec3(1.0) - exp(-fExposure * fogColor);\n\
#endif\n\
#endif\n\
\n\
#if defined(DYNAMIC_ATMOSPHERE_LIGHTING_FROM_SUN)\n\
    vec3 atmosphereLightDirection = czm_sunDirectionWC;\n\
#else\n\
    vec3 atmosphereLightDirection = czm_lightDirectionWC;\n\
#endif\n\
\n\
#ifdef FOG\n\
#if defined(DYNAMIC_ATMOSPHERE_LIGHTING) && (defined(ENABLE_VERTEX_LIGHTING) || defined(ENABLE_DAYNIGHT_SHADING))\n\
    float darken = clamp(dot(normalize(czm_viewerPositionWC), atmosphereLightDirection), u_minimumBrightness, 1.0);\n\
    fogColor *= darken;\n\
#endif\n\
\n\
#ifdef HDR\n\
    const float modifier = 0.15;\n\
    finalColor = vec4(czm_fog(v_distance, finalColor.rgb, fogColor, modifier), finalColor.a);\n\
#else\n\
    finalColor = vec4(czm_fog(v_distance, finalColor.rgb, fogColor), finalColor.a);\n\
#endif\n\
#endif\n\
\n\
#ifdef GROUND_ATMOSPHERE\n\
    if (!czm_backFacing())\n\
    {\n\
        vec3 groundAtmosphereColor = computeGroundAtmosphereColor(fogColor, finalColor, atmosphereLightDirection, cameraDist);\n\
        finalColor = vec4(mix(finalColor.rgb, groundAtmosphereColor, fade), finalColor.a);\n\
    }\n\
#endif\n\
\n\
#ifdef UNDERGROUND_COLOR\n\
    if (czm_backFacing())\n\
    {\n\
        float distanceFromEllipsoid = max(czm_eyeHeight, 0.0);\n\
        float distance = max(v_distance - distanceFromEllipsoid, 0.0);\n\
        float blendAmount = interpolateByDistance(u_undergroundColorAlphaByDistance, distance);\n\
        vec4 undergroundColor = vec4(u_undergroundColor.rgb, u_undergroundColor.a * blendAmount);\n\
        finalColor = alphaBlend(undergroundColor, finalColor);\n\
    }\n\
#endif\n\
\n\
#ifdef TRANSLUCENT\n\
    if (inTranslucencyRectangle())\n\
    {\n\
      vec4 alphaByDistance = gl_FrontFacing ? u_frontFaceAlphaByDistance : u_backFaceAlphaByDistance;\n\
      finalColor.a *= interpolateByDistance(alphaByDistance, v_distance);\n\
    }\n\
#endif\n\
\n\
    gl_FragColor = finalColor;\n\
}\n\
\n\
#ifdef GROUND_ATMOSPHERE\n\
vec3 computeGroundAtmosphereColor(vec3 fogColor, vec4 finalColor, vec3 atmosphereLightDirection, float cameraDist)\n\
{\n\
#if defined(PER_FRAGMENT_GROUND_ATMOSPHERE) && defined(DYNAMIC_ATMOSPHERE_LIGHTING) && (defined(ENABLE_DAYNIGHT_SHADING) || defined(ENABLE_VERTEX_LIGHTING))\n\
    float mpp = czm_metersPerPixel(vec4(0.0, 0.0, -czm_currentFrustum.x, 1.0), 1.0);\n\
    vec2 xy = gl_FragCoord.xy / czm_viewport.zw * 2.0 - vec2(1.0);\n\
    xy *= czm_viewport.zw * mpp * 0.5;\n\
\n\
    vec3 direction = normalize(vec3(xy, -czm_currentFrustum.x));\n\
    czm_ray ray = czm_ray(vec3(0.0), direction);\n\
\n\
    vec3 ellipsoid_center = czm_view[3].xyz;\n\
\n\
    czm_raySegment intersection = czm_rayEllipsoidIntersectionInterval(ray, ellipsoid_center, czm_ellipsoidInverseRadii);\n\
\n\
    vec3 ellipsoidPosition = czm_pointAlongRay(ray, intersection.start);\n\
    ellipsoidPosition = (czm_inverseView * vec4(ellipsoidPosition, 1.0)).xyz;\n\
    AtmosphereColor atmosColor = computeGroundAtmosphereFromSpace(ellipsoidPosition, true, atmosphereLightDirection);\n\
\n\
    vec3 groundAtmosphereColor = colorCorrect(atmosColor.mie) + finalColor.rgb * colorCorrect(atmosColor.rayleigh);\n\
#ifndef HDR\n\
    groundAtmosphereColor = vec3(1.0) - exp(-fExposure * groundAtmosphereColor);\n\
#endif\n\
\n\
    float fadeInDist = u_nightFadeDistance.x;\n\
    float fadeOutDist = u_nightFadeDistance.y;\n\
\n\
    float sunlitAtmosphereIntensity = clamp((cameraDist - fadeOutDist) / (fadeInDist - fadeOutDist), 0.0, 1.0);\n\
\n\
#ifdef HDR\n\
    // Some tweaking to make HDR look better\n\
    sunlitAtmosphereIntensity = max(sunlitAtmosphereIntensity * sunlitAtmosphereIntensity, 0.03);\n\
#endif\n\
\n\
    groundAtmosphereColor = mix(groundAtmosphereColor, fogColor, sunlitAtmosphereIntensity);\n\
#else\n\
    vec3 groundAtmosphereColor = fogColor;\n\
#endif\n\
\n\
#ifdef HDR\n\
    // Some tweaking to make HDR look better\n\
    groundAtmosphereColor = czm_saturation(groundAtmosphereColor, 1.6);\n\
#endif\n\
\n\
    return groundAtmosphereColor;\n\
}\n\
#endif\n\
\n\
#ifdef SHOW_REFLECTIVE_OCEAN\n\
\n\
float waveFade(float edge0, float edge1, float x)\n\
{\n\
    float y = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);\n\
    return pow(1.0 - y, 5.0);\n\
}\n\
\n\
float linearFade(float edge0, float edge1, float x)\n\
{\n\
    return clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);\n\
}\n\
\n\
// Based on water rendering by Jonas Wagner:\n\
// http://29a.ch/2012/7/19/webgl-terrain-rendering-water-fog\n\
\n\
// low altitude wave settings\n\
const float oceanFrequencyLowAltitude = 825000.0;\n\
const float oceanAnimationSpeedLowAltitude = 0.004;\n\
const float oceanOneOverAmplitudeLowAltitude = 1.0 / 2.0;\n\
const float oceanSpecularIntensity = 0.5;\n\
\n\
// high altitude wave settings\n\
const float oceanFrequencyHighAltitude = 125000.0;\n\
const float oceanAnimationSpeedHighAltitude = 0.008;\n\
const float oceanOneOverAmplitudeHighAltitude = 1.0 / 2.0;\n\
\n\
vec4 computeWaterColor(vec3 positionEyeCoordinates, vec2 textureCoordinates, mat3 enuToEye, vec4 imageryColor, float maskValue, float fade)\n\
{\n\
    vec3 positionToEyeEC = -positionEyeCoordinates;\n\
    float positionToEyeECLength = length(positionToEyeEC);\n\
\n\
    // The double normalize below works around a bug in Firefox on Android devices.\n\
    vec3 normalizedPositionToEyeEC = normalize(normalize(positionToEyeEC));\n\
\n\
    // Fade out the waves as the camera moves far from the surface.\n\
    float waveIntensity = waveFade(70000.0, 1000000.0, positionToEyeECLength);\n\
\n\
#ifdef SHOW_OCEAN_WAVES\n\
    // high altitude waves\n\
    float time = czm_frameNumber * oceanAnimationSpeedHighAltitude;\n\
    vec4 noise = czm_getWaterNoise(u_oceanNormalMap, textureCoordinates * oceanFrequencyHighAltitude, time, 0.0);\n\
    vec3 normalTangentSpaceHighAltitude = vec3(noise.xy, noise.z * oceanOneOverAmplitudeHighAltitude);\n\
\n\
    // low altitude waves\n\
    time = czm_frameNumber * oceanAnimationSpeedLowAltitude;\n\
    noise = czm_getWaterNoise(u_oceanNormalMap, textureCoordinates * oceanFrequencyLowAltitude, time, 0.0);\n\
    vec3 normalTangentSpaceLowAltitude = vec3(noise.xy, noise.z * oceanOneOverAmplitudeLowAltitude);\n\
\n\
    // blend the 2 wave layers based on distance to surface\n\
    float highAltitudeFade = linearFade(0.0, 60000.0, positionToEyeECLength);\n\
    float lowAltitudeFade = 1.0 - linearFade(20000.0, 60000.0, positionToEyeECLength);\n\
    vec3 normalTangentSpace =\n\
        (highAltitudeFade * normalTangentSpaceHighAltitude) +\n\
        (lowAltitudeFade * normalTangentSpaceLowAltitude);\n\
    normalTangentSpace = normalize(normalTangentSpace);\n\
\n\
    // fade out the normal perturbation as we move farther from the water surface\n\
    normalTangentSpace.xy *= waveIntensity;\n\
    normalTangentSpace = normalize(normalTangentSpace);\n\
#else\n\
    vec3 normalTangentSpace = vec3(0.0, 0.0, 1.0);\n\
#endif\n\
\n\
    vec3 normalEC = enuToEye * normalTangentSpace;\n\
\n\
    const vec3 waveHighlightColor = vec3(0.3, 0.45, 0.6);\n\
\n\
    // Use diffuse light to highlight the waves\n\
    float diffuseIntensity = czm_getLambertDiffuse(czm_lightDirectionEC, normalEC) * maskValue;\n\
    vec3 diffuseHighlight = waveHighlightColor * diffuseIntensity * (1.0 - fade);\n\
\n\
#ifdef SHOW_OCEAN_WAVES\n\
    // Where diffuse light is low or non-existent, use wave highlights based solely on\n\
    // the wave bumpiness and no particular light direction.\n\
    float tsPerturbationRatio = normalTangentSpace.z;\n\
    vec3 nonDiffuseHighlight = mix(waveHighlightColor * 5.0 * (1.0 - tsPerturbationRatio), vec3(0.0), diffuseIntensity);\n\
#else\n\
    vec3 nonDiffuseHighlight = vec3(0.0);\n\
#endif\n\
\n\
    // Add specular highlights in 3D, and in all modes when zoomed in.\n\
    float specularIntensity = czm_getSpecular(czm_lightDirectionEC, normalizedPositionToEyeEC, normalEC, 10.0);\n\
    float surfaceReflectance = mix(0.0, mix(u_zoomedOutOceanSpecularIntensity, oceanSpecularIntensity, waveIntensity), maskValue);\n\
    float specular = specularIntensity * surfaceReflectance;\n\
\n\
#ifdef HDR\n\
    specular *= 1.4;\n\
\n\
    float e = 0.2;\n\
    float d = 3.3;\n\
    float c = 1.7;\n\
\n\
    vec3 color = imageryColor.rgb + (c * (vec3(e) + imageryColor.rgb * d) * (diffuseHighlight + nonDiffuseHighlight + specular));\n\
#else\n\
    vec3 color = imageryColor.rgb + diffuseHighlight + nonDiffuseHighlight + specular;\n\
#endif\n\
\n\
    return vec4(color, imageryColor.a);\n\
}\n\
\n\
#endif // #ifdef SHOW_REFLECTIVE_OCEAN\n\
";

    const { BoundingSphere: BoundingSphere$2, buildModuleUrl, Cartesian3: Cartesian3$2, Cartographic: Cartographic$2, Color: Color$4, defaultValue: defaultValue$2, defined: defined$3, destroyObject: destroyObject$2, DeveloperError: DeveloperError$2, Ellipsoid, EllipsoidTerrainProvider, Event: Event$4, IntersectionTests, NearFarScalar, Ray, Rectangle: Rectangle$1, Resource: Resource$1, ShaderSource: ShaderSource$2, Texture, when: when$3, GlobeSurfaceShaderSet, GlobeSurfaceTileProvider, GlobeTranslucency, ImageryLayerCollection, QuadtreePrimitive, SceneMode: SceneMode$1, ShadowMode } = Cesium;
    const GlobeVS = Cesium._shadersGlobeVS;
    const GroundAtmosphere = Cesium._shadersGroundAtmosphere;
    /**
     * The globe rendered in the scene, including its terrain ({@link Globe#terrainProvider})
     * and imagery layers ({@link Globe#imageryLayers}).  Access the globe using {@link Scene#globe}.
     *
     * @alias Globe
     * @constructor
     *
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] Determines the size and shape of the
     * globe.
     */
    function Globe(ellipsoid) {
        ellipsoid = defaultValue$2(ellipsoid, Ellipsoid.WGS84);
        var terrainProvider = new EllipsoidTerrainProvider({
            ellipsoid: ellipsoid,
        });
        var imageryLayerCollection = new ImageryLayerCollection();

        this._ellipsoid = ellipsoid;
        this._from = 'cesiumpro-globe';
        this._imageryLayerCollection = imageryLayerCollection;

        this._surfaceShaderSet = new GlobeSurfaceShaderSet();
        this._material = undefined;

        this._surface = new QuadtreePrimitive({
            tileProvider: new GlobeSurfaceTileProvider({
                terrainProvider: terrainProvider,
                imageryLayers: imageryLayerCollection,
                surfaceShaderSet: this._surfaceShaderSet,
            }),
        });

        this._terrainProvider = terrainProvider;
        this._terrainProviderChanged = new Event$4();

        this._undergroundColor = Color$4.clone(Color$4.BLACK);
        this._undergroundColorAlphaByDistance = new NearFarScalar(
            ellipsoid.maximumRadius / 1000.0,
            0.0,
            ellipsoid.maximumRadius / 5.0,
            1.0
        );

        this._translucency = new GlobeTranslucency();

        makeShadersDirty(this);

        /**
         * Determines if the globe will be shown.
         *
         * @type {Boolean}
         * @default true
         */
        this.show = true;

        this._oceanNormalMapResourceDirty = true;
        this._oceanNormalMapResource = new Resource$1({
            url: buildModuleUrl("Assets/Textures/waterNormalsSmall.jpg"),
        });

        /**
         * The maximum screen-space error used to drive level-of-detail refinement.  Higher
         * values will provide better performance but lower visual quality.
         *
         * @type {Number}
         * @default 2
         */
        this.maximumScreenSpaceError = 2;

        /**
         * The size of the terrain tile cache, expressed as a number of tiles.  Any additional
         * tiles beyond this number will be freed, as long as they aren't needed for rendering
         * this frame.  A larger number will consume more memory but will show detail faster
         * when, for example, zooming out and then back in.
         *
         * @type {Number}
         * @default 100
         */
        this.tileCacheSize = 100;

        /**
         * Gets or sets the number of loading descendant tiles that is considered "too many".
         * If a tile has too many loading descendants, that tile will be loaded and rendered before any of
         * its descendants are loaded and rendered. This means more feedback for the user that something
         * is happening at the cost of a longer overall load time. Setting this to 0 will cause each
         * tile level to be loaded successively, significantly increasing load time. Setting it to a large
         * number (e.g. 1000) will minimize the number of tiles that are loaded but tend to make
         * detail appear all at once after a long wait.
         * @type {Number}
         * @default 20
         */
        this.loadingDescendantLimit = 20;

        /**
         * Gets or sets a value indicating whether the ancestors of rendered tiles should be preloaded.
         * Setting this to true optimizes the zoom-out experience and provides more detail in
         * newly-exposed areas when panning. The down side is that it requires loading more tiles.
         * @type {Boolean}
         * @default true
         */
        this.preloadAncestors = true;

        /**
         * Gets or sets a value indicating whether the siblings of rendered tiles should be preloaded.
         * Setting this to true causes tiles with the same parent as a rendered tile to be loaded, even
         * if they are culled. Setting this to true may provide a better panning experience at the
         * cost of loading more tiles.
         * @type {Boolean}
         * @default false
         */
        this.preloadSiblings = false;

        /**
         * The color to use to highlight terrain fill tiles. If undefined, fill tiles are not
         * highlighted at all. The alpha value is used to alpha blend with the tile's
         * actual color. Because terrain fill tiles do not represent the actual terrain surface,
         * it may be useful in some applications to indicate visually that they are not to be trusted.
         * @type {Color}
         * @default undefined
         */
        this.fillHighlightColor = undefined;

        /**
         * Enable lighting the globe with the scene's light source.
         *
         * @type {Boolean}
         * @default false
         */
        this.enableLighting = false;

        /**
         * Enable dynamic lighting effects on atmosphere and fog. This only takes effect
         * when <code>enableLighting</code> is <code>true</code>.
         *
         * @type {Boolean}
         * @default true
         */
        this.dynamicAtmosphereLighting = true;

        /**
         * Whether dynamic atmosphere lighting uses the sun direction instead of the scene's
         * light direction. This only takes effect when <code>enableLighting</code> and
         * <code>dynamicAtmosphereLighting</code> are <code>true</code>.
         *
         * @type {Boolean}
         * @default false
         */
        this.dynamicAtmosphereLightingFromSun = false;

        /**
         * Enable the ground atmosphere, which is drawn over the globe when viewed from a distance between <code>lightingFadeInDistance</code> and <code>lightingFadeOutDistance</code>.
         *
         * @demo {@link https://sandcastle.cesium.com/index.html?src=Ground%20Atmosphere.html|Ground atmosphere demo in Sandcastle}
         *
         * @type {Boolean}
         * @default true
         */
        this.showGroundAtmosphere = true;

        /**
         * The distance where everything becomes lit. This only takes effect
         * when <code>enableLighting</code> or <code>showGroundAtmosphere</code> is <code>true</code>.
         *
         * @type {Number}
         * @default 10000000.0
         */
        this.lightingFadeOutDistance = 1.0e7;

        /**
         * The distance where lighting resumes. This only takes effect
         * when <code>enableLighting</code> or <code>showGroundAtmosphere</code> is <code>true</code>.
         *
         * @type {Number}
         * @default 20000000.0
         */
        this.lightingFadeInDistance = 2.0e7;

        /**
         * The distance where the darkness of night from the ground atmosphere fades out to a lit ground atmosphere.
         * This only takes effect when <code>showGroundAtmosphere</code>, <code>enableLighting</code>, and
         * <code>dynamicAtmosphereLighting</code> are <code>true</code>.
         *
         * @type {Number}
         * @default 10000000.0
         */
        this.nightFadeOutDistance = 1.0e7;

        /**
         * The distance where the darkness of night from the ground atmosphere fades in to an unlit ground atmosphere.
         * This only takes effect when <code>showGroundAtmosphere</code>, <code>enableLighting</code>, and
         * <code>dynamicAtmosphereLighting</code> are <code>true</code>.
         *
         * @type {Number}
         * @default 50000000.0
         */
        this.nightFadeInDistance = 5.0e7;

        /**
         * True if an animated wave effect should be shown in areas of the globe
         * covered by water; otherwise, false.  This property is ignored if the
         * <code>terrainProvider</code> does not provide a water mask.
         *
         * @type {Boolean}
         * @default true
         */
        this.showWaterEffect = true;

        /**
         * True if primitives such as billboards, polylines, labels, etc. should be depth-tested
         * against the terrain surface, or false if such primitives should always be drawn on top
         * of terrain unless they're on the opposite side of the globe.  The disadvantage of depth
         * testing primitives against terrain is that slight numerical noise or terrain level-of-detail
         * switched can sometimes make a primitive that should be on the surface disappear underneath it.
         *
         * @type {Boolean}
         * @default false
         *
         */
        this.depthTestAgainstTerrain = false;

        /**
         * Determines whether the globe casts or receives shadows from light sources. Setting the globe
         * to cast shadows may impact performance since the terrain is rendered again from the light's perspective.
         * Currently only terrain that is in view casts shadows. By default the globe does not cast shadows.
         *
         * @type {ShadowMode}
         * @default ShadowMode.RECEIVE_ONLY
         */
        this.shadows = ShadowMode.RECEIVE_ONLY;

        /**
         * The hue shift to apply to the atmosphere. Defaults to 0.0 (no shift).
         * A hue shift of 1.0 indicates a complete rotation of the hues available.
         * @type {Number}
         * @default 0.0
         */
        this.atmosphereHueShift = 0.0;

        /**
         * The saturation shift to apply to the atmosphere. Defaults to 0.0 (no shift).
         * A saturation shift of -1.0 is monochrome.
         * @type {Number}
         * @default 0.0
         */
        this.atmosphereSaturationShift = 0.0;

        /**
         * The brightness shift to apply to the atmosphere. Defaults to 0.0 (no shift).
         * A brightness shift of -1.0 is complete darkness, which will let space show through.
         * @type {Number}
         * @default 0.0
         */
        this.atmosphereBrightnessShift = 0.0;

        /**
         * A scalar used to exaggerate the terrain. Defaults to <code>1.0</code> (no exaggeration).
         * A value of <code>2.0</code> scales the terrain by 2x.
         * A value of <code>0.0</code> makes the terrain completely flat.
         * Note that terrain exaggeration will not modify any other primitive as they are positioned relative to the ellipsoid.
         * @type {Number}
         * @default 1.0
         */
        this.terrainExaggeration = 1.0;

        /**
         * The height from which terrain is exaggerated. Defaults to <code>0.0</code> (scaled relative to ellipsoid surface).
         * Terrain that is above this height will scale upwards and terrain that is below this height will scale downwards.
         * Note that terrain exaggeration will not modify any other primitive as they are positioned relative to the ellipsoid.
         * If {@link Globe#terrainExaggeration} is <code>1.0</code> this value will have no effect.
         * @type {Number}
         * @default 0.0
         */
        this.terrainExaggerationRelativeHeight = 0.0;

        /**
         * Whether to show terrain skirts. Terrain skirts are geometry extending downwards from a tile's edges used to hide seams between neighboring tiles.
         * Skirts are always hidden when the camera is underground or translucency is enabled.
         *
         * @type {Boolean}
         * @default true
         */
        this.showSkirts = true;

        /**
         * Whether to cull back-facing terrain. Back faces are not culled when the camera is underground or translucency is enabled.
         *
         * @type {Boolean}
         * @default true
         */
        this.backFaceCulling = true;

        this._oceanNormalMap = undefined;
        this._zoomedOutOceanSpecularIntensity = undefined;
    }

    Object.defineProperties(Globe.prototype, {
        /**
         * Gets an ellipsoid describing the shape of this globe.
         * @memberof Globe.prototype
         * @type {Ellipsoid}
         */
        ellipsoid: {
            get: function () {
                return this._ellipsoid;
            },
        },
        /**
         * Gets the collection of image layers that will be rendered on this globe.
         * @memberof Globe.prototype
         * @type {ImageryLayerCollection}
         */
        imageryLayers: {
            get: function () {
                return this._imageryLayerCollection;
            },
        },
        /**
         * Gets an event that's raised when an imagery layer is added, shown, hidden, moved, or removed.
         *
         * @memberof Globe.prototype
         * @type {Event}
         * @readonly
         */
        imageryLayersUpdatedEvent: {
            get: function () {
                return this._surface.tileProvider.imageryLayersUpdatedEvent;
            },
        },
        /**
         * Returns <code>true</code> when the tile load queue is empty, <code>false</code> otherwise.  When the load queue is empty,
         * all terrain and imagery for the current view have been loaded.
         * @memberof Globe.prototype
         * @type {Boolean}
         * @readonly
         */
        tilesLoaded: {
            get: function () {
                if (!defined$3(this._surface)) {
                    return true;
                }
                return (
                    this._surface.tileProvider.ready &&
                    this._surface._tileLoadQueueHigh.length === 0 &&
                    this._surface._tileLoadQueueMedium.length === 0 &&
                    this._surface._tileLoadQueueLow.length === 0
                );
            },
        },
        /**
         * Gets or sets the color of the globe when no imagery is available.
         * @memberof Globe.prototype
         * @type {Color}
         */
        baseColor: {
            get: function () {
                return this._surface.tileProvider.baseColor;
            },
            set: function (value) {
                this._surface.tileProvider.baseColor = value;
            },
        },
        /**
         * A property specifying a {@link ClippingPlaneCollection} used to selectively disable rendering on the outside of each plane.
         *
         * @memberof Globe.prototype
         * @type {ClippingPlaneCollection}
         */
        clippingPlanes: {
            get: function () {
                return this._surface.tileProvider.clippingPlanes;
            },
            set: function (value) {
                this._surface.tileProvider.clippingPlanes = value;
            },
        },
        /**
         * A property specifying a {@link Rectangle} used to limit globe rendering to a cartographic area.
         * Defaults to the maximum extent of cartographic coordinates.
         *
         * @memberof Globe.prototype
         * @type {Rectangle}
         * @default {@link Rectangle.MAX_VALUE}
         */
        cartographicLimitRectangle: {
            get: function () {
                return this._surface.tileProvider.cartographicLimitRectangle;
            },
            set: function (value) {
                if (!defined$3(value)) {
                    value = Rectangle$1.clone(Rectangle$1.MAX_VALUE);
                }
                this._surface.tileProvider.cartographicLimitRectangle = value;
            },
        },
        /**
         * The normal map to use for rendering waves in the ocean.  Setting this property will
         * only have an effect if the configured terrain provider includes a water mask.
         * @memberof Globe.prototype
         * @type {String}
         * @default buildModuleUrl('Assets/Textures/waterNormalsSmall.jpg')
         */
        oceanNormalMapUrl: {
            get: function () {
                return this._oceanNormalMapResource.url;
            },
            set: function (value) {
                this._oceanNormalMapResource.url = value;
                this._oceanNormalMapResourceDirty = true;
            },
        },
        /**
         * The terrain provider providing surface geometry for this globe.
         * @type {TerrainProvider}
         *
         * @memberof Globe.prototype
         * @type {TerrainProvider}
         *
         */
        terrainProvider: {
            get: function () {
                return this._terrainProvider;
            },
            set: function (value) {
                if (value !== this._terrainProvider) {
                    this._terrainProvider = value;
                    this._terrainProviderChanged.raiseEvent(value);
                    if (defined$3(this._material)) {
                        makeShadersDirty(this);
                    }
                }
            },
        },
        /**
         * Gets an event that's raised when the terrain provider is changed
         *
         * @memberof Globe.prototype
         * @type {Event}
         * @readonly
         */
        terrainProviderChanged: {
            get: function () {
                return this._terrainProviderChanged;
            },
        },
        /**
         * Gets an event that's raised when the length of the tile load queue has changed since the last render frame.  When the load queue is empty,
         * all terrain and imagery for the current view have been loaded.  The event passes the new length of the tile load queue.
         *
         * @memberof Globe.prototype
         * @type {Event}
         */
        tileLoadProgressEvent: {
            get: function () {
                return this._surface.tileLoadProgressEvent;
            },
        },

        /**
         * Gets or sets the material appearance of the Globe.  This can be one of several built-in {@link Material} objects or a custom material, scripted with
         * {@link https://github.com/CesiumGS/cesium/wiki/Fabric|Fabric}.
         * @memberof Globe.prototype
         * @type {Material}
         */
        material: {
            get: function () {
                return this._material;
            },
            set: function (material) {
                if (this._material !== material) {
                    this._material = material;
                    makeShadersDirty(this);
                }
            },
        },

        /**
         * The color to render the back side of the globe when the camera is underground or the globe is translucent,
         * blended with the globe color based on the camera's distance.
         * <br /><br />
         * To disable underground coloring, set <code>undergroundColor</code> to <code>undefined</code>.
         *
         * @memberof Globe.prototype
         * @type {Color}
         * @default {@link Color.BLACK}
         *
         * @see Globe#undergroundColorAlphaByDistance
         */
        undergroundColor: {
            get: function () {
                return this._undergroundColor;
            },
            set: function (value) {
                this._undergroundColor = Color$4.clone(value, this._undergroundColor);
            },
        },

        /**
         * Gets or sets the near and far distance for blending {@link Globe#undergroundColor} with the globe color.
         * The alpha will interpolate between the {@link NearFarScalar#nearValue} and
         * {@link NearFarScalar#farValue} while the camera distance falls within the lower and upper bounds
         * of the specified {@link NearFarScalar#near} and {@link NearFarScalar#far}.
         * Outside of these ranges the alpha remains clamped to the nearest bound. If undefined,
         * the underground color will not be blended with the globe color.
         * <br /> <br />
         * When the camera is above the ellipsoid the distance is computed from the nearest
         * point on the ellipsoid instead of the camera's position.
         *
         * @memberof Globe.prototype
         * @type {NearFarScalar}
         *
         * @see Globe#undergroundColor
         *
         */
        undergroundColorAlphaByDistance: {
            get: function () {
                return this._undergroundColorAlphaByDistance;
            },
            set: function (value) {
                //>>includeStart('debug', pragmas.debug);
                if (defined$3(value) && value.far < value.near) {
                    throw new DeveloperError$2(
                        "far distance must be greater than near distance."
                    );
                }
                //>>includeEnd('debug');
                this._undergroundColorAlphaByDistance = NearFarScalar.clone(
                    value,
                    this._undergroundColorAlphaByDistance
                );
            },
        },

        /**
         * Properties for controlling globe translucency.
         *
         * @memberof Globe.prototype
         * @type {GlobeTranslucency}
         */
        translucency: {
            get: function () {
                return this._translucency;
            },
        },
    });

    function makeShadersDirty(globe) {
        var defines = [];

        var requireNormals =
            defined$3(globe._material) &&
            (globe._material.shaderSource.match(/slope/) ||
                globe._material.shaderSource.match("normalEC"));

        var fragmentSources = [GroundAtmosphere];
        if (
            defined$3(globe._material) &&
            (!requireNormals || globe._terrainProvider.requestVertexNormals)
        ) {
            fragmentSources.push(globe._material.shaderSource);
            defines.push("APPLY_MATERIAL");
            globe._surface._tileProvider.materialUniformMap = globe._material._uniforms;
        } else {
            globe._surface._tileProvider.materialUniformMap = undefined;
        }
        fragmentSources.push(GlobeFS);

        globe._surfaceShaderSet.baseVertexShaderSource = new ShaderSource$2({
            sources: [GroundAtmosphere, GlobeVS],
            defines: defines,
        });

        globe._surfaceShaderSet.baseFragmentShaderSource = new ShaderSource$2({
            sources: fragmentSources,
            defines: defines,
        });
        globe._surfaceShaderSet.material = globe._material;
    }

    function createComparePickTileFunction(rayOrigin) {
        return function (a, b) {
            var aDist = BoundingSphere$2.distanceSquaredTo(
                a.pickBoundingSphere,
                rayOrigin
            );
            var bDist = BoundingSphere$2.distanceSquaredTo(
                b.pickBoundingSphere,
                rayOrigin
            );

            return aDist - bDist;
        };
    }

    var scratchArray = [];
    var scratchSphereIntersectionResult = {
        start: 0.0,
        stop: 0.0,
    };

    /**
     * Find an intersection between a ray and the globe surface that was rendered. The ray must be given in world coordinates.
     *
     * @param {Ray} ray The ray to test for intersection.
     * @param {Scene} scene The scene.
     * @param {Boolean} [cullBackFaces=true] Set to true to not pick back faces.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3|undefined} The intersection or <code>undefined</code> if none was found.  The returned position is in projected coordinates for 2D and Columbus View.
     *
     * @private
     */
    Globe.prototype.pickWorldCoordinates = function (
        ray,
        scene,
        cullBackFaces,
        result
    ) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined$3(ray)) {
            throw new DeveloperError$2("ray is required");
        }
        if (!defined$3(scene)) {
            throw new DeveloperError$2("scene is required");
        }
        //>>includeEnd('debug');

        cullBackFaces = defaultValue$2(cullBackFaces, true);

        var mode = scene.mode;
        var projection = scene.mapProjection;

        var sphereIntersections = scratchArray;
        sphereIntersections.length = 0;

        var tilesToRender = this._surface._tilesToRender;
        var length = tilesToRender.length;

        var tile;
        var i;

        for (i = 0; i < length; ++i) {
            tile = tilesToRender[i];
            var surfaceTile = tile.data;

            if (!defined$3(surfaceTile)) {
                continue;
            }

            var boundingVolume = surfaceTile.pickBoundingSphere;
            if (mode !== SceneMode$1.SCENE3D) {
                surfaceTile.pickBoundingSphere = boundingVolume = BoundingSphere$2.fromRectangleWithHeights2D(
                    tile.rectangle,
                    projection,
                    surfaceTile.tileBoundingRegion.minimumHeight,
                    surfaceTile.tileBoundingRegion.maximumHeight,
                    boundingVolume
                );
                Cartesian3$2.fromElements(
                    boundingVolume.center.z,
                    boundingVolume.center.x,
                    boundingVolume.center.y,
                    boundingVolume.center
                );
            } else if (defined$3(surfaceTile.renderedMesh)) {
                BoundingSphere$2.clone(
                    surfaceTile.tileBoundingRegion.boundingSphere,
                    boundingVolume
                );
            } else {
                // So wait how did we render this thing then? It shouldn't be possible to get here.
                continue;
            }

            var boundingSphereIntersection = IntersectionTests.raySphere(
                ray,
                boundingVolume,
                scratchSphereIntersectionResult
            );
            if (defined$3(boundingSphereIntersection)) {
                sphereIntersections.push(surfaceTile);
            }
        }

        sphereIntersections.sort(createComparePickTileFunction(ray.origin));

        var intersection;
        length = sphereIntersections.length;
        for (i = 0; i < length; ++i) {
            intersection = sphereIntersections[i].pick(
                ray,
                scene.mode,
                scene.mapProjection,
                cullBackFaces,
                result
            );
            if (defined$3(intersection)) {
                break;
            }
        }

        return intersection;
    };

    var cartoScratch = new Cartographic$2();
    /**
     * Find an intersection between a ray and the globe surface that was rendered. The ray must be given in world coordinates.
     *
     * @param {Ray} ray The ray to test for intersection.
     * @param {Scene} scene The scene.
     * @param {Cartesian3} [result] The object onto which to store the result.
     * @returns {Cartesian3|undefined} The intersection or <code>undefined</code> if none was found.
     *
     * @example
     * // find intersection of ray through a pixel and the globe
     * var ray = viewer.camera.getPickRay(windowCoordinates);
     * var intersection = globe.pick(ray, scene);
     */
    Globe.prototype.pick = function (ray, scene, result) {
        result = this.pickWorldCoordinates(ray, scene, true, result);
        if (defined$3(result) && scene.mode !== SceneMode$1.SCENE3D) {
            result = Cartesian3$2.fromElements(result.y, result.z, result.x, result);
            var carto = scene.mapProjection.unproject(result, cartoScratch);
            result = scene.globe.ellipsoid.cartographicToCartesian(carto, result);
        }

        return result;
    };

    var scratchGetHeightCartesian = new Cartesian3$2();
    var scratchGetHeightIntersection = new Cartesian3$2();
    var scratchGetHeightCartographic = new Cartographic$2();
    var scratchGetHeightRay = new Ray();

    function tileIfContainsCartographic(tile, cartographic) {
        return defined$3(tile) && Rectangle$1.contains(tile.rectangle, cartographic)
            ? tile
            : undefined;
    }

    /**
     * Get the height of the surface at a given cartographic.
     *
     * @param {Cartographic} cartographic The cartographic for which to find the height.
     * @returns {Number|undefined} The height of the cartographic or undefined if it could not be found.
     */
    Globe.prototype.getHeight = function (cartographic) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined$3(cartographic)) {
            throw new DeveloperError$2("cartographic is required");
        }
        //>>includeEnd('debug');

        var levelZeroTiles = this._surface._levelZeroTiles;
        if (!defined$3(levelZeroTiles)) {
            return;
        }

        var tile;
        var i;

        var length = levelZeroTiles.length;
        for (i = 0; i < length; ++i) {
            tile = levelZeroTiles[i];
            if (Rectangle$1.contains(tile.rectangle, cartographic)) {
                break;
            }
        }

        if (i >= length) {
            return undefined;
        }

        var tileWithMesh = tile;

        while (defined$3(tile)) {
            tile =
                tileIfContainsCartographic(tile._southwestChild, cartographic) ||
                tileIfContainsCartographic(tile._southeastChild, cartographic) ||
                tileIfContainsCartographic(tile._northwestChild, cartographic) ||
                tile._northeastChild;

            if (
                defined$3(tile) &&
                defined$3(tile.data) &&
                defined$3(tile.data.renderedMesh)
            ) {
                tileWithMesh = tile;
            }
        }

        tile = tileWithMesh;

        // This tile was either rendered or culled.
        // It is sometimes useful to get a height from a culled tile,
        // e.g. when we're getting a height in order to place a billboard
        // on terrain, and the camera is looking at that same billboard.
        // The culled tile must have a valid mesh, though.
        if (
            !defined$3(tile) ||
            !defined$3(tile.data) ||
            !defined$3(tile.data.renderedMesh)
        ) {
            // Tile was not rendered (culled).
            return undefined;
        }

        var projection = this._surface._tileProvider.tilingScheme.projection;
        var ellipsoid = this._surface._tileProvider.tilingScheme.ellipsoid;

        //cartesian has to be on the ellipsoid surface for `ellipsoid.geodeticSurfaceNormal`
        var cartesian = Cartesian3$2.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            0.0,
            ellipsoid,
            scratchGetHeightCartesian
        );

        var ray = scratchGetHeightRay;
        var surfaceNormal = ellipsoid.geodeticSurfaceNormal(cartesian, ray.direction);

        // Try to find the intersection point between the surface normal and z-axis.
        // minimum height (-11500.0) for the terrain set, need to get this information from the terrain provider
        var rayOrigin = ellipsoid.getSurfaceNormalIntersectionWithZAxis(
            cartesian,
            11500.0,
            ray.origin
        );

        // Theoretically, not with Earth datums, the intersection point can be outside the ellipsoid
        if (!defined$3(rayOrigin)) {
            // intersection point is outside the ellipsoid, try other value
            // minimum height (-11500.0) for the terrain set, need to get this information from the terrain provider
            var minimumHeight;
            if (defined$3(tile.data.tileBoundingRegion)) {
                minimumHeight = tile.data.tileBoundingRegion.minimumHeight;
            }
            var magnitude = Math.min(defaultValue$2(minimumHeight, 0.0), -11500.0);

            // multiply by the *positive* value of the magnitude
            var vectorToMinimumPoint = Cartesian3$2.multiplyByScalar(
                surfaceNormal,
                Math.abs(magnitude) + 1,
                scratchGetHeightIntersection
            );
            Cartesian3$2.subtract(cartesian, vectorToMinimumPoint, ray.origin);
        }

        var intersection = tile.data.pick(
            ray,
            undefined,
            projection,
            false,
            scratchGetHeightIntersection
        );
        if (!defined$3(intersection)) {
            return undefined;
        }

        return ellipsoid.cartesianToCartographic(
            intersection,
            scratchGetHeightCartographic
        ).height;
    };

    /**
     * @private
     */
    Globe.prototype.update = function (frameState) {
        if (!this.show) {
            return;
        }

        if (frameState.passes.render) {
            this._surface.update(frameState);
        }
    };

    /**
     * @private
     */
    Globe.prototype.beginFrame = function (frameState) {
        var surface = this._surface;
        var tileProvider = surface.tileProvider;
        var terrainProvider = this.terrainProvider;
        var hasWaterMask =
            this.showWaterEffect &&
            terrainProvider.ready &&
            terrainProvider.hasWaterMask;

        if (hasWaterMask && this._oceanNormalMapResourceDirty) {
            // url changed, load new normal map asynchronously
            this._oceanNormalMapResourceDirty = false;
            var oceanNormalMapResource = this._oceanNormalMapResource;
            var oceanNormalMapUrl = oceanNormalMapResource.url;
            if (defined$3(oceanNormalMapUrl)) {
                var that = this;
                when$3(oceanNormalMapResource.fetchImage(), function (image) {
                    if (oceanNormalMapUrl !== that._oceanNormalMapResource.url) {
                        // url changed while we were loading
                        return;
                    }

                    that._oceanNormalMap =
                        that._oceanNormalMap && that._oceanNormalMap.destroy();
                    that._oceanNormalMap = new Texture({
                        context: frameState.context,
                        source: image,
                    });
                });
            } else {
                this._oceanNormalMap =
                    this._oceanNormalMap && this._oceanNormalMap.destroy();
            }
        }

        var pass = frameState.passes;
        var mode = frameState.mode;

        if (pass.render) {
            if (this.showGroundAtmosphere) {
                this._zoomedOutOceanSpecularIntensity = 0.4;
            } else {
                this._zoomedOutOceanSpecularIntensity = 0.5;
            }

            surface.maximumScreenSpaceError = this.maximumScreenSpaceError;
            surface.tileCacheSize = this.tileCacheSize;
            surface.loadingDescendantLimit = this.loadingDescendantLimit;
            surface.preloadAncestors = this.preloadAncestors;
            surface.preloadSiblings = this.preloadSiblings;

            tileProvider.terrainProvider = this.terrainProvider;
            tileProvider.lightingFadeOutDistance = this.lightingFadeOutDistance;
            tileProvider.lightingFadeInDistance = this.lightingFadeInDistance;
            tileProvider.nightFadeOutDistance = this.nightFadeOutDistance;
            tileProvider.nightFadeInDistance = this.nightFadeInDistance;
            tileProvider.zoomedOutOceanSpecularIntensity =
                mode === SceneMode$1.SCENE3D ? this._zoomedOutOceanSpecularIntensity : 0.0;
            tileProvider.hasWaterMask = hasWaterMask;
            tileProvider.oceanNormalMap = this._oceanNormalMap;
            tileProvider.enableLighting = this.enableLighting;
            tileProvider.dynamicAtmosphereLighting = this.dynamicAtmosphereLighting;
            tileProvider.dynamicAtmosphereLightingFromSun = this.dynamicAtmosphereLightingFromSun;
            tileProvider.showGroundAtmosphere = this.showGroundAtmosphere;
            tileProvider.shadows = this.shadows;
            tileProvider.hueShift = this.atmosphereHueShift;
            tileProvider.saturationShift = this.atmosphereSaturationShift;
            tileProvider.brightnessShift = this.atmosphereBrightnessShift;
            tileProvider.fillHighlightColor = this.fillHighlightColor;
            tileProvider.showSkirts = this.showSkirts;
            tileProvider.backFaceCulling = this.backFaceCulling;
            tileProvider.undergroundColor = this._undergroundColor;
            tileProvider.undergroundColorAlphaByDistance = this._undergroundColorAlphaByDistance;
            surface.beginFrame(frameState);
        }
    };

    /**
     * @private
     */
    Globe.prototype.render = function (frameState) {
        if (!this.show) {
            return;
        }

        if (defined$3(this._material)) {
            this._material.update(frameState.context);
        }

        this._surface.render(frameState);
    };

    /**
     * @private
     */
    Globe.prototype.endFrame = function (frameState) {
        if (!this.show) {
            return;
        }

        if (frameState.passes.render) {
            this._surface.endFrame(frameState);
        }
    };

    /**
     * Returns true if this object was destroyed; otherwise, false.
     * <br /><br />
     * If this object was destroyed, it should not be used; calling any function other than
     * <code>isDestroyed</code> will result in a {@link DeveloperError} exception.
     *
     * @returns {Boolean} True if this object was destroyed; otherwise, false.
     *
     * @see Globe#destroy
     */
    Globe.prototype.isDestroyed = function () {
        return false;
    };

    /**
     * Destroys the WebGL resources held by this object.  Destroying an object allows for deterministic
     * release of WebGL resources, instead of relying on the garbage collector to destroy this object.
     * <br /><br />
     * Once an object is destroyed, it should not be used; calling any function other than
     * <code>isDestroyed</code> will result in a {@link DeveloperError} exception.  Therefore,
     * assign the return value (<code>undefined</code>) to the object as done in the example.
     *
     * @exception {DeveloperError} This object was destroyed, i.e., destroy() was called.
     *
     *
     * @example
     * globe = globe && globe.destroy();
     *
     * @see Globe#isDestroyed
     */
    Globe.prototype.destroy = function () {
        this._surfaceShaderSet =
            this._surfaceShaderSet && this._surfaceShaderSet.destroy();
        this._surface = this._surface && this._surface.destroy();
        this._oceanNormalMap = this._oceanNormalMap && this._oceanNormalMap.destroy();
        return destroyObject$2(this);
    };

    const {
        ShaderProgram: ShaderProgram$1,
        RuntimeError,
        createUniform,
        defined: defined$2,
        createUniformArray,
        WebGLConstants
    } = Cesium;
    function AutomaticUniform(options) {
        this._size = options.size;
        this._datatype = options.datatype;
        this.getValue = options.getValue;
    }
    const CesiumAutomaticUniforms = Cesium.AutomaticUniforms;
    const consolePrefix = "[Cesium WebGL] ";
    // override
    const AutomaticUniforms = {
        ...CesiumAutomaticUniforms,
        czm_p_drawingBufferWidth: new AutomaticUniform({
            size: 1,
            datatype: WebGLConstants.FLOAT,
            getValue: function (uniformState) {
                return uniformState._frameState.context.drawingBufferWidth;
            },
        }),
        czm_p_drawingBufferHeight: new AutomaticUniform({
            size: 1,
            datatype: WebGLConstants.FLOAT,
            getValue: function (uniformState) {
                return uniformState._frameState.context.drawingBufferHeight;
            },
        }),
        czm_p_imagerySplitPosition: new AutomaticUniform({
            size: 1,
            datatype: WebGLConstants.FLOAT,
            getValue: function (uniformState) {
                return uniformState._frameState.imagerySplitPosition;
            },
        }),
    };
    function initialize(shader) {
        if (defined$2(shader._program)) {
            return;
        }

        reinitialize(shader);
    }
    function createAndLinkProgram(gl, shader) {
        var vsSource = shader._vertexShaderText;
        var fsSource = shader._fragmentShaderText;

        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vsSource);
        gl.compileShader(vertexShader);

        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fsSource);
        gl.compileShader(fragmentShader);

        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

        var attributeLocations = shader._attributeLocations;
        if (defined$2(attributeLocations)) {
            for (var attribute in attributeLocations) {
                if (attributeLocations.hasOwnProperty(attribute)) {
                    gl.bindAttribLocation(
                        program,
                        attributeLocations[attribute],
                        attribute
                    );
                }
            }
        }

        gl.linkProgram(program);

        var log;
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            var debugShaders = shader._debugShaders;

            // For performance, only check compile errors if there is a linker error.
            if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
                log = gl.getShaderInfoLog(fragmentShader);
                console.error(consolePrefix + "Fragment shader compile log: " + log);
                if (defined$2(debugShaders)) {
                    var fragmentSourceTranslation = debugShaders.getTranslatedShaderSource(
                        fragmentShader
                    );
                    if (fragmentSourceTranslation !== "") {
                        console.error(
                            consolePrefix +
                            "Translated fragment shader source:\n" +
                            fragmentSourceTranslation
                        );
                    } else {
                        console.error(consolePrefix + "Fragment shader translation failed.");
                    }
                }

                gl.deleteProgram(program);
                throw new RuntimeError(
                    "Fragment shader failed to compile.  Compile log: " + log
                );
            }

            if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
                log = gl.getShaderInfoLog(vertexShader);
                console.error(consolePrefix + "Vertex shader compile log: " + log);
                if (defined$2(debugShaders)) {
                    var vertexSourceTranslation = debugShaders.getTranslatedShaderSource(
                        vertexShader
                    );
                    if (vertexSourceTranslation !== "") {
                        console.error(
                            consolePrefix +
                            "Translated vertex shader source:\n" +
                            vertexSourceTranslation
                        );
                    } else {
                        console.error(consolePrefix + "Vertex shader translation failed.");
                    }
                }

                gl.deleteProgram(program);
                throw new RuntimeError(
                    "Vertex shader failed to compile.  Compile log: " + log
                );
            }

            log = gl.getProgramInfoLog(program);
            console.error(consolePrefix + "Shader program link log: " + log);
            if (defined$2(debugShaders)) {
                console.error(
                    consolePrefix +
                    "Translated vertex shader source:\n" +
                    debugShaders.getTranslatedShaderSource(vertexShader)
                );
                console.error(
                    consolePrefix +
                    "Translated fragment shader source:\n" +
                    debugShaders.getTranslatedShaderSource(fragmentShader)
                );
            }

            gl.deleteProgram(program);
            throw new RuntimeError("Program failed to link.  Link log: " + log);
        }

        var logShaderCompilation = shader._logShaderCompilation;

        if (logShaderCompilation) {
            log = gl.getShaderInfoLog(vertexShader);
            if (defined$2(log) && log.length > 0) {
                console.log(consolePrefix + "Vertex shader compile log: " + log);
            }
        }

        if (logShaderCompilation) {
            log = gl.getShaderInfoLog(fragmentShader);
            if (defined$2(log) && log.length > 0) {
                console.log(consolePrefix + "Fragment shader compile log: " + log);
            }
        }

        if (logShaderCompilation) {
            log = gl.getProgramInfoLog(program);
            if (defined$2(log) && log.length > 0) {
                console.log(consolePrefix + "Shader program link log: " + log);
            }
        }

        return program;
    }
    function findUniforms(gl, program) {
        var uniformsByName = {};
        var uniforms = [];
        var samplerUniforms = [];

        var numberOfUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

        for (var i = 0; i < numberOfUniforms; ++i) {
            var activeUniform = gl.getActiveUniform(program, i);
            var suffix = "[0]";
            var uniformName =
                activeUniform.name.indexOf(
                    suffix,
                    activeUniform.name.length - suffix.length
                ) !== -1
                    ? activeUniform.name.slice(0, activeUniform.name.length - 3)
                    : activeUniform.name;

            // Ignore GLSL built-in uniforms returned in Firefox.
            if (uniformName.indexOf("gl_") !== 0) {
                if (activeUniform.name.indexOf("[") < 0) {
                    // Single uniform
                    var location = gl.getUniformLocation(program, uniformName);

                    // IE 11.0.9 needs this check since getUniformLocation can return null
                    // if the uniform is not active (e.g., it is optimized out).  Looks like
                    // getActiveUniform() above returns uniforms that are not actually active.
                    if (location !== null) {
                        var uniform = createUniform(gl, activeUniform, uniformName, location);

                        uniformsByName[uniformName] = uniform;
                        uniforms.push(uniform);

                        if (uniform._setSampler) {
                            samplerUniforms.push(uniform);
                        }
                    }
                } else {
                    // Uniform array

                    var uniformArray;
                    var locations;
                    var value;
                    var loc;

                    // On some platforms - Nexus 4 in Firefox for one - an array of sampler2D ends up being represented
                    // as separate uniforms, one for each array element.  Check for and handle that case.
                    var indexOfBracket = uniformName.indexOf("[");
                    if (indexOfBracket >= 0) {
                        // We're assuming the array elements show up in numerical order - it seems to be true.
                        uniformArray = uniformsByName[uniformName.slice(0, indexOfBracket)];

                        // Nexus 4 with Android 4.3 needs this check, because it reports a uniform
                        // with the strange name webgl_3467e0265d05c3c1[1] in our globe surface shader.
                        if (!defined$2(uniformArray)) {
                            continue;
                        }

                        locations = uniformArray._locations;

                        // On the Nexus 4 in Chrome, we get one uniform per sampler, just like in Firefox,
                        // but the size is not 1 like it is in Firefox.  So if we push locations here,
                        // we'll end up adding too many locations.
                        if (locations.length <= 1) {
                            value = uniformArray.value;
                            loc = gl.getUniformLocation(program, uniformName);

                            // Workaround for IE 11.0.9.  See above.
                            if (loc !== null) {
                                locations.push(loc);
                                value.push(gl.getUniform(program, loc));
                            }
                        }
                    } else {
                        locations = [];
                        for (var j = 0; j < activeUniform.size; ++j) {
                            loc = gl.getUniformLocation(program, uniformName + "[" + j + "]");

                            // Workaround for IE 11.0.9.  See above.
                            if (loc !== null) {
                                locations.push(loc);
                            }
                        }
                        uniformArray = createUniformArray(
                            gl,
                            activeUniform,
                            uniformName,
                            locations
                        );

                        uniformsByName[uniformName] = uniformArray;
                        uniforms.push(uniformArray);

                        if (uniformArray._setSampler) {
                            samplerUniforms.push(uniformArray);
                        }
                    }
                }
            }
        }

        return {
            uniformsByName: uniformsByName,
            uniforms: uniforms,
            samplerUniforms: samplerUniforms,
        };
    }
    function partitionUniforms(shader, uniforms) {
        var automaticUniforms = [];
        var manualUniforms = [];

        for (var uniform in uniforms) {
            if (uniforms.hasOwnProperty(uniform)) {
                var uniformObject = uniforms[uniform];
                var uniformName = uniform;
                // if it's a duplicate uniform, use its original name so it is updated correctly
                var duplicateUniform = shader._duplicateUniformNames[uniformName];
                if (defined$2(duplicateUniform)) {
                    uniformObject.name = duplicateUniform;
                    uniformName = duplicateUniform;
                }
                var automaticUniform = AutomaticUniforms[uniformName];
                if (defined$2(automaticUniform)) {
                    automaticUniforms.push({
                        uniform: uniformObject,
                        automaticUniform: automaticUniform,
                    });
                } else {
                    manualUniforms.push(uniformObject);
                }
            }
        }

        return {
            automaticUniforms: automaticUniforms,
            manualUniforms: manualUniforms,
        };
    }
    function findVertexAttributes(gl, program, numberOfAttributes) {
        var attributes = {};
        for (var i = 0; i < numberOfAttributes; ++i) {
            var attr = gl.getActiveAttrib(program, i);
            var location = gl.getAttribLocation(program, attr.name);

            attributes[attr.name] = {
                name: attr.name,
                type: attr.type,
                index: location,
            };
        }

        return attributes;
    }

    function setSamplerUniforms(gl, program, samplerUniforms) {
        gl.useProgram(program);

        var textureUnitIndex = 0;
        var length = samplerUniforms.length;
        for (var i = 0; i < length; ++i) {
            textureUnitIndex = samplerUniforms[i]._setSampler(textureUnitIndex);
        }

        gl.useProgram(null);

        return textureUnitIndex;
    }
    function reinitialize(shader) {
        var oldProgram = shader._program;

        var gl = shader._gl;
        var program = createAndLinkProgram(gl, shader, shader._debugShaders);
        var numberOfVertexAttributes = gl.getProgramParameter(
            program,
            gl.ACTIVE_ATTRIBUTES
        );
        var uniforms = findUniforms(gl, program);
        var partitionedUniforms = partitionUniforms(shader, uniforms.uniformsByName);

        shader._program = program;
        shader._numberOfVertexAttributes = numberOfVertexAttributes;
        shader._vertexAttributes = findVertexAttributes(
            gl,
            program,
            numberOfVertexAttributes
        );
        shader._uniformsByName = uniforms.uniformsByName;
        shader._uniforms = uniforms.uniforms;
        shader._automaticUniforms = partitionedUniforms.automaticUniforms;
        shader._manualUniforms = partitionedUniforms.manualUniforms;

        shader.maximumTextureUnitIndex = setSamplerUniforms(
            gl,
            program,
            uniforms.samplerUniforms
        );

        if (oldProgram) {
            shader._gl.deleteProgram(oldProgram);
        }

        // If SpectorJS is active, add the hook to make the shader editor work.
        // https://github.com/BabylonJS/Spector.js/blob/master/documentation/extension.md#shader-editor
        if (typeof spector !== "undefined") {
            shader._program.__SPECTOR_rebuildProgram = function (
                vertexSourceCode, // The new vertex shader source
                fragmentSourceCode, // The new fragment shader source
                onCompiled, // Callback triggered by your engine when the compilation is successful. It needs to send back the new linked program.
                onError // Callback triggered by your engine in case of error. It needs to send the WebGL error to allow the editor to display the error in the gutter.
            ) {
                var originalVS = shader._vertexShaderText;
                var originalFS = shader._fragmentShaderText;

                // SpectorJS likes to replace `!=` with `! =` for unknown reasons,
                // and that causes glsl compile failures. So fix that up.
                var regex = / ! = /g;
                shader._vertexShaderText = vertexSourceCode.replace(regex, " != ");
                shader._fragmentShaderText = fragmentSourceCode.replace(regex, " != ");

                try {
                    reinitialize(shader);
                    onCompiled(shader._program);
                } catch (e) {
                    shader._vertexShaderText = originalVS;
                    shader._fragmentShaderText = originalFS;

                    // Only pass on the WebGL error:
                    var errorMatcher = /(?:Compile|Link) error: ([^]*)/;
                    var match = errorMatcher.exec(e.message);
                    if (match) {
                        onError(match[1]);
                    } else {
                        onError(e.message);
                    }
                }
            };
        }
    }
    function override$1() {
        const originPrototype = ShaderProgram$1.prototype;
        ShaderProgram$1.prototype = {};
        ShaderProgram$1.prototype._bind = function () {
            initialize(this);
            this._gl.useProgram(this._program);
        };
        ShaderProgram$1.prototype.destroy = originPrototype.destroy;
        ShaderProgram$1.prototype._setUniforms = function (uniformMap,
            uniformState,
            validate) {
            originPrototype._setUniforms.call(this, uniformMap,
                uniformState,
                validate);
        };
        ShaderProgram$1.prototype.isDestroyed = originPrototype.isDestroyed;
        ShaderProgram$1.prototype.finalDestroy = originPrototype.finalDestroy;

        Object.defineProperties(ShaderProgram$1.prototype, {
            vertexAttributes: {
                get: function () {
                    initialize(this);
                    return this._vertexAttributes;
                },
            },
            numberOfVertexAttributes: {
                get: function () {
                    initialize(this);
                    return this._numberOfVertexAttributes;
                },
            },
            allUniforms: {
                get: function () {
                    initialize(this);
                    return this._uniformsByName;
                },
            },
            vertexShaderSource: {
                get: function () {
                    return this._vertexShaderSource;
                },
            },
            fragmentShaderSource: {
                get: function () {
                    return this._fragmentShaderSource;
                },
            },
        });
    }

    const CesiumScene = Cesium.Scene;
    const {
        JulianDate,
        defined: defined$1,
        RequestScheduler,
        PerformanceDisplay,
        Cesium3DTilePassState,
        Cesium3DTilePass,
        defaultValue: defaultValue$1,
        Color: Color$3,
        BoundingRectangle,
        Pass,
        SunLight,
        Cartesian3: Cartesian3$1
    } = Cesium;
    const preloadTilesetPassState = new Cesium3DTilePassState({
        pass: Cesium3DTilePass.PRELOAD,
    });

    const preloadFlightTilesetPassState = new Cesium3DTilePassState({
        pass: Cesium3DTilePass.PRELOAD_FLIGHT,
    });

    const requestRenderModeDeferCheckPassState = new Cesium3DTilePassState({
        pass: Cesium3DTilePass.REQUEST_RENDER_MODE_DEFER_CHECK,
    });

    function updateFrameNumber(scene, frameNumber, time) {
        var frameState = scene._frameState;
        frameState.frameNumber = frameNumber;
        frameState.time = JulianDate.clone(time, frameState.time);
    }
    function tryAndCatchError(scene, functionToExecute) {
        try {
            functionToExecute(scene);
        } catch (error) {
            scene._renderError.raiseEvent(scene, error);

            if (scene.rethrowRenderErrors) {
                throw error;
            }
        }
    }
    function updateDebugShowFramesPerSecond(scene, renderedThisFrame) {
        if (scene.debugShowFramesPerSecond) {
            if (!defined$1(scene._performanceDisplay)) {
                var performanceContainer = document.createElement("div");
                performanceContainer.className =
                    "cesium-performanceDisplay-defaultContainer";
                var container = scene._canvas.parentNode;
                container.appendChild(performanceContainer);
                var performanceDisplay = new PerformanceDisplay({
                    container: performanceContainer,
                });
                scene._performanceDisplay = performanceDisplay;
                scene._performanceContainer = performanceContainer;
            }

            scene._performanceDisplay.throttled = scene.requestRenderMode;
            scene._performanceDisplay.update(renderedThisFrame);
        } else if (defined$1(scene._performanceDisplay)) {
            scene._performanceDisplay =
                scene._performanceDisplay && scene._performanceDisplay.destroy();
            scene._performanceContainer.parentNode.removeChild(
                scene._performanceContainer
            );
        }
    }
    function callAfterRenderFunctions(scene) {
        // Functions are queued up during primitive update and executed here in case
        // the function modifies scene state that should remain constant over the frame.
        var functions = scene._frameState.afterRender;
        for (var i = 0, length = functions.length; i < length; ++i) {
            functions[i]();
            scene.requestRender();
        }

        functions.length = 0;
    }
    function prePassesUpdate(scene) {
        scene._jobScheduler.resetBudgets();

        var frameState = scene._frameState;
        var primitives = scene.primitives;
        primitives.prePassesUpdate(frameState);

        if (defined$1(scene.globe)) {
            scene.globe.update(frameState);
        }

        scene._picking.update();
        frameState.creditDisplay.update();
    }
    function updateMostDetailedRayPicks(scene) {
        return scene._picking.updateMostDetailedRayPicks(scene);
    }
    function updatePreloadPass(scene) {
        var frameState = scene._frameState;
        preloadTilesetPassState.camera = frameState.camera;
        preloadTilesetPassState.cullingVolume = frameState.cullingVolume;

        var primitives = scene.primitives;
        primitives.updateForPass(frameState, preloadTilesetPassState);
    }
    function updatePreloadFlightPass(scene) {
        var frameState = scene._frameState;
        var camera = frameState.camera;
        if (!camera.canPreloadFlight()) {
            return;
        }

        preloadFlightTilesetPassState.camera = scene.preloadFlightCamera;
        preloadFlightTilesetPassState.cullingVolume =
            scene.preloadFlightCullingVolume;

        var primitives = scene.primitives;
        primitives.updateForPass(frameState, preloadFlightTilesetPassState);
    }
    const renderTilesetPassState = new Cesium3DTilePassState({
        pass: Cesium3DTilePass.RENDER,
    });
    function updateRequestRenderModeDeferCheckPass(scene) {
        // Check if any ignored requests are ready to go (to wake rendering up again)
        scene.primitives.updateForPass(
            scene._frameState,
            requestRenderModeDeferCheckPassState
        );
    }
    function postPassesUpdate(scene) {
        var frameState = scene._frameState;
        var primitives = scene.primitives;
        primitives.postPassesUpdate(frameState);

        RequestScheduler.update();
    }
    function render(scene) {
        var frameState = scene._frameState;

        var context = scene.context;
        var us = context.uniformState;

        var view = scene._defaultView;
        scene._view = view;

        scene.updateFrameState();
        frameState.passes.render = true;
        frameState.passes.postProcess = scene.postProcessStages.hasSelected;
        frameState.tilesetPassState = renderTilesetPassState;

        var backgroundColor = defaultValue$1(scene.backgroundColor, Color$3.BLACK);
        if (scene._hdr) {
            backgroundColor = Color$3.clone(backgroundColor, scratchBackgroundColor);
            backgroundColor.red = Math.pow(backgroundColor.red, scene.gamma);
            backgroundColor.green = Math.pow(backgroundColor.green, scene.gamma);
            backgroundColor.blue = Math.pow(backgroundColor.blue, scene.gamma);
        }
        frameState.backgroundColor = backgroundColor;

        scene.fog.update(frameState);

        us.update(frameState);

        var shadowMap = scene.shadowMap;
        if (defined$1(shadowMap) && shadowMap.enabled) {
            if (!defined$1(scene.light) || scene.light instanceof SunLight) {
                // Negate the sun direction so that it is from the Sun, not to the Sun
                Cartesian3$1.negate(us.sunDirectionWC, scene._shadowMapCamera.direction);
            } else {
                Cartesian3$1.clone(scene.light.direction, scene._shadowMapCamera.direction);
            }
            frameState.shadowMaps.push(shadowMap);
        }

        scene._computeCommandList.length = 0;
        scene._overlayCommandList.length = 0;

        var viewport = view.viewport;
        viewport.x = 0;
        viewport.y = 0;
        viewport.width = context.drawingBufferWidth;
        viewport.height = context.drawingBufferHeight;

        var passState = view.passState;
        passState.framebuffer = undefined;
        passState.blendingEnabled = undefined;
        passState.scissorTest = undefined;
        passState.viewport = BoundingRectangle.clone(viewport, passState.viewport);

        if (defined$1(scene.globe)) {
            scene.globe.beginFrame(frameState);
            // override
            scene._LodGraphic.beginFrame(frameState);
        }
        scene.updateEnvironment();
        scene.updateAndExecuteCommands(passState, backgroundColor);
        scene.globe && scene._LodGraphic.render(frameState);
        scene.resolveFramebuffers(passState);

        passState.framebuffer = undefined;
        executeOverlayCommands(scene, passState);

        if (defined$1(scene.globe)) {
            scene.globe.endFrame(frameState);
            scene._LodGraphic.endFrame(frameState);

            if (!scene.globe.tilesLoaded) {
                scene._renderRequested = true;
            }
        }
        context.endFrame();
    }
    function executeOverlayCommands(scene, passState) {
        var us = scene.context.uniformState;
        us.updatePass(Pass.OVERLAY);

        var context = scene.context;
        var commandList = scene._overlayCommandList;
        var length = commandList.length;
        for (var i = 0; i < length; ++i) {
            commandList[i].execute(context, passState);
        }
    }
    function sceneRender(time) {
        this._preUpdate.raiseEvent(this, time);

        var frameState = this._frameState;
        frameState.newFrame = false;

        if (!defined$1(time)) {
            time = JulianDate.now();
        }

        // Determine if shouldRender
        var cameraChanged = this._view.checkForCameraUpdates(this);
        var shouldRender =
            !this.requestRenderMode ||
            this._renderRequested ||
            cameraChanged ||
            this._logDepthBufferDirty ||
            this._hdrDirty ||
            this.mode === SceneMode.MORPHING;
        if (
            !shouldRender &&
            defined$1(this.maximumRenderTimeChange) &&
            defined$1(this._lastRenderTime)
        ) {
            var difference = Math.abs(
                JulianDate.secondsDifference(this._lastRenderTime, time)
            );
            shouldRender = shouldRender || difference > this.maximumRenderTimeChange;
        }

        if (shouldRender) {
            this._lastRenderTime = JulianDate.clone(time, this._lastRenderTime);
            this._renderRequested = false;
            this._logDepthBufferDirty = false;
            this._hdrDirty = false;

            var frameNumber = Cesium.Math.incrementWrap(
                frameState.frameNumber,
                15000000.0,
                1.0
            );
            updateFrameNumber(this, frameNumber, time);
            frameState.newFrame = true;
        }

        tryAndCatchError(this, prePassesUpdate);

        /**
         *
         * Passes update. Add any passes here
         *
         */
        if (this.primitives.show) {
            tryAndCatchError(this, updateMostDetailedRayPicks);
            tryAndCatchError(this, updatePreloadPass);
            tryAndCatchError(this, updatePreloadFlightPass);
            if (!shouldRender) {
                tryAndCatchError(this, updateRequestRenderModeDeferCheckPass);
            }
        }

        this._postUpdate.raiseEvent(this, time);

        if (shouldRender) {
            this._preRender.raiseEvent(this, time);
            frameState.creditDisplay.beginFrame();
            tryAndCatchError(this, render);
        }

        /**
         *
         * Post passes update. Execute any pass invariant code that should run after the passes here.
         *
         */
        updateDebugShowFramesPerSecond(this, shouldRender);
        tryAndCatchError(this, postPassesUpdate);

        // Often used to trigger events (so don't want in trycatch) that the user might be subscribed to. Things like the tile load events, ready promises, etc.
        // We don't want those events to resolve during the render loop because the events might add new primitives
        callAfterRenderFunctions(this);

        if (shouldRender) {
            this._postRender.raiseEvent(this, time);
            frameState.creditDisplay.endFrame();
        }
    }
    class Scene {
        static overrideRenderFunction() {
            CesiumScene.prototype.render = sceneRender;
        }

    }
    function override() {    
        Scene.overrideRenderFunction();
    }

    const {
        Primitive: Primitive$2,
        ShaderProgram,
        defined,
        DeveloperError: DeveloperError$1,
        defaultValue,
        ShaderSource: ShaderSource$1 
    } = Cesium;

    const update = Primitive$2.prototype.update;
    function appendPickToVertexShader(source) {
        var renamedVS = ShaderSource$1.replaceMain(source, "czm_non_pick_main");
        var pickMain =
            "varying vec4 v_pickColor; \n" +
            "void main() \n" +
            "{ \n" +
            "    czm_non_pick_main(); \n" +
            "    v_pickColor = czm_batchTable_pickColor(batchId); \n" +
            "}";

        return renamedVS + "\n" + pickMain;
    }
    function modifyForEncodedNormals(primitive, vertexShaderSource) {
        if (!primitive.compressVertices) {
            return vertexShaderSource;
        }

        var containsNormal =
            vertexShaderSource.search(/attribute\s+vec3\s+normal;/g) !== -1;
        var containsSt = vertexShaderSource.search(/attribute\s+vec2\s+st;/g) !== -1;
        if (!containsNormal && !containsSt) {
            return vertexShaderSource;
        }

        var containsTangent =
            vertexShaderSource.search(/attribute\s+vec3\s+tangent;/g) !== -1;
        var containsBitangent =
            vertexShaderSource.search(/attribute\s+vec3\s+bitangent;/g) !== -1;

        var numComponents = containsSt && containsNormal ? 2.0 : 1.0;
        numComponents += containsTangent || containsBitangent ? 1 : 0;

        var type = numComponents > 1 ? "vec" + numComponents : "float";

        var attributeName = "compressedAttributes";
        var attributeDecl = "attribute " + type + " " + attributeName + ";";

        var globalDecl = "";
        var decode = "";

        if (containsSt) {
            globalDecl += "vec2 st;\n";
            var stComponent = numComponents > 1 ? attributeName + ".x" : attributeName;
            decode +=
                "    st = czm_decompressTextureCoordinates(" + stComponent + ");\n";
        }

        if (containsNormal && containsTangent && containsBitangent) {
            globalDecl += "vec3 normal;\n" + "vec3 tangent;\n" + "vec3 bitangent;\n";
            decode +=
                "    czm_octDecode(" +
                attributeName +
                "." +
                (containsSt ? "yz" : "xy") +
                ", normal, tangent, bitangent);\n";
        } else {
            if (containsNormal) {
                globalDecl += "vec3 normal;\n";
                decode +=
                    "    normal = czm_octDecode(" +
                    attributeName +
                    (numComponents > 1 ? "." + (containsSt ? "y" : "x") : "") +
                    ");\n";
            }

            if (containsTangent) {
                globalDecl += "vec3 tangent;\n";
                decode +=
                    "    tangent = czm_octDecode(" +
                    attributeName +
                    "." +
                    (containsSt && containsNormal ? "z" : "y") +
                    ");\n";
            }

            if (containsBitangent) {
                globalDecl += "vec3 bitangent;\n";
                decode +=
                    "    bitangent = czm_octDecode(" +
                    attributeName +
                    "." +
                    (containsSt && containsNormal ? "z" : "y") +
                    ");\n";
            }
        }

        var modifiedVS = vertexShaderSource;
        modifiedVS = modifiedVS.replace(/attribute\s+vec3\s+normal;/g, "");
        modifiedVS = modifiedVS.replace(/attribute\s+vec2\s+st;/g, "");
        modifiedVS = modifiedVS.replace(/attribute\s+vec3\s+tangent;/g, "");
        modifiedVS = modifiedVS.replace(/attribute\s+vec3\s+bitangent;/g, "");
        modifiedVS = ShaderSource$1.replaceMain(modifiedVS, "czm_non_compressed_main");
        var compressedMain =
            "void main() \n" +
            "{ \n" +
            decode +
            "    czm_non_compressed_main(); \n" +
            "}";

        return [attributeDecl, globalDecl, modifiedVS, compressedMain].join("\n");
    }
    function appendPickToFragmentShader(source) {
        return "varying vec4 v_pickColor;\n" + source;
    }
    function validateShaderMatching(shaderProgram, attributeLocations) {
        // For a VAO and shader program to be compatible, the VAO must have
        // all active attribute in the shader program.  The VAO may have
        // extra attributes with the only concern being a potential
        // performance hit due to extra memory bandwidth and cache pollution.
        // The shader source could have extra attributes that are not used,
        // but there is no guarantee they will be optimized out.
        //
        // Here, we validate that the VAO has all attributes required
        // to match the shader program.
        var shaderAttributes = shaderProgram.vertexAttributes;

        //>>includeStart('debug', pragmas.debug);
        for (var name in shaderAttributes) {
            if (shaderAttributes.hasOwnProperty(name)) {
                if (!defined(attributeLocations[name])) {
                    throw new DeveloperError$1(
                        "Appearance/Geometry mismatch.  The appearance requires vertex shader attribute input '" +
                        name +
                        "', which was not computed as part of the Geometry.  Use the appearance's vertexFormat property when constructing the geometry."
                    );
                }
            }
        }
        //>>includeEnd('debug');
    }
    function depthClampVS(vertexShaderSource) {
        var modifiedVS = ShaderSource$1.replaceMain(
            vertexShaderSource,
            "czm_non_depth_clamp_main"
        );
        modifiedVS +=
            "void main() {\n" +
            "    czm_non_depth_clamp_main();\n" +
            "    gl_Position = czm_depthClamp(gl_Position);" +
            "}\n";
        return modifiedVS;
    }
    function depthClampFS(fragmentShaderSource) {
        var modifiedFS = ShaderSource$1.replaceMain(
            fragmentShaderSource,
            "czm_non_depth_clamp_main"
        );
        modifiedFS +=
            "void main() {\n" +
            "    czm_non_depth_clamp_main();\n" +
            "#if defined(GL_EXT_frag_depth)\n" +
            "    #if defined(LOG_DEPTH)\n" +
            "        czm_writeLogDepth();\n" +
            "    #else\n" +
            "        czm_writeDepthClamp();\n" +
            "    #endif\n" +
            "#endif\n" +
            "}\n";
        modifiedFS =
            "#ifdef GL_EXT_frag_depth\n" +
            "#extension GL_EXT_frag_depth : enable\n" +
            "#endif\n" +
            modifiedFS;
        return modifiedFS;
    }
    function createShaderProgram(primitive, frameState, appearance) {
        const context = frameState.context;

        const attributeLocations = primitive._attributeLocations;

        let vs = primitive._batchTable.getVertexShaderCallback()(
            appearance.vertexShaderSource
        );
        vs = Primitive$2._appendOffsetToShader(primitive, vs);
        vs = Primitive$2._appendShowToShader(primitive, vs);
        vs = Primitive$2._appendDistanceDisplayConditionToShader(
            primitive,
            vs,
            frameState.scene3DOnly
        );
        vs = appendPickToVertexShader(vs);
        vs = Primitive$2._updateColorAttribute(primitive, vs, false);
        vs = modifyForEncodedNormals(primitive, vs);
        vs = Primitive$2._modifyShaderPosition(primitive, vs, frameState.scene3DOnly);
        var fs = appearance.getFragmentShaderSource();
        fs = appendPickToFragmentShader(fs);

        primitive._sp = ShaderProgram.replaceCache({
            context: context,
            shaderProgram: primitive._sp,
            vertexShaderSource: vs,
            fragmentShaderSource: fs,
            attributeLocations: attributeLocations,
        });
        validateShaderMatching(primitive._sp, attributeLocations);

        if (defined(primitive._depthFailAppearance)) {
            vs = primitive._batchTable.getVertexShaderCallback()(
                primitive._depthFailAppearance.vertexShaderSource
            );
            vs = Primitive$2._appendShowToShader(primitive, vs);
            vs = Primitive$2._appendDistanceDisplayConditionToShader(
                primitive,
                vs,
                frameState.scene3DOnly
            );
            vs = appendPickToVertexShader(vs);
            vs = Primitive$2._updateColorAttribute(primitive, vs, true);
            vs = modifyForEncodedNormals(primitive, vs);
            vs = Primitive$2._modifyShaderPosition(primitive, vs, frameState.scene3DOnly);
            vs = depthClampVS(vs);

            fs = primitive._depthFailAppearance.getFragmentShaderSource();
            fs = appendPickToFragmentShader(fs);
            fs = depthClampFS(fs);

            primitive._spDepthFail = ShaderProgram.replaceCache({
                context: context,
                shaderProgram: primitive._spDepthFail,
                vertexShaderSource: vs,
                fragmentShaderSource: fs,
                attributeLocations: attributeLocations,
            });
            validateShaderMatching(primitive._spDepthFail, attributeLocations);
        }
    }

    function Primitive$3 () {
        Object.defineProperty(Primitive$2.prototype, 'needUpdate', {
            get() {
                return !!this._needUpdate;
            },
            set(val) {
                this._needUpdate = val;
            }
        });
        Primitive$2.prototype.update = function (frameState) {
            update.call(this, frameState);
            // override
            if (this.needUpdate) {
                var spFunc = defaultValue(
                    this._createShaderProgramFunction,
                    createShaderProgram
                );
                console.log('update shader');
                spFunc(this, frameState, appearance);
                this.needUpdate = false;
            }
        };
    }

    function overrideCesium() {
        override();
        override$1();
        // overridePrimitive();
    }

    const {
        Matrix4: Matrix4$1,
        BoundingSphere: BoundingSphere$1,
        ScreenSpaceEventType,
        ScreenSpaceEventHandler
    } = Cesium;
    function flyTo(viewer, target, options) {
        viewer.camera.flyToBoundingSphere(target, {
            duration: options.duration,
            maximumHeight: options.maximumHeight,
            endTransform: options.endTransform,
            offset: options.offset,
            complete: function () {
                viewer._zoomPromise.resolve(true);
            },
            cancel: function () {
                viewer._zoomPromise.resolve(false);
            },
            offset: options.offset,
        });
    }
    function getDefaultOptions() {
        return {
            animation: false,
            timeline: false,
            geocoder: false,
            homeButton: false,
            navigationHelpButton: false,
            baseLayerPicker: false,
            fullscreenElement: 'cesiumContainer',
            fullscreenButton: false,
            shouldAnimate: true,
            infoBox: false,
            selectionIndicator: false,
            sceneModePicker: false,
            shadows: false,
            imageryProvider: createDefaultLayer(),
            contextOptions: {
                // cesium状态下允许canvas转图片convertToImage
                webgl: {
                    alpha: true,
                    depth: false,
                    stencil: true,
                    antialias: true,
                    premultipliedAlpha: true,
                    preserveDrawingBuffer: true, // 截图时需要打开
                    failIfMajorPerformanceCaveat: true,
                },
                allowTextureFilterAnisotropic: true,
            },
        }
    }
    let lastFpsTime, lastMsTime;
    let fpsCount = 0, msCount = 0;
    let fps = 'N/A', ms = 'N/A';
    function updateFps() {
        if (!defined$8(lastFpsTime)) {
            lastFpsTime = Cesium.getTimestamp();
        }
        if (!defined$8(lastMsTime)) {
            lastMsTime = Cesium.getTimestamp();
        }
        fpsCount++;
        const time = Cesium.getTimestamp();
        let elapsed = (time - lastFpsTime) / 1000.0;
        if (elapsed > 1) {
            fps = fpsCount / elapsed || 0;
            lastFpsTime = time;
            fpsCount = 0;
            fps = fps.toFixed(0);
        }
        msCount++;
        elapsed = time - lastMsTime;
        if (elapsed > 100) {
            ms = elapsed / msCount;
            lastMsTime = time;
            msCount = 0;
            ms = ms.toFixed(2);
        }
        return { ms, fps }
    }
    function isPromise(val) {
        const isObject = val != null && typeof val === 'object';
        return isObject && typeof val.then === 'function'
    }
    /**
     * @see {@link https://sandcastle.cesium.com/?src=Camera.html}
     * @ignore
     * @param {} viewer 
     */
    function icrf(viewer) {
        if (!viewer || viewer.scene.mode !== Cesium.SceneMode.SCENE3D) {
            return;
        }
        const icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(
            viewer.clock.currentTime
        );
        if (defined$8(icrfToFixed)) {
            const camera = viewer.camera;
            const offset = Cesium.Cartesian3.clone(camera.position);
            const transform = Cesium.Matrix4.fromRotationTranslation(icrfToFixed);
            camera.lookAtTransform(transform, offset);
        }
    }
    function setView(viewer, lon, lat, height) {
        const position = Cesium.Cartesian3.fromDegrees(lon, lat, height);

        const camera = viewer.camera;
        const heading = camera.heading;
        const pitch = camera.pitch;

        const offset = offsetFromHeadingPitchRange(
            heading,
            pitch,
            height * 2.0
        );

        const transform = Cesium.Transforms.eastNorthUpToFixedFrame(position);
        Cesium.Matrix4.multiplyByPoint(transform, offset, position);

        camera.setView({
            destination: position,
            orientation: {
                heading: heading,
                pitch: pitch,
            },
            easingFunction: Cesium.EasingFunction.QUADRATIC_OUT,
        });
    }
    function stepFlyTo(viewer, options = {}) {
        const {
            camera
        } = viewer;
        const step1 = defaultValue$6(options.step1Duration, 3);
        const step2 = defaultValue$6(options.step2Duration, 3);
        const step3 = defaultValue$6(options.step3Duration, 3);

        const cartographic = options.destination;
        // 第一步改变位置
        const cur_height = viewer.camera._positionCartographic.height;
        const step1Destination = Cesium.Cartesian3.fromDegrees(cartographic.lon, cartographic.lat, cur_height);
        // 第二步改变高度
        const step2Destination = options.destination.toCartesian();

        return new Promise((resolve) => {
            camera.flyTo({
                destination: step1Destination,
                duration: step1,
                complete() {
                    camera.flyTo({
                        destination: step2Destination,
                        duration: step2,
                        complete() {
                            camera.flyTo({
                                destination: step2Destination,
                                orientation: options.orientation,
                                duration: step3,
                                complete() {
                                    resolve();
                                },
                            });
                        },
                    });
                },
            });
        });
    }
    /**
     * @see {@link https://sandcastle.cesium.com/?src=3D%20Tiles%20Interactivity.html|如何修正camera.flyTo中的误差}
     * @ignore
     * @param {} heading 
     * @param {*} pitch 
     * @param {*} range 
     * @returns {Cesium.Matrix4}
     */
    function offsetFromHeadingPitchRange(heading, pitch, range) {
        pitch = Cesium.Math.clamp(
            pitch,
            -Cesium.Math.PI_OVER_TWO,
            Cesium.Math.PI_OVER_TWO
        );
        heading = Cesium.Math.zeroToTwoPi(heading) - Cesium.Math.PI_OVER_TWO;

        const pitchQuat = Cesium.Quaternion.fromAxisAngle(
            Cesium.Cartesian3.UNIT_Y,
            -pitch
        );
        const headingQuat = Cesium.Quaternion.fromAxisAngle(
            Cesium.Cartesian3.UNIT_Z,
            -heading
        );
        const rotQuat = Cesium.Quaternion.multiply(
            headingQuat,
            pitchQuat,
            headingQuat
        );
        const rotMatrix = Cesium.Matrix3.fromQuaternion(rotQuat);

        const offset = Cesium.Cartesian3.clone(Cesium.Cartesian3.UNIT_X);
        Cesium.Matrix3.multiplyByVector(rotMatrix, offset, offset);
        Cesium.Cartesian3.negate(offset, offset);
        Cesium.Cartesian3.multiplyByScalar(offset, range, offset);
        return offset;
    }
    function syncDoubleView(source, target) {
        let targetCancel, sourceCancel;
        function sync(sourceViewer, targetViewer) {
            return sourceViewer.scene.postRender.addEventListener(() => {
                const position = sourceViewer.camera.positionWC;
                const heading = sourceViewer.camera.heading;
                const pitch = sourceViewer.camera.pitch;
                const roll = sourceViewer.camera.roll;
                if (targetCancel) {
                    targetCancel();
                    targetCancel = undefined;
                }
                targetViewer.camera.flyTo({
                    destination: position,
                    orientation: {
                        heading,
                        pitch,
                        roll
                    },
                    duration: 0,
                    complete: function () {
                        targetCancel = sync(target, source);
                    },
                    cancel: function () {
                        targetCancel = sync(target, source);
                    }
                });
            })
        }
        sourceCancel = sync(source, target);
        return function () {
            if (sourceCancel) {
                sourceCancel();
            }
            if (targetCancel) {
                targetCancel();
            }
        }
    }
    function createInfoBox(viewer) {
        const infoBoxContainer = document.createElement("div");
        infoBoxContainer.className = "cesium-viewer-infoBoxContainer";
        viewer.container.appendChild(infoBoxContainer);
        const infoBox = new InfoBox(infoBoxContainer);

        const infoBoxViewModel = infoBox.viewModel;
        viewer._eventHelper.add(
            infoBoxViewModel.cameraClicked,
            Viewer.prototype._onInfoBoxCameraClicked,
            viewer
        );
        viewer._eventHelper.add(
            infoBoxViewModel.closeClicked,
            Viewer.prototype._onInfoBoxClockClicked,
            viewer
        );
        viewer._enableInfoOrSelection = true;
        return infoBox
    }
    function createWidgets(options, viewer) {
        if (options.infoBox) {
            viewer._infoBox = createInfoBox(viewer);
        }
    }
    function flyToPrimitive(viewer, target, options) {
        const zoomPromise = viewer._zoomPromise = Cesium.when.defer();
        target.readyPromise.then(() => {
            if (target._boundingSpheres) {
                flyTo(viewer, BoundingSphere$1.fromBoundingSpheres(target._boundingSpheres), options);
            } else if (target.boundingSphere) {
                let boundingSphere = target.boundingSphere;
                boundingSphere = BoundingSphere$1.clone(boundingSphere);
                if (target.modelMatrix) {
                    Matrix4$1.multiplyByPoint(target.modelMatrix, boundingSphere.center, boundingSphere.center);
                }
                flyTo(viewer, boundingSphere, options);
            }
        });
        return zoomPromise
    }
    class Viewer extends Cesium.Viewer {
        /**
         * 创建一个地球, 该Viewer是对Cesium.Viewer的继承。
         * @extends Cesium.Viewer
         * @param {String|Element} container 创建地球的容器。
         * @param {Object} options 具有以下属性：
         * @param {Boolean} [options.animation=false] 如果设置为true, 则不会创建动画小部件。
         * @param {Boolean} [options.baseLayerPicker=false] 是否创建底图选择器。
         * @param {Boolean} [options.fullscreenButton=false] 是否创建全屏按钮。
         * @param {Boolean} [options.vrButton=false] 是否创建VR小部件.
         * @param {Boolean|GeocoderService[]} [options.geocoder=false] 是否创建位置搜索小部件。
         * @param {Boolean} [options.homeButton=false] 是否创建复位按钮
         * @param {Boolean} [options.infoBox=true] 是否创建属性信息显示框,当selectedEntity被定义时，将显示它的属性信息。
         * @param {Boolean} [options.sceneModePicker=false] 是否创建场景模式切换器。
         * @param {Boolean} [options.selectionIndicator=false] 是否创建创建指示器。
         * @param {Boolean} [options.timeline=false] 是否创建时间轴，一般和animation配合使用。
         * @param {Boolean} [options.navigationHelpButton=false] 是否创建帮助工具。
         * @param {Boolean} [options.navigationInstructionsInitiallyVisible=true] 帮助工具是否默认展示,只有当navigationHelpButton为true时生效。
         * @param {Boolean} [options.scene3DOnly=false] 是否仅以3D模式渲染每个几何要素，如果为true,可以节省GPU内存。
         * @param {Boolean} [options.shouldAnimate=false] 如果设为true, 时钟将默认前进。
         * @param {Cesium.ImageryProvider} [options.imageryProvider=createDefaultLayer()] 默认底图。
         * @param {Cesium.TerrainProvider} [options.terrainProvider=new Cesium.EllipsoidTerrainProvider()] 默认地形。
         * @param {Cesium.SkyBox|false} [options.skyBox] 天空盒。
         * @param {Cesium.SkyAtmosphere|false} [options.skyAtmosphere] 大气层。
         * @param {Element|String} [options.fullscreenElement=document.body] 全屏显示的容器。
         * @param {Boolean} [options.useDefaultRenderLoop=true] 如果设为false, 你必须手动调用<code>resize></code>, <code>render</code>函数。
         * @param {Number} [options.targetFrameRate] 使用默认循环时的目标帧率。
         * @param {Boolean} [options.showRenderLoopErrors=true] 发生渲染错误时，是否显示错误信息。
         * @param {Boolean} [options.useBrowserRecommendedResolution=true] 是否使用浏览器推荐的分辨率，如果为真<code>window.devicePixelRatio</code>将不生效。
         * @param {Boolean} [options.automaticallyTrackDataSourceClocks=true] 不是自动跟踪新添加的数据源的时钟设置，并在数据源的时钟发生变化时进行更新。如果要独立配置时钟，请将其设置为 false。
         * @param {Object} [options.contextOptions] WebGL配置
         * @param {Cesium.SceneMode} [options.sceneMode=Cesium.SceneMode.SCENE3D] 场景模式，默认3D。
         * @param {Cesium.MapProjection} [options.mapProjection=new Cesium.GeographicProjection()] 在 2D 和 Columbus View 模式中使用的地图投影。
         * @param {Cesium.Globe|false} [options.globe=new Cesium.Globe(mapProjection.ellipsoid)] 如果为false，地球将不会被创建。
         * @param {Cesium.DataSourceCollection} [options.dataSources=new Cesium.DataSourceCollection()] 矢量数据集。
         * @param {Boolean} [options.shadows=false] 是否显示阴影。
         * @param {Cesium.ShadowMode} [options.terrainShadows=Cesium.ShadowMode.RECEIVE_ONLY] 确定地形是否投射或接收来自光源的阴影。.
         * @param {Cesium.MapMode2D} [options.mapMode2D=Cesium.MapMode2D.INFINITE_SCROLL] 确定 2D 地图是否可旋转或可在水平方向无限滚动。
         * @param {Boolean} [options.projectionPicker=false] 是否显示投影选择器。
         * @param {Boolean} [options.requestRenderMode=false] 如果设为true，则仅在场景中的内容变化时才会渲染帧，可以提高性能，节省电源但是有些情况下可能需要您手动调用{@link Cesium.Scene#requestRender}, 详情请参考{@link https://cesium.com/blog/2018/01/24/cesium-scene-rendering-performance/|Improving Performance with Explicit Rendering}.
         * @param {Number} [options.maximumRenderTimeChange=0.0] 如果requestRenderMode为 true，则此值定义在请求渲染之前允许的模拟时间的最大更改。即模拟时间超maximumRenderTimeChange，将自动调用{@link Cesium.Scene#requestRender}
         */
        constructor(container, options = {}) {
            //>>includeStart('debug', pragmas.debug);
            options = options || {};
            //>>includeEnd('debug')
            options = Object.assign(getDefaultOptions(), options);
            // default position of camera initiliate
            Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(70, 5, 130, 60);
            if (options.globe === false) {
                options.imageryProvider = undefined;
            }
            const superOptions = Object.assign({}, options, {
                infoBox: false
            });
            if(superOptions.globe) {
                superOptions.globe = new Globe(superOptions.globe._ellipsoid);
            } else if(superOptions.globe !== false) {
                superOptions.globe = new Globe();
            }
            super(container, superOptions);
            // remove default logo image
            const logo = document.querySelector('.cesium-credit-logoContainer');
            if (logo) {
                logo.parentElement.removeChild(logo);
            }
            createWidgets(options, this);
            this._options = options;
            this.scene.postRender.addEventListener(this.update, this);

            this._distancePerPixel = undefined;
            this._extent = undefined;
            this._center = undefined;
            this._autoRotation = false;

            this.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
            if (this.scene.globe) {
                const quadtreeProvider = new QuadTreeProvider({
                    terrainProvider: this.terrainProvider,
                    scene: this.scene
                });
                const quadtree = new Cesium.QuadtreePrimitive({
                    tileProvider: quadtreeProvider
                });
                this.scene._LodGraphic = quadtree;
            }
            this.scene.dataSources = this.dataSources;

            this._graphicGroup = new GraphicGroup(this);
        }
        /**
         * 自定义图形集合
         * @readonly
         * @type {GraphicGroup}
         */
        get graphicGroup() {
            return this._graphicGroup;
        }
        /**
         * 大数据图层集合
         * @readonly
         * @type {MassiveEntityLayerCollection}
         */
        get massiveGraphicLayers() {
            return this.scene._LodGraphic.tileProvider._layers;
        }
        /**
         * 获取未绑定到特定数据源的实体集合。
         * @readonly
         * @type {Cesium.EntityCollection}
         */
        get entities() {
            return super.entities;
        }
        /**
         * 获得场景中primitive的集合。
         * @readonly
         * @type {Cesium.PrimitiveCollection}
         */
        get primitives() {
            return this.scene.primitives;
        }
        /**
         * 是否启用太阳光照射，如果启用，将对地球对昼夜区域区分显示。
         * @type {Boolean}
         */
        get enableLighting() {
            if (!defined$8(this.globe)) {
                return;
            }
            return this.scene.globe.enableLighting
        }
        set enableLighting(val) {
            if (!defined$8(this.globe)) {
                return;
            }
            this.scene.globe.enableLighting = val;
        }
        /**
         * 获得或设置是否允许地球自转
         */
        get autoRotation() {
            return this._autoRotation
        }
        set autoRotation(val) {
            this._autoRotation = val;
        }
        /**
         * 打开或关闭快速抗锯齿功能
         * @type {Boolean}
         */
        get fxaa() {
            return this.scene.postProcessStages.fxaa.enabled;
        }
        set fxaa(val) {
            this.scene.postProcessStages.fxaa.enabled = val;
        }
        /**
         * 单位像素的长度所代表的真实距离，它的倒数就是地图学中的比例尺, 单位 km
         * @type {Number}
         * @readonly 
         */
        get distancePerPixel() {
            return this._distancePerPixel;
        }
        /**
         * 返回场景的边界范围
         * @readonly
         */
        get extent() {
            return this._extent;
        }
        /**
         * 返回场景的中心点坐标, 如果中心没有内容，则返回undefined
         * @readonly
         * @type {LonLat}
         */
        get center() {
            return this._center;
        }
        /**
         * 创建地球的容器
         * @type {Element}
         * @readonly
         */
        get container() {
            return this._container;
        }
        /**
         * 获得地球上的所有影像图层(ImageryLayer), 同Cesium中的imageryLayers。
         * @type {Cesium.ImageryLayerCollection}
         * @readonly
         */
        get layers() {
            return this.scene.imageryLayers;
        }
        /**
         * 获得地球上所有矢量图层（geojson,CZML, Kml等）
         * @type {Cesium.DataSource}
         * @readonly
         */
        get dataSources() {
            return super.dataSources;
        }
        /**
         * 地球对象
         * @type {Cesium.Globe}
         * @readonly
         */
        get globe() {
            return this.scene.globe;
        }
        /**
         * 椭球体
         * @type {Cesium.Ellipsoid}
         * @readonly
         */
        get ellipsoid() {
            if (!this.globe) {
                return undefined;
            }
            return this.globe.ellipsoid;
        }
        /**
         * 获得或设置地形
         * @type {Cesium.TerrainProvider}
         */
        get terrain() {
            return this.terrainProvider;
        }
        set terrain(value) {
            if (!defined$8(value) || value === false) {
                this.terrainProvider = new Cesium.EllipsoidTerrainProvider();
            }
            if (value !== this.terrainProvider) {
                this.terrainProvider = value;
            }
        }
        /**
         * 地形发生变化时触发的事件
         * @type {Event}
         * @readonly
         * 
         */
        get terrainChanged() {
            return this.scene.terrainProviderChanged;
        }
        /**
         * 地球夸张比例，小于1的值表示地表缩小，大于1的值表示地形放大
         * @type {Number}
         * @default 1.0
         */
        get terrainExaggeration() {
            if (!this.globe) {
                return undefined;
            }
            return this.globe.terrainExaggeration;
        }
        set terrainExaggeration(value) {
            if (value < 0) {
                value = 0;
            }
            if (this.globe) {
                this.globe.terrainExaggeration = value;
            }
        }
        /**
         * 获取或设置帧率/延迟小部件的显隐状态
         * @type {Boolean}
         */
        get showFps() {
            return this.scene.debugShowFramesPerSecond;
        }
        set showFps(val) {
            this.scene.debugShowFramesPerSecond = val;
        }
        /**
         * 瞬时帧率
         * @type {String}
         * @readonly
         */
        get fps() {
            return this._fps + 'FPS'
        }
        /**
         * 瞬时延迟
         * @type {String}
         * @readonly
         */
        get ms() {
            return this._ms + 'MS'
        }
        /**
         * 获得相机的偏航角，单位：度
         * @type {Number}
         * @readonly
         */
        get heading() {
            return Cesium.Math.toDegrees(this.camera.heading);
        }
        /**
        * 获得相机的仰俯角，单位：度
        * @type {Number}
        * @readonly
        */
        get pitch() {
            return Cesium.Math.toDegrees(this.camera.pitch);
        }
        /**
        * 获得相机的翻滚角，单位：度
        * @type {Number}
        * @readonly
        */
        get roll() {
            return Cesium.Math.toDegrees(this.camera.roll);
        }
        /**
         * 打开或关闭基于地形的深度测试，同<code>viewer.scene.globe.depthTestAgainstTerrain</code>
         * @type {Boolean}
         */
        get depthTest() {
            return this.scene.globe.depthTestAgainstTerrain;
        }
        set depthTest(val) {
            this.scene.globe.depthTestAgainstTerrain = val;
        }
        /**
         * 将一个模型添加到场景中
         * @param {Model|Tileset} model 
         */
        addModel(model) {
            this.primitives.add(model.delegate);
        }    
        /**
         * 删除模型
         * @param {Model} model 需要被删除的模型
         * @returns {Boolean} 是否删除成功
         */
        removeModel(model) {
            this.primitives.remove(model.delegate);
        }
        /**
         * 设置地球场景的视图位置。
         * @param {LonLat|Cesium.Cartesian3|Cesium.Cartographic} target 默认位置
         * @example 
         * viewer.setView(new CesiumPro.LonLat(110, 30, 10000))
         * viewer.setView(Cesium.Cartesian3.fromDegrees(110, 30, 10000))
         */
        setView(target) {
            let geopoint;
            if (target instanceof Cesium.Cartographic) {
                geopoint = LonLat.fromCartographic(target);
            } else if (target instanceof Cesium.Cartesian3) {
                geopoint = LonLat.fromCartesian(target);
            } else if (target instanceof LonLat) {
                geopoint = target;
            } else {
                //>>includeStart('debug', pragmas.debug);
                throw new CesiumProError$1('target不是一个有效值')
                //>>includeEnd('debug')
            }
            if (geopoint) {
                setView(this, geopoint.lon, geopoint.lat, geopoint.alt);
            }

        }
        /**
          * 此方法将定位分成3个步骤：step 1:调整位置,step 2:调整高度,step 3:调整角度，一般用于小场景初始化时。
          * @param  {Object} [options={}] 具有以下参数
          * @param  {Cesium.Cartesian3} options.destination 目标位置
          * @param  {Object} [options.orientation] 相机姿态
          * @param  {Number} [options.step1Duration=3.0] 调整高度的持续时间
          * @param  {Number} [options.step1Duration=3.0] 调整位置的持续时间
          * @param  {Number} [options.step1Duration=3.0] 调整姿态的持续时间
          * @return {Promise}
        */
        stepFlyTo(options = {}) {
            let destination;
            if (options.destination instanceof Cesium.Cartesian3) {
                destination = LonLat.fromCartesian(options.destination);
            } else if (options.destination instanceof Cesium.Cartographic) {
                destination = LonLat.fromCartographic(options.destination);
            } else if (options.destination instanceof LonLat) {
                destination = options.destination;
            } else {
                //>>includeStart('debug', pragmas.debug);
                throw new CesiumProError$1('target不是一个有效值')
                //>>includeEnd('debug')
            }
            if (destination) {
                options.destination = destination;
                stepFlyTo(this, options);
            }
        }
        /**
         * 将两个球的视图同步，同步后任何一个球的相机位置发生变化后，另一个球也随之变化。
         * @param {Viewer} viewer viewer对象
         * @returns {Function} 用于取消视图同步的函数
         * @example
         * const viewer = new CesiumPro.Viewer('map');
         * const viewer1 = new CesiumPro.Viewer('map1);
         * const cancelLink = viewer.linkView(viewer1);
         * // 取消同步
         * cancelLink();
         */
        linkView(viewer) {
            if (!defined$8(viewer)) {
                throw new CesiumProError$1('viewer不是一个有效的Cesium.Viewer对象')
            }
            return syncDoubleView(this, viewer);
        }
        /**
         * 将相机移动到提供的Cartesian, entity, primitive, 或dataSource,如果数据源仍在加载过程中，或者可视化仍在加载，
         * 此方法将在数据准备就绪后执行。
         * @param {LonLat|Cesium.Cartesian|Cesium.Primitive|Cesium.Entity|Cesium.Entity[]|Cesium.EntityCollection|Cesium.DataSource|Cesium.ImageryLayer|Cesium.Cesium3DTileset|Cesium.TimeDynamicPointCloud|Promise<Cesium.Entity|Cesium.Entity[]|Cesium.EntityCollection|Cesium.DataSource|Cesium.ImageryLayer|Cesium.Cesium3DTileset|Cesium.TimeDynamicPointCloud>} target 需要定位的Cartesian, Entity, Primitive, ImageryLayer, Datasource等 
         * @param {Object} options 具有以下属性
         * @param {Number} [options.duration = 3000] 相机飞行持续时间，单位毫秒
         * @param {Number} [options.maximumHeight] 相机飞行最大高度
         * @param {Cesium.HeadingPitchRange} [options.offset] 相机角度，可以包含heading、pitch、roll
         * @returns {Promise<Boolean>}
         * @example
         * viewer.flyTo({
         *     destination : Cesium.Cartesian3.fromDegrees(-122.19, 46.25, 5000.0),
         *     orientation : {
         *         heading : Cesium.Math.toRadians(175.0),
         *         pitch : Cesium.Math.toRadians(-35.0),
         *         roll : 0.0
         *     }
         * });
         */
        flyTo(target, options = {}) {
            if (target instanceof LonLat) {
                const catresian = target.toCartesian();
                return this.flyTo(catresian, options)
            }
            if (target instanceof Cesium.Cartesian3) {
                const zoomPromise = viewer._zoomPromise = Cesium.when.defer();
                const radius = defaultValue$6(options.radius, 1000);
                delete options.radius;
                const boundingSphere = new Cesium.BoundingSphere(target, radius);
                flyTo(this, boundingSphere, options);
                return zoomPromise
            } else if (target instanceof Cesium.Primitive) {
                return flyToPrimitive(this, target, options)
            } else if (target instanceof Cesium.Model) {
                return flyToPrimitive(this, target, options)
            } else if (target instanceof Model) {
                return flyToPrimitive(this, target.delegate, options)
            } else if(target instanceof Tileset) {
                return super.flyTo(target.delegate, options)
            } else if(target.boundingSphere) {
                return this.camera.flyToBoundingSphere(target.boundingSphere);
            }
            return super.flyTo(target, options);
        }
        /**
         * 使场景绕指定点旋转。
         * @param {Cesium.Cartesian3|Cesium.Cartographic|LonLat} point 相机旋转的中心点
         * @param {Object} options 具有以下属性
         * @param {Cesium.HeadingPitchRange} [options.offset] 相机的角度
         * @param {Number} [options.multiplier = 1] 旋转倍速，大小1的值使旋转速度变快，小于1的值使旋转速度变慢，小于0的值将使地球反方向旋转。
         * @returns {Function} 用于取消旋转的函数
         * @example
         * const p = new CesiumPro.LonLat(110,30)
         * let cancel = viewer.rotateAroundPoint(p);
         */
        rotateAroundPoint(point, options = {}) {
            const viewer = this;
            let target;
            if (point instanceof Cesium.Cartesian3) {
                target = point;
            } else if (point instanceof Cesium.Cartographic) {
                target = Cesium.Cartographic.toCartesian(point);
            } else if (point instanceof LonLat) {
                target = point.toCartesian();
            } else {
                //>>includeStart('debug', pragmas.debug);
                throw new CesiumProError$1('point不是一个有效值。')
            }
            const multiplier = defaultValue$6(options.multiplier, 1);
            const offset = defaultValue$6(options.offset, {});
            function rotate() {
                const heading = Cesium.Math.toRadians(defaultValue$6(offset.heading, viewer.heading) + 1 * multiplier);
                const pitch = Cesium.Math.toRadians(defaultValue$6(offset.pitch, -20));
                const range = defaultValue$6(offset.range, 10000);
                viewer.flyTo(target, {
                    duration: 0,
                    offset: new Cesium.HeadingPitchRange(heading, pitch, range)
                });
            }
            if (this._cancelRotateAroundPoint) {
                this._cancelRotateAroundPoint();
                this._cancelRotateAroundPoint = undefined;
            }
            this._cancelRotateAroundPoint = this.scene.postRender.addEventListener(rotate);
            return this._cancelRotateAroundPoint;
        }
        /**
         * 添加一个图层,对影像图层(ImageryProvider)和矢量图层(DataSource)都有效
         * @param {Cesium.ImageryProvider|Cesium.DataSource|Promise<Cesium.DataSource>} layerProvider 
         * @returns {Cesium.ImageryLayer|Cesium.DataSource|Promise<Cesium.DataSource>} 新添加的图层
         * @example
         * // 1. 使用viewer.addLayer添加影像图层
         * viewer.addLayer(new CesiumPro.GaoDeLayer())
         * // 2. 使用viewer.layers.add添加影像图层
         * viewer.layers.addImageryProvider(new CesiumPro.GaoDeLayer())
         * // 1和2的效果是相同的
         * // 3. 使用viewer.addLayer添加矢量图层
         * viewer.addLayer(Cesium.KmlDataSource.load('sample.kml'))
         * // 4.使用viewer.dataSources.add添加矢量图层
         * viewer.dataSources.add(Cesium.KmlDataSource.load('sample.kml'))
         * // 3和4的效果是相同的
         */
        addLayer(layerProvider) {
            if (
                layerProvider instanceof Cesium.GeoJsonDataSource ||
                layerProvider instanceof Cesium.KmlDataSource ||
                layerProvider instanceof Cesium.CzmlDataSource ||
                layerProvider instanceof Cesium.CustomDataSource ||
                layerProvider instanceof GeoJsonDataSource ||
                layerProvider instanceof ShapefileDataSource ||
                isPromise(layerProvider)) {
                return this.dataSources.add(layerProvider)
            }
            // if not DataSource, handle it as ImageryLayer
            return this.layers.addImageryProvider(layerProvider);
        }
        /**
         * 删除图层
         * @param {Cesium.ImageryLayer|Cesium.DataSource|Promise<Cesium.DataSource>|Promise<Cesium.ImageryLayer>} layer 被删除的图层
         * @example
         * const provider = new BingLayer();
         * const layer = viewer.addLayer(provider);
         * viewer.removeLayer(layer);
         */
        removeLayer(layer) {
            if (isPromise(layer)) {
                layer.then(value => {
                    this.removeLayer(value);
                });
            } else {
                const removed = this.layers.remove(layer);
                if (!removed) {
                    this.dataSources.remove(layer);
                }
            }

        }
        /**
         * 拾取指定位置的图层信息，该方法会调用图层的pickFeatures方法
         * @param {Cesium.Carteisn2} windowPosition 屏幕位置 
         * @returns {Cesium.ImageryLayerFeatureInfo[]} 属性信息
         * @example
         * const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
         * handler.setInputAction(e => {
         *    const layer = viewer.pickLayer(e.position)
         *    layer.then(res=>{
         *         console.log(res)
         *    }),
         *  Cesium.ScreenSpaceEventType.LEFT_CLICK)
         * }
         */
        pickLayer(windowPosition) {
            const scene = this.scene;
            const pickRay = scene.camera.getPickRay(windowPosition);
            return this.layers.pickImageryLayerFeatures(pickRay, scene)

        }
        /**
        * 该函数会自动被调用，除非<code>useDefaultRenderLoop</code> 设为false;
        */
        render() {
            super.render();
        };
        update() {
            const value = updateFps();
            this._fps = value.fps;
            this._ms = value.ms;
            const distance = computeDistancePerPixel(this);
            if (distance) {
                this._distancePerPixel = distance;
            }
            // 计算场景范围和中心位置
            this._extent = computeSceneExtent(this);
            this._center = computeSceneCenterPoint(this);
            // 地球自转
            if (this._autoRotation) {
                icrf(this);
            }
            this.graphicGroup.update(this.clock.currentTime);
        }
        /**
        * 调整小部件的大小，以适应container，该函数会自动被调用，除非<code>useDefaultRenderLoop</code> 设为false;
        */
        resize() {
            super.resize();
        }
        /**
         * 强制调整小部件大小
         */
        forceResize() {
            super.forceResize();
        }
        /**
         * 销毁场景
         */
        destroy() {
            super.destroy();
        }
        /**
         * 判断场景是否被销毁
         * @returns {Boolean} 是否被销毁
         */
        isDestroyed() {
            return super.isDestroyed();
        }
        /**
         * 鼠标事件监听
         * @param {Function} fn 回调函数
         * @param {String} [event = 'LEFT_CLICK'] 事件类型
         * @param {Element} [target = this.canvas] 触发事件的元素，默认为球的canvas
         * @returns 取消事件监听的函数
         * @example
         * const removeAction = viewer.on(function(e) {});
         * const removeAction = viewer.on(function(e) {}, 'MOUSE_MOVE');
         * // 移除事件监听
         * removeAction();
         */
        on(fn, event = 'LEFT_CLICK', target = this.canvas) {
            const handler = new ScreenSpaceEventHandler(target);
            const removeInputAction = handler.setInputAction(fn, ScreenSpaceEventType[event]);
            return function() {
                if (handler.isDestroyed()) {
                    return;
                }
                removeInputAction();
                handler.destroy();
            }
        }
    }
    // 生写Cesium中的部分函数
    overrideCesium();

    const {
        Color: Color$2,
        MaterialAppearance: MaterialAppearance$4,
        CircleGeometry: CircleGeometry$1,
        GroundPrimitive: GroundPrimitive$1,
        Primitive: Primitive$1,
        GeometryInstance: GeometryInstance$1,
        Material: Material$4
    } = Cesium;
    class PointBaseGraphic extends Graphic {
        /**
         * 所有点状图形基类， 这里的点并不是常规意义上的点， 而是指由一个中心位置和一个半径确定图形结构的要素
         * @param {PointBaseGraphic.ConstructorOptions} options 描述一个几何要素的属性信息
         */
        constructor(options) {
            if (!defined$8(options)) {
                throw new CesiumProError$1("options must be provided.")
            }
            if (LonLat.isValid(options.position) === false) {
                throw new CesiumProError$1('options.position parameter is invalid.');
            }
            if (isNaN(options.radius) && options.radius <= 0) {
                throw new CesiumProError$1("options.radius parameter must be a number greater than 0.");
            }
            super(options);
            this._color = defaultValue$6(options.color, Color$2.WHITE);
            if (typeof this._color === 'string') {
                this._color = Color$2.fromCssColorString(this._color);
            }
            this._position = options.position;
            this._radius = options.radius;
            this._stRotation = Cesium.Math.toRadians(defaultValue$6(options.stRotation, 0));
            this._height = defaultValue$6(options.height, 0);
            this._extrudedHeight = defaultValue$6(options.extrudedHeight, 0);
            this._asynchronous = defaultValue$6(options.asynchronous, true);
        }
        /**
         * @private
         */
        createGraphic() {
            if (this._clampToGround) {
                this.createGroundPrimitive(this._asynchronous);
            } else {
                this.createPrimitive(this._asynchronous);
            }
        }
        /**
         * @private
         */
        createPrimitive(asynchronous = true) {
            if (this.isDestroyed()) {
                return;
            }
            const geometry = new CircleGeometry$1({
                center: LonLat.toCartesian(this._position),
                radius: this._radius,
                stRotation: this._stRotation,
                extrudedHeight: this._extrudedHeight,
                height: this._height,
                granularity: 0.01
            });
            this._primitive = new Primitive$1({
                geometryInstances: new GeometryInstance$1({
                    geometry,
                    id: this.property
                }),
                appearance: this.createAppearance(),
                asynchronous,
                allowPicking: this._allowPicking
            });
            return this._primitive;
        }
        /**
         * @private
         */
        createGroundPrimitive(asynchronous = true) {
            if (this.isDestroyed()) {
                return;
            }
            const geometry = new CircleGeometry$1({
                center: LonLat.toCartesian(this._position),
                radius: this._radius,
                stRotation: this._stRotation,
                extrudedHeight: this._extrudedHeight,
                height: this._height
            });
            this._primitive = new GroundPrimitive$1({
                geometryInstances: new GeometryInstance$1({
                    geometry,
                    id: this.property
                }),
                appearance: this.createAppearance(),
                asynchronous,
                allowPicking: this._allowPicking,
            });
            return this._primitive;
        }
        /**
         * @private
         * @returns 外观
         */
        createAppearance() {
            if (defined$8(this._appearance)) {
                return this._appearance;
            }
            this._appearance = new MaterialAppearance$4({
                material: Material$4.fromType('Color', {
                    color: this._color
                })
            });
            return this._appearance;
        }
        /**
         * 要素的位置
         * @type {LonLat}
         */
        get position() {
            return this._position
        }
        set position(v) {
            if (!LonLat.isValid(v)) {
                return;
            }
            this.definedChanged.raise('position', v, this._position);
            this._position = v;
            this.updatePrimitive();
        }
        /**
         * 要素的半径
         * @type {Number}
         */
        get radius() {
            return this._radius;
        }
        set radius(v) {
            if (!v === this._radius) {
                return;
            }
            this.definedChanged.raise('radius', v, this._radius);
            this._radius = v;
            this.updatePrimitive();
        }
        /**
         * 获得或设置高度
         */
         get height() {
            return this._height;
        }
        set height(val) {
            if (val === this._height) {
                return;
            }
            this.definedChanged.raise('height', val, this._height);
            this._height = val;
            this._extrudedHeight = val;
            this.updatePrimitive();
        }
        /**
         * 要素颜色
         * @type {String|Cesium.Color}
         * @example
         * graphic.color = new Cesium.Color(1,0,0);
         * graphic.color = '#FF0000'
         */
        get color() {
            if (!defined$8(this._color)) {
                return;
            }
            return this._color.toCssColorString();
        }
        set color(v) {
            this.definedChanged.raise('color', v, this._color);
            if (typeof v === 'string') {
                this._color = Cesium.Color.fromCssColorString(v);
            } else {
                this._color = v;
            }
            this.updateAttribute('color', this._color);
        }
        toJson() {
            return {
                position: this._position.toArray(),
                radius: this.radius,
                clampToGround: this.clampToGround
            }
        }
        /**
         * @private
         * 重新生成primitive并移除旧的，一般在更新位置或半径后调用
         */
        updatePrimitive() {
            if (!this._viewer) {
                return;
            }
            const oldPrimitive = this.primitive;
            this.createGraphic();
            this._viewer.primitives.add(this._primitive);
            this._viewer.primitives.remove(oldPrimitive);
        }
        zoomTo(options) {
            if (!this._viewer) {
                return;
            }
            if (!this._primitive) {
                return;
            }
            this.readyPromise.then(() => {
                const boundingSphere = graphic.primitive._boundingSpheres[0];
                if (boundingSphere) {
                    this._viewer.camera.flyToBoundingSphere(boundingSphere, options);
                }
            });
        }
    }

    const glsl$1 = `
    float circle(vec2 uv, float r, float blur) {
        float d = length(uv);
        float c = smoothstep(r+blur, r, d);
        return c;
    }
    czm_material czm_getMaterial(czm_materialInput materialInput) {
        czm_material material = czm_getDefaultMaterial(materialInput);
        mat2 rotateMatrix = mat2(stRotation.x, stRotation.y, stRotation.z, stRotation.w);
        vec2 st = rotateMatrix * (materialInput.st - vec2(0.5));
        float t = time;
        float s = 0.4;
        float radius1 = smoothstep(.0, s, 1.0) * 0.5;
        float alpha1 = circle(st, radius1, 0.02) * circle(st, radius1, -0.02);
        float alpha2 = circle(st, radius1, 0.02 - radius1) * circle(st, radius1, 0.02);
        float radius2 = 0.5 + smoothstep(s, 1.0, t) * 0.5;
        float alpha3 = circle(st, radius1, radius2 + 0.01 - radius1) * circle(st, radius1, -0.02);
    
        float circleAlpha = color.a * smoothstep(1.0, s, 0.0) * (alpha1 + alpha2*0.1 + alpha3*0.2);
        vec4 imageColor = texture2D(image, st + vec2(0.5));
        material.diffuse = color.rgb;
        material.alpha = imageColor.a * color.a + circleAlpha;
        return material;
    }
`;

    const {
        MaterialAppearance: MaterialAppearance$3,
        Material: Material$3
    } = Cesium;
    class CircleScanGraphic extends PointBaseGraphic {
        /**
         * 圆形扫描波
         * @extends PointBaseGraphic
         * @param {CircleScanGraphic.ConstructorOptions} options 定义该图形的属性
         * @example
         * graphic = new CesiumPro.CircleScanGraphic({
         *   position: new CesiumPro.LonLat(107.766, 34.548),
         *   radius: 1000,
         *   color: '#FF0000',
         *   speed: 5000
         * });
         * graphic.addTo(viewer);
         * // or
         * viewer.graphicGraphic.add(graphic);
         * @demo {@link examples/apps/index.html#/5.3.1-circlescan|圆形扫描波示例}
         */
        constructor(options) {
            super(options);
            this._speed = defaultValue$6(options.speed, 10);
            this._time = 0;
            this.createGraphic();
        }
        /**
         * 扫描速度
         * @type {Number}
         * @default 10
         */
        get speed() {
            return this._speed;
        }
        set speed(val) {
            if (this._speed !== val) {
                return;
            }
            if (val <= 0) {
                throw new CesiumProError("速度不能小于0")
            }
            this.definedChanged.raise('speed', val, this._speed);
            this._speed = val;
        }
        createAppearance() {
            if (this._appearance) {
                return this._appearance;
            }
            this._appearance = new MaterialAppearance$3({
                material: new Material$3({
                    translucent: true,
                    fabric: {
                        uniforms: {
                            image: Url.buildModuleUrl("./assets/img/radarScan.png"),
                            stRotation: Cesium.Matrix2.IDENTITY,
                            color: this._color,
                            time: 0
                        },
                        source: glsl$1
                    },
                })
            });
            return this._appearance;
        }
        update(time) {
            if (!this.material) {
                return;
            }
            const t = Cesium.JulianDate.toDate(time).getTime() / this.speed;
            const normalizeAngle = t % (360);
            const rotation = Cesium.Matrix2.fromRotation(Cesium.Math.toRadians(-normalizeAngle));
            this.material.uniforms.stRotation = {
                x: rotation[0],
                y: rotation[1],
                z: rotation[2],
                w: rotation[3]
            };
            this.material.uniforms.time = t - parseInt(t);
        }
    }

    const shader$1 = `
float circle(vec2 uv, float r, float blur) {
    float d = length(uv) * 2.0;
    float c = smoothstep(r+blur, r, d);
    return c;
}

uniform vec4 color;
uniform float time;
czm_material czm_getMaterial(czm_materialInput materialInput)
{
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = materialInput.st - .5;
    material.diffuse = color.rgb;
    material.emission = vec3(0);
    float t = time;
    float s = 0.3;
    float radius1 = smoothstep(.0, s, t) * 0.5;
    float alpha1 = circle(st, radius1, 0.01) * circle(st, radius1, -0.01);
    float alpha2 = circle(st, radius1, 0.01 - radius1) * circle(st, radius1, 0.01);
    float radius2 = 0.5 + smoothstep(s, 1.0, t) * 0.5;
    float alpha3 = circle(st, radius1, radius2 + 0.01 - radius1) * circle(st, radius1, -0.01);

    material.alpha = smoothstep(1.0, s, t) * (alpha1 + alpha2*0.1 + alpha3*0.1);
    material.alpha *= color.a;

    return material;
}
`;

    const {
        MaterialAppearance: MaterialAppearance$2,
        Material: Material$2
    } = Cesium;
    class CircleSpreadGraphic extends PointBaseGraphic {
        /**
         * 圆形扩散波
         * @extends PointBaseGraphic
         * @param {CircleScanGraphic.ConstructorOptions} options 定义该图形的属性
         * @example
         * graphic = new CesiumPro.CircleSpreadGraphic({
         *   position: new CesiumPro.LonLat(107.766, 34.548),
         *   radius: 1000,
         *   color: '#FF0000',
         *   speed: 5000
         * });
         * graphic.addTo(viewer);
         * // or
         * viewer.graphicGraphic.add(graphic);
         * @demo {@link examples/apps/index.html#/5.3.2-circleSpread|圆形扩散波示例}
         */
        constructor(options) {
            super(options);
            this._speed = defaultValue$6(options.speed, 10);
            this._time = 0.0;
            this.createGraphic();
        }
        /**
         * 扫描速度
         * @type {Number}
         * @default 10
         */
        get speed() {
            return this._speed;
        }
        set speed(val) {
            if (val === this._speed) {
                return;
            }
            if (val <= 0) {
                throw new CesiumProError("速度不能小于0")
            }
            this.definedChanged.raise('speed', val, this._speed);
            this._speed = val;        
        }
        createAppearance() {
            if (this._appearance) {
                return this._appearance;
            }
            this._appearance = new MaterialAppearance$2({
                material: new Material$2({
                    translucent: true,
                    fabric: {
                        uniforms: {
                            color: this._color,
                            time: 0.0,
                        },
                        source: shader$1
                    },
                })
            });
            return this._appearance;
        }
        update(time) {
            if (!this.material) {
                return;
            }
            const t = Cesium.JulianDate.toDate(time).getTime() / this.speed;
            this.material.uniforms.time = t - parseInt(t);
            
        }
    }

    const baseMaterialShader$1 = `
uniform sampler2D image;
uniform vec4 color;

float glow(float var, float radius, float blur) {
    float innerRadius = radius - blur;
    float outerRadius = radius + blur;
    float alpha = 1.0 - step(var, innerRadius);
    alpha *= step(var, outerRadius);
    float innerBlur = (1.0 - step(var, innerRadius)) * var;
    float outerBlur = (1.0 - abs(var - radius) / blur) * alpha;
    return outerBlur ;
}
czm_material czm_getMaterial(czm_materialInput materialInput) {
  czm_material material = czm_getDefaultMaterial(materialInput);
  vec2 st = materialInput.st;
  // calculate distance from the fragment to circle center and normalize it.
  float length = distance(st, vec2(0.5)) * 2.0;
  float innerCircle = glow(length, 0.35, 0.2);
  float outerCircle = glow(length, 0.8, 0.2);
  float alpha = innerCircle + outerCircle;
  material.diffuse = color.rgb * vec3(color.a);
  material.alpha = pow(alpha, 4.0) * color.a;
  return material;
}
`;
    const dashCircleMaterialShader$1 = `
float dashCircle(vec2 st, float time) {
  float slice = 18.0;
  time = 3.1415926 / 180.0 * time;
  float cost = cos(time);
  float sint = sin(time);
  mat2 rotateMatrix = mat2(cost, -sint, sint, cost);
  st = rotateMatrix * st;
  float cos = dot(normalize(st), vec2(1.0, 0.0));
  float angle  = acos(cos);
  float sliceAngle = 3.1415926 * 2.0 / slice;
  float index = mod(floor(angle / sliceAngle), 2.0);
  if (st.t > 0.0) {
    return 1.0 - index;
  }
  return index;
}
czm_material czm_getMaterial(czm_materialInput materialInput) {
  czm_material material = czm_getDefaultMaterial(materialInput);
  vec2 st = materialInput.st;
  float length = distance(st, vec2(0.5)) * 2.0;
  vec2 center = st - vec2(0.5, 0.5);
  float time = -czm_frameNumber * 3.1415926 / 180.;//扫描速度1度
  float sin_t = sin(time);
  float cos_t = cos(time);
  float alpha = step(length, 0.7);
  alpha *= step(0.55, length);
  alpha *= dashCircle(st - vec2(0.5), mod(czm_frameNumber * speed, 180.0 * 2.0));
  alpha *= min((1.0 - abs(length - 0.625) / 0.15), 1.0);
  material.diffuse = color.rgb;
  material.alpha = alpha * color.a;
  return material;
}
`;
    const coneMaterialShader$1 = `
czm_material czm_getMaterial(czm_materialInput materialInput) {
  czm_material material = czm_getDefaultMaterial(materialInput);
  vec2 st = materialInput.st;
  float powerRatio = 1.0 / (fract(czm_frameNumber / 30.0) + 1.0);
  float alpha = pow(1.0 - st.t, powerRatio);
  material.diffuse = color.rgb;
  material.alpha = alpha * color.a;
  return material;
}
`;
    const cylinderMaterialShader$1 = `
czm_material czm_getMaterial(czm_materialInput materialInput) {
  czm_material material = czm_getDefaultMaterial(materialInput);
  vec2 st = materialInput.st;
  float time = fract(czm_frameNumber / 90.0 * speed);
  vec4 color = texture2D(image, fract(st - vec2(time)));
  float alpha = color.a;
  alpha *= color.a;
  material.diffuse = color.rgb;
  material.alpha = alpha * pow(1.0 - st.t, color.a);
  return material;
}
`;
    var glsl = {
        baseMaterialShader: baseMaterialShader$1,
        dashCircleMaterialShader: dashCircleMaterialShader$1,
        coneMaterialShader: coneMaterialShader$1,
        cylinderMaterialShader: cylinderMaterialShader$1
    };

    const { baseMaterialShader, dashCircleMaterialShader, coneMaterialShader, cylinderMaterialShader } = glsl;
    const {
        MaterialAppearance: MaterialAppearance$1,
        Material: Material$1,
        CircleGeometry,
        GroundPrimitive,
        Primitive,
        GeometryInstance,
        PrimitiveCollection,
        CylinderGeometry,
        Transforms: Transforms$1,
        Matrix4,
        Cartesian3
    } = Cesium;
    class DynamicConeGraphic extends PointBaseGraphic {
        /**
         * 
         * @extends PointBaseGraphic
         * @param {DynamicConeGraphic.ConstructorOptions} options 定义该图形的属性
         * @example
         * graphic = new CesiumPro.RadarScanGraphic({
         *   position: new CesiumPro.LonLat(107.766, 34.548),
         *   radius: 1000,
         *   color: '#FF0000',
         *   speed: 5000
         * });
         * graphic.addTo(viewer);
         * // or
         * viewer.graphicGraphic.add(graphic);
         * @demo {@link examples/apps/index.html#/5.3.4-dynamicCone|DynamicConeGraphic示例}
         */
        constructor(options) {
            super(options);
            this._speed = defaultValue$6(options.speed, 1);
            this._image = defaultValue$6(options.image, Url.buildModuleUrl('assets/img/particle.png'));
            this._appearance = {};
            this._length = options.length;
            this._primitive = new PrimitiveCollection();
            this.createGraphic();
        }
        /**
         * 速度
         * @type {Number}
         * @default 10
         */
        get speed() {
            return this._speed;
        }
        set speed(val) {
            if (val === this._speed) {
                return;
            }
            if (val <= 0) {
                throw new CesiumProError$1("速度不能小于0")
            }
            this.definedChanged.raise('speed', val, this._speed);
            this._speed = val;
            const appearances = Object.values(this._appearance);
            for (let appearance of appearances) {
                const material = appearance.material;
                console.log(material.uniforms);
                material.uniforms.speed = val;
            }
        }
        /**
         * 获得或设置圆锥高度
         */
        get length() {
            return this._length;
        }
        set length(val) {
            if (val === this._length) {
                return;
            }
            this.definedChanged.raise('length', val, this._length);
            this._length = val;
            this.updatePrimitive();
        }
        /**
         * @override
         */
         updatePrimitive() {
            if (!this._viewer) {
                return;
            }
            const oldPrimitive = this.primitive;
            oldPrimitive.removeAll();
            this.createGraphic();
            this._viewer.primitives.add(this._primitive);
        }
        /**
         * @override
         * @private
         * @param {*} k 
         * @param {*} v 
         * @returns 
         */
        updateAttribute(k, v) {
            if (this.isDestroyed()) {
                return;
            }
            if (!this.primitive) {
                return;
            }
            const primitives = this.primitive._primitives;
            for (let primitive of primitives) {
                super.updateAttribute.call({primitive, isDestroyed: this.isDestroyed}, k, v);
            }
        }
        /**
         * @private
         */
        createGraphic() {
            const appearance1 = this.createAppearance(baseMaterialShader);
            const appearance2 = this.createAppearance(dashCircleMaterialShader);
            const appearance3 = this.createAppearance(coneMaterialShader);
            const appearance4 = this.createAppearance(cylinderMaterialShader);
            if (this._clampToGround) {
                this.createCircleGroundPrimitive(appearance1, this._asynchronous);
                this.createCircleGroundPrimitive(appearance2, this._asynchronous);
                this.createCylinder(this._radius * 0.35, appearance3, this._asynchronous);
                this.createCylinder(this._radius * 0.4, appearance4, this._asynchronous);
            } else {
                this.createCirclePrimitive(appearance1, this._asynchronous);
                this.createCirclePrimitive(appearance2, this._asynchronous);
                this.createCylinder(this._radius * 0.35, appearance3, this._asynchronous);
                this.createCylinder(this._radius * 0.4, appearance4, this._asynchronous);
            }
        }
        createCylinder(radius, appearance, asynchronous = true) {
            if (this.isDestroyed()) {
                return;
            }
            const length = defaultValue$6(this._length, this._radius * 0.35 * 8);
            const matrix = Transforms$1.eastNorthUpToFixedFrame(LonLat.toCartesian(this._position));
            const translation = Matrix4.fromTranslation(new Cartesian3(0, 0, length / 2 + this._height));
            Matrix4.multiply(matrix, translation, matrix);
            const geometry = new CylinderGeometry({
                radius: this._radius,
                topRadius: 0,
                bottomRadius: radius,
                length,
            });
            const primitive = new Primitive({
                geometryInstances: new GeometryInstance({
                    geometry,
                    id: this.property
                }),
                appearance: appearance,
                asynchronous,
                allowPicking: this._allowPicking,
                modelMatrix: matrix
            });

            this._primitive.add(primitive);
            return primitive;
        }
        /**
         * @private
         */
        createCirclePrimitive(appearance, asynchronous = true) {
            if (this.isDestroyed()) {
                return;
            }
            const geometry = new CircleGeometry({
                center: LonLat.toCartesian(this._position),
                radius: this._radius,
                stRotation: this._stRotation,
                extrudedHeight: this._extrudedHeight,
                height: this._height,
                granularity: 0.01
            });
            const primitive = new Primitive({
                geometryInstances: new GeometryInstance({
                    geometry,
                    id: this.property
                }),
                appearance: appearance,
                asynchronous,
                allowPicking: this._allowPicking
            });
            this._primitive.add(primitive);
            return primitive;
        }
        /**
         * @private
         */
        createCircleGroundPrimitive(appearance, asynchronous = true) {
            if (this.isDestroyed()) {
                return;
            }
            const geometry = new CircleGeometry({
                center: LonLat.toCartesian(this._position),
                radius: this._radius,
                stRotation: this._stRotation,
                extrudedHeight: this._extrudedHeight,
                height: this._height
            });
            const primitive = new GroundPrimitive({
                geometryInstances: new GeometryInstance({
                    geometry,
                    id: this.property
                }),
                appearance: appearance,
                asynchronous,
                allowPicking: this._allowPicking,
            });
            this._primitive.add(primitive);
            return primitive;
        }
        createAppearance(shader) {
            if (this._appearance[shader]) {
                return this._appearance[shader];
            }
            this._appearance[shader] = new MaterialAppearance$1({
                material: new Material$1({
                    translucent: true,
                    fabric: {
                        uniforms: {
                            color: this._color,
                            image: this._image,
                            speed: this._speed
                        },
                        source: shader//baseMaterialShader
                    },
                })
            });
            return this._appearance[shader];
        }
        update(time) {
        }
    }

    const shader = `
czm_material czm_getMaterial(czm_materialInput materialInput) {
    czm_material material = czm_getDefaultMaterial(materialInput);
    material.diffuse = color.rgb;
    vec2 st = materialInput.st - vec2(0.5);
    float dis = distance(st, vec2(0.0));
    // material.alpha = min(pow(dis * 2.0, 5.0) * color.a, 1.0);
    if (dis * 2.0 > fract(time)) {
        discard;
    }  
    float scale = 1.0 / (max(time, 0.0001));
    material.alpha = min(pow(dis * 2.0 * scale, 5.0), 1.0) * color.a;
    return material;
}
`;

    const {
        MaterialAppearance,
        Material
    } = Cesium;
    class RadarScanGraphic extends PointBaseGraphic {
        /**
         * 圆形扩散波
         * @extends PointBaseGraphic
         * @param {CircleScanGraphic.ConstructorOptions} options 定义该图形的属性
         * @example
         * graphic = new CesiumPro.RadarScanGraphic({
         *   position: new CesiumPro.LonLat(107.766, 34.548),
         *   radius: 1000,
         *   color: '#FF0000',
         *   speed: 5000
         * });
         * graphic.addTo(viewer);
         * // or
         * viewer.graphicGraphic.add(graphic);
         * @demo {@link examples/apps/index.html#/5.3.3-radarScan|雷达扫描波示例}
         */
        constructor(options) {
            super(options);
            this._speed = defaultValue$6(options.speed, 10);
            this._time = 0.0;
            this.createGraphic();
        }
        /**
         * 扫描速度
         * @type {Number}
         * @default 10
         */
         get speed() {
            return this._speed;
        }
        set speed(val) {
            if (val === this._speed) {
                return;
            }
            if (val <= 0) {
                throw new CesiumProError("速度不能小于0")
            }
            this.definedChanged.raise('speed', val, this._speed);
            this._speed = val;
        }
        createAppearance() {
            if (this._appearance) {
                return this._appearance;
            }
            this._appearance = new MaterialAppearance({
                material: new Material({
                    translucent: true,
                    fabric: {
                        uniforms: {
                            color: this._color,
                            time: 0.0,
                        },
                        source: shader
                    },
                })
            });
            return this._appearance;
        }
        update(time) {
            if (!this.material) {
                return;
            }
            const t = Cesium.JulianDate.toDate(time).getTime() / this.speed;
            this.material.uniforms.time = t - parseInt(t);
            
        }
    }

    function buildImageUrl(imageryProvider, x, y, level) {
        let url = imageryProvider.url + "&x={x}&y={y}&z={z}";
        const tileW = imageryProvider._tilingScheme.getNumberOfXTilesAtLevel(level);
        const tileH = imageryProvider._tilingScheme.getNumberOfYTilesAtLevel(level);
        const s = (Math.random() * 4)|0;
        url = url
            .replace('{s}', s)
            .replace('{x}', x - tileW / 2)
            .replace('{y}', tileH / 2 - y - 1)
            .replace('{z}', level);
        return url;
    }
    const HEIGHT = 33746824;
    const WIDTH = 33554054;
    class BaiDuLayer extends XYZLayer {
        /**
         * 创建一个使用百度地图服务的图层，可以使用百度个性化地图。
         * <p>如果可以，建议不要使用百度地图，网上可用的资料太少，服务不稳定，可用图层少，一大堆缺点</p>
         * @param {Object} options 具有Cesium.UrlTemplateImageryProvider的所有属性
         * @param {String} [options.customid] 个性化地图id
         * @extends XYZLayer
         * @see {@link http://lbsyun.baidu.com/custom/list.htm|百度个性化地图列表}
         */
        constructor(options) {
            options = defaultValue$6(options, {});
            options.url = defaultValue$6(options.url, 'http://maponline{s}.bdimg.com/tile/?qt=vtile&styles=pl&scaler=1&udt=20200102');
            if (options.customid) {
                options.url = `https://api.map.baidu.com/customimage/tile?customid=${options.customid}`;
            }
            const rectangleSouthwestInMeters = new Cesium.Cartesian2(-WIDTH, -HEIGHT);
            const rectangleNortheastInMeters = new Cesium.Cartesian2(WIDTH, HEIGHT);
            options.tilingScheme = new Cesium.WebMercatorTilingScheme({
                rectangleSouthwestInMeters: rectangleSouthwestInMeters,
                rectangleNortheastInMeters: rectangleNortheastInMeters
            });
            options.subdomains = '123';
            super(options);
            this._rectangle = this._tilingScheme.rectangle;
        }
        /**
         * 请求指定瓦片
         * @param {Number} x 瓦片x坐标
         * @param {Number} y 瓦片y坐标
         * @param {Number} level 瓦片级别
         * @param {Cesium.Request} [request]
         * @returns {Promise.<HTMLImageElement|HTMLCanvasElement>|undefined} 如果瓦片解析成功，返回一个异步Promise，解析的图像可以是 Image 或 Canvas DOM 对象，否则返回undefined
         */
        requestImage(x, y, level) {
            const url = buildImageUrl(this, x, y, level);
            return Cesium.ImageryProvider.loadImage(this, url);
        };
    }

    const {
        BingMapsImageryProvider,
        BingMapsStyle 
    } = Cesium;
    class BingLayer extends BingMapsImageryProvider {
        /**
         * 创建一个由微软地图提供的图层。与国内免费的地图相比（天地图、高德地图、百度地图等），微软地图提供了更高层级的影像，且访问速度较快。
         * @param {Object} [options] 具有以下属性。
         * @param {String} [options.mapStyle = BingLayer.mapStyle.AERIAL] 图层使用的样式
         * @param {String} [options.tileProtocol] 加载瓦片时使用的网络协议(http,https等），默认情况下使用与页面相同的协议。
         * @param {String} [options.key] 微软地图的key，可以在https://www.bingmapsportal.com/申请
         */
        constructor(options = {}) {
            options.url = 'https://dev.virtualearth.net';
            options.mapStyle = defaultValue$6(options.mapStyle, BingLayer.mapStyle.AERIAL);
            options.key = defaultValue$6(options.key, 'AqMhBWJKbBPBtoWEvtGdUii6XSkDCJ3vWFpOVWzplD-Q0J-ECUF6i8MGXpew8bkc');
            super(options);
        }
        /**
         * 可以请求的最小瓦片级别
         * @readonly
         * @type {Number}
         */
        get minimumLevel() {
            return super.minimumLevel;
        }
        /**
         * 可以请求的最大详细级别
         * @type {Number}
         * @readonly
         */
        get maximumLevel() {
            return super.maximumLevel;
        }
        /**
         * 获取影像错误时触发的事件
         * @type {Event}
         * @readonly
         */
        get errorEvent() {
            return super.errorEvent;
        }
        /**
         * 获取一个值，该值指示图层是否已准备好使用。
         * @readonly
         * @type {Boolean}
         */
        get ready() {
            return super.ready;
        }
        /**
         * 获取一个Promise，该图层准备好时将resolve
         * @readonly
         * @type {Promise<Boolean>}
         */
        get readyPromise() {
            return super.readyPromise;
        }
        /**
         * 图层的坐标系
         * @type {Cesium.TilingScheme}
         * @readonly
         */
        get tilingScheme() {
            return super.tilingScheme;
        }
        /**
         * 图层的范围
         * @type {Cesium.Rectangle}
         * @readonly
         */
        get rectangle() {
            return super.rectangle;
        }
        /**
         * 图层是否允许被pick
         * @type {Boolean}
         * @default true
         */
        get enablePickFeatures() {
            return this._tileProvider.enablePickFeatures;
        }
        set enablePickFeatures(val) {
            this._tileProvider.enablePickFeatures = val;
        }
        /**
         * 确定哪些要素（如果有）位于图块内的给定经度和纬度。在{@link Cesium.ImageryProvider#ready}返回 true之前不应调用此函数。
         * 在数据图层ready之前，该函数不能被调用
         *
         * @param {Number} x 瓦片的x坐标。
         * @param {Number} y 瓦片的y坐标。
         * @param {Number} level 瓦片的层级。
         * @param {Number} longitude 选择要素的经度。
         * @param {Number} latitude  选择要素的纬度
         * @return {Promise.<Cesium.ImageryLayerFeatureInfo[]>|undefined} 
         */
        pickFeatures(x, y, level, longitude, latitude) {
            return super.pickFeatures(x, y, level, longitude, latitude);
        }
        /**
         * 请求指定瓦片
         * @param {Number} x 瓦片x坐标
         * @param {Number} y 瓦片y坐标
         * @param {Number} level 瓦片级别
         * @param {Cesium.Request} [request]
         * @returns {Promise.<HTMLImageElement|HTMLCanvasElement>|undefined} 如果瓦片解析成功，返回一个异步Promise，解析的图像可以是 Image 或 Canvas DOM 对象，否则返回undefined
         */
        requestImage(x, y, level, request) {
            return super.requestImage(x, y, level, request)
        }
        /**
         * 将图块（x、y、level）位置转换为用于从 Bing 地图服务器请求图像的key
         * @param {Number} x 行号
         * @param {Number} y 列号
         * @param {Number} level 层级
         */
        static tileXYToQuadKey(x, y, level) {
            return BingMapsImageryProvider.tileXYToQuadKey(x, y, level);
        }
        /**
         * 将用于从 Bing 地图服务器请求图像的图块的key转换为 (x, y, level) 位置。
         * @param {String} quadkey 
         */
        static quadKeyToTileXY(quadkey) {
            return BingMapsImageryProvider.quadKeyToTileXY(quadkey)
        }
        /**
         * Bing图层的可用样式
         * <code>
         * <ul>
         *  <li>AERIAL：卫星影像</li>
         *  <li>AERIAL_WITH_LABELS：带有道路的卫星影像<li>
         *  <li>AERIAL_WITH_LABELS_ON_DEMAND：带有道路的卫星影像</li>
         *  <li>ROAD: 路网</i>
         *  <li>CANVAS_DARK: 暗黑风格的路网</i>
         *  <li>CANVAS_LIGHT: 明亮风格的路网</i>
         *  <li>CANVAS_GRAY: 黑白地图</i>
         * </ul>
         * </code>
         * @memberof BingLayer
         * @static
         * @type {Object}
         */
        static mapStyle = BingMapsStyle;
    }

    class GaoDeLayer extends XYZLayer {
        /**
         * 创建一个使用高德地图服务的图层。
         * @param {Object} options 具有以下属性
         * @param {String} [options.layer='img'] 图层，具有以下有效值：
         * <ul>
         *   <li><code>img</code>: 影像地图</li>
         *   <li><code>vec</code>: 矢量地图</li>
         *   <li><code>vei</code>: 矢量地图（含注记）</li>
         *   <li><code>roi</code>: 路网地图（含注记）</li>
         *   <li><code>roa</code>: 路网地图</li>
         * </ul>
         * @extends XYZLayer
         * 
         * @see {@link https://cesium.com/docs/cesiumjs-ref-doc/UrlTemplateImageryProvider.html?classFilter=UrlTemplateImageryProvider|Cesium.UrlTemplateImageryProvider}
         * @see {@link https://blog.csdn.net/fredricen/article/details/77189453}
         * @example
         * //1.添加默认图层(img)
         * const img=new CesiumPro.GaoDeLayer();
         * viewer.imageryLayers.addImageryProvider(img);
         * //2.添加矢量图层
         * const vec=new CesiumPro.GaoDeLayer({
         *   layer:'vec'
         * });
         * viewer.imageryLayers.addImageryProvider(vec);
         * //3.添加带注记和路网的矢量图层
         * const vei=new CesiumPro.GaoDeLayer({
         *   layer:'vei'
         * });
         * viewer.imageryLayers.addImageryProvider(vei);
         * //4.添加带注记和路网的影像
         * //高德没有提供带注记和路网的影像图层
         * //需要同时添加影像图层和路网图层
         * const img=new CesiumPro.GaoDeLayer({
         *   layer:'img'
         * });
         * const road=new CesiumPro.GaoDeLayer({
         *   layer:'roi'
         * });
         * viewer.imageryLayers.addImageryProvider(img);
         * viewer.imageryLayers.addImageryProvider(roi);
         *
         */
        constructor(options) {
            options = defaultValue$6(options, {});

            const layer = defaultValue$6(options.layer, 'img');
            const {
                scl,
                style
            } = GaoDeLayer.getParametersByLayer(layer);
            const lang = defaultValue$6(options.lang, 'zh_cn');
            options.url = `https://webst0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=${lang}&size=1&scl=${scl}&style=${style}`;
            options.subdomains = '1234';
            super(options);
        }
        /**
         * 高德提供的所有可用图层
         * @memberof GaoDeLayer
         * @constant
         * @type {Array}
         */
        static layers = [{
            layer: 'img',
            desc: '影像地图'
        }, {
            layer: 'vec',
            desc: '矢量地图'
        }, {
            layer: 'vei',
            desc: '矢量地图（含注记）'
        }, {
            layer: 'roa',
            desc: '路网地图'
        },
        {
            layer: 'roi',
            desc: '路网地图（含注记）'
        }
        ]

        static getParametersByLayer(layer) {
            let params = {
                scl: 1,
                style: 6
            };
            switch (layer) {
                case 'img':
                    break;
                case 'vec':
                    params.scl = 2;
                    params.style = 7;
                    break;
                case 'vei':
                    params.scl = 1;
                    params.style = 7;
                    break;
                case 'roa':
                    params.scl = 2;
                    params.style = 8;
                    break;
                case 'roi':
                    params.scl = 1;
                    params.style = 8;
                    break;
            }
            return params;
        }
    }

    class LonLatNetLayer {
        /**
         * 创建一个提供经纬网的图层。
         * @param {Object} [options] 具有以下属性。
         * @param {String} [options.font='bold 24px sans-serif'] 字体
         * @param {String} [options.color = 'white'] 文字颜色
         * @param {String} [options.borderColor = 'gold'] 边框颜色
         * @param {String} [options.borderWidth = 2] 边框宽度
         * @param {Number} [options.intervalOfZeorLevel=16] 0级两条线之间的度数
         * @param {Boolean} [options.hasAlphaChannel=true] 是否有alpha通道
         */
        constructor(options = {}) {
            const tilingScheme = new LonlatTilingScheme({
                rectangle: Cesium.Rectangle.MAX_VALUE,
                intervalOfZeorLevel: options.intervalOfZeorLevel
            });
            this._hasAlphaChannel = defaultValue$6(options.hasAlphaChannel, true);
            this._tilingScheme = tilingScheme;
            this._image = undefined;
            this._texture = undefined;

            this._errorEvent = new Event$7();

            this._ready = true;
            this._readyPromise = Cesium.when.defer();
            this._readyPromise.resolve(true);

            this._font = defaultValue$6(options.font, 'bold 24px sans-serif');
            this._color = defaultValue$6(options.color, 'white');
            this._borderColor = defaultValue$6(options.borderColor, 'gold');
            this._borderWidth = defaultValue$6(options.borderWidth, 2);
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.canvas.width = 256;
            this.canvas.height = 256;
            this.ctx.textBaseline = 'middle';
        }
        get hasAlphaChannel() {
            return this._hasAlphaChannel;
        }
        get tileHeight() {
            return 256;
        }
        get tileWidth() {
            return 256;
        }
        get minimumLevel() {
            return 0;
        }
        get maximumLevel() {
            return 4;
        }
        get rectangle() {
            return Cesium.Rectangle.MAX_VALUE;
        }
        get errorEvent() {
            return this._errorEvent;
        }
        get tileDiscardPolicy() {
            return undefined;
        }
        get readyPromise() {
            return this._readyPromise;
        }
        get ready() {
            return true;
        }
        /**
         * 图层的坐标系
         * @type {Cesium.TilingScheme}
         * @readonly
         */
        get tilingScheme() {
            return this._tilingScheme;
        }
        /**
         * 获得或设置字体
         * @type {String}
         */
        get font() {
            return this._font;
        }
        set font(val) {
            this._font = val;
        }
        /**
         * 获得或设置文字颜色
         * @type {String}
         */
        get color() {
            return this._color;
        }
        set color(val) {
            this._color = val;
        }
        /**
         * 获得或设置边框颜色
         * @type {String}
         */
        get borderColor() {
            return this._borderColor;
        }
        set borderColor(val) {
            this._borderColor = val;
        }
        /**
         * 获得或设置边框宽度
         * @type {Number}
         */
        get borderWidth() {
            return this._borderWidth
        }
        _resetStyle() {
            // this.ctx.textAlign = 'left';
            this.ctx.font = this.font;
            this.ctx.fillStyle = this.color;
            this.ctx.strokeStyle = this.borderColor;
            this.ctx.lineWidth = this.borderWidth;
        }
        _clearCanvas() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        getOffset(left, top, level) {
            const delta = this.tilingScheme.getDelatXY(level);
            const validValueX = Math.floor(left);
            const validValueY = Math.floor(top);
            if (validValueX === left && validValueY === top) {
                return [0, 0, validValueX, validValueY]
            }
            const modX = left - validValueX;
            const modY = top - validValueY;
            let x = 0, y = 0;
            if (modX) {
                x = this.tileWidth / delta.dx * modX;
            }
            if(modY) {
                y = this.tileHeight / delta.dy * modY;
            }
            return [x, y, validValueX, validValueY]
        }
        requestImage(x, y, level, request) {
            this._clearCanvas();
            this._resetStyle();
            const { canvas, ctx } = this;
            const value = this.tilingScheme.getLonLatValuee(level, x, y);
            this.tilingScheme.tileXYToNativeRectangle(x, y, level);
            this.ctx.textAlign = 'left';
            ctx.fillText(value.lon, 10, canvas.height / 2);
            this.ctx.textAlign = 'center';
            ctx.fillText(value.lat, canvas.width / 2, 20);
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
            return canvas;
        }

    }

    function PbfDataSource() {

    }

    const {WebMapTileServiceImageryProvider} = Cesium;
    class WMTSLayer extends WebMapTileServiceImageryProvider {
        /**
         * 创建一个从WMTS服务请求数据的图层。
         *
         * 
         * @param {Object} options 具有以下属性
         * @param {Resource|String} options.url WMTS服务GetTile需要的URL或着tile-URL模板. 如果是tile-URL模板m该URL应该包含以下关键字：
         * <ul>
         *  <li><code>{style}</code>: 样式</li>
         *  <li><code>{TileMatrixSet}</code>: tile数据集</li>
         *  <li><code>{TileMatrix}</code>:代表瓦片的级别</li>
         *  <li><code>{TileRow}</code>: 瓦片行号</li>
         *  <li><code>{TileCol}</code>: 瓦片列号</li>
         *  <li><code>{s}</code>: 子域名</li>
         * </ul>
         * @extends Cesium.WebMapTileServiceImageryProvider
         * @param {String} [options.format='image/jpeg'] 瓦片格式(MIME type)。
         * @param {String} options.layer 服务所提供的图层名.
         * @param {String} options.style 样式名.
         * @param {String} options.tileMatrixSetID 用于 WMTS 请求的 TileMatrixSet 的标识符。
         * @param {Array} [options.tileMatrixLabels] TileMatrix 中用于 WMTS 请求的标识符列表。
         * @param {Clock} [options.clock] 在确定时间维度的值时使用的 Clock 实例。
         * @param {TimeIntervalCollection} [options.times] TimeIntervalCollection 其data属性是一个包含时间动态维度及其值的对象。
         * @param {Object} [options.dimensions] 包含静态尺寸及其值的对象。
         * @param {Number} [options.tileWidth=256] 瓦片宽度。
         * @param {Number} [options.tileHeight=256] 瓦片高度。
         * @param {TilingScheme} [options.tilingScheme] 坐标系
         * @param {Rectangle} [options.rectangle=Cesium.Rectangle.MAX_VALUE] 该地图的覆盖范围。
         * @param {Number} [options.minimumLevel=0] 最小级别。
         * @param {Number} [options.maximumLevel] 最大级别。
         * @param {Credit|String} [options.credit] 版权信息
         * @param {String|String[]} [options.subdomains='abc'] {s}中可用的子域名。
         *
         
         *
         * Provides tiled imagery served by {@link http://www.opengeospatial.org/standards/wmts|WMTS 1.0.0} compliant servers.
         * This provider supports HTTP KVP-encoded and RESTful GetTile requests, but does not yet support the SOAP encoding.
         *
         * @example
         * // Example 1. USGS shaded relief tiles (KVP)
         * var shadedRelief1 = new CesiumPro.WMTSLayer({
         *     url : 'http://basemap.nationalmap.gov/arcgis/rest/services/USGSShadedReliefOnly/MapServer/WMTS',
         *     layer : 'USGSShadedReliefOnly',
         *     style : 'default',
         *     format : 'image/jpeg',
         *     tileMatrixSetID : 'default028mm',
         *     // tileMatrixLabels : ['default028mm:0', 'default028mm:1', 'default028mm:2' ...],
         *     maximumLevel: 19,
         *     credit : new Cesium.Credit('U. S. Geological Survey')
         * });
         * viewer.imageryLayers.addImageryProvider(shadedRelief1);
         *
         * @example
         * // Example 2. USGS shaded relief tiles (RESTful)
         * var shadedRelief2 = new CesiumPro.WMTSLayer({
         *     url : 'http://basemap.nationalmap.gov/arcgis/rest/services/USGSShadedReliefOnly/MapServer/WMTS/tile/1.0.0/USGSShadedReliefOnly/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg',
         *     layer : 'USGSShadedReliefOnly',
         *     style : 'default',
         *     format : 'image/jpeg',
         *     tileMatrixSetID : 'default028mm',
         *     maximumLevel: 19,
         *     credit : new Cesium.Credit('U. S. Geological Survey')
         * });
         * viewer.addLayer(shadedRelief2);
         *
         * @example
         * // Example 3. NASA time dynamic weather data (RESTful)
         * var times = Cesium.TimeIntervalCollection.fromIso8601({
         *     iso8601: '2015-07-30/2017-06-16/P1D',
         *     dataCallback: function dataCallback(interval, index) {
         *         return {
         *             Time: Cesium.JulianDate.toIso8601(interval.start)
         *         };
         *     }
         * });
         * var weather = new CesiumPro.WMTSLayer({
         *     url : 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/AMSR2_Snow_Water_Equivalent/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png',
         *     layer : 'AMSR2_Snow_Water_Equivalent',
         *     style : 'default',
         *     tileMatrixSetID : '2km',
         *     maximumLevel : 5,
         *     format : 'image/png',
         *     clock: clock,
         *     times: times,
         *     credit : new Cesium.Credit('NASA Global Imagery Browse Services for EOSDIS')
         * });
         * viewer.addLayer(weather);
         * const geoserverWMTS = new WMTSLayer({
         *       url: 'http://localhost:8080/geoserver/gwc/service/wmts',
         *       layer: 'topp:states',
         *       format: 'image/png',
         *       tileMatrixSetID: 'EPSG:4326',
         *       tileMatrixLabels: ['EPSG:4326:0','EPSG:4326:1','EPSG:4326:2', 'EPSG:4326:3', 'EPSG:4326:4'],
         *       style: '',
         *       tileWidth:700,
         *       tileHeight:300,
         *       tilingScheme:proj.get('EPSG:4326')
         * })
         * viewer.addLayer(geoserverWMTS)
         */
        constructor(options = {}) {
            super(options);
        }
        /**
         * 获取或设置一个包含静态维度及其值的对象。
         * @type {Object}
         */
        get dimensions() {
            return super.dimensions;
        }
        set dimensions(val) {
            super.dimensions = val;
        }
        /**
         * 可以请求的最小瓦片级别
         * @readonly
         * @type {Number}
         */
        get minimumLevel() {
            return super.minimumLevel;
        }
        /**
         * 可以请求的最大详细级别
         * @type {Number}
         * @readonly
         */
        get maximumLevel() {
            return super.maximumLevel;
        }
        /**
         * 获取影像错误时触发的事件
         * @type {Event}
         * @readonly
         */
        get errorEvent() {
            return super.errorEvent;
        }
        /**
         * 获取一个值，该值指示图层是否已准备好使用。
         * @readonly
         * @type {Boolean}
         */
         get ready() {
            return super.ready;
        }
        /**
         * 获取一个Promise，该图层准备好时将resolve
         * @readonly
         * @type {Promise<Boolean>}
         */
        get readyPromise() {
            return super.readyPromise;
        }
        /**
         * 图层的坐标系
         * @type {Cesium.TilingScheme}
         * @readonly
         */
        get tilingScheme() {
            return super.tilingScheme;
        }
        /**
         * 图层的范围
         * @type {Cesium.Rectangle}
         * @readonly
         */
         get rectangle() {
            return super.rectangle;
        }
        /**
         * 图层是否允许被pick
         * @type {Boolean}
         * @default true
         */
         get enablePickFeatures() {
            return this._tileProvider.enablePickFeatures;
        }
        set enablePickFeatures(val) {
            this._tileProvider.enablePickFeatures = val;
        }
        /**
         * 确定哪些要素（如果有）位于图块内的给定经度和纬度。在{@link Cesium.ImageryProvider#ready}返回 true之前不应调用此函数。
         * 在数据图层ready之前，该函数不能被调用
         *
         * @param {Number} x 瓦片的x坐标。
         * @param {Number} y 瓦片的y坐标。
         * @param {Number} level 瓦片的层级。
         * @param {Number} longitude 选择要素的经度。
         * @param {Number} latitude  选择要素的纬度
         * @return {Promise.<Cesium.ImageryLayerFeatureInfo[]>|undefined} 
         */
        pickFeatures(x, y, level, longitude, latitude) {
            return super.pickFeatures(x, y, level, longitude, latitude);
        }
        /**
         * 请求指定瓦片
         * @param {Number} x 瓦片x坐标
         * @param {Number} y 瓦片y坐标
         * @param {Number} level 瓦片级别
         * @param {Cesium.Request} [request]
         * @returns {Promise.<HTMLImageElement|HTMLCanvasElement>|undefined} 如果瓦片解析成功，返回一个异步Promise，解析的图像可以是 Image 或 Canvas DOM 对象，否则返回undefined
         */
        requestImage(x, y, level, request) {
            return super.requestImage(x, y, level, request)
        }
    }

    class TDTLayer extends WMTSLayer {
      /**
       * 创建一个使用天地图服务的图层。
       * @see {@link http://lbs.tianditu.gov.cn/server/MapService.html|申请天地图key}
       * @see {@link WMTSLayer}
       * @extends WMTSLayer
       * @param {Object} options 具有以下属性
       * @param {String} options.key 天地图私key
       * @param {Cesium.TilingScheme} [options.tilingScheme=new Cesium.WebMercatorTilingScheme()] 坐标系
       * @param {String} [options.layer='img'] 图层,有效值如下
       * <ul>
       *    <li>vec: 矢量底图</li>
       *    <li>cva: 矢量注记</li>
       *    <li>img: 影像底图</li>
       *    <li>cia: 影像注记</li>
       *    <li>ter: 地形晕渲</li>
       *    <li>cta: 地形注记</li>
       *    <li>ibo: 全球境界</li>
       *    <li>eva: 矢量英文注记</li>
       *    <li>eia: 影像英文注记</li>
       * </ul>
       * @param {String} [options.style='default'] 地图样式
       * @param {Number} [options.maximumLevel=19] 地图最大级别
       * @param {Number} [options.minimumLevel=0] 地图最小级别
       * @param {Array} [options.tileMatrixLabels] TileMatrix中用于WMTS请求的标识符列表，每个TileMatrix级别对应一个label。
       *
       * @example
       * //1.默认参数为墨卡托投影的img图层
       * const img = new CesiumPro.TDTLayer({
       *   key: "ac7f26daf5b1a54c746e93a414dd9c**"
       * });
       * viewer.addLayer(img);
       * //2.添加经纬度投影的矢量图层
       * const vec=new CesiumPro.TDTLayer({
       *   key: "ac7f26daf5b1a54c746e93a414dd9c**",
       *   layer:'vec',
       *   tilingScheme: new Cesium.GeographicTilingScheme()
       * });
       * viewer.addLayer(vec);
       *
       */
      constructor(options) {
        options = defaultValue$6(options, {});
        const key = options.key;
        if (!key) {
          console.warn('未定义key，地图服务将不可用');
          console.warn('请前往http://lbs.tianditu.gov.cn/server/MapService.html获取地图key');
        }
        const tilingScheme = defaultValue$6(options.tilingScheme, new Cesium.WebMercatorTilingScheme());
        let crs = 'w',
          tileMatrixSet = 'w',
          tileMatrixLabels = options.tileMatrixLabels;
        if (tilingScheme instanceof Cesium.GeographicTilingScheme) {
          crs = 'c';
          tileMatrixSet = 'c';
          if (!defined$8(tileMatrixLabels)) {
            tileMatrixLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];
          }
        }
        const layer = defaultValue$6(options.layer, 'img');
        const url = `http://t{s}.tianditu.com/${layer}_${crs}/wmts?service=wmts&tileMatrixSet=${tileMatrixSet}&request=GetTile&version=1.0.0&LAYER=${layer}&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${key}`;
        return new Cesium.WebMapTileServiceImageryProvider({
          url,
          layer,
          style: options.style || 'default',
          format: options.format || 'tiles',
          tileMatrixSetID: 'GoogleMapsCompatible',
          credit: options.credit?new Cesium.Credit(options.credit || ''):null,
          // subdomains: options.subdomains || ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
          tilingScheme: options.tilingScheme,
          maximumLevel: options.maximumLevel || 19,
          minimumLevel: options.minimumLevel || 0,
          tileMatrixLabels,
          subdomains:'01234567'
        })
      }
      /**
       * 天地图提供的可用图层及其描述
       * <ul>
       *  <li>vec: 矢量底图</li>
       *  <li>cva: 矢量注记</li>
       *  <li>img: 影像底图</li>
       *  <li>cia: 影像注记</li>
       *  <li>ter: 地形晕渲</li>
       *  <li>cta: 地形注记</li>
       *  <li>ibo: 全球境界</li>
       *  <li>eva: 矢量英文注记</li>
       *  <li>eia: 影像英文注记</li>
       * </ul>
       * @memberof TDTLayer
       * @constant
       * @type {Object}
       */
      static layers = [{
          layer: "vec",
          desc: "矢量底图"
        },
        {
          layer: "cva",
          desc: "矢量注记"
        }, {
          layer: "img",
          desc: "影像底图"
        }, {
          layer: "cia",
          desc: "影像注记"
        }, {
          layer: "ter",
          desc: "地形晕渲"
        }, {
          layer: "cta",
          desc: "地形注记"
        }, {
          layer: "ibo",
          desc: "全球境界"
        }, {
          layer: "eva",
          desc: "矢量英文注记"
        }, {
          layer: "eia",
          desc: "影像英文注记"
        }
      ]
    }

    const layerMap = {
        map: 'https://rt{s}.map.gtimg.com/tile?z={z}&x={x}&y={reverseY}&styleid=1&version=297',
        road: 'https://rt{s}.map.gtimg.com/tile?z={z}&x={x}&y={reverseY}&styleid=2&version=297',
        img: 'https://p{s}.map.gtimg.com/sateTiles/{z}/{sx}/{sy}/{x}_{reverseY}.jpg?version=229'
    };
    class TecentLayer extends XYZLayer{
        /**
         * 创建一个使用腾讯地图服务的图层。
         * @param {*} options 具有以下属性
         * @param {String}  [options.layer = 'img'] 图层名，有效值包括img、map、road
         * 
         * @extends XYZLayer
         */
        constructor(options = {}) {
            options.layer = defaultValue$6(options.layer, 'img');
            options.subdomains = '123';
            options.url = layerMap[options.layer];
            options.customTags = {
                sx: function (imageryProvider, x, y, level) {
                    return x >> 4;
                },
                sy: function (imageryProvider, x, y, level) {
                    return ((1 << level) - y) >> 4;
                }
            };
            super(options);
        }
    }

    function buildText(imageryProvider, x, y, level) {
        let text = [];
        text[0] = 'L: ' + level;
        text[1] = 'X: ' + x;
        if (imageryProvider.reverseY) {
            text[2] = 'Y: ' + imageryProvider.tilingScheme.getNumberOfYTilesAtLevel(level) - y - 1;    } else {
            text[2] = 'Y: ' + y;
        }
        return text;
    }
    class TileDebugLayer {
        /**
         * 根据给定参数显示瓦片行列号，仅用于调试。
         * @param {Object} options 具有以下属性。
         * @param {String} [options.font='bold 24px sans-serif'] 字体
         * @param {String} [options.color = Cesium.Color.WHITE] 文字颜色
         * @param {String} [options.borderColor = Cesium.Color.GOLD] 边框颜色
         * @param {String} [options.borderWidth = 2] 边框宽度
         * @param {String} [options.reverseY=false] 是否翻转Y轴
         * @param {Cesium.TilingScheme} [options.tilingScheme = proj.get('EPSG:4326')] 瓦片分割坐标系
         */
        constructor(options = {}) {
            options.tileWidth = defaultValue$6(options.tileWidth, 256);
            options.tileHeight = defaultValue$6(options.tileHeight, 256);
            this._tilingScheme = defined$8(options.tilingScheme)
                ? options.tilingScheme
                : proj.get('EPSG:4326', { ellipsoid: options.ellipsoid });
            this._errorEvent = new Event$7();
            this._tileWidth = defaultValue$6(options.tileWidth, 256);
            this._tileHeight = defaultValue$6(options.tileHeight, 256);
            this._readyPromise = Cesium.when.resolve(true);

            this._font = defaultValue$6(options.font, 'bold 24px sans-serif');
            this._color = defaultValue$6(options.color, new Cesium.Color(1,1,1,1));
            this._borderColor = defaultValue$6(options.borderColor, Cesium.Color.GOLD);
            this._borderWidth = defaultValue$6(options.borderWidth, 2);    
        }
        /**
         * 表示图层是否已准备完成。
         * @type {Boolean}
         * @readonly
         */
        get ready() {
            return true;
        }
        /**
         * 返回一个Promise表示图层是否已准备完成。
         * @type {Promise<Boolean>}
         * @readonly
         */
        get readyPromise() {
            return this._readyPromise;
        }
        /**
         * 图层是否具有alpha通道
         * @type {Boolean}
         * @readonly
         */
        get hasAlphaChannel() {
            return true;
        }
        /**
         * 图层发生错误是触发的事件。
         * @type {Event}
         * @readonly
         */
        get errorEvent() {
            return this._errorEvent;
        }
        /**
         * 图层的范围
         * @readonly
         * @type {Cesium.Rectangle}
         */
        get rectangle() {
            return this._tilingScheme.rectangle;
        }
        /**
         * 瓦片宽度
         * @type {Number}
         * @readonly
         */
        get tileWidth() {
            return this._tileWidth;
        }
        /**
         * 瓦片高度
         * @type {Number}
         * @readonly
         */
        get tileHeight() {
            return this._tileHeight;
        }
        /**
         * 图层的坐标系
         * @type {Cesium.TilingScheme}
         * @readonly
         */
        get tilingScheme() {
            return this._tilingScheme;
        }
        /**
         * 获得或设置字体
         * @type {String}
         */
        get font() {
            return this._font;
        }
        set font(val) {
            this._font = val;
        }
        /**
         * 获得或设置文字颜色
         * @type {String}
         */
        get color() {
            return this._color;
        }
        set color(val) {
            this._color = val;
        }
        /**
         * 获得或设置边框颜色
         * @type {String}
         */
        get borderColor() {
            return this._borderColor;
        }
        set borderColor(val) {
            this._borderColor = val;
        }
        /**
         * 获得或设置边框宽度
         * @type {Number}
         */
        get borderWidth() {
            return this._borderWidth
        }
        /**
         * @private
         */
        createCanvas() {
            const canvas = document.createElement('canvas');
            canvas.width = this.tileWidth;
            canvas.height = this.tileHeight;
            const ctx = canvas.getContext('2d');
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.font = this.font;
            ctx.fillStyle = this.color.toCssColorString();
            ctx.strokeStyle = this.borderColor.toCssColorString();
            ctx.lineWidth = this.borderWidth;
            return {canvas, ctx}
        }
        /**
         * 请求指定瓦片
         * @param {Number} x 瓦片x坐标
         * @param {Number} y 瓦片y坐标
         * @param {Number} level 瓦片级别
         * @param {Cesium.Request} [request]
         * @returns {Promise.<HTMLImageElement|HTMLCanvasElement>|undefined} 如果瓦片解析成功，返回一个异步Promise，解析的图像可以是 Image 或 Canvas DOM 对象，否则返回undefined
         */
        requestImage(x, y, level, request) {
            const { canvas, ctx } = this.createCanvas();
            const value = buildText(this, x, y, level);
            ctx.fillText(value[0], canvas.width / 2, canvas.height / 4 * 1);
            ctx.fillText(value[1], canvas.width / 2, canvas.height / 4 * 2);
            ctx.fillText(value[2], canvas.width / 2, canvas.height / 4 * 3);
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
            return canvas;
        }

    }

    const {
        when: when$2,
        Rectangle
    } = Cesium;
    class TileLayer {
        /**
         * 创建一个从WMS服务请求数据的图层。
         * @param {*} options 具有以下属性
         * @param {Boolean} [options.enablePickFeatures=true] 图层是否允许被pick {@link TileLayer#pickFeatures}
         * @param {Rectangle} [options.rectangle=Cesium.Rectangle.MAX_VALUE] 图层的范围。
         * @param {Number} [options.tileWidth=256] 瓦片宽度
         * @param {Number} [options.tileHeight=256] 瓦片高度
         * @param {Number} [options.minimumLevel=0] 最小层级
         * @param {Number} [options.maximumLevel] 最大层级
         * 
         * @example 
         * var provider = new Cesium.WebMapServiceImageryProvider({
         *   url : 'https://sampleserver1.arcgisonline.com/ArcGIS/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer/WMSServer',
         *   layers : '0',
         *   proxy: new Cesium.DefaultProxy('/proxy/')
         * });
         *
         * viewer.addLayer(provider);
         */
        constructor(options = {}) {
            this._errorEvent = new Event$7();
            this._tilingScheme = proj.get('EPSG:4326');
            this._readyPromise = when$2.defer();
            this._ready = false;
            this._ready = true;
            this._minimumLevel = defaultValue$6(options.minimumLevel, 0);
            this._maximumLevel = options.maximumLevel;
            this._tileWidth = defaultValue$6(options.tileWidth, 256);
            this._tileHeight = defaultValue$6(options.tileHeight, 256);
            this._rectangle = defaultValue$6(options.rectangle, Rectangle.MAX_VALUE);
            this._readyPromise.resolve(true);
            this._errorEvent.addEventListener((x, y, z) => {
                // 主要是为了不让TileProviderError.handleError打印错误
            });
        }
        /**
         * 可以请求的最小瓦片级别
         * @readonly
         * @type {Number}
         */
        get minimumLevel() {
            return this._minimumLevel;
        }
        /**
         * 可以请求的最大详细级别
         * @type {Number}
         * @readonly
         */
        get maximumLevel() {
            return this._maximumLevel;
        }
        /**
         * 获取影像错误时触发的事件
         * @type {Event}
         * @readonly
         */
        get errorEvent() {
            return this._errorEvent;
        }
        /**
         * 图层的范围
         * @type {Cesium.Rectangle}
         * @readonly
         */
        get rectangle() {
            return this._rectangle;
        }
        /**
         * 获取一个值，该值指示图层是否已准备好使用。
         * @readonly
         * @type {Boolean}
         */
        get ready() {
            return this._ready;
        }
        /**
         * 获取一个Promise，该图层准备好时将resolve
         * @readonly
         * @type {Promise<Boolean>}
         */
        get readyPromise() {
            return this._readyPromise;
        }
        /**
         * 图层的坐标系
         * @type {Cesium.TilingScheme}
         * @readonly
         */
        get tilingScheme() {
            return this._tilingScheme;
        }
        /**
         * 图层是否允许被pick
         * @type {Boolean}
         * @default true
         */
        get enablePickFeatures() {
            return this._tileProvider.enablePickFeatures;
        }
        set enablePickFeatures(val) {
            this._tileProvider.enablePickFeatures = val;
        }
        get tileHeight() {
            return this._tileHeight;
        }
        get tileWidth() {
            return this._tileWidth;
        }
        /**
         * 确定哪些要素（如果有）位于图块内的给定经度和纬度。在{@link Cesium.ImageryProvider#ready}返回 true之前不应调用此函数。
         * 在数据图层ready之前，该函数不能被调用
         *
         * @param {Number} x 瓦片的x坐标。
         * @param {Number} y 瓦片的y坐标。
         * @param {Number} level 瓦片的层级。
         * @param {Number} longitude 选择要素的经度。
         * @param {Number} latitude  选择要素的纬度
         * @return {Promise.<Cesium.ImageryLayerFeatureInfo[]>|undefined} 
         */
        pickFeatures(x, y, level, longitude, latitude) {

        }
        /**
         * 请求指定瓦片
         * @param {Number} x 瓦片x坐标
         * @param {Number} y 瓦片y坐标
         * @param {Number} level 瓦片级别
         * @param {Cesium.Request} [request]
         * @returns {Promise.<HTMLImageElement|HTMLCanvasElement>|undefined} 如果瓦片解析成功，返回一个异步Promise，解析的图像可以是 Image 或 Canvas DOM 对象，否则返回undefined
         */
        requestImage(x, y, level, request) {
            this.requestGeometry(x, y, level);
            return Promise.reject(false);
        }
        requestGeometry(x, y, level) {
             
        }
    }

    class TMSLayer extends Cesium.TileMapServiceImageryProvider {
        /**
         * 创建一个从TMS服务请求数据的图层。
         * @extends Cesium.TileMapServiceImageryProvider
         * @param {Promise.<Object>|Object} options 具有以下属性
         * @param {Resource|String} options.url  TMS服务地址或，瓦片的url模板，如果是url模板，它支持以下关键字:
         * <ul>
         *     <li><code>{z}</code>: 瓦片的层级，第一层为0级</li>
         *     <li><code>{x}</code>: 切片方案中X的坐标，最左边为0</li>
         *     <li><code>{y}</code>: 切片方案中Y的坐标，最上边为0</li>
         *     <li><code>{s}</code>: 子域名</li>
         *     <li><code>{reverseX}</code>: 切片方案中X的坐标，最右边为0</li>
         *     <li><code>{reverseY}</code>: 切片方案中Y的坐标，最下边为0</li>
         *     <li><code>{reverseZ}</code>: 瓦片的层级，最大层级为0</li>
         *     <li><code>{westDegrees}</code>: 瓦片最左边的坐标，单位度</li>
         *     <li><code>{southDegrees}</code>: 瓦片最下边的坐标，单位度</li>
         *     <li><code>{eastDegrees}</code>: 瓦片最右边的坐标，单位度</li>
         *     <li><code>{northDegrees}</code>: 瓦片最上边的坐标，单位度</li>
         *     <li><code>{westProjected}</code>: 瓦片最左边的坐标，单位米</li>
         *     <li><code>{southProjected}</code>: 瓦片最下边的坐标，单位米</li>
         *     <li><code>{eastProjected}</code>: 瓦片最右边的坐标，单位米</li>
         *     <li><code>{northProjected}</code>: 瓦片最上边的坐标，单位米</li>
         *     <li><code>{width}</code>: 瓦片宽度，单位像素</li>
         *     <li><code>{height}</code>: 瓦片高度，单位像素</li>
         * </ul>
         * @param {String} [options.fileExtension='png'] 图像的扩展名
         * @param {Credit|String} [options.credit=''] 数据源的版权信息.
         * @param {Number} [options.minimumLevel=0] 图层支持的最低细节级别。在指定最小级别的瓦片数量很少时要小心，较大的数字可能会导致渲染问题。
         * @param {Number} [options.maximumLevel] 图层支持的最大细节级别，如果未定义，则无限制。
         * @param {Rectangle} [options.rectangle=Cesium.Rectangle.MAX_VALUE] 瓦片覆盖范围，单位弧度。
         * @param {TilingScheme} [options.tilingScheme=Cesium.WebMercatorTilingScheme] 图层的坐标系，默认为墨卡托投影。
         * @param {Number} [options.tileWidth=256] 瓦片宽度。
         * @param {Number} [options.tileHeight=256] 瓦片高度。
         * @param {Boolean} [options.flipXY] 是否翻转了XY轴
         * 
         * @example
         *const layer = new TMSLayer({
         *   url: 'http://localhost:8080/geoserver/gwc/service/tms/1.0.0/topp%3Astates@EPSG%3A4326@png',
         *   tilingScheme: proj.get('EPSG:4326')
         * }   
         */
        constructor(options) {
            super(options);
        }
        /**
         * 获取用于瓦片请求的URL，具有以下关键字：
         * <ul>
         *     <li><code>{z}</code>: 瓦片的层级，第一层为0级</li>
         *     <li><code>{x}</code>: 切片方案中X的坐标，最左边为0</li>
         *     <li><code>{y}</code>: 切片方案中Y的坐标，最上边为0</li>
         *     <li><code>{s}</code>: 子域名</li>
         *     <li><code>{reverseX}</code>: 切片方案中X的坐标，最右边为0</li>
         *     <li><code>{reverseY}</code>: 切片方案中Y的坐标，最下边为0</li>
         *     <li><code>{reverseZ}</code>: 瓦片的层级，最大层级为0</li>
         *     <li><code>{westDegrees}</code>: 瓦片最左边的坐标，单位度</li>
         *     <li><code>{southDegrees}</code>: 瓦片最下边的坐标，单位度</li>
         *     <li><code>{eastDegrees}</code>: 瓦片最右边的坐标，单位度</li>
         *     <li><code>{northDegrees}</code>: 瓦片最上边的坐标，单位度</li>
         *     <li><code>{westProjected}</code>: 瓦片最左边的坐标，单位米</li>
         *     <li><code>{southProjected}</code>: 瓦片最下边的坐标，单位米</li>
         *     <li><code>{eastProjected}</code>: 瓦片最右边的坐标，单位米</li>
         *     <li><code>{northProjected}</code>: 瓦片最上边的坐标，单位米</li>
         *     <li><code>{width}</code>: 瓦片宽度，单位像素</li>
         *     <li><code>{height}</code>: 瓦片高度，单位像素</li>
         * </ul>
         * @readonly
         * @returns {String} 获取用于瓦片请求的URL
         */
        get url() {
            return super.url;
        }
        /**
         * 可以请求的最小瓦片级别
         * @readonly
         * @type {Number}
         */
         get minimumLevel() {
            return super.minimumLevel;
        }
        /**
         * 可以请求的最大详细级别
         * @type {Number}
         * @readonly
         */
        get maximumLevel() {
            return super.maximumLevel;
        }
        /**
         * 获取影像错误时触发的事件
         * @type {Event}
         * @readonly
         */
        get errorEvent() {
            return super.errorEvent;
        }
        /**
         * 图层的范围
         * @type {Cesium.Rectangle}
         * @readonly
         */
         get rectangle() {
            return super.rectangle;
        }
        /**
         * 获取一个值，该值指示图层是否已准备好使用。
         * @readonly
         * @type {Boolean}
         */
        get ready() {
            return super.ready;
        }
        /**
         * 获取一个Promise，该图层准备好时将resolve
         * @readonly
         * @type {Promise<Boolean>}
         */
        get readyPromise() {
            return super.readyPromise;
        }
        /**
         * 图层的坐标系
         * @type {Cesium.TilingScheme}
         * @readonly
         */
        get tilingScheme() {
            return super.tilingScheme;
        }
        /**
         * 图层是否允许被pick
         * @default true
         */
        get enablePickFeatures() {
            return super.enablePickFeatures;
        }
        set enablePickFeatures(val) {
            super.enablePickFeatures = val;
        }

        /**
         * 确定哪些要素（如果有）位于图块内的给定经度和纬度。在{@link Cesium.ImageryProvider#ready}返回 true之前不应调用此函数。
         * 在数据图层ready之前，该函数不能被调用
         *
         * @param {Number} x 瓦片的x坐标。
         * @param {Number} y 瓦片的y坐标。
         * @param {Number} level 瓦片的层级。
         * @param {Number} longitude 选择要素的经度。
         * @param {Number} latitude  选择要素的纬度
         * @return {Promise.<Cesium.ImageryLayerFeatureInfo[]>|undefined} 
         */
        pickFeatures(x, y, level, longitude, latitude) {
            return super.pickFeatures(x, y, level, longitude, latitude);
        }
        /**
         * 请求指定瓦片
         * @param {Number} x 瓦片x坐标
         * @param {Number} y 瓦片y坐标
         * @param {Number} level 瓦片级别
         * @param {Cesium.Request} [request]
         * @returns {Promise.<HTMLImageElement|HTMLCanvasElement>|undefined} 如果瓦片解析成功，返回一个异步Promise，解析的图像可以是 Image 或 Canvas DOM 对象，否则返回undefined
         */
        requestImage(x, y, level, request) {
            return super.requestImage(x, y, level, request)
        }
    }

    const {
        Resource
    } = Cesium;
    class WFSLayer {
        /**
         * 添加一个WFS服务的图层
         * @param {Object} options 具有以下属性
         * @param {String} options.url WFS服务地址
         * @param {String} options.typeName 图层名称
         * @param {WFSLayer.Style} [options.style] 样式
         * @example
         * const wfs = new CesiumPro.WFSLayer({
         *     url: "http://localhost:8080/geoserver/tiger/ows",
         *     typeName: "tiger:poi",
         *     style: {
         *         pointColor: Cesium.Color.GOLD
         *     }
         * })
         * viewer.addLayer(wfs)
         */
        constructor(options = {}) {
            this._url = options.url;
            this._typeName = options.typeName;
            this._style = options.style;
            if (!defined$8(this._url)) {
                throw new CesiumProError$1('parameter url must be provided.')
            }
            if (!defined$8(this._typeName)) {
                throw new CesiumProError$1('parameter typeName must be provided.')
            }
            const resource = new Resource({
                url: options.url,
                queryParameters: {
                    service: 'WFS',
                    version: "1.0.0",
                    request: "GetFeature",
                    typeName: options.typeName,
                    maxFeatures: 50,
                    outputFormat: 'application/json'
                }
            });
            return GeoJsonDataSource.load(resource, this._style);
        }
        get rectangle() {
            return this._rectangle || this.tilingScheme.rectangle;
        }
        get tilingScheme() {
            return proj.get('EPSG:4326');
        }
        get tileWidth() {
            return this._tileWidth;
        }
        get tileHeight() {
            return this._tileHeight
        }
        get ready() {
            return this._ready;
        }
        get readyPromise() {
            return this._readyPromise;
        }
    }

    class WMSLayer extends Cesium.WebMapServiceImageryProvider {
        /**
         * 创建一个从WMS服务请求数据的图层。
         * @extends Cesium.WebMapServiceImageryProvider
         * @param {*} options 具有以下属性
         * @param {Resource|String} options.url 一个WMS服务的URL. 这个url支持和 {@link XYZLayer}一样的关键字。
         * @param {String} options.layers 要包含的图层，以逗号分割。
         * @param {Object} [options.parameters=WMSLayer.DefaultParameters] GetMap URL中包含的额外参数。
         * @param {Object} [options.getFeatureInfoParameters=WMSLayer.GetFeatureInfoDefaultParameters] GetFeatureInfo URL中包含的额外参数。
         * @param {Boolean} [options.enablePickFeatures=true] 图层是否允许被pick {@link WMSLayer#pickFeatures}
         * @param {GetFeatureInfoFormat[]} [options.getFeatureInfoFormats=WMSLayer.DefaultGetFeatureInfoFormats] WMS GetFeatureInfo 请求的格式。
         * @param {Rectangle} [options.rectangle=Cesium.Rectangle.MAX_VALUE] 图层的范围。
         * @param {TilingScheme} [options.tilingScheme=new Cesium.GeographicTilingScheme()] 图层坐标系
         * @param {Number} [options.tileWidth=256] 瓦片宽度
         * @param {Number} [options.tileHeight=256] 瓦片高度
         * @param {Number} [options.minimumLevel=0] 最小层级
         * @param {Number} [options.maximumLevel] 最大层级
         * @param {String} [options.crs] CRS 规范，用于 WMS version >= 1.3.0。
         * @param {String} [options.srs] SRS 规范，用于 WMS version 1.1.0 或 1.1.1
         * @param {Credit|String} [options.credit] A credit for the data source, which is displayed on the canvas.
         * @param {String|String[]} [options.subdomains='abc'] {s}占位符可用的子域名，如果该值为字符串，由字符串中的每个字符都是一个子域名。
         * @param {Clock} [options.clock] 在确定时间维度的值时使用的 Clock 实例。指定 `times` 时需要。
         * @param {TimeIntervalCollection} [options.times] TimeIntervalCollection 及其数据属性是一个包含时间动态维度及其值的对象。
         * 
         * @example 
         * var provider = new Cesium.WebMapServiceImageryProvider({
         *   url : 'https://sampleserver1.arcgisonline.com/ArcGIS/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer/WMSServer',
         *   layers : '0',
         *   proxy: new Cesium.DefaultProxy('/proxy/')
         * });
         *
         * viewer.addLayer(provider);
         */
        constructor(options = {}) {
            if (!defined$8(options.parameters)) {
                options.parameters = WMSLayer.DefaultParameters;
            }
            if (!defined$8(options.GetFeatureInfoDefaultParameters)) ;
            super(options);
        }
        /**
         * 可以请求的最小瓦片级别
         * @readonly
         * @type {Number}
         */
         get minimumLevel() {
            return super.minimumLevel;
        }
        /**
         * 可以请求的最大详细级别
         * @type {Number}
         * @readonly
         */
        get maximumLevel() {
            return super.maximumLevel;
        }
        /**
         * 获取影像错误时触发的事件
         * @type {Event}
         * @readonly
         */
        get errorEvent() {
            return super.errorEvent;
        }
        /**
         * 图层的范围
         * @type {Cesium.Rectangle}
         * @readonly
         */
         get rectangle() {
            return super.rectangle;
        }
        /**
         * 获取一个值，该值指示图层是否已准备好使用。
         * @readonly
         * @type {Boolean}
         */
        get ready() {
            return super.ready;
        }
        /**
         * 获取一个Promise，该图层准备好时将resolve
         * @readonly
         * @type {Promise<Boolean>}
         */
        get readyPromise() {
            return super.readyPromise;
        }
        /**
         * 图层的坐标系
         * @type {Cesium.TilingScheme}
         * @readonly
         */
        get tilingScheme() {
            return super.tilingScheme;
        }
        /**
         * 图层是否允许被pick
         * @type {Boolean}
         * @default true
         */
        get enablePickFeatures() {
            return this._tileProvider.enablePickFeatures;
        }
        set enablePickFeatures(val) {
            this._tileProvider.enablePickFeatures = val;
        }
        /**
         * 确定哪些要素（如果有）位于图块内的给定经度和纬度。在{@link Cesium.ImageryProvider#ready}返回 true之前不应调用此函数。
         * 在数据图层ready之前，该函数不能被调用
         *
         * @param {Number} x 瓦片的x坐标。
         * @param {Number} y 瓦片的y坐标。
         * @param {Number} level 瓦片的层级。
         * @param {Number} longitude 选择要素的经度。
         * @param {Number} latitude  选择要素的纬度
         * @return {Promise.<Cesium.ImageryLayerFeatureInfo[]>|undefined} 
         */
        pickFeatures(x, y, level, longitude, latitude) {
            return super.pickFeatures(x, y, level, longitude, latitude);
        }
        /**
         * 请求指定瓦片
         * @param {Number} x 瓦片x坐标
         * @param {Number} y 瓦片y坐标
         * @param {Number} level 瓦片级别
         * @param {Cesium.Request} [request]
         * @returns {Promise.<HTMLImageElement|HTMLCanvasElement>|undefined} 如果瓦片解析成功，返回一个异步Promise，解析的图像可以是 Image 或 Canvas DOM 对象，否则返回undefined
         */
        requestImage(x, y, level, request) {
            return super.requestImage(x, y, level, request)
        }
    }

    /**
     * GetMap时包含在WMS URL中的默认参数，如下:
     *    service=WMS
     *    version=1.1.1
     *    request=GetMap
     *    styles=
     *    format=image/png,
     *    transparent=true
     *
     * @constant
     * @static
     * @type {Object}
     */
    WMSLayer.DefaultParameters = Object.assign({
        transparent: true,
    }, Cesium.WebMapServiceImageryProvider.DefaultParameters, {
        format: 'image/png'
    });
    /**
     * WMS GetFeatureInfo时URL中的默认的参数:
     *     service=WMS
     *     version=1.1.1
     *     request=GetFeatureInfo
     *
     * @constant
     * @static
     * @type {Object}
     */
    WMSLayer.GetFeatureInfoDefaultParameters = Cesium.WebMapServiceImageryProvider.GetFeatureInfoDefaultParameters;

    const {
        AssociativeArray,
        destroyObject: destroyObject$1,
        CustomDataSource,
        Event: Event$3
    } = Cesium;
    const defaultCreateGeometryFunction$1 = function () {return {} };
    const ZEROLEVELHEIGHT$1 = 31638318;
    const cameraHeightForLevel$1 = [ZEROLEVELHEIGHT$1];
    for (let i = 1; i < 20; i++) {
        cameraHeightForLevel$1.push(cameraHeightForLevel$1[i - 1] / 2);
    }
    function getLevelByHeight$1(height) {
        let level = 0;
        for (let levelHeight of cameraHeightForLevel$1) {
            if (height > levelHeight) {
                break;
            }
            level++;
        }
        return level;
    }
    class MassiveEntityLayer extends MassiveGraphicLayer{
        /**
         * 一个以LOD方式加载大量点（model, billboard, point, label）数据的基础类。
         * 该图层的点数据会类似瓦片数据的方式加载，即只加载当前窗口范围内的数据，在按
         * 瓦片分割数据前还会对数据做聚类处理，以解决低层级时加载大量数据的低性能问题。
         * <p>
         * 但是，不得不说这是一个半成品，我的本意是想写一个加载大量点（point, level, billboard, model)
         * 数据的图层，该图层基于四叉树进行分层分片，按需创建点要素，但仅仅这样，图层在各个层级的细节
         * 相同，当相机非常高时，瓦片的范围特别大，每个瓦片内包含大量的点数据，这会造成严重的性能问题，
         * 因此我想通过聚合来解决这个问题，但是发现Cesium的聚类算法性能非常差，最终不得不放弃了这一
         * 优化思路，但是，如果你有需要，仍然可以使用聚合来解决低层级时的性能问题。
         * </p>
         * @param {Object} options 具有以下属性
         * @param {Object} options.objects 定义点对象的属性
         * @param {Function} [options.createGeometryFunction] 创建点要素的函数
         * @param {Number} [options.minLoadLevel = 12] 最小加载层级， 瓦片层级小于minLoadLevel将不加载任何数据
         * 
         * @see MassivePointLayer
         * @see MassiveBillboardLayer
         * @see MassiveModelLayer
         */
        constructor(options = {}) {
            //>>includeStart('debug', pragmas.debug);
            if (!defined$8(options.objects)) {
                throw new CesiumProError$1('objects property must be provided.')
            }
            if (!Array.isArray(options.objects)) {
                throw new CesiumProError$1('objects property must be an array')
            }
            //>>includeEnd('debug')
            // if(!options.scene) {
            //     throw new CesiumProError('property scene must be defined.')
            // }
            super(options);
            this._id = defaultValue$6(options.id, createGuid$3());
            this._createGeometryFunction = options.createGeometryFunction;
            this._data = options.objects;
            this._needReclass = true;
            this._changeEvent = new Event$3();
            this._maxClusterLevel = defaultValue$6(options.maxClusterLevel, 12);
            this._minLoadLevel = defaultValue$6(options.minLoadLevel, 12);
            this._geometryCached = {};
            this._objectsCached = {};
        }
        /**
         * 图层的唯一标识
         * @type {String}
         * @readonly
         */
        get id() {
            return this._id;
        }
        /**
         * 包含所有点要素的数据源
         * @type {Cesium.CustomDataSource}
         * @readonly
         */
        get dataSource() {
            return this._dataSource;
        }
        /**
         * 最小加载层级，瓦片层级小于该值时将不加载任何数据
         */
        get minLoadLevel() {
            return this._minLoadLevel;
        }
        set minLoadLevel(val) {
            this._minLoadLevel = val;
        }
        /**
         * 创建点要素属性对象
         */
        get objects() {
            return this._objects || this._data;
        }
        set objects(val) {
            this._objects = val;
        }
        /**
         * 更新聚合状态，由于计算屏幕坐标代价较大，这里对每一层级的屏幕坐标只计算一次，
         * 这可能会造成一些误差。
         * @private
         * @param {Number} height 当前相机高度
         * @returns {Boolean} 更新前后数据是否发生变化。
         */
        updateCluster(height) {
            const level = getLevelByHeight$1(height);
            const oldObjects = this._objects;
            if (level > this._maxClusterLevel) {
                this._objects = this._data;
                this._needReclass = oldObjects !== this._objects;
                return Promise.resolve(this._needReclass)
            }
            if (this._objectsCached[level]) {
                this._objects = this._objectsCached[level];
                this._needReclass = oldObjects !== this._objects;
                return Promise.resolve(this._needReclass)
            }
            if (this._cluster) {
                return new Promise((resolve, reject) => {
                    this._cluster.update();
                    this._objects = this._cluster._clusterObjects;
                    this._objectsCached[level] = JSON.parse(JSON.stringify(this._objects));
                    this._needReclass = true;
                    resolve(true);
                });
            }
        }
        /**
         * 所有要素创建前调用，一般不需要主动调用，每帧会自动调用一次
         * @param {Cesium.FrameState} framestate framestate
         */
        beginUpdate(framestate) {
            const height = framestate.camera.positionCartographic.height;
            const level = getLevelByHeight$1(height);
            if(level < this._minLoadLevel) {
                this._objects = [];
            } else {
                this._objects = this._data;
            }
        }
        /**
         * 所有要素创建完成后调用，一般不需要主动调用，每帧会自动调用一次
         * @param {Cesium.FrameState} framestate framestate
         */
        endUpdate(framestate) {
            const height = framestate.camera.positionCartographic.height;
            const level = getLevelByHeight$1(height);
            this._needReclass = false;
            return level < this._minLoadLevel;
        }
        /**
         * 初始化图层
         * @private
         * @param {Cesium.FrameState} framestate 
         * @param {Cesium.Scene} scene 
         */
        initialize(framestate, scene) {
            // if (!this._cluster) {
            //     this._cluster = new Cluster(scene, {
            //         objects: [...this._data]
            //     })
            //     this.updateCluster()
            // }
            if (!this._dataSource) {
                this._scene = scene;
                this._dataSource = new CustomDataSource('massive-layer' + createGuid$3());
                this._scene.dataSources.add(this._dataSource);

                // 太耗费性能
                // ds.then((dataSource) => {
                //     var pixelRange = 150;
                //     var minimumClusterSize = 3;
                //     var enabled = true;

                //     dataSource.clustering.enabled = enabled;
                //     dataSource.clustering.pixelRange = pixelRange;
                //     dataSource.clustering.minimumClusterSize = minimumClusterSize;

                //     var removeListener;

                //     var pinBuilder = new Cesium.PinBuilder();
                //     var pin50 = pinBuilder
                //         .fromText("50+", Cesium.Color.RED, 48)
                //         .toDataURL();
                //     var pin40 = pinBuilder
                //         .fromText("40+", Cesium.Color.ORANGE, 48)
                //         .toDataURL();
                //     var pin30 = pinBuilder
                //         .fromText("30+", Cesium.Color.YELLOW, 48)
                //         .toDataURL();
                //     var pin20 = pinBuilder
                //         .fromText("20+", Cesium.Color.GREEN, 48)
                //         .toDataURL();
                //     var pin10 = pinBuilder
                //         .fromText("10+", Cesium.Color.BLUE, 48)
                //         .toDataURL();

                //     var singleDigitPins = new Array(8);
                //     for (var i = 0; i < singleDigitPins.length; ++i) {
                //         singleDigitPins[i] = pinBuilder
                //             .fromText("" + (i + 2), Cesium.Color.VIOLET, 48)
                //             .toDataURL();
                //     }

                //     function customStyle() {
                //         if (Cesium.defined(removeListener)) {
                //             removeListener();
                //             removeListener = undefined;
                //         } else {
                //             removeListener = dataSource.clustering.clusterEvent.addEventListener(
                //                 function (clusteredEntities, cluster) {
                //                     cluster.label.show = false;
                //                     cluster.billboard.show = true;
                //                     cluster.billboard.id = cluster.label.id;
                //                     cluster.billboard.verticalOrigin =
                //                         Cesium.VerticalOrigin.BOTTOM;

                //                     if (clusteredEntities.length >= 50) {
                //                         cluster.billboard.image = pin50;
                //                     } else if (clusteredEntities.length >= 40) {
                //                         cluster.billboard.image = pin40;
                //                     } else if (clusteredEntities.length >= 30) {
                //                         cluster.billboard.image = pin30;
                //                     } else if (clusteredEntities.length >= 20) {
                //                         cluster.billboard.image = pin20;
                //                     } else if (clusteredEntities.length >= 10) {
                //                         cluster.billboard.image = pin10;
                //                     } else {
                //                         cluster.billboard.image =
                //                             singleDigitPins[clusteredEntities.length - 2];
                //                     }
                //                 }
                //             );
                //         }

                //         // force a re-cluster with the new styling
                //         var pixelRange = dataSource.clustering.pixelRange;
                //         dataSource.clustering.pixelRange = 0;
                //         dataSource.clustering.pixelRange = pixelRange;
                //     }
                //     customStyle()
                // })
            }
        }
        /**
         * 根据object创建点要素，一般不需要主动调用。
         * @param {Cesium.QuadtreeTile} tile 该要素所在的瓦片
         * @param {*} framestate framestate
         * @param {Object} object 描述点要素的属性信息
         * @returns {Object} 被创建的对象
         */
        createGeometry(tile, framestate, object) {
            if(tile.level < this._minLoadLevel) {
                return;
            }
            const createGeometry = defaultValue$6(this._createGeometryFunction, defaultCreateGeometryFunction$1);
            const geometry = createGeometry(object, tile, framestate);
            const keys = Object.keys(object);
            for (let key of keys) {
                if (key === 'position'
                    || key === 'id'
                    || key === "cartesian"
                    || key === "cartographic"
                    || key === "label"
                    || key === 'billboard'
                    || key === "__pixel") {
                    continue;
                }
                geometry[key] = object[key];

            }
            this.add(geometry);
            return geometry;
        }
        /**
         * 删除点要素，一般不需要主动调用。
         * @param {Cesium.FrameState} framestate 
         * @param {Entity} object 要删除的点要素
         * @returns {Boolean} 是否删除成功
         */
        removeGeometry(framestate, object) {
            if (!object) {
                return;
            }
            const removed = this._dataSource.entities.remove(object);
            destroyObject$1(object);
            return removed;
        }
        add(entity) {
            if (this._dataSource && entity) {
                this._dataSource.entities.add(entity);
            }
        }
        /**
         * 移除所有要素
         */
        removeAll() {
            this._dataSource.entities.removeAll();
        }
        /**
         * 判断图层是否被销毁
         */
        isDestroyed() {
            return false;
        }
        /**
         * 销毁图层
         * @example
         * if(!layer.isDestroyed()) {
         *   layer.destroy()
         * }
         */
        destroy() {
            this._dataSource.removeAll();
            destroyObject$1(this);
        }
    }

    const {
        QuadtreeTileProvider: QuadtreeTileProvider$1,
        GeographicTilingScheme: GeographicTilingScheme$1,
        when: when$1,
        Event: Event$2,
        Cartographic: Cartographic$1,
        Color: Color$1,
        Entity: Entity$1
    } = Cesium;
    function defaultCreateFn$1(options) {
        return function (object) {
            const entityOptions = {
                id: object.id,
                position: object.position,
                point: {
                    pixelSize: defaultValue$6(object.pixelSize, options.pixelSize),
                    color: defaultValue$6(object.color, options.color)
                }
            };
            if (object.label) {
                entityOptions.label = {
                    text: object.label
                };
            }
            return new Entity$1(entityOptions)
        }

    }
    class MassiveBillboardLayer extends MassiveEntityLayer {
        /**
         
         * @extends MassiveEntityLayer
         * @param {MassiveBillboardLayer.Options} options 选项
         */
        constructor(options = {}) {
            options.objects = defaultValue$6(options.objects, []);
            options.pixelSize = defaultValue$6(options.pixelSize, 5);
            options.color = defaultValue$6(options.color, Color$1.fromRandom);
            options.createGeometryFunction = defaultValue$6(options.createGeometryFunction, defaultCreateFn$1(options));
            super(options);
        }
    }

    const {
        destroyObject,
        Event: Event$1,
        Transforms
    } = Cesium;
    const defaultCreateGeometryFunction = function (object, options) {
        const modelOption = {};
        if (object.modelMatrix) {
            modelOption.modelMatrix = object.modelMatrix;
        } else if (object.position) {
            let cartesian = object.position;
            if (object.position instanceof LonLat) {
                cartesian = object.position.toCartesian();
            }
            if (!cartesian) {
                return;
            }
            modelOption.modelMatrix = Transforms.eastNorthUpToFixedFrame(cartesian);
            object.modelMatrix = modelOption.modelMatrix;
        }
        modelOption.minimumPixelSize = defaultValue$6(object.minimumPixelSize, options.minimumPixelSize);
        modelOption.maximumScale = defaultValue$6(object.maximumScale, options.maximumScale);
        modelOption.scale = defaultValue$6(object.scale, options.scale);
        modelOption.allowPicking = defaultValue$6(object.allowPicking, options.allowPicking);
        modelOption.shadows = defaultValue$6(object.shadows, options.shadows);
        modelOption.id = object._id;
        modelOption.url = defaultValue$6(object.url, options.url);
        return Cesium.Model.fromGltf(modelOption)
    };
    const ZEROLEVELHEIGHT = 31638318;
    const cameraHeightForLevel = [ZEROLEVELHEIGHT];
    for (let i = 1; i < 20; i++) {
        cameraHeightForLevel.push(cameraHeightForLevel[i - 1] / 2);
    }
    function getLevelByHeight(height) {
        let level = 0;
        for (let levelHeight of cameraHeightForLevel) {
            if (height > levelHeight) {
                break;
            }
            level++;
        }
        return level;
    }
    class MassiveModelLayer extends MassiveGraphicLayer {
        /**
         * 海量模型(gltf/glb）加载。该图层会基于四叉树对数据进行分块，搂需加载，以优化性能。
         * @param {Object} options 具有以下属性
         * @param {Object} options.objects 定义点对象的属性
         * @param {Function} [options.createGeometryFunction] 创建点要素的函数
         * @param {Number} [options.minLoadLevel = 12] 最小加载层级， 瓦片层级小于minLoadLevel将不加载任何数据
         * 
         * @see MassivePointLayer
         * @see MassiveBillboardLayer
         * 
         * @example
         * const positions = Cesium.Cartesian3.fromDegreesArray([...])
         * let i = 0
         * const objects = positions.map(_ => {
         *     i++
         *     return {
         *         id: {name: 'model' + i}, // 自定义属性，该对象会在pick中返回
         *         position: _,
         *     }
         * })
         * const massiveModel = new CesiumPro.MassiveModelLayer({
         *     objects,
         *     url: '../data/models/Cesium_Air.glb',
         *     minimumPixelSize:64
         * })
         * viewer.massiveGraphicLayers.add(massiveModel)
         * @demo {@link examples/apps/index.html#/5.4.2massiveModel|50万模型加载示例}
         */
        constructor(options = {}) {
            //>>includeStart('debug', pragmas.debug);
            if (!defined$8(options.objects)) {
                throw new CesiumProError$1('objects property must be provided.')
            }
            if (!Array.isArray(options.objects)) {
                throw new CesiumProError$1('objects property must be an array')
            }
            //>>includeEnd('debug')
            // if(!options.scene) {
            //     throw new CesiumProError('property scene must be defined.')
            // }
            // 作为要素的唯一标识必须是字符串, Model的id是对象
            options.objects.forEach(_ => {
                _._id = _.id;
                delete _.id;
            });
            super(options);
            this._id = defaultValue$6(options.id, createGuid$3());
            this._createGeometryFunction = options.createGeometryFunction;
            this._data = options.objects;
            this._needReclass = true;
            this._changeEvent = new Event$1();
            this._maxClusterLevel = defaultValue$6(options.maxClusterLevel, 12);
            this._minLoadLevel = defaultValue$6(options.minLoadLevel, 12);
            this._geometryCached = {};
            this._objectsCached = {};
            this._options = options;
        }
        /**
         * 图层的唯一标识
         * @type {String}
         * @readonly
         */
        get id() {
            return this._id;
        }
        /**
         * 最小加载层级，瓦片层级小于该值时将不加载任何数据
         */
        get minLoadLevel() {
            return this._minLoadLevel;
        }
        set minLoadLevel(val) {
            this._minLoadLevel = val;
        }
        /**
         * 创建点要素属性对象
         */
        get objects() {
            return this._objects || this._data;
        }
        set objects(val) {
            this._objects = val;
        }
        /**
         * 更新聚合状态，由于计算屏幕坐标代价较大，这里对每一层级的屏幕坐标只计算一次，
         * 这可能会造成一些误差。
         * @private
         * @param {Number} height 当前相机高度
         * @returns {Boolean} 更新前后数据是否发生变化。
         */
        updateCluster(height) {
            const level = getLevelByHeight(height);
            const oldObjects = this._objects;
            if (level > this._maxClusterLevel) {
                this._objects = this._data;
                this._needReclass = oldObjects !== this._objects;
                return Promise.resolve(this._needReclass)
            }
            if (this._objectsCached[level]) {
                this._objects = this._objectsCached[level];
                this._needReclass = oldObjects !== this._objects;
                return Promise.resolve(this._needReclass)
            }
            if (this._cluster) {
                return new Promise((resolve, reject) => {
                    this._cluster.update();
                    this._objects = this._cluster._clusterObjects;
                    this._objectsCached[level] = JSON.parse(JSON.stringify(this._objects));
                    this._needReclass = true;
                    resolve(true);
                });
            }
        }
        /**
         * 所有要素创建前调用，一般不需要主动调用，每帧会自动调用一次
         * @param {Cesium.FrameState} framestate framestate
         */
        beginUpdate(framestate) {
            const height = framestate.camera.positionCartographic.height;
            const level = getLevelByHeight(height);
            if (level < this._minLoadLevel) {
                this._objects = [];
            } else {
                this._objects = this._data;
            }
        }
        /**
         * 所有要素创建完成后调用，一般不需要主动调用，每帧会自动调用一次
         * @param {Cesium.FrameState} framestate framestate
         */
        endUpdate(framestate) {
            const height = framestate.camera.positionCartographic.height;
            const level = getLevelByHeight(height);
            this._needReclass = false;
            return level < this._minLoadLevel;
        }
        /**
         * 初始化图层
         * @private
         * @param {Cesium.FrameState} framestate 
         * @param {Cesium.Scene} scene 
         */
        initialize(framestate, scene) {
            if (!this._collection) {
                this._scene = scene;
                const collection = new Cesium.PrimitiveCollection();
                scene.primitives.add(collection);
                this._collection = collection;
            }
        }
        /**
         * 根据object创建点要素，一般不需要主动调用。
         * @param {Cesium.QuadtreeTile} tile 该要素所在的瓦片
         * @param {*} framestate framestate
         * @param {Object} object 描述点要素的属性信息
         * @returns {Object} 被创建的对象
         */
        createGeometry(tile, framestate, object) {
            if (tile.level < this._minLoadLevel) {
                return;
            }
            const createGeometry = defaultValue$6(this._createGeometryFunction, defaultCreateGeometryFunction);
            const geometry = createGeometry(object, this._options);
            this.add(geometry);
            return geometry;
        }
        /**
         * 删除点要素，一般不需要主动调用。
         * @param {Cesium.FrameState} framestate 
         * @param {Entity} object 要删除的点要素
         * @returns {Boolean} 是否删除成功
         */
        removeGeometry(framestate, object) {
            if (!object) {
                return;
            }
            const removed = this._collection.remove(object);
            // destroyObject(object);
            return removed;
        }
        add(primitive) {
            if (this._collection && primitive) {
                this._collection.add(primitive);
            }
        }
        /**
         * 移除所有要素
         */
        removeAll() {
            this._collection.removeAll();
        }
        /**
         * 判断图层是否被销毁
         */
        isDestroyed() {
            return false;
        }
        /**
         * 销毁图层
         * @example
         * if(!layer.isDestroyed()) {
         *   layer.destroy()
         * }
         */
        destroy() {
            this._collection.removeAll();
            destroyObject(this);
        }
    }

    const {
        QuadtreeTileProvider,
        GeographicTilingScheme,
        when,
        Event,
        Cartographic,
        Color,
        Entity,
        createGuid
    } = Cesium;
    function defaultCreateFn(options) {
        return function (object) {
            let id = createGuid();
            if (typeof object.id === 'string' || typeof object.id === 'number') {
                id = object.id;
            }
            const entityOptions = {
                id: id,
                position: object.position,
                point: {
                    pixelSize: defaultValue$6(object.pixelSize, options.pixelSize),
                    color: defaultValue$6(object.color, options.color)
                }
            };
            if (object.label) {
                entityOptions.label = {
                    text: object.label
                };
            }
            return new Entity(entityOptions)
        }

    }
    class MassivePointLayer extends MassiveEntityLayer {
        /**
         * 创建大量点要素（Entity)
         * @extends MassiveEntityLayer
         * @param {MassivePointLayer.Options} options 选项
         * const objects = positions.map(_ => {
         *     i++
         *     return {
         *         id: Cesium.createGuid(),
         *         position:_,
         *         // color: Cesium.Color.fromRandom({alpha:1}),
         *         pixelSize: 5
         *     }
         * })
         *
         * const pointlayer = new CesiumPro.MassivePointLayer({
         *     objects: objects,
         *     color: Cesium.Color.GOLD,
         *     pixelSize: 5
         * })
         * viewer.massiveGraphicLayers.add(pointlayer)
         * 
         * @demo {@link examples/apps/index.html#/5.4.1mag-point|100万点加载示例}
         */
        constructor(options = {}) {
            options.objects = defaultValue$6(options.objects, []);
            options.pixelSize = defaultValue$6(options.pixelSize, 5);
            options.color = defaultValue$6(options.color, Color.fromRandom);
            options.createGeometryFunction = defaultValue$6(options.createGeometryFunction, defaultCreateFn(options));
            super(options);
        }
    }

    function line(){}

    const {ShaderSource} = Cesium;
    /**
     * 自定全局glsl函数
     * @param {String} builtinName 必须以czm开头
     * @param {*} shader 
     */
    function buildUniforms(builtinName, shader) {
        ShaderSource._czmBuiltinsAndUniforms[builtinName] = shader;
    }

    const VERSION = '1.0.3';

    exports.BaiDuLayer = BaiDuLayer;
    exports.BingLayer = BingLayer;
    exports.CesiumProError = CesiumProError$1;
    exports.CesiumProTerrainProvider = CesiumProTerrainProvider;
    exports.CircleScanGraphic = CircleScanGraphic;
    exports.CircleSpreadGraphic = CircleSpreadGraphic;
    exports.Cluster = Cluster;
    exports.DynamicConeGraphic = DynamicConeGraphic;
    exports.Event = Event$7;
    exports.GaoDeLayer = GaoDeLayer;
    exports.GeoJsonDataSource = GeoJsonDataSource;
    exports.Globe = Globe;
    exports.Graphic = Graphic;
    exports.GraphicGroup = GraphicGroup;
    exports.GroundSkyBox = GroundSkyBox;
    exports.ImagerySplitDirection = ImagerySplitDirection;
    exports.InfoBox = InfoBox;
    exports.LonLat = LonLat;
    exports.LonLatNetLayer = LonLatNetLayer;
    exports.LonlatTilingScheme = LonlatTilingScheme;
    exports.MassiveBillboardLayer = MassiveBillboardLayer;
    exports.MassiveEntityLayer = MassiveEntityLayer;
    exports.MassiveGraphicLayer = MassiveGraphicLayer;
    exports.MassiveGraphicLayerCollection = MassiveGraphicLayerCollection;
    exports.MassiveModelLayer = MassiveModelLayer;
    exports.MassivePointLayer = MassivePointLayer;
    exports.Model = Model;
    exports.MultipleTerrainProvider = MultipleTerrainProvider;
    exports.PbfDataSource = PbfDataSource;
    exports.PointBaseGraphic = PointBaseGraphic;
    exports.Primitive = Primitive$3;
    exports.QuadTreeProvider = QuadTreeProvider;
    exports.RadarScanGraphic = RadarScanGraphic;
    exports.Scene = override;
    exports.Selection = Selection;
    exports.ShaderProgram = override$1;
    exports.ShapefileDataSource = ShapefileDataSource;
    exports.TDTLayer = TDTLayer;
    exports.TMSLayer = TMSLayer;
    exports.TaskProcessor = TaskProcessor;
    exports.TecentLayer = TecentLayer;
    exports.TileDebugLayer = TileDebugLayer;
    exports.TileLayer = TileLayer;
    exports.Tileset = Tileset;
    exports.Url = Url;
    exports.VERSION = VERSION;
    exports.Viewer = Viewer;
    exports.WFSLayer = WFSLayer;
    exports.WMSLayer = WMSLayer;
    exports.WMTSLayer = WMTSLayer;
    exports.XYZLayer = XYZLayer;
    exports._shaderBuildUniforms = buildUniforms;
    exports._shaderCircleScan = glsl$1;
    exports._shaderCircleSpread = shader$1;
    exports._shaderDynamicCone = glsl;
    exports._shaderGlobeFS = GlobeFS;
    exports._shaderGroundSkyBoxFS = shader$3;
    exports._shaderGroundSkyBoxVS = shader$2;
    exports._shaderLine = line;
    exports._shaderRadarScan = shader;
    exports.computeDistancePerPixel = computeDistancePerPixel;
    exports.computeSceneCenterPoint = computeSceneCenterPoint;
    exports.computeSceneExtent = computeSceneExtent;
    exports.createDefaultLayer = createDefaultLayer;
    exports.createGuid = createGuid$3;
    exports.dateFormat = dateFormat;
    exports.defaultValue = defaultValue$6;
    exports.defined = defined$8;
    exports.index = overrideCesium;
    exports.proj = proj;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=CesiumPro.js.map

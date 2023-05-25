import CesiumProError from "../core/CesiumProError";
const {
    arrayFill
    , BoundingSphere
    , Cartesian2
    , Cartesian3
    , ComponentDatatype
    , CylinderGeometryLibrary
    , defaultValue
    , defined
    , Geometry
    , GeometryAttribute
    , GeometryAttributes
    , GeometryOffsetAttribute
    , IndexDatatype
    , PrimitiveType
    , VertexFormat } = Cesium;
const CesiumMath = Cesium.Math;
const radiusScratch = new Cartesian2();
const normalScratch = new Cartesian3();
const bitangentScratch = new Cartesian3();
const tangentScratch = new Cartesian3();
const positionScratch = new Cartesian3();
const scratchVertexFormat = new VertexFormat();
const scratchOptions = {
    vertexFormat: scratchVertexFormat,
    length: undefined,
    topRadius: undefined,
    bottomRadius: undefined,
    slices: undefined,
    offsetAttribute: undefined,
};
let unitCylinderGeometry;

function computePositions(
    length,
    topRadius,
    bottomRadius,
    slices,
    fill
) {
    var topZ = length * 0.5;
    var bottomZ = -topZ;

    var twoSlice = slices + slices;
    var size = fill ? 2 * twoSlice : twoSlice;
    var positions = new Float64Array(size * 3);
    var i;
    var index = 0;
    var tbIndex = 0;
    var topOffset = fill ? twoSlice * 3 : 0;
    var bottomOffset = fill ? (twoSlice + slices) * 3 : slices * 3;

    for (i = 0; i < slices; i++) {
        var angle = (i / slices) * CesiumMath.TWO_PI;
        var x = Math.cos(angle);
        var y = Math.sin(angle);
        var bottomX = x * bottomRadius;
        var bottomY = y * bottomRadius;
        var topX = x * topRadius;
        var topY = y * topRadius;

        positions[tbIndex + bottomOffset] = bottomX;
        positions[tbIndex + bottomOffset + 1] = bottomY;
        positions[tbIndex + bottomOffset + 2] = bottomZ;

        positions[tbIndex + topOffset] = topX;
        positions[tbIndex + topOffset + 1] = topY;
        positions[tbIndex + topOffset + 2] = topZ;
        tbIndex += 3;
        if (fill) {
            positions[index++] = bottomX;
            positions[index++] = bottomY;
            positions[index++] = bottomZ;
            positions[index++] = topX;
            positions[index++] = topY;
            positions[index++] = topZ;
        }
    }

    return positions;
};
class CylinderGeometry {

    /**
     * A description of a cylinder.
     *
     * @alias CylinderGeometry
     * @constructor
     *
     * @param {Object} options Object with the following properties:
     * @param {Number} options.length The length of the cylinder.
     * @param {Number} options.topRadius The radius of the top of the cylinder.
     * @param {Number} options.bottomRadius The radius of the bottom of the cylinder.
     * @param {Number} [options.slices=128] The number of edges around the perimeter of the cylinder.
     * @param {VertexFormat} [options.vertexFormat=VertexFormat.DEFAULT] The vertex attributes to be computed.
     *
     * @exception {CesiumProError} options.slices must be greater than or equal to 3.
     *
     * @see CylinderGeometry.createGeometry
     *
     * @example
     * // create cylinder geometry
     * var cylinder = new Cesium.CylinderGeometry({
     *     length: 200000,
     *     topRadius: 80000,
     *     bottomRadius: 200000,
     * });
     * var geometry = Cesium.CylinderGeometry.createGeometry(cylinder);
     */
    constructor(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        const length = options.length;
        const topRadius = options.topRadius;
        const bottomRadius = options.bottomRadius;
        const vertexFormat = defaultValue(options.vertexFormat, VertexFormat.DEFAULT);
        const slices = defaultValue(options.slices, 128);

        //>>includeStart('debug', pragmas.debug);
        if (!defined(length)) {
            throw new CesiumProError("options.length must be defined.");
        }
        if (!defined(topRadius)) {
            throw new CesiumProError("options.topRadius must be defined.");
        }
        if (!defined(bottomRadius)) {
            throw new CesiumProError("options.bottomRadius must be defined.");
        }
        if (slices < 3) {
            throw new CesiumProError(
                "options.slices must be greater than or equal to 3."
            );
        }
        if (
            defined(options.offsetAttribute) &&
            options.offsetAttribute === GeometryOffsetAttribute.TOP
        ) {
            throw new CesiumProError(
                "GeometryOffsetAttribute.TOP is not a supported options.offsetAttribute for this geometry."
            );
        }
        //>>includeEnd('debug');

        this._length = length;
        this._topRadius = topRadius;
        this._bottomRadius = bottomRadius;
        this._vertexFormat = VertexFormat.clone(vertexFormat);
        this._slices = slices;
        this._offsetAttribute = options.offsetAttribute;
        this._workerName = "createCylinderGeometry-by-pro";
    }
    /**
    * The number of elements used to pack the object into an array.
    * @static
    * @type {Number}
    */
    static packedLength = VertexFormat.packedLength + 5;
    static pack(value, array, startingIndex) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(value)) {
            throw new CesiumProError("value is required");
        }
        if (!defined(array)) {
            throw new CesiumProError("array is required");
        }
        //>>includeEnd('debug');

        startingIndex = defaultValue(startingIndex, 0);

        VertexFormat.pack(value._vertexFormat, array, startingIndex);
        startingIndex += VertexFormat.packedLength;

        array[startingIndex++] = value._length;
        array[startingIndex++] = value._topRadius;
        array[startingIndex++] = value._bottomRadius;
        array[startingIndex++] = value._slices;
        array[startingIndex] = defaultValue(value._offsetAttribute, -1);

        return array;
    }
    /**
     * Retrieves an instance from a packed array.
     *
     * @param {Number[]} array The packed array.
     * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
     * @param {CylinderGeometry} [result] The object into which to store the result.
     * @returns {CylinderGeometry} The modified result parameter or a new CylinderGeometry instance if one was not provided.
     */
    static unpack(array, startingIndex, result) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(array)) {
            throw new CesiumProError("array is required");
        }
        //>>includeEnd('debug');

        startingIndex = defaultValue(startingIndex, 0);

        var vertexFormat = VertexFormat.unpack(
            array,
            startingIndex,
            scratchVertexFormat
        );
        startingIndex += VertexFormat.packedLength;

        var length = array[startingIndex++];
        var topRadius = array[startingIndex++];
        var bottomRadius = array[startingIndex++];
        var slices = array[startingIndex++];
        var offsetAttribute = array[startingIndex];

        if (!defined(result)) {
            scratchOptions.length = length;
            scratchOptions.topRadius = topRadius;
            scratchOptions.bottomRadius = bottomRadius;
            scratchOptions.slices = slices;
            scratchOptions.offsetAttribute =
                offsetAttribute === -1 ? undefined : offsetAttribute;
            return new CylinderGeometry(scratchOptions);
        }

        result._vertexFormat = VertexFormat.clone(vertexFormat, result._vertexFormat);
        result._length = length;
        result._topRadius = topRadius;
        result._bottomRadius = bottomRadius;
        result._slices = slices;
        result._offsetAttribute =
            offsetAttribute === -1 ? undefined : offsetAttribute;

        return result;
    }
    /**
     * Computes the geometric representation of a cylinder, including its vertices, indices, and a bounding sphere.
     *
     * @param {CylinderGeometry} cylinderGeometry A description of the cylinder.
     * @returns {Geometry|undefined} The computed vertices and indices.
     */
    static createGeometry(cylinderGeometry) {
        var length = cylinderGeometry._length;
        var topRadius = cylinderGeometry._topRadius;
        var bottomRadius = cylinderGeometry._bottomRadius;
        var vertexFormat = cylinderGeometry._vertexFormat;
        var slices = cylinderGeometry._slices;

        if (
            length <= 0 ||
            topRadius < 0 ||
            bottomRadius < 0 ||
            (topRadius === 0 && bottomRadius === 0)
        ) {
            return;
        }

        var twoSlices = slices + slices;
        var threeSlices = slices + twoSlices;
        var numVertices = twoSlices;

        var positions = computePositions(
            length,
            topRadius,
            bottomRadius,
            slices,
            false
        );

        var st = vertexFormat.st ? new Float32Array(numVertices * 2) : undefined;
        var normals = vertexFormat.normal
            ? new Float32Array(numVertices * 3)
            : undefined;
        var tangents = vertexFormat.tangent
            ? new Float32Array(numVertices * 3)
            : undefined;
        var bitangents = vertexFormat.bitangent
            ? new Float32Array(numVertices * 3)
            : undefined;

        var i;
        var computeNormal =
            vertexFormat.normal || vertexFormat.tangent || vertexFormat.bitangent;

        if (computeNormal) {
            var computeTangent = vertexFormat.tangent || vertexFormat.bitangent;

            var normalIndex = 0;
            var tangentIndex = 0;
            var bitangentIndex = 0;

            var theta = Math.atan2(bottomRadius - topRadius, length);
            var normal = normalScratch;
            normal.z = Math.sin(theta);
            var normalScale = Math.cos(theta);
            var tangent = tangentScratch;
            var bitangent = bitangentScratch;

            for (i = 0; i < slices; i++) {
                var angle = (i / slices) * CesiumMath.TWO_PI;
                var x = normalScale * Math.cos(angle);
                var y = normalScale * Math.sin(angle);
                if (computeNormal) {
                    normal.x = x;
                    normal.y = y;

                    if (computeTangent) {
                        tangent = Cartesian3.normalize(
                            Cartesian3.cross(Cartesian3.UNIT_Z, normal, tangent),
                            tangent
                        );
                    }

                    if (vertexFormat.normal) {
                        normals[normalIndex++] = normal.x;
                        normals[normalIndex++] = normal.y;
                        normals[normalIndex++] = normal.z;
                        normals[normalIndex++] = normal.x;
                        normals[normalIndex++] = normal.y;
                        normals[normalIndex++] = normal.z;
                    }

                    if (vertexFormat.tangent) {
                        tangents[tangentIndex++] = tangent.x;
                        tangents[tangentIndex++] = tangent.y;
                        tangents[tangentIndex++] = tangent.z;
                        tangents[tangentIndex++] = tangent.x;
                        tangents[tangentIndex++] = tangent.y;
                        tangents[tangentIndex++] = tangent.z;
                    }

                    if (vertexFormat.bitangent) {
                        bitangent = Cartesian3.normalize(
                            Cartesian3.cross(normal, tangent, bitangent),
                            bitangent
                        );
                        bitangents[bitangentIndex++] = bitangent.x;
                        bitangents[bitangentIndex++] = bitangent.y;
                        bitangents[bitangentIndex++] = bitangent.z;
                        bitangents[bitangentIndex++] = bitangent.x;
                        bitangents[bitangentIndex++] = bitangent.y;
                        bitangents[bitangentIndex++] = bitangent.z;
                    }
                }
            }

            for (i = 0; i < slices; i++) {
                if (vertexFormat.normal) {
                    normals[normalIndex++] = 0;
                    normals[normalIndex++] = 0;
                    normals[normalIndex++] = -1;
                }
                if (vertexFormat.tangent) {
                    tangents[tangentIndex++] = 1;
                    tangents[tangentIndex++] = 0;
                    tangents[tangentIndex++] = 0;
                }
                if (vertexFormat.bitangent) {
                    bitangents[bitangentIndex++] = 0;
                    bitangents[bitangentIndex++] = -1;
                    bitangents[bitangentIndex++] = 0;
                }
            }

            for (i = 0; i < slices; i++) {
                if (vertexFormat.normal) {
                    normals[normalIndex++] = 0;
                    normals[normalIndex++] = 0;
                    normals[normalIndex++] = 1;
                }
                if (vertexFormat.tangent) {
                    tangents[tangentIndex++] = 1;
                    tangents[tangentIndex++] = 0;
                    tangents[tangentIndex++] = 0;
                }
                if (vertexFormat.bitangent) {
                    bitangents[bitangentIndex++] = 0;
                    bitangents[bitangentIndex++] = 1;
                    bitangents[bitangentIndex++] = 0;
                }
            }
        }

        var numIndices = 6 * slices;
        var indices = IndexDatatype.createTypedArray(numVertices, numIndices);
        var index = 0;
        var j = 0;
        const halfVertex = slices;
        for (i = 0; i < slices - 1; i++) {
            indices[index++] = i;
            indices[index++] = halfVertex + i;
            indices[index++] = halfVertex + i + 1;

            indices[index++] = i;
            indices[index++] = halfVertex + i + 1;
            indices[index++] = i + 1;
            j++;
        }
        indices[index++] = j;
        indices[index++] = halfVertex + j;
        indices[index++] = halfVertex;
        indices[index++] = j;
        indices[index++] = halfVertex;
        indices[index++] = 0;

        var textureCoordIndex = 0;
        if (vertexFormat.st) {
            const v = 1 / slices;
            for (i = 0; i < slices; i++) {
                st[i] = v;
                st[i+1] = 0;
                st[slices + i] = v;
                st[slices + i + 1] = 1;
            }
        }

        var attributes = new GeometryAttributes();
        if (vertexFormat.position) {
            attributes.position = new GeometryAttribute({
                componentDatatype: ComponentDatatype.DOUBLE,
                componentsPerAttribute: 3,
                values: positions,
            });
        }

        if (vertexFormat.normal) {
            attributes.normal = new GeometryAttribute({
                componentDatatype: ComponentDatatype.FLOAT,
                componentsPerAttribute: 3,
                values: normals,
            });
        }

        if (vertexFormat.tangent) {
            attributes.tangent = new GeometryAttribute({
                componentDatatype: ComponentDatatype.FLOAT,
                componentsPerAttribute: 3,
                values: tangents,
            });
        }

        if (vertexFormat.bitangent) {
            attributes.bitangent = new GeometryAttribute({
                componentDatatype: ComponentDatatype.FLOAT,
                componentsPerAttribute: 3,
                values: bitangents,
            });
        }

        if (vertexFormat.st) {
            attributes.st = new GeometryAttribute({
                componentDatatype: ComponentDatatype.FLOAT,
                componentsPerAttribute: 2,
                values: st,
            });
        }

        radiusScratch.x = length * 0.5;
        radiusScratch.y = Math.max(bottomRadius, topRadius);

        var boundingSphere = new BoundingSphere(
            Cartesian3.ZERO,
            Cartesian2.magnitude(radiusScratch)
        );

        if (defined(cylinderGeometry._offsetAttribute)) {
            length = positions.length;
            var applyOffset = new Uint8Array(length / 3);
            var offsetValue =
                cylinderGeometry._offsetAttribute === GeometryOffsetAttribute.NONE
                    ? 0
                    : 1;
            (applyOffset, offsetValue);
            attributes.applyOffset = new GeometryAttribute({
                componentDatatype: ComponentDatatype.UNSIGNED_BYTE,
                componentsPerAttribute: 1,
                values: applyOffset,
            });
        }

        return new Geometry({
            attributes: attributes,
            indices: indices,
            primitiveType: PrimitiveType.TRIANGLES,
            boundingSphere: boundingSphere,
            offsetAttribute: cylinderGeometry._offsetAttribute,
        });
    }
    /**
     * Returns the geometric representation of a unit cylinder, including its vertices, indices, and a bounding sphere.
     * @returns {Geometry} The computed vertices and indices.
     *
     * @private
     */
    static getUnitCylinder() {
        if (!defined(unitCylinderGeometry)) {
            unitCylinderGeometry = CylinderGeometry.createGeometry(
                new CylinderGeometry({
                    topRadius: 1.0,
                    bottomRadius: 1.0,
                    length: 1.0,
                    vertexFormat: VertexFormat.POSITION_ONLY,
                })
            );
        }
        return unitCylinderGeometry;
    };
}
export default CylinderGeometry;
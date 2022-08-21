const {
    Primitive,
    ShaderProgram,
    defined,
    DeveloperError,
    defaultValue,
    ShaderSource 
} = Cesium;

const update = Primitive.prototype.update;
function appendPickToVertexShader(source) {
    var renamedVS = ShaderSource.replaceMain(source, "czm_non_pick_main");
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
    modifiedVS = ShaderSource.replaceMain(modifiedVS, "czm_non_compressed_main");
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
                throw new DeveloperError(
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
    var modifiedVS = ShaderSource.replaceMain(
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
    var modifiedFS = ShaderSource.replaceMain(
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
    vs = Primitive._appendOffsetToShader(primitive, vs);
    vs = Primitive._appendShowToShader(primitive, vs);
    vs = Primitive._appendDistanceDisplayConditionToShader(
        primitive,
        vs,
        frameState.scene3DOnly
    );
    vs = appendPickToVertexShader(vs);
    vs = Primitive._updateColorAttribute(primitive, vs, false);
    vs = modifyForEncodedNormals(primitive, vs);
    vs = Primitive._modifyShaderPosition(primitive, vs, frameState.scene3DOnly);
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
        vs = Primitive._appendShowToShader(primitive, vs);
        vs = Primitive._appendDistanceDisplayConditionToShader(
            primitive,
            vs,
            frameState.scene3DOnly
        );
        vs = appendPickToVertexShader(vs);
        vs = Primitive._updateColorAttribute(primitive, vs, true);
        vs = modifyForEncodedNormals(primitive, vs);
        vs = Primitive._modifyShaderPosition(primitive, vs, frameState.scene3DOnly);
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

export default function () {
    Object.defineProperty(Primitive.prototype, 'needUpdate', {
        get() {
            return !!this._needUpdate;
        },
        set(val) {
            this._needUpdate = val;
        }
    })
    Primitive.prototype.update = function (frameState) {
        update.call(this, frameState);
        // override
        if (this.needUpdate) {
            var spFunc = defaultValue(
                this._createShaderProgramFunction,
                createShaderProgram
            );
            console.log('update shader')
            spFunc(this, frameState, appearance);
            this.needUpdate = false;
        }
    }
}
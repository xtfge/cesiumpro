const {
    ShaderProgram,
    RuntimeError,
    createUniform,
    defined,
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
            return uniformState.frameState.context.drawingBufferWidth;
        },
    }),
    czm_p_drawingBufferHeight: new AutomaticUniform({
        size: 1,
        datatype: WebGLConstants.FLOAT,
        getValue: function (uniformState) {
            return uniformState.frameState.context.drawingBufferHeight;
        },
    }),
    czm_p_splitPosition: new AutomaticUniform({
        size: 1,
        datatype: WebGLConstants.FLOAT,
        getValue: function (uniformState) {
            return uniformState.frameState.splitPosition;
        },
    }),
}
function initialize(shader) {
    if (defined(shader._program)) {
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
    if (defined(attributeLocations)) {
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
            if (defined(debugShaders)) {
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
            if (defined(debugShaders)) {
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
        if (defined(debugShaders)) {
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
        if (defined(log) && log.length > 0) {
            console.log(consolePrefix + "Vertex shader compile log: " + log);
        }
    }

    if (logShaderCompilation) {
        log = gl.getShaderInfoLog(fragmentShader);
        if (defined(log) && log.length > 0) {
            console.log(consolePrefix + "Fragment shader compile log: " + log);
        }
    }

    if (logShaderCompilation) {
        log = gl.getProgramInfoLog(program);
        if (defined(log) && log.length > 0) {
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
                    if (!defined(uniformArray)) {
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
            if (defined(duplicateUniform)) {
                uniformObject.name = duplicateUniform;
                uniformName = duplicateUniform;
            }
            var automaticUniform = AutomaticUniforms[uniformName];
            if (defined(automaticUniform)) {
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
function override() {
    const originPrototype = ShaderProgram.prototype;
    ShaderProgram.prototype = {}
    ShaderProgram.prototype._bind = function () {
        initialize(this);
        this._gl.useProgram(this._program);
    };
    ShaderProgram.prototype.destroy = originPrototype.destroy;
    ShaderProgram.prototype._setUniforms = function (uniformMap,
        uniformState,
        validate) {
        originPrototype._setUniforms.call(this, uniformMap,
            uniformState,
            validate)
    };
    ShaderProgram.prototype.isDestroyed = originPrototype.isDestroyed;
    ShaderProgram.prototype.finalDestroy = originPrototype.finalDestroy;

    Object.defineProperties(ShaderProgram.prototype, {
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
    })
}
export default override;
/**
 * netcdfjs - Read and explore NetCDF files
 * @version v1.0.0
 * @link https://github.com/cheminfo-js/netcdfjs
 * @license MIT
 */
var NetCDFReaderExport;
(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  else if (typeof define === 'function' && define.amd)
    define([], factory);
  else if (typeof exports === 'object')
    exports["netcdfjs"] = factory();
  else
    root["netcdfjs"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
  return /******/ (function(modules) { // webpackBootstrap
    /******/ // The module cache
    /******/
    var installedModules = {};
    /******/
    /******/ // The require function
    /******/
    function __webpack_require__(moduleId) {
      /******/
      /******/ // Check if module is in cache
      /******/
      if (installedModules[moduleId]) {
        /******/
        return installedModules[moduleId].exports;
        /******/
      }
      /******/ // Create a new module (and put it into the cache)
      /******/
      var module = installedModules[moduleId] = {
        /******/
        i: moduleId,
        /******/
        l: false,
        /******/
        exports: {}
        /******/
      };
      /******/
      /******/ // Execute the module function
      /******/
      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      /******/
      /******/ // Flag the module as loaded
      /******/
      module.l = true;
      /******/
      /******/ // Return the exports of the module
      /******/
      return module.exports;
      /******/
    }
    /******/
    /******/
    /******/ // expose the modules object (__webpack_modules__)
    /******/
    __webpack_require__.m = modules;
    /******/
    /******/ // expose the module cache
    /******/
    __webpack_require__.c = installedModules;
    /******/
    /******/ // define getter function for harmony exports
    /******/
    __webpack_require__.d = function(exports, name, getter) {
      /******/
      if (!__webpack_require__.o(exports, name)) {
        /******/
        Object.defineProperty(exports, name, {
          enumerable: true,
          get: getter
        });
        /******/
      }
      /******/
    };
    /******/
    /******/ // define __esModule on exports
    /******/
    __webpack_require__.r = function(exports) {
      /******/
      if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        /******/
        Object.defineProperty(exports, Symbol.toStringTag, {
          value: 'Module'
        });
        /******/
      }
      /******/
      Object.defineProperty(exports, '__esModule', {
        value: true
      });
      /******/
    };
    /******/
    /******/ // create a fake namespace object
    /******/ // mode & 1: value is a module id, require it
    /******/ // mode & 2: merge all properties of value into the ns
    /******/ // mode & 4: return value when already ns object
    /******/ // mode & 8|1: behave like require
    /******/
    __webpack_require__.t = function(value, mode) {
      /******/
      if (mode & 1) value = __webpack_require__(value);
      /******/
      if (mode & 8) return value;
      /******/
      if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
      /******/
      var ns = Object.create(null);
      /******/
      __webpack_require__.r(ns);
      /******/
      Object.defineProperty(ns, 'default', {
        enumerable: true,
        value: value
      });
      /******/
      if (mode & 2 && typeof value != 'string')
        for (var key in value) __webpack_require__.d(ns, key, function(key) {
          return value[key];
        }.bind(null, key));
      /******/
      return ns;
      /******/
    };
    /******/
    /******/ // getDefaultExport function for compatibility with non-harmony modules
    /******/
    __webpack_require__.n = function(module) {
      /******/
      var getter = module && module.__esModule ?
        /******/
        function getDefault() {
          return module['default'];
        } :
        /******/
        function getModuleExports() {
          return module;
        };
      /******/
      __webpack_require__.d(getter, 'a', getter);
      /******/
      return getter;
      /******/
    };
    /******/
    /******/ // Object.prototype.hasOwnProperty.call
    /******/
    __webpack_require__.o = function(object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    };
    /******/
    /******/ // __webpack_public_path__
    /******/
    __webpack_require__.p = "";
    /******/
    /******/
    /******/ // Load entry module and return exports
    /******/
    return __webpack_require__(__webpack_require__.s = 3);
    /******/
  })
  /************************************************************************/
  /******/
  ([
    /* 0 */
    /***/
    (function(module, exports, __webpack_require__) {

      "use strict";

      /**
       * Throws a non-valid NetCDF exception if the statement it's true
       * @ignore
       * @param {boolean} statement - Throws if true
       * @param {string} reason - Reason to throw
       */

      function notNetcdf(statement, reason) {
        if (statement) {
          throw new TypeError("Not a valid NetCDF v3.x file: ".concat(reason));
        }
      }
      /**
       * Moves 1, 2, or 3 bytes to next 4-byte boundary
       * @ignore
       * @param {IOBuffer} buffer - Buffer for the file data
       */


      function padding(buffer) {
        if (buffer.offset % 4 !== 0) {
          buffer.skip(4 - buffer.offset % 4);
        }
      }
      /**
       * Reads the name
       * @ignore
       * @param {IOBuffer} buffer - Buffer for the file data
       * @return {string} - Name
       */


      function readName(buffer) {
        // Read name
        var nameLength = buffer.readUint32();
        var name = buffer.readChars(nameLength); // validate name
        // TODO
        // Apply padding

        padding(buffer);
        return name;
      }

      module.exports.notNetcdf = notNetcdf;
      module.exports.padding = padding;
      module.exports.readName = readName;

      /***/
    }),
    /* 1 */
    /***/
    (function(module, exports, __webpack_require__) {

      /*! https://mths.be/utf8js v3.0.0 by @mathias */
      ;

      (function(root) {
        var stringFromCharCode = String.fromCharCode; // Taken from https://mths.be/punycode

        function ucs2decode(string) {
          var output = [];
          var counter = 0;
          var length = string.length;
          var value;
          var extra;

          while (counter < length) {
            value = string.charCodeAt(counter++);

            if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
              // high surrogate, and there is a next character
              extra = string.charCodeAt(counter++);

              if ((extra & 0xFC00) == 0xDC00) {
                // low surrogate
                output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
              } else {
                // unmatched surrogate; only append this code unit, in case the next
                // code unit is the high surrogate of a surrogate pair
                output.push(value);
                counter--;
              }
            } else {
              output.push(value);
            }
          }

          return output;
        } // Taken from https://mths.be/punycode


        function ucs2encode(array) {
          var length = array.length;
          var index = -1;
          var value;
          var output = '';

          while (++index < length) {
            value = array[index];

            if (value > 0xFFFF) {
              value -= 0x10000;
              output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
              value = 0xDC00 | value & 0x3FF;
            }

            output += stringFromCharCode(value);
          }

          return output;
        }

        function checkScalarValue(codePoint) {
          if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
            throw Error('Lone surrogate U+' + codePoint.toString(16).toUpperCase() + ' is not a scalar value');
          }
        }
        /*--------------------------------------------------------------------------*/


        function createByte(codePoint, shift) {
          return stringFromCharCode(codePoint >> shift & 0x3F | 0x80);
        }

        function encodeCodePoint(codePoint) {
          if ((codePoint & 0xFFFFFF80) == 0) {
            // 1-byte sequence
            return stringFromCharCode(codePoint);
          }

          var symbol = '';

          if ((codePoint & 0xFFFFF800) == 0) {
            // 2-byte sequence
            symbol = stringFromCharCode(codePoint >> 6 & 0x1F | 0xC0);
          } else if ((codePoint & 0xFFFF0000) == 0) {
            // 3-byte sequence
            checkScalarValue(codePoint);
            symbol = stringFromCharCode(codePoint >> 12 & 0x0F | 0xE0);
            symbol += createByte(codePoint, 6);
          } else if ((codePoint & 0xFFE00000) == 0) {
            // 4-byte sequence
            symbol = stringFromCharCode(codePoint >> 18 & 0x07 | 0xF0);
            symbol += createByte(codePoint, 12);
            symbol += createByte(codePoint, 6);
          }

          symbol += stringFromCharCode(codePoint & 0x3F | 0x80);
          return symbol;
        }

        function utf8encode(string) {
          var codePoints = ucs2decode(string);
          var length = codePoints.length;
          var index = -1;
          var codePoint;
          var byteString = '';

          while (++index < length) {
            codePoint = codePoints[index];
            byteString += encodeCodePoint(codePoint);
          }

          return byteString;
        }
        /*--------------------------------------------------------------------------*/


        function readContinuationByte() {
          if (byteIndex >= byteCount) {
            throw Error('Invalid byte index');
          }

          var continuationByte = byteArray[byteIndex] & 0xFF;
          byteIndex++;

          if ((continuationByte & 0xC0) == 0x80) {
            return continuationByte & 0x3F;
          } // If we end up here, it’s not a continuation byte


          throw Error('Invalid continuation byte');
        }

        function decodeSymbol() {
          var byte1;
          var byte2;
          var byte3;
          var byte4;
          var codePoint;

          if (byteIndex > byteCount) {
            throw Error('Invalid byte index');
          }

          if (byteIndex == byteCount) {
            return false;
          } // Read first byte


          byte1 = byteArray[byteIndex] & 0xFF;
          byteIndex++; // 1-byte sequence (no continuation bytes)

          if ((byte1 & 0x80) == 0) {
            return byte1;
          } // 2-byte sequence


          if ((byte1 & 0xE0) == 0xC0) {
            byte2 = readContinuationByte();
            codePoint = (byte1 & 0x1F) << 6 | byte2;

            if (codePoint >= 0x80) {
              return codePoint;
            } else {
              throw Error('Invalid continuation byte');
            }
          } // 3-byte sequence (may include unpaired surrogates)


          if ((byte1 & 0xF0) == 0xE0) {
            byte2 = readContinuationByte();
            byte3 = readContinuationByte();
            codePoint = (byte1 & 0x0F) << 12 | byte2 << 6 | byte3;

            if (codePoint >= 0x0800) {
              checkScalarValue(codePoint);
              return codePoint;
            } else {
              throw Error('Invalid continuation byte');
            }
          } // 4-byte sequence


          if ((byte1 & 0xF8) == 0xF0) {
            byte2 = readContinuationByte();
            byte3 = readContinuationByte();
            byte4 = readContinuationByte();
            codePoint = (byte1 & 0x07) << 0x12 | byte2 << 0x0C | byte3 << 0x06 | byte4;

            if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
              return codePoint;
            }
          }

          throw Error('Invalid UTF-8 detected');
        }

        var byteArray;
        var byteCount;
        var byteIndex;

        function utf8decode(byteString) {
          byteArray = ucs2decode(byteString);
          byteCount = byteArray.length;
          byteIndex = 0;
          var codePoints = [];
          var tmp;

          while ((tmp = decodeSymbol()) !== false) {
            codePoints.push(tmp);
          }

          return ucs2encode(codePoints);
        }
        /*--------------------------------------------------------------------------*/


        root.version = '3.0.0';
        root.encode = utf8encode;
        root.decode = utf8decode;
      })(false ? undefined : exports);

      /***/
    }),
    /* 2 */
    /***/
    (function(module, exports, __webpack_require__) {

      "use strict";


      const notNetcdf = __webpack_require__(0).notNetcdf;

      const types = {
        BYTE: 1,
        CHAR: 2,
        SHORT: 3,
        INT: 4,
        FLOAT: 5,
        DOUBLE: 6
      };
      /**
       * Parse a number into their respective type
       * @ignore
       * @param {number} type - integer that represents the type
       * @return {string} - parsed value of the type
       */

      function num2str(type) {
        switch (Number(type)) {
          case types.BYTE:
            return 'byte';

          case types.CHAR:
            return 'char';

          case types.SHORT:
            return 'short';

          case types.INT:
            return 'int';

          case types.FLOAT:
            return 'float';

          case types.DOUBLE:
            return 'double';

            /* istanbul ignore next */

          default:
            return 'undefined';
        }
      }
      /**
       * Parse a number type identifier to his size in bytes
       * @ignore
       * @param {number} type - integer that represents the type
       * @return {number} -size of the type
       */


      function num2bytes(type) {
        switch (Number(type)) {
          case types.BYTE:
            return 1;

          case types.CHAR:
            return 1;

          case types.SHORT:
            return 2;

          case types.INT:
            return 4;

          case types.FLOAT:
            return 4;

          case types.DOUBLE:
            return 8;

            /* istanbul ignore next */

          default:
            return -1;
        }
      }
      /**
       * Reverse search of num2str
       * @ignore
       * @param {string} type - string that represents the type
       * @return {number} - parsed value of the type
       */


      function str2num(type) {
        switch (String(type)) {
          case 'byte':
            return types.BYTE;

          case 'char':
            return types.CHAR;

          case 'short':
            return types.SHORT;

          case 'int':
            return types.INT;

          case 'float':
            return types.FLOAT;

          case 'double':
            return types.DOUBLE;

            /* istanbul ignore next */

          default:
            return -1;
        }
      }
      /**
       * Auxiliary function to read numeric data
       * @ignore
       * @param {number} size - Size of the element to read
       * @param {function} bufferReader - Function to read next value
       * @return {Array<number>|number}
       */


      function readNumber(size, bufferReader) {
        if (size !== 1) {
          var numbers = new Array(size);

          for (var i = 0; i < size; i++) {
            numbers[i] = bufferReader();
          }

          return numbers;
        } else {
          return bufferReader();
        }
      }
      /**
       * Given a type and a size reads the next element
       * @ignore
       * @param {IOBuffer} buffer - Buffer for the file data
       * @param {number} type - Type of the data to read
       * @param {number} size - Size of the element to read
       * @return {string|Array<number>|number}
       */


      function readType(buffer, type, size) {
        switch (type) {
          case types.BYTE:
            return buffer.readBytes(size);

          case types.CHAR:
            return trimNull(buffer.readChars(size));

          case types.SHORT:
            return readNumber(size, buffer.readInt16.bind(buffer));

          case types.INT:
            return readNumber(size, buffer.readInt32.bind(buffer));

          case types.FLOAT:
            return readNumber(size, buffer.readFloat32.bind(buffer));

          case types.DOUBLE:
            return readNumber(size, buffer.readFloat64.bind(buffer));

            /* istanbul ignore next */

          default:
            notNetcdf(true, "non valid type ".concat(type));
            return undefined;
        }
      }
      /**
       * Removes null terminate value
       * @ignore
       * @param {string} value - String to trim
       * @return {string} - Trimmed string
       */


      function trimNull(value) {
        if (value.charCodeAt(value.length - 1) === 0) {
          return value.substring(0, value.length - 1);
        }

        return value;
      }

      module.exports = types;
      module.exports.num2str = num2str;
      module.exports.num2bytes = num2bytes;
      module.exports.str2num = str2num;
      module.exports.readType = readType;

      /***/
    }),
    /* 3 */
    /***/
    (function(module, exports, __webpack_require__) {

      "use strict";


      const {
        IOBuffer
      } = __webpack_require__(4);

      const utils = __webpack_require__(0);

      const data = __webpack_require__(5);

      const readHeader = __webpack_require__(6);

      const toString = __webpack_require__(7);
      /**
       * Reads a NetCDF v3.x file
       * https://www.unidata.ucar.edu/software/netcdf/docs/file_format_specifications.html
       * @param {ArrayBuffer} data - ArrayBuffer or any Typed Array (including Node.js' Buffer from v4) with the data
       * @constructor
       */


      class NetCDFReader {
        constructor(data) {
          const buffer = new IOBuffer(data);
          buffer.setBigEndian(); // Validate that it's a NetCDF file

          utils.notNetcdf(buffer.readChars(3) !== 'CDF', 'should start with CDF'); // Check the NetCDF format

          const version = buffer.readByte();
          utils.notNetcdf(version > 2, 'unknown version'); // Read the header

          this.header = readHeader(buffer, version);
          this.buffer = buffer;
        }
        /**
         * @return {string} - Version for the NetCDF format
         */


        get version() {
          if (this.header.version === 1) {
            return 'classic format';
          } else {
            return '64-bit offset format';
          }
        }
        /**
         * @return {object} - Metadata for the record dimension
         *  * `length`: Number of elements in the record dimension
         *  * `id`: Id number in the list of dimensions for the record dimension
         *  * `name`: String with the name of the record dimension
         *  * `recordStep`: Number with the record variables step size
         */


        get recordDimension() {
          return this.header.recordDimension;
        }
        /**
         * @return {Array<object>} - List of dimensions with:
         *  * `name`: String with the name of the dimension
         *  * `size`: Number with the size of the dimension
         */


        get dimensions() {
          return this.header.dimensions;
        }
        /**
         * @return {Array<object>} - List of global attributes with:
         *  * `name`: String with the name of the attribute
         *  * `type`: String with the type of the attribute
         *  * `value`: A number or string with the value of the attribute
         */


        get globalAttributes() {
          return this.header.globalAttributes;
        }
        /**
         * Returns the value of an attribute
         * @param {string} attributeName
         * @return {string} Value of the attributeName or null
         */


        getAttribute(attributeName) {
          const attribute = this.globalAttributes.find(val => val.name === attributeName);
          if (attribute) return attribute.value;
          return null;
        }
        /**
         * Returns the value of a variable as a string
         * @param {string} variableName
         * @return {string} Value of the variable as a string or null
         */


        getDataVariableAsString(variableName) {
          const variable = this.getDataVariable(variableName);
          if (variable) return variable.join('');
          return null;
        }
        /**
         * @return {Array<object>} - List of variables with:
         *  * `name`: String with the name of the variable
         *  * `dimensions`: Array with the dimension IDs of the variable
         *  * `attributes`: Array with the attributes of the variable
         *  * `type`: String with the type of the variable
         *  * `size`: Number with the size of the variable
         *  * `offset`: Number with the offset where of the variable begins
         *  * `record`: True if is a record variable, false otherwise
         */


        get variables() {
          return this.header.variables;
        }

        toString() {
          return toString.call(this);
        }
        /**
         * Retrieves the data for a given variable
         * @param {string|object} variableName - Name of the variable to search or variable object
         * @return {Array} - List with the variable values
         */


        getDataVariable(variableName) {
          let variable;

          if (typeof variableName === 'string') {
            // search the variable
            variable = this.header.variables.find(function(val) {
              return val.name === variableName;
            });
          } else {
            variable = variableName;
          } // throws if variable not found


          utils.notNetcdf(variable === undefined, "variable not found: ".concat(variableName)); // go to the offset position

          this.buffer.seek(variable.offset);

          if (variable.record) {
            // record variable case
            return data.record(this.buffer, variable, this.header.recordDimension);
          } else {
            // non-record variable case
            return data.nonRecord(this.buffer, variable);
          }
        }
        /**
         * Check if a dataVariable exists
         * @param {string} variableName - Name of the variable to find
         * @return {boolean}
         */


        dataVariableExists(variableName) {
          const variable = this.header.variables.find(function(val) {
            return val.name === variableName;
          });
          return variable !== undefined;
        }
        /**
         * Check if an attribute exists
         * @param {string} attributeName - Name of the attribute to find
         * @return {boolean}
         */


        attributeExists(attributeName) {
          const attribute = this.globalAttributes.find(val => val.name === attributeName);
          return attribute !== undefined;
        }

      }

      module.exports = NetCDFReader;
      NetCDFReaderExport = NetCDFReader

      /***/
    }),
    /* 4 */
    /***/
    (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */
      __webpack_require__.d(__webpack_exports__, "IOBuffer", function() {
        return IOBuffer;
      });
      /* harmony import */
      var utf8__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
      /* harmony import */
      var utf8__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(utf8__WEBPACK_IMPORTED_MODULE_0__);

      const defaultByteLength = 1024 * 8;
      class IOBuffer {
        /**
         * @param data - The data to construct the IOBuffer with.
         * If data is a number, it will be the new buffer's length<br>
         * If data is `undefined`, the buffer will be initialized with a default length of 8Kb<br>
         * If data is an ArrayBuffer, SharedArrayBuffer, an ArrayBufferView (Typed Array), an IOBuffer instance,
         * or a Node.js Buffer, a view will be created over the underlying ArrayBuffer.
         * @param options
         */
        constructor() {
          let data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultByteLength;
          let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          let dataIsGiven = false;

          if (typeof data === 'number') {
            data = new ArrayBuffer(data);
          } else {
            dataIsGiven = true;
            this.lastWrittenByte = data.byteLength;
          }

          const offset = options.offset ? options.offset >>> 0 : 0;
          const byteLength = data.byteLength - offset;
          let dvOffset = offset;

          if (ArrayBuffer.isView(data) || data instanceof IOBuffer) {
            if (data.byteLength !== data.buffer.byteLength) {
              dvOffset = data.byteOffset + offset;
            }

            data = data.buffer;
          }

          if (dataIsGiven) {
            this.lastWrittenByte = byteLength;
          } else {
            this.lastWrittenByte = 0;
          }

          this.buffer = data;
          this.length = byteLength;
          this.byteLength = byteLength;
          this.byteOffset = dvOffset;
          this.offset = 0;
          this.littleEndian = true;
          this._data = new DataView(this.buffer, dvOffset, byteLength);
          this._mark = 0;
          this._marks = [];
        }
        /**
         * Checks if the memory allocated to the buffer is sufficient to store more
         * bytes after the offset.
         * @param byteLength - The needed memory in bytes.
         * @returns `true` if there is sufficient space and `false` otherwise.
         */


        available() {
          let byteLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
          return this.offset + byteLength <= this.length;
        }
        /**
         * Check if little-endian mode is used for reading and writing multi-byte
         * values.
         * @returns `true` if little-endian mode is used, `false` otherwise.
         */


        isLittleEndian() {
          return this.littleEndian;
        }
        /**
         * Set little-endian mode for reading and writing multi-byte values.
         */


        setLittleEndian() {
          this.littleEndian = true;
          return this;
        }
        /**
         * Check if big-endian mode is used for reading and writing multi-byte values.
         * @returns `true` if big-endian mode is used, `false` otherwise.
         */


        isBigEndian() {
          return !this.littleEndian;
        }
        /**
         * Switches to big-endian mode for reading and writing multi-byte values.
         */


        setBigEndian() {
          this.littleEndian = false;
          return this;
        }
        /**
         * Move the pointer n bytes forward.
         * @param n - Number of bytes to skip.
         */


        skip() {
          let n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
          this.offset += n;
          return this;
        }
        /**
         * Move the pointer to the given offset.
         * @param offset
         */


        seek(offset) {
          this.offset = offset;
          return this;
        }
        /**
         * Store the current pointer offset.
         * @see {@link IOBuffer#reset}
         */


        mark() {
          this._mark = this.offset;
          return this;
        }
        /**
         * Move the pointer back to the last pointer offset set by mark.
         * @see {@link IOBuffer#mark}
         */


        reset() {
          this.offset = this._mark;
          return this;
        }
        /**
         * Push the current pointer offset to the mark stack.
         * @see {@link IOBuffer#popMark}
         */


        pushMark() {
          this._marks.push(this.offset);

          return this;
        }
        /**
         * Pop the last pointer offset from the mark stack, and set the current
         * pointer offset to the popped value.
         * @see {@link IOBuffer#pushMark}
         */


        popMark() {
          const offset = this._marks.pop();

          if (offset === undefined) {
            throw new Error('Mark stack empty');
          }

          this.seek(offset);
          return this;
        }
        /**
         * Move the pointer offset back to 0.
         */


        rewind() {
          this.offset = 0;
          return this;
        }
        /**
         * Make sure the buffer has sufficient memory to write a given byteLength at
         * the current pointer offset.
         * If the buffer's memory is insufficient, this method will create a new
         * buffer (a copy) with a length that is twice (byteLength + current offset).
         * @param byteLength
         */


        ensureAvailable() {
          let byteLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

          if (!this.available(byteLength)) {
            const lengthNeeded = this.offset + byteLength;
            const newLength = lengthNeeded * 2;
            const newArray = new Uint8Array(newLength);
            newArray.set(new Uint8Array(this.buffer));
            this.buffer = newArray.buffer;
            this.length = this.byteLength = newLength;
            this._data = new DataView(this.buffer);
          }

          return this;
        }
        /**
         * Read a byte and return false if the byte's value is 0, or true otherwise.
         * Moves pointer forward by one byte.
         */


        readBoolean() {
          return this.readUint8() !== 0;
        }
        /**
         * Read a signed 8-bit integer and move pointer forward by 1 byte.
         */


        readInt8() {
          return this._data.getInt8(this.offset++);
        }
        /**
         * Read an unsigned 8-bit integer and move pointer forward by 1 byte.
         */


        readUint8() {
          return this._data.getUint8(this.offset++);
        }
        /**
         * Alias for {@link IOBuffer#readUint8}.
         */


        readByte() {
          return this.readUint8();
        }
        /**
         * Read `n` bytes and move pointer forward by `n` bytes.
         */


        readBytes() {
          let n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
          const bytes = new Uint8Array(n);

          for (let i = 0; i < n; i++) {
            bytes[i] = this.readByte();
          }

          return bytes;
        }
        /**
         * Read a 16-bit signed integer and move pointer forward by 2 bytes.
         */


        readInt16() {
          const value = this._data.getInt16(this.offset, this.littleEndian);

          this.offset += 2;
          return value;
        }
        /**
         * Read a 16-bit unsigned integer and move pointer forward by 2 bytes.
         */


        readUint16() {
          const value = this._data.getUint16(this.offset, this.littleEndian);

          this.offset += 2;
          return value;
        }
        /**
         * Read a 32-bit signed integer and move pointer forward by 4 bytes.
         */


        readInt32() {
          const value = this._data.getInt32(this.offset, this.littleEndian);

          this.offset += 4;
          return value;
        }
        /**
         * Read a 32-bit unsigned integer and move pointer forward by 4 bytes.
         */


        readUint32() {
          const value = this._data.getUint32(this.offset, this.littleEndian);

          this.offset += 4;
          return value;
        }
        /**
         * Read a 32-bit floating number and move pointer forward by 4 bytes.
         */


        readFloat32() {
          const value = this._data.getFloat32(this.offset, this.littleEndian);

          this.offset += 4;
          return value;
        }
        /**
         * Read a 64-bit floating number and move pointer forward by 8 bytes.
         */


        readFloat64() {
          const value = this._data.getFloat64(this.offset, this.littleEndian);

          this.offset += 8;
          return value;
        }
        /**
         * Read a 1-byte ASCII character and move pointer forward by 1 byte.
         */


        readChar() {
          return String.fromCharCode(this.readInt8());
        }
        /**
         * Read `n` 1-byte ASCII characters and move pointer forward by `n` bytes.
         */


        readChars() {
          let n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
          let result = '';

          for (let i = 0; i < n; i++) {
            result += this.readChar();
          }

          return result;
        }
        /**
         * Read the next `n` bytes, return a UTF-8 decoded string and move pointer
         * forward by `n` bytes.
         */


        readUtf8() {
          let n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
          const bString = this.readChars(n);
          return Object(utf8__WEBPACK_IMPORTED_MODULE_0__["decode"])(bString);
        }
        /**
         * Write 0xff if the passed value is truthy, 0x00 otherwise and move pointer
         * forward by 1 byte.
         */


        writeBoolean(value) {
          this.writeUint8(value ? 0xff : 0x00);
          return this;
        }
        /**
         * Write `value` as an 8-bit signed integer and move pointer forward by 1 byte.
         */


        writeInt8(value) {
          this.ensureAvailable(1);

          this._data.setInt8(this.offset++, value);

          this._updateLastWrittenByte();

          return this;
        }
        /**
         * Write `value` as an 8-bit unsigned integer and move pointer forward by 1
         * byte.
         */


        writeUint8(value) {
          this.ensureAvailable(1);

          this._data.setUint8(this.offset++, value);

          this._updateLastWrittenByte();

          return this;
        }
        /**
         * An alias for {@link IOBuffer#writeUint8}.
         */


        writeByte(value) {
          return this.writeUint8(value);
        }
        /**
         * Write all elements of `bytes` as uint8 values and move pointer forward by
         * `bytes.length` bytes.
         */


        writeBytes(bytes) {
          this.ensureAvailable(bytes.length);

          for (let i = 0; i < bytes.length; i++) {
            this._data.setUint8(this.offset++, bytes[i]);
          }

          this._updateLastWrittenByte();

          return this;
        }
        /**
         * Write `value` as a 16-bit signed integer and move pointer forward by 2
         * bytes.
         */


        writeInt16(value) {
          this.ensureAvailable(2);

          this._data.setInt16(this.offset, value, this.littleEndian);

          this.offset += 2;

          this._updateLastWrittenByte();

          return this;
        }
        /**
         * Write `value` as a 16-bit unsigned integer and move pointer forward by 2
         * bytes.
         */


        writeUint16(value) {
          this.ensureAvailable(2);

          this._data.setUint16(this.offset, value, this.littleEndian);

          this.offset += 2;

          this._updateLastWrittenByte();

          return this;
        }
        /**
         * Write `value` as a 32-bit signed integer and move pointer forward by 4
         * bytes.
         */


        writeInt32(value) {
          this.ensureAvailable(4);

          this._data.setInt32(this.offset, value, this.littleEndian);

          this.offset += 4;

          this._updateLastWrittenByte();

          return this;
        }
        /**
         * Write `value` as a 32-bit unsigned integer and move pointer forward by 4
         * bytes.
         */


        writeUint32(value) {
          this.ensureAvailable(4);

          this._data.setUint32(this.offset, value, this.littleEndian);

          this.offset += 4;

          this._updateLastWrittenByte();

          return this;
        }
        /**
         * Write `value` as a 32-bit floating number and move pointer forward by 4
         * bytes.
         */


        writeFloat32(value) {
          this.ensureAvailable(4);

          this._data.setFloat32(this.offset, value, this.littleEndian);

          this.offset += 4;

          this._updateLastWrittenByte();

          return this;
        }
        /**
         * Write `value` as a 64-bit floating number and move pointer forward by 8
         * bytes.
         */


        writeFloat64(value) {
          this.ensureAvailable(8);

          this._data.setFloat64(this.offset, value, this.littleEndian);

          this.offset += 8;

          this._updateLastWrittenByte();

          return this;
        }
        /**
         * Write the charCode of `str`'s first character as an 8-bit unsigned integer
         * and move pointer forward by 1 byte.
         */


        writeChar(str) {
          return this.writeUint8(str.charCodeAt(0));
        }
        /**
         * Write the charCodes of all `str`'s characters as 8-bit unsigned integers
         * and move pointer forward by `str.length` bytes.
         */


        writeChars(str) {
          for (let i = 0; i < str.length; i++) {
            this.writeUint8(str.charCodeAt(i));
          }

          return this;
        }
        /**
         * UTF-8 encode and write `str` to the current pointer offset and move pointer
         * forward according to the encoded length.
         */


        writeUtf8(str) {
          const bString = Object(utf8__WEBPACK_IMPORTED_MODULE_0__["encode"])(str);
          return this.writeChars(bString);
        }
        /**
         * Export a Uint8Array view of the internal buffer.
         * The view starts at the byte offset and its length
         * is calculated to stop at the last written byte or the original length.
         */


        toArray() {
          return new Uint8Array(this.buffer, this.byteOffset, this.lastWrittenByte);
        }
        /**
         * Update the last written byte offset
         * @private
         */


        _updateLastWrittenByte() {
          if (this.offset > this.lastWrittenByte) {
            this.lastWrittenByte = this.offset;
          }
        }

      }

      /***/
    }),
    /* 5 */
    /***/
    (function(module, exports, __webpack_require__) {

      "use strict";


      const types = __webpack_require__(2); // const STREAMING = 4294967295;

      /**
       * Read data for the given non-record variable
       * @ignore
       * @param {IOBuffer} buffer - Buffer for the file data
       * @param {object} variable - Variable metadata
       * @return {Array} - Data of the element
       */


      function nonRecord(buffer, variable) {
        // variable type
        const type = types.str2num(variable.type); // size of the data

        var size = variable.size / types.num2bytes(type); // iterates over the data

        var data = new Array(size);

        for (var i = 0; i < size; i++) {
          data[i] = types.readType(buffer, type, 1);
        }

        return data;
      }
      /**
       * Read data for the given record variable
       * @ignore
       * @param {IOBuffer} buffer - Buffer for the file data
       * @param {object} variable - Variable metadata
       * @param {object} recordDimension - Record dimension metadata
       * @return {Array} - Data of the element
       */


      function record(buffer, variable, recordDimension) {
        // variable type
        const type = types.str2num(variable.type);
        const width = variable.size ? variable.size / types.num2bytes(type) : 1; // size of the data
        // TODO streaming data

        var size = recordDimension.length; // iterates over the data

        var data = new Array(size);
        const step = recordDimension.recordStep;

        for (var i = 0; i < size; i++) {
          var currentOffset = buffer.offset;
          data[i] = types.readType(buffer, type, width);
          buffer.seek(currentOffset + step);
        }

        return data;
      }

      module.exports.nonRecord = nonRecord;
      module.exports.record = record;

      /***/
    }),
    /* 6 */
    /***/
    (function(module, exports, __webpack_require__) {

      "use strict";


      const utils = __webpack_require__(0);

      const types = __webpack_require__(2); // Grammar constants


      const ZERO = 0;
      const NC_DIMENSION = 10;
      const NC_VARIABLE = 11;
      const NC_ATTRIBUTE = 12;
      /**
       * Read the header of the file
       * @ignore
       * @param {IOBuffer} buffer - Buffer for the file data
       * @param {number} version - Version of the file
       * @return {object} - Object with the fields:
       *  * `recordDimension`: Number with the length of record dimension
       *  * `dimensions`: List of dimensions
       *  * `globalAttributes`: List of global attributes
       *  * `variables`: List of variables
       */

      function header(buffer, version) {
        // Length of record dimension
        // sum of the varSize's of all the record variables.
        var header = {
          recordDimension: {
            length: buffer.readUint32()
          }
        }; // Version

        header.version = version; // List of dimensions

        var dimList = dimensionsList(buffer);
        header.recordDimension.id = dimList.recordId; // id of the unlimited dimension

        header.recordDimension.name = dimList.recordName; // name of the unlimited dimension

        header.dimensions = dimList.dimensions; // List of global attributes

        header.globalAttributes = attributesList(buffer); // List of variables

        var variables = variablesList(buffer, dimList.recordId, version);
        header.variables = variables.variables;
        header.recordDimension.recordStep = variables.recordStep;
        return header;
      }

      const NC_UNLIMITED = 0;
      /**
       * List of dimensions
       * @ignore
       * @param {IOBuffer} buffer - Buffer for the file data
       * @return {object} - Ojbect containing the following properties:
       *  * `dimensions` that is an array of dimension object:
       *  * `name`: String with the name of the dimension
       *  * `size`: Number with the size of the dimension dimensions: dimensions
       *  * `recordId`: the id of the dimension that has unlimited size or undefined,
       *  * `recordName`: name of the dimension that has unlimited size
       */

      function dimensionsList(buffer) {
        var recordId, recordName;
        const dimList = buffer.readUint32();

        if (dimList === ZERO) {
          utils.notNetcdf(buffer.readUint32() !== ZERO, 'wrong empty tag for list of dimensions');
          return [];
        } else {
          utils.notNetcdf(dimList !== NC_DIMENSION, 'wrong tag for list of dimensions'); // Length of dimensions

          const dimensionSize = buffer.readUint32();
          var dimensions = new Array(dimensionSize);

          for (var dim = 0; dim < dimensionSize; dim++) {
            // Read name
            var name = utils.readName(buffer); // Read dimension size

            const size = buffer.readUint32();

            if (size === NC_UNLIMITED) {
              // in netcdf 3 one field can be of size unlimmited
              recordId = dim;
              recordName = name;
            }

            dimensions[dim] = {
              name: name,
              size: size
            };
          }
        }

        return {
          dimensions: dimensions,
          recordId: recordId,
          recordName: recordName
        };
      }
      /**
       * List of attributes
       * @ignore
       * @param {IOBuffer} buffer - Buffer for the file data
       * @return {Array<object>} - List of attributes with:
       *  * `name`: String with the name of the attribute
       *  * `type`: String with the type of the attribute
       *  * `value`: A number or string with the value of the attribute
       */


      function attributesList(buffer) {
        const gAttList = buffer.readUint32();

        if (gAttList === ZERO) {
          utils.notNetcdf(buffer.readUint32() !== ZERO, 'wrong empty tag for list of attributes');
          return [];
        } else {
          utils.notNetcdf(gAttList !== NC_ATTRIBUTE, 'wrong tag for list of attributes'); // Length of attributes

          const attributeSize = buffer.readUint32();
          var attributes = new Array(attributeSize);

          for (var gAtt = 0; gAtt < attributeSize; gAtt++) {
            // Read name
            var name = utils.readName(buffer); // Read type

            var type = buffer.readUint32();
            utils.notNetcdf(type < 1 || type > 6, "non valid type ".concat(type)); // Read attribute

            var size = buffer.readUint32();
            var value = types.readType(buffer, type, size); // Apply padding

            utils.padding(buffer);
            attributes[gAtt] = {
              name: name,
              type: types.num2str(type),
              value: value
            };
          }
        }

        return attributes;
      }
      /**
       * List of variables
       * @ignore
       * @param {IOBuffer} buffer - Buffer for the file data
       * @param {number} recordId - Id of the unlimited dimension (also called record dimension)
       *                            This value may be undefined if there is no unlimited dimension
       * @param {number} version - Version of the file
       * @return {object} - Number of recordStep and list of variables with:
       *  * `name`: String with the name of the variable
       *  * `dimensions`: Array with the dimension IDs of the variable
       *  * `attributes`: Array with the attributes of the variable
       *  * `type`: String with the type of the variable
       *  * `size`: Number with the size of the variable
       *  * `offset`: Number with the offset where of the variable begins
       *  * `record`: True if is a record variable, false otherwise (unlimited size)
       */


      function variablesList(buffer, recordId, version) {
        const varList = buffer.readUint32();
        var recordStep = 0;

        if (varList === ZERO) {
          utils.notNetcdf(buffer.readUint32() !== ZERO, 'wrong empty tag for list of variables');
          return [];
        } else {
          utils.notNetcdf(varList !== NC_VARIABLE, 'wrong tag for list of variables'); // Length of variables

          const variableSize = buffer.readUint32();
          var variables = new Array(variableSize);

          for (var v = 0; v < variableSize; v++) {
            // Read name
            var name = utils.readName(buffer); // Read dimensionality of the variable

            const dimensionality = buffer.readUint32(); // Index into the list of dimensions

            var dimensionsIds = new Array(dimensionality);

            for (var dim = 0; dim < dimensionality; dim++) {
              dimensionsIds[dim] = buffer.readUint32();
            } // Read variables size


            var attributes = attributesList(buffer); // Read type

            var type = buffer.readUint32();
            utils.notNetcdf(type < 1 && type > 6, "non valid type ".concat(type)); // Read variable size
            // The 32-bit varSize field is not large enough to contain the size of variables that require
            // more than 2^32 - 4 bytes, so 2^32 - 1 is used in the varSize field for such variables.

            const varSize = buffer.readUint32(); // Read offset

            var offset = buffer.readUint32();

            if (version === 2) {
              utils.notNetcdf(offset > 0, 'offsets larger than 4GB not supported');
              offset = buffer.readUint32();
            }

            let record = false; // Count amount of record variables

            if (typeof recordId !== 'undefined' && dimensionsIds[0] === recordId) {
              recordStep += varSize;
              record = true;
            }

            variables[v] = {
              name: name,
              dimensions: dimensionsIds,
              attributes,
              type: types.num2str(type),
              size: varSize,
              offset,
              record
            };
          }
        }

        return {
          variables: variables,
          recordStep: recordStep
        };
      }

      module.exports = header;

      /***/
    }),
    /* 7 */
    /***/
    (function(module, exports, __webpack_require__) {

      "use strict";


      function toString() {
        let result = [];
        result.push('DIMENSIONS');

        for (let dimension of this.dimensions) {
          result.push("  ".concat(dimension.name.padEnd(30), " = size: ").concat(dimension.size));
        }

        result.push('');
        result.push('GLOBAL ATTRIBUTES');

        for (let attribute of this.globalAttributes) {
          result.push("  ".concat(attribute.name.padEnd(30), " = ").concat(attribute.value));
        }

        let variables = JSON.parse(JSON.stringify(this.variables));
        result.push('');
        result.push('VARIABLES:');

        for (let variable of variables) {
          variable.value = this.getDataVariable(variable);
          let stringify = JSON.stringify(variable.value);
          if (stringify.length > 50) stringify = stringify.substring(0, 50);

          if (!isNaN(variable.value.length)) {
            stringify += " (length: ".concat(variable.value.length, ")");
          }

          result.push("  ".concat(variable.name.padEnd(30), " = ").concat(stringify));
        }

        return result.join('\n');
      }

      module.exports = toString;

      /***/
    })
    /******/
  ]);
});
//# sourceMappingURL=netcdfjs.js.map
export default NetCDFReaderExport;

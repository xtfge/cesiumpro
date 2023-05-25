/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.99
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

define(['./Matrix3-ea964448', './defaultValue-135942ca', './EllipseGeometry-08ba4483', './Check-40d84a28', './Math-efde0c7b', './Transforms-ac2d28a9', './Matrix2-f9f1b94b', './RuntimeError-f0dada00', './combine-462d91dd', './ComponentDatatype-ebdce3ba', './WebGLConstants-fcb70ee3', './EllipseGeometryLibrary-61eaea89', './GeometryAttribute-51d61732', './GeometryAttributes-899f8bd0', './GeometryInstance-bb34b63f', './GeometryOffsetAttribute-d3a42805', './GeometryPipeline-576f16cd', './AttributeCompression-53c7fda2', './EncodedCartesian3-4040c81e', './IndexDatatype-fa75fe25', './IntersectionTests-4ab30dca', './Plane-93af52b2', './VertexFormat-1d6950e1'], (function (Matrix3, defaultValue, EllipseGeometry, Check, Math, Transforms, Matrix2, RuntimeError, combine, ComponentDatatype, WebGLConstants, EllipseGeometryLibrary, GeometryAttribute, GeometryAttributes, GeometryInstance, GeometryOffsetAttribute, GeometryPipeline, AttributeCompression, EncodedCartesian3, IndexDatatype, IntersectionTests, Plane, VertexFormat) { 'use strict';

  function createEllipseGeometry(ellipseGeometry, offset) {
    if (defaultValue.defined(offset)) {
      ellipseGeometry = EllipseGeometry.EllipseGeometry.unpack(ellipseGeometry, offset);
    }
    ellipseGeometry._center = Matrix3.Cartesian3.clone(ellipseGeometry._center);
    ellipseGeometry._ellipsoid = Matrix3.Ellipsoid.clone(ellipseGeometry._ellipsoid);
    return EllipseGeometry.EllipseGeometry.createGeometry(ellipseGeometry);
  }

  return createEllipseGeometry;

}));

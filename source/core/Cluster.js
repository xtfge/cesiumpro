import defaultValue from './defaultValue.js';
import Url from '../core/Url'
import TaskProcessor from '../core/TaskProcessor.js'
const {
    kdbush,
    Cartesian3,
    Cartographic,
    PointPrimitive,
    BoundingRectangle,
    SceneMode,
    EllipsoidalOccluder,
} = Cesium;
function computedScreenPosition(objects, scene) {
    const result = []
    const occluder = new EllipsoidalOccluder(scene.globe.ellipsoid, scene.camera.positionWC);
    for (let object of objects) {
        if (!object.position) {
            continue;
        }
        if (scene.mode === SceneMode.SCENE3D && !occluder.isPointVisible(object.position)) {
            continue;
        }
        object.__pixel = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            scene,
            object.position,
        );
        // object.__pixel = GeoPoint.toPixel(object.position, scene);
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
    const bbox = new BoundingRectangle();
    PointPrimitive.getScreenSpaceBoundingBox(object, pixel, bbox);
    expandBoundingBox(bbox, this.pixelRange)
    return bbox;
}
class Cluster {
    constructor(scene, options = {}) {
        this._objects = defaultValue(options.objects, []);
        this._getScreenBoundingBox = defaultValue(options.getScreenBoundingBox, getScreenBoundingBox);
        this._scene = scene;
        this.clusterSize = 3;
        this.pixelRange = 50;
        this._clusterObjects = []
    }
    get objects() {
        return this._objects;
    }
    set objects(val) {
        this._objects = val;
    }
    _clearCluster() {
        this._objects.map(_ => _.cluster = false);
        this._clusterObjects = []
    }
    update() {
        const objects = this._objects;
        this._clearCluster()
        const filterObject = computedScreenPosition(objects, this._scene)
        const index = new kdbush(filterObject, getX, getY, 64, Int32Array);


        for (let object of filterObject) {
            if (object.cluster) {
                continue
            }
            const bbox = this._getScreenBoundingBox(object, object.__pixel);
            const totalBBox = BoundingRectangle.clone(bbox, new BoundingRectangle());
            object.cluster = true;
            const neighbors = index.range(bbox.x, bbox.y, bbox.x + bbox.width, bbox.y + bbox.height);
            const neighborLength = neighbors.length;
            const clusterPosition = Cartesian3.clone(object.position);
            let numPoints = 1, lastObject = undefined;
            const ids = []
            for (let i = 0; i < neighborLength; i++) {
                const neighborIndex = neighbors[i];
                const neighborObject = filterObject[neighborIndex];
                if (neighborObject.cluster) {
                    continue;
                }
                ids.push(neighborObject.id)
                neighborObject.cluster = true;
                const neightborbox = this._getScreenBoundingBox(neighborObject, neighborObject.__pixel);
                Cartesian3.add(neighborObject.position, clusterPosition, clusterPosition);
                BoundingRectangle.union(totalBBox, neightborbox, totalBBox);
                numPoints++;
                lastObject = neighborObject;

            }
            if (numPoints >= this.clusterSize) {
                Cartesian3.multiplyByScalar(clusterPosition, 1.0 / numPoints, clusterPosition);
                this._clusterObjects.push({
                    position: new Cartesian3(clusterPosition.x, clusterPosition.y, clusterPosition.z),
                    number: numPoints,
                    ids,
                    id: lastObject.id + numPoints
                })
            } else {
                this._clusterObjects.push(object)
            }

        }
    }
}
export default Cluster;
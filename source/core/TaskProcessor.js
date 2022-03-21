import defaultValue from "./defaultValue.js";
import {buildModuleUrl, getCesiumProBaseUrl} from './Url.js'
import defined from './defined.js'
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
    if (!defined(bootstrapperUrlResult)) {
        bootstrapperUrlResult = getWorkerUrl("Workers/cesiumWorkerBootstrapper.js");
    }
    return bootstrapperUrlResult;
}
function createWorker(processor) {
    const worker = new Worker(getBootstrapperUrl());
    worker.postMessage = defaultValue(
        worker.webkitPostMessage,
        worker.postMessage
    );

    const bootstrapMessage = {
        loaderConfig: {
            paths: {
                Workers: buildModuleUrl("workers"),
            },
            baseUrl: getCesiumProBaseUrl().url,
        },
        workerModule: processor._workerPath,
    };

    worker.postMessage(bootstrapMessage);
    worker.onmessage = function (event) {
        completeTask(processor, event.data);
    };
    worker.postMessage(processor._options)

    return worker;
}
function completeTask(processor, data) {
    console.log(processor, data, '------complete-----')
}
class TaskProcessor {
    /**
     * 处理worker任务
     * @private
     */
    constructor(path, options = {}) {
        this._workers = []
        this._workerPath = 'workers/' + path;
        this._options = options;
        const numberOfWorkers = Math.max(
            FeatureDetection.hardwareConcurrency - 1,
            1
        )
        this._worker = createWorker(this);

    }
}
export default TaskProcessor;
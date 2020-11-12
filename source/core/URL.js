import CesiumProError from './CesiumProError';
import defined from './defined';

const cesiumScriptRegex = /((?:.*\/)|^)CesiumPro\.(esm|umd)\.js(?:\?|#|$)/;

let a;
let
  CESIUMPRO_BASE_URL;

function tryMakeAbsolute(url) {
  if (typeof document === 'undefined') {
    // Node.js and Web Workers. In both cases, the URL will already be absolute.
    return url;
  }

  if (!defined(a)) {
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
  return tryMakeAbsolute(require.toUrl(`../${moduleID}`));
}

function getCesiumProBaseUrl() {
  if (defined(baseResource)) {
    return baseResource;
  }

  let baseUrlString;
  if (window.CESIUMPRO_BASE_URL) {
    baseUrlString = window.CESIUMPRO_BASE_URL;
  } else if (
    typeof window.define === 'object'
    && defined(window.define.amd)
    && !window.define.amd.toUrlUndefined
    && defined(window.require.toUrl)
  ) {
    baseUrlString = Cesium.getAbsoluteUri(
      '..',
      'core/URL.js',
    );
  } else {
    baseUrlString = getBaseUrlFromCesiumScript();
  }
  if (!defined(baseUrlString)) {
    throw new CesiumProError(
      'Unable to determine CesiumPro base URL automatically, try defining a global variable called CESIUMPRO_BASE_URL.',
    );
  }
  // >>includeEnd('debug');

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

function buildModuleUrl(relativeUrl) {
  if (!defined(implementation)) {
    // select implementation
    if (
      typeof window.define === 'object'
      && defined(window.define.amd)
      && !window.define.amd.toUrlUndefined
      && defined(require.toUrl)
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
 * @namespace URL
 *
 */
const URL = {};
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
URL.join = function (...args) {
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
 * @returns {String}
 */
URL.buildModuleUrl = function (path) {
  return buildModuleUrl(path);
};
export default URL;

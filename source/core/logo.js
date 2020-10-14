/*
 * 移除Cesium 默认logo，并添加新logo
 */
import $ from '../thirdParty/jquery.js';

/**
 * 移除Cesium 默认logo，并添加新logo
 * @exports logo
 * @param {Object} [options] 具有以下参数
 * @param  {String} [options.url] 新logo的url，如果为空将仅移除默认logo，不添加新logo
 * @param {Number} [options.width] logo图片的宽度
 * @param {Number} [options.height] logo图片高度
 */
function logo(options = {}) {
  $('.cesium-widget-credits').empty();
  if (options.url) {
    let style = ''
    if (options.width) {
      style += "width=" + options.width;
    }
    if (options.height) {
      style += " height=" + options.height;
    }
    $('.cesium-widget-credits').append(`<img src='${options.url}' ${style}/>`);
  }
}

export default logo;

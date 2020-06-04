/*
 * 移除Cesium 默认logo，并添加新logo
 */
import $ from '../thirdParty/jquery.js';

/**
 * 移除Cesium 默认logo，并添加新logo
 * @param {String} [url=false] 新logo的url,如果为false则只移除，不添加新logo
 */
function logo(url = false) {
  $('.cesium-widget-credits').empty();
  if (typeof url === 'string') {
    $('.cesium-widget-credits').append(`<img src='${url}'/>`);
  }
}

export default logo;

var EDITOR_CONFIG = {
  SERVICE_URL: "./editor/items.json",
  GEOSERVER: 'http://localhost:8080/geoserver',
  BASE: "",
  CODE_EDITOR_STATUS: false //代码编辑器默认关闭
}
function getGeoserverURL(url) {
  return EDITOR_CONFIG.GEOSERVER + url;
}
parent.getGeoserverURL = window.getGeoserverURL = getGeoserverURL;

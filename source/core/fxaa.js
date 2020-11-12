import checkViewer from './checkViewer'
/**
 * 设置场景的抗锯齿效果。
 * @exports fxaa
 * @param  {Cesium.Viewer} viewer
 * @param  {Bool} value 是否开启抗锯齿效果
 */
function fxaa(viewer, value) {
  checkViewer(viewer);
  viewer.scene.postProcessStages.fxaa.enabled = value;
}

export default fxaa;

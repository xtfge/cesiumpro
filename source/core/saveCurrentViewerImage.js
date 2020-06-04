/*
 * 将当前场景保存成图片
 */
/**
 * @private
 * @param {*} fileName 文件名
 * @param {*} content 文件内容
 */
const downloadFile = (fileName, content) => {
  // 下载文件
  function base64ToBlob(code) {
    // base64转blob
    const parts = code.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;

    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  }
  const aLink = document.createElement('a');
  const blob = base64ToBlob(content); // new Blob([content]);
  const evt = document.createEvent('HTMLEvents');
  evt.initEvent('click', true, true); // initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
  aLink.download = fileName;
  aLink.href = URL.createObjectURL(blob);
  aLink.click();
};
/**
 * 将当前场景保存成图片
 * @param {Viewer} viewer Viewer对象
 * @param {String} filename 文件名
 */
function saveCurViewerImage(viewer, filename) {
  viewer.render();
  if (!filename || filename === '') {
    filename = `${new Date().toLocaleString()}.png`;
  }
  const ext = filename.split('.')[1];
  downloadFile(filename, viewer.scene.canvas.toDataURL('image/%s' % ext));
}
export default saveCurViewerImage;

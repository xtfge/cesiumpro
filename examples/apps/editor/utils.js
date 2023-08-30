function Loading(text) {
  const el = document.createElement('div');
  el.style.cssText = 'color:#FFF;width: 100%; height: 100%;position: absolute;z-index:1000;left: 0;top: 0;background-color:rgba(0,0,0,0.6);display: flex;align-items: center;justify-content:center'
  el.innerHTML = text;
  el.oncontextmenu = function(e) {
    e.stopPropagation();
    return false;
  }
  document.body.appendChild(el);
  this.el = el;
}
Loading.prototype.close = function () {
  document.body.removeChild(this.el);
}
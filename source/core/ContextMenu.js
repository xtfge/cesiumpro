import defaultValue from './defaultValue';
import checkViewer from './checkViewer';
import LonLat from './LonLat';
class ContextMenu {
  /**
   * 右键菜单
   * @param {Cesium.Viewer} viewer  Viewer对象
   * @param {Object} options 具有以下属性
   * @param {ContextMenuItem[]} [options.items] 菜单项
   * @param {Cesium.Cartesian3} options.position 菜单显示的位置
   */
  constructor(viewer, options) {
    checkViewer(viewer);
    this._viewer = viewer;
    options = defaultValue(options, {});
    const items = defaultValue(options.items, []);
    this._items = new Cesium.AssociativeArray();
    this._position = options.position;

    this._container = defaultValue(options.container, viewer.container);
    this._root = this.createMenu();
    this.createItems(items);
    this._show = true;
    this._activeSubMenu = undefined;
    this.parent = options.parent;
  }

  /**
   * 菜单可见性
   * @type {Boolean}
   */
  get show() {
    return this._show;
  }
  set show(val) {
    this._show = val;
    this._root.style.display = val ? 'block' : 'none'
    this._menu.style.display = val ? 'block' : 'none'
  }
  /**
   * 菜单位置
   * @type {Cesium.Cartesian2}
   */
  get position() {
    return this._position;
  }
  set position(val) {
    this._position = val;
    if (this._root) {
      const pixel = LonLat.toPixel(this._position, this._viewer.scene);
      this._root.style.left = pixel.x + 'px';
      this._root.style.top = pixel.y + 'px'
    }
  }
  /**
   * 返回指定序号的菜单项
   * @param  {Number} index 菜单序号
   * @return {Object} 菜单项
   */
  get(index) {
    return this._items.values[index];
  }
  /**
   * 返回指定id的菜单项
   * @param  {Number} id 菜单项id
   * @return {Object} 菜单项
   */
  getById(id) {
    return this._items.get(id)
  }
  /**
   * 添加一个菜单项
   * @param {Object} item 具有以下属性
   * @param {String} item.text 菜单项要显示的文字
   * @param {any} [item.id] 菜单项id;
   * @param {String} [item.class] 菜单项类名，支持bootstrap css类
   */
  add(item) {
    if (this._items.contains(item.id)) {
      return;
    }
    const contextItem = this.createItem(item);
    this._items.set(contextItem.id, contextItem);
    this._menu.appendChild(contextItem.el);
  }
  /**
   * 删除菜单项
   * @param  {Object} item 需要被删除的菜单项
   * @return {Boolean}   是否删除成功
   *
   * @example
   * const item=contextMenu.get(0);
   * contextMenu.remove(item);
   */
  remove(item) {
    const ele = item.el;
    try {
      this._root.removeChild(ele);
      this._items.remove(item.id);
      return true;
    } catch (e) {
      return false;
    }
  }
  /**
   * 删除所有菜单项
   */
  removeAll() {
    for (let item of this._items.values) {
      this.remove(item);
    }
  }
  createMenu() {
    const root = document.createElement('div');
    root.className = 'context-root';
    const ul = document.createElement('ul');
    ul.className = 'context-menu context-ul';
    root.appendChild(ul);
    this._container.appendChild(root);
    if (this._position) {
      const pixel = LonLat.toPixel(this._position, this._viewer.scene);
      root.style.left = pixel.x + 'px';
      root.style.top = pixel.y + 'px';
    }
    this._menu = ul;
    root.oncontextmenu = function() {
      return false;
    }
    return root;
  }
  /**
   * 更新菜单项文字
   * @param  {ContextMenuItem} item 菜单项
   * @param  {HTML|String} text 文字描述，支持html
   */
  updateItemText(item, text) {
    const textEle = document.getElementById(item.id + '-text');
    if (textEle) {
      textEle.innerHTML = text;
    }
  }
  /**
   * 更新菜单项的不可用状态
   * @param  {ContextMenuItem} item   菜单项
   * @param  {Boolean} disabled 是否不可用
   */
  updateItemDistabled(item, disabled) {
    if (item && item.a) {
      item.disabled = disabled;
      item.a.className = disabled ? "context-item-disabled" : "context-item"
    }
  }
  createItems(items) {
    for (let item of items) {
      this.add(item);
    }
  }
  createItem(item = {}) {
    const li = document.createElement('li');
    li.className = "context-menu";
    const a = document.createElement('a');
    a.className = item.disabled ? "context-item-disabled" : "context-item";
    const i = document.createElement('i');
    i.className = item.class;
    a.appendChild(i);
    a.innerHTML += `<span id="${item.id}-text">${item.text}</span>`;
    li.appendChild(a);
    li.id = item.id;
    item.el = li;
    item.a = a;
    if (item.children) {
      const arrow = document.createElement('i');
      arrow.className = 'fa fa-caret-right';
      a.appendChild(arrow);
      const sub = new ContextMenu(this._viewer, {
        items: item.children,
        position: this._position,
        parent: this,
      })
      li.appendChild(sub._menu);
      sub._menu.className += ' context-submenu';
      item.subMenu = sub;
      sub.container = item;
    }
    item.el.onmouseover = (event) => {
      event.stopPropagation();
      if (item.disabled) {
        return;
      }
      this._activeSubMenu && (this._activeSubMenu.show = false);
      item.subMenu && (item.subMenu.show = true);
      this._activeSubMenu = item.subMenu;
    }
    // item.el.onmouseout = function() {
    //   sub.show = false;
    // }
    item.el.onclick = (event) => {
      event.stopPropagation();
      if (item.disabled) {
        return;
      }
      item.callback && item.callback(item);
      this.show = false;
      this.parent && (this.parent.show = false);
    }
    return item;
  }

  /**
   * @callback ContextMenu~ContextMenuItem
   * 具有以下属性
   * @param       {Object} options 具有以下属性
   * @param {String} [options.class] 菜单项样式
   * @param {String} [options.text] 菜单项将要显示的文字描述
   * @param {String} [options.id] 菜单项id，如果未定义，将创建guid
   * @param {String} [options.disabled=false] 是否不可用
   * @param {ContextMenu} [options.container] 父菜单
   * @param {HTMLElement} [options.container] 插入菜单的容器
   */
  ContextMenuItem(options) {

  }
  destroy() {

  }
}
export default ContextMenu;

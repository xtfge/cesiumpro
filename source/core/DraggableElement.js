/*
 * 让Element可以用鼠标拖动
 */
import $ from '../thirdParty/jquery';
/**
 *
 * @param {String} container 要移到的元素的选择器
 * @param {String} [target=container] 监听鼠标事件的元素，一般是标题栏
 * @example
 * draggableElement('#tool-panel')
 * draggableElement('#tool-panel','.tool-header-class')
 */
class DraggableElement {
  constructor(container, target = container) {
    if (!$(container)) {
      throw new Error('请指定要操作的元素');
    }
    if (!target) {
      target = container;
    }
    this._target = target;
    this._container = container;
    const self = this;
    $(self.target).mousedown((
      e, // e鼠标事件
    ) => {
      $(self.target).css('cursor', 'move'); // 改变鼠标指针的形状
      // let offset = $("#" + container).offset(); //DIV在页面的位置
      const offset = $(self.container).position(); // DIV在页面的位置
      const x = e.pageX - offset.left; // 获得鼠标指针离DIV元素左边界的距离
      const y = e.pageY - offset.top; // 获得鼠标指针离DIV元素上边界的距离

      $(document).bind('mousemove', (
        ev, // 绑定鼠标的移动事件，因为光标在DIV元素外面也要有效果，所以要用doucment的事件，而不用DIV元素的事件
      ) => {
        $(self.target).css('cursor', 'move');
        $(self.container).stop(); // 加上这个之后
        const _x = ev.pageX - x; // 获得X轴方向移动的值
        const _y = ev.pageY - y; // 获得Y轴方向移动的值
        $(self.container).animate({ left: `${_x}px`, top: `${_y}px` }, 10);
      });
    });
    $(document).mouseup(function () {
      $(self.target).css('cursor', 'default');
      $(this).unbind('mousemove');
    });
  }

  /**
   * 触发事件的元素，#id,.class
   */
  get target() {
    return this._target;
  }

  set target(v) {
    this._target = v;
  }

  /**
   * 可拖拽的元素，#id,.class
   */
  get container() {
    return this._container;
  }

  set container(v) {
    this._container = v;
  }

  destroy() {
    $(this.target).unbind('mousedown');
    this._container = undefined;
    this._target = undefined;
  }
}
export default DraggableElement;

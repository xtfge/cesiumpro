/* eslint-disable no-self-assign */
/* eslint-disable no-multi-assign */
/*
 * 拉框选择，通过鼠标绘制一个矩形，确定制图的范围
 */
import $ from '../thirdParty/jquery';
import Event from './Event';

const defaultStyle = {
  width: $(document.body).width(),
  height: $(document.body).height(),
};
/**
 * 拉框选择
 */
class RectangleSelector {
  /**
   * 拉框选择
   * @param {Object} option 它具有以下属性
   * @param {Number} [option.left=0] 画布的左边界
   * @param {Number} [option.top] 画布上边界
   * @param {Number} [option.width] 画布宽度
   * @param {Number} [option.height] 画布高度
   * @param {Boolean} [option.mask] 选择过程中是否创建遮罩层
   * @param {Boolean} [option.buttonMode] 是否启用按钮模式，如果为false，鼠标松开后自动提交
   */
  constructor(option = {}) {
    this.isDrawing = false;

    // 定义画面的位置和范围

    this._canvasLeft = option.left || 0;
    this._canvasTop = option.top || 0;
    this._width = option.width || defaultStyle.width;
    this._height = option.height || defaultStyle.height;

    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.zIndex = 99;
    this.canvas.style.left = this._canvasLeft;
    this.canvas.style.top = this._canvasTop;
    this.canvas.width = this._width;
    this.canvas.height = this._height;
    this.canvas.style.display = 'none';

    // 核心参数，最终根据这四个参数确定截图范围
    this._top = this._canvasLeft;
    this._left = this._canvasTop;
    this._right = this._canvasLeft + this._width;
    this._bottom = this._canvasTop + this._height;
    this._submitEvent = new Event();


    document.body.appendChild(this.canvas);
    // this.addEventListener();
    this.create();
    this.option = option;
  }

  /**
   * @type Event
   * @readonly
   */
  get submitEvent() {
    return this._submitEvent;
  }

  /**
   * 左边界
   * @readonly
   */
  get left() {
    return this._left;
  }

  /**
   * 右边界
   * @readonly
   */
  get right() {
    return this._right;
  }

  /**
   * 上边界
   * @readonly
   */
  get top() {
    return this._top;
  }

  /**
   * 下边界
   * @readonly
   */
  get bottom() {
    return this._bottom;
  }

  /**
   * @private
   * 创建画布
   */
  create() {
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(this._canvasLeft, this._canvasTop, this._width, this._height);
    this.canvas.width = this._width;
    ctx.strokeStyle = 'red';
    ctx.rect(this.left, this.top, this.right - this.left, this.bottom - this.top);
    ctx.stroke();
    //
  }

  /**
   * 创建确定与取消按钮
   */
  createBtn() {
    // 按钮位置
    let bottom;
    if (this.bottom + 24 > $(document).height()) {
      bottom = `${this.bottom - 24}px`;
    } else {
      bottom = `${this.bottom}px`;
    }
    const submit = document.createElement('i');
    submit.title = '确定';
    const cancel = document.createElement('i');
    cancel.title = '取消';
    submit.style.position = 'fixed';
    submit.style.zIndex = 99999;
    submit.style.left = `${this.right - 48}px`;
    submit.style.top = bottom;
    submit.className = 'iconfont iconsubmit';
    submit.style.color = '#1afa29';
    cancel.style.position = 'fixed';
    cancel.style.zIndex = 99999;
    cancel.style.left = `${this.right - 24}px`;
    cancel.style.top = bottom;
    cancel.className = 'iconfont iconcancel';
    cancel.style.color = 'red';
    document.body.appendChild(submit);
    document.body.appendChild(cancel);
    const self = this;
    submit.onclick = function () {
      self.submitHandler();
    };
    cancel.onclick = function () {
      self.cancelHandler();
    };
    this.submit = submit;
    this.cancel = cancel;
  }

  /**
   * 更新按钮的位置
   */
  updateBtnPosition() {
    if (this.submit) {
      let top;
      if (this.bottom + 24 > $(document).height()) {
        top = `${this.bottom - 24}px`;
      } else {
        top = `${this.bottom}px`;
      }
      this.submit.style.top = top;
      this.cancel.style.top = top;
      this.submit.style.left = `${this.right - 48}px`;
      this.cancel.style.left = `${this.right - 24}px`;
    } else {
      this.createBtn();
    }
  }

  /**
   * 重置选择器
   */
  reset() {
    this._left = this._right = this._top = this._bottom = undefined;
    this.canvas.height = this.canvas.height;
    // this.canvas.height = this.canvas.height;
    if (this.submit) {
      document.body.removeChild(this.submit);
      this.submit = undefined;
    }
    if (this.cancel) {
      document.body.removeChild(this.cancel);
      this.cancel = undefined;
    }
  }

  /**
   * 开启事件监听，在需要拉框选择的时候调用它
   */
  on() {
    const self = this;
    self.reset();
    this.option.mask && this.createMask();
    this.canvas.style.display = 'block';
    if (this.option.buttonMode) {
      this.createBtn();
    }
    const mouseMove = function (e) {
      if (e.pageX >= self.left) {
        self._right = e.pageX;
      } else {
        self._right = self.left;
        self._left = e.pageX;
      }
      if (e.pageY >= self.top) {
        self._bottom = e.pageY;
      } else {
        self._bottom = self.top;
        self._top = e.pageY;
      }

      const leftBW = self.left;
      const topBW = self.top;
      const bottomBW = $(window).height() - self.bottom;
      const rightBW = $(window).width() - self.right;
      $(self.mask).css('border-left-width', `${leftBW}px`);
      $(self.mask).css('border-right-width', `${rightBW}px`);
      $(self.mask).css('border-top-width', `${topBW}px`);
      $(self.mask).css('border-bottom-width', `${bottomBW}px`);
      self.create();
    };
    const mouseUp = function () {
      self.isDrawing = false;
      self.canvas.style.display = 'none';
      $(self.canvas).off('mousemove');
      $(self.canvas).off('mouseup');
      if (self.option.bottonMode) {
        self.updateBtnPosition();
      } else {
        self.submitHandler();
      }
      $(self.canvas).off('mousedown');
    };
    const mouseDown = function (e) {
      // debugger
      self.isDrawing = true;
      $(self.canvas).on('mousemove', mouseMove);
      $(self.canvas).on('mouseup', mouseUp);
      self._left = e.pageX;
      self._top = e.pageY;
    };

    $(this.canvas).on('mousedown', mouseDown);
  }

  /**
   * 提交选择结果
   */
  submitHandler() {
    // const self=this;
    this.submitEvent.raiseEvent({
      top: this.top, left: this.left, right: this.right, bottom: this.bottom,
    });
    this.mask && $(this.mask).remove();
    // this.destroy();
  }

  /**
   * 取消选择
   */
  cancelHandler() {
    const evt = new CustomEvent('selector-cancel');
    document.dispatchEvent(evt);
    // this.destroy()
    this.mask && $(this.mask).remove();
    this.reset();
  }

  /**
   * 销毁选择器
   */
  destroy() {
    if (this.canvas) {
      $(this.canvas).unbind('mousedown');
      document.body.removeChild(this.canvas);
      this.canvas = undefined;
    }
    if (this.submit) {
      document.body.removeChild(this.submit);
      this.submit = undefined;
    }
    if (this.cancel) {
      document.body.removeChild(this.cancel);
      this.cancel = undefined;
    }
  }

  /**
   * @private
   * 创建遮罩层
   */
  createMask() {
    const mask = document.createElement('div');
    mask.className = 'pop-layer-class';
    this.mask = mask;
    $(document.body).append(mask);
  }
}

export default {
  RectangleSelector,
};

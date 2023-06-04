/* eslint-disable prefer-rest-params */

import CesiumProError from './CesiumProError';

function compareNumber(a, b) {
  return b - a;
}
class Event {
  /**
   * 事件管理器
   * @example
   * const addMarkerEvent=new Event();
   * function saveMark(marker){
   *  console.log("添加了一个marker",marker.id)
   * }
   * addMarkerEvent.on(saveMark)
   * const mark=viewer.entities.add({
   *  id:"mark1",
   *  billboard:{
   *    image:"./icon/pin.png"
   *  }
   * })
   * addMarkerEvent.emit(mark)
   */
  constructor() {
    this._listeners = [];
    this._scopes = [];
    this._toRemove = [];
    this._insideRaiseEvent = false;
  }

  /**
   * 当前订阅事件的侦听器个数
   * @type {Number}
   */
  get numberOfListeners() {
    return this._listeners.length - this._toRemove.length;
  }

  /**
   * 注册事件触发时执行的回调函数
   * @param {Function} listener 事件触发时执行的回调函数
   * @param {Object} [scope] 侦听器函数中this的指针
   * @return {Function} 用于取消侦听器监测的函数
   *
   * @see Event#removeEventListener
   * @see Event#raise
   */

  addEventListener(listener, scope) {
    if (typeof listener !== 'function') {
      throw new CesiumProError('侦听器应该是一个函数');
    }

    this._listeners.push(listener);
    this._scopes.push(scope);

    const event = this;
    return function () {
      event.removeEventListener(listener, scope);
    };
  }

  /**
   * 注销事件触发时的回调函数
   * @param {Function} listener 将要被注销的函数
   * @param {Object} [scope] 侦听器函数中this的指针
   * @return {Boolean} 如果为真，事件被成功注销，否则，事件注销失败
   *
   * @see Event#addEventListener
   * @see Event#raise
   */
  removeEventListener(listener, scope) {
    if (typeof listener !== 'function') {
      throw new CesiumProError('侦听器应该是一个函数');
    }
    const listeners = this._listeners;
    const scopes = this._scopes;

    let index = -1;
    for (let i = 0; i < listeners.length; i++) {
      if (listeners[i] === listener && scopes[i] === scope) {
        index = i;
        break;
      }
    }

    if (index !== -1) {
      if (this._insideRaiseEvent) {
        // In order to allow removing an event subscription from within
        // a callback, we don't actually remove the items here.  Instead
        // remember the index they are at and undefined their value.
        this._toRemove.push(index);
        listeners[index] = undefined;
        scopes[index] = undefined;
      } else {
        listeners.splice(index, 1);
        scopes.splice(index, 1);
      }
      return true;
    }

    return false;
  }

  /**
   * 触发事件
   * @param {*} arguments 此方法接受任意数据的参数并传递给侦听器函数
   *
   * @see Event#addEventListener
   * @see Event#removeEventListener
   */
  raise() {
    this._insideRaiseEvent = true;

    let i;
    const listeners = this._listeners;
    const scopes = this._scopes;
    let {
      length,
    } = listeners;

    for (i = 0; i < length; i++) {
      const listener = listeners[i];
      if (Cesium.defined(listener)) {
        listeners[i].apply(scopes[i], arguments);
      }
    }

    // Actually remove items removed in removeEventListener.
    const toRemove = this._toRemove;
    length = toRemove.length;
    // 降序排列，从后往前删
    if (length > 0) {
      toRemove.sort(compareNumber);
      for (i = 0; i < length; i++) {
        const index = toRemove[i];
        listeners.splice(index, 1);
        scopes.splice(index, 1);
      }
      toRemove.length = 0;
    }

    this._insideRaiseEvent = false;
  }
  raiseEvent() {
    this.raise(...arguments)
  }
}
export default Event;

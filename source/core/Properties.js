import Event from './Event';
import defined from './defined';
import CesiumProError from './CesiumProError';

function createProperty(name, configurable = false) {
  const privateName = `_${name}`;
  return {
    configurable,
    get() {
      return this[privateName];
    },
    set(value) {
      const oldValue = this[privateName];
      if (value !== oldValue) {
        this[privateName] = value;
        this._definitionChanged.raise(name, value, oldValue);
      }
    },
  };
}
class Properties {
  /**
   * 一个key-value集合，用于保存对象的属性信息
   * @param {Object} [options={}]
   */
  constructor(options = {}) {
    this._definitionChange = new Event();
    this._propertyNames = [];
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        this[`_${key}`] = options[key];
        this._propertyNames.push(key);
        Object.defineProperty(this, key, createProperty(key));
      }
    }
  }

  /**
   * 所有属性的key值
   * @return {Array} 所有属性的key值
   */
  get propertyNames() {
    return this._propertyNames;
  }

  /**
   * 添加属性
   * @param {*} key   键
   * @param {*} value 值
   * @fires Properties#definitionChanged
   */
  addProperty(key, value) {
    if (!defined(key)) {
      throw new CesiumProError('key is reqiured.');
    }
    if (this.propertyNames.includes(key)) {
      throw new CesiumProError(`${key}has be a registered property.`);
    }
    this[`_${key}`] = value;
    Object.defineProperty(this, key, createProperty(key));
  }

  /**
   * 删除属性
   * @param  {*} key
   * @fires Properties#definitionChanged
   */
  removeProperty(key) {
    if (!defined(key)) {
      throw new CesiumProError('key is reqiured.');
    }
    if (this.propertyNames.includes(key)) {
      delete this[key];
      delete this[`_${key}`];
      const index = this.propertyNames.indexOf(key);
      this.propertyNames.slice(index, 1);
      this.definitionChanged.raise(key);
    }
  }

  /**
   * 将该对象转换为字符串
   * @return {String}
   */
  toString() {
    const json = this.toJson();
    return JSON.stringify(json);
  }

  /**
   * 将该对象转换为json
   * @return {Object}
   */
  toJson() {
    const json = {};
    for (const property of this.propertyNames) {
      json[property] = this[property];
    }
    return json;
  }

  /**
   * 判断该对象是否包含属性key
   * @param  {*}  key
   * @return {Boolean}
   */
  hasProperty(key) {
    if (!defined(key)) {
      throw new CesiumProError('key is reqiured.');
    }
    return this.propertyNames.includes(key);
  }

  /**
   * 其定义发生变化时触发的事件,事件订阅者以发生变化的属性、变化后的值、变化前的值作为参数。
   * @Event
   * @return {Event}
   */
  get definitionChanged() {
    return this._definitionChanged;
  }

  destroy() {
    this._definitionChanged = undefined;
    this._propertyNames = undefined;
  }
}
export default Properties;

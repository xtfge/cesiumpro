import Event from './Event';

class Manager {
  constructor() {
    this._createEvent = new Event();
    this._preUpdateEvent = new Event();
    this._postUpdateEvent = new Event();
    this._destroyEvent = new Event();
  }

  /**
   * @readonly
   * @type Event
   */
  get createEvent() {
    return this._createEvent;
  }

  /**
   * @reayonly
   * @type Event
   */
  get preUpdateEvent() {
    return this._preUpdateEvent;
  }

  /**
   * @readonly
   * @type Event
   */
  get postUpdateEvent() {
    return this._postUpdateEvent;
  }

  /**
   * @readonly
   * @type Event
   */
  get destroyEvent() {
    return this._destroyEvent;
  }
}

export default Manager;

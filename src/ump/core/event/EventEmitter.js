import DestructibleEventListener from './DestructibleEventListener';

const listener = Symbol('event_listener');

export default class EventEmitter {
  constructor(element = null) {
    this[listener] = new DestructibleEventListener(
      element || document.createElement('div')
    );
  }

  clear() {
    if (this[listener]) {
      this[listener].clear();
    }
  }

  destroy() {
    if (this[listener]) {
      this[listener].destroy();
      this[listener] = null;
    }
  }

  on(event, selector, fn) {
    if (this[listener]) {
      return this[listener].on(event, selector, fn);
    }
    return null;
  }

  addEventListener(event, fn) {
    if (this[listener]) {
      return this[listener].addEventListener(event, fn, false);
    }
    return null;
  }

  removeEventListener(event, fn) {
    if (this[listener]) {
      this[listener].removeEventListener(event, fn, false);
    }
  }

  dispatchEvent(event, data) {
    if (this[listener]) {
      this[listener].dispatchEvent(
        new CustomEvent(event, {
          detail: data,
        })
      );
    }
  }
}

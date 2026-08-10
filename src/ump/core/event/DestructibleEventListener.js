const listener = Symbol('event_listener');
const listeners = Symbol('event_listeners');

export default class DestructibleEventListener {
  constructor(eventListener) {
    this[listener] = eventListener;
    this[listeners] = new Map();
  }

  clear() {
    if (this[listeners]) {
      for (let entry of this[listeners]) {
        for (let fn of entry[1]) {
          this[listener].removeEventListener(entry[0], fn);
        }
      }
    }
    this[listeners].clear();
  }

  destroy() {
    this.clear();
    this[listeners] = null;
  }

  on(event, selector, fn) {
    if (fn == undefined) {
      fn = selector;
      selector = null;
    }
    if (selector) {
      return this.addEventListener(event, (e) => {
        if (e.target.matches(selector)) {
          fn(e);
        }
      });
    } else {
      return this.addEventListener(event, fn);
    }
  }

  addEventListener(event, fn) {
    if (!this[listeners].has(event)) {
      this[listeners].set(event, new Set());
    }
    this[listeners].get(event).add(fn);
    this[listener].addEventListener(event, fn, false);
    return fn;
  }

  removeEventListener(event, fn) {
    this[listener].removeEventListener(event, fn, false);
    if (this[listeners].has(event)) {
      //this[listeners].set(event, new Set());
      let ev = this[listeners].get(event);
      ev.delete(fn);
      if (!ev.size) {
        this[listeners].delete(event);
      }
    }
  }

  dispatchEvent(event) {
    if (this[listener]) {
      this[listener].dispatchEvent(event);
    }
  }
}

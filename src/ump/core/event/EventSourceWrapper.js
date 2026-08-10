export default class EventSourceWrapper {
  constructor(eventSource) {
    this.eventSource = eventSource;
    this[listeners] = new Map();
  }

  on(event, selector, fn) {
    if (!this[listeners].has(event)) {
      this[listeners].set(event, new Set());
    }
    let listener = this.eventSource.on(event, selector, fn);
    if (listener) {
      this[listeners].get(event).add(listener);
    }
  }

  off(event, fn) {
    this.eventSource.removeEventListener(event, fn);
  }

  clear() {
    this.eventSource.clear();
    this[listeners].clear();
  }

  destroy() {
    this.eventSource.clear();
    this[listeners] = null;
    this.eventSource = null;
  }
}

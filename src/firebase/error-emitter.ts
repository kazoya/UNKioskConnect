type Listener<T> = (data: T) => void;

class EventEmitter<TEventMap extends Record<string, any>> {
  private listeners: {
    [K in keyof TEventMap]?: Array<Listener<TEventMap[K]>>;
  } = {};

  on<K extends keyof TEventMap>(event: K, listener: Listener<TEventMap[K]>) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  off<K extends keyof TEventMap>(event: K, listener: Listener<TEventMap[K]>) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event]!.filter(
      (l) => l !== listener
    );
  }

  emit<K extends keyof TEventMap>(event: K, data: TEventMap[K]) {
    if (!this.listeners[event]) return;
    this.listeners[event]!.forEach((listener) => listener(data));
  }
}

interface AppEvents {
  'permission-error': Error;
}

export const errorEmitter = new EventEmitter<AppEvents>();

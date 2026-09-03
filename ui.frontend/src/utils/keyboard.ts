export interface KeyBindings {
  [key: string]: (event: KeyboardEvent) => void;
}

export class KeyboardManager {
  private bindings: Map<string, (event: KeyboardEvent) => void> = new Map();

  on(key: string, handler: (event: KeyboardEvent) => void): void {
    this.bindings.set(key, handler);
  }

  off(key: string): void {
    this.bindings.delete(key);
  }

  handle(event: KeyboardEvent): void {
    const handler = this.bindings.get(event.key);
    if (handler) {
      event.preventDefault();
      handler(event);
    }
  }

  clear(): void {
    this.bindings.clear();
  }
}

export function createKeyHandler(key: string, callback: () => void): (event: KeyboardEvent) => void {
  return (event: KeyboardEvent) => {
    if (event.key === key) {
      event.preventDefault();
      callback();
    }
  };
}

class StorageService {
  private static isAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
    try {
      const storage = type === 'localStorage' ? window.localStorage : window.sessionStorage;
      const test = '__storage_test__';
      storage.setItem(test, test);
      storage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  static getItem(key: string): string | null {
    if (!this.isAvailable('localStorage')) {
      return null;
    }
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  static setItem(key: string, value: string): void {
    if (!this.isAvailable('localStorage')) {
      return;
    }
    try {
      window.localStorage.setItem(key, value);
    } catch {
      console.warn('Failed to set item in localStorage');
    }
  }

  static removeItem(key: string): void {
    if (!this.isAvailable('localStorage')) {
      return;
    }
    try {
      window.localStorage.removeItem(key);
    } catch {
      console.warn('Failed to remove item from localStorage');
    }
  }

  static clear(): void {
    if (!this.isAvailable('localStorage')) {
      return;
    }
    try {
      window.localStorage.clear();
    } catch {
      console.warn('Failed to clear localStorage');
    }
  }
}

export default StorageService;
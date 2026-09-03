export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  addedAt: number;
}

type WishlistSubscriber = (items: WishlistItem[]) => void;

class WishlistServiceImpl {
  private items: WishlistItem[] = [];
  private subscribers: Set<WishlistSubscriber> = new Set();
  private storageKey = 'ecom_wishlist';

  constructor() {
    this.loadFromStorage();
  }

  subscribe(callback: WishlistSubscriber): () => void {
    this.subscribers.add(callback);
    callback(this.items);
    return () => this.subscribers.delete(callback);
  }

  private notify(): void {
    this.subscribers.forEach(callback => callback(this.items));
    this.saveToStorage();
  }

  addItem(item: WishlistItem): void {
    const exists = this.items.some(i => i.id === item.id);
    if (!exists) {
      this.items.push({
        ...item,
        addedAt: Date.now()
      });
      this.notify();
    }
  }

  removeItem(itemId: string): void {
    this.items = this.items.filter(i => i.id !== itemId);
    this.notify();
  }

  hasItem(itemId: string): boolean {
    return this.items.some(i => i.id === itemId);
  }

  getItems(): WishlistItem[] {
    return this.items;
  }

  clear(): void {
    this.items = [];
    this.notify();
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (e) {
      console.error('Failed to save wishlist to storage', e);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.items = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load wishlist from storage', e);
      this.items = [];
    }
  }
}

export const WishlistService = new WishlistServiceImpl();

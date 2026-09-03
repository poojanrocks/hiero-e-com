export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

type CartSubscriber = (items: CartItem[]) => void;

class CartServiceImpl {
  private items: CartItem[] = [];
  private subscribers: Set<CartSubscriber> = new Set();
  private storageKey = 'ecom_cart';

  constructor() {
    this.loadFromStorage();
  }

  subscribe(callback: CartSubscriber): () => void {
    this.subscribers.add(callback);
    callback(this.items);
    return () => this.subscribers.delete(callback);
  }

  private notify(): void {
    this.subscribers.forEach(callback => callback(this.items));
    this.saveToStorage();
  }

  addItem(item: CartItem): void {
    const existingItem = this.items.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.items.push(item);
    }
    this.notify();
  }

  removeItem(itemId: string): void {
    this.items = this.items.filter(i => i.id !== itemId);
    this.notify();
  }

  updateQuantity(itemId: string, quantity: number): void {
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(itemId);
      } else {
        item.quantity = quantity;
        this.notify();
      }
    }
  }

  getItems(): CartItem[] {
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
      console.error('Failed to save cart to storage', e);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.items = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
      this.items = [];
    }
  }
}

export const CartService = new CartServiceImpl();

import { stateManager } from './state-manager';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

class CartService {
  private storageKey = 'hiero-ecom-cart';
  private items: CartItem[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.items = JSON.parse(stored);
        this.syncCount();
      }
    } catch (error) {
      console.error('Failed to load cart from storage:', error);
      this.items = [];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
      this.syncCount();
    } catch (error) {
      console.error('Failed to save cart to storage:', error);
    }
  }

  private syncCount(): void {
    const totalCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
    stateManager.updateCartCount(totalCount);
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  addItem(item: CartItem): void {
    const existing = this.items.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.items.push({ ...item });
    }
    this.saveToStorage();
  }

  removeItem(id: string): void {
    this.items = this.items.filter(i => i.id !== id);
    this.saveToStorage();
  }

  updateQuantity(id: string, quantity: number): void {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.quantity = Math.max(0, quantity);
      if (item.quantity === 0) {
        this.removeItem(id);
      } else {
        this.saveToStorage();
      }
    }
  }

  clear(): void {
    this.items = [];
    this.saveToStorage();
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}

export const cartService = new CartService();

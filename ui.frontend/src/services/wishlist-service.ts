import { stateManager } from './state-manager';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image?: string;
}

class WishlistService {
  private storageKey = 'hiero-ecom-wishlist';
  private items: WishlistItem[] = [];

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
      console.error('Failed to load wishlist from storage:', error);
      this.items = [];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
      this.syncCount();
    } catch (error) {
      console.error('Failed to save wishlist to storage:', error);
    }
  }

  private syncCount(): void {
    stateManager.updateWishlistCount(this.items.length);
  }

  getItems(): WishlistItem[] {
    return [...this.items];
  }

  addItem(item: WishlistItem): void {
    const exists = this.items.some(i => i.id === item.id);
    if (!exists) {
      this.items.push({ ...item });
      this.saveToStorage();
    }
  }

  removeItem(id: string): void {
    this.items = this.items.filter(i => i.id !== id);
    this.saveToStorage();
  }

  isInWishlist(id: string): boolean {
    return this.items.some(i => i.id === id);
  }

  clear(): void {
    this.items = [];
    this.saveToStorage();
  }
}

export const wishlistService = new WishlistService();

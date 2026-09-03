import type { Wishlist, WishlistItem } from '../types';
import { StateManager } from './state-manager';

export class WishlistService {
  private stateManager: StateManager;
  private readonly API_ENDPOINT = '/api/wishlist';

  constructor() {
    this.stateManager = StateManager.getInstance();
  }

  getWishlist(): Wishlist {
    return this.stateManager.getState().wishlist;
  }

  addItem(item: Omit<WishlistItem, 'addedAt'>): void {
    const currentWishlist = this.getWishlist();
    const exists = currentWishlist.items.some(i => i.id === item.id);

    if (!exists) {
      const newItem: WishlistItem = {
        ...item,
        addedAt: Date.now()
      };
      currentWishlist.items.push(newItem);
      this.updateWishlist(currentWishlist);
      this.dispatchEvent('wishlist:item-added', newItem);
    }
  }

  removeItem(itemId: string): void {
    const currentWishlist = this.getWishlist();
    currentWishlist.items = currentWishlist.items.filter(i => i.id !== itemId);
    this.updateWishlist(currentWishlist);
    this.dispatchEvent('wishlist:item-removed', { id: itemId });
  }

  hasItem(itemId: string): boolean {
    return this.getWishlist().items.some(i => i.id === itemId);
  }

  getCount(): number {
    return this.getWishlist().count;
  }

  clear(): void {
    this.stateManager.updateWishlist({
      items: [],
      count: 0
    });
    this.dispatchEvent('wishlist:cleared', null);
  }

  private updateWishlist(wishlist: Wishlist): void {
    this.stateManager.updateWishlist({
      ...wishlist,
      count: wishlist.items.length
    });
  }

  private dispatchEvent(eventName: string, detail: any): void {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
  }
}

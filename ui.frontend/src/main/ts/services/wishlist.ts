export interface WishlistItem {
  id: string;
  name: string;
  addedAt: string;
}

export class WishlistService {
  private readonly storageKey = 'hiero-ecom-wishlist';

  async getCount(): Promise<number> {
    try {
      const response = await fetch('/api/wishlist/count', {
        credentials: 'include',
      });

      if (!response.ok) {
        return this.getLocalCount();
      }

      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      console.error('Failed to get wishlist count:', error);
      return this.getLocalCount();
    }
  }

  async addItem(itemId: string): Promise<boolean> {
    try {
      const response = await fetch('/api/wishlist/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ itemId }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to add item to wishlist:', error);
      return false;
    }
  }

  async removeItem(itemId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/wishlist/items/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to remove item from wishlist:', error);
      return false;
    }
  }

  private getLocalCount(): number {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return 0;
      const wishlist = JSON.parse(data) as WishlistItem[];
      return wishlist.length;
    } catch {
      return 0;
    }
  }
}

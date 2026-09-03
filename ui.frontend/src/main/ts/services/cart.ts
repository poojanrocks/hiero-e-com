export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export class CartService {
  private readonly storageKey = 'hiero-ecom-cart';

  async getCount(): Promise<number> {
    try {
      const response = await fetch('/api/cart/count', {
        credentials: 'include',
      });

      if (!response.ok) {
        return this.getLocalCount();
      }

      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      console.error('Failed to get cart count:', error);
      return this.getLocalCount();
    }
  }

  async addItem(itemId: string, quantity: number = 1): Promise<boolean> {
    try {
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ itemId, quantity }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      return false;
    }
  }

  async removeItem(itemId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      return false;
    }
  }

  private getLocalCount(): number {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return 0;
      const cart = JSON.parse(data) as CartItem[];
      return cart.reduce((sum, item) => sum + item.quantity, 0);
    } catch {
      return 0;
    }
  }
}

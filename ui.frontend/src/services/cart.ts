import type { Cart, CartItem } from '../types';
import { StateManager } from './state-manager';

export class CartService {
  private stateManager: StateManager;
  private readonly API_ENDPOINT = '/api/cart';

  constructor() {
    this.stateManager = StateManager.getInstance();
  }

  getCart(): Cart {
    return this.stateManager.getState().cart;
  }

  addItem(item: CartItem): void {
    const currentCart = this.getCart();
    const existingItem = currentCart.items.find(i => i.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      currentCart.items.push(item);
    }

    this.updateCart(currentCart);
    this.dispatchEvent('cart:item-added', item);
  }

  removeItem(itemId: string): void {
    const currentCart = this.getCart();
    currentCart.items = currentCart.items.filter(i => i.id !== itemId);
    this.updateCart(currentCart);
    this.dispatchEvent('cart:item-removed', { id: itemId });
  }

  updateQuantity(itemId: string, quantity: number): void {
    const currentCart = this.getCart();
    const item = currentCart.items.find(i => i.id === itemId);

    if (item) {
      if (quantity <= 0) {
        this.removeItem(itemId);
      } else {
        item.quantity = quantity;
        this.updateCart(currentCart);
        this.dispatchEvent('cart:quantity-updated', { id: itemId, quantity });
      }
    }
  }

  clear(): void {
    this.stateManager.updateCart({
      items: [],
      total: 0,
      itemCount: 0
    });
    this.dispatchEvent('cart:cleared', null);
  }

  getItemCount(): number {
    return this.getCart().itemCount;
  }

  getTotal(): number {
    return this.getCart().total;
  }

  private updateCart(cart: Cart): void {
    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    this.stateManager.updateCart({
      ...cart,
      total,
      itemCount
    });
  }

  private dispatchEvent(eventName: string, detail: any): void {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
  }
}

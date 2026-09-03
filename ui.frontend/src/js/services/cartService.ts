import { CartItem } from '../types';

class CartService {
  private static instance: CartService;
  private cartKey = 'hiero_ecom_cart';
  private listeners: Set<() => void> = new Set();

  private constructor() {}

  static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService();
    }
    return CartService.instance;
  }

  getCart(): CartItem[] {
    try {
      const data = localStorage.getItem(this.cartKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  addItem(item: CartItem): void {
    const cart = this.getCart();
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      cart.push(item);
    }
    this.saveCart(cart);
  }

  removeItem(itemId: string): void {
    const cart = this.getCart().filter(i => i.id !== itemId);
    this.saveCart(cart);
  }

  updateQuantity(itemId: string, quantity: number): void {
    const cart = this.getCart();
    const item = cart.find(i => i.id === itemId);
    if (item) {
      item.quantity = Math.max(0, quantity);
      if (item.quantity === 0) {
        this.removeItem(itemId);
      } else {
        this.saveCart(cart);
      }
    }
  }

  clear(): void {
    this.saveCart([]);
  }

  getItemCount(): number {
    return this.getCart().reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private saveCart(cart: CartItem[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

export default CartService.getInstance();
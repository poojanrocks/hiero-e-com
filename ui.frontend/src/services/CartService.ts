import StorageService from './StorageService';

interface CartItem {
  productId: string;
  quantity: number;
  timestamp: number;
}

type CartSubscriber = (count: number) => void;

class CartService {
  private static readonly STORAGE_KEY = 'ecom_cart';
  private static subscribers: Set<CartSubscriber> = new Set();

  static async getCartCount(): Promise<number> {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  static async addItem(productId: string, quantity: number): Promise<void> {
    const cart = this.getCart();
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.timestamp = Date.now();
    } else {
      cart.push({
        productId,
        quantity,
        timestamp: Date.now()
      });
    }

    this.saveCart(cart);
    this.notifySubscribers();
  }

  static async removeItem(productId: string): Promise<void> {
    const cart = this.getCart().filter(item => item.productId !== productId);
    this.saveCart(cart);
    this.notifySubscribers();
  }

  static subscribe(callback: CartSubscriber): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private static getCart(): CartItem[] {
    try {
      const stored = StorageService.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private static saveCart(cart: CartItem[]): void {
    StorageService.setItem(this.STORAGE_KEY, JSON.stringify(cart));
  }

  private static notifySubscribers(): void {
    this.getCartCount().then(count => {
      this.subscribers.forEach(callback => callback(count));
    });
  }
}

export default CartService;
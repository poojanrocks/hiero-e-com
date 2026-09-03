import StorageService from './StorageService';

interface WishlistItem {
  productId: string;
  timestamp: number;
}

type WishlistSubscriber = (count: number) => void;

class WishlistService {
  private static readonly STORAGE_KEY = 'ecom_wishlist';
  private static subscribers: Set<WishlistSubscriber> = new Set();

  static async getWishlistCount(): Promise<number> {
    return this.getWishlist().length;
  }

  static async addItem(productId: string): Promise<void> {
    const wishlist = this.getWishlist();

    if (!wishlist.find(item => item.productId === productId)) {
      wishlist.push({
        productId,
        timestamp: Date.now()
      });
      this.saveWishlist(wishlist);
      this.notifySubscribers();
    }
  }

  static async removeItem(productId: string): Promise<void> {
    const wishlist = this.getWishlist().filter(item => item.productId !== productId);
    this.saveWishlist(wishlist);
    this.notifySubscribers();
  }

  static async isInWishlist(productId: string): Promise<boolean> {
    return this.getWishlist().some(item => item.productId === productId);
  }

  static subscribe(callback: WishlistSubscriber): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private static getWishlist(): WishlistItem[] {
    try {
      const stored = StorageService.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private static saveWishlist(wishlist: WishlistItem[]): void {
    StorageService.setItem(this.STORAGE_KEY, JSON.stringify(wishlist));
  }

  private static notifySubscribers(): void {
    this.getWishlistCount().then(count => {
      this.subscribers.forEach(callback => callback(count));
    });
  }
}

export default WishlistService;
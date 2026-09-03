class WishlistService {
  private static instance: WishlistService;
  private wishlistKey = 'hiero_ecom_wishlist';
  private listeners: Set<() => void> = new Set();

  private constructor() {}

  static getInstance(): WishlistService {
    if (!WishlistService.instance) {
      WishlistService.instance = new WishlistService();
    }
    return WishlistService.instance;
  }

  getWishlist(): string[] {
    try {
      const data = localStorage.getItem(this.wishlistKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  addItem(itemId: string): void {
    const wishlist = this.getWishlist();
    if (!wishlist.includes(itemId)) {
      wishlist.push(itemId);
      this.saveWishlist(wishlist);
    }
  }

  removeItem(itemId: string): void {
    const wishlist = this.getWishlist().filter(id => id !== itemId);
    this.saveWishlist(wishlist);
  }

  has(itemId: string): boolean {
    return this.getWishlist().includes(itemId);
  }

  clear(): void {
    this.saveWishlist([]);
  }

  getCount(): number {
    return this.getWishlist().length;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private saveWishlist(wishlist: string[]): void {
    localStorage.setItem(this.wishlistKey, JSON.stringify(wishlist));
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

export default WishlistService.getInstance();
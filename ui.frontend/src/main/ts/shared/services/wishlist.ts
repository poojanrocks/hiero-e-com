/**
 * Wishlist Service
 * Manages wishlist state and interactions
 */

interface WishlistItem {
  id: string;
  [key: string]: any;
}

interface WishlistState {
  items: WishlistItem[];
  itemCount: number;
  isLoading: boolean;
  error: string | null;
}

class WishlistService {
  private state: WishlistState = {
    items: [],
    itemCount: 0,
    isLoading: false,
    error: null
  };
  private listeners: Set<(state: WishlistState) => void> = new Set();

  public initialize(container: HTMLElement): void {
    this.loadWishlistCount();
    this.setupWishlistTriggers(container);
  }

  private loadWishlistCount(): void {
    const wishlistCountEl = document.querySelector('[data-wishlist-count]');
    if (wishlistCountEl) {
      const count = parseInt(wishlistCountEl.getAttribute('data-wishlist-count') || '0', 10);
      this.state.itemCount = count;
      this.notifyListeners();
    }
  }

  private setupWishlistTriggers(container: HTMLElement): void {
    const wishlistTrigger = container.querySelector('[data-wishlist-toggle]');
    if (wishlistTrigger) {
      wishlistTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/wishlist';
      });
    }
  }

  public async addToWishlist(productId: string): Promise<void> {
    this.state.isLoading = true;
    this.notifyListeners();

    try {
      const response = await fetch('/api/wishlist/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      if (!response.ok) throw new Error('Failed to add to wishlist');
      this.state.itemCount += 1;
      this.state.error = null;
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Unknown error';
    } finally {
      this.state.isLoading = false;
      this.notifyListeners();
    }
  }

  public async removeFromWishlist(productId: string): Promise<void> {
    this.state.isLoading = true;
    this.notifyListeners();

    try {
      const response = await fetch('/api/wishlist/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      if (!response.ok) throw new Error('Failed to remove from wishlist');
      this.state.itemCount = Math.max(0, this.state.itemCount - 1);
      this.state.error = null;
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Unknown error';
    } finally {
      this.state.isLoading = false;
      this.notifyListeners();
    }
  }

  public subscribe(listener: (state: WishlistState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  public getState(): WishlistState {
    return { ...this.state };
  }
}

const wishlistService = new WishlistService();

export function initializeWishlist(container: HTMLElement): void {
  wishlistService.initialize(container);
}

export { WishlistService, wishlistService };
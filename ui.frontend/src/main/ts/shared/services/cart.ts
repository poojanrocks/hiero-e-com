/**
 * Cart Service
 * Manages cart state and interactions
 */

interface CartItem {
  id: string;
  quantity: number;
  [key: string]: any;
}

interface CartState {
  items: CartItem[];
  itemCount: number;
  isLoading: boolean;
  error: string | null;
}

class CartService {
  private state: CartState = {
    items: [],
    itemCount: 0,
    isLoading: false,
    error: null
  };
  private listeners: Set<(state: CartState) => void> = new Set();

  public initialize(container: HTMLElement): void {
    this.loadCartCount();
    this.setupCartTriggers(container);
  }

  private loadCartCount(): void {
    const cartCountEl = document.querySelector('[data-cart-count]');
    if (cartCountEl) {
      const count = parseInt(cartCountEl.getAttribute('data-cart-count') || '0', 10);
      this.state.itemCount = count;
      this.notifyListeners();
    }
  }

  private setupCartTriggers(container: HTMLElement): void {
    const cartTrigger = container.querySelector('[data-cart-toggle]');
    if (cartTrigger) {
      cartTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/cart';
      });
    }
  }

  public async addToCart(productId: string, quantity: number = 1): Promise<void> {
    this.state.isLoading = true;
    this.notifyListeners();

    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
      });
      if (!response.ok) throw new Error('Failed to add to cart');
      this.state.itemCount += quantity;
      this.state.error = null;
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Unknown error';
    } finally {
      this.state.isLoading = false;
      this.notifyListeners();
    }
  }

  public subscribe(listener: (state: CartState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  public getState(): CartState {
    return { ...this.state };
  }
}

const cartService = new CartService();

export function initializeCart(container: HTMLElement): void {
  cartService.initialize(container);
}

export { CartService, cartService };
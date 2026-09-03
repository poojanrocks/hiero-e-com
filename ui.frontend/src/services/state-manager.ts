import type { AppState, StateListener, Cart, SearchQuery, Wishlist } from '../types';

export class StateManager {
  private static instance: StateManager;
  private state: AppState;
  private listeners: Set<StateListener> = new Set();
  private readonly STORAGE_KEY = 'hiero-ecom-state';

  private constructor() {
    this.state = this.initializeState();
    this.hydrate();
  }

  static getInstance(): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager();
    }
    return StateManager.instance;
  }

  private initializeState(): AppState {
    return {
      cart: {
        items: [],
        total: 0,
        itemCount: 0
      },
      search: {
        term: '',
        results: [],
        loading: false
      },
      wishlist: {
        items: [],
        count: 0
      },
      mobileMenuOpen: false,
      mobileSearchOpen: false
    };
  }

  getState(): AppState {
    return { ...this.state };
  }

  updateCart(cart: Partial<Cart>): void {
    this.state.cart = { ...this.state.cart, ...cart };
    this.persist();
    this.notifyListeners();
  }

  updateSearch(search: Partial<SearchQuery>): void {
    this.state.search = { ...this.state.search, ...search };
    this.notifyListeners();
  }

  updateWishlist(wishlist: Partial<Wishlist>): void {
    this.state.wishlist = { ...this.state.wishlist, ...wishlist };
    this.persist();
    this.notifyListeners();
  }

  setMobileMenuOpen(open: boolean): void {
    this.state.mobileMenuOpen = open;
    this.notifyListeners();
  }

  setMobileSearchOpen(open: boolean): void {
    this.state.mobileSearchOpen = open;
    this.notifyListeners();
  }

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  private hydrate(): void {
    try {
      if (typeof localStorage === 'undefined') return;
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.state = { ...this.state, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to hydrate state from localStorage', error);
    }
  }

  private persist(): void {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        cart: this.state.cart,
        wishlist: this.state.wishlist
      }));
    } catch (error) {
      console.warn('Failed to persist state to localStorage', error);
    }
  }

  reset(): void {
    this.state = this.initializeState();
    this.persist();
    this.notifyListeners();
  }
}

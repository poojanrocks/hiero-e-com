export interface State {
  cartCount: number;
  wishlistCount: number;
  searchQuery: string;
  isSearchOpen: boolean;
}

type StateListener = (state: State) => void;

const defaultState: State = {
  cartCount: 0,
  wishlistCount: 0,
  searchQuery: '',
  isSearchOpen: false,
};

class StateManager {
  private state: State = defaultState;
  private listeners: Set<StateListener> = new Set();
  private storageKey = 'hiero-ecom-state';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.state = { ...defaultState, ...parsed };
      }
    } catch (error) {
      console.error('Failed to load state from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (error) {
      console.error('Failed to save state to storage:', error);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  getState(): State {
    return { ...this.state };
  }

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  updateCartCount(count: number): void {
    const newCount = Math.max(0, count);
    if (newCount !== this.state.cartCount) {
      this.state.cartCount = newCount;
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  incrementCartCount(): void {
    this.updateCartCount(this.state.cartCount + 1);
  }

  decrementCartCount(): void {
    this.updateCartCount(this.state.cartCount - 1);
  }

  updateWishlistCount(count: number): void {
    const newCount = Math.max(0, count);
    if (newCount !== this.state.wishlistCount) {
      this.state.wishlistCount = newCount;
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  incrementWishlistCount(): void {
    this.updateWishlistCount(this.state.wishlistCount + 1);
  }

  decrementWishlistCount(): void {
    this.updateWishlistCount(this.state.wishlistCount - 1);
  }

  setSearchQuery(query: string): void {
    if (query !== this.state.searchQuery) {
      this.state.searchQuery = query;
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  toggleSearchOpen(): void {
    this.state.isSearchOpen = !this.state.isSearchOpen;
    this.saveToStorage();
    this.notifyListeners();
  }

  setSearchOpen(isOpen: boolean): void {
    if (isOpen !== this.state.isSearchOpen) {
      this.state.isSearchOpen = isOpen;
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  reset(): void {
    this.state = { ...defaultState };
    this.saveToStorage();
    this.notifyListeners();
  }
}

export const stateManager = new StateManager();

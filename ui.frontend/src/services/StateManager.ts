import type { AppState, NavigationItem } from '../types';

type StateListener = (state: AppState) => void;

const STORAGE_KEY = 'hiero_ecom_state';

const defaultState: AppState = {
  cartCount: 0,
  wishlistCount: 0,
  searchQuery: '',
  isSearchOpen: false,
  navigationItems: [],
};

class StateManager {
  private state: AppState;
  private listeners: Set<StateListener> = new Set();

  constructor() {
    this.state = this.loadState() || { ...defaultState };
  }

  private loadState(): AppState | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private saveState(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  getState(): AppState {
    return { ...this.state };
  }

  setState(updates: Partial<AppState>): void {
    this.state = { ...this.state, ...updates };
    this.saveState();
    this.notifyListeners();
  }

  updateCartCount(count: number): void {
    this.setState({ cartCount: Math.max(0, count) });
  }

  updateWishlistCount(count: number): void {
    this.setState({ wishlistCount: Math.max(0, count) });
  }

  setSearchQuery(query: string): void {
    this.setState({ searchQuery: query });
  }

  setSearchOpen(isOpen: boolean): void {
    this.setState({ isSearchOpen: isOpen });
  }

  setNavigationItems(items: NavigationItem[]): void {
    this.setState({ navigationItems: items });
  }

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  reset(): void {
    this.state = { ...defaultState };
    this.saveState();
    this.notifyListeners();
  }
}

export const stateManager = new StateManager();

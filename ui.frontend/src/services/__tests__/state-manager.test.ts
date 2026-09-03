import { StateManager } from '../state-manager';
import type { AppState } from '../../types';

describe('StateManager', () => {
  let stateManager: StateManager;

  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    stateManager = StateManager.getInstance();
  });

  afterEach(() => {
    stateManager.reset();
  });

  describe('Singleton Pattern', () => {
    it('should return same instance', () => {
      const instance1 = StateManager.getInstance();
      const instance2 = StateManager.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Cart Management', () => {
    it('should update cart state', () => {
      stateManager.updateCart({
        total: 100,
        itemCount: 2
      });

      const state = stateManager.getState();
      expect(state.cart.total).toBe(100);
      expect(state.cart.itemCount).toBe(2);
    });
  });

  describe('Search Management', () => {
    it('should update search state', () => {
      stateManager.updateSearch({
        term: 'test',
        loading: true
      });

      const state = stateManager.getState();
      expect(state.search.term).toBe('test');
      expect(state.search.loading).toBe(true);
    });
  });

  describe('Wishlist Management', () => {
    it('should update wishlist state', () => {
      stateManager.updateWishlist({
        count: 5
      });

      const state = stateManager.getState();
      expect(state.wishlist.count).toBe(5);
    });
  });

  describe('State Subscription', () => {
    it('should notify listeners on state change', () => {
      const listener = jest.fn();
      stateManager.subscribe(listener);
      stateManager.setMobileMenuOpen(true);

      expect(listener).toHaveBeenCalled();
    });

    it('should unsubscribe listener', () => {
      const listener = jest.fn();
      const unsubscribe = stateManager.subscribe(listener);
      unsubscribe();
      stateManager.setMobileMenuOpen(true);

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('Persistence', () => {
    it('should persist cart and wishlist to localStorage', () => {
      stateManager.updateCart({
        total: 50,
        itemCount: 1
      });

      const stored = localStorage.getItem('hiero-ecom-state');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored || '{}');
      expect(parsed.cart.total).toBe(50);
    });
  });

  describe('Reset', () => {
    it('should reset to initial state', () => {
      stateManager.updateCart({ total: 100 });
      stateManager.reset();

      const state = stateManager.getState();
      expect(state.cart.total).toBe(0);
      expect(state.cart.itemCount).toBe(0);
    });
  });
});

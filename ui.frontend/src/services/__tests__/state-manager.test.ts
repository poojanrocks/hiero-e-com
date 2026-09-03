import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { stateManager } from '../state-manager';

describe('StateManager', () => {
  beforeEach(() => {
    stateManager.reset();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with default state', () => {
    const state = stateManager.getState();
    expect(state.cartCount).toBe(0);
    expect(state.wishlistCount).toBe(0);
    expect(state.searchQuery).toBe('');
    expect(state.isSearchOpen).toBe(false);
  });

  it('should update cart count', () => {
    stateManager.updateCartCount(5);
    expect(stateManager.getState().cartCount).toBe(5);
  });

  it('should prevent negative cart count', () => {
    stateManager.updateCartCount(-1);
    expect(stateManager.getState().cartCount).toBe(0);
  });

  it('should update wishlist count', () => {
    stateManager.updateWishlistCount(3);
    expect(stateManager.getState().wishlistCount).toBe(3);
  });

  it('should set search query', () => {
    stateManager.setSearchQuery('laptop');
    expect(stateManager.getState().searchQuery).toBe('laptop');
  });

  it('should toggle search open state', () => {
    expect(stateManager.getState().isSearchOpen).toBe(false);
    stateManager.toggleSearchOpen();
    expect(stateManager.getState().isSearchOpen).toBe(true);
    stateManager.toggleSearchOpen();
    expect(stateManager.getState().isSearchOpen).toBe(false);
  });

  it('should notify listeners on state change', () => {
    const listener = (state: any) => {
      expect(state.cartCount).toBe(1);
    };
    stateManager.subscribe(listener);
    stateManager.incrementCartCount();
  });

  it('should allow unsubscribing from state changes', () => {
    let callCount = 0;
    const listener = () => {
      callCount++;
    };
    const unsubscribe = stateManager.subscribe(listener);
    stateManager.incrementCartCount();
    expect(callCount).toBe(1);
    unsubscribe();
    stateManager.incrementCartCount();
    expect(callCount).toBe(1);
  });

  it('should persist state to localStorage', () => {
    stateManager.updateCartCount(10);
    stateManager.setSearchQuery('test');
    const stored = localStorage.getItem('hiero-ecom-state');
    expect(stored).toBeDefined();
    const parsed = JSON.parse(stored!);
    expect(parsed.cartCount).toBe(10);
    expect(parsed.searchQuery).toBe('test');
  });

  it('should reset to default state', () => {
    stateManager.updateCartCount(5);
    stateManager.updateWishlistCount(3);
    stateManager.reset();
    const state = stateManager.getState();
    expect(state.cartCount).toBe(0);
    expect(state.wishlistCount).toBe(0);
  });
});

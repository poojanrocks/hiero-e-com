import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { stateManager } from '../StateManager';
import type { AppState } from '../../types';

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
    const state = stateManager.getState();
    expect(state.cartCount).toBe(5);
  });

  it('should prevent negative cart count', () => {
    stateManager.updateCartCount(-1);
    const state = stateManager.getState();
    expect(state.cartCount).toBe(0);
  });

  it('should update wishlist count', () => {
    stateManager.updateWishlistCount(3);
    const state = stateManager.getState();
    expect(state.wishlistCount).toBe(3);
  });

  it('should set search query', () => {
    stateManager.setSearchQuery('laptop');
    const state = stateManager.getState();
    expect(state.searchQuery).toBe('laptop');
  });

  it('should toggle search open state', () => {
    stateManager.setSearchOpen(true);
    expect(stateManager.getState().isSearchOpen).toBe(true);
    stateManager.setSearchOpen(false);
    expect(stateManager.getState().isSearchOpen).toBe(false);
  });

  it('should notify listeners on state change', () => {
    const listener = vi.fn();
    stateManager.subscribe(listener);
    stateManager.updateCartCount(2);
    expect(listener).toHaveBeenCalled();
    const passedState = listener.mock.calls[0][0] as AppState;
    expect(passedState.cartCount).toBe(2);
  });

  it('should allow unsubscribing from state changes', () => {
    const listener = vi.fn();
    const unsubscribe = stateManager.subscribe(listener);
    unsubscribe();
    stateManager.updateCartCount(2);
    expect(listener).not.toHaveBeenCalled();
  });

  it('should persist state to localStorage', () => {
    stateManager.updateCartCount(7);
    const stored = localStorage.getItem('hiero_ecom_state');
    expect(stored).toBeTruthy();
    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed.cartCount).toBe(7);
    }
  });

  it('should reset to default state', () => {
    stateManager.updateCartCount(10);
    stateManager.updateWishlistCount(5);
    stateManager.reset();
    const state = stateManager.getState();
    expect(state.cartCount).toBe(0);
    expect(state.wishlistCount).toBe(0);
  });
});

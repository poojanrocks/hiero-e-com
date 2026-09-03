import { describe, it, expect, beforeEach } from 'vitest';
import wishlistService from '../js/services/wishlistService';

describe('WishlistService', () => {
  beforeEach(() => {
    wishlistService.clear();
  });

  it('should initialize with empty wishlist', () => {
    expect(wishlistService.getWishlist()).toEqual([]);
    expect(wishlistService.getCount()).toBe(0);
  });

  it('should add items to wishlist', () => {
    wishlistService.addItem('1');
    expect(wishlistService.getWishlist()).toContain('1');
    expect(wishlistService.getCount()).toBe(1);
  });

  it('should not add duplicate items', () => {
    wishlistService.addItem('1');
    wishlistService.addItem('1');
    expect(wishlistService.getCount()).toBe(1);
  });

  it('should check if item exists', () => {
    wishlistService.addItem('1');
    expect(wishlistService.has('1')).toBe(true);
    expect(wishlistService.has('2')).toBe(false);
  });

  it('should remove items from wishlist', () => {
    wishlistService.addItem('1');
    wishlistService.removeItem('1');
    expect(wishlistService.getWishlist()).not.toContain('1');
  });

  it('should clear wishlist', () => {
    wishlistService.addItem('1');
    wishlistService.addItem('2');
    wishlistService.clear();
    expect(wishlistService.getWishlist()).toHaveLength(0);
  });

  it('should notify subscribers on changes', () => {
    let notified = false;
    const unsubscribe = wishlistService.subscribe(() => {
      notified = true;
    });
    wishlistService.addItem('1');
    expect(notified).toBe(true);
    unsubscribe();
  });
});
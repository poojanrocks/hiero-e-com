import { describe, it, expect, beforeEach } from 'vitest';
import cartService from '../js/services/cartService';

describe('CartService', () => {
  beforeEach(() => {
    cartService.clear();
  });

  it('should initialize with empty cart', () => {
    expect(cartService.getCart()).toEqual([]);
    expect(cartService.getItemCount()).toBe(0);
  });

  it('should add items to cart', () => {
    const item = { id: '1', name: 'Product', quantity: 1, price: 10 };
    cartService.addItem(item);
    expect(cartService.getCart()).toHaveLength(1);
    expect(cartService.getItemCount()).toBe(1);
  });

  it('should increment quantity for duplicate items', () => {
    const item = { id: '1', name: 'Product', quantity: 1, price: 10 };
    cartService.addItem(item);
    cartService.addItem({ ...item, quantity: 2 });
    const cart = cartService.getCart();
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(3);
  });

  it('should remove items from cart', () => {
    cartService.addItem({ id: '1', name: 'Product', quantity: 1, price: 10 });
    cartService.removeItem('1');
    expect(cartService.getCart()).toHaveLength(0);
  });

  it('should update item quantity', () => {
    cartService.addItem({ id: '1', name: 'Product', quantity: 1, price: 10 });
    cartService.updateQuantity('1', 5);
    expect(cartService.getCart()[0].quantity).toBe(5);
  });

  it('should remove item when quantity is set to 0', () => {
    cartService.addItem({ id: '1', name: 'Product', quantity: 1, price: 10 });
    cartService.updateQuantity('1', 0);
    expect(cartService.getCart()).toHaveLength(0);
  });

  it('should calculate total price correctly', () => {
    cartService.addItem({ id: '1', name: 'Product 1', quantity: 2, price: 10 });
    cartService.addItem({ id: '2', name: 'Product 2', quantity: 1, price: 20 });
    expect(cartService.getTotalPrice()).toBe(40);
  });

  it('should notify subscribers on changes', () => {
    let notified = false;
    const unsubscribe = cartService.subscribe(() => {
      notified = true;
    });
    cartService.addItem({ id: '1', name: 'Product', quantity: 1, price: 10 });
    expect(notified).toBe(true);
    unsubscribe();
  });
});
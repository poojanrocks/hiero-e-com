import { CartService } from '../cart';
import { StateManager } from '../state-manager';
import type { CartItem } from '../../types';

describe('CartService', () => {
  let cartService: CartService;
  let stateManager: StateManager;

  beforeEach(() => {
    stateManager = StateManager.getInstance();
    cartService = new CartService();
  });

  afterEach(() => {
    stateManager.reset();
  });

  describe('Add Item', () => {
    it('should add item to cart', () => {
      const item: CartItem = {
        id: '1',
        name: 'Test Product',
        price: 50,
        quantity: 1
      };

      cartService.addItem(item);
      const cart = cartService.getCart();

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].id).toBe('1');
    });

    it('should increase quantity if item exists', () => {
      const item: CartItem = {
        id: '1',
        name: 'Test Product',
        price: 50,
        quantity: 1
      };

      cartService.addItem(item);
      cartService.addItem(item);
      const cart = cartService.getCart();

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(2);
    });
  });

  describe('Remove Item', () => {
    it('should remove item from cart', () => {
      const item: CartItem = {
        id: '1',
        name: 'Test Product',
        price: 50,
        quantity: 1
      };

      cartService.addItem(item);
      cartService.removeItem('1');
      const cart = cartService.getCart();

      expect(cart.items).toHaveLength(0);
    });
  });

  describe('Update Quantity', () => {
    it('should update item quantity', () => {
      const item: CartItem = {
        id: '1',
        name: 'Test Product',
        price: 50,
        quantity: 1
      };

      cartService.addItem(item);
      cartService.updateQuantity('1', 5);
      const cart = cartService.getCart();

      expect(cart.items[0].quantity).toBe(5);
    });

    it('should remove item if quantity is 0', () => {
      const item: CartItem = {
        id: '1',
        name: 'Test Product',
        price: 50,
        quantity: 1
      };

      cartService.addItem(item);
      cartService.updateQuantity('1', 0);
      const cart = cartService.getCart();

      expect(cart.items).toHaveLength(0);
    });
  });

  describe('Cart Total', () => {
    it('should calculate total correctly', () => {
      cartService.addItem({
        id: '1',
        name: 'Product 1',
        price: 50,
        quantity: 2
      });
      cartService.addItem({
        id: '2',
        name: 'Product 2',
        price: 30,
        quantity: 1
      });

      const total = cartService.getTotal();
      expect(total).toBe(130); // (50*2) + (30*1)
    });
  });

  describe('Clear Cart', () => {
    it('should clear all items', () => {
      cartService.addItem({
        id: '1',
        name: 'Product 1',
        price: 50,
        quantity: 1
      });

      cartService.clear();
      const cart = cartService.getCart();

      expect(cart.items).toHaveLength(0);
      expect(cart.total).toBe(0);
    });
  });
});

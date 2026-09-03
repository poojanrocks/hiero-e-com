import { useState, useEffect } from 'react';
import CartService from '../services/CartService';

interface UseCartReturn {
  cartCount: number;
  isLoading: boolean;
  error: string | null;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
}

export const useCart = (): UseCartReturn => {
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCartCount = async () => {
      try {
        const count = await CartService.getCartCount();
        setCartCount(count);
      } catch (err) {
        setError('Failed to load cart');
      }
    };

    loadCartCount();

    const unsubscribe = CartService.subscribe((count) => {
      setCartCount(count);
    });

    return unsubscribe;
  }, []);

  const addToCart = async (productId: string, quantity: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await CartService.addItem(productId, quantity);
    } catch (err) {
      setError('Failed to add to cart');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await CartService.removeItem(productId);
    } catch (err) {
      setError('Failed to remove from cart');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { cartCount, isLoading, error, addToCart, removeFromCart };
};
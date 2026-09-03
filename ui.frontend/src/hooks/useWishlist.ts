import { useState, useEffect } from 'react';
import WishlistService from '../services/WishlistService';

interface UseWishlistReturn {
  wishlistCount: number;
  isLoading: boolean;
  error: string | null;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
}

export const useWishlist = (): UseWishlistReturn => {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWishlistCount = async () => {
      try {
        const count = await WishlistService.getWishlistCount();
        setWishlistCount(count);
      } catch (err) {
        setError('Failed to load wishlist');
      }
    };

    loadWishlistCount();

    const unsubscribe = WishlistService.subscribe((count) => {
      setWishlistCount(count);
    });

    return unsubscribe;
  }, []);

  const addToWishlist = async (productId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await WishlistService.addItem(productId);
    } catch (err) {
      setError('Failed to add to wishlist');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await WishlistService.removeItem(productId);
    } catch (err) {
      setError('Failed to remove from wishlist');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { wishlistCount, isLoading, error, addToWishlist, removeFromWishlist };
};
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { useUser } from './UserContext';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistItems: any[];
  loading: boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  fetchWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useUser();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchWishlist = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const data = await apiRequest<any[]>('/wishlist');
      setWishlistItems(data);
    } catch (e) {
      console.error('Failed to fetch wishlist:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchWishlist();
    }
  }, [currentUser]);

  const toggleWishlist = async (productId: string) => {
    try {
      await apiRequest('/wishlist/toggle', {
        method: 'POST',
        body: JSON.stringify({ productId })
      });
      await fetchWishlist();
    } catch (e) {
      console.error('Toggle wishlist error:', e);
    }
  };

  const wishlistIds = wishlistItems.map(item => item.productId);

  const isInWishlist = (productId: string) => {
    return wishlistIds.includes(productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistItems,
        loading,
        toggleWishlist,
        isInWishlist,
        fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};

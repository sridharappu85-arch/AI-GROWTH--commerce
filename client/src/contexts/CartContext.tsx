import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart } from '../types';
import { apiRequest } from '../utils/api';
import { useUser } from './UserContext';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number, reason?: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useUser();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCart = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const data = await apiRequest<Cart>('/cart');
      setCart(data);
    } catch (e) {
      console.error('Failed to fetch cart:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchCart();
    }
  }, [currentUser]);

  const addToCart = async (productId: string, quantity = 1, reason?: string) => {
    try {
      const updated = await apiRequest<Cart>('/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity, reason })
      });
      setCart(updated);
    } catch (e) {
      console.error('Failed to add to cart:', e);
      throw e;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const updated = await apiRequest<Cart>(`/cart/item/${itemId}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity })
      });
      setCart(updated);
    } catch (e) {
      console.error('Failed to update quantity:', e);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const updated = await apiRequest<Cart>(`/cart/item/${itemId}`, {
        method: 'DELETE'
      });
      setCart(updated);
    } catch (e) {
      console.error('Failed to remove item:', e);
    }
  };

  const clearCart = async () => {
    try {
      const updated = await apiRequest<Cart>('/cart/clear', {
        method: 'DELETE'
      });
      setCart(updated);
    } catch (e) {
      console.error('Failed to clear cart:', e);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

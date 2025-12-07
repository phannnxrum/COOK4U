import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    chef: null,
    dishes: []
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addChef = (chef) => {
    setCart(prev => ({
      ...prev,
      chef: chef
    }));
  };

  const removeChef = () => {
    setCart(prev => ({
      ...prev,
      chef: null
    }));
  };

  const addDish = (dish) => {
    setCart(prev => ({
      ...prev,
      dishes: [...prev.dishes, { ...dish, cartId: Date.now() }]
    }));
  };

  const removeDish = (cartId) => {
    setCart(prev => ({
      ...prev,
      dishes: prev.dishes.filter(dish => dish.cartId !== cartId)
    }));
  };

  const clearCart = () => {
    setCart({
      chef: null,
      dishes: []
    });
  };

  const getCartCount = () => {
    let count = 0;
    if (cart.chef) count += 1;
    count += cart.dishes.length;
    return count;
  };

  const value = {
    cart,
    addChef,
    removeChef,
    addDish,
    removeDish,
    clearCart,
    getCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};


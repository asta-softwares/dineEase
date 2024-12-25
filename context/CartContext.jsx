import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    restaurantId: null,
    items: {},  // { itemId: { item: {}, quantity: number } }
  });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = async (newCart) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(newCart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (restaurantId, item, quantity) => {
    setCart(prevCart => {
      // If different restaurant, clear cart
      if (prevCart.restaurantId && prevCart.restaurantId !== restaurantId) {
        const newCart = {
          restaurantId,
          items: quantity > 0 ? { [item.id]: { item, quantity } } : {}
        };
        saveCart(newCart);
        return newCart;
      }

      // Update existing cart
      const newCart = {
        restaurantId,
        items: {
          ...prevCart.items,
          [item.id]: {
            item,
            quantity
          }
        }
      };

      // Remove item if quantity is 0
      if (quantity === 0) {
        delete newCart.items[item.id];
      }

      // If cart is empty, clear restaurant ID
      if (Object.keys(newCart.items).length === 0) {
        newCart.restaurantId = null;
      }

      saveCart(newCart);
      return newCart;
    });
  };

  const updateQuantity = (itemId, quantity) => {
    setCart(prevCart => {
      const newCart = {
        ...prevCart,
        items: {
          ...prevCart.items,
        }
      };

      if (quantity > 0) {
        newCart.items[itemId] = {
          ...prevCart.items[itemId],
          quantity
        };
      } else {
        delete newCart.items[itemId];
      }

      // If cart is empty, clear restaurant ID
      if (Object.keys(newCart.items).length === 0) {
        newCart.restaurantId = null;
      }

      saveCart(newCart);
      return newCart;
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      const newItems = { ...prevCart.items };
      delete newItems[itemId];
      const newCart = {
        ...prevCart,
        items: newItems
      };
      saveCart(newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    const emptyCart = { restaurantId: null, items: {} };
    setCart(emptyCart);
    saveCart(emptyCart);
  };

  const getItemQuantity = (itemId) => {
    return cart.items[itemId]?.quantity || 0;
  };

  const getTotalItems = () => {
    return Object.values(cart.items).reduce((sum, { quantity }) => sum + quantity, 0);
  };

  const getTotalCost = () => {
    return Object.values(cart.items).reduce((total, { item, quantity }) => total + (item.cost * quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getItemQuantity,
      getTotalItems,
      getTotalCost
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext({
  cart: { restaurantId: null, items: {}, promos: [], owner_id: null },
  addToCart: () => {},
  updateQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  getTotalCost: () => {},
  addPromo: () => {},
  getItemQuantity: () => 0,
  getTotalItems: () => 0,
  getTotalCost: () => 0,
  removePromo: () => {},
  clearPromos: () => {},
  getPromos: () => {},
  validatePromo: () => {},
  setOwner: () => {},
});

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    restaurantId: null,
    promos: [],
    items: {},  // { itemId: { item: {}, quantity: number } }
    owner_id: null,
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

  const setOwner = (ownerId) => {
    setCart(prevCart => {
      const newCart = {
        ...prevCart,
        owner_id: ownerId
      };
      saveCart(newCart);
      return newCart;
    });
  };

  const addToCart = (restaurantId, item, quantity) => {
    setCart(prevCart => {
      // If different restaurant, clear cart
      if (prevCart.restaurantId && prevCart.restaurantId !== restaurantId) {
        const newCart = {
          restaurantId,
          items: quantity > 0 ? { [item.id]: { item, quantity } } : {},
          promos: [],
          owner_id: null // Reset owner when changing restaurant
        };
        saveCart(newCart);
        return newCart;
      }

      // Update existing cart
      const newCart = {
        ...prevCart,
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

      // If cart is empty, clear restaurant ID and owner
      if (Object.keys(newCart.items).length === 0) {
        newCart.restaurantId = null;
        newCart.owner_id = null;
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

      // If cart is empty, clear restaurant ID and owner
      if (Object.keys(newCart.items).length === 0) {
        newCart.restaurantId = null;
        newCart.owner_id = null;
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

  const updatePromos = (promos) => {
    setCart(prevCart => {
      const newCart = {
        ...prevCart,
        promos
      };
      saveCart(newCart);
      return newCart;
    });
  };

  const addPromo = async (promoId, orderTotal) => {
    try {
      if (!cart.restaurantId) {
        throw new Error('No restaurant selected');
      }

      // Validate promo with restaurant service
      const promos = await restaurantService.getOrderPromos(cart.restaurantId, orderTotal);
      const validPromo = promos.find(promo => promo.id === promoId);

      if (!validPromo) {
        throw new Error('Invalid promo code for this restaurant');
      }

      setCart(prevCart => {
        const newPromos = [...prevCart.promos];
        if (!newPromos.includes(promoId)) {
          newPromos.push(promoId);
        }
        const newCart = {
          ...prevCart,
          promos: newPromos
        };
        saveCart(newCart);
        return newCart;
      });

      return validPromo;
    } catch (error) {
      console.error('Error adding promo:', error);
      throw error;
    }
  };

  const validatePromo = async (promoId, orderTotal) => {
    try {
      if (!cart.restaurantId) {
        throw new Error('No restaurant selected');
      }

      const promos = await restaurantService.getOrderPromos(cart.restaurantId, orderTotal);
      return promos.find(promo => promo.id === promoId);
    } catch (error) {
      console.error('Error validating promo:', error);
      throw error;
    }
  };

  const removePromo = (promoId) => {
    setCart(prevCart => {
      const newPromos = prevCart.promos.filter(id => id !== promoId);
      const newCart = {
        ...prevCart,
        promos: newPromos
      };
      saveCart(newCart);
      return newCart;
    });
  };

  const clearPromos = () => {
    setCart(prevCart => {
      const newCart = {
        ...prevCart,
        promos: []
      };
      saveCart(newCart);
      return newCart;
    });
  };

  const getPromos = () => {
    return cart.promos;
  };

  const clearCart = () => {
    const emptyCart = {
      restaurantId: null,
      items: {},
      promos: [],
      owner_id: null
    };
    setCart(emptyCart);
    saveCart(emptyCart);
  };

  const getItemQuantity = (itemId) => {
    return cart.items[itemId]?.quantity || 0;
  };

  const getTotalItems = () => {
    if (!cart.items || Object.keys(cart.items).length === 0) return 0;
    return Object.values(cart.items).reduce((sum, { quantity }) => sum + quantity, 0);
  };

  const getTotalCost = () => {
    if (!cart.items || Object.keys(cart.items).length === 0) return 0;
    return Object.values(cart.items).reduce((total, { item, quantity }) => total + (item.discounted_cost * quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getTotalCost,
      addPromo,
      getItemQuantity,
      getTotalItems,
      getTotalCost,
      removePromo,
      clearPromos,
      getPromos,
      validatePromo,
      setOwner,
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

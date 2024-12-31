import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { useCart } from '../context/CartContext';
import { useUserStore } from '../stores/userStore';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const QuantitySelector = ({ quantity, onIncrease, onDecrease }) => (
  <View style={styles.quantitySelector}>
    <TouchableOpacity 
      onPress={onDecrease}
      disabled={quantity <= 0}
      style={[styles.quantityButton, quantity <= 0 && styles.quantityButtonDisabled]}
    >
      <Text style={styles.quantityButtonText}>-</Text>
    </TouchableOpacity>
    <Text style={styles.quantityText}>{quantity}</Text>
    <TouchableOpacity 
      onPress={onIncrease}
      style={styles.quantityButton}
    >
      <Text style={styles.quantityButtonText}>+</Text>
    </TouchableOpacity>
  </View>
);

const MenuDetails = ({ item, restaurantId, visible, onClose }) => {
  const { addToCart, getItemQuantity, updateQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const imageUrl = item?.images?.[0]?.image || 'https://via.placeholder.com/400';
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (visible) {
      const currentQuantity = getItemQuantity(item.id);
      setQuantity(currentQuantity || 1);
    }
  }, [visible, item.id]);

  const handleAddToCart = () => {
    if (quantity === 0) {
      // Remove from cart if quantity is 0
      updateQuantity(item.id, 0);
    } else {
      // Add or update cart
      addToCart(restaurantId, item, quantity);
    }
    onClose();
  };

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Animated.View 
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.content}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.image}
            resizeMode="cover"
          />
          
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View style={styles.details}>
              <Text style={[typography.h4, styles.name]}>{item?.name}</Text>
              <Text style={[typography.bodyMedium, styles.description]}>
                {item?.description}
              </Text>
              <Text style={[typography.h4, styles.price]}>${item?.cost}</Text>
            </View>
            {user && (
              <View style={styles.footer}>
                <QuantitySelector
                  quantity={quantity}
                  onIncrease={() => handleQuantityChange(quantity + 1)}
                  onDecrease={() => handleQuantityChange(Math.max(0, quantity - 1))}
                />
                <TouchableOpacity 
                  style={[
                    styles.addToCartButton,
                    styles.addButton,
                  ]}
                  onPress={handleAddToCart}
                >
                  <Text style={styles.addButtonText}>
                    {getItemQuantity(item.id) > 0 
                      ? `Update Cart - $${(parseFloat(item?.discounted_cost) * quantity).toFixed(2)}`
                      : `Add to Cart - $${(parseFloat(item?.discounted_cost) * quantity).toFixed(2)}`
                    }
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: colors.white,
    fontSize: 24,
    lineHeight: 24,
  },
  image: {
    width: '100%',
    height: 250,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  details: {
    padding: 24,
  },
  name: {
    marginBottom: 8,
    color: colors.text.primary,
  },
  description: {
    color: colors.text.secondary,
    marginBottom: 16,
  },
  price: {
    color: colors.primary,
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 16,
    gap: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: colors.border,
  },
  quantityButtonText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityText: {
    ...typography.h4,
    minWidth: 40,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartButton: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.white,
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 16,
  },
});

export default MenuDetails;

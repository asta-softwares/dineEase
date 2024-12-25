import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, SafeAreaView, Alert, Platform } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { useCart } from '../context/CartContext';
import TopNav from '../Components/TopNav';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { restaurantService } from '../api/services/restaurantService';
import Footer from './Layout/Footer';
import LargeButton from '../Components/Buttons/LargeButton';
import { useStripe } from '@stripe/stripe-react-native';

const CartItem = ({ item, quantity }) => {
  const { updateQuantity } = useCart();

  return (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={[typography.labelLarge, { color: colors.text.primary }]}>
          {quantity} x {item.name}
        </Text>
        <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>
          ${item.cost} each
        </Text>
      </View>
      <Text style={[typography.labelLarge, { color: colors.text.primary }]}>
        ${(item.cost * quantity).toFixed(2)}
      </Text>
    </View>
  );
};

const CheckoutScreen = ({ navigation }) => {
  const { cart, getTotalCost, clearCart } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollY = useSharedValue(0);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useEffect(() => {
    const loadRestaurant = async () => {
      if (cart.restaurantId) {
        try {
          const data = await restaurantService.getRestaurantById(cart.restaurantId);
          setRestaurant(data);
        } catch (error) {
          console.error('Error loading restaurant:', error);
        }
      }
    };
    loadRestaurant();
  }, [cart.restaurantId]);

  const handlePayment = async () => {
    try {
      setLoading(true);

      if (subtotal <= 0) {
        Alert.alert('Error', 'Your cart is empty');
        return;
      }

      // Prepare order data
      const orderData = {
        amount: Math.round(total * 100), // Convert to cents
        restaurant_id: cart.restaurantId,
        owner_id: 1, // Replace with actual user ID
        order_total: total,
        menu_items: Object.entries(cart.items).map(([id, { item, quantity }]) => ({
          menu_item_id: item.id,
          quantity: quantity,
        })),
      };

      // Step 1: Get the payment intent from the backend
      const { clientSecret } = await restaurantService.createPaymentIntent(orderData.amount);

      // Step 2: Initialize the Payment Sheet
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'DineEase',
      });

      if (initError) {
        throw new Error(initError.message);
      }

      // Step 3: Present the Payment Sheet
      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        throw new Error(paymentError.message);
      }

      // Step 4: Create the order
      const result = await restaurantService.createOrder({
        ...orderData,
        payment: {
          payment_method: 'credit_card',
          payment_status: 'succeeded',
          amount_paid: total,
          payment_gateway: 'stripe',
        },
      });

      // Success handling
      Alert.alert(
        'Success',
        'Payment successful! Your order has been placed.',
        [
          {
            text: 'OK',
            onPress: () => {
              clearCart();
              navigation.navigate('Home');
            },
          },
        ]
      );

    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', error.message || 'Something went wrong with the payment.');
    } finally {
      setLoading(false);
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  if (!cart.restaurantId || Object.keys(cart.items).length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <TopNav 
          handleGoBack={() => navigation.goBack()} 
          title="Checkout" 
          variant="solid" 
          scrollY={scrollY}
        />
        <View style={styles.emptyCart}>
          <Text style={[typography.h3, { color: colors.text.secondary }]}>
            Your cart is empty
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const subtotal = getTotalCost() || 0;
  const tax = subtotal * 0.13;
  const total = subtotal + tax;

  return (
    <SafeAreaView style={styles.container}>
      <TopNav 
        handleGoBack={() => navigation.goBack()} 
        title="Checkout" 
        variant="solid" 
        scrollY={scrollY}
      />
      
      <Animated.ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.contentPadding}>
          <View style={styles.section}>
            <Text style={[typography.h3, { color: colors.text.primary, marginBottom: 16 }]}>
              Restaurant Information
            </Text>
            
            {restaurant && (
              <View style={styles.restaurantCard}>
                <Image
                  source={{ uri: restaurant.image }}
                  style={styles.restaurantImage}
                />
                <View style={styles.restaurantInfo}>
                  <View style={styles.restaurantTextContainer}>
                    <Text style={[typography.h3, { color: colors.text.primary }]}>
                      {restaurant.name}
                    </Text>
                    <Text style={[typography.bodyMedium, { color: colors.text.secondary, marginTop: 4 }]}>
                      {restaurant.location}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={[typography.h3, { color: colors.text.primary, marginBottom: 16 }]}>
              Order Details
            </Text>
            
            <View style={styles.detailsList}>
              {Object.entries(cart.items).map(([id, { item, quantity }]) => (
                <CartItem key={id} item={item} quantity={quantity} />
              ))}
              
              <View style={styles.detailItem}>
                <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>Subtotal</Text>
                <Text style={[typography.bodyLarge, { color: colors.text.primary }]}>${subtotal.toFixed(2)}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>Tax (13%)</Text>
                <Text style={[typography.bodyLarge, { color: colors.text.primary }]}>${tax.toFixed(2)}</Text>
              </View>
              
              <View style={[styles.detailItem, styles.totalItem]}>
                <Text style={[typography.h3, { color: colors.text.primary }]}>Total Price</Text>
                <Text style={[typography.h3, { color: colors.text.primary }]}>${total.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
      
      <Footer>
        <LargeButton 
          title="Pay Now"
          price={`$${total.toFixed(2)}`}
          onPress={handlePayment}
          loading={loading}
        />
      </Footer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 0,
    paddingBottom: 100,
  },
  contentPadding: {
    paddingTop: Platform.OS === 'ios' ? 100 : 120,
  },
  section: {
    marginBottom: 32,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    overflow: 'hidden',
    padding: 16,
  },
  restaurantImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantTextContainer: {
    gap: 4,
  },
  detailsList: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalItem: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

export default CheckoutScreen;

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
  const [calculating, setCalculating] = useState(false);
  const [orderTotals, setOrderTotals] = useState(null);
  const scrollY = useSharedValue(0);
  const { initPaymentSheet, presentPaymentSheet, retrievePaymentIntent } = useStripe();

  const subtotal = getTotalCost() || 0;

  useEffect(() => {
    const calculateOrderTotal = async () => {
      if (cart.restaurantId && subtotal > 0) {
        try {
          setCalculating(true);
          const calculateTotal = await restaurantService.getOrderTotal({
            order_total: subtotal.toFixed(2),
            restaurant_id: cart.restaurantId,
            promo_ids: cart.promos,
          });
          setOrderTotals(calculateTotal);
        } catch (error) {
          console.error('Error calculating order total:', error);
          Alert.alert('Error', 'Unable to calculate order total');
        } finally {
          setCalculating(false);
        }
      }
    };
    calculateOrderTotal();
  }, [cart.restaurantId, subtotal, cart.promos]);

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

      if (!orderTotals) {
        Alert.alert('Error', 'Unable to calculate order total');
        return;
      }

      // Prepare order data
      const orderData = {
        amount: orderTotals.total.toFixed(2),
        restaurant_id: cart.restaurantId,
        owner_id: 1, // Replace with actual user ID
        order_total: orderTotals.total.toFixed(2),
        menu_items: Object.entries(cart.items).map(([id, { item, quantity }]) => ({
          menu_item_id: item.id,
          quantity: quantity,
        })),
      };

      // Step 1: Get the payment intent from the backend
      const { clientSecret } = await restaurantService.createPaymentIntent(orderData.amount);
      console.log('Payment Intent Response:', { clientSecret });

      // Step 2: Initialize the Payment Sheet
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'DineEase',
      });
      console.log('Payment Sheet Init Response:', { error: initError });

      if (initError) {
        console.error('Payment Sheet Init Error:', initError);
        throw new Error(initError.message);
      }

      // Step 3: Present the Payment Sheet
      const { error: paymentError, paymentOption } = await presentPaymentSheet();
      console.log('Payment Sheet Presentation Response:', {
        error: paymentError,
        paymentOption,
      });

      if (paymentError) {
        console.error('Payment Error:', paymentError);
        throw new Error(paymentError.message);
      }

      // Retrieve the PaymentIntent details after successful payment
      const { paymentIntent, error: retrieveError } = await retrievePaymentIntent(clientSecret);
      
      if (retrieveError) {
        console.error('Error retrieving payment details:', retrieveError);
      } else {
        console.log('Payment Success Details:', {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          paymentMethod: paymentIntent.payment_method,
          created: new Date(paymentIntent.created * 1000).toISOString(),
          clientSecret: paymentIntent.client_secret,
        });
      }

      let orderResponse = '';
      
      if (paymentIntent.status == "Succeeded") {
        // Step 4: Create the order
        const result = await restaurantService.createOrder({
          ...orderData,
          payment: {
            payment_method: "credit_card",
            payment_status: paymentIntent.status,
            amount_paid: paymentIntent.amount,
          payment_gateway: 'stripe',
          transaction_id: paymentIntent.id,
        },
      });
      orderResponse = result;
      console.log('Order Creation Response:', result);
      } else {
        throw new Error("Payment failed");
      }
  

      // Success handling
      Alert.alert(
        'Success',
        'Payment successful! Your order has been placed.',
        [
          {
            text: 'OK',
            onPress: () => {
              clearCart();
              navigation.navigate('OrderDetailScreen', { order: orderResponse, restaurant: restaurant });
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
              
              {calculating ? (
                <View style={styles.detailItem}>
                  <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>Calculating total...</Text>
                </View>
              ) : orderTotals && (
                <>
                  <View style={styles.detailItem}>
                    <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>Subtotal</Text>
                    <Text style={[typography.bodyLarge, { color: colors.text.primary }]}>${orderTotals.order_total.toFixed(2)}</Text>
                  </View>

                  {orderTotals.tax_amount > 0 && (
                    <View style={styles.detailItem}>
                      <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>Tax ({(orderTotals.tax_rate * 100).toFixed(1)}%)</Text>
                      <Text style={[typography.bodyLarge, { color: colors.text.primary }]}>${orderTotals.tax_amount.toFixed(2)}</Text>
                    </View>
                  )}

                  {orderTotals.discount > 0 && (
                    <View style={styles.detailItem}>
                      <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>Discount</Text>
                      <Text style={[typography.bodyLarge, { color: colors.success }]}>-${orderTotals.discount.toFixed(2)}</Text>
                    </View>
                  )}

                  {orderTotals.service_fee > 0 && (
                    <View style={styles.detailItem}>
                      <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>Service Fee</Text>
                      <Text style={[typography.bodyLarge, { color: colors.text.primary }]}>${orderTotals.service_fee.toFixed(2)}</Text>
                    </View>
                  )}

                  {orderTotals.service_fee_tax > 0 && (
                    <View style={styles.detailItem}>
                      <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>Service Fee Tax</Text>
                      <Text style={[typography.bodyLarge, { color: colors.text.primary }]}>${orderTotals.service_fee_tax.toFixed(2)}</Text>
                    </View>
                  )}
                  
                  <View style={[styles.detailItem, styles.totalItem]}>
                    <Text style={[typography.h3, { color: colors.text.primary }]}>Total Price</Text>
                    <Text style={[typography.h3, { color: colors.text.primary }]}>${orderTotals.total.toFixed(2)}</Text>
                  </View>
                </>
              )}
            </View>
          </View>

        </View>
      </Animated.ScrollView>
      
      <Footer>
        <LargeButton 
          title="Pay Now"
          price={orderTotals ? `$${orderTotals.total.toFixed(2)}` : `$${subtotal.toFixed(2)}`}
          onPress={handlePayment}
          loading={loading || calculating}
          disabled={calculating}
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
    paddingTop: Platform.OS === 'ios' ? 70 : 90,
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
  summaryContainer: {
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginVertical: 16,
  },
  summaryTitle: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

export default CheckoutScreen;

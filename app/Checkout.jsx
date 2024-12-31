import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, SafeAreaView, Alert, Platform, ActivityIndicator, TextInput } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { useCart } from '../context/CartContext';
import { useUserStore } from '../stores/userStore';
import TopNav from '../Components/TopNav';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { restaurantService } from '../api/services/restaurantService';
import Footer from './Layout/Footer';
import LargeButton from '../Components/Buttons/LargeButton';
import { useStripe } from '@stripe/stripe-react-native';
import { Ionicons } from '@expo/vector-icons';

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
  const user = useUserStore((state) => state.user);
  const [restaurant, setRestaurant] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [orderTotals, setOrderTotals] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [availablePromos, setAvailablePromos] = useState([]);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [showPromoDropdown, setShowPromoDropdown] = useState(false);
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
            promo_ids: selectedPromo ? [selectedPromo.id] : [],
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
  }, [cart.restaurantId, subtotal, selectedPromo]);

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

  useEffect(() => {
    const fetchAvailablePromos = async () => {
      try {
        const promos = await restaurantService.getOrderPromos(
          cart.owner_id,
          cart.total
        );
        setAvailablePromos(promos);
      } catch (error) {
        console.error('Error fetching promos:', error);
      }
    };
    fetchAvailablePromos();
  }, []);

  const handlePromoSelect = (promo) => {
    setSelectedPromo(promo);
    setShowPromoDropdown(false);
  };

  const handlePayment = async () => {
    if (isProcessing || loading || calculating) return;

    try {
      setIsProcessing(true);
      setLoading(true);

      if (subtotal <= 0) {
        Alert.alert('Error', 'Your cart is empty');
        return;
      }

      if (!orderTotals) {
        Alert.alert('Error', 'Unable to calculate order total');
        return;
      }

      if (!user?.email) {
        Alert.alert('Error', 'Please log in to continue with payment');
        return;
      }

      // Prepare order data
      const orderData = {
        amount: orderTotals.total.toFixed(2),
        restaurant_id: cart.restaurantId,
        menu_items: Object.values(cart.items).map(({ item, quantity }) => ({
          menu_item_id: item.id,
          quantity: quantity,
        })),
        promo_ids: selectedPromo ? [selectedPromo.id] : [],
        owner_id: cart.owner_id
      };

      const { clientSecret } = await restaurantService.createPaymentIntent({
        amount: orderTotals.total.toFixed(2),
        restaurant_id: restaurant.id 
      }).catch(error => {
        Alert.alert('Payment Error', error.message);
        throw error;
      });

      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'DineEase',
      }).catch(error => {
        Alert.alert('Payment Error', error.message);
        throw error;
      });

      if (initError) {
        Alert.alert('Payment Error', initError.message);
        throw new Error(initError.message);
      }

      const { error: paymentError } = await presentPaymentSheet().catch(error => {
        Alert.alert('Payment Error', error.message);
        throw error;
      });

      if (paymentError) {
        Alert.alert('Payment Error', paymentError.message);
        throw new Error(paymentError.message);
      }

      // Retrieve the PaymentIntent details after successful payment
      const { paymentIntent, error: retrieveError } = await retrievePaymentIntent(clientSecret);
      
      if (retrieveError) {
        console.error('Error retrieving payment details:', retrieveError);
        Alert.alert('Error', 'Could not retrieve payment details. Please contact support.');
        throw new Error(retrieveError.message);
      }

      console.log('Payment Success Details:', {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        created: new Date(paymentIntent.created * 1000).toISOString(),
      });
      
      if (paymentIntent.status === "Succeeded") {
        // Create the order after successful payment
        const result = await restaurantService.createOrder({
          ...orderData,
          transaction_id: paymentIntent.id,
        }).catch(error => {
          Alert.alert('Order Error', error.message);
          throw error;
        });
        
        const orderDetailsData = result.order;
        setOrderDetails(orderDetailsData);
        console.log('Order Creation Response:', result);

        Alert.alert(
          'Success',
          'Payment successful! Your order has been placed.',
          [
            {
              text: 'OK',
              onPress: () => {
                clearCart();
                navigation.navigate('OrderDetailScreen', { order: orderDetailsData, restaurant: restaurant });
              },
            },
          ]
        );
      } else {
        Alert.alert('Payment failed');
        throw new Error("Payment failed");
      }

    } catch (error) {
      console.error('Payment process error:', error);
    } finally {
      setIsProcessing(false);
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

          <View style={styles.promoSection}>
              <Text style={[typography.h3, { color: colors.text.primary, marginBottom: 16 }]}>
                 Promos
              </Text>
              <TouchableOpacity
                style={styles.promoSelector}
                onPress={() => setShowPromoDropdown(!showPromoDropdown)}
              >
                <Text style={typography.bodyMedium}>
                  {selectedPromo ? selectedPromo.name : 'Select a promo'}
                </Text>
                <Ionicons
                  name={showPromoDropdown ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={colors.text.secondary}
                />
              </TouchableOpacity>

              {showPromoDropdown && (
                <View style={styles.promoDropdown}>
                  {availablePromos.length > 0 ? (
                    availablePromos.map((promo) => (
                      <TouchableOpacity
                        key={promo.id}
                        style={styles.promoOption}
                        onPress={() => handlePromoSelect(promo)}
                      >
                        <View>
                          <Text style={typography.bodyLarge}>{promo.name}</Text>
                          <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>
                            {promo.discount_type === 'percentage'
                              ? `${promo.discount}% off`
                              : `$${promo.discount} off`}
                          </Text>
                        </View>
                        {selectedPromo?.id === promo.id && (
                          <Ionicons name="checkmark" size={24} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text style={[typography.bodyMedium, styles.noPromos]}>
                      No promos available for this order
                    </Text>
                  )}
                </View>
              )}
            </View>


          <View style={styles.section}>
            <Text style={[typography.h3, { color: colors.text.primary, marginBottom: 16 }]}>
              Order Details
            </Text>
            
            <Text style={[typography.bodyMedium, { color: colors.text.secondary, marginBottom: 16 }]}>
              Payment will be linked to: {user?.email}
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
                      <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>Tax ({(orderTotals.tax_rate).toFixed(1)}%)</Text>
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
          loading={loading || calculating || isProcessing}
          disabled={loading || calculating || isProcessing}
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
    paddingTop: Platform.OS === 'ios' ? 70 : 120,
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
  promoSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  promoSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.light,
    borderRadius: 12,
    marginTop: 8,
  },
  promoDropdown: {
    marginTop: 8,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  promoOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  noPromos: {
    padding: 16,
    textAlign: 'center',
    color: colors.text.secondary,
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: colors.light,
    borderRadius: 12,
    marginBottom: 24,
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

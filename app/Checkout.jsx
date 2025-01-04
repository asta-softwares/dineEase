import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  Platform, 
  Alert, 
  ActivityIndicator, 
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { useCart } from '../context/CartContext';
import { useUserStore } from '../stores/userStore';
import TopNav from '../Components/TopNav';
import Badge from '../Components/Badge';
import { restaurantService } from '../api/services/restaurantService';
import Footer from './Layout/Footer';
import LargeButton from '../Components/Buttons/LargeButton';
import { useStripe } from '@stripe/stripe-react-native';
import { Ionicons } from '@expo/vector-icons';

const CartItem = ({ item, quantity }) => (
  <View style={styles.orderItem}>
    <View style={styles.itemInfo}>
      <Text style={[typography.bodyLarge, { color: colors.text.primary }]}>
        {quantity}x {item.name}
      </Text>
      <Text style={[typography.bodySmall, { color: colors.text.secondary }]}>
        ${item.cost} each
      </Text>
    </View>
    <Text style={[typography.bodyLarge, { color: colors.text.primary }]}>
      ${(item.cost * quantity).toFixed(2)}
    </Text>
  </View>
);

const TotalRow = ({ label, value, isTotal, type }) => {
  if (type === 'discount') {
    return (
      <View style={styles.totalRow}>
        <Text style={[typography.bodyLarge, { color: colors.text.secondary }]}>
          {label}
        </Text>
        <Text style={[typography.bodyLarge, { color: colors.success }]}>
          -${parseFloat(value || 0).toFixed(2)}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.totalRow}>
      <Text style={[typography.bodyLarge, { color: colors.text.secondary }]}>
        {label}
      </Text>
      {type === 'percentage' ? (
        <Text style={[typography.bodyLarge, { color: colors.text.black }]}>
          {value}%
        </Text>
      ) : (
        <Text style={[typography.bodyLarge, isTotal && { color: colors.text.primary }]}>
          ${parseFloat(value || 0).toFixed(2)}
        </Text>
      )}
    </View>
  );
};

const CheckoutScreen = ({ route, navigation }) => {
  const { cart, getTotalCost, clearCart } = useCart();
  const user = useUserStore((state) => state.user);
  const { restaurantId, isDineIn } = route.params;
  const [restaurant, setRestaurant] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [orderTotals, setOrderTotals] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [availablePromos, setAvailablePromos] = useState([]);
  const [selectedPromos, setSelectedPromos] = useState([]);
  const [showPromoDropdown, setShowPromoDropdown] = useState(false);
  const { initPaymentSheet, presentPaymentSheet, retrievePaymentIntent } = useStripe();

  const subtotal = getTotalCost() || 0;

  useEffect(() => {
    const calculateOrderTotal = async () => {
      if (cart.restaurantId && subtotal > 0) {
        try {
          setCalculating(true);
          const promoIds = selectedPromos.map(promo => promo.id);
          const calculateTotal = await restaurantService.getOrderTotal({
            order_total: subtotal.toFixed(2),
            restaurant_id: cart.restaurantId,
            promo_ids: promoIds,
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
  }, [cart.restaurantId, subtotal, selectedPromos]);

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
    if (selectedPromos.some(p => p.id === promo.id)) {
      setSelectedPromos(selectedPromos.filter(p => p.id !== promo.id));
    } else {
      setSelectedPromos([...selectedPromos, promo]);
    }
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
        restaurant_id: restaurantId,
        menu_items: Object.values(cart.items).map(({ item, quantity }) => ({
          menu_item_id: item.id,
          quantity: quantity,
        })),
        promo_ids: selectedPromos.map(promo => promo.id),
        owner_id: cart.owner_id,
        order_type: isDineIn ? 'dine_in' : 'takeaway',
      };

      const { clientSecret, customerId, ephemeralKey } = await restaurantService.createPaymentIntent({
        amount: orderTotals.total.toFixed(2),
        restaurant_id: restaurantId,
      }).catch(error => {
        Alert.alert('Payment Error', error.message);
        throw error;
      });

      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'DineEase',
        customerId: customerId,
        customerEphemeralKeySecret: ephemeralKey,
        defaultBillingDetails: {
          email: user?.email,
        },
        allowsDelayedPaymentMethods: false,
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
                navigation.navigate('OrderDetailScreen', { order: orderDetailsData, restaurant: restaurant, fromCheckout: true });
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

  if (!cart.restaurantId || Object.keys(cart.items).length === 0) {
    return (
      <View style={styles.container}>
        <TopNav 
          handleGoBack={() => navigation.goBack()} 
          title="Checkout" 
          variant="solid"
          showBack={true}
        />
        <View style={styles.emptyCart}>
          <Text style={[typography.h3, { color: colors.text.secondary }]}>
            Your cart is empty
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopNav 
        handleGoBack={() => navigation.goBack()} 
        title="Checkout" 
        variant="solid"
        showBack={true}
      />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={[styles.contentContainer, styles.contentPadding]}
        showsVerticalScrollIndicator={false}
      >

        {/* Restaurant Information */}
        <View style={styles.section}>
          <View style={styles.restaurantHeader}>
            <Ionicons name="location" size={24} color={colors.text.primary} />
            <View style={styles.restaurantInfo}>
              <Text style={[typography.titleMedium, { color: colors.text.primary }]}>
                {restaurant?.name}
              </Text>
              <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>
                {restaurant?.location}
              </Text>
            </View>
            <Badge 
              text={isDineIn ? 'Dine In' : 'Takeaway'} 
              type={isDineIn ? 'pending' : 'confirmed'}
              icon={isDineIn ? 'restaurant-outline' : 'bag-handle-outline'}
            />
          </View>
        </View>

        {/* Coupon Section */}
        <View style={styles.section}>
          <Text style={[typography.titleMedium, styles.sectionTitle]}>Promo Codes</Text>
          
          {/* Selected Promos */}
          {selectedPromos.length > 0 && (
            <View style={styles.promosContainer}>
              {selectedPromos.map((promo) => (
                <View key={promo.id} style={styles.promoTag}>
                  <Text style={[typography.bodySmall, styles.promoText]}>
                    {promo.name} ({promo.discount_type === 'percentage' ? `${promo.discount}%` : `$${promo.discount}`} off)
                  </Text>
                  <TouchableOpacity 
                    onPress={() => handlePromoSelect(promo)}
                    style={styles.removePromo}
                  >
                    <Ionicons name="close-circle" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Promo Selector */}
          <TouchableOpacity
            style={styles.promoSelector}
            onPress={() => setShowPromoDropdown(!showPromoDropdown)}
          >
            <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>
              Select a promo code
            </Text>
            <Ionicons
              name={showPromoDropdown ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={colors.text.secondary}
            />
          </TouchableOpacity>

          {/* Promo Dropdown */}
          {showPromoDropdown && (
            <View style={styles.promoDropdown}>
              {availablePromos.length > 0 ? (
                availablePromos
                  .filter(promo => !selectedPromos.some(p => p.id === promo.id))
                  .map((promo) => (
                    <TouchableOpacity
                      key={promo.id}
                      style={styles.promoOption}
                      onPress={() => {
                        handlePromoSelect(promo);
                        setShowPromoDropdown(false);
                      }}
                    >
                      <Text style={[typography.bodyMedium, { color: colors.text.primary }]}>
                        {promo.name} ({promo.discount_type === 'percentage' ? `${promo.discount}%` : `$${promo.discount}`} off)
                      </Text>
                    </TouchableOpacity>
                  ))
              ) : (
                <Text style={[typography.bodyMedium, styles.noPromos]}>
                  No promos available
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={[typography.titleMedium, styles.sectionTitle]}>Order Summary</Text>
          {Object.entries(cart.items).map(([id, { item, quantity }]) => (
            <CartItem key={id} item={item} quantity={quantity} />
          ))}
          
          <View style={styles.divider} />
          
          {calculating ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 16 }} />
          ) : orderTotals && (
            <>
              <TotalRow label="Subtotal" value={orderTotals.order_total} />
              {orderTotals.discount > 0 && (
                <TotalRow label="Discount" value={orderTotals.discount} type="discount" />
              )}
               {orderTotals.tax_rate > 0 && (
              <TotalRow label="Tax Rate" value={orderTotals.tax_rate} type="percentage" />
              )}
             {orderTotals.tax_amount > 0 && (
              <TotalRow label="Tax Amount" value={orderTotals.tax_amount} />
              )}
              {orderTotals.service_fee > 0 && (
              <TotalRow label="Service Fee" value={orderTotals.service_fee} />
              )}
              {orderTotals.service_fee_tax > 0 && (
              <TotalRow label="Service Fee Tax" value={orderTotals.service_fee_tax} />
              )}
              <View style={styles.divider} />
              <TotalRow label="Total" value={orderTotals.total} isTotal />
            </>
          )}
        </View>

        {/* Payment Information */}
        <View style={styles.section}>
          <Text style={[typography.titleMedium, styles.sectionTitle]}>Payment Information</Text>
          <View style={styles.paymentInfo}>
            <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>
              Payment will be processed for:
            </Text>
            <Text style={[typography.bodyLarge, { color: colors.text.primary, marginTop: 4 }]}>
              {user?.email}
            </Text>
          </View>
        </View>
      </ScrollView>

      <Footer>
        <LargeButton 
          title="Pay Now"
          price={orderTotals ? `$${orderTotals.total.toFixed(2)}` : `$${subtotal.toFixed(2)}`}
          onPress={handlePayment}
          loading={loading || calculating || isProcessing}
          disabled={loading || calculating || isProcessing}
        />
      </Footer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  contentPadding: {
    paddingTop: Platform.OS === 'ios' ? 140 : 140,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    color: colors.text.primary,
  },
  locationIcon: {
    marginTop: 4
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  restaurantInfo: {
    flex: 1,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
    marginRight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  promoSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginTop: 12,
  },
  promoDropdown: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  promoOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  promosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  promoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  promoText: {
    color: colors.primary,
    marginRight: 4,
  },
  removePromo: {
    marginLeft: 4,
  },
  noPromos: {
    padding: 16,
    textAlign: 'center',
    color: colors.text.secondary,
  },
  paymentInfo: {
    backgroundColor: colors.background + '40',
    padding: 16,
    borderRadius: 8,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CheckoutScreen;

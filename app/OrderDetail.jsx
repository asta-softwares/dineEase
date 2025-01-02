import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopNav from '../Components/TopNav';
import Footer from './Layout/Footer';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import LargeButton from '../Components/Buttons/LargeButton';
import { restaurantService } from '../api/services/restaurantService';
import { Ionicons } from '@expo/vector-icons';
import Badge from '../Components/Badge';
import { PaymentIcon } from 'react-native-payment-icons';

const getCardIcon = (brand) => {
  switch (brand?.toLowerCase()) {
    case 'visa':
      return 'visa';
    case 'mastercard':
      return 'master';
    case 'amex':
    case 'american-express':
      return 'american-express';
    case 'discover':
      return 'discover';
    case 'diners':
    case 'diners-club':
      return 'diners-club';
    case 'jcb':
      return 'jcb';
    case 'unionpay':
      return 'unionpay';
    default:
      return 'generic';
  }
};

const OrderDetailScreen = ({ route, navigation }) => {
  const { order, restaurant, fromCheckout } = route.params;
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await restaurantService.getOrdersById(order.id);
        setOrderDetails(response);
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [order.id]);

  const OrderItem = ({ menu_item, quantity, subtotal }) => (
    <View style={styles.orderItem}>
      <View style={styles.itemInfo}>
        <Text style={[typography.bodyLarge, { color: colors.text.primary }]}>
          {quantity}x {menu_item.name}
        </Text>
        <Text style={[typography.bodySmall, { color: colors.text.secondary }]}>
          ${parseFloat(menu_item.cost).toFixed(2)} each
        </Text>
      </View>
      <Text style={[typography.bodyLarge, { color: colors.text.primary }]}>
        ${parseFloat(subtotal).toFixed(2)}
      </Text>
    </View>
  );

  const TotalRow = ({ label, value, isTotal, type }) => {
    if (type === 'status') {
      return (
        <View style={styles.totalRow}>
          <Text style={[typography.bodyLarge, { color: colors.text.secondary }]}>
            {label} 
          </Text>
          <Badge 
            text={value?.charAt(0).toUpperCase() + value?.slice(1)}
            type={value?.toLowerCase()}
          />
        </View>
      );
    }

    if (type === 'payment_method') {
      return (
        <View style={styles.totalRow}>
          <Text style={[typography.bodyLarge, { color: colors.text.secondary }]}>
            {label}
          </Text>
          <View style={styles.paymentMethod}>
            <PaymentIcon 
              type={getCardIcon(orderDetails?.payment.card_brand)}
              width={40}
              height={25}
            />
            <Text style={[typography.bodyLarge, { color: colors.text.black, marginLeft: 8 }]}>
              •••• {value}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.totalRow}>
        <Text style={[typography.bodyLarge, { color: colors.text.secondary }]}>
          {label}
        </Text>
        {label === 'Discount' ? (
          <Text style={[typography.bodyLarge, { color: colors.success }]}>
            -${parseFloat(value || 0).toFixed(2)}
          </Text>
        ) : type === 'transaction' ? (
          <Text style={[typography.bodySmall, { color: colors.text.black }]}>
            {value}
          </Text>
        ) : type === 'date' ? (
          <Text style={[typography.bodyLarge, { color: colors.text.black }]}>
            {new Date(value).toLocaleString()}
          </Text>
        ) : (
          <Text style={[typography.bodyLarge, isTotal && { color: colors.text.primary }]}>
            ${parseFloat(value || 0).toFixed(2)}
          </Text>
        )}
      </View>
    );
  };

  const isFromOrders = !fromCheckout;

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopNav 
        handleGoBack={() => navigation.goBack()}
        title={`Order #${orderDetails?.id || ''}`}
        variant="solid"
        showBack={!fromCheckout}
      />
      
      <ScrollView 
        style={styles.scrollContent}
        contentContainerStyle={styles.contentPadding}
        showsVerticalScrollIndicator={false}
      >
        {/* Restaurant Info */}
        <View style={styles.section}>
          <View style={styles.restaurantHeader}>
            <Text style={[typography.h2, styles.sectionTitle, { color: colors.text.primary }]}>{restaurant?.name}</Text>
            <Badge 
              text={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              type={order.status.toLowerCase()}
            />
          </View>
          {orderDetails?.verification_code && order.status.toLowerCase() !== 'completed' && (
          <View style={styles.verificationContainer}>
            <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>Verification Code</Text>
            <Text style={styles.verificationCode}>{orderDetails?.verification_code}</Text>
          </View>
          )}
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={[typography.h2, styles.sectionTitle]}>Order Items</Text>
          <View style={styles.orderItems}>
            {orderDetails?.items?.map((item, index) => (
              <OrderItem key={index} {...item} />
            ))}
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={[typography.h2, styles.sectionTitle]}>Order Summary</Text>
          <View style={styles.orderSummary}>
            {orderDetails?.promos?.length > 0 && (
              <View>
                <Text style={[typography.h3, styles.sectionTitle]}>Applied Promos</Text>
                {orderDetails.promos.map((promo, index) => (
                  <View key={promo.id} style={styles.promoItem}>
                    <View style={styles.promoInfo}>
                      <Text style={typography.bodyLarge}>{promo.name}</Text>
                      <Text style={[typography.bodyMedium, { color: colors.success }]}>
                        {promo.discount_type === 'percentage' 
                          ? `${promo.discount}% off`
                          : `$${parseFloat(promo.discount).toFixed(2)} off`}
                      </Text>
                    </View>
                  </View>
                ))}
                <View style={styles.divider} />
              </View>
            )}
            <View style={styles.totals}>
              <TotalRow label="Subtotal" value={parseFloat(orderDetails?.order_total)} />
              {parseFloat(orderDetails?.discount) > 0 && (
                <TotalRow label="Discount" value={parseFloat(orderDetails?.discount)} />
              )}
              <TotalRow label="Tax" value={parseFloat(orderDetails?.tax_amount)} />
              <TotalRow label="Service Fee" value={parseFloat(orderDetails?.service_fee)} />
              <View style={styles.divider} />
              <TotalRow label="Total" value={parseFloat(orderDetails?.total)} isTotal />
            </View>
          </View>
        </View>

        {/* Payment Details */}
        <View style={styles.section}>
          <Text style={[typography.h2, styles.sectionTitle]}>Payment Details</Text>
          <View style={styles.paymentInfo}>
            <TotalRow label="Payment Status" value={orderDetails?.payment?.payment_status} type="status" />
            <TotalRow label="Payment Method" value= {orderDetails?.payment.card_last4} type="payment_method" />
            <TotalRow label="Transaction ID" value={orderDetails?.payment?.transaction_id} type="transaction" />
            <TotalRow label="Payment Date" value={orderDetails?.payment?.payment_date} type="date" />
          </View>
        </View>
      </ScrollView>

      {!isFromOrders && (
        <Footer>
          <LargeButton
            title="Back to Home"
            onPress={() => navigation.navigate('Home')}
          />
        </Footer>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentPadding: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 130 : 100,
    paddingBottom: 100,
  },
  scrollContent: {
    flex: 1,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantInfo: {
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
  },
  orderItems: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemInfo: {
    flex: 1,
    marginRight: 16,
  },
  orderSummary: {
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
  },
  totals: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    marginTop: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  paymentInfo: {
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: 8,
  },
  promoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  promoInfo: {
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: colors.text.white,
    textTransform: 'capitalize',
  },
  verificationContainer: {
    marginVertical: 16,
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.light,
    borderRadius: 12,
  },
  verificationCode: {
    fontSize: 32,
    fontFamily: 'PlusJakartaSans-Bold',
    color: colors.primary,
    letterSpacing: 2,
    marginTop: 8,
  },
});

export default OrderDetailScreen;

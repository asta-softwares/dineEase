import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopNav from '../Components/TopNav';
import Footer from './Layout/Footer';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import LargeButton from '../Components/Buttons/LargeButton';
import { restaurantService } from '../api/services/restaurantService';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return colors.success;
    case 'confirmed':
      return colors.primary;
    case 'preparing':
      return colors.warning;
    case 'delivered':
      return colors.success;
    case 'pending':
      return colors.warning;
    case 'cancelled':
      return colors.error;
    case 'failed':
      return colors.error;
    default:
      return colors.text.secondary;
  }
};

const getCardIcon = (brand) => {
  switch (brand?.toLowerCase()) {
    case 'visa':
      return 'cc-visa';
    case 'mastercard':
      return 'cc-mastercard';
    case 'amex':
      return 'cc-amex';
    case 'discover':
      return 'cc-discover';
    default:
      return 'credit-card';
  }
};

const OrderDetailScreen = ({ route, navigation }) => {
  const { order, restaurant } = route.params;
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

  const OrderItem = ({ menu_item, quantity, price }) => (
    <View style={styles.orderItem}>
      <View style={styles.itemInfo}>
        <Text style={[typography.labelLarge, { color: colors.text.primary }]}>
          {quantity}x {menu_item.name}
        </Text>
        <Text style={[typography.bodySmall, { color: colors.text.secondary }]}>
          {menu_item.description}
        </Text>
      </View>
      <Text style={[typography.labelLarge, { color: colors.text.primary }]}>
        ${parseFloat(price).toFixed(2)}
      </Text>
    </View>
  );

  const TotalRow = ({ label, value, isTotal, type }) => (
    <View style={styles.totalRow}>
      <Text style={[
        typography.bodyLarge,
        { color: isTotal ? colors.text.primary : colors.text.secondary }
      ]}>
        {label}
      </Text>
      {type === 'status' ? (
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(value) }]}>
          <Text style={[typography.labelMedium, styles.statusText]}>
            {value?.charAt(0).toUpperCase() + value?.slice(1)}
          </Text>
        </View>
      ) : type === 'payment_method' ? (
        <View style={styles.paymentMethod}>
          <FontAwesome5 
            name={getCardIcon(orderDetails?.payment.card_brand)} 
            size={16} 
            color={colors.text.primary} 
            style={styles.cardIcon}
          />
          <Text style={[typography.bodyLarge, { color: colors.text.primary }]}>
            •••• {value}
          </Text>
        </View>
      ) : type === 'transaction' ? (
        <Text style={[typography.bodySmall, { color: colors.text.primary }]}>
          {value}
        </Text>
      ) : (
        <Text style={[
          typography.bodyLarge,
          { color: isTotal ? colors.text.primary : colors.text.primary }
        ]}>
          {value}
        </Text>
      )}
    </View>
  );

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
      />
      
      <ScrollView 
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <Image
          source={{
            uri: restaurant?.image || 'https://via.placeholder.com/400',
          }}
          style={styles.headerImage}
        />

        <View style={styles.orderInfo}>
          <Text style={[typography.h2, styles.sectionTitle]}>Order from</Text>
          <View style={styles.restaurantInfo}>
            <View style={styles.restaurantHeader}>
              <Text style={typography.h3}>{restaurant?.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                <Text style={[typography.labelMedium, styles.statusText]}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Text>
              </View>
            </View>
            
            {orderDetails?.verification_code && order.status.toLowerCase() !== 'completed' && (
              <View style={styles.verificationContainer}>
                <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>Verification Code</Text>
                <Text style={styles.verificationCode}>{orderDetails.verification_code}</Text>
              </View>
            )}

            <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>
              Order Time: {new Date(orderDetails?.order_time).toLocaleString()}
            </Text>
          </View>

          <Text style={[typography.h2, styles.sectionTitle]}>Order Summary</Text>
          <View style={styles.orderItems}>
            {orderDetails?.items.map((item, index) => (
              <OrderItem key={index} {...item} />
            ))}
          </View>

          <View style={styles.totals}>
            <TotalRow label="Subtotal" value={parseFloat(orderDetails?.order_total)} />
            <TotalRow label="Discount" value={parseFloat(orderDetails?.discount)} />
            <TotalRow label="Tax" value={parseFloat(orderDetails?.tax_amount)} />
            <TotalRow label="Service Fee" value={parseFloat(orderDetails?.service_fee)} />
            <View style={styles.divider} />
            <TotalRow label="Total" value={parseFloat(orderDetails?.total)} isTotal />
          </View>

          <Text style={[typography.h2, styles.sectionTitle]}>Payment Details </Text>
          <View style={styles.paymentInfo}>
            <TotalRow label="Payment Status" value={orderDetails?.payment?.payment_status} type="status" />
            <TotalRow label="Payment Method" value= {orderDetails?.payment.card_last4} type="payment_method" />
            <TotalRow label="Transaction ID" value={orderDetails?.payment?.transaction_id} type="transaction" />
            <TotalRow label="Payment Date" value={new Date(orderDetails?.payment?.payment_date).toLocaleString()} />
          </View>
        </View>
      </ScrollView>

      <Footer>
        <LargeButton
          title="Back to Home"
          onPress={() => navigation.navigate('Home')}
        />
      </Footer>
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
  contentContainer: {
    paddingTop: Platform.OS === 'ios' ? 120 : 100,
    paddingBottom: 120,
  },
  headerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  orderInfo: {
    padding: 16,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 16,
  },
  restaurantInfo: {
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: colors.text.white,
    textTransform: 'capitalize',
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  orderItems: {
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  itemInfo: {
    flex: 1,
    marginRight: 16,
  },
  totals: {
    backgroundColor: colors.background.secondary,
    padding: 16,
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
    marginVertical: 8,
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

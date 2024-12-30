import React from 'react';
import { View, StyleSheet, Text, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopNav from '../Components/TopNav';
import Footer from './Layout/Footer';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import LargeButton from '../Components/Buttons/LargeButton';

const OrderDetailScreen = ({ route, navigation }) => {
  const { order } = route.params;

  const OrderItem = ({ item, quantity, instructions }) => (
    <View style={styles.orderItem}>
      <View style={styles.itemInfo}>
        <Text style={[typography.labelLarge, { color: colors.text.primary }]}>
          {quantity}x {item}
        </Text>
        {instructions && (
          <Text style={[typography.bodySmall, { color: colors.text.secondary }]}>
            Instructions: {instructions}
          </Text>
        )}
      </View>
      <Text style={[typography.labelLarge, { color: colors.text.primary }]}>
        ${item.price}
      </Text>
    </View>
  );

  const TotalRow = ({ label, value, isTotal }) => (
    <View style={styles.totalRow}>
      <Text style={[
        typography.bodyLarge,
        { color: isTotal ? colors.text.primary : colors.text.secondary }
      ]}>
        {label}
      </Text>
      <Text style={[
        typography.labelLarge,
        { color: isTotal ? colors.primary : colors.text.primary }
      ]}>
        ${value}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TopNav 
        handleGoBack={() => navigation.goBack()}
        title={`Order #${order.id}`}
        variant="solid"
      />
      
      <ScrollView style={styles.content}>
        <Image
          source={require('../assets/images/restaurant-header.jpg')}
          style={styles.headerImage}
        />

        <View style={styles.orderInfo}>
          <Text style={[typography.h2, styles.sectionTitle]}>Order from</Text>
          <View style={styles.restaurantInfo}>
            <Text style={typography.h3}>{order.restaurant.name}</Text>
            <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>
              {order.restaurant.address}
            </Text>
          </View>

          <Text style={[typography.h2, styles.sectionTitle]}>Order Summary</Text>
          <View style={styles.orderItems}>
            {order.items.map((item, index) => (
              <OrderItem key={index} {...item} />
            ))}
          </View>

          <View style={styles.totals}>
            <TotalRow label="Subtotal" value={order.subtotal} />
            <TotalRow label="Discount" value={order.discount} />
            <TotalRow label="Tax 13%" value={order.tax} />
            <View style={styles.divider} />
            <TotalRow label="Total" value={order.total} isTotal />
          </View>

          <Text style={[typography.h2, styles.sectionTitle]}>Guest Information</Text>
          <View style={styles.guestInfo}>
            <View style={styles.infoRow}>
              <Text style={[typography.bodyLarge, { color: colors.text.secondary }]}>Name</Text>
              <Text style={typography.bodyLarge}>{order.guest.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[typography.bodyLarge, { color: colors.text.secondary }]}>Phone No.</Text>
              <Text style={typography.bodyLarge}>{order.guest.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[typography.bodyLarge, { color: colors.text.secondary }]}>Address</Text>
              <Text style={typography.bodyLarge}>{order.guest.address}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Footer>
        <LargeButton
          title="Select items to reorder"
          onPress={() => {/* Handle reorder */}}
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
  content: {
    flex: 1,
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
  guestInfo: {
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
});

export default OrderDetailScreen;

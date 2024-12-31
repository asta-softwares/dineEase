import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Platform, RefreshControl } from 'react-native';
import TopNav from '../Components/TopNav';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { restaurantService } from '../api/services/restaurantService';
import { Ionicons } from '@expo/vector-icons';

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

const OrderCard = ({ order, onPress }) => {
  const formattedDate = new Date(order.order_time).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity 
      style={styles.menuItem} 
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <View style={styles.orderHeader}>
            <Text style={[typography.labelLarge, styles.orderId]}>
              Order #{order.id}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
              <Text style={[typography.labelMedium, styles.statusText]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Text>
            </View>
          </View>
          
          <Text style={[typography.labelLarge, styles.restaurantName]}>
            {order.restaurant_details.name}
          </Text>
          
          <View style={styles.itemsList}>
            {order.items.map((item, index) => (
              <Text key={index} style={[typography.bodySmall, styles.description]}>
                {item.quantity}x {item.menu_item.name}
              </Text>
            )).slice(0, 2)}
            {order.items.length > 2 && (
              <Text style={[typography.bodySmall, styles.description]}>
                +{order.items.length - 2} more items
              </Text>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={[typography.bodyMedium, styles.price]}>
              ${parseFloat(order.total).toFixed(2)}
            </Text>
            <Text style={[typography.bodySmall, styles.date]}>
              {formattedDate}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = async (page = 1, shouldRefresh = false) => {
    try {
      setLoading(true);
      const response = await restaurantService.getOrders(page);
      
      if (shouldRefresh) {
        setOrders(response.results);
      } else {
        setOrders(prevOrders => [...prevOrders, ...response.results]);
      }
      
      setNextPage(response.next ? page + 1 : null);
      setHasMore(!!response.next);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders(1, true);
  }, []);

  const loadMore = () => {
    if (!loading && hasMore && nextPage) {
      fetchOrders(nextPage);
    }
  };

  const handleOrderPress = (order) => {
    navigation.navigate('OrderDetailScreen', { 
      order: order,
      restaurant: order.restaurant_details
    });
  };

  useEffect(() => {
    fetchOrders(1, true);
  }, []);

  const renderFooter = () => {
    if (!loading || refreshing) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="receipt-outline" size={64} color={colors.text.secondary} />
      <Text style={[typography.h3, styles.emptyText]}>No orders yet</Text>
      <Text style={[typography.bodyMedium, styles.emptySubtext]}>
        Your order history will appear here
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TopNav 
          title="My Orders" 
          handleGoBack={() => navigation.goBack()}
          variant="solid"
        />
      </View>
      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() => handleOrderPress(item)}
          />
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.contentPadding}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'ios' ? 120 : 100,
    zIndex: 10,
  },
  contentPadding: {
    padding: 16,
    paddingBottom: 32,
  },
  menuItem: {
    width: '100%',
    marginBottom: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 0,
  },
  contentContainer: {
    padding: 16,
  },
  textContainer: {
    flex: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    color: colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: colors.text.white,
    textTransform: 'capitalize',
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  restaurantName: {
    color: colors.text.primary,
    marginBottom: 8,
  },
  description: {
    color: colors.text.secondary,
    marginBottom: 4,
  },
  itemsList: {
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    color: colors.primary,
    fontWeight: '600',
  },
  date: {
    color: colors.text.secondary,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 64,
  },
  emptyText: {
    color: colors.text.secondary,
    marginTop: 16,
  },
  emptySubtext: {
    color: colors.text.secondary,
    marginTop: 8,
  },
});

export default OrdersScreen;

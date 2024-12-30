import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopNav from '../Components/TopNav';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { restaurantService } from '../api/services/restaurantService';
import { Ionicons } from '@expo/vector-icons';

const OrderCard = ({ order, onPress }) => {
  const formattedDate = new Date(order.order_time).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return colors.success;
      case 'pending':
        return colors.warning;
      default:
        return colors.text.secondary;
    }
  };

  return (
    <TouchableOpacity 
      style={styles.menuItem} 
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <View style={styles.orderHeader}>
            <Text style={[typography.labelLarge, styles.name]}>
              Order #{order.id}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
              <Text style={styles.statusText}>
                {order.status.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <Text style={[typography.labelLarge, styles.restaurantName]}>
            {order.restaurant}
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await restaurantService.getOrders();
      const sortedOrders = response.results.sort((a, b) => 
        new Date(b.order_time) - new Date(a.order_time)
      );
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderPress = (order) => {
    navigation.navigate('OrderDetailScreen', { 
      order: {
        order_id: order.id
      },
      restaurant: {
        name: order.restaurant
      }
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TopNav 
        title="My Orders"
        handleGoBack={() => navigation.goBack()}
        variant="solid"
      />
      
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() => handleOrderPress(item)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
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
  listContainer: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 70 : 80,
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
  name: {
    color: colors.text.primary,
  },
  restaurantName: {
    color: colors.text.primary,
    marginBottom: 8,
  },
  description: {
    color: colors.text.secondary,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Bold',
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
});

export default OrdersScreen;

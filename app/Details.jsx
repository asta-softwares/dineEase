import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageView from "react-native-image-viewing";
import TopNav from "../Components/TopNav";
import MenuItems from "../Components/MenuItems";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  withSpring,
} from "react-native-reanimated";
import { restaurantService } from "../api/services/restaurantService";
import { colors } from "../styles/colors";
import { typography } from "../styles/typography";
import Footer from './Layout/Footer';
import LargeButton from '../Components/Buttons/LargeButton';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCart } from '../context/CartContext';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const CustomHeader = ({ onClose }) => (
  <SafeAreaView edges={['top']} style={styles.customHeaderContainer}>
    <TouchableOpacity
      style={styles.closeButton}
      onPress={onClose}
      activeOpacity={0.7}
    >
      <Ionicons name="close" size={24} color="#FFFFFF" />
    </TouchableOpacity>
  </SafeAreaView>
);

export default function DetailScreen({ route, navigation }) {
  const { restaurantId } = route.params;
  const { width } = useWindowDimensions();
  const scrollY = useSharedValue(0);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState(null);
  const [cuisines, setCuisines] = useState([]);
  const cartContext = useCart();
  const { cart, getTotalItems, getTotalCost, setOwner } = cartContext || {};
  
  const totalItems = cart?.restaurantId === restaurantId ? (getTotalItems?.() || 0) : 0;
  const cartTotal = cart?.restaurantId === restaurantId ? (getTotalCost?.() || 0) : 0;
  const footerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(totalItems > 0 ? 0 : 100, {
            damping: 20,
            stiffness: 90,
          })
        }
      ],
      opacity: withSpring(totalItems > 0 ? 1 : 0)
    };
  }, [totalItems]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [restaurantData, cuisinesData] = await Promise.all([
          restaurantService.getRestaurantById(restaurantId),
          restaurantService.getMenuCuisines()
        ]);
        setRestaurant(restaurantData);
        setCuisines(cuisinesData);
        // Set owner ID when restaurant loads
        if (restaurantData?.owner) {
          setOwner(restaurantData.owner);
        }
      } catch (error) {
        setError(error.message);
        console.error('Error loading restaurant:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [restaurantId]);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const imageStyle = useAnimatedStyle(() => ({
    height: interpolate(
      scrollY.value,
      [-200, 0, 200],
      [452, 252, 252],
      { extrapolate: 'clamp' }
    ),
  }));

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleCheckout = () => {
    navigation.navigate("Checkout");
  };

  const handleImageViewerClose = () => {
    setImageViewerVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[typography.h3, { color: colors.text.error }]}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopNav title={restaurant?.name} handleGoBack={handleGoBack} scrollY={scrollY} />
      
      <AnimatedScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ width: '100%' }}
        style={{ width: '100%' }}
        bounces={false}
        overScrollMode="never"
      >
        <View style={{ width: '100%', flex: 1 }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setImageViewerVisible(true)}
          >
            <Animated.Image
              source={{
                uri: restaurant?.image || 'https://via.placeholder.com/400',
              }}
              style={[styles.image, imageStyle]}
              resizeMode="cover"
            />
          </TouchableOpacity>

          <View style={[styles.content, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.background }]}>
              <Text style={[typography.h2, styles.title, { color: colors.text.black }]}>{restaurant?.name}</Text>
              <View style={[styles.rating, { backgroundColor: colors.rating}]}>
                <Ionicons name="star" size={14} color={colors.text.white} />
                <Text style={[typography.labelMedium, styles.ratingText, { color: colors.text.white }]}>{restaurant?.ratings}</Text>
              </View>
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Ionicons name="restaurant-outline" size={14} color={colors.text.primary} style={styles.infoIcon} />
                <Text style={[typography.bodyMedium, styles.infoText, { color: colors.text.secondary }]}>
                  {restaurant?.categories?.map(cat => cat.name).join(', ')}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="location-outline" size={14} color={colors.text.primary} style={styles.infoIcon} />
                <Text style={[typography.bodyMedium, styles.infoText, { color: colors.text.secondary }]}>
                  {restaurant?.location}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={14} color={colors.text.primary} style={styles.infoIcon} />
                <Text style={[typography.bodyMedium, styles.infoText, { color: colors.text.secondary }]}>
                  {Object.entries(restaurant?.operating_hours || {})
                    .map(([day, hours]) => `${day}: ${hours}`)
                    .join('\n')}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="call-outline" size={14} color={colors.text.primary} style={styles.infoIcon} />
                <Text style={[typography.bodyMedium, styles.infoText, { color: colors.text.secondary }]}>
                  {restaurant?.telephone}
                </Text>
              </View>
            </View>

            <View style={styles.descriptionContainer}>
              <Text 
                style={[typography.bodyMedium, styles.description, { 
                  color: colors.text.black, 
                  width: '100%', 
                  marginBottom: 10,
                  textAlign: 'left',
                  flexShrink: 1,
                }]}
                numberOfLines={0}
                ellipsizeMode="clip"
                adjustsFontSizeToFit={false}
              >
                {restaurant?.description}
              </Text>
            </View>

            <View style={styles.menuContainer}>
              <Text style={[typography.h3, styles.sectionTitle]}>Menu Items</Text>
              {cuisines.map(cuisine => {
                const menuItems = restaurant?.menus?.filter(
                  menu => menu.category && menu.category.toString() === cuisine.id.toString()
                );
                
                if (menuItems && menuItems.length > 0) {
                  return (
                    <View key={cuisine.id} style={styles.menuSection}>
                      <Text style={[styles.cuisineTitle]}>{cuisine.name}</Text>
                      <MenuItems 
                        items={menuItems}
                        restaurantId={restaurant.id} 
                      />
                    </View>
                  );
                }
                return null;
              })}
              
              {/* Uncategorized items */}
              {restaurant?.menus?.filter(
                menu => !menu.category || !cuisines.some(cuisine => cuisine.id.toString() === menu.category.toString())
              ).length > 0 && (
                <View style={styles.menuSection}>
                  <Text style={[styles.cuisineTitle]}>Other Items</Text>
                  <MenuItems 
                    items={restaurant.menus.filter(
                      menu => !menu.category || !cuisines.some(cuisine => cuisine.id.toString() === menu.category.toString())
                    )}
                    restaurantId={restaurant.id}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </AnimatedScrollView>

      <ImageView
        images={[{ uri: restaurant?.image }]}
        imageIndex={0}
        visible={imageViewerVisible}
        onRequestClose={handleImageViewerClose}
        HeaderComponent={({ onClose }) => (
          <CustomHeader onClose={onClose} />
        )}
      />
      
      <Animated.View style={[styles.footer, footerAnimatedStyle]}>
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.cartButtonText}>
            View Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'}) - Total: ${cartTotal.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
  },
  image: {
    width: '100%',
    height: 252,
  },
  content: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 20,
    paddingTop: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    width: '100%',
    alignSelf: 'stretch',
  },
  customHeaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    padding: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    flex: 1,
    marginRight: 16,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    marginLeft: 4,
  },
  infoContainer: {
    marginBottom: 16,
    width: '100%',
  },
  infoItem: {
    flexDirection: "row",
    marginBottom: 12,
    width: '100%',
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
  },
  description: {
    width: '100%',
    marginBottom: 10,
    flexWrap: 'wrap',
    alignSelf: 'stretch',
    textAlign: 'left',
  },
  descriptionContainer: {
    width: '100%',
    alignSelf: 'stretch',
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  menuContainer: {
    marginTop: 24,
    paddingBottom: 100, // Add padding for the footer
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 24,
    color: colors.text.black,
  },
  cuisineTitle: {
    marginBottom: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 20,
    color: colors.text.primary,
    paddingHorizontal: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingBottom: 32,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  cartButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartButtonText: {
    color: colors.white,
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
});

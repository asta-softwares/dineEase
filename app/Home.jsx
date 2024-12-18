import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  useWindowDimensions,
  TextInput,
  StatusBar,
  SafeAreaView,
  Platform,
  BackHandler,
  Alert,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useFonts } from 'expo-font';
import { PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import CuisinesCard from "../Components/CuisinesCard";
import FeatureCard from "../Components/FeatureCard";
import RestaurantCard from "../Components/RestaurantCard";
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { layout } from '../styles/layout';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { restaurantService } from '../api/services/restaurantService';

export default function HomeScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-Medium': PlusJakartaSans_500Medium,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
  });

  const { width } = useWindowDimensions();
  const [isDineIn, setIsDineIn] = useState(true);
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const searchHeight = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [50, 0],
    extrapolate: 'clamp'
  });

  const searchOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  const searchMargin = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [16, 0],
    extrapolate: 'clamp'
  });

  const handleDetail = (restaurant) => {
    navigation.navigate("Details", { restaurantId: restaurant.id });
  };

  const fetchRestaurants = async (filters = {}) => {
    try {
      setLoading(true);
      const serviceType = isDineIn ? 'dine-in' : 'takeout';
      const response = await restaurantService.getRestaurantsByFilter({
        serviceType,
        categoryId: filters.categoryId,
        searchQuery: filters.searchQuery
      });
      setRestaurants(response);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      Alert.alert(
        'Error',
        'Failed to load restaurants. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchPromos = async () => {
    try {
      const promosData = await restaurantService.getPromos();
      const promosWithImages = await Promise.all(
        promosData.map(async (promo) => {
          const restaurant = await restaurantService.getRestaurantById(promo.restaurant_details.id);
          return {
            ...promo,
            restaurantImage: restaurant.image
          };
        })
      );
      setPromos(promosWithImages);
    } catch (error) {
      console.error('Error fetching promos:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchRestaurants(),
        fetchPromos()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
      Alert.alert(
        'Error',
        'Failed to refresh data. Please try again.'
      );
    } finally {
      setRefreshing(false);
    }
  }, [isDineIn, selectedCategory]);

  useEffect(() => {
    fetchRestaurants();
  }, [isDineIn]); // Refetch when service type changes

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleCategoryPress = async (category) => {
    try {
      if (selectedCategory === category.id) {
        setSelectedCategory(null);
        fetchRestaurants();
      } else {
        setSelectedCategory(category.id);
        fetchRestaurants({ categoryId: category.id });
      }
    } catch (error) {
      console.error('Error handling category press:', error);
      Alert.alert(
        'Error',
        'Failed to filter restaurants. Please try again.'
      );
    }
  };

  const handleModeSwitch = (dineIn) => {
    setIsDineIn(dineIn);
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    setIsSearching(!!text);
    fetchRestaurants({ 
      categoryId: selectedCategory,
      searchQuery: text 
    });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    fetchRestaurants({ categoryId: selectedCategory });
  };

  useEffect(() => {
    // Prevent going back to login only on Home screen
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,
    });

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Get current route name
      const currentRoute = navigation.getState().routes[navigation.getState().index];
      
      // Only handle back press if we're on the Home screen
      if (currentRoute.name === 'Home') {
        Alert.alert(
          'Exit App',
          'Do you want to exit the app?',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'Exit',
              onPress: () => BackHandler.exitApp(),
            },
          ],
          { cancelable: false }
        );
        return true; // Prevent default behavior
      }
      return false; // Allow default back behavior on other screens
    });

    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allCategories] = await Promise.all([
          restaurantService.getRestaurantsCategory()
        ]);
        setCategories(allCategories);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.container}>
          <Animated.View style={[styles.header]}>
            <View style={styles.topHeader}>
              <TouchableOpacity style={styles.menuButton} onPress={handleProfilePress}>
                <Ionicons name="person-outline" size={24} color={colors.text.primary} />
              </TouchableOpacity>
              <View style={styles.logoContainer}>
                <Image
                  source={require("../assets/logo.png")}
                  style={styles.logo}
                />
              </View>
              <TouchableOpacity>
                <Ionicons name="notifications-outline" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <Animated.View
              style={[
                styles.searchContainer,
                {
                  height: searchHeight,
                  opacity: searchOpacity,
                  marginBottom: searchMargin,
                },
              ]}
            >
              <TextInput
                style={styles.searchInput}
                placeholder="Search for restaurants"
                placeholderTextColor={colors.secondary}
                value={searchQuery}
                onChangeText={handleSearch}
              />
              {searchQuery ? (
                <TouchableOpacity 
                  style={styles.clearButton} 
                  onPress={handleClearSearch}
                >
                  <Ionicons name="close-circle" size={20} color={colors.text.secondary} />
                </TouchableOpacity>
              ) : (
                <Ionicons
                  name="search"
                  size={15}
                  color={colors.secondary}
                  style={styles.searchIcon}
                />
              )}
            </Animated.View>
          </Animated.View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
          >
            <View style={styles.scrollContent}>
              {!isSearching && (
                <>
                  <View style={styles.switchContainer}>
                    <TouchableOpacity 
                      style={isDineIn ? styles.switchButtonActive : styles.switchButton}
                      onPress={() => handleModeSwitch(true)}
                    >
                      <Text style={[{ 
                        fontFamily: 'PlusJakartaSans-Medium',
                        fontSize: 14,
                        color: isDineIn ? colors.text.white : colors.text.primary 
                      }]}>
                        Dine In
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={!isDineIn ? styles.switchButtonActive : styles.switchButton}
                      onPress={() => handleModeSwitch(false)}
                    >
                      <Text style={[{ 
                        fontFamily: 'PlusJakartaSans-Medium',
                        fontSize: 14,
                        color: !isDineIn ? colors.text.white : colors.text.primary 
                      }]}>
                        Take Out
                      </Text>
                    </TouchableOpacity>
                  </View> 
                   <Text style={[{
                    fontFamily: 'PlusJakartaSans-Bold',
                    fontSize: 20,
                    color: colors.text.primary,
                    marginHorizontal: layout.spacing.md,
                    marginBottom: layout.spacing.sm
                  }]}>
                    FEATURED OFFERS
                  </Text> 
                   <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.featuresContainer}
                    contentContainerStyle={styles.featuresContentContainer}
                  >
                    {promos.map((promo) => (
                      <View key={promo.id} style={styles.featureCardWrapper}>
                        <FeatureCard
                          title={promo.name}
                          description={promo.description}
                          imageUrl={promo.restaurantImage}
                          price={promo.discount_type === 'percentage' ? `${promo.discount}% off` : `$${promo.discount}`}
                        />
                      </View>
                    ))}
                  </ScrollView> 

                  <Text style={[{
                    fontFamily: 'PlusJakartaSans-Bold',
                    fontSize: 20,
                    color: colors.text.primary,
                    marginHorizontal: layout.spacing.md,
                    marginBottom: layout.spacing.sm
                  }]}>
                    EXPLORE CRAVINGS
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.cuisinesContainer}
                    contentContainerStyle={styles.cuisinesContentContainer}
                  >
                    {categories.map((category) => (
                      <View key={category.id} style={styles.cuisinesCardWrapper}>
                        <CuisinesCard
                          name={category.name}
                          imageUrl={{ uri: category.image }}
                          description={category.description}
                          onPress={() => handleCategoryPress(category)}
                          isSelected={selectedCategory === category.id}
                        />
                      </View>
                    ))}
                  </ScrollView>
                </>
              )}

              <Text style={[{
                fontFamily: 'PlusJakartaSans-Bold',
                fontSize: 20,
                color: colors.text.primary,
                marginHorizontal: layout.spacing.md,
                marginBottom: layout.spacing.sm
              }]}>
                {restaurants.length} restaurants to explore
              </Text>
              <View style={styles.restaurantsContainer}>
                {loading ? (
                  <ActivityIndicator size="large" color={colors.primary} />
                ) : restaurants.length > 0 ? (
                  restaurants.map((restaurant) => (
                    <TouchableOpacity 
                      key={restaurant.id} 
                      onPress={() => handleDetail(restaurant)}
                      style={styles.restaurantCardWrapper}
                    >
                      <RestaurantCard
                        name={restaurant.name}
                        rating={restaurant.ratings}
                        address={restaurant.location}
                        imageUrl={restaurant.image}
                      />
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={[typography.bodyLarge, { textAlign: 'center', marginTop: 20 }]}>
                    No restaurants found
                  </Text>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.background,
    zIndex: 1,
    paddingHorizontal: layout.spacing.md,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    marginTop:  Platform.OS === 'android' ? 8: 0,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: layout.spacing.sm,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light,
    borderRadius: layout.card.borderRadius,
    paddingHorizontal: layout.spacing.sm,
    marginBottom: layout.spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: layout.spacing.xs,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: colors.text.primary,
  },
  searchIcon: {
    marginRight: layout.spacing.sm,
  },
  clearButton: {
    padding: layout.spacing.xs,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: layout.getResponsiveSpacing(layout.spacing.xxl),
    marginHorizontal: -layout.spacing.md,
    marginBottom: layout.spacing.md,
  },
  switchButton: {
    width: '48%',
    height: 40,
    backgroundColor: colors.light,
    borderRadius: layout.card.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchButtonActive: {
    width: '48%',
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: layout.card.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuresContainer: {
    paddingLeft: layout.spacing.md,
    marginBottom: layout.spacing.md,
  },
  cuisinesContainer: {
    paddingLeft: layout.spacing.md,
    marginBottom: layout.spacing.md,
  },
  featureCardWrapper: {
    marginRight: layout.spacing.sm,
  },
  cuisinesCardWrapper: {
    marginRight: layout.spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: layout.spacing.xl,
  },
  categoryButton: {
    borderRadius: 45,
    padding: 2,
  },
  selectedCategory: {
    backgroundColor: colors.primary,
  },
  restaurantsContainer: {
    marginBottom: layout.spacing.md,
  },
  restaurantCardWrapper: {
    width: '100%',
    paddingHorizontal: layout.spacing.md,
  }
});

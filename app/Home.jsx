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
  RefreshControl,
  ImageBackground
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useFonts } from 'expo-font';
import { PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import CuisinesCard from "../Components/CuisinesCard";
import RestaurantCard from "../Components/RestaurantCard";
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { layout } from '../styles/layout';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { restaurantService } from '../api/services/restaurantService';
import { useUserStore } from '../stores/userStore';

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
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { user } = useUserStore();

  const searchHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [50, 0],
    extrapolate: 'clamp'
  });

  const searchOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  const searchMargin = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [16, 0],
    extrapolate: 'clamp'
  });

  const serviceTypeMargin = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [Platform.OS === 'ios' ? 120 : 70, 0],
    extrapolate: 'clamp',
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

  const fetchCategories = async () => {
    try {
      const allCategories = await restaurantService.getRestaurantsCategory();
      setCategories(allCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchRestaurants({
          categoryId: selectedCategory,
          searchQuery: searchQuery
        }),
        fetchCategories()
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
  }, [isDineIn, selectedCategory, searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchCategories();
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [isDineIn]); // Refetch when service type changes


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


  const handleProfilePress = async () => {
    const user = useUserStore.getState().user;
    if (user) {
      navigation.navigate('Profile');
    } else {
      navigation.navigate('Login');
    }
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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        animated={true}
        barStyle="light-content"
        translucent 
        backgroundColor="transparent"
      />
      <View style={styles.container}>

          <ImageBackground 
            source={require('../assets/new_year_header_bg.png')}
            style={styles.header}
            resizeMode="cover"
          >
         <SafeAreaView >
            <View style={styles.topHeader}>
              <TouchableOpacity style={styles.menuButton} onPress={handleProfilePress}>
                <Ionicons name="person-outline" size={24} color={colors.text.white} />
              </TouchableOpacity>
              <View style={styles.logoContainer}>
                <Image
                  source={require("../assets/logo.png")}
                  style={styles.logo}
                />
              </View>
              <TouchableOpacity 
                onPress={() => user && navigation.navigate('OrdersScreen')}
                style={{ opacity: user ? 1 : 0 }}
              >
                <Ionicons name="receipt-outline" size={24} color={colors.text.white} />
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
              <View style={styles.searchInputContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search Restaurant, Cuisine, Location..."
                  placeholderTextColor={colors.text.secondary}
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
                  <Ionicons name="search" size={20} color={colors.text.secondary} />
                )}
              </View>
              <Image 
                source={require('../assets/new_year_text.png')} 
                style={styles.centerHeaderImg}
                resizeMode="contain"
              />
            </Animated.View>

            <Image 
              source={require('../assets/new_year_text.png')} 
              style={styles.leftHeaderImg}
              resizeMode="contain"
            />

            <Image 
              source={require('../assets/meal.png')} 
              style={styles.rightHeaderImg}
              resizeMode="contain"
            />

            <Animated.View
              style={[
                styles.serviceTypeContainer,
                {
                  marginTop: serviceTypeMargin,
                }
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.switchButton,
                  isDineIn && styles.activeButton,
                ]}
                onPress={() => setIsDineIn(true)}
              >
                <Text style={[styles.switchText, isDineIn && styles.activeText]}>
                  Dine in
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.switchButton,
                  !isDineIn && styles.activeButton,
                ]}
                onPress={() => setIsDineIn(false)}
              >
                <Text style={[styles.switchText, !isDineIn && styles.activeText]}>
                 Take out
                </Text>
              </TouchableOpacity>
            </Animated.View>
            </SafeAreaView>
          </ImageBackground>
       

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
                      promos={restaurant.promos}
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
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  header: {
    zIndex: 1,
    paddingHorizontal: layout.spacing.md,
    paddingTop: Platform.OS === 'android' ? 50 : 0,
    paddingBottom: 16,
    overflow: 'hidden'
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
    position: 'relative',
    marginBottom: 8,
    zIndex: 2,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light,
    borderRadius: layout.card.borderRadius,
    paddingHorizontal: layout.spacing.sm,
    zIndex: 2,
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
  searchButton: {
    padding: layout.spacing.xs,
  },
  centerHeaderImg: {
    width: '80%',
    height:100,
    alignSelf: 'center',
    marginTop: 0,
    display: 'none',
  },
  leftHeaderImg: {
    position: 'absolute',
    left: 20,
    top: 80,
    width: 200,
    height: 200,
    zIndex: 1,
    display: 'none',
  },
  rightHeaderImg: {
    position: 'absolute',
    right: -50,
    top: 60,
    width: 250,
    height: 250,
    zIndex: -1,
    display: 'none',
  },
  serviceTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: layout.getResponsiveSpacing(layout.spacing.xxl),
    marginHorizontal: -layout.spacing.md,
    marginBottom: 8,
    zIndex: 2,
  },
  switchButton: {
    width: '48%',
    height: 40,
    backgroundColor: 'transparent',
    borderRadius: layout.card.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.text.white,
  },
  activeButton: {
    backgroundColor: colors.text.white,
    borderWidth: 0,
  },
  switchText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 14,
    color: colors.text.white,
  },
  activeText: {
    color: colors.primary,
  },
  cuisinesContainer: {
    paddingLeft: layout.spacing.md,
    marginBottom: layout.spacing.md,
  },
  cuisinesCardWrapper: {
    marginRight: layout.spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: layout.spacing.xl,
    paddingTop: layout.spacing.sm,
  },
  restaurantsContainer: {
    marginBottom: layout.spacing.md,
  },
  restaurantCardWrapper: {
    width: '100%',
    paddingHorizontal: layout.spacing.md,
  },
  clearButton: {
    padding: layout.spacing.xs,
  }
});

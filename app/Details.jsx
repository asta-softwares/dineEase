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
import { TabView, TabBar } from 'react-native-tab-view';
import TopNav from "../Components/TopNav";
import MenuItems from "../Components/MenuItems";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import { restaurantService } from "../api/services/restaurantService";
import { colors } from "../styles/colors";
import { typography } from "../styles/typography";
import Footer from './Layout/Footer';
import LargeButton from '../Components/Buttons/LargeButton';
import Ionicons from '@expo/vector-icons/Ionicons';

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

export default function DetailScreen({ route }) {
  const navigation = useNavigation();
  const { restaurantId } = route.params;
  const { width } = useWindowDimensions();
  const scrollY = useSharedValue(0);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    { key: 'all', title: 'All Items' }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantData, cuisinesData] = await Promise.all([
          restaurantService.getRestaurantById(restaurantId),
          restaurantService.getMenuCuisines()
        ]);
        setRestaurant(restaurantData);
        
        const newRoutes = [
          { key: 'all', title: 'All Items' },
          ...(cuisinesData || [])
            .filter(cuisine => restaurantData?.menus?.some(menu => menu.category && menu.category.toString() === cuisine.id?.toString()))
            .map(cuisine => ({
              key: cuisine.id?.toString() || 'unknown',
              title: cuisine.name || 'Unknown'
            }))
        ];
        setRoutes(newRoutes);
      } catch (error) {
        setError(error.message);
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

  const renderScene = ({ route }) => {
    if (!restaurant?.menus) return null;
    
    if (route.key === 'all') {
      return (
        <ScrollView style={{ flex: 1 }}>
          <MenuItems items={restaurant.menus} />
        </ScrollView>
      );
    }
    
    const cuisineMenus = restaurant.menus.filter(menu => 
      menu.category && menu.category.toString() === route.key
    );
    return (
      <ScrollView style={{ flex: 1 }}>
        <MenuItems items={cuisineMenus} />
      </ScrollView>
    );
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={{ backgroundColor: colors.primary }}
      style={{ 
        backgroundColor: colors.background,
        elevation: 0,
        shadowOpacity: 0,
        height: 'auto',
      }}
      tabStyle={{ 
        width: 'auto',
        paddingHorizontal: 15,
        height: 'auto',
        minHeight: 48,
      }}
      labelStyle={[
        typography.bodyMedium, 
        { 
          color: colors.text.black,
          textAlign: 'center',
          textTransform: 'none',
        }
      ]}
      activeColor={colors.primary}
      inactiveColor={colors.text.secondary}
    />
  );

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

  const images = [
    {
      uri: restaurant?.image || "https://via.placeholder.com/400",
    },
  ];

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
          <View style={{ width: '100%' }}>
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

              <View style={styles.tabViewContainer}>
                <TabView
                  navigationState={{ index, routes }}
                  renderScene={renderScene}
                  renderTabBar={renderTabBar}
                  onIndexChange={setIndex}
                  initialLayout={{ width }}
                  style={styles.tabView}
                />
              </View>
            </View>
          </View>
        </View>
      </AnimatedScrollView>

      <ImageView
        images={images}
        imageIndex={0}
        visible={imageViewerVisible}
        onRequestClose={handleImageViewerClose}
        HeaderComponent={({ onClose }) => (
          <CustomHeader onClose={onClose} />
        )}
      />
      
      <Footer style={[styles.footer, { backgroundColor: colors.background }]}>
        <LargeButton 
          title="View Cart"
          onPress={handleCheckout}
        />
      </Footer>
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
    // fontFamily: "Plus Jakarta Sans",
    // fontWeight: "700",
    // fontSize: 24,
    // color: "#1F262C",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    // fontFamily: "Plus Jakarta Sans",
    // fontWeight: "600",
    // fontSize: 14,
    // color: "#FFFFFF",
    // marginLeft: 4,
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
  viewMap: {
    // fontFamily: "Plus Jakarta Sans",
    // fontSize: 12,
    // color: colors.text.primary,
    // marginLeft: 8,
    // textDecorationLine: "underline",
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
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  tabViewContainer: {
    marginTop: 16,
    height: 400, // Set a fixed height or adjust as needed
  },
  tabView: {
    height: '100%',
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

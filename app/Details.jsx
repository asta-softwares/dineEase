import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageView from "react-native-image-viewing";
import { TabBar, TabView } from 'react-native-tab-view';
import TopNav from "../Components/TopNav";
import MenuItems from '../Components/MenuItems';
import Footer from './Layout/Footer';
import LargeButton from '../Components/Buttons/LargeButton';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { restaurantService } from '../api/services/restaurantService';
import PagerView from 'react-native-pager-view';
import Animated, { 
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  withTiming,
} from 'react-native-reanimated';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const CustomHeader = ({ onClose }) => (
  <SafeAreaView edges={['top']} style={styles.customHeaderContainer}>
    <View style={styles.customHeader}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
        activeOpacity={0.7}
      >
        <Ionicons name="close" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={styles.placeholder} />
    </View>
  </SafeAreaView>
);

export default function DetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { restaurantId } = route.params;
  const scrollY = useSharedValue(0);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState(null);
  const [routes] = useState([
    { key: 'menu', title: 'Menu' },
  ]);
  const { width } = useWindowDimensions();

  useEffect(() => {
    fetchRestaurantDetails();
  }, [restaurantId]);

  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true);
      const data = await restaurantService.getRestaurantById(restaurantId);
      setRestaurant(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleCheckout = () => {
    navigation.navigate("Checkout");
  };

  const images = [
    {
      uri: "https://s3-alpha-sig.figma.com/img/20fc/e656/8ae7b68095a4d524fbca4ccea6841645?Expires=1731283200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=DTbgg-21pPIWn9tGhAkaJGMKxy7l3gO8FzhR3szV1d349RSkaJCTW9SqpT1aAHL34weL53QaADuxnD1DgAqEqmLhHJytGI9I6z~BEJSofaWkJxva53nIAaSZa5odGsQpsAlWVVnEm9neDihqdormNgSRmdgWz1g0dSY1EVYL6XXjKUUdQ0ILm53LELAkLw4qF2OTQLOXQq6szLD6iwiZJqFgQuoeB5V9jQ5hrucsrKfgof382~R6Qtjo14dbne0nE-Y4BxODnppMI84o7thkQ-jUB1i-k~Ojs7eEoKimMBKjZJ9mdOmxoKnkot8QSExAxpVQYNTjVwhH-AjBPqVZVA__",
    },
  ];

  const handleImageViewerClose = () => {
    setImageViewerVisible(false);
  };

  const renderScene = ({ route }) => {
    if (route.key === 'menu') {
      return <MenuItems items={restaurant?.menus || []} />;
    }
    return null;
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: colors.primary }}
      style={{ 
        backgroundColor: colors.background,
        elevation: 0,
        shadowOpacity: 0,
      }}
      labelStyle={{ color: colors.text.black }}
      activeColor={colors.primary}
      inactiveColor={colors.text.secondary}
    />
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const imageStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [-200, 0, 200],
      [452, 252, 252],
      { extrapolate: 'clamp' }
    );

    return {
      height,
    };
  });

  return (
    <View style={styles.container}>
      <TopNav handleGoBack={handleGoBack} scrollY={scrollY} />
      
      <AnimatedScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View>
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
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={[typography.h2, styles.title, { color: colors.text.black }]}>{restaurant?.name}</Text>
              <View style={styles.rating}>
                <Ionicons name="star" size={14} color={colors.text.white} />
                <Text style={[typography.labelMedium, styles.ratingText, { color: colors.text.white }]}>{restaurant?.ratings}</Text>
              </View>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Ionicons name="restaurant-outline" size={14} color={colors.text.primary} />
                <Text style={[typography.bodyMedium, styles.infoText, { color: colors.text.secondary }]}>
                  {restaurant?.categories?.map(cat => cat.name).join(', ')}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="location-outline" size={14} color={colors.text.primary} />
                <Text style={[typography.bodyMedium, styles.infoText, { color: colors.text.secondary }]}>
                  {restaurant?.location}
                </Text>
                <Text style={[typography.bodyMedium, styles.viewMap, { color: colors.text.primary }]}>view map</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={14} color={colors.text.primary} />
                <Text style={[typography.bodyMedium, styles.infoText, { color: colors.text.secondary }]}>
                  {Object.entries(restaurant?.operating_hours || {})
                    .map(([day, hours]) => `${day}: ${hours}`)
                    .join('\n')}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="call-outline" size={14} color={colors.text.primary} />
                <Text style={[typography.bodyMedium, styles.infoText, { color: colors.text.secondary }]}>{restaurant?.telephone}</Text>
              </View>
            </View>
            <Text style={[typography.bodyMedium, styles.description, { color: colors.text.black }]}>
              {restaurant?.description}
            </Text>

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
      </AnimatedScrollView>
      
      <Footer style={styles.footer}>
        <LargeButton 
          title="View Cart"
          count={2}
          price="25.99"
          onPress={() => navigation.navigate('Checkout')}
        />
      </Footer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: 252,
  },
  content: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 20,
    paddingTop: 24,
  },
  customHeaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  placeholder: {
    width: 40,
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
    backgroundColor: colors.primary,
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
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    // fontFamily: "Plus Jakarta Sans",
    // fontSize: 14,
    // color: "#1F262C",
    // marginLeft: 8,
  },
  viewMap: {
    // fontFamily: "Plus Jakarta Sans",
    // fontSize: 12,
    // color: colors.text.primary,
    // marginLeft: 8,
    // textDecorationLine: "underline",
  },
  description: {
    // fontFamily: "Plus Jakarta Sans",
    // fontSize: 14,
    // color: "#1F262C",
    // lineHeight: 20,
  },
  footer: {
    backgroundColor: colors.background,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  viewCartButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 10,
    width: '100%',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  cartCount: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartCountText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  viewCartText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  priceText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  tabViewContainer: {
    marginVertical: 16,
    height: 600,
    pointerEvents: 'box-none',
  },
  tabView: {
    height: '100%',
    pointerEvents: 'box-none',
  },
  tabScrollView: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  tabContentText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.text.primary,
  },
  menuItemContainer: {
    gap: 8,
  },
  scrollView: {
    flex: 1,
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

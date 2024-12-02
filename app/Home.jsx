import React, { useState, useRef, useCallback } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from 'expo-font';
import { PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import CuisinesCard from "../Components/CuisinesCard";
import FeatureCard from "../Components/FeatureCard";
import RestaurantCard from "../Components/RestaurantCard";
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { layout } from '../styles/layout';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-Medium': PlusJakartaSans_500Medium,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
  });

  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const [isDineIn, setIsDineIn] = useState(true);
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

  const handleDetail = () => {
    navigation.navigate("Detail");
  };
  const handleModeSwitch = (isDineInMode = false) => {
    setIsDineIn(isDineInMode);
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

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
              />
              <Ionicons
                name="search"
                size={15}
                color={colors.secondary}
                style={styles.searchIcon}
              />
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
          >
            <View style={styles.scrollContent}>
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
                    Grab & Go
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
                <View style={styles.featureCardWrapper}>
                  <FeatureCard
                    title="11 best microbreweriesfor beer lovers"
                    description="Free delivery on orders over $30"
                    imageUrl="https://images.squarespace-cdn.com/content/v1/58e705a1ebbd1a4ffd5b30c7/1498183161728-JE354SHTNX7RV6KHSO8J/drink.jpg?format=2500w"
                    price="$ x"
                  />
                </View>
                <View style={styles.featureCardWrapper}>
                  <FeatureCard
                    title="6 delicious Pan-Asian outlets"
                    description="Free delivery on orders over $30"
                    imageUrl="https://www.recipesbynora.com/wp-content/uploads/2023/10/Siomai-with-Pork-and-Shrimp-featured-image.jpg"
                    price="$ 120"
                  />
                </View>
                <View style={styles.featureCardWrapper}>
                  <FeatureCard
                    title="Happy Hour"
                    description="50% off drinks from 4-6 PM"
                    imageUrl="https://www.acapulcorestaurants.com/wp-content/uploads/2020/05/happy-hour-min.jpg"
                    price="$ 400"
                  />
                </View>
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
                <View style={styles.cuisinesCardWrapper}>
                  <CuisinesCard
                    name="Indian"
                    imageUrl={require("../assets/Indian.png")}
                  />
                </View>
                <View style={styles.cuisinesCardWrapper}>
                  <CuisinesCard
                    name="Chinese"
                    imageUrl={require("../assets/chinese.png")}
                  />
                </View>
                <View style={styles.cuisinesCardWrapper}>
                  <CuisinesCard
                    name="American"
                    imageUrl={require("../assets/american.png")}
                  />
                </View>
                <View style={styles.cuisinesCardWrapper}>
                  <CuisinesCard
                    name="Filipino"
                    imageUrl={require("../assets/filipino.png")}
                  />
                </View>
                <View style={styles.cuisinesCardWrapper}>
                  <CuisinesCard
                    name="Mediterranean"
                    imageUrl={require("../assets/mediterranean.png")}
                  />
                </View>
              </ScrollView>

              <Text style={[{
                fontFamily: 'PlusJakartaSans-Bold',
                fontSize: 20,
                color: colors.text.primary,
                marginHorizontal: layout.spacing.md,
                marginBottom: layout.spacing.sm
              }]}>
                1000 restaurants to explore
              </Text>
              <TouchableOpacity onPress={handleDetail}>
                <RestaurantCard
                  name="The Bistro"
                  rating="4.5"
                  address="123 Fake Street, Vancouver, BC"
                  imageUrl="https://d2w1ef2ao9g8r9.cloudfront.net/otl-images/_1600x1066_crop_center-center_82_line/jonas-jacobsson-1iTKoFJvJ6E-unsplash.jpg"
                  price="$ 100"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDetail}>
                <RestaurantCard
                  name="The Corner Cafe"
                  rating="4.5"
                  address="456 Dummy Avenue, Toronto, ON"
                  imageUrl="https://kaapimachines.com/wp-content/uploads/2023/06/cafe-chain-3-1.png"
                  price="$ 100"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDetail}>
                <RestaurantCard
                  name="The Italian Kitchen"
                  rating="4.5"
                  address="789 Fictitious Road, Montreal, QC"
                  imageUrl="https://italianstreetkitchen.com/au/wp-content/uploads/2021/10/Gamberi-Prawn-Pizza.jpg"
                  price="$ 100"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDetail}>
                <RestaurantCard
                  name="The Sushi Bar"
                  rating="4.5"
                  address="1011 Make-Believe Street, Calgary, AB"
                  imageUrl="https://media-cdn.tripadvisor.com/media/photo-s/1b/01/24/ef/catering.jpg"
                  price="$ 100"
                />
              </TouchableOpacity>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
    height: 50,
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
});

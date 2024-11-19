import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from "react-native";
import ImageView from "react-native-image-viewing";
import { TabBar, TabView } from 'react-native-tab-view';
import TopNav from "../Components/TopNav";
import MenuItems from '../Components/MenuItems';
import { colors } from '../styles/colors';
import PagerView from 'react-native-pager-view';

const CustomHeader = ({ onClose }) => (
  <View style={[styles.topNav, { backgroundColor: "transparent" }]}>
    <TouchableOpacity
      style={styles.backButton}
      onPress={onClose}
      activeOpacity={0.7}
    >
      <Ionicons name="close" size={24} color="#FFFFFF" />
    </TouchableOpacity>
    <View style={styles.placeholder} />
  </View>
);
export default function DetailScreen() {
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'popular', title: 'Popular' },
    { key: 'appetizers', title: 'Appetizers' },
    { key: 'main', title: 'Main' },
  ]);
  const { width } = useWindowDimensions();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const imageHeight = scrollY.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [452, 252, 252],
    extrapolate: "clamp",
  });

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

  const popularItems = [
    {
      name: "Siomai",
      price: "$8.99",
      imageUrl: "https://kaapimachines.com/wp-content/uploads/2023/06/cafe-chain-3-1.png"
    },
    {
      name: "Lumpia",
      price: "$7.99",
      imageUrl: "https://kaapimachines.com/wp-content/uploads/2023/06/cafe-chain-3-1.png"
    },
    {
      name: "Pancit",
      price: "$12.99",
      imageUrl: "https://kaapimachines.com/wp-content/uploads/2023/06/cafe-chain-3-1.png"
    },
    {
      name: "Adobo",
      price: "$14.99",
      imageUrl: "https://kaapimachines.com/wp-content/uploads/2023/06/cafe-chain-3-1.png"
    }
  ];

  const appetizerItems = [
    {
      name: "Calamari",
      price: "$10.99",
      imageUrl: "https://italianstreetkitchen.com/au/wp-content/uploads/2021/10/Gamberi-Prawn-Pizza.jpg"
    },
    {
      name: "Bruschetta",
      price: "$8.99",
      imageUrl: "https://italianstreetkitchen.com/au/wp-content/uploads/2021/10/Gamberi-Prawn-Pizza.jpg"
    },
    {
      name: "Garlic Bread",
      price: "$6.99",
      imageUrl: "https://italianstreetkitchen.com/au/wp-content/uploads/2021/10/Gamberi-Prawn-Pizza.jpg"
    },
    {
      name: "Mozzarella Sticks",
      price: "$9.99",
      imageUrl: "https://italianstreetkitchen.com/au/wp-content/uploads/2021/10/Gamberi-Prawn-Pizza.jpg"
    }
  ];

  const mainItems = [
    {
      name: "Margherita Pizza",
      price: "$16.99",
      imageUrl: "https://d2w1ef2ao9g8r9.cloudfront.net/otl-images/_1600x1066_crop_center-center_82_line/jonas-jacobsson-1iTKoFJvJ6E-unsplash.jpg"
    },
    {
      name: "Pasta Carbonara",
      price: "$15.99",
      imageUrl: "https://d2w1ef2ao9g8r9.cloudfront.net/otl-images/_1600x1066_crop_center-center_82_line/jonas-jacobsson-1iTKoFJvJ6E-unsplash.jpg"
    },
    {
      name: "Lasagna",
      price: "$17.99",
      imageUrl: "https://d2w1ef2ao9g8r9.cloudfront.net/otl-images/_1600x1066_crop_center-center_82_line/jonas-jacobsson-1iTKoFJvJ6E-unsplash.jpg"
    },
    {
      name: "Risotto",
      price: "$18.99",
      imageUrl: "https://d2w1ef2ao9g8r9.cloudfront.net/otl-images/_1600x1066_crop_center-center_82_line/jonas-jacobsson-1iTKoFJvJ6E-unsplash.jpg"
    }
  ];

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'popular':
        return <MenuItems items={popularItems} />;
      case 'appetizers':
        return <MenuItems items={appetizerItems} />;
      case 'main':
        return <MenuItems items={mainItems} />;
      default:
        return null;
    }
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

  return (
    <View style={styles.container}>
      <TopNav handleGoBack={handleGoBack} scrollY={scrollY} />
      <Animated.Image
        source={{
          uri: "https://d2w1ef2ao9g8r9.cloudfront.net/otl-images/_1600x1066_crop_center-center_82_line/jonas-jacobsson-1iTKoFJvJ6E-unsplash.jpg",
        }}
        style={[styles.headerImage, { height: imageHeight }]}
      />
      <ScrollView
        style={styles.scrollView}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        pointerEvents="box-none"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>The Flavorful Fork</Text>
            <View style={styles.rating}>
              <Ionicons name="star" size={14} color="#FFFFFF" />
              <Text style={styles.ratingText}>4.5</Text>
            </View>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Ionicons name="restaurant-outline" size={14} color={colors.primaryText}  />
              <Text style={styles.infoText}>Filipino-Fusion</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={14} color={colors.primaryText} />
              <Text style={styles.infoText}>
                123 Main Street, Toronto, CA
              </Text>
              <Text style={styles.viewMap}>view map</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={14} color={colors.primaryText} />
              <Text style={styles.infoText}>
                Monday-Friday: 11 AM - 9 PM, Saturday-Sunday: 9 AM - 10 PM
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="call-outline" size={14} color={colors.primaryText} />
              <Text style={styles.infoText}>1-800-555-1234</Text>
            </View>
          </View>
          <Text style={styles.description}>
            Discover the perfect blend of traditional Filipino flavors with a
            modern twist at The Flavorful Fork. Our menu features innovative
            dishes that will tantalize your taste buds. From sizzling sisig to
            mouthwatering adobo, we offer a variety of options to satisfy every
            craving.

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
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.bookNowButton} onPress={handleCheckout}>
          <View style={styles.buttonContent}>
            <View style={styles.cartCount}>
              <Text style={styles.cartCountText}>2</Text>
            </View>
            <Text style={styles.bookNowText}>View Cart</Text>
            <Text style={styles.priceText}>$25.99</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  headerImage: {
    width: "100%",
    height: 252,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  menuImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginTop: 16,
  },
  content: {
    marginTop: 252,
    padding: 20,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "700",
    fontSize: 24,
    color: "#1F262C",
  },
  sectionTitle: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 18,
    fontWeight: "600",
    color: "#1F262C",
    marginTop: 20,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3B13C",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "600",
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 4,
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
    fontFamily: "Plus Jakarta Sans",
    fontSize: 14,
    color: "#1F262C",
    marginLeft: 8,
  },
  viewMap: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 12,
    color: colors.primaryText,
    marginLeft: 8,
    textDecorationLine: "underline",
  },
  description: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 14,
    color: "#1F262C",
    lineHeight: 20,
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
  bookNowButton: {
    backgroundColor: colors.primary,
    borderRadius: 32,
    paddingVertical: 16,
    marginBottom: 12,
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
  bookNowText: {
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
});

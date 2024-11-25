import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Image,
  ScrollView,
  Animated,
} from "react-native";
import CuisinesCard from "../Components/CuisinesCard";
import FeatureCard from "../Components/FeatureCard";
import RestaurantCard from "../Components/RestaurantCard";
import SideMenu from "../Components/SideMenu";
import { colors } from '../styles/colors';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);
  const navigation = useNavigation();
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [isDineIn, setIsDineIn] = useState(true);
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
  const headerGap = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [16, 0],
    extrapolate: 'clamp'
  });

  const toggleSideMenu = useCallback(() => {
    if (isSideMenuOpen) {
      closeSideMenu();
    } else {
      setIsSideMenuOpen(true);
      setIsSideMenuVisible(true);
    }
  }, [isSideMenuOpen]);

  const closeSideMenu = useCallback(() => {
    setIsSideMenuOpen(false);
    setTimeout(() => {
      setIsSideMenuVisible(false);
    }, 500);
  }, []);

  const handleDetail = () => {
    navigation.navigate("Detail");
  };
  const handleGrabAndGo = () => {
    setIsDineIn(!isDineIn);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Animated.View style={[styles.header, { gap: headerGap }]}>
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.menuButton} onPress={toggleSideMenu}>
            <Ionicons name="menu" size={24} color="#1F262C" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image source={require("../assets/logo-text-orange.png")} style={styles.logo} />
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <View style={{ width: 24, height: 24 }} />
          </TouchableOpacity>
        </View>

        <Animated.View style={[
          styles.searchContainer,
          {
            height: searchHeight,
            opacity: searchOpacity,
            marginBottom: 0
          }
        ]}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for restaurants"
            placeholderTextColor="#C4C4C4"
          />
          <Ionicons
            name="search"
            size={15}
            color="#C4C4C4"
            style={styles.searchIcon}
          />
        </Animated.View>
        <View style={styles.switchContainer}>
          <TouchableOpacity 
            style={isDineIn ? styles.switchButtonActive : styles.switchButton}
            onPress={handleGrabAndGo}
          >
            <Text style={isDineIn ? styles.switchButtonTextActive : styles.switchButtonText}>Dine In</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={!isDineIn ? styles.switchButtonActive : styles.switchButton}
            onPress={handleGrabAndGo}
          >
            <Text style={!isDineIn ? styles.switchButtonTextActive : styles.switchButtonText}>Grab & Go</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView 
        style={styles.resultsContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.resultsContentContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.scrollContent}>
          <Text style={styles.sectionTitle}>FEATURED OFFERS</Text>
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

          <Text style={styles.sectionTitle}>EXPLORE CRAVINGS</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.cuisinesContainer}
            contentContainerStyle={styles.cuisinesContentContainer}
          >
            <View style={styles.cuisinesCardWrapper}>
              <CuisinesCard
                name="Indian"
                imageUrl="https://s3-alpha-sig.figma.com/img/cfe8/f85b/00be0c7c8ad7d7076e528af6d65ffe04?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=WvVHOF2OsTVRRsa7lOp2uqyLHvrmvqF6gg9FARaS4sPKRXG77UeIP-knCf0z~gJ1Ps9bFoFg7VVzSOPQsg5-u2pIfTpqCYbW~Me3LqDfomXp2KR-4O-PeDbgKWNN41e9R0I5YH4K~yCrLRQMgb2HyXa1cUJuHW1pbuSuqP5F-DgcvqnebNyLLDI2p1SRiIqoVE8r4hbZRn68T81rzwxEhDWPAqe-tKYtBQVJCNh0TBG5p7sJ3QD7LsICCHnpfNGe71OcqG3cXizpXrHSM3SSz3Q8tCvK80xFVNSrKCPsxdW3nh1pNzZVLHaqOVtkg7boPxvDeAHG8RJiQoXJp~Zwkg__"
              />
            </View>
            <View style={styles.cuisinesCardWrapper}>
              <CuisinesCard
                name="Chinese"
                imageUrl="https://s3-alpha-sig.figma.com/img/67c7/b553/a25e7a55735ed7c98d2ca2c8b67a0703?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Odzbp-uSaSGztF1O9kFqgM1MV7pJz9dSVBcg2Sm1M3svSTppSyJPKIx~LLalUulkppGXEjBxDno-pYO1BvdXyK3X7Gpz-JujPoGgTUfINAO0bwOv1l2JyDXAXqJM-lvUXX2kMNpJn6A0Dv33HMndhJpMN5gsqRcuVXQehJezdVVzVoHgKw7sLf9mHWPdsAAK~k9hZlGzgLmtWXfIoDPxicOiCmaEyITZm-TOr8EAHqCuPIB5q7PskyONJ8m13qistDmISfdTTUM4DmFhLEKrBC-YKv~Aw8KQgCA5yXSYCKXXzO5HKRTcXsZ3wspaM6WB9QM4mxVMLeeGq9JyhyAlOA__"
              />
            </View>
            <View style={styles.cuisinesCardWrapper}>
              <CuisinesCard
                name="American"
                imageUrl="https://s3-alpha-sig.figma.com/img/38c2/6b1e/2cdced7bc539af586ed5d633368589b5?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ca2P3J1d2QOVg-8LEv4nn3b34pphEhW68SqqQW7fNuQGa4G6iK~SeCLSo8gYxSOxq7bANXX94lklSXpkssank-wJ93w0AYEpKjrE9LxBiikRe8Mvo7S~hHKX1uz1N2haxGm9torFH1OTrBeTR4cqgrwUyPdKppY7oO6FWE0I7Hevto0CWh~KXF2NIkoQvlgAnoUyhm0vxLbLXmwwmhveEaagD5QaZA3j--lSsHiHaTDbfZ0ZQWlvMWMGdNNxunXfZVSTx4jasML2NexjgcHyCsKtXBA-dR-NbRn0oRZ1pbB19daTyrhbhl1gZWJC~jCEHScuwfMwWmcnGGJWBFhvgg__"
              />
            </View>
            <View style={styles.cuisinesCardWrapper}>
              <CuisinesCard
                name="Filipino"
                imageUrl="https://s3-alpha-sig.figma.com/img/c9ae/a660/3824cdce919e8d5b705938992bd15f8e?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=HT0HhBJHc2F5bKTTYzhwKNnJ~7SbF8IelONEWEdP7vCGKTkyOslN0CJLUl4GdlhgQJ6IMlKwl~y8jv93UAUHDR3WhxZDd2utuFEV~ooP0CS~DS1MguACEs3BElAAjTTwRPzBOTnMDVQ2jVxSbE-MhiRNsKsKraSJQhpSbobB02bt6yea6FRXOTs9E4e0bZbRT9MpZTkNBxVwfotQzvzAYo5gnO-Hdu9jOfffZ61sSRQflCYSb6YUbBM5Pg6LWFnNZo8CQwupAfJHt8qA-ksLSFeKsbFrrku8JsPD5TusXMzkgyqvHaitmV9U~lE1aGPkeCN0RDFj9CDeGAJPqMEhTw__"
              />
            </View>
            <View style={styles.cuisinesCardWrapper}>
              <CuisinesCard
                name="Mediterranean"
                imageUrl="https://s3-alpha-sig.figma.com/img/1ebc/686d/2d1fe8c3b5246f1ef58af7165a970e27?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hbC14ruU6DULBE6RmT~RnSebPToVPmV80duItJKSOK9D~CwzVyxG9OG5Z-QHTPnr0ejBFaz9JpBXwwURRQJpES7KWfBtjONClz7fQg9uJtD7sVLuybws9~LSNSo4Paj1Y85HlZ-aHZXdhiLRihWnRFhW8Bgj-PWm~lxcrntPSOk40JilZqYsVTYTTAXFUayM0GtG5Ba7aGCSgYt2wHjbhyfEBSKIXD5NpTMFLjJVVKMFQpT0nZ-0PpSD-pnLFnUsXhLlhdZFgM8skU29VKGM9fLSudPC564nv8zaBboryBG5wdz7-2aPUUtNn2fydO-oyCCM1CEGxiI6TRRmSUollg__"
              />
            </View>
          </ScrollView>

          <Text style={styles.sectionTitle}>1000 restaurants to explore</Text>
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
      </Animated.ScrollView>
      {isSideMenuVisible && (
        <SideMenu
          isOpen={isSideMenuOpen}
          onClose={closeSideMenu}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    backgroundColor: colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: -1,
  },
  logo: {
    height: 30,
    width: 120,
    resizeMode: 'contain',
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    paddingLeft: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    overflow: 'hidden',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontFamily: "Plus Jakarta Sans",
    fontSize: 14,
    color: "#888888",
    opacity: 0.75,
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  resultsContentContainer: {
    paddingTop: 16,
  },
  sectionTitle: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 16,
    fontWeight: "600",
    color: "#1F262C",
    marginBottom: 10,
    marginTop: 10,
  },
  featuredTitle: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 16,
    fontWeight: "600",
    color: "#1F262C",
    marginTop: 20,
  },
  featuresContainer: {
    marginLeft: -20,
    marginRight: -20, 
  },
  featuresContentContainer: {
    paddingLeft: 20,
    paddingRight: 0, 
  },
  featureCardWrapper: {
    marginRight: 5, 
    width: 160,
  },

  cuisinesContainer: {
    marginLeft: -20,
    marginRight: -20, 
  },
  cuisinesContentContainer: {
    paddingLeft: 20,
    paddingRight: 0, 
  },
  cuisinesCardWrapper: {
    marginRight: 5, 
    width: 100,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  switchButton: {
    width: '48%',
    height: 40,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '1%',
  },
  switchButtonText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryText,
  },
  switchButtonActive: {
    width: '48%',
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '1%',
  },
  switchButtonTextActive: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
});

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import CuisinesCard from "../Components/CuisinesCard";
import FeatureCard from "../Components/FeatureCard";
import RestaurantCard from "../Components/RestaurantCard";
import SideMenu from "../Components/SideMenu";
import { colors } from '../styles/colors';
export default function HomeScreen() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);
  const navigation = useNavigation();

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
    const onAnimationComplete = () => {
      setIsSideMenuVisible(false);
    };
    return onAnimationComplete;
  }, []);

  const handleDetail = () => {
    navigation.navigate("Detail");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleSideMenu}>
          <Ionicons name="menu" size={24} color="#1F262C" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
        </View>
        <TouchableOpacity style={styles.accountButton}>
          <Image
            source={require("../assets/user.svg")}
            style={styles.accountIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Restaurant, Cuisine, Location ..."
            placeholderTextColor="#888888"
          />
          <Ionicons
            name="search-outline"
            size={15}
            color="#C4C4C4"
            style={styles.searchIcon}
          />
        </View>
      </View>
      <ScrollView 
        style={styles.resultsContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.resultsContentContainer}
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
                price="$ 200"
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
      </ScrollView>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 60,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: "#1F262C",
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 50,
    resizeMode: "contain",
  },
  menuButton: {
    padding: 10,
    width: 44,
  },
  accountButton: {
    width: 44,
    alignItems: "center",
  },
  searchWrapper: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    paddingLeft: 12,
    paddingRight: 12,
    height: 44,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: "rgba(31, 38, 44, 0.14)",
    borderRadius: 10,
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
  filterButton: {
    marginLeft: 10,
    padding: 10,
  },
  filterButtonText: {
    fontSize: 20,
  },
  resultsContainer: {
    flex: 1,
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
  sideMenu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "#FFFFFF",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#1F262C",
  },
  menuItem: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 16,
    color: "#1F262C",
    marginBottom: 20,
  },
  featuresContainer: {
    marginLeft: -20,
    marginRight: -20, // Add negative margin on the right
  },
  featuresContentContainer: {
    paddingLeft: 20,
    paddingRight: 0, // Remove right padding
  },
  featureCardWrapper: {
    marginRight: 5, // Add margin to create space between cards
    width: 160,
  },

  cuisinesContainer: {
    marginLeft: -20,
    marginRight: -20, // Add negative margin on the right
  },
  cuisinesContentContainer: {
    paddingLeft: 20,
    paddingRight: 0, // Remove right padding
  },
  cuisinesCardWrapper: {
    marginRight: 5, // Add margin to create space between cards
    width: 100,
  },
  resultsContentContainer: {
    paddingBottom: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
});

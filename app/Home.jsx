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
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
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
                imageUrl="https://s3-alpha-sig.figma.com/img/cfe8/f85b/00be0c7c8ad7d7076e528af6d65ffe04?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=KUBoMFJ7uTga4aM4QdHGc9z7iERtdWRUtFtdL6LOmDo9GaoMdcxcVg3A0r35K4jQjIRn8-PH94Db973OVJUNv4e7JseZ9ujWoMGqlNZcERB~zFf5UK351MoUMtGJRusEyku-6dkgT8dFOBUlNrMEN-mg9GZPDlO83q8-iU8Dqkk352T03Qhwpqkm~tU4X6~kDYicYXqYFN9IZ1AIYni7h~a9MAejfNZbGOoiX6ycKgIYdOMHoEEs4bm3yihcPq~so4RS69WP2xc8ZoVvFa6eScuoFOGGdk9hHek4niiOlw3m0mB8MPkTQu7N7gyXLfkvjAS7zlBjzpOMJPzaKYNRMQ__"
              />
            </View>
            <View style={styles.cuisinesCardWrapper}>
              <CuisinesCard
                name="Chinese"
                imageUrl="https://s3-alpha-sig.figma.com/img/67c7/b553/a25e7a55735ed7c98d2ca2c8b67a0703?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=SbOwuXgrImIpyFag0V5PirxIp-q6QIvMyQrUQPnDyZwsktCP6ygiviQckIclL1mrCA-mS9LFoXY84fkMQ3e2onHjphx79IPqrNgtnmrSDEzNrpQqWCLmvp5deNMCwV6wOiQExXqDOOhwo2BD3Y1Hud4jTVAxWNLBHqpxpCj9ngYoBK2HuJkkagdjATRyCgYB6D6aKukSmVUXbeJ0CRjDtbhshEHwYzuHH-DkFidjGqY1EV3SxjXP2fFr4tdHmAcD8eDcg2YGI2ULg~0W51WszI3GRkFfXMRb7AMzY8Wpb1R80cVBXoTcHMSssi41Q87bt7aDgmC6OOCBUq1gS0-wyg__"
              />
            </View>
            <View style={styles.cuisinesCardWrapper}>
              <CuisinesCard
                name="American"
                imageUrl="https://s3-alpha-sig.figma.com/img/38c2/6b1e/2cdced7bc539af586ed5d633368589b5?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=U5vOS0lrM31nPi1HpftQTgO7-9MEX5zKg0UJYU3ur5BcDh~YIFtvAz-kFt-AN7z~ccmPl5hPYeci2RB2e5badrYBJvUqKYnrUuZiBoVDSzfnkYumuYUwXB5tnRUM9flgiD3hzGLKRM4wDI9gOs3AHpUip3TzrVrihPjEigIcEb53C6HsPtzn-YH3qkjR9b2fZdSyHMs-~3zKBIvadHRqLi-YdjfuY5T6D7RLzjMmmO9C6z~~rdCm08fovmFnBTU5qrBNisxxH86qriBAN7mlpvKAiGscl6oqxQHK9sAXJpBjxL6K3qSBk5LfJtjl1V1js3SQOYIHmG8UZfLNDNNaSA__"
              />
            </View>
            <View style={styles.cuisinesCardWrapper}>
              <CuisinesCard
                name="Filipino"
                imageUrl="https://s3-alpha-sig.figma.com/img/c9ae/a660/3824cdce919e8d5b705938992bd15f8e?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=G8QcLyOIedSPN-4b3RQj7Yl2ANSTNX~hq8r12jZaSJl8x~lKJgGxiw-xOk9WseSkjZKLoRiK-2isEkXvVN~ZcTi0RXz5~RsN2OfrEwYSjTFst0EKShMviPUU0tDZrrvtjvmHirvvXUe4ZHdrqro6AgMtXoTbHKUk-~n1JWTOoGa90MSWXkBu4JUMjAPEb-1uusJbiJyWVCiQT2YPFqUe30yNQYtqX59qx~5t03K3mDFQmtXt-FJqBehC64VNQYptt7qT5V7nmDd~N8XCCTeiNe2CD5HS-JNHw8PE3JOgX7-Y61aVfyl9CUHvJCQ6ExgLKbYgtaju8L2tuT7m6WbB~g__"
              />
            </View>
            <View style={styles.cuisinesCardWrapper}>
              <CuisinesCard
                name="Mediterranean"
                imageUrl="https://s3-alpha-sig.figma.com/img/1ebc/686d/2d1fe8c3b5246f1ef58af7165a970e27?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=iW1M6H0c0BrbUqNR2mu1sPNLIFMdFFDH-TJO07cSelMWrLBezlPiC5mgRFnVp8d906dE0mZR96Prtjh80hy8-AJRyIxomxXau0NJBhZSVETEsOoxDlSxTW2HuWZ5DBVJ6B-glIQ~YZbakABNQrJEHwW25o5CHfHy3oT6vPuOAZ0Tj1NoCJIg3TaV6GlTwCA0VTKnPiutdoZOL3QIgFyDDlUw75xJZeEc~fJZcdp~EN4P1zQRB7Aw7NmqURJQVGXYgz9LQ5AAZwXEW4pHo~xhZQjtClM3czbnI~fT64EgYZxsoO2mSRvfVnFHpdEl1NVkF6HriBaQ2~iiV7UtuOz8ew__"
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
    backgroundColor: "#F3FBFF",
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
  logo: {
    width: 100,
    height: 50,
    resizeMode: "contain",
  },
  menuButton: {
    padding: 10,
  },
  menuButtonText: {
    fontSize: 24,
    color: "#1F262C",
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
    backgroundColor: "#F3FBFF",
    borderWidth: 1,
    borderColor: "rgba(31, 38, 44, 0.14)",
    borderRadius: 40,
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

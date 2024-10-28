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
} from "react-native";
import ImageView from "react-native-image-viewing";

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
  const [showFullImage, setShowFullImage] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const imageHeight = scrollY.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [552, 352, 352],
    extrapolate: "clamp",
  });

  const handleCheckout = () => {
    navigation.navigate("Checkout");
  };

  const toggleFullImage = () => {
    setShowFullImage(!showFullImage);
  };

  const images = [
    {
      uri: "https://s3-alpha-sig.figma.com/img/20fc/e656/8ae7b68095a4d524fbca4ccea6841645?Expires=1731283200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=DTbgg-21pPIWn9tGhAkaJGMKxy7l3gO8FzhR3szV1d349RSkaJCTW9SqpT1aAHL34weL53QaADuxnD1DgAqEqmLhHJytGI9I6z~BEJSofaWkJxva53nIAaSZa5odGsQpsAlWVVnEm9neDihqdormNgSRmdgWz1g0dSY1EVYL6XXjKUUdQ0ILm53LELAkLw4qF2OTQLOXQq6szLD6iwiZJqFgQuoeB5V9jQ5hrucsrKfgof382~R6Qtjo14dbne0nE-Y4BxODnppMI84o7thkQ-jUB1i-k~Ojs7eEoKimMBKjZJ9mdOmxoKnkot8QSExAxpVQYNTjVwhH-AjBPqVZVA__",
    },
  ];

  const handleImageViewerClose = () => {
    setImageViewerVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.placeholder} />
      </View>
      <Animated.Image
        source={{
          uri: "https://d2w1ef2ao9g8r9.cloudfront.net/otl-images/_1600x1066_crop_center-center_82_line/jonas-jacobsson-1iTKoFJvJ6E-unsplash.jpg",
        }}
        style={[styles.headerImage, { height: imageHeight }]}
      />
      <ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
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
              <Ionicons name="restaurant-outline" size={14} color="#B75A4B" />
              <Text style={styles.infoText}>Filipino-Fusion</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={14} color="#B75A4B" />
              <Text styxxle={styles.infoText}>
                123 Main Street, Toronto, CA
              </Text>
              <Text style={styles.viewMap}>view map</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={14} color="#B75A4B" />
              <Text style={styles.infoText}>
                Monday-Friday: 11 AM - 9 PM, Saturday-Sunday: 9 AM - 10 PM
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="call-outline" size={14} color="#B75A4B" />
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
          <Text style={styles.sectionTitle}>Menu</Text>
          <TouchableOpacity onPress={() => setImageViewerVisible(true)}>
            {imageLoading && (
              <View 
                style={{
                  width: '100%',
                  height: 200,
                  borderRadius: 16,
                  backgroundColor: '#E1E9EE',
                  marginTop: 16,
                  position: 'absolute'
                }}
              />
            )}
            <Image 
              source={{ uri: images[0].uri }} 
              style={styles.menuImage}
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
            />
          </TouchableOpacity>
          <ImageView
            images={images}
            imageIndex={0}
            visible={imageViewerVisible}
            swipeToCloseEnabled={true}
            doubleTapToZoomEnabled={true}
            onRequestClose={handleImageViewerClose}
            HeaderComponent={() => (
              <CustomHeader onClose={handleImageViewerClose} />
            )}
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.quantityButton}>
            <Ionicons name="remove" size={24} color="#1F262C" />
          </TouchableOpacity>
          <Text style={styles.quantity}>4</Text>
          <TouchableOpacity style={styles.quantityButton}>
            <Ionicons name="add" size={24} color="#1F262C" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.bookNowButton} onPress={handleCheckout}>
          <Text style={styles.bookNowText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3FBFF",
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
    height: 352,
    borderRadius: 16,
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
    marginTop: 352,
    padding: 20,
    backgroundColor: "#F3FBFF",
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
    color: "#B75A4B",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(31, 38, 44, 0.14)",
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    padding: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  quantity: {
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "600",
    fontSize: 16,
    color: "#1F262C",
    marginHorizontal: 16,
  },
  bookNowButton: {
    backgroundColor: "#F04647",
    borderRadius: 32,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  bookNowText: {
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "600",
    fontSize: 16,
    color: "#FFFFFF",
  },
});

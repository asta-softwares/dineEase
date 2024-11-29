import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import Footer from './Layout/Footer';
import LargeButton from '../Components/Buttons/LargeButton';

export default function CheckoutScreen() {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#1F262C" />
        </TouchableOpacity>
        <Text style={[typography.h3, styles.topBarTitle]}>Cart</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView>
        {/* Restaurant Information */}
        <Text style={[typography.h3, styles.sectionTitle]}>Restaurant Information</Text>
        <View style={styles.restaurantCard}>
          <Image
            source={{
              uri: "https://d2w1ef2ao9g8r9.cloudfront.net/otl-images/_1600x1066_crop_center-center_82_line/jonas-jacobsson-1iTKoFJvJ6E-unsplash.jpg",
            }}
            style={styles.restaurantImage}
          />
          <View style={styles.restaurantInfo}>
            <View style={styles.restaurantTextContainer}>
              <Text style={[typography.labelLarge, styles.restaurantName]}>4 x The Flavorful Fork</Text>
              <Text style={[typography.bodyMedium, styles.restaurantAddress]}>
                123 Main Street, Toronto, CA
              </Text>
            </View>
            <Text style={[typography.labelLarge, styles.price]}>$ 25.00</Text>
          </View>
        </View>

        {/* Details Transaction */}
        <Text style={[typography.h3, styles.sectionTitle]}>Details Transaction</Text>
        <View style={styles.detailsList}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Total Bill</Text>
            <Text style={styles.detailValue}>$ 25.00 x 4</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Discount</Text>
            <Text style={styles.detailValue}>$ 0.00</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Tax 13%</Text>
            <Text style={styles.detailValue}>$ 0.00</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, styles.totalPrice]}>
              Total Price
            </Text>
            <Text style={[styles.detailValue, styles.price]}>
              $ 100.00
            </Text>
          </View>
        </View>

        {/* Guest Information */}
        <Text style={[typography.h3, styles.sectionTitle]}>Guest Information</Text>
        <View style={styles.guestInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>Albert Stevano</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Phone No.</Text>
            <Text style={styles.infoValue}>+12 8347 2838 28</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>New York</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>House No.</Text>
            <Text style={styles.infoValue}>BC54 Berlin</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>City</Text>
            <Text style={styles.infoValue}>New York City</Text>
          </View>
        </View>
      </ScrollView>
      <Footer>
        <LargeButton 
          title="Pay Now"
          price="25.00"
          onPress={() => navigation.navigate('Payment')}
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
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    padding: 8,
  },
  topBarTitle: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 18,
    fontWeight: '500',
    color: "#1F262C",
  },
  placeholder: {
    width: 40,
  },
  sectionTitle: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 14,
    fontWeight: "600",
    color: "#1F262C",
    marginHorizontal: 20,
    marginTop: 20,
  },
  restaurantCard: {
    flexDirection: "row",
    margin: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
  restaurantImage: {
    width: 168,
    height: 149,
    borderRadius: 8,
  },
  restaurantInfo: {
    marginLeft: 15,
    flex: 1,
    justifyContent: "space-between",
  },
  restaurantTextContainer: {
    gap: 4,
  },
  restaurantName: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 14,
    fontWeight: "600",
    color: "#1F262C",
  },
  restaurantAddress: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 10,
    color: "#878787",
  },
  price: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary,
  },
  detailsList: {
    margin: 20,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  detailLabel: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 12,
    color: "#878787",
  },
  detailValue: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 12,
    color: "#1F262C",
  },
  totalPrice: {
    fontWeight: "600",
  },
  guestInfo: {
    margin: 20,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  infoLabel: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 12,
    color: "#878787",
  },
  infoValue: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 12,
    color: "#1F262C",
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    width: 39,
    height: 21,
    marginRight: 9,
  },
  cardNumber: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 12,
    color: "#878787",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(31, 38, 44, 0.14)",
    marginBottom: 20,
  },
  footerLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  footerLabel: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 14,
    fontWeight: "600",
    color: "#1F262C",
   
  },
  footerPaymentMethod: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  payNowButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  payNowText: {
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "600",
    fontSize: 16,
    color: "#FFFFFF",
  },
});

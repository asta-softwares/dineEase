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
        <Text style={styles.topBarTitle}>Payment</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView>
        {/* Restaurant Information */}
        <Text style={styles.sectionTitle}>Restaurant Information</Text>
        <View style={styles.restaurantCard}>
          <Image
            source={{
              uri: "https://d2w1ef2ao9g8r9.cloudfront.net/otl-images/_1600x1066_crop_center-center_82_line/jonas-jacobsson-1iTKoFJvJ6E-unsplash.jpg",
            }}
            style={styles.restaurantImage}
          />
          <View style={styles.restaurantInfo}>
            <View style={styles.restaurantTextContainer}>
              <Text style={styles.restaurantName}>4 x The Flavorful Fork</Text>
              <Text style={styles.restaurantAddress}>
                123 Main Street, Toronto, CA
              </Text>
            </View>
            <Text style={styles.price}>$ 25.00</Text>
          </View>
        </View>

        {/* Details Transaction */}
        <Text style={styles.sectionTitle}>Details Transaction</Text>
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
            <Text style={[styles.detailValue, styles.totalPriceValue]}>
              $ 100.00
            </Text>
          </View>
        </View>

        {/* Guest Information */}
        <Text style={styles.sectionTitle}>Guest Information</Text>
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

      <View style={styles.footer}>
        <View style={styles.footerLabels}>
          <Text style={styles.footerLabel}>Payment Method</Text>
          <Text style={styles.footerLabel}>Total</Text>
        </View>
        <View style={styles.footerPaymentMethod}>
          <View style={styles.cardInfo}>
            <Image
              source={{
                uri: "https://s3-alpha-sig.figma.com/img/6d20/f4f7/3d0e20904fc946f18c6d4bb3e68ec4b0?Expires=1731283200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Y4sHxQmZwDGOFadJFXtBhgQ4BCK-bJJbr2Ov5Wo1OoYCtnDJP3I7bUfaSTZiiN4NKhaIA5rk0hsf2DgldAQIRJhnKIrPrzSIHwuihcnNzPPYjT83pReciMw636DFISYmsACIHSXYPmJdSKLDyyKDnepPmcgcHoZDbct9LrhUWAmlrzS-Cw81CQtwp4o3IqO6~8PzQJvoMmG0hu3uQFbIGGC9FZlE~QRKVrm1xcWFB3G6-A5c1g1XbJfWl3hNtgk~qkriQyZqdKwVECEIFCMl0dERore7vSrGQBEy9KE02x2v7jxX830KcgkKsAQdlIlMs6Z8cehltWiZYS7NyvVPaQ__",
              }}
              style={styles.cardIcon}
            />
            <Text style={styles.cardNumber}>**** **** **** 1234</Text>
          </View>
          <Text style={styles.paymentAmount}>$ 100.00</Text>
        </View>
        <TouchableOpacity style={styles.payNowButton}>
          <Text style={styles.payNowText}>Pay Now</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    fontSize: 16,
    fontWeight: "600",
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
    color: "#B75A4B",
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
  totalPriceValue: {
    color: "#B75A4B",
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
  paymentAmount: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 12,
    fontWeight: "700",
    color: "#B75A4B",
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
    backgroundColor: "#F04647",
    borderRadius: 32,
    paddingVertical: 12,
    alignItems: "center",
    width: "100%",
  },
  payNowText: {
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "600",
    fontSize: 16,
    color: "#FFFFFF",
  },
});

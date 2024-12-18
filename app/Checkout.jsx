import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopNav from '../Components/TopNav';
import { colors } from '../styles/colors';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { typography } from '../styles/typography';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import Footer from './Layout/Footer';
import LargeButton from '../Components/Buttons/LargeButton';

const CheckoutScreen = ({ navigation }) => {
  const handleGoBack = () => {
    navigation.goBack();
  };

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View style={styles.container}>
      <TopNav 
        handleGoBack={handleGoBack} 
        title="Checkout" 
        variant="solid" 
        scrollY={scrollY}
      />
      <Animated.ScrollView 
        style={styles.content}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View style={styles.section}>
          <Text style={[typography.h3, { color: colors.text.primary, marginBottom: 16 }]}>
            Restaurant Information
          </Text>
          
          <View style={styles.restaurantCard}>
            <Image
              source={{
                uri: "https://d2w1ef2ao9g8r9.cloudfront.net/otl-images/_1600x1066_crop_center-center_82_line/jonas-jacobsson-1iTKoFJvJ6E-unsplash.jpg",
              }}
              style={styles.restaurantImage}
            />
            <View style={styles.restaurantInfo}>
              <View style={styles.restaurantTextContainer}>
                <Text style={[typography.labelLarge, { color: colors.text.primary }]}>
                  4 x The Flavorful Fork
                </Text>
                <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>
                  123 Main Street, Toronto, CA
                </Text>
              </View>
              <Text style={[typography.labelLarge, { color: colors.text.primary }]}>$ 25.00</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[typography.h3, { color: colors.text.primary, marginBottom: 16 }]}>
            Details Transaction
          </Text>
          
          <View style={styles.detailsList}>
            <View style={styles.detailItem}>
              <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>Total Bill</Text>
              <Text style={[typography.bodyLarge, { color: colors.text.primary }]}>$ 25.00 x 4</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>Discount</Text>
              <Text style={[typography.bodyLarge, { color: colors.text.primary }]}>$ 0.00</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>Tax 13%</Text>
              <Text style={[typography.bodyLarge, { color: colors.text.primary }]}>$ 0.00</Text>
            </View>
            
            <View style={[styles.detailItem, styles.totalItem]}>
              <Text style={[typography.h3, { color: colors.text.primary }]}>Total Price</Text>
              <Text style={[typography.h3, { color: colors.text.primary }]}>$ 100.00</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[typography.h3, { color: colors.text.primary, marginBottom: 16 }]}>
            Guest Information
          </Text>
          
          <View style={styles.guestInfo}>
            <View style={styles.infoItem}>
              <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>Name</Text>
              <Text style={[typography.bodyLarge, { color: colors.text.primary }]}>Albert Stevano</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>Phone No.</Text>
              <Text style={[typography.bodyLarge, { color: colors.text.primary }]}>+12 8347 2838 28</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>Address</Text>
              <Text style={[typography.bodyLarge, { color: colors.text.primary }]}>New York</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>House No.</Text>
              <Text style={[typography.bodyLarge, { color: colors.text.primary }]}>BC54 Berlin</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>City</Text>
              <Text style={[typography.bodyLarge, { color: colors.text.primary }]}>New York City</Text>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
      <Footer>
        <LargeButton 
          title="Pay Now"
          price="25.00"
          onPress={() => navigation.navigate('Home')}
        />
      </Footer>
    </View>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
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
  detailsList: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalItem: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  guestInfo: {
    margin: 20,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
});

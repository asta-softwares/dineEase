import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useRef } from 'react';
import { Animated, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DetailScreen() {
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleGoBack = () => {
    navigation.goBack();
  };

  const imageHeight = scrollY.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [552, 352, 352],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Animated.Image
        source={{ uri: 'https://www.upmenu.com/wp-content/uploads/2022/07/4-what-is-a-bistro-example-of-a-bistro.jpg' }}
        style={[styles.image, { height: imageHeight }]}
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
              <Text style={styles.infoText}>123 Main Street, Toronto, CA</Text>
              <Text style={styles.viewMap}>view map</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={14} color="#B75A4B" />
              <Text style={styles.infoText}>Monday-Friday: 11 AM - 9 PM, Saturday-Sunday: 9 AM - 10 PM</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="call-outline" size={14} color="#B75A4B" />
              <Text style={styles.infoText}>1-800-555-1234</Text>
            </View>
          </View>
          <Text style={styles.description}>
            Discover the perfect blend of traditional Filipino flavors with a modern twist at The Flavorful Fork. Our menu features innovative dishes that will tantalize your taste buds. From sizzling sisig to mouthwatering adobo, we offer a variety of options to satisfy every craving.
          </Text>
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
        <TouchableOpacity style={styles.bookNowButton}>
          <Text style={styles.bookNowText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3FBFF',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: 352,
    borderRadius: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  content: {
    marginTop: 352,
    padding: 20,
    backgroundColor: '#F3FBFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '700',
    fontSize: 24,
    color: '#1F262C',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3B13C',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '600',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  infoContainer: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    color: '#1F262C',
    marginLeft: 8,
  },
  viewMap: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    color: '#B75A4B',
    marginLeft: 8,
    textDecorationLine: 'underline',
  },
  description: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    color: '#1F262C',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(31, 38, 44, 0.14)',
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  quantity: {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '600',
    fontSize: 16,
    color: '#1F262C',
    marginHorizontal: 16,
  },
  bookNowButton: {
    backgroundColor: '#F04647',
    borderRadius: 32,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  bookNowText: {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

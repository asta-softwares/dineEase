import Ionicons from '@expo/vector-icons/Ionicons';
import PropTypes from 'prop-types';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

const RestaurantCard = ({ name, rating, address, imageUrl, price }) => (
  <View style={styles.restaurantCard}>
    <View style={styles.imageContainer}>
      <Image source={{ uri: imageUrl }} style={styles.restaurantImage} />
      <View style={styles.rating}>
        <Ionicons name="star" size={14} color="#FFFFFF" />
        <Text style={[typography.labelMedium, styles.ratingText]}>{rating}</Text>
      </View>
    </View>
    <View style={styles.restaurantInfo}>
      <View style={styles.nameAndPriceContainer}>
        <Text style={[typography.labelLarge, styles.restaurantName]}>{name}</Text>
        <Text style={[typography.bodyMedium, styles.restaurantPrice]}>{price} / per person</Text>
      </View>
      <View style={styles.addressContainer}>
        <Text style={[typography.bodyMedium, styles.restaurantAddress]}>{address}</Text>
      </View>
    </View>
  </View>
);

RestaurantCard.propTypes = {
  name: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  restaurantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  imageContainer: {
    position: 'relative',
  },
  restaurantImage: {
    width: '100%',
    height: 155,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  rating: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#F3B13C',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
  },
  restaurantInfo: {
    padding: 10,
  },
  nameAndPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  restaurantName: {
    // fontFamily: 'Plus Jakarta Sans',
    // fontSize: 14,
    // fontWeight: '500',
    // color: '#1F262C',
  },
  restaurantPrice: {
    // fontFamily: 'Plus Jakarta Sans',
    // fontSize: 14,
    // fontWeight: '500',
    // color: '#1F262C',
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantAddress: {
    // fontFamily: 'Inter',
    // fontSize: 8,
    // color: '#C4C4C4',
  },
});

export default RestaurantCard;

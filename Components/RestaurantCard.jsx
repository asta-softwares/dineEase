import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import PropTypes from 'prop-types';

const RestaurantCard = ({ name, rating, address, imageUrl }) => (
  <View style={styles.restaurantCard}>
    <Image source={{ uri: imageUrl }} style={styles.restaurantImage} />
    <View style={styles.restaurantInfo}>
      <View style={styles.nameRating}>
        <Text style={styles.restaurantName}>{name}</Text>
        <View style={styles.rating}>
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
      </View>
      <Text style={styles.restaurantAddress}>{address}</Text>
    </View>
  </View>
);

RestaurantCard.propTypes = {
  name: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  restaurantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantImage: {
    width: '100%',
    height: 155,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  restaurantInfo: {
    padding: 10,
  },
  nameRating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  restaurantName: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '500',
    color: '#1F262C',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: 'Inter',
    fontSize: 8,
    color: '#878787',
  },
  restaurantAddress: {
    fontFamily: 'Inter',
    fontSize: 8,
    color: '#C4C4C4',
  },
});

export default RestaurantCard;


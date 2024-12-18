import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { layout } from '../styles/layout';

const RestaurantCard = ({ 
  name, 
  rating, 
  address, 
  imageUrl, 
  price, 
  style = {} 
}) => (
  <View style={styles.cardWrapper}>
    <View style={[styles.restaurantCard, style]}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.restaurantImage} />
        <View style={styles.rating}>
          <Ionicons name="star" size={14} color={colors.white} />
          <Text style={[typography.labelMedium, styles.ratingText]}>{rating}</Text>
        </View>
      </View>
      <View style={styles.restaurantInfo}>
        <View style={styles.nameAndPriceContainer}>
          <Text style={[typography.labelLarge, styles.restaurantName]}>{name}</Text>
          {/* <Text style={[typography.bodyMedium, styles.restaurantPrice]}>{price} / per person</Text> */}
        </View>
        <View style={styles.addressContainer}>
          <Text style={[typography.bodyMedium, styles.restaurantAddress]}>{address}</Text>
        </View>
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
  style: PropTypes.object
};

const styles = StyleSheet.create({
  cardWrapper: {
    paddingHorizontal: layout.spacing.md,
    marginBottom: layout.spacing.md,
  },
  restaurantCard: {
    backgroundColor: colors.background,
    borderRadius: layout.card.borderRadius,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  restaurantImage: {
    width: '100%',
    height: 155,
  },
  rating: {
    position: 'absolute',
    top: layout.spacing.sm,
    right: layout.spacing.sm,
    backgroundColor: colors.rating,
    borderRadius: layout.spacing.xs,
    padding: layout.spacing.xs,
    minWidth: 30,
    alignItems: 'center',
    flexDirection: 'row',
    gap: layout.spacing.xs,
  },
  ratingText: {
    color: colors.text.white,
  },
  restaurantInfo: {
    padding: layout.spacing.md,
  },
  nameAndPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.xs,
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default RestaurantCard;

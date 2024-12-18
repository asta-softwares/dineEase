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
  <View style={[styles.cardWrapper, style]}>
    <View style={styles.restaurantCard}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.restaurantImage} />
        <View style={styles.rating}>
          <Ionicons name="star" size={14} color={colors.white} />
          <Text style={[typography.labelMedium, styles.ratingText]}>{rating}</Text>
        </View>
      </View>
      <View style={styles.restaurantInfo}>
        <View style={styles.nameAndPriceContainer}>
          <Text style={[typography.labelLarge, styles.restaurantName]} numberOfLines={1}>{name}</Text>
          {price && (
            <Text style={[typography.bodyMedium, styles.restaurantPrice]}>{price} </Text>
          )}
        </View>
        <View style={styles.addressContainer}>
          <Text style={[typography.bodyMedium, styles.restaurantAddress]} numberOfLines={1}>{address}</Text>
        </View>
      </View>
    </View>
  </View>
);

RestaurantCard.propTypes = {
  name: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  address: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  price: PropTypes.string,
  style: PropTypes.object
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: '100%',
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
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
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
  restaurantName: {
    flex: 1,
    marginRight: layout.spacing.sm,
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantAddress: {
    flex: 1,
  },
});

export default RestaurantCard;

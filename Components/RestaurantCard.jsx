import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { layout } from '../styles/layout';

const RestaurantCard = ({ 
  name, 
  rating, 
  address, 
  imageUrl, 
  price,
  promos = [], 
  style = {} 
}) => {
  const firstPromo = promos?.[0];
  const additionalPromos = promos?.length > 1 ? promos.length - 1 : 0;

  const getPromoText = (promo) => {
    const discount = promo.discount.endsWith('.00') 
      ? promo.discount.split('.')[0] 
      : promo.discount;
      
    if (promo.discount_type === 'percentage') {
      return `${discount}% discount`;
    }
    return `$${discount} discount`;
  };

  return (
    <View style={[styles.cardWrapper, style]}>
      <View style={styles.restaurantCard}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.restaurantImage} />
          <LinearGradient
            colors={colors.gradients.rating}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.rating}
          >
            <Ionicons name="star" size={14} color={colors.white} />
            <Text style={[typography.labelMedium, styles.ratingText]}>{rating}</Text>
          </LinearGradient>
          {firstPromo && (
            <View style={styles.promosContainer}>
              <LinearGradient
                colors={colors.gradients.success}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.promoBadge}
              >
                <View style={styles.promoContainer}>
                  <Text style={styles.promoText} numberOfLines={1}>
                    {firstPromo.name} 
                  </Text>
                  <Text style={styles.promoDiscount}>
                    {getPromoText(firstPromo)}
                  </Text>
                </View>
              </LinearGradient>
              {additionalPromos > 0 && (
                <LinearGradient
                  colors={colors.gradients.success}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.promoBadge, styles.additionalPromoBadge]}
                >
                  <Text style={styles.promoDiscount}>
                    +{additionalPromos} more
                  </Text>
                </LinearGradient>
              )}
            </View>
          )}
        </View>
        <View style={styles.restaurantInfo}>
          <View style={styles.nameAndPriceContainer}>
            <Text style={[typography.labelLarge, styles.restaurantName]} numberOfLines={1}>{name}</Text>
            {price && (
              <Text style={[typography.bodyMedium, styles.restaurantPrice]}>{price}</Text>
            )}
          </View>
          <View style={styles.addressContainer}>
            <Text style={[typography.bodyMedium, styles.restaurantAddress]} numberOfLines={1}>{address}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

RestaurantCard.propTypes = {
  name: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  address: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  price: PropTypes.string,
  promos: PropTypes.array,
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
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,

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
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    color: colors.text.white,
  },
  promosContainer: {
    position: 'absolute',
    bottom: layout.spacing.sm,
    left: layout.spacing.sm,
    gap: 4,
  },
  promoBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  additionalPromoBadge: {
    alignSelf: 'flex-start',
  },
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  promoText: {
    ...typography.labelMedium,
    color: colors.text.white,
    fontSize: 12,
  },
  promoDiscount: {
    ...typography.labelMedium,
    color: colors.text.white,
    fontSize: 12,
    fontWeight: '600',
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
  restaurantPrice: {
    ...typography.bodyMedium,
  },
});

export default RestaurantCard;

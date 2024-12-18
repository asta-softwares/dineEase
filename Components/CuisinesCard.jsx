import PropTypes from 'prop-types';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

const CuisinesCard = ({ name, imageUrl, description }) => {
  return (
    <View style={styles.card}>
      <Image 
        source={typeof imageUrl === 'object' ? imageUrl : { uri: imageUrl }} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text style={[typography.labelMedium, styles.name]} numberOfLines={2}>{name}</Text>
      </View>
    </View>
  );
};

CuisinesCard.propTypes = {
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.oneOfType([
    PropTypes.shape({
      uri: PropTypes.string
    }),
    PropTypes.number
  ]).isRequired,
  description: PropTypes.string
};

const styles = StyleSheet.create({
  card: {
    width: 90,
    height: 115,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 0,
    gap: 4,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  textContainer: {
    width: 90,
    height: 21,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 0,
  },
  name: {
    textAlign: 'center',
    width: '100%',
    color: colors.text.primary
  }
});

export default CuisinesCard;

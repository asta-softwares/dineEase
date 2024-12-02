import PropTypes from 'prop-types';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

const CuisinesCard = ({ name, imageUrl }) => {
  return (
    <View style={styles.card}>
      <Image 
        source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl} 
        style={styles.image} 
      />
      <View style={styles.textContainer}>
        <Text style={[typography.labelMedium, styles.name]}>{name}</Text>
      </View>
    </View>
  );
};

CuisinesCard.propTypes = {
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
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
    resizeMode: 'cover',
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
    width: 90,
    height: 21,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: colors.text.primary,
  },
});

export default CuisinesCard;

import PropTypes from 'prop-types';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const CuisinesCard = ({ name, imageUrl }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
      </View>
    </View>
  );
};

CuisinesCard.propTypes = {
  name: PropTypes.string.isRequired,
  imgUrl: PropTypes.string.isRequired,
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
    fontFamily: 'Plus Jakarta Sans',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 10,
    lineHeight: 21,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: '#111827',
  },
});

export default CuisinesCard;

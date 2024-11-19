import PropTypes from 'prop-types';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { colors } from '../styles/colors';

const MenuItem = ({ name, price, imageUrl }) => {
  return (
    <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.price}>{price}</Text>
      </View>
    </TouchableOpacity>
  );
};

MenuItem.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

const MenuItems = ({ items }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <MenuItem
          key={index}
          name={item.name}
          price={item.price}
          imageUrl={item.imageUrl}
        />
      ))}
    </View>
  );
};

MenuItems.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginTop: 10,
    height: '100%',
  },
  menuItem: {
    width: '50%',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    backgroundColor: '#E1E9EE',
  },
  textContainer: {
    padding: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});

export default MenuItems;
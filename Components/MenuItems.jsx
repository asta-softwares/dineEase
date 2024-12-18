import PropTypes from 'prop-types';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

const MenuItem = ({ name, cost, description, images }) => {
  const imageUrl = images && images.length > 0 
    ? images[0].image 
    : 'https://via.placeholder.com/400';

  return (
    <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text style={[typography.labelLarge, styles.name]}>{name}</Text>
        <Text style={[typography.bodySmall, styles.description]} numberOfLines={2}>{description}</Text>
        <Text style={[typography.bodyMedium, styles.price]}>${cost}</Text>
      </View>
    </TouchableOpacity>
  );
};

MenuItem.propTypes = {
  name: PropTypes.string.isRequired,
  cost: PropTypes.string.isRequired,
  description: PropTypes.string,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      image: PropTypes.string,
      caption: PropTypes.string,
    })
  ),
};

const MenuItems = ({ items }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <MenuItem
          key={item.id}
          name={item.name}
          cost={item.cost}
          description={item.description}
          images={item.images}
        />
      ))}
    </View>
  );
};

MenuItems.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      cost: PropTypes.string.isRequired,
      description: PropTypes.string,
      images: PropTypes.array,
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
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    backgroundColor: '#E1E9EE',
  },
  textContainer: {
    padding: 8,
  },
  name: {
    color: colors.text.primary,
    marginBottom: 4,
  },
  description: {
    color: colors.text.secondary,
    marginBottom: 4,
  },
  price: {
    color: colors.text.secondary,
  },
});

export default MenuItems;
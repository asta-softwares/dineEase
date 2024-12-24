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
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={[typography.labelLarge, styles.name]}>{name}</Text>
          <Text style={[typography.bodySmall, styles.description]} numberOfLines={2}>{description}</Text>
          <Text style={[typography.bodyMedium, styles.price]}>${cost}</Text>
        </View>
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
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
    flex: 1,
    width: '100%',
  },
  menuItem: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  contentContainer: {
    flexDirection: 'row',
    padding: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E1E9EE',
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
    color: colors.primary,
    fontWeight: '600',
  },
});

export default MenuItems;
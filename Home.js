import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SideMenu from './Components/SideMenu';
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

export default function HomeScreen() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const toggleSideMenu = useCallback(() => {
    setIsSideMenuOpen(prevState => !prevState);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleSideMenu}>
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
        <Image
          source={require('./assets/logo.png')}
          style={styles.logo}
        />
        <TouchableOpacity style={styles.accountButton}>
          <Image
            source={require('./assets/user.svg')}
            style={styles.accountIcon}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.tagline}>Save More, Spend Less</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Restaurant, Cuisine, Location ..."
          placeholderTextColor="#888888"
        />
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.resultsContainer}>
        <Text style={styles.sectionTitle}>Search Results</Text>
        <RestaurantCard
          name="The Bistro"
          rating="4.5"
          address="123 Fake Street, Vancouver, BC"
          imageUrl="https://www.upmenu.com/wp-content/uploads/2022/07/4-what-is-a-bistro-example-of-a-bistro.jpg"
        />
        <RestaurantCard
          name="The Corner Cafe"
          rating="4.5"
          address="456 Dummy Avenue, Toronto, ON"
          imageUrl="https://kaapimachines.com/wp-content/uploads/2023/06/cafe-chain-3-1.png"
        />
        <RestaurantCard
          name="The Italian Kitchen"
          rating="4.5"
          address="789 Fictitious Road, Montreal, QC"
          imageUrl="https://italianstreetkitchen.com/au/wp-content/uploads/2021/10/Gamberi-Prawn-Pizza.jpg"
        />
        <RestaurantCard
          name="The Sushi Bar"
          rating="4.5"
          address="1011 Make-Believe Street, Calgary, AB"
          imageUrl="https://media-cdn.tripadvisor.com/media/photo-s/1b/01/24/ef/catering.jpg"
        />
      </ScrollView>
      <Text style={styles.featuredTitle}>Featured Restaurants</Text>
      {isSideMenuOpen && (
        <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAEF',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#1F262C',
  },
  logo: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
  },
  menuButton: {
    padding: 10,
  },
  menuButtonText: {
    fontSize: 24,
    color: '#1F262C',
  },
  tagline: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    color: '#B75A4B',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 42,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(31, 38, 44, 0.14)',
    borderRadius: 40,
    paddingHorizontal: 15,
    fontSize: 11,
    fontFamily: 'Plus Jakarta Sans',
  },
  filterButton: {
    marginLeft: 10,
    padding: 10,
  },
  filterButtonText: {
    fontSize: 20,
  },
  resultsContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: '600',
    color: '#1F262C',
    marginBottom: 10,
  },
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
  featuredTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: '600',
    color: '#1F262C',
    marginTop: 20,
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: '#FFFFFF',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#1F262C',
  },
  menuItem: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    color: '#1F262C',
    marginBottom: 20,
  },
});
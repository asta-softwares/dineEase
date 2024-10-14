import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SideMenu = ({ isOpen, onClose }) => {
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(-250)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
 
  const handleLogout = () => {
    navigation.navigate('Login');
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -250,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        })
      ]).start();
    }
  }, [isOpen]);

  if (!isOpen && fadeAnim._value === 0) return null;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableWithoutFeedback>
          <Animated.View style={[styles.sideMenu, { left: slideAnim }]}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Image
              source={require('../assets/profile.png')} 
              style={styles.avatar}
            />
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.email}>johndoe@gmail.com</Text>
  
            <Text style={styles.menuItem}>Offers</Text>
            <Text style={styles.menuItem}>Help / Contact Us</Text>
            <Text style={styles.menuItem}>Partnership</Text>
            <Text style={styles.menuItem}>About</Text>
            <Text style={styles.menuItem}>Past Orders</Text>
  
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 250, // Adjust width as necessary
    backgroundColor: '#FFFAEF',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 20, // Matches the sidebar border-radius in your CSS
    zIndex: 1001,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#1F262C',
  },
  avatar: {
    width: 50,
    height: 65,
    alignSelf: 'center',
    marginVertical: 20, // Spacing for avatar image
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F262C',
    textAlign: 'center',
  },
  email: {
    fontSize: 14,
    color: '#1F262C',
    textAlign: 'center',
    marginBottom: 40, // Add spacing before menu items
  },
  menuItem: {
    fontSize: 14,
    color: '#1F262C',
    marginBottom: 20, // Space between menu items
  },
  logoutButton: {
    backgroundColor: '#F04647',
    borderRadius: 32,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignSelf: 'center',
    marginTop: 50, // Space above the logout button
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SideMenu;
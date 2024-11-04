import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { colors } from '../styles/colors';
const SideMenu = ({ isOpen, onClose }) => {
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(-250)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(isOpen);
 
  const handleLogout = () => {
    navigation.navigate('Login');
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
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
      ]).start(() => {
        setIsVisible(false);
      });
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableWithoutFeedback>
          <Animated.View style={[styles.sideMenu, { left: slideAnim }]}>
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
    width: 280,
    backgroundColor: '#F3FBFF',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1001,
  },
  avatar: {
    width: 50,
    height: 65,
    alignSelf: 'center',
    marginVertical: 20,
    marginTop: 60,
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
    marginBottom: 40,
  },
  menuItem: {
    fontSize: 14,
    color: '#1F262C',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: colors.primary,
    borderRadius: 32,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignSelf: 'center',
    marginTop: 50,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SideMenu;
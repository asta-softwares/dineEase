import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SplashScreen() {
  const navigation = useNavigation();

  const handleLoginSignup = () => {
    navigation.navigate('Login');
  };

  const handleBrowse = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require('../assets/logo-white.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Save More,</Text>
        <Text style={styles.title}>Spend Less</Text>
        <Text style={styles.subtitle}>Welcome to Dine Ease!</Text>
      </View>
    
      
      <Image
        source={require('../assets/splashart.png')}
        style={styles.illustration}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLoginSignup}>
        <Text style={styles.buttonText}>Login / Signup</Text>
      </TouchableOpacity>
      
      <View style={styles.browseContainer}>
        <Text style={styles.browseText}>Or</Text>
      </View>
      
      <TouchableOpacity onPress={handleBrowse}>
        <Text style={styles.browseLink}>Browse Selections</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F04647',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  logo: {
    width: 114,
    height: 48,
    resizeMode: 'contain',
  },
  title: {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '800',
    fontSize: 55,
    lineHeight: 60,
    textAlign: 'left',
    letterSpacing: -0.03,
    color: '#FFFAEF',
  },
  subtitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '300',
    fontSize: 15,
    letterSpacing: -0.03,
    color: '#FFFAEF',
  },
  illustration: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontFamily: 'Gilroy',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F04647',
  },
  browseContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  browseText: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 12,
    color: '#FFFAEF',
  },
  browseLink: {
    fontFamily: 'Gilroy',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFAEF',
  },
});

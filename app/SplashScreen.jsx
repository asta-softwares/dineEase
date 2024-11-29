import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import LargeButton from '../Components/Buttons/LargeButton';

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
          source={require('../assets/logo-splashscreen.png')}
          style={styles.logo}
        />
        <Text style={[typography.titleLarge, { color: colors.text.white }]}>Save More,</Text>
        <Text style={[typography.titleLarge, { color: colors.text.white }]}>Spend Less</Text>
      </View>
    
      <Image
        source={require('../assets/splashart.png')}
        style={styles.illustration}
      />
      
      <LargeButton
        title="Login / Signup"
        color={colors.white}
        textColor={colors.text.primary}
        onPress={handleLoginSignup}
      />  
      
      <Text style={[typography.labelMedium, {color: colors.text.white, margin: 10}]}>Or</Text>

      <TouchableOpacity onPress={handleBrowse}>
        <Text style={[typography.buttonLarge, {color: colors.text.white}]}>Browse Selections</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 84,
    resizeMode: 'contain',
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
  browseContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
});

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import LargeButton from '../Components/Buttons/LargeButton';

const { width, height } = Dimensions.get('window');

export default function Landing() {
  const navigation = useNavigation();

  const handleLoginSignup = () => {
    navigation.navigate('Login');
  };

  const handleBrowse = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Image
            source={require('../assets/logo-splashscreen.png')}
            style={styles.logo}
          />
          <Text style={[typography.titleLarge, styles.headerText]}>Save More,</Text>
          <Text style={[typography.titleLarge, styles.headerText]}>Spend Less</Text>
        </View>
      
        <Image
          source={require('../assets/splashart.png')}
          style={styles.illustration}
        />
        
        <View style={styles.actionContainer}>
          <LargeButton
            title="Login / Signup"
            color={colors.white}
            textColor={colors.text.primary}
            onPress={handleLoginSignup}
          />  
          
          <Text style={[typography.labelMedium, styles.orText]}>Or</Text>

          <TouchableOpacity onPress={handleBrowse}>
            <Text style={[typography.buttonLarge, styles.browseText]}>Browse Selections</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
  },
  headerContainer: {
    alignSelf: 'flex-start',
    width: '100%',
    paddingTop: height * 0.02,
  },
  headerText: {
    color: colors.text.white,
  },
  logo: {
    width: Math.min(width * 0.45, 200),
    height: Math.min(height * 0.09, 80),
    resizeMode: 'contain',
    marginBottom: height * 0.01,
  },
  illustration: {
    width: Math.min(width * 0.8, 400),
    height: Math.min(height * 0.35, 300),
    resizeMode: 'contain',
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: height * 0.03,
  },
  orText: {
    color: colors.text.white,
    marginVertical: height * 0.015,
  },
  browseText: {
    color: colors.text.white,
  },
});

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions, SafeAreaView } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import LargeButton from '../Components/Buttons/LargeButton';

const { width, height } = Dimensions.get('window');
const isSmallDevice = height < 700; 

export default function SplashScreen() {
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
            style={[
              styles.logo,
              isSmallDevice && styles.logoSmall
            ]}
          />
          <Text style={[typography.titleLarge, styles.headerText]}>Save More,</Text>
          <Text style={[typography.titleLarge, styles.headerText]}>Spend Less</Text>
        </View>
      
        <Image
          source={require('../assets/splashart.png')}
          style={[
            styles.illustration,
            isSmallDevice && styles.illustrationSmall
          ]}
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
    paddingHorizontal: width * 0.05, // 5% of screen width
    paddingVertical: height * 0.02, // 2% of screen height
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
    width: width * 0.5, // 50% of screen width
    height: height * 0.1, // 10% of screen height
    resizeMode: 'contain',
    marginBottom: height * 0.01,
  },
  logoSmall: {
    width: width * 0.4, // 40% of screen width for small devices
    height: height * 0.08, // 8% of screen height for small devices
  },
  illustration: {
    width: width * 0.85, // 85% of screen width
    height: height * 0.4, // 40% of screen height
    resizeMode: 'contain',
  },
  illustrationSmall: {
    width: width * 0.75, // 75% of screen width for small devices
    height: height * 0.35, // 35% of screen height for small devices
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: height * 0.02,
  },
  orText: {
    color: colors.text.white,
    marginVertical: height * 0.015,
  },
  browseText: {
    color: colors.text.white,
  },
});

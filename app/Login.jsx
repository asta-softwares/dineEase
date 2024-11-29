import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import LargeButton from '../Components/Buttons/LargeButton';
import CustomInput from '../Components/CustomInput';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
          />
          <Image
            source={require('../assets/logo-text-orange.png')}
            style={styles.logoText}
          />
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <CustomInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              iconName="mail-outline"
              iconPosition="left"
            />
          </View>

          <View style={styles.inputContainer}>

            <CustomInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              iconName="lock-closed-outline"
              iconPosition="left"
            />
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={[typography.labelMedium, { color: colors.text.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <LargeButton
            title="Sign In"
            onPress={() => navigation.navigate('Home')}
          />

          {/* <View style={styles.signUpContainer}>
            <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity>
              <Text style={[typography.buttonMedium, { color: colors.text.primary }]}>Sign Up</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  logoText: {
    width: 200,
    height: 40,
    resizeMode: 'contain',
    marginTop: 16,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

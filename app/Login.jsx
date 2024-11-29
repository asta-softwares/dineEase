import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import LargeButton from '../Components/Buttons/LargeButton';

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
            <Text style={[typography.labelMedium, { color: colors.text.secondary }]}>Email</Text>
            <TextInput
              style={[styles.input, typography.bodyLarge]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[typography.labelMedium, { color: colors.text.secondary }]}>Password</Text>
            <TextInput
              style={[styles.input, typography.bodyLarge]}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
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

          <View style={styles.signUpContainer}>
            <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity>
              <Text style={[typography.buttonMedium, { color: colors.text.primary }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
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
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 15,
    marginTop: 8,
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

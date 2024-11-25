import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../styles/colors';
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    // Add your login logic here
    // For now, we'll just navigate to the Home screen
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
      />
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="hello@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      
      <View style={styles.signInOptions}>
        <View style={styles.line} />
        <Text style={styles.signInText}>Or Sign In With</Text>
        <View style={styles.line} />
      </View>
      
      <View style={styles.socialButtons}>
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialButtonText}>Facebook</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account? </Text>
        <TouchableOpacity>
          <Text style={styles.signUpLink}>Join Us</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 300,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  tagline: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 15,
    color: '#842000',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 12,
    color: '#888888',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(34, 34, 34, 0.2)',
    borderRadius: 32,
    paddingHorizontal: 15,
    fontSize: 14,
  },
  forgotPassword: {
    fontFamily: 'Gilroy',
    fontSize: 12,
    color: colors.primaryText,
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  loginButton: {
    width: '100%',
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    fontFamily: 'Gilroy',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  signInOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#F2F2F2',
  },
  signInText: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 12,
    color: '#888888',
    marginHorizontal: 10,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  socialButton: {
    width: '48%',
    height: 48,
    backgroundColor: colors.secondary,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonText: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 14,
    color: colors.primaryText,
  },
  signUpContainer: {
    flexDirection: 'row',
  },
  signUpText: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 12,
    color: '#888888',
  },
  signUpLink: {
    fontFamily: 'Gilroy',
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primaryText,
  },
});

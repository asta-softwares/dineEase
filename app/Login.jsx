import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  KeyboardAvoidingView, 
  ScrollView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import LargeButton from '../Components/Buttons/LargeButton';
import CustomInput from '../Components/CustomInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import authService from '../api/services/authService';
import { useUserStore } from '../stores/userStore';
import { registerForPushNotificationsAsync } from '../utils/notificationService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useUserStore(state => state.setUser);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(email, password);

      // Set user in global state if needed
      if (response.user) {
        setUser(response.user);
      }

      // Get and send push token after successful login
      try {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          await authService.updateUser({
            profile: {notification_token: token}
          });
          console.log('Push token sent after login:', token);
        }
      } catch (error) {
        console.error('Failed to send push token:', error);
        // Continue with login even if token update fails
      }

      navigation.replace('Home'); // Replace login screen with home screen
    } catch (error) {
      console.error('Login error:', error);
      console.log('Error details:', {
        status: error?.response?.status,
        message: error?.message,
        detail: error?.response?.data?.detail
      });
      
      // Check for unverified user error
      const isUnverifiedError = error?.response?.data?.detail === 'User account is not verified. Please verify your email before logging in.';
      
      if (error?.response?.status === 401 && isUnverifiedError) {
        console.log('Unverified user detected, showing alert...');
        Alert.alert(
          'Account Not Verified',
          'Please verify your email to continue.',
          [
            {
              text: 'Verify Now',
              onPress: () => {
                console.log('Navigating to VerifyEmail with email:', email);
                navigation.replace('VerifyEmail', { email });
              }
            }
          ]
        );
        return;
      }
      if (error?.response?.status === 401 && !isUnverifiedError) {
        Alert.alert(
          'Invalid Credentials',
          'Please check your email and password and try again.',
        );
        return;
      }
      
      Alert.alert(
        'Login Failed',
        error?.response?.data?.detail || error.message || 'An error occurred during login'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
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
                    autoCapitalize="none"
                    editable={!loading}
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
                    editable={!loading}
                  />
                </View>

                <TouchableOpacity 
                  style={styles.forgotPassword}
                  onPress={() => navigation.navigate('ForgotPassword')}
                >
                  <Text style={[typography.labelMedium, { color: colors.text.primary }]}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>

                <LargeButton
                  title={loading ? "Signing In..." : "Sign In"}
                  onPress={handleLogin}
                  disabled={loading}
                />

                <TouchableOpacity 
                  style={styles.registerLink}
                  onPress={() => navigation.navigate('Register')}
                >
                  <Text style={[typography.labelMedium, { color: colors.text.primary }]}>
                    Don't have an account? Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
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
    marginTop: 10,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  registerLink: {
    alignSelf: 'center',
    marginTop: 16,
  },
});

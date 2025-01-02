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

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useUserStore(state => state.setUser);
  const setTokens = useUserStore(state => state.setTokens);

  const handleRegister = async () => {
    if (!email || !phone || !password || !confirmPassword || !firstName || !lastName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.register(
        email,
        phone,
        password,
        firstName,
        lastName,
        'customer'
      );
      // Set user data
      if (response.user) {
        setUser(response.user);
      }

      // Store tokens securely
      if (response.tokens) {
        setTokens(response.tokens.accessToken, response.tokens.refreshToken);
      }

      navigation.replace('Home');
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'An error occurred during registration';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert('Registration Failed', errorMessage);
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
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First Name"
                    iconName="person-outline"
                    iconPosition="left"
                    autoCapitalize="words"
                    editable={!loading}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <CustomInput
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last Name"
                    iconName="person-outline"
                    iconPosition="left"
                    autoCapitalize="words"
                    editable={!loading}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <CustomInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email Address"
                    keyboardType="email-address"
                    iconName="mail-outline"
                    iconPosition="left"
                    autoCapitalize="none"
                    editable={!loading}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <CustomInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    iconName="call-outline"
                    iconPosition="left"
                    editable={!loading}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <CustomInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    secureTextEntry
                    iconName="lock-closed-outline"
                    iconPosition="left"
                    editable={!loading}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <CustomInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm Password"
                    secureTextEntry
                    iconName="lock-closed-outline"
                    iconPosition="left"
                    editable={!loading}
                  />
                </View>

                <LargeButton
                  title={loading ? "Creating Account..." : "Create Account"}
                  onPress={handleRegister}
                  disabled={loading}
                />

                <TouchableOpacity 
                  style={styles.loginLink}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={[typography.labelMedium, { color: colors.text.primary }]}>
                    Already have an account? Sign In
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
  loginLink: {
    alignSelf: 'center',
    marginTop: 16,
  },
});

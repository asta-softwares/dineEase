import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, View } from 'react-native';
import CheckoutScreen from './app/Checkout';
import DetailScreen from './app/Details';
import HomeScreen from './app/Home';
import LoginScreen from './app/Login';
import Landing from './app/Landing';
import ProfileScreen from './app/Profile';
import EditProfileScreen from './app/EditProfile';
import RegisterScreen from './app/Register';
import { colors } from './styles/colors';
import { CartProvider } from './context/CartContext';
import { StripeProvider } from '@stripe/stripe-react-native';
import OrderDetailScreen from './app/OrderDetail';
import OrdersScreen from './app/Orders';
import { tokenStorage } from './utils/tokenStorage';
import { useUserStore } from './stores/userStore';
// Initialize reanimated
import 'react-native-reanimated';

const Stack = createNativeStackNavigator(); 

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-Medium': PlusJakartaSans_500Medium,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await tokenStorage.getAccessToken();
      if (token) {
        setIsAuthenticated(true);
        // You can also fetch user data here if needed
        // const userData = await userService.getProfile();
        // setUser(userData);
      }
    } catch (error) {
      console.log('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded && !fontError || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <StripeProvider
      publishableKey="pk_test_51QMpBEAECjFQcoAiIBBR2ytlseH5Ztrp19gx9RWhTox7fzADahNcnjrnyLz0a4N3cv0xp63wx2daPuf3TXWaBSRE00muGzaBD0"
      merchantIdentifier="merchant.com.dineease"
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <CartProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
              initialRouteName={isAuthenticated ? "Home" : "Landing"}
            >
              <Stack.Screen 
                name="Landing" 
                component={Landing} 
                options={{
                  gestureEnabled: false,
                  headerBackVisible: false
                }}
              />
              <Stack.Screen 
                name="Login" 
                component={LoginScreen} 
                options={{
                  gestureEnabled: false,
                  headerBackVisible: false
                }}
              />
              <Stack.Screen 
                name="Register" 
                component={RegisterScreen} 
                options={{
                  gestureEnabled: false,
                  headerBackVisible: false
                }}
              />
              <Stack.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{
                  gestureEnabled: false,
                  headerBackVisible: false
                }}
              />
              <Stack.Screen name="Details" component={DetailScreen} />
              <Stack.Screen name="Checkout" component={CheckoutScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} />
              <Stack.Screen name="OrderDetailScreen" component={OrderDetailScreen} />
              <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </CartProvider>
      </GestureHandlerRootView>
    </StripeProvider>
  );
}

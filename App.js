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
import { enableScreens } from 'react-native-screens';
import { SystemBars } from 'react-native-edge-to-edge';
import * as Notifications from 'expo-notifications';
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
import { STRIPE_PUBLISHABLE_KEY, MERCHANT_IDENTIFIER } from '@env';
import { registerForPushNotificationsAsync, setupNotificationListeners } from './utils/notificationService';
import { authService } from './api/services/authService';

// Initialize reanimated
import 'react-native-reanimated';

enableScreens();

const Stack = createNativeStackNavigator();

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-Medium': PlusJakartaSans_500Medium,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { setUser, setTokens, initializeAuth } = useUserStore();
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    const initApp = async () => {
      try {
        const tokens = await tokenStorage.getTokens();
        if (tokens?.accessToken) {
          setIsAuthenticated(true);
          await initializeAuth();
          setTokens(tokens.accessToken, tokens.refreshToken);
        }

        // Register for push notifications
        const token = await registerForPushNotificationsAsync();
        if (token) {
          setExpoPushToken(token);
          // Send token to server
          try {
            await authService.updateUser({
              notification_token: token
            });
            console.log('Push token sent to server successfully');
          } catch (error) {
            console.error('Failed to send push token to server:', error);
          }
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();

    // Setup notification listeners
    const listeners = setupNotificationListeners(
      (notification) => {
        console.log('Notification received:', notification);
     
        // Handle received notification
      },
      (response) => {
        console.log('Notification response:', response);
        // Handle notification response (when user taps notification)
      }
    );

    return () => {
      listeners.remove();
    };
  }, []);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        setIsAuthenticated(false);
        await useUserStore.getState().clearUser();
        await tokenStorage.clearTokens();
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    const unsubscribe = useUserStore.subscribe(
      (state) => state.user,
      (user) => {
        if (!user) {
          handleLogout();
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  if (!fontsLoaded && !fontError || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SystemBars style="auto" />
      <StripeProvider
        publishableKey={STRIPE_PUBLISHABLE_KEY}
        merchantIdentifier={MERCHANT_IDENTIFIER}
      >
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
              <Stack.Screen name="Orders" component={OrdersScreen} />
              <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </CartProvider>
      </StripeProvider>
    </GestureHandlerRootView>
  );
}

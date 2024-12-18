import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import React from 'react';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, View } from 'react-native';
import CheckoutScreen from './app/Checkout';
import DetailScreen from './app/Details';
import HomeScreen from './app/Home';
import LoginScreen from './app/Login';
import SplashScreen from './app/SplashScreen';
import ProfileScreen from './app/Profile';
import EditProfileScreen from './app/EditProfile';
import { colors } from './styles/colors';

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

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="SplashScreen" 
          screenOptions={{ headerShown: false }}>
          <Stack.Screen 
            name="SplashScreen" 
            component={SplashScreen} 
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
            name="Home" 
            component={HomeScreen} 
            options={{
              gestureEnabled: false,
              headerBackVisible: false
            }}
          />
          <Stack.Screen name="Detail" component={DetailScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import CheckoutScreen from './app/Checkout';
import DetailScreen from './app/Details';
import HomeScreen from './app/Home';
import LoginScreen from './app/Login';
import SplashScreen from './app/SplashScreen';

const Stack = createNativeStackNavigator(); 

export default function App() {
  return (
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
        <Stack.Screen name="Home" component={HomeScreen} 
         options={{
          gestureEnabled: false,
            headerBackVisible: false
          }}
        />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

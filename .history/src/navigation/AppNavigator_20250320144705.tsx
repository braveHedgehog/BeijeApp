import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import CycleScreen from '../screens/CycleScreen';

export type RootStackParamList = {
  Splash: undefined;
  Cycle: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Cycle" component={CycleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

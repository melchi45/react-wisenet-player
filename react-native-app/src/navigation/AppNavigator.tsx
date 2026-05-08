import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { AddDeviceScreen } from '../screens/AddDeviceScreen';
import { PlayerScreen } from '../screens/PlayerScreen';
import { MultiPlayerScreen } from '../screens/MultiPlayerScreen';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0b2948' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: '#0b2948' },
      }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Wisenet Player', headerShown: false }} />
      <Stack.Screen name="AddDevice" component={AddDeviceScreen} options={({ route }) => ({ title: route.params?.device ? 'Edit Device' : 'Add Device' })} />
      <Stack.Screen name="Player" component={PlayerScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MultiPlayer" component={MultiPlayerScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;

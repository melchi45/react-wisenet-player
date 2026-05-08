import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';

const App: React.FC = () => (
  <SafeAreaProvider>
    <AppNavigator />
  </SafeAreaProvider>
);

export default App;

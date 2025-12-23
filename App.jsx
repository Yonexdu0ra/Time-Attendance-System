/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { Text, useColorScheme, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import './global.css';
import RootNavigator from './src/navigation/RootNavigator';
import ThemeProvider from './src/context/ThemeContext';
import Toast from 'react-native-toast-message';
import AuthProvider from './src/context/AuthContext';
import useAuthStore from './src/store/authStore';
import { useEffect } from 'react';
function App() {
  const init = useAuthStore(state => state.init);
  useEffect(() => {
    init();
  }, []);
  return (
    // <AuthProvider>
    <ThemeProvider>
      <NavigationContainer>
        <RootNavigator />
        <Toast position='bottom' />
      </NavigationContainer>
    </ThemeProvider>
    // </AuthProvider>
  );
}

export default App;

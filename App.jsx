/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import './global.css';
import RootNavigator from './src/navigation/RootNavigator';
import ThemeProvider from './src/context/ThemeContext';
import Toast from 'react-native-toast-message';
import useAuthStore from './src/store/authStore';
import { useEffect } from 'react';
import { PortalHost } from '@rn-primitives/portal'
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
      <PortalHost />
    </ThemeProvider>
    // </AuthProvider>
  );
}

export default App;

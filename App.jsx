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
// import Toast from 'react-native-toast-message';
import useAuthStore from './src/store/authStore';
import { useEffect } from 'react';
import { PortalHost } from '@rn-primitives/portal';
import NotificationProvider from '@/context/NotificationContext';
import { Toaster } from 'sonner-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
function App() {
  const init = useAuthStore(state => state.init);
  useEffect(() => {
    init();
  }, []);
  return (
    // <AuthProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <NotificationProvider>
            <NavigationContainer>
              <RootNavigator />
              <Toaster />
            </NavigationContainer>
            <PortalHost />
          </NotificationProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
    // </AuthProvider>
  );
}

export default App;

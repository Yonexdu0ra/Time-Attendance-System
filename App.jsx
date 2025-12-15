/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */


import { StatusBar, Text, useColorScheme } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import './global.css'
function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Text className="text-blue-500">hello world</Text>
    </SafeAreaProvider>
  );
}



export default App;

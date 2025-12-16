// navigation/RootNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Login';
// import HomeScreen from '../screens/Home';
// import NotificationScreen from '../screens/Notification';
// import ProfileScreen from '../screens/Profile';
import RootTab from './RootTab'
import NotificationScreen from '../screens/Notification';

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right', }} initialRouteName='Login'>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RootTab" component={RootTab} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      {/* <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} /> */}
    </Stack.Navigator>
  );
}

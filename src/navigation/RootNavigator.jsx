// navigation/RootNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Login';
// import HomeScreen from '../screens/Home';
// import NotificationScreen from '../screens/Notification';
// import ProfileScreen from '../screens/Profile';
import RootTab from './RootTab';
import NotificationScreen from '../screens/Notification';
import { useAuth } from '../context/AuthContext';
import SplashScreen from '../screens/Splash'
const Stack = createStackNavigator();

export default function RootNavigator() {
  const { isLoading, user } = useAuth();
  if (isLoading) return <SplashScreen/>
  if(!user || !user?.id) return <AuthStack/>

  return <AppStack />;
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      initialRouteName="RootTab"
    >
      <Stack.Screen name="RootTab" component={RootTab} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
    </Stack.Navigator>
  );
}
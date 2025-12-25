// navigation/RootNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '@/screens/Login';
// import HomeScreen from '@/screens/Home';
// import NotificationScreen from '@/screens/Notification';
// import ProfileScreen from '@/screens/Profile';
import RootTab from './RootTab';
import NotificationScreen from '@/screens/Notification';
// import { useAuth } from '../context/AuthContext';
import SplashScreen from '@/screens/Splash';
import useAuthStore from '../store/authStore';
import ScanQRScreen from '@/screens/ScanQRS';
import StreamQRScreen from '@/screens/StreamQR';
import LeaveRequestCreate from '@/screens/LeaveRequestCreate';
import OvertimeRequestCreate from '@/screens/OvertimeRequestCreate';
const Stack = createStackNavigator();

export default function RootNavigator() {
  const loading = useAuthStore(state => state.loading);
  const user = useAuthStore(state => state.user);

  // const { isLoading, user } = useAuth();
  if (loading) return <SplashScreen />;
  if (!user || !user?.id) return <AuthStack />;
  return user.role < 1 ? <UserStack /> : <ManagerStack />;
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

function UserStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      initialRouteName="RootTab"
    >
      <Stack.Screen name="RootTab" component={RootTab} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="ScanQR" component={ScanQRScreen} />
      <Stack.Screen name="StreamQR" component={StreamQRScreen} />
      <Stack.Screen name="RequestLeaveCreate" component={LeaveRequestCreate} />
      <Stack.Screen
        name="RequestOvertimeCreate"
        component={OvertimeRequestCreate}
      />
    </Stack.Navigator>
  );
}

function ManagerStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      initialRouteName="RootTab"
    >
      <Stack.Screen name="RootTab" component={RootTab} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="ScanQR" component={ScanQRScreen} />
      <Stack.Screen name="StreamQR" component={StreamQRScreen} />
      <Stack.Screen name="RequestLeaveCreate" component={LeaveRequestCreate} />
      <Stack.Screen
        name="RequestOvertimeCreate"
        component={OvertimeRequestCreate}
      />
    </Stack.Navigator>
  );
}

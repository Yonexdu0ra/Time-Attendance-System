import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home';
import NotificationScreen from '../screens/Notification';
import ProfileScreen from '../screens/Profile';
import CalendarScreen from '../screens/Calendar';
import ShiftScreen from '../screens/Shift';


const Tab = createBottomTabNavigator();

export default function RootTab() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, animation: 'shift' }} backBehavior="none" initialRouteName='Home'>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Shift" component={ShiftScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      {/* <Tab.Screen name="Notification" component={NotificationScreen} /> */}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
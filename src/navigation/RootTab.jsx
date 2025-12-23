import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home';
import ProfileScreen from '../screens/Profile';
import CalendarScreen from '../screens/Calendar';
import ShiftScreen from '../screens/Shift';
import { House, Calendar, User, Clock, ListOrdered } from 'lucide-react-native';

import RequestTopTab from './RequestTopTab';

const Tab = createBottomTabNavigator();

export default function RootTab() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="none"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#7c3aed', // màu icon active
        tabBarInactiveTintColor: '#6b7280', // màu icon inactive
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 2,
        },
        tabBarIcon: ({ color, size }) => {
          // Chọn icon dựa theo route
          switch (route.name) {
            case 'Home':
              return <House color={color} size={size} />;
            case 'Shift':
              return <Clock color={color} size={size} />;
            case 'Calendar':
              return <Calendar color={color} size={size} />;
            case 'Request':
              return <ListOrdered color={color} size={size} />;
            case 'Profile':
              return <User color={color} size={size} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Shift" component={ShiftScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Request" component={RequestTopTab} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

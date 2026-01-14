import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home';
import ProfileScreen from '../screens/Profile';
import CalendarScreen from '../screens/Calendar';
import ShiftScreen from '../screens/Shift';
import {
  House,
  Calendar,
  User,
  Clock,
  ListOrdered,
  QrCode,
  ScanQrCode,
  MapMinus,
} from 'lucide-react-native';

import RequestTopTab from './RequestTopTab';
import ScanQRScreen from '@/screens/ScanQRS';
import { useTheme } from '@/context/ThemeContext';
import MapScreen from '@/screens/Map';

const Tab = createBottomTabNavigator();

export default function RootTab() {
  const { themeColor } = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="Map"
      backBehavior="none"
      screenOptions={{
        headerStyle: { backgroundColor: themeColor.background },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: themeColor.foreground, 
        },
        tabBarStyle: { backgroundColor: themeColor.background },
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: 'Map Screen',
          headerShown: true,
          tabBarIcon: ({ color, size }) => <MapMinus color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Trang chủ',
          headerShown: true,
          tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          title: 'Công',
          headerTitleAlign: 'center',
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Calendar color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Shift"
        component={ScanQRScreen}
        options={{
          title: 'Chấm công',
          headerShown: true,
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, size }) => (
            <ScanQrCode color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Request"
        component={RequestTopTab}
        options={{
          title: 'Yêu cầu',
          headerTitleAlign: 'center',
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <ListOrdered color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Hồ sơ',
          headerTitleAlign: 'center',
          headerShown: true,
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

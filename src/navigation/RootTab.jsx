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
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Trang chủ',
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <House color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Shift"
        component={ShiftScreen}
        options={{
          title: 'Ca làm việc',
          headerShown: true,
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, size }) => (
            <Clock color={color} size={size} />
          ),
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
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

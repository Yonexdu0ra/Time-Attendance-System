import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LeaveRequestScreen from '../screens/LeaveRequest';
import OvertimeRequestScreen from '../screens/OvertimeRequest';
import { useLayoutEffect } from 'react';

const Tab = createMaterialTopTabNavigator();

function RequestTopTab({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Yêu cầu',

      headerTitleAlign: 'center',
    });
  }, [navigation]);
  return (
    <Tab.Navigator initialRouteName="LeaveRequest">
      <Tab.Screen name="LeaveRequest" component={LeaveRequestScreen} />
      <Tab.Screen name="OvertimeRequest" component={OvertimeRequestScreen} />
    </Tab.Navigator>
  );
}

export default RequestTopTab;

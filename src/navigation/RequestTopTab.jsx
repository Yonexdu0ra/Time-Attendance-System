import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LeaveRequestScreen from '../screens/LeaveRequest';
import OvertimeRequestScreen from '../screens/OvertimeRequest';

const Tab = createMaterialTopTabNavigator();

function RequestTopTab({ navigation }) {
  return (
    <Tab.Navigator initialRouteName="LeaveRequest">
      <Tab.Screen
        name="LeaveRequest"
        component={LeaveRequestScreen}
        options={{
          title: 'Nghỉ phép',
          // swipeEnabled: false
        }}
      />
      <Tab.Screen
        name="OvertimeRequest"
        component={OvertimeRequestScreen}
        options={{
          title: 'Tăng ca',
          lazy: true,
          // swipeEnabled: false
        }}
      />
    </Tab.Navigator>
  );
}

export default RequestTopTab;

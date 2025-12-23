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
          title: 'Xin nghỉ',
        }}
      />
      <Tab.Screen
        name="OvertimeRequest"
        component={OvertimeRequestScreen}
        options={{
          title: 'Tăng ca',
        }}
      />
    </Tab.Navigator>
  );
}

export default RequestTopTab;

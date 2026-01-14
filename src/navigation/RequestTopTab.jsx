import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LeaveRequestScreen from '../screens/LeaveRequest';
import OvertimeRequestScreen from '../screens/OvertimeRequest';
import ShiftAttendanceScreen from '@/screens/ShiftAttendance';
import UserShiftRequest from '@/screens/UserShiftRequest';
import { useTheme } from '@/context/ThemeContext';
import useAuthStore from '@/store/authStore';

const Tab = createMaterialTopTabNavigator();

function RequestTopTab({ navigation }) {
  const { themeColor } = useTheme();
  const user = useAuthStore(state => state.user);
  return (
    <Tab.Navigator
      initialRouteName="LeaveRequest"
      screenOptions={{
        tabBarStyle: { backgroundColor: themeColor.background }, // nền tab bar
        tabBarActiveTintColor: themeColor.primary, // màu chữ tab active
        tabBarInactiveTintColor: themeColor.foreground, // màu chữ tab inactive
        tabBarLabelStyle: { fontWeight: 'bold', fontSize: 14 }, // style chữ
        tabBarIndicatorStyle: { backgroundColor: themeColor.primary }, // màu gạch chỉ tab active
      }}
    >
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
      {user.role >= 1 && (
        <Tab.Screen
          name="ShiftAttendance"
          component={ShiftAttendanceScreen}
          options={{
            title: 'Chấm công',
            lazy: true,
            // swipeEnabled: false
          }}
        />
      )}
    </Tab.Navigator>
  );
}

export default RequestTopTab;

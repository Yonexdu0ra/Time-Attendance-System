import { useLayoutEffect } from 'react';
import { View, Text } from 'react-native';

function LeaveRequestScreen({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Nghỉ phép',
      headerTitleAlign: 'center',
    });
  }, [navigation]);
  return (
    <View>
      <Text>LeaveRequest screen</Text>
    </View>
  );
}

export default LeaveRequestScreen;

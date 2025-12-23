
import { useLayoutEffect } from 'react';
import { View, Text } from 'react-native';

function OvertimeRequestScreen({ navigation }) {
  useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: true,
        title: 'Tăng ca',
        headerTitleAlign: 'center',
      });
    }, [navigation]);
  return (
    <View>
      <Text>Overtime screen</Text>
    </View>
  );
}

export default OvertimeRequestScreen;

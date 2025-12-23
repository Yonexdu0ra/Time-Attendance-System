import { Bell } from 'lucide-react-native';
import {  useLayoutEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Button from '../components/Button';

function HomeScreen({ navigation }) {
  const handleNotificationPress = () => {
    navigation.push('Notification');
  };
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerShown: true,
  //     title: 'Trang chủ',
  //     headerRight: () => (
  //       <Button
  //         variant="secondary"
  //         className="mr-4"
  //         onPress={handleNotificationPress}
  //       >
  //         <Bell />
  //       </Button>
  //     ),
  //   });
  // }, [navigation]);
  return (
    <View>
      <ScrollView>
        <Text>Home screen</Text>
      </ScrollView>
    </View>
  );
}

export default HomeScreen;

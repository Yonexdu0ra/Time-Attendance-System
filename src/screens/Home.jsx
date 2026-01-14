import {  ScanQrCode } from 'lucide-react-native';
// import { useLayoutEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import useHomeStore from '../store/homeStore';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCameraPermission } from 'react-native-vision-camera';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import useNotificationStore from '@/store/notificationStore';
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated';
import useAuthStore from '@/store/authStore';
import useShiftStore from '@/store/shiftStore';
import { Bell } from '@/components/ui/bell';
function HomeScreen({ navigation }) {
  const { themeColor } = useTheme();
  const user = useAuthStore(state => state.user);
  const shifts = useShiftStore(state => state.shifts);
  const initShifts = useShiftStore(state => state.init);
  const { hasPermission, requestPermission } = useCameraPermission();
  const unReadCount = useNotificationStore(state => state.unReadCount);
  const MAPTILER_KEY = 'tZPHtBJcn74rutLOqByE';
  useEffect(() => {
    initShifts();
  }, []);
  useEffect(() => {
    const fetchCameraPermission = async () => {
      // console.log(hasPermission);

      if (!hasPermission) {
        await requestPermission(); // sẽ bật popup cấp quyền
      }
    };
    fetchCameraPermission();
  }),
    [];
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerRight: () => (
        <Bell/>
      ),
      headerLeft: () => (
        <Animated.View entering={FadeInLeft.delay(500)}>
          <TouchableOpacity
          className="ml-4"
          onPress={() => navigation?.navigate('Profile')}
        >
          <View className="flex-row items-center gap-2">
            <Image
              source={{
                uri: 'https://github.com/shadcn.png',
              }}
              className="w-10 h-10 rounded-full "
            />
            <Text className={'font-bold'}>{user.fullName}</Text>
          </View>
        </TouchableOpacity>
        </Animated.View>
      ),
    });
  }, [navigation, themeColor, unReadCount]);

  return (
    <View className="flex-1 bg-background">
      <FlatList data={shifts}
       keyExtractor={item => item.id}
       horizontal
       renderItem={({item}) => <View  className='bg-secondary  w-full'>
        <Text>{item.name}</Text>
       </View>}
       />
    </View>
  );
}

export default HomeScreen;

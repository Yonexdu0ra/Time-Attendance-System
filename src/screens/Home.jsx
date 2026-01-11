import { Bell, ScanQrCode } from 'lucide-react-native';
// import { useLayoutEffect } from 'react';
import {
  ActivityIndicator,
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
function HomeScreen({ navigation }) {
  const { themeColor } = useTheme();
  const user = useAuthStore(state => state.user);
  const { hasPermission, requestPermission } = useCameraPermission();
  const unReadCount = useNotificationStore(state => state.unReadCount);

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
        <TouchableOpacity
          className="mr-4"
          onPress={() => navigation?.getParent()?.push('Notification')}
        >
          <Animated.View className="relative" entering={FadeInRight.delay(500)}>
            <Bell size={24} color={themeColor.foreground} />
            {unReadCount > 0 && (
              <Badge
                variant={'destructive'}
                className={'absolute -right-3 -top-3'}
              >
                <Text>{unReadCount}</Text>
              </Badge>
            )}
          </Animated.View>
        </TouchableOpacity>
      ),
      headerLeft: () => (
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
      ),
    });
  }, [navigation, themeColor, unReadCount]);

  return <View className="flex-1 bg-background">
    <ScrollView
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-sm font-bold">Thống kê công việc trong tháng</Text>
      <View className='flex flex-row gap-4'>
        <View className='border p-4 rounded-lg bg-secondary'> 
          <Text>Tổng giờ làm</Text>
          <Text>142.5 giờ</Text>
        </View>
        <View className='border p-4 rounded-lg bg-secondary'>
          <Text>Ngày công</Text>
          <Text>18/22 ngày</Text>
        </View>
      </View>
    </ScrollView>
  </View>;
}

export default HomeScreen;

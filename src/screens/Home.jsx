import { ActivityIndicator, FlatList, ScrollView, View } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import { useEffect, useLayoutEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCameraPermission } from 'react-native-vision-camera';
import { Text } from '@/components/ui/text';
import useNotificationStore from '@/store/notificationStore';
import useAuthStore from '@/store/authStore';
import useShiftStore from '@/store/shiftStore';
import { Bell } from '@/components/ui/bell';
import {
  Camera,
  MapView,
  NativeUserLocation,
  useCurrentPosition,
} from '@maplibre/maplibre-react-native';
import HeaderLeft from '@/components/ui/headerRight';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScanQrCode } from 'lucide-react-native';
function HomeScreen({ navigation }) {
  const { themeColor } = useTheme();
  const user = useAuthStore(state => state.user);
  const shifts = useShiftStore(state => state.shifts);
  const position = useCurrentPosition();
  const { SHIFT_TYPE_STRING } = useAuthStore(state => state.config);
  const notification = useNotificationStore(state => state.notifications);

  const initShifts = useShiftStore(state => state.init);
  const { hasPermission, requestPermission } = useCameraPermission();
  const unReadCount = useNotificationStore(state => state.unReadCount);
  const MAPTILER_KEY = 'tZPHtBJcn74rutLOqByE';
  const MAP_URL =
    'https://api.maptiler.com/maps/base-v4/style.json?key=tZPHtBJcn74rutLOqByE';
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
  }, [hasPermission, requestPermission]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerRight: () => <Bell />,
      headerLeft: () => <HeaderLeft />,
    });
  }, [navigation, themeColor, unReadCount]);

  return (
    <View className="flex-1 bg-background">
      <ScrollView>
        <View className="p-4">
          <Text className={'text-lg'}>Ca làm việc hiện tại</Text>
          {shifts?.map(item => (
            <View
              className="bg-secondary relative rounded-lg overflow-hidden"
              key={item.id}
            >
              {position ? (
                <>
                  <MapView
                    style={{ height: 200, width: '100%', borderRadius: 12 }} // Ưu tiên dùng style inline cho MapView để đảm bảo kích thước
                    mapStyle={MAP_URL}
                  >
                    <>
                      <NativeUserLocation />
                      <Camera
                        center={[
                          position.coords.longitude,
                          position.coords.latitude,
                        ]}
                        duration={2000}
                        easing="fly"
                        zoom={14}
                      />
                    </>
                  </MapView>
                </>
              ) : (
                <View
                  className="justify-center items-center gap-4 flex-row"
                  style={{ height: 200 }}
                >
                  <Text>Loading GPS...</Text>
                  <ActivityIndicator />
                </View>
              )}
              <View className="p-4 gap-2">
                <Text className="font-bold text-lg text-center text-primary">
                  {item.name}
                </Text>
                <Text className={''}>
                  Ca {SHIFT_TYPE_STRING[item.type]}:{' '}
                  {new Date(item.workStart).toTimeString().split(' ')[0]} -{' '}
                  {new Date(item.workEnd).toTimeString().split(' ')[0]}
                </Text>
                <Text className="text-muted-foreground">
                  {item.address || 'Không xác định'}
                </Text>
                <Text className={'text-green-500'}>
                  Bạn đang trong khu vực làm việc
                </Text>
                <Button className="w-full mt-2 justify-center">
                  <ScanQrCode color={themeColor.background} />
                  <Text className="font-bold">Chấm công ngay</Text>
                </Button>
                <Text className={'text-sm text-destructive'}>
                  Hiện tại không ở trong bán kính cho phép chấm công
                </Text>
              </View>
            </View>
          ))}
          {position ? (
            <View className="justify-center items-center gap-4 mt-4">
              <Text className={'text-sm text-muted-foreground'}>
                Vị trí hiện tại: {position.coords.latitude},{' '}
                {position.coords.longitude}
              </Text>
              <Text className={'text-sm text-primary'}>
                Độ chính xác: +/- {position.coords.accuracy}m
              </Text>
            </View>
          ) : null}
        </View>
        <View className="p-4">
          <Text>Tóm tắt công việc tháng {new Date().getMonth() + 1}</Text>
          {/* view hàng ngang */}
          <View className="flex-row justify-between gap-2">
            <View className="bg-secondary p-4 rounded-lg w-1/2 items-center flex-col">
              <Text className={'text-sm text-muted-foreground'}>
                Tổng giờ làm
              </Text>
              <View className="flex-row gap-1">
                <Text>142.5</Text>
                <Text className={'text-muted-foreground text-sm self-end'}>
                  giờ
                </Text>
              </View>
            </View>
            <View className="bg-secondary p-4 rounded-lg w-1/2 items-center flex-col">
              <Text className={'text-sm text-muted-foreground'}>Ngày công</Text>
              <View className="flex-row gap-1">
                <Text>18/22</Text>
                <Text className={'text-muted-foreground text-sm self-end'}>
                  ngày
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text>Thông báo mới nhất</Text>
            <Button
              variant={'link'}
              onPress={() => {
                navigation.navigate('Notification');
              }}
            >
              <Text>Xem tất cả</Text>
            </Button>
          </View>
        </View>
        <View className="p-4">
          {notification?.map(item => (
            <View
              className={`${
                item.read ? 'bg-secondary' : 'bg-accent'
              } rounded-lg p-4 mb-2`}
              key={item.id}
            >
              <Text className="font-bold">{item.title}</Text>
              <Text className="text-sm text-muted-foreground">
                {item.message}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default HomeScreen;

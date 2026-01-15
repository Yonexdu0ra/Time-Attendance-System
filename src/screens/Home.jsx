import { FlatList, View } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import { useEffect, useLayoutEffect } from 'react';
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
  const positon = useCurrentPosition();
  const { SHIFT_TYPE, SHIFT_TYPE_STRING } = useAuthStore(state => state.config);
  console.log(positon);

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
      <FlatList
        data={shifts}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListFooterComponent={
          positon && positon.coords ? (
            <View className=" justify-center items-center gap-4 mt-4">
              <Text>Kinh độ: {positon.coords.longitude}</Text>
              <Text>Vĩ độ: {positon.coords.latitude}</Text>
              <Text>Độ chính xác: {positon.coords.accuracy}m</Text>
            </View>
          ) : null
        }
        renderItem={({ item, index }) => (
          <View className="bg-secondary relative rounded-lg">
            <MapView
              style={{ height: 200, width: '100%', borderRadius: 12 }} // Ưu tiên dùng style inline cho MapView để đảm bảo kích thước
              mapStyle={MAP_URL}
            >
              {positon && positon.coords && (
                <>
                  <NativeUserLocation />
                  <Camera
                    center={[positon.coords.longitude, positon.coords.latitude]}
                    duration={2000}
                    easing="fly"
                    zoom={14}
                  />
                </>
              )}
            </MapView>
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
              <Button>
                <ScanQrCode color={themeColor.background} />
                <Text className='font-bold'>Chấm công ngay</Text>
              </Button>
            </View>
          </View>
        )}
      />
    </View>
  );
}

export default HomeScreen;

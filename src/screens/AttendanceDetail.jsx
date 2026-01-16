import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/context/ThemeContext';
import useAuthStore from '@/store/authStore';
import {
  Camera,
  MapView,
  NativeUserLocation,
  useCurrentPosition,
} from '@maplibre/maplibre-react-native';
import { TriangleAlert } from 'lucide-react-native';
import { useLayoutEffect } from 'react';
import { ScrollView, View } from 'react-native';

function AttendanceDetailScreen({ navigation, route }) {
  const { SHIFT_TYPE_STRING, SHIFT_ATTENDANCE_TYPE_STRING, ROLE, STATUS_TYPE_STRING ,SHIFT_ATTENDANCE_STATUS_STRING} =
    useAuthStore(state => state.config);
  const { themeColor } = useTheme();
  const { attendance } = route.params;
//   console.log(ROLE);
  
  const user = useAuthStore(state => state.user);
//   console.log(attendance);
  const position = useCurrentPosition();
  const MAP_URL =
    'https://api.maptiler.com/maps/base-v4/style.json?key=tZPHtBJcn74rutLOqByE';
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Chi tiết chấm công',
      headerShown: true,
    });
  }, [navigation]);
  return (
      <View className="bg-background flex-1 ">
    <ScrollView className='p-4'>
        {attendance.isFraud && (
          <View className="p-4 rounded-lg border border-destructive/30 bg-destructive/10 flex-row items-center gap-4">
            <TriangleAlert color={themeColor.destructive} />

            <View className="flex-1 flex-col gap-2">
              <Text className="text-destructive font-semibold">
                Cảnh báo gian lận
              </Text>

              <Text className="text-destructive/70 text-sm leading-5">
                {attendance.fraudReason ||
                  'Phát hiện vị trí chấm công không hợp lệ. Yêu cầu này sẽ không được chấp nhận nếu không có sự xác nhận từ quản lý.'}
              </Text>
            </View>
          </View>
        )}
        <View className="p-4 rounded-lg border bg-secondary mt-2 flex-row justify-between items-center">
          <Text className="text-2xl font-semibold text-center">
            {attendance.shift.name}
          </Text>
          <Text className="text-sm text-muted-foreground">
            Ca {SHIFT_TYPE_STRING[attendance.shift.type]}
          </Text>
        </View>
        <View className="flex-row justify-between items-center mt-4 p-4">
          <Text className={'font-bold text-lg'}>Vị trí chấm công</Text>
          <Text className={'text-primary'}>Bán kính 200m</Text>
        </View>
        <View className="bg-secondary rounded-lg overflow-hidden mt-2">
          <MapView
            style={{ height: 200, width: '100%', borderRadius: 12 }} // Ưu tiên dùng style inline cho MapView để đảm bảo kích thước
            mapStyle={MAP_URL}
          >
            {position && (
              <>
                <NativeUserLocation />
                <Camera
                  center={[position.coords.longitude, position.coords.latitude]}
                  duration={2000}
                  easing="fly"
                  zoom={14}
                />
              </>
            )}
          </MapView>
          <View className="flex-row justify-between items-center p-4 border-b border-muted-foreground/20">
            <Text className="">Trạng thái duyệt</Text>
            <Text className="text-sm text-muted-foreground">
              {STATUS_TYPE_STRING[attendance.approve] || 'Không xác định'}
            </Text>
          </View>
          <View className="flex-row justify-between items-center p-4 border-b border-muted-foreground/20">
            <Text className="">Trạng thái chấm công</Text>
            <Text className="text-sm text-muted-foreground">
              {SHIFT_ATTENDANCE_STATUS_STRING[attendance.status] || 'Không xác định'}
            </Text>
          </View>
          <View className="flex-row justify-between items-center p-4 border-b border-muted-foreground/20">
            <Text className="">Chấm công lúc</Text>
            <Text className="text-sm text-muted-foreground">
              {new Date(attendance.attendAt).toLocaleString()}
            </Text>
          </View>
          <View className="flex-row justify-between items-center p-4 border-b border-muted-foreground/20">
            <Text className="">Địa chỉ IP</Text>
            <Text className="text-sm text-muted-foreground">113.161.x.xxx</Text>
          </View>
          <View className="flex-row justify-between items-center p-4 border-b border-muted-foreground/20">
            <Text className="">GPS</Text>
            <Text className="text-sm text-muted-foreground">
              {attendance.gps || 'Không xác định'}
            </Text>
          </View>
          <View className="flex-row justify-between items-center p-4 border-b border-muted-foreground/20">
            <Text className="">Loại chấm công</Text>
            <Text className="text-sm text-muted-foreground">
              {SHIFT_ATTENDANCE_TYPE_STRING[attendance.type] ||
                'Không xác định'}
            </Text>
          </View>
          {user.role !== ROLE.USER && attendance.isFraud && (
            <View className="flex-row justify-between items-center p-4 gap-4">
              <Button variant={'destructive'} className={'flex-1 w-1/2'}>
                <Text>Từ chối</Text>
              </Button>
              <Button className={'flex-1 w-1/2'}>
                <Text>Chấp nhận</Text>
              </Button>
            </View>
          )}
        </View>
    </ScrollView>
      </View>
  );
}

export default AttendanceDetailScreen;

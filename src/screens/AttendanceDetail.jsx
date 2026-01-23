import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/context/ThemeContext';
import useLocation from '@/hooks/useLocation';
import useAuthStore from '@/store/authStore';
import createCircle from '@/utils/createCircle';
import {
  Callout,
  Camera,
  FillLayer,
  LineLayer,
  MapView,
  MarkerView,
  NativeUserLocation,
  PointAnnotation,
  ShapeSource,
  useCurrentPosition,
} from '@maplibre/maplibre-react-native';
import { getDistance } from 'geolib';
import { CircleUserRound, MapPin, TriangleAlert } from 'lucide-react-native';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

function AttendanceDetailScreen({ navigation, route }) {
  const {
    SHIFT_TYPE_STRING,
    SHIFT_ATTENDANCE_TYPE_STRING,
    ROLE,
    STATUS_TYPE_STRING,
    SHIFT_ATTENDANCE_STATUS_STRING,
  } = useAuthStore(state => state.config);
  const { themeColor } = useTheme();
  const { attendance } = route.params;
  const from = {
    latitude: attendance.latitude,
    longitude: attendance.longitude,
  };
  const to = {
    latitude: attendance.shift.latitude,
    longitude: attendance.shift.longitude,
  };
  const distance = getDistance(from, to);
  const isWithinRadius = distance <= attendance.shift.radius;
  const user = useAuthStore(state => state.user);
  //   console.log(attendance);
  const position = useCurrentPosition();

  const MAP_URL =
    'https://api.maptiler.com/maps/bright-v2/style.json?key=tZPHtBJcn74rutLOqByE';
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Chi tiết chấm công',
      headerShown: true,
    });
  }, [navigation]);
  return (
    <View className="bg-background flex-1 ">
      <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 40 }}>
        {(attendance.isFraud || !isWithinRadius) && (
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
        
        <View className="flex-row justify-between items-center mt-4 p-4">
          <Text className={'font-bold text-lg'}>Vị trí chấm công</Text>
          <Text className={'text-primary'}>
            Bán kính {attendance.shift.radius}m
          </Text>
        </View>
        <View className="bg-secondary rounded-lg overflow-hidden mt-2">
          <MapView
            style={{ height: 200, width: '100%', borderRadius: 12 }} // Ưu tiên dùng style inline cho MapView để đảm bảo kích thước
            mapStyle={MAP_URL}
            touchAndDoubleTapZoom={false}
            dragPan={false}
            touchRotate={false}
            touchPitch={false}
          >
            {position && (
              <>
                <Camera
                  center={[
                    attendance.shift.longitude,
                    attendance.shift.latitude,
                  ]}
                  duration={2000}
                  easing="fly"
                  zoom={17}
                />
                {/* <NativeUserLocation /> */}

                <PointAnnotation
                  id="address"
                  coordinate={[
                    attendance.shift.longitude,
                    attendance.shift.latitude,
                  ]}
                  anchor={{
                    x: 0.5,
                    y: 1.5,
                  }}
                >
                  <Callout id="callout_id" title={attendance.shift.name}></Callout>
                </PointAnnotation>

                <MarkerView
                  coordinate={[attendance.longitude, attendance.latitude]}
                >
                  <View className="w-8 h-8 items-center justify-center">
                    <CircleUserRound />
                  </View>
                </MarkerView>

                {/* <ShapeSource></ShapeSource> */}
                <ShapeSource
                  id="company-radius"
                  data={createCircle(
                    [attendance.shift.longitude, attendance.shift.latitude],
                    50,
                  )}
                >
                  <FillLayer
                    id="radius-fill"
                    style={{
                      fillColor: 'rgba(0, 122, 255, 0.2)',
                    }}
                  ></FillLayer>
                  <LineLayer
                    id="radius-line"
                    style={{
                      lineColor: 'rgba(0, 122, 255, 0.8)',
                      lineWidth: 2,
                    }}
                  ></LineLayer>
                </ShapeSource>
              </>
            )}
          </MapView>
          <View className="overflow-hidden">
            <Animated.View
              entering={FadeInDown.delay(200)}
              className="p-4 border-b border-muted-foreground/20 items-center"
            >
              <Text className="text-lg font-semibold text-primary text-center">  {attendance.shift.name}</Text>
              
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(200)}
              className="flex-row justify-between items-center p-4 border-b border-muted-foreground/20"
            >
              <Text className="">Trạng thái duyệt</Text>
              <Text
                className="text-sm text-muted-foreground"
                style={{
                  width: STATUS_TYPE_STRING[attendance.approve].length * 8,
                }}
              >
                {STATUS_TYPE_STRING[attendance.approve] || 'Không xác định'}
              </Text>
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(400)}
              className="flex-row justify-between items-center p-4 border-b border-muted-foreground/20"
            >
              <Text className="">Trạng thái chấm công</Text>
              <Text
                className="text-sm text-muted-foreground"
                style={{
                  width:
                    SHIFT_ATTENDANCE_STATUS_STRING[attendance.status].length *
                    8,
                }}
              >
                {SHIFT_ATTENDANCE_STATUS_STRING[attendance.status] ||
                  'Không xác định'}
              </Text>
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(600)}
              className="flex-row justify-between items-center p-4 border-b border-muted-foreground/20"
            >
              <Text className="">Chấm công lúc</Text>
              <Text className="text-sm text-muted-foreground">
                {new Date(attendance.attendAt).toLocaleString()}
              </Text>
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(800)}
              className="flex-row justify-between items-center p-4 border-b border-muted-foreground/20"
            >
              <Text className="">Địa chỉ IP</Text>
              <Text className="text-sm text-muted-foreground">
                {attendance.ipAddress || 'Không xác định'}
              </Text>
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(1000)}
              className="flex-row justify-between items-center p-4 border-b border-muted-foreground/20"
            >
              <Text className="">Vị trí chấm công</Text>
              <Text className="text-sm text-muted-foreground">
                {/* {attendance.gps || 'Không xác định'} */}
                {attendance.latitude}, {attendance.longitude}
              </Text>
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(1200)}
              className="flex-row justify-between items-center p-4 border-b border-muted-foreground/20"
            >
              <Text className="">Loại chấm công</Text>
              <Text className="text-sm text-muted-foreground">
                {SHIFT_ATTENDANCE_TYPE_STRING[attendance.type] ||
                  'Không xác định'}
              </Text>
            </Animated.View>
            {user.role !== ROLE.USER && attendance.isFraud && (
              <Animated.View
                entering={FadeInDown.delay(1400)}
                className="flex-row justify-between items-center p-4 gap-4"
              >
                <Button variant={'destructive'} className={'flex-1 w-1/2'}>
                  <Text>Từ chối</Text>
                </Button>
                <Button className={'flex-1 w-1/2'}>
                  <Text>Chấp nhận</Text>
                </Button>
              </Animated.View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default AttendanceDetailScreen;

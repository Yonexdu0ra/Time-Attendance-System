import { Image, ScrollView, View } from 'react-native';
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
  Callout,
  FillLayer,
  LineLayer,
  MapView,
  NativeUserLocation,
  PointAnnotation,
  ShapeSource,
} from '@maplibre/maplibre-react-native';
import HeaderLeft from '@/components/ui/headerRight';
import { Button } from '@/components/ui/button';
import { MapPinned, Minus, Plus, ScanQrCode } from 'lucide-react-native';
import createCircle from '@/utils/createCircle';
import openAppSettings from '@/utils/openAppSetting';
import useLocation from '@/hooks/useLocation';
import { getDistance } from 'geolib';

function HomeScreen({ navigation }) {
  const { themeColor } = useTheme();

  const shifts = useShiftStore(state => state.shifts);
  const initShifts = useShiftStore(state => state.init);

  const { SHIFT_TYPE_STRING } = useAuthStore(state => state.config);

  const notification = useNotificationStore(state => state.notifications);
  const unReadCount = useNotificationStore(state => state.unReadCount);

  const { hasPermission, requestPermission } = useCameraPermission();
  const { hasPermissionLocation, position } = useLocation();

  const [currentPosition, setCurrentPosition] = useState(true);
  const [zoom, setZoom] = useState(16);

  const MAP_URL =
    'https://api.maptiler.com/maps/bright-v2/style.json?key=tZPHtBJcn74rutLOqByE';

  useEffect(() => {
    initShifts();
  }, []);

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => <HeaderLeft />,
      headerRight: () => <Bell />,
    });
  }, [navigation, themeColor, unReadCount]);

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4 gap-6">
          {/* ===== CA LÀM VIỆC ===== */}
          <Text className="text-lg font-semibold">Ca làm việc hiện tại</Text>

          {shifts?.map(item => {
            const from = {
              latitude: item.latitude || 0,
              longitude: item.longitude || 0,
            };

            const to = {
              latitude: position?.coords.latitude || 0,
              longitude: position?.coords.longitude || 0,
            };

            const distance = getDistance(from, to);
            const isWithinRadius = distance <= item.radius;

            return (
              <View
                key={item.id}
                className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm"
              >
                {/* ===== MAP ===== */}
                {position && (
                  <View className="relative">
                    <MapView
                      style={{ height: 200, width: '100%' }}
                      mapStyle={MAP_URL}
                      touchAndDoubleTapZoom={false}
                      dragPan={false}
                      touchRotate={false}
                      touchPitch={false}
                    >
                      <Camera
                        center={
                          currentPosition
                            ? [from.longitude, from.latitude]
                            : [to.longitude, to.latitude]
                        }
                        zoom={zoom}
                        duration={1500}
                        easing="fly"
                      />

                      <NativeUserLocation />

                      <PointAnnotation
                        id="company"
                        coordinate={[from.longitude, from.latitude]}
                        anchor={{ x: 0.5, y: 1.3 }}
                      >
                        <Callout title={item.address} />
                      </PointAnnotation>

                      <ShapeSource
                        id="radius"
                        data={createCircle(
                          [from.longitude, from.latitude],
                          item.radius,
                        )}
                      >
                        <FillLayer
                          id="radius-fill"
                          style={{ fillColor: 'rgba(0,122,255,0.15)' }}
                        />
                        <LineLayer
                          id="radius-line"
                          style={{
                            lineColor: 'rgba(0,122,255,0.8)',
                            lineWidth: 2,
                          }}
                        />
                      </ShapeSource>
                    </MapView>

                    {/* MAP CONTROLS */}
                    <View className="absolute top-3 left-3 gap-2">
                      <Button
                        className="rounded-full p-2 shadow-lg"
                        onPress={() => zoom < 20 && setZoom(zoom + 1)}
                      >
                        <Plus />
                      </Button>
                      <Button
                        className="rounded-full p-2 shadow-lg"
                        onPress={() => zoom > 1 && setZoom(zoom - 1)}
                      >
                        <Minus />
                      </Button>
                    </View>

                    <View className="absolute top-3 right-3">
                      <Button
                        className="rounded-full p-2 shadow-lg"
                        onPress={() => setCurrentPosition(!currentPosition)}
                      >
                        <MapPinned />
                      </Button>
                    </View>

                    {/* MAP STATUS */}
                    <View className="absolute bottom-0 left-3 right-3  rounded-xl p-3">
                      {isWithinRadius ? (
                        <Text className="text-green-600 font-semibold text-center">
                          Bạn đang trong khu vực làm việc
                        </Text>
                      ) : (
                        <Text className="text-destructive font-semibold text-center">
                          Cách vị trí làm việc {distance} m
                        </Text>
                      )}
                    </View>
                  </View>
                )}

                {/* LOCATION PERMISSION */}
                {!hasPermissionLocation && (
                  <View className="p-4">
                    <Text className="text-center font-semibold mb-2">
                      Ứng dụng cần quyền vị trí để chấm công
                    </Text>
                    <Button variant="link" onPress={openAppSettings}>
                      <Text>Mở cài đặt</Text>
                    </Button>
                  </View>
                )}

                {/* SHIFT INFO */}
                <View className="p-4 gap-2">
                  <Text className="text-lg font-bold text-center">
                    {item.name}
                  </Text>

                  <Text className="text-sm text-muted-foreground text-center">
                    Ca {SHIFT_TYPE_STRING[item.type]} •{' '}
                    {new Date(item.workStart).toTimeString().slice(0, 5)} –{' '}
                    {new Date(item.workEnd).toTimeString().slice(0, 5)}
                  </Text>

                  <Text className="text-xs text-muted-foreground text-center">
                    {item.address || 'Không xác định'}
                  </Text>
                  <View className="h-px bg-border my-4" />
                  <Text className="text-xs text-muted-foreground mb-1">
                    Quản lý bởi
                  </Text>
                  {item.managerShifts?.map(({ manager }) => (
                    <View className="flex-row items-center" key={manager.id}>
                      <Image
                        source={{ uri: manager.avatarUrl }}
                        className="h-9 w-9 rounded-full bg-muted"
                      />
                      <View className="ml-3 flex-1">
                        <Text className="text-sm font-medium">
                          {manager.fullName}
                        </Text>
                      </View>
                    </View>
                  ))}
                  <View className="h-px bg-border my-4" />
                  <Button
                    className="mt-4 h-12 rounded-xl flex-row gap-2 justify-center"
                    disabled={!isWithinRadius}
                  >
                    <ScanQrCode color={themeColor.background} />
                    <Text className="font-bold text-base">Chấm công ngay</Text>
                  </Button>
                </View>
              </View>
            );
          })}

          {/* GPS INFO */}
          {position && (
            <View className="items-center gap-1">
              <Text className="text-xs text-muted-foreground">
                📍 {position.coords.latitude}, {position.coords.longitude}
              </Text>
              <Text className="text-xs text-primary">
                Sai số GPS ±{Math.round(position.coords.accuracy)}m
              </Text>
            </View>
          )}

          {/* SUMMARY */}
          <View className="bg-card rounded-2xl p-4 border border-border">
            <Text className="font-semibold mb-3">
              Tóm tắt tháng {new Date().getMonth() + 1}
            </Text>

            <View className="flex-row gap-3">
              <View className="flex-1 bg-secondary rounded-xl p-4 items-center">
                <Text className="text-xs text-muted-foreground">
                  Tổng giờ làm
                </Text>
                <Text className="text-xl font-bold">142.5</Text>
              </View>

              <View className="flex-1 bg-secondary rounded-xl p-4 items-center">
                <Text className="text-xs text-muted-foreground">Ngày công</Text>
                <Text className="text-xl font-bold">18 / 22</Text>
              </View>
            </View>
          </View>

          {/* NOTIFICATION */}
          <View className="bg-card rounded-2xl p-4 border border-border gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="font-semibold">Thông báo</Text>
              <Button
                variant="link"
                onPress={() => navigation.navigate('Notification')}
              >
                <Text>Xem tất cả</Text>
              </Button>
            </View>

            {notification?.slice(0, 3).map(item => (
              <View
                key={item.id}
                className={`rounded-xl p-3 ${
                  item.read ? 'bg-secondary' : 'bg-accent'
                }`}
              >
                <Text className="font-semibold text-sm">{item.title}</Text>
                <Text className="text-xs text-muted-foreground">
                  {item.message}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default HomeScreen;

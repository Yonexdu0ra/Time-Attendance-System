import { Bell, ScanQrCode } from 'lucide-react-native';
// import { useLayoutEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import useHomeStore from '../store/homeStore';
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import useCurrentTime from '../hooks/useCurrrentTime';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import Button from '../components/Button';
import openAppSetting from '../utils/openAppSetting';
import { Text } from '@/components/ui/text';
function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const { themeColor } = useTheme();
  const currentTime = useCurrentTime();
  const isLoading = useHomeStore(state => state.isLoading);
  const init = useHomeStore(state => state.init);
  const shifts = useHomeStore(state => state.shifts);
  const { hasPermission, requestPermission } = useCameraPermission();
  
  const handleOpenAppSettings = async () => {
    openAppSetting();
  };
  
  const handleOpenCamera = async () => {
    navigation.navigate('ScanQR');
  };
  useEffect(() => {
    init();
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
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={themeColor.primary} />
      </View>
    );
  }
  
  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {shifts.map(shift => {
          const today = new Date(shift.date);
          const checkInEnd = new Date(shift.checkInEnd);
          checkInEnd.setFullYear(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
          );

          return (
            <View className="flex flex-col" key={shift.id}>
              <View
                style={{
                  width: width - 32,
                  backgroundColor: themeColor.background,
                }}
                className="mx-4 mt-4  p-4 rounded-lg relative"
              >
                <Text className="text-lg font-bold text-center">
                  {shift.address}
                </Text>
                <Text className="font-bold text-4xl text-center w-full">
                  {currentTime}
                </Text>
                {hasPermission ? (
                  <>
                    <View className="flex flex-col items-center rounded-full">
                      <TouchableOpacity
                        className="rounded-full justify-center items-center"
                        style={{
                          backgroundColor: themeColor.secondary,
                          width: 100,
                          height: 100,
                          justifyContent: 'center',
                        }}
                        onPress={handleOpenCamera}
                      >
                        <ScanQrCode size={35} color={themeColor.primary} />
                        <Text
                          className="text-center text-md font-bold"
                          style={{ color: themeColor.mutedForeground }}
                        >
                          Chấm công
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <View>
                      <Text>
                        Vui lòng cấp quyền camera và vị trí để có thể chấm công
                      </Text>
                      <TouchableOpacity onPress={handleOpenAppSettings}>
                        <Text className="text-blue-500">Mở cài đặt ngay</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
              <View
                className="mx-4 mt-4  p-4 rounded-lg"
                style={{
                  backgroundColor: themeColor.background,
                }}
              >
                <Text>{shift.name}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default HomeScreen;

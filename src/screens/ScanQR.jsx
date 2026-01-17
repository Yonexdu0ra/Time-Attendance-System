import { Button } from '@/components/ui/button';
import Corner from '@/components/ui/Coner';
import { Text } from '@/components/ui/text';
import useLocation from '@/hooks/useLocation';
import useAttendanceStore from '@/store/useAttendanceStore';
import openAppSettings from '@/utils/openAppSetting';
import { useLayoutEffect, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import {
  Camera,
  useCodeScanner,
  useCameraPermission,
  useCameraDevice,
} from 'react-native-vision-camera';

function ScanQRScreen({ navigation }) {
  const { hasPermission, requestPermission } = useCameraPermission();
 
  const { hasPermissionLocation, position, error, requestPermission: requestLocationPermission } = useLocation();
  const handleOpenAppSettings = async () => {
    openAppSettings();
  };
  const { width } = useWindowDimensions();
  const [scanned, setScanned] = useState(false);
  const handleAttandance = useAttendanceStore(state => state.handleAttandance);
  const device = useCameraDevice('back', {
    physicalDevices: [
      'wide-angle-camera',
      'ultra-wide-angle-camera',
      'telephoto-camera',
    ],
  });

  const SCAN_SIZE = width * 0.7;
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (!scanned && codes.length > 0) {
        handleAttandance(codes[0].value);
        setScanned(true);
        navigation.navigate('Home');
        setScanned(false);
      }
    },
  });
  useLayoutEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
    if (!hasPermissionLocation) {
      requestLocationPermission();
    }
  }, [hasPermission, hasPermissionLocation]);

  if (!device) {
    return (
      <View>
        <Text>
          Điện thoại của bạn không hỗ trợ camera phù hợp để quét mã QR. Vui lòng
          lòng liên hệ bộ phận hỗ trợ để chấm công theo cách khác
        </Text>
      </View>
    );
  }
  if (!hasPermission || !hasPermissionLocation) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-background gap-4">
        {!hasPermission && (
          <Text className={'text-center font-bold'}>
            Ứng dụng không có quyền truy cập camera. Vui lòng cấp quyền trong
            cài đặt.
          </Text>
        )}

        {!hasPermissionLocation && (
          <Text className={'text-center font-bold'}>
            Ứng dụng không có quyền truy cập vị trí. Vui lòng cấp quyền trong
            cài đặt.
          </Text>
        )}

        <Button variant={'link'} onPress={handleOpenAppSettings}>
          <Text>Mở cài đặt ngay</Text>
        </Button>
      </View>
    );
  }
  return (
    <>
      <View className="flex-1 relative bg-background">
        <Camera
          style={{ flex: 1 }}
          codeScanner={codeScanner}
          device={device}
          isActive={true}
        />
        <View
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: SCAN_SIZE, height: SCAN_SIZE }}
        >
          <Corner position="top-left" />
          <Corner position="top-right" />
          <Corner position="bottom-left" />
          <Corner position="bottom-right" />
        </View>
      </View>
    </>
  );
}

export default ScanQRScreen;

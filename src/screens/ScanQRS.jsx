import Corner from '@/components/ui/Coner';
import { Text } from '@/components/ui/text';
import useAttendanceStore from '@/store/useAttendanceStore';
import { useEffect, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Toast from 'react-native-toast-message';
import {
  Camera,
  useCodeScanner,
  useCameraPermission,
  useCameraDevice,
} from 'react-native-vision-camera';

function ScanQRScreen({ navigation }) {
  const { hasPermission, requestPermission } = useCameraPermission();
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
        // Toast.show({
        //   type: 'success',
        //   text1: 'Quét mã QR thành công',
        //   text2: `Giá trị: ${codes[0].value}`,
        // });
        handleAttandance(codes[0].value)
        setScanned(true);
        navigation.goBack();
      }
    },
  });
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

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
  if (!hasPermission) {
    <View>
      <Text>
        Không có quyền truy cập camera, vui lòng cấp quyền để tiếp tục.
      </Text>
    </View>;
  }
  return (
    <>
      <View className="flex-1 relative">
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

import { Text } from '@/components/ui/text';
import accessTokenStore from '@/store/accessTokenStore';
import useStreamQRStore from '@/store/streamQRStore';
import { useEffect } from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
function StreamQRScreen({ navigation, route }) {
  const { shiftId } = route.params;
  const accessToken = accessTokenStore(state => state.accessToken);
//   const setAccessToken = useStreamQRStore(state => state.setAccessToken);
  const streamQR = useStreamQRStore(state => state.streamQR);

  const isLoading = useStreamQRStore(state => state.isLoading);
  const startStream = useStreamQRStore(state => state.startStream);
  const stopStream = useStreamQRStore(state => state.stopStream);
  
  useEffect(() => {
    if (shiftId) {
    //   setAccessToken(accessToken);
      startStream(shiftId, accessToken);
    }
    return () => {
      stopStream();
    }
  }, [shiftId]);
  return (
    <View style={{ alignItems: 'center', marginTop: 40 }}>
      {isLoading ? (
        <Text>Đang tải mã QR...</Text>
      ) : (
        <QRCode
          value="https://example.com"
          size={200}
          color="black"
          backgroundColor="white"
        />
        //   <Text>{shiftId}</Text>
      )}
    </View>
  );
}

export default StreamQRScreen;

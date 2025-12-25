import { Progress } from '@/components/ui/progress';
import { Text } from '@/components/ui/text';
import useCurrentTime from '@/hooks/useCurrrentTime';
import useTimeCountDown from '@/hooks/useTimeCountDown';
import accessTokenStore from '@/store/accessTokenStore';
import useStreamQRStore from '@/store/streamQRStore';
import formatTime from '@/utils/formatTime';
import { useEffect } from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
function StreamQRScreen({ navigation, route }) {
  const { shiftId, shiftName } = route.params;
  const accessToken = accessTokenStore(state => state.accessToken);

  //   const setAccessToken = useStreamQRStore(state => state.setAccessToken);
  const streamQR = useStreamQRStore(state => state.streamQR);
  const { progress, setTargetDate } = useTimeCountDown(streamQR?.expired);
  const isLoading = useStreamQRStore(state => state.isLoading);
  const startStream = useStreamQRStore(state => state.startStream);
  const stopStream = useStreamQRStore(state => state.stopStream);

  const currentTime = useCurrentTime();
  useEffect(() => {
    if (shiftId) {
      //   setAccessToken(accessToken);
      startStream(shiftId, accessToken);
    }
    return () => {
      stopStream();
    };
  }, [shiftId]);

  return (
    <View className="flex-1 items-center justify-center gap-4">
      {isLoading ? (
        <Text>Đang tải mã QR...</Text>
      ) : (
        <View className="items-center justify-center gap-2">
          <View className="border p-2 rounded-lg gap-2">
            <QRCode value={streamQR?.data} size={300} />
            <Text className={'text-center font-bold'}>{shiftName}</Text>
          </View>
          <Text className={'text-center text-muted-foreground'}>
            Quét mã này để chấm công
          </Text>
          <Text className={'text-center text-muted-foreground'}>
            Mã QR sẽ được làm mới lúc:{' '}
            <Text>{formatTime(new Date(streamQR?.expired))}</Text>
          </Text>
          <Text className={'text-center text-muted-foreground'}>
            Thời gian hiện tại: <Text>{currentTime}</Text>
          </Text>
        </View>
      )}
    </View>
  );
}

export default StreamQRScreen;


import { Text } from '@/components/ui/text';
import useTimeProgress from '@/hooks/useTimeProgess';
import accessTokenStore from '@/store/accessTokenStore';
import useStreamQRStore from '@/store/streamQRStore';
import formatTime from '@/utils/formatTime';
import { useEffect, useLayoutEffect } from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Animated, {
  FadeInDown,
} from 'react-native-reanimated';
import * as Progress from 'react-native-progress';

function StreamQRScreen({ navigation, route }) {
  const { shiftId, shiftName } = route.params;
  const accessToken = accessTokenStore(state => state.accessToken);
  const streamQR = useStreamQRStore(state => state.streamQR);
  const progress = useTimeProgress(streamQR?.expired, 500);
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
    };
  }, [shiftId]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: '',
    });
  }, [navigation]);

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background">
      {isLoading ? (
        <Text>Đang tải mã QR...</Text>
      ) : (
        <Animated.View
          entering={FadeInDown.delay(100)}
          className="items-center justify-center gap-2"
        >
          <View className="border p-2 rounded-lg gap-2 bg-secondary">
            <QRCode value={streamQR?.data} size={300} />
            <Text className={'text-center font-bold'}>{shiftName}</Text>
          </View>
          <Text className={'text-center text-muted-foreground'}>
            Quét mã qr để chấm công
          </Text>
          <Progress.Pie   progress={progress} size={50}  />
          <Text className={'text-center text-muted-foreground'}>
            Mã sẽ được làm mới lúc:
            <Text>{formatTime(new Date(streamQR?.expired))}</Text>
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

export default StreamQRScreen;

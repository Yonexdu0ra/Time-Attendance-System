import { Text } from '@/components/ui/text';
import useAuthStore from '@/store/authStore';
import { useLayoutEffect } from 'react';
import { Image, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

function QrCodeProfileScreen({ navigation }) {
  const user = useAuthStore(state => state.user);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'QR Code',
      headerShown: true,
    });
  }, [navigation]);
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <View className="justify-center items-center w-full px-4">
        <View className="flex flex-row items-center gap-4">
          <Image
            source={{ uri: 'https://github.com/shadcn.png' }}
            className="w-14 h-14 rounded-full self-center mb-4"
          />
          <Text> {user.fullName}</Text>
        </View>
        <View className="justify-center items-center gap-4 px-4 py-2">
          <View className="border rounded p-2">
            <QRCode value={user?.id} size={300} />
          </View>
          
        </View>
      </View>
    </View>
  );
}

export default QrCodeProfileScreen;

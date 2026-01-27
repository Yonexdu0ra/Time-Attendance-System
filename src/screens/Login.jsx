import { View, Pressable, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { use, useEffect, useLayoutEffect, useState } from 'react';
import { request } from '../utils/request';
import useAuthStore from '../store/authStore';
import accessTokenStore from '../store/accessTokenStore';
import { saveRefreshToken } from '../utils/token';
import DeviceInfo from 'react-native-device-info';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { storage } from '@/utils/storage';
import { toast } from 'sonner-native';
export default function LoginScreen({ navigation }) {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const isDisabled = !formData.identifier || !formData.password;

  const user = useAuthStore.getState().user;
  const handlePressLogin = async () => {
    try {
      
      // const device = {
      //   deviceId: await DeviceInfo.getUniqueId(),
      //   deviceName: await DeviceInfo.getDeviceName(),
      //   platform: Platform.OS,
      //   // osVersion: DeviceInfo.getSystemVersion(),
      //   // appVersion: DeviceInfo.getVersion(),
      //   // isEmulator: await DeviceInfo.isEmulator(),
      // };
      
      const data = await request('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'app-platform': Platform.OS,
          'app-device-name': await DeviceInfo.getDeviceName(),
          'app-device-id': await DeviceInfo.getUniqueId(),
        },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password,
        }),
      });
      accessTokenStore.getState().setAccessToken(data.data.accessToken);
      storage.set('accessToken', data.data.accessToken);
      useAuthStore.setState({ user: data.data.user });
      const configData = await request('/config')
      useAuthStore.setState({ config: configData.data });
      await saveRefreshToken(data.data.refreshToken);
      toast.success('Đăng nhập thành công');
    } catch (error) {
      console.log(error);

      toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      return;
    }
  };

  const handleChangePassword = text => {
    setFormData(prev => ({ ...prev, password: text }));
  };
  const handleChangeidentifier = text => {
    setFormData(prev => ({ ...prev, identifier: text }));
  };
  useLayoutEffect(() => {
    if (user) {
      navigation.replace('Home');
    }
  }, [navigation]);
  return (
    <View
      className="flex-1 bg-background"
      
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          gap: 4
        }}
        className="px-4"
        keyboardShouldPersistTaps="always"
      >
        <View>
          <Text className="text-2xl font-bold my-4">
            Đăng nhập để tiếp tục sử dụng ứng dụng.
          </Text>
        </View>
        <View className="flex flex-col gap-4">
          <View>
            <Input
              value={formData.identifier}
              onChangeText={handleChangeidentifier}
              placeholder="Email hoặc số điện thoại"
            />
          </View>
          <View>
            <Input
              secureTextEntry
              value={formData.password}
              onChangeText={handleChangePassword}
              placeholder="Mật khẩu"
            />
          </View>
        </View>
        <View className="flex gap-2 mt-4">
          <Button onPress={handlePressLogin} disabled={isDisabled}><Text>Đăng nhập</Text></Button>
          <Button variant="link">
            <Text>Quên mật khẩu?</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

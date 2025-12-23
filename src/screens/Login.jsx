import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { use, useEffect, useLayoutEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import Input from '../components/Input';
import Button from '../components/Button';
import { request } from '../utils/request';
import useAuthStore from '../store/authStore';
import accessTokenStore from '../store/accessTokenStore';
import { saveRefreshToken } from '../utils/token';
export default function LoginScreen({ navigation }) {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const isDisabled = !formData.identifier || !formData.password;

  const user = useAuthStore.getState().user;
  const { themeColor } = useTheme();
  const handlePressLogin = async () => {
    // setFormData({ identifier: '', password: '' });
    try {
      const data = await request('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password,
        }),
      });
      accessTokenStore.getState().setAccessToken(data.data.accessToken);
      useAuthStore.setState({ user: data.data.user });
      await saveRefreshToken(data.data.refreshToken);
      Toast.show({
        type: 'success',
        text1: 'Đăng nhập thành công',
        text2: JSON.stringify(data.message),
      });
      
    } catch (error) {
      console.log(error);
      
      Toast.show({
        type: 'error',
        text1: 'Đăng nhập thất bại',
        text2: error.message || 'Vui lòng kiểm tra lại thông tin đăng nhập',
      });
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
    if(user) {
      navigation.replace('Home');
    }
  }, [navigation]);
  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: themeColor.background }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
        }}
        className="px-6"
        keyboardShouldPersistTaps="always"
      >
        <View>
          <Text
            style={{ color: themeColor.text }}
            className="text-2xl font-bold my-4"
          >
            Đăng nhập để tiếp tục sử dụng ứng dụng.
          </Text>
        </View>
        <View className="flex flex-col ">
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
        <View className="gap-2">
          <Pressable
            disabled={isDisabled}
            className="h-[48] rounded-[12px] flex items-center justify-center "
            style={{
              backgroundColor: themeColor.primary,
              opacity: isDisabled ? 0.5 : 1,
            }}
            onPress={handlePressLogin}
          >
            {({ pressed }) => (
              <Text
                className="text-base font-medium"
                style={{
                  color: themeColor.primaryForeground,
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                }}
              >
                Đăng nhập
              </Text>
            )}
          </Pressable>
          <Button title="Quên mật khẩu?" variant="link" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

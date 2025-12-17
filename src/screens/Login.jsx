import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
export default function LoginScreen({ navigation }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const isDisabled = !formData.username || !formData.password;

  const { themeColor } = useTheme();
  const handlePressLogin = () => {
    // setFormData({ username: '', password: '' });
    Toast.show({
      type: 'success',
      text1: 'Đăng nhập thành công',
      text2: 'Chào mừng bạn đã đến với hệ thống chấm công!',
      position: 'bottom',
      onPress: () => {
        Toast.hide();
      }
    })
  };

  const handleChangePassword = text => {
    setFormData(prev => ({ ...prev, password: text }));
  };
  const handleChangeUsername = text => {
    setFormData(prev => ({ ...prev, username: text }));
  };

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
            Đăng nhập vào hệ thống chấm công
          </Text>
        </View>
        <View className="flex flex-col gap-4 my-4">
          <View>
            <TextInput
              className="h-[48] px-[14px] rounded-[12px] border"
              style={{
                // backgroundColor: themeColor.card,
                backgroundColor: themeColor.card,
                color: themeColor.foreground,
                borderColor: themeColor.border,
              }}
              value={formData.username}
              onChangeText={handleChangeUsername}
              placeholder="Email hoặc số điện thoại"
              placeholderTextColor={themeColor.mutedForeground}
            />
          </View>
          <View>
            <TextInput
              className="h-[48] px-[14px] rounded-[12px] border"
              style={{
                // backgroundColor: themeColor.card,
                backgroundColor: themeColor.card,
                color: themeColor.foreground,
                borderColor: themeColor.border,
              }}
              secureTextEntry
              value={formData.password}
              onChangeText={handleChangePassword}
              placeholder="Mật khẩu"
              placeholderTextColor={themeColor.mutedForeground}
            />
          </View>
        </View>
        <Pressable
          disabled={isDisabled}
          className="h-[48] rounded-[12px] flex items-center justify-center mt-4"
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
        <Text className="text-center mt-4 text-blue-500">Quên mật khẩu?</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

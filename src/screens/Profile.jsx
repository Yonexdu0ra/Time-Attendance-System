import { useLayoutEffect, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import useAuthStore from '../store/authStore';
import { Text } from '@/components/ui/text';
import { Switch } from '@/components/ui/switch';
import { QrCode, Settings } from 'lucide-react-native';

function ProfileScreen({ navigation }) {
  const user = useAuthStore.getState().user;
  const { themeColor, toggleColorScheme, theme } = useTheme();
  const logout = useAuthStore(state => state.logout);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          className="font-bold ml-4 "
          onPress={() => navigation.getParent()?.push('QrCodeProfile')}
        >
          <QrCode size={24} color={themeColor.foreground} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          className="font-bold mr-4 "
          onPress={() => navigation.getParent()?.push('Settings')}
        >
          <Settings size={24} color={themeColor.foreground} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, themeColor]);
  return (
    <View
      className="flex-1 justify-center items-center"
      style={{ backgroundColor: themeColor.background }}
    >
      <ScrollView
        className="w-full px-4"
        contentContainerStyle={{ paddingVertical: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={{ uri: user.avatarUrl }}
          className="w-24 h-24 rounded-full self-center mb-4"
        />

        <View className="flex flex-col gap-2">
          <Text variant="muted" className={'font-bold'}>
            Giao diện
          </Text>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={toggleColorScheme}
          />
        </View>
        <View className="flex flex-col gap-2">
          <Text variant="muted" className={'font-bold'}>
            Chức vụ
          </Text>
          <Input value={user.position?.name} disabled />
        </View>
        <View className="flex flex-col gap-2">
          <Text variant="muted" className={'font-bold'}>
            Họ và tên
          </Text>
          <Input value={user.fullName} />
        </View>
        <View className="flex flex-col gap-2">
          <Text variant="muted" className={'font-bold'}>
            Email
          </Text>
          <Input value={user.email} />
        </View>
        <View className="flex flex-col gap-2">
          <Text variant="muted" className={'font-bold'}>
            Số điện thoại
          </Text>
          <Input value={user.phone} />
        </View>
        <View className="flex flex-col gap-2">
          <Text variant="muted" className={'font-bold'}>
            Ngày sinh
          </Text>
          <Input value={user.birthday} />
        </View>
        <View className="flex flex-col gap-2">
          <Text variant="muted" className={'font-bold'}>
            Địa chỉ
          </Text>
          <Input value={user.address} />
        </View>
        <Button className="mt-4">
          <Text>Cập nhật</Text>
        </Button>
        <Button
          className={'mt-4'}
          onPress={() => logout()}
          variant="destructive"
        >
          <Text>Đăng xuất</Text>
        </Button>
      </ScrollView>
    </View>
  );
}

export default ProfileScreen;

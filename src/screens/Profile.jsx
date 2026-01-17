import { useLayoutEffect } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import useAuthStore from '../store/authStore';
import { Text } from '@/components/ui/text';
import { QrCode, Settings } from 'lucide-react-native';

function InfoRow({ label, value }) {
  return (
    <View className="bg-secondary rounded-xl p-4 gap-1">
      <Text className="text-xs text-muted-foreground font-semibold">
        {label}
      </Text>
      <Text className="text-base">
        {value || '—'}
      </Text>
    </View>
  );
}

function ProfileScreen({ navigation }) {
  const user = useAuthStore.getState().user;
  const { themeColor } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Hồ sơ cá nhân',
      headerLeft: () => (
        <TouchableOpacity
          className="ml-4"
          onPress={() => navigation.getParent()?.push('QrCodeProfile')}
        >
          <QrCode size={22} color={themeColor.foreground} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          className="mr-4"
          onPress={() => navigation.getParent()?.push('Settings')}
        >
          <Settings size={22} color={themeColor.foreground} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, themeColor]);

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: themeColor.background }}
    >
      <ScrollView
        className="px-4"
        contentContainerStyle={{ paddingVertical: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== AVATAR ===== */}
        <View className="items-center mb-6">
          <Image
            source={{ uri: user.avatarUrl }}
            className="w-24 h-24 rounded-full mb-3"
          />
          <Text className="text-lg font-bold">
            {user.fullName}
          </Text>
          <Text className="text-sm text-muted-foreground">
            {user.position?.name}
          </Text>
        </View>

        {/* ===== INFO ===== */}
        <View className="gap-3">
          <InfoRow label="Phòng ban" value={user.department.name} />
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Số điện thoại" value={user.phone} />
          <InfoRow label="Ngày sinh" value={user.birthday} />
          <InfoRow label="Địa chỉ" value={user.address} />
        </View>

        {/* ===== NOTE ===== */}
        <View className="mt-6 items-center">
          <Text className="text-xs text-muted-foreground text-center">
            Thông tin cá nhân được quản lý bởi hệ thống nhân sự{'\n'}
            Nếu cần chỉnh sửa, vui lòng liên hệ quản trị
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default ProfileScreen;

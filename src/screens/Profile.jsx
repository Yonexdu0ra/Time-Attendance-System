import { useLayoutEffect } from 'react';
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import useAuthStore from '../store/authStore';
import { Text } from '@/components/ui/text';
import { QrCode, Settings } from 'lucide-react-native';

/* ===== INFO ROW ===== */
function InfoRow({ label, value }) {
  return (
    <View className="bg-card border border-border rounded-2xl px-4 py-3">
      <Text className="text-xs text-muted-foreground font-medium mb-1">
        {label}
      </Text>
      <Text className="text-base">
        {value || '—'}
      </Text>
    </View>
  );
}

/* ===== SECTION ===== */
function Section({ title, children }) {
  return (
    <View className="gap-3">
      <Text className="text-sm font-semibold text-muted-foreground">
        {title}
      </Text>
      {children}
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
          onPress={() =>
            navigation.getParent()?.push('QrCodeProfile')
          }
        >
          <QrCode size={22} color={themeColor.foreground} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          className="mr-4"
          onPress={() =>
            navigation.getParent()?.push('Settings')
          }
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 24,
          paddingBottom: 32,
        }}
      >
        {/* ===== PROFILE CARD ===== */}
        <View className="items-center bg-card border border-border rounded-3xl p-6 mb-6 shadow-sm">
          <View className="relative mb-4">
            <View className="w-28 h-28 rounded-full bg-muted items-center justify-center overflow-hidden border-4 border-background">
              <Image
                source={{
                  uri: user?.avatarUrl 
                }}
                style={{
                  width: 112,
                  height: 112,
                }}
              />
            </View>
          </View>

          <Text className="text-xl font-bold">
            {user.fullName}
          </Text>

          <Text className="text-sm text-muted-foreground mt-1">
            {user.position?.name || '—'}
          </Text>

          <View className="mt-3 px-3 py-1 rounded-full bg-primary/10">
            <Text className="text-xs font-semibold text-primary">
              {user.department?.name || '—'}
            </Text>
          </View>
        </View>

        {/* ===== PERSONAL INFO ===== */}
        <Section title="Thông tin cá nhân">
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Số điện thoại" value={user.phone} />
          <InfoRow label="Ngày sinh" value={new Date(user.birthday).toLocaleDateString()} />
          <InfoRow label="Địa chỉ" value={user.address} />
        </Section>

        {/* ===== WORK INFO ===== */}
        <View className="mt-6">
          <Section title="Thông tin công việc">
            <InfoRow
              label="Phòng ban"
              value={user.department?.name}
            />
            <InfoRow
              label="Chức vụ"
              value={user.position?.name}
            />
          </Section>
        </View>

        {/* ===== NOTE ===== */}
        <View className="mt-8 px-6 py-4 bg-muted/40 rounded-2xl">
          <Text className="text-xs text-muted-foreground text-center leading-5">
            Thông tin cá nhân được quản lý bởi hệ thống nhân sự.{'\n'}
            Nếu cần chỉnh sửa, vui lòng liên hệ quản trị viên.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default ProfileScreen;

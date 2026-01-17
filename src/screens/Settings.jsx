import Button from '@/components/Button';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/context/ThemeContext';
import useAuthStore from '@/store/authStore';
import { useEffect } from 'react';
import { View } from 'react-native';

function SettingScreen({ navigation }) {
  const logout = useAuthStore(state => state.logout);
  const { theme, toggleColorScheme } = useTheme();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Cài đặt',
      headerShown: true,
    });
  }, []);
  return (
    <View className="flex-1 bg-background">
      <View className="p-4 ">
        <View className="flex-row justify-between items-center mb-4 ">
          <Text className={'text-xl text-muted-foreground'}>Giao diện tối</Text>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={() => toggleColorScheme()}
          />
        </View>

        <Button
          className={'mt-4'}
          onPress={() => logout()}
          variant="destructive"
        >
          <Text>Đăng xuất</Text>
        </Button>
      </View>
    </View>
  );
}

export default SettingScreen;

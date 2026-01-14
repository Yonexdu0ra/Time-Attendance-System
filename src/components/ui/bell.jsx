import { TouchableOpacity } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Badge } from '@/components/ui/badge';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import useNotificationStore from '@/store/notificationStore';
import { Text } from '@/components/ui/text';
import { Bell as BellIcon } from 'lucide-react-native';
import { useEffect } from 'react';

export function Bell() {
  const navigation = useNavigation();
  const unReadCount = useNotificationStore(state => state.unReadCount);
  const { themeColor } = useTheme();
  const initNotification = useNotificationStore(state => state.init);
    useEffect(() => {
    const t = setTimeout(() => {
      initNotification();
    }, 150); // đợi animation xong

    return () => clearTimeout(t);
  }, []);
  return (
    <TouchableOpacity
      className="mr-4"
      onPress={() => navigation?.getParent()?.push('Notification')}
    >
      <Animated.View className="relative" entering={FadeInRight.delay(500)}>
        <BellIcon size={24} color={themeColor.foreground} />
        {unReadCount > 0 && (
          <Badge variant={'destructive'} className={'absolute -right-3 -top-3'}>
            <Text>{unReadCount}</Text>
          </Badge>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}



import { Image, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { Text } from './text';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '@/store/authStore';

function HeaderLeft() {
  const navigation = useNavigation();
  const user = useAuthStore(state => state.user);
  return (
    <Animated.View entering={FadeInLeft.delay(500)}>
      <TouchableOpacity
        className="ml-4"
        onPress={() => navigation?.push('Profile')}
      >
        <View className="flex-row items-center gap-2">
          <Image
            source={{
              uri: user.avatarUrl,
            }}
            className="w-10 h-10 rounded-full "
          />
          <Text className={'font-bold'}>{user.fullName}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default HeaderLeft;

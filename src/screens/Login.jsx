import { useNavigation } from '@react-navigation/native';
import { View, Text, ImageBackground, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { MaterialIcons } from '@expo/vector-icons'; // hoặc react-native-vector-icons

export default function LoginScreen() {
    const navigation = useNavigation()
    const handlePressLogin = () => {
        navigation.push('RootTab')
    }
  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header Image */}
        <View className="h-64 overflow-hidden rounded-b-[48px]">
          <ImageBackground
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL5EKvgmei1h0dZcChjFKTpd38Dq1aQMepi7VeSEIv1wU5JU72f42HnFEQjl1kW3Sn-NVvOnkR1MJGIT1_NppbGLwjUp0hvI2GUERWy9LgPHiOrEMJT8LlS6WRqFD9o2gF3IDagcreuwcf-d2WgWWK0K2He6q54wAidER-VdryLGm78ASKgf2A_LaEifihptBHqwSM8efrRiNKUY9x0g-zMZXlew2NHC8L5TZXcJGmeEnwiHGyt_yIdzD7P3CJbKMkfJoOD2NCr0M',
            }}
            resizeMode="cover"
            className="flex-1 justify-end"
          >
            <View className="items-center pb-6">
              <View className="h-16 w-16 rounded-2xl bg-primary items-center justify-center mb-3">
                {/* <MaterialIcons name="schedule" size={32} color="#112117" /> */}
              </View>
              <Text className="text-white text-lg font-semibold uppercase opacity-90">
                TimeKeeper
              </Text>
            </View>
          </ImageBackground>
        </View>

        {/* Content */}
        <View className="flex-1 px-6 pt-6 max-w-md mx-auto w-full">
          {/* Headline */}
          <View className="items-center mb-8">
            <Text className="text-white text-[32px] font-bold">Xin chào!</Text>
            <Text className="text-text-muted text-sm mt-2 text-center">
              Đăng nhập để bắt đầu ngày làm việc của bạn
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-5">
            {/* Username */}
            <View>
              <Text className="text-text-muted text-sm ml-4 mb-1">Tài khoản</Text>
              <View className="flex-row items-center bg-surface-dark border border-border-green rounded-xl h-14 px-4">
                {/* <MaterialIcons name="person" size={22} color="#95c6a9" /> */}
                <TextInput
                  placeholder="Mã nhân viên / Email"
                  placeholderTextColor="#95c6a980"
                  className="flex-1 text-white text-base ml-3"
                />
              </View>
            </View>

            {/* Password */}
            <View>
              <Text className="text-text-muted text-sm ml-4 mb-1">Mật khẩu</Text>
              <View className="flex-row items-center bg-surface-dark border border-border-green rounded-xl h-14 px-4">
                {/* <MaterialIcons name="lock" size={22} color="#95c6a9" /> */}
                <TextInput
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor="#95c6a980"
                  secureTextEntry
                  className="flex-1 text-white text-base ml-3"
                />
                {/* <MaterialIcons name="visibility" size={22} color="#95c6a9" /> */}
              </View>
            </View>

            {/* Forgot password */}
            <Pressable className="items-end pr-2">
              <Text className="text-primary text-sm font-medium">
                Quên mật khẩu?
              </Text>
            </Pressable>

            {/* Login Button */}
            <Pressable onPress={handlePressLogin} className="h-14 rounded-full bg-primary items-center justify-center flex-row gap-2 mt-4 active:scale-95">
              <Text className="text-background-dark text-lg font-bold">
                Đăng nhập
              </Text>
              {/* <MaterialIcons name="arrow-forward" size={22} color="#112117" /> */}
            </Pressable>
          </View>

          {/* Divider */}
          {/* <View className="mt-10 flex-row items-center">
            <View className="flex-1 h-px bg-border-green" />
            <Text className="mx-4 text-text-muted text-xs tracking-widest">
              HOẶC
            </Text>
            <View className="flex-1 h-px bg-border-green" />
          </View> */}

          {/* Face ID */}
          {/* <Pressable className="mt-6 items-center">
            <View className="h-16 w-16 rounded-2xl border border-border-green bg-surface-dark items-center justify-center">
              <MaterialIcons name="face" size={36} color="#36e27b" />
            </View>
            <Text className="mt-3 text-text-muted text-sm">
              Sử dụng Face ID
            </Text>
          </Pressable> */}
        </View>

        {/* Footer */}
        <View className="py-6 items-center">
          <Text className="text-text-muted/40 text-xs">
            Phiên bản 2.4.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

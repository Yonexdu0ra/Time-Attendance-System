import { View, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';

function SplashScreen() {
  const { themeColor } = useTheme();

  return (
    <View
      className="flex-1 justify-center items-center gap-4 text-[28]"
      style={{ backgroundColor: themeColor.background }}
    >
      <Text
        className="animate-pulse text-3xl font-bold"
        style={{
          color: themeColor.primary,
        }}
      >
        Tuyến Công CB
      </Text>
      
    </View>
  );
}

export default SplashScreen;

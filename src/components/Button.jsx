import React, { useRef, useState } from 'react';
import {
  Pressable,
  Text,
  Animated,
  ActivityIndicator,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Button({
  title,
  children,
  disabled = false,
  onPress,
  loading = false,
  variant = 'default',
  style,
  ...rest
}) {
  const { themeColor } = useTheme();

  const scale = useRef(new Animated.Value(1)).current;
  const [ripples, setRipples] = useState([]);
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const borderRadius = 16;

  const colorsForVariant = () => {
    switch (variant) {
      case 'outline':
        return { backgroundColor: 'transparent', borderColor: themeColor.border ?? themeColor.input, textColor: themeColor.foreground };
      case 'ghost':
        return { backgroundColor: 'transparent', borderColor: 'transparent', textColor: themeColor.foreground };
      case 'destructive':
        return { backgroundColor: themeColor.destructive, borderColor: 'transparent', textColor: themeColor.destructiveForeground };
      case 'secondary':
        return { backgroundColor: themeColor.secondary, borderColor: 'transparent', textColor: themeColor.secondaryForeground };
      case 'link':
        return { backgroundColor: 'transparent', borderColor: 'transparent', textColor: themeColor.primary, paddingHorizontal: 0, paddingVertical: 0 };
      case 'default':
      default:
        return { backgroundColor: themeColor.primary ?? '#6b21a8', borderColor: 'transparent', textColor: themeColor.primaryForeground ?? '#fff' };
    }
  };

  const vs = colorsForVariant();

  const animatePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, friction: 8, tension: 200 }).start();
  };

  const animatePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 8, tension: 200 }).start();
  };

  const onPressIn = (e) => {
    if (disabled || loading) return;
    animatePressIn();
    createRipple(e);
  };

  const onPressOut = () => {
    if (disabled || loading) return;
    animatePressOut();
  };

  const createRipple = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    const id = String(Date.now()) + Math.random();
    const anim = new Animated.Value(0);
    const size = Math.max(layout.width, layout.height) * 1.6 || 200;

    // Thêm ripple mới mà không xóa ripple cũ ngay, tránh lỗi khi nhấn liên tục
    setRipples((prev) => [...prev, { id, x: locationX, y: locationY, anim, size }]);

    Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }).start(() => {
      // Xóa ripple sau khi animation hoàn tất
      setRipples((prev) => prev.filter((r) => r.id !== id));
    });
  };

  const handlePress = (e) => {
    if (disabled || loading) return;
    if (typeof onPress === 'function') onPress(e);
  };

  return (
    <AnimatedPressable
      onLayout={(e) => setLayout(e.nativeEvent.layout)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={handlePress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: loading }}
      style={[
        {
          transform: [{ scale }],
          opacity: disabled ? 0.55 : 1,
          backgroundColor: vs.backgroundColor,
          borderColor: vs.borderColor,
          borderWidth: vs.borderColor !== 'transparent' ? 1 : 0,
          borderRadius,
          paddingHorizontal: vs.paddingHorizontal ?? 16,
          paddingVertical: vs.paddingVertical ?? 12,
          overflow: 'hidden',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
            android: { elevation: 2 },
          }),
        },
        style,
      ]}
      {...rest}
    >
      {/* ripple */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {ripples.map((r) => {
          const rippleStyle = {
            position: 'absolute',
            left: r.x - r.size / 2,
            top: r.y - r.size / 2,
            width: r.size,
            height: r.size,
            borderRadius: r.size / 2,
            backgroundColor: vs.textColor,
            opacity: r.anim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.14, 0.08, 0] }),
            transform: [{ scale: r.anim.interpolate({ inputRange: [0, 1], outputRange: [0.1, 1] }) }],
          };
          return <Animated.View key={r.id} style={rippleStyle} />;
        })}
      </View>

      {loading && <ActivityIndicator style={{ marginRight: 8 }} color={vs.textColor} />}

      {title ? (
        <Text style={{ color: vs.textColor, fontSize: 15, fontWeight: '600' }} numberOfLines={1}>
          {title}
        </Text>
      ) : (
        children || null
      )}
    </AnimatedPressable>
  );
}

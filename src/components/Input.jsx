import React, { useState } from 'react';
import { TextInput, View, Text, Pressable } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Eye, EyeOff } from 'lucide-react-native';

export default function Input({
  value,
  onChangeText,
  placeholder = '',
  style,
  secureTextEntry = false,
  error = '',
  disabled = false, // thêm prop disabled
  ...rest
}) {
  const { themeColor } = useTheme();
  const [showPassword, setShowPassword] = useState(!secureTextEntry);
  const [focused, setFocused] = useState(false);
  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);
  return (
    <View style={{ marginBottom: error ? 4 : 16 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 48,
          paddingHorizontal: 16,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: focused ? themeColor.primary :error
            ? themeColor.destructive
            : disabled
            ? themeColor.mutedForeground
            : themeColor.border,
          backgroundColor: disabled
            ? themeColor.background
            : themeColor.secondary,
          opacity: disabled ? 0.6 : 1, // mờ khi disabled
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={themeColor.mutedForeground}
          secureTextEntry={secureTextEntry && !showPassword}
          editable={!disabled} // vô hiệu hóa input
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{
            flex: 1,
            color: themeColor.foreground,
            fontSize: 15,
          }}
          
          {...rest}
        />
        {secureTextEntry && (
          <Pressable
            onPress={() => setShowPassword((prev) => !prev)}
            disabled={disabled} // vô hiệu hóa press
          >
            {showPassword ? (
              <Eye size={20} color={themeColor.mutedForeground} />
            ) : (
              <EyeOff size={20} color={themeColor.mutedForeground} />
            )}
          </Pressable>
        )}
      </View>
      {error ? (
        <Text style={{ color: themeColor.destructive, fontSize: 12, marginTop: 4 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

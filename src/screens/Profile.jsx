import { useLayoutEffect, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Input from '../components/Input';
import Button from '../components/Button';
import useAuthStore from '../store/authStore';

function ProfileScreen({ navigation }) {
  const user = useAuthStore.getState().user;
  const { themeColor } = useTheme();
  
  
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
          source={{ uri: 'https://github.com/shadcn.png' }}
          className="w-24 h-24 rounded-full self-center mb-4"
        />
        <View className="flex flex-col gap-2">
          <Text style={{ color: themeColor.mutedForeground }}>
            Mã nhân viên
          </Text>
          <Input value={user.employment_code} disabled />
        </View>
        <View className="flex flex-col gap-2">
          <Text style={{ color: themeColor.mutedForeground }}>Chức vụ</Text>
          <Input value={user.position?.name} disabled />
        </View>
        <View className="flex flex-col gap-2">
          <Text style={{ color: themeColor.mutedForeground }}>Họ và tên</Text>
          <Input value={user.fullName} />
        </View>
        <View className="flex flex-col gap-2">
          <Text style={{ color: themeColor.mutedForeground }}>Email</Text>
          <Input value={user.email} />
        </View>
        <View className="flex flex-col gap-2">
          <Text style={{ color: themeColor.mutedForeground }}>
            Số điện thoại
          </Text>
          <Input value={user.phone} />
        </View>
        <View className="flex flex-col gap-2">
          <Text style={{ color: themeColor.mutedForeground }}>Ngày sinh</Text>
          <Input value={user.birthday} />
        </View>
        <View className="flex flex-col gap-2">
          <Text style={{ color: themeColor.mutedForeground }}>Địa chỉ</Text>
          <Input value={user.address} />
        </View>
        <Button title="Cập nhật" />
      </ScrollView>
    </View>
  );
}

export default ProfileScreen;

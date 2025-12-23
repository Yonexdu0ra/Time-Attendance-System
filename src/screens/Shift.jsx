import { useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { Ellipsis } from 'lucide-react-native';
import { request } from '../utils/request';

const filterOptions = [
  { label: 'Tất cả', value: 'all', isActive: true },
  { label: 'Sắp tới', value: 'upcoming', isActive: false },
  { label: 'Đã hoàn thành', value: 'completed', isActive: false },
  { label: 'Chờ duyệt', value: 'pending', isActive: false },
  { label: 'Đã từ chối', value: 'rejected', isActive: false },
];
function ShiftScreen({ navigation }) {
  const { themeColor } = useTheme();
  const [loading, setLoading] = useState(true);
  const [shifts, setShifts] = useState([]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Ca làm việc',
    });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      try {
        const shiftData = await request('/shifts');
        console.log(shiftData);
        
        setShifts(shiftData.data);
      } catch (error) {
        console.log(error);
        
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <View className="flex-1" style={{ backgroundColor: themeColor.background }}>
      {/* <StatusBar
        barStyle="dark-content" // hoặc 'light-content' tùy màu chữ
        backgroundColor={themeColor.background} // Android
      /> */}
      <View className="p-4 gap-2">
        <Input placeholder="Tìm kiếm ca làm việc" />
        <ScrollView horizontal>
          {filterOptions.map((option, index) => (
            <Pressable
              key={index}
              className="px-[12px] py-[6px] mr-[8px] rounded-[20px] border"
              style={{
                borderColor: themeColor.border,
                backgroundColor: option.isActive
                  ? themeColor.primary
                  : themeColor.secondary,
              }}
            >
              <Text
                style={{
                  color: option.isActive
                    ? themeColor.background
                    : themeColor.text,
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <ScrollView>
        <View
          className="p-4 gap-4"
          style={{ backgroundColor: themeColor.secondary }}
        >
          {loading ? (
            <ActivityIndicator color={themeColor.primary} />
          ) : (
            shifts?.map(shift => (
              <View
                style={{
                  backgroundColor: themeColor.background,
                  borderColor: themeColor.border,
                }}
                key={shift.id}
                className="rounded-[12px] border px-4 py-2"
              >
                <View
                  className="p-4 mb-4  flex flex-row justify-between items-center"
                  style={{ borderColor: themeColor.border }}
                >
                  <Text
                    className="text-lg font-bold"
                    style={{ color: themeColor.text }}
                  >
                    {shift.name}
                  </Text>
                  <Text style={{ color: themeColor.mutedForeground }}>
                    {shift.type}
                  </Text>
                </View>
                <View>
                  <Text style={{ color: themeColor.mutedForeground }}>
                    {new Date(shift.workStart).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    -{' '}
                    {new Date(shift.workEnd).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                <View>
                  <Text style={{ color: themeColor.mutedForeground }}>
                    {shift.address || 'Chưa có địa điểm làm việc'}
                  </Text>
                </View>
                <View className="flex flex-row justify-between  gap-2">
                  <Button title={'Tham gia'} className="flex-1" />
                  <Button variant="secondary">
                    <Ellipsis />
                  </Button>
                </View>
              </View>
            ))
          )}
          {shifts?.length === 0 && (
            <Text
              style={{ color: themeColor.mutedForeground, textAlign: 'center' }}
            >
              Không có ca làm việc nào
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

export default ShiftScreen;

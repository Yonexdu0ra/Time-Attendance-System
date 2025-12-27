import { Text } from '@/components/ui/text';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RNDateTimePicker from '@react-native-community/datetimepicker';
LocaleConfig.locales['vi'] = {
  monthNames: [
    'Tháng Một',
    'Tháng Hai',
    'Tháng Ba',
    'Tháng Tư',
    'Tháng Năm',
    'Tháng Sáu',
    'Tháng Bảy',
    'Tháng Tám',
    'Tháng Chín',
    'Tháng Mười',
    'Tháng Mười Một',
    'Tháng Mười Hai',
  ],
  monthNamesShort: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ],
  dayNames: [
    'Chủ Nhật',
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
  ],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  today: 'Hôm nay',
};

LocaleConfig.defaultLocale = 'vi';
function OvertimeRequestScreen() {
  const [selected, setSelected] = useState('');
  const [isShowCalendar, setIsShowCalendar] = useState(false);
  const minDate = new Date().toISOString().split('T')[0];
  const [show, setShow] = useState({
    timeStart: false,
    timeEnd: false,
  });
  return (
    <View className="flex-1 p-4 gap-4 bg-background">
      <ScrollView
        contentContainerStyle={{ gap: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        {show.timeStart && (
          <RNDateTimePicker
            mode="time"
            value={new Date()}
          />
        )}
        {show.timeEnd && (
          <RNDateTimePicker
            mode="time" 
            value={new Date()}
          />
        )}
        <Text>Ngày tăng ca</Text>
        {isShowCalendar ? (
          <Calendar
            minDate={minDate}
            onDayPress={day => {
              setSelected(day.dateString);
              setIsShowCalendar(false);
            }}
            markedDates={{
              [selected]: {
                selected: true,
                selectedColor: 'green',
                marked: true,
              },
            }}
          />
        ) : (
          <Input
            value={selected}
            onPressIn={() => setIsShowCalendar(true)}
            placeholder="Chọn ngày làm thêm"
            disabled
          />
        )}
        <View className="flex flex-row gap-4">
          <View className="flex-1">
            <Text>Giờ bắt đầu</Text>
            <Input disabled onPressIn={() => setShow(prev => ({ ...prev, timeStart: true }))} placeholder="Chọn giờ bắt đầu" />
          </View>
          <View className="flex-1">
            <Text>Giờ kết thúc</Text>
            <Input disabled onPressIn={() => setShow(prev => ({ ...prev, timeEnd: true }))} placeholder="Chọn giờ kết thúc" />
          </View>
        </View>
        <View>
          <Text>Lý do tăng ca</Text>
          <Input
            multiline
            className="h-24 mt-2"
            numberOfLines={4}
            textAlignVertical="top"
            placeholder="Nhập lý do tăng ca của bạn để có thể giúp quản lý phê duyệt yêu cầu nhanh hơn"
          />
        </View>
      </ScrollView>
      <Button>
        <Text>Gửi yêu cầu</Text>
      </Button>
    </View>
  );
}

export default OvertimeRequestScreen;

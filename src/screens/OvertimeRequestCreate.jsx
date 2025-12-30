import { Text } from '@/components/ui/text';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useLayoutEffect, useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import useOvertimeRequestStore from '@/store/overtimeRequestStore';
import { useTheme } from '@/context/ThemeContext';
LocaleConfig.locales['vi'] = {
  monthNames: [
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
function OvertimeRequestScreen({ navigation }) {
  const [isShowCalendar, setIsShowCalendar] = useState(false);
  const minDate = new Date().toISOString().split('T')[0];
  const formData = useOvertimeRequestStore(state => state.formData);
  const setFormData = useOvertimeRequestStore(state => state.setFormData);
  const handleCreateOvertimeRequest = useOvertimeRequestStore(
    state => state.handleCreateOvertimeRequest,
  );
  const { themeColor } = useTheme();
  const [show, setShow] = useState({
    timeStart: false,
    timeEnd: false,
  });
  const onChange = (event, selectedDate) => {
    // Android có dismissed / set
    if (event.type !== 'set') {
      setShow({ startDate: false, endDate: false });
      return;
    }

    const date =
      Platform.OS === 'android'
        ? new Date(event.nativeEvent.timestamp)
        : selectedDate;

    if (!date || isNaN(date)) {
      setShow({ startDate: false, endDate: false });
      return;
    }

    setFormData({
      timeStart: show.timeStart ? date : safeTimeStart,
      timeEnd: show.timeEnd ? date : safeTimeEnd,
    });

    setShow({ timeStart: false, timeEnd: false });
  };
  const safeTimeStart =
    formData.timeStart instanceof Date ? formData.timeStart : new Date();

  const safeTimeEnd =
    formData.timeEnd instanceof Date ? formData.timeEnd : safeTimeStart;
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Yêu cầu làm thêm giờ',
      headerShown: true,
    });
  }, [navigation]);
  return (
    <View className="flex-1 p-4 gap-4 bg-background">
      <ScrollView
        contentContainerStyle={{ gap: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        {show.timeStart && (
          <RNDateTimePicker
            onChange={onChange}
            mode="time"
            value={safeTimeStart}
          />
        )}
        {show.timeEnd && (
          <RNDateTimePicker
            onChange={onChange}
            mode="time"
            value={safeTimeEnd}
          />
        )}
        <Text>Ngày tăng ca</Text>
        {isShowCalendar ? (
          <Calendar
            minDate={minDate}
            onDayPress={day => {
              console.log(day);

              // setSelected(day.dateString);
              setFormData({
                date: new Date(day.timestamp),
              });
              setIsShowCalendar(false);
            }}
            markedDates={{
              [formData.date ? formData.date.toISOString().split('T')[0] : '']:
                {
                  selected: true,
                  selectedColor: themeColor.primary,
                  // marked: true,
                },
            }}
          />
        ) : (
          <Button onPress={() => setIsShowCalendar(true)} variant={'outline'}>
            <Text>{formData.date ? formData.date.toISOString().split('T')[0] : 'Chọn ngày làm thêm'}</Text>
          </Button>
        )}
        <View className="flex flex-row gap-4">
          <View className="flex-1">
            <Text>Giờ bắt đầu</Text>

            <Button
              variant={'outline'}
              onPress={() =>
                setShow(prev => ({ timeStart: true, timeEnd: false }))
              }
            >
              <Text>
                {safeTimeStart
                  ? safeTimeStart.toLocaleTimeString()
                  : 'Chọn giờ bắt đầu'}
              </Text>
            </Button>
          </View>
          <View className="flex-1">
            <Text>Giờ kết thúc</Text>

            <Button
              variant={'outline'}
              onPress={() =>
                setShow(prev => ({ timeStart: false, timeEnd: true }))
              }
            >
              <Text>
                {safeTimeEnd
                  ? safeTimeEnd.toLocaleTimeString()
                  : 'Chọn giờ kết thúc'}
              </Text>
            </Button>
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
            onChangeText={text => setFormData({ reason: text })}
            // value={formData.reason}
          />
        </View>
      </ScrollView>
      <Button
        onPress={() => {
          handleCreateOvertimeRequest()
        }}
      >
        <Text>Gửi yêu cầu</Text>
      </Button>
    </View>
  );
}

export default OvertimeRequestScreen;

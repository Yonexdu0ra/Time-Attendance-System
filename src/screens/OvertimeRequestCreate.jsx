import { Text } from '@/components/ui/text';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useLayoutEffect, useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import useOvertimeRequestStore from '@/store/overtimeRequestStore';
import { useTheme } from '@/context/ThemeContext';

/* ================== CALENDAR LOCALE ================== */
LocaleConfig.locales['vi'] = {
  monthNames: [
    'Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
    'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12',
  ],
  monthNamesShort: [
    'Th1','Th2','Th3','Th4','Th5','Th6',
    'Th7','Th8','Th9','Th10','Th11','Th12',
  ],
  dayNames: [
    'Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy',
  ],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  today: 'Hôm nay',
};
LocaleConfig.defaultLocale = 'vi';

/* ================== SCREEN ================== */
function OvertimeRequestScreen({ navigation }) {
  const { themeColor } = useTheme();

  const formData = useOvertimeRequestStore(state => state.formData);
  const setFormData = useOvertimeRequestStore(state => state.setFormData);
  const handleCreateOvertimeRequest =
    useOvertimeRequestStore(state => state.handleCreateOvertimeRequest);

  const [isShowCalendar, setIsShowCalendar] = useState(false);
  const [show, setShow] = useState({ timeStart: false, timeEnd: false });

  const minDate = new Date().toISOString().split('T')[0];

  /* ---------- SAFE TIME ---------- */
  const safeTimeStart =
    formData.timeStart instanceof Date ? formData.timeStart : new Date();

  const safeTimeEnd =
    formData.timeEnd instanceof Date ? formData.timeEnd : safeTimeStart;

  /* ---------- TIME PICKER ---------- */
  const onChange = (event, selectedDate) => {
    if (event.type !== 'set') {
      setShow({ timeStart: false, timeEnd: false });
      return;
    }

    const date =
      Platform.OS === 'android'
        ? new Date(event.nativeEvent.timestamp)
        : selectedDate;

    if (!date || isNaN(date)) {
      setShow({ timeStart: false, timeEnd: false });
      return;
    }

    setFormData({
      timeStart: show.timeStart ? date : safeTimeStart,
      timeEnd: show.timeEnd ? date : safeTimeEnd,
    });

    setShow({ timeStart: false, timeEnd: false });
  };

  /* ---------- HEADER ---------- */
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Yêu cầu làm thêm giờ',
      headerShown: true,
    });
  }, [navigation]);

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* ================== DATE ================== */}
        <View className="gap-2">
          <Text className="font-medium">Ngày tăng ca</Text>

          {isShowCalendar ? (
            <Calendar
              minDate={minDate}
              onDayPress={day => {
                setFormData({ date: new Date(day.timestamp) });
                setIsShowCalendar(false);
              }}
              markedDates={{
                [formData.date
                  ? formData.date.toISOString().split('T')[0]
                  : '']: {
                  selected: true,
                  selectedColor: themeColor.primary,
                },
              }}
              theme={{
                todayTextColor: themeColor.primary,
                arrowColor: themeColor.primary,
              }}
            />
          ) : (
            <Button
              variant="outline"
              onPress={() => setIsShowCalendar(true)}
            >
              <Text>
                {formData.date
                  ? formData.date.toISOString().split('T')[0]
                  : 'Chọn ngày làm thêm'}
              </Text>
            </Button>
          )}
        </View>

        {/* ================== TIME ================== */}
        <View className="flex-row gap-4">
          <View className="flex-1 gap-2">
            <Text className="font-medium">Giờ bắt đầu</Text>
            <Button
              variant="outline"
              onPress={() => setShow({ timeStart: true, timeEnd: false })}
            >
              <Text>{safeTimeStart.toLocaleTimeString()}</Text>
            </Button>
          </View>

          <View className="flex-1 gap-2">
            <Text className="font-medium">Giờ kết thúc</Text>
            <Button
              variant="outline"
              onPress={() => setShow({ timeStart: false, timeEnd: true })}
            >
              <Text>{safeTimeEnd.toLocaleTimeString()}</Text>
            </Button>
          </View>
        </View>

        {/* TIME PICKERS */}
        {show.timeStart && (
          <RNDateTimePicker
            mode="time"
            value={safeTimeStart}
            onChange={onChange}
          />
        )}
        {show.timeEnd && (
          <RNDateTimePicker
            mode="time"
            value={safeTimeEnd}
            onChange={onChange}
          />
        )}

        {/* ================== REASON ================== */}
        <View className="gap-2">
          <Text className="font-medium">Lý do tăng ca</Text>
          <Input
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="h-28"
            placeholder="Nhập lý do tăng ca để quản lý dễ phê duyệt hơn"
            value={formData.reason}
            onChangeText={text => setFormData({ reason: text })}
          />
        </View>
      </ScrollView>

      {/* ================== SUBMIT ================== */}
      <View className="p-4 border-t border-border">
        <Button onPress={handleCreateOvertimeRequest}>
          <Text>Gửi yêu cầu</Text>
        </Button>
      </View>
    </View>
  );
}

export default OvertimeRequestScreen;

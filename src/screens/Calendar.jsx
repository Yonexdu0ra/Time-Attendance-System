import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/context/ThemeContext';
import useAuthStore from '@/store/authStore';
import useHolidayStore from '@/store/holidayStore';
import useShiftAttendanceStore from '@/store/shiftAttandanceStore';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Calendar, LocaleConfig, Agenda } from 'react-native-calendars';
import Animated, { FadeInUp } from 'react-native-reanimated';
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
function CalendarScreen({ navigation }) {
  const [selected, setSelected] = useState(
    new Date().toISOString().split('T')[0],
  );
  const {
    SHIFT_ATTENDANCE_STATUS_STRING,
    SHIFT_ATTENDANCE_TYPE_STRING,
    LEAVE_TYPE_STRING,
    SHIFT_ATTENDANCE_STATUS,
    SHIFT_ATTENDANCE_TYPE,
    LEAVE_TYPE,
    STATUS_TYPE_STRING,
    SHIFT_TYPE_STRING,
  } = useAuthStore(state => state.config);
  const holidayInit = useHolidayStore(state => state.init);
  const holidays = useHolidayStore(state => state.holidays);
  const shiftAttendanceInit = useShiftAttendanceStore(state => state.init);
  const shiftAttendances = useShiftAttendanceStore(
    state => state.shiftAttendances,
  );

  const { themeColor } = useTheme();
  const isRefreshing = useShiftAttendanceStore(state => state.isRefreshing);
  const handleRefreshShiftAttendances = useShiftAttendanceStore(
    state => state.handleRefreshShiftAttendances,
  );
  const markedDates = {
    [selected]: { selected: true, selectedColor: themeColor.primary },
  };
  holidays.forEach(holiday => {
    const dateKey = holiday.date.split('T')[0];
    if (!(dateKey in markedDates)) {
      markedDates[dateKey] = {
        marked: true,
        dotColor: 'red',
        selected: selected === dateKey,
        dots: [
          {
            key: holiday.id,
            type: 'holiday',
            color: 'red',
            selectedDotColor: 'red',
            name: holiday.name,
          },
        ],
      };
    } else {
      markedDates[dateKey] = {
        ...markedDates[dateKey],
        selected: selected === dateKey,
        dots: [
          ...(markedDates[dateKey].dots || []),
          {
            key: holiday.id,
            type: 'holiday',
            color: 'red',
            selectedDotColor: 'red',
            name: holiday.name,
          },
        ],
      };
    }
  });

  shiftAttendances.forEach(attendance => {
    const dateKey = attendance.attendAt.split('T')[0];
    if (!(dateKey in markedDates)) {
      markedDates[dateKey] = {
        marked: true,
        dotColor: 'blue',
        selected: selected === dateKey,
        dots: [
          {
            key: attendance.id,
            type: 'shiftAttendance',
            color: 'blue',
            selectedDotColor: 'blue',
            name: attendance.shift.name,
          },
        ],
      };
    } else {
      markedDates[dateKey] = {
        ...markedDates[dateKey],
        selected: selected === dateKey,
        dots: [
          ...(markedDates[dateKey].dots || []),
          {
            key: attendance.id,
            type: 'shiftAttendance',
            color: 'blue',
            selectedDotColor: 'blue',
            name: attendance.shift.name,
          },
        ],
      };
    }
  });
  const markedDateChoice = markedDates[selected]?.dots;

  useEffect(() => {
    holidayInit();
    shiftAttendanceInit();
  }, []);
  return (
    <View className="flex-1 px-4 pt-4 bg-background">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefreshShiftAttendances}
          />
        }
      >
        <Calendar
          onDayPress={day => {
            setSelected(day.dateString);
          }}
          markingType="multi-dot"
          markedDates={markedDates}
        />

        <Text>Thông tin</Text>
        <View>
          {!markedDateChoice && (
            <Text>Không có dữ liệu cho ngày: {selected}</Text>
          )}
          {markedDateChoice &&
            markedDateChoice.map((item, index) => (
              <Animated.View
                entering={FadeInUp.delay(index * 100)}
                key={item.key}
                className="p-2 my-2 border rounded-lg border-gray-300"
              >
                <Text className="font-bold">{item.name}</Text>
              </Animated.View>
            ))}
        </View>
        <Text>Lịch sử chấm công</Text>
        <View>
          {shiftAttendances?.map((attendance, index) => (
            <Animated.View
              entering={FadeInUp.delay(index * 100)}
              key={attendance.id}
              className="p-2 my-2 border rounded-lg "
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-bold">{attendance.shift.name}</Text>
                <Badge variant={'outline'}>
                  <Text>{SHIFT_TYPE_STRING[attendance.shift.type]}</Text>
                </Badge>
              </View>
              <Text>
                Chấm công lúc: <Text>{attendance.attendAt}</Text>
              </Text>
              <Text>
                Loại{' '}
                <Text>{SHIFT_ATTENDANCE_TYPE_STRING[attendance.type]}</Text>
              </Text>
              <Text>
                Trạng thái:{' '}
                <Text>{SHIFT_ATTENDANCE_STATUS_STRING[attendance.status]}</Text>
              </Text>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default CalendarScreen;

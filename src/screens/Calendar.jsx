import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/context/ThemeContext';
import useAuthStore from '@/store/authStore';
import useHolidayStore from '@/store/holidayStore';
import useShiftAttendanceStore from '@/store/shiftAttendanceStore';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Animated, { FadeInUp } from 'react-native-reanimated';

/* ---------- Locale ---------- */
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
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
};
LocaleConfig.defaultLocale = 'vi';

function CalendarScreen() {
  const [selected, setSelected] = useState(
    new Date().toISOString().split('T')[0],
  );

  const {
    SHIFT_ATTENDANCE_STATUS_STRING,
    SHIFT_ATTENDANCE_TYPE_STRING,
    SHIFT_TYPE_STRING,
  } = useAuthStore(state => state.config);

  const holidayInit = useHolidayStore(state => state.init);
  const holidays = useHolidayStore(state => state.holidays);

  const shiftAttendanceInit = useShiftAttendanceStore(state => state.init);
  const shiftAttendances = useShiftAttendanceStore(
    state => state.shiftAttendances,
  );
  const isRefreshing = useShiftAttendanceStore(state => state.isRefreshing);
  const handleRefreshShiftAttendances = useShiftAttendanceStore(
    state => state.handleRefreshShiftAttendances,
  );

  const { themeColor } = useTheme();

  useEffect(() => {
    holidayInit();
    shiftAttendanceInit();
  }, []);

  /* ---------- Marked dates ---------- */
  const markedDates = useMemo(() => {
    const result = {
      [selected]: { selected: true, selectedColor: themeColor.primary },
    };

    holidays.forEach(h => {
      const d = h.date.split('T')[0];
      result[d] = {
        ...(result[d] || {}),
        marked: true,
        dots: [
          ...(result[d]?.dots || []),
          {
            key: h.id,
            color: themeColor.error, // đỏ theo theme
            name: h.name,
          },
        ],
      };
    });

    shiftAttendances.forEach(a => {
      const d = a.attendAt.split('T')[0];
      result[d] = {
        ...(result[d] || {}),
        marked: true,
        dots: [
          ...(result[d]?.dots || []),
          {
            key: a.id,
            color: themeColor.primary, // xanh theo theme
            name: a.shift.name,
          },
        ],
      };
    });

    return result;
  }, [holidays, shiftAttendances, selected, themeColor]);

  const selectedItems = markedDates[selected]?.dots || [];

  return (
    <FlatList
      className="flex-1 px-4 bg-background"
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefreshShiftAttendances}
          tintColor={themeColor.primary}
        />
      }
      ListHeaderComponent={
        <>
          {/* Calendar */}
          <Calendar
            key={themeColor.background} // đổi key sẽ force re-render khi theme thay đổi
            markingType="multi-dot"
            markedDates={markedDates}
            onDayPress={d => setSelected(d.dateString)}
            theme={{
              backgroundColor: themeColor.background,
              calendarBackground: themeColor.background,
              textSectionTitleColor: themeColor.foreground,
              textSectionTitleDisabledColor: themeColor.mutedForeground,
              dayTextColor: themeColor.foreground,
              textDisabledColor: themeColor.mutedForeground,
              todayTextColor: themeColor.primary,
              selectedDayBackgroundColor: themeColor.primary,
              selectedDayTextColor: themeColor.primaryForeground,
              monthTextColor: themeColor.foreground,
              arrowColor: themeColor.primary,
              dotColor: themeColor.primary,
              selectedDotColor: themeColor.primaryForeground,
              textDayFontWeight: '500',
              textMonthFontWeight: '600',
              textDayHeaderFontWeight: '600',
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 14,
            }}
          />

          {/* Info Section */}
          <Text className="mt-4 mb-2 text-lg font-semibold">
            Thông tin ngày {selected}
          </Text>

          {selectedItems.length === 0 && (
            <Text className="text-muted-foreground mb-4">
              Không có dữ liệu cho ngày này
            </Text>
          )}
        </>
      }
      data={selectedItems}
      keyExtractor={item => item.key.toString()}
      renderItem={({ item, index }) => (
        <Animated.View
          entering={FadeInUp.delay(index * 80)}
          className="mb-2 p-3 rounded-xl bg-card border border-border"
        >
          <View className="flex-row items-center">
            <View
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: item.color }}
            />
            <Text className="font-medium">{item.name}</Text>
          </View>
        </Animated.View>
      )}
      ListFooterComponent={
        <>
          <Text className="mt-6 mb-2 text-lg font-semibold">
            Lịch sử chấm công
          </Text>

          {shiftAttendances.length === 0 && (
            <Text className="text-muted-foreground">
              Chưa có dữ liệu chấm công
            </Text>
          )}

          {shiftAttendances.map((attendance, index) => (
            <Animated.View
              entering={FadeInUp.delay(index * 80)}
              key={attendance.id}
              className="mb-3 p-4 rounded-2xl bg-card border border-border"
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-semibold text-base">
                  {attendance.shift.name}
                </Text>
                <Badge variant="outline">
                  <Text>{SHIFT_TYPE_STRING[attendance.shift.type]}</Text>
                </Badge>
              </View>

              <Text className="text-sm text-muted-foreground">
                Chấm công lúc: {attendance.attendAt}
              </Text>
              <Text className="text-sm text-muted-foreground">
                Loại: {SHIFT_ATTENDANCE_TYPE_STRING[attendance.type]}
              </Text>
              <Text className="text-sm text-muted-foreground">
                Trạng thái: {SHIFT_ATTENDANCE_STATUS_STRING[attendance.status]}
              </Text>
            </Animated.View>
          ))}
        </>
      }
    />
  );
}

export default CalendarScreen;

import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/context/ThemeContext';
import useAuthStore from '@/store/authStore';
import useHolidayStore from '@/store/holidayStore';
import useShiftAttendanceStore from '@/store/shiftAttendanceStore';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
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

function CalendarScreen({ navigation }) {
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
            color: themeColor.destructive,
            name: h.name,
            type: 'holiday',
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
            color: themeColor.primary,
            name: a.shift.name,
            type: 'attendance',
          },
        ],
      };
    });

    return result;
  }, [holidays, shiftAttendances, selected, themeColor]);

  const selectedItems = markedDates[selected]?.dots || [];

  return (
    <FlatList
      className="flex-1 bg-background"
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefreshShiftAttendances}
          tintColor={themeColor.primary}
        />
      }
      ListHeaderComponent={
        <View className="px-4 pt-4">
          {/* ===== CALENDAR CARD ===== */}
          <View className="rounded-3xl bg-card border border-border overflow-hidden shadow-sm">
            <Calendar
              key={themeColor.background}
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
                textDayHeaderFontSize: 13,
              }}
            />
          </View>

          {/* ===== DAY SUMMARY ===== */}
          <View className="mt-6 mb-3">
            <Text className="text-lg font-bold">Ngày {selected}</Text>
            <Text className="text-sm text-muted-foreground">
              Tổng sự kiện: {selectedItems.length}
            </Text>
          </View>

          {selectedItems.length === 0 && (
            <View className="bg-muted/40 rounded-xl p-4">
              <Text className="text-muted-foreground text-center">
                Không có dữ liệu trong ngày này
              </Text>
            </View>
          )}
        </View>
      }
      data={selectedItems}
      keyExtractor={item => item.key.toString()}
      renderItem={({ item, index }) => (
        <Animated.View
          entering={FadeInUp.delay(index * 60)}
          className="mx-4 mb-3 rounded-2xl bg-card border border-border p-4"
        >
          <View className="flex-row items-center gap-3">
            <View
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <View className="flex-1">
              <Text className="font-semibold">{item.name}</Text>
              <Text className="text-xs text-muted-foreground">
                {item.type === 'holiday' ? 'Ngày nghỉ' : 'Ca làm việc'}
              </Text>
            </View>
          </View>
        </Animated.View>
      )}
      ListFooterComponent={
        <View className="px-4 pt-6 pb-10">
          {/* ===== HISTORY ===== */}
          <Text className="text-lg font-bold mb-3">Lịch sử chấm công</Text>

          {shiftAttendances.length === 0 && (
            <View className="bg-muted/40 rounded-xl p-4">
              <Text className="text-muted-foreground text-center">
                Chưa có dữ liệu chấm công
              </Text>
            </View>
          )}

          {shiftAttendances.map((attendance, index) => (
            <Animated.View
              key={attendance.id}
              entering={FadeInUp.delay(index * 40)}
            >
              <TouchableOpacity
                className="mb-4 rounded-2xl bg-card border border-border p-4"
                onPress={() =>
                  navigation.push('AttendanceDetail', {
                    attendance,
                  })
                }
              >
                {/* HEADER */}
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="font-semibold text-base">
                    {attendance.shift.name}
                  </Text>
                  <Badge variant="outline">
                    <Text className="text-xs">
                      Ca {SHIFT_TYPE_STRING[attendance.shift.type]}
                    </Text>
                  </Badge>
                </View>

                {/* META */}
                <View className="gap-1">
                  <Text className="text-sm text-muted-foreground">
                    {attendance.attendAt}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    {SHIFT_ATTENDANCE_TYPE_STRING[attendance.type]}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    {SHIFT_ATTENDANCE_STATUS_STRING[attendance.status]}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      }
    />
  );
}

export default CalendarScreen;

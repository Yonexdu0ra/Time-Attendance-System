import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/context/ThemeContext';
import useAuthStore from '@/store/authStore';
import useHolidayStore from '@/store/holidayStore';
import useShiftAttendanceStore from '@/store/shiftAttendanceStore';
import formatTime from '@/utils/formatTime';
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

const formatDate = iso =>
  new Date(iso).toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  });
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
            data: h,
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
            data: a,
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
                selectedDayBackgroundColor: themeColor.foreground,
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
            <Text className="text-lg font-bold"> {formatDate(selected)}</Text>
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
          {item.type === 'holiday' && (
            <TouchableOpacity activeOpacity={0.8} className="">
              {/* HEADER */}
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="font-semibold text-base">{item.name}</Text>
                  <Text className={'text-xs text-muted-foreground'}>Tết dương lịch</Text>
                </View>
                <Badge className="bg-destructive/10 text-destructive font-medium">
                  <Text className={'text-destructive'}>Ngày lễ</Text>
                </Badge>
              </View>
            
            </TouchableOpacity>
          )}
          {item.type === 'attendance' && (
            <TouchableOpacity
              activeOpacity={0.8}
              className=""
              onPress={() =>
                navigation.push('AttendanceDetail', { attendance: item.data })
              }
            >
              {/* HEADER */}
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="font-semibold text-base">
                    {item.data.shift.name}
                  </Text>
                  {/* <Text className="text-xs text-muted-foreground">
                    {formatDate(item.data.attendAt)}
                  </Text> */}
                </View>

                {/* TYPE */}
                <View className={`px-2 py-1 rounded-full ${'bg-emerald-100'}`}>
                  <Text className={`text-xs font-medium ${'text-emerald-700'}`}>
                    {SHIFT_ATTENDANCE_TYPE_STRING[item.data.type]}
                  </Text>
                </View>
              </View>

              {/* BODY */}
              <View className="mt-3 flex-row items-center justify-between">
                <Text className="text-2xl font-bold">
                  {formatTime(item.data.attendAt)}
                </Text>

                {/* STATUS */}
                <Text
                  className={`text-sm font-medium ${
                    item.data.status === 1
                      ? 'text-emerald-600'
                      : item.data.status === 2
                      ? 'text-amber-600'
                      : 'text-muted-foreground'
                  }`}
                  style={{
                    width:
                      SHIFT_ATTENDANCE_STATUS_STRING[item.data.status].length *
                      8,
                  }}
                >
                  {SHIFT_ATTENDANCE_STATUS_STRING[item.data.status]}
                </Text>
              </View>
            </TouchableOpacity>
          )}
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

          {shiftAttendances.map((attendance, index) => {
            return (
              <Animated.View
                key={attendance.id}
                entering={FadeInUp.delay(index * 30)}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="mb-3 rounded-2xl bg-card border border-border p-4"
                  onPress={() =>
                    navigation.push('AttendanceDetail', { attendance })
                  }
                >
                  {/* HEADER */}
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="font-semibold text-base">
                        {attendance.shift.name}
                      </Text>
                      <Text className="text-xs text-muted-foreground">
                        {formatDate(attendance.attendAt)}
                      </Text>
                    </View>

                    {/* TYPE */}
                    <View
                      className={`px-2 py-1 rounded-full ${'bg-emerald-100'}`}
                    >
                      <Text
                        className={`text-xs font-medium ${'text-emerald-700'}`}
                      >
                        {SHIFT_ATTENDANCE_TYPE_STRING[attendance.type]}
                      </Text>
                    </View>
                  </View>

                  {/* BODY */}
                  <View className="mt-3 flex-row items-center justify-between">
                    <Text className="text-2xl font-bold">
                      {formatTime(attendance.attendAt)}
                    </Text>

                    {/* STATUS */}
                    <Text
                      className={`text-sm font-medium ${
                        attendance.status === 1
                          ? 'text-emerald-600'
                          : attendance.status === 2
                          ? 'text-amber-600'
                          : 'text-muted-foreground'
                      }`}
                      style={{
                        width:
                          SHIFT_ATTENDANCE_STATUS_STRING[attendance.status]
                            .length * 8,
                      }}
                    >
                      {SHIFT_ATTENDANCE_STATUS_STRING[attendance.status]}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      }
    />
  );
}

export default CalendarScreen;

import { useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { Ellipsis } from 'lucide-react-native';
import { request } from '../utils/request';
import Toast from 'react-native-toast-message';
import useShiftStore from '../store/shiftStore';
// const filterOptions = [
//   { label: 'Tất cả', value: 'all', isActive: true },
//   { label: 'Sắp tới', value: 'upcoming', isActive: false },
//   { label: 'Đã hoàn thành', value: 'completed', isActive: false },
//   { label: 'Chờ duyệt', value: 'pending', isActive: false },
//   { label: 'Đã từ chối', value: 'rejected', isActive: false },
// ];
function ShiftScreen({ navigation }) {
  const { themeColor } = useTheme();
  const isLoading = useShiftStore(state => state.isLoading);
  const shifts = useShiftStore(state => state.shifts);
  const handleJoinShift = useShiftStore(state => state.handleJoinShift);
  const handleCancelJoinShift = useShiftStore(state => state.handleCancelJoinShift);
  const isRefreshing = useShiftStore(state => state.isRefreshing);
  const handleRefresh = useShiftStore(state => state.handleRefreshShifts);
  const init = useShiftStore(state => state.init);
  const filterOptions = useShiftStore(state => state.filterOptions);
  const handleChoiceFilterOption = useShiftStore(state => state.handleChoiceFilterOption);
  useEffect(() => {
    init()
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
              onPress={() => handleChoiceFilterOption(option.value)}
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
      <ScrollView  refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}>
        <View
          className="p-4 gap-4"
          style={{ backgroundColor: themeColor.secondary }}
        >
          {isLoading ? (
            <ActivityIndicator color={themeColor.primary} />
          ) : (
            shifts?.map(shift => {
              const isPending = shift?.userShifts?.find(us => us.type === 0);
              const isRejected = shift?.userShifts.find(us => us.type === 2);
              const isNoHasRequest = shift?.userShifts.some(
                us => us.type === 0 || us.type === 1 || us.type === 2,
              )
                ? false
                : true;
              const isJoin = shift?.userShifts.find(us => us.type === 1);
              return (
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
                    {isNoHasRequest && (
                      <Button
                        title={'Tham gia'}
                        className="flex-1"
                        onPress={() => {
                          handleJoinShift(shift.id);
                        }}
                      />
                    )}
                    {isPending && (
                      <Button
                        title={'Hủy yêu cầu'}
                        className="flex-1"
                        variant="destructive"
                        onPress={() => handleCancelJoinShift(isPending.id)}
                      />
                    )}
                    {isRejected && (
                      <Button
                        title={'Đã từ chối'}
                        className="flex-1"
                        disabled
                      />
                    )}
                    {isJoin && <Text>Bạn đã tham gia</Text>}
                    {/* <Button variant="secondary">
                      <Ellipsis />
                    </Button> */}
                  </View>
                </View>
              );
            })
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

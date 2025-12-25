import { useEffect, useLayoutEffect } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Text } from '../components/ui/text';
import useShiftStore from '../store/shiftStore';
import { Input } from '../components/ui/input';
import { Ellipsis, QrCode } from 'lucide-react-native';
import useAuthStore from '@/store/authStore';

function ShiftScreen({ navigation }) {
  const { themeColor } = useTheme();
  const user = useAuthStore(state => state.user);
  const isLoading = useShiftStore(state => state.isLoading);
  const shifts = useShiftStore(state => state.shifts);
  const handleJoinShift = useShiftStore(state => state.handleJoinShift);
  const handleCancelJoinShift = useShiftStore(
    state => state.handleCancelJoinShift,
  );
  const isRefreshing = useShiftStore(state => state.isRefreshing);
  const handleRefresh = useShiftStore(state => state.handleRefreshShifts);
  const init = useShiftStore(state => state.init);
  const filterOptions = useShiftStore(state => state.filterOptions);
  const handleChoiceFilterOption = useShiftStore(
    state => state.handleChoiceFilterOption,
  );
  useEffect(() => {
    init();
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'Tìm kiếm ca làm việc',
        onChangeText: event => {
          const text = event.nativeEvent.text;
          console.log(text);
        },
      },
    });
  }, [navigation]);
  return (
    <View className="flex-1" style={{ backgroundColor: themeColor.background }}>
      <View className="p-4 gap-2">
        {/* <Input placeholder="Tìm kiếm ca làm việc" /> */}
        <Text>Sắp xếp theo</Text>
        <ScrollView
          horizontal
          className="bg-background rounded-lg"
          contentContainerClassName="flex-row gap-4"
        >
          {filterOptions.map((option, index) => (
            <Button
              key={index}
              onPress={() => handleChoiceFilterOption(option.value)}
              variant={option.isActive ? 'default' : 'outline'}
            >
              <Text>{option.label}</Text>
            </Button>
          ))}
        </ScrollView>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
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
                  <View className="p-4 mb-4  flex flex-row justify-between items-center">
                    <Text className="text-lg font-bold">{shift.name}</Text>
                    <Text variant="muted">{shift.type}</Text>
                  </View>
                  <View>
                    <Text variant="muted">
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
                        className="flex-1"
                        onPress={() => {
                          handleJoinShift(shift.id);
                        }}
                      >
                        <Text>Tham gia</Text>
                      </Button>
                    )}
                    {isPending && (
                      <Button
                        className="flex-1"
                        variant="destructive"
                        onPress={() => handleCancelJoinShift(isPending.id)}
                      >
                        <Text>Hủy yêu cầu</Text>
                      </Button>
                    )}
                    {isRejected && (
                      <Button variant="destructive" className="flex-1" disabled>
                        <Text>Yêu cầu bị từ chối</Text>
                      </Button>
                    )}
                    {isJoin && (
                      <View className="flex-1 flex flex-row justify-between items-center">
                        <Text>Bạn đã tham gia</Text>
                        {user.role >= 1 && (
                          <Button
                            variant="outline"
                            onPress={() => {
                              navigation.navigate('StreamQR', {
                                shiftId: shift.id,
                                shiftName: shift.name,
                              });
                            }}
                          >
                            <QrCode color={themeColor.foreground} />
                          </Button>
                        )}
                      </View>
                    )}
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

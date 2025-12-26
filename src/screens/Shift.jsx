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
import { QrCode } from 'lucide-react-native';
import useAuthStore from '@/store/authStore';
import Animated, {
  FadeInDown,
  FadeInLeft,
} from 'react-native-reanimated';
import { Badge } from '@/components/ui/badge';

function ShiftScreen({ navigation }) {
  const { themeColor } = useTheme();
  const { STATUS_TYPE, ROLE, SHIFT_TYPE_STRING } = useAuthStore(
    state => state.config,
  );
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
            <Animated.View
              key={option.value}
              entering={FadeInLeft.delay(index * 100)}
            >
              <Button
                onPress={() => handleChoiceFilterOption(option.value)}
                variant={option.isActive ? 'default' : 'outline'}
              >
                <Text>{option.label}</Text>
              </Button>
            </Animated.View>
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
            shifts?.map((shift, index) => {
              const isPending = shift?.userShifts?.find(
                us => us.type === STATUS_TYPE.PENDING,
              );

              const isNoHasRequest = shift?.userShifts.every(
                us =>
                  us.type === STATUS_TYPE.CANCELLED ||
                  us.type === STATUS_TYPE.REJECTED,
              );

              const isJoin = shift?.userShifts.find(
                us => us.type === STATUS_TYPE.APPROVED,
              );
              return (
                <Animated.View
                  entering={FadeInDown.delay(index * 200)}
                  key={shift.id}
                  className="rounded-[12px] px-4 py-2 border border-border"
                >
                  <View className="p-4 mb-4  flex flex-row justify-between items-center">
                    <Text className="text-lg font-bold">{shift.name}</Text>
                    <Badge>
                      <Text variant="">{SHIFT_TYPE_STRING[shift.type]}</Text>
                    </Badge>
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
                    <Text variant="muted">
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
                        onPress={() =>
                          handleCancelJoinShift(
                            isPending.id,
                            STATUS_TYPE.CANCELLED,
                          )
                        }
                      >
                        <Text>Hủy yêu cầu</Text>
                      </Button>
                    )}
                    {/* {isRejected && (
                      <Button variant="destructive" className="flex-1" disabled>
                        <Text>Yêu cầu bị từ chối</Text>
                      </Button>
                    )} */}
                    {isJoin && (
                      <View className="flex-1 flex flex-row justify-between items-center">
                        <Text>Bạn đã tham gia</Text>
                        {(user.role === ROLE.MANAGER ||
                          user.role === ROLE.ADMIN) && (
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
                </Animated.View>
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

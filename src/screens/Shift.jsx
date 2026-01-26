import { useEffect, useLayoutEffect, useCallback } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  View,
  FlatList,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInLeft,
} from 'react-native-reanimated';
import { QrCode } from 'lucide-react-native';

import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Text } from '../components/ui/text';
import { Badge } from '@/components/ui/badge';

import useShiftStore from '../store/shiftStore';
import useAuthStore from '@/store/authStore';

function ShiftScreen({ navigation }) {
  const { themeColor } = useTheme();

  const { STATUS_TYPE, ROLE, SHIFT_TYPE_STRING } = useAuthStore(
    state => state.config,
  );
  const user = useAuthStore(state => state.user);

  const {
    isLoading,
    shifts,
    isRefreshing,
    filterOptions,
    init,
    handleJoinShift,
    handleCancelJoinShift,
    handleRefreshShifts,
    handleChoiceFilterOption,
  } = useShiftStore();

  /* ===================== INIT ===================== */
  useEffect(() => {
    init();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'Tìm kiếm ca làm việc',
        onChangeText: e => {
          console.log(e.nativeEvent.text);
        },
      },
    });
  }, [navigation]);

  /* ===================== UTILS ===================== */
  const formatTime = time =>
    new Date(time).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });

  /* ===================== HEADER ===================== */
  const renderHeader = () => (
    <View className="p-4 gap-2">
      <Text>Sắp xếp theo</Text>
      <FlatList
        horizontal
        data={filterOptions}
        keyExtractor={item => item.value}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 80)}>
            <Button
              size="sm"
              variant={item.isActive ? 'default' : 'outline'}
              onPress={() => handleChoiceFilterOption(item.value)}
            >
              <Text>{item.label}</Text>
            </Button>
          </Animated.View>
        )}
      />
    </View>
  );

  /* ===================== ITEM ===================== */
  const renderItem = useCallback(
    ({ item, index }) => {
      const isPending = item.userShifts?.find(
        us => us.type === STATUS_TYPE.PENDING,
      );

      const isJoined = item.userShifts?.find(
        us => us.type === STATUS_TYPE.APPROVED,
      );

      const isNoRequest = !isPending && !isJoined;

      return (
        <Animated.View
          entering={FadeInDown.delay(index * 100)}
          className="mx-4 mb-4 rounded-2xl border border-border bg-background overflow-hidden"
        >
          {/* ===== Header ===== */}
          <View className="px-4 pt-4 flex-row justify-between items-start">
            <View className="flex-1 pr-2">
              <Text className="text-lg font-semibold">
                {item.name}
              </Text>
              <Text variant="muted" className="mt-1">
                 {item.address || 'Chưa có địa điểm'}
              </Text>
            </View>

            <Badge>
              <Text>{SHIFT_TYPE_STRING[item.type]}</Text>
            </Badge>
          </View>

          {/* ===== Time Info ===== */}
          <View className="px-4 mt-4 gap-2">
            <View className="flex-row justify-between">
              <Text variant="muted"> Giờ làm</Text>
              <Text>
                {formatTime(item.workStart)} –{' '}
                {formatTime(item.workEnd)}
              </Text>
            </View>

           
          </View>

          {/* ===== Description ===== */}
          {item.description && (
            <View className="px-4 mt-3">
              <Text variant="muted">{item.description}</Text>
            </View>
          )}

          {/* ===== Divider ===== */}
          <View className="h-[1px] bg-border my-4 mx-4" />

          {/* ===== Actions ===== */}
          <View className="px-4 pb-4 flex-row items-center gap-2">
            {isNoRequest && (
              <Button
                className="flex-1"
                onPress={() => handleJoinShift(item.id)}
              >
                <Text>Tham gia ca</Text>
              </Button>
            )}

            {isPending && (
              <Button
                className="flex-1"
                variant="outline"
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

            {isJoined && (
              <View className="flex-1 flex-row justify-between items-center">
                <Text className="text-green-600 font-medium ">
                   Đã tham gia
                </Text>

                {(user.role === ROLE.ADMIN ||
                  user.role === ROLE.MANAGER) && (
                  <Button
                    size="icon"
                    variant="outline"
                    onPress={() =>
                      navigation.navigate('StreamQR', {
                        shiftId: item.id,
                        shiftName: item.name,
                      })
                    }
                  >
                    <QrCode color={themeColor.foreground} />
                  </Button>
                )}
              </View>
            )}
          </View>
        </Animated.View>
      );
    },
    [],
  );

  /* ===================== RENDER ===================== */
  return (
    <View
      className="flex-1"
      style={{ backgroundColor: themeColor.background }}
    >
      <FlatList
        data={shifts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefreshShifts}
          />
        }
        ListEmptyComponent={
          !isLoading && (
            <Text
              className="text-center mt-10"
              style={{ color: themeColor.mutedForeground }}
            >
              Không có ca làm việc nào
            </Text>
          )
        }
        ListFooterComponent={
          isLoading && (
            <View className="py-10">
              <ActivityIndicator color={themeColor.primary} />
            </View>
          )
        }
      />
    </View>
  );
}

export default ShiftScreen;

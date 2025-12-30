import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import useAuthStore from '@/store/authStore';
import useOvertimeRequestStore from '@/store/overtimeRequestStore';
import formatTime from '@/utils/formatTime';
import { useIsFocused } from '@react-navigation/native';
import { Plus } from 'lucide-react-native';
import { useEffect, useLayoutEffect } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

function OvertimeRequestScreen({ navigation }) {
  const isFocused = useIsFocused();
  const init = useOvertimeRequestStore(state => state.init);
  const isLoading = useOvertimeRequestStore(state => state.isLoading);
  const isRefreshing = useOvertimeRequestStore(state => state.isRefreshing);
  const handleUpdateOvertimeRequestStatus = useOvertimeRequestStore(
    state => state.handleUpdateOvertimeRequestStatus,
  );
  const handleRefreshOvertimeRequests = useOvertimeRequestStore(
    state => state.handleRefreshOvertimeRequests,
  );
  const user = useAuthStore(state => state.user);
  const { STATUS_TYPE_STRING, STATUS_TYPE, ROLE } = useAuthStore(
    state => state.config,
  );
  const overtimeRequest = useOvertimeRequestStore(
    state => state.overtimeRequest,
  );
  useEffect(() => {
    init();
  }, []);
  return (
    <View className="relative flex-1">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefreshOvertimeRequests}
          />
        }
      >
        {overtimeRequest.map((item, index) => (
          <Animated.View
            entering={FadeInDown.delay(index * 100)}
            key={item.id}
            className="p-4 m-2 rounded-lg bg-background flex flex-col gap-2"
          >
            <View className="flex flex-row justify-between items-center gap-2">
              <View className="flex flex-col flex-1 gap-2">
                <Text className={'text-center font-bold'}>
                  {/* {LEAVE_TYPE_STRING[item.leaveType]} */}
                  {new Date(item.date).toLocaleDateString()}
                </Text>
                <Text variant="small" className={'text-muted-foreground'}>
                  {formatTime(new Date(item.timeStart))} -{' '}
                  {formatTime(new Date(item.timeEnd))}
                </Text>
              </View>
              <Badge>
                <Text>{STATUS_TYPE_STRING[item.status]}</Text>
              </Badge>
            </View>
            <View className="bg-muted p-1 rounded">
              <Text variant="muted" numberOfLines={2} ellipsizeMode="tail">
                <Text>Lý do</Text>
                {item.reason}
              </Text>
            </View>
            <View>
              <Text variant="muted" className="italic">
                Tạo lúc:  {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
            <View className="flex flex-row gap-2 ">
              {item.status === STATUS_TYPE.PENDING &&
              user.role === ROLE.USER && (
                <Button
                  variant={'destructive'}
                  onPress={() => {
                    handleUpdateOvertimeRequestStatus(
                      item.id,
                      STATUS_TYPE.CANCELLED,
                    );
                  }}
                >
                  <Text>Hủy yêu cầu</Text>
                </Button>
              )}
              {item.status ===STATUS_TYPE.PENDING && user.role !== ROLE.USER && (

                <View className="flex flex-row justify-between gap-2 px-2 flex-1">
                  <Button
                    variant={'destructive'}
                    className={'w-[150]'}
                    onPress={() => {
                      handleUpdateOvertimeRequestStatus(
                        item.id,
                        STATUS_TYPE.REJECTED,
                      );
                    }}
                  >
                    <Text>Từ chối</Text>
                  </Button>
                  <Button
                    className={'w-[150]'}
                    onPress={() => {
                      handleUpdateOvertimeRequestStatus(
                        item.id,
                        STATUS_TYPE.APPROVED,
                      );
                    }}
                  >
                    <Text>Phê duyệt</Text>
                  </Button>
                </View>
              )}
            </View>
          </Animated.View>
        ))}
      </ScrollView>
      <Button
        variant={'outline'}
        className={'absolute bottom-5 right-5 z-50'}
        onPress={() => navigation.push('RequestOvertimeCreate')}
      >
        <Plus />
      </Button>
    </View>
  );
}

export default OvertimeRequestScreen;

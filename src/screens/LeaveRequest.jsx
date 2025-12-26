import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import useAuthStore from '@/store/authStore';
import useLeaveRequestStore from '@/store/leaveRequestStore';
import { Plus } from 'lucide-react-native';
import { useEffect, useLayoutEffect, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

function LeaveRequestScreen({ navigation }) {
  const [isShowButtonCreate, setIsShowButtonCreate] = useState(true);
  const { LEAVE_TYPE_STRING, STATUS_TYPE_STRING, STATUS_TYPE, ROLE } =
    useAuthStore(state => state.config);
  const user = useAuthStore(state => state.user);
  const init = useLeaveRequestStore(state => state.init);
  const isLoading = useLeaveRequestStore(state => state.isLoading);
  const isRefreshing = useLeaveRequestStore(state => state.isRefreshing);
  const leaveRequest = useLeaveRequestStore(state => state.leaveRequest);
  const handleUpdateLeaveRequestStatus = useLeaveRequestStore(
    state => state.handleUpdateLeaveRequestStatus,
  );
  const handleRefreshLeaveRequests = useLeaveRequestStore(
    state => state.handleRefreshLeaveRequests,
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
            onRefresh={handleRefreshLeaveRequests}
          />
        }
      >
        {leaveRequest.map((item, index) => (
          <Animated.View
            entering={FadeInDown.delay(index * 100)}
            key={item.id}
            className="p-4 m-2 rounded-lg bg-background flex flex-col gap-2"
          >
            <View className="flex flex-row justify-between items-center gap-2">
              <View className="flex flex-col flex-1 gap-2">
                <Text className={'text-center font-bold'}>
                  {LEAVE_TYPE_STRING[item.leaveType]}
                </Text>
                <Text variant="small" className={'text-muted-foreground'}>
                  {new Date(item.startDate).toLocaleDateString()} -{' '}
                  {new Date(item.endDate).toLocaleDateString()}
                </Text>
              </View>
              <Badge>
                <Text>{STATUS_TYPE_STRING[item.status]}</Text>
              </Badge>
            </View>
            <View className="bg-muted p-1 rounded">
              <Text variant="muted" numberOfLines={2} ellipsizeMode="tail">
                <Text>Lý do:</Text>
                {item.reason}
              </Text>
            </View>
            {item.reply && (
              <View className="bg-muted p-1 rounded">
                <Text variant="muted" numberOfLines={2} ellipsizeMode="tail">
                  <Text>Phản hồi:</Text>
                  {item.reply}
                </Text>
              </View>
            )}
            <View className="flex flex-row w-full items-center justify-between">
              <Text>
                Ngày tạo: {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
            {item.status === STATUS_TYPE.PENDING && user.role === ROLE.USER && (
              <Button
                variant={'ghost'}
                onPress={() =>
                  handleUpdateLeaveRequestStatus(item.id, STATUS_TYPE.CANCELLED)
                }
              >
                <Text className={'text-destructive'}>Hủy yêu cầu</Text>
              </Button>
            )}
            {item.status === STATUS_TYPE.PENDING &&
              (user.role === ROLE.ADMIN || user.role === ROLE.MANAGER) && (
                <View className="flex flex-row gap-2">
                  <Button
                    className={'flex-1'}
                    variant={'destructive'}
                    onPress={() => {
                      handleUpdateLeaveRequestStatus(
                        item.id,
                        STATUS_TYPE.REJECTED,
                      );
                    }}
                  >
                    <Text>Từ chối</Text>
                  </Button>
                  <Button
                    className={'flex-1 bg-green-500'}
                    onPress={() => {
                      handleUpdateLeaveRequestStatus(
                        item.id,
                        STATUS_TYPE.APPROVED,
                      );
                    }}
                  >
                    <Text>Duyệt</Text>
                  </Button>
                </View>
              )}
          </Animated.View>
        ))}
      </ScrollView>

      {isShowButtonCreate && (
        <Button
          variant={'outline'}
          className={'absolute bottom-5 right-5 z-50'}
          onPress={() => navigation.navigate('RequestLeaveCreate')}
        >
          <Plus />
        </Button>
      )}
    </View>
  );
}

export default LeaveRequestScreen;

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
  const { LEAVE_TYPE_STRING, STATUS_TYPE_STRING } = useAuthStore(
    state => state.config,
  );
  const init = useLeaveRequestStore(state => state.init);
  const isLoading = useLeaveRequestStore(state => state.isLoading);
  const isRefreshing = useLeaveRequestStore(state => state.isRefreshing);
  const leaveRequest = useLeaveRequestStore(state => state.leaveRequest);
  const handleRefreshLeaveRequests = useLeaveRequestStore(
    state => state.handleRefreshLeaveRequests,
  );
  useEffect(() => {
    init();
  }, []);
  return (
    <View className="relative flex-1">
      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefreshLeaveRequests} />}
      
      >
        {leaveRequest.map((item, index) => (
          <Animated.View
            entering={FadeInDown.delay(index * 100)}
            key={item.id}
            className="p-4 m-2 rounded-lg bg-background flex flex-col gap-2"
          >
            <View className="flex flex-row justify-between items-center gap-2">
              <View className="flex flex-col flex-1 gap-2">
                <Text>{LEAVE_TYPE_STRING[item.leaveType]}</Text>
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

              {item.status === 0 && (
                <Button variant={'ghost'}>
                  <Text className={'text-destructive'}>Hủy yêu cầu</Text>
                </Button>
              )}
            </View>
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

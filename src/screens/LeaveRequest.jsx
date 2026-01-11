import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import useAuthStore from '@/store/authStore';
import useLeaveRequestStore from '@/store/leaveRequestStore';
import { Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

/* ===================== ITEM ===================== */
const LeaveRequestItem = ({ item, index, config, user, onUpdateStatus }) => {
  const { LEAVE_TYPE_STRING, STATUS_TYPE_STRING, STATUS_TYPE, ROLE } = config;

  // Badge màu theo trạng thái
  const badgeClass = (() => {
    switch (item.status) {
      case STATUS_TYPE.PENDING:
        return 'bg-primary text-primary-foreground';
      case STATUS_TYPE.APPROVED:
        return 'bg-green-500 text-white';
      case STATUS_TYPE.REJECTED:
        return 'bg-destructive text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  })();

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80)}
      className="mx-4 mt-4 rounded-xl bg-background border border-border p-4 shadow-sm"
    >
      {/* HEADER */}
      <View className="flex-row justify-between items-start">
        <View className="flex-1 pr-2">
          <Text className="text-base font-semibold">{LEAVE_TYPE_STRING[item.leaveType]}</Text>
          <Text className="text-sm text-muted-foreground mt-1">
            {new Date(item.startDate).toLocaleDateString()} – {new Date(item.endDate).toLocaleDateString()}
          </Text>
        </View>

        <Badge className={`px-2 py-1 rounded-full ${badgeClass}`}>
          <Text className="text-xs font-medium">{STATUS_TYPE_STRING[item.status]}</Text>
        </Badge>
      </View>

      {/* REASON */}
      <View className="mt-3 bg-muted rounded-lg p-3">
        <Text className="text-xs font-medium text-muted-foreground mb-1">Lý do</Text>
        <Text numberOfLines={2}>{item.reason}</Text>
      </View>

      {/* REPLY */}
      {item.reply && (
        <View className="mt-2 bg-muted rounded-lg p-3">
          <Text className="text-xs font-medium text-muted-foreground mb-1">Phản hồi</Text>
          <Text numberOfLines={2}>{item.reply}</Text>
        </View>
      )}

      {/* CREATED */}
      <Text className="text-xs italic text-muted-foreground mt-3">
        Ngày tạo: {new Date(item.createdAt).toLocaleDateString()}
      </Text>

      {/* ACTIONS */}
      {item.status === STATUS_TYPE.PENDING && (
        <View className="mt-4 flex-row gap-2">
          {user.role === ROLE.USER && (
            <Button variant="ghost" className="flex-1" onPress={() => onUpdateStatus(item.id, STATUS_TYPE.CANCELLED)}>
              <Text className="text-destructive text-center">Hủy yêu cầu</Text>
            </Button>
          )}

          {(user.role === ROLE.ADMIN || user.role === ROLE.MANAGER) && (
            <>
              <Button variant="destructive" className="flex-1" onPress={() => onUpdateStatus(item.id, STATUS_TYPE.REJECTED)}>
                <Text className="text-center">Từ chối</Text>
              </Button>
              <Button className="flex-1 bg-green-500" onPress={() => onUpdateStatus(item.id, STATUS_TYPE.APPROVED)}>
                <Text className="text-center text-white">Duyệt</Text>
              </Button>
            </>
          )}
        </View>
      )}
    </Animated.View>
  );
};

/* ===================== SCREEN ===================== */
function LeaveRequestScreen({ navigation }) {
  const [isShowButtonCreate] = useState(true);

  const config = useAuthStore(state => state.config);
  const user = useAuthStore(state => state.user);

  const init = useLeaveRequestStore(state => state.init);
  const isLoading = useLeaveRequestStore(state => state.isLoading);
  const isRefreshing = useLeaveRequestStore(state => state.isRefreshing);
  const leaveRequest = useLeaveRequestStore(state => state.leaveRequest);

  const handleUpdateLeaveRequestStatus = useLeaveRequestStore(state => state.handleUpdateLeaveRequestStatus);
  const handleRefreshLeaveRequests = useLeaveRequestStore(state => state.handleRefreshLeaveRequests);

  useEffect(() => {
    init();
  }, []);

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={leaveRequest}
        keyExtractor={item => item.id}
        refreshing={isRefreshing}
        onRefresh={handleRefreshLeaveRequests}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item, index }) => (
          <LeaveRequestItem
            item={item}
            index={index}
            config={config}
            user={user}
            onUpdateStatus={handleUpdateLeaveRequestStatus}
          />
        )}
        ListEmptyComponent={
          !isLoading && (
            <View className="mt-24 items-center">
              <Text className="text-muted-foreground text-center">Chưa có yêu cầu nghỉ phép</Text>
            </View>
          )
        }
      />

      {/* FAB */}
      {isShowButtonCreate && (
        <Button
          className="absolute bottom-6 right-6 h-14 w-14 rounded-full items-center justify-center shadow-lg bg-primary"
          onPress={() => navigation.navigate('RequestLeaveCreate')}
        >
          <Plus size={22} className="text-primary-foreground" />
        </Button>
      )}
    </View>
  );
}

export default LeaveRequestScreen;

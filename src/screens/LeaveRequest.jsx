import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/context/ThemeContext';
import useAuthStore from '@/store/authStore';
import useLeaveRequestStore from '@/store/leaveRequestStore';
import { Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

/* ===================== ITEM ===================== */
const LeaveRequestItem = ({
  item,
  index,
  config,
  user,
  onUpdateStatus,
  onCancel,
}) => {
  const { LEAVE_TYPE_STRING, STATUS_TYPE_STRING, STATUS_TYPE, ROLE } = config;

  const badgeClass = (() => {
    switch (item.status) {
      case STATUS_TYPE.PENDING:
        return 'bg-primary/10 text-primary';
      case STATUS_TYPE.APPROVED:
        return 'bg-green-500/10 text-green-600';
      case STATUS_TYPE.REJECTED:
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  })();

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60)}
      className="mx-4 mt-4 rounded-2xl bg-card border border-border p-4 shadow-sm"
    >
      {/* USER HEADER */}
      <View className="flex-row items-center">
        <Image
          source={{ uri: item.user.avatarUrl }}
          className="h-10 w-10 rounded-full bg-muted"
        />
        <View className="ml-3 flex-1">
          <Text className="font-semibold text-sm">{item.user.fullName}</Text>
          <Text className="text-xs text-muted-foreground">
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <Badge className={`rounded-full px-3 py-1 ${badgeClass}`}>
          <Text className="text-xs font-medium whitespace-nowrap">
            {STATUS_TYPE_STRING[item.status]}
          </Text>
        </Badge>
      </View>

      {/* DIVIDER */}
      <View className="h-px bg-border my-4" />

      {/* META INFO */}
      <View className="mt-1 flex-row flex-wrap gap-x-6 gap-y-2">
        {/* SHIFT */}
        <View>
          <Text className="text-xs text-muted-foreground">Ca làm việc</Text>
          <Text className="text-sm font-medium">Phân phối hàng hóa</Text>
        </View>

        {/* DATE RANGE */}
        <View>
          <Text className="text-xs text-muted-foreground">Thời gian nghỉ</Text>
          <Text className="text-sm font-medium">
            {new Date(item.startDate).toLocaleDateString()} –{' '}
            {new Date(item.endDate).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* LEAVE TYPE */}
      <View className="mt-3">
        <Text className="text-base font-semibold">
          {LEAVE_TYPE_STRING[item.leaveType]}
        </Text>
      </View>

      {/* REASON */}
      <View className="mt-4 rounded-xl bg-muted/50 p-3">
        <Text className="text-xs font-medium text-muted-foreground mb-1">
          Lý do
        </Text>
        <Text className="text-sm leading-5" numberOfLines={3}>
          {item.reason}
        </Text>
      </View>

      {/* REPLY */}
      {item.reply && (
        <View className="mt-3 rounded-xl bg-muted/50 p-3">
          <Text className="text-xs font-medium text-muted-foreground mb-1">
            Phản hồi
          </Text>
          <Text className="text-sm leading-5" numberOfLines={3}>
            {item.reply}
          </Text>
        </View>
      )}

      {/* ACTIONS */}
      {item.status === STATUS_TYPE.PENDING && (
        <View className="mt-4 flex-row gap-2">
          {user.role === ROLE.USER && (
            <Button
              variant="outline"
              className="flex-1"
              onPress={() => onCancel(item.id)}
            >
              <Text className="text-destructive text-center">Hủy yêu cầu</Text>
            </Button>
          )}

          {(user.role === ROLE.ADMIN || user.role === ROLE.MANAGER) && (
            <>
              <Button
                variant="outline"
                className="flex-1 border-destructive"
                onPress={() => onUpdateStatus(item.id, STATUS_TYPE.REJECTED)}
              >
                <Text className="text-destructive text-center">Từ chối</Text>
              </Button>

              <Button
                className="flex-1 bg-green-500"
                onPress={() => onUpdateStatus(item.id, STATUS_TYPE.APPROVED)}
              >
                <Text className="text-white text-center">Duyệt</Text>
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
  const { themeColor } = useTheme();
  const [isShowButtonCreate] = useState(true);

  const config = useAuthStore(state => state.config);
  const user = useAuthStore(state => state.user);

  const init = useLeaveRequestStore(state => state.init);
  const isEnd = useLeaveRequestStore(state => state.isEnd);
  const isLoading = useLeaveRequestStore(state => state.isLoading);
  const isRefreshing = useLeaveRequestStore(state => state.isRefreshing);
  const leaveRequest = useLeaveRequestStore(state => state.leaveRequest);
  const handleGetLeaveRequestsCursorPagination = useLeaveRequestStore(
    state => state.handleGetLeaveRequestsCursorPagination,
  );
  const handleCancelLeaveRequest = useLeaveRequestStore(
    state => state.handleCancelLeaveRequest,
  );
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
    <View className="flex-1 bg-background">
      <FlatList
        data={leaveRequest}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 140 }}
        refreshing={isRefreshing}
        onRefresh={handleRefreshLeaveRequests}
        onEndReached={() =>
          !isLoading && !isEnd && handleGetLeaveRequestsCursorPagination()
        }
        renderItem={({ item, index }) => (
          <LeaveRequestItem
            item={item}
            index={index}
            config={config}
            user={user}
            onUpdateStatus={handleUpdateLeaveRequestStatus}
            onCancel={handleCancelLeaveRequest}
          />
        )}
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

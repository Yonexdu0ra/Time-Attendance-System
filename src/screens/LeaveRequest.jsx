import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/context/ThemeContext';
import useAuthStore from '@/store/authStore';
import useLeaveRequestStore from '@/store/leaveRequestStore';
import { Plus } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

/* ===================== HELPERS ===================== */
const formatDate = date =>
  new Date(date).toLocaleDateString('vi-VN');

/* ===================== FILTER ITEM ===================== */
const RenderFilterItem = ({ item, active, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.75}
    onPress={() => onPress(item.value)}
    className={`mr-2 px-4 py-2 rounded-full border
      ${active ? 'bg-primary/10 border-primary' : 'border-border bg-background'}
    `}
  >
    <Text
      className={`text-sm font-medium ${
        active ? 'text-primary' : 'text-muted-foreground'
      }`} style={{ width: item.label.length * 8 }}
    >
      {item.label}
    </Text>
  </TouchableOpacity>
);

/* ===================== ITEM ===================== */
const LeaveRequestItem = ({
  item,
  index,
  config,
  user,
  onUpdateStatus,
  onCancel,
}) => {
  const { STATUS_TYPE, STATUS_TYPE_STRING, LEAVE_TYPE_STRING, ROLE } = config;

  const statusStyle = {
    [STATUS_TYPE.PENDING]: 'bg-primary/10 text-primary',
    [STATUS_TYPE.APPROVED]: 'bg-green-500/10 text-green-600',
    [STATUS_TYPE.REJECTED]: 'bg-destructive/10 text-destructive',
    [STATUS_TYPE.CANCELED]: 'bg-muted text-muted-foreground',
  }[item.status];

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60)}
      className="mx-4 mt-4 rounded-2xl border border-border bg-card p-4"
    >
      {/* HEADER */}
      <View className="flex-row items-center">
        <Image
          source={{ uri: item.user.avatarUrl }}
          className="h-10 w-10 rounded-full bg-muted"
        />
        <View className="ml-3 flex-1">
          <Text className="font-semibold text-sm">
            {item.user.fullName}
          </Text>
          <Text className="text-xs text-muted-foreground">
            {formatDate(item.createdAt)}
          </Text>
        </View>

        <Badge className={`rounded-full px-3 py-1 ${statusStyle}`} >
          <Text className="text-xs font-medium text-center" style={{ width: STATUS_TYPE_STRING[item.status].length * 8}}>
            {STATUS_TYPE_STRING[item.status]}
          </Text>
        </Badge>
      </View>

      {/* META */}
      <View className="mt-4 gap-3">
        <View>
          <Text className="text-xs text-muted-foreground">Ca làm việc</Text>
          <Text className="text-sm font-medium">
            {item.user?.userShifts?.[0]?.shift?.name || '—'}
          </Text>
        </View>

        <View>
          <Text className="text-xs text-muted-foreground">
            Thời gian nghỉ
          </Text>
          <Text className="text-sm font-medium">
            {formatDate(item.startDate)} – {formatDate(item.endDate)}
          </Text>
        </View>
      </View>

      {/* TYPE */}
      <Text className="mt-4 text-base font-semibold">
        {LEAVE_TYPE_STRING[item.leaveType]}
      </Text>

      {/* REASON */}
      <View className="mt-3 rounded-xl bg-muted/50 p-3">
        <Text className="text-xs text-muted-foreground mb-1">Lý do</Text>
        <Text className="text-sm">{item.reason}</Text>
      </View>

      {/* REPLY */}
      {item.reply && (
        <View className="mt-3 rounded-xl bg-muted/50 p-3">
          <Text className="text-xs text-muted-foreground mb-1">
            Phản hồi
          </Text>
          <Text className="text-sm">{item.reply}</Text>
        </View>
      )}

      {/* ACTIONED */}
      {item.actionedBy && (
        <>
          <View className="h-px bg-border my-4" />
          <Text className="text-xs text-muted-foreground mb-1">Người xử lý</Text>
          <View className="flex-row items-center ">
            <Image
              source={{ uri: item.actionedBy.avatarUrl }}
              className="h-9 w-9 rounded-full bg-muted"
            />
            <View className="ml-3 flex-1">
              <Text className="text-sm font-medium">
                {item.actionedBy.fullName}
              </Text>
              <Text className="text-xs text-muted-foreground">
                {new Date(item.actionedAt).toLocaleString()}
              </Text>
            </View>
          </View>
        </>
      )}

      {/* ACTIONS */}
      {item.status === STATUS_TYPE.PENDING && (
        <View className="mt-4 flex-row gap-2">
          {user.role === ROLE.USER && (
            <Button
              variant="outline"
              className="flex-1 border-destructive"
              onPress={() => onCancel(item.id)}
            >
              <Text className="text-destructive">Hủy</Text>
            </Button>
          )}

          {(user.role === ROLE.ADMIN || user.role === ROLE.MANAGER) && (
            <>
              <Button
                variant="outline"
                className="flex-1 border-destructive"
                onPress={() =>
                  onUpdateStatus(item.id, STATUS_TYPE.REJECTED)
                }
              >
                <Text className="text-destructive">Từ chối</Text>
              </Button>
              <Button
                className="flex-1 bg-green-500"
                onPress={() =>
                  onUpdateStatus(item.id, STATUS_TYPE.APPROVED)
                }
              >
                <Text className="text-white">Duyệt</Text>
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
  const config = useAuthStore(state => state.config);
  const user = useAuthStore(state => state.user);

  const [filter, setFilter] = useState('ALL');

  const {
    init,
    isEnd,
    isLoading,
    isRefreshing,
    leaveRequest,
    handleGetLeaveRequestsCursorPagination,
    handleCancelLeaveRequest,
    handleUpdateLeaveRequestStatus,
    handleRefreshLeaveRequests,
  } = useLeaveRequestStore();

  const listFilter = [
    { label: 'Tất cả', value: 'ALL' },
    { label: 'Đang chờ', value: -1 },
    { label: 'Đã duyệt', value: 1 },
    { label: 'Từ chối', value: 0 },
    { label: 'Đã hủy', value: 2 },
  ];

  const dataFilter = useMemo(() => {
    if (filter === 'ALL') return leaveRequest;
    return leaveRequest.filter(i => i.status === filter);
  }, [filter, leaveRequest]);

  useEffect(() => {
    init();
  }, []);

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={dataFilter}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 140 }}
        refreshing={isRefreshing}
        onRefresh={handleRefreshLeaveRequests}
        onEndReached={() =>
          !isLoading && !isEnd &&
          handleGetLeaveRequestsCursorPagination()
        }
        ListHeaderComponent={
          <View className="px-4 py-3">
            <FlatList
              horizontal
              data={listFilter}
              keyExtractor={item => item.value.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <RenderFilterItem
                  item={item}
                  active={filter === item.value}
                  onPress={setFilter}
                />
              )}
            />
          </View>
        }
        ListFooterComponent={
          !isEnd && isLoading ? <ActivityIndicator /> : null
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
      <Button
        className="absolute bottom-6 right-6 h-14 w-14 rounded-full items-center justify-center bg-primary shadow-lg"
        onPress={() => navigation.navigate('RequestLeaveCreate')}
      >
        <Plus size={22} color={themeColor.foreground} />
      </Button>
    </View>
  );
}

export default LeaveRequestScreen;

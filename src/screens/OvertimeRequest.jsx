import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import useAuthStore from '@/store/authStore';
import useOvertimeRequestStore from '@/store/overtimeRequestStore';
import formatTime from '@/utils/formatTime';
import { Plus } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { View, FlatList, Image, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

/* ===================== ITEM ===================== */
const OvertimeRequestItem = ({
  item,
  index,
  config,
  user,
  onUpdate,
  onCancel,
}) => {
  const { STATUS_TYPE_STRING, STATUS_TYPE, ROLE } = config;

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
          source={{
            uri: item.user?.avatarUrl,
          }}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />

        <View className="ml-3 flex-1">
          <Text className="text-sm font-semibold">{item.user?.fullName}</Text>
          <Text className="text-xs text-muted-foreground">
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <Badge className={`rounded-full px-3 py-1 ${badgeClass}`}>
          <Text className="text-xs font-medium text-center" style={{ width: STATUS_TYPE_STRING[item.status].length * 8 }}>
            {STATUS_TYPE_STRING[item.status]}
          </Text>
        </Badge>
      </View>

      {/* DIVIDER */}
      <View className="h-px bg-border my-4" />

      {/* META INFO */}
      <View className="flex-row flex-wrap gap-x-6 gap-y-2">
        {/* SHIFT */}
        <View>
          <Text className="text-xs text-muted-foreground">Ca làm việc</Text>
          <Text className="text-sm font-medium">
            {item.shift?.name || 'Phân phối hàng hóa'}
          </Text>
        </View>

        {/* TIME */}
        <View>
          <Text className="text-xs text-muted-foreground">
            Thời gian tăng ca
          </Text>
          <Text className="text-sm font-medium">
            {formatTime(new Date(item.timeStart))} –{' '}
            {formatTime(new Date(item.timeEnd))}
          </Text>
        </View>
      </View>

      {/* REASON */}
      <View className="mt-4 rounded-xl bg-muted/50 p-3">
        <Text className="text-xs font-medium text-muted-foreground mb-1">
          Lý do
        </Text>
        <Text
          className="text-sm leading-5"
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          {item.reason}
        </Text>
      </View>

      {/* ACTIONS */}
      {item.status === STATUS_TYPE.PENDING && (
        <View className="mt-4 flex-row gap-2">
          {user.role === ROLE.USER ? (
            <Button
              variant="outline"
              className="flex-1 h-11"
              onPress={() => onCancel(item.id)}
            >
              <Text className="text-destructive text-center">Hủy yêu cầu</Text>
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="flex-1 h-11 border-destructive"
                onPress={() => onUpdate(item.id, STATUS_TYPE.REJECTED)}
              >
                <Text className="text-destructive text-center">Từ chối</Text>
              </Button>

              <Button
                className="flex-1 h-11 bg-green-500"
                onPress={() => onUpdate(item.id, STATUS_TYPE.APPROVED)}
              >
                <Text className="text-white text-center">Phê duyệt</Text>
              </Button>
            </>
          )}
        </View>
      )}
    </Animated.View>
  );
};

const RenderFilterItem = ({ item, filter, handleOnPressFilter }) => {
  const active = filter === item.value;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => handleOnPressFilter(item.value)}
      className={`mr-2 rounded-full border px-4 py-2
        ${
          active
            ? 'bg-primary/10 border-primary'
            : 'bg-muted/30 border-transparent'
        }
      `}
    >
      <Text
        className={`text-sm font-medium
          ${active ? 'text-primary' : 'text-muted-foreground'}
        `}
        style={{ width: item.label.length * 8 }}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
};

/* ===================== SCREEN ===================== */
function OvertimeRequestScreen({ navigation }) {
  const [filter, setFilter] = useState('ALL');
  const handleOnPressFilter = value => {
    setFilter(value);
  };
  const init = useOvertimeRequestStore(state => state.init);
  const isLoading = useOvertimeRequestStore(state => state.isLoading);
  const isRefreshing = useOvertimeRequestStore(state => state.isRefreshing);
  const overtimeRequest = useOvertimeRequestStore(
    state => state.overtimeRequest,
  );
  const handleUpdateOvertimeRequestStatus = useOvertimeRequestStore(
    state => state.handleUpdateOvertimeRequestStatus,
  );
  const handleRefreshOvertimeRequests = useOvertimeRequestStore(
    state => state.handleRefreshOvertimeRequests,
  );
  const handleCancelOvertimeRequest = useOvertimeRequestStore(
    state => state.handleCancelOvertimeRequest,
  );
  const user = useAuthStore(state => state.user);
  const config = useAuthStore(state => state.config);
  const dataFilter = useMemo(() => {
    return overtimeRequest.filter(lr => {
      if (filter === 'ALL') return true;
      return lr.status === filter;
    });
  }, [filter]);
  const listFilter = [
    {
      label: 'Tất cả',
      value: 'ALL',
    },
    {
      label: 'Đang chờ',
      value: -1,
    },
    {
      label: 'Đã duyệt',
      value: 1,
    },
    {
      label: 'Đã từ chối',
      value: 0,
    },
    {
      label: 'Đã hủy',
      value: 2,
    },
  ];
  useEffect(() => {
    init();
  }, []);

  return (
    <View className="flex-1 bg-background">
      <FlatList
        ListHeaderComponent={
          <FlatList
            data={listFilter}
            horizontal
            keyExtractor={item => item.value}
            renderItem={({ item }) => (
              <RenderFilterItem
                item={item}
                filter={filter}
                handleOnPressFilter={handleOnPressFilter}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ padding: 8 }}
          />
        }
        data={dataFilter}
        keyExtractor={item => item.id}
        refreshing={isRefreshing}
        onRefresh={handleRefreshOvertimeRequests}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 140 }}
        renderItem={({ item, index }) => (
          <OvertimeRequestItem
            item={item}
            index={index}
            config={config}
            user={user}
            onUpdate={handleUpdateOvertimeRequestStatus}
            onCancel={handleCancelOvertimeRequest}
          />
        )}
      />

      {/* FAB */}
      <Button
        className="absolute bottom-6 right-6 h-14 w-14 rounded-full items-center justify-center shadow-lg bg-primary"
        onPress={() => navigation.push('RequestOvertimeCreate')}
      >
        <Plus size={22} className="text-primary-foreground" />
      </Button>
    </View>
  );
}

export default OvertimeRequestScreen;

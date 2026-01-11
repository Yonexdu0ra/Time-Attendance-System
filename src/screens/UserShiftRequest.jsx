import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import useAuthStore from '@/store/authStore';
import useUserShiftStore from '@/store/useShiftStore';
import { useEffect } from 'react';
import { FlatList, View } from 'react-native';

/* ================= ITEM ================= */
const Item = ({ item, config }) => {
  const { STATUS_TYPE_STRING, STATUS_TYPE } = config;
  const statusLabel = STATUS_TYPE_STRING[item.type];

  /* màu badge theo status */
  const badgeClass = (() => {
    switch (item.type) {
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
    <View className="px-4 pt-4">
      <View className="bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-xl p-4 shadow-sm">
        {/* HEADER */}
        <View className="flex-row justify-between items-start">
          <View className="flex-1 pr-3">
            <Text className="text-base font-semibold text-foreground dark:text-foreground-dark">
              {item?.user.fullName}
            </Text>
            <Text className="text-sm mt-1 text-muted-foreground dark:text-muted-foreground-dark">
              Ca làm: {item?.shift.name}
            </Text>
            <Text className="text-xs mt-1 text-muted-foreground dark:text-muted-foreground-dark">
              {item?.createdAt}
            </Text>
          </View>

          <Badge className={`px-2 py-1 rounded-full ${badgeClass}`}>
            <Text className="text-xs font-medium" style={{ width: statusLabel.length * 8 }}>{statusLabel}</Text>
          </Badge>
        </View>

        {/* ACTIONS */}
        {item?.type === STATUS_TYPE.PENDING && (
          <View className="flex-row gap-3 mt-4">
            <Button className="flex-1 h-11 rounded-lg">
              <Text className="font-medium">Phê duyệt</Text>
            </Button>
            <Button className="flex-1 h-11 rounded-lg" variant="destructive">
              <Text className="font-medium">Từ chối</Text>
            </Button>
          </View>
        )}
      </View>
    </View>
  );
};

/* ================= SCREEN ================= */
function UserShiftRequest() {
  const useShifts = useUserShiftStore(state => state.useShifts);
  const isLoading = useUserShiftStore(state => state.isLoading);
  const isRefresing = useUserShiftStore(state => state.isRefresing);
  const config = useAuthStore(state => state.config);

  const handleGetListUserShiftByCursorPagination =
    useUserShiftStore(state => state.handleGetListUserShiftByCursorPagination);
  const handleRefreshListUserShift =
    useUserShiftStore(state => state.handleRefreshListUserShift);
  const init = useUserShiftStore(state => state.init);

  useEffect(() => {
    init();
  }, []);

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <FlatList
        data={useShifts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Item item={item} config={config} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        onEndReached={handleGetListUserShiftByCursorPagination}
        onRefresh={handleRefreshListUserShift}
        refreshing={isRefresing}

        /* HEADER */
        ListHeaderComponent={
          <View className="px-4 py-4">
            <Text className="text-lg font-semibold text-foreground dark:text-foreground-dark">
              Yêu cầu tham gia ca làm
            </Text>
            <Text className="text-sm mt-1 text-muted-foreground dark:text-muted-foreground-dark">
              Danh sách yêu cầu đang chờ xử lý
            </Text>
          </View>
        }

        /* EMPTY */
        ListEmptyComponent={
          !isLoading && (
            <View className="items-center justify-center mt-20 px-8">
              <Text className="text-center text-muted-foreground dark:text-muted-foreground-dark">
                Chưa có yêu cầu tham gia ca làm việc
              </Text>
            </View>
          )
        }

        /* FOOTER */
        ListFooterComponent={
          isLoading ? (
            <Text className="text-center py-4 text-muted-foreground dark:text-muted-foreground-dark">
              Đang tải dữ liệu...
            </Text>
          ) : null
        }
      />
    </View>
  );
}

export default UserShiftRequest;

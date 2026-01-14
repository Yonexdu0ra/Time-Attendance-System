import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import useAuthStore from '@/store/authStore';
import useOvertimeRequestStore from '@/store/overtimeRequestStore';
import formatTime from '@/utils/formatTime';
import { Plus } from 'lucide-react-native';
import { useEffect } from 'react';
import { View, FlatList } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

/* ===================== ITEM ===================== */
const OvertimeRequestItem = ({ item, index, config, user, onUpdate, onCancel }) => {
  const { STATUS_TYPE_STRING, STATUS_TYPE, ROLE } = config;

  // Badge class theo trạng thái
  const badgeClass = (() => {
    switch (item.status) {
      case STATUS_TYPE.PENDING: return 'bg-primary text-primary-foreground';
      case STATUS_TYPE.APPROVED: return 'bg-green-500 text-white';
      case STATUS_TYPE.REJECTED: return 'bg-destructive text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  })();

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80)}
      className="mx-4 mt-4 rounded-xl bg-background border border-border p-4 shadow-sm"
    >
      {/* HEADER */}
      <View className="flex-row justify-between items-center">
        <Text className="font-semibold text-base">
          {new Date(item.date).toLocaleDateString()}
        </Text>
        <Badge className={`px-2 py-1 rounded-full ${badgeClass}`}>
          <Text className="text-xs font-medium">
            {STATUS_TYPE_STRING[item.status]}
          </Text>
        </Badge>
      </View>

      {/* TIME */}
      <Text className="text-sm text-muted-foreground mt-1">
        {formatTime(new Date(item.timeStart))} – {formatTime(new Date(item.timeEnd))}
      </Text>

      {/* REASON */}
      <View className="mt-3 bg-muted rounded-lg p-3">
        <Text className="text-xs font-medium text-muted-foreground mb-1">
          Lý do
        </Text>
        <Text numberOfLines={2} ellipsizeMode="tail">{item.reason}</Text>
      </View>

      {/* FOOTER */}
      <Text className="text-xs italic text-muted-foreground mt-3">
        Tạo lúc: {new Date(item.createdAt).toLocaleString()}
      </Text>

      {/* ACTIONS */}
      {item.status === STATUS_TYPE.PENDING && (
        <View className="flex-row gap-2 mt-4">
          {user.role === ROLE.USER ? (
            <Button
              variant="ghost"
              className="flex-1 h-11 rounded-lg"
              onPress={() => onCancel(item.id)}
            >
              <Text className="text-destructive text-center">Hủy yêu cầu</Text>
            </Button>
          ) : (
            <>
              <Button
                variant="destructive"
                className="flex-1 h-11 rounded-lg"
                onPress={() => onUpdate(item.id, STATUS_TYPE.REJECTED)}
              >
                <Text className="text-center">Từ chối</Text>
              </Button>
              <Button
                className="flex-1 h-11 rounded-lg bg-green-500"
                onPress={() => onUpdate(item.id, STATUS_TYPE.APPROVED)}
              >
                <Text className="text-center text-white">Phê duyệt</Text>
              </Button>
            </>
          )}
        </View>
      )}
    </Animated.View>
  );
};

/* ===================== SCREEN ===================== */
function OvertimeRequestScreen({ navigation }) {
  const init = useOvertimeRequestStore(state => state.init);
  const isLoading = useOvertimeRequestStore(state => state.isLoading);
  const isRefreshing = useOvertimeRequestStore(state => state.isRefreshing);
  const overtimeRequest = useOvertimeRequestStore(state => state.overtimeRequest);
  const handleUpdateOvertimeRequestStatus = useOvertimeRequestStore(state => state.handleUpdateOvertimeRequestStatus);
  const handleRefreshOvertimeRequests = useOvertimeRequestStore(state => state.handleRefreshOvertimeRequests);
  const handleCancelOvertimeRequest = useOvertimeRequestStore(state => state.handleCancelOvertimeRequest);
  const user = useAuthStore(state => state.user);
  const config = useAuthStore(state => state.config);

  useEffect(() => {
    init();
  }, []);

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={overtimeRequest}
        keyExtractor={item => item.id}
        refreshing={isRefreshing}
        onRefresh={handleRefreshOvertimeRequests}
        contentContainerStyle={{ paddingBottom: 120 }}
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
        ListEmptyComponent={
          !isLoading && (
            <View className="mt-24 items-center">
              <Text className="text-muted-foreground text-center">
                Chưa có yêu cầu tăng ca
              </Text>
            </View>
          )
        }
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

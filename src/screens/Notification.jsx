import { memo, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  Text,
  View,
  Pressable,
} from 'react-native';
import { Bell, CheckCheck } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import useNotificationStore from '@/store/notificationStore';
import { useTheme } from '@/context/ThemeContext';

const FILTERS = [
  { title: 'Tất cả', value: 'all' },
  { title: 'Chưa đọc', value: 'unread' },
];

function NotificationScreen({ navigation }) {
  const { themeColor } = useTheme();
  const {
    notifications,
    isLoading,
    isRefreshing,
    isEnd,
    refreshNotifications,
    getNotificationCursorPagination,
    markAllAsRead,
    markAsRead,
  } = useNotificationStore();

  const [filter, setFilter] = useState('all');

  const filteredData = useMemo(() => {
    if (filter === 'unread') {
      return notifications.filter(n => !n.isRead);
    }
    return notifications;
  }, [filter, notifications]);

  const HeaderRight = memo(() => (
    <Button
      variant="ghost"
      className="mr-3 flex-row items-center"
      onPress={markAllAsRead}
    >
      <CheckCheck size={18} color={themeColor.primary} />
      <Text className="ml-1 text-primary font-medium">
        Đọc tất cả
      </Text>
    </Button>
  ));

  useEffect(() => {
    navigation.setOptions({
      title: 'Thông báo',
      headerShown: true,
      headerRight: () => <HeaderRight />,
    });
  }, []);

  return (
    <View className="flex-1 bg-background">
      {/* SEGMENTED FILTER */}
      <View className="px-4 pt-3 pb-2">
        <View className="flex-row bg-muted rounded-full p-1">
          {FILTERS.map(opt => {
            const active = filter === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => setFilter(opt.value)}
                className={`flex-1 py-2 rounded-full ${
                  active ? 'bg-primary' : ''
                }`}
              >
                <Text
                  className={`text-center font-medium ${
                    active ? 'text-white' : 'text-muted-foreground'
                  }`}
                >
                  {opt.title}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* LIST */}
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id.toString()}
        refreshing={isRefreshing}
        onRefresh={refreshNotifications}
        contentContainerStyle={{ paddingBottom: 32 }}
        onEndReached={() =>
          !isLoading && !isEnd && getNotificationCursorPagination()
        }
        
        renderItem={({ item }) => {
          const unread = !item.isRead;

          return (
            <Pressable
              onPress={() => unread && markAsRead(item.id)}
              className={`mx-4 mb-3 rounded-2xl p-4 flex-row ${
                unread ? 'bg-primary/10 border-l-4 border-primary' : 'bg-card'
              }`}
            >
              {/* ICON */}
              <View
                className={`w-9 h-9 rounded-full items-center justify-center mr-3 ${
                  unread ? 'bg-primary/20' : 'bg-muted'
                }`}
              >
                <Bell
                  size={16}
                  color={unread ? themeColor.primary : themeColor.mutedForeground}
                />
              </View>

              {/* CONTENT */}
              <View className="flex-1">
                <View className="flex-row justify-between items-start mb-1">
                  <Text
                    className={`font-semibold ${
                      unread ? 'text-primary' : 'text-foreground'
                    }`}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text className="text-xs text-muted-foreground ml-2">
                    {new Date(item.createdAt).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      
                    })}
                  </Text>
                </View>

                <Text
                  className="text-sm text-muted-foreground"
                  numberOfLines={2}
                >
                  {item.message}
                </Text>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          !isLoading && (
            <View className="flex-1 items-center justify-center mt-32">
              <Bell size={48} className="text-muted-foreground mb-4" />
              <Text className="text-muted-foreground">
                Không có thông báo
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          isLoading && (
            <Text className="text-center py-4 text-muted-foreground">
              Đang tải...
            </Text>
          )
        }
      />
    </View>
  );
}

export default NotificationScreen;

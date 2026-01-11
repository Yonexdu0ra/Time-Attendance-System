import { memo, useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, ScrollView, Text, View, Pressable } from 'react-native';
import { CheckCheck, Bell } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import useNotificationStore from '@/store/notificationStore';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';

const listOptions = [
  { title: 'Tất cả', value: 'all' },
  { title: 'Chưa đọc', value: 'unread' },
  { title: 'Hệ thống', value: 'system' },
];

function NotificationScreen({ navigation }) {
  const { themeColor } = useTheme();
  const init = useNotificationStore(state => state.init);
  const isLoading = useNotificationStore(state => state.isLoading);
  const notifications = useNotificationStore(state => state.notifications);
  const refreshNotifications = useNotificationStore(
    state => state.refreshNotifications,
  );
  const isRefreshing = useNotificationStore(state => state.isRefreshing);
  const [filter, setFilter] = useState('all');
  const markAllAsRead = useNotificationStore(state => state.markAllAsRead);
  const markAsRead = useNotificationStore(state => state.markAsRead);

  const HeaderRight = memo(() => (
    <Button
      variant="ghost"
      className="mr-4 flex-row items-center"
      onPress={markAllAsRead}
    >
      <CheckCheck size={18} color={themeColor.primary} />
      <Text className="text-primary font-semibold">Đã đọc tất cả</Text>
    </Button>
  ));

  useEffect(() => {
    const t = setTimeout(() => {
      init();
    }, 150); // đợi animation xong

    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    navigation.setOptions({
      title: 'Thông báo',
      headerShown: true,
      headerRight: () => <HeaderRight />,
    });
  }, [navigation]);

  return (
    <View className="flex-1 bg-background">
      {/* FILTER */}
      <View className="px-3 py-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {listOptions.map(option => {
            const active = filter === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => setFilter(option.value)}
                className={`mr-2 px-4 py-2 rounded-full ${
                  active ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <Text
                  className={`font-medium ${
                    active ? 'text-white' : 'text-foreground'
                  }`}
                >
                  {option.title}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* LIST */}
      <FlatList
        data={notifications}
        keyExtractor={item => item.id.toString()}
        refreshing={isLoading}
        onRefresh={refreshNotifications}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 100)}>
            <Pressable
              className={`mx-3 mb-3 p-4 rounded-2xl flex-row items-start ${
                item.isRead ? 'bg-card' : 'bg-primary/10'
              }`}
              onPress={() => markAsRead(item.id)}
            >
              {/* ICON */}
              <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center mr-3">
                <Bell size={18} className="text-primary" />
              </View>

              {/* CONTENT */}
              <View className="flex-1">
                <Text className="font-semibold text-base mb-1 text-primary">
                  {item.title}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  {item.message}
                </Text>
              </View>

              {/* UNREAD DOT */}
              {!item.isRead && (
                <View className="w-3 h-3 bg-destructive rounded-full ml-2 mt-1" />
              )}
            </Pressable>
          </Animated.View>
        )}
        ListEmptyComponent={
          !isLoading &&
          !isRefreshing && (
            <View className="items-center mt-20">
              <Bell size={40} className="text-muted-foreground mb-3" />
              <Text className="text-muted-foreground text-center">
                Không có thông báo nào
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          (isLoading || isRefreshing) && (
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

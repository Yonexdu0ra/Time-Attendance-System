import { request } from '@/utils/request';
import { create } from 'zustand'
import DeviceInfo from 'react-native-device-info'
import { Platform } from 'react-native';
import { toast } from 'sonner-native';



const useNotificationStore = create((set, get) => ({
    notifications: [],
    cursorId: null,
    isLoading: false,
    isRefreshing: false,
    isEnd: false,
    unReadCount: 0,
    setIsLoading: (isLoading) => set({ isLoading }),
    setIsRefreshing: (isRefreshing) => set({ isRefreshing }),
    addNotification: (notification) =>
        set((state) => ({
            notifications: [notification, ...state.notifications],
            unReadCount: state.unReadCount + 1,
        })),
    setCursorId: (cursorId) => set({ cursorId }),
    clearNotifications: () => set({ notifications: [] }),
    incrementUnReadCount: () =>
        set((state) => ({ unReadCount: state.unReadCount + 1 })),
    resetUnReadCount: () => set({ unReadCount: 0 }),
    setUnReadCount: (count) => set({ unReadCount: count }),
    registerDeviceToken: async (token) => {
        try {
            const data = {
                platform: Platform.OS,
                deviceId: await DeviceInfo.getUniqueId(),
                token
            }
            const response = await request('/fcm/register', {
                method: 'POST',
                body: JSON.stringify(data),
            })
            
        } catch (error) {
            console.error('Failed to register device token:', error);
           
            return
        }
    },
    getNotificationCursorPagination: async () => {
        try {
            set({ isLoading: true });
            const response = await request(`/notifications` + (get().cursorId ? `?cursorId=${get().cursorId}` : ''));
            const newNotifications = [...get().notifications, ...response.data]
            const totalUnread = newNotifications.filter(n => !n.isRead).length;
            set((state) => ({
                notifications:newNotifications,
                cursorId: response.nextCursorId || null,
                isLoading: false,
                isEnd: response.nextCursorId ? false : true,
                unReadCount: totalUnread,
            }));
        } catch (error) {
           toast.error('Failed to load notifications');
            set({ isLoading: false });
            console.error('Failed to load notifications:', error);
        }
    },
    refreshNotifications: async () => {
        try {
            set({ isRefreshing: true, cursorId: null, notifications: [] });
            const response = await request(`/notifications`);
            const newNotifications = response.data
            const totalUnread = newNotifications.filter(n => !n.isRead).length;
            set({
                notifications: newNotifications,
                cursorId: response.nextCursorId || null,
                isRefreshing: false,
                unReadCount: totalUnread ,
                isEnd: response.nextCursorId ? false : true,
            });
        } catch (error) {
            toast.error('Failed to refresh notifications');
            set({ isRefreshing: false });
            console.error('Failed to refresh notifications:', error);
        }
    },
    markAsRead: async (notificationId) => {
        try {
            const response = await request(`/notifications/mark-as-read`, {
                method: 'POST',
                body: JSON.stringify({ id: notificationId }),
            });
            set((state) => ({
                notifications: state.notifications.map((n) =>
                    n.id === notificationId ? { ...n, isRead: true } : n
                ),
                unReadCount: Math.max(0, state.unReadCount - 1),
            }));
        } catch (error) {
            toast.error('Failed to mark notification as read');;
            console.error('Failed to mark notification as read:', error);
        }
    },
    markAllAsRead: async () => {
        try {
            const response = await request(`/notifications/mark-all-as-read`, {
                method: 'POST',
            });
            set((state) => ({
                notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
                unReadCount: 0,
            }));
        } catch (error) {
            toast.error('Failed to mark all notifications as read');;
            console.error('Failed to mark all notifications as read:', error);
        }
    },
    init: async () => {
        await get().refreshNotifications();
    }
}));


export default useNotificationStore;
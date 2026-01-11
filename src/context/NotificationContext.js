import { createContext, useContext, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { storage } from '@/utils/storage';
import useNotificationStore from '@/store/notificationStore';
import notifee, { AndroidImportance } from '@notifee/react-native'
const NotificationContext = createContext(null);
export const useNotification = () => useContext(NotificationContext);

const FCM_TOKEN_KEY = 'fcmToken';
async function checkAndroidPermission() {
    if (Platform.OS !== 'android') return true;

    if (Platform.Version < 33) return true;

    const result = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );

    return result; // true | false
}

async function checkIOSPermission() {
    if (Platform.OS !== 'ios') return true;

    const settings = await messaging().hasPermission();

    return (
        settings === messaging.AuthorizationStatus.AUTHORIZED ||
        settings === messaging.AuthorizationStatus.PROVISIONAL
    ); // true | false
}

const NotificationProvider = ({ children }) => {
    const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
    const addNotification = useNotificationStore(state => state.addNotification);
    const registerDeviceToken = useNotificationStore(state => state.registerDeviceToken);
    const registerDeviceIfNeeded = async () => {
        const token = await messaging().getToken();
        const savedToken = storage.getString(FCM_TOKEN_KEY);
       
        
        if (token && token !== savedToken) {
            // 👉 call API register device
            await registerDeviceToken(token);

            storage.set(FCM_TOKEN_KEY, token);
        }
    };
    async function checkNotificationPermission() {
        if (Platform.OS === 'android') return checkAndroidPermission();
        if (Platform.OS === 'ios') return checkIOSPermission();
        return true;
    }

    const requestPermission = async () => {
        if (Platform.OS === 'android' && Platform.Version >= 33) {
            const result = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            );
            if (result !== PermissionsAndroid.RESULTS.GRANTED) return;
        }

        if (Platform.OS === 'ios') {
            const authStatus = await messaging().requestPermission();
            if (
                authStatus !== messaging.AuthorizationStatus.AUTHORIZED &&
                authStatus !== messaging.AuthorizationStatus.PROVISIONAL
            ) {
                return;
            }
        }

        await registerDeviceIfNeeded();
    };

    useEffect(() => {
        const init = async () => {
            await requestPermission();
        };

        init();

        const unsubscribeToken = messaging().onTokenRefresh(async token => {
            storage.set(FCM_TOKEN_KEY, token);
            await useNotificationStore.getState().registerDeviceToken(token);
        });

        const unsubscribeMessage = messaging().onMessage(async remoteMessage => {
            console.log(remoteMessage);
            
            await notifee.displayNotification({
                title: remoteMessage.notification?.title,
                body: remoteMessage.notification?.body,
                android: {
                    channelId: 'default',
                    importance: AndroidImportance.HIGH, // heads-up
                },
                data: remoteMessage.data,
            });
            addNotification({
                id: remoteMessage.data.id,
                title: remoteMessage.notification?.title || '',
                message: remoteMessage.notification?.body || '',
                ...remoteMessage.data,
            });
        });
        const unsubscribeRefreshToken = messaging().onTokenRefresh(async (token) => {
            storage.set(FCM_TOKEN_KEY, token);
            await useNotificationStore.getState().registerDeviceToken(token);
        })

        return () => {
            unsubscribeToken();
            unsubscribeMessage();
            unsubscribeRefreshToken();
        };
    }, []);

    useEffect(() => {
        async function checkPermission() {
            const hasPermission = await checkNotificationPermission();
            setHasNotificationPermission(hasPermission);
        }

        checkPermission();
    }, []);

    return (
        <NotificationContext.Provider value={{ hasNotificationPermission }}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;

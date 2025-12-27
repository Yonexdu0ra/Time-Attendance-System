import { create } from 'zustand';
// import EventSource from 'react-native-sse';
import { API_URL, request } from '@/utils/request';
import EventSource from 'react-native-sse';
import { getRefreshToken } from '../utils/token'
// import { API_URL } from '@/utils/request';
// import useAuthStore from './authStore';
// import Toast from 'react-native-toast-message';

const useStreamQRStore = create((set, get) => ({
    streamQR: null,
    isLoading: false,
    eventSource: null,
    retryCount: 0,
    setRetryCount: (count) => set({ retryCount: count }),
    startStream: (shiftId, accessToken) => {
        const { eventSource } = get();
        if (eventSource) {
            eventSource.close(); // ✅ đóng stream cũ
        }

        // const accessToken = useAuthStore.getState().accessToken;

        set({ isLoading: true });

        const es = new EventSource(`${API_URL}/shifts/attent/${shiftId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'content-type': 'application/json',
            },
            timeout: 300000,
            debug: true,
            pollingInterval: 100,
        
        });

        es.addEventListener('open', () => {
            set({ isLoading: false });
        });

        es.addEventListener('message', (event) => {
            // console.log(event);
            try {
                const data = JSON.parse(event.data);
                console.log(data);
                
                set({ streamQR: data, isLoading: false });
            } catch (error) {
                return
            }

        });

        es.addEventListener('error', async (err) => {
            if (err.type === "error" && err.xhrStatus === 401 && get().retryCount < 3) {

                try {
                    const refreshToken = await getRefreshToken();
                    if (refreshToken) {
                        const response = await request('/auth/me');
                        set({ retryCount: 0 });
                        return
                    }
                    set({ retryCount: get().retryCount + 1 });


                } catch (error) {
                    console.log(error);
                    es.close()
                    set({ isLoading: false, retryCount: 0 });
                }

            }
            set({ isLoading: false });
        });

        set({ eventSource: es });
    },

    stopStream: () => {
        const { eventSource } = get();
        if (eventSource) {
            eventSource.close();
            set({ eventSource: null });
        }
    },
}));

export default useStreamQRStore;

import { create } from 'zustand';
// import EventSource from 'react-native-sse';
import { API_URL } from '@/utils/request';
import EventSource from 'react-native-sse';
// import { API_URL } from '@/utils/request';
// import useAuthStore from './authStore';
// import Toast from 'react-native-toast-message';

const useStreamQRStore = create((set, get) => ({
    streamQR: null,
    isLoading: false,
    eventSource: null,

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
            timeout: 30000,
            debug: true
        });

        es.addEventListener('open', () => {
            set({ isLoading: false });
        });

        es.addEventListener('message', (event) => {
            try {
                const data = JSON.parse(event.data); // ✅ parse JSON
                set({ streamQR: data });
            } catch(error) {
                console.log(error);
                
                set({ streamQR: event.data }); // fallback
            }
        });

        es.addEventListener('error', (err) => {
            console.log(err);
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

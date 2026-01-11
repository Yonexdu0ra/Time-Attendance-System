import Toast from "react-native-toast-message";
import { create } from "zustand";
import { request } from '../utils/request'

const useHomeStore = create((set, get) => ({
    shifts: [],
    cursorId: null,
    isLoading: true,
    isRefreshing: false,
    setShifts: (shifts) => set({ shifts }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setIsRefreshing: (isRefreshing) => set({ isRefreshing }),
    setCursorId: (cursorId) => set({ cursorId }),
    handleGetShifts: async () => {
        set({ isLoading: true });
        try {
            const shiftData = await request(`/shifts${get().cursorId ? `?cursorId=${get().cursorId}` : ''}`);
            set({ shifts: [...get().shifts, ...shiftData.data], isLoading: false, cursorId: shiftData.nextCursorId });
        } catch (error) {
            console.log(error);

            return Toast.show({
                type: "error",
                text1: "Error",
                text2: error.message,
            });
        }
        finally {
            set({ isLoading: false });
        }
    },
    handleRefreshShifts: async () => {
        set({ isRefreshing: true, cursorId: null });
        try {
            const shiftData = await request('/shifts')
            set({ shifts: shiftData.data, isLoading: false, cursorId: shiftData.nextCursorId });
        } catch (error) {
            return Toast.show({
                type: "error",
                text1: "Error",
                text2: error.message,
            });
        } finally {
            set({ isRefreshing: false });
        }
    },
    init: () => {
        useHomeStore.getState().handleGetShifts();
    }
}));

export default useHomeStore;
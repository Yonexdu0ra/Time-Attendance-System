import { request } from "@/utils/request";
import Toast from "react-native-toast-message";
import { create } from 'zustand'


const useShiftAttendanceStore = create((set, get) => ({
    shiftAttendances: [],
    isLoading: false,
    isRefreshing: false,
    cursorId: null,
    setShiftAttendances: (data) => set({ shiftAttendances: data }),
    setIsLoading: (value) => set({ isLoading: value }),
    setIsRefreshing: (value) => set({ isRefreshing: value }),
    setCursorId: (value) => set({ cursorId: value }),
    handleGetShiftAttendancesCursorPagination: async () => {
        set({ isLoading: true });
        try {
            const response = await request(`/shift-attendances${get().cursorId ? `?cursorId=${get().cursorId}` : ''}`)
            const data = response.data;
            const newData = [...data, ...get().shiftAttendances];     
            set({ shiftAttendances: newData, cursorId: response.nextCursorId });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: error.message,
            });
            return
        }
        finally {
            set({ isLoading: false });
        }
    },
    handleRefreshShiftAttendances: async () => {
        set({ isRefreshing: true, cursorId: null, shiftAttendances: [] });
        try {
            const response = await request('/shift-attendances')
            const data = response.data;
            set({ shiftAttendances: data, cursorId: response.nextCursorId });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: error.message,
            });
            return
        } finally {
            set({ isRefreshing: false });
        }
    },
    init: async () => {
        set({ isLoading: true});
        await get().handleRefreshShiftAttendances()
        set({ isLoading: false});
    }
}))


export default useShiftAttendanceStore;
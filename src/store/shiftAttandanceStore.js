import { request } from "@/utils/request";
import Toast from "react-native-toast-message";

const { create } = require("zustand");


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
            set({ shiftAttendances: newData });
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
        set({ isRefreshing: true });
        try {
            const response = await request('/shift-attendances')
            const data = response.data;
            set({ shiftAttendances: data, cursorId: null });
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
        get().handleGetShiftAttendancesCursorPagination()
    }
}))


export default useShiftAttendanceStore;
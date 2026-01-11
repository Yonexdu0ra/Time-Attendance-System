import { request } from "@/utils/request";
import Toast from "react-native-toast-message";
import { create } from "zustand";





const useHolidayStore = create((set, get) => ({
    holidays: [],
    isLoading: false,
    isRefreshing: false,
    cursorId: null,
    setCursorId: (cursorId) => set({ cursorId }),
    setHolidays: (holidays) => set({ holidays }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setIsRefreshing: (isRefreshing) => set({ isRefreshing }),
    handleGetHolidayCurosrPagination: async () => {
        try {
            set({ isLoading: true });
            const response = await request(`/holidays${get().cursorId ? `?cursorId=${get().cursorId}` : ''}`);
            const newHolidays = response.data || [];

            set({
                holidays: [...get().holidays, ...newHolidays],
                cursorId: response.nextCursorId,
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lấy danh sách ngày lễ thất bại',
                text2: error.message || 'Vui lòng thử lại sau',
            });
            return
        }
        finally {
            set({ isLoading: false });
        }
    },
    handleRefreshHolidays: async () => {
        set({ isRefreshing: true, cursorId: null, holidays: [] });
        try {
            const response = await request('/holidays');
            set({ holidays: response.data || [], cursorId: response.nextCursorId });
        }
        catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lấy danh sáchngày lễ thất bại',
                text2: error.message || 'Vui lòng thử lại sau',
            });
            return
        }
        finally {
            set({ isRefreshing: false });
        }
    },
    init: async () => {
        get().handleRefreshHolidays();
    }
}));

export default useHolidayStore;
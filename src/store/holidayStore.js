import { request } from "@/utils/request";
import { toast } from "sonner-native";
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
            toast.error(error.message || 'Lấy danh sách ngày lễ thất bại');
            
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
            toast.error(error.message || 'Lấy danh sách ngày lễ thất bại');
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
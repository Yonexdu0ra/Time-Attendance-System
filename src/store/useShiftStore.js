import { toast } from "sonner-native";

const { request } = require("@/utils/request");
const { create } = require("zustand");





const useUserShiftStore = create((set, get) => ({
    useShifts: [],
    isLoading: false,
    isRefresing: false,
    cursorId: null,
    isEndPage: false,
    setUseShifts: (useShifts) => set({ useShifts}),
    setIsLoading: (isLoading) => set({ isLoading }),
    setIsRefresing: (isRefresing) => set({ isRefresing }),
    handleGetListUserShiftByCursorPagination: async () => {
        if(get().isEndPage) return
        if(get().isLoading) return
        set({ isLoading: true });
        try {
            const userShiftData = await request(`/user-shifts${get().cursorId ? `?cursorId=${get().cursorId}` : ''}`);
            const newUseShifts = [...get().useShifts, ...userShiftData.data];
            set({
                useShifts: newUseShifts,
                cursorId: userShiftData.nextCursorId,
                isLoading: false,
                isEndPage: !userShiftData.nextCursorId,
            });
        } catch (error) {
            toast.error(error.message || 'Lấy danh sách ca làm việc của người dùng thất bại');
        }
    },
    handleRefreshListUserShift: async () => {
        set({ isRefresing: true, cursorId: null, useShifts: [], isEndPage: false });
        await get().handleGetListUserShiftByCursorPagination();
        set({ isRefresing: false });
    },
    init: async () => {
        await get().handleGetListUserShiftByCursorPagination();
    }
}));
    

export default useUserShiftStore;
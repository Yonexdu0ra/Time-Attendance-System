import Toast from "react-native-toast-message";
import { create } from "zustand";
import { request } from "../utils/request";


const useShiftStore = create((set, get) => ({
    filterOptions: [{
        label: 'Tất cả', value: 'all', isActive: true,
    }, {
        label: "Đêm", value: 1, isActive: false,
    }, {
        label: "Sáng", value: 0, isActive: false,
    }],
    shifts: [],
    isLoading: true,
    isRefreshing: false,
    cursorId: null,
    setShifts: (shifts) => set({ shifts }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setIsRefreshing: (isRefreshing) => set({ isRefreshing }),
    handleChoiceFilterOption: (value) => {
        const newFilterOptions = get().filterOptions.map(option => ({
            ...option,
            isActive: option.value === value,
        }));
        set({ filterOptions: newFilterOptions });
    },
    handleGetListShiftByCursorPagination: async () => {
        set({ isLoading: true });
        try {
            const shiftData = await request(`/shifts${get().cursorId ? `?cursorId=${get().cursorId}` : ''}`);
            // if (shiftData.code !== "SUCCESS") throw new Error(shiftData.message);
            const newShifts = [...get().shifts, ...shiftData.data];
            set({
                shifts: newShifts,
                cursorId: shiftData.data.nextCursorId,
                isLoading: false,
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: error.message,
            })
        }
    },
    handleJoinShift: async (shiftId) => {
        try {
            const shifJoinData = await request(
                `/user-shifts/request-join-shift/${shiftId}`,
                { method: 'POST' },
            );
            // if (shifJoinData.code !== "SUCCESS") throw new Error(shifJoinData.message);
            const newShifts = get().shifts.map(shift => {
                if (shift.id !== shiftId) return shift;
                return {
                    ...shift,
                    userShifts: [
                        ...shift.userShifts,
                        { type: shifJoinData.data.type, id: shifJoinData.data.id },
                    ]
                }
            })
            set({ shifts: newShifts });
            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: 'Yêu cầu tham gia ca làm việc đã được gửi',
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: error.message,
            });
        }
    },
    handleCancelJoinShift: async (userShiftId, status) => {
        try {
            const shiftStatusData = await request(
                `/user-shifts/requests/${userShiftId}/status`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        status
                    }),
                },
            );
            // if (shiftStatusData.code !== "SUCCESS") throw new Error(shiftStatusData.message);
            const newShifts = get().shifts.map(shift => {
                if (!shift.userShifts.find(us => us.id === userShiftId)) return shift;
                return {
                    ...shift,
                    userShifts: shift.userShifts.map(us => us.id !== userShiftId ? us : { ...us, type: shiftStatusData.data.type }),
                }
            })
            set({ shifts: newShifts });
            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: 'Yêu cầu tham gia ca làm việc đã được hủy',
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: error.message,
            });
        }
    },
    handleRefreshShifts: async () => {
        set({ isRefreshing: true, cursorId: null });
        try {
            const shiftData = await request(`/shifts`);
            // if (shiftData.code !== "SUCCESS") throw new Error(shiftData.message);
            set({
                shifts: shiftData.data,
                cursorId: shiftData.data.nextCursorId,
                isRefreshing: false,
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: error.message,
            });
            set({ isRefreshing: false });
        }
    },
    init: () => {
        get().handleGetListShiftByCursorPagination();
    },
}));


export default useShiftStore;
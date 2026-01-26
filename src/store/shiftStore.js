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
    shiftJoineds: [],
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
            const shiftData = await request(`/shifts`);
            // if (shiftData.code !== "SUCCESS") throw new Error(shiftData.message);
            const newShifts = [...get().shifts, ...shiftData.data];
            set({
                shifts: newShifts,
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: error.message,
            })
        }
    },
    handleGetListShiftJoinedByCursorPagination: async () => {
        set({ isLoading: true });
        try {
            const shiftData = await request(`/shifts/joined`);
            // if (shiftData.code !== "SUCCESS") throw new Error(shiftData.message);
            const newShifts = [...get().shiftJoineds, ...shiftData.data];
            set({
                shiftJoineds: newShifts,
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
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
                `/user-shifts/cancel-request/${userShiftId}`,
                {
                    method: 'POST',
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
    handleUpdateShiftStatus: async (shiftId, status) => {
        try {
            const shiftStatusData = await request(
                `/shifts/requests/${shiftId}/status`,
                {
                    method: 'POST',
                    body: JSON.stringify({ status }),
                },
            );
            // if (shiftStatusData.code !== "SUCCESS") throw new Error(shiftStatusData.message);
            const newShifts = get().shifts.map(shift => shift.id !== shiftId ? shift : {
                ...shift,
                status: shiftStatusData.data.status,
            });
            set({ shifts: newShifts });
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
                isLoading: false,
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: error.message,
            });
            set({ isRefreshing: false, isLoading: false, });
        }
    },
    handleRefreshShiftJoineds: async () => {
        set({ isRefreshing: true, cursorId: null });
        try {
            const shiftData = await request(`/shifts/joined`);
            // if (shiftData.code !== "SUCCESS") throw new Error(shiftData.message);
            set({
                shiftJoineds: shiftData.data,
                cursorId: shiftData.data.nextCursorId,
                isRefreshing: false,
                isLoading: false,
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: error.message,
            });
            set({ isRefreshing: false, isLoading: false, });
        }
    },
    init: () => {
        get().handleRefreshShifts();
        get().handleRefreshShiftJoineds();
    },
}));


export default useShiftStore;
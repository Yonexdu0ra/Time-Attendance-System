import { request } from '@/utils/request'
import Toast from 'react-native-toast-message'
import { create } from 'zustand'


const useOvertimeRequestStore = create((set, get) => ({
    overtimeRequest: [],
    isLoading: false,
    isRefreshing: false,
    cursorId: null,
    formData: {
        date: new Date(),
        timeStart: null,
        timeEnd: null,
        reason: '',
    },
    setCursorId: (cursorId) => set({ cursorId }),
    setOvertimeRequest: (overtimeRequest) => set({ overtimeRequest }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setIsRefreshing: (isRefreshing) => set({ isRefreshing }),
    setFormData: (field) => {
        set({
            formData: {
                ...get().formData,
                ...field,
            },
        })
    },
    handleGetOvertimeRequestCursorPagination: async () => {
        try {
            const response = await request(`/overtime-requests${get().cursorId ? `?cursorId=${get().cursorId}` : ''}`)
            const newOvertimeRequests = response.data;
            const updatedOvertimeRequests = get().cursorId ? [...get().overtimeRequest, ...newOvertimeRequests] : newOvertimeRequests;
            set({
                overtimeRequest: updatedOvertimeRequests,
                cursorId: response.nextCursorId,
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lấy danh sách yêu cầu làm thêm giờ thất bại',
                text2: error.message,
            });
        }
    },
    handleRefreshOvertimeRequests: async () => {
        set({ isRefreshing: true, cursorId: null });
        await get().handleGetOvertimeRequestCursorPagination();
        set({ isRefreshing: false });
    },
    handleCreateOvertimeRequest: async () => {
        try {
            const { formData } = get();
            const response = await request('/overtime-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const newData = response.data;
            set({ overtimeRequest: [newData, ...get().overtimeRequest] });
            Toast.show({
                type: 'success',
                text1: 'Tạo yêu cầu làm thêm giờ thành công',
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Tạo yêu cầu làm thêm giờ thất bại',
                text2: error.message,
            });
        }
    },
    handleUpdateOvertimeRequestStatus: async (overtimeRequestId, status) => {
        try {
            const response = await request(`/overtime-requests/${overtimeRequestId}/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            })
            const updatedRequest = response.data;
            const updatedOvertimeRequests = get().overtimeRequest.map(item =>
                item.id === updatedRequest.id ? updatedRequest : item
            );
            set({ overtimeRequest: updatedOvertimeRequests });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Hủy yêu cầu làm thêm giờ thất bại',
                text2: error.message,
            });
        }
    },
    handleCancelOvertimeRequest: async (id) => {
        try {
            const response = await request(`/overtime-requests/${id}/cancel`, {
                method: 'POST',
            });
            if (!response.success) throw new Error('Hủy yêu cầu làm thêm giờ thất bại');
            const newDate = get().overtimeRequest.map(item => {
                if (item.id === id) {
                    return {
                        ...item,
                        status: response.data.status,
                    }
                }
                return item;
            }
            );
            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: response.message,
            });
            set({ overtimeRequest: newDate });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: error.message,
            });
        }

    },
    init: async () => {
        set({ isLoading: true, cursorId: null });
        await get().handleGetOvertimeRequestCursorPagination();
        set({ isLoading: false });
    }

}));


export default useOvertimeRequestStore;
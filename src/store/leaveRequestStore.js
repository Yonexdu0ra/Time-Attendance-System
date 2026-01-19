import { request } from '@/utils/request'
import Toast from 'react-native-toast-message'
import { create } from 'zustand'




const useLeaveRequestStore = create((set, get) => ({
    leaveRequest: [],
    isLoading: true,
    isRefreshing: false,
    isEnd: false,
    cursorId: null,
    formData: {
        startDate: new Date(),
        endDate: new Date(),
        leaveType: null,
        reason: '',
    },
    setIsRefreshing: (isRefreshing) => set({ isRefreshing }),
    setCursorId: (cursorId) => set({ cursorId }),
    setLeaveRequest: (leaveRequest) => set({ leaveRequest }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setFormData: (field) => {
        set({
            formData: {
                ...get().formData,
                ...field,
            },
        })
    },

    async handleGetLeaveRequestsCursorPagination() {
        set({ isLoading: true });
        try {
            const response = await request(`/leave-requests${get().cursorId ? `?cursorId=${get().cursorId}` : ''}`)
            const { data, nextCursorId } = response;
            set({
                leaveRequest: [...get().leaveRequest, ...data],
                cursorId: nextCursorId,
                isEnd: !nextCursorId,
            })
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: error.message,
            });
        }
        finally {
            set({ isLoading: false, isRefreshing: false });
        }
    },
    async handleRefreshLeaveRequests() {
        try {
            const response = await request('/leave-requests')
            const { data, nextCursorId } = response;
            set({
                leaveRequest: data,
                cursorId: nextCursorId,
                isEnd: !nextCursorId,
            })
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: error.message,
            });
        }
    },
    async handleCreateLeaveRequest() {
        try {
            const { formData } = get();
            await request('/leave-requests', {
                method: 'POST',
                body: JSON.stringify(formData),
            });
            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: 'Yêu cầu nghỉ phép đã được gửi thành công.',
            });
        } catch (error) {
            console.log(error);

            set({
                formData: {
                    startDate: new Date(),
                    endDate: new Date(),
                    leaveType: null,
                    reason: '',
                }
            })
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: error.message,
            });
        }
    },
    async handleUpdateLeaveRequestStatus(id, status) {
        try {
            const response = await request(`/leave-requests/${id}/status`, {
                method: 'POST',
                body: JSON.stringify({ status }),
            });
            if (response.code !== "SUCCESS") throw new Error('Cập nhật trạng thái yêu cầu nghỉ phép thất bại');
            const newDate = get().leaveRequest.map(item => {
                if (item.id === id) {
                    return {
                        ...item,
                        status,
                        ...response.data,
                    }
                }
                return item;
            });
            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: response.message,
            });
            set({ leaveRequest: newDate });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: error.message,
            });
        }
    },
    async handleCancelLeaveRequest(id) {
        try {
            const response = await request(`/leave-requests/${id}/cancel`, {
                method: 'POST',
            });
            if (!response.success) throw new Error('Hủy yêu cầu nghỉ phép thất bại');
            const newDate = get().leaveRequest.map(item => {
                if (item.id === id) {
                    return {
                        ...item,
                        status: 'CANCELLED',
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
            set({ leaveRequest: newDate });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: error.message,
            });
        }

    },
    async init() {
        set({ leaveRequest: [], cursorId: null });
        await get().handleGetLeaveRequestsCursorPagination();
    }

}))

module.exports = useLeaveRequestStore;
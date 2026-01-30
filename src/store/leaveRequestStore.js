import { request } from '@/utils/request'
import { toast } from 'sonner-native'
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
        shiftId: null,
    },
    setIsRefreshing: (isRefreshing) => set({ isRefreshing }),
    setCursorId: (cursorId) => set({ cursorId }),
    setLeaveRequest: (updater) =>
        set(state => ({
            leaveRequest:
                typeof updater === 'function'
                    ? updater(state.leaveRequest)
                    : updater,
        })),
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
            toast.error(error.message || 'Lấy danh sách yêu cầu nghỉ phép thất bại');

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
            toast.error(error.message || 'Lấy danh sách yêu cầu nghỉ phép thất bại');
        }
    },
    async handleCreateLeaveRequest() {
        const idLoading = toast.loading('Đang tạo yêu cầu nghỉ phép...');
        try {
            const { formData } = get();
            const response = await request('/leave-requests', {
                method: 'POST',
                body: JSON.stringify(formData),
            });
            if (!response.success) throw new Error('Tạo yêu cầu nghỉ phép thất bại');
            set({
                formData: {
                    startDate: new Date(),
                    endDate: new Date(),
                    leaveType: null,
                    reason: '',
                    shiftId: null,
                },
                leaveRequest: [response.data, ...get().leaveRequest],
            })
            toast.success('Yêu cầu nghỉ phép đã được gửi thành công.', { id: idLoading });

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
            toast.error(error.message || 'Tạo yêu cầu nghỉ phép thất bại', { id: idLoading });
        }
    },
    async handleUpdateLeaveRequestStatus(id, status) {
        const idLoading = toast.loading('Đang cập nhật trạng thái yêu cầu nghỉ phép...');
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
            toast.success('Cập nhật trạng thái yêu cầu nghỉ phép thành công', { id: idLoading });
            set({ leaveRequest: newDate });
        } catch (error) {
            toast.error(error.message || 'Cập nhật trạng thái yêu cầu nghỉ phép thất bại', { id: idLoading });
        }
    },
    async handleCancelLeaveRequest(id) {
        const idLoading = toast.loading('Đang hủy yêu cầu nghỉ phép...');
        try {
            const response = await request(`/leave-requests/${id}/cancel`, {
                method: 'POST',
            });
            if (!response.success) throw new Error('Hủy yêu cầu nghỉ phép thất bại');
            const newDate = get().leaveRequest.map(item => {
                if (item.id === id) {
                    return {
                        ...item,
                        ...response.data
                    }
                }
                return item;
            }
            );
            toast.success('Hủy yêu cầu nghỉ phép thành công', { id: idLoading });
            set({ leaveRequest: newDate });
        } catch (error) {
            toast.error(error.message || 'Hủy yêu cầu nghỉ phép thất bại', { id: idLoading });
        }

    },
    async init() {
        set({ leaveRequest: [], cursorId: null });
        await get().handleGetLeaveRequestsCursorPagination();
    }

}))

module.exports = useLeaveRequestStore;
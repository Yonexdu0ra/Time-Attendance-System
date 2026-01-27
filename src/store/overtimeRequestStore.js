import { request } from '@/utils/request'
import { toast } from 'sonner-native';
import { create } from 'zustand'


const useOvertimeRequestStore = create((set, get) => ({
    overtimeRequest: [],
    isLoading: false,
    isRefreshing: false,
    cursorId: null,
    isEnd: true,
    formData: {
        date: new Date(),
        timeStart: new Date(),
        timeEnd: new Date(),
        reason: '',
        shiftId: null,
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
                isEnd: !response.nextCursorId,
            });
        } catch (error) {
            toast.error(error.message || 'Lấy danh sách yêu cầu làm thêm giờ thất bại');
        }
    },
    handleRefreshOvertimeRequests: async () => {
        set({ isRefreshing: true, cursorId: null, isEnd: false });
        await get().handleGetOvertimeRequestCursorPagination();
        set({ isRefreshing: false });
    },
    handleCreateOvertimeRequest: async () => {
        const idLoading = toast.loading('Đang tạo yêu cầu làm thêm giờ...');
        try {

            const { formData } = get();
            const response = await request('/overtime-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const newData = response.data;
            if (!response.success) throw new Error(response.message || 'Tạo yêu cầu làm thêm giờ thất bại');
            set({ overtimeRequest: [newData, ...get().overtimeRequest] });
            toast.success('Tạo yêu cầu làm thêm giờ thành công', { id: idLoading });
        } catch (error) {
            toast.error(error.message || 'Tạo yêu cầu làm thêm giờ thất bại', { id: idLoading });
        }
    },
    handleUpdateOvertimeRequestStatus: async (overtimeRequestId, status) => {
        const idLoading = toast.loading('Đang cập nhật trạng thái yêu cầu làm thêm giờ...');
        try {
            const response = await request(`/overtime-requests/${overtimeRequestId}/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            })
            const updatedRequest = response.data;
            const updatedOvertimeRequests = get().overtimeRequest.map(item => {
                if (item.id === overtimeRequestId) {
                    return {
                        ...item,
                        ...updatedRequest,
                    }
                }
                return item
            }
            );
            set({ overtimeRequest: updatedOvertimeRequests });
            toast.success('Cập nhật trạng thái yêu cầu làm thêm giờ thành công', {
                id: idLoading,
            });
        } catch (error) {
            toast.error('Cập nhật trạng thái yêu cầu làm thêm giờ thất bại', {
                id: idLoading,
            });
        }
    },
    handleCancelOvertimeRequest: async (id) => {
        const idLoading = toast.loading('Đang hủy yêu cầu làm thêm giờ...');
        try {
            const response = await request(`/overtime-requests/${id}/cancel`, {
                method: 'POST',
            });
            if (!response.success) throw new Error('Hủy yêu cầu làm thêm giờ thất bại');
            const newDate = get().overtimeRequest.map(item => {
                if (item.id === id) {
                    return {
                        ...item,
                        ...response.data,
                    }
                }
                return item;
            }
            );
            toast.success(response.message, { id: idLoading });
            set({ overtimeRequest: newDate });
        } catch (error) {
            toast.error(error.message || 'Hủy yêu cầu làm thêm giờ thất bại', { id: idLoading });
        }

    },
    init: async () => {
        set({ isLoading: true, cursorId: null });
        await get().handleGetOvertimeRequestCursorPagination();
        set({ isLoading: false });
    }

}));


export default useOvertimeRequestStore;
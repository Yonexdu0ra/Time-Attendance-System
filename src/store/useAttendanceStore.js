import { request } from '@/utils/request'
import { toast } from 'sonner-native';
import { create } from 'zustand'





const useAttendanceStore = create((set, get) => ({
    handleAttandance: async (qrData) => {
        try {
            const response = await request('/shift-attendances/', {
                method: 'POST',
                body: JSON.stringify({ data: qrData, longitude: 10, latitude: 10 }),
            })
            console.log(response);

            if (!response.success) throw new Error(response.message);
           toast.success('Chấm công thành công');
        } catch (error) {
            toast.error(error.message || 'Chấm công thất bại');
              
        }
    }
}))


module.exports = useAttendanceStore
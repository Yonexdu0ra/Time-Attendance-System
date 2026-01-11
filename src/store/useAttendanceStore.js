import { request } from '@/utils/request'
import Toast from 'react-native-toast-message'
import { create } from 'zustand'





const useAttendanceStore = create((set, get) => ({
    handleAttandance: async (qrData) => {
        try {
            const response = await request('/shift-attendances/attendance', {
                method: 'POST',
                body: JSON.stringify({ data: qrData })
            })
            console.log(response);

            if (!response.success) throw new Error(response.message);
            Toast.show({
                type: 'success',
                text1: 'Chấm công thành công',
                text2: response.message,
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Chấm công thất bại',
                text2: error.message,
            });
        }
    }
}))


module.exports = useAttendanceStore
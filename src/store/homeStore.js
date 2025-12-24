import Toast from "react-native-toast-message";
import { create } from "zustand";
import { request } from '../utils/request'

const useHomeStore = create((set) => ({
    shifts: [],
    isLoading: true,
    isRefreshing: false,
    setShifts: (shifts) => set({ shifts }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setIsRefreshing: (isRefreshing) => set({ isRefreshing }),
    handleGetShifts: async () => {
        try {
            const shiftData = await request('/shifts/me')
            set({ shifts: shiftData.data, isLoading: false,  });
        } catch (error) {
            console.log(error);
            
            return Toast.show({
                type: "error",
                text1: "Error",
                text2: error.message,
            });
        }
    },
    init: () => {
        useHomeStore.getState().handleGetShifts();
    }
}));

export default useHomeStore;
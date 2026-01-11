import { create } from "zustand";
import { clearRefreshToken } from '../utils/token'
import Toast from "react-native-toast-message";
import { request } from "@/utils/request";
import { storage } from "@/utils/storage";
import DeviceInfo from "react-native-device-info";
const useAuthStore = create((set, get) => ({
  /* ===== STATE ===== */
  loading: true,
  user: null,
  config: null,
  /* ===== ACTIONS ===== */


  setUser: (user) =>
    set({ user }),

  setLoading: (loading) =>
    set({ loading: loading }),
  setConfig: (config) => set({ config }),

  /* ===== INIT (restore session giả lập) ===== */
  init: async () => {
    try {
      const user = await request('/auth/me')
      const config = await request('/config')
      
      if (user?.data) {
        set({
          user: user.data,
          config: config.data,
          loading: false,
        });
      }
    } catch (e) {
      console.log(e);

      set({
        user: null,
        loading: false,
      });
    }
  },

  /* ===== LOGOUT ===== */
  logout: async () => {
    try {
      storage.remove('accessToken');
      storage.remove('fcmToken');
      const logoutData = await request('/auth/logout', { method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'app-device-id': await DeviceInfo.getUniqueId(),
        }
      });
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: logoutData.message,
      });
      await clearRefreshToken();
      set({
        user: null,
        loading: false,
      })
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Thất bại',
        text2: error.message || 'Vui lòng thử lại sau',
      });
      return;
    }
  }

}));

export default useAuthStore;

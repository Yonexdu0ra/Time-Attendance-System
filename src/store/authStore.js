import { create } from "zustand";
import { getRefreshToken, saveRefreshToken} from '../utils/token'
const { request } = require("../utils/request");
const useAuthStore = create((set, get) => ({
  /* ===== STATE ===== */
  loading: true,
  user: null,

  /* ===== ACTIONS ===== */
  

  setUser: (user) =>
    set({ user }),

  setLoading: (loading) =>
    set({ loading: loading }),

  /* ===== INIT (restore session giả lập) ===== */
  init: async () => {
    try {
      const user = await request('/auth/me')
      
      if(user?.data) {
        set({
          user: user.data,
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
  logout: () =>
    set({
      user: null,
      loading: false,
    }),
}));

export default useAuthStore;

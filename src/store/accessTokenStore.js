import { create } from "zustand";


const accessTokenStore = create(set => ({
    accessToken: null,
    setAccessToken: (token) => set({ accessToken: token }),
    clearAccessToken: () => set({ accessToken: null }),
}))

export default accessTokenStore;
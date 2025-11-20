// src/constants/routes.ts

export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/sign-in",
  REGISTER: "/auth/sign-up",
  FORGOT_PASSWORD: "/auth/forgot-password",

  PROFILE: (id) => (id ? `/profile/${id}` : "/profile"),

  API: {
    AUTH: {
      REGISTER: "/api/auth/sign-up",
    },
  },
} 


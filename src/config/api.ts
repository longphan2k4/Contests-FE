// API Configuration
export const BASE_URL = import.meta.env.VITE_MEDIA_URL || "http://localhost:3000";

// Other API-related constants can be added here
export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    refreshToken: "/api/auth/refresh-token"
  },
  sponsors: {
    base: "/api/sponsors",
    byContestSlug: (slug: string) => `/api/sponsors/contest/${slug}`
  },
  // Add more endpoints as needed
} as const;

// Export routes
export { default as StudentRoutes } from './routes';

// Export pages/components  
export { default as StudentDashboard } from "./pages/StudentDashboard";
export { default as StudentWaitingRoom } from "./pages/StudentWaitingRoom";
export { default as StudentLogin } from "./pages/StudentLogin";

// Export types
export * from "./types";

// Route constants
export const STUDENT_ROUTES = {
  LOGIN: '/student/login',
  DASHBOARD: '/student/dashboard',
  MATCH: '/student/match/:matchId'
} as const; 
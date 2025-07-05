import { Route } from "react-router-dom";
import StudentPrivateRoute from "../../../routes/StudentPrivateRoute";
import StudentLogin from "../pages/StudentLogin";
import StudentWaitingRoom from "../pages/StudentWaitingRoom";
import StudentDashboard from "../pages/StudentDashboard";
import AntiCheatDemo from "../components/AntiCheatDemo";
import { SocketProvider } from "../../../contexts/SocketContext";

const StudentRoutes = () => {
  return (
    <>
      <Route path="/student/login" element={<StudentLogin />} />

      {/* Demo route - không cần authentication */}
      <Route path="/student/answer/demo" element={<AntiCheatDemo />} />

      <Route element={<StudentPrivateRoute />}>
        <Route
          path="/student/dashboard"
          element={
            <SocketProvider>
              <StudentDashboard />
            </SocketProvider>
          }
        />
        <Route
          path="/student/match/:matchSlug"
          element={
            <SocketProvider>
              <StudentWaitingRoom />
            </SocketProvider>
          }
        />
      </Route>
    </>
  );
};

export default StudentRoutes;
import { Route } from "react-router-dom";
import StudentPrivateRoute from "../../../routes/StudentPrivateRoute";
import StudentLogin from "../pages/StudentLogin";
import StudentWaitingRoom from "../pages/StudentWaitingRoom";
import StudentDashboard from "../pages/StudentDashboard";
import AntiCheatDemo from "../components/AntiCheatDemo";
import { SocketProvider } from "../../../contexts/SocketContext";
import StudentRegister from "../pages/StudentRegister";
import { StudentProvider } from "../contexts/StudentContext";

const StudentRoutes = () => {
  return (
    <>
      <Route path="/student/register" element={<StudentRegister />} />
      <Route path="/student/login" element={<StudentLogin />} />

      {/* Demo route - không cần authentication */}
      <Route path="/student/answer/demo" element={<AntiCheatDemo />} />

      <Route element={<StudentPrivateRoute />}>
        <Route
          path="/student/dashboard"
          element={
            <StudentProvider>
              <SocketProvider>
                <StudentDashboard />
              </SocketProvider>
            </StudentProvider>
          }
        />
        <Route
          path="/student/match/:matchSlug"
          element={
            <StudentProvider>
              <SocketProvider>
                <StudentWaitingRoom />
              </SocketProvider>
            </StudentProvider>
          }
        />
      </Route>
    </>
  );
};

export default StudentRoutes;
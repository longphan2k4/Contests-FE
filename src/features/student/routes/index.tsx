import { Route } from "react-router-dom";
import StudentPrivateRoute from "../../../routes/StudentPrivateRoute";
import StudentLogin from "../pages/StudentLogin";
import StudentWaitingRoom from "../pages/StudentWaitingRoom";
import StudentDashboard from "../pages/StudentDashboard";
import { SocketProvider } from "../../../contexts/SocketContext";

const StudentRoutes = () => {
  return (
    <>
      <Route path="/student/login" element={<StudentLogin />} />
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
          path="/student/match/:matchId"
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

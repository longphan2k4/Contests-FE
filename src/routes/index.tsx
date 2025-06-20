import React from "react";
import { Routes, Route } from "react-router-dom";
// import PrivateRoute from './PrivateRoute';
import AdminRoutes from "../features/admin/AdminRoutes";
import ContestRoutes from "../features/contest/ContestRouter";
import AuthRoutes from "../features/auth/routes";
import PublicRoutes from "./PublicRoutes";
import { AudienceOpinionPage, AUDIENCE_ROUTES } from "../features/audience";
import MatchPage from "../features/match/pages/MatchPage";
import TechBanner from "../features/match/components/MediaPopup/BackGround";
import PrivateRoute from "./PrivateRoute";
import Forbidden403 from "../components/403";
import ProfilePage from "../features/account/pages/ProfilePage";
import JudgeHomePage from "../features/judge/pages/JudgeHomePage";
import MatchSelectionPage from "../features/judge/pages/MatchSelectionPage";
import EliminatePage from "../features/match/pages/EliminatePage";
import { SocketProvider } from "../contexts/SocketContext";
import ControlsPage from "../features/admin/controls/pages/ControlsPage";
import { AuthProvider } from "../features/auth/hooks/authContext";
import PublicRoute from "./PublicRoute";

// Các component trang admin
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {PublicRoutes()}
      <Route
        element={
          <AuthProvider>
            <PublicRoute restricted={true} />
          </AuthProvider>
        }
      >
        {AuthRoutes()}
      </Route>
      <Route
        element={
          <AuthProvider>
            <PrivateRoute roles={["Admin"]} />
          </AuthProvider>
        }
      >
        {AdminRoutes()}
        {ContestRoutes()}
      </Route>
      <Route element={<PrivateRoute roles={["Admin"]} />}>
        <Route
          path="/admin/cuoc-thi/:slug/dieu-kien-tran-dau/:match"
          element={
            <SocketProvider>
              <ControlsPage />
            </SocketProvider>
          }
        />
      </Route>
      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/account/profile" element={<ProfilePage />} />
      </Route>
      {/* Public Routes */}
      <Route path="/judge/home" element={<JudgeHomePage />} />
      <Route path="/judge/selected-match" element={<MatchSelectionPage />} />
      <Route
        path="/tran-dau/:match"
        element={
          <SocketProvider>
            <MatchPage />
          </SocketProvider>
        }
      />
      {/*Route của khán giả*/}
      <Route
        path={AUDIENCE_ROUTES.OPINION_PAGE}
        element={<AudienceOpinionPage />}
      />
      ;
      <Route path="/match/eliminate" element={<EliminatePage />} />
      <Route path="/banner" element={<TechBanner />} />
      <Route path="/403" element={<Forbidden403 />} />
      <Route path="*" element={<div>Trang không tồn tại</div>} />
    </Routes>
  );
};

export default AppRoutes;

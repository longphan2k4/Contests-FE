import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminRoutes from "../features/admin/AdminRoutes";
import ContestRoutes from "../features/contest/ContestRouter";
import PublicRoute from "./PublicRoute";
import AuthRoutes from "../features/auth/routes";
import PublicRoutes from "./PublicRoutes";
import {
  AudienceOpinionPage,
  AudienceStatsPage,
  AUDIENCE_ROUTES,
} from "../features/audience";
import MatchPage from "../features/match/pages/MatchPage";
import TechBanner from "../features/match/components/MediaPopup/BackGround";
import PrivateRoute from "./PrivateRoute";
import Forbidden403 from "../components/403";
import ProfilePage from "../features/account/pages/ProfilePage";
import JudgeHomePage from "../features/judge/pages/JudgeHomePage";
// import MatchSelectionPage from "../features/judge/pages/MatchSelectionPage";
import EliminatePage from "../features/match/pages/EliminatePage";
import { SocketProvider } from "../contexts/SocketContext";
import ControlsPage from "../features/admin/controls/pages/ControlsPage";
import ContestList from "../features/judge/components/selector/ContestList";
import MatchList from "../features/judge/components/selector/MatchList";
import OlympicIT2025Rules from "@features/rule/RulePage";
//leaderboard
import TopThreeReveal from "@features/leaderboard/top3/pages/TopThreeReveal";
import GoldWinnerDisplay from "@features/leaderboard/gold/components/GoldWinnerDisplay";

import NotFound404 from "@components/404";
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      {PublicRoutes()}

      <Route element={<PublicRoute restricted={true} />}>{AuthRoutes()}</Route>

      <Route element={<PrivateRoute roles={["Admin"]} />}>
        {ContestRoutes()}
        {AdminRoutes()}
        <Route
          path="/admin/cuoc-thi/:slug/dieu-kien-tran-dau/:match"
          element={
            <SocketProvider>
              <ControlsPage />
            </SocketProvider>
          }
        />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/account/profile" element={<ProfilePage />} />
      </Route>
      {/* Routes dành cho trọng tài */}

      <Route element={<PrivateRoute roles={["Judge"]} />}>
        <Route path="/cuoc-thi" element={<ContestList />} />
        <Route path="/cuoc-thi/:contestId/tran-dau" element={<MatchList />} />
        <Route
          path="/trong-tai/tran-dau/:match"
          element={
            <SocketProvider>
              <JudgeHomePage />
            </SocketProvider>
          }
        />
      </Route>
      {/* Public Routes */}

      {/* <Route path="/judge/selected-match" element={<MatchSelectionPage />} /> */}
      <Route
        path="/tran-dau/:match"
        element={
          <SocketProvider>
            <MatchPage />
          </SocketProvider>
        }
      />

      <Route
        path={AUDIENCE_ROUTES.OPINION_PAGE}
        element={<AudienceOpinionPage />}
      />

      <Route
        path={AUDIENCE_ROUTES.STATS_DISPLAY}
        element={<AudienceStatsPage />}
      />
      <Route path="/match/eliminate" element={<EliminatePage />} />
      <Route path="/match/top3" element={<TopThreeReveal />} />
      <Route path="/match/gold" element={<GoldWinnerDisplay match_id="1" />} />
      {/* Tech Banner Route */}
      <Route path="/banner" element={<TechBanner />} />
      <Route path="/rule" element={<OlympicIT2025Rules/>}/>
      <Route path="/403" element={<Forbidden403 />} />
      <Route path="/404" element={<NotFound404 />} />
      <Route path="*" element={<NotFound404 />} />
    </Routes>
  );
};

export default AppRoutes;

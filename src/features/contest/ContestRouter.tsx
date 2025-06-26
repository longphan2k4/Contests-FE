// file: features/Contest/ContestRouter.tsx
import { Route, Navigate } from "react-router-dom";
import ContestLayout from "../../layouts/ContestLayout";
import RoundPage from "./round/page/RoundPage";
import GroupPage from "./group/page/GroupPage";
import ContestantPage from "./contestant/page/Contestant";
import MatchPage from "./match/page/MatchPage";
import ResultsPage from "../admin/result/pages/ResultsPage";
import RescuePage from "./rescues/page/RescuePage";
import ClassVideosPage from "@features/admin/class-videos/page/ClassVideosPage";
import Dashboard from "@features/admin/dashboard_slug/pages/Dashboard";
import SponsorsPage from "../admin/sponsors/page/SponsorsPage";
import AwardsPage from "../admin/awards/page/AwardsPage";
import MediaPage from "@features/admin/media/page/MediaPage";
const ContestRoutes = () => {
  return (
    <Route path="/admin/cuoc-thi/:slug" element={<ContestLayout />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="vong-dau" element={<RoundPage />} />
      <Route path="nhom" element={<GroupPage />} />
      <Route path="thi-sinh" element={<ContestantPage />} />
      <Route path="tran-dau" element={<MatchPage />} />
      <Route path="sponsors" element={<SponsorsPage />} />
      <Route path="awards" element={<AwardsPage />} />
      <Route path="class-videos" element={<ClassVideosPage />} />
      <Route path="media" element={<MediaPage />} />
      <Route path="cuu-tro" element={<RescuePage />} />
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="results" element={<ResultsPage />} />
    </Route>
  );
};

export default ContestRoutes;

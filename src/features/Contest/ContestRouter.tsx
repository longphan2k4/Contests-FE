// file: features/Contest/ContestRouter.tsx
import { Route, Navigate } from "react-router-dom";
import ContestLayout from "../../layouts/ContestLayout";
import RoundPage from "./round/page/RoundPage";
import GroupPage from "./group/page/GroupPage";
import ResultsPage from "../admin/result/pages/ResultsPage";
import SponsorsPage from "../admin/sponsors/page/SponsorsPage";
import AwardsPage from "../admin/awards/page/AwardsPage";
import RescuesPage from "../admin/rescues/page/RescuesPage";

const Dashboard = () => <div>Trang Dashboard Cuộc Thi</div>;
const ClassVideos = () => <div>Trang Videos Lớp</div>;
const ContestRoutes = () => {
  return (
    <Route path="/admin/cuoc-thi/:slug" element={<ContestLayout />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="vong-dau" element={<RoundPage />} />
      <Route path="nhom" element={<GroupPage />} />
      <Route path="round" element={<RoundPage />} />
      <Route path="sponsors" element={<SponsorsPage />} />
      <Route path="awards" element={<AwardsPage />} />
      <Route path="class-videos" element={<ClassVideos />} />
      <Route path="rescues" element={<RescuesPage />} />
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="results" element={<ResultsPage />} />
    </Route>
  );
};

export default ContestRoutes;

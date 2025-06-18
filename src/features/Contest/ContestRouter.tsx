// file: features/Contest/ContestRouter.tsx
import { Route, Navigate } from "react-router-dom";
import ContestLayout from "../../layouts/ContestLayout";
import RoundPage from "./round/page/RoundPage";
import GroupPage from "./group/page/GroupPage";
import ResultsPage from "../admin/result/pages/ResultsPage";
import ControlsPage from "../admin/controls/pages/ControlsPage";
const Dashboard = () => <div>Trang Dashboard Cuộc Thi</div>;

const ContestRoutes = () => {
  return (
    <Route path="/admin/cuoc-thi/:slug" element={<ContestLayout />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="controls" element={<ControlsPage />} />

      <Route path="vong-dau" element={<RoundPage />} />
      <Route path="nhom" element={<GroupPage />} />
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="results" element={<ResultsPage />} />
    </Route>
  );
};

export default ContestRoutes;

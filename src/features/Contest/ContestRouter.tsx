// file: features/Contest/ContestRouter.tsx
import { Route, Navigate } from "react-router-dom";
import ContestLayout from "../../layouts/ContestLayout";
import RoundPage from "./round/page/RoundPage";
const Dashboard = () => <div>Trang Dashboard Cuộc Thi</div>;

const ContestRoutes = () => {
  return (
    <Route path="/admin/cuoc-thi/:slug" element={<ContestLayout />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="round" element={<RoundPage />} />
      <Route index element={<Navigate to="dashboard" replace />} />
    </Route>
  );
};

export default ContestRoutes;

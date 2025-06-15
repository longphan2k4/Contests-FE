// file: features/Contest/ContestRouter.tsx
import { Route, Navigate } from "react-router-dom";
import ContestLayout from "../../layouts/ContestLayout";

const Dashboard = () => <div>Trang Dashboard Cuộc Thi</div>;

const ContestRoutes = () => {
  return (
    <Route path="/admin/cuoc-thi/:slug" element={<ContestLayout />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route index element={<Navigate to="dashboard" replace />} />
      {/* <Route path="results" element={<ResultsPage />} /> */}
    </Route>
  );
};

export default ContestRoutes;

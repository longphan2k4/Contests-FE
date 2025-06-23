// file: features/Contest/ContestRouter.tsx
import { Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ContestLayout from "../../layouts/ContestLayout";
import { CircularProgress, Box } from "@mui/material";

// ✅ Lazy load contest components
const RoundPage = lazy(() => import("./round/page/RoundPage"));
const GroupPage = lazy(() => import("./group/page/GroupPage"));
const ContestantPage = lazy(() => import("./contestant/page/Contestant"));
const MatchPage = lazy(() => import("./match/page/MatchPage"));
const ResultsPage = lazy(() => import("../admin/result/pages/ResultsPage"));
const SponsorsPage = lazy(() => import("../admin/sponsors/page/SponsorsPage"));
const AwardsPage = lazy(() => import("../admin/awards/page/AwardsPage"));

// Dashboard và loading components
const Dashboard = () => <div>Trang Dashboard Cuộc Thi</div>;
const ClassVideos = () => <div>Trang Videos Lớp</div>;

const PageLoader = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '50vh' 
  }}>
    <CircularProgress />
  </Box>
);

const ContestRoutes = () => {
  return (
    <Route path="/admin/cuoc-thi/:slug" element={<ContestLayout />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route 
        path="vong-dau" 
        element={
          <Suspense fallback={<PageLoader />}>
            <RoundPage />
          </Suspense>
        } 
      />
      <Route 
        path="nhom" 
        element={
          <Suspense fallback={<PageLoader />}>
            <GroupPage />
          </Suspense>
        } 
      />
      <Route 
        path="thi-sinh" 
        element={
          <Suspense fallback={<PageLoader />}>
            <ContestantPage />
          </Suspense>
        } 
      />
      <Route 
        path="tran-dau" 
        element={
          <Suspense fallback={<PageLoader />}>
            <MatchPage />
          </Suspense>
        } 
      />
      <Route 
        path="sponsors" 
        element={
          <Suspense fallback={<PageLoader />}>
            <SponsorsPage />
          </Suspense>
        } 
      />
      <Route 
        path="awards" 
        element={
          <Suspense fallback={<PageLoader />}>
            <AwardsPage />
          </Suspense>
        } 
      />
      <Route path="class-videos" element={<ClassVideos />} />
      <Route 
        path="rescues" 
        element={
          <Suspense fallback={<PageLoader />}>
            <SponsorsPage />
          </Suspense>
        } 
      />
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route 
        path="results" 
        element={
          <Suspense fallback={<PageLoader />}>
            <ResultsPage />
          </Suspense>
        } 
      />
    </Route>
  );
};

export default ContestRoutes;

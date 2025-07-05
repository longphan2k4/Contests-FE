import { Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { CircularProgress, Box } from "@mui/material";

// ✅ Lazy load tất cả admin components

// const AboutAdminPage = lazy(() => import("./about/pages/AboutAdminPage"));
const UsersPage = lazy(() => import("./user/page/UsersPage"));
const SchoolsPage = lazy(() =>
  import("./schools/pages").then(module => ({ default: module.SchoolsPage }))
);
const QuestionTopicsPage = lazy(() =>
  import("./questionTopic/pages").then(module => ({
    default: module.QuestionTopicsPage,
  }))
);
const QuestionDetailListPage = lazy(() =>
  import("./question-details/pages").then(module => ({
    default: module.QuestionDetailListPage,
  }))
);
const Dashboard = lazy(() => import("./dashboard/pages/Dashboard"));
const StudentsPage = lazy(() => import("./students/page/StudentsPage"));
const QuestionsPackagesPage = lazy(
  () => import("./questionpackages/page/QuestionsPackagesPage")
);
const ClassesPage = lazy(() => import("./class/page/ClassPage"));
const ContestPage = lazy(() =>
  import("./contests/pages").then(module => ({ default: module.ContestPage }))
);
const QuestionsPage = lazy(() =>
  import("./question/pages").then(module => ({
    default: module.QuestionsPage,
  }))
);

// Loading component
const PageLoader = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50vh",
    }}
  >
    <CircularProgress />
  </Box>
);

//const Dashboard = () => <div>Trang Dashboard</div>;

const AdminRoutes = () => {
  return (
    <Route path="/admin" element={<AdminLayout />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route
        path="schools"
        element={
          <Suspense fallback={<PageLoader />}>
            <SchoolsPage />
          </Suspense>
        }
      />
      <Route
        path="classes"
        element={
          <Suspense fallback={<PageLoader />}>
            <ClassesPage />
          </Suspense>
        }
      />
      <Route
        path="students"
        element={
          <Suspense fallback={<PageLoader />}>
            <StudentsPage />
          </Suspense>
        }
      />
      <Route
        path="question-topics"
        element={
          <Suspense fallback={<PageLoader />}>
            <QuestionTopicsPage />
          </Suspense>
        }
      />
      <Route
        path="question-packages/:packageId"
        element={
          <Suspense fallback={<PageLoader />}>
            <QuestionDetailListPage />
          </Suspense>
        }
      />
      <Route
        path="questions"
        element={
          <Suspense fallback={<PageLoader />}>
            <QuestionsPage />
          </Suspense>
        }
      />
      <Route
        path="question-packages"
        element={
          <Suspense fallback={<PageLoader />}>
            <QuestionsPackagesPage />
          </Suspense>
        }
      />
      <Route
        path="contests"
        element={
          <Suspense fallback={<PageLoader />}>
            <ContestPage />
          </Suspense>
        }
      />
      <Route
        path="about"
        element={
          <Suspense fallback={<PageLoader />}>
            {/* <AboutAdminPage /> */}
          </Suspense>
        }
      />
      <Route
        path="users"
        element={
          <Suspense fallback={<PageLoader />}>
            <UsersPage />
          </Suspense>
        }
      />
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
    </Route>
  );
};

export default AdminRoutes;

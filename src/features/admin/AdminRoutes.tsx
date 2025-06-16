import { Route, Navigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import ContestantsPage from "./contestants/pages/ContestantsPage";
import AboutAdminPage from "./about/pages/AboutAdminPage";
import UsersPage from "./user/page/UsersPage";
import { SchoolsPage } from "./schools/pages";
import { QuestionTopicsPage } from "./questionTopic/pages";
import { QuestionDetailListPage } from "./question-details/pages";
import StudentsPage from "./students/page/StudentsPage";
import QuestionsPackagesPage from "./questionpackages/page/QuestionsPackagesPage";
import ClassesPage from "./class/page/ClassPage";
import { ContestPage } from "./contests/pages";
import { QuestionsPage } from "./question/pages";
// Các component trang admin
const Dashboard = () => <div>Trang Dashboard</div>;

const AdminRoutes = () => {
  return (
    <Route path="/admin" element={<AdminLayout />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="schools" element={<SchoolsPage />} />
      <Route path="classes" element={<ClassesPage />} />
      <Route path="students" element={<StudentsPage />} />
      <Route path="question-topics" element={<QuestionTopicsPage />} />
      <Route
        path="question-packages/:packageId"
        element={<QuestionDetailListPage />}
      />
      <Route path="questions" element={<QuestionsPage />} />
      <Route path="question-packages" element={<QuestionsPackagesPage />} />
      <Route path="contests" element={<ContestPage />} />
      <Route path="contestants" element={<ContestantsPage />} />
      <Route path="about" element={<AboutAdminPage />} />
      <Route path="users" element={<UsersPage />} />

      <Route index element={<Navigate to="/admin/dashboard" replace />} />
    </Route>
  );
};
export default AdminRoutes;

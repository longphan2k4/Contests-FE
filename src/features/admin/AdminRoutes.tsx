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
import RescuesPage from "./rescues/page/RescuesPage";
import SponsorsPage from "./sponsors/page/SponsorsPage";
import AwardsPage from "./awards/page/AwardsPage";
// Các component trang admin
const Dashboard = () => <div>Trang Dashboard</div>;
const QuestionsPage = () => <div>Trang Quản lý câu hỏi</div>;
const ContestsPage = () => <div>Trang Quản lý cuộc thi</div>;
const ResultsPage = () => <div>Trang Kết quả</div>;
const ClassVideosPage = () => <div>Trang Videos lớp học</div>;
const SettingsPage = () => <div>Trang Cài đặt</div>;

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
      <Route path="contests" element={<ContestsPage />} />
      <Route path="contestants" element={<ContestantsPage />} />
      <Route path="results" element={<ResultsPage />} />
      <Route path="awards" element={<AwardsPage />} />
      <Route path="sponsors" element={<SponsorsPage />} />
      <Route path="class-videos" element={<ClassVideosPage />} />
      <Route path="about" element={<AboutAdminPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="users" element={<UsersPage />} />
      <Route path="rescues" element={<RescuesPage />} />
      {/* Chuyển hướng về dashboard nếu không có route nào khớp */}
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
    </Route>
  );
};
export default AdminRoutes;

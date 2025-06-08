import { Route, Navigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import ContestantsPage from './pages/ContestantsManage/ContestantsPage';
import AboutAdminPage from './about/pages/AboutAdminPage';
import UsersPage from './UsersManagement/pages/UsersPage';
import {
  SchoolsPage,
} from './schools/pages';
import {
  QuestionTopicsPage,
} from './questionTopic/pages';
import { 
  QuestionDetailListPage,
} from './question-details/pages';
// Các component trang admin
const Dashboard = () => <div>Trang Dashboard</div>;
//const SchoolsPage = () => <div>Trang Quản lý trường học</div>;
const ClassesPage = () => <div>Trang Quản lý lớp học</div>;
const StudentsPage = () => <div>Trang Quản lý sinh viên</div>;
// const QuestionTopicsPage = () => <div>Trang Quản lý chủ đề câu hỏi</div>;
const QuestionPackageListPage = () => <div>Trang Quản lý gói câu hỏi</div>;
const QuestionsPage = () => <div>Trang Quản lý câu hỏi</div>;
const ContestsPage = () => <div>Trang Quản lý cuộc thi</div>;
//const ContestantsPage = () => <div>Trang Quản lý thí sinh</div>;
const ResultsPage = () => <div>Trang Kết quả</div>;
const AwardsPage = () => <div>Trang Giải thưởng</div>;
const SponsorsPage = () => <div>Trang Nhà tài trợ</div>;
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
      <Route path="questions" element={<QuestionsPage />} />
      <Route path="question-packages" element={<QuestionPackageListPage />} />
      <Route path="question-packages/:packageId" element={<QuestionDetailListPage />} />
      <Route path="contests" element={<ContestsPage />} />
      <Route path="contestants" element={<ContestantsPage />} />
      <Route path="results" element={<ResultsPage />} />
      <Route path="awards" element={<AwardsPage />} />
      <Route path="sponsors" element={<SponsorsPage />} />
      <Route path="class-videos" element={<ClassVideosPage />} />
      <Route path="about" element={<AboutAdminPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="users" element={<UsersPage />} />
      {/* Chuyển hướng về dashboard nếu không có route nào khớp */}
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
    </Route>
  );
};

export default AdminRoutes; 
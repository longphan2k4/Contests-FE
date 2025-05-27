import { Route } from 'react-router-dom';
import PublicRoute from './PublicRoute';

// Tạo placeholder component cho các trang công khai
const HomePage = () => <div>Trang chủ</div>;
const AboutUsPage = () => <div>Giới thiệu</div>;
const ContactPage = () => <div>Liên hệ</div>;
const FAQPage = () => <div>Câu hỏi thường gặp</div>;

const PublicRoutes = () => {
  return (
    <>
      <Route path="/" element={<PublicRoute />}>
        <Route index element={<HomePage />} />
        <Route path="about-us" element={<AboutUsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="faq" element={<FAQPage />} />
      </Route>
    </>
  );
};

export default PublicRoutes; 
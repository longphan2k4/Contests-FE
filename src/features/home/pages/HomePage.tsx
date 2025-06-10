import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from '../../../layouts/HomeLayout/HomeHeader';
import Hero from '../components/home/Hero';
import Stats from '../components/home/Stats';
import About from '../components/home/About';
import Programs from '../components/home/Programs';
import News from '../components/home/News';
import Contact from '../components/home/Contact';
import Footer from '../../../layouts/HomeLayout/HomeFooter';

const HomePage: React.FC = () => {
  const location = useLocation();

  // Xác định tiêu đề dựa trên route
  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/':
        return 'Trang chủ - CĐ Kỹ Thuật Cao Thắng';
      default:
        return 'CĐ Kỹ Thuật Cao Thắng';
    }
  };

  // Cập nhật tiêu đề trên tab
  useEffect(() => {
    document.title = getPageTitle(location.pathname);
    const id = location.pathname.replace('/', '') || 'hero';
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white transition-colors duration-300">
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Stats />
              <About />
              <Programs />
              <News />
              <Contact />
            </>
          }
        />
        <Route path="/programs" element={<Programs />} />
        <Route path="/news" element={<News />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default HomePage;
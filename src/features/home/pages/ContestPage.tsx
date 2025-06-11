import { useRef, useEffect } from 'react';
import Header from '../../../layouts/HomeLayout/HomeHeader';
import BannerSlideshow from '../components/contest/Banner';
import VideoSection from '../components/contest/video';
import HeroSection from '../components/contest/Hero';
import StatsSection from '../components/contest/Stats';
import FeaturesSection from '../components/contest/Features';
import TimelineSection from '../components/contest/Timeline';
import CallToActionSection from '../components/contest/CallToAction';
import Footer from '../../../layouts/HomeLayout/HomeFooter';
import BackgroundEffects from '../components/contest/Background';
import FloatingNavButtons, { type Section } from '../components/contest/Navbar';

const ContestPage = () => {
  // Thêm useEffect để set title cho trang
  useEffect(() => {
    // Set title cho tab
    document.title = 'Cuộc thi - Olympic Tin học';
    
    // Cleanup function để reset title khi component unmount (tùy chọn)
    return () => {
      document.title = 'My App'; // hoặc title mặc định của app
    };
  }, []);

  // Refs cho các phần, sử dụng HTMLDivElement
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Các phần cho điều hướng với icon và màu sắc
  const sections: Section[] = [
    { 
      id: 'hero', 
      label: 'Trang chủ', 
      ref: heroRef,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      )
    },
    { 
      id: 'stats', 
      label: 'Thống kê', 
      ref: statsRef,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
        </svg>
      )
    },
    { 
      id: 'features', 
      label: 'Tính năng', 
      ref: featuresRef,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    },
    { 
      id: 'timeline', 
      label: 'Lịch trình', 
      ref: timelineRef,
      color: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600',
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
        </svg>
      )
    },
    { 
      id: 'cta', 
      label: 'Hành động', 
      ref: ctaRef,
      color: 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600',
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,17L16.24,14.76L15.64,10.26L11.49,8.5L7.34,10.26L6.74,14.76L12,17Z"/>
        </svg>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-800 overflow-hidden pt-20">
      <BackgroundEffects />
      <Header />
      <FloatingNavButtons sections={sections} />
      <div ref={heroRef} id="hero" className="grid grid-cols-1 lg:grid-cols-[68%_30%] gap-6 max-w-7xl mx-auto">
        <BannerSlideshow />
        <VideoSection />
      </div>
      <div ref={statsRef} id="stats">
        <HeroSection />
      </div>
      <div >
        <StatsSection />
      </div>
      <div ref={featuresRef} id="features">
        <FeaturesSection />
      </div>
      <div ref={timelineRef} id="timeline">
        <TimelineSection />
      </div>
      <div ref={ctaRef} id="cta">
        <CallToActionSection />
      </div>
      <Footer />
    </div>
  );
};

export default ContestPage;
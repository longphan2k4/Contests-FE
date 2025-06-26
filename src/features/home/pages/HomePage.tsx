import { useRef, useEffect } from 'react';
import Header from '../../../layouts/HomeLayout/HomeHeader';
import BannerSlideshow from '../components/contest/Banner';
import VideoSection from '../components/contest/Video';
import HeroSection from '../components/contest/Hero';
import StatsSection from '../components/contest/Stats';
import TimelineSection from '../components/contest/Timeline';
import SponsorsSection from '../components/contest/SponsorsSection';
import ContestRulesSection from '../components/contest/ContestRulesSection';
import Footer from '../../../layouts/HomeLayout/HomeFooter';
import BackgroundEffects from '../components/contest/Background';
const HomePage = () => {
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
  const homeRef = useRef<HTMLDivElement>(null);
  const contestRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const sponsorRef = useRef<HTMLDivElement>(null);
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-800 overflow-hidden pt-20">
      <BackgroundEffects />
      <Header />
      <div ref={homeRef} id="home" className="grid grid-cols-1 lg:grid-cols-[68%_30%] gap-6 max-w-7xl mx-auto">
        <BannerSlideshow />
        <VideoSection />
      </div>
      <div ref={contestRef} id="contest">
        <HeroSection />
      </div>
      <div >
        <StatsSection />
      </div>
      <div ref={ruleRef} id="rules">
        <ContestRulesSection />
      </div>
      <div ref={timelineRef} id="timeline">
        <TimelineSection />
      </div>
      <div ref={sponsorRef} id="sponsors">
        <SponsorsSection />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
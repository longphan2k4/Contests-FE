
import { useRef, useEffect, useState } from 'react';
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
import LargeSpinner from '@components/LargeSpinner';

const HomePage = () => {
  // Trạng thái để kiểm soát việc tải
  const [isLoading, setIsLoading] = useState(true);

  // Thêm useEffect để set title cho trang và giả lập tải
  useEffect(() => {
    // Set title cho tab
    document.title = 'Cuộc thi - Olympic Tin học';

    // Giả lập thời gian tải (thay thế bằng logic tải thực tế nếu có)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Tải trong 2 giây

    // Cleanup function
    return () => {
      document.title = 'My App'; // hoặc title mặc định của app
      clearTimeout(timer);
    };
  }, []);

  // Refs cho các phần, sử dụng HTMLDivElement
  const homeRef = useRef<HTMLDivElement>(null);
  const contestRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const sponsorRef = useRef<HTMLDivElement>(null);

  // Nếu đang tải, hiển thị LargeSpinner
  if (isLoading) {
    return <LargeSpinner size={80}/>;
  }

  // Nội dung chính khi tải xong
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
      <div>
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

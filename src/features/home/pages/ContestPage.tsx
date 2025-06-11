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

const ContestPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-800 overflow-hidden pt-20">
      <BackgroundEffects />
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-[68%_30%] gap-6 max-w-7xl mx-auto">
        <BannerSlideshow />
        <VideoSection />
      </div>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <TimelineSection />
      <CallToActionSection />
      <Footer />
    </div>
  );
};

export default ContestPage;
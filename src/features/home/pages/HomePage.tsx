import React from 'react';
import Header from '../../../layouts/HomeLayout/HomeHeader';
import Hero from '../components/home/Hero';
import Stats from '../components/home/Stats';
import About from '../components/home/About';
import Programs from '../components/home/Programs';
import News from '../components/home/News';
import Contact from '../components/home/Contact';
import Footer from '../../../layouts/HomeLayout/HomeFooter';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white transition-colors duration-300">
      <Header />
      <Hero />
      <Stats />
      <About />
      <Programs />
      <News />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomePage;
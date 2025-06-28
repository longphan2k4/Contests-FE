import React, { useEffect } from 'react';
import TopThreeBoard from '../components/TopThreeBoard';
import '../styles.css'; // Ensure this path is correct based on your project structure

declare global {
  interface Window {
    particlesJS: any;
    pJSDom: any[];
  }
}

const TopThreeReveal: React.FC = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.particlesJS) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return <TopThreeBoard />;
};

export default TopThreeReveal;
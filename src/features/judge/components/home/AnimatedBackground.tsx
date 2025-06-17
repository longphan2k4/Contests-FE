import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-3/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply opacity-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply opacity-10"></div>
    </div>
  );
};

export default AnimatedBackground;
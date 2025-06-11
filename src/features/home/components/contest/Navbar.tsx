import React from 'react';

// Định nghĩa interface cho section
export interface Section {
  id: string;
  label: string;
  icon: React.ReactNode;
  ref: React.RefObject<HTMLDivElement | null>;
  color: string;
}

// Định nghĩa interface cho props của FloatingNavButtons
interface FloatingNavButtonsProps {
  sections: Section[];
}

// Thành phần FloatingNavButtons
const FloatingNavButtons: React.FC<FloatingNavButtonsProps> = ({ sections }) => {
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Desktop Navigation - Vertical */}
      <div className="hidden md:flex fixed right-2 sm:right-4 lg:right-6 top-1/2 transform -translate-y-1/2 z-50 flex-col space-y-3 lg:space-y-4">
        {sections.map((section: Section, index) => (
          <div key={section.id} className="relative group">
            {/* Tooltip - chỉ hiển thị trên desktop */}
            <div className="hidden lg:block absolute right-full mr-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
                {section.label}
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
              </div>
            </div>
            
            {/* Button */}
            <button
              onClick={() => scrollToSection(section.ref)}
              className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center text-white font-semibold border-2 border-white/20 backdrop-blur-sm ${section.color}`}
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: 'slideInRight 0.6s ease-out forwards'
              }}
              aria-label={`Đi đến ${section.label}`}
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7">
                {section.icon}
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Mobile Navigation - Horizontal Bottom */}
      <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex space-x-2 bg-white/90 backdrop-blur-md rounded-full p-2 shadow-lg border border-white/20">
        {sections.map((section: Section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.ref)}
            className={`w-12 h-12 rounded-full shadow-md hover:shadow-lg transform hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center text-white font-semibold ${section.color}`}
            style={{
              animationDelay: `${index * 0.1}s`,
              animation: 'slideInUp 0.6s ease-out forwards'
            }}
            aria-label={`Đi đến ${section.label}`}
          >
            <div className="w-5 h-5">
              {section.icon}
            </div>
          </button>
        ))}
      </div>

      {/* CSS cho animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(100px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(100px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `
      }} />
    </>
  );
};

export default FloatingNavButtons;
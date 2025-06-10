import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from "../../assets/image/logo/logo-caothang.png"
const Header: React.FC = () => {
  // Mock navigate function for demo
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState('hero');

  const handleRegisterClick = () => {
    navigate('/login');
  };

  const navItems = [
    { name: 'Trang chủ', id: 'hero' },
    { name: 'Cuộc thi', id: 'contest' },
    { name: 'Đào tạo', id: 'programs' },
    { name: 'Tin tức', id: 'news' },
    { name: 'Liên hệ', id: 'contact' },
  ];

  const scrollToSection = (id: string) => {
    setActiveItem(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-cyan-100' 
          : 'bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 shadow-lg'
      }`}
    >
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/5 via-blue-600/5 to-indigo-600/5 opacity-0 hover:opacity-100 transition-opacity duration-700"></div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-cyan-300/20 rounded-full animate-pulse"></div>
        <div className="absolute top-3 right-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1 right-12 w-3 h-3 bg-indigo-300/25 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-6 relative">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}>
          
          {/* Logo Section với animation */}
          <div className="flex items-center space-x-4 group">
            <div className="w-12 h-12 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              {/* Replace this div with your actual logo */}
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <img src={Logo} alt="Logo" className="w-7 h-10 object-cover" />
              </div>    
              {/* 
              Uncomment this and comment the div above when you have your logo:
              <img src={Logo} alt="Logo" className="w-7 h-10 object-cover" />
              */}
            </div>
            <div className="relative">
              <h1 className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-700 transition-all duration-300 ${
                isScrolled ? 'text-lg' : 'text-xl'
              }`}>
                Cao đẳng Kỹ Thuật Cao Thắng
              </h1>
              <p className="text-sm text-cyan-600/80 font-medium">
                Khoa Công Nghệ Thông Tin
              </p>
              {/* Animated underline */}
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-500"></div>
            </div>
          </div>
          
          {/* Navigation với hover effects */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item, index) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-4 py-2 font-medium transition-all duration-300 rounded-lg group ${
                  activeItem === item.id
                    ? 'text-cyan-700 bg-cyan-100/50'
                    : 'text-gray-700 hover:text-cyan-700'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Hover background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                
                {/* Text with relative positioning */}
                <span className="relative z-10">{item.name}</span>
                
                {/* Active indicator */}
                {activeItem === item.id && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                )}
                
                {/* Hover indicator */}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full group-hover:w-8 transition-all duration-300"></div>
              </button>
            ))}
          </nav>

          {/* Login Button với advanced effects */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleRegisterClick}
              className="relative overflow-hidden bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 blur transition-all duration-300"></div>
              
              <span className="relative z-10">Đăng nhập</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom gradient border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent"></div>
    </header>
  );
};

export default Header;
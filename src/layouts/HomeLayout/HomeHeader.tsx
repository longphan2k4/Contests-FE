import React from 'react';
import Logo from "../../assets/image/logo/logo-caothang.png"
const Header: React.FC = () => {
  const navItems = [
    { name: 'Trang chủ', id: 'hero' },
    { name: 'Cuộc thi', id: 'contest' }, // Thay 'Giới thiệu' bằng 'Cuộc thi', liên kết đến Stats
    { name: 'Đào tạo', id: 'programs' },
    { name: 'Tin tức', id: 'news' },
    { name: 'Liên hệ', id: 'contact' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <img src={Logo} alt="Logo" className="w-7 h-10 object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Cao đẳng Kỹ Thuật Cao Thắng</h1>
              <p className="text-sm text-gray-600">Khoa CNTT</p>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
              >
                {item.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300">
              Tuyển sinh 2025
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
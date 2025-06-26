import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../features/auth/hooks/useprofile";
import { useNotification } from "../../contexts/NotificationContext";
import Logo from "../../assets/image/logo/logo-caothang.png";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState("hero");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { data: userProfile, isLoading: profileLoading } = useProfile();
  const { showSuccessNotification } = useNotification();

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleContestClick = () => {
    navigate("/cuoc-thi");
  };

  const handleLogout = () => {
    document.cookie =
      "feAccessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    localStorage.removeItem("feAccessToken");
    showSuccessNotification("Đăng xuất thành công");
    navigate("/");
    window.location.reload();
  };

  const navItems = [
    { name: "Trang chủ", id: "home", type: "navigate" },
    { name: "Cuộc thi", id: "contest", type: "navigate" },
    { name: "Đào tạo", id: "programs", type: "scroll" },
    { name: "Tin tức", id: "news", type: "scroll" },
    { name: "Liên hệ", id: "contact", type: "scroll" },
  ];

  const handleNavClick = (item: { id: string; type: string }) => {
    setActiveItem(item.id);
    if (item.type === "navigate" && item.id === "contest") {
      handleContestClick();
    } else {
      if (item.type === "navigate" && item.id === "home") {
        handleHomeClick();
      } else {
        const element = document.getElementById(item.id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const isLoggedIn = userProfile?.success && userProfile?.data;
  const userName =
    userProfile?.data?.name || userProfile?.data?.username || "Người dùng";
  const userRole = userProfile?.data?.role?.toLowerCase(); // Chuẩn hóa role thành lowercase để so sánh

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-xl border-b border-cyan-100"
          : "bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 shadow-lg"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/5 via-blue-600/5 to-indigo-600/5 opacity-0 hover:opacity-100 transition-opacity duration-700"></div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-cyan-300/20 rounded-full animate-pulse"></div>
        <div
          className="absolute top-3 right-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1 right-12 w-3 h-3 bg-indigo-300/25 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container mx-auto px-6 relative">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled ? "h-16" : "h-20"
          }`}
        >
          <div className="flex items-center space-x-4 group">
            <div className="w-12 h-12 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <img src={Logo} alt="Logo" className="w-7 h-10 object-cover" />
              </div>
            </div>
            <div className="relative">
              <h1
                className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-700 transition-all duration-300 ${
                  isScrolled ? "text-lg" : "text-xl"
                }`}
              >
                Cao đẳng Kỹ Thuật Cao Thắng
              </h1>
              <p className="text-sm text-cyan-600/80 font-medium">
                Khoa Công Nghệ Thông Tin
              </p>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-500"></div>
            </div>
          </div>

          <nav className="hidden md:flex space-x-1">
            {navItems.map((item, index) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item)}
                className={`relative px-4 py-2 font-medium transition-all duration-300 rounded-lg group ${
                  activeItem === item.id
                    ? "text-cyan-700 bg-cyan-100/50"
                    : "text-gray-700 hover:text-cyan-700"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                <span className="relative z-10">{item.name}</span>
                {activeItem === item.id && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                )}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full group-hover:w-8 transition-all duration-300"></div>
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {!profileLoading && (
              <>
                {isLoggedIn ? (
                  <div className="relative user-menu-container">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-3 bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 px-4 py-2 rounded-xl border border-cyan-200 hover:border-cyan-300 transition-all duration-300 group"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium text-gray-700 group-hover:text-cyan-700">
                          Xin chào
                        </span>
                        <span className="text-sm font-semibold text-cyan-700">
                          {userName}
                        </span>
                      </div>
                      <svg
                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                          showUserMenu ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-xs text-gray-500">
                            Đăng nhập với tư cách
                          </p>
                          <p className="text-sm font-semibold text-gray-700">
                            {userName}
                          </p>
                          {userRole && (
                            <p className="text-xs text-cyan-600 capitalize">
                              {userRole}
                            </p>
                          )}
                        </div>

                        {/* Menu Item: Hồ sơ (Profile) */}
                        <button
                          onClick={() => {
                            navigate("/account/profile");
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-700 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-2">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            <span>Hồ sơ</span>
                          </div>
                        </button>

                        {/* Menu Item: Trang quản lý hoặc Trang giám khảo dựa trên role */}
                        {(userRole === "admin" || userRole === "judge") && (
                          <button
                            onClick={() => {
                              if (userRole === "admin") {
                                navigate("/admin/dashboard");
                              } else if (userRole === "judge") {
                                navigate("/cuoc-thi"); // Đường dẫn cho trang giám khảo
                              }
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-700 transition-colors duration-200"
                          >
                            <div className="flex items-center space-x-2">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 12l2-2m0 0l7-7 7 7m-9 5v6h4v-6m-7-7h14"
                                />
                              </svg>
                              <span>
                                {userRole === "admin"
                                  ? "Trang quản lý"
                                  : "Trang giám khảo"}
                              </span>
                            </div>
                          </button>
                        )}

                        {/* Menu Item: Đăng xuất */}
                        <button
                          onClick={() => {
                            handleLogout();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-2">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            <span>Đăng xuất</span>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleLoginClick}
                    className="relative overflow-hidden bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 blur transition-all duration-300"></div>
                    <span className="relative z-10">Đăng nhập</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent"></div>
    </header>
  );
};

export default Header;

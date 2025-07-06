import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useNotification } from "../../contexts/NotificationContext";
import Logo from "../../assets/image/logo/logo-caothang.svg";

import { useAuth } from "../../features/auth/hooks/authContext";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, loading } = useAuth();

  const [activeItem, setActiveItem] = useState("home");

  const [showUserMenu, setShowUserMenu] = useState(false);

  const { showSuccessNotification } = useNotification();

  const handleHomeClick = () => {
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const handleContestClick = () => {
    navigate("/cuoc-thi");
    setIsMobileMenuOpen(false);
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
    { name: "Trang chủ", id: "home", type: "scroll" },
    { name: "Cuộc thi", id: "contest", type: "scroll" },
    { name: "Thể lệ thi", id: "rules", type: "scroll" },
    { name: "Lịch trình", id: "timeline", type: "scroll" },
    { name: "Nhà tài trợ", id: "sponsors", type: "scroll" },
  ];

  const handleNavClick = (item: { id: string; type: string }) => {
    setActiveItem(item.id);
    setIsMobileMenuOpen(false);

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
      if (
        !target.closest(".mobile-menu-container") &&
        !target.closest(".mobile-menu-button")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
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

        <div className="container mx-auto px-4 sm:px-6 relative">
          <div
            className={`flex items-center justify-between transition-all duration-300 ${
              isScrolled ? "h-14 sm:h-16" : "h-16 sm:h-20"
            }`}
          >
            {/* Logo Section */}
            <div className="flex items-center space-x-2 sm:space-x-4 group">
              <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <img
                  src={Logo}
                  alt="Logo"
                  className="w-5 h-7 sm:w-7 sm:h-10 object-cover"
                />
              </div>
              <div className="relative">
                <h1
                  className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-700 transition-all duration-300 ${
                    isScrolled ? "text-sm sm:text-lg" : "text-base sm:text-xl"
                  }`}
                >
                  Olympic Tin học 2025
                </h1>
                <p className="text-xs sm:text-sm text-cyan-600/80 font-medium">
                  Khoa Công Nghệ Thông Tin
                </p>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-500"></div>
              </div>
            </div>

            {/* Desktop Navigation */}
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

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {!loading && (
                <>
                  {user ? (
                    <div className="relative user-menu-container">
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 px-2 sm:px-4 py-2 rounded-xl border border-cyan-200 hover:border-cyan-300 transition-all duration-300 group"
                      >
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                          {user?.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="hidden sm:flex flex-col items-start">
                          <span className="text-sm font-medium text-gray-700 group-hover:text-cyan-700">
                            Xin chào
                          </span>
                          <span className="text-sm font-semibold text-cyan-700">
                            {user?.username || "Người dùng"}
                          </span>
                        </div>
                        <svg
                          className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-500 transition-transform duration-200 ${
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

                      {/* User Dropdown Menu */}
                      {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-xs text-gray-500">
                              Đăng nhập với tư cách
                            </p>
                            <p className="text-sm font-semibold text-gray-700">
                              {user?.username || "Người dùng"}
                            </p>
                            {user?.role && (
                              <p className="text-xs text-cyan-600 capitalize">
                                {user?.role}
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
                          {(user?.role === "Admin" ||
                            user?.role === "Judge") && (
                            <button
                              onClick={() => {
                                if (user?.role === "Admin") {
                                  navigate("/admin/dashboard");
                                } else if (user?.role === "Judge") {
                                  navigate("/cuoc-thi");
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
                                  {user?.role === "Admin"
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
                      className="relative overflow-hidden bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group text-sm sm:text-base"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 blur transition-all duration-300"></div>
                      <span className="relative z-10">Đăng nhập</span>
                    </button>
                  )}
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden mobile-menu-button p-2 rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 border border-cyan-200 hover:border-cyan-300 transition-all duration-300"
              >
                <div className="w-5 h-5 flex flex-col justify-center space-y-1">
                  <span
                    className={`block h-0.5 bg-cyan-700 transition-all duration-300 ${
                      isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                    }`}
                  ></span>
                  <span
                    className={`block h-0.5 bg-cyan-700 transition-all duration-300 ${
                      isMobileMenuOpen ? "opacity-0" : ""
                    }`}
                  ></span>
                  <span
                    className={`block h-0.5 bg-cyan-700 transition-all duration-300 ${
                      isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent"></div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Menu */}
      <div
        className={`mobile-menu-container fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } shadow-2xl`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-cyan-50 to-blue-50">
            <div className="flex items-center space-x-3">
              <img src={Logo} alt="Logo" className="w-6 h-8 object-cover" />
              <div>
                <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 to-blue-700">
                  Olympic Tin học
                </h2>
                <p className="text-xs text-cyan-600/80">CNTT 2025</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 py-4">
            {navItems.map((item, index) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item)}
                className={`w-full text-left px-6 py-4 font-medium transition-all duration-300 border-l-4 ${
                  activeItem === item.id
                    ? "text-cyan-700 bg-cyan-50 border-cyan-500"
                    : "text-gray-700 hover:text-cyan-700 hover:bg-cyan-50/50 border-transparent hover:border-cyan-300"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-base">{item.name}</span>
                  {activeItem === item.id && (
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  )}
                </div>
              </button>
            ))}
          </nav>

          {/* Mobile Menu Footer */}
          {!loading && !user && (
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={handleLoginClick}
                className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Đăng nhập
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;

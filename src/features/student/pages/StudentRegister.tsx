import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useStudentRegister, useClassList } from "../hooks/useStudentAuth";
import type { RegisterFormData } from "../types";
import {
  UserIcon,
  LockClosedIcon,
  AcademicCapIcon,
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const StudentRegister: React.FC = () => {
  const { register, isLoading, errors, clearErrors } = useStudentRegister();
  const {
    getUniqueSchools,
    getClassesBySchool,
    isLoading: isLoadingClasses,
  } = useClassList();

  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    classId: 0,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Dropdown states
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [schoolSearch, setSchoolSearch] = useState("");
  const [classSearch, setClassSearch] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");

  // Refs for click outside
  const schoolDropdownRef = useRef<HTMLDivElement>(null);
  const classDropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        schoolDropdownRef.current &&
        !schoolDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSchoolDropdown(false);
        setSchoolSearch("");
      }
      if (
        classDropdownRef.current &&
        !classDropdownRef.current.contains(event.target as Node)
      ) {
        setShowClassDropdown(false);
        setClassSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: RegisterFormData) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      clearErrors();
    }
  };

  const handleSchoolSelect = (schoolName: string) => {
    setSelectedSchool(schoolName);
    setFormData((prev) => ({
      ...prev,
      classId: 0, // Reset classId when school changes
    }));
    setShowSchoolDropdown(false);
    setSchoolSearch("");
    clearErrors();
  };

  const handleClassSelect = (classId: number) => {
    setFormData((prev) => ({
      ...prev,
      classId: classId,
    }));
    setShowClassDropdown(false);
    setClassSearch("");
    clearErrors();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(formData);
  };

  const handleDemoRegister = () => {
    setFormData({
      username: "khoa4",
      fullName: "Nguyễn Thị Test5",
      email: "admin4@example.com",
      password: "Khoa12345@",
      confirmPassword: "Khoa12345@",
      classId: 2,
    });
    setSelectedSchool("Trường THPT Bùi Thị Xuân");
  };

  // Filter schools and classes based on search
  const filteredSchools = getUniqueSchools().filter((school) =>
    school.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  const filteredClasses = selectedSchool
    ? getClassesBySchool(selectedSchool).filter((cls) =>
        cls.name.toLowerCase().includes(classSearch.toLowerCase())
      )
    : [];

  // Get selected class name for display
  const getSelectedClassName = () => {
    if (formData.classId === 0)
      return selectedSchool ? "Chọn lớp" : "Vui lòng chọn trường trước";
    const selectedClass = filteredClasses.find(
      (cls) => cls.id === formData.classId
    );
    return selectedClass ? selectedClass.name : "Chọn lớp";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative w-full max-w-lg">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <AcademicCapIcon className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Đăng ký Thí sinh
          </h1>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}


            {/* Full Name Field */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Họ và tên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.fullName
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors`}
                  placeholder="Nhập họ và tên đầy đủ"
                  autoComplete="name"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>
            {/* School Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trường
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowSchoolDropdown(!showSchoolDropdown)}
                  className={`block w-full pl-10 pr-10 py-3 border ${
                    errors.classId
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors text-left`}
                >
                  {selectedSchool || "Chọn trường"}
                </button>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* School Dropdown Menu */}
              {showSchoolDropdown && (
                <div
                  className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden"
                  ref={schoolDropdownRef}
                >
                  {/* Search Input */}
                  <div className="p-2 border-b border-gray-200">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Tìm trường..."
                        value={schoolSearch}
                        onChange={(e) => setSchoolSearch(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* School List */}
                  <div className="max-h-48 overflow-y-auto">
                    {isLoadingClasses ? (
                      <div className="p-3 text-center text-gray-500 text-sm">
                        Đang tải danh sách trường...
                      </div>
                    ) : filteredSchools.length > 0 ? (
                      filteredSchools.map((school) => (
                        <button
                          key={school}
                          type="button"
                          onClick={() => handleSchoolSelect(school)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-sm"
                        >
                          {school}
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-center text-gray-500 text-sm">
                        Không tìm thấy trường
                      </div>
                    )}
                  </div>
                </div>
              )}

              {errors.classId && (
                <p className="mt-1 text-sm text-red-600">{errors.classId}</p>
              )}
            </div>

            {/* Class Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lớp
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    selectedSchool && setShowClassDropdown(!showClassDropdown)
                  }
                  disabled={!selectedSchool}
                  className={`block w-full pl-10 pr-10 py-3 border ${
                    errors.classId
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : selectedSchool
                      ? "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                      : "border-gray-300 bg-gray-50 cursor-not-allowed"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors text-left`}
                >
                  {getSelectedClassName()}
                </button>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Class Dropdown Menu */}
              {showClassDropdown && selectedSchool && (
                <div
                  className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden"
                  ref={classDropdownRef}
                >
                  {/* Search Input */}
                  <div className="p-2 border-b border-gray-200">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Tìm lớp..."
                        value={classSearch}
                        onChange={(e) => setClassSearch(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Class List */}
                  <div className="max-h-48 overflow-y-auto">
                    {isLoadingClasses ? (
                      <div className="p-3 text-center text-gray-500 text-sm">
                        Đang tải danh sách lớp...
                      </div>
                    ) : filteredClasses.length > 0 ? (
                      filteredClasses.map((cls) => (
                        <button
                          key={cls.id}
                          type="button"
                          onClick={() => handleClassSelect(cls.id)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-sm"
                        >
                          {cls.name}
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-center text-gray-500 text-sm">
                        Không tìm thấy lớp
                      </div>
                    )}
                  </div>
                </div>
              )}

              {errors.classId && (
                <p className="mt-1 text-sm text-red-600">{errors.classId}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.email
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors`}
                  placeholder="Nhập địa chỉ email"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.username
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors`}
                  placeholder="Nhập tên đăng nhập"
                  autoComplete="username"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-10 py-3 border ${
                    errors.password
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors`}
                  placeholder="Nhập mật khẩu (ít nhất 8 ký tự)"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-10 py-3 border ${
                    errors.confirmPassword
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors`}
                  placeholder="Nhập lại mật khẩu"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              } transition-colors focus:outline-none`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang đăng ký...
                </div>
              ) : (
                "Đăng ký"
              )}
            </button>

            {/* Demo Register */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDemoRegister}
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Điền thông tin demo
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                to="/student/login"
                className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentRegister;

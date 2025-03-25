import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../images/LCMSlogo.jpg";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";

function Navbar() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // 1) Khởi tạo user có avatar & fullname
  const [user, setUser] = useState({
    fullname: "Loading...",
    avatar: "",
  });

  // 2) Lắng nghe sự kiện scroll
  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY >= 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3) Gọi API lấy thông tin user qua ID
  useEffect(() => {
    async function fetchUser() {
      try {
        // Thay ID user tùy trường hợp của bạn (hardcode = 1, hoặc lấy từ token)
        const userId = localStorage.getItem("userId");
        const res = await fetch(`http://localhost:5000/api/users/${userId}`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Lỗi lấy user:", error);
        setUser({ fullname: "User", avatar: "" });
      }
    }
    fetchUser();
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        navScrolled
          ? "bg-white/80 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Logo" className="w-16 h-auto mr-2" />
          <span className="text-xl font-bold text-gray-800 hidden sm:block uppercase tracking-wide">
            LCMS
          </span>
        </Link>

        {/* Nút mở menu (mobile) */}
        <button
          className="lg:hidden text-gray-800 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="block w-6 h-0.5 bg-black mb-1"></span>
          <span className="block w-6 h-0.5 bg-black mb-1"></span>
          <span className="block w-6 h-0.5 bg-black"></span>
        </button>

        {/* Menu links */}
        <ul
          className={`lg:flex lg:space-x-6 font-semibold uppercase tracking-wide transition-all duration-300 ${
            isMenuOpen ? "block" : "hidden"
          } lg:block absolute lg:static top-16 lg:top-0 left-0 w-full lg:w-auto bg-white lg:bg-transparent shadow-md lg:shadow-none`}
        >
          {["/homepage", "/aboutus", "/courses", "/reviews", "/contact"].map(
            (path, i) => (
              <li key={i}>
                <Link
                  to={path}
                  className="block px-6 py-3 lg:py-0 text-gray-800 hover:text-red-600 transition"
                >
                  {["Home", "Features", "Courses", "Reviews", "Contact"][i]}
                </Link>
              </li>
            )
          )}
        </ul>

        {/* User Profile */}
        <div className="relative ml-4">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 text-gray-800 hover:text-red-600"
          >
            {/* 4) Nếu có avatar => hiển thị ảnh, ngược lại hiển thị icon FaUserCircle */}
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-8 h-8 rounded-full border border-gray-300 object-cover"
              />
            ) : (
              <FaUserCircle className="text-2xl" />
            )}
            <span className="hidden sm:block font-medium">{user.fullname}</span>
            <FaChevronDown className="text-xs mt-1" />
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                Trang cá nhân
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                Cài đặt
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

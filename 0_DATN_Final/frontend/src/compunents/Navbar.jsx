import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../images/LCMSlogo.jpg";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";

function Navbar() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null); // null = chưa login

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY >= 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) {
        setUser(null);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/users/${userId}`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Lỗi lấy user:", error);
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        navScrolled
          ? "bg-blue-600 shadow-md"
          : "bg-gradient-to-b from-blue-700 via-blue-600 to-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Logo" className="w-12 h-auto mr-2 rounded-md" />
          <span className="text-xl font-bold text-white uppercase tracking-wide">
            LCMS
          </span>
        </Link>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>

        {/* Menu links */}
        <ul
          className={`lg:flex lg:space-x-8 text-white font-medium uppercase tracking-wide transition-all duration-300 ${
            isMenuOpen ? "block" : "hidden"
          } lg:block absolute lg:static top-16 left-0 w-full lg:w-auto bg-blue-700 lg:bg-transparent shadow-md lg:shadow-none`}
        >
          {["/homepage", "/aboutus", "/courses", "/reviews", "/contact"].map(
            (path, i) => (
              <li key={i}>
                <Link
                  to={path}
                  className="block px-6 py-3 lg:py-0 hover:text-yellow-300 transition"
                >
                  {["Home", "Posts", "Courses", "Reviews", "Contact"][i]}
                </Link>
              </li>
            )
          )}
        </ul>

        {/* User / Login */}
        <div className="relative ml-4">
          {user ? (
            <>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 text-white hover:text-yellow-300 transition"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full border border-white object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-2xl" />
                )}
                <span className="hidden sm:block font-medium">{user.fullname}</span>
                <FaChevronDown className="text-xs mt-1" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-blue-50"
                  >
                    Trang cá nhân
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm hover:bg-blue-50"
                  >
                    Cài đặt
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("userId");
                      window.location.href = "/";
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-blue-50"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link
              to="/auth"
              className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-md hover:bg-yellow-300 hover:text-blue-900 transition"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

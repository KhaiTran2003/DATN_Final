import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/LCMSlogo.jpg';

function NavbarAdmin({ handleOnChange }) {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const id_user = localStorage.getItem('userId');

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${id_user}`);
        const data = await res.json();
        if (res.ok) setUser(data);
        else console.error("Không tìm thấy người dùng:", data.message);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
      }
    };

    if (id_user) fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full h-20 bg-white shadow-md flex items-center px-6 z-50 border-b border-gray-200">
      {/* Logo */}
      <div className="w-60 flex items-center">
        <Link to="/admin-dashboard" className="flex items-center space-x-2">
          <img src={logo} alt="LCMS" className="h-12 w-auto rounded-md" />
          <span className="text-xl font-bold text-blue-600 tracking-wide">LCMS Admin</span>
        </Link>
      </div>

      {/* Search */}
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Tìm kiếm người dùng, khóa học, bài học.."
          className="w-full max-w-lg px-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          onChange={handleOnChange}
        />
      </div>

      {/* Right Area */}
      <div className="flex items-center space-x-6 relative">
        {/* Thông báo icon */}
        <button className="relative text-gray-500 hover:text-blue-600 transition text-lg">
          🔔
        </button>

        {/* Avatar và Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 focus:outline-none"
          >
            {user ? (
              <>
                <img
                  src={user.avatar || "/default_avatar.png"}
                  alt="Avatar"
                  className="w-11 h-11 rounded-full border-2 border-blue-500 object-cover hover:scale-105 transition-transform"
                />
                <span className="text-gray-700 font-medium hidden sm:inline-block">
                  {user.fullname || "Người dùng"}
                </span>
              </>
            ) : (
              <span className="text-gray-400">Đang tải...</span>
            )}
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-52 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fade-in">
              <ul className="py-2 text-sm text-gray-700">
                <li>
                  <Link
                    to={`/edit-user/${user?.id_user}`}
                    className="block px-4 py-2 hover:bg-blue-50"
                  >
                    Chỉnh sửa hồ sơ
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      localStorage.removeItem('userId');
                      window.location.href = "/login";
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-blue-50"
                  >
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavbarAdmin;

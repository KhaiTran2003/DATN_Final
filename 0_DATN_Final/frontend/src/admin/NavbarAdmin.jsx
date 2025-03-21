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
  
        console.log("📌 API Response:", data); // Kiểm tra dữ liệu
  
        if (res.ok) {
          setUser(data);
        } else {
          console.error("⚠️ Không tìm thấy người dùng:", data.message);
        }
      } catch (err) {
        console.error("❌ Lỗi khi lấy thông tin người dùng:", err);
      }
    };
  
    if (id_user) {
      fetchUser();
    }
  }, []);
  


  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full h-[88px] bg-white shadow-md flex items-center px-6 z-50 transition-all duration-300">
      {/* Logo */}
      <div className="w-[250px] flex items-center">
        <Link to="/admin-dashboard">
          <img src={logo} alt="Logo" className="h-12" />
        </Link>
      </div>

      {/* Search Box */}
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full max-w-lg px-4 py-2 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={handleOnChange}
        />
      </div>

      {/* User Info & Avatar */}
      <div className="flex items-center space-x-6 relative">
        {/* Thông báo */}
        <button className="relative text-gray-700 hover:text-blue-500">
          🔔
        </button>

        {/* Avatar & Fullname */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            {user ? (
              <>
                <img
                  src={user.avatar ? user.avatar : "../../public/default_avatar.png"}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 hover:scale-105 transition"
                />
                <span className="text-gray-700 font-medium">{user.fullname || "Người dùng"}</span>
              </>
            ) : (
              <span className="text-gray-500">Đang tải...</span>
            )}
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
              <ul className="py-2">
                <li>
                  <Link
                    to={`/edit-user/${user?.id_user}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Edit Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      localStorage.removeItem('userId'); // Xóa token đăng nhập
                      window.location.href = "/login"; // Chuyển hướng đến trang đăng nhập
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Log Out
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

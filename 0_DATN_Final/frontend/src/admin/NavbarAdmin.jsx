import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/LCMSlogo.jpg';

function NavbarAdmin({ handleOnChange }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const id_user = localStorage.getItem('userId');

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${id_user}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Không thể tải thông tin người dùng:", err);
      }
    };

    if (id_user) {
      fetchUser();
    }
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full h-[88px] bg-white shadow-md flex items-center px-6 z-50">
      {/* Logo - Không bị ảnh hưởng bởi sidebar */}
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
      <div className="flex items-center space-x-6">
        <span className="text-gray-700 font-medium">{user ? user.fullname : 'Đang tải...'}</span>

        {/* Thông báo */}
        <button className="relative text-gray-700 hover:text-blue-500">
          🔔
        </button>

        {/* Avatar */}
        {user && (
          <Link to={`/edit-user/${user.id_user}`}>
            <img
              src={`http://localhost:5000/${user.avatar}`}
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 hover:scale-105 transition"
            />
          </Link>
        )}
      </div>
    </nav>
  );
}

export default NavbarAdmin;

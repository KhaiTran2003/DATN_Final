import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SidebarAdmin({ isSidebarOpen, toggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    sessionStorage.clear();
    caches.keys().then((names) => names.forEach((name) => caches.delete(name)));
    window.history.replaceState(null, "", window.location.href);
    window.location.href = "/login";
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gradient-to-b from-blue-800 to-blue-900 text-white shadow-lg transition-all duration-300
        ${isSidebarOpen ? 'w-64' : 'w-20'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-blue-700">
        <h2 className={`text-lg font-bold tracking-wide transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
          ADMIN
        </h2>

        <button
          onClick={toggleSidebar}
          className="text-white text-xl hover:bg-blue-700 px-2 py-1 rounded transition"
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Menu */}
      <ul className="mt-4 space-y-1 text-sm font-medium">
        <SidebarItem to="/admin-dashboard" icon="fas fa-tachometer-alt" label="Dashboard" isSidebarOpen={isSidebarOpen} />
        <SidebarItem to="/list-user" icon="fas fa-users" label="Người dùng" isSidebarOpen={isSidebarOpen} />
        <SidebarItem to="/list-course" icon="fas fa-book-open" label="Khóa học" isSidebarOpen={isSidebarOpen} />
        <SidebarItem to="/list-lesson" icon="fas fa-chalkboard-teacher" label="Bài học" isSidebarOpen={isSidebarOpen} />
        <SidebarItem to="/list-question" icon="fas fa-question-circle" label="Câu hỏi" isSidebarOpen={isSidebarOpen} />
        <SidebarItem to="/list-answer" icon="fas fa-check-circle" label="Đáp án" isSidebarOpen={isSidebarOpen} />
        <SidebarItem to="/learning-path" icon="fas fa-map-signs" label="Lộ trình" isSidebarOpen={isSidebarOpen} />
        <SidebarItem to="/progress" icon="fas fa-trophy" label="Tiến độ" isSidebarOpen={isSidebarOpen} />

        {/* Log out */}
        <li className="mt-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-red-100 hover:bg-red-600 hover:text-white transition rounded-md"
          >
            <i className="fas fa-sign-out-alt text-base" />
            <span className={`ml-3 ${isSidebarOpen ? 'block' : 'hidden'}`}>Đăng xuất</span>
          </button>
        </li>
      </ul>
    </aside>
  );
}

const SidebarItem = ({ to, icon, label, isSidebarOpen }) => (
  <li>
    <Link
      to={to}
      className="flex items-center px-4 py-3 hover:bg-blue-700 rounded-md transition group"
    >
      <i className={`${icon} text-base group-hover:text-yellow-300`} />
      <span className={`ml-3 group-hover:text-yellow-300 ${isSidebarOpen ? 'block' : 'hidden'}`}>
        {label}
      </span>
    </Link>
  </li>
);

export default SidebarAdmin;

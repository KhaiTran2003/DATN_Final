import React from 'react';
import { Link } from 'react-router-dom';

function SidebarAdmin({ isSidebarOpen, toggleSidebar }) {
  return (
    <div className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'}`}>
      {/* Nút thu nhỏ sidebar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <h2 className={`text-lg font-semibold transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
          Admin Panel
        </h2>
        <button onClick={toggleSidebar} className="text-white focus:outline-none">
          ☰
        </button>
      </div>

      {/* Danh sách menu */}
      <ul className="mt-4">
        <SidebarItem to="/admin-dashboard" icon="fas fa-tachometer-alt" label="Dashboard" isSidebarOpen={isSidebarOpen} />
        <SidebarItem to="/list-user" icon="fas fa-users" label="Người dùng" isSidebarOpen={isSidebarOpen} />
        <SidebarItem to="/list-course" icon="fas fa-book-open" label="Khóa học" isSidebarOpen={isSidebarOpen} />
        <SidebarItem to="/list-lesson" icon="fas fa-chalkboard-teacher" label="Bài học" isSidebarOpen={isSidebarOpen} />
        <SidebarItem to="/list-question" icon="fas fa-question-circle" label="Câu hỏi" isSidebarOpen={isSidebarOpen} />
        <SidebarItem to="/list-answer" icon="fas fa-check-circle" label="Đáp án" isSidebarOpen={isSidebarOpen} />
        <SidebarItem to="/learning-path" icon="fas fa-map-signs" label="Learning Path" isSidebarOpen={isSidebarOpen} />
        <SidebarItem to="/progress" icon="fas fa-trophy" label="Progress" isSidebarOpen={isSidebarOpen} />
        <SidebarItem to="/logout" icon="fas fa-sign-out-alt" label="Log Out" isSidebarOpen={isSidebarOpen} />
      </ul>
    </div>
  );
}

/* Component hiển thị từng item của Sidebar */
const SidebarItem = ({ to, icon, label, isSidebarOpen }) => (
  <li className="group relative">
    <Link to={to} className="flex items-center px-4 py-3 text-white hover:bg-gray-700 transition">
      <i className={`${icon} text-lg`}></i>
      <span className={`ml-3 text-sm font-medium transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
        {label}
      </span>
    </Link>
  </li>
);

export default SidebarAdmin;

// src/components/SidebarAdmin.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/css_admin/AdminDashboard.css'
function SidebarAdmin({ isSidebarOpen, toggleSidebar }) {
  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
      {/* Hamburger Icon */}
      <div className="menu-toggle" onClick={toggleSidebar}>
        <button className="menu-icon">☰</button> {/* Hamburger Icon */}
      </div>

      <div className="sidebar-header">
        {/* Thêm logo hoặc các mục khác trong sidebar */}
      </div>

      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <Link to="/admin-dashboard" className="sidebar-link">
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/list-user" className="sidebar-link">
            <i className="fas fa-users"></i> Người dùng
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/list-course" className="sidebar-link">
            <i className="fas fa-book-open"></i> Khóa học
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/list-lesson" className="sidebar-link">
            <i className="fas fa-chalkboard-teacher"></i> Bài học
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/list-question" className="sidebar-link">
            <i className="fas fa-question-circle"></i> Câu hỏi
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/list-answer" className="sidebar-link">
            <i className="fas fa-check-circle"></i> Đáp án
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/learning-path" className="sidebar-link">
            <i className="fas fa-map-signs"></i> Learning Path
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/progress" className="sidebar-link">
            <i className="fas fa-trophy"></i> Progress
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/logout" className="sidebar-link">
            <i className="fas fa-sign-out-alt"></i> Log Out
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default SidebarAdmin;

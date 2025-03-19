// src/components/NavbarAdmin.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/LCMSlogo.jpg';
import '../css/css_admin/AdminDashboard.css';

function NavbarAdmin({ toggleSidebar }) {
  return (
    <nav className="navbar-admin">
      <div className="navbar-admin-container">
        {/* Menu Toggle */}
        <div className="menu-toggle" onClick={toggleSidebar}>
          <button className="menu-icon">☰</button> {/* Hamburger Icon */}
        </div>

        {/* Logo */}
        <Link to="/admin-dashboard" className="navbar-admin-logo">
          <img src={logo} alt="Logo" className="logo" />
        </Link>

        {/* Thanh tìm kiếm */}
        <div className="search-container">
          <input type="text" placeholder="Tìm kiếm..." className="search-input" />
        </div>

        {/* Thông tin người dùng */}
        <div className="user-info">
          <span className="username">Larry Garner</span>
          <button className="notification-icon">🔔</button>
          <button className="profile-icon">👤</button>
        </div>
      </div>
    </nav>
  );
}

export default NavbarAdmin;

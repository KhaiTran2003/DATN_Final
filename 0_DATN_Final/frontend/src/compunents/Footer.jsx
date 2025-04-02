import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer-modern">
      <div className="footer-container">
        <div className="footer-col">
          <h2 className="footer-logo">LMS</h2>
          <p className="footer-desc">
            Nền tảng học tập hiện đại, hỗ trợ bạn phát triển kỹ năng mọi lúc, mọi nơi.
          </p>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Liên kết</h4>
          <ul>
            <li><Link to="/homepage">Trang chủ</Link></li>
            <li><Link to="/courses">Khóa học</Link></li>
            <li><Link to="/aboutus">Về chúng tôi</Link></li>
            <li><Link to="/contact">Liên hệ</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Liên hệ</h4>
          <p>Email: support@lms.vn</p>
          <p>Hotline: 1900 1234</p>
          <p>Địa chỉ: Đại học Nha Trang</p>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} LMS. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;

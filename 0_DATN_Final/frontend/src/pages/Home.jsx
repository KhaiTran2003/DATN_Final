import React from "react";
import "../css/css_pages/Home.css";
import { Link } from "react-router-dom";
import Footer from "../compunents/Footer";

function HomePage() {
  return (
    <div className="homepage-wrapper">
      {/* Banner Section */}
      <section className="homepage-banner">
        <div className="banner-content">
          <h1 className="banner-title">Chào mừng đến với hệ thống học tập LMS</h1>
          <p className="banner-subtitle">
            Nền tảng học tập hiện đại giúp bạn phát triển bản thân mỗi ngày.
          </p>
          <Link to="/courses" className="banner-btn">
            Khám phá khóa học
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="homepage-features">
        <div className="feature-card">
          <h2>📚 Học mọi lúc, mọi nơi</h2>
          <p>Truy cập kho tài liệu phong phú và học online dễ dàng mọi thiết bị.</p>
        </div>
        <div className="feature-card">
          <h2>🎯 Lộ trình học thông minh</h2>
          <p>Hệ thống AI đề xuất nội dung học tập phù hợp với năng lực cá nhân.</p>
        </div>
        <div className="feature-card">
          <h2>🏆 Giảng viên chất lượng</h2>
          <p>Đội ngũ chuyên gia giàu kinh nghiệm và tận tâm trong từng bài giảng.</p>
        </div>
      </section>
      <Footer/>
    </div>
  );
}

export default HomePage;

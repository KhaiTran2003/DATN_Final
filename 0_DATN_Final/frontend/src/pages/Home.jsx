import React from "react";
import '../css/css_pages/Home.css'
import { Link } from "react-router-dom";
function HomePage() {
  return (
    <div className="homepage-container">
      {/* Banner */}
      <div className="banner-homepage">
        <h1 className="title-homepage">Chào mừng đến với Hệ thống LMS</h1>
        <p className="subtitle-homepage">
          Nền tảng học tập thông minh giúp bạn phát triển bản thân.
        </p>
        <Link to="/courses" className="btn-homepage">Khám phá khóa học</Link>
      </div>

      {/* Nội dung chính */}
      <div className="features-homepage">
        <div className="feature-homepage">
          <h2 className="feature-title-homepage">📚 Học mọi lúc, mọi nơi</h2>
          <p className="feature-text-homepage">
            Truy cập kho tài liệu phong phú và học online dễ dàng.
          </p>
        </div>
        <div className="feature-homepage">
          <h2 className="feature-title-homepage">🎯 Lộ trình học thông minh</h2>
          <p className="feature-text-homepage">
            AI đề xuất lộ trình phù hợp với trình độ của bạn.
          </p>
        </div>
        <div className="feature-homepage">
          <h2 className="feature-title-homepage">🏆 Giảng viên chất lượng</h2>
          <p className="feature-text-homepage">
            Đội ngũ giảng viên có kinh nghiệm thực chiến.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

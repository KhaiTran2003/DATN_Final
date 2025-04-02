import React from 'react';
import '../css/css_pages/Courses.css';
function CourseCard({ image, title, description, price, duration }) {
  return (
    <div className='course-card'>
      <div className="course-card-img">
        <img src={image} alt={title} />
      </div>
      <div className='course-card-body'>
        <h2>{title}</h2>
        <p className="description">{description}</p>
        <p><strong>Giá:</strong> {price} VNĐ</p>
        <p><strong>Thời lượng:</strong> {duration} giờ</p>
      </div>
    </div>
  );
}

export default CourseCard;

import React from 'react';

function CourseCard({ image, title, description, price, duration }) {
  return (
    <div className='a-box'>
      <div className="a-b-img">
        <img src={image} alt={title} />
      </div>
      <div className='a-b-text'>
        <h2>{title}</h2>
        <p>{description}</p>
        <p>Giá: {price} VNĐ</p>
        <p>Thời lượng: {duration} giờ</p>
      </div>
    </div>
  );
}

export default CourseCard;

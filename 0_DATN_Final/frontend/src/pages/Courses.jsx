import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import '../css/css_pages/Courses.css';

function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/courses') // Gọi API lấy danh sách khóa học
      .then((res) => res.json())
      .then((data) => setCourses(data)) // Cập nhật state với dữ liệu từ API
      .catch((err) => console.error('Lỗi khi lấy dữ liệu khóa học:', err));
  }, []);

  return (
    <div id='courses'>
      <h1>Khóa học</h1>
      <div className="a-container">
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard
              key={course.id_course}
              image={`http://localhost:5000${course.image}`}
              title={course.title}
              description={course.description}
              price={course.price}
              duration={course.duration}
            />
          ))
        ) : (
          <p>Không có khóa học nào</p>
        )}
      </div>
    </div>
  );
}

export default Courses;

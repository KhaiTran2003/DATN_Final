import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import '../css/css_pages/Courses.css';
import { Link, useNavigate } from 'react-router-dom';
function Courses() {
  const [courses, setCourses] = useState([]);
  const [courseId,setCourseId] = useState(null)
  const [lessons, setLessons] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:5000/api/courses') // Gọi API lấy danh sách khóa học
      .then((res) => res.json())
      .then((data) => setCourses(data)) // Cập nhật state với dữ liệu từ API
      .catch((err) => console.error('Lỗi khi lấy dữ liệu khóa học:', err));
  }, []);

  useEffect(() => {
    if (!courseId) return; // đảm bảo courseId tồn tại
  
    const fetchLessons = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/courses/${courseId}/lessons`);
        if (!res.ok) throw new Error('Lỗi khi lấy dữ liệu từ server');
        const data = await res.json();
        setLessons(data);
        console.log(data);
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu bài học:', err);
      }
    };
  
    fetchLessons();
  }, [courseId]);
  const closeModal = () => {
    setCourseId(null);
    setLessons([]);
  };
  return (
    <div id='courses'>
      <h1>Khóa học</h1>
      <div className="a-container">
        {courses.length > 0 ? (
          courses.map((course) => (
          <div key={course.id_course} onClick={(e,id = course.id_course) => {setCourseId(id); console.log(id)}} className='cursor-pointer'>
            <CourseCard
              image={`http://localhost:5000${course.image}`}
              title={course.title}
              description={course.description}
              price={course.price}
              duration={course.duration}
            />
          </div>
        ))

        ) : (
          <p>Không có khóa học nào</p>
        )}
      </div>
      {/* Modal hiển thị danh sách bài học */}
      {courseId != null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6 relative animate-fadeIn">
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl font-bold cursor-pointer"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4">Danh sách bài học</h2>
            {lessons.length > 0 ? (
              <ul className="space-y-2">
                {lessons.map((lesson) => (
                  <li key={lesson.id_lesson} className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
                  onClick={()=>{navigate(`/lesson/?id=${lesson.id_lesson}`)}}>
                    {lesson.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Không có bài học nào</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;

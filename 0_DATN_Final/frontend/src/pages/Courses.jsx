import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import '../css/css_pages/Courses.css';
import Footer from '../compunents/Footer';
import { useNavigate } from 'react-router-dom';

function Courses() {
  const [allCourses, setAllCourses] = useState([]);
  const [freeCourses, setFreeCourses] = useState([]);
  const [paidCourses, setPaidCourses] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredFree, setFilteredFree] = useState([]);
  const [filteredPaid, setFilteredPaid] = useState([]);
  const [showMoreFree, setShowMoreFree] = useState(false);
  const [showMorePaid, setShowMorePaid] = useState(false);
  const [courseId, setCourseId] = useState(null);
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/courses')
      .then(res => res.json())
      .then(data => {
        setAllCourses(data);
        const free = data.filter(c => c.price === 0 || c.price === 'free');
        const paid = data.filter(c => c.price !== 0 && c.price !== 'free');
        setFreeCourses(free);
        setPaidCourses(paid);
        setFilteredFree(free);
        setFilteredPaid(paid);
      });
  }, []);

  useEffect(() => {
    if (!courseId) return;

    const fetchLessons = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/courses/${courseId}/lessons`);
        if (!res.ok) throw new Error('Lỗi khi lấy dữ liệu từ server');
        const data = await res.json();
        setLessons(data);
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

  const handleSearchChange = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchKeyword(keyword);

    if (!keyword.trim()) {
      setFilteredFree(freeCourses);
      setFilteredPaid(paidCourses);
      return;
    }

    const filter = (list) =>
      list.filter((c) =>
        c.title?.toLowerCase().includes(keyword) ||
        c.description?.toLowerCase().includes(keyword) ||
        c.duration?.toString().includes(keyword)
      );

    setFilteredFree(filter(freeCourses));
    setFilteredPaid(filter(paidCourses));
  };

  return (
    <div className="courses-page">
      <div className="courses-header">
        <h1>📘 Danh sách khóa học</h1>
        <p>Chọn một khóa để xem chi tiết bài học</p>
      </div>

      <div className="courses-search">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm khóa học..."
          value={searchKeyword}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {/* FREE COURSES */}
      <h2 className="section-title">🎓 Khóa học miễn phí</h2>
      <div className="courses-grid">
        {(showMoreFree ? filteredFree : filteredFree.slice(0, 5)).map((course) => (
          <div key={course.id_course} onClick={() => setCourseId(course.id_course)} className="course-clickable">
            <CourseCard
              image={`http://localhost:5000${course.image}`}
              title={course.title}
              description={course.description}
              price={course.price}
              duration={course.duration}
            />
          </div>
        ))}
      </div>
      {filteredFree.length > 5 && !showMoreFree && (
        <div className="see-more-wrapper">
          <button className="see-more-btn" onClick={() => setShowMoreFree(true)}>
            Hiển thị thêm {filteredFree.length - 5}
          </button>
        </div>
      )}

      {/* PAID COURSES */}
      <h2 className="section-title">💼 Khóa học có phí</h2>
      <div className="courses-grid">
        {(showMorePaid ? filteredPaid : filteredPaid.slice(0, 5)).map((course) => (
          <div key={course.id_course} onClick={() => setCourseId(course.id_course)} className="course-clickable">
            <CourseCard
              image={`http://localhost:5000${course.image}`}
              title={course.title}
              description={course.description}
              price={course.price}
              duration={course.duration}
            />
          </div>
        ))}
      </div>
      {filteredPaid.length > 5 && !showMorePaid && (
        <div className="see-more-wrapper">
          <button className="see-more-btn" onClick={() => setShowMorePaid(true)}>
            Hiển thị thêm {filteredPaid.length - 5}
          </button>
        </div>
      )}

      {/* MODAL HIỂN THỊ BÀI HỌC */}
      {courseId !== null && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button onClick={closeModal} className="modal-close">
              &times;
            </button>
            <h2 className="modal-title">📑 Danh sách bài học</h2>
            {lessons.length > 0 ? (
              <ul className="lesson-list">
                {lessons.map((lesson) => (
                  <li
                    key={lesson.id_lesson}
                    className="lesson-item"
                    onClick={() => navigate(`/lesson/?id=${lesson.id_lesson}`)}
                  >
                    {lesson.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Không có bài học nào.</p>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Courses;

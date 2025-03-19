import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../SidebarAdmin';
import NavbarAdmin from '../NavbarAdmin';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${courseId}`);
        if (!response.ok) {
          throw new Error('Không tìm thấy khóa học');
        }
        const data = await response.json();
        setCourse(data);
      } catch (err) {
        setError('Có lỗi khi lấy thông tin khóa học.');
      }
    };

    fetchCourseDetail();
  }, [courseId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!course) {
    return <div>Đang tải thông tin khóa học...</div>;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="course-detail-container">
      <button onClick={toggleSidebar}>Thu nhỏ sidebar</button>
      <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <NavbarAdmin />

      <form className="course-detail-form">
        <div className="form-group">
          <label htmlFor="title">Tên khóa học:</label>
          <input type="text" id="title" value={course.title} disabled />
        </div>

        <div className="form-group">
          <label htmlFor="teacher_id">ID Giáo viên:</label>
          <input type="text" id="teacher_id" value={course.teacher_id} disabled />
        </div>

        <div className="form-group">
          <label htmlFor="price">Giá:</label>
          <input type="text" id="price" value={course.price} disabled />
        </div>

        <div className="form-group">
          <label htmlFor="duration">Thời gian học:</label>
          <input type="text" id="duration" value={course.duration} disabled />
        </div>

        <div className="form-group">
          <label htmlFor="image">Ảnh đại diện:</label>
          <img src={course.image} alt={course.title} width="100" />
        </div>

        <div className="form-group">
          <label htmlFor="is_active">Trạng thái:</label>
          <select id="is_active" value={course.is_active ? 'Hoạt động' : 'Không hoạt động'} disabled>
            <option value="Hoạt động">Hoạt động</option>
            <option value="Không hoạt động">Không hoạt động</option>
          </select>
        </div>

        <button type="button" onClick={() => navigate('/list-course')} className="back-btn">
          Quay lại danh sách
        </button>
        <Link to={`/edit-course/${course.id_course}`}>
          <button className="submit-btn">
            Sửa
          </button>
        </Link>
      </form>
    </div>
  );
}

export default CourseDetail;
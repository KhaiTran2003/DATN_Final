import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../NavbarAdmin';
import SidebarAdmin from '../SidebarAdmin';
import '../../css/css_admin/AdminDashboard.css';
import axios from 'axios';
import { FaEye, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../../css/css_admin/User.css';
function ListCourses() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        setCourses(response.data);
        console.log(response.data)
      } catch (err) {
        setError('Có lỗi khi lấy dữ liệu khóa học.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleDeleteCourses = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/courses/${id}`);
        
        if (response.status === 200) { // Đảm bảo server trả về 200 OK
          setCourses(prevCourses => prevCourses.filter(course => course.id_course !== id));
          alert("Xóa khóa học thành công!");
        } else {
          alert("Không thể xóa khóa học.");
        }
      } catch (error) {
        console.error("Lỗi xóa khóa học:", error);
        alert("Có lỗi xảy ra khi xóa khóa học.");
      }
    }
  };
  

  return (
    <div class="flex justify-center items-center">
      <button onClick={toggleSidebar}>Toggle Sidebar</button>
      <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <NavbarAdmin />

      <div className="course-table-container">
        <h1>Danh sách khóa học</h1>

        <Link to='/add-course'>
          <button className="add-course-btn">
            <FaPlus /> Thêm khóa học
          </button>
        </Link>

        {courses.length === 0 ? (
          <p>Không có khóa học.</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Giảng viên</th>
                <th>Giá</th>
                <th>Thời gian</th>
                <th>Ảnh đại diện</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id_course}>
                  <td>{course.title}</td>
                  <td>{course.teacher_id}</td>
                  <td>{course.price}</td>
                  <td>{course.duration}</td>
                  <td><img src={course.image} alt={course.title} width="50" /></td>
                  <td>{course.is_active ? 'Hoạt động' : 'Không hoạt động'}</td>
                  <td className="actions">
                    <Link to={`/course-detail/${course.id_course}`}>
                      <button className="action-btn view-btn">
                        <FaEye /> Xem
                      </button>
                    </Link>
                    <Link to={`/edit-course/${course.id_course}`}>
                      <button className="action-btn edit-btn">
                        <FaEdit /> Sửa
                      </button>
                    </Link>
                    <button className="action-btn delete-btn" onClick={() => handleDeleteCourses(course.id_course)}>
                      <FaTrashAlt /> Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ListCourses;

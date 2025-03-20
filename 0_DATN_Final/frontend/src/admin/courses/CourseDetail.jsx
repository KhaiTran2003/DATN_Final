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
    return <div className="text-red-500 text-center mt-5">{error}</div>;
  }

  if (!course) {
    return <div className="text-center text-gray-500 mt-5">Đang tải thông tin khóa học...</div>;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <NavbarAdmin />
        <div className="flex justify-center items-center h-full p-6 mt-16">
          <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 flex">
            <div className="w-1/3 flex justify-center items-center">
              <img src={course.image} alt={course.title} className="w-48 h-48 object-cover rounded-md" />
            </div>
            <div className="w-2/3 pl-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Chi tiết khóa học</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 font-medium">Tên khóa học:</label>
                  <input type="text" value={course.title} disabled className="w-full p-2 border rounded bg-gray-100" />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium">ID Giáo viên:</label>
                  <input type="text" value={course.teacher_id} disabled className="w-full p-2 border rounded bg-gray-100" />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium">Giá:</label>
                  <input type="text" value={course.price} disabled className="w-full p-2 border rounded bg-gray-100" />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium">Thời gian học:</label>
                  <input type="text" value={course.duration} disabled className="w-full p-2 border rounded bg-gray-100" />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium">Trạng thái:</label>
                  <select value={course.is_active ? 'Hoạt động' : 'Không hoạt động'} disabled className="w-full p-2 border rounded bg-gray-100">
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Không hoạt động">Không hoạt động</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <button onClick={() => navigate('/list-course')} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Quay lại danh sách</button>
                <Link to={`/edit-course/${course.id_course}`} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Sửa</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;

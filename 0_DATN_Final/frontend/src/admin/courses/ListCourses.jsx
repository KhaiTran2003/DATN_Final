import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../NavbarAdmin';
import SidebarAdmin from '../SidebarAdmin';
import axios from 'axios';
import { FaEye, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function ListCourses() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [courses, setCourses] = useState([]);
  const [originalCourses, setOriginalCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = courses.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(courses.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        setCourses(response.data);
        setOriginalCourses(response.data);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách khóa học:', err);
      }
    };
    fetchCourses();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này không?')) {
      try {
        await axios.delete(`http://localhost:5000/api/courses/${id}`);
        const updated = originalCourses.filter(course => course.id_course !== id);
        setCourses(updated);
        setOriginalCourses(updated);
        alert('Xóa khóa học thành công!');
      } catch (error) {
        alert('Có lỗi xảy ra khi xóa khóa học.');
      }
    }
  };

  const handleSearchChange = (event) => {
    const keyword = event.target.value.toLowerCase();
    setCurrentPage(1);

    if (!keyword.trim()) {
      setCourses(originalCourses);
      return;
    }

    const filtered = originalCourses.filter(course =>
      course.title?.toLowerCase().includes(keyword) ||
      course.teacher_id?.toString().toLowerCase().includes(keyword) ||
      course.price?.toString().toLowerCase().includes(keyword) ||
      course.duration?.toString().toLowerCase().includes(keyword) ||
      course.is_active?.toString().toLowerCase().includes(keyword)
    );

    setCourses(filtered);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 p-6 lg:ml-64">
        <NavbarAdmin handleOnChange={handleSearchChange} />

        <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-xl mt-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-blue-700">Danh sách khóa học</h2>
            <Link to="/add-course">
              <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow">
                <FaPlus /> Thêm khóa học
              </button>
            </Link>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full table-auto">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-4 text-left">Tên khóa học</th>
                  <th className="p-4 text-left">Giảng viên</th>
                  <th className="p-4 text-left">Giá</th>
                  <th className="p-4 text-left">Thời gian</th>
                  <th className="p-4 text-center">Ảnh</th>
                  <th className="p-4 text-center">Trạng thái</th>
                  <th className="p-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {currentRows.map(course => (
                  <tr key={course.id_course} className="border-b hover:bg-gray-50">
                    <td className="p-4">{course.title}</td>
                    <td className="p-4">{course.teacher_id}</td>
                    <td className="p-4">${course.price}</td>
                    <td className="p-4">{course.duration}</td>
                    <td className="p-4 flex justify-center">
                      <img src={`http://localhost:5000/${course.image}`} alt={course.title} className="w-12 h-12 object-cover rounded" />
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 text-xs rounded-full font-semibold ${course.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {course.is_active ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="p-4 text-center flex justify-center gap-2">
                      <Link to={`/course-detail/${course.id_course}`} className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        <FaEye /> Xem
                      </Link>
                      <Link to={`/edit-course/${course.id_course}`} className="text-green-600 hover:text-green-800 flex items-center gap-1">
                        <FaEdit /> Sửa
                      </Link>
                      <button
                        className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        onClick={() => handleDeleteCourse(course.id_course)}
                      >
                        <FaTrashAlt /> Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`px-4 py-2 rounded-md font-medium ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white border text-gray-700 hover:bg-blue-100'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListCourses;

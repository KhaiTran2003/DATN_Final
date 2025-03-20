import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../NavbarAdmin';
import SidebarAdmin from '../SidebarAdmin';
import axios from 'axios';
import { FaEye, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function ListCourses() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [courses, setCourses] = useState([]);
  const [displayList, setDisplayList] = useState([]);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        setCourses(response.data);
        setDisplayList(response.data);
      } catch (err) {
        console.error("Có lỗi khi lấy danh sách khóa học.", err);
      }
    }
    fetchCourses();
  }, []);

  // Phân trang
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = displayList.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(displayList.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDeleteCourse = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) {
      try {
        await axios.delete(`http://localhost:5000/api/courses/${id}`);
        const updatedCourses = courses.filter(course => course.id_course !== id);
        setCourses(updatedCourses);
        setDisplayList(updatedCourses);
        alert("Xóa khóa học thành công!");
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa khóa học.");
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Nội dung chính */}
      <div className="flex-1 p-6 ml-64">
        <NavbarAdmin />

        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Danh sách khóa học</h2>

          {/* Nút thêm khóa học */}
          <div className="flex justify-end mb-6">
            <Link to="/add-course">
              <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center shadow-md">
                <FaPlus className="mr-2" /> Thêm khóa học
              </button>
            </Link>
          </div>

          {/* Bảng danh sách khóa học */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 shadow-md">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="border border-gray-300 px-4 py-2 text-left">Tên khóa học</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Giảng viên</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Giá</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Thời gian</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Ảnh đại diện</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Trạng thái</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map(course => (
                  <tr key={course.id_course} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{course.title}</td>
                    <td className="border border-gray-300 px-4 py-2">{course.teacher_id}</td>
                    <td className="border border-gray-300 px-4 py-2">{course.price}</td>
                    <td className="border border-gray-300 px-4 py-2">{course.duration}</td>
                    <td className="border border-gray-300 px-4 py-2 flex justify-center">
                      <img src={`http://localhost:5000/${course.image}`} alt={course.title} className="w-12 h-12 object-cover rounded-md" />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span className={`px-3 py-1 rounded-full text-white ${course.is_active ? 'bg-green-500' : 'bg-red-500'}`}>
                        {course.is_active ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 flex space-x-2">
                      <Link to={`/course-detail/${course.id_course}`}>
                        <button className="text-blue-500 hover:underline flex items-center">
                          <FaEye className="mr-1" /> Xem
                        </button>
                      </Link>
                      <Link to={`/edit-course/${course.id_course}`}>
                        <button className="text-green-500 hover:underline flex items-center">
                          <FaEdit className="mr-1" /> Sửa
                        </button>
                      </Link>
                      <button 
                        className="text-red-500 hover:underline flex items-center" 
                        onClick={() => handleDeleteCourse(course.id_course)}
                      >
                        <FaTrashAlt className="mr-1" /> Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`px-4 py-2 mx-1 border rounded-md ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
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

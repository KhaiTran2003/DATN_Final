import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserGraduate, FaBook, FaListAlt, FaQuestion, FaCheckCircle, FaUserPlus, FaChalkboardTeacher } from 'react-icons/fa';

function SidebarTeacher({ isSidebarOpen, toggleSidebar }) {
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-blue-900 text-white z-40 transition-all duration-300 
      ${isSidebarOpen ? 'w-[250px]' : 'w-[70px]'}`}
    >
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-blue-700">
        <Link to="/teacher-dashboard" className="flex items-center space-x-2">
          <FaChalkboardTeacher className="text-xl" />
          {isSidebarOpen && <span className="text-lg font-bold">Teacher</span>}
        </Link>
        <button onClick={toggleSidebar} className="text-white focus:outline-none">
          ☰
        </button>
      </div>

      {/* Menu items */}
      <nav className="mt-4">
        <ul className="flex flex-col space-y-2 px-2">
          <li>
            <Link to="/teacher/students" className="flex items-center space-x-3 px-4 py-2 hover:bg-blue-800 rounded">
              <FaUserGraduate />
              {isSidebarOpen && <span>Học viên</span>}
            </Link>
          </li>
          <li>
            <Link to="/teacher/mycourses" className="flex items-center space-x-3 px-4 py-2 hover:bg-blue-800 rounded">
              <FaBook />
              {isSidebarOpen && <span>Khoá học</span>}
            </Link>
          </li>
          <li>
            <Link to="/teacher/mylesson" className="flex items-center space-x-3 px-4 py-2 hover:bg-blue-800 rounded">
              <FaListAlt />
              {isSidebarOpen && <span>Bài học</span>}
            </Link>
          </li>
          <li>
            <Link to="/teacher/myQA" className="flex items-center space-x-3 px-4 py-2 hover:bg-blue-800 rounded">
              <FaQuestion />
              {isSidebarOpen && <span>Câu hỏi</span>}
            </Link>
          </li>
          
          <li>
            <Link to="/teacher/enrollments" className="flex items-center space-x-3 px-4 py-2 hover:bg-blue-800 rounded">
              <FaUserPlus />
              {isSidebarOpen && <span>Ghi danh</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default SidebarTeacher;

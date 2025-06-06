import { useEffect, useState } from "react";
import SidebarTeacher from "../SidebarTeacher";
import NavbarTeacher from "../NavbarTeacher";
import axios from "axios";
import Table from "../../compunents/Table";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const ListLessonTeacher = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [listLesson, setListLesson] = useState([]);
  const [displayList, setDisplayList] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/lessons");
      // Lọc bài học theo teacher_id nếu cần
      const filtered = response.data.filter((lesson) => lesson.teacher_id == userId);
      setListLesson(filtered);
      setDisplayList(formatData(filtered));
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu bài học.", err);
    }
  };

  const formatData = (list) => {
    return list.map(({ id_lesson, title, duration, course_title, fullname }) => ({
      id_lesson,
      title,
      duration,
      "course title": course_title,
      teacher: fullname,
    }));
  };

  const handleSearch = (event) => {
    const keyword = event.target.value.trim().toLowerCase();
    setCurrentPage(1);
    setDisplayList(
      formatData(
        keyword
          ? listLesson.filter(({ title, duration, course_title, fullname }) =>
              [title, duration, course_title, fullname].some((field) =>
                field?.toString().toLowerCase().includes(keyword)
              )
            )
          : listLesson
      )
    );
  };

  const handleEditLesson = (id) => {
    if (!id) {
      console.error("ID không hợp lệ!");
      return;
    }
    navigate(`/teacher/edit-lesson/${id}`);
  };

  const handleDeleteLesson = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài học này không?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/lessons/${id}`);
      setListLesson((prev) => prev.filter((item) => item.id_lesson !== id));
      setDisplayList((prev) => prev.filter((item) => item.id_lesson !== id));
    } catch (err) {
      console.error("Lỗi khi xóa bài học:", err);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const currentRows = displayList.slice(indexOfLastRow - rowsPerPage, indexOfLastRow);
  const totalPages = Math.ceil(displayList.length / rowsPerPage);

  return (
    <div className="flex min-h-screen">
      <SidebarTeacher
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 p-6 ml-64 mt-15">
        <NavbarTeacher handleOnChange={handleSearch} />

        <div className="relative flex justify-between items-center mt-12 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Bài học của tôi</h2>

          <div className="absolute right-0 top-[-10px]">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center shadow-md transition"
              onClick={() => navigate("/teacher/add-lesson")}
            >
              <FaPlus className="mr-2" /> Thêm bài học
            </button>
          </div>
        </div>

        <div className="mt-6 mx-auto max-w-6xl bg-white p-6 rounded-lg shadow-lg">
          <Table
            data={currentRows}
            idKey="id_lesson"
            handleEdit={handleEditLesson}
            handleDelete={handleDeleteLesson}
          />

          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 mx-1 border rounded-md ${
                  currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListLessonTeacher;

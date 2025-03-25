import { useEffect, useState } from "react";
import SidebarTeacher from "../SidebarTeacher";
import NavbarTeacher from "../NavbarTeacher";
import axios from "axios";
import Table from "../../compunents/Table";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const ListQATeacher = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState("questions");

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [displayQuestions, setDisplayQuestions] = useState([]);
  const [displayAnswers, setDisplayAnswers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchQuestions();
    fetchAnswers();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/questions");
      const filtered = res.data.filter(q => q.teacher_id == userId); // Lọc theo giáo viên
      setQuestions(filtered);
      setDisplayQuestions(formatQuestions(filtered));
    } catch (err) {
      console.error("Lỗi khi lấy câu hỏi:", err);
    }
  };

  const fetchAnswers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/answers");
      const filtered = res.data.filter(a => a.teacher_id == userId); // Lọc theo giáo viên
      setAnswers(filtered);
      setDisplayAnswers(formatAnswers(filtered));
    } catch (err) {
      console.error("Lỗi khi lấy câu trả lời:", err);
    }
  };

  const formatQuestions = (list) =>
    list.map((item) => ({
      "Tên bài học": item.lesson_id,
      content: item.content,
      type: item.type,
      id_question: item.id_question,
    }));

  const formatAnswers = (list) =>
    list.map((item) => ({
      "ID Câu hỏi": item.question_id,
      "Đáp án": item.content,
      "Đúng/Sai": item.is_correct ? "✔️ Đúng" : "❌ Sai",
      id_answer: item.id_answer,
    }));

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setCurrentPage(1);
    if (currentTab === "questions") {
      const filtered = questions.filter(q =>
        [q.content, q.type, q.lesson_id?.toString()]
          .filter(Boolean)
          .some(field => field.toLowerCase().includes(keyword))
      );
      setDisplayQuestions(formatQuestions(filtered));
    } else {
      const filtered = answers.filter(a =>
        [a.content, a.is_correct?.toString(), a.question_id?.toString()]
          .filter(Boolean)
          .some(field => field.toLowerCase().includes(keyword))
      );
      setDisplayAnswers(formatAnswers(filtered));
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("Xóa câu hỏi này?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/questions/${id}`);
      const updated = questions.filter(q => q.id_question !== id);
      setQuestions(updated);
      setDisplayQuestions(formatQuestions(updated));
    } catch (err) {
      console.error("Lỗi xóa câu hỏi:", err);
    }
  };

  const handleDeleteAnswer = async (id) => {
    if (!window.confirm("Xóa câu trả lời này?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/answers/${id}`);
      const updated = answers.filter(a => a.id_answer !== id);
      setAnswers(updated);
      setDisplayAnswers(formatAnswers(updated));
    } catch (err) {
      console.error("Lỗi xóa câu trả lời:", err);
    }
  };

  const handleAdd = () => {
    if (currentTab === "questions") navigate("/teacher/add-question");
    else navigate("/teacher/add-answer");
  };

  const handleEdit = (id) => {
    if (currentTab === "questions") navigate(`/teacher/edit-question/${id}`);
    else navigate(`/teacher/edit-answer/${id}`);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const currentList = currentTab === "questions" ? displayQuestions : displayAnswers;
  const idKey = currentTab === "questions" ? "id_question" : "id_answer";

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = currentList.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(currentList.length / rowsPerPage);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarTeacher isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 p-6 mt-16 ml-64">
        <NavbarTeacher handleOnChange={handleSearch} />

        {/* Tabs */}
        <div className="flex items-center space-x-4 mt-12 mb-4">
          <button
            onClick={() => setCurrentTab("questions")}
            className={`px-4 py-2 rounded-md ${
              currentTab === "questions" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Câu hỏi
          </button>
          <button
            onClick={() => setCurrentTab("answers")}
            className={`px-4 py-2 rounded-md ${
              currentTab === "answers" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Câu trả lời
          </button>
        </div>

        {/* Header */}
        <div className="relative flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            {currentTab === "questions" ? "Danh sách câu hỏi" : "Danh sách câu trả lời"}
          </h2>
          <div className="absolute right-0 top-[-10px]">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center shadow-md"
              onClick={handleAdd}
            >
              <FaPlus className="mr-2" /> {currentTab === "questions" ? "Thêm câu hỏi" : "Thêm đáp án"}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
          <Table
            data={currentRows}
            idKey={idKey}
            handleEdit={handleEdit}
            handleDelete={currentTab === "questions" ? handleDeleteQuestion : handleDeleteAnswer}
          />

          {/* Pagination */}
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

export default ListQATeacher;

import { useEffect, useState } from "react";
import SidebarAdmin from "../SidebarAdmin";
import NavbarAdmin from "../NavbarAdmin";
import axios from "axios";
import Table from "../../compunents/Table";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const ListQuestions = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [questionList, setQuestionList] = useState([]);
  const [displayList, setDisplayList] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await axios.get("http://localhost:5000/api/questions");
        setQuestionList(response.data);
        setDisplayList(format(response.data));
      } catch (err) {
        console.log("Có lỗi khi lấy danh sách câu hỏi.", err);
      }
    }
    fetchQuestions();
  }, []);

  function format(list) {
    return list.map((item) => ({
      "Tên bài học": item.lesson_id,
      content: item.content,
      type: item.type,
    }));
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleOnChange = (event) => {
    const keyword = event.target.value.toLowerCase();
    setCurrentPage(1);
    setDisplayList(format(filteredList(keyword)));
  };

  const filteredList = (keyword) => {
    return keyword.trim() === ""
      ? questionList
      : questionList.filter((item) =>
          [item.content, item.type, item.url, item.lesson_id?.toString()]
            .filter(Boolean)
            .some((field) => field.toLowerCase().includes(keyword))
        );
  };

  const handleAddQuestion = () => navigate("/add-question");

  const handleEditQuestion = (id) => navigate(`/edit-question/${id}`);

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa câu hỏi này không?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/questions/${id}`);
      const updated = questionList.filter((q) => q.id_question !== id);
      setQuestionList(updated);
      setDisplayList(format(updated));
    } catch (err) {
      console.error("Lỗi khi xóa câu hỏi:", err);
    }
  };

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = displayList.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(displayList.length / rowsPerPage);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 p-6 mt-16 ml-64">
        <NavbarAdmin handleOnChange={handleOnChange} />

        <div className="relative flex justify-between items-center mt-12 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Danh sách câu hỏi</h2>
          <div className="absolute right-0 top-[-10px]">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center shadow-md transition"
              onClick={handleAddQuestion}
            >
              <FaPlus className="mr-2" /> Thêm câu hỏi
            </button>
          </div>
        </div>

        <div className="mt-6 mx-auto max-w-6xl bg-white p-6 rounded-lg shadow-lg">
          <Table
            data={currentRows}
            idKey="id_question"
            handleEdit={handleEditQuestion}
            handleDelete={handleDeleteQuestion}
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

export default ListQuestions;

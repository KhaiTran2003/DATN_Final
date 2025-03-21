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
    const navigate = useNavigate(); // Điều hướng trang

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10; // Số dòng mỗi trang

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
            content: item.content,
            type: item.type,
            url: item.url,
            "Tên bài học": item.lesson_id,
        }));
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    function handleOnChange(event) {
        const keyword = event.target.value.toLowerCase();
        setCurrentPage(1); // Quay lại trang đầu khi tìm kiếm
        setDisplayList(format(filteredList(keyword)));
    }

    const filteredList = (keyword) => {
        return keyword.trim() === ""
            ? questionList
            : questionList.filter((item) =>
                  [item.content, item.type, item.url, item.lesson_id?.toString()]
                      .filter(Boolean)
                      .some((field) => field.toLowerCase().includes(keyword))
              );
    };

    // Xử lý thêm câu hỏi
    const handleAddQuestion = () => {
        navigate("/add-question");
    };

    // Phân trang
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = displayList.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(displayList.length / rowsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="flex min-h-screen">
            <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex-1 p-6 ml-64 mt-15">
                <NavbarAdmin handleOnChange={handleOnChange} />

                {/* Tiêu đề + Nút thêm mới */}
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

                {/* Bảng danh sách câu hỏi */}
                <div className="mt-6 mx-auto max-w-6xl bg-white p-6 rounded-lg shadow-lg">
                    <Table data={currentRows} handleOnChange={() => {}} />

                    {/* Pagination */}
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => paginate(i + 1)}
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

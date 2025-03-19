import { useEffect, useState } from "react";
import SidebarAdmin from "../SidebarAdmin";
import NavbarAdmin from "../NavbarAdmin";
import axios from "axios";
import Table from "../../compunents/Table";
const ListAnswers = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [answerList, setAnswerList] = useState([]);
    const [displayList, setDisplayList] = useState([]);

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10; // Số dòng mỗi trang

    useEffect(() => {
        async function fetchAnswers() {
            try {
                const response = await axios.get("http://localhost:5000/api/answers");
                setAnswerList(response.data);
                setDisplayList(format(response.data));
            } catch (err) {
                console.log("Có lỗi khi lấy danh sách câu trả lời.", err);
            }
        }
        fetchAnswers();
    }, []);

    function format(list) {
        return list.map((item) => ({
            "ID Câu hỏi": item.question_id,
            "Đáp án": item.content,
            "Đúng/Sai": item.is_correct ? "✔️ Đúng" : "❌ Sai",
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
            ? answerList
            : answerList.filter((item) =>
                  [item.content, item.is_correct?.toString(), item.question_id?.toString()]
                      .filter(Boolean)
                      .some((field) => field.toLowerCase().includes(keyword))
              );
    };

    function handleOnClick() {
        console.log("Row clicked!");
    }

    // Phân trang
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = displayList.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(displayList.length / rowsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="flex items-center relative h-[100vh]">
            <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="ml-[250px] w-full h-[80%] items-start">
                <NavbarAdmin handleOnChange={handleOnChange} />
                <button className="add-course-btn">Thêm mới</button>
                <div className="mt-[40px] mx-[40px] w-[90%] h-full">
                    <Table data={currentRows} handleOnChange={handleOnClick} />

                    {/* Pagination */}
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => paginate(i + 1)}
                                className={`px-4 py-2 mx-1 border ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
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

export default ListAnswers;

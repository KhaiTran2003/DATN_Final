import { useEffect, useState } from "react";
import SidebarAdmin from "../SidebarAdmin";
import NavbarAdmin from "../NavbarAdmin";
import axios from "axios";
import Table from "../../compunents/Table";
import { useNavigate } from "react-router-dom";

const ListLesson = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [listLesson, setListLesson] = useState([]);
    const [displayList, setDisplayList] = useState([]);

    const navigate = useNavigate(); // Dùng useNavigate
    // State phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    

    useEffect(() => {
        fetchLessons();
    }, []);

    const fetchLessons = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/lessons');
            setListLesson(response.data);
            setDisplayList(formatData(response.data));
        } catch (err) {
            console.error('Lỗi khi lấy dữ liệu bài học.', err);
        }
    };

    const formatData = (list) => {
        return list.map(({ id_lesson, title, duration, course_title, fullname }) => ({
            id_lesson,
            title,
            duration,
            'course title': course_title,
            teacher: fullname
        }));
    };

    const handleSearch = (event) => {
        const keyword = event.target.value.trim().toLowerCase();
        setCurrentPage(1);
        setDisplayList(
            formatData(
                keyword
                    ? listLesson.filter(({ title, duration, course_title, fullname }) =>
                        [title, duration, course_title, fullname]
                            .some(field => field?.toString().toLowerCase().includes(keyword))
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
        navigate(`/edit-lesson/${id}`);
    };
    

    const handleDeleteLesson = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa bài học này không?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/lessons/${id}`);
            setListLesson(prev => prev.filter(item => item.id_lesson !== id));
            setDisplayList(prev => prev.filter(item => item.id_lesson !== id));
            console.log(`Đã xóa bài học ID: ${id}`);
        } catch (err) {
            console.error("Lỗi khi xóa bài học:", err);
        }
    };

    // Phân trang
    const indexOfLastRow = currentPage * rowsPerPage;
    const currentRows = displayList.slice(indexOfLastRow - rowsPerPage, indexOfLastRow);
    const totalPages = Math.ceil(displayList.length / rowsPerPage);

    return (
        <div className="flex items-center relative h-[100vh]">
            <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className="ml-[250px] w-full h-[80%] items-start">
                <NavbarAdmin handleOnChange={handleSearch} />
                <button className="add-course-btn">Thêm mới</button>
                <div className="mt-[40px] mx-[40px] items-center w-[90%] h-full">
                    <Table data={currentRows} idKey="id_lesson" handleEdit={handleEditLesson} handleDelete={handleDeleteLesson} />
                    {/* Pagination */}
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-4 py-2 mx-1 border ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
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

export default ListLesson;

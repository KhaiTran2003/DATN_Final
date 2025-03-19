import { useEffect, useState } from "react";
import SidebarAdmin from "../SidebarAdmin";
import NavbarAdmin from "../NavbarAdmin";
import axios from "axios";
import Table from "../../compunents/Table";

const ListLesson = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [ListLesson, setListLesson] = useState([]);
    const [displayList, setDisplayList] = useState([]);

    // State quản lý phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10; // Mỗi trang hiển thị 10 hàng

    useEffect(() => {
        async function getAllListLesson() {
            try {
                const response = await axios.get('http://localhost:5000/api/lessons');
                setListLesson(response.data);
                setDisplayList(format(response.data));
            } catch (err) {
                console.log('Có lỗi khi lấy dữ liệu khóa học.', err);
            }
        }
        getAllListLesson();
    }, []);

    function format(list) {
        return list.map(item => ({
            title: item.title,
            duration: item.duration,
            image: item.image,
            'course title': item.course_title,
            teacher: item.fullname
        }));
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    function handleOnChange(event) {
        const keyword = event.target.value;
        setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
        setDisplayList(format(filteredList(keyword)));
    }

    const filteredList = (keyword) => {
        const lowerKeyword = keyword.trim().toLowerCase();
        return keyword.trim() === ''
            ? ListLesson
            : ListLesson.filter(item => (
                item.title.toLowerCase().includes(lowerKeyword) ||
                item.duration?.toString().toLowerCase().includes(lowerKeyword) ||
                item.image?.toLowerCase().includes(lowerKeyword) ||
                item.course_title?.toLowerCase().includes(lowerKeyword) ||
                item.fullname?.toLowerCase().includes(lowerKeyword)
            ));
    };

    function handleOnClick() {
        console.log("Row clicked!");
    }

    // Lấy danh sách dữ liệu hiển thị cho trang hiện tại
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = displayList.slice(indexOfFirstRow, indexOfLastRow);

    // Xử lý chuyển trang
    const totalPages = Math.ceil(displayList.length / rowsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="flex items-center relative h-[100vh]">
            <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="ml-[250px] w-full h-[80%] items-start">
                <NavbarAdmin handleOnChange={handleOnChange} />
                <button className="add-course-btn">Thêm mới</button>
                <div className="mt-[40px] mx-[40px] items-center w-[90%] h-full">
                    <Table data={currentRows} handleOnChange={handleOnClick} />
                    
                    {/* Pagination */}
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => paginate(i + 1)}
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

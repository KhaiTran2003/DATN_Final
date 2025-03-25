import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../NavbarAdmin';
import SidebarAdmin from '../SidebarAdmin';
import axios from 'axios';
import { FaEye, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function ListUser() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [or_users, setOrUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentUsers = users.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(users.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
        setOrUsers(response.data);
      } catch (err) {
        setError('Có lỗi khi lấy dữ liệu người dùng.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        const updated = users.filter(user => user.id_user !== id);
        setUsers(updated);
        setOrUsers(updated);
        alert("Xóa người dùng thành công!");
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa người dùng.");
      }
    }
  };

  const Myfilter = (keyword) => {
    if (!keyword || keyword.trim() === '') return or_users;

    const lowerKeyword = keyword.toLowerCase();
    return or_users.filter(user =>
      user.fullname.toLowerCase().includes(lowerKeyword) ||
      user.username.toLowerCase().includes(lowerKeyword) ||
      user.email.toLowerCase().includes(lowerKeyword) ||
      String(user.phone).toLowerCase().includes(lowerKeyword) ||
      user.avatar.toLowerCase().includes(lowerKeyword) ||
      user.is_active.toString().toLowerCase().includes(lowerKeyword) ||
      (user.role && user.role.toLowerCase().includes(lowerKeyword))
    );
  };

  const handleOnChange = (event) => {
    const keyword = event.target.value;
    setUsers(Myfilter(keyword));
    setCurrentPage(1);
  };

  if (loading) return <div className="p-6">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen">
      <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 p-6 ml-64">
        <NavbarAdmin handleOnChange={handleOnChange} />
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Danh sách người dùng</h2>

          <div className="flex justify-end mb-6">
            <Link to="/add-user">
              <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center shadow-md">
                <FaPlus className="mr-2" /> Thêm người dùng
              </button>
            </Link>
          </div>

          {users.length === 0 ? (
            <p className="text-center text-gray-600">Không có người dùng.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 shadow-md">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="border border-gray-300 px-4 py-2 text-left">Họ và tên</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Tên đăng nhập</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">SĐT</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Ảnh đại diện</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Trạng thái</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map(user => (
                      <tr key={user.id_user} className="hover:bg-gray-100">
                        <td className="border border-gray-300 px-4 py-2">{user.fullname}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.phone}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <img src={`http://localhost:5000/${user.avatar}`} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{user.role || 'N/A'}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <span className={`px-3 py-1 rounded-full text-white ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}>
                            {user.is_active ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-4 py-2 flex space-x-2">
                          <Link to={`/user-detail/${user.id_user}`}>
                            <button className="text-blue-500 hover:underline flex items-center">
                              <FaEye className="mr-1" /> Xem
                            </button>
                          </Link>
                          <Link to={`/edit-user/${user.id_user}`}>
                            <button className="text-green-500 hover:underline flex items-center">
                              <FaEdit className="mr-1" /> Sửa
                            </button>
                          </Link>
                          <button
                            className="text-red-500 hover:underline flex items-center"
                            onClick={() => handleDeleteUser(user.id_user)}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListUser;

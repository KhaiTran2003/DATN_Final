import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../NavbarAdmin';
import SidebarAdmin from '../SidebarAdmin';
import '../../css/css_admin/AdminDashboard.css';
import axios from 'axios';
import { FaEye, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import '../../css/css_admin/User.css';
import { Link } from 'react-router-dom';

function ListUser() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (err) {
        setError('Có lỗi khi lấy dữ liệu người dùng.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        setUsers(users.filter(user => user.id_user !== id));
        alert("Xóa người dùng thành công!");
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa người dùng.");
      }
    }
  };
  

  return (
    <div>
      <button onClick={toggleSidebar}>Toggle Sidebar</button>
      <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <NavbarAdmin />

      <div className="user-table-container">
        <h1>Danh sách người dùng</h1>
        
        <Link to='/add-user'>
          <button className="add-user-btn">
            <FaPlus /> Thêm người dùng
          </button>
        </Link>
        
        {users.length === 0 ? (
          <p>Không có người dùng.</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Họ và tên</th>
                <th>Tên đăng nhập</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Ảnh đại diện</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id_user}>
                  <td>{user.fullname}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.avatar}</td>
                  <td>{user.is_active ? 'Hoạt động' : 'Không hoạt động'}</td>
                  <td className="actions">
                    <Link to={`/user-detail/${user.id_user}`}>
                      <button className="action-btn view-btn">
                        <FaEye /> Xem
                      </button>
                    </Link>
                    <Link to={`/edit-user/${user.id_user}`}>
                      <button className="action-btn edit-btn">
                        <FaEdit /> Sửa
                      </button>
                    </Link>
                    <button className="action-btn delete-btn" onClick={() => handleDeleteUser(user.id_user)}>
                      <FaTrashAlt /> Xóa
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ListUser;

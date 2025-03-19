import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../SidebarAdmin';
import NavbarAdmin from '../NavbarAdmin';
import { useParams, useNavigate } from 'react-router-dom'; // Sử dụng useParams để lấy userId từ URL
import { FaEye, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
function UserDetail() {
  const { userId } = useParams(); // Lấy userId từ URL
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`);
        if (!response.ok) {
          throw new Error('Không tìm thấy người dùng');
        }
        const data = await response.json();
        setUser(data);
        //console.log(data)
      } catch (err) {
        setError('Có lỗi khi lấy thông tin người dùng.');
      }
    };

    fetchUserDetail();
  }, [userId]); // Khi userId thay đổi, gọi lại API

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Đang tải thông tin người dùng...</div>;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="user-detail-container">
      <button onClick={toggleSidebar}>Thu nhỏ sidebar</button>
      <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <NavbarAdmin />

      <form className="user-detail-form">
        <div className="form-group">
          <label htmlFor="fullname">Họ và tên:</label>
          <input
            type="text"
            id="fullname"
            value={user.fullname}
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Tên đăng nhập:</label>
          <input
            type="text"
            id="username"
            value={user.username}
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={user.email}
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Số điện thoại:</label>
          <input
            type="text"
            id="phone"
            value={user.phone}
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="avatar">Ảnh đại diện:</label>
          <input
            type="text"
            id="avatar"
            value={user.avatar || 'Chưa có ảnh'}
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="isActive">Trạng thái:</label>
          <select
            id="isActive"
            value={user.isActive ? 'Hoạt động' : 'Không hoạt động'}
            disabled
          >
            <option value="Hoạt động">Hoạt động</option>
            <option value="Không hoạt động">Không hoạt động</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => navigate('/list-user')}
          className="back-btn"
        >
          Quay lại danh sách
        </button>
        <Link to={`/edit-user/${user.id_user}`}>
          <button className="submit-btn">
            Sửa
          </button>
        </Link>

      </form>
    </div>
  );
}

export default UserDetail;

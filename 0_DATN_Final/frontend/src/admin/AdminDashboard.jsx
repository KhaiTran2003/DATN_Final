import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarAdmin from './NavbarAdmin'; // Import NavbarAdmin
import SidebarAdmin from './SidebarAdmin'; // Import SidebarAdmin
import '../css/css_admin/AdminDashboard.css';

function AdminDashboard() {
  const [data, setData] = useState({
    users: [],
    courses: [],
    lessons: [],
    questions: [],
    answers: [],
    progress: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Hàm fetch dữ liệu chung
  const fetchData = async (url, key) => {
    try {
      const response = await axios.get(url);
      setData(prevData => ({
        ...prevData,
        [key]: Array.isArray(response.data) ? response.data : []
      }));
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Có lỗi khi lấy dữ liệu.');
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);

      // Fetch dữ liệu từ các API
      await Promise.all([
        fetchData('/api/users', 'users'),
        fetchData('/api/courses', 'courses'),
        fetchData('/api/lessons', 'lessons'),
        fetchData('/api/questions', 'questions'),
        fetchData('/api/answers', 'answers'),
        fetchData('/api/progress', 'progress')
      ]);

      setLoading(false);
    };

    fetchAllData();
  }, []);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Đổi trạng thái của sidebar
  };

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar */}
      <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Nội dung chính */}
      <div className="content">
        {/* Navbar component */}
        <NavbarAdmin toggleSidebar={toggleSidebar} /> 

        {/* Thống kê đầu trang */}
        <div className="stats">
          <h2>Thông tin tổng quan</h2>
          <div className="stats-item">
            <h3>Số người dùng: {data.users.length}</h3>
          </div>
          {/* Bạn có thể thêm thống kê cho các mục khác ở đây */}
        </div>

        {/* Hiển thị dữ liệu người dùng */}
        <div>
          <h1>Admin Dashboard</h1>
          <section>
            <h2>Quản lý người dùng</h2>
            <ul>
              {data.users.length === 0 ? (
                <p>Không có người dùng.</p>
              ) : (
                data.users.map((user) => (
                  <li key={user.id_user}>
                    <div>
                      <img
                        src={user.avatar || 'default-avatar.png'}
                        alt="Avatar"
                        style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                      />
                    </div>
                    <div>
                      <p><strong>Họ và tên:</strong> {user.fullname}</p>
                      <p><strong>Tên đăng nhập:</strong> {user.username}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Số điện thoại:</strong> {user.phone}</p>
                      <p><strong>Trạng thái:</strong> {user.is_active ? 'Hoạt động' : 'Không hoạt động'}</p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

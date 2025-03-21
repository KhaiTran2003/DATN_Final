import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../SidebarAdmin';
import NavbarAdmin from '../NavbarAdmin';
import { useParams, useNavigate, Link } from 'react-router-dom';

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`);
        if (!response.ok) throw new Error('Không tìm thấy người dùng');
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError('Có lỗi khi lấy thông tin người dùng.');
      }
    };
    fetchUserDetail();
  }, [userId]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (error) {
    return <div className="text-red-500 text-center mt-5">{error}</div>;
  }

  if (!user) {
    return <div className="text-center text-gray-500 mt-5">Đang tải thông tin người dùng...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <NavbarAdmin />
        <div className="flex justify-center items-center h-full p-6 mt-16">
          <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 flex">
            <div className="w-1/3 flex flex-col justify-center items-center">
              <img
                src={`http://localhost:5000/${user.avatar}`}
                alt="Avatar"
                className="w-40 h-40 object-cover rounded-full border"
              />
              <p className="mt-4 font-medium text-gray-700">{user.username}</p>
            </div>
            <div className="w-2/3 pl-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Chi tiết người dùng</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 font-medium">Họ và tên:</label>
                  <input type="text" value={user.fullname} disabled className="w-full p-2 border rounded bg-gray-100" />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium">Email:</label>
                  <input type="text" value={user.email} disabled className="w-full p-2 border rounded bg-gray-100" />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium">Số điện thoại:</label>
                  <input type="text" value={user.phone} disabled className="w-full p-2 border rounded bg-gray-100" />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium">Trạng thái:</label>
                  <select disabled value={user.is_active ? 'Hoạt động' : 'Không hoạt động'} className="w-full p-2 border rounded bg-gray-100">
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Không hoạt động">Không hoạt động</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => navigate('/list-user')}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Quay lại danh sách
                </button>
                <Link
                  to={`/edit-user/${user.id_user}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Sửa
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default UserDetail;

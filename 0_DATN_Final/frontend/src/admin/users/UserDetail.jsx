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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  if (!user) {
    return <div className="text-center text-gray-500 mt-10">Đang tải thông tin người dùng...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <NavbarAdmin />
        <div className="flex justify-center items-start p-8 mt-20">
          <div className="w-full max-w-5xl bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row gap-6">
            
            {/* AVATAR + TÊN */}
            <div className="md:w-1/3 w-full flex flex-col items-center justify-start">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-300 shadow">
                <img
                  src={user.avatar ? `http://localhost:5000/${user.avatar}` : 'https://via.placeholder.com/150'}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-4 font-semibold text-lg text-gray-700">{user.username}</p>
            </div>

            {/* THÔNG TIN */}
            <div className="md:w-2/3 w-full">
              <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center md:text-left">Chi tiết người dùng</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Họ và tên:</label>
                  <input
                    type="text"
                    value={user.fullname}
                    disabled
                    className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-700 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Email:</label>
                  <input
                    type="text"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-700 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Số điện thoại:</label>
                  <input
                    type="text"
                    value={user.phone}
                    disabled
                    className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-700 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Trạng thái:</label>
                  <select
                    disabled
                    value={user.is_active ? 'Hoạt động' : 'Không hoạt động'}
                    className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-700 shadow-sm"
                  >
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Không hoạt động">Không hoạt động</option>
                  </select>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => navigate('/list-user')}
                  className="px-5 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                >
                  ← Quay lại
                </button>
                <Link
                  to={`/edit-user/${user.id_user}`}
                  className="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  Sửa thông tin
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

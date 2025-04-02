import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../SidebarAdmin';
import NavbarAdmin from '../NavbarAdmin';
import { useParams, useNavigate } from 'react-router-dom';

function EditUser() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [oldAvatar, setOldAvatar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`);
        if (!response.ok) throw new Error('Không tìm thấy người dùng');
        const data = await response.json();
        setUser(data);
        setOldAvatar(data.avatar);
        setImagePreview(`http://localhost:5000${data.avatar}`);
      } catch (err) {
        setError('Có lỗi khi lấy thông tin người dùng.');
      }
    };
    fetchUserDetail();
  }, [userId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setUser((prev) => ({
      ...prev,
      isActive: value === 'Hoạt động',
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setUser((prev) => ({
        ...prev,
        avatar: file,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('fullname', user.fullname);
      formData.append('username', user.username);
      formData.append('email', user.email);
      formData.append('phone', user.phone);
      formData.append('avatar', user.avatar);
      formData.append('oldAvatar', oldAvatar);
      formData.append('isActive', user.isActive ? 'Hoạt động' : 'Không hoạt động');
      formData.append('role', user.role);

      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) throw new Error('Cập nhật người dùng thất bại');
      navigate('/list-user');
    } catch (err) {
      console.log(err);
      setError('Có lỗi khi cập nhật thông tin người dùng.');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!user) return <div className="text-center text-gray-500 mt-10">Đang tải thông tin người dùng...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <NavbarAdmin />
        <div className="flex justify-center items-start p-8 mt-20">
          <div className="w-full max-w-5xl bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row gap-6">
            
            {/* AVATAR */}
            <div className="md:w-1/3 w-full flex flex-col items-center justify-start">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-300 shadow">
                <img
                  src={imagePreview || 'https://via.placeholder.com/150'}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="mt-4 block text-sm text-gray-700 font-medium">Cập nhật ảnh đại diện:</label>
              <input
                type="file"
                onChange={handleAvatarChange}
                className="mt-2 text-sm text-gray-600 file:mr-4 file:py-1 file:px-2 file:border file:rounded file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* FORM */}
            <div className="md:w-2/3 w-full">
              <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center md:text-left">Chỉnh sửa người dùng</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Họ và tên:</label>
                  <input
                    type="text"
                    id="fullname"
                    value={user.fullname}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Tên đăng nhập:</label>
                  <input
                    type="text"
                    id="username"
                    value={user.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Email:</label>
                  <input
                    type="email"
                    id="email"
                    value={user.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Số điện thoại:</label>
                  <input
                    type="text"
                    id="phone"
                    value={user.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Trạng thái:</label>
                  <select
                    id="isActive"
                    value={user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    onChange={handleStatusChange}
                    className="w-full px-4 py-2 border rounded-md shadow-sm bg-white"
                  >
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Không hoạt động">Không hoạt động</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Role:</label>
                  <select
                    id="role"
                    value={user.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md shadow-sm bg-white"
                  >
                    <option value="teacher">Teacher</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => navigate('/list-user')}
                  className="px-5 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                >
                  ← Quay lại
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  Hoàn thành
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default EditUser;

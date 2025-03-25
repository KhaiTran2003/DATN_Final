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
      // Thêm trường role để cập nhật vào bảng user_role
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

  if (error) return <div className="text-red-500 text-center mt-5">{error}</div>;
  if (!user) return <div className="text-center text-gray-500 mt-5">Đang tải thông tin người dùng...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <NavbarAdmin />
        <div className="flex justify-center items-center h-full p-6 mt-16">
          <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 flex">
            <div className="w-1/3 flex flex-col justify-center items-center">
              <img
                src={imagePreview}
                alt="Avatar"
                className="w-40 h-40 object-cover rounded-full border"
              />
              <input
                type="file"
                onChange={handleAvatarChange}
                className="mt-4 text-sm"
              />
            </div>

            <div className="w-2/3 pl-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Chỉnh sửa người dùng</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 font-medium">Họ và tên:</label>
                  <input
                    type="text"
                    id="fullname"
                    value={user.fullname}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium">Tên đăng nhập:</label>
                  <input
                    type="text"
                    id="username"
                    value={user.username}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium">Email:</label>
                  <input
                    type="email"
                    id="email"
                    value={user.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium">Số điện thoại:</label>
                  <input
                    type="text"
                    id="phone"
                    value={user.phone}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium">Trạng thái:</label>
                  <select
                    id="isActive"
                    value={user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    onChange={handleStatusChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Không hoạt động">Không hoạt động</option>
                  </select>
                </div>
                {/* Thêm trường chọn Role */}
                <div>
                  <label className="block text-gray-600 font-medium">Role:</label>
                  <select
                    id="role"
                    value={user.role}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="teacher">Teacher</option>
                    <option value="user">User</option>
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
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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

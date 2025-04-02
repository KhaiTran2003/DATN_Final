import React, { useState } from 'react';
import SidebarAdmin from '../SidebarAdmin';
import NavbarAdmin from '../NavbarAdmin';
import { useNavigate } from 'react-router-dom';

function AddUser() {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('fullname', fullname);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('avatar', avatar);
    formData.append('isActive', isActive);

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Thêm người dùng thành công!');
        setMessageType('success');
        navigate('/list-user');
      } else {
        setMessage(data.message || 'Thêm người dùng thất bại!');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Lỗi kết nối! Vui lòng thử lại.');
      setMessageType('error');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <NavbarAdmin />

        <div className="flex justify-center items-start p-8 mt-20">
          <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
            
            {/* AVATAR */}
            <div className="md:w-1/3 w-full bg-gray-100 p-6 flex flex-col items-center justify-center">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-300 shadow">
                <img
                  src={preview || "https://via.placeholder.com/150"}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="mt-4 block text-sm text-gray-700 font-medium">Ảnh đại diện:</label>
              <input
                type="file"
                onChange={handleAvatarChange}
                className="mt-2 text-sm text-gray-600 file:mr-4 file:py-1 file:px-2 file:border file:rounded file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* FORM */}
            <div className="md:w-2/3 w-full p-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Thêm người dùng</h2>

              {message && (
                <div className={`mb-4 p-3 rounded text-sm text-center font-medium ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Họ và tên:</label>
                  <input
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-medium mb-1">Tên đăng nhập:</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-medium mb-1">Mật khẩu:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-medium mb-1">Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-medium mb-1">Số điện thoại:</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-medium mb-1">Trạng thái:</label>
                  <select
                    value={isActive ? 'true' : 'false'}
                    onChange={(e) => setIsActive(e.target.value === 'true')}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="true">Hoạt động</option>
                    <option value="false">Không hoạt động</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 shadow transition-all duration-200"
                  >
                    Thêm người dùng
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default AddUser;

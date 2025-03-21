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
  const [preview, setPreview] = useState(null); // Ảnh preview
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

        <div className="flex justify-center items-center h-full p-6 mt-16">
          <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row overflow-hidden">

            {/* ẢNH BÊN TRÁI */}
            <div className="md:w-1/3 w-full bg-gray-100 flex flex-col items-center justify-start p-4">
              <div className="w-40 h-40 border rounded-full overflow-hidden">
                <img
                  src={preview || "https://via.placeholder.com/150"}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                type="file"
                id="avatar"
                onChange={handleAvatarChange}
                className="mt-4 text-sm"
              />
            </div>

            {/* FORM BÊN PHẢI */}
            <div className="md:w-2/3 w-full p-4 space-y-4">
              <h2 className="text-2xl font-semibold text-gray-700 text-center md:text-left">Thêm người dùng</h2>

              {message && (
                <div className={`text-center p-3 rounded ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-600 font-medium">Họ và tên:</label>
                  <input
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-medium">Tên đăng nhập:</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-medium">Mật khẩu:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-medium">Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-medium">Số điện thoại:</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-medium">Trạng thái:</label>
                  <select
                    value={isActive ? 'true' : 'false'}
                    onChange={(e) => setIsActive(e.target.value === 'true')}
                    className="w-full p-2 border rounded"
                  >
                    <option value="true">Hoạt động</option>
                    <option value="false">Không hoạt động</option>
                  </select>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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

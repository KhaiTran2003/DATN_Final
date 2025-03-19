import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../NavbarAdmin';
import SidebarAdmin from '../SidebarAdmin';
import { useNavigate, Link } from 'react-router-dom'; // Use useNavigate instead of useHistory

function AddUser() {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(null); // Avatar will store the file
  const [isActive, setIsActive] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  
  const navigate = useNavigate(); // Hook to navigate to other routes

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData to send the file along with other data
    const formData = new FormData();
    formData.append('fullname', fullname);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('avatar', avatar); // Send the avatar file
    formData.append('isActive', isActive);

    // Send the data to the API
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        body: formData, // Sending FormData
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Thêm người dùng thành công!');
        setMessageType('success');
        navigate('/list-user'); // Navigate to list-user after successful submission
      } else {
        setMessage(data.message || 'Thêm người dùng thất bại!');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Lỗi kết nối! Vui lòng thử lại.');
      setMessageType('error');
    }

    // Reset form after submission
    setFullname('');
    setUsername('');
    setPassword('');
    setEmail('');
    setPhone('');
    setAvatar(null);
    setIsActive(true);
  };

  return (
    <div className='add-user-container'>
      <button onClick={toggleSidebar}>Thu nhỏ sidebar</button>
      <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <NavbarAdmin />


      {/* Display success or error messages */}
      {message && (
        <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="add-user-form">
        <div className="form-group">
          <label htmlFor="fullname">Họ và tên:</label>
          <input 
            type="text" 
            id="fullname" 
            value={fullname} 
            onChange={(e) => setFullname(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Tên đăng nhập:</label>
          <input 
            type="text" 
            id="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mật khẩu:</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Số điện thoại:</label>
          <input 
            type="text" 
            id="phone" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="avatar">Ảnh đại diện:</label>
          <input 
            type="file" 
            id="avatar" 
            onChange={(e) => setAvatar(e.target.files[0])} // Get the file when user selects
          />
        </div>

        <div className="form-group">
          <label htmlFor="isActive">Trạng thái:</label>
          <select 
            id="isActive" 
            value={isActive} 
            onChange={(e) => setIsActive(e.target.value === 'true')}>
            <option value="true">Hoạt động</option>
            <option value="false">Không hoạt động</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">Thêm người dùng</button>
      </form>
    </div>
  );
}

export default AddUser;

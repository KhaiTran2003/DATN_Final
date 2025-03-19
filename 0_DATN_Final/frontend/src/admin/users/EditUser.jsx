import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../SidebarAdmin';
import NavbarAdmin from '../NavbarAdmin';
import { useParams, useNavigate } from 'react-router-dom';

function EditUser() {
  const [oldAvatar, setOldAvatar] = useState(null)
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // Thêm state để lưu trữ ảnh đại diện
  const navigate = useNavigate();

  // Lấy thông tin người dùng khi component mount
  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`);
        if (!response.ok) {
          throw new Error('Không tìm thấy người dùng');
        }
        const data = await response.json();
        setUser(data);
        setImagePreview(`http://localhost:5000${data.avatar}`);
        setOldAvatar(data.avatar) // Cập nhật ảnh đại diện ban đầu
        console.log(`http://localhost:5000${data.avatar}`);

      } catch (err) {
        setError('Có lỗi khi lấy thông tin người dùng.');
      }
    };

    fetchUserDetail();
  }, [userId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleStatusChange = (e) => {
    const { value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      isActive: value === 'Hoạt động',
    }));
  };

  // Cập nhật ảnh đại diện khi người dùng chọn ảnh
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Tạo URL tạm thời từ file
      setImagePreview(URL.createObjectURL(file));
      setUser((prevState) => ({
        ...prevState,
        avatar: file, // Lưu file vào state
      }));
      console.log(file)

    }
  };
  
  // Cập nhật thông tin người dùng
  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('fullname', user.fullname);
      formData.append('username', user.username);
      formData.append('email', user.email);
      formData.append('phone', user.phone);
      formData.append("avatar",user.avatar)
      formData.append('oldAvatar',oldAvatar)

      // Nếu có ảnh đại diện, upload lên Cloudinary
      // if (user.avatar) {
      //   // Tạo một FormData mới cho việc upload lên Cloudinary
      //   // const cloudinaryFormData = new FormData();
      //   // cloudinaryFormData.append('file', user.avatar);
      //   // cloudinaryFormData.append('upload_preset', 'lcms_cloudinary'); // Thay bằng upload preset của bạn
        
      //   // // Upload ảnh lên Cloudinary
      //   // const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/djbljuj0e/image/upload', {
      //   //   method: 'POST',
      //   //   body: cloudinaryFormData,
      //   // });
  
      //   // if (!cloudinaryResponse.ok) {
      //   //   throw new Error('Không thể tải ảnh lên Cloudinary');
      //   // }
      //   // const cloudinaryData = await cloudinaryResponse.json();
      //   // formData.append('avatar', cloudinaryData.secure_url); // Lưu URL ảnh trả về từ Cloudinary
      //   formData.append("avatar",user.avatar)
        
      // }
  
      formData.append('isActive', user.isActive ? 'Hoạt động' : 'Không hoạt động');
  
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Cập nhật người dùng thất bại');
      }
  
      navigate('/list-user');
    } catch (err) {
      console.log(err)
      setError('Có lỗi khi cập nhật thông tin người dùng.');
    }
  };
  

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
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Tên đăng nhập:</label>
          <input
            type="text"
            id="username"
            value={user.username}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={user.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Số điện thoại:</label>
          <input
            type="text"
            id="phone"
            value={user.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="avatar">Ảnh đại diện:</label>
          <input
            type="file"
            id="avatar"
            onChange={handleAvatarChange} // Khi người dùng chọn ảnh
          />
          {imagePreview && <img src={imagePreview} alt="Avatar" width="100" />}
        </div>

        <div className="form-group">
          <label htmlFor="isActive">Trạng thái:</label>
          <select
            id="isActive"
            value={user.isActive ? 'Hoạt động' : 'Không hoạt động'}
            onChange={handleStatusChange}
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
        <button
          type="button"
          onClick={handleSubmit}
          className="submit-btn"
        >
          Hoàn thành
        </button>
      </form>
    </div>
  );
}

export default EditUser;

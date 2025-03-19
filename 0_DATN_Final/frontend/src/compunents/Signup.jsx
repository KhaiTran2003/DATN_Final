import React, { useState } from 'react';
import './Signup.css'; // Đảm bảo rằng bạn đã tạo file CSS và import vào đây
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Signup() {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    avatar: null, // Lưu trữ tệp avatar
    is_active: true, // Mặc định là true
  });

  const [errors, setErrors] = useState({
    fullname: '',
    username: '',
    password: '',
    email: '',
    phone: '',
  });

  const navigate = useNavigate(); // Khai báo useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'avatar') {
      setFormData((prevData) => ({
        ...prevData,
        avatar: e.target.files[0], // Lưu tệp ảnh đã chọn
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validate = () => {
    let isValid = true;
    let errors = {};

    if (!formData.fullname) {
      isValid = false;
      errors.fullname = 'Full name is required';
    }

    if (!formData.username) {
      isValid = false;
      errors.username = 'Username is required';
    }

    if (!formData.email) {
      isValid = false;
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      isValid = false;
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      isValid = false;
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      isValid = false;
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.phone) {
      isValid = false;
      errors.phone = 'Phone is required';
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      try {
        // Kiểm tra xem username hoặc email đã tồn tại chưa
        const response = await axios.post('http://localhost:5000/api/checkUser', {
          username: formData.username,
          email: formData.email
        });
  
        // Kiểm tra nếu có lỗi trả về từ server (username hoặc email đã tồn tại)
        if (response.data.usernameExists) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            username: 'Username already exists'
          }));
          return;
        }
  
        if (response.data.emailExists) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: 'Email already exists'
          }));
          return;
        }
  
        // Nếu không có lỗi, gửi dữ liệu form đi
        const formDataToSend = new FormData();
        formDataToSend.append('fullname', formData.fullname);
        formDataToSend.append('username', formData.username);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('avatar', formData.avatar); // Gửi tệp avatar
        formDataToSend.append('is_active', formData.is_active);
  
        // Gửi dữ liệu form tới backend (bao gồm tệp avatar)
        await axios.post('http://localhost:5000/api/signup', formDataToSend);
        console.log('User signed up successfully');
        
        // Chuyển hướng đến trang homepage sau khi đăng ký thành công
        navigate('/homepage'); // Điều hướng đến trang chủ
      } catch (error) {
        console.error('There was an error signing up or checking user', error);
      }
    }
  };

  return (
    <div className="signup-container">
      <h2>SIGN UP</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
          {errors.fullname && <span className="error">{errors.fullname}</span>}
        </div>

        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="input-group">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>

        <div className="input-group">
          <label>Avatar</label>
          <input
            type="file"
            name="avatar"
            onChange={handleChange}
            accept="image/*" // Chỉ chấp nhận file hình ảnh
          />
        </div>

        <button type="submit" className="signup-button">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;

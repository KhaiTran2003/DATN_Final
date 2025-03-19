import React, { useContext, useState } from 'react';
import '../compunents/Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import MyContext from '../Context/context';

function Login() {
  const {role, setRole} = useContext(MyContext);

  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    usernameOrEmail: '',
    password: '',
  });

  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    let isValid = true;
    let errors = {};

    if (!formData.usernameOrEmail) {
      isValid = false;
      errors.usernameOrEmail = 'Username or Email is required';
    }

    if (!formData.password) {
      isValid = false;
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      isValid = false;
      errors.password = 'Password must be at least 6 characters';
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      axios.post('http://localhost:5000/api/login', formData)
        .then(response => {
          const { roles } = response.data; // Lấy danh sách role từ server
  
          if (roles.includes('admin')) {
            setRole('admin');
            navigate('/admin-dashboard'); 
          } 
          else if (roles.includes('teacher')) {
            setRole('teacher');
            navigate('/teacher-dashboard');
          } 
          else {
            setRole('user');
            navigate('/homepage');
          }
        })
        .catch(error => {
          setLoginError('Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin đăng nhập.');
          console.error('Lỗi đăng nhập:', error);
        });
    }
  };
  

  return (
    <div id='login' className="login-container">
      <h2>MEMBER LOGIN</h2>
      {loginError && <div className="error-message">{loginError}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Username or Email</label>
          <input
            type="text"
            name="usernameOrEmail"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            required
          />
          {errors.usernameOrEmail && <span className="error">{errors.usernameOrEmail}</span>}
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

        <button type="submit" className="login-button">
          LOGIN
        </button>
      </form>
      <div className="footer">
        <p>Not a member? <Link to='/signup'>Create Account</Link></p>
      </div>
    </div>
  );
}

export default Login;

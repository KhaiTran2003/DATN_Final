import React, { useContext, useState } from 'react';
import '../compunents/Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MyContext from '../Context/context';
import { FaUser, FaLock } from 'react-icons/fa';

function Login() {
  const { role, setRole } = useContext(MyContext);
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
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
      axios
        .post('http://localhost:5000/api/login', formData)
        .then((response) => {
          const { roles, token, userId } = response.data;
          if (formData.remember) {
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
          }

          if (roles.includes('admin')) {
            setRole('admin');
            navigate('/admin-dashboard');
          } else if (roles.includes('teacher')) {
            setRole('teacher');
            navigate('/teacher-dashboard');
          } else {
            setRole('user');
            navigate('/homepage');
          }
        })
        .catch((error) => {
          setLoginError(
            'Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin đăng nhập.'
          );
          console.error('Lỗi đăng nhập:', error);
        });
    }
  };

  return (
    <div className="login-container-modern">
      <h2 className="login-title">SIGN IN</h2>
      {loginError && <div className="login-error">{loginError}</div>}
      <form onSubmit={handleSubmit}>
        <div className="login-input-wrapper">
          <FaUser className="login-icon" />
          <input
            type="text"
            name="usernameOrEmail"
            placeholder="Username or Email"
            value={formData.usernameOrEmail}
            onChange={handleChange}
          />
        </div>
        {errors.usernameOrEmail && (
          <div className="field-error">{errors.usernameOrEmail}</div>
        )}

        <div className="login-input-wrapper">
          <FaLock className="login-icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
        {errors.password && (
          <div className="field-error">{errors.password}</div>
        )}

        <div className="login-options">
          <label className="remember-label">
            <input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
            />
            Remember me
          </label>
          <span className="forgot-text">Forgot Password?</span>
        </div>

        <button type="submit" className="login-btn-modern">
          SIGN IN
        </button>
      </form>
    </div>
  );
}

export default Login;

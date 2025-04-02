import React, { useState } from 'react';
import './Signup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaImage } from 'react-icons/fa';

function Signup() {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    avatar: null,
    is_active: true,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar') {
      const file = files[0];
      setFormData((prev) => ({ ...prev, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    let errors = {};
    if (!formData.fullname) errors.fullname = 'Full name is required';
    if (!formData.username) errors.username = 'Username is required';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = 'Valid email is required';
    if (!formData.password || formData.password.length < 6)
      errors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword)
      errors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = 'Passwords do not match';
    if (!formData.phone) errors.phone = 'Phone is required';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const check = await axios.post('http://localhost:5000/api/checkUser', {
        username: formData.username,
        email: formData.email,
      });

      if (check.data.usernameExists) {
        setErrors({ username: 'Username already exists' });
        return;
      }
      if (check.data.emailExists) {
        setErrors({ email: 'Email already exists' });
        return;
      }

      const formToSend = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (key !== 'confirmPassword') formToSend.append(key, val);
      });

      await axios.post('http://localhost:5000/api/signup', formToSend);
      navigate('/homepage');
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="signup-container-modern">
      <h2 className="signup-title">SIGN UP</h2>
      <form onSubmit={handleSubmit}>
        {/* Full name */}
        <div className="signup-input-wrapper">
          <FaUser className="signup-icon" />
          <input
            type="text"
            name="fullname"
            placeholder="Full name"
            value={formData.fullname}
            onChange={handleChange}
          />
        </div>
        {errors.fullname && <div className="field-error">{errors.fullname}</div>}

        {/* Username */}
        <div className="signup-input-wrapper">
          <FaUser className="signup-icon" />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        {errors.username && <div className="field-error">{errors.username}</div>}

        {/* Email */}
        <div className="signup-input-wrapper">
          <FaEnvelope className="signup-icon" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        {errors.email && <div className="field-error">{errors.email}</div>}

        {/* Phone */}
        <div className="signup-input-wrapper">
          <FaPhone className="signup-icon" />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        {errors.phone && <div className="field-error">{errors.phone}</div>}

        {/* Password */}
        <div className="signup-input-wrapper">
          <FaLock className="signup-icon" />
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
        {errors.password && <div className="field-error">{errors.password}</div>}

        {/* Confirm Password */}
        <div className="signup-input-wrapper">
          <FaLock className="signup-icon" />
          <input
            type={showConfirm ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? '🙈' : '👁️'}
          </button>
        </div>
        {errors.confirmPassword && (
          <div className="field-error">{errors.confirmPassword}</div>
        )}

        {/* Avatar */}
        <div className="signup-input-wrapper">
          <FaImage className="signup-icon" />
          <input
            type="file"
            name="avatar"
            onChange={handleChange}
            accept="image/*"
          />
        </div>
        {avatarPreview && (
          <div className="avatar-preview">
            <img src={avatarPreview} alt="Avatar Preview" />
          </div>
        )}

        <button type="submit" className="signup-btn-modern">
          SIGN UP
        </button>
      </form>
    </div>
  );
}

export default Signup;

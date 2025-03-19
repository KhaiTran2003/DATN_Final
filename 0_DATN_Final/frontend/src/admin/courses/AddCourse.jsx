import React, { useState } from 'react';
import NavbarAdmin from '../NavbarAdmin';
import SidebarAdmin from '../SidebarAdmin';
import { useNavigate } from 'react-router-dom';
import '../../css/css_admin/Courses.css';

function AddCourse() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [price, setPrice] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!title || !description || !duration || !teacherId || !price) {
      setMessage('Vui lòng điền đầy đủ thông tin!');
      setMessageType('error');
      return;
    }
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('duration', duration);
    formData.append('teacher_id', teacherId);
    formData.append('price', price);
    if (image) {
      if (!(image instanceof File)) {
        setMessage('Ảnh không hợp lệ!');
        setMessageType('error');
        return;
      }
      formData.append('image', image);
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/add_courses', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Thêm khóa học thất bại!');
      }
  
      setMessage('Thêm khóa học thành công!');
      setMessageType('success');
      setTimeout(() => navigate('/list-course'), 2000);
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    }
  };
  

  return (
    <div className='add-course-container'>
      <button onClick={toggleSidebar}>Thu nhỏ sidebar</button>
      <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <NavbarAdmin />

      {message && (
        <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="add-course-form" encType="multipart/form-data">
        

        <div className="form-group">
          <label htmlFor="title">Tiêu đề:</label>
          <input 
            type="text" 
            id="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Mô tả:</label>
          <textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration">Thời gian (giờ):</label>
          <input 
            type="number" 
            id="duration" 
            value={duration} 
            onChange={(e) => setDuration(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="teacherId">Giảng viên ID:</label>
          <input 
            type="text" 
            id="teacherId" 
            value={teacherId} 
            onChange={(e) => setTeacherId(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Giá (VND):</label>
          <input 
            type="text" 
            id="price" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Ảnh bìa:</label>
          <input 
            type="file" 
            id="image" 
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])} 
          />
        </div>

        <button type="submit" className="submit-btn">Thêm khóa học</button>
      </form>
    </div>
  );
}

export default AddCourse;

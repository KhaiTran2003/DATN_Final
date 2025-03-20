import React, { useState } from 'react';
import NavbarAdmin from '../NavbarAdmin';
import SidebarAdmin from '../SidebarAdmin';
import { useNavigate } from 'react-router-dom';

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
    if (image) formData.append('image', image);

    try {
      const response = await fetch('http://localhost:5000/api/add_courses', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Thêm khóa học thất bại!');

      setMessage('Thêm khóa học thành công!');
      setMessageType('success');
      setTimeout(() => navigate('/list-course'), 2000);
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    }
  };

  return (
    <div className="flex">
      <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <NavbarAdmin/>
      <div className="w-full flex justify-center items-center min-h-screen pt-24 px-6">
        <div className="max-w-4xl w-full bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Thêm khóa học</h2>

          {/* Hiển thị thông báo */}
          {message && (
            <div className={`p-3 mb-4 rounded-md text-center ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Cột ảnh */}
            <div className="flex flex-col items-center">
              <label className="block text-gray-700">Ảnh bìa</label>
              <div className="w-40 h-40 bg-gray-200 border rounded-md flex items-center justify-center overflow-hidden">
                {image ? (
                  <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400">Chưa chọn ảnh</span>
                )}
              </div>
              <input 
                type="file" 
                accept="image/*"
                className="mt-3 text-sm"
                onChange={(e) => setImage(e.target.files[0])} 
              />
            </div>

            {/* Cột thông tin khóa học */}
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block text-gray-700">Tiêu đề</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                  required 
                />
              </div>

              <div>
                <label className="block text-gray-700">Mô tả</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                  required 
                />
              </div>

              <div>
                <label className="block text-gray-700">Thời gian (giờ)</label>
                <input 
                  type="number" 
                  value={duration} 
                  onChange={(e) => setDuration(e.target.value)} 
                  className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                  required 
                />
              </div>

              <div>
                <label className="block text-gray-700">Giảng viên ID</label>
                <input 
                  type="text" 
                  value={teacherId} 
                  onChange={(e) => setTeacherId(e.target.value)} 
                  className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                  required 
                />
              </div>

              <div>
                <label className="block text-gray-700">Giá (VND)</label>
                <input 
                  type="text" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                  required 
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition"
              >
                Thêm khóa học
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddCourse;

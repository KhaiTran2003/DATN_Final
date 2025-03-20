import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../SidebarAdmin';
import NavbarAdmin from '../NavbarAdmin';
import { useParams, useNavigate } from 'react-router-dom';

function EditCourse() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [oldImage, setOldImage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${courseId}`);
        if (!response.ok) {
          throw new Error('Không tìm thấy khóa học');
        }
        const data = await response.json();
        setCourse(data);
        setImagePreview(`http://localhost:5000${data.image}`);
        setOldImage(data.image);
      } catch (err) {
        setError('Có lỗi khi lấy thông tin khóa học.');
      }
    };

    fetchCourseDetail();
  }, [courseId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCourse((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setCourse((prevState) => ({
        ...prevState,
        image: file,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', course.title);
      formData.append('teacher_id', course.teacher_id);
      formData.append('price', course.price);
      formData.append('duration', course.duration);
      formData.append('image', course.image);
      formData.append('oldImage', oldImage);

      const response = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Cập nhật khóa học thất bại');
      }

      navigate('/list-course');
    } catch (err) {
      console.log(err);
      setError('Có lỗi khi cập nhật khóa học.');
    }
  };

  if (error) {
    return <div className="text-red-500 text-center mt-5">{error}</div>;
  }

  if (!course) {
    return <div className="text-center text-gray-500 mt-5">Đang tải thông tin khóa học...</div>;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <NavbarAdmin />
        <div className="flex justify-center items-center h-full p-6 mt-16">
          <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 flex">
            <div className="w-1/3 flex flex-col items-center">
              <img src={imagePreview} alt="Course" className="w-48 h-48 object-cover rounded-md mb-4" />
              <input type="file" id="image" onChange={handleImageChange} className="mt-2" />
            </div>
            <div className="w-2/3 pl-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Chỉnh sửa khóa học</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 font-medium">Tên khóa học:</label>
                  <input type="text" id="title" value={course.title} onChange={handleChange} className="w-full p-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium">ID Giáo viên:</label>
                  <input type="text" id="teacher_id" value={course.teacher_id} onChange={handleChange} className="w-full p-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium">Giá:</label>
                  <input type="text" id="price" value={course.price} onChange={handleChange} className="w-full p-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium">Thời gian học:</label>
                  <input type="number" id="duration" value={course.duration} onChange={handleChange} className="w-full p-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <button onClick={() => navigate('/list-course')} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Quay lại danh sách</button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Hoàn thành</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditCourse;

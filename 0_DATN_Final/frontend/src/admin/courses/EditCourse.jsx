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
    return <div>{error}</div>;
  }

  if (!course) {
    return <div>Đang tải thông tin khóa học...</div>;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="course-detail-container">
      <button onClick={toggleSidebar}>Thu nhỏ sidebar</button>
      <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <NavbarAdmin />

      <form className="course-detail-form">
        <div className="form-group">
          <label htmlFor="title">Tên khóa học:</label>
          <input type="text" id="title" value={course.title} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="teacher_id">ID Giảng viên:</label>
          <input type="text" id="teacher_id" value={course.teacher_id} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="price">Giá:</label>
          <input type="number" id="price" value={course.price} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="duration">Thời lượng (giờ):</label>
          <input type="number" id="duration" value={course.duration} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="image">Hình ảnh:</label>
          <input type="file" id="image" onChange={handleImageChange} />
          {imagePreview && <img src={imagePreview} alt="Course" width="100" />}
        </div>

        <button type="button" onClick={() => navigate('/list-course')} className="back-btn">
          Quay lại danh sách
        </button>
        <button type="button" onClick={handleSubmit} className="submit-btn">
          Hoàn thành
        </button>
      </form>
    </div>
  );
}

export default EditCourse;
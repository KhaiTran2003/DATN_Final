import React, { useState, useEffect } from "react";
import SidebarAdmin from "../SidebarAdmin";
import NavbarAdmin from "../NavbarAdmin";
import { useParams, useNavigate } from "react-router-dom";

function EditLesson() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [oldImage, setOldImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!lessonId) {
      setError("ID bài học không hợp lệ.");
      return;
    }

    const fetchLessonDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/lessons/${lessonId}`);
        if (!response.ok) throw new Error("Không tìm thấy bài học");

        const data = await response.json();
        setLesson(data);
        setOldImage(data.image);
        setImagePreview(data.image ? `http://localhost:5000${data.image}` : null);
      } catch (err) {
        setError("Có lỗi khi lấy thông tin bài học.");
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses`);
        if (!response.ok) throw new Error("Không thể lấy danh sách khóa học");

        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError("Có lỗi khi lấy danh sách khóa học.");
      }
    };

    fetchLessonDetail();
    fetchCourses();
  }, [lessonId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setLesson((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setLesson((prevState) => ({
        ...prevState,
        image: file,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", lesson.title);
      formData.append("description", lesson.description);
      formData.append("duration", lesson.duration);
      formData.append("course_id", lesson.course_id);
      if (oldImage) {
        formData.append("oldImage", oldImage);
      }
      

      if (lesson.image) formData.append("image", lesson.image);

      const response = await fetch(`http://localhost:5000/api/lessons/${lessonId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Cập nhật bài học thất bại");

      navigate("/list-lesson");
    } catch (err) {
      console.error(err);
      setError("Có lỗi khi cập nhật bài học.");
    }
  };

  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!lesson) return <div className="text-center text-gray-500">Đang tải thông tin bài học...</div>;

  return (
    <div className="flex">
      <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex-1 p-6">
        <NavbarAdmin />
        <div className="mt-[100px] max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Chỉnh sửa bài học</h2>
          <form className="space-y-4">
            {/* Tiêu đề */}
            <div>
              <label htmlFor="title" className="block text-gray-600 font-medium">Tiêu đề:</label>
              <input
                type="text"
                id="title"
                value={lesson.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Mô tả */}
            <div>
              <label htmlFor="description" className="block text-gray-600 font-medium">Mô tả:</label>
              <textarea
                id="description"
                value={lesson.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Thời lượng */}
            <div>
              <label htmlFor="duration" className="block text-gray-600 font-medium">Thời lượng (phút):</label>
              <input
                type="number"
                id="duration"
                value={lesson.duration}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Khóa học */}
            <div>
              <label htmlFor="course_id" className="block text-gray-600 font-medium">Khóa học:</label>
              <select
                id="course_id"
                value={lesson.course_id}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {courses.map((course) => (
                  <option key={course.id_course} value={course.id_course}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Ảnh bài học */}
            <div>
              <label htmlFor="image" className="block text-gray-600 font-medium">Ảnh bài học:</label>
              <input type="file" id="image" onChange={handleImageChange} className="block w-full" />
              {imagePreview && <img src={imagePreview} alt="Lesson" className="mt-2 w-32 rounded-md" />}
            </div>

            {/* Nút điều hướng */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate("/list-lesson")}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Quay lại danh sách
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Hoàn thành
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditLesson;

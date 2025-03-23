import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import MyContext from "./Context/context.js";
import Navbar from "./compunents/Navbar";
import Login from "./compunents/Login";
import Signup from "./compunents/Signup";
import Header from "./compunents/Header";
import HomePage from "./pages/Home";
import Courses from "./pages/Courses";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";
import Lesson from "./pages/Lesson";
import AdminDashboard from "./admin/AdminDashboard";
import ListCourses from "./admin/courses/ListCourses";
import ListUser from "./admin/users/ListUser";
import AddUser from "./admin/users/AddUser";
import EditUser from "./admin/users/EditUser";
import UserDetail from "./admin/users/UserDetail.jsx";
import CourseDetail from "./admin/courses/CourseDetail";
import EditCourse from "./admin/courses/EditCourse";
import AddCourse from "./admin/courses/AddCourse";
import ListQuestions from "./admin/questions/ListQuestions";
import ListAnswers from "./admin/answers/ListAnswers";
import ListLesson from "./admin/lessons/ListLesson";
import EditLesson from "./admin/lessons/EditLesson";
import AddLesson from "./admin/lessons/AddLesson";
import TeacherDashboard from "./teacher/TeacherDashboard";
import Result from "./pages/Result.jsx";
import AddQuestion from "./admin/questions/AddQuestion.jsx";
function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const location = useLocation();
  const navigate = useNavigate(); // ✅ Thêm useNavigate()

  // 🔹 Chặn cache khi logout và vô hiệu hóa nút Back
  useEffect(() => {
    const handleBack = () => {
      if (!localStorage.getItem("userId")) {
        navigate("/login"); // Chuyển hướng về login nếu nhấn Back sau khi logout
      }
    };

    window.history.replaceState(null, "", window.location.href);
    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [navigate]);

  // 🔹 Lấy dữ liệu user từ API khi đăng nhập
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      axios
        .get(`http://localhost:5000/api/users/${userId}`)
        .then((response) => {
          setUser(response.data);
          setRole(response.data.role);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy dữ liệu người dùng!", error);
          setUser(null);
          setRole("");
          localStorage.removeItem("userId");
        });
    } else {
      setUser(null);
      setRole("");
    }
  }, []);

  // 🔹 Bảo vệ trang Admin và Teacher
  const ProtectedRoute = ({ allowedRoles }) => {
    return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/login" replace />;
  };

  return (
    <MyContext.Provider value={{ role, setRole }}>
      <div className="App">
        {!(location.pathname.includes("/admin") || location.pathname.includes("/teacher")) && <Navbar />}
        <Routes>
          <Route path="/" element={<Header />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/lesson" element={<Lesson />} />
          <Route path="/result" element={<Result />} />

          {/* 🔹 Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/list-course" element={<ListCourses />} />
            <Route path="/list-user" element={<ListUser />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/user-detail/:userId" element={<UserDetail />} />
            <Route path="/edit-user/:userId" element={<EditUser />} />
            <Route path="/course-detail/:courseId" element={<CourseDetail />} />
            <Route path="/edit-course/:courseId" element={<EditCourse />} />
            <Route path="/add-course" element={<AddCourse />} />
            <Route path="/list-question" element={<ListQuestions />} />
            <Route path="/list-answer" element={<ListAnswers />} />
            <Route path="/list-lesson" element={<ListLesson />} />
            <Route path="/edit-lesson/:lessonId" element={<EditLesson />} />
            <Route path="/add-lesson" element={<AddLesson />} />
            <Route path="/add-question" element={<AddQuestion />} />
          </Route>

          {/* 🔹 Protected Teacher Routes */}
          <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          </Route>
        </Routes>
      </div>
    </MyContext.Provider>
  );
}

export default App;

import './App.css';
import axios from 'axios';
import { useEffect, useState, createContext } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';  // Không cần import BrowserRouter ở đây
import HomePage from './pages/Home';
import React from 'react';
import Navbar from './compunents/Navbar';
import Header from './compunents/Header';
import Courses from './pages/Courses';
import Reviews from './pages/Reviews';
import Login from './compunents/Login';
import Signup from './compunents/Signup';
import Contact from './pages/Contact.jsx';
import AdminDashboard from './admin/AdminDashboard';
import TeacherDashboard from './teacher/TeacherDashboard';  // Import TeacherDashboard
import 'font-awesome/css/font-awesome.min.css';
import ListCourses from './admin/courses/ListCourses.jsx';
import ListUser from './admin/users/ListUser.jsx';
import NavbarAdmin from './admin/NavbarAdmin.jsx';
import NavbarTeacher from './teacher/NavbarTeacher.jsx'
import AddUser from './admin/users/AddUser.jsx'
import UserDetail from './admin/users/UserDetail.jsx';
import EditUser from './admin/users/EditUser.jsx';
import DelUser from './admin/users/DelUser.jsx';
import AddCourse from './admin/courses/AddCourse.jsx';
import MyContext from './Context/context.js';
import CourseDetail from './admin/courses/CourseDetail.jsx';
import EditCourse from './admin/courses/EditCourse.jsx';
import ListQuestions from './admin/questions/ListQuestions.jsx';
import ListAnswers from './admin/answers/ListAnswers.jsx';
import ListLesson from './admin/lessons/ListLesson.jsx'
import Lesson from './pages/Lesson.jsx';
import EditLesson from './admin/lessons/EditLesson.jsx';
function App() {
  
  const [user, setUser] = useState(null);
  const location = useLocation();  // Lấy đường dẫn hiện tại

  const [role, setRole] = useState('');

  useEffect(() => {
    // Gửi request đến backend
    axios.get('http://localhost:5000/api/users')
      .then(response => {
        setUser(response.user);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  return (
    <MyContext.Provider value={{ role, setRole }}>
      <div className='App'>
      {/* Kiểm tra nếu đường dẫn hiện tại không phải là '/admin-dashboard' hoặc '/teacher-dashboard' thì mới hiển thị Navbar */}
      {/* {(location.pathname !== '/signup' && location.pathname !== '/login' && location.pathname !== '/admin-dashboard' 
      && location.pathname !== '/teacher-dashboard') ? <Navbar />: <></>} */}
      {(role === '' || role ==='user') &&  (
          <>
            <Navbar />
            
          </>
        )}
      <Routes>
        {/* xoa role === '' */}
        { (role === 'admin' || role ==='') && (
          <>
            <Route path='/admin-dashboard' element={<AdminDashboard />} />
            <Route path='/list-course' element={<ListCourses />} />
            <Route path='/user-detail/:userId' element={<UserDetail />} />
            <Route path='/edit-user/:userId' element={<EditUser />} />
            <Route path='/list-user' element={<ListUser />} />
            <Route path='/add-user' element={<AddUser />} />
            <Route path='/add-course' element={<AddCourse />} />
            <Route path='/delete-user' element={<DelUser />} />
            <Route path='/course-detail/:courseId' element={<CourseDetail />} />
            <Route path='/edit-course/:courseId' element={<EditCourse />} />
            <Route path='/list-lesson' element={<ListLesson />} />
            <Route path='/list-question' element={<ListQuestions />} />
            <Route path='/list-answer' element={<ListAnswers />} />
            <Route path='/edit-lesson/:lessonId' element={<EditLesson />} />
          </>
        )}

        {role === 'teacher' && (
          <Route path='/teacher-dashboard' element={<TeacherDashboard />} />
        )}

        {role === 'user' && (
          <>
            <Route path='/homepage' element={<HomePage />} />
            <Route path='/courses' element={<Courses />} />
            <Route path='/reviews' element={<Reviews />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/lessons' element={<Lesson />} />
          </>
        )}
        

        {/* Routes dùng chung */}
        <Route path='/' element={<Header />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>

    </div>
    </MyContext.Provider>
    
    
  );
}

export default App;

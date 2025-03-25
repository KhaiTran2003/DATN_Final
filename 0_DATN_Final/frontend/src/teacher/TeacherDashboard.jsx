import React, { useEffect, useState } from "react";
import NavbarTeacher from "./NavbarTeacher";
import SidebarTeacher from "./SidebarTeacher";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from "recharts";

function TeacherDashboard() {
  const [data, setData] = useState({
    users: [],
    courses: [],
    lessons: [],
    questions: [],
    answers: [],
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, coursesRes, lessonsRes, questionsRes, answersRes] = await Promise.all([
          fetch("http://localhost:5000/api/users"),
          fetch("http://localhost:5000/api/courses"),
          fetch("http://localhost:5000/api/lessons"),
          fetch("http://localhost:5000/api/questions"),
          fetch("http://localhost:5000/api/answers"),
        ]);

        if (![usersRes, coursesRes, lessonsRes, questionsRes, answersRes].every(res => res.ok)) {
          throw new Error("Lỗi khi gọi API");
        }

        const [users, courses, lessons, questions, answers] = await Promise.all([
          usersRes.json(), coursesRes.json(), lessonsRes.json(),
          questionsRes.json(), answersRes.json()
        ]);

        setData({ users, courses, lessons, questions, answers });
        setLoading(false);
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu:", err);
        setError("Không thể tải dữ liệu.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center mt-20">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-center text-red-500 mt-20">{error}</div>;

  const statsData = [
    { name: "Học viên", value: data.users.length },
    { name: "Khoá học", value: data.courses.length },
    { name: "Bài học", value: data.lessons.length },
    { name: "Câu hỏi", value: data.questions.length },
    { name: "Đáp án", value: data.answers.length },
  ];

  const pieColors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF"];

  return (
    <div className="flex">
      <SidebarTeacher isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className={`flex-1 min-h-screen bg-gray-100 ${isSidebarOpen ? "ml-[250px]" : "ml-[70px]"} mt-[88px] p-6 transition-all duration-300`}>
        <NavbarTeacher />

        {/* Tổng quan */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {statsData.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-3xl font-bold text-blue-600">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Biểu đồ */}
        <div className="grid grid-cols-2 gap-6">
          {/* Line chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Tăng trưởng nội dung</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={statsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#4F46E5" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Tỷ lệ thành phần</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {statsData.map((_, index) => (
                    <Cell key={index} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Area chart */}
          <div className="col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Xu hướng dữ liệu</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={statsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#10B981" fill="#D1FAE5" />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;

import React, { useEffect, useState } from "react";
import NavbarAdmin from "./NavbarAdmin";
import SidebarAdmin from "./SidebarAdmin";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from "recharts";

function AdminDashboard() {
  const [data, setData] = useState({
    users: [],
    courses: [],
    lessons: [],
    questions: [],
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, coursesRes, lessonsRes, questionsRes] = await Promise.all([
          fetch("http://localhost:5000/api/users"),
          fetch("http://localhost:5000/api/courses"),
          fetch("http://localhost:5000/api/lessons"),
          fetch("http://localhost:5000/api/questions"),
        ]);

        if (!usersRes.ok || !coursesRes.ok || !lessonsRes.ok || !questionsRes.ok) {
          throw new Error("Lỗi khi lấy dữ liệu từ API");
        }

        const usersData = await usersRes.json();
        const coursesData = await coursesRes.json();
        const lessonsData = await lessonsRes.json();
        const questionsData = await questionsRes.json();

        setData({
          users: usersData,
          courses: coursesData,
          lessons: lessonsData,
          questions: questionsData,
        });

        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
        setError("Không thể tải dữ liệu từ máy chủ.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center mt-20">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-center text-red-500 mt-20">{error}</div>;

  const statsData = [
    { name: "Users", value: data.users.length },
    { name: "Courses", value: data.courses.length },
    { name: "Lessons", value: data.lessons.length },
    { name: "Questions", value: data.questions.length },
  ];

  const pieColors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex">
      <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} />

      <div
        className={`flex-1 min-h-screen bg-gray-100 ${isSidebarOpen ? "ml-[250px]" : "ml-[70px]"} mt-[88px] p-6 transition-all duration-300`}
      >
        <NavbarAdmin />

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statsData.map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-5 rounded-xl shadow-md hover:scale-[1.03] transition transform duration-300"
            >
              <h3 className="text-lg font-semibold mb-1 tracking-wide">{item.name}</h3>
              <p className="text-3xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Line Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Biểu đồ hoạt động</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={statsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#007bff" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Tỷ lệ phân bổ</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statsData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {statsData.map((_, index) => (
                    <Cell key={index} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Area Chart */}
          <div className="col-span-1 lg:col-span-2 bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Biểu đồ xu hướng</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={statsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="#8884d8" />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
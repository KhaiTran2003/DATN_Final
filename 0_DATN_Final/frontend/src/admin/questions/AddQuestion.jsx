import React, { useEffect, useState } from 'react';
import NavbarAdmin from '../NavbarAdmin';
import SidebarAdmin from '../SidebarAdmin';
import { useNavigate } from 'react-router-dom';

function AddQuestion() {
  const [lessons, setLessons] = useState([]);
  const [lessonId, setLessonId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/lessons')
      .then((res) => res.json())
      .then((data) => setLessons(data));
  }, []);

  const handleLessonSelect = async (id) => {
    setLessonId(id);

    const questionsRes = await fetch(`http://localhost:5000/api/questions/${id}`);
    const questionsData = await questionsRes.json();
    setQuestions(questionsData);

    const answersRes = await fetch(`http://localhost:5000/api/answers/by-lesson/${id}`);
    const answersData = await answersRes.json();

    const grouped = {};
    for (let ans of answersData) {
      if (!grouped[ans.question_id]) grouped[ans.question_id] = [];
      grouped[ans.question_id].push(ans);
    }
    setAnswers(grouped);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleAnswerChange = (qId, ansIndex, field, value) => {
    const updated = { ...answers };
    updated[qId][ansIndex][field] = value;
    setAnswers(updated);
  };

  const addAnswer = (qId) => {
    const updated = { ...answers };
    if (!updated[qId]) updated[qId] = [];
    updated[qId].push({ content: '', is_correct: 0 });
    setAnswers(updated);
  };

  const handleCorrectSelect = (qId, ansIndex) => {
    const updated = { ...answers };
    updated[qId] = updated[qId].map((a, i) => ({
      ...a,
      is_correct: i === ansIndex ? 1 : 0,
    }));
    setAnswers(updated);
  };

  const handleAddQuestion = () => {
    const newQ = { content: '', type: '', url: '', id_question: Date.now() };
    setQuestions([...questions, newQ]);
    setAnswers({ ...answers, [newQ.id_question]: [] });
  };

  const handleSubmit = async () => {
    const payload = {
      lesson_id: lessonId,
      questions: questions.map(q => ({
        ...q,
        answers: answers[q.id_question] || []
      })),
    };

    try {
      const res = await fetch('http://localhost:5000/api/questions/bulk-advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Lưu thất bại');

      setMessage('Thêm câu hỏi thành công!');
      setMessageType('success');

      setTimeout(() => {
        navigate('/list-question');
      }, 1500);
    } catch (err) {
      setMessage(err.message);
      setMessageType('error');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex-1 flex flex-col">
        <NavbarAdmin />

        <div className="p-6 max-w-5xl w-full mx-auto mt-24">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Thêm / Cập nhật câu hỏi & đáp án</h2>

          {message && (
            <div className={`p-4 mb-6 rounded-lg font-medium text-center ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          <select
            onChange={(e) => handleLessonSelect(e.target.value)}
            className="mb-6 px-4 py-2 border border-gray-300 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">-- Chọn bài học --</option>
            {lessons.map((lesson) => (
              <option key={lesson.id_lesson} value={lesson.id_lesson}>{lesson.title}</option>
            ))}
          </select>

          {questions.map((q, qIndex) => (
            <div key={q.id_question} className="border border-blue-300 bg-white p-6 mb-6 rounded-2xl shadow">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nội dung câu hỏi"
                  value={q.content}
                  onChange={(e) => handleQuestionChange(qIndex, 'content', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />

                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Loại (text/audio)"
                    value={q.type}
                    onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <input
                    type="text"
                    placeholder="URL audio (nếu có)"
                    value={q.url}
                    onChange={(e) => handleQuestionChange(qIndex, 'url', e.target.value)}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                <h4 className="font-semibold text-blue-600">Đáp án:</h4>
                {(answers[q.id_question] || []).map((ans, aIndex) => (
                  <div key={aIndex} className="flex items-center gap-3 mb-3">
                    <input
                      type="radio"
                      name={`correct-${q.id_question}`}
                      checked={ans.is_correct === 1}
                      onChange={() => handleCorrectSelect(q.id_question, aIndex)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={ans.content}
                      onChange={(e) => handleAnswerChange(q.id_question, aIndex, 'content', e.target.value)}
                      placeholder="Nội dung đáp án"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    {ans.is_correct === 1 && (
                      <span className="text-green-600 text-xs font-medium ml-1">✔ Đáp án đúng</span>
                    )}
                  </div>
                ))}

                <button
                  onClick={() => addAnswer(q.id_question)}
                  className="text-sm text-blue-600 hover:underline mt-2"
                >
                  + Thêm đáp án
                </button>
              </div>
            </div>
          ))}

          <div className="mt-8 flex justify-between">
            <button
              onClick={handleAddQuestion}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-md font-medium transition"
            >
              + Thêm câu hỏi
            </button>

            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold shadow-md transition"
            >
              💾 Lưu tất cả
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddQuestion;

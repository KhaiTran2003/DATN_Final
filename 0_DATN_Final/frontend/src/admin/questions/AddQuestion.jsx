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
        <div className="p-6 max-w-5xl w-full mx-auto mt-20">
          <h2 className="text-2xl font-bold mb-4">Thêm / Cập nhật câu hỏi & đáp án</h2>

          {message && (
            <div className={`p-3 mb-4 rounded text-center ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          <select onChange={(e) => handleLessonSelect(e.target.value)} className="mb-4 p-2 border rounded">
            <option value="">-- Chọn bài học --</option>
            {lessons.map((lesson) => (
              <option key={lesson.id_lesson} value={lesson.id_lesson}>{lesson.title}</option>
            ))}
          </select>

          {questions.map((q, qIndex) => (
            <div key={q.id_question} className="border p-4 mb-4 shadow rounded bg-white">
              <input
                type="text"
                placeholder="Nội dung câu hỏi"
                value={q.content}
                onChange={(e) => handleQuestionChange(qIndex, 'content', e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />

              <input
                type="text"
                placeholder="Loại (text/audio)"
                value={q.type}
                onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />

              <input
                type="text"
                placeholder="URL audio (nếu có)"
                value={q.url}
                onChange={(e) => handleQuestionChange(qIndex, 'url', e.target.value)}
                className="w-full mb-4 p-2 border rounded"
              />

              <h4 className="font-semibold mb-2">Đáp án:</h4>
              {(answers[q.id_question] || []).map((ans, aIndex) => (
                <div key={aIndex} className="flex items-center mb-2 gap-2">
                  <input
                    type="radio"
                    name={`correct-${q.id_question}`}
                    checked={ans.is_correct === 1}
                    onChange={() => handleCorrectSelect(q.id_question, aIndex)}
                  />
                  <input
                    type="text"
                    value={ans.content}
                    onChange={(e) => handleAnswerChange(q.id_question, aIndex, 'content', e.target.value)}
                    placeholder="Nội dung đáp án"
                    className="flex-1 p-2 border rounded"
                  />
                </div>
              ))}

              <button
                onClick={() => addAnswer(q.id_question)}
                className="text-sm text-blue-600 hover:underline"
              >
                + Thêm đáp án
              </button>
            </div>
          ))}

          <div className="mt-6 flex gap-4">
            <button onClick={handleAddQuestion} className="bg-gray-300 px-4 py-2 rounded">+ Thêm câu hỏi</button>
            <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Lưu tất cả</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddQuestion;

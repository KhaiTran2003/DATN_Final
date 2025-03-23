import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    questions = [],
    answers = [],
    selectedAnswers = {},
    courseId,
    currentLessonId,
    nextLessonId // <-- nhận nextLessonId từ Lesson
  } = location.state || {};

  const isCorrect = (questionId, answerId) => {
    const correct = answers.find(
      (a) => a.question_id === questionId && a.is_correct === 1
    );
    return correct?.id_answer === answerId;
  };

  const correctCount = Object.entries(selectedAnswers).filter(
    ([questionId, ansObj]) => isCorrect(parseInt(questionId), ansObj.id_answer)
  ).length;

  const handleNextLesson = () => {
    if (!nextLessonId) {
      alert('Không tìm thấy bài học tiếp theo.');
      return;
    }
    navigate(`/lesson?id=${nextLessonId}`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: 800, margin: 'auto' }}>
      <h2>Kết Quả Bài Làm</h2>
      <p><strong>Điểm số:</strong> {correctCount} / {questions.length}</p>

      {questions.map((q) => {
        const userAnswer = selectedAnswers[q.id];
        const correctAnswer = answers.find(
          (a) => a.question_id === q.id && a.is_correct === 1
        );

        return (
          <div key={q.id} style={{
            marginBottom: '30px',
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '8px',
          }}>
            <h4>{q.content}</h4>

            <p><strong>Đáp án của bạn:</strong> {userAnswer?.content || 'Chưa chọn'} {' '}
              {userAnswer && (
                isCorrect(q.id, userAnswer.id_answer) ?
                  <span style={{ color: 'green' }}> (Đúng)</span> :
                  <span style={{ color: 'red' }}> (Sai)</span>
              )}
            </p>

            {!isCorrect(q.id, userAnswer?.id_answer) && (
              <p><strong>Đáp án đúng:</strong> {correctAnswer?.content}</p>
            )}
          </div>
        );
      })}

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Quay về trang chính
        </button>

        <button
          onClick={handleNextLesson}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Học bài tiếp theo
        </button>
      </div>
    </div>
  );
}

export default Result;
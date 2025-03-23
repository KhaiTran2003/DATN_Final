import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function Lesson() {
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get('id');
  const navigate = useNavigate();

  const [lessonInfo, setLessonInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!lessonId) return;

    const fetchLesson = async () => {
      const res = await fetch(`http://localhost:5000/api/lesson/${lessonId}`);
      const data = await res.json();

      setLessonInfo({
        title: data[0]?.title,
        description: data[0]?.description,
        duration: data[0]?.duration,
        course_id: data[0]?.course_id
      });

      const uniqueQuestions = [];
      const seenIds = new Set();
      for (const row of data) {
        if (!seenIds.has(row.id_question)) {
          seenIds.add(row.id_question);
          uniqueQuestions.push({
            id: row.id_question,
            content: row.content,
            type: row.type,
            url: row.url,
          });
        }
      }

      setQuestions(uniqueQuestions);
      setTimeLeft((data[0]?.duration || 5) * 60);
    };

    const fetchAnswers = async () => {
      const res = await fetch(`http://localhost:5000/api/answers/${lessonId}`);
      const data = await res.json();
      setAnswers(data);
    };

    fetchLesson();
    fetchAnswers();
  }, [lessonId]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (Object.keys(selectedAnswers).length > 0) {
        submitResult();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const submitResult = () => {
    navigate('/result', {
      state: {
        questions,
        answers,
        selectedAnswers,
        courseId: lessonInfo?.course_id,
        currentLessonId: parseInt(lessonId),
        nextLessonId: parseInt(lessonId) + 1 // <-- tính bài học tiếp theo bằng id + 1
      }
    });
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const isCorrect = (questionId, answerId) => {
    const correct = answers.find(
      a => a.question_id === questionId && a.is_correct === 1
    );
    return correct?.id_answer === answerId;
  };

  const currentQuestion = questions[currentIndex];
  const currentAnswers = answers.filter(a => a.question_id === currentQuestion?.id);
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div style={{ padding: '20px', maxWidth: 800, margin: 'auto' }}>
      {lessonInfo && (
        <>
          <h2>{lessonInfo.title}</h2>
          <p>{lessonInfo.description}</p>
          <p><strong>Thời gian còn lại:</strong> {formatTime(timeLeft)}</p>
        </>
      )}

      <div style={{ height: '10px', background: '#ddd', borderRadius: '5px', margin: '20px 0' }}>
        <div style={{
          width: `${progressPercent}%`,
          height: '100%',
          background: '#00b300',
          borderRadius: '5px',
          transition: 'width 0.3s'
        }} />
      </div>

      {currentQuestion && (
        <div style={{
          marginBottom: '30px',
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}>
          <h4>{currentQuestion.content}</h4>
          {currentQuestion.url && (
            <audio controls src={currentQuestion.url} style={{ margin: '10px 0' }} />
          )}

          {currentAnswers.map(ans => (
            <button
              key={ans.id_answer}
              onClick={() => handleAnswerSelect(currentQuestion.id, ans)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '10px',
                marginTop: '8px',
                borderRadius: '6px',
                border: selectedAnswers[currentQuestion.id]?.id_answer === ans.id_answer
                  ? isCorrect(currentQuestion.id, ans.id_answer)
                    ? '2px solid green'
                    : '2px solid red'
                  : '1px solid #ccc',
                backgroundColor:
                  selectedAnswers[currentQuestion.id]?.id_answer === ans.id_answer
                    ? isCorrect(currentQuestion.id, ans.id_answer)
                      ? '#e6ffe6'
                      : '#ffe6e6'
                    : '#f9f9f9',
              }}
            >
              {ans.content}
            </button>
          ))}

          {selectedAnswers[currentQuestion.id] && (
            currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => prev + 1)}
                style={{
                  marginTop: '20px',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  float: 'right'
                }}
              >
                Continue
              </button>
            ) : (
              <button
                onClick={submitResult}
                style={{
                  marginTop: '20px',
                  backgroundColor: '#28a745',
                  color: '#fff',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  float: 'right'
                }}
              >
                Nộp bài
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Lesson;
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';

function Lesson() {
  const [searchParams] = useSearchParams();
  const [questions,setQuestions] = useState([])
  const lessonId = searchParams.get('id');
  useEffect(()=>{
    console.log(lessonId)
    if (!lessonId) return; // đảm bảo courseId tồn tại
  
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/lesson/${lessonId}`);
        if (!res.ok) throw new Error('Lỗi khi lấy dữ liệu từ server');
        const data = await res.json();
        setQuestions(data);
        console.log(data);
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu bài học:', err);
      }
    };
  
    fetchQuestion();
  }, [lessonId]);
  return (
    <div>Lesson</div>
  )
}

export default Lesson
// services/answerService.js (ví dụ đặt tên như vậy)
const db = require('../db'); // Import db.js để sử dụng kết nối MySQL

const getAnswerByLessonId = (lessonId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT a.*, q.id_question 
      FROM answers a 
      JOIN questions q ON a.question_id = q.id_question 
      WHERE q.lesson_id = ?
    `;

    db.query(query, [lessonId], (err, results) => {
      if (err) {
        reject(err); // Sửa ở đây: reject thay vì dùng res.json
      } else {
        resolve(results); // Trả kết quả đúng cách
      }
    });
  });
};

module.exports = { getAnswerByLessonId };

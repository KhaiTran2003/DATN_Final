const db = require('../db'); // Import db.js để sử dụng kết nối MySQL
const getQuestionByLessonId = (lessonId) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT q.*, l.* FROM questions q join lesson l on q.lesson_id = l.id_lesson WHERE l.id_lesson = ?`, [lessonId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };




module.exports = {getQuestionByLessonId, }
const db = require('../db'); // Import db.js để sử dụng kết nối MySQL

const getLessonByCourseId = (courseId) => {
    
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM lesson WHERE course_id = ?`, [courseId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };

const getNextLessonByCourse = (courseId, currentLessonId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM lesson
      WHERE course_id = ? AND id_lesson > ?
      ORDER BY id_lesson ASC
      LIMIT 1
    `;
    db.query(query, [courseId, currentLessonId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0] || null); // nếu không có thì trả về null
      }
    });
  });
};


module.exports = {getLessonByCourseId,getNextLessonByCourse }
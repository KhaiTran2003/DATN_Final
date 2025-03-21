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




module.exports = {getLessonByCourseId, }
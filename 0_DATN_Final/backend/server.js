const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer'); // Import multer để xử lý file uploads
const db = require('./db'); // Import db.js để sử dụng kết nối MySQL
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const contactRoutes = require('./contact');
const {getAnswerByLessonId} = require("./api/answer_api")
const {getLessonByCourseId, getNextLessonByCourse} = require("./api/lessson_api" )
const {getQuestionByLessonId, } = require("./api/question_api" )

app.use("/api", contactRoutes);
app.use(cors());
app.use(bodyParser.json()); // Giúp Express xử lý dữ liệu JSON từ request body
// Tắt cache trên các trang sau khi logout
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

const formatFile = (fileName)=>{
  const parts = fileName.split('.');
  const nameOnly = parts.slice(0, -1).join('.');
  const extension = parts[parts.length - 1];

  // Loại bỏ toàn bộ ký tự không phải chữ cái trong phần tên file
  const formattedName = nameOnly.replace(/[^a-zA-Z]/g, '');

  // Ghép lại tên file với extension
  const formattedFileName = formattedName + '.' + extension;
  return formattedFileName;
}
// Thiết lập multer để xử lý file avatar (lưu vào thư mục 'uploads')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/images'); // Lưu file vào thư mục 'uploads'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + formatFile(file.originalname)); // Đặt tên file theo thời gian để tránh trùng lặp
  }
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));


// API POST để kiểm tra username và email đã tồn tại chưa
app.post('/api/checkUser', (req, res) => {
  const { username, email } = req.body;

  // Kiểm tra sự tồn tại của username trong cơ sở dữ liệu
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Lỗi khi truy vấn dữ liệu:', err);
      return res.status(500).json({ message: 'Lỗi khi kiểm tra username' });
    }

    if (results.length > 0) {
      // Nếu đã tồn tại username
      return res.json({ usernameExists: true, emailExists: false });
    }

    // Kiểm tra sự tồn tại của email trong cơ sở dữ liệu
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.error('Lỗi khi truy vấn dữ liệu:', err);
        return res.status(500).json({ message: 'Lỗi khi kiểm tra email' });
      }

      if (results.length > 0) {
        // Nếu đã tồn tại email
        return res.json({ usernameExists: false, emailExists: true });
      }

      // Nếu cả username và email đều không tồn tại
      res.json({ usernameExists: false, emailExists: false });
    });
  });
});

// API POST để đăng ký người dùng
app.post('/api/signup', upload.single('avatar'), (req, res) => {
  const { fullname, username, password, email, phone, is_active } = req.body;
  const avatar = req.file ? req.file.path : ''; // Nếu có avatar, lưu đường dẫn, nếu không để trống
  const activeStatus = is_active || true; // Mặc định là true

  // Kiểm tra xem tất cả các trường có hợp lệ không
  if (!fullname || !username || !password || !email || !phone) {
    return res.status(400).json({ message: 'Tất cả các trường đều là bắt buộc' });
  }

  // Truy vấn để chèn dữ liệu vào bảng users
  const query = 'INSERT INTO users (fullname, username, password, email, phone, avatar, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [fullname, username, password, email, phone, avatar, activeStatus], (err, results) => {
    if (err) {
      console.error('Lỗi khi lưu dữ liệu:', err);
      return res.status(500).json({ message: 'Lỗi khi lưu dữ liệu' });
    }
    res.status(200).json({ message: 'Đăng ký thành công!' });
  });
});

//user-detail
const baseUrl = "http://localhost:5000";

app.get("/api/users/:id", (req, res) => {
  const userId = req.params.id;

  const sql = `
    SELECT u.*, r.name AS role
    FROM users u
    LEFT JOIN user_role ur ON u.id_user = ur.id_user
    LEFT JOIN role r ON ur.id_role = r.id_role
    WHERE u.id_user = ?

  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn dữ liệu:", err);
      return res.status(500).json({ message: "Lỗi khi lấy dữ liệu", error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    let user = results[0];

    // Sửa đường dẫn avatar để có URL đầy đủ
    if (user.avatar) {
      user.avatar = `${baseUrl}${user.avatar}`;
    }

    res.json(user);
  });
});

//delete user
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE id_user = ?", [id], (err, result) => {
    if (err) {
      console.error("Lỗi server:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json({ message: "Xóa thành công!" });
  });
});

app.put('/api/users/:userId', upload.single('avatar'), (req, res) => {
  const userId = parseInt(req.params.userId);
  const { fullname, username, email, phone, isActive, oldAvatar, role } = req.body;
  const avatar = req.file ? `/uploads/images/${req.file.filename.replace(/\s+/g, "")}` : null;

  // Xóa ảnh cũ nếu có ảnh mới
  if (req.file && oldAvatar) {
    const filePath = path.join(__dirname, oldAvatar);
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
      else console.log('Old avatar deleted successfully');
    });
  }

  // Cập nhật thông tin người dùng
  let query = `UPDATE users SET fullname = ?, username = ?, email = ?, phone = ?, is_active = ?`;
  const queryParams = [fullname, username, email, phone, isActive === 'Hoạt động' ? 1 : 0];

  if (avatar) {
    query += ', avatar = ?';
    queryParams.push(avatar);
  }

  query += ' WHERE id_user = ?';
  queryParams.push(userId);

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.affectedRows === 0) {
      return res.status(404).send('User not found');
    }

    // Tiếp theo: xử lý cập nhật role
    const teacherRoleId = 2;
    const userRoleId = 3;
    const roleId = role === 'teacher' ? teacherRoleId : userRoleId;

    // Kiểm tra xem user đã có role chưa
    db.query('SELECT * FROM user_role WHERE id_user = ?', [userId], (err, roleCheck) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error checking user role');
      }

      const queryRole = roleCheck.length > 0
        ? 'UPDATE user_role SET id_role = ? WHERE id_user = ?'
        : 'INSERT INTO user_role (id_user, id_role) VALUES (?, ?)';

      const paramsRole = roleCheck.length > 0
        ? [roleId, userId]
        : [userId, roleId]; // INSERT cần thứ tự khác

      db.query(queryRole, paramsRole, (err, roleResult) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error saving user role');
        }

        return res.status(200).json({
          message: 'User updated successfully',
          user: {
            id_user: userId,
            fullname,
            username,
            email,
            phone,
            avatar,
            isActive,
            role
          }
        });
      });
    });
  });
});




// API GET để lấy dữ liệu các khóa học (mã hiện tại của bạn)
app.get('/api/courses', (req, res) => {
  db.query('SELECT * FROM courses', (err, results) => {
    if (err) {
      console.error('Lỗi khi truy vấn dữ liệu:', err);
      return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu' });
    }
    res.json(results);
  });
});

app.delete('/api/courses/:id', (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM courses WHERE id_course = ?", [id], (err, result) => {
    if (err) {
      console.error("Lỗi server:", err);
      return res.status(500).json({ message: "Lỗi server khi xóa khóa học" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy khóa học" });
    }

    res.json({ message: "Xóa khóa học thành công!" });
  });
});


app.post('/api/add_courses', upload.single('image'), (req, res) => {
  const { title, description, duration, teacher_id, price } = req.body;
  const image = req.file ? req.file.path : ''; // Lưu đường dẫn ảnh nếu có

  // Kiểm tra dữ liệu đầu vào
  if ( !title || !description || !duration || !teacher_id || !price) {
    return res.status(400).json({ message: 'Tất cả các trường đều là bắt buộc' });
  }

  // Truy vấn chèn dữ liệu vào bảng courses
  const query = 'INSERT INTO courses ( title, image, description, duration, teacher_id, price) VALUES ( ?, ?, ?, ?, ?, ?)';
  db.query(query, [ title, image, description, duration, teacher_id, price], (err, results) => {
    if (err) {
      console.error('Lỗi khi thêm khóa học:', err);
      return res.status(500).json({ message: 'Lỗi khi thêm khóa học' });
    }
    res.status(200).json({ message: 'Thêm khóa học thành công!', courseId: results.insertId });
  });
});

app.delete('/api/courses/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM courses WHERE id_course = ?', [id], (err, result) => {
    if (err) {
      console.error("Lỗi khi xóa khóa học:", err);
      res.status(500).json({ message: 'Lỗi server khi xóa khóa học' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Không tìm thấy khóa học để xóa' });
    } else {
      res.json({ message: 'Xóa khóa học thành công' });
    }
  });
});


app.get('/api/courses/:courseId', (req, res) => {
  const { courseId } = req.params;
  
  // Truy vấn database để lấy khóa học với courseId
  db.query('SELECT * FROM courses WHERE id_course = ?', [courseId], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Server error' });
    } else if (result.length === 0) {
      res.status(404).json({ message: 'Không tìm thấy khóa học' });
    } else {
      res.json(result[0]); // Trả về thông tin khóa học
    }
  });
});

app.put('/api/courses/:courseId', upload.single('image'), (req, res) => {
  const courseId = parseInt(req.params.courseId);
  if (isNaN(courseId)) {
    return res.status(400).json({ message: 'ID khóa học không hợp lệ' });
  }

  const { title, teacher_id, price, duration, description, oldImage } = req.body;
  const image = req.file ? `/uploads/images/${req.file.filename.replace(/\s+/g, '')}` : null;

  // Đảm bảo oldImage có đường dẫn đầy đủ
  const oldImagePath = oldImage ? path.join(__dirname, '../uploads/images', path.basename(oldImage)) : null;

  // Xóa ảnh cũ nếu có và tồn tại
  if (oldImagePath && fs.existsSync(oldImagePath)) {
    fs.unlink(oldImagePath, (err) => {
      if (err) {
        console.error('Lỗi khi xóa ảnh cũ:', err);
        return res.status(500).json({ message: 'Lỗi khi xóa ảnh cũ' });
      }
      console.log('Ảnh cũ đã bị xóa');
    });
  }

  // Cập nhật thông tin khóa học trong cơ sở dữ liệu
  let query = `UPDATE courses SET title = ?, teacher_id = ?, price = ?, duration = ?, description = ?`;
  const queryParams = [title, teacher_id, price, duration, description];

  if (image) {
    query += ', image = ?';
    queryParams.push(image);
  }

  query += ' WHERE id_course = ?';
  queryParams.push(courseId);

  db.query(query, queryParams, (err, result) => {
    if (err) {
      console.error('Lỗi khi cập nhật khóa học:', err);
      return res.status(500).json({ message: 'Lỗi khi cập nhật dữ liệu' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Khóa học không tồn tại' });
    }

    res.json({ message: 'Cập nhật khóa học thành công', course: { id_course: courseId, title, teacher_id, price, duration, description, image } });
  });
});


// API GET để lấy dữ liệu các bài học (mã hiện tại của bạn)
app.get('/api/lessons', (req, res) => {
  db.query('SELECT ls.*, c.title as course_title, t.fullname '+
    'FROM lesson ls join courses c on ls.course_id = c.id_course join users t on c.teacher_id = t.id_user', (err, results) => {
    if (err) {
      console.error('Lỗi khi truy vấn dữ liệu:', err);
      return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu' });
    }
    res.json(results);
  });
});

//lesson detail
app.get('/api/lessons/:id', (req, res) => {
  const { id } = req.params;
  // Query database để lấy người dùng với userId
  // Trả về thông tin người dùng
  db.query('SELECT * FROM lesson WHERE id_lesson = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Server error' });
    } else if (result.length === 0) {
      res.status(404).json({ message: 'Không tìm thấy lesson' });
    } else {
      res.json(result[0]); // Trả về người dùng
    }
  });
});
// Edit lesson - Không cần course_title
app.put('/api/lessons/:lessonId', upload.single('image'), (req, res) => {
  const lessonId = parseInt(req.params.lessonId);
  const { title, description, duration, course_id, oldImage } = req.body;
  const image = req.file ? `/uploads/images/${req.file.filename.replace(/\s+/g, "")}` : null;

  // Kiểm tra course_id có hợp lệ không
  const courseQuery = `SELECT id_course FROM courses WHERE id_course = ?`;
  db.query(courseQuery, [course_id], (courseErr, courseResults) => {
    if (courseErr || courseResults.length === 0) {
      return res.status(400).json({ error: "Course không hợp lệ" });
    }

    // Xóa ảnh cũ nếu có ảnh mới và oldImage tồn tại
    if (image && oldImage && oldImage.startsWith('/uploads/images/')) {
      const filePath = path.join(__dirname, oldImage);

      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) console.error('⚠️ Lỗi khi xóa ảnh cũ:', unlinkErr);
            else console.log('🗑️ Ảnh cũ đã được xóa:', filePath);
          });
        }
      });
    }

    // UPDATE query
    let query = `UPDATE lesson SET title = ?, description = ?, duration = ?, course_id = ?`;
    const queryParams = [title, description, duration, course_id];

    if (image) {
      query += `, image = ?`;
      queryParams.push(image);
    }

    query += ` WHERE id_lesson = ?`;
    queryParams.push(lessonId);

    db.query(query, queryParams, (err, results) => {
      if (err) {
        console.error('❌ Lỗi SQL:', err.sqlMessage || err);
        return res.status(500).json({ error: 'Lỗi máy chủ khi cập nhật bài học' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Không tìm thấy bài học' });
      }

      return res.status(200).json({
        message: 'Cập nhật bài học thành công!',
        lesson: {
          id_lesson: lessonId,
          title,
          description,
          duration,
          image,
          course_id,
        }
      });
    });
  });
});




// API GET để lấy dữ liệu các câu hỏi(mã hiện tại của bạn)
app.get('/api/questions', (req, res) => {
  db.query('SELECT * FROM questions', (err, results) => {
    if (err) {
      console.error('Lỗi khi truy vấn dữ liệu:', err);
      return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu' });
    }
    res.json(results);
  });
});

// API GET để lấy dữ liệu các reviews(mã hiện tại của bạn)
app.get('/api/reviews', (req, res) => {
  db.query('SELECT * FROM reviews', (err, results) => {
    if (err) {
      console.error('Lỗi khi truy vấn dữ liệu:', err);
      return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu' });
    }
    res.json(results);
  });
});

app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Lỗi khi truy vấn dữ liệu:', err);
      return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu', error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Không có người dùng nào' });
    }
    res.json(results);
  });
});

// API GET để lấy dữ liệu các answers(mã hiện tại của bạn)
app.get('/api/answers', (req, res) => {
  db.query('SELECT * FROM answers', (err, results) => {
    if (err) {
      console.error('Lỗi khi truy vấn dữ liệu:', err);
      return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu' });
    }
    res.json(results);
  });
});

// API GET để lấy dữ liệu các progress(mã hiện tại của bạn)
app.get('/api/progress', (req, res) => {
  db.query('SELECT * FROM progress', (err, results) => {
    if (err) {
      console.error('Lỗi khi truy vấn dữ liệu:', err);
      return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu' });
    }
    res.json(results);
  });
});
app.post('/api/login', (req, res) => {
  const { usernameOrEmail, password } = req.body;

  // Kiểm tra username hoặc email
  const query = 'SELECT id_user, username, password FROM users WHERE username = ? OR email = ?';
  db.query(query, [usernameOrEmail, usernameOrEmail], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Lỗi truy vấn database' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Tài khoản không tồn tại' });
    }

    const user = results[0];

    // 🔹 Tạm thời kiểm tra mật khẩu trực tiếp
    if (password !== user.password) {
      return res.status(401).json({ message: 'Mật khẩu không đúng' });
    }

    // Truy vấn lấy danh sách role của user từ bảng user_role
    const roleQuery = `
      SELECT r.name FROM role r
      INNER JOIN user_role ur ON r.id_role = ur.id_role
      WHERE ur.id_user = ?`;

    db.query(roleQuery, [user.id_user], (err, roles) => {
      if (err) {
        return res.status(500).json({ message: 'Lỗi truy vấn role' });
      }

      // Chuyển danh sách role thành mảng
      const roleNames = roles.map(role => role.name);

      res.status(200).json({
        message: 'Đăng nhập thành công!',
        userId: user.id_user,
        username: user.username,
        roles: roleNames, // Trả về danh sách role dạng mảng
      });
    });
  });
});





// API GET đơn giản cho trang chủ
app.get('/', (req, res) => {
  return res.send("hello world");
});

//////// route fro lesson
app.get('/api/courses/:courseId/lessons', async (req,res) =>{
  const courseId = parseInt(req.params.courseId);
  const results =await  getLessonByCourseId(courseId)
  return res.json(results)
})

// API thêm bài học
// API thêm bài học
app.post('/api/add_lessons', upload.single('image'), (req, res) => {
  const { title, description, duration, course_id } = req.body;
  const image = req.file ? `/uploads/images/${req.file.filename}` : null;

  // Kiểm tra dữ liệu
  if (!title || !description || !duration || !course_id) {
    return res.status(400).json({ message: 'Tất cả các trường đều là bắt buộc' });
  }

  const query = `INSERT INTO lesson (title, description, duration, image, course_id) VALUES (?, ?, ?, ?, ?)`;
  db.query(query, [title, description, duration, image, course_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Lỗi khi thêm bài học', error: err.sqlMessage });
    }
  
    res.status(200).json({
      message: 'Thêm bài học thành công!',
      lessonId: results.insertId
    });
  });
  
});

//////// route for questions
app.get('/api/lesson/:lessonId', async (req,res) =>{
  const lesson_id = parseInt(req.params.lessonId);
  const results =await  getQuestionByLessonId(lesson_id)
  return res.json(results)
})

app.get('/api/answers/:lessonId', async (req, res) => {
  const lessonId = parseInt(req.params.lessonId);

  try {
    const results = await getAnswerByLessonId(lessonId);
    res.json(results);
  } catch (err) {
    console.error('Lỗi khi lấy answers:', err);
    res.status(500).json({ error: 'Lỗi truy vấn answers từ server' });
  }
});

app.get('/api/lessons/next', async (req, res) => {
  const courseId = parseInt(req.query.courseId);
  const currentLessonId = parseInt(req.query.currentLessonId);

  if (!courseId || !currentLessonId) {
    return res.status(400).json({ error: 'Thiếu courseId hoặc currentLessonId' });
  }

  try {
    const nextLesson = await getNextLessonByCourse(courseId, currentLessonId);
    if (nextLesson) {
      res.json(nextLesson); // { id_lesson: ..., title: ..., ... }
    } else {
      res.json({}); // không còn bài học
    }
  } catch (err) {
    console.error('Lỗi lấy bài học tiếp theo:', err);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});

// Xóa bài học theo ID
app.delete('/api/lessons/:lessonId', (req, res) => {
  const lessonId = parseInt(req.params.lessonId);

  if (isNaN(lessonId)) {
    return res.status(400).json({ message: 'ID bài học không hợp lệ' });
  }

  const query = 'DELETE FROM lesson WHERE id_lesson = ?';
  db.query(query, [lessonId], (err, result) => {
    if (err) {
      console.error('Lỗi khi xóa bài học:', err);
      return res.status(500).json({ message: 'Lỗi server khi xóa bài học' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bài học để xóa' });
    }

    res.json({ message: 'Xóa bài học thành công!' });
  });
});
// Lấy tất cả câu hỏi theo lesson_id
app.get('/api/questions/:lessonId', (req, res) => {
  const lessonId = req.params.lessonId;
  db.query('SELECT * FROM questions WHERE lesson_id = ?', [lessonId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi khi lấy câu hỏi' });
    res.json(results);
  });
});

app.post('/api/questions/bulk-advanced', async (req, res) => {
  const { questions, lesson_id } = req.body;
  if (!Array.isArray(questions) || !lesson_id) {
    return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
  }

  try {
    const promises = questions.map(async (q) => {
      // Nếu có id_question: cập nhật câu hỏi, nếu không: thêm mới
      let questionId = q.id_question;

      if (questionId) {
        await new Promise((resolve, reject) => {
          db.query(
            'UPDATE questions SET content = ?, type = ?, url = ? WHERE id_question = ?',
            [q.content, q.type, q.url, questionId],
            (err) => (err ? reject(err) : resolve())
          );
        });

        // Xóa toàn bộ đáp án cũ để ghi lại mới
        await new Promise((resolve, reject) => {
          db.query(
            'DELETE FROM answers WHERE question_id = ?',
            [questionId],
            (err) => (err ? reject(err) : resolve())
          );
        });
      } else {
        questionId = await new Promise((resolve, reject) => {
          db.query(
            'INSERT INTO questions (content, type, url, lesson_id) VALUES (?, ?, ?, ?)',
            [q.content, q.type, q.url, lesson_id],
            (err, result) => (err ? reject(err) : resolve(result.insertId))
          );
        });
      }

      // Lưu danh sách đáp án mới
      if (Array.isArray(q.answers)) {
        const insertAnswerPromises = q.answers.map((a) => {
          return new Promise((resolve, reject) => {
            db.query(
              'INSERT INTO answers (content, is_correct, question_id) VALUES (?, ?, ?)',
              [a.content, a.is_correct || 0, questionId],
              (err) => (err ? reject(err) : resolve())
            );
          });
        });

        await Promise.all(insertAnswerPromises);
      }
    });

    await Promise.all(promises);
    res.json({ message: 'Lưu câu hỏi và đáp án thành công!' });

  } catch (err) {
    console.error('❌ Lỗi bulk insert/update:', err);
    res.status(500).json({ message: 'Lỗi khi lưu dữ liệu câu hỏi/đáp án' });
  }
});

// GET answers theo lessonId
app.get('/api/answers/by-lesson/:lessonId', (req, res) => {
  const { lessonId } = req.params;
  db.query(
    'SELECT * FROM answers WHERE question_id IN (SELECT id_question FROM questions WHERE lesson_id = ?)',
    [lessonId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Lỗi truy vấn answers' });
      res.json(results);
    }
  );
});
// Xóa câu hỏi + đáp án liên quan
app.delete('/api/questions/:id', async (req, res) => {
  const questionId = req.params.id;

  try {
    await db.promise().query('DELETE FROM answers WHERE question_id = ?', [questionId]);
    await db.promise().query('DELETE FROM questions WHERE id_question = ?', [questionId]);

    res.json({ message: 'Xóa câu hỏi và đáp án thành công!' });
  } catch (error) {
    console.error('Lỗi khi xóa câu hỏi:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi xóa câu hỏi.' });
  }
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



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

app.use("/api", contactRoutes);
app.use(cors());
app.use(bodyParser.json()); // Giúp Express xử lý dữ liệu JSON từ request body

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


//user detail
app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  // Query database để lấy người dùng với userId
  // Trả về thông tin người dùng
  db.query('SELECT * FROM users WHERE id_user = ?', [userId], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Server error' });
    } else if (result.length === 0) {
      res.status(404).json({ message: 'Không tìm thấy người dùng' });
    } else {
      res.json(result[0]); // Trả về người dùng
    }
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


// API PUT cập nhật thông tin người dùng (bao gồm avatar) edit-user
app.put('/api/users/:userId', upload.single('avatar'), (req, res) => {

  const userId = parseInt(req.params.userId);
  const { fullname, username, email, phone, isActive, oldAvatar } = req.body;
  const avatar = req.file ? `/uploads/images/${req.file.filename.replace(/\s+/g,"")}` : null;
  const filePath = path.join(__dirname, oldAvatar);

  console.log(filePath)
  // Delete the file
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      // Handle the error appropriately (e.g., return a response with error status)
      return;
    }
    console.log('File deleted successfully');
    // Proceed with further actions (e.g., sending a success response to the client)
  });
  // Cập nhật thông tin người dùng trong cơ sở dữ liệu
  let query = `UPDATE users SET fullname = ?, username = ?, email = ?, phone = ?, is_active = ?`;
  const queryParams = [fullname, username, email, phone, isActive === 'Hoạt động' ? 1 : 0];

  // Nếu có ảnh đại diện, thêm vào câu lệnh SQL
  if (avatar) {
    query += ', avatar = ?';
    queryParams.push(avatar);
  }

  query += ' WHERE id_user = ?';
  queryParams.push(userId);

  // Thực hiện truy vấn SQL
   db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error(err); // Log chi tiết lỗi nếu có
      return res.status(500).send('Internal Server Error');
    }

    // Kiểm tra xem có người dùng nào bị ảnh hưởng không
    if (results.affectedRows === 0) {
      return res.status(404).send('User not found');
    }

    // Trả về phản hồi thành công
    res.status(200).json({ message: 'User updated successfully', user: { id_user: userId, fullname, username, email, phone, avatar, isActive } });
  });
});

app.post('/api/users/update-role', (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: 'Thiếu user_id' });
  }

  // Lấy role hiện tại của user
  const getCurrentRoleQuery = `
    SELECT r.name FROM user_role ur
    JOIN role r ON ur.role_id = r.id
    WHERE ur.user_id = ?
  `;

  db.query(getCurrentRoleQuery, [user_id], (err, results) => {
    if (err) {
      console.error('Lỗi lấy role:', err);
      return res.status(500).json({ message: 'Lỗi lấy role' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User chưa có role' });
    }

    const currentRole = results[0].name;
    const newRole = currentRole === 'student' ? 'teacher' : 'student';

    // Lấy role_id mới
    const getRoleIdQuery = 'SELECT id FROM role WHERE name = ?';

    db.query(getRoleIdQuery, [newRole], (err, roleResults) => {
      if (err) {
        console.error('Lỗi lấy role_id:', err);
        return res.status(500).json({ message: 'Lỗi lấy role' });
      }

      if (roleResults.length === 0) {
        return res.status(404).json({ message: 'Vai trò mới không tồn tại' });
      }

      const newRoleId = roleResults[0].id;

      // Cập nhật role mới
      const updateRoleQuery = 'UPDATE user_role SET role_id = ? WHERE user_id = ?';

      db.query(updateRoleQuery, [newRoleId, user_id], (err, result) => {
        if (err) {
          console.error('Lỗi cập nhật role:', err);
          return res.status(500).json({ message: 'Lỗi cập nhật role' });
        }
        res.status(200).json({ message: `Chuyển đổi role thành ${newRole} thành công!`, newRole });
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

  console.log('Đường dẫn ảnh cũ:', oldImagePath);
  console.log('Tồn tại ảnh cũ:', fs.existsSync(oldImagePath));

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
  console.log("query lessons")
  db.query('SELECT ls.*, c.title as course_title, t.fullname '+
    'FROM lesson ls join courses c on ls.course_id = c.id_course join users t on c.teacher_id = t.id_user', (err, results) => {
    if (err) {
      console.error('Lỗi khi truy vấn dữ liệu:', err);
      return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu' });
    }
    res.json(results);
  });
});

// API GET để lấy dữ liệu các bài học (mã hiện tại của bạn)
// app.get('/api/lessons', (req, res) => {
//   console.log("query lessons");
  
//   const sql = `
//     SELECT ls.*, c.title AS course_title
//     FROM lesson ls 
//     JOIN courses c ON ls.course_id = c.id_course
//   `;

//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Lỗi khi truy vấn dữ liệu:', err);
//       return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu' });
//     }
//     res.json(results);
//   });
// });


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
//edit-lesson
app.put('/api/lessons/:lessonId', upload.single('image'), async (req, res) => {
  const lessonId = parseInt(req.params.lessonId);
  const { title, description, duration, course_id, oldImage } = req.body;
  const image = req.file ? `/uploads/images/${req.file.filename.replace(/\s+/g, "")}` : null;
  const filePath = path.join(__dirname, oldImage);

  try {
        if (oldImage) {
          fs.access(filePath, fs.constants.F_OK, (err) => {
              if (!err) {
                  fs.unlink(filePath, (unlinkErr) => {
                      if (unlinkErr) console.error('Lỗi khi xóa ảnh:', unlinkErr);
                      else console.log('Ảnh cũ đã được xóa');
                  });
              }
          });
      }
      
      // Kiểm tra course_id hợp lệ & lấy title từ bảng courses
      const courseQuery = `SELECT title FROM courses WHERE id_course = ?`;
      db.query(courseQuery, [course_id], (courseErr, courseResults) => {
          if (courseErr || courseResults.length === 0) {
              return res.status(400).json({ error: "Course không hợp lệ" });
          }

          const courseTitle = courseResults[0].title; // Lấy title của khóa học

          // Cập nhật thông tin bài học
          let query = `UPDATE lesson SET title = ?, description = ?, duration = ?, course_id = ?, course_title = ?`;
          const queryParams = [title, description, duration, course_id, courseTitle];

          if (image) {
              query += ', image = ?';
              queryParams.push(image);
          }

          query += ' WHERE id_lesson = ?';
          queryParams.push(lessonId);

          db.query(query, queryParams, (err, results) => {
              if (err) {
                  console.error(err);
                  return res.status(500).send('Internal Server Error');
              }

              if (results.affectedRows === 0) {
                  return res.status(404).send('Lesson not found');
              }

              res.status(200).json({
                  message: 'Lesson updated successfully',
                  lesson: { id_lesson: lessonId, title, description, duration, image, course_id, course_title: courseTitle }
              });
          });
      });
  } catch (error) {
      console.error('Lỗi cập nhật bài học:', error);
      res.status(500).json({ error: 'Lỗi máy chủ' });
  }
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
// app.get('/api/users', async (req, res) => {
//   try {
//     const sql = `
//       SELECT u.id_user, u.fullname, u.username, u.email, u.phone, u.avatar, u.is_active, 
//              COALESCE(GROUP_CONCAT(r.name SEPARATOR ', '), 'Chưa có vai trò') AS roles
//       FROM users u
//       LEFT JOIN user_role ur ON u.id_user = ur.id_user
//       LEFT JOIN role r ON ur.id_role = r.id_role
//       GROUP BY u.id_user;
//     `;

//     const users = await db.execute(sql); // 🔥 Sửa lỗi ở đây

//     console.log("Dữ liệu từ DB:", users); // Debug để kiểm tra dữ liệu trả về

//     res.json(users[0]); // 🔥 Lấy `users[0]` vì `db.execute()` trả về [rows, fields]
//   } catch (error) {
//     console.error("Lỗi khi lấy danh sách người dùng:", error);
//     res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng", error: error.message });
//   }
// });


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

// Khởi động server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

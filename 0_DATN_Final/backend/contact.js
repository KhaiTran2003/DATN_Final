const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

// ✅ Thêm Middleware để xử lý CORS
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// ✅ Route để xử lý form liên hệ
router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "bbuon700@gmail.com",
      pass: "123456T@", // Thay bằng App Password
    },
  });

  const mailOptions = {
    from: email,
    to: "trankhai6323@gmail.com",
    subject: `Liên hệ từ ${name}`,
    text: `Người gửi: ${name} (${email})\n\nNội dung:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email gửi thành công!" });
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    res.status(500).json({ message: "Lỗi khi gửi email" });
  }
});

module.exports = router;

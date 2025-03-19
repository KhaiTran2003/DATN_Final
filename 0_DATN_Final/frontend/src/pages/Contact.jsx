import React, { useState } from "react";
import axios from "axios";
import '../css/css_pages/Contact.css'
function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Đang gửi...");

    try {
      await axios.post("http://localhost:5000/api/contact", formData);
      setStatus("Gửi thành công! Admin sẽ phản hồi sớm.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus("Lỗi! Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="contact-container-contact">
      <h2 className="title-contact">Liên Hệ</h2>
      <form onSubmit={handleSubmit} className="form-contact">
        <div className="input-group-contact">
          <label className="label-contact">Họ và tên</label>
          <input
            type="text"
            name="name"
            className="input-contact"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group-contact">
          <label className="label-contact">Email</label>
          <input
            type="email"
            name="email"
            className="input-contact"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group-contact">
          <label className="label-contact">Nội dung</label>
          <textarea
            name="message"
            className="textarea-contact"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="submit-btn-contact">Gửi</button>
      </form>
      {status && <p className="status-message-contact">{status}</p>}
    </div>
  );
}

export default Contact;

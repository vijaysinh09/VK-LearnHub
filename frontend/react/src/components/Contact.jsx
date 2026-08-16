import { useState } from "react";
import Navbar from "./Navbar";
import "./Page.css";
import "./Contact.css";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <div className="page-container">
          <h1 className="page-title">Contact Us</h1>
          <div className="page-divider" />

          <div className="page-content">
            <p>
              We are happy to hear from you. Whether you have a question about a
              course, need help with your account, or simply want to share your
              feedback, feel free to reach out using the form below. Our team
              will get back to you within 1–2 business days.
            </p>
          </div>

          <div className="contact-details">
            <div className="contact-detail-item">
              <span className="contact-detail-icon">📧</span>
              <div>
                <div className="contact-detail-label">Email</div>
                <div className="contact-detail-value">
                  kamblevijaysinh09@gmail.com
                </div>
              </div>
            </div>
            <div className="contact-detail-item">
              <span className="contact-detail-icon">📞</span>
              <div>
                <div className="contact-detail-label">Phone</div>
                <div className="contact-detail-value">+91 9168179240</div>
              </div>
            </div>
            <div className="contact-detail-item">
              <span className="contact-detail-icon">🕐</span>
              <div>
                <div className="contact-detail-label">Support Hours</div>
                <div className="contact-detail-value">
                  Monday – Friday, 9 AM – 6 PM IST
                </div>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            {submitted && (
              <div className="contact-success">
                ✅ Your message has been sent. We will get back to you shortly.
              </div>
            )}

            <div className="contact-row">
              <div className="contact-field">
                <label className="contact-label" htmlFor="c-name">
                  Full Name
                </label>
                <input
                  id="c-name"
                  className="contact-input"
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={set("name")}
                  required
                />
              </div>
              <div className="contact-field">
                <label className="contact-label" htmlFor="c-email">
                  Email Address
                </label>
                <input
                  id="c-email"
                  className="contact-input"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set("email")}
                  required
                />
              </div>
            </div>

            <div className="contact-field">
              <label className="contact-label" htmlFor="c-subject">
                Subject
              </label>
              <input
                id="c-subject"
                className="contact-input"
                type="text"
                placeholder="What is this about?"
                value={form.subject}
                onChange={set("subject")}
                required
              />
            </div>

            <div className="contact-field">
              <label className="contact-label" htmlFor="c-message">
                Message
              </label>
              <textarea
                id="c-message"
                className="contact-input contact-textarea"
                placeholder="Write your message here…"
                rows={5}
                value={form.message}
                onChange={set("message")}
                required
              />
            </div>

            <button type="submit" className="contact-submit">
              Send Message
            </button>
          </form>
        </div>
      </main>
      <footer className="page-footer">
        <p>© 2026 VK LearnHub. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Contact;

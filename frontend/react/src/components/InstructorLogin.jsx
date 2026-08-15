import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../auth.css";

function InstructorLogin() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });

    let newErrors = { ...errors };
    if (name === "email") {
      if (!value) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(value)) newErrors.email = "Invalid email address";
      else delete newErrors.email;
    }
    if (name === "password") {
      if (!value) newErrors.password = "Password is required";
      else delete newErrors.password;
    }
    setErrors(newErrors);
  };

  const validate = () => {
    let newErrors = {};
    if (!user.email) newErrors.email = "Email is required";
    if (!user.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await axios.post("https://vk-learnhub-1.onrender.com/login", user);
      if (res.data.user.role !== "instructor") {
        alert("Access denied. This portal is for instructor only.");
        return;
      }
      sessionStorage.setItem("users", JSON.stringify(res.data.user));
      navigate("/instructor-dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">🛡️</div>
          <span className="auth-brand-name">Instructor Portal</span>
        </div>

        <h2 className="auth-title">Instructor Login</h2>
        <p className="auth-subtitle">Restricted access — authorized personnel only.</p>

        <form onSubmit={submitHandler} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Instructor Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={changeHandler}
              placeholder="don@example.com"
              className="auth-input"
            />
            {errors.email && <span className="auth-error">⚠ {errors.email}</span>}
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={changeHandler}
              placeholder="Instructor password"
              className="auth-input"
            />
            {errors.password && <span className="auth-error">⚠ {errors.password}</span>}
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Verifying…" : "🔐 Instructor Sign In"}
          </button>
        </form>

        <p className="auth-footer">
          Not an instructor? <Link to="/login">Student Login →</Link>
        </p>
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <p className="auth-footer">
          <Link to="/">← Back to Home</Link>
        </p>
        </div>
      </div>
    </div>
  );
}

export default InstructorLogin;


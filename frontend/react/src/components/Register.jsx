import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../auth.css";

function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });

    let newErrors = { ...errors };
    if (name === "name") {
      if (!value.trim()) newErrors.name = "Full name is required";
      else delete newErrors.name;
    }
    if (name === "email") {
      if (!value) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(value)) newErrors.email = "Invalid email address";
      else delete newErrors.email;
    }
    if (name === "password") {
      if (!value) newErrors.password = "Password is required";
      else if (value.length < 6) newErrors.password = "Password must be at least 6 characters";
      else delete newErrors.password;
    }
    if (name === "confirmPassword") {
      if (value !== user.password) newErrors.confirmPassword = "Passwords do not match";
      else delete newErrors.confirmPassword;
    }
    setErrors(newErrors);
  };

  const validate = () => {
    let newErrors = {};
    if (!user.name.trim()) newErrors.name = "Full name is required";
    if (!user.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(user.email)) newErrors.email = "Invalid email address";
    if (!user.password) newErrors.password = "Password is required";
    else if (user.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (user.confirmPassword !== user.password) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { name, email, password } = user;
      const res = await axios.post("http://localhost:5000/register", { name, email, password });
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">🎓</div>
          <span className="auth-brand-name">VK LearnHub</span>
        </div>

        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">Join thousands of students and start learning today.</p>

        <form onSubmit={submitHandler} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={changeHandler}
              placeholder="Your full name"
              className="auth-input"
              autoComplete="name"
            />
            {errors.name && <span className="auth-error">⚠ {errors.name}</span>}
          </div>

          <div className="auth-field">
            <label className="auth-label">Email address</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={changeHandler}
              placeholder="you@example.com"
              className="auth-input"
              autoComplete="email"
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
              placeholder="At least 6 characters"
              className="auth-input"
              autoComplete="new-password"
            />
            {errors.password && <span className="auth-error">⚠ {errors.password}</span>}
          </div>

          <div className="auth-field">
            <label className="auth-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={changeHandler}
              placeholder="Repeat your password"
              className="auth-input"
            />
            {errors.confirmPassword && <span className="auth-error">⚠ {errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
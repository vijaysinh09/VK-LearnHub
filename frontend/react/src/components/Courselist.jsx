import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Courselist.css";
import "../index.css";

const EMOJIS = ["📘", "📗", "📕", "📙", "🧪", "🎨", "🧠", "💻", "📐", "🔬"];

function Courselist() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const loguser = JSON.parse(sessionStorage.getItem("users"));

  const loadCourses = async () => {
    try {
      const res = await axios.get("https://vk-learnhub-1.onrender.com/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    if (!loguser) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    try {
      const res = await axios.post(
        "https://vk-learnhub-1.onrender.com/enrollments",
        {
          student_id: loguser.id,
          course_id: courseId,
        },
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Enrollment failed");
    }
  };

  const handleBack = () => {
    if (loguser?.role === "instructor") navigate("/instructor-dashboard");
    else navigate("/student-dashboard");
  };

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="cl-page">
      <div className="cl-header">
        <h1 className="cl-title">📚 All Courses</h1>
      </div>

      <div className="cl-search-wrapper">
        <input
          className="cl-search"
          placeholder="🔍 Search courses…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-outline" onClick={handleBack}>
          ← Back
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="cl-empty">
          <div className="cl-empty-icon">🔍</div>
          No courses found.
        </div>
      ) : (
        <div className="cl-grid">
          {filtered.map((c, i) => (
            <div key={c.id} className="cl-card">
              <div className="cl-card-emoji">{EMOJIS[i % EMOJIS.length]}</div>
              <div className="cl-card-title">{c.title}</div>

              <div className="cl-card-meta">
                <span>⏱ {c.duration}</span>
              </div>
              <div className="cl-card-price">₹{c.price}</div>
              <div className="cl-card-actions">
                <Link
                  to={`/coursedetails/${c.id}`}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, textAlign: "center" }}
                >
                  Course Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Courselist;

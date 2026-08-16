import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./Coursedetails.css";

function Coursedetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://vk-learnhub-1.onrender.com/coursedetails/${id}`)
      .then((r) => {
        setCourse(r.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleEnroll = async () => {
    const loguser = JSON.parse(sessionStorage.getItem("users"));
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
          course_id: id,
        },
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Enrollment failed");
    }
  };

  if (loading)
    return (
      <div className="cd-page">
        <div
          className="cd-card"
          style={{ textAlign: "center", color: "#9ca3af" }}
        >
          Loading course details…
        </div>
      </div>
    );

  return (
    <div className="cd-page">
      <div className="cd-card">
        <div className="cd-back">
          <Link
            to="/student-dashboard"
            state={{ tab: "courses" }}
            className="btn btn-outline btn-sm"
          >
            ← Back to Courses
          </Link>
        </div>

        <div className="cd-emoji">📘</div>
        <h1 className="cd-title">{course.CourseName || "Course Details"}</h1>
        <p className="cd-subtitle">
          {course.Information || "Detailed course information."}
        </p>

        <div className="cd-info-grid">
          <div className="cd-info-item">
            <div className="cd-info-label">Duration</div>
            <div className="cd-info-value">⏱ {course.Period || "N/A"}</div>
          </div>
          <div className="cd-info-item">
            <div className="cd-info-label">Instructor</div>
            <div className="cd-info-value">👨‍🏫 {course.Instructor || "TBA"}</div>
          </div>
          <div className="cd-info-item" style={{ gridColumn: "1/-1" }}>
            <div className="cd-info-label">Course Fee</div>
            <div className="cd-price">₹{course.Amount || "N/A"}</div>
          </div>
        </div>

        <div className="cd-note">
          📌 <strong>Note:</strong> If any details are missing, please check
          back later or contact support.
        </div>

        <div
          className="cd-actions"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <button
            className="btn btn-primary btn-lg"
            onClick={handleEnroll}
            style={{ paddingLeft: "40px", paddingRight: "40px" }}
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Coursedetails;

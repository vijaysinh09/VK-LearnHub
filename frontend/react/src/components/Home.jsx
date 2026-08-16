import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-root">
      <Navbar />

      {/* ── Hero ── */}
      <section className="home-hero">
        <div className="home-hero-inner">
          <p className="home-hero-label">Welcome to VK LearnHub</p>
          <h1 className="home-hero-title">
            Learn New Skills.
            <br />
            Grow Your Career.
          </h1>
          <p className="home-hero-sub">
            VK LearnHub is an online learning platform that connects students
            with quality courses taught by experienced instructors. Whether you
            are a beginner or looking to advance your skills, we have a course
            for you.
          </p>
          <button className="home-btn" onClick={() => navigate("/register")}>
            Create Your Account
          </button>
        </div>
      </section>

      {/* ── Quick stats ── */}
      <section className="home-stats">
        <div className="home-stats-inner">
          {[
            { value: "10,000+", label: "Students Enrolled" },
            { value: "200+", label: "Courses Available" },
            { value: "150+", label: "Expert Instructors" },
            { value: "98%", label: "Satisfaction Rate" },
          ].map((s) => (
            <div key={s.label} className="home-stat">
              <div className="home-stat-value">{s.value}</div>
              <div className="home-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer">
        <p>© 2026 VK LearnHub. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;

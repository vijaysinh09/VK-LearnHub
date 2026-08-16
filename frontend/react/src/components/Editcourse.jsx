import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./form.css";

function Editcourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
  });

  useEffect(() => {
    axios
      .get(`https://vk-learnhub-1.onrender.com/courses/${id}`)
      .then((r) => setCourse(r.data))
      .catch(console.error);
  }, [id]);

  const changeHandler = (e) =>
    setCourse({ ...course, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://vk-learnhub-1.onrender.com/courses/${id}`,
        course,
      );
      alert("Course updated successfully");
      navigate("/instructor-dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h1 className="form-title">✏️ Edit Course</h1>
        <p className="form-subtitle">Update the course details below.</p>

        <form onSubmit={submitHandler}>
          <div className="form-field">
            <label className="form-label">Course Title</label>
            <input
              className="form-input"
              name="title"
              value={course.title}
              onChange={changeHandler}
              placeholder="Course title"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              name="description"
              value={course.description}
              onChange={changeHandler}
              placeholder="Course description"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Duration</label>
            <input
              className="form-input"
              name="duration"
              value={course.duration}
              onChange={changeHandler}
              placeholder="e.g. 8 weeks"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Price (₹)</label>
            <input
              className="form-input"
              type="number"
              name="price"
              value={course.price}
              onChange={changeHandler}
              min="0"
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ flex: 1 }}
            >
              Save Changes
            </button>
            <Link
              to="/instructor-dashboard"
              className="btn btn-outline btn-lg"
              style={{ flex: 1, textAlign: "center" }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Editcourse;

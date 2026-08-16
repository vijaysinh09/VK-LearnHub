import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./form.css";
import "../index.css";

function Addcourse() {
  const navigate = useNavigate();
  const loguser = JSON.parse(sessionStorage.getItem("users"));

  const [course, setCourse] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
  });
  const [errors, setErrors] = useState({});

  const changeHandler = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let err = {};
    if (!course.title.trim()) err.title = "Title is required";
    if (!course.description.trim()) err.description = "Description is required";
    if (!course.duration) err.duration = "Duration is required";
    if (!course.price) err.price = "Price is required";
    else if (Number(course.price) < 0) err.price = "Price must be 0 or greater";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await axios.post(
        "https://vk-learnhub-1.onrender.com/courses",
        {
          ...course,
          instructor_id: loguser?.id,
        },
      );
      alert(res.data.message);
      navigate("/instructor-dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add course");
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h1 className="form-title">➕ Add New Course</h1>
        <p className="form-subtitle">
          Fill in the details to publish a new course.
        </p>

        <form onSubmit={submitHandler}>
          <div className="form-field">
            <label className="form-label">Course Title</label>
            <input
              className="form-input"
              name="title"
              value={course.title}
              onChange={changeHandler}
              placeholder="e.g. Web Development Fundamentals"
            />
            {errors.title && <p className="form-error">⚠ {errors.title}</p>}
          </div>

          <div className="form-field">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              name="description"
              value={course.description}
              onChange={changeHandler}
              placeholder="Brief description of the course"
            />
            {errors.description && (
              <p className="form-error">⚠ {errors.description}</p>
            )}
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
            {errors.duration && (
              <p className="form-error">⚠ {errors.duration}</p>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">Price (₹)</label>
            <input
              className="form-input"
              type="number"
              name="price"
              value={course.price}
              onChange={changeHandler}
              placeholder="e.g. 4999"
              min="0"
            />
            {errors.price && <p className="form-error">⚠ {errors.price}</p>}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ flex: 1 }}
            >
              Add Course
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

export default Addcourse;

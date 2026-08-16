import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./CourseLearning.css";

function CourseLearning() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const course = location.state?.course || {
    title: "Loading Course...",
    courseId: id,
  };
  const loguser = JSON.parse(sessionStorage.getItem("users"));

  // Check if already completed to prevent duplicate submissions
  const isAlreadyCompleted = course.status === "completed";

  const [progress, setProgress] = useState(isAlreadyCompleted ? 100 : 0);
  const [answeredQuestions, setAnsweredQuestions] = useState(
    isAlreadyCompleted ? [0, 1, 2, 3, 4] : [],
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(false);

  const getCourseContent = (title) => {
    const lowerTitle = title.toLowerCase();

    if (lowerTitle.includes("mysql") || lowerTitle.includes("sql")) {
      return {
        notes: `Welcome to the complete notes for ${title}.

1. Introduction to MySQL
MySQL is a widely used relational database management system (RDBMS). It uses SQL (Structured Query Language) to manage and manipulate data. 
Databases are essential for storing user information, course details, and enrollments in modern applications.

2. Basic Syntax & Commands
Here are some essential SQL commands you must know:
- SELECT: Extracts data from a database.
  Example: SELECT * FROM users;
- INSERT INTO: Inserts new data into a database.
  Example: INSERT INTO courses (title, price) VALUES ('MySQL Basics', 500);
- UPDATE: Updates data in a database.
  Example: UPDATE users SET role = 'admin' WHERE id = 1;
- DELETE: Deletes data from a database.

3. Primary Keys & Foreign Keys
A Primary Key uniquely identifies each record in a table. A Foreign Key is a field in one table that uniquely identifies a row of another table. This creates a relationship between tables, like linking an 'enrollment' to a 'user' and a 'course'.

4. Joins
Joins are used to combine rows from two or more tables based on a related column between them.
Example: 
SELECT users.name, courses.title 
FROM enrollments 
JOIN users ON enrollments.student_id = users.id 
JOIN courses ON enrollments.course_id = courses.id;

5. Summary
Practice writing SQL queries daily. A strong command over database relationships and queries is the backbone of backend development.`,
        questions: [
          {
            question: "What does SQL stand for?",
            options: [
              "Structured Query Language",
              "Strong Question Language",
              "Structured Quick Logic",
              "System Query Language",
            ],
            answer: "Structured Query Language",
          },
          {
            question: "Which command is used to extract data from a database?",
            options: ["EXTRACT", "GET", "SELECT", "PULL"],
            answer: "SELECT",
          },
          {
            question: "What uniquely identifies each record in a table?",
            options: ["Unique Key", "Primary Key", "Foreign Key", "Master Key"],
            answer: "Primary Key",
          },
          {
            question:
              "Which feature is used to combine rows from two or more tables?",
            options: ["MERGE", "COMBINE", "JOIN", "CONNECT"],
            answer: "JOIN",
          },
          {
            question: "Which command updates existing data in a database?",
            options: ["MODIFY", "CHANGE", "ALTER", "UPDATE"],
            answer: "UPDATE",
          },
        ],
      };
    } else if (lowerTitle.includes("react")) {
      return {
        notes: `Welcome to the complete notes for ${title}.

1. Introduction to React
React is a free and open-source front-end JavaScript library for building user interfaces based on UI components. It is maintained by Meta (Facebook).

2. Components & JSX
React applications are built using components. A component is a JavaScript function that returns JSX (JavaScript XML). JSX allows us to write HTML directly inside JavaScript.
Example:
function Welcome() {
  return <h1>Hello, World!</h1>;
}

3. Props (Properties)
Props are used to pass data from a parent component to a child component. They are read-only and cannot be modified by the child.
Example:
function Greet(props) {
  return <h2>Hi, {props.name}</h2>;
}

4. State and useState Hook
State represents data that can change over time in a component. In functional components, we use the useState hook.
Example:
const [count, setCount] = useState(0);
// You can update count by calling setCount(count + 1)

5. useEffect Hook
The useEffect hook allows you to perform side effects in your components, such as fetching data from an API when the component loads.
Example:
useEffect(() => {
  fetchData();
}, []); // Empty array means it runs only once when loaded.`,
        questions: [
          {
            question: "What is React primarily used for?",
            options: [
              "Database management",
              "Building user interfaces",
              "Server-side routing",
              "Operating Systems",
            ],
            answer: "Building user interfaces",
          },
          {
            question: "What syntax allows us to write HTML inside JavaScript?",
            options: ["XML", "JSON", "JSX", "HTMLX"],
            answer: "JSX",
          },
          {
            question:
              "How do you pass data from a parent component to a child component?",
            options: [
              "Using State",
              "Using Props",
              "Using Context",
              "Using Redux",
            ],
            answer: "Using Props",
          },
          {
            question:
              "Which Hook is used to manage changing data in a component?",
            options: ["useData", "useFetch", "useState", "useEffect"],
            answer: "useState",
          },
          {
            question:
              "Which Hook is commonly used for fetching API data when a component loads?",
            options: ["useState", "useEffect", "useAPI", "useContext"],
            answer: "useEffect",
          },
        ],
      };
    } else if (lowerTitle.includes("node") || lowerTitle.includes("express")) {
      return {
        notes: `Welcome to the complete notes for ${title}.

1. Introduction to Node.js
Node.js is an open-source, cross-platform JavaScript runtime environment that executes JavaScript code outside a web browser. It is built on Chrome's V8 JavaScript engine.

2. Express.js Framework
Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It makes creating APIs very easy.

3. Creating a Basic Server
You can set up a basic server in Express with just a few lines of code:
const express = require('express');
const app = express();

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

4. Creating API Routes (GET & POST)
Routes determine how an application responds to a client request.
Example GET:
app.get('/api/users', (req, res) => {
  res.json({ message: "List of users" });
});

Example POST:
app.post('/api/users', (req, res) => {
  const newUser = req.body;
  // logic to save user...
  res.json({ message: "User created" });
});

5. Middleware
Middleware functions are functions that have access to the request object (req) and the response object (res). For example, 'express.json()' is a built-in middleware used to parse JSON bodies.`,
        questions: [
          {
            question: "What engine is Node.js built upon?",
            options: [
              "Firefox SpiderMonkey",
              "Safari WebKit",
              "Chrome V8",
              "Edge Chakra",
            ],
            answer: "Chrome V8",
          },
          {
            question: "What is Express.js?",
            options: [
              "A database",
              "A frontend framework",
              "A Node.js web application framework",
              "A programming language",
            ],
            answer: "A Node.js web application framework",
          },
          {
            question:
              "Which method is used to start an Express server and listen for connections?",
            options: ["app.start()", "app.run()", "app.listen()", "app.init()"],
            answer: "app.listen()",
          },
          {
            question: "How do you handle a POST request in Express?",
            options: ["app.get()", "app.post()", "app.put()", "app.send()"],
            answer: "app.post()",
          },
          {
            question: "What is 'express.json()' an example of?",
            options: ["Database", "Route", "Middleware", "Frontend Component"],
            answer: "Middleware",
          },
        ],
      };
    } else {
      // Default Fallback Course Content
      return {
        notes: `Welcome to the complete notes for ${title}. 
    
1. Introduction & Basics
Understanding the fundamentals is key to mastering this subject. We focus on building a strong foundation. You will learn the core concepts that power modern applications.
    
2. Core Concepts
We will dive deep into the architecture and underlying principles. Knowing how things work under the hood makes you a better professional.
    
3. Best Practices
Writing clean and maintainable work is crucial. Industry best practices ensure that your outputs are scalable and less prone to errors.
    
4. Real-world Application
Theory is not enough. Applying what you have learned to real-world scenarios bridges the gap between basic knowledge and actual implementation. 
    
5. Summary
Keep building projects and never stop learning. Consistent practice is the only way to retain what you've learned and stay updated with new trends.`,
        questions: [
          {
            question:
              "What is key to mastering this subject according to the notes?",
            options: [
              "Memorizing syntax",
              "Understanding fundamentals",
              "Skipping the basics",
              "Using shortcuts",
            ],
            answer: "Understanding fundamentals",
          },
          {
            question:
              "Why is knowing how things work 'under the hood' important?",
            options: [
              "It makes you a better professional",
              "It slows you down",
              "It is required for exams",
              "It looks good on a resume",
            ],
            answer: "It makes you a better professional",
          },
          {
            question:
              "What is the benefit of following industry best practices?",
            options: [
              "Work becomes unreadable",
              "Outputs are scalable and error-free",
              "It increases bugs",
              "It wastes time",
            ],
            answer: "Outputs are scalable and error-free",
          },
          {
            question:
              "What bridges the gap between basic knowledge and actual implementation?",
            options: [
              "Reading more books",
              "Real-world application",
              "Taking breaks",
              "Watching tutorials endlessly",
            ],
            answer: "Real-world application",
          },
          {
            question: "What is the only way to retain what you've learned?",
            options: [
              "Consistent practice & building projects",
              "Stopping learning",
              "Memorizing text",
              "Copying others",
            ],
            answer: "Consistent practice & building projects",
          },
        ],
      };
    }
  };

  const courseData = getCourseContent(course.title);
  const courseNotes = courseData.notes;
  const questions = courseData.questions;

  useEffect(() => {
    if (!loguser) navigate("/login");
  }, [loguser, navigate]);

  const handleAnswer = (qIndex, selectedOption, correctOption) => {
    if (
      selectedOption === correctOption &&
      !answeredQuestions.includes(qIndex)
    ) {
      const newAnswered = [...answeredQuestions, qIndex];
      setAnsweredQuestions(newAnswered);

      const newProgress = (newAnswered.length / questions.length) * 100;
      setProgress(newProgress);

      if (newProgress === 100 && !isAlreadyCompleted) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000); // hide after 5 sec
      }
    } else if (selectedOption !== correctOption) {
      alert("Incorrect Answer! Please review the notes and try again.");
    }
  };

  const markCourseComplete = async () => {
    if (isAlreadyCompleted) {
      navigate("/student-dashboard", { state: { tab: "enrolled" } });
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        "https://vk-learnhub-1.onrender.com/enrollments/complete",
        {
          student_id: loguser.id,
          course_id: id,
          student_name: loguser.name,
          student_email: loguser.email,
          course_title: course.title,
        },
      );
      alert(
        "🎉 Congratulations! Course completed and certificate sent to your email!",
      );
      navigate("/student-dashboard", { state: { tab: "enrolled" } });
    } catch (err) {
      alert("Something went wrong");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="cl-container">
      <div className="cl-wrapper">
        {/* Header & Progress */}
        <div className="cl-header">
          <div className="cl-header-top">
            <h1 className="cl-title">{course.title} - Notes</h1>
            <button
              onClick={() => navigate("/student-dashboard")}
              className="cl-back-btn"
            >
              <span>←</span> Back to Dashboard
            </button>
          </div>

          <div className="cl-progress-info">
            <span>Quiz Progress</span>
            <span style={{ color: progress === 100 ? "#10b981" : "#A96FCB" }}>
              {progress}%
            </span>
          </div>
          <div className="cl-progress-track">
            <div
              className="cl-progress-fill"
              style={{
                width: `${progress}%`,
                backgroundColor: progress === 100 ? "#10b981" : "#A96FCB",
              }}
            ></div>
          </div>
        </div>

        {/* Confetti Message */}
        {showConfetti && (
          <div className="cl-confetti">
            🎊 Amazing Job! You have answered all questions. You can now get
            your certificate! 🎊
          </div>
        )}

        <div className="cl-content">
          {/* Full Course Notes Section */}
          <div className="cl-notes-section">
            <h2 className="cl-section-title">Course Materials</h2>
            <div className="cl-notes-text">{courseNotes}</div>
          </div>

          {/* Quiz Section */}
          <div className="cl-quiz-container">
            <h2 className="cl-section-title">Knowledge Check</h2>
            <p
              style={{
                color: "#64748b",
                marginBottom: "24px",
                marginTop: "-10px",
                fontSize: "15px",
              }}
            >
              Answer 5 questions correctly to unlock your certificate.
            </p>

            {questions.map((q, i) => {
              const isUnlocked =
                i === 0 ||
                answeredQuestions.includes(i - 1) ||
                isAlreadyCompleted;
              const isDone = answeredQuestions.includes(i);

              return (
                <div
                  key={i}
                  className={`cl-question-card ${!isUnlocked ? "locked" : ""} ${isDone ? "completed" : ""}`}
                >
                  <h3 className="cl-question-text">
                    Q{i + 1}. {q.question}
                  </h3>
                  <div className="cl-options">
                    {q.options.map((opt) => {
                      const isCorrectAnswer = isDone && opt === q.answer;
                      return (
                        <button
                          key={opt}
                          disabled={isDone}
                          onClick={() => handleAnswer(i, opt, q.answer)}
                          className={`cl-option-btn ${isCorrectAnswer ? "correct" : ""}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Final Submit Button */}
        <div className="cl-action-area">
          <button
            disabled={progress < 100 || loading}
            onClick={markCourseComplete}
            className={`cl-submit-btn ${progress === 100 ? (isAlreadyCompleted ? "already-done" : "active") : "disabled"}`}
          >
            {loading
              ? "Processing..."
              : isAlreadyCompleted
                ? "✓ Already Completed (Back to Dashboard)"
                : "🏆 Mark as Complete & Get Certificate"}
          </button>
          {progress < 100 && (
            <p className="cl-action-hint">
              Read the notes and answer all quiz questions to unlock your
              certificate.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseLearning;

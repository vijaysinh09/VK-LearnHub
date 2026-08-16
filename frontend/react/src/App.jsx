import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import AboutUs from "./components/AboutUs";
import Features from "./components/Features";
import Guide from "./components/Guide";
import Register from "./components/Register";
import Login from "./components/Login";
import InstructorLogin from "./components/InstructorLogin";
import Courselist from "./components/Courselist";
import Coursedetails from "./components/Coursedetails";
import Addcourse from "./components/Addcourse";
import Editcourse from "./components/Editcourse";
import StudentDashboard from "./components/studentdashboard";
import InstructorDashboard from "./components/InstructorDashboard";
import CourseLearning from "./components/CourseLearning";
import "./index.css";

const GuestRoute = ({ children }) => {
  const user = JSON.parse(sessionStorage.getItem("users"));
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(sessionStorage.getItem("users"));
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/features" element={<Features />} />
        <Route path="/guide" element={<Guide />} />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
        <Route
          path="/instructor-login"
          element={
            <GuestRoute>
              <InstructorLogin />
            </GuestRoute>
          }
        />
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courselist"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Courselist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coursedetails/:id"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Coursedetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course-learning/:id"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <CourseLearning />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor-dashboard"
          element={
            <ProtectedRoute allowedRoles={["instructor"]}>
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addcourse"
          element={
            <ProtectedRoute allowedRoles={["instructor"]}>
              <Addcourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editcourse/:id"
          element={
            <ProtectedRoute allowedRoles={["instructor"]}>
              <Editcourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studentdashboard"
          element={<Navigate to="/student-dashboard" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

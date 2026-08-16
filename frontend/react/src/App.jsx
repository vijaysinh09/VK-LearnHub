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

// --- Route Protection Components ---

// GuestRoute: Prevents logged-in users from accessing Login/Register pages
const GuestRoute = ({ children }) => {
  const user = JSON.parse(sessionStorage.getItem("users"));
  if (user) {
    // If user is already logged in, redirect them to Home (or dashboard)
    return <Navigate to="/" replace />;
  }
  return children;
};

// ProtectedRoute: Prevents logged-out users from accessing protected pages like Dashboards
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(sessionStorage.getItem("users"));
  if (!user) {
    // If not logged in, redirect to Home page
    return <Navigate to="/" replace />;
  }
  // Optional: Check role if allowedRoles is provided
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public / landing routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/features" element={<Features />} />
        <Route path="/guide" element={<Guide />} />
        
        {/* Guest routes (Only accessible if NOT logged in) */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/instructor-login" element={<GuestRoute><InstructorLogin /></GuestRoute>} />

        {/* Student routes (Protected) */}
        <Route path="/student-dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/courselist" element={<ProtectedRoute allowedRoles={['student']}><Courselist /></ProtectedRoute>} />
        <Route path="/coursedetails/:id" element={<ProtectedRoute allowedRoles={['student']}><Coursedetails /></ProtectedRoute>} />
        <Route path="/course-learning/:id" element={<ProtectedRoute allowedRoles={['student']}><CourseLearning /></ProtectedRoute>} />

        {/* Instructor routes (Protected) */}
        <Route path="/instructor-dashboard" element={<ProtectedRoute allowedRoles={['instructor']}><InstructorDashboard /></ProtectedRoute>} />
        <Route path="/addcourse" element={<ProtectedRoute allowedRoles={['instructor']}><Addcourse /></ProtectedRoute>} />
        <Route path="/editcourse/:id" element={<ProtectedRoute allowedRoles={['instructor']}><Editcourse /></ProtectedRoute>} />

        {/* Legacy redirect */}
        <Route
          path="/studentdashboard"
          element={<Navigate to="/student-dashboard" replace />}
        />
        
        {/* Fallback route - redirect to home if route not found */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

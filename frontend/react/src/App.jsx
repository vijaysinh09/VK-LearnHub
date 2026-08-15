import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import Features from './components/Features';
import Guide from './components/Guide';
import Register from './components/Register';
import Login from './components/Login';
import InstructorLogin from './components/InstructorLogin';
import Courselist from './components/Courselist';
import Coursedetails from './components/Coursedetails';
import Addcourse from './components/Addcourse';
import Editcourse from './components/Editcourse';
import StudentDashboard from './components/studentdashboard';
import InstructorDashboard from './components/InstructorDashboard';
import CourseLearning from './components/CourseLearning';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public / landing routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/features" element={<Features />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/instructor-login" element={<InstructorLogin />} />

        {/* Student routes */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/courselist" element={<Courselist />} />
        <Route path="/coursedetails/:id" element={<Coursedetails />} />
        <Route path="/course-learning/:id" element={<CourseLearning />} />

        {/* Instructor routes */}
        <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
        <Route path="/addcourse" element={<Addcourse />} />
        <Route path="/editcourse/:id" element={<Editcourse />} />

        {/* Legacy redirect */}
        <Route path="/studentdashboard" element={<Navigate to="/student-dashboard" replace />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;


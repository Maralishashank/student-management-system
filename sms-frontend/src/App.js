import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import Marks from "./pages/Marks";
import Announcements from "./pages/Announcements";
import MyMarks from "./pages/MyMarks";
import MyAttendance from "./pages/MyAttendance";
import Profile from "./pages/Profile";
import MyCourses from "./pages/MyCourses";
import Attendance from "./pages/Attendance";
import MarkAttendance from "./pages/MarkAttendance";




function App() {
  return (

    <Router>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />

        <Route path="/students" element={<Students />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/marks" element={<Marks />} />
        <Route path="/announcements" element={<Announcements />} />

        <Route path="/my-marks" element={<MyMarks />} />
        <Route path="/my-attendance" element={<MyAttendance />} />

        <Route path="/student/courses" element={<Courses />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/mark-attendance" element={<MarkAttendance />} />
        <Route path="/student/announcements" element={<Announcements />} />

      </Routes>

    </Router>

  );
}

export default App;
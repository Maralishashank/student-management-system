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
import ChangePassword from "./pages/ChangePassword";
import PrivateRoute from "./components/PrivateRoute";

// FIX: Every protected route is now wrapped in <PrivateRoute>.
//      Previously there were no route guards — unauthenticated users could
//      load any page by typing the URL directly.
//      PrivateRoute checks for a valid, unexpired JWT and the correct role.
//      Also added the missing /change-password route that Login.js navigates to.

function App() {
  return (
    <Router>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Admin routes */}
        <Route path="/admin" element={
          <PrivateRoute role="ADMIN"><AdminDashboard /></PrivateRoute>
        } />
        <Route path="/students" element={
          <PrivateRoute role="ADMIN"><Students /></PrivateRoute>
        } />
        <Route path="/courses" element={
          <PrivateRoute role="ADMIN"><Courses /></PrivateRoute>
        } />
        <Route path="/marks" element={
          <PrivateRoute role="ADMIN"><Marks /></PrivateRoute>
        } />
        <Route path="/announcements" element={
          <PrivateRoute role="ADMIN"><Announcements /></PrivateRoute>
        } />
        <Route path="/attendance" element={
          <PrivateRoute role="ADMIN"><Attendance /></PrivateRoute>
        } />
        <Route path="/mark-attendance" element={
          <PrivateRoute role="ADMIN"><MarkAttendance /></PrivateRoute>
        } />

        {/* Student routes */}
        <Route path="/student" element={
          <PrivateRoute role="STUDENT"><StudentDashboard /></PrivateRoute>
        } />
        <Route path="/my-marks" element={
          <PrivateRoute role="STUDENT"><MyMarks /></PrivateRoute>
        } />
        <Route path="/my-attendance" element={
          <PrivateRoute role="STUDENT"><MyAttendance /></PrivateRoute>
        } />
        <Route path="/student/courses" element={
          <PrivateRoute role="STUDENT"><Courses /></PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute role="STUDENT"><Profile /></PrivateRoute>
        } />
        <Route path="/my-courses" element={
          <PrivateRoute role="STUDENT"><MyCourses /></PrivateRoute>
        } />
        <Route path="/student/announcements" element={
          <PrivateRoute role="STUDENT"><Announcements /></PrivateRoute>
        } />

      </Routes>
    </Router>
  );
}

export default App;
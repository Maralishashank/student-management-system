import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import StudentSidebar from "../components/StudentSidebar";

function MyCourses() {

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCourses = async () => {
    try {
      // FIX: Previously only fetched /enroll/my which returns { id, studentId, courseId }.
      //      The table showed the raw courseId number which is useless to a student.
      //      Now we fetch both enrollments and the full courses list in parallel,
      //      then join them by courseId so we can display the course name, instructor etc.
      const [enrollRes, coursesRes] = await Promise.all([
        API.get("/enroll/my"),
        API.get("/courses")
      ]);

      const enrollments = enrollRes.data;
      const allCourses = coursesRes.data;

      // Build a lookup map: courseId → course object
      const courseMap = {};
      allCourses.forEach(c => { courseMap[c.id] = c; });

      // Join: for each enrollment attach the full course details
      const joined = enrollments.map(e => ({
        enrollmentId: e.id,
        ...courseMap[e.courseId]
      })).filter(c => c.id); // filter out any enrollments whose course was deleted

      setEnrolledCourses(joined);
    } catch (err) {
      console.error("Failed to load courses:", err);
      setEnrolledCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <StudentSidebar />
        <div className="container mt-4">

          <h2>My Courses</h2>

          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : enrolledCourses.length === 0 ? (
            <p className="text-muted">You are not enrolled in any courses yet.</p>
          ) : (
            <table className="table table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Course Name</th>
                  <th>Instructor</th>
                  <th>Credits</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {enrolledCourses.map(c => (
                  <tr key={c.enrollmentId}>
                    <td>{c.name}</td>
                    <td>{c.instructor}</td>
                    <td>{c.credits}</td>
                    <td>{c.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>
      </div>
    </div>
  );
}

export default MyCourses;